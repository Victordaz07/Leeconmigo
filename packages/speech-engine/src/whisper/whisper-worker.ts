/**
 * Web Worker que ejecuta Whisper con Transformers.js (ONNX Runtime Web).
 * Corre en un hilo aparte para no congelar la interfaz mientras el modelo infiere.
 *
 * Protocolo de mensajes (ver whisper-client.ts para el lado del hilo principal):
 *   -> { type: 'init', modelId, backend, dtype, wasmBase, threads, offlineOnly }
 *   <- { type: 'progress', ... }  varias veces mientras descarga/lee el modelo
 *   <- { type: 'ready', backend, loadMs, warmupMs, threads, crossOriginIsolated }
 *   -> { type: 'transcribe', id, audio: Float32Array(16 kHz), language }   (audio transferido, no copiado)
 *   <- { type: 'result', id, text, inferenceMs }
 *   <- { type: 'error', id?, message }
 *
 * PRIVACIDAD: el audio llega por postMessage, se usa para inferir y se descarta. Este worker no
 * hace ninguna petición de red salvo la descarga (y lectura de caché) de los archivos del MODELO.
 */
import { env, pipeline } from '@huggingface/transformers';

// Tipos de los mensajes compartidos con el cliente.
import type { WorkerRequest, WorkerResponse } from './whisper-protocol.ts';

// El pipeline no tiene un tipo cómodo para ASR; solo usamos la llamada y dispose().
type Transcriber = ((audio: Float32Array, opts: Record<string, unknown>) => Promise<{ text: string }>) & { dispose?: () => Promise<void> };
let transcriber: Transcriber | null = null;

function post(msg: WorkerResponse): void {
  (self as unknown as Worker).postMessage(msg);
}

async function init(req: Extract<WorkerRequest, { type: 'init' }>): Promise<void> {
  const t0 = performance.now();

  // --- Modelo: EMPAQUETADO en la app (apps/reader/public/models/), nunca de red -------------
  // A diferencia del spike original (que lo descargaba de Hugging Face la primera vez, con caché en
  // el navegador): en la tablet ese primer arranque necesitaba internet y, sobre todo, escondía
  // fallos de red detrás de "no pasa nada" (ver README, 2026-09-29). Ahora los archivos del modelo
  // (`onnx-community/whisper-tiny`, dtype q8) viven en `req.modelsBase` desde el primer instante.
  //
  // OJO: NO se usa `env.allowLocalModels + env.localModelPath` (el camino "obvio"). Transformers.js
  // trae un bug/limitación real para ese caso en el navegador: `get_file_metadata()` (usada para
  // detectar si existe `preprocessor_config.json`, entre otros) solo llama a `getFile()` en la rama
  // "local" cuando la ruta NO es una URL http(s) válida — pero en un navegador `localModelPath`
  // SIEMPRE es una URL absoluta (no hay filesystem real). Con `allowRemoteModels:false` la rama
  // "remoto" también queda desactivada, así que CUALQUIER archivo reporta "no existe" aunque esté
  // ahí — `get_processor_files()` entonces cree que no hace falta feature extractor y la construcción
  // del pipeline falla más tarde con `Cannot read properties of null (reading 'feature_extractor')`
  // (encontrado en la tablet real, 2026-09-29). Arreglo: usar el camino "remoto" tal cual (si hace
  // fetch real con URL, que sí funciona), apuntándolo a nuestro propio origen en vez de Hugging Face.
  env.allowLocalModels = false;
  env.allowRemoteModels = true;
  env.remoteHost = req.modelsBase;
  env.remotePathTemplate = '{model}/';
  env.useBrowserCache = false;
  env.useWasmCache = true;

  // --- ONNX Runtime: archivos .wasm/.mjs servidos desde NUESTRO origen (sin CDN) --------------
  const wasm = env.backends.onnx.wasm!;
  wasm.wasmPaths = {
    mjs: `${req.wasmBase}ort-wasm-simd-threaded.asyncify.mjs`,
    wasm: `${req.wasmBase}ort-wasm-simd-threaded.asyncify.wasm`,
  };
  // Multihilo solo si la página está aislada (COOP/COEP => SharedArrayBuffer disponible).
  const isolated = self.crossOriginIsolated;
  const auto = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
  wasm.numThreads = isolated ? (req.threads > 0 ? req.threads : auto) : 1;

  const progress_callback = (p: unknown) => post({ type: 'progress', info: p as Record<string, unknown> });

  transcriber = (await pipeline('automatic-speech-recognition', req.modelId, {
    device: req.backend,
    dtype: req.dtype as never,
    progress_callback,
  })) as unknown as Transcriber;
  const loadMs = performance.now() - t0;

  // Calentamiento: la primera inferencia compila kernels/shaders y es mucho más lenta.
  // Se hace aquí (con 1 s de silencio) para que no contamine las métricas de latencia.
  const w0 = performance.now();
  await transcriber(new Float32Array(16000), { language: req.language, task: 'transcribe' });
  const warmupMs = performance.now() - w0;

  post({ type: 'ready', backend: req.backend, loadMs, warmupMs, threads: wasm.numThreads ?? 1, crossOriginIsolated: isolated });
}

async function transcribe(req: Extract<WorkerRequest, { type: 'transcribe' }>): Promise<void> {
  if (!transcriber) throw new Error('El modelo no está cargado.');
  const t0 = performance.now();
  const out = await transcriber(req.audio, {
    language: req.language, // FIJO: sin autodetección
    task: 'transcribe',
    return_timestamps: false,
    max_new_tokens: 96, // tope: 5 s de lectura caben de sobra y así un bucle de repetición no se dispara
    num_beams: 1, // decodificación voraz: más rápida
    do_sample: false,
  });
  post({ type: 'result', id: req.id, text: (out.text ?? '').trim(), inferenceMs: performance.now() - t0 });
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  try {
    if (req.type === 'init') await init(req);
    else if (req.type === 'transcribe') await transcribe(req);
    else if (req.type === 'dispose') {
      await transcriber?.dispose?.();
      transcriber = null;
    }
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    post({ type: 'error', id: req.type === 'transcribe' ? req.id : undefined, message });
  }
};

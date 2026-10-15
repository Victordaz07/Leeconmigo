/**
 * Lado del hilo principal del motor Whisper: crea el Web Worker, carga el modelo y transcribe.
 *
 * Implementa la interfaz `Transcriber`, que es lo único que el resto de la app conoce del motor
 * de voz. Cambiar de motor (otro modelo, reconocimiento nativo de Android...) = escribir otra
 * clase con esa interfaz; el temporizador ni se entera.
 */
import { DTYPES, LANGUAGES, MODELS, type Backend, type BackendChoice, type Language, type ModelKey } from './config.ts';
import type { WorkerRequest, WorkerResponse } from './whisper-protocol.ts';
import { hasWebGpu } from './device-info.ts';

export interface TranscribeResult {
  text: string;
  /** Tiempo que tardó SOLO la inferencia dentro del worker (ms). */
  inferenceMs: number;
}

/** Interfaz mínima de un motor de reconocimiento. */
export interface Transcriber {
  transcribe(audio: Float32Array): Promise<TranscribeResult>;
}

export interface LoadOptions {
  model: ModelKey;
  language: Language;
  backend: BackendChoice;
  threads: number;
  offlineOnly: boolean;
  onProgress?: (info: Record<string, unknown>) => void;
}

export interface LoadInfo {
  backend: Backend;
  model: ModelKey;
  modelId: string;
  dtype: string;
  loadMs: number;
  warmupMs: number;
  threads: number;
  crossOriginIsolated: boolean;
  /** Si se pidió "auto" y WebGPU falló, aquí queda el motivo del respaldo a WASM. */
  fallbackReason?: string;
}

export class WhisperClient implements Transcriber {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, { resolve: (r: TranscribeResult) => void; reject: (e: Error) => void }>();
  language: Language = 'es';
  info: LoadInfo | null = null;

  get ready(): boolean {
    return this.info !== null;
  }

  async load(opts: LoadOptions): Promise<LoadInfo> {
    this.dispose();
    this.language = opts.language;

    let order: Backend[];
    if (opts.backend === 'auto') order = (await hasWebGpu()) ? ['webgpu', 'wasm'] : ['wasm'];
    else order = [opts.backend];

    let fallbackReason: string | undefined;
    for (const backend of order) {
      try {
        const info = await this.loadWith(backend, opts);
        this.info = { ...info, fallbackReason };
        return this.info;
      } catch (err) {
        this.dispose();
        const msg = err instanceof Error ? err.message : String(err);
        if (backend === order[order.length - 1]) throw err;
        fallbackReason = `${backend} falló: ${msg}`;
      }
    }
    throw new Error('No hay backend disponible');
  }

  private loadWith(backend: Backend, opts: LoadOptions): Promise<LoadInfo> {
    const model = MODELS[opts.model];
    const dtype = DTYPES[backend];
    const worker = new Worker(new URL('./whisper-worker.ts', import.meta.url), { type: 'module' });
    this.worker = worker;

    return new Promise<LoadInfo>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const msg = e.data;
        if (msg.type === 'progress') opts.onProgress?.(msg.info);
        else if (msg.type === 'ready') {
          worker.onmessage = (ev: MessageEvent<WorkerResponse>) => this.onMessage(ev.data);
          resolve({
            backend: msg.backend,
            model: opts.model,
            modelId: model.id,
            dtype: typeof dtype === 'string' ? dtype : JSON.stringify(dtype),
            loadMs: msg.loadMs,
            warmupMs: msg.warmupMs,
            threads: msg.threads,
            crossOriginIsolated: msg.crossOriginIsolated,
          });
        } else if (msg.type === 'error') reject(new Error(msg.message));
      };
      worker.onerror = (e) => reject(new Error(e.message || 'Error en el worker de Whisper'));

      const req: WorkerRequest = {
        type: 'init',
        modelId: model.id,
        backend,
        dtype,
        language: LANGUAGES[opts.language].whisperName,
        wasmBase: `${new URL(import.meta.env.BASE_URL, location.href).href}ort/`,
        modelsBase: `${new URL(import.meta.env.BASE_URL, location.href).href}models/`,
        threads: opts.threads,
        offlineOnly: opts.offlineOnly,
      };
      worker.postMessage(req);
    });
  }

  private onMessage(msg: WorkerResponse): void {
    if (msg.type === 'result') {
      this.pending.get(msg.id)?.resolve({ text: msg.text, inferenceMs: msg.inferenceMs });
      this.pending.delete(msg.id);
    } else if (msg.type === 'error' && msg.id !== undefined) {
      this.pending.get(msg.id)?.reject(new Error(msg.message));
      this.pending.delete(msg.id);
    }
  }

  transcribe(audio: Float32Array): Promise<TranscribeResult> {
    const worker = this.worker;
    if (!worker || !this.info) return Promise.reject(new Error('El modelo no está cargado.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const req: WorkerRequest = { type: 'transcribe', id, audio, language: LANGUAGES[this.language].whisperName };
      worker.postMessage(req, [audio.buffer]); // el audio se TRANSFIERE (no queda copia en este hilo)
    });
  }

  /** Libera el modelo y termina el worker (libera también la memoria de ONNX Runtime). */
  dispose(): void {
    this.worker?.postMessage({ type: 'dispose' } satisfies WorkerRequest);
    this.worker?.terminate();
    this.worker = null;
    this.info = null;
    this.pending.forEach((p) => p.reject(new Error('Motor detenido')));
    this.pending.clear();
  }
}

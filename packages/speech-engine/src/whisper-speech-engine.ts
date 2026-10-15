/**
 * WhisperSpeechEngine: primer proveedor REAL de `SpeechEngine` (docs/02, docs/09 #6-#7).
 *
 * Portado del Prototipo 00 (`lee-conmigo-stt-test/`, spike verificado en PC con audio sintético,
 * nunca antes conectado a la app real ni probado en una tablet). Reconocimiento 100% en el
 * dispositivo (Whisper vía Transformers.js/ONNX Runtime WASM): el audio nunca sale del navegador
 * ni se persiste (docs/07). Único proveedor posible sin violar esa regla: la Web Speech API nativa
 * manda el audio a servidores de Google.
 *
 * Simplificado respecto al spike: aquí NO se reimplementa el comparador de texto ni la máquina de
 * ventanas con solape del spike (`matcher.ts`, `reading-state-machine.ts`) — esa lógica ya vive,
 * portada y con pruebas, en `packages/reading-engine` (`TextReadingMatcher`, `ReadingProgressTracker`,
 * `LiveReadingTimer`), que es quien debe alinear el texto reconocido con el texto esperado
 * (`RealReadingEngine`, en ese paquete). Este motor SOLO hace audio -> texto -> `SpeechResult`,
 * exactamente lo que pide el contrato `SpeechEngine`.
 *
 * Segmentación: en vez de las ventanas de ~5 s con solape del spike (pensadas para su propio
 * pipeline de diagnóstico), aquí se usa un enfoque más simple por UTTERANCE: el VAD (con
 * histéresis, `SpeechTimeline`) marca inicio/fin de un tramo de voz; al terminar (más un margen de
 * "hangover" para no cortar la última sílaba), se transcribe ese tramo completo y se emite como
 * UN `onFinalResult`. No hay resultados parciales (Whisper no transcribe en streaming) — el hook
 * `onPartialResult` del contrato queda sin usar por ahora, lo cual es válido (es opcional en la práctica).
 *
 * SIN PROBAR EN TABLET REAL todavía: los umbrales de VAD/ventana pueden necesitar ajuste con datos
 * reales de Noah (docs/09 #11). Pendiente también: aislamiento COOP/COEP dentro del WebView de
 * Capacitor (permitiría WASM multi-hilo, más rápido) — sin él, cae a 1 hilo automáticamente.
 */
import type { SpeechEngine, SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import { AudioCapture } from './whisper/audio-capture.ts';
import { AudioRingBuffer } from './whisper/audio-ring.ts';
import { DEFAULT_TIMELINE, SpeechTimeline } from './whisper/speech-timeline.ts';
import { createVad, type VoiceActivityDetector } from './whisper/vad.ts';
import { WhisperClient } from './whisper/whisper-client.ts';
import { FRAME_SAMPLES, type Language, type ModelKey } from './whisper/config.ts';

export interface WhisperSpeechEngineOptions {
  /** 'tiny' (más rápido, menos preciso) o 'base' (más preciso, más lento/pesado). */
  model?: ModelKey;
  /** Ruta base donde `predev`/`prebuild` copiaron los archivos de ONNX Runtime y el modelo VAD. */
  assetsBase?: string;
  /** Filtros del navegador (cancelación de eco, reducción de ruido, ganancia automática). */
  browserFilters?: boolean;
  /** ms mínimos de voz para no descartar el tramo como ruido breve. */
  minUtteranceMs?: number;
  /** ms máximos de un tramo antes de cortarlo igual (evita esperar demasiado a una pausa). */
  maxUtteranceMs?: number;
}

const DEFAULTS: Required<WhisperSpeechEngineOptions> = {
  model: 'tiny',
  assetsBase: '/',
  browserFilters: true,
  minUtteranceMs: 300,
  maxUtteranceMs: 8000,
};

/** Únicos idiomas que soporta hoy la app (docs/00): español e inglés. */
function toWhisperLanguage(language: string): Language {
  return language.startsWith('en') ? 'en' : 'es';
}

/**
 * Estado grueso del motor, SOLO para diagnóstico (panel DEV → "Probar micrófono", `apps/reader/src/
 * voice-lab.tsx`): el contrato `SpeechEngine` no lo pide, pero sin esto no hay forma de distinguir
 * "todavía cargando el modelo" de "ya escucha pero no oyó nada" — justo la duda que reportó Victor.
 */
export type WhisperStatus = 'idle' | 'requesting-mic' | 'loading-model' | 'ready' | 'stopped' | 'error';

export class WhisperSpeechEngine implements SpeechEngine {
  private readonly o: Required<WhisperSpeechEngineOptions>;
  private capture = new AudioCapture();
  private ring = new AudioRingBuffer();
  private vad: VoiceActivityDetector | null = null;
  private timeline: SpeechTimeline | null = null;
  private client = new WhisperClient();
  private frameIndex = 0;
  private utteranceStartFrame: number | null = null;
  private wasSpeaking = false;
  private transcribing = false;
  /** true cuando el VAD y el modelo Whisper (cargados en segundo plano tras `start()`) ya están listos. */
  private modelReady = false;

  private partialCbs: Array<(r: SpeechResult) => void> = [];
  private finalCbs: Array<(r: SpeechResult) => void> = [];
  private voiceCbs: Array<(active: boolean) => void> = [];
  private errorCbs: Array<(e: SpeechError) => void> = [];
  private statusCbs: Array<(s: WhisperStatus) => void> = [];

  private running = false;
  private startedAt = 0;
  private status: WhisperStatus = 'idle';

  constructor(opts: WhisperSpeechEngineOptions = {}) {
    this.o = { ...DEFAULTS, ...opts };
  }

  // ------------------------------------------------------------------ contrato SpeechEngine

  /**
   * Orden importante (bug real, encontrado al probar en la tablet: "no pide permisos... no sé si el
   * micrófono está funcionando"): antes se cargaban primero el VAD y el modelo Whisper (éste último se
   * DESCARGA de Hugging Face la primera vez — necesita red) y el micrófono se pedía al final. Si esa
   * descarga fallaba o se quedaba colgada (sin señal, red bloqueada, host lento...), `getUserMedia()`
   * nunca llegaba a llamarse: el diálogo de permiso jamás aparecía y no había ningún error visible.
   * Ahora el micrófono se pide PRIMERO — `start()` resuelve en cuanto el permiso se concede, sin
   * esperar al modelo — y el VAD/Whisper se cargan DESPUÉS, en segundo plano; `onFrame` ignora los
   * frames hasta que `this.vad` esté listo (no hay lectura de verdad todavía, pero el permiso y la
   * sesión ya están activos).
   */
  async start(language: string): Promise<void> {
    const lang = toWhisperLanguage(language);
    this.setStatus('requesting-mic');
    try {
      this.ring.clear();
      this.frameIndex = 0;
      this.utteranceStartFrame = null;
      this.wasSpeaking = false;
      this.modelReady = false;

      await this.capture.start({
        browserFilters: this.o.browserFilters,
        onFrame: (frame) => this.onFrame(frame),
        onEnded: () => this.emitError({ code: 'not-available', message: 'El micrófono se desconectó.' }),
      });

      this.startedAt = Date.now();
      this.running = true;
      this.setStatus('loading-model');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const code = /permission|denied|NotAllowed/i.test(message) ? 'permission-denied' : 'unknown';
      this.setStatus('error');
      this.emitError({ code, message });
      throw err;
    }

    // No se espera esta parte: el permiso de micrófono ya se concedió, que es lo urgente para la UI.
    void (async () => {
      try {
        const { vad } = await createVad('silero', this.o.assetsBase);
        if (!this.running) return void vad.dispose(); // start() se canceló (stop()) mientras cargaba
        this.vad = vad;
        this.timeline = new SpeechTimeline({ ...DEFAULT_TIMELINE, onThreshold: 0.5, offThreshold: 0.35 });
        await this.client.load({ model: this.o.model, language: lang, backend: 'auto', threads: 0, offlineOnly: false });
        if (!this.running) return;
        this.modelReady = true;
        this.setStatus('ready');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.setStatus('error');
        this.emitError({ code: 'unknown', message: `No se pudo cargar el reconocimiento de voz: ${message}` });
      }
    })();
  }

  async stop(): Promise<void> {
    this.running = false;
    this.modelReady = false;
    await this.capture.stop();
    await this.vad?.dispose();
    this.vad = null;
    this.client.dispose();
    this.setStatus('stopped');
  }

  /** Solo diagnóstico (no es parte del contrato `SpeechEngine`): estado grueso de carga/escucha. */
  onStatus(cb: (s: WhisperStatus) => void): Unsubscribe {
    return this.sub(this.statusCbs, cb);
  }

  getStatus(): WhisperStatus {
    return this.status;
  }

  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return this.sub(this.partialCbs, cb);
  }
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return this.sub(this.finalCbs, cb);
  }
  onVoiceActivity(cb: (active: boolean) => void): Unsubscribe {
    return this.sub(this.voiceCbs, cb);
  }
  onError(cb: (e: SpeechError) => void): Unsubscribe {
    return this.sub(this.errorCbs, cb);
  }

  /** Whisper corre siempre en el dispositivo (WASM/WebGPU): nunca depende de la red para reconocer. */
  async isOnDeviceAvailable(): Promise<boolean> {
    return true;
  }

  // ------------------------------------------------------------------ internos

  private onFrame(frame: Float32Array): void {
    if (!this.running || !this.vad || !this.timeline) return;
    this.ring.write(frame);
    const idx = this.frameIndex++;
    void this.vad
      .process(frame)
      .then((prob) => {
        if (!this.timeline) return;
        this.timeline.push(prob);
        const speaking = this.timeline.speakingNow;
        if (speaking !== this.wasSpeaking) {
          this.wasSpeaking = speaking;
          this.voiceCbs.forEach((cb) => cb(speaking));
          if (speaking) this.utteranceStartFrame = idx;
          else this.closeUtterance(idx);
        } else if (speaking && this.utteranceStartFrame !== null) {
          const ms = (idx - this.utteranceStartFrame) * (FRAME_SAMPLES / 16000) * 1000;
          if (ms >= this.o.maxUtteranceMs) this.closeUtterance(idx);
        }
      })
      .catch((err) => this.emitError({ code: 'unknown', message: err instanceof Error ? err.message : String(err) }));
  }

  private closeUtterance(endFrame: number): void {
    const start = this.utteranceStartFrame;
    this.utteranceStartFrame = null;
    if (start === null || this.transcribing || !this.modelReady) return;
    const ms = (endFrame - start) * (FRAME_SAMPLES / 16000) * 1000;
    if (ms < this.o.minUtteranceMs) return;
    const audio = this.ring.read(start * FRAME_SAMPLES, endFrame * FRAME_SAMPLES);
    if (!audio) return;
    this.transcribing = true;
    const atMs = Date.now() - this.startedAt;
    this.client
      .transcribe(audio)
      .then((r) => {
        const text = r.text.trim();
        if (text) this.finalCbs.forEach((cb) => cb({ text, isFinal: true, atMs }));
      })
      .catch((err) => this.emitError({ code: 'unknown', message: err instanceof Error ? err.message : String(err) }))
      .finally(() => {
        this.transcribing = false;
      });
  }

  private emitError(e: SpeechError): void {
    this.errorCbs.forEach((cb) => cb(e));
  }

  private setStatus(s: WhisperStatus): void {
    this.status = s;
    this.statusCbs.forEach((cb) => cb(s));
  }

  private sub<T>(list: T[], cb: T): Unsubscribe {
    list.push(cb);
    return () => {
      const i = list.indexOf(cb);
      if (i >= 0) list.splice(i, 1);
    };
  }
}

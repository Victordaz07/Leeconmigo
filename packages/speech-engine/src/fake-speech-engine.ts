/**
 * FakeSpeechEngine: motor de voz SIMULADO (docs/02-ARCHITECTURE.md, CLAUDE.md "Development rule").
 *
 * No escucha nada: no abre el micrófono ni procesa audio. Emite resultados de reconocimiento
 * "guionados" para poder construir y probar todo lo que hay por encima (ReadingEngine, UI, temporizador)
 * en un navegador, sin Android ni ningún proveedor real.
 *
 * Los proveedores reales (AndroidSpeechProvider, WhisperProvider...) NO se construyen hasta que el
 * Prototipo 00 produzca una decisión (docs/09-OPEN-DECISIONS.md #6 y #7). Cuando existan, implementarán
 * esta misma interfaz `SpeechEngine`.
 */
import type { SpeechEngine, SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';

/** Lo mínimo del planificador que necesita el simulador (compatible con el de reading-engine). */
export interface SpeechScheduler {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

const realScheduler: SpeechScheduler = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (h) => globalThis.clearTimeout(h as ReturnType<typeof setTimeout>),
};

export interface FakeSpeechEngineOptions {
  scheduler?: SpeechScheduler;
  /** ¿Hay reconocimiento en el dispositivo para este idioma? (por defecto sí) */
  onDeviceAvailable?: boolean | ((language: string) => boolean);
  /** Si se define, `start()` falla con este error (para probar "micrófono sin permiso", etc.). */
  startError?: SpeechError;
}

export interface SayOptions {
  /** Pausa entre palabras (ms). */
  wordIntervalMs?: number;
  /** Confianza que reporta el proveedor simulado. */
  confidence?: number;
  /** false = no emite el resultado final (la frase queda "en el aire"). */
  final?: boolean;
}

export class FakeSpeechEngine implements SpeechEngine {
  private partial: Array<(r: SpeechResult) => void> = [];
  private final: Array<(r: SpeechResult) => void> = [];
  private voice: Array<(active: boolean) => void> = [];
  private errors: Array<(e: SpeechError) => void> = [];
  private handles = new Set<unknown>();
  private startedAt = 0;
  private running = false;
  private language = '';
  private readonly sched: SpeechScheduler;
  private readonly opts: FakeSpeechEngineOptions;

  constructor(opts: FakeSpeechEngineOptions = {}) {
    this.opts = opts;
    this.sched = opts.scheduler ?? realScheduler;
  }

  get isRunning(): boolean {
    return this.running;
  }
  get currentLanguage(): string {
    return this.language;
  }

  // ------------------------------------------------------------------ contrato SpeechEngine

  async start(language: string): Promise<void> {
    if (this.opts.startError) {
      this.errors.forEach((cb) => cb(this.opts.startError as SpeechError));
      throw new Error(this.opts.startError.message);
    }
    this.language = language;
    this.startedAt = this.sched.now();
    this.running = true;
  }

  async stop(): Promise<void> {
    this.running = false;
    this.handles.forEach((h) => this.sched.clearTimeout(h));
    this.handles.clear();
  }

  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return this.sub(this.partial, cb);
  }
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return this.sub(this.final, cb);
  }
  onVoiceActivity(cb: (active: boolean) => void): Unsubscribe {
    return this.sub(this.voice, cb);
  }
  onError(cb: (e: SpeechError) => void): Unsubscribe {
    return this.sub(this.errors, cb);
  }

  async isOnDeviceAvailable(language: string): Promise<boolean> {
    const a = this.opts.onDeviceAvailable ?? true;
    return typeof a === 'function' ? a(language) : a;
  }

  // ------------------------------------------------------------------ simulador

  /** Emite un resultado parcial ahora mismo. */
  emitPartial(text: string, confidence?: number): void {
    this.partial.forEach((cb) => cb(this.result(text, false, confidence)));
  }

  /** Emite un resultado final ahora mismo. */
  emitFinal(text: string, confidence?: number): void {
    this.final.forEach((cb) => cb(this.result(text, true, confidence)));
  }

  /** Simula que el VAD detecta voz / silencio. */
  setVoiceActive(active: boolean): void {
    this.voice.forEach((cb) => cb(active));
  }

  /** Simula un fallo del proveedor. */
  fail(error: SpeechError): void {
    this.errors.forEach((cb) => cb(error));
  }

  /**
   * Simula que el niño dice `text`: voz activa, resultados parciales que van creciendo palabra por
   * palabra (como haría un reconocimiento en streaming), resultado final y silencio.
   * Devuelve la duración total simulada (ms).
   */
  say(text: string, opts: SayOptions = {}): number {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const gap = opts.wordIntervalMs ?? 350;
    this.setVoiceActive(true);
    words.forEach((_, i) => {
      this.later(() => this.emitPartial(words.slice(0, i + 1).join(' '), opts.confidence), gap * (i + 1));
    });
    const end = gap * words.length;
    if (opts.final !== false) this.later(() => this.emitFinal(words.join(' '), opts.confidence), end + 40);
    this.later(() => this.setVoiceActive(false), end + 120);
    return end + 120;
  }

  // ------------------------------------------------------------------ internos

  private result(text: string, isFinal: boolean, confidence?: number): SpeechResult {
    return { text, isFinal, confidence, atMs: this.sched.now() - this.startedAt };
  }

  private sub<T>(list: T[], cb: T): Unsubscribe {
    list.push(cb);
    return () => {
      const i = list.indexOf(cb);
      if (i >= 0) list.splice(i, 1);
    };
  }

  private later(fn: () => void, ms: number): void {
    const h = this.sched.setTimeout(() => {
      this.handles.delete(h);
      if (this.running) fn();
    }, ms);
    this.handles.add(h);
  }
}

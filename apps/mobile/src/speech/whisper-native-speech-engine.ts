/**
 * Voz real en la app nativa (RN-03/RN-07, docs/11): micrófono → frases → Whisper EN EL DISPOSITIVO (whisper.rn) → texto.
 *
 * PRIVACIDAD (docs/07, D1): el audio llega en trozos a la memoria (`@fugood/react-native-audio-pcm-stream`, que nunca
 * escribe archivos), vive unos segundos en un anillo que se sobrescribe y se transcribe sin red. Nunca se guarda ni se
 * envía; a whisper.rn no se le da `audioOutputPath` ni sistema de archivos. Los modelos van dentro de la app.
 * Si no hay permiso de micrófono o el modelo no carga, se avisa (`onError`) y la voz queda apagada: falla cerrado.
 *
 * Igual que `WhisperSpeechEngine` de la web: un VAD por energía marca las frases (`UtteranceSegmenter`); al terminar una
 * frase, Silero VAD confirma que hubo voz (Whisper "alucina" texto con ruido) y Whisper la transcribe. Sin resultados
 * parciales (Whisper no transcribe en streaming).
 */
import AudioRecord from '@fugood/react-native-audio-pcm-stream';
import { Platform } from 'react-native';
import { initWhisper, initWhisperVad, type WhisperContext, type WhisperVadContext } from 'whisper.rn/index'; // el paquete solo exporta subrutas
import { requestMicrophonePermission } from './microphone-access';
import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import { cleanTranscript, EnergyVad, pcm16Base64ToFloat32, SAMPLE_RATE, UtteranceSegmenter } from '@lee-conmigo/speech-engine/core';
import type { NativeVoiceEngine, NativeVoiceOptions, VoiceDiagnostics, VoiceModel, VoiceStatus, VoiceUtterance } from './voice-types';

const emptyDiagnostics = (): VoiceDiagnostics => ({ audioSeconds: 0, level: 0, detected: 0, skipped: 0, dropped: 0, transcribed: 0, transcribing: false, queued: 0, errors: 0 });

// Metro requires literal resource paths for bundling the local models.
const MODEL_ASSET: Record<VoiceModel, number> = {
  tiny: require('../../assets/models/ggml-tiny-q8_0.bin'),
  base: require('../../assets/models/ggml-base-q5_1.bin'),
};
const VAD_ASSET: number = require('../../assets/models/ggml-silero-v6.2.0.bin');

/** Cargar un modelo tarda: se carga una vez y se reutiliza entre lecturas. */
const whisperCache = new Map<VoiceModel, Promise<WhisperContext>>();
let vadCache: Promise<WhisperVadContext> | null = null;
const loadWhisper = (model: VoiceModel): Promise<WhisperContext> => {
  const cached = whisperCache.get(model);
  if (cached) return cached;
  const p = initWhisper({ filePath: MODEL_ASSET[model], useGpu: false });
  p.catch(() => whisperCache.delete(model));
  whisperCache.set(model, p);
  return p;
};
const loadVad = (): Promise<WhisperVadContext> => {
  if (vadCache) return vadCache;
  const p = initWhisperVad({ filePath: VAD_ASSET, useGpu: false, nThreads: 2 });
  p.catch(() => (vadCache = null));
  vadCache = p;
  return p;
};

/** Frases en espera de Whisper: si el niño lee más rápido de lo que se transcribe, se quedan las más recientes. */
const MAX_QUEUE = 2;

export function isNativeVoiceSupported(): boolean {
  return Platform.OS === 'android' || Platform.OS === 'ios';
}

export class WhisperNativeSpeechEngine implements NativeVoiceEngine {
  private readonly model: VoiceModel;
  private language = 'es';
  private status: VoiceStatus = 'idle';
  private running = false;
  private generation = 0;
  private stopping: Promise<void> = Promise.resolve();
  private cancelTranscription: (() => Promise<void>) | null = null;
  private startedAt = 0;
  private segmenter = new UtteranceSegmenter();
  private energy = new EnergyVad();
  private whisper: WhisperContext | null = null;
  private vad: WhisperVadContext | null = null;
  private queue: { audio: Float32Array; atMs: number }[] = [];
  private busy = false;
  private draining: Promise<void> | null = null;
  private dataSub: { remove(): void } | null = null;

  private finalCbs: ((r: SpeechResult) => void)[] = [];
  private partialCbs: ((r: SpeechResult) => void)[] = [];
  private voiceCbs: ((active: boolean) => void)[] = [];
  private errorCbs: ((e: SpeechError) => void)[] = [];
  private statusCbs: ((s: VoiceStatus) => void)[] = [];
  private utteranceCbs: ((u: VoiceUtterance) => void)[] = [];
  private diagCbs: ((d: VoiceDiagnostics) => void)[] = [];
  private diag = emptyDiagnostics();
  private lastDiagAt = 0;

  constructor(opts: NativeVoiceOptions = {}) {
    this.model = opts.model ?? 'tiny';
  }

  /** Load models before opening capture; stopping cancels permission/model continuations too. */
  async start(language: string): Promise<void> {
    if (this.running) return;
    const generation = ++this.generation;
    await this.stopping;
    if (generation !== this.generation || this.running) return;
    this.language = language.startsWith('en') ? 'en' : 'es';
    this.setStatus('requesting-mic');
    try {
      const permitted = await this.askPermission();
      if (generation !== this.generation) return;
      if (!permitted) {
        this.setStatus('error');
        this.emitError({ code: 'permission-denied', message: 'Microphone permission denied' });
        return;
      }
      this.setStatus('loading-model');
      const [whisper, vad] = await Promise.all([loadWhisper(this.model), loadVad()]);
      if (generation !== this.generation) return;
      this.whisper = whisper;
      this.vad = vad;
      this.segmenter.reset();
      this.energy.reset();
      this.queue = [];
      this.diag = emptyDiagnostics();
      AudioRecord.init({ sampleRate: SAMPLE_RATE, channels: 1, bitsPerSample: 16, audioSource: 6, bufferSize: 4096 });
      this.dataSub = AudioRecord.on('data', b64 => { if (generation === this.generation) this.onData(b64); });
      this.running = true;
      this.startedAt = Date.now();
      AudioRecord.start();
      this.setStatus('ready');
      this.emitDiag(true);
    } catch {
      if (generation !== this.generation) return;
      this.setStatus('error');
      this.emitError({ code: 'not-available', message: 'Local speech unavailable' });
      void this.stop();
    }
  }

  stop(): Promise<void> {
    ++this.generation;
    const wasRunning = this.running;
    this.running = false;
    this.dataSub?.remove();
    this.dataSub = null;
    this.segmenter.reset();
    this.queue = [];
    const cancel = this.cancelTranscription;
    this.cancelTranscription = null;
    this.stopping = this.stopping.then(async () => {
      await Promise.all([wasRunning ? AudioRecord.stop().catch(() => {}) : Promise.resolve(), cancel?.().catch(() => {}), this.draining]);
      if (this.status !== 'error') this.setStatus('stopped');
    });
    this.voiceCbs.forEach(cb => cb(false));
    return this.stopping;
  }

  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return sub(this.partialCbs, cb);
  }
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe {
    return sub(this.finalCbs, cb);
  }
  onVoiceActivity(cb: (active: boolean) => void): Unsubscribe {
    return sub(this.voiceCbs, cb);
  }
  onError(cb: (e: SpeechError) => void): Unsubscribe {
    return sub(this.errorCbs, cb);
  }
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe {
    return sub(this.statusCbs, cb);
  }
  onUtterance(cb: (u: VoiceUtterance) => void): Unsubscribe {
    return sub(this.utteranceCbs, cb);
  }
  onDiagnostics(cb: (d: VoiceDiagnostics) => void): Unsubscribe {
    return sub(this.diagCbs, cb);
  }
  getStatus(): VoiceStatus {
    return this.status;
  }

  /** Whisper corre siempre en el dispositivo: nunca necesita red. */
  async isOnDeviceAvailable(): Promise<boolean> {
    return isNativeVoiceSupported();
  }

  // ---------------------------------------------------------------- internos

  private async askPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true; // iOS lo pide el sistema al abrir el micrófono (NSMicrophoneUsageDescription)
    return (await requestMicrophonePermission()).granted;
  }

  private onData(b64: string): void {
    if (!this.running) return;
    const samples = pcm16Base64ToFloat32(b64);
    this.diag.audioSeconds += samples.length / SAMPLE_RATE;
    let peak = 0;
    for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
    this.diag.level = Math.min(1, peak * 2);
    for (const e of this.segmenter.push(samples, (f) => this.energy.probability(f))) {
      if (e.type === 'voice') this.voiceCbs.forEach((cb) => cb(e.active));
      else {
        this.diag.detected++;
        if (!this.whisper) {
          this.diag.dropped++; // el modelo todavía carga
          continue;
        }
        this.queue.push({ audio: e.audio, atMs: Date.now() - this.startedAt });
        if (this.queue.length > MAX_QUEUE) {
          this.queue.shift();
          this.diag.dropped++;
        }
        if (!this.busy) this.draining = this.drain();
      }
    }
    this.emitDiag();
  }

  /** Como mucho ~6 veces por segundo (el medidor no necesita más), salvo cuando cambia algo importante. */
  private emitDiag(force = false): void {
    const now = Date.now();
    if (!force && now - this.lastDiagAt < 160) return;
    this.lastDiagAt = now;
    const d = { ...this.diag, queued: this.queue.length, transcribing: this.busy };
    this.diagCbs.forEach((cb) => cb(d));
  }

  private async drain(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      while (this.running && this.queue.length) {
        const { audio, atMs } = this.queue.shift()!;
        await this.transcribe(audio, atMs);
      }
    } finally {
      this.busy = false;
      this.emitDiag(true);
    }
  }

  private async transcribe(audio: Float32Array, atMs: number): Promise<void> {
    const whisper = this.whisper;
    if (!whisper) return;
    const generation = this.generation;
    const live = () => this.running && generation === this.generation;
    const audioMs = Math.round((audio.length / SAMPLE_RATE) * 1000);
    const t0 = Date.now();
    try {
      const buf = audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength) as ArrayBuffer;
      let speechMs = audioMs;
      // Silero confirma que hubo voz: Whisper inventa frases con ruido o silencio.
      if (this.vad) {
        const segments = await this.vad.detectSpeechData(buf, { threshold: 0.5, minSpeechDurationMs: 200, minSilenceDurationMs: 100, speechPadMs: 30 });
        if (!live()) return;
        // whisper.cpp VAD boundaries are centiseconds, not seconds. Exclude closing silence.
        speechMs = Math.min(audioMs, segments.reduce((ms, segment) => ms + Math.max(0, segment.t1 - segment.t0) * 10, 0));
        if (!segments.length) {
          this.diag.skipped++;
          this.emitDiag(true);
          this.utteranceCbs.forEach((cb) => cb({ audioMs, transcribeMs: Date.now() - t0, text: '', skipped: true }));
          return;
        }
      }
      this.emitDiag(true);
      if (!live()) return;
      const { promise, stop } = whisper.transcribeData(buf, { language: this.language, maxThreads: 4, translate: false });
      this.cancelTranscription = stop;
      const r = await promise;
      if (!live()) return;
      this.cancelTranscription = null;
      const text = cleanTranscript(r.result);
      this.diag.transcribed++;
      this.emitDiag(true);
      this.utteranceCbs.forEach((cb) => cb({ audioMs, transcribeMs: Date.now() - t0, text, skipped: false }));
      if (text && live()) this.finalCbs.forEach((cb) => cb({ text, isFinal: true, atMs, audioDurationMs: speechMs }));
    } catch {
      if (!live()) return;
      this.cancelTranscription = null;
      this.diag.errors++;
      this.emitDiag(true);
      this.emitError({ code: 'unknown', message: 'Local transcription failed' });
    }
  }

  private setStatus(s: VoiceStatus): void {
    this.status = s;
    this.statusCbs.forEach((cb) => cb(s));
  }

  private emitError(e: SpeechError): void {
    this.errorCbs.forEach((cb) => cb(e));
  }
}

function sub<T>(list: T[], cb: T): Unsubscribe {
  list.push(cb);
  return () => {
    const i = list.indexOf(cb);
    if (i >= 0) list.splice(i, 1);
  };
}

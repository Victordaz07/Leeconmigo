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
import { PermissionsAndroid, Platform } from 'react-native';
import { initWhisper, initWhisperVad, type WhisperContext, type WhisperVadContext } from 'whisper.rn/index'; // el paquete solo exporta subrutas
import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import { cleanTranscript, EnergyVad, pcm16Base64ToFloat32, SAMPLE_RATE, UtteranceSegmenter } from '@lee-conmigo/speech-engine/core';
import type { NativeVoiceEngine, NativeVoiceOptions, VoiceModel, VoiceStatus, VoiceUtterance } from './voice-types';

/* eslint-disable @typescript-eslint/no-require-imports -- Metro empaqueta los modelos como recursos de la app. */
const MODEL_ASSET: Record<VoiceModel, number> = {
  tiny: require('../../assets/models/ggml-tiny-q8_0.bin'),
  base: require('../../assets/models/ggml-base-q5_1.bin'),
};
const VAD_ASSET: number = require('../../assets/models/ggml-silero-v6.2.0.bin');
/* eslint-enable @typescript-eslint/no-require-imports */

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
  private startedAt = 0;
  private segmenter = new UtteranceSegmenter();
  private energy = new EnergyVad();
  private whisper: WhisperContext | null = null;
  private vad: WhisperVadContext | null = null;
  private queue: { audio: Float32Array; atMs: number }[] = [];
  private busy = false;
  private dataSub: { remove(): void } | null = null;

  private finalCbs: ((r: SpeechResult) => void)[] = [];
  private partialCbs: ((r: SpeechResult) => void)[] = [];
  private voiceCbs: ((active: boolean) => void)[] = [];
  private errorCbs: ((e: SpeechError) => void)[] = [];
  private statusCbs: ((s: VoiceStatus) => void)[] = [];
  private utteranceCbs: ((u: VoiceUtterance) => void)[] = [];

  constructor(opts: NativeVoiceOptions = {}) {
    this.model = opts.model ?? 'tiny';
  }

  /** Pide el micrófono primero (lo urgente para la UI) y carga el modelo después, sin bloquear. */
  async start(language: string): Promise<void> {
    if (this.running) return;
    this.language = language.startsWith('en') ? 'en' : 'es';
    this.setStatus('requesting-mic');
    if (!(await this.askPermission())) {
      this.setStatus('error');
      this.emitError({ code: 'permission-denied', message: 'Sin permiso para usar el micrófono.' });
      return;
    }
    this.segmenter.reset();
    this.energy.reset();
    this.queue = [];
    try {
      AudioRecord.init({ sampleRate: SAMPLE_RATE, channels: 1, bitsPerSample: 16, audioSource: 6, bufferSize: 4096 });
      this.dataSub = AudioRecord.on('data', (b64) => this.onData(b64));
      AudioRecord.start();
    } catch (err) {
      this.setStatus('error');
      this.emitError({ code: 'not-available', message: `No se pudo abrir el micrófono: ${String(err)}` });
      return;
    }
    this.running = true;
    this.startedAt = Date.now();
    this.setStatus('loading-model');
    void Promise.all([loadWhisper(this.model), loadVad()])
      .then(([w, v]) => {
        if (!this.running) return;
        this.whisper = w;
        this.vad = v;
        this.setStatus('ready');
      })
      .catch((err) => {
        this.setStatus('error');
        this.emitError({ code: 'not-available', message: `No se pudo cargar el reconocimiento de voz: ${String(err)}` });
        void this.stop();
      });
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    this.dataSub?.remove();
    this.dataSub = null;
    try {
      await AudioRecord.stop();
    } catch {
      // ya estaba detenido
    }
    this.segmenter.reset();
    this.queue = [];
    if (this.status !== 'error') this.setStatus('stopped');
    this.voiceCbs.forEach((cb) => cb(false));
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
    const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Kitewise quiere usar el micrófono',
      message: 'Para seguir la lectura en voz alta. La voz se procesa en este equipo y nunca se graba ni se envía.',
      buttonPositive: 'Permitir',
      buttonNegative: 'Ahora no',
    });
    return res === PermissionsAndroid.RESULTS.GRANTED;
  }

  private onData(b64: string): void {
    if (!this.running) return;
    const samples = pcm16Base64ToFloat32(b64);
    for (const e of this.segmenter.push(samples, (f) => this.energy.probability(f))) {
      if (e.type === 'voice') this.voiceCbs.forEach((cb) => cb(e.active));
      else if (this.whisper) {
        this.queue.push({ audio: e.audio, atMs: Date.now() - this.startedAt });
        if (this.queue.length > MAX_QUEUE) this.queue.shift();
        void this.drain();
      }
    }
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
    }
  }

  private async transcribe(audio: Float32Array, atMs: number): Promise<void> {
    const whisper = this.whisper;
    if (!whisper) return;
    const audioMs = Math.round((audio.length / SAMPLE_RATE) * 1000);
    const t0 = Date.now();
    try {
      const buf = audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength) as ArrayBuffer;
      // Silero confirma que hubo voz: Whisper inventa frases con ruido o silencio.
      if (this.vad) {
        const segments = await this.vad.detectSpeechData(buf, { threshold: 0.5, minSpeechDurationMs: 200, minSilenceDurationMs: 100, speechPadMs: 30 });
        if (!segments.length) {
          this.utteranceCbs.forEach((cb) => cb({ audioMs, transcribeMs: Date.now() - t0, text: '', skipped: true }));
          return;
        }
      }
      const { promise } = whisper.transcribeData(buf, { language: this.language, maxThreads: 4, translate: false });
      const r = await promise;
      const text = cleanTranscript(r.result);
      this.utteranceCbs.forEach((cb) => cb({ audioMs, transcribeMs: Date.now() - t0, text, skipped: false }));
      if (text && this.running) this.finalCbs.forEach((cb) => cb({ text, isFinal: true, atMs }));
    } catch (err) {
      this.emitError({ code: 'unknown', message: `Error al reconocer: ${String(err)}` });
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

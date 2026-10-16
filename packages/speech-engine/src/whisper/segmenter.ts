/**
 * Corta la voz en FRASES (módulo puro, mismo criterio que `WhisperSpeechEngine` de la web): frames de 32 ms con su
 * probabilidad de voz → histéresis (`SpeechTimeline`) → cuando una frase termina (o dura demasiado), entrega su audio para
 * transcribirlo. El audio vive solo en un anillo en memoria de pocos segundos y se sobrescribe (docs/07, D1).
 */
import { AudioRingBuffer } from './audio-ring.ts';
import { FRAME_SAMPLES, SAMPLE_RATE } from './config.ts';
import { DEFAULT_TIMELINE, SpeechTimeline, type TimelineOptions } from './speech-timeline.ts';

export interface SegmenterOptions {
  /** Umbrales de la histéresis (0–1). */
  onThreshold: number;
  offThreshold: number;
  /** Frases más cortas se descartan como ruido breve (ms). */
  minUtteranceMs: number;
  /** Una frase más larga se corta igual, para no esperar demasiado una pausa (ms). */
  maxUtteranceMs: number;
  timeline?: Partial<Omit<TimelineOptions, 'onThreshold' | 'offThreshold'>>;
}

export const DEFAULT_SEGMENTER: SegmenterOptions = { onThreshold: 0.5, offThreshold: 0.35, minUtteranceMs: 300, maxUtteranceMs: 8000 };

export type SegmenterEvent = { type: 'voice'; active: boolean } | { type: 'utterance'; audio: Float32Array; startMs: number; endMs: number };

const frameMs = (FRAME_SAMPLES / SAMPLE_RATE) * 1000; // 32 ms

export class UtteranceSegmenter {
  private readonly o: SegmenterOptions;
  private ring = new AudioRingBuffer();
  private timeline: SpeechTimeline;
  private pending = new Float32Array(FRAME_SAMPLES);
  private pendingLen = 0;
  private frame = 0;
  private speaking = false;
  private startFrame: number | null = null;

  constructor(opts: Partial<SegmenterOptions> = {}) {
    this.o = { ...DEFAULT_SEGMENTER, ...opts };
    this.timeline = this.newTimeline();
  }

  /**
   * Agrega muestras (cualquier tamaño; se agrupan en frames de 512). `probOf` da la probabilidad de voz de cada frame
   * (un VAD). Devuelve lo que pasó: cambios de voz y frases terminadas.
   */
  push(samples: Float32Array, probOf: (frame: Float32Array) => number): SegmenterEvent[] {
    const events: SegmenterEvent[] = [];
    let i = 0;
    while (i < samples.length) {
      const take = Math.min(FRAME_SAMPLES - this.pendingLen, samples.length - i);
      this.pending.set(samples.subarray(i, i + take), this.pendingLen);
      this.pendingLen += take;
      i += take;
      if (this.pendingLen === FRAME_SAMPLES) {
        this.onFrame(this.pending, probOf(this.pending), events);
        this.pendingLen = 0;
      }
    }
    return events;
  }

  /** Cierra la frase en curso (al detener la escucha), si alcanza el mínimo. */
  flush(): SegmenterEvent[] {
    const events: SegmenterEvent[] = [];
    if (this.speaking) {
      this.speaking = false;
      events.push({ type: 'voice', active: false });
      this.close(this.frame, events);
    }
    return events;
  }

  reset(): void {
    this.ring.clear();
    this.timeline = this.newTimeline();
    this.pendingLen = 0;
    this.frame = 0;
    this.speaking = false;
    this.startFrame = null;
  }

  private newTimeline(): SpeechTimeline {
    return new SpeechTimeline({ ...DEFAULT_TIMELINE, ...this.o.timeline, onThreshold: this.o.onThreshold, offThreshold: this.o.offThreshold });
  }

  private onFrame(frame: Float32Array, prob: number, events: SegmenterEvent[]): void {
    this.ring.write(frame);
    const idx = this.frame++;
    this.timeline.push(prob);
    const speaking = this.timeline.speakingNow;
    if (speaking !== this.speaking) {
      this.speaking = speaking;
      events.push({ type: 'voice', active: speaking });
      if (speaking) {
        // El inicio confirmado llega unos frames tarde: retroceder para no cortar la primera sílaba.
        const back = (this.o.timeline?.minOnFrames ?? DEFAULT_TIMELINE.minOnFrames) + (this.o.timeline?.padFrames ?? DEFAULT_TIMELINE.padFrames);
        this.startFrame = Math.max(0, idx - back);
      } else this.close(idx + 1, events);
    } else if (speaking && this.startFrame !== null && (idx + 1 - this.startFrame) * frameMs >= this.o.maxUtteranceMs) {
      // Frase demasiado larga: se entrega y se sigue escuchando como una nueva.
      this.close(idx + 1, events);
      this.startFrame = idx + 1;
    }
  }

  private close(endFrame: number, events: SegmenterEvent[]): void {
    const start = this.startFrame;
    if (!this.speaking) this.startFrame = null;
    if (start === null) return;
    // El mínimo cuenta solo los frames con voz (no el silencio de cierre, que sí va en el audio para no cortar la última sílaba).
    if (this.timeline.speechMs(start, endFrame) < this.o.minUtteranceMs) return;
    const audio = this.ring.read(start * FRAME_SAMPLES, endFrame * FRAME_SAMPLES);
    if (audio) events.push({ type: 'utterance', audio, startMs: start * frameMs, endMs: endFrame * frameMs });
  }
}

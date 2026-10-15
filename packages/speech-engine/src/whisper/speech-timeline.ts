/**
 * Línea de tiempo de voz: convierte la probabilidad de voz de cada frame (que da el VAD) en
 * marcas voz / no-voz con histéresis, y responde "¿cuántos ms de voz hay entre dos frames?".
 * Módulo puro (sin dependencias del navegador). 1 frame = 512 muestras = 32 ms a 16 kHz.
 */
import { FRAME_MS } from './config.ts';

export interface TimelineOptions {
  onThreshold: number; // prob ≥ esto => candidato a voz
  offThreshold: number; // prob < esto => candidato a silencio
  /** Frames seguidos por encima de onThreshold para confirmar el inicio de voz (evita clics). */
  minOnFrames: number;
  /** Frames de silencio tolerados antes de cerrar un tramo de voz (puentea pausas entre sílabas). */
  hangoverFrames: number;
  /** Frames que se añaden ANTES del inicio confirmado (no cortar la primera sílaba). */
  padFrames: number;
}

export const DEFAULT_TIMELINE: Omit<TimelineOptions, 'onThreshold' | 'offThreshold'> = {
  minOnFrames: 3, // ~96 ms
  hangoverFrames: 10, // ~320 ms
  padFrames: 4, // ~128 ms
};

/** Marcas de voz por frame. Es causal salvo el "pad" de inicio, que retoca unos pocos frames anteriores. */
export class SpeechTimeline {
  private flags: number[] = [];
  private onRun = 0;
  private offRun = 0;
  private speaking = false;
  private opts: TimelineOptions;

  constructor(opts: TimelineOptions) {
    this.opts = opts;
  }

  setOptions(opts: TimelineOptions): void {
    this.opts = opts;
  }

  get length(): number {
    return this.flags.length;
  }

  /** Frames finales que aún pueden cambiar (por el pad de inicio); no resolverlos todavía. */
  get lookaheadFrames(): number {
    return this.opts.minOnFrames + this.opts.padFrames + 1;
  }

  push(prob: number): void {
    const o = this.opts;
    const i = this.flags.length;
    this.flags.push(0);
    if (prob >= o.onThreshold) {
      this.onRun++;
      this.offRun = 0;
    } else if (prob < o.offThreshold) {
      this.offRun++;
      this.onRun = 0;
    } // entre ambos umbrales: no cambia nada (histéresis)

    if (!this.speaking) {
      if (this.onRun >= o.minOnFrames) {
        this.speaking = true;
        // Marca desde el pad hasta ahora.
        for (let k = Math.max(0, i - this.onRun + 1 - o.padFrames); k <= i; k++) this.flags[k] = 1;
      }
    } else {
      this.flags[i] = 1;
      if (this.offRun >= o.hangoverFrames) {
        // Fin del tramo: los frames de "hangover" no eran voz.
        for (let k = i - this.offRun + 1; k <= i; k++) this.flags[k] = 0;
        this.speaking = false;
      }
    }
  }

  isSpeech(frame: number): boolean {
    return this.flags[frame] === 1;
  }

  /** Cantidad de frames con voz en [from, to). */
  speechFrames(from: number, to: number): number {
    let n = 0;
    for (let i = Math.max(from, 0); i < Math.min(to, this.flags.length); i++) n += this.flags[i];
    return n;
  }

  speechMs(from: number, to: number): number {
    return this.speechFrames(from, to) * FRAME_MS;
  }

  /** Nivel actual para el medidor de la UI. */
  get speakingNow(): boolean {
    return this.speaking;
  }
}


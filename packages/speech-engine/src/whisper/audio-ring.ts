/**
 * Anillo de audio en memoria (módulo puro, sin dependencias del navegador).
 * PRIVACIDAD: guarda solo los últimos RING_SECONDS segundos y sobrescribe lo anterior;
 * el audio nunca se escribe a disco, Blob, IndexedDB ni red.
 */
import { RING_SECONDS, SAMPLE_RATE } from './config.ts';

/** Anillo de audio en memoria: guarda los últimos RING_SECONDS y descarta lo anterior. */
export class AudioRingBuffer {
  private buf: Float32Array;
  private total = 0; // muestras escritas desde el inicio de la sesión

  constructor(seconds = RING_SECONDS) {
    this.buf = new Float32Array(seconds * SAMPLE_RATE);
  }

  get totalSamples(): number {
    return this.total;
  }

  write(frame: Float32Array): void {
    for (let i = 0; i < frame.length; i++) this.buf[(this.total + i) % this.buf.length] = frame[i];
    this.total += frame.length;
  }

  /** Copia [start, end) muestras de sesión; null si ese tramo ya se sobrescribió o aún no existe. */
  read(start: number, end: number): Float32Array | null {
    if (end > this.total || start < 0 || this.total - start > this.buf.length) return null;
    const out = new Float32Array(end - start);
    for (let i = 0; i < out.length; i++) out[i] = this.buf[(start + i) % this.buf.length];
    return out;
  }

  clear(): void {
    this.buf.fill(0);
    this.total = 0;
  }
}

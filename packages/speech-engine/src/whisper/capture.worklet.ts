/**
 * AudioWorklet: corre en el hilo de audio, sin bloquear la interfaz.
 * Recibe el micrófono, lo deja en 16 kHz mono y lo empaqueta en frames de 512 muestras (32 ms).
 *
 * Normalmente el AudioContext ya se crea a 16 kHz (Chrome remuestrea el micrófono por nosotros)
 * y aquí no hay nada que convertir. Si algún navegador ignora el 16 kHz, hay un remuestreo
 * lineal de respaldo (sencillo, con algo de aliasing: solo para no fallar).
 *
 * El audio NO se guarda aquí: cada frame se envía al hilo principal y este código no retiene nada.
 */

// Tipos mínimos del ámbito de AudioWorklet (TypeScript no los incluye en lib.dom).
declare const sampleRate: number;
declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
  abstract process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void;

const TARGET_RATE = 16000;
const FRAME = 512;

class CaptureProcessor extends AudioWorkletProcessor {
  private frame = new Float32Array(FRAME);
  private filled = 0;
  // --- estado del remuestreo lineal de respaldo ---
  private ratio = sampleRate / TARGET_RATE; // 1 cuando ya estamos a 16 kHz
  private pending: Float32Array = new Float32Array(0);
  private pos = 0;

  process(inputs: Float32Array[][]): boolean {
    const ch = inputs[0]?.[0];
    if (!ch) return true; // sin micrófono conectado todavía

    let samples = ch;
    if (this.ratio !== 1) samples = this.resample(ch);

    for (let i = 0; i < samples.length; i++) {
      this.frame[this.filled++] = samples[i];
      if (this.filled === FRAME) {
        const out = this.frame.slice(); // copia: el buffer se transfiere y no se comparte
        this.port.postMessage(out, [out.buffer]);
        this.filled = 0;
      }
    }
    return true; // seguir vivo
  }

  private resample(input: Float32Array): Float32Array {
    const buf = new Float32Array(this.pending.length + input.length);
    buf.set(this.pending, 0);
    buf.set(input, this.pending.length);
    const out: number[] = [];
    while (this.pos + 1 < buf.length) {
      const i = Math.floor(this.pos);
      const frac = this.pos - i;
      out.push(buf[i] * (1 - frac) + buf[i + 1] * frac);
      this.pos += this.ratio;
    }
    const consumed = Math.floor(this.pos);
    this.pending = buf.slice(consumed);
    this.pos -= consumed;
    return Float32Array.from(out);
  }
}

registerProcessor('capture-processor', CaptureProcessor);

// Convierte el archivo en módulo para que las declaraciones de arriba no sean globales.
export {};

import { AudioContext, type AudioBuffer, type AudioBufferSourceNode, type GainNode } from 'react-native-audio-api';
import { allTimbres, LAYERS, SAMPLE_RATE_DEFAULT, type AudioOutput, type Layer } from '@lee-conmigo/music-engine';

/** Volumen general de partida: prudente (los niños usan audífonos). La pantalla de prueba lo deja bajar o subir un poco. */
export const DEFAULT_VOLUME = 0.6;

/**
 * Salida de audio real (AR-T1): sube los timbres sintetizados al reproductor nativo y programa cada golpe en el RELOJ DE AUDIO
 * (`AudioContext.currentTime`). No usa micrófono, ni archivos, ni red. Toda la lógica musical vive en `@lee-conmigo/music-engine`.
 */
export class NativeAudioOutput implements AudioOutput {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly buffers = new Map<Layer, AudioBuffer>();
  private active = new Set<AudioBufferSourceNode>();

  constructor(sampleRate = SAMPLE_RATE_DEFAULT) {
    this.ctx = new AudioContext({ sampleRate });
    this.master = this.ctx.createGain();
    this.master.gain.value = DEFAULT_VOLUME;
    this.master.connect(this.ctx.destination);
    const sr = this.ctx.sampleRate;
    const timbres = allTimbres(sr);
    for (const layer of LAYERS) {
      const data = timbres[layer];
      const buf = this.ctx.createBuffer(1, data.length, sr);
      buf.copyToChannel(data as Float32Array<ArrayBuffer>, 0);
      this.buffers.set(layer, buf);
    }
  }

  get sampleRate(): number {
    return this.ctx.sampleRate;
  }

  get state(): string {
    return this.ctx.state;
  }

  async resume(): Promise<void> {
    await this.ctx.resume();
  }

  setVolume(v: number): void {
    this.master.gain.value = Math.min(1, Math.max(0, v));
  }

  now(): number {
    return this.ctx.currentTime;
  }

  play(layer: Layer, time: number): void {
    const buffer = this.buffers.get(layer);
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.master);
    src.onEnded = () => this.active.delete(src);
    this.active.add(src);
    src.start(Math.max(time, this.ctx.currentTime));
  }

  stopAll(): void {
    for (const s of this.active) {
      try {
        s.stop();
      } catch {
        // ya había terminado
      }
    }
    this.active.clear();
  }

  async dispose(): Promise<void> {
    this.stopAll();
    await this.ctx.close();
  }
}

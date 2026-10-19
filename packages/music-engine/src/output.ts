import type { Layer } from './pattern.ts';

/**
 * Lo único que el secuenciador sabe del sonido (regla de oro: la interfaz nunca depende de una librería de audio).
 * Real: `react-native-audio-api` (apps/mobile). Falso: `FakeAudioOutput`, para probar sin dispositivo.
 * Todos los tiempos son segundos del RELOJ DE AUDIO (`now()`), nunca del temporizador de la interfaz.
 */
export interface AudioOutput {
  /** Reloj de audio en segundos (monótono). */
  now(): number;
  /** Programa el sonido de una capa para el instante `time` (≥ now()). */
  play(layer: Layer, time: number): void;
  /** Corta todo lo que esté sonando o programado. */
  stopAll(): void;
}

export interface PlayedEvent {
  layer: Layer;
  time: number;
}

/** Salida falsa con reloj controlado: guarda lo programado y deja avanzar el tiempo a mano. */
export class FakeAudioOutput implements AudioOutput {
  private t = 0;
  readonly events: PlayedEvent[] = [];
  stopped = 0;

  now(): number {
    return this.t;
  }

  advance(seconds: number): void {
    this.t += seconds;
  }

  setTime(seconds: number): void {
    this.t = seconds;
  }

  play(layer: Layer, time: number): void {
    this.events.push({ layer, time });
  }

  stopAll(): void {
    this.stopped++;
  }
}

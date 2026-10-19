import type { SoundId } from './sounds.ts';

/**
 * Lo único que el secuenciador sabe del sonido (regla de oro: la interfaz nunca depende de una librería de audio).
 * Real: `react-native-audio-api` (apps/mobile). Falso: `FakeAudioOutput`, para probar sin dispositivo.
 * Todos los tiempos son segundos del RELOJ DE AUDIO (`now()`), nunca del temporizador de la interfaz.
 */
export interface AudioOutput {
  /** Reloj de audio en segundos (monótono). */
  now(): number;
  /** Programa un sonido del catálogo para el instante `time` (≥ now()). */
  play(sound: SoundId, time: number): void;
  /** Corta todo lo que esté sonando o programado. */
  stopAll(): void;
}

export interface PlayedEvent {
  sound: SoundId;
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

  play(sound: SoundId, time: number): void {
    this.events.push({ sound, time });
  }

  stopAll(): void {
    this.stopped++;
  }
}

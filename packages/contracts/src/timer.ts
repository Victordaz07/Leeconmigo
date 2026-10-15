/**
 * Contrato del temporizador de lectura (docs/02-ARCHITECTURE.md y docs/03-READING-ENGINE.md).
 * El temporizador NO conoce el motor de voz: solo recibe señales de "hay lectura válida" o "silencio".
 */

export type ReadingTimerState = 'IDLE' | 'READY' | 'READING' | 'GRACE_PERIOD' | 'PAUSED' | 'RESUMING' | 'COMPLETED';

export const READING_TIMER_STATES: ReadingTimerState[] = ['IDLE', 'READY', 'READING', 'GRACE_PERIOD', 'PAUSED', 'RESUMING', 'COMPLETED'];

export interface ReadingTimer {
  readonly state: ReadingTimerState;
  /** Tiempo de lectura válida acumulado (solo avanza en READING). */
  readonly validSeconds: number;
  /** Tiempo total de la sesión. */
  readonly sessionSeconds: number;
  /** Hay voz (sin saber si es lectura). Por sí sola no reanuda ni suma tiempo válido. */
  onVoiceActivity(): void;
  /** Voz + correspondencia razonable con el texto. Es lo único que suma tiempo válido. */
  onValidReading(): void;
  /** No hay lectura válida en este momento. */
  onSilence(): void;
}

export interface ReadingTimerSnapshot {
  state: ReadingTimerState;
  validSeconds: number;
  sessionSeconds: number;
  /** Hasta qué instante (ms desde el inicio) está confirmado el estado. */
  confirmedMs: number;
  timeInStateMs: Record<ReadingTimerState, number>;
  /** Veces que se entró a PAUSED. */
  pauses: number;
}

export interface TimerTransition {
  from: ReadingTimerState;
  to: ReadingTimerState;
  /** Instante (ms desde el inicio de la sesión) al que corresponde la transición. */
  atMs: number;
  reason: string;
}

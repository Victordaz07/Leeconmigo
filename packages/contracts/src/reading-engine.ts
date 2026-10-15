import type { ReadingEvent } from './reading-events.ts';
import type { ReadingSessionState, ReadingWord } from './reading-state.ts';
import type { Unsubscribe } from './speech.ts';

/**
 * `event` es null cuando el estado cambió sin un evento del contrato (limpiezas momentáneas de la UI:
 * el "¡Muy bien!" que dura un instante, cerrar la ayuda, animación de "léeme el comienzo").
 */
export type ReadingEngineListener = (event: ReadingEvent | null, state: ReadingSessionState) => void;

/**
 * El motor de lectura, visto desde la UI. La UI se comunica con él EXCLUSIVAMENTE a través de estos
 * contratos: envía intenciones (ayuda, cerrar ayuda...) y recibe eventos + el estado resultante.
 */
export interface ReadingEngine {
  getState(): ReadingSessionState;
  /** Se llama después de cada evento con el estado ya actualizado. */
  subscribe(listener: ReadingEngineListener): Unsubscribe;
  /** Empieza la sesión de lectura con la primera página (lista de palabras esperadas). Emite `session.started`. */
  startSession(words: ReadingWord[]): void;
  /** Pasa a la siguiente página SIN reiniciar la sesión ni el temporizador. Emite `page.started`. */
  loadPage(words: ReadingWord[]): void;
  /** La app dejó de estar en primer plano: pausa la lectura y el temporizador de inmediato (docs/06). */
  suspend(): void;
  /** La app volvió: se exige lectura válida antes de seguir sumando tiempo. */
  resume(): void;
  /** El niño toca una palabra o pide ayuda (sin índice = la palabra actual / la que se saltó). */
  requestHelp(wordIndex?: number): void;
  /** "Léeme el comienzo": la app lee las primeras palabras y luego cede el turno. */
  requestReadStart(): void;
  closeHelp(): void;
  stopSession(): void;
  dispose(): void;
}

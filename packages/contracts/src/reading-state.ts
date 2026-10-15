/** Tipos base del estado de lectura (docs/03-READING-ENGINE.md). */

export interface ReadingWord {
  id: string;
  /** Texto tal como se muestra (con puntuación). */
  text: string;
  /** Posición dentro de la página (0-based). */
  index: number;
  /** Minúsculas, sin acentos ni puntuación: es lo que se compara con el reconocimiento. */
  normalized: string;
}

export type ReadingStatus = 'idle' | 'listening' | 'paused' | 'helping' | 'complete';

/** Estado mínimo definido en docs/03. */
export interface ReadingState {
  currentWordIndex: number;
  status: ReadingStatus;
}

export type WordMark = 'read' | 'skipped';
export type ReadingIssue = 'uncertain' | 'incorrect' | 'repeated' | 'skipped';
export type PauseKind = 'short' | 'long';

/**
 * Foto completa de la sesión de lectura de una página. Es lo que renderiza la UI.
 * Es un dato puro y serializable: nada de funciones ni temporizadores.
 */
export interface ReadingSessionState extends ReadingState {
  wordCount: number;
  /** false = sesión iniciada pero aún no se oyó voz ("Esperando voz"). */
  hasHeardVoice: boolean;
  wordMarks: Record<number, WordMark>;
  issue: ReadingIssue | null;
  /** Palabra a la que se refiere `issue`. */
  issueWordIndex: number | null;
  pause: PauseKind | null;
  /** Palabra con la ayuda abierta, si hay. */
  helpWordIndex: number | null;
  /** Momentánea: palabra repetida que se resalta un instante. */
  repeatedWordIndex: number | null;
  /** true justo después de superar una dificultad ("¡Muy bien!"). Momentáneo. */
  recovered: boolean;
  /** "Léeme el comienzo": la app lee las primeras palabras y luego cede el turno. */
  readStart: { fromWordIndex: number; step: number; done: boolean } | null;
  /** Índices de palabras que costaron (para el repaso final). Sin repetidos, en orden de aparición. */
  practicedWordIndices: number[];
  /** Solo para métricas internas; nunca se muestra como calificación al niño (docs/06). */
  errorCount: number;
}

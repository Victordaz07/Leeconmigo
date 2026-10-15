/**
 * Contrato de eventos entre el motor de lectura y la UI (docs/03-READING-ENGINE.md).
 *
 * La UI NUNCA sabe cómo se detectó un evento (VAD → reconocimiento → comparador → reglas):
 * solo reacciona a él. Un mismo flujo de eventos puede venir del FakeReadingEngine
 * (simulador de navegador) o de un motor real con cualquier proveedor de voz.
 */

/** Tipo de petición de ayuda. Ver nota en `help.requested`. */
export type HelpKind = 'word' | 'read-start';

export type ReadingEvent =
  | { type: 'session.started' }
  | { type: 'speech.started' }
  | { type: 'speech.stopped' }
  | { type: 'word.current'; wordIndex: number }
  | { type: 'word.correct'; wordIndex: number }
  | { type: 'word.uncertain'; wordIndex: number }
  | { type: 'word.incorrect'; wordIndex: number }
  | { type: 'word.repeated'; wordIndex: number }
  | { type: 'word.skipped'; wordIndex: number }
  /** `duration` en ms. La UI decide "corta" o "larga" según la duración (ver `PAUSE_LONG_MS`). */
  | { type: 'pause.detected'; duration: number }
  /**
   * Ayuda para una palabra (`kind` ausente o 'word'), o "léeme el comienzo" (`kind: 'read-start'`,
   * con `wordIndex` = palabra desde la que se lee).
   *
   * NOTA: docs/03 escribe esta variante como `help.requested { type: "read-start" }`, pero `type`
   * ya es el discriminante de la unión, así que se codifica como el campo opcional `kind`.
   * Es compatible hacia atrás con `{ type: 'help.requested'; wordIndex }`. Pendiente de confirmar.
   */
  | { type: 'help.requested'; wordIndex: number; kind?: HelpKind }
  /**
   * Empieza a leerse una página nueva DENTRO de la misma sesión (el temporizador y el tiempo válido siguen).
   * Es una extensión del contrato de docs/03 (que permite extenderlo como variante del mismo enum).
   */
  | { type: 'page.started' }
  | { type: 'page.completed' }
  | { type: 'story.completed' };

export type ReadingEventType = ReadingEvent['type'];

/** A partir de esta duración (ms) una pausa se considera "larga" (¿necesitas una pista?). Ajustable. */
export const PAUSE_LONG_MS = 3000;

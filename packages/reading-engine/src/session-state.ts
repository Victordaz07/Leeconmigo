/**
 * Estado de la sesión de lectura de una página, como función pura de los eventos.
 *
 * Es la lógica de "qué le pasa a la pantalla cuando ocurre X" extraída del prototipo aprobado de
 * Reading Session (docs/04-READING-SESSION.md), pero sin nada de UI: la UI solo renderiza este estado.
 * Sirve igual con el FakeReadingEngine que con un motor real: mientras los eventos sean los mismos,
 * el estado (y por tanto la pantalla) es el mismo.
 */
import { PAUSE_LONG_MS } from '@lee-conmigo/contracts';
import type { ReadingEvent, ReadingSessionState, ReadingStatus } from '@lee-conmigo/contracts';

/**
 * Acciones internas que cambian el estado sin ser un evento del contrato: limpiezas momentáneas
 * (el "¡Muy bien!" dura un instante), cierre de la ayuda, animación de "léeme el comienzo".
 */
export type SessionInternalAction =
  | { type: 'ui.help.closed' }
  | { type: 'ui.recovered.cleared' }
  | { type: 'ui.repeated.cleared' }
  | { type: 'ui.readStart.step'; step: number }
  | { type: 'ui.readStart.done' }
  | { type: 'ui.session.stopped' }
  /** Solo desarrollo: reemplaza el estado completo (saltar a un estado del prototipo). */
  | { type: 'ui.debug.loaded'; state: ReadingSessionState };

export type SessionAction = ReadingEvent | SessionInternalAction;

export function createSessionState(wordCount: number): ReadingSessionState {
  return {
    currentWordIndex: 0,
    status: 'idle',
    wordCount,
    hasHeardVoice: false,
    wordMarks: {},
    issue: null,
    issueWordIndex: null,
    pause: null,
    helpWordIndex: null,
    repeatedWordIndex: null,
    recovered: false,
    readStart: null,
    practicedWordIndices: [],
    errorCount: 0,
  };
}

const withPracticed = (list: number[], i: number, wordCount: number): number[] =>
  i >= 0 && i < wordCount && !list.includes(i) ? [...list, i] : list;

function deriveStatus(s: ReadingSessionState): ReadingStatus {
  if (s.status === 'idle' || s.status === 'complete') return s.status;
  if (s.helpWordIndex !== null) return 'helping';
  if (s.pause !== null) return 'paused';
  return 'listening';
}

export function reduceSession(state: ReadingSessionState, action: SessionAction): ReadingSessionState {
  const next = apply(state, action);
  return next === state ? state : { ...next, status: deriveStatus(next) };
}

function apply(s: ReadingSessionState, a: SessionAction): ReadingSessionState {
  // Al empezar una sesión o una página nueva se parte de cero; fuera de una sesión activa, todo se ignora.
  // (Quien emite el evento crea antes el estado con el número de palabras de la página.)
  if (a.type === 'session.started' || a.type === 'page.started') return { ...createSessionState(s.wordCount), status: 'listening' };
  if (a.type === 'ui.debug.loaded') return a.state;
  if (s.status === 'idle') return s;

  switch (a.type) {
    case 'speech.started':
      return s.hasHeardVoice ? s : { ...s, hasHeardVoice: true };
    case 'speech.stopped':
      return s;

    case 'word.current':
      return { ...s, currentWordIndex: clampIndex(a.wordIndex, s) };

    case 'word.correct': {
      // Con la ayuda abierta el niño está mirando la palabra, no leyendo: se ignora.
      if (s.helpWordIndex !== null || s.status === 'complete') return s;
      const i = a.wordIndex;
      // "Se atascó y lo superó": había una dificultad (salvo una simple repetición) o una pausa larga.
      const stuck = (s.issue !== null && s.issue !== 'repeated') || s.pause === 'long';
      const idx = Math.min(i + 1, s.wordCount);
      // El "léeme el comienzo" sigue resaltado hasta que el niño lee 2 palabras propias.
      const keepEcho = s.readStart?.done && s.currentWordIndex < s.readStart.fromWordIndex + 2 ? s.readStart : null;
      return {
        ...s,
        hasHeardVoice: true,
        wordMarks: { ...s.wordMarks, [i]: 'read' },
        currentWordIndex: idx,
        issue: null,
        issueWordIndex: null,
        pause: null,
        recovered: stuck,
        readStart: keepEcho,
      };
    }

    case 'word.uncertain':
      return {
        ...s,
        hasHeardVoice: true,
        issue: 'uncertain',
        issueWordIndex: a.wordIndex,
        pause: null,
        practicedWordIndices: withPracticed(s.practicedWordIndices, a.wordIndex, s.wordCount),
      };

    case 'word.incorrect':
      return {
        ...s,
        hasHeardVoice: true,
        issue: 'incorrect',
        issueWordIndex: a.wordIndex,
        pause: null,
        errorCount: s.errorCount + 1,
        practicedWordIndices: withPracticed(s.practicedWordIndices, a.wordIndex, s.wordCount),
      };

    case 'word.repeated':
      return { ...s, hasHeardVoice: true, issue: 'repeated', issueWordIndex: a.wordIndex, repeatedWordIndex: a.wordIndex, pause: null };

    case 'word.skipped': {
      const i = a.wordIndex;
      return {
        ...s,
        hasHeardVoice: true,
        wordMarks: { ...s.wordMarks, [i]: 'skipped' },
        currentWordIndex: Math.min(i + 1, s.wordCount),
        issue: 'skipped',
        issueWordIndex: i,
        pause: null,
        errorCount: s.errorCount + 1,
        practicedWordIndices: withPracticed(s.practicedWordIndices, i, s.wordCount),
      };
    }

    case 'pause.detected': {
      const kind = a.duration >= PAUSE_LONG_MS ? 'long' : 'short';
      return {
        ...s,
        hasHeardVoice: true,
        pause: kind,
        issue: null,
        issueWordIndex: null,
        // Una pausa larga sobre una palabra sugiere que le costó: se anota para el repaso.
        practicedWordIndices: kind === 'long' ? withPracticed(s.practicedWordIndices, s.currentWordIndex, s.wordCount) : s.practicedWordIndices,
      };
    }

    case 'help.requested': {
      if (a.kind === 'read-start') {
        return { ...s, hasHeardVoice: true, readStart: { fromWordIndex: a.wordIndex, step: -1, done: false }, pause: null, helpWordIndex: null, issue: null, issueWordIndex: null };
      }
      return {
        ...s,
        hasHeardVoice: true, // pedir ayuda ya es interacción: se sale de "esperando voz" (como el prototipo)
        helpWordIndex: a.wordIndex,
        pause: null,
        practicedWordIndices: withPracticed(s.practicedWordIndices, a.wordIndex, s.wordCount),
      };
    }

    case 'page.completed': {
      const wordMarks = { ...s.wordMarks };
      for (let i = 0; i < s.wordCount; i++) if (!wordMarks[i]) wordMarks[i] = 'read';
      return { ...s, status: 'complete', wordMarks, currentWordIndex: s.wordCount, issue: null, issueWordIndex: null, pause: null, helpWordIndex: null };
    }
    case 'story.completed':
      return { ...s, status: 'complete', pause: null, helpWordIndex: null };

    // --- acciones internas ---
    case 'ui.help.closed':
      return s.helpWordIndex === null ? s : { ...s, helpWordIndex: null, issue: null, issueWordIndex: null };
    case 'ui.recovered.cleared':
      return s.recovered ? { ...s, recovered: false } : s;
    case 'ui.repeated.cleared':
      return { ...s, repeatedWordIndex: null, issue: s.issue === 'repeated' ? null : s.issue, issueWordIndex: s.issue === 'repeated' ? null : s.issueWordIndex };
    case 'ui.readStart.step':
      return s.readStart ? { ...s, readStart: { ...s.readStart, step: a.step } } : s;
    case 'ui.readStart.done':
      return s.readStart ? { ...s, readStart: { ...s.readStart, done: true } } : s;
    case 'ui.session.stopped':
      return { ...s, status: 'idle' };
  }
}

function clampIndex(i: number, s: ReadingSessionState): number {
  return Math.max(0, Math.min(i, s.wordCount));
}

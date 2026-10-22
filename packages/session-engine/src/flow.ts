/**
 * Flujo de pantallas de la sesión de lectura (docs/04-READING-SESSION.md), como función pura.
 *
 *   home ⇄ progress · home → select → prep → reading → pageDone → question ─┬→ reading (página siguiente)
 *                                                                          └→ review → end → (home | reading)
 *
 * Separación de responsabilidades:
 *  - El ReadingEngine dice QUÉ pasa mientras el niño lee (eventos, `ReadingSessionState`).
 *  - Este flujo dice EN QUÉ PANTALLA y EN QUÉ PÁGINA estamos, lleva la pregunta de comprensión, el repaso y lo
 *    que se acumula a lo largo de las páginas (para el resumen de la sesión).
 *  - La UI solo renderiza los dos.
 *
 * Extraído de la lógica del prototipo aprobado. Nada de esto sabe de React ni de proveedores de voz.
 */
import type { ReadingSessionState, StoryPage } from '@lee-conmigo/contracts';
import { clearWrong, createReview, isLastWord, isWordComplete, nextWord, tapTile, type ReviewState, type ReviewWord } from './review.ts';

export type Screen = 'home' | 'progress' | 'select' | 'prep' | 'reading' | 'pageDone' | 'question' | 'review' | 'end';
export type ProgressTab = 0 | 1 | 2 | 3;

/** Como mucho estas preguntas de comprensión por historia: una en cada página cansa, sobre todo en los cuentos
 * largos de nivel 6 (docs/01 no fija un máximo; esto es una decisión de producto posterior). */
export const MAX_CHECKPOINTS_PER_STORY = 3;

/**
 * Qué páginas de la historia muestran de verdad su pregunta de comprensión. Si el contenido marcó más de
 * `max` páginas con `checkpoint`, se usan solo `max` bien repartidas (la primera, la de en medio y la última
 * de las que tienen checkpoint); las demás se leen seguidas, sin interrumpir.
 */
export function selectCheckpointPages(pages: Pick<StoryPage, 'checkpoint'>[], max = MAX_CHECKPOINTS_PER_STORY): Set<number> {
  const all = pages.reduce<number[]>((acc, p, i) => {
    if (p.checkpoint) acc.push(i);
    return acc;
  }, []);
  if (all.length <= max) return new Set(all);
  return new Set([all[0], all[Math.floor((all.length - 1) / 2)], all[all.length - 1]]);
}

/** Lo que se acumula de las páginas ya leídas. Solo datos derivados (docs/07): nunca audio ni texto reconocido. */
export interface SessionTotals {
  pagesRead: number;
  errorCount: number;
  wordCount: number;
  /** Claves de vocabulario de las palabras que costaron o necesitaron ayuda, sin repetidos. */
  practicedKeys: string[];
}

/** Lo que aporta una página al terminarse de leer. */
export interface PageStats {
  errorCount: number;
  wordCount: number;
  practicedKeys: string[];
}

export interface FlowState {
  screen: Screen;
  progressTab: ProgressTab;
  /** Opción elegida en la pregunta de comprensión (null = aún ninguna). */
  answer: number | null;
  /** Repaso por sílabas en curso. */
  review: ReviewState | null;
  /** Página en pantalla (0-based). */
  pageIndex: number;
  /** Página por la que se empezó la sesión (0, o el punto de reanudación). */
  startPage: number;
  /** Opciones equivocadas que se han tocado en la pregunta actual (para saber si se acertó a la primera). */
  attempts: number;
  /** Preguntas presentadas y las acertadas A LA PRIMERA (docs/09 #9: cuentan aparte, sin penalizar). */
  comprehension: { correct: number; total: number };
  totals: SessionTotals;
}

export type FlowAction =
  | { type: 'go'; screen: 'home' | 'progress' | 'select' }
  /** Abre la ficha de una historia y empieza una sesión nueva en `pageIndex` (0 = desde el principio; >0 = reanudar). */
  | { type: 'story.select'; pageIndex?: number }
  | { type: 'progress.tab'; tab: ProgressTab }
  | { type: 'prep.open' }
  | { type: 'reading.begin' }
  | { type: 'reading.pageCompleted'; stats?: PageStats }
  | { type: 'question.open' }
  | { type: 'question.pick'; index: number; correctIndex: number }
  /**
   * Continuar tras acertar la pregunta. Si no es la última página pasa a la siguiente; si lo es, va al repaso
   * (`words` = palabras del repaso; vacío → directo al final).
   */
  | { type: 'question.finish'; correctIndex: number; words: ReviewWord[]; isLastPage?: boolean }
  /** Seguir desde "página terminada" cuando la página NO tiene pregunta. */
  | { type: 'page.next'; words: ReviewWord[]; isLastPage: boolean }
  | { type: 'review.tap'; tile: number }
  | { type: 'review.clearWrong' }
  | { type: 'review.next' }
  | { type: 'restart' }
  /** "Modo lectura libre" (Modo padres): vuelve a la página anterior sin pedir la pregunta de nuevo. */
  | { type: 'free.back' }
  /**
   * "Modo lectura libre": pasa a la página siguiente de una página YA leída (el niño había vuelto atrás). No suma páginas leídas ni
   * repite la pregunta. Si era la última página, va al final.
   */
  | { type: 'free.forward'; isLastPage: boolean; words?: ReviewWord[] }
  /** Salto directo (solo herramientas de desarrollo: panel "Ir a pantalla"). */
  | { type: 'debug.set'; state: FlowState };

export const emptyTotals: SessionTotals = { pagesRead: 0, errorCount: 0, wordCount: 0, practicedKeys: [] };

export const initialFlow: FlowState = {
  screen: 'home',
  progressTab: 0,
  answer: null,
  review: null,
  pageIndex: 0,
  startPage: 0,
  attempts: 0,
  comprehension: { correct: 0, total: 0 },
  totals: emptyTotals,
};

/** Estado de una sesión nueva a partir de `pageIndex`: conserva la pestaña de progreso, borra todo lo acumulado. */
function freshSession(s: FlowState, screen: Screen, pageIndex: number): FlowState {
  return { ...initialFlow, progressTab: s.progressTab, screen, pageIndex, startPage: pageIndex };
}

/** Qué sigue cuando se cierra una página (con o sin pregunta): la página siguiente, el repaso o el final. */
function advance(s: FlowState, isLastPage: boolean, words: ReviewWord[]): FlowState {
  if (!isLastPage) return { ...s, screen: 'reading', pageIndex: s.pageIndex + 1, answer: null, attempts: 0, review: null };
  return words.length ? { ...s, screen: 'review', review: createReview(words) } : { ...s, screen: 'end', review: null };
}

export function reduceFlow(s: FlowState, a: FlowAction): FlowState {
  switch (a.type) {
    case 'go':
      return { ...s, screen: a.screen, answer: null, review: null };
    case 'story.select':
      return freshSession(s, 'select', a.pageIndex ?? 0);
    case 'progress.tab':
      return { ...s, progressTab: a.tab };
    case 'prep.open':
      return { ...s, screen: 'prep' };
    case 'reading.begin':
      // Empezar a leer desde "preparación" es una sesión nueva en la página en que estamos (0 o la de reanudación).
      return freshSession(s, 'reading', s.pageIndex);
    case 'restart':
      return freshSession(s, 'reading', 0);
    case 'reading.pageCompleted': {
      if (s.screen !== 'reading') return s;
      const stats = a.stats;
      const pagesRead = s.totals.pagesRead + 1;
      if (!stats) return { ...s, screen: 'pageDone', totals: { ...s.totals, pagesRead } };
      return {
        ...s,
        screen: 'pageDone',
        totals: {
          pagesRead,
          errorCount: s.totals.errorCount + stats.errorCount,
          wordCount: s.totals.wordCount + stats.wordCount,
          practicedKeys: [...new Set([...s.totals.practicedKeys, ...stats.practicedKeys])],
        },
      };
    }
    case 'question.open':
      return { ...s, screen: 'question', answer: null, attempts: 0 };
    case 'question.pick': {
      // Una vez acertada, la respuesta queda fija (docs/06: sin castigo, se puede reintentar hasta acertar).
      if (s.answer === a.correctIndex) return s;
      const wrong = a.index !== a.correctIndex && a.index !== s.answer;
      return { ...s, answer: a.index, attempts: s.attempts + (wrong ? 1 : 0) };
    }
    case 'question.finish': {
      if (s.answer !== a.correctIndex) return s;
      const comprehension = { total: s.comprehension.total + 1, correct: s.comprehension.correct + (s.attempts === 0 ? 1 : 0) };
      return advance({ ...s, comprehension }, a.isLastPage ?? true, a.words);
    }
    case 'page.next':
      return s.screen === 'pageDone' ? advance(s, a.isLastPage, a.words) : s;
    case 'review.tap':
      return s.review ? { ...s, review: tapTile(s.review, a.tile) } : s;
    case 'review.clearWrong':
      return s.review ? { ...s, review: clearWrong(s.review) } : s;
    case 'review.next': {
      const r = s.review;
      if (!r || !isWordComplete(r)) return s;
      return isLastWord(r) ? { ...s, screen: 'end', review: null } : { ...s, review: nextWord(r) };
    }
    case 'free.back':
      return { ...s, screen: 'reading', pageIndex: Math.max(0, s.pageIndex - 1), answer: null, attempts: 0, review: null };
    case 'free.forward':
      if (s.screen !== 'reading') return s;
      return advance(s, a.isLastPage, a.words ?? []);
    case 'debug.set':
      return a.state;
  }
}

// ---------------------------------------------------------------------------
// Estado "numerado" del prototipo (los 20 estados de docs/04), derivado — no guardado
// ---------------------------------------------------------------------------

export const SCREEN_STATE_LABELS = [
  'Selección',
  'Preparación',
  'Esperando voz',
  'Leyendo',
  'Pausa corta',
  'Pausa larga',
  'Palabra dudosa',
  'Palabra incorrecta',
  'Palabra repetida',
  'Palabra saltada',
  'Palabra difícil',
  'Pronunciación',
  '¡Muy bien!',
  'Fin de página',
  'Pregunta',
  'Fin de historia',
  'Inicio',
  'Progreso',
  'Te leo el comienzo',
  'Repaso rápido',
] as const;

/**
 * Cuál de los 20 estados del prototipo (1-20) representa lo que hay en pantalla. Se DERIVA del flujo y
 * del estado de lectura (el prototipo lo guardaba como un número aparte). `pronouncing` = la ayuda
 * está reproduciendo la pronunciación sílaba por sílaba (animación de UI).
 */
export function screenStateNumber(flow: FlowState, reading: ReadingSessionState, pronouncing = false): number {
  switch (flow.screen) {
    case 'home':
      return 17;
    case 'progress':
      return 18;
    case 'select':
      return 1;
    case 'prep':
      return 2;
    case 'pageDone':
      return 14;
    case 'question':
      return 15;
    case 'review':
      return 20;
    case 'end':
      return 16;
    case 'reading': {
      if (reading.helpWordIndex !== null) return pronouncing ? 12 : 11;
      if (reading.readStart) return 19;
      if (reading.recovered) return 13;
      if (reading.pause === 'long') return 6;
      if (reading.pause === 'short') return 5;
      if (reading.issue === 'uncertain') return 7;
      if (reading.issue === 'incorrect') return 8;
      if (reading.issue === 'repeated') return 9;
      if (reading.issue === 'skipped') return 10;
      return reading.hasHeardVoice ? 4 : 3;
    }
  }
}

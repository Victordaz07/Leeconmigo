/**
 * Resumen de una sesión de lectura: lo ÚNICO que se guarda al terminar (docs/07-PRIVACY-AUDIO.md, "Qué SÍ se
 * puede guardar"). Solo duraciones, contadores y las palabras que costaron; nunca audio ni texto reconocido.
 */
import type { LanguageCode, SessionSummary } from '@lee-conmigo/contracts';
import type { FlowState } from './flow.ts';
import { accuracyPercent, starsFor } from './stats.ts';

export interface SummaryInput {
  story: { id: string; language: LanguageCode; level: number; pageCount: number; category?: string };
  flow: FlowState;
  /** Tiempo de lectura válida acumulado por el temporizador del motor. */
  validReadingSeconds: number;
  sessionSeconds: number;
  now: Date;
}

/**
 * `completion` cuenta como leídas las páginas anteriores al punto de reanudación (se leyeron en una sesión
 * anterior). Las estrellas solo existen si se leyó al menos una página.
 */
export function buildSessionSummary({ story, flow, validReadingSeconds, sessionSeconds, now }: SummaryInput): SessionSummary {
  const { totals, comprehension } = flow;
  const completion = story.pageCount > 0 ? Math.min(1, (flow.startPage + totals.pagesRead) / story.pageCount) : 0;
  return {
    storyId: story.id,
    language: story.language,
    level: story.level,
    ...(story.category ? { category: story.category } : {}),
    validReadingSeconds: Math.round(validReadingSeconds),
    sessionSeconds: Math.round(sessionSeconds),
    comprehensionCorrect: comprehension.correct,
    comprehensionTotal: comprehension.total,
    wordsHelped: [...totals.practicedKeys],
    completion: Math.round(completion * 100) / 100,
    ...(totals.pagesRead > 0 ? { stars: starsFor(accuracyPercent(totals.errorCount, totals.wordCount)) } : {}),
    completedAt: now.toISOString(),
  };
}

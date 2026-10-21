/**
 * Logros de Kitewise (`docs/01-PRODUCT-RULES.md` §Motivación): 7 pegatinas que celebran constancia, curiosidad y esfuerzo, NO velocidad ni notas. Lógica PURA sobre
 * las estadísticas que ya se calculan del progreso de Lectura (`computeProgressStats`; las mismas reglas que el prototipo web, `apps/reader/src/build-progress.ts`).
 * Un logro ganado no se pierde; uno sin ganar se muestra con lo que falta, sin reproche.
 */
import type { ProgressStats } from '@lee-conmigo/session-engine';

export const ACHIEVEMENT_IDS = ['firstChapter', 'explorer', 'twoLanguages', 'real15', 'cameBack', 'adventurer', 'newWord'] as const;
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

/** Umbrales (docs/01). */
export const EXPLORER_STORIES = 5;
export const REAL_MINUTES = 15;
export const RETURN_DAYS = 7;
export const ADVENTURER_CATEGORIES = 5;

export interface Achievement {
  id: AchievementId;
  /** Cuánto lleva y cuánto hace falta (para «2 de 5»). */
  have: number;
  need: number;
  earned: boolean;
}

const rule = (id: AchievementId, have: number, need: number): Achievement => ({ id, have: Math.min(have, need), need, earned: have >= need });

/** Los siete logros, en el orden de la pantalla, con su avance según el progreso de lectura. */
export function achievementsOf(stats: ProgressStats): Achievement[] {
  return [
    rule('firstChapter', stats.storiesRead, 1),
    rule('explorer', stats.storiesRead, EXPLORER_STORIES),
    rule('twoLanguages', stats.languagesUsed.length, 2),
    rule('real15', stats.totalMinutes, REAL_MINUTES),
    rule('cameBack', stats.activeDays, RETURN_DAYS),
    rule('adventurer', stats.categoriesRead.length, ADVENTURER_CATEGORIES),
    rule('newWord', stats.masteredWords.length, 1),
  ];
}

export const earnedCount = (list: readonly Achievement[]): number => list.filter((a) => a.earned).length;

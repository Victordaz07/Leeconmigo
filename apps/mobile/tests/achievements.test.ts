import { describe, expect, it } from 'vitest';
import type { ProgressStats } from '@lee-conmigo/session-engine';
import { ACHIEVEMENT_IDS, achievementsOf, earnedCount, EXPLORER_STORIES, RETURN_DAYS } from '../src/achievements.ts';
import { ACHIEVEMENTS_COPY } from '../src/achievements-copy.ts';

const base = (o: Partial<ProgressStats> = {}): ProgressStats => ({
  storiesRead: 0, totalMinutes: 0, comprehensionAccuracy: 100, streakDays: 0, starsTotal: 0, week: [], practicedWords: [], languagesUsed: [], activeDays: 0, categoriesRead: [], masteredWords: [], ...o,
});
const by = (stats: ProgressStats) => Object.fromEntries(achievementsOf(stats).map((a) => [a.id, a]));

describe('logros', () => {
  it('son siete, en orden, y sin progreso no hay ninguno ganado (sin reproche: solo «0 de N»)', () => {
    const list = achievementsOf(base());
    expect(list.map((a) => a.id)).toEqual([...ACHIEVEMENT_IDS]);
    expect(earnedCount(list)).toBe(0);
    expect(list.every((a) => a.have === 0 && a.need >= 1)).toBe(true);
  });

  it('cada logro se gana con su regla (docs/01) y no antes', () => {
    expect(by(base({ storiesRead: 1 })).firstChapter!.earned).toBe(true);
    expect(by(base({ storiesRead: EXPLORER_STORIES - 1 })).explorer!.earned).toBe(false);
    expect(by(base({ storiesRead: EXPLORER_STORIES })).explorer!.earned).toBe(true);
    expect(by(base({ languagesUsed: ['es'] })).twoLanguages!.earned).toBe(false);
    expect(by(base({ languagesUsed: ['es', 'en'] })).twoLanguages!.earned).toBe(true);
    expect(by(base({ totalMinutes: 14 })).real15!.earned).toBe(false);
    expect(by(base({ totalMinutes: 15 })).real15!.earned).toBe(true);
    expect(by(base({ activeDays: RETURN_DAYS - 1 })).cameBack!.earned).toBe(false);
    expect(by(base({ activeDays: RETURN_DAYS })).cameBack!.earned).toBe(true);
    expect(by(base({ categoriesRead: ['a', 'b', 'c', 'd'] })).adventurer!.earned).toBe(false);
    expect(by(base({ categoriesRead: ['a', 'b', 'c', 'd', 'e'] })).adventurer!.earned).toBe(true);
    expect(by(base({ masteredWords: ['luciérnaga'] })).newWord!.earned).toBe(true);
  });

  it('el avance no pasa de lo que hace falta', () => {
    const a = by(base({ storiesRead: 40 })).explorer!;
    expect([a.have, a.need]).toEqual([EXPLORER_STORIES, EXPLORER_STORIES]);
  });

  it('todos tienen nombre, texto de ganado y pista en español e inglés, sin reproches', () => {
    for (const lang of ['es', 'en'] as const) {
      for (const id of ACHIEVEMENT_IDS) {
        const t = ACHIEVEMENTS_COPY[lang].badges[id];
        expect(t.name && t.earned && t.hint, `${lang} ${id}`).toBeTruthy();
        expect((t.hint + t.earned).toLowerCase()).not.toMatch(/incorrect|wrong|fall|fail|perdiste|lost/);
      }
    }
  });
});

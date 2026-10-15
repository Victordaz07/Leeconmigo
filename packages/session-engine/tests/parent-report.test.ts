import { describe, expect, it } from 'vitest';
import type { SessionSummary } from '@lee-conmigo/contracts';
import { todayReport } from '../src/index.ts';

const NOW = new Date(2026, 9, 15, 18, 0); // jueves
const at = (d: number, h: number) => new Date(2026, 9, d, h, 0).toISOString();
const s = (over: Partial<SessionSummary>): SessionSummary => ({
  storyId: 'a', language: 'es', level: 3, validReadingSeconds: 300, sessionSeconds: 400, comprehensionCorrect: 1, comprehensionTotal: 1,
  wordsHelped: [], completion: 1, completedAt: at(15, 10), ...over,
});

describe('Hoy con el niño (P2)', () => {
  it('suma solo lo de hoy y agrupa por historia, lo más reciente primero', () => {
    const r = todayReport(
      [
        s({ storyId: 'ayer', completedAt: at(14, 10), validReadingSeconds: 900 }),
        s({ storyId: 'a', completion: 0.5, comprehensionCorrect: 0, comprehensionTotal: 1, wordsHelped: ['luna'], energy: 'baja' }),
        s({ storyId: 'b', completedAt: at(15, 12), validReadingSeconds: 240, wordsHelped: ['puerta', 'luna'], focusSelfReport: 3 }),
        s({ storyId: 'a', completedAt: at(15, 11), comprehensionCorrect: 2, comprehensionTotal: 2 }),
      ],
      15,
      NOW,
    );
    expect(r.validMinutes).toBe(14);
    expect(r.goalMinutes).toBe(15);
    expect([r.comprehensionCorrect, r.comprehensionTotal]).toEqual([3, 4]);
    expect(r.activities.map((a) => [a.storyId, a.minutes, a.completed])).toEqual([
      ['b', 4, true],
      ['a', 10, true],
    ]);
    expect(r.focusSelfReport).toBe(3);
    expect(r.energy).toBe('baja');
    expect(r.wordsToday).toEqual(['luna', 'puerta']);
    expect(r.week.find((d) => d.day === 'Mié')?.minutes).toBe(15);
  });

  it('sin nada hoy: todo en cero o vacío, nada inventado', () => {
    const r = todayReport([s({ completedAt: at(14, 9) })], 15, NOW);
    expect(r).toMatchObject({ validMinutes: 0, comprehensionTotal: 0, focusSelfReport: null, energy: null, activities: [], wordsToday: [] });
  });
});

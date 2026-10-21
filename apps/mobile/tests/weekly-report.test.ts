import { describe, expect, it } from 'vitest';
import type { SessionSummary } from '@lee-conmigo/contracts';
import { weeklyReport } from '../src/weekly-report';
import { esc, reportFileName, weekRange, weeklyReportHtml } from '../src/weekly-report-html';

// miércoles 21 de octubre de 2026 (la semana va del lunes 19 al domingo 25)
const NOW = new Date(2026, 9, 21, 12, 0, 0);
const at = (y: number, m: number, d: number, h = 10) => new Date(y, m, d, h).toISOString();
const base: SessionSummary = { storyId: 's1', language: 'es', level: 2, validReadingSeconds: 600, sessionSeconds: 700, comprehensionCorrect: 2, comprehensionTotal: 3, wordsHelped: ['luna'], completion: 1, completedAt: at(2026, 9, 19) };

describe('weeklyReport', () => {
  it('suma solo lo de la semana, por día y por historia', () => {
    const r = weeklyReport(
      [base, { ...base, completedAt: at(2026, 9, 21), validReadingSeconds: 300, wordsHelped: ['luna', 'puerta'], completion: 0.5, storyId: 's2', focusSelfReport: 3 }, { ...base, completedAt: at(2026, 9, 12) }],
      10,
      NOW,
    );
    expect(r.days.map((d) => d.minutes)).toEqual([10, 0, 5, 0, 0, 0, 0]);
    expect(r.totalMinutes).toBe(15);
    expect(r.activeDays).toBe(2);
    expect(r.goalDays).toBe(1);
    expect(r.sessions).toBe(2);
    expect(r.words).toEqual(['luna', 'puerta']);
    expect(r.comprehensionTotal).toBe(6);
    expect(r.focus).toEqual({ 1: 0, 2: 0, 3: 1 });
    expect(r.stories.map((s) => s.storyId)).toEqual(['s2', 's1']);
    expect(r.stories.find((s) => s.storyId === 's2')?.completed).toBe(false);
  });
  it('una semana sin lectura sale vacía, sin inventar nada', () => {
    const r = weeklyReport([], 10, NOW);
    expect(r.totalMinutes).toBe(0);
    expect(r.stories).toEqual([]);
    expect(r.words).toEqual([]);
  });
  it('la semana anterior se calcula aparte', () => {
    const r = weeklyReport([{ ...base, completedAt: at(2026, 9, 14) }], 10, NOW, 1);
    expect(r.totalMinutes).toBe(10);
    expect(weekRange(r.monday, r.sunday)).toBe('12–18 oct');
  });
});

describe('weeklyReportHtml', () => {
  it('escapa los datos y no trae nada externo', () => {
    const r = weeklyReport([{ ...base, wordsHelped: ['<script>alert(1)</script>'] }], 10, NOW);
    const html = weeklyReportHtml({ childName: 'Noah "<b>"', report: r, titleOf: (id) => `Título <${id}>` });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).toContain('Sin datos de voz');
  });
  it('esc y el nombre de archivo', () => {
    expect(esc(`a&b<c>"d'`)).toBe('a&amp;b&lt;c&gt;&quot;d&#39;');
    expect(reportFileName('Noé Pérez', new Date(2026, 9, 19))).toBe('kitewise-noe-perez-2026-10-19');
  });
  it('un rango que cruza de mes', () => {
    expect(weekRange(new Date(2026, 8, 28), new Date(2026, 9, 4))).toBe('28 sep–4 oct');
  });
});

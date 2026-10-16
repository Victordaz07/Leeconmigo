import { describe, expect, it } from 'vitest';
import { addDays, dueSkills, skillStatus, updateReviews, warmupSize, type MathAttempt, type ReviewEntry } from '../src/index.ts';

let n = 0;
const at = (day: string, ok: boolean, extra: Partial<MathAttempt> = {}): MathAttempt => ({ skillId: 's', variantId: `v${n++}`, day, firstCorrect: ok, maxHintLevel: 0, constructed: true, ...extra });

describe('dominio por habilidad', () => {
  it('sin respuestas: nada; una respuesta: explorando; dos aciertos independientes: practicando', () => {
    expect(skillStatus([]).mastery).toBe('none');
    expect(skillStatus([at('2026-10-01', false)]).mastery).toBe('explorando');
    expect(skillStatus([at('2026-10-01', true), at('2026-10-01', true)]).mastery).toBe('practicando');
  });

  it('acertar tras ver una pista o repetir el mismo reto no cuenta como evidencia independiente', () => {
    const same = at('2026-10-01', true);
    expect(skillStatus([same, { ...same }]).mastery).toBe('explorando');
    expect(skillStatus([at('2026-10-01', true, { maxHintLevel: 2 }), at('2026-10-01', true, { maxHintLevel: 3 })]).mastery).toBe('explorando');
  });

  const tenOver = (days: string[], correct = 10) => days.map((d, i) => at(d, i < correct || i >= days.length - (10 - correct) ? i < correct : false));

  it('dominado: 8 de las últimas 10, en 3 días o más, con aciertos demorados a 3 y 7 días', () => {
    const days = ['2026-10-01', '2026-10-01', '2026-10-01', '2026-10-01', '2026-10-04', '2026-10-04', '2026-10-04', '2026-10-08', '2026-10-08', '2026-10-08'];
    expect(skillStatus(tenOver(days)).mastery).toBe('dominado');
    // Todo en un solo día no es dominio (es práctica masiva).
    expect(skillStatus(tenOver(days.map(() => '2026-10-01'))).mastery).toBe('practicando');
    // Sin la comprobación a 7 días, todavía no.
    expect(skillStatus(tenOver(days.map((d) => (d === '2026-10-08' ? '2026-10-04' : d)))).mastery).toBe('practicando');
  });

  it('un fallo no quita "dominado"; dos fallos en días distintos piden repaso sin borrar el logro', () => {
    const days = ['2026-10-01', '2026-10-01', '2026-10-01', '2026-10-01', '2026-10-04', '2026-10-04', '2026-10-04', '2026-10-08', '2026-10-08', '2026-10-08'];
    const base = tenOver(days);
    const oneMiss = [...base, at('2026-10-09', false)];
    expect(skillStatus(oneMiss)).toMatchObject({ mastery: 'dominado', needsReview: false });
    const twoMisses = [...oneMiss, at('2026-10-10', false)];
    expect(skillStatus(twoMisses)).toMatchObject({ mastery: 'dominado', needsReview: true });
  });
});

describe('repaso 1-3-7', () => {
  const d0 = '2026-10-01';

  it('un fallo abre UNA entrada por habilidad, con retornos a +1, +3 y +7', () => {
    let r: ReviewEntry[] = [];
    r = updateReviews(r, at(d0, false));
    r = updateReviews(r, at(d0, false)); // otro fallo el mismo día: no duplica
    expect(r).toHaveLength(1);
    expect(r[0].dueDays).toEqual([addDays(d0, 1), addDays(d0, 3), addDays(d0, 7)]);
    expect(updateReviews([], at(d0, true))).toEqual([]); // acertar a la primera no crea repaso
  });

  it('acertar en cada retorno lo marca; tras +7 se agregan +14 y +30', () => {
    let r = updateReviews([], at(d0, false, { maxHintLevel: 1, firstCorrect: true }));
    for (const off of [1, 3, 7]) r = updateReviews(r, at(addDays(d0, off), true));
    expect(Object.keys(r[0].done)).toHaveLength(3);
    expect(r[0].dueDays).toContain(addDays(d0, 14));
    expect(r[0].dueDays).toContain(addDays(d0, 30));
  });

  it('fallar en un retorno empieza un ciclo nuevo; faltar días no castiga: lo vencido sigue disponible', () => {
    let r = updateReviews([], at(d0, false));
    r = updateReviews(r, at(addDays(d0, 1), false));
    expect(r[0].startDay).toBe(addDays(d0, 1));
    expect(dueSkills(r, addDays(d0, 20), 3)).toEqual(['s']);
  });

  it('el calentamiento toma pocas habilidades, las más atrasadas primero', () => {
    const r: ReviewEntry[] = [
      { skillId: 'b', startDay: d0, dueDays: [addDays(d0, 3)], done: {} },
      { skillId: 'a', startDay: d0, dueDays: [addDays(d0, 1)], done: {} },
      { skillId: 'c', startDay: d0, dueDays: [addDays(d0, 9)], done: {} },
    ];
    expect(dueSkills(r, addDays(d0, 5), 2)).toEqual(['a', 'b']);
    expect([warmupSize(8), warmupSize(15), warmupSize(20)]).toEqual([2, 3, 4]);
  });
});

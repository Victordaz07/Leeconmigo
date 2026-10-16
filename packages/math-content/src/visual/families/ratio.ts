/**
 * L. Razones (6.RP.1, 6.RP.3): "a medidas de azul por cada b de naranja". La mezcla se arma por LOTES completos, así se
 * ve que mantener la razón es multiplicar las dos cantidades, no sumar lo mismo a las dos (error que se nombra).
 */
import { isInt, num, result, type FamilyDef } from './common.ts';

export const ratio: FamilyDef<'ratio'> = {
  kind: 'ratio',
  fields: () => ['answer'],
  init: () => ({ kind: 'ratio', lots: 1, values: {} }),
  solution: (m) => ({ kind: 'ratio', lots: m.lots, values: { answer: String(m.a * m.lots) } }),
  apply(_m, w, a) {
    if (a.type === 'addLot' && w.lots < 8) return { ...w, lots: w.lots + 1 };
    if (a.type === 'removeLot' && w.lots > 1) return { ...w, lots: w.lots - 1 };
    return w;
  },
  evaluate(m, w) {
    if (w.lots < 1) return result('invalid', 'common.invalid');
    if (w.lots !== m.lots) return result(w.lots < m.lots ? 'incomplete' : 'incorrect', 'ratio.lots', { orange: m.b * m.lots, b: m.b });
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    // Error típico: sumar la misma cantidad a las dos partes (2:1 → con 3 naranjas, 2 + 2 = 4 azules).
    if (answer === m.a + (m.b * m.lots - m.b)) return result('incorrect', 'ratio.additive', { a: m.a, b: m.b });
    if (answer !== m.a * m.lots) return result('incorrect', 'ratio.countBlue', { a: m.a });
    return result('correct', 'ratio.explain', { a: m.a, b: m.b, lots: m.lots, blue: m.a * m.lots, orange: m.b * m.lots });
  },
  problems(m) {
    const p: string[] = [];
    if (![m.a, m.b, m.lots].every((n) => isInt(n) && n >= 1)) p.push('enteros');
    if (m.a === m.b) p.push('razón 1:1');
    if (m.lots < 2) p.push('al menos 2 lotes');
    return p;
  },
  example: (m) => (m.a === 3 && m.b === 2 ? { a: 2, b: 1, lots: 4, blue: 8, orange: 4 } : { a: 3, b: 2, lots: 3, blue: 9, orange: 6 }),
  templates: [
    {
      id: 'ratio.scale',
      version: 1,
      skillId: 'g6.rp.ratioTables',
      grades: [5, 6],
      generate: (r) => {
        const b = r.int(1, 3);
        let a = r.int(2, 5);
        if (a === b) a += 1;
        return { kind: 'ratio', a, b, lots: r.int(2, 5), task: 'scale' };
      },
    },
  ],
};

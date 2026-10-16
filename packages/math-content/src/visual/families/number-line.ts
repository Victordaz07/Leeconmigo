/**
 * C. Recta numérica (2.MD.6, 3.NF.2). Posiciones en numeradores sobre `denominator`. Sumar y restar con saltos de 1 y
 * de 10 (estrategia de contar hacia adelante / atrás), o ubicar una fracción contando intervalos (no marcas).
 */
import { num, pick, result, type FamilyDef } from './common.ts';

export const numberLine: FamilyDef<'numberLine'> = {
  kind: 'numberLine',
  fields: (m) => (m.task === 'locate' ? [] : ['answer']),
  init: (m) => ({ kind: 'numberLine', pos: m.start, path: [m.start], values: {} }),
  solution: (m) => ({ kind: 'numberLine', pos: m.target, path: [m.start, m.target], values: m.task === 'locate' ? {} : { answer: String(m.target) } }),
  apply(m, w, a) {
    const to = a.type === 'jump' ? w.pos + a.size : a.type === 'setPos' ? a.pos : null;
    if (to === null) return w;
    if (a.type === 'jump' && !m.jumps.includes(a.size) && m.task !== 'locate') return w;
    if (!Number.isInteger(to) || to < m.min || to > m.max || to === w.pos) return w;
    return { ...w, pos: to, path: [...w.path, to].slice(-30) };
  },
  evaluate(m, w) {
    if (w.pos < m.min || w.pos > m.max) return result('invalid', 'common.invalid');
    if (m.task === 'locate') {
      if (w.pos === m.start && m.start !== m.target) return result('incomplete', 'numberLine.moveMarker');
      if (w.pos !== m.target) return result('incorrect', 'numberLine.countParts', { denominator: m.denominator });
      return result('correct', 'numberLine.explainLocate', { numerator: m.target, denominator: m.denominator });
    }
    const n = Math.abs(m.target - m.start);
    if (w.pos === m.start) return result('incomplete', 'numberLine.jump', { start: m.start });
    if (w.pos !== m.target) return result('incorrect', (m.task === 'add') === w.pos > m.target ? 'numberLine.tooFar' : 'numberLine.notYet', { start: m.start, n });
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    if (answer !== m.target) return result('incorrect', 'numberLine.whereLanded');
    const tens = Math.floor(n / 10);
    return result('correct', m.task === 'add' ? 'numberLine.explainAdd' : 'numberLine.explainSubtract', { start: m.start, n, target: m.target, tens, ones: n % 10 });
  },
  problems(m) {
    const p: string[] = [];
    if (m.min >= m.max || m.start < m.min || m.start > m.max || m.target < m.min || m.target > m.max) p.push('rango');
    if (m.task !== 'locate' && m.target === m.start) p.push('sin salto');
    if (m.task === 'add' && m.target < m.start) p.push('suma hacia atrás');
    if (m.task === 'subtract' && m.target > m.start) p.push('resta hacia adelante');
    if (m.task === 'locate' && (m.target % m.denominator === 0 || m.target === m.start)) p.push('fracción trivial');
    return p;
  },
  example: (m): Record<string, number> => (m.task === 'locate' ? { numerator: m.denominator === 4 ? 1 : 2, denominator: m.denominator === 4 ? 3 : 4 } : { start: m.start === 20 ? 30 : 20, n: 14, target: (m.start === 20 ? 30 : 20) + (m.task === 'add' ? 14 : -14) }),
  templates: [
    {
      id: 'numberLine.add20',
      version: 1,
      skillId: 'g1.oa.countOn',
      grades: [1, 2],
      generate: (r) => {
        const start = r.int(3, 11);
        return { kind: 'numberLine', denominator: 1, min: 0, max: 20, labelEvery: 5, start, target: start + r.int(3, 8), jumps: [1, -1], task: 'add' };
      },
    },
    {
      id: 'numberLine.add100',
      version: 1,
      skillId: 'g2.nbt.add100',
      grades: [2, 3],
      generate: (r) => {
        const start = r.int(12, 49);
        return { kind: 'numberLine', denominator: 1, min: 0, max: 100, labelEvery: 10, start, target: start + r.int(1, 4) * 10 + r.int(1, 9), jumps: [10, 1, -1, -10], task: 'add' };
      },
    },
    {
      id: 'numberLine.subtract100',
      version: 1,
      skillId: 'g2.nbt.subtract100',
      grades: [2, 3],
      generate: (r) => {
        const start = r.int(55, 95);
        return { kind: 'numberLine', denominator: 1, min: 0, max: 100, labelEvery: 10, start, target: start - r.int(1, 4) * 10 - r.int(1, 9), jumps: [-10, -1, 1, 10], task: 'subtract' };
      },
    },
    {
      id: 'numberLine.fraction',
      version: 1,
      skillId: 'g3.nf.numberLine',
      grades: [3, 4],
      generate: (r) => {
        const d = pick(r, [2, 3, 4, 6, 8] as const);
        // De 0 a 2: también fracciones mayores que 1 (3.NF.2b), nunca un número entero.
        let n = r.int(1, 2 * d - 1);
        if (n % d === 0) n += 1;
        return { kind: 'numberLine', denominator: d, min: 0, max: 2 * d, labelEvery: d, start: 0, target: n, jumps: [1, -1], task: 'locate' };
      },
    },
  ],
};

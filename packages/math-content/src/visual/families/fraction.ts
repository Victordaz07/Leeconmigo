/**
 * F. Fracciones (3.NF.1, 3.NF.3, 4.NF.1). El entero se parte en partes de igual área (las dibuja la app sobre la pizza,
 * el pastel o una barra). Colorear n/d acepta cualquier n partes; en equivalentes vale cualquier cantidad que valga lo
 * mismo (a/b = c/d si a·d = c·b, con enteros: nunca decimales).
 */
import { isInt, num, pick, result, type FamilyDef } from './common.ts';

const SHAPES = ['bar', 'pizza', 'cake'] as const;

/** Partes coloreadas de partida en "name": las primeras n (el niño las cuenta, no las colorea). */
const firstN = (d: number, n: number) => Array.from({ length: d }, (_, i) => i < n);

export const fraction: FamilyDef<'fraction'> = {
  kind: 'fraction',
  fields: (m) => (m.task === 'color' ? [] : ['numerator', 'denominator']),
  init: (m) => ({ kind: 'fraction', shaded: m.task === 'name' ? firstN(m.denominator, m.numerator) : Array(m.denominator).fill(false), values: {} }),
  solution: (m) => ({
    kind: 'fraction',
    shaded: firstN(m.denominator, m.numerator),
    values: m.task === 'color' ? {} : { numerator: String(m.numerator), denominator: String(m.denominator) },
  }),
  apply(m, w, a) {
    if (a.type !== 'togglePart' || m.task === 'name' || a.index < 0 || a.index >= m.denominator) return w;
    return { ...w, shaded: w.shaded.map((s, i) => (i === a.index ? !s : s)) };
  },
  evaluate(m, w) {
    if (w.shaded.length !== m.denominator) return result('invalid', 'common.invalid');
    const count = w.shaded.filter(Boolean).length;
    if (m.task === 'color') {
      if (count === 0) return result('incomplete', 'fraction.start');
      if (count !== m.numerator) return result('incorrect', 'fraction.countColored', { numerator: m.numerator, denominator: m.denominator });
      return result('correct', 'fraction.explainColor', { numerator: m.numerator, denominator: m.denominator });
    }
    if (m.task === 'equivalent') {
      const ref = m.ref!;
      if (count === 0) return result('incomplete', 'fraction.start');
      if (count * ref.denominator !== ref.numerator * m.denominator) return result('incorrect', 'fraction.sameAmount', { refNumerator: ref.numerator, refDenominator: ref.denominator });
    }
    const n = num(w.values.numerator);
    const d = num(w.values.denominator);
    if (n === null || d === null) return result('incomplete', 'common.writeAll');
    if (d !== m.denominator) return result('incorrect', 'fraction.denominator');
    if (n !== count) return result('incorrect', 'fraction.numerator');
    if (m.task === 'equivalent') return result('correct', 'fraction.explainEquivalent', { numerator: n, denominator: d, refNumerator: m.ref!.numerator, refDenominator: m.ref!.denominator });
    return result('correct', 'fraction.explainName', { numerator: n, denominator: d });
  },
  problems(m) {
    const p: string[] = [];
    if (!isInt(m.numerator) || !isInt(m.denominator) || m.denominator < 2 || m.denominator > 12) p.push('partes');
    if (m.numerator < 1 || m.numerator >= m.denominator) p.push('fracción propia');
    if (m.task === 'equivalent') {
      const r = m.ref;
      if (!r || r.denominator === m.denominator || m.numerator * r.denominator !== r.numerator * m.denominator) p.push('equivalente');
    }
    return p;
  },
  example: (m) => (m.denominator === 4 ? { numerator: 2, denominator: 6 } : { numerator: 3, denominator: 4 }),
  templates: [
    {
      id: 'fraction.color',
      version: 1,
      skillId: 'g3.nf.unitParts',
      grades: [3, 3],
      generate: (r) => {
        const d = pick(r, [2, 3, 4, 6, 8] as const);
        return { kind: 'fraction', shape: pick(r, SHAPES), denominator: d, numerator: r.int(1, d - 1), task: 'color' };
      },
    },
    {
      id: 'fraction.name',
      version: 1,
      skillId: 'g3.nf.name',
      grades: [3, 4],
      generate: (r) => {
        const d = pick(r, [3, 4, 5, 6, 8] as const);
        return { kind: 'fraction', shape: pick(r, SHAPES), denominator: d, numerator: r.int(1, d - 1), task: 'name' };
      },
    },
    {
      id: 'fraction.equivalent',
      version: 1,
      skillId: 'g4.nf.equivalent',
      grades: [3, 4],
      generate: (r) => {
        const ref = pick(r, [
          { numerator: 1, denominator: 2 },
          { numerator: 1, denominator: 3 },
          { numerator: 2, denominator: 3 },
          { numerator: 1, denominator: 4 },
          { numerator: 3, denominator: 4 },
        ] as const);
        const k = ref.denominator === 4 ? 2 : pick(r, [2, 3] as const);
        return { kind: 'fraction', shape: pick(r, SHAPES), denominator: ref.denominator * k, numerator: ref.numerator * k, task: 'equivalent', ref: { ...ref } };
      },
    },
  ],
};

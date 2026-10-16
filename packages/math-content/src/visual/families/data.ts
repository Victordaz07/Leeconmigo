/**
 * J. Datos (2.MD.10, 3.MD.3): construir una gráfica de barras desde una tabla, leerla, comparar ("¿cuántos más?") y
 * sumar. En 3.º la escala va de 2 en 2: la altura de la barra sale del dato y la escala, nunca de un dibujo.
 */
import type { FruitId } from '../model.ts';
import type { IntRng } from '../rng.ts';
import { isInt, num, result, type FamilyDef } from './common.ts';

const FRUITS: FruitId[] = ['mango', 'pera', 'uva', 'manzana'];

/** Valores distintos entre sí (para que "¿cuál tiene más?" tenga una sola respuesta), múltiplos de la escala. */
function distinctValues(r: IntRng, count: number, scale: number, maxSteps: number): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const v = r.int(1, maxSteps) * scale;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

function askDiff(values: number[], r: IntRng): number[] {
  const i = r.int(0, values.length - 1);
  let j = r.int(0, values.length - 1);
  if (j === i) j = (i + 1) % values.length;
  return values[i] >= values[j] ? [i, j] : [j, i];
}

export const dataAnswer = (m: { task: string; values: number[]; ask: number[] }) =>
  m.task === 'read' ? m.values[m.ask[0]] : m.task === 'difference' ? m.values[m.ask[0]] - m.values[m.ask[1]] : m.values.reduce((a, b) => a + b, 0);

export const data: FamilyDef<'data'> = {
  kind: 'data',
  fields: (m) => (m.task === 'build' ? [] : ['answer']),
  init: (m) => ({ kind: 'data', bars: m.task === 'build' ? Array(m.values.length).fill(0) : [...m.values], values: {} }),
  solution: (m) => ({ kind: 'data', bars: [...m.values], values: m.task === 'build' ? {} : { answer: String(dataAnswer(m)) } }),
  apply(m, w, a) {
    if (m.task !== 'build' || a.type !== 'setBar' || a.index < 0 || a.index >= m.values.length) return w;
    const v = w.bars[a.index] + a.delta * m.scale;
    if (v < 0 || v > m.scale * 10) return w;
    return { ...w, bars: w.bars.map((b, i) => (i === a.index ? v : b)) };
  },
  evaluate(m, w) {
    if (w.bars.length !== m.values.length) return result('invalid', 'common.invalid');
    if (m.task === 'build') {
      if (w.bars.every((b) => b === 0)) return result('incomplete', 'data.start');
      const wrong = w.bars.findIndex((b, i) => b !== m.values[i]);
      if (wrong >= 0) return result('incorrect', 'data.checkBar', { index: wrong, value: m.values[wrong], scale: m.scale });
      return result('correct', 'data.explainBuild', { scale: m.scale });
    }
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    const value = dataAnswer(m);
    if (answer === value) return result('correct', `data.explain.${m.task}`, { value, a: m.values[m.ask[0]] ?? 0, b: m.values[m.ask[1]] ?? 0, i: m.ask[0] ?? 0, j: m.ask[1] ?? 0 });
    // Error típico con escala: contar rayitas en vez de leer el número (la mitad del valor cuando la escala es 2).
    if (m.scale > 1 && answer * m.scale === value) return result('incorrect', 'data.scale', { scale: m.scale });
    return result('incorrect', `data.check.${m.task}`, { i: m.ask[0] ?? 0, j: m.ask[1] ?? 0 });
  },
  problems(m) {
    const p: string[] = [];
    if (m.categories.length !== m.values.length || m.values.length < 3) p.push('categorías');
    if (m.values.some((v) => !isInt(v) || v <= 0 || v % m.scale !== 0)) p.push('múltiplos de la escala');
    if (new Set(m.values).size !== m.values.length) p.push('valores repetidos');
    if (m.task === 'difference' && m.values[m.ask[0]] <= m.values[m.ask[1]]) p.push('diferencia');
    return p;
  },
  example: () => ({ a: 8, b: 5, value: 3 }),
  templates: [
    {
      id: 'data.build',
      version: 1,
      skillId: 'g2.md.barGraph',
      grades: [2, 3],
      generate: (r) => ({ kind: 'data', categories: FRUITS.slice(0, 3), values: distinctValues(r, 3, 1, 8), scale: 1, task: 'build', ask: [] }),
    },
    {
      id: 'data.difference',
      version: 1,
      skillId: 'g2.md.compareData',
      grades: [2, 3],
      generate: (r) => {
        const values = distinctValues(r, 4, 1, 9);
        return { kind: 'data', categories: [...FRUITS], values, scale: 1, task: 'difference', ask: askDiff(values, r) };
      },
    },
    {
      id: 'data.scaled',
      version: 1,
      skillId: 'g3.md.scaledGraph',
      grades: [3, 4],
      generate: (r) => {
        const values = distinctValues(r, 4, 2, 8);
        const task = r.int(0, 1) === 0 ? 'difference' : 'read';
        return { kind: 'data', categories: [...FRUITS], values, scale: 2, task, ask: task === 'read' ? [r.int(0, 3)] : askDiff(values, r) };
      },
    },
    {
      id: 'data.total',
      version: 1,
      skillId: 'g3.md.scaledGraph',
      grades: [3, 4],
      generate: (r) => ({ kind: 'data', categories: [...FRUITS], values: distinctValues(r, 4, 2, 7), scale: 2, task: 'total', ask: [] }),
    },
  ],
};

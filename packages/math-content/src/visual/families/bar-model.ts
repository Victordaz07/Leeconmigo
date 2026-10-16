/**
 * G. Modelo de barras para problemas verbales (1.OA.1, 2.OA.1, 3.NBT.2, 4.OA.2): juntar / quitar (parte–todo),
 * comparar ("tiene 6 menos que") y "veces tanto". La incógnita cambia de lugar; el niño escribe el número EN la parte
 * de la barra que falta. Las longitudes salen de los números con una escala común (la parte desconocida se dibuja
 * neutra para no regalar la respuesta midiendo).
 */
import { isInt, num, pick, result, type FamilyDef } from './common.ts';
import type { BarModelModel } from '../model.ts';
import type { IntRng } from '../rng.ts';

const NAMES = ['Maya', 'Leo', 'Ana', 'Sami', 'Nico', 'Lucía', 'Tomás', 'Elena'] as const;
const ITEMS = ['marbles', 'stickers', 'pencils', 'apples'] as const;

/** El valor que falta. */
export function barUnknownValue(m: BarModelModel): number {
  if (m.structure === 'partWhole') return m.unknown === 'whole' ? m.a + m.b : m.b;
  if (m.structure === 'compare') return m.unknown === 'larger' ? m.a : m.unknown === 'smaller' ? m.b : m.a - m.b;
  return m.unknown === 'larger' ? m.a : m.b;
}

/** Lo que sale si se usa la operación contraria con los datos que se ven. */
export function otherOperation(m: BarModelModel): number {
  const f = m.factor ?? 1;
  if (m.structure === 'partWhole') return m.unknown === 'whole' ? Math.abs(m.a - m.b) : m.a + m.b + m.a;
  if (m.structure === 'compare') {
    const d = m.a - m.b;
    return m.unknown === 'smaller' ? m.a + d : m.unknown === 'larger' ? Math.abs(m.b - d) : m.a + m.b;
  }
  return m.unknown === 'larger' ? m.b + f : m.a * f;
}

function people(r: IntRng): [string, string] {
  const a = pick(r, NAMES);
  let b = pick(r, NAMES);
  if (b === a) b = NAMES[(NAMES.indexOf(a) + 3) % NAMES.length];
  return [a, b];
}

function partWhole(r: IntRng, max: number, min: number): BarModelModel {
  const total = r.int(min, max);
  const a = r.int(Math.ceil(total * 0.3), Math.floor(total * 0.7));
  return { kind: 'barModel', structure: 'partWhole', a, b: total - a, unknown: pick(r, ['part', 'whole'] as const), names: people(r), item: pick(r, ITEMS) };
}

function compare(r: IntRng, max: number, min: number): BarModelModel {
  const a = r.int(min, max);
  const b = r.int(Math.ceil(a * 0.3), a - 2);
  return { kind: 'barModel', structure: 'compare', a, b, unknown: pick(r, ['smaller', 'larger', 'difference'] as const), names: people(r), item: pick(r, ITEMS) };
}

export const barModel: FamilyDef<'barModel'> = {
  kind: 'barModel',
  fields: () => ['answer'],
  init: () => ({ kind: 'barModel', values: {} }),
  solution: (m) => ({ kind: 'barModel', values: { answer: String(barUnknownValue(m)) } }),
  apply: (_m, w) => w,
  evaluate(m, w) {
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'bar.writeInBar');
    const value = barUnknownValue(m);
    if (answer === value) return result('correct', `bar.explain.${m.structure}.${m.unknown}`, { a: m.a, b: m.b, factor: m.factor ?? 0, value });
    // Pista según el error típico: usar la operación contraria (sumar cuando había que buscar una parte, etc.).
    if (answer === otherOperation(m)) return result('incorrect', 'bar.otherOperation');
    return result('incorrect', `bar.check.${m.structure}`);
  },
  problems(m) {
    const p: string[] = [];
    if (![m.a, m.b].every((n) => isInt(n) && n > 0)) p.push('positivos');
    if (m.structure === 'compare' && m.a <= m.b) p.push('el mayor es a');
    if (m.structure === 'times' && (!m.factor || m.a !== m.b * m.factor)) p.push('veces');
    if (m.names[0] === m.names[1]) p.push('nombres');
    if (barUnknownValue(m) <= 0) p.push('incógnita');
    return p;
  },
  example: (m): Record<string, number> => (m.structure === 'times' ? { a: 12, b: 4, factor: 3 } : { a: 15, b: 6, value: 9 }),
  templates: [
    { id: 'bar.partWhole20', version: 1, skillId: 'g1.oa.wordProblems', grades: [1, 1], generate: (r) => partWhole(r, 20, 9) },
    { id: 'bar.compare20', version: 1, skillId: 'g1.oa.compare', grades: [1, 2], generate: (r) => compare(r, 20, 8) },
    { id: 'bar.partWhole100', version: 1, skillId: 'g2.oa.wordProblems', grades: [2, 2], generate: (r) => partWhole(r, 100, 35) },
    { id: 'bar.compare100', version: 1, skillId: 'g2.oa.compare', grades: [2, 3], generate: (r) => compare(r, 100, 30) },
    { id: 'bar.partWhole1000', version: 1, skillId: 'g3.nbt.addSub1000', grades: [3, 3], generate: (r) => partWhole(r, 900, 200) },
    {
      id: 'bar.times',
      version: 1,
      skillId: 'g4.oa.multiplicativeCompare',
      grades: [3, 4],
      generate: (r) => {
        const b = r.int(3, 9);
        const factor = r.int(2, 6);
        return { kind: 'barModel', structure: 'times', a: b * factor, b, factor, unknown: pick(r, ['larger', 'smaller'] as const), names: people(r), item: pick(r, ITEMS) };
      },
    },
  ],
};

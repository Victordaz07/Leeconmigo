/**
 * K. Plano cartesiano, primer cuadrante (5.G.1, 5.G.2, 6.NS.8). Primero horizontal (x), luego vertical (y). El error
 * más común es invertir el par: se detecta y se nombra.
 */
import { isInt, num, result, type FamilyDef } from './common.ts';

export const coord: FamilyDef<'coord'> = {
  kind: 'coord',
  fields: (m) => (m.task === 'read' ? ['x', 'y'] : []),
  init: (m) => ({ kind: 'coord', point: m.task === 'read' ? [m.x, m.y] : null, values: {} }),
  solution: (m) => ({ kind: 'coord', point: [m.x, m.y], values: m.task === 'read' ? { x: String(m.x), y: String(m.y) } : {} }),
  apply(m, w, a) {
    if (m.task === 'read' || a.type !== 'placePoint') return w;
    if (![a.x, a.y].every((n) => isInt(n) && n >= 0 && n <= m.max)) return w;
    return { ...w, point: [a.x, a.y] };
  },
  evaluate(m, w) {
    let x: number | null;
    let y: number | null;
    if (m.task === 'read') {
      x = num(w.values.x);
      y = num(w.values.y);
      if (x === null || y === null) return result('incomplete', 'common.writeAll');
    } else {
      if (!w.point) return result('incomplete', 'coord.place');
      [x, y] = w.point;
    }
    if (x === m.x && y === m.y) return result('correct', 'coord.explain', { x: m.x, y: m.y });
    if (x === m.y && y === m.x) return result('incorrect', 'coord.swapped');
    if (x !== m.x) return result('incorrect', 'coord.checkX');
    return result('incorrect', 'coord.checkY');
  },
  problems(m) {
    const p: string[] = [];
    if (![m.x, m.y].every((n) => isInt(n) && n >= 1 && n <= m.max)) p.push('punto');
    if (m.x === m.y) p.push('x = y no deja ver el orden');
    return p;
  },
  example: (m) => (m.x === 2 && m.y === 5 ? { x: 4, y: 1 } : { x: 2, y: 5 }),
  templates: [
    {
      id: 'coord.plot',
      version: 1,
      skillId: 'g5.g.plot',
      grades: [5, 6],
      generate: (r) => {
        const x = r.int(1, 8);
        let y = r.int(1, 8);
        if (y === x) y = x === 8 ? 7 : x + 1;
        return { kind: 'coord', max: 9, x, y, task: 'plot' };
      },
    },
    {
      id: 'coord.read',
      version: 1,
      skillId: 'g5.g.plot',
      grades: [5, 6],
      generate: (r) => {
        const x = r.int(1, 8);
        let y = r.int(1, 8);
        if (y === x) y = x === 1 ? 2 : x - 1;
        return { kind: 'coord', max: 9, x, y, task: 'read' };
      },
    },
  ],
};

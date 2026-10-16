/**
 * B. Valor posicional (1.NBT.2, 2.NBT.1, 2.NBT.3): centenas, decenas y unidades. Juntar 10 unidades hace una decena y
 * desarmar una decena da 10 unidades: el valor nunca cambia (intercambio atómico, documentación §10).
 * En `build` vale cualquier forma con el valor pedido (1 decena y 13 unidades = 23); `standard` pide la forma usual.
 */
import type { Pieces } from '../model.ts';
import { isInt, num, result, type FamilyDef } from './common.ts';

/** Máximo de piezas por lugar (para que el dibujo quepa). */
export const PIECE_LIMIT = { h: 9, t: 19, o: 19 } as const;

export const piecesValue = (p: Pieces) => p.h * 100 + p.t * 10 + p.o;
const standardOf = (n: number): Pieces => ({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });

export const placeValue: FamilyDef<'placeValue'> = {
  kind: 'placeValue',
  fields: (m) => (m.task === 'read' ? ['answer'] : []),
  init: (m) => ({ kind: 'placeValue', pieces: { ...m.given }, values: {} }),
  solution: (m) => (m.task === 'read' ? { kind: 'placeValue', pieces: { ...m.given }, values: { answer: String(m.target) } } : { kind: 'placeValue', pieces: standardOf(m.target), values: {} }),
  apply(m, w, a) {
    if (m.task === 'read') return w;
    const p = w.pieces;
    const next = (q: Pieces) => (q.h < 0 || q.t < 0 || q.o < 0 || q.h > PIECE_LIMIT.h || q.t > PIECE_LIMIT.t || q.o > PIECE_LIMIT.o ? w : { ...w, pieces: q });
    if (a.type === 'addPiece') return next({ ...p, [a.place]: p[a.place] + 1 });
    if (a.type === 'removePiece') return next({ ...p, [a.place]: p[a.place] - 1 });
    if (a.type === 'bundle') return a.place === 'o' ? next({ ...p, o: p.o - 10, t: p.t + 1 }) : next({ ...p, t: p.t - 10, h: p.h + 1 });
    if (a.type === 'unbundle') return a.place === 't' ? next({ ...p, t: p.t - 1, o: p.o + 10 }) : next({ ...p, h: p.h - 1, t: p.t + 10 });
    return w;
  },
  evaluate(m, w) {
    const v = piecesValue(w.pieces);
    if (m.task === 'read') {
      const answer = num(w.values.answer);
      if (answer === null) return result('incomplete', 'common.writeAnswer');
      if (answer !== m.target) return result('incorrect', w.pieces.o >= 10 ? 'placeValue.readBundle' : 'placeValue.readCount');
      return result('correct', 'placeValue.explainRead', { ...w.pieces, target: m.target });
    }
    if (v === 0) return result('incomplete', 'placeValue.start', { target: m.target });
    if (v < m.target) return result('incorrect', 'placeValue.fewer', { target: m.target, value: v });
    if (v > m.target) return result('incorrect', 'placeValue.more', { target: m.target, value: v });
    if (m.task === 'standard' && (w.pieces.o >= 10 || w.pieces.t >= 10)) return result('incomplete', 'placeValue.bundle');
    return result('correct', 'placeValue.explain', { ...w.pieces, target: m.target });
  },
  problems(m) {
    const p: string[] = [];
    if (!isInt(m.target) || m.target < 1 || m.target > 999) p.push('rango');
    if (m.task === 'read' && piecesValue(m.given) !== m.target) p.push('piezas ≠ número');
    if (m.task !== 'read' && piecesValue(m.given) !== 0) p.push('debe empezar vacío');
    return p;
  },
  example: (m) => {
    const n = m.target === 46 ? 52 : 46;
    return { target: n, h: 0, t: Math.floor(n / 10), o: n % 10 };
  },
  templates: [
    {
      id: 'placeValue.build2',
      version: 1,
      skillId: 'g1.nbt.tensOnes',
      grades: [1, 2],
      generate: (r) => ({ kind: 'placeValue', target: r.int(2, 9) * 10 + r.int(1, 9), task: 'build', given: { h: 0, t: 0, o: 0 } }),
    },
    {
      id: 'placeValue.standard3',
      version: 1,
      skillId: 'g2.nbt.hundreds',
      grades: [2, 3],
      generate: (r) => ({ kind: 'placeValue', target: r.int(1, 9) * 100 + r.int(0, 9) * 10 + r.int(1, 9), task: 'standard', given: { h: 0, t: 0, o: 0 } }),
    },
    {
      id: 'placeValue.readRegroup',
      version: 1,
      skillId: 'g2.nbt.regroup',
      grades: [2, 3],
      generate: (r) => {
        // Más de 10 unidades sueltas: para leer el número hay que juntar una decena.
        const given = { h: r.int(0, 2), t: r.int(1, 6), o: r.int(11, 17) };
        return { kind: 'placeValue', target: given.h * 100 + given.t * 10 + given.o, task: 'read', given };
      },
    },
  ],
};

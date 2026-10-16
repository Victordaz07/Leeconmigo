/**
 * H. Área y perímetro (3.MD.5–7, 3.MD.8, 4.MD.3). "Cubrir" con losetas de 1 m² y contar; "rodear" sumando los cuatro
 * lados; y el lado que falta a partir del área. Las unidades se dicen distinto (m² para cubrir, m para rodear).
 */
import { isInt, num, result, type FamilyDef } from './common.ts';

export const area: FamilyDef<'area'> = {
  kind: 'area',
  fields: () => ['answer'],
  init: (m) => ({ kind: 'area', tiles: Array(m.rows * m.cols).fill(false), values: {} }),
  solution: (m) => ({
    kind: 'area',
    tiles: Array(m.rows * m.cols).fill(m.task === 'cover'),
    values: { answer: String(m.task === 'cover' ? m.rows * m.cols : m.task === 'perimeter' ? 2 * (m.rows + m.cols) : m.rows) },
  }),
  apply(m, w, a) {
    if (m.task !== 'cover' || a.type !== 'toggleCell' || a.index < 0 || a.index >= m.rows * m.cols) return w;
    return { ...w, tiles: w.tiles.map((t, i) => (i === a.index ? !t : t)) };
  },
  evaluate(m, w) {
    if (w.tiles.length !== m.rows * m.cols) return result('invalid', 'common.invalid');
    const answer = num(w.values.answer);
    if (m.task === 'cover') {
      const placed = w.tiles.filter(Boolean).length;
      if (placed < m.rows * m.cols) return result('incomplete', 'area.cover', { left: m.rows * m.cols - placed });
      if (answer === null) return result('incomplete', 'common.writeAnswer');
      if (answer !== m.rows * m.cols) return result('incorrect', 'area.countRows', { rows: m.rows, cols: m.cols });
      return result('correct', 'area.explainArea', { rows: m.rows, cols: m.cols, area: m.rows * m.cols });
    }
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    if (m.task === 'perimeter') {
      const p = 2 * (m.rows + m.cols);
      if (answer === p) return result('correct', 'area.explainPerimeter', { rows: m.rows, cols: m.cols, perimeter: p });
      if (answer === m.rows * m.cols) return result('incorrect', 'area.notArea');
      if (answer === m.rows + m.cols) return result('incorrect', 'area.fourSides');
      return result('incorrect', 'area.addSides', { rows: m.rows, cols: m.cols });
    }
    if (answer !== m.rows) return result('incorrect', 'area.missingSide', { cols: m.cols, area: m.rows * m.cols });
    return result('correct', 'area.explainMissing', { rows: m.rows, cols: m.cols, area: m.rows * m.cols });
  },
  problems(m) {
    const p: string[] = [];
    if (![m.rows, m.cols].every((n) => isInt(n) && n >= 2 && n <= 10)) p.push('lados');
    if (m.rows === m.cols && m.task === 'missingSide') p.push('cuadrado: el lado se ve');
    // Si área y perímetro valen lo mismo (3×6, 4×4) no se puede notar si confundió uno con otro.
    if (m.task === 'perimeter' && m.rows * m.cols === 2 * (m.rows + m.cols)) p.push('área = perímetro');
    return p;
  },
  example: (m) => (m.rows === 4 && m.cols === 6 ? { rows: 3, cols: 7 } : { rows: 4, cols: 6 }),
  templates: [
    {
      id: 'area.cover',
      version: 1,
      skillId: 'g3.md.areaTiles',
      grades: [3, 3],
      generate: (r) => {
        const rows = r.int(2, 5);
        let cols = r.int(3, 7);
        if (cols === rows) cols += 1;
        return { kind: 'area', rows, cols, task: 'cover' };
      },
    },
    {
      id: 'area.perimeter',
      version: 1,
      skillId: 'g3.md.perimeter',
      grades: [3, 4],
      generate: (r) => {
        const rows = r.int(2, 8);
        let cols = r.int(3, 9);
        if (cols === rows) cols += 1;
        // 3×6 y 6×3: área = perímetro (18); se cambia un lado.
        if (rows * cols === 2 * (rows + cols)) cols += 1;
        return { kind: 'area', rows, cols, task: 'perimeter' };
      },
    },
    {
      id: 'area.missingSide',
      version: 1,
      skillId: 'g4.md.areaFormula',
      grades: [4, 4],
      generate: (r) => {
        const rows = r.int(3, 9);
        let cols = r.int(3, 9);
        if (cols === rows) cols = rows === 9 ? 8 : rows + 1;
        return { kind: 'area', rows, cols, task: 'missingSide' };
      },
    },
  ],
};

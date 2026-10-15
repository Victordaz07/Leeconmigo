/**
 * Geometría de TODAS las plantillas, también las dinámicas (viñetas inclinadas, rayo, explosión): cada globo cae dentro de su
 * viñeta (o debajo de su ilustración, en las de libro), las viñetas no se pisan y la caja del texto es útil. Como las viñetas
 * inclinadas son polígonos, se comprueba con puntos dentro de polígono y una rejilla de muestreo.
 */
import { describe, expect, it } from 'vitest';
import { PAGE_TEMPLATES, TEMPLATE_CANVAS, TEMPLATE_NAMES, pointInPolygon, slotPolygon, textBoxOf, type Point } from '../src/index.ts';

const cornersAndMids = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0], [x1, y0], [x1, y1], [x0, y1], [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1], [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2],
];

describe('geometría de las plantillas', () => {
  it('hay 13 plantillas, con al menos 5 dinámicas', () => {
    expect(TEMPLATE_NAMES).toHaveLength(13);
    expect(TEMPLATE_NAMES.filter((n) => PAGE_TEMPLATES[n].slots.some((s) => s.shape || s.burst)).sort()).toEqual(['bolt-2', 'burst-2', 'manga-6', 'slant-2', 'slant-3']);
  });

  for (const name of TEMPLATE_NAMES) {
    describe(name, () => {
      const slots = PAGE_TEMPLATES[name].slots;

      it('todos los globos caben en el lienzo y su caja de texto queda dentro, con margen y de tamaño útil', () => {
        slots.forEach((s, i) => {
          const [x0, y0, x1, y1] = s.balloon;
          expect(x0 >= 0 && y0 >= 0 && x1 <= TEMPLATE_CANVAS.width && y1 <= TEMPLATE_CANVAS.height, `#${i + 1}: globo dentro del lienzo`).toBe(true);
          if (s.burst) return; // la explosión tiene su propia caja (ver su prueba)
          const t = textBoxOf({ x: x0, y: y0, width: x1 - x0, height: y1 - y0 });
          expect(t.x > x0 && t.y > y0 && t.x + t.width < x1 && t.y + t.height < y1, `#${i + 1}: caja de texto dentro del globo`).toBe(true);
          expect(t.width >= 290 && t.height > 60, `#${i + 1}: caja de texto útil (${Math.round(t.width)}×${Math.round(t.height)})`).toBe(true);
        });
      });

      it('cada globo está DENTRO de su viñeta (aunque sea inclinada) o, en las de libro, DEBAJO de su ilustración; las explosiones pueden cruzar', () => {
        slots.forEach((s, i) => {
          const [x0, y0, x1, y1] = s.balloon;
          if (s.burst) return;
          const poly = slotPolygon(s);
          const inside = cornersAndMids(x0, y0, x1, y1).every((p) => pointInPolygon(p, poly));
          const below = x0 >= s.panel.x0 && x1 <= s.panel.x1 && y0 >= s.panel.y1;
          expect(inside || below, `#${i + 1}: globo dentro de su viñeta o debajo de su ilustración`).toBe(true);
        });
      });

      it('la caja envolvente (panel) es la de su forma real', () => {
        for (const s of slots) {
          if (!s.shape) continue;
          const xs = s.shape.map((p) => p[0]);
          const ys = s.shape.map((p) => p[1]);
          expect(Math.min(...xs)).toBe(s.panel.x0);
          expect(Math.max(...xs)).toBe(s.panel.x1);
          expect(Math.min(...ys)).toBe(s.panel.y0);
          expect(Math.max(...ys)).toBe(s.panel.y1);
        }
      });

      it('las viñetas no se pisan entre sí (muestreo cada 8 px) y ningún globo tapa la viñeta de otro cuadro', () => {
        const polys = slots.map(slotPolygon);
        for (let x = 4; x < TEMPLATE_CANVAS.width; x += 8) {
          for (let y = 4; y < TEMPLATE_CANVAS.height; y += 8) {
            const hits = polys.filter((p) => pointInPolygon([x, y], p)).length;
            expect(hits, `punto (${x}, ${y}) está en ${hits} viñetas`).toBeLessThanOrEqual(1);
          }
        }
        slots.forEach((s, i) => {
          if (s.burst) return;
          const [x0, y0, x1, y1] = s.balloon;
          slots.forEach((other, j) => {
            if (i === j) return;
            const bad = cornersAndMids(x0, y0, x1, y1).some((p) => pointInPolygon(p, slotPolygon(other)));
            expect(bad, `#${i + 1}: el globo entra en la viñeta ${j + 1}`).toBe(false);
          });
        });
      });

      it('ningún globo se pisa con otro', () => {
        slots.forEach((a, i) => slots.slice(i + 1).forEach((b, k) => {
          const [ax0, ay0, ax1, ay1] = a.balloon;
          const [bx0, by0, bx1, by1] = b.balloon;
          expect(ax0 < bx1 && bx0 < ax1 && ay0 < by1 && by0 < ay1, `globos ${i + 1} y ${i + k + 2} se pisan`).toBe(false);
        }));
      });
    });
  }

  it('la explosión: su caja de texto cabe en el círculo interior de la estrella y el texto va centrado', () => {
    const s = PAGE_TEMPLATES['burst-2'].slots[0];
    const [x0, y0, x1, y1] = s.balloon;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const inner = (Math.min(x1 - x0, y1 - y0) / 2) * 0.72;
    const t = s.textBox!;
    for (const [px, py] of [[t.x, t.y], [t.x + t.width, t.y], [t.x, t.y + t.height], [t.x + t.width, t.y + t.height]]) expect(Math.hypot(px - cx, py - cy)).toBeLessThan(inner);
    expect(s.align).toBe('center');
  });

  it('pointInPolygon: dentro, fuera y sobre una concavidad (el rayo)', () => {
    const bolt = PAGE_TEMPLATES['bolt-2'].slots[0].shape!;
    expect(pointInPolygon([100, 100], bolt)).toBe(true); // arriba a la izquierda
    expect(pointInPolygon([1400, 900], bolt)).toBe(false); // abajo a la derecha: es de la otra viñeta
    expect(pointInPolygon([700, 700], bolt)).toBe(false); // debajo del escalón del rayo: es de la escena de abajo
    expect(pointInPolygon([700, 620], bolt)).toBe(true); // justo encima del escalón (el divisor pasa por y≈632)
  });

  it('las dos escenas de un rayo dejan un canal entre ellas (no se tocan)', () => {
    const [u, l] = PAGE_TEMPLATES['bolt-2'].slots.map(slotPolygon);
    let gap = 0;
    for (let x = 4; x < TEMPLATE_CANVAS.width; x += 8) {
      let lastU = -1;
      let firstL = 2000;
      for (let y = 0; y < TEMPLATE_CANVAS.height; y += 2) {
        if (pointInPolygon([x, y], u)) lastU = y;
        if (pointInPolygon([x, y], l) && firstL === 2000) firstL = y;
      }
      gap = Math.min(gap || 999, firstL - lastU);
    }
    expect(gap).toBeGreaterThanOrEqual(10);
  });
});

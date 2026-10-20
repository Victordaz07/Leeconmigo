import { describe, expect, it } from 'vitest';
import {
  MAX_DROPS, PIGMENTS, addDrop, dropsOf, emptyRecipe, hexOf, isRecipe, mixRgb, recipeOf, recipeText, removeDrop, rybToRgb, sameRecipe, type Pigment, type Recipe,
} from '../src/index.ts';

const r = (o: Partial<Recipe>): Recipe => ({ ...emptyRecipe(), ...o });
const rgb = (x: Recipe) => mixRgb(x)!;
/** Tono (0–360) de un color RGB 0–1. */
const hue = ([R, G, B]: readonly [number, number, number]) => {
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  if (d === 0) return 0;
  let h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  h *= 60;
  return (h + 360) % 360;
};
const luma = ([R, G, B]: readonly [number, number, number]) => 0.2126 * R + 0.7152 * G + 0.0722 * B;

describe('mezclador: los primarios se mezclan como la pintura que los niños conocen', () => {
  it('rojo + amarillo = naranja (entre rojo y amarillo)', () => {
    const h = hue(rgb(r({ red: 1, yellow: 1 })));
    expect(h).toBeGreaterThan(hue(rgb(recipeOf('red'))));
    expect(h).toBeLessThan(hue(rgb(recipeOf('yellow'))));
    expect(h).toBeGreaterThan(20);
    expect(h).toBeLessThan(45);
  });

  it('amarillo + azul = verde', () => {
    const h = hue(rgb(r({ yellow: 1, blue: 1 })));
    expect(h).toBeGreaterThan(100);
    expect(h).toBeLessThan(160);
  });

  it('rojo + azul = violeta', () => {
    const h = hue(rgb(r({ red: 1, blue: 1 })));
    expect(h).toBeGreaterThan(270);
    expect(h).toBeLessThan(330);
  });

  it('los tres primarios juntos dan un color muy oscuro, no un gris a medias', () => {
    expect(luma(rgb(r({ red: 1, yellow: 1, blue: 1 })))).toBeLessThan(0.2);
  });

  it('NO es un promedio RGB: amarillo + azul da un verde más vivo que el promedio, que queda oliva apagado', () => {
    const avg = (a: readonly number[], b: readonly number[]) => a.map((v, i) => (v + b[i]!) / 2) as [number, number, number];
    const sat = ([R, G, B]: readonly [number, number, number]) => {
      const max = Math.max(R, G, B);
      return max === 0 ? 0 : (max - Math.min(R, G, B)) / max;
    };
    const naive = avg(rgb(recipeOf('yellow')), rgb(recipeOf('blue')));
    const mixed = rgb(r({ yellow: 1, blue: 1 }));
    expect(sat(mixed)).toBeGreaterThan(sat(naive) + 0.2);
    expect(mixed[0]).toBeLessThan(naive[0] - 0.4); // sin el «rojo» sucio del promedio
  });

  it('más de un primario lo acerca a ese color (de forma continua)', () => {
    const hues = [1, 2, 3, 4].map((y) => hue(rgb(r({ red: 4, yellow: y }))));
    for (let i = 1; i < hues.length; i++) expect(hues[i]!).toBeGreaterThan(hues[i - 1]!);
  });
});

describe('mezclador: blanco, negro y reglas generales', () => {
  it('el blanco aclara y el negro oscurece, más cuanto más gotas', () => {
    const base = luma(rgb(recipeOf('blue')));
    expect(luma(rgb(r({ blue: 1, white: 1 })))).toBeGreaterThan(base);
    expect(luma(rgb(r({ blue: 1, white: 3 })))).toBeGreaterThan(luma(rgb(r({ blue: 1, white: 1 }))));
    expect(luma(rgb(r({ blue: 1, black: 1 })))).toBeLessThan(base);
    expect(luma(rgb(r({ blue: 1, black: 3 })))).toBeLessThan(luma(rgb(r({ blue: 1, black: 1 }))));
  });

  it('rojo + blanco es rosa (mismo tono que el rojo, más claro)', () => {
    const [R, G, B] = rgb(r({ red: 1, white: 1 }));
    expect(R).toBeGreaterThan(G);
    expect(G).toBeCloseTo(B, 5);
    expect(hexOf(r({ red: 1, white: 1 }))).toBe('#FF8080');
  });

  it('blanco con negro da un gris que depende de la proporción', () => {
    expect(hexOf(r({ white: 1, black: 1 }))).toBe('#808080');
    expect(luma(rgb(r({ white: 3, black: 1 })))).toBeGreaterThan(luma(rgb(r({ white: 1, black: 3 }))));
  });

  it('cada pintura sola es su color (blanco y negro puros incluidos)', () => {
    expect(hexOf(recipeOf('white'))).toBe('#FFFFFF');
    expect(hexOf(recipeOf('black'))).toBe('#000000');
    expect(hexOf(recipeOf('red'))).toBe('#FF0000');
    expect(hexOf(recipeOf('yellow'))).toBe('#FFFF00');
  });

  it('el orden de las gotas no importa y las mismas gotas dan siempre el mismo color', () => {
    let a = emptyRecipe();
    for (const p of ['red', 'blue', 'white', 'red'] as Pigment[]) a = addDrop(a, p);
    let b = emptyRecipe();
    for (const p of ['white', 'red', 'red', 'blue'] as Pigment[]) b = addDrop(b, p);
    expect(sameRecipe(a, b)).toBe(true);
    expect(hexOf(a)).toBe(hexOf(b));
    expect(hexOf(a)).toBe(hexOf(a));
  });

  it('duplicar todas las gotas (misma proporción de primarios) no cambia el tono', () => {
    expect(hue(rgb(r({ red: 2, yellow: 2 })))).toBeCloseTo(hue(rgb(r({ red: 1, yellow: 1 }))), 6);
  });

  it('siempre devuelve un color válido, para cualquier receta de hasta 8 gotas', () => {
    let n = 0;
    const walk = (i: number, rec: Recipe) => {
      if (i === PIGMENTS.length) {
        if (dropsOf(rec) >= 1 && dropsOf(rec) <= MAX_DROPS) {
          n++;
          expect(hexOf(rec)).toMatch(/^#[0-9A-F]{6}$/);
          expect(isRecipe(rec)).toBe(true);
        }
        return;
      }
      for (let k = 0; k <= MAX_DROPS - dropsOf(rec); k++) walk(i + 1, { ...rec, [PIGMENTS[i]!]: k });
    };
    walk(0, emptyRecipe());
    expect(n).toBeGreaterThan(1000);
  });

  it('rybToRgb en las esquinas del cubo da los colores de esquina', () => {
    expect(rybToRgb(0, 0, 0)).toEqual([1, 1, 1]);
    expect(rybToRgb(1, 1, 0)).toEqual([1, 0.5, 0]);
    expect(rybToRgb(0, 1, 1)).toEqual([0, 0.66, 0.2]);
  });
});

describe('recetas', () => {
  it('echar gotas se detiene en el tope y quitar no baja de cero', () => {
    let x = emptyRecipe();
    for (let i = 0; i < 20; i++) x = addDrop(x, 'red');
    expect(dropsOf(x)).toBe(MAX_DROPS);
    expect(removeDrop(emptyRecipe(), 'red')).toEqual(emptyRecipe());
    expect(dropsOf(removeDrop(x, 'red'))).toBe(MAX_DROPS - 1);
  });

  it('una receta vacía no es válida (hay que echar al menos una gota) y las rotas tampoco', () => {
    expect(isRecipe(emptyRecipe())).toBe(false);
    expect(isRecipe({ ...emptyRecipe(), red: 9 })).toBe(false);
    expect(isRecipe({ ...emptyRecipe(), red: 1.5 })).toBe(false);
    expect(isRecipe({ red: 1 })).toBe(false);
    expect(isRecipe(null)).toBe(false);
    expect(mixRgb(emptyRecipe())).toBeNull();
  });

  it('se lee en voz alta con gotas, en español y en inglés', () => {
    expect(recipeText(r({ red: 2, yellow: 1 }), 'es')).toBe('2 gotas de rojo + 1 gota de amarillo');
    expect(recipeText(r({ blue: 1, white: 3 }), 'en')).toBe('1 drop of blue + 3 drops of white');
  });
});

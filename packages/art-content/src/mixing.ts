/**
 * Mezclador de pintura (AR-05). Modelo DIDÁCTICO, documentado en `docs/design/artes/MODELO-MEZCLA.md`; no simula pigmentos reales.
 *
 * Cinco pinturas virtuales: rojo, amarillo, azul (los tres primarios), blanco y negro. Una mezcla es una receta de GOTAS (como mezclar en una paleta).
 *  - Los tres primarios se combinan en el cubo RYB (rojo-amarillo-azul) por interpolación trilineal entre sus 8 esquinas (Gossett y Chen, «Paint
 *    Inspired Color Mixing»): rojo+amarillo → naranja, amarillo+azul → verde, rojo+azul → violeta, los tres → un marrón muy oscuro. NO se promedia RGB:
 *    un promedio de amarillo y azul da un verde oliva apagado (y con un azul puro, gris), no el verde vivo que los niños ven al mezclar pintura.
 *  - El blanco aclara y el negro oscurece, en proporción de gotas, mezclando en sRGB (una aproximación sencilla de «tinte» y «sombra»).
 *  - La mezcla no depende del orden en que se echan las gotas, y las mismas gotas dan siempre el mismo color.
 * Es una aproximación: la pintura de verdad puede salir un poco distinta, y eso está bien. La luz (RGB aditivo) es otro modelo y no se mezcla aquí.
 */
export const PIGMENTS = ['red', 'yellow', 'blue', 'white', 'black'] as const;
export type Pigment = (typeof PIGMENTS)[number];
export const CHROMATIC: readonly Pigment[] = ['red', 'yellow', 'blue'];

/** Gotas de cada pintura (enteros ≥ 0). */
export type Recipe = Record<Pigment, number>;
/** Tope de gotas por receta: una mezcla pequeña se entiende y se repite. */
export const MAX_DROPS = 8;

export const emptyRecipe = (): Recipe => ({ red: 0, yellow: 0, blue: 0, white: 0, black: 0 });
export const dropsOf = (r: Recipe): number => PIGMENTS.reduce((n, p) => n + r[p], 0);
export const recipeOf = (p: Pigment): Recipe => ({ ...emptyRecipe(), [p]: 1 });
export const sameRecipe = (a: Recipe, b: Recipe): boolean => PIGMENTS.every((p) => a[p] === b[p]);

export const isRecipe = (v: unknown): v is Recipe => {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  const ok = PIGMENTS.every((p) => Number.isInteger(o[p]) && (o[p] as number) >= 0 && (o[p] as number) <= MAX_DROPS);
  return ok && dropsOf(v as Recipe) >= 1 && dropsOf(v as Recipe) <= MAX_DROPS;
};

/** Echa una gota. Con `MAX_DROPS` gotas ya, no cambia nada. */
export function addDrop(r: Recipe, p: Pigment): Recipe {
  return dropsOf(r) >= MAX_DROPS ? r : { ...r, [p]: r[p] + 1 };
}
/** Quita una gota de esa pintura (si no hay, no cambia nada). */
export function removeDrop(r: Recipe, p: Pigment): Recipe {
  return r[p] > 0 ? { ...r, [p]: r[p] - 1 } : r;
}

type RGB = readonly [number, number, number];

/** Esquinas del cubo RYB → RGB (0–1), indexadas por (rojo, amarillo, azul). Valores de Gossett y Chen (2004). */
const CORNER: Record<string, RGB> = {
  '000': [1, 1, 1], // blanco
  '100': [1, 0, 0], // rojo
  '010': [1, 1, 0], // amarillo
  '001': [0.163, 0.373, 0.6], // azul
  '110': [1, 0.5, 0], // naranja
  '011': [0, 0.66, 0.2], // verde
  '101': [0.5, 0, 0.5], // violeta
  '111': [0.2, 0.094, 0], // marrón muy oscuro
};

/** RYB (0–1 cada uno) → RGB (0–1) por interpolación trilineal. */
export function rybToRgb(r: number, y: number, b: number): RGB {
  const out = [0, 0, 0];
  for (const key of Object.keys(CORNER)) {
    const [kr, ky, kb] = [key[0] === '1', key[1] === '1', key[2] === '1'];
    const w = (kr ? r : 1 - r) * (ky ? y : 1 - y) * (kb ? b : 1 - b);
    const c = CORNER[key]!;
    out[0]! += w * c[0];
    out[1]! += w * c[1];
    out[2]! += w * c[2];
  }
  return [out[0]!, out[1]!, out[2]!];
}

const toHex = (c: RGB): string =>
  '#' +
  c
    .map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255))
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const WHITE: RGB = [1, 1, 1];
const BLACK: RGB = [0, 0, 0];

/** El color de una receta en RGB (0–1). `null` si no hay ninguna gota. */
export function mixRgb(r: Recipe): RGB | null {
  const chromatic = CHROMATIC.reduce((n, p) => n + r[p], 0);
  const total = dropsOf(r);
  if (total === 0) return null;
  let base: RGB = WHITE;
  if (chromatic > 0) {
    // proporción de cada primario, escalada para que el mayor valga 1 (la mezcla mantiene su intensidad; el blanco y el negro la cambian después)
    const top = Math.max(r.red, r.yellow, r.blue);
    base = rybToRgb(r.red / top, r.yellow / top, r.blue / top);
  }
  // blanco y negro entran con el peso de sus gotas junto a las gotas de color
  const wChroma = chromatic;
  const sum = wChroma + r.white + r.black;
  const mixed = [0, 1, 2].map((i) => (wChroma * (chromatic > 0 ? base[i]! : 0) + r.white * WHITE[i]! + r.black * BLACK[i]!) / sum);
  return [mixed[0]!, mixed[1]!, mixed[2]!];
}

/** El color de una receta como `#RRGGBB`. Una receta vacía devuelve blanco (no se usa: `isRecipe` exige al menos una gota). */
export const hexOf = (r: Recipe): string => toHex(mixRgb(r) ?? WHITE);

export const PIGMENT_NAME: Record<Pigment, { es: string; en: string }> = {
  red: { es: 'rojo', en: 'red' },
  yellow: { es: 'amarillo', en: 'yellow' },
  blue: { es: 'azul', en: 'blue' },
  white: { es: 'blanco', en: 'white' },
  black: { es: 'negro', en: 'black' },
};

/** «2 gotas de rojo + 1 gota de amarillo» (para leerlo en voz alta y para accesibilidad: el color no se comunica solo con el color). */
export function recipeText(r: Recipe, lang: 'es' | 'en'): string {
  return PIGMENTS.filter((p) => r[p] > 0)
    .map((p) => {
      const n = r[p];
      const name = PIGMENT_NAME[p][lang];
      return lang === 'es' ? `${n} ${n === 1 ? 'gota' : 'gotas'} de ${name}` : `${n} ${n === 1 ? 'drop' : 'drops'} of ${name}`;
    })
    .join(' + ');
}

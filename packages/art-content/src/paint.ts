/**
 * Escena de pintura (AR-05): un dibujo (trazos) y la paleta de colores guardados. Lógica PURA. Los trazos usan el lienzo de AR-T2 (`canvas.ts`)
 * en un lienzo LÓGICO fijo de `PAPER_W × PAPER_H`, así lo dibujado se ve igual en cualquier pantalla o giro. Cada color de la paleta guarda su
 * RECETA (gotas), no el color: el color se calcula con el modelo de mezcla (`mixing.ts`), y así receta y color nunca se contradicen.
 */
import { emptyDrawing, fromSaved, toSaved, type Drawing, type SavedDrawing } from './canvas.ts';
import { hexOf, isRecipe, recipeOf, sameRecipe, type Recipe } from './mixing.ts';

/** Tamaño del lienzo lógico (proporción 10:7). Los puntos de los trazos están en estas unidades. */
export const PAPER_W = 1000;
export const PAPER_H = 700;

export interface PaletteColor {
  id: string;
  recipe: Recipe;
}

export interface PaintScene {
  kind: 'painting';
  drawing: SavedDrawing;
  palette: PaletteColor[];
}

export const MAX_PALETTE = 12;

/** Paleta de partida: los tres primarios, negro y blanco, cada uno una gota. */
export const starterPalette = (): PaletteColor[] => [
  { id: 'c1', recipe: recipeOf('red') },
  { id: 'c2', recipe: recipeOf('yellow') },
  { id: 'c3', recipe: recipeOf('blue') },
  { id: 'c4', recipe: recipeOf('black') },
  { id: 'c5', recipe: recipeOf('white') },
];

export const newPaintScene = (): PaintScene => ({ kind: 'painting', drawing: toSaved(emptyDrawing()), palette: starterPalette() });

/** Copia de una escena de pintura. Los trazos son inmutables (cada operación crea trazos nuevos), así que no se copian a fondo. */
export const clonePaintScene = (s: PaintScene): PaintScene => ({
  kind: 'painting',
  drawing: { version: 1, strokes: [...s.drawing.strokes] },
  palette: s.palette.map((c) => ({ id: c.id, recipe: { ...c.recipe } })),
});

export const colorOf = (c: PaletteColor): string => hexOf(c.recipe);

/** El dibujo editable de la escena (sin historial de deshacer: eso vive solo mientras se pinta). */
export const drawingOf = (s: PaintScene): Drawing => fromSaved(s.drawing) ?? emptyDrawing();

/** La escena con otro dibujo (los puntos se redondean al guardar para que lo guardado no pese de más). */
export const withDrawing = (s: PaintScene, d: Drawing): PaintScene => ({ ...s, drawing: toSaved(d) });

/** Guarda una receta en la paleta. Si ya está, no se repite (devuelve el id que ya tenía); si la paleta está llena, `id` = null. */
export function addToPalette(palette: PaletteColor[], recipe: Recipe): { palette: PaletteColor[]; id: string | null } {
  const same = palette.find((c) => sameRecipe(c.recipe, recipe));
  if (same) return { palette, id: same.id };
  if (palette.length >= MAX_PALETTE) return { palette, id: null };
  const n = Math.max(0, ...palette.map((c) => Number(c.id.replace(/^c/, '')) || 0)) + 1;
  const id = `c${n}`;
  return { palette: [...palette, { id, recipe: { ...recipe } }], id };
}

/** Quita un color de la paleta. Siempre queda al menos uno. Lo ya pintado no cambia (los trazos guardan su color). */
export function removeFromPalette(palette: PaletteColor[], id: string): PaletteColor[] {
  if (palette.length <= 1) return palette;
  return palette.filter((c) => c.id !== id);
}

export function isPaintScene(v: unknown): v is PaintScene {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.kind !== 'painting' || !Array.isArray(s.palette) || s.palette.length < 1 || s.palette.length > MAX_PALETTE) return false;
  const ids = new Set<string>();
  for (const c of s.palette) {
    if (typeof c !== 'object' || c === null) return false;
    const x = c as Record<string, unknown>;
    if (typeof x.id !== 'string' || ids.has(x.id) || !isRecipe(x.recipe)) return false;
    ids.add(x.id);
  }
  return fromSaved(s.drawing) !== null;
}

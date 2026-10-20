import { describe, expect, it } from 'vitest';
import {
  MAX_PALETTE, addToPalette, beginStroke, brush, colorOf, createPaintProject, createRhythmProject, drawingOf, duplicateProject, emptyDrawing, emptyLibrary, emptyRecipe, endStroke, extendStroke,
  isArtLibrary, isPaintScene, kindOf, newPaintScene, paintOf, projectById, removeFromPalette, rhythmOf, starterPalette, toSaved, updateScene, withDrawing, type ArtLibrary, type PaintScene, type Recipe,
} from '../src/index.ts';

const NOW = 1_700_000_000_000;
const make = () => {
  const r = createPaintProject(emptyLibrary(), 'Mi pintura', 'es', NOW);
  return { lib: r.lib, id: r.id! };
};
const recipe = (o: Partial<Recipe>): Recipe => ({ ...emptyRecipe(), ...o });

describe('paleta', () => {
  it('empieza con cinco pinturas (los tres primarios, negro y blanco) y cada color sale de su receta', () => {
    const p = starterPalette();
    expect(p.map((c) => colorOf(c))).toEqual(['#FF0000', '#FFFF00', '#2A5F99', '#000000', '#FFFFFF']);
  });

  it('guardar una mezcla agrega un color; la misma mezcla no se repite', () => {
    const a = addToPalette(starterPalette(), recipe({ red: 1, yellow: 1 }));
    expect(a.palette).toHaveLength(6);
    expect(a.id).toBe('c6');
    const again = addToPalette(a.palette, recipe({ red: 1, yellow: 1 }));
    expect(again.palette).toBe(a.palette);
    expect(again.id).toBe('c6');
    // un solo rojo ya estaba en la paleta de partida
    expect(addToPalette(starterPalette(), recipe({ red: 1 })).id).toBe('c1');
  });

  it('la paleta tiene un tope y siempre queda al menos un color', () => {
    let p = starterPalette();
    for (let i = 0; p.length < MAX_PALETTE; i++) p = addToPalette(p, recipe({ red: 1 + (i % 4), blue: 1 + Math.floor(i / 4) })).palette;
    expect(p).toHaveLength(MAX_PALETTE);
    expect(addToPalette(p, recipe({ white: 3, black: 2 })).id).toBeNull();
    let small = starterPalette();
    for (const c of starterPalette()) small = removeFromPalette(small, c.id);
    expect(small).toHaveLength(1);
  });

  it('los ids no se reutilizan al quitar colores', () => {
    let p = starterPalette();
    p = addToPalette(p, recipe({ red: 1, blue: 1 })).palette; // c6
    p = removeFromPalette(p, 'c6');
    expect(addToPalette(p, recipe({ yellow: 1, blue: 1 })).id).toBe('c6'); // el mayor id restante es c5 → c6 libre
  });
});

describe('escena de pintura', () => {
  it('un proyecto de pintura nuevo trae lienzo en blanco y paleta de partida, y es válido', () => {
    const { lib, id } = make();
    const s = paintOf(projectById(lib, id)!)!;
    expect(s.drawing.strokes).toEqual([]);
    expect(s.palette).toHaveLength(5);
    expect(kindOf(projectById(lib, id)!)).toBe('painting');
    expect(rhythmOf(projectById(lib, id)!)).toBeUndefined();
    expect(isArtLibrary(lib)).toBe(true);
  });

  it('pintar y guardar: los trazos vuelven igual (puntos redondeados) tras ida y vuelta por JSON', () => {
    let { lib, id } = make();
    let d = emptyDrawing();
    d = beginStroke(d, 100.123, 200.456, 0.5, brush('#FF0000', 10));
    d = extendStroke(d, 140.987, 230.111, 0.5);
    d = extendStroke(d, 190.2, 260.8, 0.5);
    d = endStroke(d);
    const scene = withDrawing(paintOf(projectById(lib, id)!)!, d);
    lib = updateScene(lib, id, 0, scene, NOW + 1);
    const back = JSON.parse(JSON.stringify(lib)) as ArtLibrary;
    expect(isArtLibrary(back)).toBe(true);
    const got = drawingOf(paintOf(projectById(back, id)!)!);
    expect(got.strokes).toHaveLength(1);
    expect(got.strokes[0]!.points[0]).toEqual({ x: 100.1, y: 200.5, p: 0.5 });
    expect(got.strokes[0]!.brush.color).toBe('#FF0000');
  });

  it('una escena de pintura no reemplaza a una de ritmo (ni al revés)', () => {
    const rh = createRhythmProject(emptyLibrary(), 'Ritmo', 'es', NOW);
    const paint = newPaintScene();
    expect(updateScene(rh.lib, rh.id!, 0, paint, NOW + 1)).toBe(rh.lib);
    const { lib, id } = make();
    expect(updateScene(lib, id, 0, rhythmOf(projectById(rh.lib, rh.id!)!)!, NOW + 1)).toBe(lib);
  });

  it('duplicar un proyecto de pintura copia trazos y paleta sin compartir datos', () => {
    let { lib, id } = make();
    const scene0 = paintOf(projectById(lib, id)!)!;
    const pal = addToPalette(scene0.palette, recipe({ red: 1, yellow: 1 })).palette;
    lib = updateScene(lib, id, 0, { ...scene0, palette: pal }, NOW + 1);
    const dup = duplicateProject(lib, id, '(otra idea)', NOW + 2);
    expect(paintOf(projectById(dup.lib, dup.id!)!)!.palette).toHaveLength(6);
    const more = addToPalette(paintOf(projectById(dup.lib, dup.id!)!)!.palette, recipe({ blue: 2, white: 1 })).palette;
    const edited = updateScene(dup.lib, dup.id!, 0, { ...paintOf(projectById(dup.lib, dup.id!)!)!, palette: more }, NOW + 3);
    expect(paintOf(projectById(edited, id)!)!.palette).toHaveLength(6); // el original no cambió
  });

  it('valida lo guardado: rechaza paletas rotas, ids repetidos y trazos inválidos', () => {
    const base: PaintScene = newPaintScene();
    expect(isPaintScene(base)).toBe(true);
    expect(isPaintScene({ ...base, palette: [] })).toBe(false);
    expect(isPaintScene({ ...base, palette: [base.palette[0], base.palette[0]] })).toBe(false);
    expect(isPaintScene({ ...base, palette: [{ id: 'c1', recipe: emptyRecipe() }] })).toBe(false);
    expect(isPaintScene({ ...base, drawing: { version: 2, strokes: [] } })).toBe(false);
    expect(isPaintScene({ ...base, drawing: toSaved(emptyDrawing()), palette: Array.from({ length: MAX_PALETTE + 1 }, (_, i) => ({ id: `c${i}`, recipe: recipe({ red: 1 }) })) })).toBe(false);
  });

  it('una biblioteca guardada con solo ritmos (antes de AR-05) sigue siendo válida', () => {
    const rh = createRhythmProject(emptyLibrary(), 'Ritmo', 'es', NOW);
    expect(isArtLibrary(JSON.parse(JSON.stringify(rh.lib)))).toBe(true);
  });
});

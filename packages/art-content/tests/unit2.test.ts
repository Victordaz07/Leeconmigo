import { describe, expect, it } from 'vitest';
import {
  CHANGES, DECISIONS, ENCOUNTERS2, EXAMPLE_PALETTES, INTENTIONS2, MIN_STROKES, PALETTE_SIZE, RELATIONS, SEEN, UNIT2_COPY, UNIT2_ID, addToPalette, answerLook, beginStroke, brush, chosenColors, colorOf,
  completeEncounter2, emptyDrawing, emptyLibrary, emptyRecipe, endStroke, ensureUnit2Project, extendStroke, isArtLibrary, isDone2, isMixedColor, missingFor2, paintOf, paintingAt, paintingStats,
  paintingsDiffer, patchUnit2, projectById, setPalette4, unit2Of, unit2Stars, updateScene, withDrawing, type ArtLibrary, type Recipe,
} from '../src/index.ts';

const NOW = 1_700_000_000_000;
const start = (): { lib: ArtLibrary; id: string } => {
  const r = ensureUnit2Project(emptyLibrary(), 'Dos cuadros', 'es', NOW);
  return { lib: r.lib, id: r.project!.id };
};
const recipe = (o: Partial<Recipe>): Recipe => ({ ...emptyRecipe(), ...o });
const u = (lib: ArtLibrary) => unit2Of(lib);
const proj = (lib: ArtLibrary, id: string) => projectById(lib, id);

/** Agrega un color a la paleta del primer cuadro. */
const addColor = (lib: ArtLibrary, id: string, r: Recipe): { lib: ArtLibrary; colorId: string } => {
  const scene = paintingAt(proj(lib, id), 0)!;
  const res = addToPalette(scene.palette, r);
  return { lib: updateScene(lib, id, 0, { ...scene, palette: res.palette }, NOW + 1), colorId: res.id! };
};
/** Pinta `n` trazos de un color en el cuadro `index`. */
const paint = (lib: ArtLibrary, id: string, index: 0 | 1, hex: string, n: number, dx = 0): ArtLibrary => {
  const scene = paintingAt(proj(lib, id), index)!;
  let d = emptyDrawing();
  for (let i = 0; i < n; i++) {
    d = beginStroke(d, 20 + i * 60 + dx, 40, 0.5, brush(hex, 10));
    d = extendStroke(d, 60 + i * 60 + dx, 120, 0.5);
    d = endStroke(d);
  }
  return updateScene(lib, id, index, withDrawing(scene, d), NOW + 2);
};
/** Lleva la unidad hasta tener los cuatro colores elegidos. */
const withPalette4 = (): { lib: ArtLibrary; id: string; hexes: string[] } => {
  let { lib, id } = start();
  const mixed = addColor(lib, id, recipe({ red: 1, yellow: 1 }));
  lib = mixed.lib;
  const ids = ['c1', 'c3', 'c4', mixed.colorId];
  lib = setPalette4(lib, ids, NOW).lib;
  const hexes = chosenColors(proj(lib, id), u(lib)).map(colorOf);
  return { lib, id, hexes };
};

describe('arranque', () => {
  it('crea un proyecto de pintura con DOS cuadros y lo recuerda; no crea otro si ya está', () => {
    const a = start();
    const p = proj(a.lib, a.id)!;
    expect(p.scenes).toHaveLength(2);
    expect(p.scenes.every((s) => s.kind === 'painting')).toBe(true);
    expect(u(a.lib).projectId).toBe(a.id);
    expect(ensureUnit2Project(a.lib, 'otro', 'es', NOW + 5).lib).toBe(a.lib);
    expect(isArtLibrary(a.lib)).toBe(true);
  });

  it('una biblioteca con las dos unidades, o solo con una, es válida; una unidad desconocida no', () => {
    const lib = start().lib;
    expect(isArtLibrary({ ...lib, units: { 'A2-U02': u(lib) } })).toBe(true);
    expect(isArtLibrary({ ...lib, units: { 'A9-U99': u(lib) } })).toBe(false);
    expect(isArtLibrary({ ...lib, units: { 'A2-U02': { ...u(lib), decision: 'raro' } } })).toBe(false);
    expect(isArtLibrary({ ...lib, units: { 'A2-U02': { ...u(lib), paletteIds: ['a', 'a'] } } })).toBe(false);
  });
});

describe('encuentro 1: mirar', () => {
  it('pide señalar la paleta de colores más parecidos (A); si no, invita a mirar otra vez sin guardar', () => {
    const { lib, id } = start();
    expect(missingFor2('look', u(lib), proj(lib, id))).toEqual(['look']);
    const wrong = answerLook(lib, 'B', NOW);
    expect(wrong.ok).toBe(false);
    expect(wrong.lib).toBe(lib);
    const right = answerLook(lib, 'A', NOW);
    expect(right.ok).toBe(true);
    expect(missingFor2('look', u(right.lib), proj(right.lib, id))).toEqual([]);
    expect(EXAMPLE_PALETTES.A).toHaveLength(4);
  });
});

describe('encuentros 2 y 3: mezclar y elegir cuatro', () => {
  it('mezclar pide un color que el niño mezcló (más de una gota); los de partida no cuentan', () => {
    const { lib, id } = start();
    expect(missingFor2('mix', u(lib), proj(lib, id))).toEqual(['mixed']);
    const one = addColor(lib, id, recipe({ red: 1 })); // ya estaba en la paleta de partida
    expect(missingFor2('mix', u(one.lib), proj(one.lib, id))).toEqual(['mixed']);
    const mixed = addColor(lib, id, recipe({ blue: 1, white: 2 }));
    expect(missingFor2('mix', u(mixed.lib), proj(mixed.lib, id))).toEqual([]);
    expect(isMixedColor(paintingAt(proj(mixed.lib, id), 0)!.palette.find((c) => c.id === mixed.colorId)!)).toBe(true);
  });

  it('la paleta son exactamente cuatro colores distintos que existan; con otra cantidad no se guarda', () => {
    const { lib, id } = start();
    expect(setPalette4(lib, ['c1', 'c2', 'c3'], NOW).ok).toBe(false);
    expect(setPalette4(lib, ['c1', 'c2', 'c3', 'c3'], NOW).ok).toBe(false);
    expect(setPalette4(lib, ['c1', 'c2', 'c3', 'zz'], NOW).ok).toBe(false);
    expect(setPalette4(lib, ['c1', 'c2', 'c3', 'c4', 'c5'], NOW).ok).toBe(false);
    const ok = setPalette4(lib, ['c1', 'c2', 'c3', 'c4'], NOW);
    expect(ok.ok).toBe(true);
    expect(chosenColors(proj(ok.lib, id), u(ok.lib))).toHaveLength(PALETTE_SIZE);
    expect(missingFor2('palette', u(ok.lib), proj(ok.lib, id))).toEqual(['relation']);
    expect(missingFor2('palette', u(patchUnit2(ok.lib, { relation: 'contrast' }, NOW)), proj(ok.lib, id))).toEqual([]);
  });
});

describe('encuentros 4 y 5: dos cuadros con la misma paleta', () => {
  it('cada cuadro pide unos cuantos trazos con SOLO los colores de la paleta, y la intención/el cambio', () => {
    let { lib, id, hexes } = withPalette4();
    expect(missingFor2('first', u(lib), proj(lib, id))).toEqual(['strokes1', 'intention']);
    lib = paint(lib, id, 0, hexes[0]!, MIN_STROKES - 1);
    expect(missingFor2('first', u(lib), proj(lib, id))).toContain('strokes1');
    lib = paint(lib, id, 0, hexes[0]!, MIN_STROKES);
    lib = patchUnit2(lib, { intention: 'calm' }, NOW);
    expect(missingFor2('first', u(lib), proj(lib, id))).toEqual([]);
    // un trazo con un color que NO es de la paleta rompe «solo tu paleta»
    const outside = paint(lib, id, 0, '#123456', MIN_STROKES);
    expect(missingFor2('first', u(outside), proj(outside, id))).toEqual(['strokes1']);
    // lo mismo en el segundo cuadro
    expect(missingFor2('second', u(lib), proj(lib, id))).toEqual(['strokes2', 'changed']);
    lib = paint(lib, id, 1, hexes[1]!, MIN_STROKES, 30);
    lib = patchUnit2(lib, { changed: 'value' }, NOW);
    expect(missingFor2('second', u(lib), proj(lib, id))).toEqual([]);
  });

  it('la goma no cuenta como trazo de pintura ni rompe la paleta', () => {
    let { lib, id, hexes } = withPalette4();
    lib = paint(lib, id, 0, hexes[0]!, MIN_STROKES);
    const scene = paintingAt(proj(lib, id), 0)!;
    let d = emptyDrawing();
    d = { ...d, strokes: [...scene.drawing.strokes] };
    d = endStroke(extendStroke(beginStroke(d, 5, 5, 0.5, brush('#FFF8EC', 40, true)), 90, 90, 0.5));
    lib = updateScene(lib, id, 0, withDrawing(scene, d), NOW + 3);
    const st = paintingStats(paintingAt(proj(lib, id), 0), chosenColors(proj(lib, id), u(lib)));
    expect(st.strokes).toBe(MIN_STROKES);
    expect(st.inPalette).toBe(true);
  });
});

describe('encuentro 6: comparar', () => {
  it('pide dos cuadros distintos, la diferencia que ve y la decisión (la diferencia no se califica contra lo que cambió)', () => {
    let { lib, id, hexes } = withPalette4();
    expect(missingFor2('compare', u(lib), proj(lib, id))).toEqual(['bothPaintings', 'seen', 'decision']);
    lib = paint(lib, id, 0, hexes[0]!, 3);
    lib = paint(lib, id, 1, hexes[0]!, 3); // idénticos
    expect(paintingsDiffer(proj(lib, id))).toBe(false);
    lib = paint(lib, id, 1, hexes[1]!, 4, 25);
    expect(paintingsDiffer(proj(lib, id))).toBe(true);
    // puede ver una diferencia distinta de la que dijo que cambió: ambas son válidas
    lib = patchUnit2(lib, { changed: 'value', seen: 'where', decision: 'try' }, NOW);
    expect(missingFor2('compare', u(lib), proj(lib, id))).toEqual([]);
  });
});

describe('completar y estrellas por esfuerzo', () => {
  it('no se marca un encuentro al que le falta algo; se puede marcar en cualquier orden', () => {
    const { lib } = start();
    expect(completeEncounter2(lib, 'look', NOW)).toBe(lib);
    const looked = answerLook(lib, 'A', NOW).lib;
    const done = completeEncounter2(looked, 'look', NOW);
    expect(u(done).done).toEqual(['look']);
    expect(completeEncounter2(done, 'look', NOW)).toBe(done);
    expect(isDone2(u(done))).toBe(false);
  });

  it('las estrellas premian explorar, comparar y explicar; nunca la cantidad de trazos', () => {
    let { lib, id, hexes } = withPalette4();
    expect(unit2Stars(u(lib), proj(lib, id)).total).toBe(0);
    // muchísimos trazos no dan estrellas por sí solos
    lib = paint(lib, id, 0, hexes[0]!, 30);
    expect(unit2Stars(u(lib), proj(lib, id)).total).toBe(0);
    lib = patchUnit2(lib, { lookOk: true, relation: 'family' }, NOW);
    lib = completeEncounter2(lib, 'mix', NOW);
    lib = completeEncounter2(lib, 'palette', NOW);
    expect(unit2Stars(u(lib), proj(lib, id))).toMatchObject({ explored: true, compared: false, explained: false, total: 1 });
    lib = paint(lib, id, 1, hexes[1]!, 4, 25);
    expect(unit2Stars(u(lib), proj(lib, id)).compared).toBe(true);
    lib = patchUnit2(lib, { decision: 'clearer' }, NOW);
    expect(unit2Stars(u(lib), proj(lib, id)).total).toBe(3);
    expect(paintOf(proj(lib, id)!)).toBeDefined();
  });
});

describe('textos de la unidad', () => {
  it('ES y EN tienen las mismas claves y nunca dicen «incorrecto» ni «mal»; cada opción tiene texto', () => {
    expect(Object.keys(UNIT2_COPY.es).sort()).toEqual(Object.keys(UNIT2_COPY.en).sort());
    for (const lang of ['es', 'en'] as const) {
      const c = UNIT2_COPY[lang];
      const all = JSON.stringify([c.lookHint, c.lookOk, c.missing, c.relations, c.intentions, c.changes, c.seen, c.decisions, c.doneText, c.capsuleNote]);
      expect(all).not.toMatch(/incorrect|wrong|\bmal\b|error|puntos|points/i);
      for (const e of ENCOUNTERS2) expect(c.encounters[e].title.length).toBeGreaterThan(0);
      for (const k of RELATIONS) expect(c.relations[k].length).toBeGreaterThan(0);
      for (const k of INTENTIONS2) expect(c.intentions[k].length).toBeGreaterThan(0);
      for (const k of CHANGES) expect(c.changes[k].length).toBeGreaterThan(0);
      for (const k of SEEN) expect(c.seen[k].length).toBeGreaterThan(0);
      for (const k of DECISIONS) expect(c.decisions[k].length).toBeGreaterThan(0);
    }
    expect(UNIT2_ID).toBe('A2-U02');
  });
});

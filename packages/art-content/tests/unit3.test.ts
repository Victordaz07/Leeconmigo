import { describe, expect, it } from 'vitest';
import {
  EXAMPLE_DISPLAY, EXAMPLE_IDS, IDEAS, MIN_PIECES_PER_SCENE, MOMENTS, PLANS, PLAYGROUND_INDEX, UNIT3_COPY, UNIT3_ID, addPiece, answerOrder, changesBetween, collageAt, completeEncounter3, copyScene, detectedChanges,
  emptyLibrary, ensureUnit3Project, exampleScene, isArtLibrary, isCollageScene, isDone3, isStoryOrder, missingFor3, movePiece, patchUnit3, playedEnough, projectById, rotatePiece, sceneReady, scalePiece,
  storyScenes, unit3Of, unit3Stars, updateScene, ENCOUNTERS3, type ArtLibrary, type CollageScene,
} from '../src/index.ts';

const NOW = 1_700_000_000_000;
const start = (): { lib: ArtLibrary; id: string } => {
  const r = ensureUnit3Project(emptyLibrary(), 'Mi historia', 'es', NOW);
  return { lib: r.lib, id: r.project!.id };
};
const u = (lib: ArtLibrary) => unit3Of(lib);
const proj = (lib: ArtLibrary, id: string) => projectById(lib, id);
const set = (lib: ArtLibrary, id: string, i: number, scene: CollageScene) => updateScene(lib, id, i, scene, NOW + 1);
/** Una escena con `n` piezas de formas distintas. */
const withPieces = (n: number): CollageScene => {
  const shapes = ['circle', 'square', 'triangle', 'strip', 'star', 'leaf'] as const;
  let s = collageBase();
  for (let i = 0; i < n; i++) s = addPiece(s, shapes[i % shapes.length]!, 'red').scene;
  return s;
};
const collageBase = (): CollageScene => ({ kind: 'collage', background: 'cream', pieces: [] });
/** Lleva la unidad hasta tener las tres escenas hechas, con un cambio en cada paso. */
const fullStory = (): { lib: ArtLibrary; id: string } => {
  let { lib, id } = start();
  const s1 = withPieces(3);
  lib = set(lib, id, 0, s1);
  const s2 = movePiece(s1, s1.pieces[0]!.id, 800, 100);
  lib = set(lib, id, 1, s2);
  const s3 = scalePiece(s2, s2.pieces[1]!.id, 1.25);
  lib = set(lib, id, 2, s3);
  return { lib, id };
};

describe('arranque', () => {
  it('crea un collage con CUATRO cartones y lo recuerda; no crea otro si ya está', () => {
    const a = start();
    const p = proj(a.lib, a.id)!;
    expect(p.scenes).toHaveLength(4);
    expect(p.scenes.every((s) => s.kind === 'collage')).toBe(true);
    expect(u(a.lib).projectId).toBe(a.id);
    expect(ensureUnit3Project(a.lib, 'otro', 'es', NOW + 5).lib).toBe(a.lib);
    expect(isArtLibrary(a.lib)).toBe(true);
  });

  it('una biblioteca con la unidad es válida; datos rotos o claves raras, no', () => {
    const lib = start().lib;
    expect(isArtLibrary({ ...lib, units: { [UNIT3_ID]: u(lib) } })).toBe(true);
    expect(isArtLibrary({ ...lib, units: { [UNIT3_ID]: { ...u(lib), moment: 'nunca' } } })).toBe(false);
    expect(isArtLibrary({ ...lib, units: { [UNIT3_ID]: { ...u(lib), done: ['look', 'look'] } } })).toBe(false);
    expect(isArtLibrary(JSON.parse(JSON.stringify(lib)))).toBe(true);
  });

  it('el avance nuevo no cambia si se repite lo mismo', () => {
    const { lib } = start();
    const a = patchUnit3(lib, { idea: 'grows' }, NOW + 1);
    expect(patchUnit3(a, { idea: 'grows' }, NOW + 9)).toBe(a);
  });
});

describe('encuentro 1: ordenar tres escenas', () => {
  it('las escenas de ejemplo son válidas y el barco avanza de A a C', () => {
    for (const id of EXAMPLE_IDS) expect(isCollageScene(exampleScene(id))).toBe(true);
    const x = (id: 'A' | 'B' | 'C') => exampleScene(id).pieces.find((p) => p.id === 'k3')!.x;
    expect(x('A')).toBeLessThan(x('B'));
    expect(x('B')).toBeLessThan(x('C'));
    expect(changesBetween(exampleScene('A'), exampleScene('B'))).toEqual(['moved']);
  });

  it('se muestran mezcladas (no ya en orden)', () => {
    expect([...EXAMPLE_DISPLAY]).not.toEqual([...EXAMPLE_IDS]);
    expect([...EXAMPLE_DISPLAY].sort()).toEqual([...EXAMPLE_IDS]);
  });

  it('solo el orden de la historia cuenta; si no, no pasa nada (sin «incorrecto»)', () => {
    const { lib } = start();
    expect(isStoryOrder(['A', 'B', 'C'])).toBe(true);
    expect(isStoryOrder(['B', 'A', 'C'])).toBe(false);
    expect(isStoryOrder(['A', 'B'])).toBe(false);
    const bad = answerOrder(lib, ['C', 'B', 'A'], NOW);
    expect(bad.ok).toBe(false);
    expect(bad.lib).toBe(lib);
    const good = answerOrder(lib, ['A', 'B', 'C'], NOW);
    expect(good.ok).toBe(true);
    expect(u(good.lib).lookOk).toBe(true);
    expect(missingFor3('look', u(good.lib), undefined)).toEqual([]);
  });
});

describe('encuentro 2: probar piezas', () => {
  it('pide tres piezas, dos formas distintas y una pieza cambiada', () => {
    let { lib, id } = start();
    expect(missingFor3('explore', u(lib), proj(lib, id))).toEqual(['play']);
    let s = collageBase();
    for (let i = 0; i < 3; i++) s = addPiece(s, 'circle', 'red').scene;
    expect(playedEnough(s)).toBe(false); // una sola forma
    s = addPiece(s, 'star', 'red').scene;
    expect(playedEnough(s)).toBe(false); // nada cambiado
    expect(playedEnough(rotatePiece(s, s.pieces[0]!.id, 15))).toBe(true);
    expect(playedEnough(scalePiece(s, s.pieces[0]!.id, 1.25))).toBe(true);
    lib = set(lib, id, PLAYGROUND_INDEX, rotatePiece(s, s.pieces[0]!.id, 15));
    expect(missingFor3('explore', u(lib), proj(lib, id))).toEqual([]);
  });

  it('el cartón de probar no cuenta para la historia', () => {
    let { lib, id } = start();
    lib = set(lib, id, PLAYGROUND_INDEX, withPieces(5));
    expect(storyScenes(proj(lib, id)).every((s) => s.pieces.length === 0)).toBe(true);
  });
});

describe('encuentro 3: la idea', () => {
  it('pide qué historia y qué va a cambiar', () => {
    let { lib, id } = start();
    expect(missingFor3('idea', u(lib), proj(lib, id))).toEqual(['idea', 'plan']);
    lib = patchUnit3(lib, { idea: IDEAS[0] }, NOW);
    expect(missingFor3('idea', u(lib), proj(lib, id))).toEqual(['plan']);
    lib = patchUnit3(lib, { plan: PLANS[0] }, NOW);
    expect(missingFor3('idea', u(lib), proj(lib, id))).toEqual([]);
  });
});

describe('encuentros 4 y 5: las tres escenas', () => {
  it('la escena 1 pide tres piezas', () => {
    let { lib, id } = start();
    expect(missingFor3('first', u(lib), proj(lib, id))).toEqual(['scene1']);
    lib = set(lib, id, 0, withPieces(MIN_PIECES_PER_SCENE));
    expect(sceneReady(proj(lib, id), 0)).toBe(true);
    expect(missingFor3('first', u(lib), proj(lib, id))).toEqual([]);
  });

  it('las escenas 2 y 3 piden piezas Y que algo cambie respecto a la anterior', () => {
    let { lib, id } = start();
    const s1 = withPieces(3);
    lib = set(lib, id, 0, s1);
    lib = set(lib, id, 1, s1); // igual: no cuenta
    expect(missingFor3('next', u(lib), proj(lib, id))).toEqual(['scene2', 'scene3']);
    lib = set(lib, id, 1, movePiece(s1, s1.pieces[0]!.id, 700, 100));
    expect(missingFor3('next', u(lib), proj(lib, id))).toEqual(['scene3']);
  });

  it('un temblorcito (5 unidades) no cuenta como cambio', () => {
    let { lib, id } = start();
    const s1 = withPieces(3);
    lib = set(lib, id, 0, s1);
    lib = set(lib, id, 1, movePiece(s1, s1.pieces[0]!.id, s1.pieces[0]!.x + 5, s1.pieces[0]!.y));
    expect(sceneReady(proj(lib, id), 1)).toBe(false);
  });

  it('copiar la escena de antes deja las mismas piezas (mismos ids) y se puede seguir cambiando', () => {
    let { lib, id } = start();
    const s1 = withPieces(3);
    lib = set(lib, id, 0, s1);
    lib = copyScene(lib, id, 0, 1, NOW + 3);
    const s2 = collageAt(proj(lib, id), 1)!;
    expect(s2.pieces.map((p) => p.id)).toEqual(s1.pieces.map((p) => p.id));
    expect(s2.pieces[0]).not.toBe(s1.pieces[0]);
    expect(sceneReady(proj(lib, id), 1)).toBe(false); // igual todavía
    lib = set(lib, id, 1, addPiece(s2, 'star', 'blue').scene);
    expect(sceneReady(proj(lib, id), 1)).toBe(true);
    expect(copyScene(lib, id, 1, 1, NOW)).toBe(lib);
    expect(copyScene(lib, id, 0, 9, NOW)).toBe(lib);
    expect(isArtLibrary(JSON.parse(JSON.stringify(lib)))).toBe(true);
  });
});

describe('encuentro 6: cuéntala', () => {
  it('detecta los cambios de la historia (para decir «lo veo» o «no lo veo todavía»)', () => {
    const { lib, id } = fullStory();
    expect(detectedChanges(proj(lib, id)).sort()).toEqual(['grew', 'moved']);
  });

  it('pide qué cambió y cuándo pasa lo más importante', () => {
    const { lib, id } = fullStory();
    expect(missingFor3('tell', u(lib), proj(lib, id))).toEqual(['told', 'moment']);
    const l2 = patchUnit3(lib, { told: 'moved', moment: MOMENTS[1] }, NOW + 2);
    expect(missingFor3('tell', u(l2), proj(l2, id))).toEqual([]);
  });
});

describe('cerrar y estrellas', () => {
  it('un encuentro solo se marca si no falta nada, y no se repite', () => {
    const { lib } = start();
    expect(completeEncounter3(lib, 'look', NOW + 1)).toBe(lib);
    const l2 = completeEncounter3(patchUnit3(lib, { lookOk: true }, NOW + 1), 'look', NOW + 2);
    expect(u(l2).done).toEqual(['look']);
    expect(completeEncounter3(l2, 'look', NOW + 3)).toBe(l2);
  });

  it('las estrellas son por esfuerzo, no por «bonito» ni por cantidad de piezas', () => {
    let { lib, id } = fullStory();
    expect(unit3Stars(u(lib), proj(lib, id))).toMatchObject({ explored: false, sequenced: true, explained: false, total: 1 });
    // muchas piezas no dan estrellas por sí solas
    const many = start();
    const lib2 = set(many.lib, many.id, 0, withPieces(30));
    expect(unit3Stars(u(lib2), proj(lib2, many.id)).total).toBe(0);
    lib = patchUnit3(lib, { done: ['look', 'explore'], told: 'grew', moment: 'last' }, NOW + 1);
    expect(unit3Stars(u(lib), proj(lib, id))).toMatchObject({ explored: true, sequenced: true, explained: true, total: 3 });
  });

  it('se completa la unidad al hacer los seis encuentros', () => {
    const { lib } = fullStory();
    expect(isDone3(u(lib))).toBe(false);
    expect(isDone3({ ...u(lib), done: [...ENCOUNTERS3] })).toBe(true);
  });
});

describe('textos', () => {
  it('ES y EN tienen lo mismo y nunca dicen «incorrecto» ni «mal»', () => {
    for (const lang of ['es', 'en'] as const) {
      const c = UNIT3_COPY[lang];
      expect(Object.keys(c.missing).length).toBe(9);
      const all = JSON.stringify([c.missing, c.lookHint, c.lookOk, c.tellNotSeen, c.sceneSame, c.encounters]).toLowerCase();
      for (const bad of ['incorrect', 'wrong', 'mal ', 'error', 'equivoc']) expect(all).not.toContain(bad);
    }
    expect(Object.keys(UNIT3_COPY.es.plans)).toEqual(Object.keys(UNIT3_COPY.en.plans));
    expect(Object.keys(UNIT3_COPY.es.ideas)).toEqual(Object.keys(UNIT3_COPY.en.ideas));
    expect(Object.keys(UNIT3_COPY.es.moments)).toEqual(Object.keys(UNIT3_COPY.en.moments));
    expect(Object.keys(UNIT3_COPY.es.encounters)).toEqual(Object.keys(UNIT3_COPY.en.encounters));
  });
});

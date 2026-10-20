import { describe, expect, it } from 'vitest';
import {
  MAX_PIECES, MAX_SIZE, MIN_SIZE, PAPER_H, PAPER_W, SHAPES, addPiece, canRedoPieces, canUndoPieces, changesBetween, clearPieces, cloneCollageScene, collageOf, createCollageProject, deletePiece, duplicatePiece, emptyLibrary,
  extents, hitTest, historyOf, isArtLibrary, isCollageScene, kindOf, movePiece, newCollageScene, pushHistory, recolorPiece, redoPieces, reorderPiece, rotatePiece, scalePiece, setBackground, shapePath, undoPieces,
  updateScene, duplicateProject, type CollageScene,
} from '../src/index.ts';

const withOne = (shape: (typeof SHAPES)[number] = 'square') => {
  const r = addPiece(newCollageScene(), shape, 'red');
  return { scene: r.scene, id: r.id! };
};

describe('collage: piezas', () => {
  it('agrega piezas con ids únicos, cada una un poco corrida', () => {
    let s = newCollageScene();
    for (let i = 0; i < 6; i++) s = addPiece(s, 'circle', 'blue').scene;
    expect(new Set(s.pieces.map((p) => p.id)).size).toBe(6);
    expect(new Set(s.pieces.map((p) => `${p.x},${p.y}`)).size).toBe(6);
    expect(isCollageScene(s)).toBe(true);
  });

  it('respeta el tope de piezas', () => {
    let s = newCollageScene();
    for (let i = 0; i < MAX_PIECES; i++) s = addPiece(s, 'star', 'yellow').scene;
    const r = addPiece(s, 'star', 'yellow');
    expect(r.id).toBeNull();
    expect(r.scene).toBe(s);
    expect(duplicatePiece(s, s.pieces[0]!.id).id).toBeNull();
  });

  it('mover no deja salir la pieza del cartón y no cambia si no se movió', () => {
    const { scene, id } = withOne();
    const moved = movePiece(scene, id, -50, 9999);
    expect(moved.pieces[0]!.x).toBe(0);
    expect(moved.pieces[0]!.y).toBe(PAPER_H);
    const p = scene.pieces[0]!;
    expect(movePiece(scene, id, p.x, p.y)).toBe(scene);
    expect(movePiece(scene, 'nada', 1, 1)).toBe(scene);
  });

  it('escalar respeta el mínimo y el máximo', () => {
    const { scene, id } = withOne();
    let s = scene;
    for (let i = 0; i < 30; i++) s = scalePiece(s, id, 1.25);
    expect(s.pieces[0]!.size).toBe(MAX_SIZE);
    for (let i = 0; i < 60; i++) s = scalePiece(s, id, 0.8);
    expect(s.pieces[0]!.size).toBe(MIN_SIZE);
  });

  it('girar da vueltas de 0 a 359, en los dos sentidos', () => {
    const { scene, id } = withOne();
    expect(rotatePiece(scene, id, 15).pieces[0]!.rot).toBe(15);
    expect(rotatePiece(scene, id, -15).pieces[0]!.rot).toBe(345);
    expect(rotatePiece(rotatePiece(scene, id, 350), id, 20).pieces[0]!.rot).toBe(10);
  });

  it('cambia el color, copia y quita', () => {
    const { scene, id } = withOne();
    expect(recolorPiece(scene, id, 'green').pieces[0]!.color).toBe('green');
    const dup = duplicatePiece(scene, id);
    expect(dup.scene.pieces).toHaveLength(2);
    expect(dup.scene.pieces[1]!.id).toBe(dup.id);
    expect(deletePiece(dup.scene, dup.id!).pieces).toHaveLength(1);
    expect(clearPieces(dup.scene).pieces).toHaveLength(0);
    expect(setBackground(scene, 'night').background).toBe('night');
  });

  it('las capas: al frente, al fondo, arriba y abajo', () => {
    let s = newCollageScene();
    const ids = ['circle', 'square', 'star'].map((sh) => {
      const r = addPiece(s, sh as never, 'red');
      s = r.scene;
      return r.id!;
    });
    const order = (x: CollageScene) => x.pieces.map((p) => p.id).join(',');
    expect(order(reorderPiece(s, ids[0]!, 'front'))).toBe(`${ids[1]},${ids[2]},${ids[0]}`);
    expect(order(reorderPiece(s, ids[2]!, 'back'))).toBe(`${ids[2]},${ids[0]},${ids[1]}`);
    expect(order(reorderPiece(s, ids[0]!, 'up'))).toBe(`${ids[1]},${ids[0]},${ids[2]}`);
    expect(order(reorderPiece(s, ids[1]!, 'down'))).toBe(`${ids[1]},${ids[0]},${ids[2]}`);
    expect(reorderPiece(s, ids[2]!, 'front')).toBe(s);
  });
});

describe('collage: tocar una pieza', () => {
  it('toma la de arriba cuando hay dos encimadas', () => {
    let s = newCollageScene();
    s = addPiece(s, 'square', 'red').scene;
    s = addPiece(s, 'square', 'blue').scene;
    s = { ...s, pieces: s.pieces.map((p) => ({ ...p, x: 500, y: 350 })) };
    expect(hitTest(s, 500, 350)!.color).toBe('blue');
    expect(hitTest(s, 10, 10)).toBeUndefined();
  });

  it('tiene en cuenta el giro (una tira girada 90° es alta y angosta)', () => {
    const { scene, id } = withOne('strip');
    let s = movePiece(scene, id, 500, 350);
    expect(hitTest(s, 500 + 150, 350)).toBeDefined(); // la tira mide 320 de ancho
    expect(hitTest(s, 500, 350 + 150)).toBeUndefined();
    s = rotatePiece(s, id, 90);
    expect(hitTest(s, 500, 350 + 150)).toBeDefined();
    expect(hitTest(s, 500 + 150, 350)).toBeUndefined();
  });

  it('una pieza muy pequeña se puede tocar con el dedo', () => {
    let { scene, id } = withOne('circle');
    for (let i = 0; i < 10; i++) scene = scalePiece(scene, id, 0.8);
    scene = movePiece(scene, id, 300, 300);
    expect(scene.pieces[0]!.size).toBe(MIN_SIZE);
    expect(hitTest(scene, 300 + 25, 300)).toBeDefined();
  });
});

describe('collage: contornos', () => {
  it('cada forma tiene un camino y medidas razonables', () => {
    for (const sh of SHAPES) {
      expect(shapePath(sh, 160)).toMatch(/^M .* Z$/);
      const e = extents(sh, 160);
      expect(e.hw).toBeGreaterThan(0);
      expect(e.hh).toBeGreaterThan(0);
    }
  });
});

describe('collage: qué cambió entre escenas', () => {
  it('detecta movido, apareció, creció y ya no está', () => {
    const { scene: a, id } = withOne('circle');
    expect(changesBetween(a, movePiece(a, id, a.pieces[0]!.x + 200, a.pieces[0]!.y))).toEqual(['moved']);
    expect(changesBetween(a, movePiece(a, id, a.pieces[0]!.x + 5, a.pieces[0]!.y))).toEqual([]); // un temblor no cuenta
    expect(changesBetween(a, scalePiece(a, id, 1.25))).toEqual(['grew']);
    expect(changesBetween(a, addPiece(a, 'star', 'yellow').scene)).toEqual(['appeared']);
    expect(changesBetween(a, deletePiece(a, id))).toEqual(['gone']);
  });
});

describe('collage: deshacer y rehacer', () => {
  it('va y vuelve, y un cambio nuevo borra lo rehacible', () => {
    const a = newCollageScene();
    const b = addPiece(a, 'circle', 'red').scene;
    const c = addPiece(b, 'square', 'blue').scene;
    let h = pushHistory(pushHistory(historyOf(a), b), c);
    expect(canUndoPieces(h)).toBe(true);
    h = undoPieces(h);
    expect(h.present).toBe(b);
    expect(canRedoPieces(h)).toBe(true);
    expect(redoPieces(h).present).toBe(c);
    const d = addPiece(b, 'star', 'green').scene;
    expect(canRedoPieces(pushHistory(h, d))).toBe(false);
    expect(pushHistory(h, h.present)).toBe(h);
  });
});

describe('collage: proyecto y guardado', () => {
  it('crea un proyecto de collage, lo edita, lo duplica y se valida', () => {
    const r = createCollageProject(emptyLibrary(), 'Mi collage', 'es', 1);
    expect(r.id).toBe('p1');
    const proj = r.lib.projects[0]!;
    expect(kindOf(proj)).toBe('collage');
    const scene = addPiece(collageOf(proj)!, 'leaf', 'green').scene;
    const lib = updateScene(r.lib, 'p1', 0, scene, 2);
    expect(collageOf(lib.projects[0]!)!.pieces).toHaveLength(1);
    expect(isArtLibrary(JSON.parse(JSON.stringify(lib)))).toBe(true);
    const dup = duplicateProject(lib, 'p1', '(copia)', 3);
    expect(collageOf(dup.lib.projects[0]!)!.pieces).toHaveLength(1);
    // la copia no comparte piezas con el original
    expect(collageOf(dup.lib.projects[0]!)!.pieces[0]).not.toBe(scene.pieces[0]);
  });

  it('un collage no se reemplaza por una escena de otro taller', () => {
    const lib = createCollageProject(emptyLibrary(), 'x', 'es', 1).lib;
    const rhythm = { kind: 'rhythm', pattern: [[], [], [], []], kit: {}, bpm: 90 } as never;
    expect(updateScene(lib, 'p1', 0, rhythm, 2)).toBe(lib);
  });

  it('rechaza collages rotos', () => {
    const ok = addPiece(newCollageScene(), 'circle', 'red').scene;
    expect(isCollageScene(cloneCollageScene(ok))).toBe(true);
    const bad = (patch: object) => ({ ...ok, pieces: [{ ...ok.pieces[0]!, ...patch }] });
    expect(isCollageScene(bad({ shape: 'hexagon' }))).toBe(false);
    expect(isCollageScene(bad({ color: 'plaid' }))).toBe(false);
    expect(isCollageScene(bad({ x: PAPER_W + 1 }))).toBe(false);
    expect(isCollageScene(bad({ size: 5 }))).toBe(false);
    expect(isCollageScene(bad({ rot: 360 }))).toBe(false);
    expect(isCollageScene(bad({ x: Number.NaN }))).toBe(false);
    expect(isCollageScene({ ...ok, background: 'lava' })).toBe(false);
    expect(isCollageScene({ ...ok, pieces: [ok.pieces[0], ok.pieces[0]] })).toBe(false); // ids repetidos
    expect(isCollageScene({ ...ok, pieces: Array.from({ length: MAX_PIECES + 1 }, (_, i) => ({ ...ok.pieces[0]!, id: `k${i}` })) })).toBe(false);
  });
});

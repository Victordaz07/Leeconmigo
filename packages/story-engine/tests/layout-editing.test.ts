import { describe, expect, it } from 'vitest';
import type { LayoutFile } from '@lee-conmigo/contracts';
import {
  MIN_BOX, clampRect, emptyLayoutFile, historyPush, historyReplace, snapMoveRect, snapResizeRect, snapTargets, snapValue, historyRedo, historyStart, historyUndo, layoutDiffers, moveRect, patchBlock, patchBlocks, resetBlock, resizeRect,
  roundRect, setVariantFont, snapToBalloon, textBoxOf, validateLayoutFile,
} from '../src/index.ts';

const base = (): LayoutFile => emptyLayoutFile('fam');
const rect = { x: 100, y: 100, width: 400, height: 120 };

describe('patchBlock', () => {
  it('fija valores, sin mutar el archivo original', () => {
    const f0 = base();
    const f1 = patchBlock(f0, 'p1', 'b1', { text: rect, align: 'center' });
    expect(f0.pages).toEqual({});
    expect(f1.pages.p1.blocks.b1).toEqual({ text: rect, align: 'center' });
    expect(validateLayoutFile(f1)).toEqual([]);
  });

  it('null quita un ajuste; un cuadro sin ajustes (y su página) desaparecen', () => {
    let f = patchBlock(base(), 'p1', 'b1', { text: rect, align: 'center' });
    f = patchBlock(f, 'p1', 'b1', { align: null });
    expect(f.pages.p1.blocks.b1).toEqual({ text: rect });
    f = patchBlock(f, 'p1', 'b1', { text: null });
    expect(f.pages).toEqual({});
  });

  it('patchBlocks aplica el mismo cambio a varios cuadros', () => {
    const f = patchBlocks(base(), 'p1', ['b1', 'b2', 'b3'], { fontPx: 30 });
    expect(Object.keys(f.pages.p1.blocks)).toEqual(['b1', 'b2', 'b3']);
    expect(f.pages.p1.blocks.b2.fontPx).toBe(30);
  });

  it('resetBlock vuelve a la plantilla solo en ese cuadro', () => {
    let f = patchBlocks(base(), 'p1', ['b1', 'b2'], { align: 'right' });
    f = resetBlock(f, 'p1', 'b1');
    expect(Object.keys(f.pages.p1.blocks)).toEqual(['b2']);
    expect(resetBlock(f, 'p1', 'b2').pages).toEqual({});
  });

  it('setVariantFont fija la letra de una variante sin tocar las otras, y la quita con null', () => {
    let f = setVariantFont(base(), 'p1', 'b1', 'fam-es-n1', 28);
    f = setVariantFont(f, 'p1', 'b1', 'fam-en-n3', 22);
    expect(f.pages.p1.blocks.b1.fontPxByVariant).toEqual({ 'fam-es-n1': 28, 'fam-en-n3': 22 });
    f = setVariantFont(f, 'p1', 'b1', 'fam-es-n1', null);
    expect(f.pages.p1.blocks.b1.fontPxByVariant).toEqual({ 'fam-en-n3': 22 });
    expect(setVariantFont(setVariantFont(base(), 'p1', 'b1', 'x', 20), 'p1', 'b1', 'x', null).pages).toEqual({});
  });
});

describe('mover y redimensionar cajas', () => {
  it('moveRect no deja que la caja se salga de la ilustración', () => {
    expect(moveRect(rect, 50, -500)).toEqual({ x: 150, y: 0, width: 400, height: 120 });
    expect(moveRect(rect, 5000, 5000)).toEqual({ x: 1136, y: 904, width: 400, height: 120 });
    expect(moveRect(rect, -5000, 0).x).toBe(0);
  });

  it('resizeRect: cada tirador mueve solo su lado', () => {
    expect(resizeRect(rect, 'e', 30, 99)).toEqual({ x: 100, y: 100, width: 430, height: 120 });
    expect(resizeRect(rect, 'w', 30, 99)).toEqual({ x: 130, y: 100, width: 370, height: 120 });
    expect(resizeRect(rect, 's', 99, 30)).toEqual({ x: 100, y: 100, width: 400, height: 150 });
    expect(resizeRect(rect, 'n', 99, -40)).toEqual({ x: 100, y: 60, width: 400, height: 160 });
    expect(resizeRect(rect, 'se', 10, 20)).toEqual({ x: 100, y: 100, width: 410, height: 140 });
    expect(resizeRect(rect, 'nw', -10, -20)).toEqual({ x: 90, y: 80, width: 410, height: 140 });
  });

  it('resizeRect respeta el mínimo (no se invierte) y los bordes de la ilustración', () => {
    const tiny = resizeRect(rect, 'e', -5000, 0);
    expect(tiny.width).toBe(MIN_BOX);
    expect(tiny.x).toBe(100);
    expect(resizeRect(rect, 'w', 5000, 0)).toEqual({ x: 100 + 400 - MIN_BOX, y: 100, width: MIN_BOX, height: 120 });
    expect(resizeRect(rect, 'se', 5000, 5000)).toEqual({ x: 100, y: 100, width: 1436, height: 924 });
    expect(resizeRect(rect, 'nw', -5000, -5000)).toEqual({ x: 0, y: 0, width: 500, height: 220 });
  });

  it('snapToBalloon deja la caja del texto dentro del globo, con margen', () => {
    const balloon = { x: 27, y: 13, width: 720, height: 142 };
    expect(snapToBalloon(balloon)).toEqual(textBoxOf(balloon));
    expect(snapToBalloon(balloon).x).toBeGreaterThan(balloon.x);
  });

  it('roundRect deja números limpios y respeta el mínimo', () => {
    expect(roundRect({ x: 10.4, y: 20.6, width: 300.49, height: 5 })).toEqual({ x: 10, y: 21, width: 300, height: MIN_BOX });
    expect(roundRect({ x: 13, y: 27, width: 101, height: 99 }, 10)).toEqual({ x: 10, y: 30, width: 100, height: 100 });
  });
});

describe('layoutDiffers e historial', () => {
  it('ignora el orden de claves y los redondeos de 0,1 px; detecta cambios reales', () => {
    const a = patchBlock(base(), 'p1', 'b1', { text: rect, align: 'left' });
    const b = patchBlock(base(), 'p1', 'b1', { align: 'left', text: { ...rect, x: 100.04 } });
    expect(layoutDiffers(a, b)).toBe(false);
    expect(layoutDiffers(a, patchBlock(a, 'p1', 'b1', { align: 'right' }))).toBe(true);
    expect(layoutDiffers(base(), a)).toBe(true);
  });

  it('deshacer y rehacer recorren los cambios; un cambio nuevo borra el "rehacer"; sin cambios no se apunta', () => {
    let h = historyStart(1);
    h = historyPush(h, 2);
    h = historyPush(h, 3);
    expect(historyPush(h, 3)).toBe(h);
    h = historyUndo(h);
    expect(h.present).toBe(2);
    h = historyUndo(h);
    expect(h.present).toBe(1);
    expect(historyUndo(h)).toBe(h);
    h = historyRedo(h);
    expect(h.present).toBe(2);
    h = historyPush(h, 9);
    expect(h.future).toEqual([]);
    expect(historyRedo(h)).toBe(h);
    expect(historyUndo(h).present).toBe(2);
  });

  it('el historial tiene tope', () => {
    let h = historyStart(0);
    for (let i = 1; i <= 10; i++) h = historyPush(h, i, 4);
    expect(h.past).toHaveLength(4);
    expect(h.past[0]).toBe(6);
  });
});

describe('imán al arrastrar y agrupar cambios', () => {
  const balloon = { x: 27, y: 13, width: 720, height: 142 }; // caja por defecto: x 48..726, y 28..140
  const t = snapTargets(balloon);

  it('snapTargets: bordes de la caja por defecto y centro del globo', () => {
    expect(t.xs).toEqual([48, 726, 387]);
    expect(t.ys).toEqual([28, 140, 84]);
  });

  it('snapValue pega al objetivo cercano y respeta la tolerancia', () => {
    expect(snapValue(51, [48, 200], 6)).toBe(48);
    expect(snapValue(60, [48, 200], 6)).toBe(60);
    expect(snapValue(100, [], 6)).toBe(100);
  });

  it('snapMoveRect pega el borde izquierdo, el centro o el derecho, lo que esté más cerca', () => {
    expect(snapMoveRect({ x: 52, y: 30, width: 300, height: 100 }, t).x).toBe(48); // borde izquierdo
    const centered = snapMoveRect({ x: 240, y: 40, width: 300, height: 100 }, t); // centro 390 → 387
    expect(centered.x + centered.width / 2).toBe(387);
    expect(snapMoveRect({ x: 430, y: 40, width: 300, height: 100 }, t).x + 300).toBe(726); // borde derecho 730 → 726
    const far = { x: 200, y: 100, width: 100, height: 20 };
    expect(snapMoveRect(far, t)).toEqual(far);
  });

  it('snapResizeRect solo mueve los lados que se están arrastrando', () => {
    const r = { x: 52, y: 40, width: 300, height: 90 };
    expect(snapResizeRect(r, 'w', t)).toEqual({ x: 48, y: 40, width: 304, height: 90 });
    expect(snapResizeRect(r, 'e', t)).toEqual(r); // 352 no está cerca de nada
    expect(snapResizeRect({ ...r, width: 670 }, 'e', t)).toEqual({ x: 52, y: 40, width: 674, height: 90 }); // 722 → 726
    expect(snapResizeRect({ x: 60, y: 27, width: 300, height: 120 }, 'n', t).y).toBe(28);
  });

  it('snapResizeRect no aplica un imán que dejaría la caja más pequeña que el mínimo', () => {
    const r = { x: 60, y: 40, width: 30, height: 90 };
    expect(snapResizeRect(r, 'e', { xs: [70], ys: [] }, 20)).toEqual(r);
  });

  it('historyReplace sustituye el estado actual sin crecer el historial', () => {
    let h = historyStart(1);
    h = historyPush(h, 2);
    h = historyReplace(h, 3);
    h = historyReplace(h, 4);
    expect(h.present).toBe(4);
    expect(h.past).toEqual([1]);
    expect(historyUndo(h).present).toBe(1);
    expect(historyReplace(h, 4)).toBe(h);
  });
});

describe('clampRect', () => {
  it('deja la caja dentro de la ilustración y con el tamaño mínimo', () => {
    expect(clampRect({ x: 99999, y: -5, width: 400, height: 120 })).toEqual({ x: 1136, y: 0, width: 400, height: 120 });
    expect(clampRect({ x: 10, y: 10, width: 5, height: 99999 })).toEqual({ x: 10, y: 0, width: MIN_BOX, height: 1024 });
    expect(clampRect({ x: 100, y: 100, width: 400, height: 120 })).toEqual({ x: 100, y: 100, width: 400, height: 120 });
  });
});

/**
 * Operaciones puras del modo editor sobre un `LayoutFile`: todo devuelve un archivo NUEVO (nada se muta), así el editor puede
 * deshacer y rehacer, y las pruebas no necesitan interfaz. Las medidas son píxeles de la ilustración original (1536 × 1024).
 */
import type { BlockLayoutOverride, LayoutFile, PixelRect } from '@lee-conmigo/contracts';
import { normalizeLayoutFile } from './layout-file.ts';
import { TEMPLATE_CANVAS, textBoxOf } from './templates.ts';

/** Un cambio en un cuadro: un valor lo fija; `null` quita el ajuste (vuelve al valor de la plantilla). */
export type BlockPatch = { [K in keyof BlockLayoutOverride]?: BlockLayoutOverride[K] | null };

export const MIN_BOX = 24;

/** Aplica `patch` al ajuste de un cuadro. Un cuadro que queda sin ajustes desaparece del archivo. */
export function patchBlock(file: LayoutFile, pageId: string, blockId: string, patch: BlockPatch): LayoutFile {
  const current = file.pages[pageId]?.blocks[blockId] ?? {};
  const next: Record<string, unknown> = { ...current };
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined) delete next[k];
    else next[k] = v;
  }
  const blocks = { ...(file.pages[pageId]?.blocks ?? {}) };
  if (Object.keys(next).length) blocks[blockId] = next as BlockLayoutOverride;
  else delete blocks[blockId];
  const pages = { ...file.pages };
  if (Object.keys(blocks).length) pages[pageId] = { blocks };
  else delete pages[pageId];
  return { ...file, pages };
}

/** Aplica el mismo cambio a varios cuadros de una página ("misma letra en todos"). */
export function patchBlocks(file: LayoutFile, pageId: string, blockIds: string[], patch: BlockPatch): LayoutFile {
  return blockIds.reduce((f, id) => patchBlock(f, pageId, id, patch), file);
}

/** Quita todos los ajustes de un cuadro: vuelve a la plantilla. */
export function resetBlock(file: LayoutFile, pageId: string, blockId: string): LayoutFile {
  const blocks = { ...(file.pages[pageId]?.blocks ?? {}) };
  delete blocks[blockId];
  const pages = { ...file.pages };
  if (Object.keys(blocks).length) pages[pageId] = { blocks };
  else delete pages[pageId];
  return { ...file, pages };
}

/** Fija (o quita, con `null`) la letra de UNA variante; la de las demás no cambia. */
export function setVariantFont(file: LayoutFile, pageId: string, blockId: string, variantId: string, px: number | null): LayoutFile {
  const map = { ...(file.pages[pageId]?.blocks[blockId]?.fontPxByVariant ?? {}) };
  if (px === null) delete map[variantId];
  else map[variantId] = px;
  return patchBlock(file, pageId, blockId, { fontPxByVariant: Object.keys(map).length ? map : null });
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Mueve una caja sin dejar que se salga de la ilustración. */
export function moveRect(r: PixelRect, dx: number, dy: number): PixelRect {
  return { ...r, x: clamp(r.x + dx, 0, TEMPLATE_CANVAS.width - r.width), y: clamp(r.y + dy, 0, TEMPLATE_CANVAS.height - r.height) };
}

export type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/** Cambia el tamaño de una caja arrastrando un tirador; respeta el mínimo y no se sale de la ilustración. */
export function resizeRect(r: PixelRect, handle: Handle, dx: number, dy: number): PixelRect {
  let x0 = r.x;
  let y0 = r.y;
  let x1 = r.x + r.width;
  let y1 = r.y + r.height;
  if (handle.includes('w')) x0 = clamp(x0 + dx, 0, x1 - MIN_BOX);
  if (handle.includes('e')) x1 = clamp(x1 + dx, x0 + MIN_BOX, TEMPLATE_CANVAS.width);
  if (handle.includes('n')) y0 = clamp(y0 + dy, 0, y1 - MIN_BOX);
  if (handle.includes('s')) y1 = clamp(y1 + dy, y0 + MIN_BOX, TEMPLATE_CANVAS.height);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** La caja del texto que llena el globo dibujado (quita el borde y deja el margen habitual). */
export function snapToBalloon(balloon: PixelRect): PixelRect {
  return textBoxOf(balloon);
}

/** Redondea a `step` px (1 por defecto): las cajas quedan en números limpios al guardar. */
export function roundRect(r: PixelRect, step = 1): PixelRect {
  const q = (n: number) => Math.round(n / step) * step;
  return { x: q(r.x), y: q(r.y), width: Math.max(MIN_BOX, q(r.width)), height: Math.max(MIN_BOX, q(r.height)) };
}

/** ¿Hay diferencias entre dos archivos (ignorando el orden de claves y redondeos de 0,1 px)? */
export function layoutDiffers(a: LayoutFile, b: LayoutFile): boolean {
  return JSON.stringify(normalizeLayoutFile(a)) !== JSON.stringify(normalizeLayoutFile(b));
}

// --- Historial (deshacer / rehacer) --------------------------------------------------------------------------------------------

export interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export const historyStart = <T>(present: T): History<T> => ({ past: [], present, future: [] });

/** Nuevo estado; lo anterior pasa al historial (máx. `limit`) y se borra el "rehacer". Si no cambió, no se apunta. */
export function historyPush<T>(h: History<T>, next: T, limit = 200): History<T> {
  if (JSON.stringify(next) === JSON.stringify(h.present)) return h;
  return { past: [...h.past, h.present].slice(-limit), present: next, future: [] };
}

export function historyUndo<T>(h: History<T>): History<T> {
  if (!h.past.length) return h;
  return { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] };
}

export function historyRedo<T>(h: History<T>): History<T> {
  if (!h.future.length) return h;
  return { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) };
}

/** Como `historyPush`, pero SUSTITUYE el estado actual (para agrupar en un solo paso de "deshacer" una ráfaga de cambios). */
export function historyReplace<T>(h: History<T>, next: T): History<T> {
  if (JSON.stringify(next) === JSON.stringify(h.present)) return h;
  return { past: h.past, present: next, future: [] };
}

// --- Imán (snap) al arrastrar ------------------------------------------------------------------------------------------------

export interface SnapTargets {
  xs: number[];
  ys: number[];
}

/** Líneas a las que se pega una caja al arrastrarla: los bordes de la caja "por defecto" del globo y su centro. */
export function snapTargets(balloon: PixelRect): SnapTargets {
  const t = textBoxOf(balloon);
  return { xs: [t.x, t.x + t.width, balloon.x + balloon.width / 2], ys: [t.y, t.y + t.height, balloon.y + balloon.height / 2] };
}

/** El objetivo más cercano a `v` si está a menos de `tol`; si no, `v`. */
export function snapValue(v: number, targets: number[], tol = 6): number {
  let best = v;
  let bestD = tol + 1e-9;
  for (const t of targets) {
    const d = Math.abs(t - v);
    if (d < bestD) {
      best = t;
      bestD = d;
    }
  }
  return best;
}

/** Corrige un desplazamiento para que borde izquierdo/centro/derecho (y lo mismo en vertical) se peguen a las líneas. */
export function snapMoveRect(r: PixelRect, t: SnapTargets, tol = 6): PixelRect {
  const shift = (edges: number[], targets: number[]) => {
    let best = 0;
    let bestD = tol + 1e-9;
    for (const e of edges) for (const tg of targets) {
      const d = Math.abs(tg - e);
      if (d < bestD) {
        bestD = d;
        best = tg - e;
      }
    }
    return best;
  };
  const dx = shift([r.x, r.x + r.width / 2, r.x + r.width], t.xs);
  const dy = shift([r.y, r.y + r.height / 2, r.y + r.height], t.ys);
  return moveRect(r, dx, dy);
}

/** Corrige un redimensionado: solo los lados que se están moviendo se pegan a las líneas. */
export function snapResizeRect(r: PixelRect, handle: Handle, t: SnapTargets, tol = 6): PixelRect {
  let x0 = r.x;
  let y0 = r.y;
  let x1 = r.x + r.width;
  let y1 = r.y + r.height;
  if (handle.includes('w')) x0 = snapValue(x0, t.xs, tol);
  if (handle.includes('e')) x1 = snapValue(x1, t.xs, tol);
  if (handle.includes('n')) y0 = snapValue(y0, t.ys, tol);
  if (handle.includes('s')) y1 = snapValue(y1, t.ys, tol);
  if (x1 - x0 < MIN_BOX || y1 - y0 < MIN_BOX) return r;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** Deja una caja dentro de la ilustración y con al menos el tamaño mínimo (para lo que se escribe a mano en los campos). */
export function clampRect(r: PixelRect): PixelRect {
  const width = clamp(r.width, MIN_BOX, TEMPLATE_CANVAS.width);
  const height = clamp(r.height, MIN_BOX, TEMPLATE_CANVAS.height);
  return { x: clamp(r.x, 0, TEMPLATE_CANVAS.width - width), y: clamp(r.y, 0, TEMPLATE_CANVAS.height - height), width, height };
}

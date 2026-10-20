/**
 * Escena de collage (AR-06): piezas de papel de colores sobre un fondo, en el mismo lienzo LÓGICO que la pintura (1000 × 700), así se ve igual en
 * cualquier pantalla o giro. Lógica PURA: la pantalla pide una operación y recibe la escena nueva. El orden del arreglo es el de las capas (la última
 * pieza queda encima). Todo se maneja con botones y un dedo (arrastrar); no hace falta pellizcar ni usar dos dedos.
 *
 * El collage trabaja con papeles y formas simples, no con el dibujo del niño: reutilizar la pintura propia como pieza llega con el recorrido
 * «dibujo → collage → animación» (AR-06c).
 */
import { PAPER_H, PAPER_W } from './paint.ts';

export const SHAPES = ['circle', 'square', 'triangle', 'strip', 'star', 'leaf'] as const;
export type Shape = (typeof SHAPES)[number];

/** Papeles de colores (identificador → color). El guardado lleva el identificador, no el color: cambiar el tono no rompe lo guardado. */
export const PAPER_COLORS = {
  red: '#E4572E',
  orange: '#F79D2E',
  yellow: '#F9D548',
  green: '#4CA64C',
  teal: '#2A9D8F',
  blue: '#3C78D8',
  purple: '#8E5BB5',
  pink: '#F28AB2',
  brown: '#8B5E3C',
  black: '#222831',
} as const;
export type PaperColor = keyof typeof PAPER_COLORS;
export const PAPER_COLOR_IDS = Object.keys(PAPER_COLORS) as PaperColor[];

/** Fondos del cartón sobre el que se pega (claros y oscuros). */
export const BACKGROUNDS = {
  cream: '#FFF7E8',
  white: '#FFFFFF',
  sky: '#CFE8F7',
  grass: '#D3EBC8',
  sand: '#F3DFB6',
  night: '#1F2A44',
} as const;
export type Background = keyof typeof BACKGROUNDS;
export const BACKGROUND_IDS = Object.keys(BACKGROUNDS) as Background[];

export interface Piece {
  id: string;
  shape: Shape;
  color: PaperColor;
  /** Centro de la pieza en el lienzo lógico. */
  x: number;
  y: number;
  /** Ancho nominal de la pieza (la tira es más larga que ancha, ver `extents`). */
  size: number;
  /** Giro en grados, 0–359. */
  rot: number;
}

export interface CollageScene {
  kind: 'collage';
  background: Background;
  /** De atrás hacia adelante. */
  pieces: Piece[];
}

export const MAX_PIECES = 60;
export const MIN_SIZE = 30;
export const MAX_SIZE = 600;
export const DEFAULT_SIZE = 160;
export const ROTATE_STEP = 15;
/** Cuánto crece o se encoge una pieza en cada toque. */
export const SCALE_STEP = 1.25;
/** Lado mínimo (en unidades del lienzo) de la zona donde un dedo «agarra» una pieza, para poder tocar las pequeñas. */
const MIN_TOUCH_HALF = 28;

export const newCollageScene = (): CollageScene => ({ kind: 'collage', background: 'cream', pieces: [] });

export const cloneCollageScene = (s: CollageScene): CollageScene => ({ kind: 'collage', background: s.background, pieces: s.pieces.map((p) => ({ ...p })) });

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number) => Math.round(v * 10) / 10;

/** Mitad del ancho y del alto de la pieza (sin giro). */
export function extents(shape: Shape, size: number): { hw: number; hh: number } {
  switch (shape) {
    case 'strip':
      return { hw: size, hh: size * 0.2 };
    case 'triangle':
      return { hw: size / 2, hh: size * 0.45 };
    case 'leaf':
      return { hw: size * 0.35, hh: size / 2 };
    default:
      return { hw: size / 2, hh: size / 2 };
  }
}

const f = (n: number) => Math.round(n * 10) / 10;

/** El contorno de la pieza como camino SVG, centrado en (0, 0) y sin girar (la pantalla lo traslada y lo gira). */
export function shapePath(shape: Shape, size: number): string {
  const { hw, hh } = extents(shape, size);
  switch (shape) {
    case 'circle': {
      const r = size / 2;
      return `M ${f(-r)} 0 A ${f(r)} ${f(r)} 0 1 0 ${f(r)} 0 A ${f(r)} ${f(r)} 0 1 0 ${f(-r)} 0 Z`;
    }
    case 'square':
      return `M ${f(-hw)} ${f(-hh)} L ${f(hw)} ${f(-hh)} L ${f(hw)} ${f(hh)} L ${f(-hw)} ${f(hh)} Z`;
    case 'strip':
      return `M ${f(-hw)} ${f(-hh)} L ${f(hw)} ${f(-hh)} L ${f(hw)} ${f(hh)} L ${f(-hw)} ${f(hh)} Z`;
    case 'triangle':
      return `M 0 ${f(-hh)} L ${f(hw)} ${f(hh)} L ${f(-hw)} ${f(hh)} Z`;
    case 'leaf':
      return `M 0 ${f(-hh)} Q ${f(hw * 1.9)} 0 0 ${f(hh)} Q ${f(-hw * 1.9)} 0 0 ${f(-hh)} Z`;
    case 'star': {
      const outer = size / 2;
      const inner = outer * 0.45;
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (-90 + i * 36) * (Math.PI / 180);
        pts.push(`${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`);
      }
      return `M ${pts.join(' L ')} Z`;
    }
  }
}

export const nextPieceId = (s: CollageScene): string => `k${Math.max(0, ...s.pieces.map((p) => Number(p.id.replace(/^k/, '')) || 0)) + 1}`;

const mapPiece = (s: CollageScene, id: string, change: (p: Piece) => Piece): CollageScene => {
  const cur = s.pieces.find((p) => p.id === id);
  if (!cur) return s;
  const next = change(cur);
  if (JSON.stringify(next) === JSON.stringify(cur)) return s;
  return { ...s, pieces: s.pieces.map((p) => (p.id === id ? next : p)) };
};

/** Pega una pieza nueva cerca del centro (cada una un poco corrida, para no taparse del todo). Con `MAX_PIECES`, no agrega (`id` = null). */
export function addPiece(s: CollageScene, shape: Shape, color: PaperColor): { scene: CollageScene; id: string | null } {
  if (s.pieces.length >= MAX_PIECES) return { scene: s, id: null };
  const n = s.pieces.length;
  const piece: Piece = { id: nextPieceId(s), shape, color, x: PAPER_W / 2 + ((n % 5) - 2) * 36, y: PAPER_H / 2 + ((Math.floor(n / 5) % 4) - 1.5) * 36, size: DEFAULT_SIZE, rot: 0 };
  return { scene: { ...s, pieces: [...s.pieces, piece] }, id: piece.id };
}

/** Mueve el centro de la pieza; nunca sale del cartón. */
export const movePiece = (s: CollageScene, id: string, x: number, y: number): CollageScene =>
  mapPiece(s, id, (p) => ({ ...p, x: round(clamp(x, 0, PAPER_W)), y: round(clamp(y, 0, PAPER_H)) }));

/** Agranda (`factor` > 1) o encoge una pieza, dentro de los límites. */
export const scalePiece = (s: CollageScene, id: string, factor: number): CollageScene => mapPiece(s, id, (p) => ({ ...p, size: Math.round(clamp(p.size * factor, MIN_SIZE, MAX_SIZE)) }));

/** Gira la pieza `deg` grados (positivo = hacia la derecha). */
export const rotatePiece = (s: CollageScene, id: string, deg: number): CollageScene => mapPiece(s, id, (p) => ({ ...p, rot: (((Math.round(p.rot + deg) % 360) + 360) % 360) }));

export const recolorPiece = (s: CollageScene, id: string, color: PaperColor): CollageScene => mapPiece(s, id, (p) => ({ ...p, color }));

export const deletePiece = (s: CollageScene, id: string): CollageScene => (s.pieces.some((p) => p.id === id) ? { ...s, pieces: s.pieces.filter((p) => p.id !== id) } : s);

/** Copia de una pieza, un poco corrida y encima de todo. */
export function duplicatePiece(s: CollageScene, id: string): { scene: CollageScene; id: string | null } {
  const src = s.pieces.find((p) => p.id === id);
  if (!src || s.pieces.length >= MAX_PIECES) return { scene: s, id: null };
  const copy: Piece = { ...src, id: nextPieceId(s), x: round(clamp(src.x + 40, 0, PAPER_W)), y: round(clamp(src.y + 40, 0, PAPER_H)) };
  return { scene: { ...s, pieces: [...s.pieces, copy] }, id: copy.id };
}

export type Layer = 'front' | 'back' | 'up' | 'down';

/** Cambia la capa de una pieza: al frente, al fondo, o un paso arriba o abajo. */
export function reorderPiece(s: CollageScene, id: string, to: Layer): CollageScene {
  const i = s.pieces.findIndex((p) => p.id === id);
  if (i < 0) return s;
  const last = s.pieces.length - 1;
  const j = to === 'front' ? last : to === 'back' ? 0 : to === 'up' ? Math.min(last, i + 1) : Math.max(0, i - 1);
  if (j === i) return s;
  const pieces = [...s.pieces];
  const [p] = pieces.splice(i, 1);
  pieces.splice(j, 0, p!);
  return { ...s, pieces };
}

export const setBackground = (s: CollageScene, background: Background): CollageScene => (s.background === background ? s : { ...s, background });

/** Quita todas las piezas (el fondo se queda). */
export const clearPieces = (s: CollageScene): CollageScene => (s.pieces.length === 0 ? s : { ...s, pieces: [] });

/** La pieza más alta (la de arriba) que está debajo del punto (x, y) del lienzo, o `undefined`. Se tiene en cuenta el giro. */
export function hitTest(s: CollageScene, x: number, y: number): Piece | undefined {
  for (let i = s.pieces.length - 1; i >= 0; i--) {
    const p = s.pieces[i]!;
    const a = (-p.rot * Math.PI) / 180;
    const dx = x - p.x;
    const dy = y - p.y;
    const lx = dx * Math.cos(a) - dy * Math.sin(a);
    const ly = dx * Math.sin(a) + dy * Math.cos(a);
    const { hw, hh } = extents(p.shape, p.size);
    if (Math.abs(lx) <= Math.max(hw, MIN_TOUCH_HALF) && Math.abs(ly) <= Math.max(hh, MIN_TOUCH_HALF)) return p;
  }
  return undefined;
}

// ---- Qué cambió entre dos escenas (para la unidad guiada A1-U06: «ordenar escenas para contar algo») ----

export type SceneChange = 'moved' | 'appeared' | 'grew' | 'gone';

/** Lo que cambió de una escena a otra, por pieza (mismo `id` = mismo personaje): se movió, apareció una nueva, cambió de tamaño, o ya no está. */
export function changesBetween(a: CollageScene, b: CollageScene): SceneChange[] {
  const out = new Set<SceneChange>();
  const before = new Map(a.pieces.map((p) => [p.id, p]));
  const after = new Map(b.pieces.map((p) => [p.id, p]));
  for (const [id, p] of after) {
    const q = before.get(id);
    if (!q) out.add('appeared');
    else {
      if (Math.hypot(p.x - q.x, p.y - q.y) >= 20) out.add('moved');
      if (p.size !== q.size) out.add('grew');
    }
  }
  for (const id of before.keys()) if (!after.has(id)) out.add('gone');
  return [...out];
}

// ---- Historial para deshacer/rehacer (solo mientras se trabaja: no se guarda) ----

export interface CollageHistory {
  past: CollageScene[];
  present: CollageScene;
  future: CollageScene[];
}
const HISTORY_LIMIT = 50;

export const historyOf = (present: CollageScene): CollageHistory => ({ past: [], present, future: [] });
/** Apunta un cambio. Si no cambió nada (misma escena), el historial no cambia. */
export function pushHistory(h: CollageHistory, next: CollageScene): CollageHistory {
  if (next === h.present) return h;
  return { past: [...h.past, h.present].slice(-HISTORY_LIMIT), present: next, future: [] };
}
export const canUndoPieces = (h: CollageHistory) => h.past.length > 0;
export const canRedoPieces = (h: CollageHistory) => h.future.length > 0;
export const undoPieces = (h: CollageHistory): CollageHistory => (h.past.length === 0 ? h : { past: h.past.slice(0, -1), present: h.past[h.past.length - 1]!, future: [h.present, ...h.future] });
export const redoPieces = (h: CollageHistory): CollageHistory => (h.future.length === 0 ? h : { past: [...h.past, h.present], present: h.future[0]!, future: h.future.slice(1) });

// ---- Validación de lo guardado ----

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function isCollageScene(v: unknown): v is CollageScene {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.kind !== 'collage' || typeof s.background !== 'string' || !(BACKGROUND_IDS as string[]).includes(s.background) || !Array.isArray(s.pieces) || s.pieces.length > MAX_PIECES) return false;
  const ids = new Set<string>();
  for (const p of s.pieces) {
    if (typeof p !== 'object' || p === null) return false;
    const x = p as Record<string, unknown>;
    if (typeof x.id !== 'string' || ids.has(x.id) || !(SHAPES as readonly unknown[]).includes(x.shape) || !(PAPER_COLOR_IDS as unknown[]).includes(x.color)) return false;
    if (!isNum(x.x) || !isNum(x.y) || x.x < 0 || x.x > PAPER_W || x.y < 0 || x.y > PAPER_H) return false;
    if (!isNum(x.size) || x.size < MIN_SIZE || x.size > MAX_SIZE || !isNum(x.rot) || x.rot < 0 || x.rot >= 360) return false;
    ids.add(x.id);
  }
  return true;
}

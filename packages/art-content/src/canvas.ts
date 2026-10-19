/**
 * Lienzo de dibujo (AR-T2, docs/design/artes/ESPECIFICACION.md §6). Lógica PURA: no sabe de Skia ni de pantallas.
 * Un dibujo es una lista de trazos; hay a lo sumo UN trazo activo (el dedo o lápiz puesto sobre el lienzo).
 * Garantías que la prueba comprueba: nunca se pierde un trazo terminado, cancelar no deja un trazo colgado,
 * y la memoria está acotada (puntos y trazos tienen tope).
 */

export interface Point {
  x: number;
  y: number;
  /** Presión 0–1 (lápiz); 0.5 si el dispositivo no la da. */
  p: number;
}

export interface Brush {
  color: string;
  /** Grosor base en unidades del lienzo. */
  width: number;
  /** Goma: pinta con el color del papel. */
  eraser: boolean;
}

export interface Stroke {
  id: number;
  brush: Brush;
  points: Point[];
}

export interface Drawing {
  /** Trazos terminados, en orden. */
  strokes: Stroke[];
  /** Trazo que se está dibujando ahora (null si no hay dedo puesto). */
  active: Stroke | null;
  /** Trazos deshechos, para rehacer (el último deshecho al final). */
  redo: Stroke[];
  nextId: number;
  /** Cuántos trazos se cancelaron (palma, segundo dedo, segundo plano). Solo para la prueba. */
  cancelled: number;
}

/** Topes para que un dibujo no crezca sin límite (memoria estable). */
export const MAX_STROKES = 500;
export const MAX_POINTS_PER_STROKE = 2000;
export const MAX_TOTAL_POINTS = 60000;
/** Distancia mínima (unidades del lienzo) entre dos puntos guardados; ahorra memoria sin cambiar el trazo a la vista. */
export const MIN_POINT_DISTANCE = 1.5;

export const PAPER = '#FFF8EC';
export const BRUSH_COLORS = ['#1E2340', '#E8662B', '#F0A020', '#22A95C', '#1E6FE8', '#8E4FD0'] as const;
export const BRUSH_WIDTHS = [4, 9, 18] as const;
export const ERASER_WIDTH = 28;

export const brush = (color: string = BRUSH_COLORS[0], width: number = BRUSH_WIDTHS[1], eraser = false): Brush => ({ color, width, eraser });

export const emptyDrawing = (): Drawing => ({ strokes: [], active: null, redo: [], nextId: 1, cancelled: 0 });

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.5);
const finitePoint = (x: number, y: number, p: number): Point | null => (Number.isFinite(x) && Number.isFinite(y) ? { x, y, p: clamp01(p) } : null);

export const totalPoints = (d: Drawing): number => d.strokes.reduce((n, s) => n + s.points.length, 0) + (d.active?.points.length ?? 0);

/** Empieza un trazo. Si ya había uno activo, se TERMINA (no se pierde) antes de empezar el nuevo. */
export function beginStroke(d: Drawing, x: number, y: number, p: number, b: Brush): Drawing {
  const first = finitePoint(x, y, p);
  if (!first) return d;
  const settled = d.active ? endStroke(d) : d;
  return {
    ...settled,
    active: { id: settled.nextId, brush: b, points: [first] },
    nextId: settled.nextId + 1,
    // dibujar algo nuevo invalida lo que se podía rehacer
    redo: [],
  };
}

/** Añade un punto al trazo activo. Ignora puntos muy cercanos o inválidos y respeta los topes. */
export function extendStroke(d: Drawing, x: number, y: number, p: number): Drawing {
  const a = d.active;
  if (!a) return d;
  const pt = finitePoint(x, y, p);
  if (!pt) return d;
  const last = a.points[a.points.length - 1]!;
  if (Math.hypot(pt.x - last.x, pt.y - last.y) < MIN_POINT_DISTANCE) return d;
  if (a.points.length >= MAX_POINTS_PER_STROKE || totalPoints(d) >= MAX_TOTAL_POINTS) return d;
  return { ...d, active: { ...a, points: [...a.points, pt] } };
}

/** Termina el trazo activo y lo guarda. Un toque sin movimiento queda como un punto (un puntito). */
export function endStroke(d: Drawing): Drawing {
  const a = d.active;
  if (!a) return d;
  const strokes = [...d.strokes, a];
  // si se pasa el tope de trazos, se descarta el más viejo (la memoria no crece sin límite)
  let kept = strokes.length > MAX_STROKES ? strokes.slice(strokes.length - MAX_STROKES) : strokes;
  // lo mismo con el total de puntos: nunca se descarta el trazo recién terminado, solo los más viejos
  let points = kept.reduce((n, st) => n + st.points.length, 0);
  let drop = 0;
  while (points > MAX_TOTAL_POINTS && drop < kept.length - 1) points -= kept[drop++]!.points.length;
  if (drop > 0) kept = kept.slice(drop);
  return { ...d, strokes: kept, active: null };
}

/** Cancela el trazo activo SIN guardarlo (segundo dedo, palma, segundo plano, sistema que quitó el toque). Nunca queda colgado. */
export function cancelStroke(d: Drawing): Drawing {
  if (!d.active) return d;
  return { ...d, active: null, cancelled: d.cancelled + 1 };
}

export const canUndo = (d: Drawing) => d.strokes.length > 0 && !d.active;
export const canRedo = (d: Drawing) => d.redo.length > 0 && !d.active;

export function undo(d: Drawing): Drawing {
  if (!canUndo(d)) return d;
  const last = d.strokes[d.strokes.length - 1]!;
  return { ...d, strokes: d.strokes.slice(0, -1), redo: [...d.redo, last] };
}

export function redo(d: Drawing): Drawing {
  if (!canRedo(d)) return d;
  const last = d.redo[d.redo.length - 1]!;
  return { ...d, strokes: [...d.strokes, last], redo: d.redo.slice(0, -1) };
}

export function clearDrawing(d: Drawing): Drawing {
  return { ...emptyDrawing(), nextId: d.nextId, cancelled: d.cancelled };
}

/** Todos los trazos que se ven ahora, incluido el activo. */
export const visibleStrokes = (d: Drawing): Stroke[] => (d.active ? [...d.strokes, d.active] : d.strokes);

/** Grosor en un punto: la presión lo modula entre 60 % y 140 % del base. Sin presión (0.5) queda igual al base. */
export function widthAt(b: Brush, p: number): number {
  if (b.eraser) return b.width;
  return b.width * (0.6 + 0.8 * clamp01(p));
}

/**
 * Trazo suavizado como texto de camino SVG (curvas cuadráticas por los puntos medios). Un solo punto se dibuja como un puntito
 * (una raya de largo cero con extremos redondos). `null` si no hay puntos.
 */
export function strokePathData(points: readonly Point[]): string | null {
  const n = points.length;
  if (n === 0) return null;
  const f = (v: number) => Math.round(v * 10) / 10;
  const p0 = points[0]!;
  if (n === 1) return `M ${f(p0.x)} ${f(p0.y)} L ${f(p0.x)} ${f(p0.y)}`;
  if (n === 2) return `M ${f(p0.x)} ${f(p0.y)} L ${f(points[1]!.x)} ${f(points[1]!.y)}`;
  let d = `M ${f(p0.x)} ${f(p0.y)}`;
  for (let i = 1; i < n - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    d += ` Q ${f(a.x)} ${f(a.y)} ${f((a.x + b.x) / 2)} ${f((a.y + b.y) / 2)}`;
  }
  const last = points[n - 1]!;
  return `${d} L ${f(last.x)} ${f(last.y)}`;
}

/** Presión media del trazo (para dar un grosor único por trazo en el dibujo). */
export function meanPressure(points: readonly Point[]): number {
  if (points.length === 0) return 0.5;
  return points.reduce((s, q) => s + q.p, 0) / points.length;
}

// ---- Guardado (a SQLite en AR-03). Aquí solo la forma y su validación. ----

export interface SavedDrawing {
  version: 1;
  strokes: Stroke[];
}

export const toSaved = (d: Drawing): SavedDrawing => ({ version: 1, strokes: d.strokes });

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Valida lo leído del almacenamiento; si algo no cuadra, devuelve null (se empieza con el papel en blanco). */
export function fromSaved(raw: unknown): Drawing | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Partial<SavedDrawing>;
  if (r.version !== 1 || !Array.isArray(r.strokes) || r.strokes.length > MAX_STROKES) return null;
  let maxId = 0;
  let total = 0;
  for (const s of r.strokes) {
    if (typeof s !== 'object' || s === null || !isNum(s.id) || typeof s.brush !== 'object' || s.brush === null) return null;
    const b = s.brush;
    if (typeof b.color !== 'string' || !isNum(b.width) || typeof b.eraser !== 'boolean') return null;
    if (!Array.isArray(s.points) || s.points.length === 0 || s.points.length > MAX_POINTS_PER_STROKE) return null;
    for (const q of s.points) if (typeof q !== 'object' || q === null || !isNum(q.x) || !isNum(q.y) || !isNum(q.p)) return null;
    total += s.points.length;
    maxId = Math.max(maxId, s.id);
  }
  if (total > MAX_TOTAL_POINTS) return null;
  return { ...emptyDrawing(), strokes: r.strokes as Stroke[], nextId: maxId + 1 };
}

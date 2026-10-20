/**
 * (Modelo y validación; las operaciones están en `unit2.ts`.)
 * Unidad guiada A2-U02 «Colores que se relacionan» (2.º; docs/design/artes/ESPECIFICACION.md; investigación §6 y §11, reto «Dos cuadros, una paleta»).
 * Seis encuentros flexibles (todo abre, en cualquier orden) sobre un mismo proyecto de pintura con DOS cuadros. Concepto: paleta e intención visual.
 * Evidencia: identifica una diferencia entre sus dos cuadros y la relaciona con una decisión. NO se exige que una imagen transmita una emoción
 * predeterminada por la app, ni que el color salga «idéntico» a una pintura real. Estrellas por esfuerzo (D11), nunca por «pintar mejor».
 */
export const UNIT2_ID = 'A2-U02';
export const ENCOUNTERS2 = ['look', 'mix', 'palette', 'first', 'second', 'compare'] as const;
export type Encounter2Id = (typeof ENCOUNTERS2)[number];

/** Dos paletas de ejemplo para el encuentro 1 (colores fijos, no son «respuestas» a copiar). A = colores de una misma familia; B = colores muy distintos. */
export const EXAMPLE_PALETTES = {
  A: ['#1F4E8C', '#3F79C4', '#8FB4E3', '#D5E4F7'],
  B: ['#E63946', '#FFD23F', '#2A9D8F', '#1B1B1B'],
} as const;
export type ExampleChoice = keyof typeof EXAMPLE_PALETTES;
/** ¿En cuál se parecen más los colores entre sí? A (una sola familia). */
export const LOOK_ANSWER: ExampleChoice = 'A';

/** Cuántos colores tiene la paleta de los dos cuadros. */
export const PALETTE_SIZE = 4;
/** Trazos mínimos para dar un cuadro por empezado (un garabato basta; no se mide cuánto ni qué tan bien). */
export const MIN_STROKES = 3;

/** Cómo se relacionan los cuatro colores que eligió (su explicación; no hay una «correcta»). */
export const RELATIONS = ['family', 'shared', 'contrast'] as const;
export type Relation = (typeof RELATIONS)[number];
/** La intención de su primer cuadro. */
export const INTENTIONS2 = ['calm', 'lively', 'mystery'] as const;
export type Intention2 = (typeof INTENTIONS2)[number];
/** Qué cambió en el segundo cuadro. */
export const CHANGES = ['distribution', 'value', 'contrast'] as const;
export type Change = (typeof CHANGES)[number];
/** Qué diferencia ve al compararlos. */
export const SEEN = ['where', 'light', 'contrast'] as const;
export type Seen = (typeof SEEN)[number];
/** Por qué hizo ese cambio (decisión explicada). */
export const DECISIONS = ['calmer', 'livelier', 'clearer', 'try'] as const;
export type Decision = (typeof DECISIONS)[number];

/** Lo que falta para dar un encuentro por hecho. Vacío = se puede marcar. Son claves para textos, nunca reproches. */
export type Missing2 = 'look' | 'mixed' | 'four' | 'relation' | 'strokes1' | 'intention' | 'strokes2' | 'changed' | 'bothPaintings' | 'seen' | 'decision';

export interface PaintUnitProgress {
  /** El proyecto de pintura (dos cuadros) de la unidad; null hasta que empieza. */
  projectId: string | null;
  done: Encounter2Id[];
  /** Ya señaló la paleta de ejemplo cuyos colores se parecen más. */
  lookOk: boolean;
  /** Ids de los cuatro colores de su paleta (de la paleta del proyecto). */
  paletteIds: string[];
  relation: Relation | null;
  intention: Intention2 | null;
  changed: Change | null;
  seen: Seen | null;
  decision: Decision | null;
  updatedAt: number;
}

export const emptyUnit2 = (): PaintUnitProgress => ({ projectId: null, done: [], lookOk: false, paletteIds: [], relation: null, intention: null, changed: null, seen: null, decision: null, updatedAt: 0 });

const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === 'string' && (list as readonly string[]).includes(v);
const orNull = <T extends string>(list: readonly T[], v: unknown): boolean => v === null || isOneOf(list, v);

export function isPaintUnitProgress(v: unknown): v is PaintUnitProgress {
  if (typeof v !== 'object' || v === null) return false;
  const u = v as Record<string, unknown>;
  return (
    (u.projectId === null || typeof u.projectId === 'string') &&
    Array.isArray(u.done) &&
    u.done.every((e) => isOneOf(ENCOUNTERS2, e)) &&
    new Set(u.done).size === u.done.length &&
    typeof u.lookOk === 'boolean' &&
    Array.isArray(u.paletteIds) &&
    u.paletteIds.length <= PALETTE_SIZE &&
    u.paletteIds.every((x) => typeof x === 'string') &&
    new Set(u.paletteIds).size === u.paletteIds.length &&
    orNull(RELATIONS, u.relation) &&
    orNull(INTENTIONS2, u.intention) &&
    orNull(CHANGES, u.changed) &&
    orNull(SEEN, u.seen) &&
    orNull(DECISIONS, u.decision) &&
    typeof u.updatedAt === 'number' &&
    Number.isFinite(u.updatedAt)
  );
}

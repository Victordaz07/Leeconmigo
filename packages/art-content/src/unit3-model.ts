/**
 * (Modelo y validación; las operaciones están en `unit3.ts`.)
 * Unidad guiada A1-U06 «Una historia de recortes» (1.º; docs/design/artes/ESPECIFICACION.md; investigación §10: «Ordenar piezas y escenas para
 * contar algo»). Seis encuentros flexibles (todo abre, en cualquier orden) sobre un proyecto de collage con TRES cartones (el principio, lo que
 * pasa y el final) y un cuarto cartón para probar piezas. Concepto: secuencia y cambio entre escenas. Evidencia: ordena escenas y nombra un cambio
 * entre ellas y cuándo pasa lo más importante. NO se exige que la historia «diga» algo concreto ni una emoción. Estrellas por esfuerzo (D11).
 */
export const UNIT3_ID = 'A1-U06';
export const ENCOUNTERS3 = ['look', 'explore', 'idea', 'first', 'next', 'tell'] as const;
export type Encounter3Id = (typeof ENCOUNTERS3)[number];

/** Cartones del proyecto: 0 = principio, 1 = lo que pasa, 2 = final; 3 = el cartón para probar piezas (no es parte de la historia). */
export const STORY_SCENES = 3;
export const PLAYGROUND_INDEX = 3;

/** Piezas mínimas para dar un cartón por empezado (no se mide cuántas ni qué tan «bonito»). */
export const MIN_PIECES_PER_SCENE = 3;
/** En el cartón de probar: formas distintas y al menos una pieza cambiada (más grande, más pequeña o girada). */
export const MIN_PLAY_PIECES = 3;
export const MIN_PLAY_SHAPES = 2;

/** Las tres escenas de ejemplo (un barquito que avanza) se mezclan; el orden de la historia es A, B, C. */
export const EXAMPLE_IDS = ['A', 'B', 'C'] as const;
export type ExampleId = (typeof EXAMPLE_IDS)[number];
/** Cómo se muestran las tres escenas de ejemplo al niño (mezcladas). */
export const EXAMPLE_DISPLAY: readonly ExampleId[] = ['B', 'C', 'A'];

export const IDEAS = ['travels', 'grows', 'arrives'] as const;
export type Idea = (typeof IDEAS)[number];
/** Qué cambia entre una escena y la siguiente (lo que planea y lo que cuenta). */
export const PLANS = ['moved', 'appeared', 'grew'] as const;
export type Plan = (typeof PLANS)[number];
/** ¿En qué escena pasa lo más importante? */
export const MOMENTS = ['first', 'middle', 'last'] as const;
export type Moment = (typeof MOMENTS)[number];

/** Lo que falta para dar un encuentro por hecho. Vacío = se puede marcar. Son claves para textos, nunca reproches. */
export type Missing3 = 'look' | 'play' | 'idea' | 'plan' | 'scene1' | 'scene2' | 'scene3' | 'told' | 'moment';

export interface StoryUnitProgress {
  /** El proyecto de collage (cuatro cartones) de la unidad; null hasta que empieza. */
  projectId: string | null;
  done: Encounter3Id[];
  /** Ya ordenó las tres escenas de ejemplo. */
  lookOk: boolean;
  idea: Idea | null;
  plan: Plan | null;
  /** Qué cambio cuenta de su historia. */
  told: Plan | null;
  moment: Moment | null;
  updatedAt: number;
}

export const emptyUnit3 = (): StoryUnitProgress => ({ projectId: null, done: [], lookOk: false, idea: null, plan: null, told: null, moment: null, updatedAt: 0 });

const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === 'string' && (list as readonly string[]).includes(v);
const orNull = <T extends string>(list: readonly T[], v: unknown): boolean => v === null || isOneOf(list, v);

export function isStoryUnitProgress(v: unknown): v is StoryUnitProgress {
  if (typeof v !== 'object' || v === null) return false;
  const u = v as Record<string, unknown>;
  return (
    (u.projectId === null || typeof u.projectId === 'string') &&
    Array.isArray(u.done) &&
    u.done.every((e) => isOneOf(ENCOUNTERS3, e)) &&
    new Set(u.done).size === u.done.length &&
    typeof u.lookOk === 'boolean' &&
    orNull(IDEAS, u.idea) &&
    orNull(PLANS, u.plan) &&
    orNull(PLANS, u.told) &&
    orNull(MOMENTS, u.moment) &&
    typeof u.updatedAt === 'number' &&
    Number.isFinite(u.updatedAt)
  );
}

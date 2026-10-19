/**
 * El patrón rítmico de ocho pulsos (docs/design/artes/ESPECIFICACION.md §3): ocho columnas y cuatro filas.
 * UN PASO = UN PULSO de negra en 4/4 (dos grupos de cuatro). Si algún día hay corcheas se rotulan distinto: aquí no se cambia en silencio.
 */
export const STEPS = 8;
/** Las cuatro filas (pistas) de la rejilla. Qué SONIDO tiene cada una lo elige el niño (`sounds.ts`); la fila solo dice cuándo suena. */
export const TRACKS = ['a', 'b', 'c', 'd'] as const;
export type Track = (typeof TRACKS)[number];

/** Una fila por pista; `true` = suena en ese pulso, `false` = silencio. */
export type Pattern = Record<Track, boolean[]>;

export const MIN_BPM = 60;
export const MAX_BPM = 140;
export const DEFAULT_BPM = 90;

export const emptyPattern = (): Pattern => ({ a: Array(STEPS).fill(false), b: Array(STEPS).fill(false), c: Array(STEPS).fill(false), d: Array(STEPS).fill(false) });

export const clonePattern = (p: Pattern): Pattern => ({ a: [...p.a], b: [...p.b], c: [...p.c], d: [...p.d] });

export const isValidPattern = (p: unknown): p is Pattern => {
  if (typeof p !== 'object' || p === null) return false;
  const o = p as Record<string, unknown>;
  return TRACKS.every((l) => Array.isArray(o[l]) && (o[l] as unknown[]).length === STEPS && (o[l] as unknown[]).every((c) => typeof c === 'boolean'));
};

/** Devuelve un patrón nuevo con una casilla encendida o apagada. */
export function toggleCell(p: Pattern, track: Track, step: number): Pattern {
  if (!Number.isInteger(step) || step < 0 || step >= STEPS) throw new RangeError(`paso fuera del patrón: ${step}`);
  const next = clonePattern(p);
  next[track][step] = !next[track][step];
  return next;
}

export const clampBpm = (bpm: number): number => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));

/** Segundos que dura un paso (= un pulso) a `bpm`. */
export const stepSeconds = (bpm: number): number => 60 / clampBpm(bpm);

/** ¿Cuántos pasos suenan en total? (solo para describir; nunca como medida de «qué tan bien suena»). */
export const activeCount = (p: Pattern): number => TRACKS.reduce((n, l) => n + p[l].filter(Boolean).length, 0);

/** Pulsos de silencio completo (ninguna pista suena): sirve para el reto «deja un silencio a propósito». */
export const silentSteps = (p: Pattern): number[] => Array.from({ length: STEPS }, (_, i) => i).filter((i) => TRACKS.every((l) => !p[l][i]));

/** ¿El patrón vuelve a empezar igual? Cada ciclo repite el mismo patrón, así que siempre es cierto; existe para tests y descripciones. */
export const loopLengthSeconds = (bpm: number): number => STEPS * stepSeconds(bpm);

/**
 * (Modelo y validación; las operaciones están en `unit.ts`.)
 * Unidad guiada A1-U04 «Mi banda deja respirar al silencio» (1.º, docs/design/artes/ESPECIFICACION.md §5; investigación §11).
 * Seis encuentros flexibles (todo abre, en cualquier orden) sobre un mismo proyecto de ritmo. Lógica PURA: qué falta para dar un encuentro
 * por hecho, cómo se guarda lo que el niño decide y cómo se calculan las estrellas (por esfuerzo, D11: exploró, comparó dos versiones, explicó
 * una decisión; NUNCA por «sonar mejor» ni por cantidad de cuadros).
 */
import { STEPS, type Pattern, type Track } from '@lee-conmigo/music-engine';

export const UNIT_ID = 'A1-U04';
export const ENCOUNTERS = ['listen', 'build', 'silence', 'layer', 'versions', 'present'] as const;
export type EncounterId = (typeof ENCOUNTERS)[number];

/** Lo que el niño quiere para su banda (intención inicial del portafolio). */
export const INTENTIONS = ['calm', 'happy', 'walk'] as const;
export type Intention = (typeof INTENTIONS)[number];
/** Qué notó al agregar otra capa. No hay respuesta «correcta»: es una observación suya. */
export const LAYER_NOTES = ['fuller', 'different', 'same'] as const;
export type LayerNote = (typeof LAYER_NOTES)[number];
/** Por qué eligió quedarse con una versión (decisión explicada). */
export const VERSION_REASONS = ['silence', 'even', 'another'] as const;
export type VersionReason = (typeof VERSION_REASONS)[number];
/** Qué quiere contar de su banda al presentarla. */
export const PRESENT_NOTES = ['repeat', 'silence', 'layer'] as const;
export type PresentNote = (typeof PRESENT_NOTES)[number];

/** El patrón del encuentro 1: tres capas para escuchar solas. Es de ejemplo; no es una «respuesta». */
export const DEMO_LAYERS: readonly Track[] = ['a', 'b', 'c'];
export const demoPattern = (): Pattern => ({
  a: [true, false, false, false, true, false, false, false],
  b: [false, false, true, false, false, false, true, false],
  c: [false, true, false, true, false, true, false, true],
  d: Array(STEPS).fill(false),
});
/** En el encuentro 1 el patrón vuelve a empezar en el pulso 1 (el 8 enlaza con el 1 sin pausa). */
export const RETURN_STEP = 0;

/** Lo que falta para dar un encuentro por hecho. Vacío = se puede marcar. Son claves para textos, nunca reproches. */
export type Missing = 'heard' | 'return' | 'intention' | 'pattern' | 'silence' | 'silenceMark' | 'layers' | 'layerNote' | 'versions' | 'reason' | 'note';

export interface UnitProgress {
  /** El proyecto de ritmo con el que se trabaja la unidad (null hasta que empieza). */
  projectId: string | null;
  done: EncounterId[];
  /** Capas del ejemplo que ya escuchó sola. */
  heard: Track[];
  returnOk: boolean;
  intention: Intention | null;
  /** Pulso (0–7) donde dejó silencio a propósito. */
  silenceStep: number | null;
  layerNote: LayerNote | null;
  versionReason: VersionReason | null;
  presentNote: PresentNote | null;
  updatedAt: number;
}

export const emptyUnit = (): UnitProgress => ({ projectId: null, done: [], heard: [], returnOk: false, intention: null, silenceStep: null, layerNote: null, versionReason: null, presentNote: null, updatedAt: 0 });

const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === 'string' && (list as readonly string[]).includes(v);
const orNull = <T extends string>(list: readonly T[], v: unknown): boolean => v === null || isOneOf(list, v);

export function isUnitProgress(v: unknown): v is UnitProgress {
  if (typeof v !== 'object' || v === null) return false;
  const u = v as Record<string, unknown>;
  return (
    (u.projectId === null || typeof u.projectId === 'string') &&
    Array.isArray(u.done) &&
    u.done.every((e) => isOneOf(ENCOUNTERS, e)) &&
    new Set(u.done).size === u.done.length &&
    Array.isArray(u.heard) &&
    u.heard.every((t) => isOneOf(DEMO_LAYERS, t)) &&
    typeof u.returnOk === 'boolean' &&
    orNull(INTENTIONS, u.intention) &&
    (u.silenceStep === null || (Number.isInteger(u.silenceStep) && (u.silenceStep as number) >= 0 && (u.silenceStep as number) < STEPS)) &&
    orNull(LAYER_NOTES, u.layerNote) &&
    orNull(VERSION_REASONS, u.versionReason) &&
    orNull(PRESENT_NOTES, u.presentNote) &&
    typeof u.updatedAt === 'number' &&
    Number.isFinite(u.updatedAt)
  );
}

/**
 * Contrato común de una familia visual (documentación §4): cada familia trae su trabajo inicial, su solución, cómo
 * cambia con una acción, cómo se evalúa, sus invariantes, su ejemplo paralelo y sus plantillas. Añadir una familia no
 * toca el contenedor del ejercicio.
 */
import type { IntRng } from '../rng.ts';
import type { AnswerField, Evaluation, VisualModel, VisualWork, WorkAction } from '../model.ts';

export type ModelOf<K extends VisualModel['kind']> = Extract<VisualModel, { kind: K }>;
export type WorkOf<K extends VisualModel['kind']> = Extract<VisualWork, { kind: K }>;

export interface FamilyTemplate<K extends VisualModel['kind']> {
  id: string;
  version: number;
  skillId: string;
  grades: [number, number];
  generate(r: IntRng): ModelOf<K>;
}

export interface FamilyDef<K extends VisualModel['kind']> {
  kind: K;
  fields(m: ModelOf<K>): AnswerField[];
  init(m: ModelOf<K>): WorkOf<K>;
  solution(m: ModelOf<K>): WorkOf<K>;
  /** Devuelve el MISMO objeto si la acción no aplica (así el estado sabe que no cambió nada). */
  apply(m: ModelOf<K>, w: WorkOf<K>, a: WorkAction): WorkOf<K>;
  evaluate(m: ModelOf<K>, w: WorkOf<K>): Evaluation;
  problems(m: ModelOf<K>): string[];
  /** Números para el ejemplo paralelo de la ayuda 3 (otra situación con la misma estructura). */
  example(m: ModelOf<K>): Record<string, number>;
  templates: FamilyTemplate<K>[];
}

export const result = (outcome: Evaluation['outcome'], feedbackKey: string, feedbackParams: Record<string, number> = {}): Evaluation => ({ outcome, feedbackKey, feedbackParams });

/** Número escrito en una casilla (null = vacía). */
export const num = (v: string | undefined) => (v ? Number(v) : null);

export const isInt = (n: number) => Number.isInteger(n);

/** Elige un elemento con el generador (determinista). */
export const pick = <T>(r: IntRng, items: readonly T[]): T => items[r.int(0, items.length - 1)];

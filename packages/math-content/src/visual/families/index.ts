/** Registro de las familias que usan el contrato `FamilyDef` (fase 2–3 de la lámina). */
import type { AnswerField, Evaluation, VisualModel, VisualWork, WorkAction } from '../model.ts';
import { area } from './area.ts';
import { barModel } from './bar-model.ts';
import { clock } from './clock.ts';
import type { FamilyTemplate } from './common.ts';
import { coord } from './coord.ts';
import { data } from './data.ts';
import { fraction } from './fraction.ts';
import { numberLine } from './number-line.ts';
import { placeValue } from './place-value.ts';
import { ratio } from './ratio.ts';

type AnyFamily = {
  kind: VisualModel['kind'];
  fields(m: VisualModel): AnswerField[];
  init(m: VisualModel): VisualWork;
  solution(m: VisualModel): VisualWork;
  apply(m: VisualModel, w: VisualWork, a: WorkAction): VisualWork;
  evaluate(m: VisualModel, w: VisualWork): Evaluation;
  problems(m: VisualModel): string[];
  example(m: VisualModel): Record<string, number>;
  templates: FamilyTemplate<VisualModel['kind']>[];
};

export const FAMILIES: Partial<Record<VisualModel['kind'], AnyFamily>> = Object.fromEntries(
  [placeValue, numberLine, fraction, barModel, area, clock, data, coord, ratio].map((f) => [f.kind, f as unknown as AnyFamily]),
);

export { area, barModel, clock, coord, data, fraction, numberLine, placeValue, ratio };
export { barUnknownValue, otherOperation } from './bar-model.ts';
export { clockAngles, clockParts } from './clock.ts';
export { dataAnswer } from './data.ts';
export { PIECE_LIMIT, piecesValue } from './place-value.ts';

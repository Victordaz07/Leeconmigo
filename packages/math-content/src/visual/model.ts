/**
 * Matemáticas visuales interactivas (docs/design/math-visual): el niño CONSTRUYE la relación (llena una bandeja, planta
 * grupos, reparte galletas) en vez de solo mirar un dibujo y elegir una respuesta.
 *
 * Tres niveles separados (documentación §5):
 * - Plantilla: reglas de una habilidad (`templates.ts`).
 * - Instancia: un problema concreto, inmutable, con sus números y versión (`VisualInstance`).
 * - Trabajo: lo que el niño va haciendo sobre esa instancia (`VisualWork`).
 *
 * Los números los decide el código (nunca el arte ni un modelo de lenguaje). El dibujo, la evaluación y el texto salen
 * todos de la misma instancia: no hay contadores duplicados que puedan contradecirse.
 */

/** Fase 1: bandejas de 10/20, grupos iguales y reparto. Las otras 9 familias se agregan con el mismo contrato. */
export type VisualFamily = 'tenFrame' | 'equalGroups' | 'sharing';

export interface TenFrameModel {
  kind: 'tenFrame';
  capacity: 10 | 20;
  /** Fichas que ya están (fijas, no se pueden quitar). */
  start: number;
  /** Cuántas debe haber al final. */
  target: number;
  /** show: representa `target` desde cero · complete: completa la bandeja de 10 · reach: llega a `target` (cruza la decena). */
  task: 'show' | 'complete' | 'reach';
}

export interface EqualGroupsModel {
  kind: 'equalGroups';
  groups: number;
  perGroup: number;
  /** build: el niño planta cada parcela y da el total · read: el huerto ya está; escribe grupos, cada uno y total. */
  task: 'build' | 'read';
}

export interface SharingModel {
  kind: 'sharing';
  /** partitive: repartir entre N platos (¿cuántas a cada uno?) · quotative: hacer bolsas de N (¿cuántas bolsas?). */
  mode: 'partitive' | 'quotative';
  total: number;
  /** Platos (partitive) o bolsas llenas que salen (quotative). */
  groups: number;
  perGroup: number;
  /** Lo que no alcanza para todos / para otra bolsa. 0 = división exacta. */
  remainder: number;
  /** Identidades estables: cada galleta existe en un solo lugar a la vez. */
  tokenIds: string[];
  /** Recipientes visibles. En quotative hay uno de más para no regalar la respuesta. */
  containerIds: string[];
}

export type VisualModel = TenFrameModel | EqualGroupsModel | SharingModel;

export interface VisualInstance {
  schemaVersion: 1;
  /** `templateId@vN#seed`: repetir la misma instancia no cuenta como evidencia nueva. */
  instanceId: string;
  templateId: string;
  templateVersion: number;
  generatorVersion: number;
  skillId: string;
  seed: number;
  model: VisualModel;
}

/** Casillas para escribir números (con el teclado de la app). */
export type AnswerField = 'answer' | 'remainder' | 'groups' | 'perGroup';

export type VisualWork =
  | { kind: 'tenFrame'; cells: boolean[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'equalGroups'; counts: number[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'sharing'; placement: Record<string, string | null>; values: Partial<Record<AnswerField, string>> };

/** Acciones con significado matemático: tocar, arrastrar o teclado terminan en la misma. */
export type WorkAction =
  | { type: 'toggleCell'; index: number }
  | { type: 'addToGroup'; group: number }
  | { type: 'removeFromGroup'; group: number }
  | { type: 'place'; token: string; to: string | null }
  | { type: 'setValue'; field: AnswerField; value: string };

export interface Evaluation {
  /** invalid = estado técnico imposible (nunca se cuenta como error del niño). */
  outcome: 'correct' | 'incorrect' | 'incomplete' | 'invalid';
  feedbackKey: string;
  feedbackParams: Record<string, number>;
}

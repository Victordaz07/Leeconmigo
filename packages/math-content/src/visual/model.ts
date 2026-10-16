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

/** Las 12 familias de la lámina (docs/design/math-visual). Todas con el mismo contrato. */
export type VisualFamily = 'tenFrame' | 'equalGroups' | 'sharing' | 'placeValue' | 'numberLine' | 'fraction' | 'barModel' | 'area' | 'clock' | 'data' | 'coord' | 'ratio';

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
  /** Qué se cuenta y dónde (solo cambia el dibujo y las palabras; sin él, plantas en parcelas). */
  theme?: GroupsTheme;
}

/** Contextos de los grupos iguales: plantas en parcelas, manzanas en canastas, canicas en frascos. */
export type GroupsTheme = 'garden' | 'apples' | 'marbles';
/** Contextos del reparto: galletas (platos o bolsas), lápices en cajas, canicas en frascos, manzanas en canastas. */
export type SharingTheme = 'cookies' | 'pencils' | 'marbles' | 'apples';

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
  /** Qué se reparte y en qué (sin él, galletas). */
  theme?: SharingTheme;
}

/** B. Valor posicional: centenas, decenas y unidades que se juntan y se desarman. */
export interface PlaceValueModel {
  kind: 'placeValue';
  target: number;
  /** build: cualquier forma que valga el número · standard: forma usual (cada lugar < 10) · read: las piezas ya están; escribe el número. */
  task: 'build' | 'standard' | 'read';
  /** Piezas de partida (en `read`, a veces más de 10 unidades: hay que reagrupar al leer). */
  given: Pieces;
}

export interface Pieces {
  h: number;
  t: number;
  o: number;
}

/**
 * C. Recta numérica. Las posiciones son NUMERADORES sobre `denominator` (1 = enteros; 4 = cuartos), así la misma recta
 * sirve para sumar, restar y ubicar fracciones sin decimales.
 */
export interface NumberLineModel {
  kind: 'numberLine';
  denominator: number;
  min: number;
  max: number;
  /** Cada cuántas marcas se escribe el número (las demás marcas van sin número). */
  labelEvery: number;
  start: number;
  target: number;
  /** Saltos que ofrece la app (con signo). */
  jumps: number[];
  task: 'add' | 'subtract' | 'locate';
}

/** F. Fracciones: un entero partido en partes IGUALES (las partes las dibuja la app). */
export interface FractionModel {
  kind: 'fraction';
  shape: 'bar' | 'pizza' | 'cake';
  denominator: number;
  numerator: number;
  /** color: colorea n/d · name: ya está coloreado; escribe la fracción · equivalent: colorea lo mismo que ref en otras partes. */
  task: 'color' | 'name' | 'equivalent';
  ref?: { numerator: number; denominator: number };
}

/** G. Modelo de barras: problemas verbales de juntar, comparar y "veces tanto". */
export interface BarModelModel {
  kind: 'barModel';
  structure: 'partWhole' | 'compare' | 'times';
  /** partWhole: a + b = total · compare: mayor a, menor b, diferencia a − b · times: b × factor = a. */
  a: number;
  b: number;
  factor?: number;
  unknown: 'part' | 'whole' | 'smaller' | 'larger' | 'difference';
  names: [string, string];
  item: 'marbles' | 'stickers' | 'pencils' | 'apples';
}

/** H. Área y perímetro en un jardín de cuadritos (cada uno, 1 m²). */
export interface AreaModel {
  kind: 'area';
  rows: number;
  cols: number;
  task: 'cover' | 'perimeter' | 'missingSide';
}

/** I. Reloj: minutos desde las 12:00 (0–719). Las dos agujas salen del mismo número. */
export interface ClockModel {
  kind: 'clock';
  task: 'set' | 'read' | 'elapsed';
  /** set/read: la hora pedida · elapsed: la hora de inicio. */
  time: number;
  duration: number;
  /** Cuánto mueve el botón chico (30, 5 o 1 minutos). */
  step: number;
}

export type FruitId = 'mango' | 'pera' | 'uva' | 'manzana';

/** J. Datos: gráfica de barras con escala. */
export interface DataModel {
  kind: 'data';
  categories: FruitId[];
  values: number[];
  /** Cuánto vale cada rayita de la escala (1, 2 o 5). */
  scale: number;
  task: 'build' | 'read' | 'difference' | 'total';
  /** read: [i] · difference: [mayor, menor]. */
  ask: number[];
}

/** K. Plano cartesiano (primer cuadrante). */
export interface CoordModel {
  kind: 'coord';
  max: number;
  x: number;
  y: number;
  task: 'plot' | 'read';
}

/** L. Razones: "a de azul por cada b de naranja", hecha por lotes completos. */
export interface RatioModel {
  kind: 'ratio';
  a: number;
  b: number;
  lots: number;
  task: 'scale';
}

export type VisualModel = TenFrameModel | EqualGroupsModel | SharingModel | PlaceValueModel | NumberLineModel | FractionModel | BarModelModel | AreaModel | ClockModel | DataModel | CoordModel | RatioModel;

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
export type AnswerField = 'answer' | 'remainder' | 'groups' | 'perGroup' | 'numerator' | 'denominator' | 'hour' | 'minute' | 'x' | 'y';

export type VisualWork =
  | { kind: 'tenFrame'; cells: boolean[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'equalGroups'; counts: number[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'sharing'; placement: Record<string, string | null>; values: Partial<Record<AnswerField, string>> }
  | { kind: 'placeValue'; pieces: Pieces; values: Partial<Record<AnswerField, string>> }
  | { kind: 'numberLine'; pos: number; path: number[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'fraction'; shaded: boolean[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'barModel'; values: Partial<Record<AnswerField, string>> }
  | { kind: 'area'; tiles: boolean[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'clock'; minutes: number; values: Partial<Record<AnswerField, string>> }
  | { kind: 'data'; bars: number[]; values: Partial<Record<AnswerField, string>> }
  | { kind: 'coord'; point: [number, number] | null; values: Partial<Record<AnswerField, string>> }
  | { kind: 'ratio'; lots: number; values: Partial<Record<AnswerField, string>> };

/** Acciones con significado matemático: tocar, arrastrar o teclado terminan en la misma. */
export type WorkAction =
  | { type: 'toggleCell'; index: number }
  | { type: 'addToGroup'; group: number }
  | { type: 'removeFromGroup'; group: number }
  | { type: 'place'; token: string; to: string | null }
  | { type: 'setValue'; field: AnswerField; value: string }
  | { type: 'addPiece'; place: keyof Pieces }
  | { type: 'removePiece'; place: keyof Pieces }
  /** Junta 10 piezas de un lugar en 1 del siguiente (o: 10 unidades → 1 decena; t: 10 decenas → 1 centena). */
  | { type: 'bundle'; place: 'o' | 't' }
  /** Desarma 1 pieza en 10 del lugar anterior (t: 1 decena → 10 unidades; h: 1 centena → 10 decenas). */
  | { type: 'unbundle'; place: 't' | 'h' }
  | { type: 'jump'; size: number }
  | { type: 'setPos'; pos: number }
  | { type: 'togglePart'; index: number }
  | { type: 'shiftTime'; minutes: number }
  | { type: 'setBar'; index: number; delta: number }
  | { type: 'placePoint'; x: number; y: number }
  | { type: 'addLot' }
  | { type: 'removeLot' };

export interface Evaluation {
  /** invalid = estado técnico imposible (nunca se cuenta como error del niño). */
  outcome: 'correct' | 'incorrect' | 'incomplete' | 'invalid';
  feedbackKey: string;
  feedbackParams: Record<string, number>;
}

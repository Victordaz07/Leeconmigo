/**
 * Unidad de Ciencia como datos validados (docs/design/ciencia/unidades/C4-U06.md). Todo texto viene en ES y EN, escrito de
 * forma natural en cada idioma. Los textos NO dicen «incorrecto» (docs/06). Esto es CONTENIDO y reglas puras: la pantalla solo
 * lo dibuja.
 */
import type { Localized } from '@lee-conmigo/contracts';
import c1u02 from '../content/c1-u02.json';
import c2u02 from '../content/c2-u02.json';
import c3u05 from '../content/c3-u05.json';
import c3u06 from '../content/c3-u06.json';
import c4u02 from '../content/c4-u02.json';
import c4u06 from '../content/c4-u06.json';
import c5u02 from '../content/c5-u02.json';
import c5u03 from '../content/c5-u03.json';
import c6u04 from '../content/c6-u04.json';
import { practiceMapProblems, PRACTICE_MAPS, bandCount, LADERA_DATASETS, type Dataset } from './datasets.ts';
import { COVERS, SLOPES, type Cover, type Slope } from './labs/erosion.ts';
import { LIGHT_OBJECTS, LIGHT_STATES, type LightObject, type LightState } from './labs/luz.ts';
import { MAX_PUSHES, TABLE_PAIRS, balanced, cartMove, swingSide, travelCm } from './labs/fuerzas.ts';
import { BLOCK_SLIDE_CM, RELEASE_MARKS, isMark, pushesFarther, slideCm } from './labs/choques.ts';
import { MIXES, MIX_TESTS, hasBubbles, mixObserved, newSubstance, recoverable, type Mix, type MixTest } from './labs/mezclas.ts';
import { JAR_WITH_WATER_G, KNOWN_SAMPLES, MYSTERY_IS, PROPS, SAMPLES, SUBSTANCES, SUBSTANCE_G, confusableWith, dissolves, observed, remainingAfter, totalAfter, totalBefore, type Prop, type Sample, type Substance } from './labs/materia.ts';
import { MAGNET_MARKS, MAGNET_OBJECTS, magnetMoves, type MagnetObject } from './labs/imanes.ts';
import { CRITERION_MAX_RISE, LAYER_IDS, MAX_LAYERS, designLabel, meetsCriterion, riseAt10, temperatures, type Layer } from './labs/termico.ts';
import { bestMaterial, LEVEL_TEXT, MATERIAL_NAME, MATERIAL_TESTS, materialResult, MATERIALS, type MaterialTest } from './labs/materiales.ts';
import type { ScienceArea } from './map.ts';

export type Phase = 'observa' | 'explora' | 'explica' | 'usa';
export const PHASES: readonly Phase[] = ['observa', 'explora', 'explica', 'usa'];

export type StepKind = 'ver' | 'tocarZonas' | 'elegir' | 'predecir' | 'probar' | 'registrar' | 'graficar' | 'afirmacion' | 'mapa' | 'arreglar' | 'reflexion' | 'texto';

/** Una escena es un id que la app traduce a su imagen (`subjects/ciencia/art.ts`); un paso sin imagen propia no lleva escena. */
export type SceneId = string;

/** Zona tocable de una escena: el niño dice lo que ve tocándola. `part` = la parte de la tarea que llena; `id` = id de opción. */
export interface SceneZone {
  id: string;
  /** Rectángulo en porcentaje de la imagen (0–100). */
  x: number;
  y: number;
  w: number;
  h: number;
  label: Localized;
}
export interface StepZones {
  part: string;
  items: SceneZone[];
}

/** Dos bandejas del laboratorio de erosión tal como las ve el niño en un paso. */
export interface LabSetup {
  a: { cover: Cover; slope: Slope };
  b: { cover: Cover; slope: Slope };
  /** Cuántas pruebas se pueden hacer en este paso (1–3). */
  trials?: number;
  /** Solo se ve «poca/algo/mucha tierra», sin gramos (primera exploración). */
  qualitative?: boolean;
  /** Los resultados ya están hechos (no se riega): se muestran para analizarlos. */
  static?: boolean;
}

/** La caja de observación con un objeto y una luz (C1-U02). */
export interface LightSetup {
  object: LightObject;
  /** Cómo empieza la luz. */
  light: LightState;
  /** Cuántas veces cambia la luz el niño en este paso (para «probar»). */
  trials?: number;
  /** Repeticiones por condición en la tabla de observaciones (3). */
  repeats?: number;
  /** Se muestra la tabla ya hecha (para analizarla) en vez de pedir que se anote. */
  static?: boolean;
}

/** El probador de materiales con las cuatro piezas iguales (C2-U02). */
export interface MaterialSetup {
  test: MaterialTest;
  /** Cuántos materiales prueba el niño en este paso (1–4). */
  trials?: number;
  /** Se muestran los resultados ya hechos (para analizarlos) en vez de pedir que se hagan. */
  static?: boolean;
}

/** La funda aislante de C6-U04: diseños que se muestran y/o que el niño arma y prueba. */
export interface ThermalSetup {
  /** Diseños (capas) cuyas temperaturas se muestran en la gráfica; el vaso sin funda es `[]`. */
  show?: Layer[][];
  /** El niño arma una funda (hasta 3 capas) y la prueba. */
  build?: { trials?: number; criterion?: boolean };
  /** El niño traza él mismo la curva del vaso sin funda. */
  plot?: boolean;
}

/** El imán grande y los objetos de C3-U06. */
export interface MagnetSetup {
  /** Un solo objeto y se cambia la marca del imán. */
  object?: MagnetObject;
  /** Varios objetos entre los que el niño elige (con el imán en `position`). */
  objects?: MagnetObject[];
  /** Marca fija del imán (1 = más cerca). Sin ella el niño elige la marca. */
  position?: number;
  /** Cuántas pruebas (marcas u objetos distintos) hace el niño en este paso. */
  trials?: number;
  /** Se muestran los resultados ya hechos (para analizarlos). */
  static?: boolean;
}

/** La materia de C5: el frasco cerrado en la balanza (`jar`), la tabla de propiedades de las muestras (`props`) o la tabla de mezclas (`mix`). */
export interface MatterSetup {
  view: 'jar' | 'props' | 'mix';
  /** jar: la sustancia que se echa (o entre cuáles elige el niño con `substances`). */
  substance?: Substance;
  substances?: Substance[];
  /** jar: cuántas acciones de la pesada (0–4) están hechas al mostrar el paso. */
  done?: number;
  /** jar: sustancias distintas que pesa el niño · props: pruebas distintas que hace a la muestra X. */
  trials?: number;
  /** Se muestran los resultados ya hechos (para analizarlos). */
  static?: boolean;
  /** jar: la balanza no mide todavía (pantalla en blanco): primera mirada, sin números. */
  qualitative?: boolean;
  /** props: filas (muestras) y columnas (pruebas) de la tabla. */
  samples?: Sample[];
  tests?: Prop[];
  /** props: la fila de la X se muestra completa aunque no se haya probado. */
  revealX?: boolean;
  /** mix: las mezclas (filas) y las pruebas (columnas) de la tabla. */
  mixes?: Mix[];
  mixTests?: MixTest[];
  /** mix: con `static`, los resultados quedan ocultos (para predecir antes de probar). */
  hidden?: boolean;
}

/** La rampa y el bloque de C4-U02: una bola que se suelta desde una marca (1 = la más baja, 4 = la más alta). */
export interface RampSetup {
  /** Marca fija desde la que se suelta (con `static`, el resultado ya está hecho). Sin ella el niño elige la marca. */
  mark?: number;
  /** Cuántas marcas distintas prueba el niño en este paso. */
  trials?: number;
  /** Se muestran los resultados ya hechos (para analizarlos). */
  static?: boolean;
}

/** El carrito con empujones (`cart`) o el péndulo (`swing`) de C3-U05. */
export interface ForceSetup {
  view: 'cart' | 'swing';
  /** cart: empujones hacia la izquierda y hacia la derecha (0–3). Sin ellos el niño los elige. */
  left?: number;
  right?: number;
  /** cart: combinaciones distintas que prueba el niño · swing: latidos que mira. */
  trials?: number;
  /** swing: cuántos latidos aparecen en la tabla ya hecha. */
  ticks?: number;
  /** Se muestran los resultados ya hechos (para analizarlos). */
  static?: boolean;
}

export interface ChoiceOption {
  id: string;
  text: Localized;
  /** La opción que el dato respalda; sin ninguna `expected` la pregunta es abierta (una idea propia). */
  expected?: boolean;
}

/** Una pregunta de elegir dentro de un paso (no es una tarea evaluada: la acompaña, nunca bloquea). */
export interface StepChoice {
  id: string;
  multi: boolean;
  options: ChoiceOption[];
  /** Compara con lo que predijo el niño en otra tarea (¿coincidió?). */
  compareWith?: { taskId: string; partId: string };
}

export interface MapSetup {
  id: 'A' | 'B';
  /** `band` = herramienta de franja. */
  tool: 'band' | null;
  /** Los sismos están ocultos hasta que el niño predice. */
  hideQuakes: boolean;
}

export interface UnitStep {
  id: string;
  phase: Phase;
  kind: StepKind;
  text: Localized;
  /** Tarea evaluada que se hace en este paso. */
  taskId?: string;
  /** Lo único que se guarda de este paso (datos derivados). */
  saves?: string;
  scene?: SceneId;
  zones?: StepZones;
  lab?: LabSetup;
  light?: LightSetup;
  material?: MaterialSetup;
  thermal?: ThermalSetup;
  magnet?: MagnetSetup;
  matter?: MatterSetup;
  ramp?: RampSetup;
  forces?: ForceSetup;
  /** Pasos de «arreglar la prueba»: el laboratorio resultante según el arreglo que elija el niño (id de la opción). */
  labFixed?: Record<string, LabSetup>;
  choice?: StepChoice;
  /** Variante de la pregunta según el arreglo que eligió el niño en la tarea anterior (misma `id`). */
  choiceByFix?: Record<string, StepChoice>;
  map?: MapSetup;
  /** Palabras del glosario (en español) que se muestran en este paso. */
  glossary?: string[];
}

export interface UnitSession {
  id: string;
  title: Localized;
  objective: Localized;
  steps: UnitStep[];
}

export interface TaskOption {
  id: string;
  text: Localized;
  /** `false` = distractor: se rechaza con `whyNot` (retroalimentación de compañía, nunca «incorrecto»). */
  valid: boolean;
  whyNot?: Localized;
}

export interface TaskPart {
  id: string;
  prompt: Localized;
  options: TaskOption[];
  /** Cuántas opciones válidas hay que elegir como mínimo. */
  min: number;
  /** `true`: elegir un distractor cuenta como «revisa esto». `false`: cualquier elección vale (predicciones, reflexiones). */
  strict: boolean;
  /** Predicciones: la opción que coincidirá con lo que se observe. */
  observedOptionId?: string;
}

export type TaskKind = 'observar' | 'predecir' | 'evidencia' | 'modelo' | 'transferir' | 'reflexionar';

export interface UnitTask {
  id: string;
  kind: TaskKind;
  /** Ideas a las que da evidencia. Vacío = no suma dominio (reflexión: comunicación). */
  ideaIds: string[];
  contextId: string;
  sessionId: string;
  standards: string[];
  criterion: Localized;
  parts: TaskPart[];
  /** Pista → comparar dos casos → ejemplo en OTRO caso. */
  hints: [Localized, Localized, Localized];
  feedback: { incomplete: Localized; wrong: Localized; ok: Localized };
}

export interface Idea {
  id: string;
  text: Localized;
  misconception: Localized;
  /** Casos distintos en que se puede explicar. `repaso` = lo genera el repaso con un caso nuevo (no tiene tarea fija). */
  contexts: string[];
}

export interface GlossaryEntry {
  es: string;
  en: string;
  note: Localized;
}

export interface SafetySheet {
  title: Localized;
  enabledByParent: boolean;
  supervision: Localized;
  materials: Localized;
  place: Localized;
  hygiene: Localized;
  closing: Localized;
  stopIf: Localized[];
  excluded: Localized;
  data: Localized;
  digitalAlternative: Localized;
  review: 'pendienteDocente' | 'revisada';
}

export interface ScienceUnit {
  id: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  area: ScienceArea;
  title: Localized;
  question: Localized;
  standards: string[];
  standardTasks: Record<string, string[]>;
  ideas: Idea[];
  glossary: GlossaryEntry[];
  sessions: UnitSession[];
  tasks: UnitTask[];
  safety: SafetySheet;
  review: { status: 'draftPendingTeacherReview' | 'teacherValidated'; notes: string };
}

/** Las unidades con contenido, por grado. Una unidad con contenido todavía puede esperar su arte (`UNIT_ART_READY` en la app). */
export const SCIENCE_UNITS: readonly ScienceUnit[] = [c1u02 as unknown as ScienceUnit, c2u02 as unknown as ScienceUnit, c3u05 as unknown as ScienceUnit, c3u06 as unknown as ScienceUnit, c4u02 as unknown as ScienceUnit, c4u06 as unknown as ScienceUnit, c5u02 as unknown as ScienceUnit, c5u03 as unknown as ScienceUnit, c6u04 as unknown as ScienceUnit];
export const scienceUnitContent = (id: string): ScienceUnit | undefined => SCIENCE_UNITS.find((u) => u.id === id);

// ------------------------------------------------------------------ evaluar una tarea

export type PartOutcome = 'ok' | 'incomplete' | 'wrong';

export interface PartResult {
  outcome: PartOutcome;
  /** Por qué no sirve cada distractor elegido (retroalimentación de compañía). */
  whyNot: Localized[];
}

/** Una parte: elegir opciones. Un id que no existe se trata como distractor. */
export function evaluatePart(part: TaskPart, selected: string[]): PartResult {
  const chosen = [...new Set(selected)].map((id) => part.options.find((o) => o.id === id));
  const wrong = chosen.filter((o) => !o || !o.valid);
  const valid = chosen.filter((o) => o?.valid).length;
  if (part.strict && wrong.length) return { outcome: 'wrong', whyNot: wrong.flatMap((o) => (o?.whyNot ? [o.whyNot] : [])) };
  if (!part.strict && chosen.some((o) => !o)) return { outcome: 'wrong', whyNot: [] };
  return { outcome: valid >= part.min || (!part.strict && chosen.length >= part.min) ? 'ok' : 'incomplete', whyNot: [] };
}

export interface TaskResult {
  outcome: PartOutcome;
  parts: Record<string, PartResult>;
  /** Texto de compañía para mostrar: el de la tarea y, si hay distractores, el motivo de cada uno. */
  feedback: Localized;
  whyNot: Localized[];
}

/** Evalúa una tarea con lo que el niño eligió en cada parte (`{ idDeLaParte: [idsDeOpciones] }`). */
export function evaluateTask(task: UnitTask, selection: Record<string, string[]>): TaskResult {
  const parts: Record<string, PartResult> = {};
  for (const p of task.parts) parts[p.id] = evaluatePart(p, selection[p.id] ?? []);
  const results = Object.values(parts);
  const outcome: PartOutcome = results.some((r) => r.outcome === 'wrong') ? 'wrong' : results.some((r) => r.outcome === 'incomplete') ? 'incomplete' : 'ok';
  return { outcome, parts, feedback: task.feedback[outcome], whyNot: results.flatMap((r) => r.whyNot) };
}

/** Predicciones: ¿coincidió lo que eligió con lo observado? (la app lo sabe; el niño dice honestamente si coincidió). */
export function predictionMatched(task: UnitTask, partId: string, optionId: string): boolean | undefined {
  const part = task.parts.find((p) => p.id === partId);
  return part?.observedOptionId === undefined ? undefined : part.observedOptionId === optionId;
}

/** ¿Dijo con honestidad si coincidió? (distingue predicción de observación: criterio de T3 y T4). */
export function comparisonAdequate(task: UnitTask, partId: string, predicted: string, claim: 'coincidio' | 'nocoincidio'): boolean {
  const matched = predictionMatched(task, partId, predicted);
  return matched === undefined ? false : (claim === 'coincidio') === matched;
}

// ------------------------------------------------------------------ validar la unidad

/** Cuántas cosas distintas hay entre la bandeja A y la B (cobertura, inclinación). Prueba justa = 1. */
export const fairnessChanged = (lab: LabSetup): number => (lab.a.cover !== lab.b.cover ? 1 : 0) + (lab.a.slope !== lab.b.slope ? 1 : 0);

const BAD = /incorrect/i;

/** Comprueba una unidad (lista vacía = válida). */
export function unitProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const loc = (where: string, t: Localized | undefined) => {
    if (!t?.es?.trim() || !t?.en?.trim()) p.push(`${where}: falta texto en un idioma`);
    else if (BAD.test(t.es) || BAD.test(t.en)) p.push(`${where}: dice «incorrecto»`);
  };
  loc(`${u.id} título`, u.title);
  loc(`${u.id} pregunta`, u.question);
  if (u.review.status !== 'teacherValidated' && !/docente/i.test(u.review.notes)) p.push(`${u.id}: el estado editorial no explica que falta el docente`);

  // Ideas
  const ideaIds = new Set<string>();
  for (const i of u.ideas) {
    if (ideaIds.has(i.id)) p.push(`${i.id}: idea repetida`);
    ideaIds.add(i.id);
    loc(`idea ${i.id}`, i.text);
    loc(`idea ${i.id} error`, i.misconception);
    if (new Set(i.contexts).size < 2) p.push(`idea ${i.id}: necesita al menos 2 contextos distintos`);
  }

  // Sesiones
  const sessionIds = new Set<string>();
  const stepTaskCount: Record<string, number> = {};
  if (u.sessions.length !== 6) p.push(`${u.id}: tiene ${u.sessions.length} sesiones (se esperan 6)`);
  for (const s of u.sessions) {
    if (sessionIds.has(s.id)) p.push(`${s.id}: sesión repetida`);
    sessionIds.add(s.id);
    loc(`sesión ${s.id}`, s.title);
    loc(`sesión ${s.id} objetivo`, s.objective);
    if (!s.steps.length) p.push(`${s.id}: sin pasos`);
    let last = -1;
    for (const st of s.steps) {
      loc(`paso ${st.id}`, st.text);
      const at = PHASES.indexOf(st.phase);
      if (at < 0) p.push(`${st.id}: píldora desconocida`);
      else if (at < last) p.push(`${st.id}: las píldoras deben ir en orden (observa → explora → explica → usa)`);
      last = Math.max(last, at);
      if (st.taskId) stepTaskCount[st.taskId] = (stepTaskCount[st.taskId] ?? 0) + 1;
    }
  }

  // Detalle de cada paso (escena, laboratorio, mapa, preguntas)
  const allSteps = u.sessions.flatMap((x) => x.steps);
  const labProblems = (where: string, lab: LabSetup | undefined) => {
    if (!lab) return;
    for (const side of ['a', 'b'] as const) {
      if (!COVERS.includes(lab[side].cover)) p.push(`${where}: cobertura desconocida (${lab[side].cover})`);
      if (!SLOPES.includes(lab[side].slope)) p.push(`${where}: inclinación desconocida (${lab[side].slope})`);
    }
    if (lab.trials !== undefined && (lab.trials < 1 || lab.trials > 3)) p.push(`${where}: las pruebas van de 1 a 3`);
  };
  const choiceProblems = (where: string, c: StepChoice | undefined) => {
    if (!c) return;
    if (c.options.length < 2) p.push(`${where}: la pregunta necesita al menos 2 opciones`);
    if (new Set(c.options.map((o) => o.id)).size !== c.options.length) p.push(`${where}: opciones repetidas`);
    for (const o of c.options) loc(`${where}.${o.id}`, o.text);
    if (c.compareWith) {
      const part = u.tasks.find((t) => t.id === c.compareWith!.taskId)?.parts.find((x) => x.id === c.compareWith!.partId);
      if (part?.observedOptionId === undefined) p.push(`${where}: compara con una predicción que no existe`);
    }
  };
  for (const st of allSteps) {
    if (st.scene !== undefined && !st.scene.trim()) p.push(`${st.id}: escena vacía`);
    if (st.zones) {
      const part = u.tasks.find((t) => t.id === st.taskId)?.parts.find((x) => x.id === st.zones!.part);
      if (!part) p.push(`${st.id}: las zonas llenan una parte («${st.zones.part}») que la tarea del paso no tiene`);
      for (const z of st.zones.items) {
        loc(`${st.id} zona ${z.id}`, z.label);
        if (part && !part.options.some((o) => o.id === z.id)) p.push(`${st.id}: la zona «${z.id}» no es una opción de la parte`);
        if (z.x < 0 || z.y < 0 || z.w <= 0 || z.h <= 0 || z.x + z.w > 100 || z.y + z.h > 100) p.push(`${st.id}: la zona «${z.id}» se sale de la imagen`);
      }
    }
    labProblems(`${st.id} lab`, st.lab);
    for (const [k, lab] of Object.entries(st.labFixed ?? {})) labProblems(`${st.id} labFixed.${k}`, lab);
    choiceProblems(`${st.id} pregunta`, st.choice);
    for (const [k, c] of Object.entries(st.choiceByFix ?? {})) {
      choiceProblems(`${st.id} pregunta (${k})`, c);
      if (c.id !== st.choice?.id) p.push(`${st.id}: la variante «${k}» debe tener el mismo id que la pregunta`);
    }
    if (st.light) {
      if (!LIGHT_OBJECTS.includes(st.light.object)) p.push(`${st.id}: objeto desconocido (${st.light.object})`);
      if (!LIGHT_STATES.includes(st.light.light)) p.push(`${st.id}: estado de luz desconocido`);
      if (st.light.trials !== undefined && (st.light.trials < 1 || st.light.trials > 6)) p.push(`${st.id}: los cambios de luz van de 1 a 6`);
    }
    if (st.magnet) {
      for (const o of [...(st.magnet.object ? [st.magnet.object] : []), ...(st.magnet.objects ?? [])]) if (!MAGNET_OBJECTS.includes(o)) p.push(`${st.id}: objeto desconocido (${o})`);
      if (st.magnet.position !== undefined && !(MAGNET_MARKS as readonly number[]).includes(st.magnet.position)) p.push(`${st.id}: marca del imán fuera del recorrido`);
      if (st.magnet.trials !== undefined && (st.magnet.trials < 1 || st.magnet.trials > 5)) p.push(`${st.id}: las pruebas van de 1 a 5`);
      if (!st.magnet.object && !st.magnet.objects?.length) p.push(`${st.id}: el imán necesita un objeto`);
    }
    if (st.thermal) {
      for (const d of st.thermal.show ?? []) {
        if (d.length > MAX_LAYERS) p.push(`${st.id}: un diseño tiene más de ${MAX_LAYERS} capas`);
        for (const l of d) if (!LAYER_IDS.includes(l)) p.push(`${st.id}: capa desconocida (${l})`);
      }
      const trials = st.thermal.build?.trials;
      if (trials !== undefined && (trials < 1 || trials > 6)) p.push(`${st.id}: los diseños a probar van de 1 a 6`);
    }
    if (st.material) {
      if (!MATERIAL_TESTS.includes(st.material.test)) p.push(`${st.id}: prueba de materiales desconocida`);
      if (st.material.trials !== undefined && (st.material.trials < 1 || st.material.trials > MATERIALS.length)) p.push(`${st.id}: los materiales a probar van de 1 a ${MATERIALS.length}`);
    }
    if (st.forces) {
      const f = st.forces;
      for (const n of [f.left, f.right]) if (n !== undefined && (!Number.isInteger(n) || n < 0 || n > MAX_PUSHES)) p.push(`${st.id}: los empujones van de 0 a ${MAX_PUSHES}`);
      if (f.trials !== undefined && (f.trials < 1 || f.trials > 6)) p.push(`${st.id}: las pruebas van de 1 a 6`);
      if (f.ticks !== undefined && (f.ticks < 1 || f.ticks > 8)) p.push(`${st.id}: los latidos van de 1 a 8`);
    }
    if (st.ramp) {
      if (st.ramp.mark !== undefined && !isMark(st.ramp.mark)) p.push(`${st.id}: marca de la rampa fuera del recorrido`);
      if (st.ramp.trials !== undefined && (st.ramp.trials < 1 || st.ramp.trials > RELEASE_MARKS.length)) p.push(`${st.id}: las pruebas van de 1 a ${RELEASE_MARKS.length}`);
    }
    if (st.matter) {
      const m = st.matter;
      for (const sub of [...(m.substance ? [m.substance] : []), ...(m.substances ?? [])]) if (!SUBSTANCES.includes(sub)) p.push(`${st.id}: sustancia desconocida (${sub})`);
      if (m.view === 'jar' && !m.substance && !m.substances?.length) p.push(`${st.id}: el frasco necesita una sustancia`);
      if (m.done !== undefined && (m.done < 0 || m.done > 4)) p.push(`${st.id}: las acciones de la pesada van de 0 a 4`);
      if (m.trials !== undefined && (m.trials < 1 || m.trials > (m.view === 'mix' ? 10 : 3))) p.push(`${st.id}: las pruebas van de 1 a ${m.view === 'mix' ? 10 : 3}`);
      for (const x of m.samples ?? []) if (!SAMPLES.includes(x)) p.push(`${st.id}: muestra desconocida (${x})`);
      for (const x of m.tests ?? []) if (!PROPS.includes(x)) p.push(`${st.id}: prueba desconocida (${x})`);
      for (const x of m.mixes ?? []) if (!MIXES.includes(x)) p.push(`${st.id}: mezcla desconocida (${x})`);
      for (const x of m.mixTests ?? []) if (!MIX_TESTS.includes(x)) p.push(`${st.id}: prueba de mezclas desconocida (${x})`);
      if (m.view === 'mix' && (!m.mixes?.length || !m.mixTests?.length)) p.push(`${st.id}: la tabla de mezclas necesita mezclas y pruebas`);
      if (m.view === 'props' && (!m.samples?.length || !m.tests?.length)) p.push(`${st.id}: la tabla de propiedades necesita muestras y pruebas`);
    }
    if (st.map && !(st.map.id === 'A' || st.map.id === 'B')) p.push(`${st.id}: mapa desconocido`);
    for (const g of st.glossary ?? []) if (!u.glossary.some((e) => e.es === g)) p.push(`${st.id}: «${g}» no está en el glosario`);
    if (st.kind === 'arreglar') {
      const fixes = u.tasks.find((t) => t.id === st.taskId)?.parts.find((x) => x.id === 'arreglo')?.options.filter((o) => o.valid).map((o) => o.id) ?? [];
      for (const f of fixes) {
        if (!st.labFixed?.[f]) p.push(`${st.id}: falta el laboratorio para el arreglo «${f}»`);
        if (st.labFixed?.[f] && st.lab && fairnessChanged(st.labFixed[f]) !== 1) p.push(`${st.id}: el arreglo «${f}» debe dejar UNA sola diferencia`);
      }
    }
  }

  // Tareas
  const kinds = (k: TaskKind[]) => u.tasks.filter((t) => k.includes(t.kind)).length;
  if (u.tasks.length !== 8) p.push(`${u.id}: tiene ${u.tasks.length} tareas (el banco inicial es de 8)`);
  const want: [string, TaskKind[], number][] = [['observar', ['observar'], 2], ['predecir', ['predecir'], 2], ['evidencia/modelo', ['evidencia', 'modelo'], 2], ['transferir', ['transferir'], 1], ['reflexionar', ['reflexionar'], 1]];
  for (const [name, ks, n] of want) if (kinds(ks) !== n) p.push(`${u.id}: se esperan ${n} tareas de ${name} y hay ${kinds(ks)}`);
  const taskIds = new Set<string>();
  for (const t of u.tasks) {
    if (taskIds.has(t.id)) p.push(`${t.id}: tarea repetida`);
    taskIds.add(t.id);
    if (stepTaskCount[t.id] !== 1) p.push(`${t.id}: debe hacerse en exactamente un paso (está en ${stepTaskCount[t.id] ?? 0})`);
    const inSession = u.sessions.find((s) => s.id === t.sessionId)?.steps.some((st) => st.taskId === t.id);
    if (!inSession) p.push(`${t.id}: no está en su sesión ${t.sessionId}`);
    loc(`${t.id} criterio`, t.criterion);
    if (t.hints.length !== 3) p.push(`${t.id}: debe tener 3 pistas`);
    t.hints.forEach((h, i) => loc(`${t.id} pista ${i + 1}`, h));
    for (const k of ['incomplete', 'wrong', 'ok'] as const) loc(`${t.id} retroalimentación ${k}`, t.feedback[k]);
    for (const id of t.ideaIds) {
      const idea = u.ideas.find((i) => i.id === id);
      if (!idea) p.push(`${t.id}: idea desconocida (${id})`);
      else if (!idea.contexts.includes(t.contextId)) p.push(`${t.id}: su contexto «${t.contextId}» no está en la idea ${id}`);
    }
    for (const s of t.standards) if (!u.standards.includes(s)) p.push(`${t.id}: estándar ${s} que la unidad no declara`);
    for (const part of t.parts) {
      const where = `${t.id}.${part.id}`;
      loc(`${where} enunciado`, part.prompt);
      if (part.options.length < 2) p.push(`${where}: necesita al menos 2 opciones`);
      if (new Set(part.options.map((o) => o.id)).size !== part.options.length) p.push(`${where}: opciones repetidas`);
      const valid = part.options.filter((o) => o.valid).length;
      if (valid < part.min) p.push(`${where}: pide ${part.min} válidas y solo hay ${valid}`);
      for (const o of part.options) {
        loc(`${where}.${o.id}`, o.text);
        if (o.valid && o.whyNot) p.push(`${where}.${o.id}: una opción válida no lleva «whyNot»`);
        if (!o.valid) loc(`${where}.${o.id} whyNot`, o.whyNot);
      }
      if (!part.strict && part.options.some((o) => !o.valid)) p.push(`${where}: en una parte sin rigor (predicción, reflexión) toda opción debe ser válida`);
      if (part.observedOptionId && !part.options.some((o) => o.id === part.observedOptionId)) p.push(`${where}: la opción observada no existe`);
    }
  }
  // Cada contexto de cada idea (menos `repaso`) lo cubre alguna tarea.
  for (const i of u.ideas) for (const c of i.contexts) if (c !== 'repaso' && !u.tasks.some((t) => t.ideaIds.includes(i.id) && t.contextId === c)) p.push(`idea ${i.id}: ninguna tarea cubre el contexto «${c}»`);
  // Cada estándar tiene tareas que exigen su práctica (criterio de publicación 1).
  for (const s of u.standards) {
    const listed = u.standardTasks[s] ?? [];
    if (listed.length < 3) p.push(`estándar ${s}: necesita al menos 3 tareas (tiene ${listed.length})`);
    for (const id of listed) if (!u.tasks.find((t) => t.id === id)?.standards.includes(s)) p.push(`estándar ${s}: la tarea ${id} no lo declara`);
  }
  for (const g of u.glossary) {
    if (!g.es.trim() || !g.en.trim()) p.push(`glosario: entrada incompleta (${g.es || g.en})`);
    loc(`glosario ${g.es}`, g.note);
  }
  // Ficha de seguridad
  const s = u.safety;
  for (const [k, t] of Object.entries({ supervision: s.supervision, materials: s.materials, place: s.place, hygiene: s.hygiene, closing: s.closing, excluded: s.excluded, data: s.data, digitalAlternative: s.digitalAlternative })) loc(`seguridad ${k}`, t);
  if (s.stopIf.length < 3) p.push('seguridad: faltan condiciones para detenerse');
  s.stopIf.forEach((t, i) => loc(`seguridad detener ${i + 1}`, t));
  if (!s.enabledByParent) p.push('seguridad: las actividades fuera de pantalla las enciende el padre');
  if (s.review === 'pendienteDocente' && u.review.status === 'teacherValidated') p.push('seguridad: la unidad dice validada pero la ficha sigue pendiente');
  return p;
}

/** Los textos de la unidad que citan datos (números) deben coincidir con los datos que genera el modelo y los mapas. */
export function dataTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  if (u.id === 'C1-U02') return lightTextProblems(u);
  if (u.id === 'C2-U02') return materialTextProblems(u);
  if (u.id === 'C6-U04') return thermalTextProblems(u);
  if (u.id === 'C3-U06') return magnetTextProblems(u);
  if (u.id === 'C5-U02') return matterTextProblems(u);
  if (u.id === 'C5-U03') return mixTextProblems(u);
  if (u.id === 'C4-U02') return rampTextProblems(u);
  if (u.id === 'C3-U05') return forceTextProblems(u);
  if (u.id !== 'C4-U06') return p;
  const t5 = u.tasks.find((t) => t.id === 't5');
  const base = LADERA_DATASETS.base.rows;
  const evid = t5?.parts.find((x) => x.id === 'evidencia');
  for (const [optionId, rowId] of [['sin', 'ninguna'], ['con', 'completa']] as const) {
    const o = evid?.options.find((x) => x.id === optionId);
    const v = base.find((r) => r.id === rowId)!.values;
    if (!o?.text.es.includes(`${v[0]}, ${v[1]} y ${v[2]} g`)) p.push(`t5.evidencia.${optionId}: el texto ES no coincide con los datos (${v.join('/')})`);
    if (!o?.text.en.includes(`${v[0]}, ${v[1]} and ${v[2]} g`)) p.push(`t5.evidencia.${optionId}: el texto EN no coincide con los datos (${v.join('/')})`);
  }
  const { inside, total } = bandCount(PRACTICE_MAPS.A);
  const t6 = u.tasks.find((t) => t.id === 't6')?.parts.find((x) => x.id === 'evidencia')?.options.find((x) => x.id === 'conteo');
  if (!t6?.text.es.includes(`${inside} de ${total}`)) p.push(`t6.evidencia.conteo: el texto ES no dice «${inside} de ${total}»`);
  if (!t6?.text.en.includes(`${inside} of ${total}`)) p.push(`t6.evidencia.conteo: el texto EN no dice «${inside} of ${total}»`);
  const lejos = total - inside;
  const lim = u.tasks.find((t) => t.id === 't6')?.parts.find((x) => x.id === 'limite')?.options.find((x) => x.id === 'lejos');
  if (!lim?.text.es.includes(`${lejos} sismos lejos`)) p.push(`t6.limite.lejos: el texto ES no dice «${lejos} sismos lejos»`);
  const vol = u.tasks.find((t) => t.id === 't6')?.parts.find((x) => x.id === 'evidencia')?.options.find((x) => x.id === 'volcanes');
  if (!vol?.text.es.includes(`${PRACTICE_MAPS.A.volcanoes.length} volcanes`)) p.push('t6.evidencia.volcanes: el texto ES no coincide con el mapa');
  // S5.2: la respuesta esperada del recuento es la que calcula la app.
  const conteo = u.sessions.flatMap((x) => x.steps).find((st) => st.id === 's5.2')?.choice?.options.find((o) => o.expected);
  if (conteo?.id !== String(inside)) p.push(`s5.2: la opción esperada (${conteo?.id}) no coincide con el recuento del mapa (${inside})`);
  // S6.3: cada variante cita los datos de la prueba justa que corresponde.
  const s63 = u.sessions.flatMap((x) => x.steps).find((st) => st.id === 's6.3');
  const grams = (rows: { values: number[] }[], i: number, lang: 'es' | 'en') => (lang === 'es' ? `${rows[i].values[0]}, ${rows[i].values[1]} y ${rows[i].values[2]} g` : `${rows[i].values[0]}, ${rows[i].values[1]} and ${rows[i].values[2]} g`);
  const pairs: [StepChoice | undefined, string, string, Dataset][] = [
    [s63?.choice, 'sin', 'con', LADERA_DATASETS.justaCobertura],
    [s63?.choiceByFix?.cobertura, 'media', 'fuerte', LADERA_DATASETS.justaPendiente],
  ];
  for (const [c, a, b, ds] of pairs) {
    for (const [oid, idx] of [[a, 0], [b, 1]] as const) {
      const o = c?.options.find((x) => x.id === oid);
      for (const lang of ['es', 'en'] as const) if (!o?.text[lang].includes(grams(ds.rows, idx, lang))) p.push(`s6.3.${oid}: el texto ${lang.toUpperCase()} no coincide con los datos (${ds.rows[idx].values.join('/')})`);
    }
  }
  for (const m of Object.values(PRACTICE_MAPS)) p.push(...practiceMapProblems(m));
  return p;
}

/** C1-U02: las repeticiones de la tabla y lo que dicen los textos («las 3 veces») coinciden con el modelo de la luz. */
function lightTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const table = steps.find((st) => st.kind === 'registrar')?.light;
  if (table?.repeats !== 3) p.push('s3.2: la tabla debe tener 3 repeticiones por condición');
  const n = table?.repeats ?? 3;
  const evidence = u.tasks.find((t) => t.id === 't5')?.parts.find((x) => x.id === 'evidencia');
  for (const id of ['on', 'off']) {
    const o = evidence?.options.find((x) => x.id === id);
    if (!o?.text.es.includes(`las ${n} veces`)) p.push(`t5.evidencia.${id}: el texto ES no dice «las ${n} veces»`);
    if (!o?.text.en.includes(`all ${n} times`)) p.push(`t5.evidencia.${id}: el texto EN no dice «all ${n} times»`);
  }
  // Las predicciones acaban en «lo distingo» solo con la luz encendida (el modelo).
  for (const id of ['t3', 't4']) {
    const t = u.tasks.find((x) => x.id === id)?.parts.find((x) => x.id === 'resultado');
    if (t?.observedOptionId !== 'distingo') p.push(`${id}.resultado: lo observado al encender la luz debe ser «distingo»`);
  }
  return p;
}

/** C2-U02: lo que dicen los textos de resultados y las respuestas esperadas coincide con el modelo de los materiales. */
function materialTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  // Las predicciones apuntan al material que el modelo da como mejor para cada propósito.
  if (part('t3', 'material')?.observedOptionId !== bestMaterial('techo')) p.push('t3.material: lo observado debe ser el mejor material para el techo');
  if (part('t4', 'material')?.observedOptionId !== bestMaterial('secar')) p.push('t4.material: lo observado debe ser el mejor material para secar');
  // Cada evidencia cita el resultado que el modelo da para ese material (en palabras, en los dos idiomas).
  const cites: [string, MaterialTest, string[]][] = [['t5', 'techo', ['plastico', 'tela']], ['t6', 'secar', ['papel', 'plastico']]];
  for (const [taskId, test, ms] of cites) {
    for (const m of ms) {
      const o = part(taskId, 'evidencia')?.options.find((x) => x.id === m);
      const level = LEVEL_TEXT[test][materialResult(m as (typeof MATERIALS)[number], test)];
      for (const lang of ['es', 'en'] as const) {
        const said = o?.text[lang].toLowerCase() ?? '';
        if (!said.includes(level[lang].toLowerCase())) p.push(`${taskId}.evidencia.${m}: el texto ${lang.toUpperCase()} no dice «${level[lang]}» (modelo)`);
        if (!said.includes(MATERIAL_NAME[m as (typeof MATERIALS)[number]][lang].split(' ')[0].toLowerCase())) p.push(`${taskId}.evidencia.${m}: el texto ${lang.toUpperCase()} no nombra el material`);
      }
    }
  }
  // Las preguntas del paso con respuesta esperada coinciden con los resultados.
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.3') !== MATERIALS.find((m) => materialResult(m, 'techo') === 'nada')) p.push('s3.3: el material sin paso de agua no coincide con el modelo');
  if (materialResult('tela', 'techo') === materialResult('carton', 'techo') || expected('s3.4') !== 'tela') p.push('s3.4: la tela debe dejar pasar más agua que el cartón');
  return p;
}

const joinTemps = (t: number[], lang: 'es' | 'en') => (lang === 'es' ? `${t[0]}, ${t[1]} y ${t[2]}` : `${t[0]}, ${t[1]} and ${t[2]}`);

/** C6-U04: los números que citan los textos coinciden con el modelo térmico (y las respuestas esperadas con sus resultados). */
function thermalTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const opt = (taskId: string, partId: string, id: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId)?.options.find((o) => o.id === id);
  const need = (where: string, text: string | undefined, needle: string) => {
    if (!text?.includes(needle)) p.push(`${where}: el texto no dice «${needle}» (modelo)`);
  };
  const control = temperatures([]);
  need('t1.inicio', opt('t1', 'observaciones', 'inicio')?.text.es, `${control[0]} °C`);
  need('t1.final', opt('t1', 'observaciones', 'final')?.text.es, `${control[2]} °C`);
  const E1: Layer[] = ['espuma'];
  const E2: Layer[] = ['espuma', 'espuma'];
  const A3: Layer[] = ['aluminio', 'aluminio', 'aluminio'];
  for (const lang of ['es', 'en'] as const) {
    need(`t5.sin (${lang})`, opt('t5', 'evidencia', 'sin')?.text[lang], joinTemps(control, lang));
    need(`t5.dos (${lang})`, opt('t5', 'evidencia', 'dos')?.text[lang], joinTemps(temperatures(E2), lang));
    need(`t6.e2 (${lang})`, opt('t6', 'evidencia', 'e2')?.text[lang], `${joinTemps(temperatures(E2), lang)} °C`);
    need(`t6.e2 sube (${lang})`, opt('t6', 'evidencia', 'e2')?.text[lang], `${riseAt10(E2)} °C`);
    need(`t6.a3 (${lang})`, opt('t6', 'evidencia', 'a3')?.text[lang], `${joinTemps(temperatures(A3), lang)} °C`);
    need(`t6.a3 sube (${lang})`, opt('t6', 'evidencia', 'a3')?.text[lang], `${riseAt10(A3)} °C`);
    need(`t6.aluminio3 motivo (${lang})`, opt('t6', 'afirmacion', 'aluminio3')?.whyNot?.[lang], `${riseAt10(A3)} °C`);
    need(`t6.aluminio3 criterio (${lang})`, opt('t6', 'afirmacion', 'aluminio3')?.whyNot?.[lang], `${CRITERION_MAX_RISE} °C`);
    need(`t6.una motivo (${lang})`, opt('t6', 'afirmacion', 'una')?.whyNot?.[lang], `${riseAt10(E1)} °C`);
  }
  need('t2.capas', opt('t2', 'reglas', 'capas')?.text.es, `${MAX_LAYERS} capas`);
  need('t2.subida', opt('t2', 'reglas', 'subida')?.text.es, `${CRITERION_MAX_RISE} °C`);
  // Lo «observado» de las predicciones es lo que da el modelo.
  if (!(riseAt10(E1) < riseAt10([])) || opt('t3', 'resultado', 'menos') === undefined) p.push('t3: una capa de espuma debe subir menos que sin funda');
  const t3 = u.tasks.find((t) => t.id === 't3')?.parts.find((x) => x.id === 'resultado');
  if (t3?.observedOptionId !== 'menos') p.push('t3.resultado: lo observado debe ser «menos»');
  const designs: [string, Layer[]][] = [['espuma2', E2], ['fieltro_espuma', ['fieltro', 'espuma']], ['aluminio3', A3]];
  const best = [...designs].sort((a, b) => riseAt10(a[1]) - riseAt10(b[1]))[0][0];
  const t4 = u.tasks.find((t) => t.id === 't4')?.parts.find((x) => x.id === 'diseno');
  if (t4?.observedOptionId !== best) p.push(`t4.diseno: lo observado debe ser «${best}» (el que sube menos)`);
  if (!meetsCriterion(E2) || meetsCriterion(E1) || meetsCriterion(A3)) p.push('t6: espuma ×2 debe cumplir el criterio y espuma ×1 y aluminio ×3 no');
  // Etiquetas de los diseños citadas en las opciones.
  need('t4.espuma2', opt('t4', 'diseno', 'espuma2')?.text.es?.toLowerCase(), designLabel(E2, 'es').toLowerCase());
  const pattern = steps.find((st) => st.id === 's3.3')?.choice?.options.find((o) => o.expected)?.id;
  if (pattern !== 'mas' || !(riseAt10(E2) < riseAt10(E1) && riseAt10(E1) < riseAt10([]))) p.push('s3.3: con más capas debe subir menos');
  return p;
}

const joinMarks = (marks: number[], lang: 'es' | 'en') => (marks.length === 1 ? `${marks[0]}` : lang === 'es' ? `${marks.slice(0, -1).join(', ')} y ${marks[marks.length - 1]}` : `${marks.slice(0, -1).join(', ')} and ${marks[marks.length - 1]}`);

/** C3-U06: lo que dicen los textos sobre marcas y objetos coincide con el modelo del imán. */
function magnetTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  // Lo que el niño verá en la marca 5 y con el aluminio es lo que dice el modelo.
  if (magnetMoves('clavo', 5)) p.push('t3: con el imán en la marca 5 el clavo no debe moverse');
  if (part('t3', 'resultado')?.observedOptionId !== 'nada') p.push('t3.resultado: lo observado debe ser «nada»');
  if (magnetMoves('aluminio', 1)) p.push('t4: la bola de aluminio no debe moverse');
  if (part('t4', 'resultado')?.observedOptionId !== 'nada') p.push('t4.resultado: lo observado debe ser «nada»');
  // t5: las marcas citadas son las del modelo.
  const near = MAGNET_MARKS.filter((m) => magnetMoves('clavo', m));
  const far = MAGNET_MARKS.filter((m) => !magnetMoves('clavo', m));
  const ev = part('t5', 'evidencia');
  for (const lang of ['es', 'en'] as const) {
    const lead = lang === 'es' ? 'En las marcas' : 'On marks';
    if (!ev?.options.find((o) => o.id === 'cerca')?.text[lang].includes(`${lead} ${joinMarks(near, lang)}`)) p.push(`t5.evidencia.cerca (${lang}): debe decir «${lead} ${joinMarks(near, lang)}» (modelo)`);
    if (!ev?.options.find((o) => o.id === 'lejos')?.text[lang].includes(`${lead} ${joinMarks(far, lang)}`)) p.push(`t5.evidencia.lejos (${lang}): debe decir «${lead} ${joinMarks(far, lang)}» (modelo)`);
    const why = part('t5', 'afirmacion')?.options.find((o) => o.id === 'siempre')?.whyNot?.[lang] ?? '';
    if (!why.includes(joinMarks(far, lang))) p.push(`t5.afirmacion.siempre (${lang}): debe citar las marcas ${joinMarks(far, lang)}`);
  }
  // Las respuestas esperadas de las preguntas del paso coinciden con el modelo.
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.3') !== 'cerca' || !near.every((m) => m < Math.min(...far))) p.push('s3.3: el patrón «cerca sí, lejos no» no coincide con el modelo');
  if (expected('s3.4') !== 'no') p.push('s3.4: un imán no mueve desde cualquier distancia');
  // El plástico y el aluminio nunca se mueven: las observaciones válidas de t2 solo dicen eso.
  if (MAGNET_OBJECTS.some((o) => (o === 'bloque' || o === 'aluminio') && MAGNET_MARKS.some((m) => magnetMoves(o, m)))) p.push('t2: el bloque y el aluminio no deben moverse nunca');
  return p;
}

/** C5-U02: los números y las propiedades que citan los textos coinciden con el modelo de la masa y de las muestras. */
function matterTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  const opt = (taskId: string, partId: string, id: string) => part(taskId, partId)?.options.find((o) => o.id === id);
  const need = (where: string, text: string | undefined, needle: string) => {
    if (!text?.includes(needle)) p.push(`${where}: el texto no dice «${needle}» (modelo)`);
  };
  // t3: lo que se observará es el total, igual que antes de mezclar.
  if (part('t3', 'resultado')?.observedOptionId !== 'igual') p.push('t3.resultado: lo observado debe ser «igual»');
  for (const lang of ['es', 'en'] as const) {
    need(`t3.menos (${lang})`, opt('t3', 'resultado', 'menos')?.text[lang], `${totalBefore('sal')} g`);
    need(`t3.igual (${lang})`, opt('t3', 'resultado', 'igual')?.text[lang], `${totalAfter('sal')} g`);
    need(`t3 (${lang})`, part('t3', 'resultado')?.prompt[lang], `${JAR_WITH_WATER_G} g`);
    need(`t3 (${lang})`, part('t3', 'resultado')?.prompt[lang], `${SUBSTANCE_G.sal} g`);
    // t5: la evidencia cita las pesadas del modelo (antes = suma, después = lectura).
    for (const sub of ['sal', 'azucar'] as const) {
      const text = opt('t5', 'evidencia', sub)?.text[lang];
      need(`t5.evidencia.${sub} (${lang})`, text, `${JAR_WITH_WATER_G} g`);
      need(`t5.evidencia.${sub} (${lang})`, text, `${SUBSTANCE_G[sub]} g`);
      need(`t5.evidencia.${sub} (${lang})`, text, `${totalBefore(sub)} g`);
      if (totalAfter(sub) !== totalBefore(sub)) p.push(`t5: con ${sub} el total no se conserva en el modelo`);
    }
    need(`t5.menos motivo (${lang})`, opt('t5', 'afirmacion', 'menos')?.whyNot?.[lang], `${totalBefore('sal')} g`);
    need(`t5.mas motivo (${lang})`, opt('t5', 'afirmacion', 'mas')?.whyNot?.[lang], `${totalAfter('sal')} g`);
    // t7: el hielo en el frasco cerrado.
    need(`t7 (${lang})`, part('t7', 'resultado')?.prompt[lang], `${totalBefore('hielo')} g`);
    need(`t7.igual (${lang})`, opt('t7', 'resultado', 'igual')?.text[lang], `${totalAfter('hielo')} g`);
    need(`t7.menos motivo (${lang})`, opt('t7', 'resultado', 'menos')?.whyNot?.[lang], `${totalAfter('hielo')} g`);
  }
  if (totalAfter('hielo') !== totalBefore('hielo')) p.push('t7: el hielo derretido debe conservar la masa en el modelo');
  // t2/t6: las propiedades citadas son las del modelo.
  if (!dissolves('sal') || !dissolves('azucar') || dissolves('arena') || dissolves('harina')) p.push('t2: solo la sal y el azúcar se disuelven');
  if (part('t4', 'resultado')?.observedOptionId !== (dissolves('X') ? 'disuelve' : 'nodisuelve')) p.push('t4.resultado: lo observado no coincide con lo que hace la X en agua');
  const validClaim = part('t6', 'afirmacion')?.options.filter((o) => o.valid).map((o) => o.id);
  if (validClaim?.length !== 1 || validClaim[0] !== MYSTERY_IS) p.push(`t6.afirmacion: la única respuesta válida debe ser «${MYSTERY_IS}»`);
  // El color solo no distingue la X; con «en agua» + «granitos» queda una sola posibilidad.
  if (confusableWith('X', 'color').length < 2) p.push('t6: el color solo debe dejar varias posibilidades');
  const left = remainingAfter(['agua', 'granitos']);
  if (left.length !== 1 || left[0] !== MYSTERY_IS) p.push('t6: con «en agua» y «con la lupa» debe quedar solo la muestra misteriosa');
  if (!KNOWN_SAMPLES.every((k) => observed(k, 'color').es.length > 0)) p.push('t2: falta el color de una muestra');
  // Preguntas del paso con respuesta esperada.
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.3') !== 'igual') p.push('s3.3: el patrón esperado es «antes y después marcaron lo mismo»');
  if (expected('s3.4') !== 'cerrado') p.push('s3.4: se cierra el frasco para que nada salga ni entre');
  // Cada paso con tabla antes/después usa una sustancia que el niño echa en el laboratorio (no el hielo).
  for (const st of steps) if (st.matter?.view === 'jar' && st.kind !== 'ver' && st.matter.substances?.includes('hielo')) p.push(`${st.id}: el hielo solo se usa en la transferencia`);
  return p;
}

/** C5-U03: lo que dicen los textos sobre las mezclas coincide con el modelo (burbujas y recuperar lo de antes). */
function mixTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  // Las predicciones apuntan a lo que da el modelo.
  if (part('t3', 'resultado')?.observedOptionId !== (hasBubbles('bicarbonato_vinagre') ? 'si' : 'no')) p.push('t3.resultado: lo observado debe coincidir con las burbujas del bicarbonato con vinagre');
  if (part('t4', 'resultado')?.observedOptionId !== (recoverable('arena_agua') ? 'si' : 'no')) p.push('t4.resultado: lo observado debe coincidir con lo recuperable de la arena');
  // Solo el bicarbonato con vinagre crea una sustancia nueva; las demás son mezclas (las tareas lo dicen así).
  if (MIXES.filter(newSubstance).join() !== 'bicarbonato_vinagre') p.push('el modelo debe tener una sola mezcla con sustancia nueva: bicarbonato con vinagre');
  const validClaim = part('t6', 'afirmacion')?.options.filter((o) => o.valid).map((o) => o.id);
  if (validClaim?.join() !== (newSubstance('harina_agua') ? 'nueva' : 'nonueva')) p.push('t6.afirmacion: la respuesta válida debe coincidir con el modelo de la harina con agua');
  const decision = part('t7', 'decision')?.options.filter((o) => o.valid).map((o) => o.id);
  if (decision?.join() !== 'no') p.push('t7.decision: disolver azúcar en limonada no crea una sustancia nueva');
  // Cada observación citada en las evidencias coincide con la tabla del modelo.
  const need = (where: string, text: string | undefined, needle: string) => {
    if (!text?.toLowerCase().includes(needle.toLowerCase())) p.push(`${where}: el texto no dice «${needle}» (modelo)`);
  };
  for (const lang of ['es', 'en'] as const) {
    need(`t2.burbujas (${lang})`, part('t2', 'observaciones')?.options.find((o) => o.id === 'burbujas')?.text[lang], lang === 'es' ? 'bicarbonato con vinagre' : 'baking soda with vinegar');
    need(`t5.sal (${lang})`, part('t5', 'evidencia')?.options.find((o) => o.id === 'sal')?.text[lang], lang === 'es' ? 'quedó sal' : 'salt was left');
    need(`t6.filtro (${lang})`, part('t6', 'evidencia')?.options.find((o) => o.id === 'filtro')?.text[lang], mixObserved('harina_agua', 'recuperar')[lang].split(': ')[1].split(' ').slice(-2).join(' '));
  }
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.2') !== 'bicarb') p.push('s3.2: solo el bicarbonato con vinagre hace burbujas');
  if (expected('s3.4') !== 'no' || newSubstance('sal_agua')) p.push('s3.4: disolver sal no crea una sustancia nueva');
  if (!MIX_TESTS.every((t) => MIXES.every((m) => mixObserved(m, t).es.length > 0))) p.push('falta una observación del modelo');
  return p;
}

/** C4-U02: las distancias y las respuestas esperadas de los textos coinciden con el modelo de la rampa. */
function rampTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  const opt = (taskId: string, partId: string, id: string) => part(taskId, partId)?.options.find((o) => o.id === id);
  const need = (where: string, text: string | undefined, needle: string) => {
    if (!text?.includes(needle)) p.push(`${where}: el texto no dice «${needle}» (modelo)`);
  };
  const lo = `${slideCm(1)} cm`;
  const hi = `${slideCm(4)} cm`;
  for (const lang of ['es', 'en'] as const) {
    need(`t2.lejos (${lang})`, opt('t2', 'observaciones', 'lejos')?.text[lang], hi);
    need(`t2.cerca (${lang})`, opt('t2', 'observaciones', 'cerca')?.text[lang], lo);
    need(`t5.cuatro (${lang})`, opt('t5', 'evidencia', 'cuatro')?.text[lang], hi);
    need(`t5.uno (${lang})`, opt('t5', 'evidencia', 'uno')?.text[lang], lo);
    need(`t5.igual motivo (${lang})`, opt('t5', 'afirmacion', 'igual')?.whyNot?.[lang], lo);
    need(`t5.igual motivo (${lang})`, opt('t5', 'afirmacion', 'igual')?.whyNot?.[lang], hi);
    need(`t5.menos motivo (${lang})`, opt('t5', 'afirmacion', 'menos')?.whyNot?.[lang], hi);
    need(`t6.bloque (${lang})`, opt('t6', 'evidencia', 'bloque')?.text[lang], hi);
    need(`t6.bloque (${lang})`, opt('t6', 'evidencia', 'bloque')?.text[lang], lo);
  }
  // Las predicciones apuntan a lo que da el modelo.
  if (!pushesFarther(4, 2) || part('t3', 'resultado')?.observedOptionId !== 'mas') p.push('t3.resultado: desde la marca 4 el bloque debe deslizarse más que desde la 2');
  if (part('t4', 'resultado')?.observedOptionId !== 'suave') p.push('t4.resultado: desde la marca 1 el golpe debe sonar más suave');
  const validT7 = part('t7', 'resultado')?.options.filter((o) => o.valid).map((o) => o.id);
  if (validT7?.join() !== 'alta') p.push('t7.resultado: lo que baja más rápido empuja más lejos');
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.3') !== 'mas' || !RELEASE_MARKS.every((m, i) => i === 0 || pushesFarther(m, RELEASE_MARKS[i - 1]))) p.push('s3.3: cada marca más alta debe empujar el bloque más lejos');
  if (expected('s3.4') !== 'rapida') p.push('s3.4: la explicación esperada es la rapidez (energía de movimiento)');
  if (expected('s2.1') !== 'altura') p.push('s2.1: lo que cambia es la altura');
  if (Object.keys(BLOCK_SLIDE_CM).length !== RELEASE_MARKS.length) p.push('el modelo debe dar una distancia por marca');
  return p;
}

/** C3-U05: las combinaciones, distancias y patrones que citan los textos coinciden con el modelo de fuerzas. */
function forceTextProblems(u: ScienceUnit): string[] {
  const p: string[] = [];
  const steps = u.sessions.flatMap((s) => s.steps);
  const part = (taskId: string, partId: string) => u.tasks.find((t) => t.id === taskId)?.parts.find((x) => x.id === partId);
  const opt = (taskId: string, partId: string, id: string) => part(taskId, partId)?.options.find((o) => o.id === id);
  const need = (where: string, text: string | undefined, needle: string) => {
    if (!text?.includes(needle)) p.push(`${where}: el texto no dice «${needle}» (modelo)`);
  };
  // t1: 2 empujones hacia la derecha y ninguno hacia la izquierda → se mueve a la derecha.
  const first = steps.find((st) => st.id === 's1.1')?.forces;
  if (first?.left !== 0 || first.right !== 2 || cartMove(0, 2) !== 'derecha') p.push('s1.1: con 0 a la izquierda y 2 a la derecha el carrito debe ir a la derecha');
  // t3: empujones iguales → se queda quieto.
  if (!balanced(2, 2) || part('t3', 'resultado')?.observedOptionId !== (cartMove(2, 2) === 'quieto' ? 'quieto' : '')) p.push('t3.resultado: con 2 y 2 lo observado debe ser «quieto»');
  // t5: la evidencia con desiguales cita los 24 cm del modelo hacia la izquierda con 3 y 1.
  if (cartMove(3, 1) !== 'izquierda') p.push('t5: con 3 a la izquierda y 1 a la derecha el carrito debe ir a la izquierda');
  for (const lang of ['es', 'en'] as const) {
    need(`t5.desiguales (${lang})`, opt('t5', 'evidencia', 'desiguales')?.text[lang], `${travelCm(3, 1)} cm`);
    need(`t5.siempre motivo (${lang})`, opt('t5', 'afirmacion', 'siempre')?.whyNot?.[lang], lang === 'es' ? '3 empujones hacia la izquierda y 1 hacia la derecha' : '3 pushes to the left and 1 to the right');
  }
  // t4 y t6: el péndulo (latido 0 a la izquierda; 7 impar → derecha; 10 par → izquierda).
  if (part('t4', 'resultado')?.observedOptionId !== (swingSide(7) === 'derecha' ? 'derecha' : 'izquierda')) p.push('t4.resultado: lo observado en el latido 7 no coincide con el modelo');
  const t6 = part('t6', 'prediccion')?.options.filter((o) => o.valid).map((o) => o.id);
  if (t6?.join() !== (swingSide(10) === 'izquierda' ? 'izq' : 'der')) p.push('t6.prediccion: la respuesta válida para el latido 10 no coincide con el modelo');
  // Preguntas del paso con respuesta esperada.
  const expected = (id: string) => steps.find((st) => st.id === id)?.choice?.options.find((o) => o.expected)?.id;
  if (expected('s3.3') !== 'lado') p.push('s3.3: el patrón esperado es «hacia el empujón más fuerte; iguales, quieto»');
  if (expected('s3.4') !== 'desiguales') p.push('s3.4: lo que cambia el movimiento son empujones desiguales');
  if (expected('s2.1') !== 'empujones') p.push('s2.1: lo que cambia son los empujones');
  // La tabla del niño (s3.2) usa las combinaciones del modelo.
  if (TABLE_PAIRS.length !== 5) p.push('la tabla del carrito debe tener 5 combinaciones');
  return p;
}

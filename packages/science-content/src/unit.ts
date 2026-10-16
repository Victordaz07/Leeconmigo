/**
 * Unidad de Ciencia como datos validados (docs/design/ciencia/unidades/C4-U06.md). Todo texto viene en ES y EN, escrito de
 * forma natural en cada idioma. Los textos NO dicen «incorrecto» (docs/06). Esto es CONTENIDO y reglas puras: la pantalla solo
 * lo dibuja.
 */
import type { Localized } from '@lee-conmigo/contracts';
import c1u02 from '../content/c1-u02.json';
import c4u06 from '../content/c4-u06.json';
import { practiceMapProblems, PRACTICE_MAPS, bandCount, LADERA_DATASETS, type Dataset } from './datasets.ts';
import { COVERS, SLOPES, type Cover, type Slope } from './labs/erosion.ts';
import { LIGHT_OBJECTS, LIGHT_STATES, type LightObject, type LightState } from './labs/luz.ts';
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
export const SCIENCE_UNITS: readonly ScienceUnit[] = [c1u02 as unknown as ScienceUnit, c4u06 as unknown as ScienceUnit];
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

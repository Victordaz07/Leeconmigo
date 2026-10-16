/**
 * Generador de retos (docs/research §5 "Motor de generación"): a partir de la plantilla de un reto crea otro con números
 * nuevos. Determinista: la misma semilla da el mismo reto, en los dos idiomas (cambiar de idioma no cambia los números).
 * Nada se escribe con un modelo de lenguaje en tiempo de uso; solo se rellenan las plantillas revisadas.
 *
 * Reglas: la respuesta sale de la plantilla (no del texto); se respetan rangos y restricciones; el ejemplo resuelto usa
 * OTROS números; los números del modelo dibujado son los del enunciado. Mientras las plantillas no declaren singular, los
 * parámetros valen 2 o más (evita "1 mesas" y los ×1 triviales).
 */
import type { HintStep, Localized, MathChallenge, MathRepresentation } from '@lee-conmigo/contracts';
import { evaluate } from './expression.ts';

export interface GeneratedChallenge {
  /** `g3u1.l2.c1#57`: el reto y la semilla (para repetirlo igual). */
  id: string;
  challengeId: string;
  skillId: string;
  seed: number;
  /** Parámetros y derivados (`groups`, `perGroup`, `total`). */
  values: Record<string, number>;
  prompt: Localized;
  hints: HintStep[];
  answer: number;
  answerUnit?: Localized;
  representation: MathRepresentation;
  feedback: MathChallenge['feedback'];
  /** true = es el reto tal como lo escribió el autor (textos y pistas revisados a mano). */
  authored: boolean;
}

/** PRNG pequeño y determinista (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MIN_VALUE = 2;
/** Los dos primeros parámetros, en el orden de la plantilla (grupos y por grupo, filas y columnas). */
const firstTwo = (c: MathChallenge) => Object.keys(c.generator.parameters).slice(0, 2);
const MAX_TRIES = 200;

/** Restricción "total <= 81" (lado izquierdo y derecho son expresiones). */
function satisfies(constraint: string, values: Record<string, number>): boolean {
  const m = constraint.match(/^(.+?)(<=|>=|==|<|>)(.+)$/);
  if (!m) throw new Error(`Restricción no reconocida: "${constraint}"`);
  const l = evaluate(m[1], values);
  const r = evaluate(m[3], values);
  return m[2] === '<=' ? l <= r : m[2] === '>=' ? l >= r : m[2] === '<' ? l < r : m[2] === '>' ? l > r : l === r;
}

function withDerived(c: MathChallenge, params: Record<string, number>): Record<string, number> {
  const values = { ...params };
  for (const [k, e] of Object.entries(c.generator.derived ?? {})) values[k] = evaluate(e, values);
  return values;
}

/** "¿Cuántas bolsas hay?" con 2 bolsas de 2 no distingue grupos de contenido: si la respuesta es un parámetro, los dos difieren. */
function distinguishable(c: MathChallenge, values: Record<string, number>): boolean {
  const [a, b] = firstTwo(c);
  const asksForOne = /^\s*[A-Za-z_][A-Za-z0-9_]*\s*$/.test(c.generator.answerExpression);
  return !asksForOne || b === undefined || values[a] !== values[b];
}

function valid(c: MathChallenge, values: Record<string, number>): boolean {
  const constraints = (c.generator.constraints as string[] | undefined) ?? [];
  try {
    return constraints.every((k) => satisfies(k, values)) && distinguishable(c, values) && Number.isInteger(evaluate(c.generator.answerExpression, values));
  } catch {
    return false;
  }
}

/** El ejemplo resuelto usa otros números y NUNCA llega al mismo resultado que el reto (no regala la respuesta). */
function pickExample(c: MathChallenge, params: Record<string, number>, rand: () => number): Record<string, number> {
  const [a, b] = firstTwo(c);
  const answer = evaluate(c.generator.answerExpression, withDerived(c, params));
  const differentResult = (ex: Record<string, number>) => evaluate(c.generator.answerExpression, withDerived(c, ex)) !== answer;
  const policy = c.generator.workedExamplePolicy as { chooseFirstDifferentPair?: [number, number][] } | undefined;
  for (const [x, y] of policy?.chooseFirstDifferentPair ?? []) {
    const ex = { ...params, [a]: x, [b]: y };
    if ((x !== params[a] || y !== params[b]) && (x !== params[b] || y !== params[a]) && valid(c, withDerived(c, ex)) && differentResult(ex)) return ex;
  }
  for (let i = 0; i < MAX_TRIES; i++) {
    const ex = randomParams(c, rand);
    if ((ex[a] !== params[a] || ex[b] !== params[b]) && valid(c, withDerived(c, ex)) && differentResult(ex)) return ex;
  }
  throw new Error(`${c.id}: no se encontró un ejemplo resuelto distinto`);
}

function randomParams(c: MathChallenge, rand: () => number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, r] of Object.entries(c.generator.parameters)) {
    const lo = Math.max(r.integerMin, MIN_VALUE);
    const hi = Math.max(lo, r.integerMax);
    out[k] = lo + Math.floor(rand() * (hi - lo + 1));
  }
  return out;
}

function fill(template: Localized, vars: Record<string, number>): Localized {
  const one = (s: string) =>
    s.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, n: string) => {
      if (!(n in vars)) throw new Error(`Plantilla sin valor para {${n}}`);
      return String(vars[n]);
    });
  return { es: one(template.es), en: one(template.en) };
}

function representationFor(c: MathChallenge, v: Record<string, number>): MathRepresentation {
  const r = c.representation;
  if (r.component === 'EqualGroups' || r.component === 'TapeDiagram') return { ...r, groups: v.groups ?? r.groups, perGroup: v.perGroup ?? r.perGroup };
  if (r.component === 'PaintGrid') return { ...r, rows: v.rows ?? r.rows, columns: v.columns ?? r.columns };
  return r;
}

/** El reto tal como lo escribió el autor (sus pistas revisadas a mano). */
export function authoredChallenge(c: MathChallenge): GeneratedChallenge {
  const values = withDerived(c, c.generator.sampleParameters);
  return {
    id: `${c.id}#0`,
    challengeId: c.id,
    skillId: c.skillId,
    seed: 0,
    values,
    prompt: c.prompt,
    hints: c.hints,
    answer: c.answer.value,
    answerUnit: c.answerUnit,
    representation: c.representation,
    feedback: c.feedback,
    authored: true,
  };
}

/** Un reto nuevo de la misma plantilla. `seed` 0 devuelve el del autor. */
export function generateChallenge(c: MathChallenge, seed: number): GeneratedChallenge {
  if (seed === 0) return authoredChallenge(c);
  const rand = rng(seed);
  let params: Record<string, number> | null = null;
  for (let i = 0; i < MAX_TRIES && !params; i++) {
    const p = randomParams(c, rand);
    if (valid(c, withDerived(c, p))) params = p;
  }
  if (!params) throw new Error(`${c.id}: la plantilla no produjo un reto válido`);
  const values = withDerived(c, params);
  const example = withDerived(c, pickExample(c, params, rand));
  const vars: Record<string, number> = { ...values };
  for (const [alias, target] of Object.entries(c.generator.semanticBindings ?? {})) vars[alias] = values[target];
  for (const [k, v] of Object.entries(example)) vars[`example${k[0].toUpperCase()}${k.slice(1)}`] = v;
  const t = c.generator.localizedTemplates;
  return {
    id: `${c.id}#${seed}`,
    challengeId: c.id,
    skillId: c.skillId,
    seed,
    values,
    prompt: fill(t.prompt, vars),
    hints: [
      { level: 1, type: 'hint', text: fill(t.hint, vars) },
      { level: 2, type: 'workedExample', text: fill(t.workedExample, vars) },
      { level: 3, type: 'explainedAnswer', text: fill(t.explainedAnswer, vars) },
    ],
    answer: evaluate(c.generator.answerExpression, values),
    answerUnit: c.answerUnit,
    representation: representationFor(c, values),
    feedback: c.feedback,
    authored: false,
  };
}

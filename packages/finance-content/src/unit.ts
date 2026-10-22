/**
 * Unidades de Finanzas (contenido en JSON validado, `validate.ts`). Cada unidad es un grado (1.º–6.º). Todo texto viene en ES y EN, escrito de forma
 * natural en cada idioma. El dinero es SIEMPRE ficticio (UM): nada de $, €, marcas ni precios reales. Los pasos usan los motores puros de este paquete
 * (`ledger`, `plan`, `opportunity`, `offers`); la app solo los dibuja.
 */
import type { EnvelopeKind } from './plan.ts';
import type { Signal, SafeAction } from './offers.ts';
import type { Lang, UM } from './money.ts';

export type Localized = Record<Lang, string>;

export interface Choice {
  id: string;
  text: Localized;
}

/** «Explica tu decisión»: elegir un marco de frase. Nunca se escribe libre en la v1 (DF-7). Una opción no preferida da una pista, no bloquea. */
export interface Explain {
  prompt: Localized;
  choices: Choice[];
  preferredChoiceIds: string[];
}

interface StepBase {
  id: string;
  /** Lección del manual (p. ej. «F4.1»), solo para los padres y para el equipo. */
  lesson: string;
  title: Localized;
  /** «Aprende»: la idea, breve. */
  learn: Localized;
  /** El ejemplo resuelto del manual. */
  example: Localized;
  prompt: Localized;
  explain: Explain;
}

export interface Condition {
  /** Clave de la condición: `outdoor` o `hasCover`. */
  id: 'outdoor' | 'hasCover';
  on: Localized;
  off: Localized;
}

export interface PriorityItem {
  id: string;
  label: Localized;
  cost: UM;
  /** Cuándo es NECESARIO: todas estas condiciones deben coincidir. Sin esto, siempre es opcional (puede esperar). */
  neededWhen?: Partial<Record<'outdoor' | 'hasCover', boolean>>;
}

export interface PrioritiesStep extends StepBase {
  kind: 'priorities';
  budget: UM;
  conditions: Condition[];
  items: PriorityItem[];
}

export interface AlternativesStep extends StepBase {
  kind: 'alternatives';
  budget: UM;
  options: { id: string; label: Localized; cost: UM }[];
  tapNotFit: Localized;
  preferPrompt: Localized;
  leftPrompt: Localized;
  leftoverPrompt: Localized;
  /** Opciones de «¿qué pasa con lo que sobra?»: `remain` es la preferida. */
  leftoverChoices: Choice[];
}

export interface LedgerCase {
  start: UM;
  movements: { id: string; concept: Localized; kind: 'in' | 'out'; amount: UM }[];
  /** Una compra que NO se anotó (para la pregunta «¿el saldo anotado queda por encima o por debajo?»). */
  missing?: { concept: Localized; amount: UM };
}

export interface LedgerStep extends StepBase {
  kind: 'ledger';
  cases: LedgerCase[];
  balancePrompt: Localized;
  missingPrompt: Localized;
  missingChoices: Choice[];
}

export interface ReserveStep extends StepBase {
  kind: 'reserve';
  plan: { budget: UM; envelopes: { id: string; label: Localized; kind: EnvelopeKind; amount: UM; cost?: UM }[] };
  smallUnexpected: UM;
  bigUnexpected: UM;
  unexpectedLabel: Localized;
  adjustPrompt: Localized;
  adjustChoices: Choice[];
  rebuildPrompt: Localized;
  rebuildChoices: Choice[];
}

export interface OfferMessage {
  id: string;
  text: Localized;
  signals: Signal[];
  /** Acciones que valen ante este mensaje. */
  preferredActions: (SafeAction | 'reply')[];
}

export interface OfferStep extends StepBase {
  kind: 'offer';
  messages: OfferMessage[];
  signalLabels: Record<Signal, Localized>;
  actionLabels: Record<SafeAction | 'reply', Localized>;
  signalsPrompt: Localized;
  actionPrompt: Localized;
}

export interface ProjectStep extends StepBase {
  kind: 'project';
  plan: { budget: UM; envelopes: { id: string; label: Localized; kind: EnvelopeKind; amount: UM; cost?: UM }[] };
  unexpected: { id: string; label: Localized; cost: UM };
  /** De cuánto en cuánto se mueve dinero entre sobres. */
  step: UM;
  comparePrompt: Localized;
}

export type FinanceStep = PrioritiesStep | AlternativesStep | LedgerStep | ReserveStep | OfferStep | ProjectStep;

export interface FinanceUnit {
  id: string;
  grade: number;
  /** Referencia temática (borrador; solo la ven los padres): áreas de los estándares de educación financiera. */
  strands: string[];
  title: Localized;
  blurb: Localized;
  steps: FinanceStep[];
}

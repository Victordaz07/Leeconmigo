/**
 * Una unidad de Finanzas de principio a fin (lógica pura; la app solo la dibuja). El dominio devuelve CLAVES, nunca texto (PATRON-MATEMATICAS §2 paso 5).
 * Nunca «incorrecto» (docs/06): elegir una opción no preferida da una pista suave y se puede cambiar; solo FALTA algo (no «está mal») bloquea el paso.
 * Los plazos y la velocidad no cuentan. Las estrellas son por esfuerzo (D11): terminar, AJUSTAR el plan y reflexionar; nunca por tener más dinero.
 */
import { opportunityCost, viableOptions } from './opportunity.ts';
import { checkOffer, SIGNALS, type Signal } from './offers.ts';
import { finalBalance, notedVsReal, runLedger, type LedgerRow, type Movement } from './ledger.ts';
import { isValidPlan, moveBetween, payUnexpected, type Plan } from './plan.ts';
import type { AlternativesStep, FinanceStep, FinanceUnit, LedgerCase, LedgerStep, Localized, OfferStep, PrioritiesStep, ProjectStep, ReserveStep } from './unit.ts';

export type ConditionState = { outdoor: boolean; hasCover: boolean };
const condKey = (c: ConditionState) => `${c.outdoor ? 'out' : 'in'}-${c.hasCover ? 'cover' : 'nocover'}`;

export interface SessionState {
  stepIndex: number;
  stepsDone: string[];
  /** Marco de frase elegido en «Explica tu decisión», por paso. */
  explain: Record<string, string>;
  /** El niño pidió ayuda de un adulto en algún momento (no cambia nada; el botón siempre está). */
  helpAsked: boolean;
  priorities: { cond: ConditionState; picks: Record<string, string> };
  alternatives: { notFit: string[]; first?: string; second?: string; left?: string; leftover?: string };
  ledger: { balance?: number; missing?: string };
  reserve: { paidSmall: boolean; paidBig: boolean; adjust?: string; rebuild?: string };
  offer: { marks: Record<string, Signal[]>; actions: Record<string, string> };
  /** Cantidad por sobre del plan del proyecto (incluye el sobre del gasto nuevo). `undefined` hasta que se abre el paso. */
  project: { amounts?: Record<string, number>; moved: number };
}

export const initialSession: SessionState = {
  stepIndex: 0,
  stepsDone: [],
  explain: {},
  helpAsked: false,
  priorities: { cond: { outdoor: true, hasCover: false }, picks: {} },
  alternatives: { notFit: [] },
  ledger: {},
  reserve: { paidSmall: false, paidBig: false },
  offer: { marks: {}, actions: {} },
  project: { moved: 0 },
};

export type SessionAction =
  | { type: 'priorities.condition'; id: 'outdoor' | 'hasCover'; value: boolean }
  | { type: 'priorities.pick'; itemId: string }
  | { type: 'alternatives.toggleNotFit'; id: string }
  | { type: 'alternatives.prefer'; id: string }
  | { type: 'alternatives.resetPrefer' }
  | { type: 'alternatives.left'; id: string }
  | { type: 'alternatives.leftover'; id: string }
  | { type: 'ledger.balance'; value: number }
  | { type: 'ledger.missing'; id: string }
  | { type: 'reserve.paySmall' }
  | { type: 'reserve.payBig' }
  | { type: 'reserve.adjust'; id: string }
  | { type: 'reserve.rebuild'; id: string }
  | { type: 'offer.toggleSignal'; messageId: string; signal: Signal }
  | { type: 'offer.action'; messageId: string; action: string }
  | { type: 'project.move'; step: ProjectStep; from: string; to: string }
  | { type: 'project.reset' }
  | { type: 'explain'; stepId: string; choiceId: string }
  | { type: 'help' }
  | { type: 'next'; unit: FinanceUnit }
  | { type: 'back' };

// ---------------------------------------------------------------------------------------------
// Vistas derivadas (lo que la pantalla necesita, calculado con los motores puros)
// ---------------------------------------------------------------------------------------------

/** ¿Qué hace falta de verdad en esta situación? (F4.1) */
export function neededItems(step: PrioritiesStep, cond: ConditionState): string[] {
  return step.items.filter((i) => i.neededWhen && Object.entries(i.neededWhen).every(([k, v]) => cond[k as 'outdoor' | 'hasCover'] === v)).map((i) => i.id);
}

export interface PriorityResult {
  needed: string[];
  /** Lo elegido es lo necesario (o, si no hacía falta nada, cualquier cosa vale). */
  fine: boolean;
  /** Lo que sobra al pagar lo elegido (si no alcanza, 0). */
  leftover: number;
  affordable: boolean;
}
export function priorityResult(step: PrioritiesStep, cond: ConditionState, pickedId: string): PriorityResult {
  const needed = neededItems(step, cond);
  const picked = step.items.find((i) => i.id === pickedId);
  const affordable = !!picked && picked.cost <= step.budget;
  return { needed, fine: needed.length === 0 || needed.includes(pickedId), leftover: picked && affordable ? step.budget - picked.cost : step.budget, affordable };
}

/** Las que caben y las que no (F4.2). */
export function alternativesView(step: AlternativesStep, s: SessionState) {
  const options = step.options.map((o) => ({ id: o.id, label: o.label, cost: o.cost }));
  const viable = viableOptions(step.budget, options);
  const notViable = options.filter((o) => o.cost > step.budget);
  const markedRight = notViable.length === s.alternatives.notFit.length && notViable.every((o) => s.alternatives.notFit.includes(o.id));
  const pref = [s.alternatives.first, s.alternatives.second].filter((x): x is string => !!x);
  const result = s.alternatives.first ? opportunityCost(step.budget, options, pref, s.alternatives.first) : undefined;
  return { viable, notViable, markedRight, result };
}

export interface BalanceChoice {
  value: number;
  kind: 'right' | 'forgotLast' | 'signError' | 'ignoredIncome';
}
/** Opciones del saldo final con errores típicos, en orden creciente (el orden no delata la correcta). */
export function balanceChoices(c: LedgerCase): BalanceChoice[] {
  const movements: Movement[] = c.movements.map((m) => ({ id: m.id, concept: m.id, kind: m.kind, amount: m.amount }));
  const right = finalBalance(c.start, movements);
  const last = movements.at(-1);
  const candidates: BalanceChoice[] = [
    { value: right, kind: 'right' },
    { value: last ? right + (last.kind === 'out' ? last.amount : -last.amount) : right + 1, kind: 'forgotLast' },
    { value: c.start + movements.reduce((a, m) => a + m.amount, 0), kind: 'signError' },
    { value: c.start - movements.filter((m) => m.kind === 'out').reduce((a, m) => a + m.amount, 0), kind: 'ignoredIncome' },
  ];
  const seen = new Set<number>();
  const out = candidates.filter((x) => x.value >= 0 && !seen.has(x.value) && (seen.add(x.value), true));
  return out.sort((a, b) => a.value - b.value);
}

export function ledgerView(step: LedgerStep, caseIndex = 0): { rows: LedgerRow[]; final: number; choices: BalanceChoice[]; missingDirection?: 'above' | 'below' | 'equal' } {
  const c = step.cases[caseIndex]!;
  const movements: Movement[] = c.movements.map((m) => ({ id: m.id, concept: m.id, kind: m.kind, amount: m.amount }));
  const rows = runLedger(c.start, movements);
  const missing = c.missing ? notedVsReal(c.start, movements, { id: 'missing', concept: 'missing', kind: 'out', amount: c.missing.amount }) : undefined;
  return { rows, final: finalBalance(c.start, movements), choices: balanceChoices(c), missingDirection: missing?.direction };
}

const reservePlan = (step: ReserveStep): Plan<Localized> => ({ budget: step.plan.budget, envelopes: step.plan.envelopes.map((e) => ({ ...e })) });
/** El plan del paso de reserva después de pagar el imprevisto pequeño y, por separado, lo que pasa con el grande. */
export function reserveView(step: ReserveStep) {
  const base = reservePlan(step);
  const small = payUnexpected(base, step.smallUnexpected);
  const big = payUnexpected(base, step.bigUnexpected);
  return { base, small, big };
}

/** El plan del proyecto con el sobre del gasto nuevo (en 0 al principio) y las cantidades que lleva el niño. */
export function projectPlan(step: ProjectStep, s: SessionState): Plan<Localized> {
  const amounts = s.project.amounts;
  const envelopes = [...step.plan.envelopes.map((e) => ({ ...e })), { id: step.unexpected.id, label: step.unexpected.label, kind: 'essential' as const, amount: 0, cost: step.unexpected.cost }];
  return { budget: step.plan.budget, envelopes: envelopes.map((e) => ({ ...e, amount: amounts?.[e.id] ?? e.amount })) };
}
export const projectDone = (step: ProjectStep, s: SessionState): boolean => isValidPlan(projectPlan(step, s));

export function offerView(step: OfferStep, s: SessionState, messageId: string) {
  const m = step.messages.find((x) => x.id === messageId)!;
  const marked = s.offer.marks[messageId] ?? [];
  return { check: checkOffer({ id: m.id, signals: m.signals }, marked), action: s.offer.actions[messageId] };
}

// ---------------------------------------------------------------------------------------------
// Reductor
// ---------------------------------------------------------------------------------------------

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  switch (a.type) {
    case 'priorities.condition': {
      const cond = { ...s.priorities.cond, [a.id]: a.value };
      return { ...s, priorities: { ...s.priorities, cond } };
    }
    case 'priorities.pick':
      return { ...s, priorities: { ...s.priorities, picks: { ...s.priorities.picks, [condKey(s.priorities.cond)]: a.itemId } } };
    case 'alternatives.toggleNotFit': {
      const has = s.alternatives.notFit.includes(a.id);
      return { ...s, alternatives: { ...s.alternatives, notFit: has ? s.alternatives.notFit.filter((x) => x !== a.id) : [...s.alternatives.notFit, a.id] } };
    }
    case 'alternatives.prefer': {
      const alt = s.alternatives;
      if (alt.first === a.id || alt.second === a.id) return s;
      return { ...s, alternatives: alt.first ? { ...alt, second: a.id } : { ...alt, first: a.id } };
    }
    case 'alternatives.resetPrefer':
      return { ...s, alternatives: { ...s.alternatives, first: undefined, second: undefined, left: undefined } };
    case 'alternatives.left':
      return { ...s, alternatives: { ...s.alternatives, left: a.id } };
    case 'alternatives.leftover':
      return { ...s, alternatives: { ...s.alternatives, leftover: a.id } };
    case 'ledger.balance':
      return { ...s, ledger: { ...s.ledger, balance: a.value } };
    case 'ledger.missing':
      return { ...s, ledger: { ...s.ledger, missing: a.id } };
    case 'reserve.paySmall':
      return { ...s, reserve: { ...s.reserve, paidSmall: true } };
    case 'reserve.payBig':
      return { ...s, reserve: { ...s.reserve, paidBig: true } };
    case 'reserve.adjust':
      return { ...s, reserve: { ...s.reserve, adjust: a.id } };
    case 'reserve.rebuild':
      return { ...s, reserve: { ...s.reserve, rebuild: a.id } };
    case 'offer.toggleSignal': {
      const cur = s.offer.marks[a.messageId] ?? [];
      if (!SIGNALS.includes(a.signal)) return s;
      const next = cur.includes(a.signal) ? cur.filter((x) => x !== a.signal) : [...cur, a.signal];
      return { ...s, offer: { ...s.offer, marks: { ...s.offer.marks, [a.messageId]: next } } };
    }
    case 'offer.action':
      return { ...s, offer: { ...s.offer, actions: { ...s.offer.actions, [a.messageId]: a.action } } };
    case 'project.move': {
      const plan = projectPlan(a.step, s);
      const moved = moveBetween(plan, a.from, a.to, a.step.step);
      if (moved === plan) return s;
      return { ...s, project: { amounts: Object.fromEntries(moved.envelopes.map((e) => [e.id, e.amount])), moved: s.project.moved + 1 } };
    }
    case 'project.reset':
      return { ...s, project: { amounts: undefined, moved: s.project.moved } };
    case 'explain':
      return { ...s, explain: { ...s.explain, [a.stepId]: a.choiceId } };
    case 'help':
      return { ...s, helpAsked: true };
    case 'next': {
      const step = a.unit.steps[s.stepIndex];
      if (!step || !canAdvance(step, s)) return s;
      const done = s.stepsDone.includes(step.id) ? s.stepsDone : [...s.stepsDone, step.id];
      return { ...s, stepIndex: Math.min(s.stepIndex + 1, a.unit.steps.length - 1), stepsDone: done };
    }
    case 'back':
      return { ...s, stepIndex: Math.max(0, s.stepIndex - 1) };
  }
}

/** Si el paso ya tiene lo necesario para pasar (nunca bloquea por «estar mal», solo porque FALTA algo). */
export function canAdvance(step: FinanceStep, s: SessionState): boolean {
  if (s.explain[step.id] === undefined) return false;
  switch (step.kind) {
    case 'priorities':
      return Object.keys(s.priorities.picks).length >= 2;
    case 'alternatives': {
      const a = s.alternatives;
      return a.notFit.length > 0 && !!a.first && !!a.second && a.left !== undefined && a.leftover !== undefined;
    }
    case 'ledger':
      return s.ledger.balance !== undefined && s.ledger.missing !== undefined;
    case 'reserve':
      return s.reserve.paidSmall && s.reserve.paidBig && s.reserve.adjust !== undefined && s.reserve.rebuild !== undefined;
    case 'offer':
      return step.messages.every((m) => s.offer.actions[m.id] !== undefined);
    case 'project':
      return projectDone(step, s);
  }
}

export type FeedbackKind = 'affirm' | 'gentle';
export const feedbackFor = (preferred: readonly string[], chosen: string | undefined): FeedbackKind | undefined => (chosen === undefined ? undefined : preferred.includes(chosen) ? 'affirm' : 'gentle');

// ---------------------------------------------------------------------------------------------
// Evaluación y estrellas por esfuerzo (D11)
// ---------------------------------------------------------------------------------------------

export interface SessionEvaluation {
  /** Terminó todos los pasos. */
  completed: boolean;
  /** AJUSTÓ el plan ante el imprevisto: movió dinero entre sobres y el plan quedó válido. */
  adjusted: boolean;
  /** Explicó con el marco de frase preferido en al menos 4 de los 6 pasos. */
  explained: boolean;
}

export function evaluateSession(unit: FinanceUnit, s: SessionState): SessionEvaluation {
  const project = unit.steps.find((x): x is ProjectStep => x.kind === 'project');
  const preferred = unit.steps.filter((st) => st.explain.preferredChoiceIds.includes(s.explain[st.id] ?? '')).length;
  return {
    completed: unit.steps.every((st) => s.stepsDone.includes(st.id)),
    adjusted: !!project && s.project.moved > 0 && projectDone(project, s),
    explained: preferred >= Math.min(4, unit.steps.length),
  };
}

/** Estrellas del cierre: nunca por tener más dinero ni por rapidez (D11). */
export function unitStars(ev: SessionEvaluation): 0 | 1 | 2 | 3 {
  if (!ev.completed) return 0;
  return (1 + (ev.adjusted ? 1 : 0) + (ev.explained ? 1 : 0)) as 1 | 2 | 3;
}

export type ReasonKey = 'adjustedAndExplained' | 'adjusted' | 'explained' | 'completed';
export function reasonKey(ev: SessionEvaluation): ReasonKey {
  if (ev.adjusted && ev.explained) return 'adjustedAndExplained';
  if (ev.adjusted) return 'adjusted';
  if (ev.explained) return 'explained';
  return 'completed';
}

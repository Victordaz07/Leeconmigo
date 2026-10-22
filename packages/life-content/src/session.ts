/**
 * Una misión de principio a fin (lógica pura; la app solo la dibuja). Nunca «incorrecto» (docs/06): lo que no encaja da una pista y se puede cambiar; solo FALTA
 * algo (no «está mal») bloquea el paso. Estrellas por esfuerzo (D11): terminar, comparar caminos y explicar la decisión; nunca por rapidez.
 */
import type { ChooseStep, LifeMission, LifeStep, SortStep, SpotStep } from './types.ts';

export interface SessionState {
  stepIndex: number;
  stepsDone: string[];
  /** Marco de frase elegido en «Explica tu decisión», por paso. */
  explain: Record<string, string>;
  helpAsked: boolean;
  /** `tried`: caminos que ya miró (sin repetir); `picked`: el último que tocó. */
  choose: Record<string, { tried: string[]; picked?: string }>;
  /** Ids colocados en orden (de arriba abajo). */
  sort: Record<string, string[]>;
  /** Ids marcados como señal. */
  spot: Record<string, string[]>;
}

export const initialSession: SessionState = { stepIndex: 0, stepsDone: [], explain: {}, helpAsked: false, choose: {}, sort: {}, spot: {} };

export type SessionAction =
  | { type: 'choose.pick'; stepId: string; optionId: string }
  | { type: 'sort.place'; stepId: string; itemId: string }
  | { type: 'sort.remove'; stepId: string; itemId: string }
  | { type: 'sort.reset'; stepId: string }
  | { type: 'spot.toggle'; stepId: string; itemId: string }
  | { type: 'explain'; stepId: string; choiceId: string }
  | { type: 'help' }
  | { type: 'next'; mission: LifeMission }
  | { type: 'back' };

// ---------------------------------------------------------------------------------------------
// Vistas derivadas
// ---------------------------------------------------------------------------------------------

/** El orden en que la app MUESTRA las tarjetas a ordenar: nunca el correcto (siempre hay al menos 2). */
export function sortDisplayOrder(step: SortStep) {
  const n = step.items.length;
  const k = n >= 4 ? 2 : 1;
  return [...step.items.slice(k), ...step.items.slice(0, k)];
}

export type SortStatus = 'building' | 'wrong' | 'solved';
export function sortStatus(step: SortStep, placed: readonly string[]): SortStatus {
  if (placed.length < step.items.length) return 'building';
  return step.items.every((it, i) => placed[i] === it.id) ? 'solved' : 'wrong';
}

export interface SpotCheck {
  /** Marcó una señal que SÍ es. */
  found: string[];
  /** Marcó algo que no es una señal (se le invita a mirar otra vez, sin «incorrecto»). */
  extra: string[];
  /** Hay una señal que no marcó. */
  missed: string[];
  exact: boolean;
}
export function spotCheck(step: SpotStep, marked: readonly string[]): SpotCheck {
  const signs = step.items.filter((i) => i.sign).map((i) => i.id);
  const found = signs.filter((id) => marked.includes(id));
  const extra = marked.filter((id) => !signs.includes(id));
  const missed = signs.filter((id) => !marked.includes(id));
  return { found, extra, missed, exact: extra.length === 0 && missed.length === 0 };
}

export type FeedbackKind = 'affirm' | 'gentle';
export const chooseFeedback = (step: ChooseStep, optionId: string | undefined): FeedbackKind | undefined => {
  if (optionId === undefined) return undefined;
  return step.options.find((o) => o.id === optionId)?.preferred ? 'affirm' : 'gentle';
};
export const explainFeedback = (preferred: readonly string[], chosen: string | undefined): FeedbackKind | undefined => (chosen === undefined ? undefined : preferred.includes(chosen) ? 'affirm' : 'gentle');

/** Cuántos caminos tiene que mirar antes de seguir (nunca más de los que hay). */
export const triedNeeded = (step: ChooseStep): number => Math.min(step.minTried, step.options.length);

// ---------------------------------------------------------------------------------------------
// Reductor
// ---------------------------------------------------------------------------------------------

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  switch (a.type) {
    case 'choose.pick': {
      const cur = s.choose[a.stepId] ?? { tried: [] };
      const tried = cur.tried.includes(a.optionId) ? cur.tried : [...cur.tried, a.optionId];
      return { ...s, choose: { ...s.choose, [a.stepId]: { tried, picked: a.optionId } } };
    }
    case 'sort.place': {
      const cur = s.sort[a.stepId] ?? [];
      if (cur.includes(a.itemId)) return s;
      return { ...s, sort: { ...s.sort, [a.stepId]: [...cur, a.itemId] } };
    }
    case 'sort.remove':
      return { ...s, sort: { ...s.sort, [a.stepId]: (s.sort[a.stepId] ?? []).filter((x) => x !== a.itemId) } };
    case 'sort.reset':
      return { ...s, sort: { ...s.sort, [a.stepId]: [] } };
    case 'spot.toggle': {
      const cur = s.spot[a.stepId] ?? [];
      const next = cur.includes(a.itemId) ? cur.filter((x) => x !== a.itemId) : [...cur, a.itemId];
      return { ...s, spot: { ...s.spot, [a.stepId]: next } };
    }
    case 'explain':
      return { ...s, explain: { ...s.explain, [a.stepId]: a.choiceId } };
    case 'help':
      return { ...s, helpAsked: true };
    case 'next': {
      const step = a.mission.steps[s.stepIndex];
      if (!step || !canAdvance(step, s)) return s;
      const done = s.stepsDone.includes(step.id) ? s.stepsDone : [...s.stepsDone, step.id];
      return { ...s, stepIndex: Math.min(s.stepIndex + 1, a.mission.steps.length - 1), stepsDone: done };
    }
    case 'back':
      return { ...s, stepIndex: Math.max(0, s.stepIndex - 1) };
  }
}

/** Lo propio del paso (sin contar «Explica»): qué le FALTA todavía. */
export function stepReady(step: LifeStep, s: SessionState): boolean {
  switch (step.kind) {
    case 'choose':
      return (s.choose[step.id]?.tried.length ?? 0) >= triedNeeded(step);
    case 'sort':
      return sortStatus(step, s.sort[step.id] ?? []) === 'solved';
    case 'spot':
      return !step.items.some((i) => i.sign) || (s.spot[step.id]?.length ?? 0) > 0;
  }
}

/** Nunca bloquea por «estar mal», solo porque FALTA algo. */
export const canAdvance = (step: LifeStep, s: SessionState): boolean => s.explain[step.id] !== undefined && stepReady(step, s);

export type MissingKey = 'explain' | LifeStep['kind'];
export const missingKey = (step: LifeStep, s: SessionState): MissingKey => (stepReady(step, s) && s.explain[step.id] === undefined ? 'explain' : step.kind);

// ---------------------------------------------------------------------------------------------
// Evaluación y estrellas por esfuerzo (D11)
// ---------------------------------------------------------------------------------------------

export interface SessionEvaluation {
  completed: boolean;
  /** COMPARÓ caminos: en algún encuentro de elegir miró al menos tres (o todos, si había menos). */
  explored: boolean;
  /** Explicó con el marco preferido en al menos dos encuentros. */
  explained: boolean;
}

export function evaluateSession(mission: LifeMission, s: SessionState): SessionEvaluation {
  const preferred = mission.steps.filter((st) => st.explain.preferredChoiceIds.includes(s.explain[st.id] ?? '')).length;
  return {
    completed: mission.steps.every((st) => s.stepsDone.includes(st.id)),
    explored: mission.steps.some((st) => st.kind === 'choose' && (s.choose[st.id]?.tried.length ?? 0) >= Math.min(3, st.options.length)),
    explained: preferred >= Math.min(2, mission.steps.length),
  };
}

/** Estrellas del cierre: nunca por rapidez ni por «acertar» (D11). */
export function missionStars(ev: SessionEvaluation): 0 | 1 | 2 | 3 {
  if (!ev.completed) return 0;
  return (1 + (ev.explored ? 1 : 0) + (ev.explained ? 1 : 0)) as 1 | 2 | 3;
}

export type ReasonKey = 'exploredAndExplained' | 'explored' | 'explained' | 'completed';
export function reasonKey(ev: SessionEvaluation): ReasonKey {
  if (ev.explored && ev.explained) return 'exploredAndExplained';
  if (ev.explored) return 'explored';
  if (ev.explained) return 'explained';
  return 'completed';
}

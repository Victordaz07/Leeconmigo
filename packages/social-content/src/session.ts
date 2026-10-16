/**
 * Una investigación de Sociedad de principio a fin (lógica pura; la app solo la dibuja). 6 pasos fijos
 * (`docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md` §"Las 6 sesiones"): pregunta → comparar → fuente → testimonio →
 * explicar → revisar.
 *
 * Nunca "incorrecto" (docs/06): elegir una opción no preferida da una pista suave (`feedbackFor`), nunca bloquea
 * seguir adelante. El dominio devuelve CLAVES, nunca texto (docs/design/subjects/PATRON-MATEMATICAS.md §2 paso 5);
 * `@lee-conmigo/ui-core` las vuelve frases ES/EN.
 */
import type { SocialStep, SocialUnit } from '@lee-conmigo/contracts';

export interface SessionState {
  stepIndex: number;
  /** Para pasos "comparar": clasificación elegida por el niño para cada afirmación. */
  statementAnswers: Record<string, 'igual' | 'nuevo'>;
  /** Para pasos "fuente"/"testimonio": opción elegida, por id de paso. */
  choiceAnswers: Record<string, string>;
  /** Para el paso "explicar": fuentes que el niño marcó que usaría. */
  sourcesSelected: string[];
  /** Para el paso "revisar": opción elegida. */
  gapChoice?: string;
  /** Pasos ya completados (para el progreso del cuaderno). */
  stepsDone: string[];
}

export const initialSession: SessionState = { stepIndex: 0, statementAnswers: {}, choiceAnswers: {}, sourcesSelected: [], stepsDone: [] };

export type SessionAction =
  | { type: 'classify'; statementId: string; status: 'igual' | 'nuevo' }
  | { type: 'choose'; stepId: string; choiceId: string }
  | { type: 'toggleSource'; sourceId: string }
  | { type: 'pickGap'; choiceId: string }
  | { type: 'next'; unit: SocialUnit }
  | { type: 'back' };

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  switch (a.type) {
    case 'classify':
      return { ...s, statementAnswers: { ...s.statementAnswers, [a.statementId]: a.status } };
    case 'choose':
      return { ...s, choiceAnswers: { ...s.choiceAnswers, [a.stepId]: a.choiceId } };
    case 'toggleSource': {
      const has = s.sourcesSelected.includes(a.sourceId);
      return { ...s, sourcesSelected: has ? s.sourcesSelected.filter((id) => id !== a.sourceId) : [...s.sourcesSelected, a.sourceId] };
    }
    case 'pickGap':
      return { ...s, gapChoice: a.choiceId };
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

/** Si el paso actual ya tiene lo necesario para pasar al siguiente (nunca bloquea por "estar mal", solo por "falta"). */
export function canAdvance(step: SocialStep, s: SessionState): boolean {
  switch (step.kind) {
    case 'pregunta':
      return true;
    case 'comparar':
      return step.statements.every((st) => s.statementAnswers[st.id] !== undefined);
    case 'fuente':
    case 'testimonio':
    case 'elegir':
      return s.choiceAnswers[step.id] !== undefined;
    case 'explicar':
      return s.sourcesSelected.length >= step.minSources;
    case 'revisar':
      return s.gapChoice !== undefined;
  }
}

export type FeedbackKind = 'affirm' | 'gentle';

/** Clave de retroalimentación para un paso de opción (nunca "incorrecto"; solo afirma o invita a mirar otra vez). */
export function feedbackFor(step: Extract<SocialStep, { kind: 'fuente' | 'testimonio' | 'elegir' }>, s: SessionState): FeedbackKind | undefined {
  const chosen = s.choiceAnswers[step.id];
  if (chosen === undefined) return undefined;
  return step.preferredChoiceIds.includes(chosen) ? 'affirm' : 'gentle';
}

export interface SessionEvaluation {
  /** Paso "explicar" con al menos `minSources` fuentes marcadas (docs/research §12: usar ≥2 fuentes). */
  sourcesUsedEnough: boolean;
  /** Paso "revisar": eligió el hueco real, no algo que las fuentes ya contaban. */
  gapIdentified: boolean;
  completed: boolean;
}

/** Qué tan seguido, entre los pasos de elección (fuente/testimonio/elegir), el niño quedó con una opción
 * preferida (no "correcta": las no preferidas solo dieron una pista y se pudieron cambiar). Sirve como segunda
 * medida de esfuerzo en unidades SIN fuentes (p. ej. S1-U01, puro razonamiento cívico), donde no hay "explicar"
 * ni "revisar" que medir. */
function choiceQuality(unit: SocialUnit, s: SessionState): number {
  const choiceSteps = unit.steps.filter((st): st is Extract<SocialStep, { kind: 'fuente' | 'testimonio' | 'elegir' }> => st.kind === 'fuente' || st.kind === 'testimonio' || st.kind === 'elegir');
  if (choiceSteps.length === 0) return 1;
  const preferred = choiceSteps.filter((st) => st.preferredChoiceIds.includes(s.choiceAnswers[st.id] ?? '')).length;
  return preferred / choiceSteps.length;
}

export function evaluateSession(unit: SocialUnit, s: SessionState): SessionEvaluation {
  const explicar = unit.steps.find((st): st is Extract<SocialStep, { kind: 'explicar' }> => st.kind === 'explicar');
  const revisar = unit.steps.find((st): st is Extract<SocialStep, { kind: 'revisar' }> => st.kind === 'revisar');
  const hasSources = unit.sources.length > 0;
  const quality = choiceQuality(unit, s);
  return {
    sourcesUsedEnough: hasSources ? !!explicar && s.sourcesSelected.length >= explicar.minSources : quality >= 0.5,
    gapIdentified: hasSources ? !!revisar && s.gapChoice === revisar.gapChoiceId : quality === 1,
    completed: unit.steps.every((st) => s.stepsDone.includes(st.id)),
  };
}

/** Estrellas del cierre POR ESFUERZO (D11), igual principio que `effortStars` de ui-core pero propio de Sociedad:
 * usar las fuentes de verdad importa más que "adivinar" una respuesta. */
export function investigationStars(ev: SessionEvaluation): 0 | 1 | 2 | 3 {
  if (!ev.completed) return 0;
  return (1 + (ev.sourcesUsedEnough ? 1 : 0) + (ev.gapIdentified ? 1 : 0)) as 1 | 2 | 3;
}

/** Clave de la razón (nunca texto: `@lee-conmigo/ui-core` la vuelve frase ES/EN). */
export type InvestigationReasonKey = 'sourcesAndGap' | 'sources' | 'gap' | 'completed';

export function investigationReasonKey(ev: SessionEvaluation): InvestigationReasonKey {
  if (ev.sourcesUsedEnough && ev.gapIdentified) return 'sourcesAndGap';
  if (ev.sourcesUsedEnough) return 'sources';
  if (ev.gapIdentified) return 'gap';
  return 'completed';
}

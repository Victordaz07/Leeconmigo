/**
 * Contenido y lógica pura de Sociedad (sin React ni nada nativo). Sigue el patrón de `@lee-conmigo/math-content`
 * (docs/design/subjects/PATRON-MATEMATICAS.md): unidades en JSON validadas, dominio puro por sesión, sin generador
 * aleatorio (esta unidad es una investigación guiada, no retos infinitos). Lo edita SOLO la cuenta de Sociedad
 * (docs/14-MATERIAS-EN-PARALELO.md).
 */
export const SUBJECT_ID = 'sociedad' as const;

export { SOCIAL_UNITS, socialUnitById } from './units.ts';
export { validateSocialUnit } from './validate.ts';
export {
  canAdvance,
  evaluateSession,
  feedbackFor,
  initialSession,
  investigationReasonKey,
  investigationStars,
  sessionReducer,
} from './session.ts';
export type { FeedbackKind, InvestigationReasonKey, SessionAction, SessionEvaluation, SessionState } from './session.ts';

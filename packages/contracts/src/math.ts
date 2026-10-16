/**
 * Contenido del cuaderno de Matemáticas (Kitewise, docs/13 K6; diseño en `docs/research/matematicas-investigacion.md`
 * §8). Aditivo a los contratos de lectura: nada aquí cambia una historia.
 *
 * Reglas que el contenido respeta (y valida `@lee-conmigo/math-content`):
 * - `grade` es la referencia curricular; el nivel de práctica lo elige la familia (docs/01: el nivel NO es el grado).
 * - Todo texto viene en los dos idiomas, escrito de forma natural en cada uno (no traducido palabra por palabra).
 * - Los números que deciden una respuesta los dibuja la app (`representation`); el arte es solo escena, sin texto ni
 *   números (docs/05).
 * - Cada reto tiene exactamente 3 escalones de ayuda: pista → ejemplo resuelto (con OTROS números) → respuesta explicada.
 *   Nunca "incorrecto" ni rojo (docs/06).
 * - Los códigos de estándares son BORRADOR y solo los ven los padres hasta que un docente los valide.
 */

/** Texto en los dos idiomas de la app. */
export interface Localized {
  es: string;
  en: string;
}

export interface MathSkill {
  /** `g3u1.s1`: habilidad 1 de la unidad 1 de 3.º. Los puentes sin grado empiezan con `base.`. */
  id: string;
  title: Localized;
  prerequisites: string[];
}

export interface StandardsReview {
  status: 'draftPendingTeacherReview' | 'teacherValidated';
  confidence: string;
  displayAudience: 'parentsOnly';
  isCertified: boolean;
}

/** Modelo matemático que dibuja la app (números exactos), nunca el arte. */
export type MathRepresentation =
  | { component: 'EqualGroups'; groups: number; perGroup: number; labelsAreLiveText?: boolean }
  | { component: 'PaintGrid'; rows: number; columns: number }
  | { component: 'TapeDiagram'; groups: number; perGroup: number }
  | { component: 'OptionalWorkspace'; initialModel: null };

export type LearnBlock =
  | { type: 'text'; text: Localized; audio?: Localized }
  | { type: 'keyIdea'; text: Localized }
  | { type: 'vocabulary'; items: { term: Localized; definition: Localized }[] }
  | { type: 'annotatedIllustration'; artBrief: string; overlay: MathRepresentation };

export type ExplorePayload =
  | { component: 'DragZone'; groups: number; perGroup: number; task: 'buildEqualGroups'; tapAlternative?: boolean }
  | { component: 'EqualGroups'; groups: number; perGroup: number; task: 'connectModelToEquation'; renderEquationAsLiveText?: boolean }
  | { component: 'PaintGrid'; rows: number; columns: number; task: 'buildArray'; showRowColumnLabelsAsLiveText?: boolean }
  | { component: 'TapeDiagram'; groups: number; perGroup: number; task: 'modelStory'; prompt?: Localized };

export interface HintStep {
  level: 1 | 2 | 3;
  type: 'hint' | 'workedExample' | 'explainedAnswer';
  text: Localized;
  audio?: Localized;
}

/** Rango de un parámetro entero de una plantilla. */
export interface IntegerRange {
  integerMin: number;
  integerMax: number;
}

/**
 * Plantilla para generar más retos del mismo tipo (determinista, con semilla). `answerExpression` y `derived` solo
 * admiten nombres de parámetros, enteros y + − × ÷ con paréntesis: nunca se evalúa texto arbitrario.
 */
export interface ChallengeGenerator {
  templateId: string;
  templateVersion: string;
  parameters: Record<string, IntegerRange>;
  answerExpression: string;
  derived?: Record<string, string>;
  sampleParameters: Record<string, number>;
  /** Otros nombres que usan las plantillas para un parámetro (`{groupCount}` = `groups`). */
  semanticBindings?: Record<string, string>;
  workedExampleMustDiffer?: boolean;
  localizedTemplates: {
    prompt: Localized;
    hint: Localized;
    workedExample: Localized;
    explainedAnswer: Localized;
  };
  [extra: string]: unknown;
}

export type ConfidenceChoice = 'seguro' | 'masOMenos' | 'adivino';

export interface MathChallenge {
  id: string;
  skillId: string;
  /** Misma variante matemática en los dos idiomas: cambiar de idioma no cuenta como evidencia nueva. */
  mathVariantId: string;
  prompt: Localized;
  audio?: Localized;
  answer: { kind: 'numeric'; value: number };
  answerUnit?: Localized;
  hints: HintStep[];
  responseMode: 'numericKeypad';
  confidenceChoices: ConfidenceChoice[];
  attemptPolicy: {
    requireConfidenceBeforeCheck: boolean;
    countOnlyFirstIndependentResponse: boolean;
    accessibilitySupportCountsAsMathHint: boolean;
    maxHintLevel: number;
    allowSkipToReview: boolean;
  };
  feedback: { tryAgain: Localized; success: Localized };
  generator: ChallengeGenerator;
  representation: MathRepresentation;
  standards?: string[];
}

export interface PairsGame {
  pairs: { left: Localized; right: number }[];
  /** Sin reloj, sin premios al azar y siempre se puede salir (D5). */
  timer: false;
  randomRewards: false;
  allowExit: true;
}

export type MathStep =
  | { kind: 'aprender'; blocks: LearnBlock[] }
  | { kind: 'explorar'; interaction: 'paint' | 'drag' | 'slide' | 'circle' | 'sequence'; payload: ExplorePayload }
  | { kind: 'practicar'; challenge: MathChallenge }
  | { kind: 'juego'; game: 'parejas'; payload: PairsGame };

export interface MathLesson {
  id: string;
  unitId: string;
  title: Localized;
  skillIds: string[];
  steps: MathStep[];
  /** "¿Qué te ayudó?" por toque, sin examen extra. */
  closure: { prompt: Localized; choices: Localized[] };
}

export interface MathUnit {
  id: string;
  subject: 'mate';
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  practiceLevel: number;
  schemaVersion: string;
  contentVersion: string;
  title: Localized;
  standards: string[];
  standardsReview: StandardsReview;
  prerequisites: string[];
  skills: MathSkill[];
  cover: { artBrief: string; containsEmbeddedTextOrNumbers: false };
  warmupPolicy: { source: string; maximumItems: { minutes8: number; minutes15: number; minutes20: number } };
  masteryPolicyRef: string;
  representationPolicy: { mathIsRenderedByApp: true; artIsDecorative: true; dragAlternative: 'tapThenTap' };
  provenance: { authorship: string; evidenceReferences: string[]; thirdPartyExerciseCopied: false };
  lessons: MathLesson[];
}

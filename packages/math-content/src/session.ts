/**
 * Una lección de Matemáticas de principio a fin (lógica pura; la app solo la dibuja). Kitewise SPEC §6 y
 * docs/research §6–7:
 *   calentamiento (habilidades que vuelven hoy) → Aprender → Explorar → Practicar → Juego → Cierre.
 * La duración del día (8/15/20 min, B2) cambia cuántos retos extra se practican, nunca el contenido de la lección.
 *
 * Cada reto: el niño escribe con el teclado, elige su confianza ANTES de comprobar, puede abrir la escalera de 3 pistas
 * cuando quiera y puede dejarlo para el repaso ("Lo veo luego"). Nunca "incorrecto": "Revisemos…" y otra oportunidad.
 */
import type { ConfidenceChoice, ExplorePayload, LearnBlock, Localized, MathLesson, MathUnit, PairsGame } from '@lee-conmigo/contracts';
import { generateChallenge, type GeneratedChallenge } from './generate.ts';
import { warmupSize, type MathAttempt } from './mastery.ts';

export type PlanItem =
  | { kind: 'calentar'; challenge: GeneratedChallenge }
  | { kind: 'aprender'; blocks: LearnBlock[] }
  | { kind: 'explorar'; interaction: string; payload: ExplorePayload }
  | { kind: 'practicar'; challenge: GeneratedChallenge }
  | { kind: 'juego'; payload: PairsGame }
  | { kind: 'cierre'; closure: { prompt: Localized; choices: Localized[] } };

export interface PlanOptions {
  /** Minutos de la misión de hoy (8, 15 o 20). */
  minutes: number;
  /** Habilidades que vuelven hoy (de `dueSkills`). */
  dueSkillIds?: string[];
  /** Semilla de la sesión (para variar los retos extra sin perder el determinismo). */
  seed: number;
}

/** Retos EXTRA por cada reto del autor: 8 min = ninguno, 15 = uno, 20 = dos. */
export const extraPerPractice = (minutes: number) => (minutes <= 8 ? 0 : minutes <= 15 ? 1 : 2);

export function buildLessonPlan(unit: MathUnit, lesson: MathLesson, o: PlanOptions): PlanItem[] {
  const plan: PlanItem[] = [];
  const allChallenges = unit.lessons.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'practicar' ? [s.challenge] : [])));
  let n = 1;
  const nextSeed = () => ((o.seed * 7919 + n++ * 104729) % 2_000_000_000) + 1;

  for (const skillId of (o.dueSkillIds ?? []).slice(0, warmupSize(o.minutes))) {
    const c = allChallenges.find((x) => x.skillId === skillId);
    if (c) plan.push({ kind: 'calentar', challenge: generateChallenge(c, nextSeed()) });
  }
  for (const step of lesson.steps) {
    if (step.kind === 'aprender') plan.push({ kind: 'aprender', blocks: step.blocks });
    else if (step.kind === 'explorar') plan.push({ kind: 'explorar', interaction: step.interaction, payload: step.payload });
    else if (step.kind === 'juego') plan.push({ kind: 'juego', payload: step.payload });
    else {
      plan.push({ kind: 'practicar', challenge: generateChallenge(step.challenge, 0) });
      for (let i = 0; i < extraPerPractice(o.minutes); i++) plan.push({ kind: 'practicar', challenge: generateChallenge(step.challenge, nextSeed()) });
    }
  }
  plan.push({ kind: 'cierre', closure: lesson.closure });
  return plan;
}

/** Momento de Kitewise al que pertenece cada paso (para las píldoras Aprender / Explorar / Practicar / Juego). */
export function phaseOf(item: PlanItem): 'aprender' | 'explorar' | 'practicar' | 'juego' | 'cierre' {
  return item.kind === 'calentar' ? 'practicar' : item.kind;
}

// ------------------------------------------------------------------ un reto

export const MAX_DIGITS = 4;

export interface ChallengeState {
  input: string;
  confidence: ConfidenceChoice | null;
  /** Escalón de ayuda abierto (0 = ninguno, 3 = respuesta explicada). */
  hintLevel: 0 | 1 | 2 | 3;
  /** Resultado de la PRIMERA comprobación (null = todavía no comprobó). */
  firstCorrect: boolean | null;
  /** Escalón de ayuda que tenía abierto en la primera comprobación. */
  hintAtFirstCheck: 0 | 1 | 2 | 3;
  solved: boolean;
  skipped: boolean;
  feedback: 'none' | 'needsConfidence' | 'tryAgain' | 'success';
}

export type ChallengeAction =
  | { type: 'key'; digit: string }
  | { type: 'back' }
  | { type: 'confidence'; value: ConfidenceChoice }
  | { type: 'hint' }
  | { type: 'check'; answer: number; requireConfidence: boolean }
  | { type: 'skip' };

export const initialChallenge: ChallengeState = { input: '', confidence: null, hintLevel: 0, firstCorrect: null, hintAtFirstCheck: 0, solved: false, skipped: false, feedback: 'none' };

export function challengeReducer(s: ChallengeState, a: ChallengeAction): ChallengeState {
  if (s.solved || s.skipped) return s;
  switch (a.type) {
    case 'key':
      if (!/^[0-9]$/.test(a.digit) || s.input.length >= MAX_DIGITS || (s.input === '0' && a.digit === '0')) return s;
      return { ...s, input: s.input === '0' ? a.digit : s.input + a.digit, feedback: s.feedback === 'tryAgain' ? 'none' : s.feedback };
    case 'back':
      return { ...s, input: s.input.slice(0, -1) };
    case 'confidence':
      return { ...s, confidence: a.value, feedback: s.feedback === 'needsConfidence' ? 'none' : s.feedback };
    case 'hint':
      return { ...s, hintLevel: Math.min(3, s.hintLevel + 1) as ChallengeState['hintLevel'] };
    case 'check': {
      if (!s.input) return s;
      if (a.requireConfidence && !s.confidence) return { ...s, feedback: 'needsConfidence' };
      const ok = Number(s.input) === a.answer;
      const first = s.firstCorrect === null;
      return {
        ...s,
        firstCorrect: first ? ok : s.firstCorrect,
        hintAtFirstCheck: first ? s.hintLevel : s.hintAtFirstCheck,
        solved: ok,
        feedback: ok ? 'success' : 'tryAgain',
        input: ok ? s.input : s.input,
      };
    }
    case 'skip':
      return { ...s, skipped: true };
  }
}

/** Lo que se guarda de este reto (para dominio y repaso). Solo cuenta una vez que terminó (resuelto o "lo veo luego"). */
export function toAttempt(s: ChallengeState, c: GeneratedChallenge, day: string): MathAttempt | null {
  if (!s.solved && !s.skipped) return null;
  return {
    skillId: c.skillId,
    variantId: c.id,
    day,
    firstCorrect: s.firstCorrect === true,
    maxHintLevel: s.firstCorrect === true ? s.hintAtFirstCheck : s.hintLevel,
    skipped: s.skipped && !s.solved,
    confidence: s.confidence ?? undefined,
    constructed: true,
  };
}

/**
 * Dominio por habilidad y repaso espaciado (docs/research §6; Kitewise SPEC §6). Lógica pura y local: solo datos
 * derivados (habilidad, reto, día, si acertó a la primera, cuánta ayuda usó, confianza). Nunca nombre, voz ni ubicación.
 *
 * El niño solo ve "explorando / practicando / dominado"; nunca porcentajes. Los padres ven el detalle. Los umbrales son la
 * propuesta inicial de la investigación ("independentEvidence10.v1"): se ajustan tras pilotar, sin tocar las lecciones.
 */
import type { ConfidenceChoice } from '@lee-conmigo/contracts';

export type Mastery = 'none' | 'explorando' | 'practicando' | 'dominado';

/** Lo que se guarda de UNA respuesta a un reto. */
export interface MathAttempt {
  skillId: string;
  /** `g3u1.l2.c1#57`: reto + semilla. Repetir el mismo reto no cuenta como evidencia nueva. */
  variantId: string;
  /** Día local `YYYY-MM-DD`. */
  day: string;
  /** ¿La PRIMERA respuesta coincidió? (después de ver ayuda, acertar es práctica acompañada, no evidencia independiente). */
  firstCorrect: boolean;
  /** Mayor escalón de ayuda abierto antes de responder bien (0 = ninguno). El audio NO es ayuda matemática. */
  maxHintLevel: 0 | 1 | 2 | 3;
  /** "Lo veo luego": lo mandó al repaso. */
  skipped?: boolean;
  confidence?: ConfidenceChoice;
  /** Respuesta construida (teclado o modelo), no solo elegir una opción. */
  constructed: boolean;
}

export const MASTERY_POLICY = {
  id: 'independentEvidence10.v1',
  window: 10,
  minCorrect: 8,
  minDays: 3,
  minConstructed: 2,
  /** Aciertos en retos nuevos, demorados respecto del primer éxito (días). */
  delayedChecks: [3, 7],
} as const;

/** Respuesta independiente: a la primera, sin pistas, sin saltarla. */
export const isIndependent = (a: MathAttempt) => a.maxHintLevel === 0 && !a.skipped;

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000);
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export interface SkillStatus {
  mastery: Mastery;
  /** Dominada pero con dos fallos independientes en días distintos después: "vamos a repasarlo" (sin perder el logro). */
  needsReview: boolean;
  /** Para padres: oportunidades independientes y aciertos recientes. */
  recentIndependent: number;
  recentCorrect: number;
}

/** Estado de UNA habilidad a partir de sus respuestas (en orden). */
export function skillStatus(attempts: MathAttempt[]): SkillStatus {
  if (!attempts.length) return { mastery: 'none', needsReview: false, recentIndependent: 0, recentCorrect: 0 };
  // Una sola evidencia por variante: la primera vez que se respondió.
  const seen = new Set<string>();
  const firsts = attempts.filter((a) => (seen.has(a.variantId) ? false : (seen.add(a.variantId), true)));
  const independent = firsts.filter(isIndependent);
  const recent = independent.slice(-MASTERY_POLICY.window);
  const recentCorrect = recent.filter((a) => a.firstCorrect).length;

  let mastery: Mastery = 'explorando';
  if (independent.filter((a) => a.firstCorrect).length >= 2) mastery = 'practicando';

  const firstSuccess = independent.find((a) => a.firstCorrect);
  const delayedOk =
    !!firstSuccess &&
    MASTERY_POLICY.delayedChecks.every((d) => independent.some((a) => a.firstCorrect && a.variantId !== firstSuccess.variantId && daysBetween(firstSuccess.day, a.day) >= d));
  if (
    recent.length >= MASTERY_POLICY.window &&
    recentCorrect >= MASTERY_POLICY.minCorrect &&
    new Set(recent.map((a) => a.day)).size >= MASTERY_POLICY.minDays &&
    recent.filter((a) => a.constructed).length >= MASTERY_POLICY.minConstructed &&
    delayedOk
  )
    mastery = 'dominado';

  // Un fallo no quita "dominado"; dos fallos independientes en días distintos piden repaso.
  const misses = independent.slice(-MASTERY_POLICY.window).filter((a) => !a.firstCorrect);
  const needsReview = mastery === 'dominado' && new Set(misses.slice(-2).map((a) => a.day)).size >= 2 && misses.length >= 2;
  return { mastery, needsReview, recentIndependent: recent.length, recentCorrect };
}

// ------------------------------------------------------------------ repaso 1-3-7 (+14, +30)

export interface ReviewEntry {
  skillId: string;
  /** Día del episodio (el primer fallo, ayuda o "lo veo luego"). */
  startDay: string;
  /** Días en que vuelve la habilidad. */
  dueDays: string[];
  /** Retornos ya hechos (día programado → día real). */
  done: Record<string, string>;
}

export const REVIEW_OFFSETS = [1, 3, 7] as const;
export const MAINTENANCE_OFFSETS = [14, 30] as const;

/**
 * Actualiza la agenda con una respuesta. Una entrada por habilidad (nunca una por pregunta fallada). Si se falla en un
 * retorno, empieza un ciclo nuevo al día siguiente. Las fechas vencidas se quedan disponibles: no hay castigo por faltar.
 */
export function updateReviews(entries: ReviewEntry[], a: MathAttempt): ReviewEntry[] {
  const struggled = !a.firstCorrect || a.maxHintLevel > 0 || !!a.skipped;
  const current = entries.find((e) => e.skillId === a.skillId);
  const others = entries.filter((e) => e !== current);
  const startCycle = (day: string): ReviewEntry => ({ skillId: a.skillId, startDay: day, dueDays: REVIEW_OFFSETS.map((n) => addDays(day, n)), done: {} });

  if (!current) return struggled ? [...others, startCycle(a.day)] : entries;

  const pending = current.dueDays.filter((d) => !(d in current.done) && d <= a.day);
  if (!pending.length) return entries; // práctica normal, no es un retorno
  const due = pending[0];
  if (struggled) return [...others, startCycle(a.day)]; // falló en el retorno: ciclo nuevo
  const done = { ...current.done, [due]: a.day };
  let dueDays = current.dueDays;
  // Tras el +7 hecho sin ayuda, mantenimiento a +14 y +30.
  if (due === addDays(current.startDay, 7)) dueDays = [...dueDays, ...MAINTENANCE_OFFSETS.map((n) => addDays(current.startDay, n))];
  return [...others, { ...current, done, dueDays }];
}

/** Habilidades que vuelven hoy (las más atrasadas primero), como máximo `max` (calentamiento: 2/3/4 según la sesión). */
export function dueSkills(entries: ReviewEntry[], today: string, max: number): string[] {
  return entries
    .map((e) => ({ skillId: e.skillId, due: e.dueDays.find((d) => !(d in e.done) && d <= today) }))
    .filter((x): x is { skillId: string; due: string } => !!x.due)
    .sort((x, y) => x.due.localeCompare(y.due))
    .slice(0, max)
    .map((x) => x.skillId);
}

/** Cuántos retos de calentamiento caben según la duración de la sesión (8/15/20 min). */
export function warmupSize(minutes: number): number {
  return minutes <= 8 ? 2 : minutes <= 15 ? 3 : 4;
}

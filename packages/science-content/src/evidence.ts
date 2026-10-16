/**
 * Política de evidencia de Ciencia `scienceEvidence.v1` (docs/design/ciencia/ESPECIFICACION.md §7). Lógica pura y local:
 * solo datos DERIVADOS (idea, tarea, contexto, día, si la explicación fue adecuada, cuánta pista explicativa usó). Nunca voz,
 * foto, dibujo ni nombre.
 *
 * Por qué no la política de Matemáticas: aquella pide 10 intentos, 8 aciertos y 3 días por habilidad; una unidad de Ciencia
 * tiene 8 tareas, así que nunca la alcanzaría. Aquí el dominio es por IDEA y por CONTEXTOS distintos. Los umbrales son una
 * propuesta por probar con niños (no un hallazgo de la investigación).
 *
 * Nunca bloquea (D9) y nunca se muestra un porcentaje al niño; el detalle es de los padres.
 */
import type { Localized } from '@lee-conmigo/contracts';

export type IdeaStage = 'none' | 'explorando' | 'practicando' | 'loExplico';

export const EVIDENCE_POLICY = {
  id: 'scienceEvidence.v1',
  /** Contextos distintos donde explicó bien una idea para llegar a «lo explico». */
  contextsNeeded: 2,
  /** Repasos a los N días del primer logro, siempre con un CASO NUEVO (no la misma pregunta). */
  reviewOffsets: [1, 3, 7],
  /** Fallos (explicación no adecuada) en días distintos, después de «lo explico», que piden repaso sin quitar el logro. */
  failuresForReview: 2,
} as const;

/** Lo que el niño ve en su cuaderno (nunca «incorrecto», nunca porcentajes). */
export const STAGE_LABEL: Record<Exclude<IdeaStage, 'none'>, Localized> = {
  explorando: { es: 'Explorando', en: 'Exploring' },
  practicando: { es: 'Practicando', en: 'Practicing' },
  loExplico: { es: 'Lo explico', en: 'I can explain it' },
};

export interface EvidenceAttempt {
  ideaId: string;
  taskId: string;
  /** El caso en que se explicó (p. ej. `bandejas`, `pendiente`, `mapa.A`). Repetir el mismo contexto no es evidencia nueva. */
  contextId: string;
  /** Día local `YYYY-MM-DD`. */
  day: string;
  /** La explicación fue adecuada según la rúbrica de la tarea (evidencia pertinente + razonamiento válido). */
  adequate: boolean;
  /** Mayor escalón de pista EXPLICATIVA abierto antes de terminar (0 = ninguno). Las ayudas de acceso NO cuentan. */
  maxHintLevel: 0 | 1 | 2 | 3;
  /** «Lo veo luego»: lo mandó al repaso. */
  skipped?: boolean;
  /** Ayudas de acceso (audio, idioma, tamaño de letra…): se guardan para los padres y NO restan dominio. */
  accessSupports?: string[];
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export interface IdeaStatus {
  stage: IdeaStage;
  /** Logró «lo explico» pero después falló en días distintos: «vamos a repasarlo» (sin perder el logro). */
  needsReview: boolean;
  /** Contextos distintos en que explicó bien (para padres). */
  adequateContexts: string[];
  /** Explicaciones adecuadas y sin pista explicativa (para padres). */
  independentAdequate: number;
  attempts: number;
}

const counted = (a: EvidenceAttempt) => !a.skipped;

/** Estado de UNA idea a partir de sus intentos, en orden cronológico. */
export function ideaStatus(attempts: EvidenceAttempt[]): IdeaStatus {
  const real = attempts.filter(counted);
  const contexts: string[] = [];
  let independent = 0;
  let stage: IdeaStage = real.length ? 'explorando' : 'none';
  let reachedAt = -1;
  real.forEach((a, i) => {
    if (!a.adequate) return;
    if (!contexts.includes(a.contextId)) contexts.push(a.contextId);
    if (a.maxHintLevel === 0) independent++;
    if (stage === 'explorando') stage = 'practicando';
    if (stage !== 'loExplico' && contexts.length >= EVIDENCE_POLICY.contextsNeeded && independent >= 1) {
      stage = 'loExplico';
      reachedAt = i;
    }
  });
  let needsReview = false;
  if (reachedAt >= 0) {
    const failDays = new Set(real.slice(reachedAt + 1).filter((a) => !a.adequate).map((a) => a.day));
    needsReview = failDays.size >= EVIDENCE_POLICY.failuresForReview;
  }
  return { stage, needsReview, adequateContexts: contexts, independentAdequate: independent, attempts: attempts.length };
}

/**
 * Repasos que tocan hoy para una idea (offsets de `reviewOffsets`). Cuenta desde la PRIMERA explicación adecuada. Un repaso se
 * da por hecho cuando, desde su día, hubo un intento en un contexto que no se había usado antes de ese día.
 */
export function reviewsDue(attempts: EvidenceAttempt[], today: string): number[] {
  const real = attempts.filter(counted);
  const first = real.find((a) => a.adequate);
  if (!first) return [];
  return EVIDENCE_POLICY.reviewOffsets.filter((offset) => {
    const dueDay = addDays(first.day, offset);
    if (today < dueDay) return false;
    const before = new Set(real.filter((a) => a.day < dueDay).map((a) => a.contextId));
    return !real.some((a) => a.day >= dueDay && !before.has(a.contextId));
  });
}

/** Resumen por idea para las pantallas y para el panel de padres. */
export function statusByIdea(attempts: EvidenceAttempt[]): Record<string, IdeaStatus> {
  const by: Record<string, EvidenceAttempt[]> = {};
  for (const a of attempts) (by[a.ideaId] ??= []).push(a);
  return Object.fromEntries(Object.entries(by).map(([id, list]) => [id, ideaStatus(list)]));
}

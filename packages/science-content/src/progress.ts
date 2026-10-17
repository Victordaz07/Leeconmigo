/**
 * Progreso de Ciencia de un niño: SOLO datos derivados (qué sesiones terminó, qué eligió, sus explicaciones del cuaderno
 * como ids de opciones, los intentos de evidencia). Nunca voz, foto, dibujo ni texto libre (docs/07). Funciones puras que
 * devuelven un progreso nuevo; la app lo guarda con `subjectStorageFor('ciencia', …)`.
 */
import type { EvidenceAttempt } from './evidence.ts';
import type { PartOutcome, ScienceUnit, UnitSession, UnitTask } from './unit.ts';

/** Una explicación que el niño armó (afirmación + evidencia + razonamiento…): ids de opciones, no texto libre. */
export interface NotebookEntry {
  taskId: string;
  day: string;
  picks: Record<string, string[]>;
}

export interface UnitProgress {
  sessionsDone: string[];
  /** Estrellas por esfuerzo de cada sesión terminada (se conserva la mayor). */
  stars: Record<string, number>;
  /** «Guardar y seguir después»: dónde retomar. */
  resume?: { sessionId: string; step: number };
  /** Lo que eligió en preguntas sueltas (p. ej. su idea de al principio), por id de pregunta. */
  choices: Record<string, string[]>;
  notebook: NotebookEntry[];
}

export interface ScienceProgress {
  v: 1;
  units: Record<string, UnitProgress>;
  attempts: EvidenceAttempt[];
}

export const EMPTY_SCIENCE: ScienceProgress = { v: 1, units: {}, attempts: [] };
export const EMPTY_UNIT: UnitProgress = { sessionsDone: [], stars: {}, choices: {}, notebook: [] };

const MAX_ATTEMPTS = 500;
const isStrings = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function isUnitProgress(v: unknown): v is UnitProgress {
  if (!isRecord(v)) return false;
  if (!isStrings(v.sessionsDone)) return false;
  if (!isRecord(v.stars) || !Object.values(v.stars).every((n) => typeof n === 'number')) return false;
  if (!isRecord(v.choices) || !Object.values(v.choices).every(isStrings)) return false;
  if (v.resume !== undefined && !(isRecord(v.resume) && typeof v.resume.sessionId === 'string' && typeof v.resume.step === 'number')) return false;
  return Array.isArray(v.notebook) && v.notebook.every((e) => isRecord(e) && typeof e.taskId === 'string' && typeof e.day === 'string' && isRecord(e.picks) && Object.values(e.picks).every(isStrings));
}

function isAttempt(v: unknown): v is EvidenceAttempt {
  return isRecord(v) && typeof v.ideaId === 'string' && typeof v.taskId === 'string' && typeof v.contextId === 'string' && typeof v.day === 'string' && typeof v.adequate === 'boolean' && [0, 1, 2, 3].includes(v.maxHintLevel as number);
}

/** Lo guardado que no tenga esta forma se descarta (se empieza limpio, nunca se rompe). */
export function isScienceProgress(v: unknown): v is ScienceProgress {
  return isRecord(v) && v.v === 1 && isRecord(v.units) && Object.values(v.units).every(isUnitProgress) && Array.isArray(v.attempts) && v.attempts.every(isAttempt);
}

export const unitProgress = (p: ScienceProgress, unitId: string): UnitProgress => p.units[unitId] ?? EMPTY_UNIT;

const withUnit = (p: ScienceProgress, unitId: string, f: (u: UnitProgress) => UnitProgress): ScienceProgress => ({ ...p, units: { ...p.units, [unitId]: f(unitProgress(p, unitId)) } });

export interface TaskDone {
  outcome: PartOutcome | 'skipped';
  day: string;
  /** Mayor escalón de pista EXPLICATIVA abierto (0–3). */
  maxHintLevel: 0 | 1 | 2 | 3;
  picks: Record<string, string[]>;
  accessSupports?: string[];
}

/**
 * Guarda el cierre de una tarea: un intento de evidencia por cada idea que trabaja, y su entrada en el cuaderno si es una
 * explicación (evidencia, modelo o reflexión). «Lo veo luego» (`skipped`) no cuenta como dominio ni como fallo.
 */
export function recordTask(p: ScienceProgress, unit: ScienceUnit, task: UnitTask, done: TaskDone): ScienceProgress {
  const skipped = done.outcome === 'skipped';
  const fresh: EvidenceAttempt[] = task.ideaIds.map((ideaId) => ({
    ideaId,
    taskId: task.id,
    contextId: task.contextId,
    day: done.day,
    adequate: done.outcome === 'ok',
    maxHintLevel: done.maxHintLevel,
    ...(skipped ? { skipped: true } : {}),
    ...(done.accessSupports?.length ? { accessSupports: done.accessSupports } : {}),
  }));
  const keepsEntry = !skipped && (task.kind === 'evidencia' || task.kind === 'modelo' || task.kind === 'reflexionar');
  const next = withUnit(p, unit.id, (u) => ({
    ...u,
    notebook: keepsEntry ? [...u.notebook.filter((e) => e.taskId !== task.id), { taskId: task.id, day: done.day, picks: done.picks }] : u.notebook,
  }));
  return { ...next, attempts: [...next.attempts, ...fresh].slice(-MAX_ATTEMPTS) };
}

export function recordChoice(p: ScienceProgress, unitId: string, choiceId: string, ids: string[]): ScienceProgress {
  return withUnit(p, unitId, (u) => ({ ...u, choices: { ...u.choices, [choiceId]: ids } }));
}

export function saveResume(p: ScienceProgress, unitId: string, sessionId: string, step: number): ScienceProgress {
  return withUnit(p, unitId, (u) => ({ ...u, resume: { sessionId, step } }));
}

export function finishSession(p: ScienceProgress, unitId: string, sessionId: string, stars: number): ScienceProgress {
  return withUnit(p, unitId, (u) => {
    const { resume, ...rest } = u;
    return {
      ...rest,
      ...(resume && resume.sessionId !== sessionId ? { resume } : {}),
      sessionsDone: u.sessionsDone.includes(sessionId) ? u.sessionsDone : [...u.sessionsDone, sessionId],
      stars: { ...u.stars, [sessionId]: Math.max(u.stars[sessionId] ?? 0, stars) },
    };
  });
}

/** La sesión que sigue (la primera sin terminar). `undefined` = terminó la unidad. */
export function nextSession(unit: ScienceUnit, u: UnitProgress): UnitSession | undefined {
  return unit.sessions.find((s) => !u.sessionsDone.includes(s.id));
}

/** Cuántos de 0–3 «segmentos» de la portada llenar en Inicio (`progressSegments`: tercios de la unidad). */
export function homeSegments(unit: ScienceUnit, u: UnitProgress): 0 | 1 | 2 | 3 {
  const done = unit.sessions.filter((s) => u.sessionsDone.includes(s.id)).length;
  if (done === 0) return 0;
  return Math.min(3, Math.max(1, Math.ceil((done / unit.sessions.length) * 3))) as 1 | 2 | 3;
}

/** Los segmentos de la portada de Ciencia en Inicio: avance sobre las sesiones de TODAS las unidades jugables. */
export function overallSegments(units: readonly ScienceUnit[], p: ScienceProgress): 0 | 1 | 2 | 3 {
  const total = units.reduce((n, u) => n + u.sessions.length, 0);
  const done = units.reduce((n, u) => n + u.sessions.filter((s) => unitProgress(p, u.id).sessionsDone.includes(s.id)).length, 0);
  if (total === 0 || done === 0) return 0;
  return Math.min(3, Math.max(1, Math.ceil((done / total) * 3))) as 1 | 2 | 3;
}

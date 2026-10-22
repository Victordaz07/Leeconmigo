/**
 * Lo que se guarda en el equipo y cómo (RN-08). Lógica pura sobre un almacén clave → texto (`KV`), así se prueba sin
 * SQLite. Todo con versión en la clave (`kitewise.v1.`): si el formato cambia, se lee la versión vieja y se migra.
 * Si algo guardado no se puede leer, se ignora (se empieza limpio) en vez de romper la app.
 */
import type { ResumePoint, SessionSummary } from '@lee-conmigo/contracts';
import { latestOf, MAX_SUMMARIES, type ProgressStore } from '@lee-conmigo/session-engine';
import type { MathAttempt, ReviewEntry } from '@lee-conmigo/math-content';

export interface KV {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

const PREFIX = 'kitewise.v1.';
export const KEYS = {
  profiles: `${PREFIX}profiles`,
  pin: `${PREFIX}pin`,
  /** Recordatorios locales (Modo padres). */
  reminders: `${PREFIX}reminders`,
  /** Aceptación del aviso legal por el adulto (versión + fecha). */
  legal: `${PREFIX}legal`,
  reading: (id: string) => `${PREFIX}reading.${id}`,
  math: (id: string) => `${PREFIX}math.${id}`,
  /** Datos de una materia nueva (Ciencia, Sociedad…) de un niño: `kitewise.v1.<materia>.<niño>`. */
  subject: (subject: SubjectKey, id: string) => `${PREFIX}${subject}.${id}`,
};

/** Materias con guardado genérico. Agregar una aquí también la incluye en "Borrar el progreso". */
export const SUBJECT_KEYS = ['ciencia', 'sociedad', 'arte', 'mi-cuaderno'] as const;
export type SubjectKey = (typeof SUBJECT_KEYS)[number];

export function readJSON<T>(kv: KV, key: string, fallback: T): T {
  const raw = kv.get(key);
  if (!raw) return fallback;
  try {
    const v: unknown = JSON.parse(raw);
    // "null", números o texto sueltos no son lo que se guardó: se empieza limpio.
    return v !== null && typeof v === typeof fallback ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export const writeJSON = (kv: KV, key: string, value: unknown) => kv.set(key, JSON.stringify(value));

/** Progreso de Lectura de un niño: cada cambio se escribe en el equipo al momento. */
export class PersistentProgressStore implements ProgressStore {
  private list: SessionSummary[];
  private resumes: Map<string, ResumePoint>;

  constructor(
    private kv: KV,
    private key: string,
  ) {
    const saved = readJSON<{ summaries?: SessionSummary[]; resumes?: ResumePoint[] }>(kv, key, {});
    this.list = Array.isArray(saved.summaries) ? saved.summaries : [];
    this.resumes = new Map((Array.isArray(saved.resumes) ? saved.resumes : []).map((r) => [r.storyId, r]));
  }

  private flush() {
    writeJSON(this.kv, this.key, { summaries: this.list, resumes: [...this.resumes.values()] });
  }

  saveSummary(summary: SessionSummary): void {
    this.list = [...this.list, summary].slice(-MAX_SUMMARIES);
    this.flush();
  }

  summaries(): SessionSummary[] {
    return [...this.list];
  }

  resumePoint(storyId: string): ResumePoint | null {
    return this.resumes.get(storyId) ?? null;
  }

  latestResumePoint(): ResumePoint | null {
    return latestOf([...this.resumes.values()]);
  }

  setResumePoint(point: ResumePoint): void {
    this.resumes.set(point.storyId, point);
    this.flush();
  }

  clearResumePoint(storyId: string): void {
    this.resumes.delete(storyId);
    this.flush();
  }
}

/** Respuestas de Matemáticas que se conservan como máximo (las más recientes). */
export const MAX_MATH_ATTEMPTS = 2000;

export interface SavedMath {
  attempts: MathAttempt[];
  reviews: ReviewEntry[];
  lessonsDone: string[];
}

export function loadMath(kv: KV, id: string): SavedMath {
  const s = readJSON<Partial<SavedMath>>(kv, KEYS.math(id), {});
  return { attempts: Array.isArray(s.attempts) ? s.attempts : [], reviews: Array.isArray(s.reviews) ? s.reviews : [], lessonsDone: Array.isArray(s.lessonsDone) ? s.lessonsDone : [] };
}

export function saveMath(kv: KV, id: string, m: { attempts: MathAttempt[]; reviews: ReviewEntry[]; lessonsDone: Iterable<string> }) {
  writeJSON(kv, KEYS.math(id), { attempts: m.attempts.slice(-MAX_MATH_ATTEMPTS), reviews: m.reviews, lessonsDone: [...m.lessonsDone] });
}

/**
 * Datos de una materia (versión 1 del formato). Cada materia decide la forma de lo que guarda; aquí solo se lee con
 * tolerancia (si lo guardado no tiene la forma esperada, `valid` lo rechaza y se empieza limpio) y se escribe.
 */
export function loadSubject<T>(kv: KV, subject: SubjectKey, id: string, fallback: T, valid: (v: unknown) => v is T): T {
  const v = readJSON<unknown>(kv, KEYS.subject(subject, id), fallback);
  return valid(v) ? v : fallback;
}
export const saveSubject = (kv: KV, subject: SubjectKey, id: string, value: unknown) => writeJSON(kv, KEYS.subject(subject, id), value);

/** «Borrar todos los datos» (docs/12 §6): perfiles, PIN, recordatorios, aceptación legal y el progreso de TODOS los niños. */
export function eraseEverything(kv: KV, childIds: string[]) {
  for (const id of childIds) eraseChild(kv, id);
  kv.remove(KEYS.profiles);
  kv.remove(KEYS.pin);
  kv.remove(KEYS.reminders);
  kv.remove(KEYS.legal);
}

/** "Borrar el progreso" de un niño (docs/12 §6): Lectura, Matemáticas y las demás materias. */
export function eraseChild(kv: KV, id: string) {
  kv.remove(KEYS.reading(id));
  kv.remove(KEYS.math(id));
  for (const s of SUBJECT_KEYS) kv.remove(KEYS.subject(s, id));
}

/**
 * Progreso guardado en el navegador (`localStorage`). Local-first: nada sale del dispositivo (docs/07).
 *
 * Solo guarda DATOS DERIVADOS: al escribir se copian una a una las propiedades permitidas de cada resumen, así
 * que aunque alguien le pase un objeto con más campos (audio, texto reconocido...) nunca llegan al disco.
 * Si el almacenamiento falla (cuota, modo privado, datos corruptos) el progreso simplemente no se guarda: la
 * lectura nunca se rompe por eso.
 */
import type { ResumePoint, SessionSummary } from '@lee-conmigo/contracts';
import { MAX_SUMMARIES, latestOf, type ProgressStore } from '@lee-conmigo/session-engine';

export const PROGRESS_STORAGE_KEY = 'lee-conmigo:progress:v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

interface Persisted {
  v: 1;
  summaries: SessionSummary[];
  resumes: ResumePoint[];
}

const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isStr = (x: unknown): x is string => typeof x === 'string';

/** Copia SOLO los campos permitidos de un resumen (o null si no tiene la forma de uno). */
function pickSummary(x: unknown): SessionSummary | null {
  const o = x as Partial<SessionSummary> | null;
  if (!o || typeof o !== 'object') return null;
  if (!isStr(o.storyId) || (o.language !== 'es' && o.language !== 'en') || !isNum(o.level) || !isNum(o.validReadingSeconds) || !isNum(o.sessionSeconds)) return null;
  if (!isNum(o.comprehensionCorrect) || !isNum(o.comprehensionTotal) || !Array.isArray(o.wordsHelped) || !isNum(o.completion) || !isStr(o.completedAt)) return null;
  const stars = o.stars === 1 || o.stars === 2 || o.stars === 3 ? o.stars : undefined;
  return {
    storyId: o.storyId,
    language: o.language,
    level: o.level,
    validReadingSeconds: o.validReadingSeconds,
    sessionSeconds: o.sessionSeconds,
    comprehensionCorrect: o.comprehensionCorrect,
    comprehensionTotal: o.comprehensionTotal,
    wordsHelped: o.wordsHelped.filter(isStr),
    completion: o.completion,
    ...(stars ? { stars } : {}),
    ...(isStr(o.category) ? { category: o.category } : {}),
    completedAt: o.completedAt,
  };
}

function pickResume(x: unknown): ResumePoint | null {
  const o = x as Partial<ResumePoint> | null;
  if (!o || typeof o !== 'object' || !isStr(o.storyId) || !isNum(o.pageIndex) || o.pageIndex < 0 || !isStr(o.updatedAt)) return null;
  return { storyId: o.storyId, pageIndex: Math.floor(o.pageIndex), updatedAt: o.updatedAt };
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // acceder a localStorage puede lanzar (permisos, modo privado)
  }
}

export class LocalStorageProgressStore implements ProgressStore {
  private readonly storage: StorageLike | null;
  private cache: Persisted | null = null;

  constructor(storage: StorageLike | null = defaultStorage()) {
    this.storage = storage;
  }

  private load(): Persisted {
    if (this.cache) return this.cache;
    let data: Persisted = { v: 1, summaries: [], resumes: [] };
    try {
      const raw = this.storage?.getItem(PROGRESS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<Persisted>) : null;
      if (parsed && parsed.v === 1) {
        data = {
          v: 1,
          summaries: (Array.isArray(parsed.summaries) ? parsed.summaries : []).map(pickSummary).filter((s): s is SessionSummary => s !== null),
          resumes: (Array.isArray(parsed.resumes) ? parsed.resumes : []).map(pickResume).filter((r): r is ResumePoint => r !== null),
        };
      }
    } catch {
      // datos corruptos o almacenamiento inaccesible: se empieza limpio
    }
    this.cache = data;
    return data;
  }

  private save(): void {
    try {
      this.storage?.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(this.load()));
    } catch {
      // cuota llena o modo privado: el progreso vive solo en memoria hasta cerrar la app
    }
  }

  saveSummary(summary: SessionSummary): void {
    const clean = pickSummary(summary);
    if (!clean) return;
    const d = this.load();
    d.summaries = [...d.summaries, clean].slice(-MAX_SUMMARIES);
    this.save();
  }

  summaries(): SessionSummary[] {
    return [...this.load().summaries];
  }

  resumePoint(storyId: string): ResumePoint | null {
    return this.load().resumes.find((r) => r.storyId === storyId) ?? null;
  }

  latestResumePoint(): ResumePoint | null {
    return latestOf(this.load().resumes);
  }

  setResumePoint(point: ResumePoint): void {
    const clean = pickResume(point);
    if (!clean) return;
    const d = this.load();
    d.resumes = [...d.resumes.filter((r) => r.storyId !== clean.storyId), clean];
    this.save();
  }

  clearResumePoint(storyId: string): void {
    const d = this.load();
    d.resumes = d.resumes.filter((r) => r.storyId !== storyId);
    this.save();
  }
}

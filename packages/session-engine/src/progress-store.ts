/**
 * Dónde se guarda el progreso (docs/07: local-first, solo datos derivados). La interfaz no sabe de dónde
 * viene el almacenamiento: en el navegador es `localStorage` (apps/reader); en Android/Capacitor podrá ser
 * SQLite o el sistema de archivos sin tocar la lógica. Es síncrona a propósito (lo que hay hoy lo es); si un
 * almacenamiento futuro es asíncrono, se cambia aquí, una sola vez.
 */
import type { ResumePoint, SessionSummary } from '@lee-conmigo/contracts';

export interface ProgressStore {
  /** Guarda el resumen de una sesión (terminada o dejada a medias). */
  saveSummary(summary: SessionSummary): void;
  /** Todos los resúmenes, del más antiguo al más nuevo. */
  summaries(): SessionSummary[];
  /** Dónde retomar una historia (null si no hay nada a medias). */
  resumePoint(storyId: string): ResumePoint | null;
  /** La historia a medias más reciente, para "Sigue leyendo" en Inicio. */
  latestResumePoint(): ResumePoint | null;
  setResumePoint(point: ResumePoint): void;
  clearResumePoint(storyId: string): void;
}

/** Máximo de resúmenes que se conservan (los más recientes): no hace falta guardar un historial infinito. */
export const MAX_SUMMARIES = 200;

export class MemoryProgressStore implements ProgressStore {
  private list: SessionSummary[] = [];
  private resumes = new Map<string, ResumePoint>();

  saveSummary(summary: SessionSummary): void {
    this.list = [...this.list, summary].slice(-MAX_SUMMARIES);
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
  }

  clearResumePoint(storyId: string): void {
    this.resumes.delete(storyId);
  }
}

/** El punto de reanudación más reciente de una lista (por `updatedAt`). */
export function latestOf(points: ResumePoint[]): ResumePoint | null {
  return points.reduce<ResumePoint | null>((best, p) => (!best || p.updatedAt >= best.updatedAt ? p : best), null);
}

export interface StoryProgress {
  /** Alguna sesión llegó al final de la historia. */
  completed: boolean;
  /** Mejor cantidad de estrellas de celebración (0 = nunca terminada). */
  stars: number;
}

/** Progreso de una historia, derivado de los resúmenes guardados. */
export function storyProgress(summaries: SessionSummary[], storyId: string): StoryProgress {
  const done = summaries.filter((s) => s.storyId === storyId && s.completion >= 1);
  return { completed: done.length > 0, stars: done.reduce((best, s) => Math.max(best, s.stars ?? 0), 0) };
}

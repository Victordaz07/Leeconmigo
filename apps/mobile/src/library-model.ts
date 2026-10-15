/**
 * Qué muestran Inicio (B3) y el cuaderno de Lectura (B4): las historias del idioma y nivel del niño, cuál es la "misión de
 * hoy" y el progreso REAL (de los resúmenes guardados; nunca números inventados, docs/07).
 */
import type { Story, StoryCatalogEntry } from '@lee-conmigo/contracts';
import { computeProgressStats, storyProgress, type ProgressStats, type ProgressStore } from '@lee-conmigo/session-engine';
import { pickVariants, type StoryRepository } from '@lee-conmigo/story-engine';
import { progressSegments } from '@lee-conmigo/ui-core';
import type { ChildProfile } from './app-state';

export interface StoryEntry {
  entry: StoryCatalogEntry;
  completed: boolean;
  stars: number;
  /** Página donde se quedó (si está a medias). */
  resumePage: number | null;
}

export interface LibraryModel {
  stories: StoryEntry[];
  /** La historia de la "misión de hoy": la que está a medias, o la primera sin terminar, o la primera. */
  featured: StoryEntry;
  featuredStory: Story;
  stats: ProgressStats;
  readingSegments: 0 | 1 | 2 | 3;
}

export function buildLibraryModel(repo: StoryRepository, store: ProgressStore, profile: ChildProfile, now = new Date()): LibraryModel {
  const summaries = store.summaries();
  const variants = pickVariants(repo.list().filter((e) => !e.dev), profile);
  if (!variants.length) throw new Error('No hay ninguna historia disponible');
  const stories = variants.map((entry): StoryEntry => {
    const p = storyProgress(summaries, entry.id);
    return { entry, completed: p.completed, stars: p.stars, resumePage: store.resumePoint(entry.id)?.pageIndex ?? null };
  });
  const latest = store.latestResumePoint();
  const featured = stories.find((s) => s.entry.id === latest?.storyId) ?? stories.find((s) => !s.completed) ?? stories[0];
  return {
    stories,
    featured,
    featuredStory: repo.get(featured.entry.id) as Story,
    stats: computeProgressStats(summaries, now),
    readingSegments: progressSegments(stories.filter((s) => s.completed).length, stories.length),
  };
}

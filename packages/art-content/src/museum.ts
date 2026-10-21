import { projectById, type ArtLibrary, type ArtProject, type Scene } from './project.ts';

/**
 * «Mi museo» (AR-M2): las creaciones en una pared, cada una con un marco de color. Todo queda en el dispositivo (DA-12): sin contadores, corazones
 * ni «obra de la semana». El marco es un adorno que el niño elige; si no elige, sale uno según el id de la obra (siempre el mismo, para que no cambie solo).
 */
export const FRAME_IDS = ['coral', 'turquoise', 'violet', 'yellow'] as const;
export type FrameId = (typeof FRAME_IDS)[number];

export const isFrameId = (v: unknown): v is FrameId => typeof v === 'string' && (FRAME_IDS as readonly string[]).includes(v);

/** El marco de una obra: el que eligió el niño o, si no, uno estable según su id («p12» → siempre el mismo). */
export function frameOf(project: ArtProject): FrameId {
  if (project.frame && isFrameId(project.frame)) return project.frame;
  const n = Number.parseInt(project.id.replace(/\D/g, ''), 10);
  return FRAME_IDS[(Number.isFinite(n) ? n : 0) % FRAME_IDS.length]!;
}

/** Cambia el marco de una obra (devuelve otra biblioteca; si ya lo tenía puesto, la misma). */
export function setFrame(lib: ArtLibrary, id: string, frame: FrameId, now: number): ArtLibrary {
  const p = projectById(lib, id);
  if (!p || !isFrameId(frame) || p.frame === frame) return lib;
  return { ...lib, projects: lib.projects.map((x) => (x.id === id ? { ...x, frame, updatedAt: now } : x)) };
}

export const MUSEUM_FILTERS = ['all', 'painting', 'collage', 'rhythm'] as const;
export type MuseumFilter = (typeof MUSEUM_FILTERS)[number];

/** Las obras que se ven en la pared: las más recientes primero; con un filtro, solo ese tipo. Nunca se ordena por «mejor». */
export function museumWorks(lib: ArtLibrary, filter: MuseumFilter): ArtProject[] {
  const kind = (p: ArtProject): Scene['kind'] => p.scenes[0]!.kind;
  return lib.projects.filter((p) => filter === 'all' || kind(p) === filter).slice().sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt);
}

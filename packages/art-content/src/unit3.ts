import { changesBetween, newCollageScene, type CollageScene } from './collage.ts';
import { MAX_PROJECTS, nextProjectId, cleanTitle, projectById, type ArtLang, type ArtLibrary, type ArtProject } from './project.ts';
import {
  ENCOUNTERS3, EXAMPLE_IDS, MIN_PIECES_PER_SCENE, MIN_PLAY_PIECES, MIN_PLAY_SHAPES, PLAYGROUND_INDEX, STORY_SCENES, UNIT3_ID, emptyUnit3, type Encounter3Id, type ExampleId, type Missing3, type Plan,
  type StoryUnitProgress,
} from './unit3-model.ts';

export * from './unit3-model.ts';

export const unit3Of = (lib: ArtLibrary): StoryUnitProgress => lib.units?.[UNIT3_ID] ?? emptyUnit3();

/** Cambia el avance de la unidad (devuelve otra biblioteca; si nada cambió, la misma). */
export function patchUnit3(lib: ArtLibrary, patch: Partial<StoryUnitProgress>, now: number): ArtLibrary {
  const cur = unit3Of(lib);
  const next: StoryUnitProgress = { ...cur, ...patch, updatedAt: now };
  if (JSON.stringify({ ...next, updatedAt: 0 }) === JSON.stringify({ ...cur, updatedAt: 0 })) return lib;
  return { ...lib, units: { ...lib.units, [UNIT3_ID]: next } };
}

const hasScenes = (p: ArtProject) => p.scenes.length > PLAYGROUND_INDEX && p.scenes.every((s) => s.kind === 'collage');

/** El proyecto de la unidad: un collage con CUATRO cartones (principio, lo que pasa, final y uno para probar). Si todavía no hay, se crea en blanco. */
export function ensureUnit3Project(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; project: ArtProject | null } {
  const cur = unit3Of(lib);
  const existing = cur.projectId ? projectById(lib, cur.projectId) : undefined;
  if (existing && hasScenes(existing)) return { lib, project: existing };
  if (lib.projects.length >= MAX_PROJECTS) return { lib, project: null };
  const id = nextProjectId(lib);
  const project: ArtProject = { id, title: cleanTitle(title, id), lang, createdAt: now, updatedAt: now, scenes: Array.from({ length: STORY_SCENES + 1 }, () => newCollageScene()), versions: [] };
  return { lib: patchUnit3({ ...lib, projects: [project, ...lib.projects] }, { projectId: id }, now), project };
}

/** El cartón `index` del proyecto (0–3), si es de collage. */
export function collageAt(project: ArtProject | undefined, index: number): CollageScene | undefined {
  const s = project?.scenes[index];
  return s?.kind === 'collage' ? s : undefined;
}

/** Las tres escenas de la historia (las que falten, en blanco). */
export const storyScenes = (project: ArtProject | undefined): CollageScene[] => Array.from({ length: STORY_SCENES }, (_, i) => collageAt(project, i) ?? newCollageScene());

/** ¿El cartón de probar tiene piezas, de formas distintas y al menos una cambiada de tamaño o girada? */
export function playedEnough(scene: CollageScene | undefined): boolean {
  if (!scene || scene.pieces.length < MIN_PLAY_PIECES) return false;
  const shapes = new Set(scene.pieces.map((p) => p.shape));
  const changed = scene.pieces.some((p) => p.size !== 160 || p.rot !== 0);
  return shapes.size >= MIN_PLAY_SHAPES && changed;
}

/** Lo que cambió entre dos escenas seguidas, limitado a lo que el niño puede contar (se movió, apareció o creció). */
export const storyChanges = (a: CollageScene, b: CollageScene): Plan[] => changesBetween(a, b).filter((c): c is Plan => c !== 'gone');

/** ¿La escena `i` (1 o 2) está lista? Tiene piezas y cambió algo respecto a la anterior. */
export function sceneReady(project: ArtProject | undefined, i: 0 | 1 | 2): boolean {
  const scenes = storyScenes(project);
  const s = scenes[i]!;
  if (s.pieces.length < MIN_PIECES_PER_SCENE) return false;
  return i === 0 ? true : changesBetween(scenes[i - 1]!, s).length > 0;
}

/** Los cambios que de verdad hay en la historia (union de lo que cambia de la 1 a la 2 y de la 2 a la 3). */
export function detectedChanges(project: ArtProject | undefined): Plan[] {
  const [a, b, c] = storyScenes(project);
  return [...new Set([...storyChanges(a!, b!), ...storyChanges(b!, c!)])];
}

export function missingFor3(id: Encounter3Id, u: StoryUnitProgress, project: ArtProject | undefined): Missing3[] {
  const out: Missing3[] = [];
  switch (id) {
    case 'look':
      if (!u.lookOk) out.push('look');
      break;
    case 'explore':
      if (!playedEnough(collageAt(project, PLAYGROUND_INDEX))) out.push('play');
      break;
    case 'idea':
      if (!u.idea) out.push('idea');
      if (!u.plan) out.push('plan');
      break;
    case 'first':
      if (!sceneReady(project, 0)) out.push('scene1');
      break;
    case 'next':
      if (!sceneReady(project, 1)) out.push('scene2');
      if (!sceneReady(project, 2)) out.push('scene3');
      break;
    case 'tell':
      if (!u.told) out.push('told');
      if (!u.moment) out.push('moment');
      break;
  }
  return out;
}

/** Marca un encuentro como hecho si no falta nada. */
export function completeEncounter3(lib: ArtLibrary, id: Encounter3Id, now: number): ArtLibrary {
  const u = unit3Of(lib);
  const project = u.projectId ? projectById(lib, u.projectId) : undefined;
  if (missingFor3(id, u, project).length > 0 || u.done.includes(id)) return lib;
  return patchUnit3(lib, { done: ENCOUNTERS3.filter((e) => e === id || u.done.includes(e)) }, now);
}

// ---- Encuentro 1: ordenar tres escenas de ejemplo ----

/** Escena de ejemplo: un barquito que avanza (x = 200, 500, 800 en A, B, C). El sol y el mar no cambian: lo que cambia es dónde está el barco. */
export function exampleScene(id: ExampleId): CollageScene {
  const x = id === 'A' ? 200 : id === 'B' ? 500 : 800;
  const piece = (k: number, shape: 'circle' | 'strip' | 'triangle', color: 'yellow' | 'brown' | 'red' | 'blue', px: number, py: number, size: number) => ({ id: `k${k}`, shape, color, x: px, y: py, size, rot: 0 });
  return { kind: 'collage', background: 'sky', pieces: [piece(1, 'circle', 'yellow', 880, 120, 120), piece(2, 'strip', 'blue', 500, 590, 480), piece(3, 'strip', 'brown', x, 500, 150), piece(4, 'triangle', 'red', x, 400, 110)] };
}

/** ¿Las escenas tocadas, en ese orden, van de la primera a la última de la historia (A, B, C)? */
export const isStoryOrder = (taps: readonly ExampleId[]): boolean => taps.length === EXAMPLE_IDS.length && taps.every((t, i) => t === EXAMPLE_IDS[i]);

/** El niño dice en qué orden van las tres escenas. Si es el de la historia, queda hecho; si no, `ok` = false y se le invita a mirar otra vez (nunca «incorrecto»). */
export function answerOrder(lib: ArtLibrary, taps: readonly ExampleId[], now: number): { lib: ArtLibrary; ok: boolean } {
  const ok = isStoryOrder(taps);
  return { lib: ok ? patchUnit3(lib, { lookOk: true }, now) : lib, ok };
}

/** Copia las piezas de una escena en otra (mismos `id`: son los mismos personajes). Así la escena siguiente empieza donde terminó la anterior. */
export function copyScene(lib: ArtLibrary, projectId: string, from: number, to: number, now: number): ArtLibrary {
  const p = projectById(lib, projectId);
  const a = collageAt(p, from);
  const b = collageAt(p, to);
  if (!p || !a || !b || from === to) return lib;
  const next: CollageScene = { kind: 'collage', background: a.background, pieces: a.pieces.map((x) => ({ ...x })) };
  return { ...lib, projects: lib.projects.map((q) => (q.id === projectId ? { ...q, scenes: q.scenes.map((s, i) => (i === to ? next : s)), updatedAt: now } : q)) };
}

export const isDone3 = (u: StoryUnitProgress) => ENCOUNTERS3.every((e) => u.done.includes(e));

export interface Unit3Stars {
  /** Exploró: ordenó las escenas de ejemplo y probó piezas. */
  explored: boolean;
  /** Contó en secuencia: tres escenas con piezas y algo que cambia en cada paso. */
  sequenced: boolean;
  /** Explicó: dijo qué cambia y cuándo pasa lo más importante. */
  explained: boolean;
  total: 0 | 1 | 2 | 3;
}

/** Estrellas por esfuerzo (D11): nunca por «bonito», por cantidad de piezas ni por velocidad. */
export function unit3Stars(u: StoryUnitProgress, project: ArtProject | undefined): Unit3Stars {
  const explored = u.done.includes('look') && u.done.includes('explore');
  const sequenced = sceneReady(project, 0) && sceneReady(project, 1) && sceneReady(project, 2);
  const explained = u.told !== null && u.moment !== null;
  return { explored, sequenced, explained, total: ((explored ? 1 : 0) + (sequenced ? 1 : 0) + (explained ? 1 : 0)) as 0 | 1 | 2 | 3 };
}


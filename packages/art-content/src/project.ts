/**
 * Proyecto editable de Arte y música (docs/design/artes/ESPECIFICACION.md §3, «Proyecto editable»). Lógica PURA: la pantalla pide una operación
 * y recibe la biblioteca nueva; el guardado (SQLite, por niño) lo hace la app con `toLibrary`/`isArtLibrary`.
 *
 * Un `ArtProject` guarda lo que un niño creó: un título, las escenas (hoy solo un ritmo de ocho pulsos; más adelante trazos, collage…) y
 * versiones ligeras («guardar versión» = una copia). Nada de audio grabado (no existe): el ritmo es el patrón + qué sonido tiene cada fila + el tempo.
 */
import { cloneCollageScene, isCollageScene, newCollageScene, type CollageScene } from './collage.ts';
import { clonePaintScene, isPaintScene, newPaintScene, type PaintScene } from './paint.ts';
import { isUnitProgress, UNIT_ID, type UnitProgress } from './unit-model.ts';
import { isPaintUnitProgress, UNIT2_ID, type PaintUnitProgress } from './unit2-model.ts';
import { isStoryUnitProgress, UNIT3_ID, type StoryUnitProgress } from './unit3-model.ts';
import { clampBpm, clonePattern, DEFAULT_BPM, DEFAULT_KIT, emptyPattern, isValidKit, isValidPattern, MAX_BPM, MIN_BPM, type Kit, type Pattern } from '@lee-conmigo/music-engine';

/** Versión del formato guardado. Si cambia, `isArtLibrary` rechaza lo viejo y se empieza limpio (o se migra). */
export const LIBRARY_FORMAT = 1;

export type ArtLang = 'es' | 'en';

/** Una escena de ritmo: cuándo suena cada fila, qué sonido tiene cada fila y a qué velocidad. */
export interface RhythmScene {
  kind: 'rhythm';
  pattern: Pattern;
  kit: Kit;
  bpm: number;
}

/** Una escena es de un taller: ritmo, pintura o collage (el tipo es una unión para que agregar un taller no rompa lo guardado). */
export type Scene = RhythmScene | PaintScene | CollageScene;
export type { PaintScene, CollageScene };

/** Copia ligera de las escenas en un momento (para comparar A/B y poder volver). */
export interface ProjectVersion {
  id: string;
  /** «A», «B», «C»…, o el nombre que el niño le ponga. */
  label: string;
  savedAt: number;
  scenes: Scene[];
}

export interface ArtProject {
  id: string;
  title: string;
  lang: ArtLang;
  createdAt: number;
  updatedAt: number;
  scenes: Scene[];
  versions: ProjectVersion[];
}

export interface ArtLibrary {
  format: typeof LIBRARY_FORMAT;
  projects: ArtProject[];
  /** Avance de las unidades guiadas (`unit.ts`), por id de unidad. Ausente en lo guardado antes de AR-04: se lee como vacío. */
  units?: { [UNIT_ID]?: UnitProgress; [UNIT2_ID]?: PaintUnitProgress; [UNIT3_ID]?: StoryUnitProgress };
}

/** Topes para que lo guardado no crezca sin límite. */
export const MAX_PROJECTS = 50;
export const MAX_VERSIONS = 6;
export const MAX_TITLE = 40;
export const MAX_SCENES = 8;

export const emptyLibrary = (): ArtLibrary => ({ format: LIBRARY_FORMAT, projects: [] });

export const newRhythmScene = (): RhythmScene => ({ kind: 'rhythm', pattern: emptyPattern(), kit: { ...DEFAULT_KIT }, bpm: DEFAULT_BPM });

const cloneScene = (s: Scene): Scene => (s.kind === 'rhythm' ? { kind: 'rhythm', pattern: clonePattern(s.pattern), kit: { ...s.kit }, bpm: s.bpm } : s.kind === 'painting' ? clonePaintScene(s) : cloneCollageScene(s));

/** La escena de ritmo / de pintura / de collage de un proyecto (`undefined` si el proyecto es de otro taller). */
export const rhythmOf = (p: ArtProject): RhythmScene | undefined => (p.scenes[0]?.kind === 'rhythm' ? p.scenes[0] : undefined);
export const paintOf = (p: ArtProject): PaintScene | undefined => (p.scenes[0]?.kind === 'painting' ? p.scenes[0] : undefined);
export const collageOf = (p: ArtProject): CollageScene | undefined => (p.scenes[0]?.kind === 'collage' ? p.scenes[0] : undefined);

/** ¿De qué taller es el proyecto? (la primera escena manda). */
export const kindOf = (p: ArtProject): Scene['kind'] => p.scenes[0]!.kind;

/** Título limpio: sin espacios sobrantes, con tope de largo; si queda vacío, el de reserva. */
export function cleanTitle(raw: string, fallback: string): string {
  const t = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE).trim();
  return t || fallback;
}

/** El siguiente id libre (determinista, sin azar: se puede probar). */
export function nextProjectId(lib: ArtLibrary): string {
  const used = lib.projects.map((p) => Number(p.id.replace(/^p/, ''))).filter((n) => Number.isInteger(n));
  return `p${(used.length ? Math.max(...used) : 0) + 1}`;
}

export const projectById = (lib: ArtLibrary, id: string): ArtProject | undefined => lib.projects.find((p) => p.id === id);

const replace = (lib: ArtLibrary, id: string, change: (p: ArtProject) => ArtProject): ArtLibrary => {
  const current = projectById(lib, id);
  if (!current) return lib;
  const changed = change(current);
  if (changed === current) return lib;
  return { ...lib, projects: lib.projects.map((p) => (p.id === id ? changed : p)) };
};

/** Crea un proyecto con un ritmo en blanco. Si ya hay `MAX_PROJECTS`, no crea (devuelve la misma biblioteca). */
export function createRhythmProject(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; id: string | null } {
  if (lib.projects.length >= MAX_PROJECTS) return { lib, id: null };
  const id = nextProjectId(lib);
  const project: ArtProject = { id, title: cleanTitle(title, id), lang, createdAt: now, updatedAt: now, scenes: [newRhythmScene()], versions: [] };
  return { lib: { ...lib, projects: [project, ...lib.projects] }, id };
}

/** Crea un proyecto con un lienzo en blanco y la paleta de partida. */
export function createPaintProject(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; id: string | null } {
  if (lib.projects.length >= MAX_PROJECTS) return { lib, id: null };
  const id = nextProjectId(lib);
  const project: ArtProject = { id, title: cleanTitle(title, id), lang, createdAt: now, updatedAt: now, scenes: [newPaintScene()], versions: [] };
  return { lib: { ...lib, projects: [project, ...lib.projects] }, id };
}

/** Crea un proyecto con un cartón en blanco para pegar piezas. */
export function createCollageProject(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; id: string | null } {
  if (lib.projects.length >= MAX_PROJECTS) return { lib, id: null };
  const id = nextProjectId(lib);
  const project: ArtProject = { id, title: cleanTitle(title, id), lang, createdAt: now, updatedAt: now, scenes: [newCollageScene()], versions: [] };
  return { lib: { ...lib, projects: [project, ...lib.projects] }, id };
}

/** Guardado automático: reemplaza la escena `index` del proyecto. El tempo se limita a 60–140. */
export function updateScene(lib: ArtLibrary, id: string, index: number, scene: Scene, now: number): ArtLibrary {
  return replace(lib, id, (p) => {
    if (!Number.isInteger(index) || index < 0 || index >= p.scenes.length) return p;
    // una escena solo se reemplaza por otra del mismo taller; el tempo se limita a 60–140
    if (p.scenes[index]!.kind !== scene.kind) return p;
    const copy = cloneScene(scene);
    const next: Scene = copy.kind === 'rhythm' ? { ...copy, bpm: clampBpm(copy.bpm) } : copy;
    return { ...p, scenes: p.scenes.map((s, i) => (i === index ? next : s)), updatedAt: now };
  });
}

export function renameProject(lib: ArtLibrary, id: string, title: string, now: number): ArtLibrary {
  return replace(lib, id, (p) => ({ ...p, title: cleanTitle(title, p.title), updatedAt: now }));
}

export function deleteProject(lib: ArtLibrary, id: string): ArtLibrary {
  return { ...lib, projects: lib.projects.filter((p) => p.id !== id) };
}

/** Copia de un proyecto (sin versiones): para probar otra idea sin perder la primera. */
export function duplicateProject(lib: ArtLibrary, id: string, copyLabel: string, now: number): { lib: ArtLibrary; id: string | null } {
  const src = projectById(lib, id);
  if (!src || lib.projects.length >= MAX_PROJECTS) return { lib, id: null };
  const newId = nextProjectId(lib);
  const copy: ArtProject = { ...src, id: newId, title: cleanTitle(`${src.title} ${copyLabel}`, newId), createdAt: now, updatedAt: now, scenes: src.scenes.map(cloneScene), versions: [] };
  return { lib: { ...lib, projects: [copy, ...lib.projects] }, id: newId };
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Siguiente etiqueta libre: A, B, C… (si se acaban, «V7», «V8»…). */
export function nextVersionLabel(p: ArtProject): string {
  const used = new Set(p.versions.map((v) => v.label));
  for (const l of LETTERS) if (!used.has(l)) return l;
  return `V${p.versions.length + 1}`;
}

/** «Guardar versión»: copia ligera de las escenas ahora. Con `MAX_VERSIONS` se descarta la más vieja (la actual siempre se conserva en el proyecto). */
export function saveVersion(lib: ArtLibrary, id: string, now: number): { lib: ArtLibrary; versionId: string | null } {
  const p = projectById(lib, id);
  if (!p) return { lib, versionId: null };
  const label = nextVersionLabel(p);
  const versionId = `${id}-v${Math.max(0, ...p.versions.map((v) => Number(v.id.split('-v')[1]) || 0)) + 1}`;
  const version: ProjectVersion = { id: versionId, label, savedAt: now, scenes: p.scenes.map(cloneScene) };
  const versions = [...p.versions, version].slice(-MAX_VERSIONS);
  return { lib: replace(lib, id, (q) => ({ ...q, versions, updatedAt: now })), versionId };
}

/** Vuelve a una versión guardada. Antes guarda lo de ahora como versión nueva, así no se pierde nada («el original siempre se puede recuperar»). */
export function restoreVersion(lib: ArtLibrary, id: string, versionId: string, now: number): ArtLibrary {
  const p = projectById(lib, id);
  const v = p?.versions.find((x) => x.id === versionId);
  if (!p || !v) return lib;
  const kept = saveVersion(lib, id, now).lib;
  return replace(kept, id, (q) => ({ ...q, scenes: v.scenes.map(cloneScene), updatedAt: now }));
}

export function deleteVersion(lib: ArtLibrary, id: string, versionId: string): ArtLibrary {
  return replace(lib, id, (p) => ({ ...p, versions: p.versions.filter((v) => v.id !== versionId) }));
}

// ---- Validación de lo guardado (si algo no cuadra, se empieza con la biblioteca vacía) ----

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function isScene(v: unknown): v is Scene {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.kind === 'painting') return isPaintScene(v);
  if (s.kind === 'collage') return isCollageScene(v);
  return s.kind === 'rhythm' && isValidPattern(s.pattern) && isValidKit(s.kit) && isNum(s.bpm) && s.bpm >= MIN_BPM && s.bpm <= MAX_BPM;
}

const isScenes = (v: unknown): v is Scene[] => Array.isArray(v) && v.length > 0 && v.length <= MAX_SCENES && v.every(isScene);

function isVersion(v: unknown): v is ProjectVersion {
  if (typeof v !== 'object' || v === null) return false;
  const x = v as Record<string, unknown>;
  return typeof x.id === 'string' && typeof x.label === 'string' && x.label.length <= MAX_TITLE && isNum(x.savedAt) && isScenes(x.scenes);
}

export function isArtProject(v: unknown): v is ArtProject {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    p.title.length <= MAX_TITLE &&
    (p.lang === 'es' || p.lang === 'en') &&
    isNum(p.createdAt) &&
    isNum(p.updatedAt) &&
    isScenes(p.scenes) &&
    Array.isArray(p.versions) &&
    p.versions.length <= MAX_VERSIONS &&
    p.versions.every(isVersion)
  );
}

export function isArtLibrary(v: unknown): v is ArtLibrary {
  if (typeof v !== 'object' || v === null) return false;
  const l = v as Record<string, unknown>;
  if (l.format !== LIBRARY_FORMAT || !Array.isArray(l.projects) || l.projects.length > MAX_PROJECTS || !l.projects.every(isArtProject)) return false;
  const ids = (l.projects as ArtProject[]).map((p) => p.id);
  if (new Set(ids).size !== ids.length) return false;
  if (l.units === undefined) return true;
  if (typeof l.units !== 'object' || l.units === null) return false;
  // cada unidad guardada se valida con su propio modelo; una clave desconocida se rechaza (se empieza limpio)
  return Object.entries(l.units).every(([key, value]) => (key === UNIT_ID ? isUnitProgress(value) : key === UNIT2_ID ? isPaintUnitProgress(value) : key === UNIT3_ID ? isStoryUnitProgress(value) : false));
}

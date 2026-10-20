import { dropsOf } from './mixing.ts';
import { colorOf, type PaintScene, type PaletteColor } from './paint.ts';
import { MAX_PROJECTS, nextProjectId, cleanTitle, projectById, type ArtLang, type ArtLibrary, type ArtProject } from './project.ts';
import { newPaintScene } from './paint.ts';
import { ENCOUNTERS2, LOOK_ANSWER, MIN_STROKES, PALETTE_SIZE, UNIT2_ID, emptyUnit2, type Encounter2Id, type ExampleChoice, type Missing2, type PaintUnitProgress } from './unit2-model.ts';

export * from './unit2-model.ts';

export const unit2Of = (lib: ArtLibrary): PaintUnitProgress => lib.units?.[UNIT2_ID] ?? emptyUnit2();

/** Cambia el avance de la unidad (devuelve otra biblioteca; si nada cambió, la misma). */
export function patchUnit2(lib: ArtLibrary, patch: Partial<PaintUnitProgress>, now: number): ArtLibrary {
  const cur = unit2Of(lib);
  const next: PaintUnitProgress = { ...cur, ...patch, updatedAt: now };
  if (JSON.stringify({ ...next, updatedAt: 0 }) === JSON.stringify({ ...cur, updatedAt: 0 })) return lib;
  return { ...lib, units: { ...lib.units, [UNIT2_ID]: next } };
}

/** El proyecto de la unidad: pintura con DOS cuadros. Si todavía no hay (o se borró), se crea uno en blanco. */
export function ensureUnit2Project(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; project: ArtProject | null } {
  const cur = unit2Of(lib);
  const existing = cur.projectId ? projectById(lib, cur.projectId) : undefined;
  if (existing && existing.scenes.length >= 2 && existing.scenes.every((s) => s.kind === 'painting')) return { lib, project: existing };
  if (lib.projects.length >= MAX_PROJECTS) return { lib, project: null };
  const id = nextProjectId(lib);
  const project: ArtProject = { id, title: cleanTitle(title, id), lang, createdAt: now, updatedAt: now, scenes: [newPaintScene(), newPaintScene()], versions: [] };
  const withProject = { ...lib, projects: [project, ...lib.projects] };
  const withId = patchUnit2(withProject, { projectId: id }, now);
  return { lib: withId, project };
}

/** El cuadro `index` (0 o 1) del proyecto, si es de pintura. */
export function paintingAt(project: ArtProject | undefined, index: 0 | 1): PaintScene | undefined {
  const s = project?.scenes[index];
  return s?.kind === 'painting' ? s : undefined;
}

/** ¿El color lo mezcló el niño (más de una gota)? Los de partida son una gota de una pintura. */
export const isMixedColor = (c: PaletteColor): boolean => dropsOf(c.recipe) > 1;

/** Los colores de su paleta de cuatro (en el orden en que los eligió). Los que ya no existan en la paleta del proyecto se ignoran. */
export function chosenColors(project: ArtProject | undefined, u: PaintUnitProgress): PaletteColor[] {
  const palette = paintingAt(project, 0)?.palette ?? [];
  return u.paletteIds.map((id) => palette.find((c) => c.id === id)).filter((c): c is PaletteColor => !!c);
}

/** Cuadro con trazos: cuántos trazos de pintura (sin contar la goma) hay y si todos usan colores de la paleta elegida. */
export function paintingStats(scene: PaintScene | undefined, colors: readonly PaletteColor[]): { strokes: number; inPalette: boolean } {
  if (!scene) return { strokes: 0, inPalette: false };
  const hexes = new Set(colors.map((c) => colorOf(c).toUpperCase()));
  const paint = scene.drawing.strokes.filter((s) => !s.brush.eraser);
  return { strokes: paint.length, inPalette: hexes.size > 0 && paint.every((s) => hexes.has(s.brush.color.toUpperCase())) };
}

/** ¿Los dos cuadros son distintos entre sí? (los dos con trazos). */
export function paintingsDiffer(project: ArtProject | undefined): boolean {
  const a = paintingAt(project, 0);
  const b = paintingAt(project, 1);
  if (!a || !b || a.drawing.strokes.length === 0 || b.drawing.strokes.length === 0) return false;
  return JSON.stringify(a.drawing.strokes) !== JSON.stringify(b.drawing.strokes);
}

export function missingFor2(id: Encounter2Id, u: PaintUnitProgress, project: ArtProject | undefined): Missing2[] {
  const out: Missing2[] = [];
  const colors = chosenColors(project, u);
  switch (id) {
    case 'look':
      if (!u.lookOk) out.push('look');
      break;
    case 'mix':
      if (!(paintingAt(project, 0)?.palette ?? []).some(isMixedColor)) out.push('mixed');
      break;
    case 'palette':
      if (colors.length !== PALETTE_SIZE) out.push('four');
      if (!u.relation) out.push('relation');
      break;
    case 'first':
      if (colors.length !== PALETTE_SIZE) out.push('four');
      else {
        const st = paintingStats(paintingAt(project, 0), colors);
        if (st.strokes < MIN_STROKES || !st.inPalette) out.push('strokes1');
      }
      if (!u.intention) out.push('intention');
      break;
    case 'second':
      if (colors.length !== PALETTE_SIZE) out.push('four');
      else {
        const st = paintingStats(paintingAt(project, 1), colors);
        if (st.strokes < MIN_STROKES || !st.inPalette) out.push('strokes2');
      }
      if (!u.changed) out.push('changed');
      break;
    case 'compare':
      if (!paintingsDiffer(project)) out.push('bothPaintings');
      if (!u.seen) out.push('seen');
      if (!u.decision) out.push('decision');
      break;
  }
  return out;
}

/** Marca un encuentro como hecho si no falta nada. */
export function completeEncounter2(lib: ArtLibrary, id: Encounter2Id, now: number): ArtLibrary {
  const u = unit2Of(lib);
  const project = u.projectId ? projectById(lib, u.projectId) : undefined;
  if (missingFor2(id, u, project).length > 0 || u.done.includes(id)) return lib;
  return patchUnit2(lib, { done: ENCOUNTERS2.filter((e) => e === id || u.done.includes(e)) }, now);
}

/** El niño señala una paleta de ejemplo: ¿es la de colores más parecidos? Si no, `ok` = false y se le invita a mirar otra vez (nunca «incorrecto»). */
export function answerLook(lib: ArtLibrary, choice: ExampleChoice, now: number): { lib: ArtLibrary; ok: boolean } {
  const ok = choice === LOOK_ANSWER;
  return { lib: ok ? patchUnit2(lib, { lookOk: true }, now) : lib, ok };
}

/** Guarda los cuatro colores de su paleta. Solo vale con exactamente cuatro ids distintos que existan en la paleta del proyecto. */
export function setPalette4(lib: ArtLibrary, ids: string[], now: number): { lib: ArtLibrary; ok: boolean } {
  const u = unit2Of(lib);
  const project = u.projectId ? projectById(lib, u.projectId) : undefined;
  const palette = paintingAt(project, 0)?.palette ?? [];
  const unique = [...new Set(ids)];
  if (unique.length !== PALETTE_SIZE || !unique.every((id) => palette.some((c) => c.id === id))) return { lib, ok: false };
  return { lib: patchUnit2(lib, { paletteIds: unique }, now), ok: true };
}

export const isDone2 = (u: PaintUnitProgress) => ENCOUNTERS2.every((e) => u.done.includes(e));

export interface Unit2Stars {
  /** Exploró: mezcló un color y armó su paleta de cuatro. */
  explored: boolean;
  /** Comparó: hizo dos cuadros distintos con la misma paleta. */
  compared: boolean;
  /** Explicó una decisión (por qué hizo ese cambio). */
  explained: boolean;
  total: 0 | 1 | 2 | 3;
}

/** Estrellas por esfuerzo (D11): nunca por «pintar mejor», por cantidad de trazos ni por velocidad. */
export function unit2Stars(u: PaintUnitProgress, project: ArtProject | undefined): Unit2Stars {
  const explored = u.done.includes('mix') && u.done.includes('palette');
  const colors = chosenColors(project, u);
  const compared = colors.length === PALETTE_SIZE && paintingsDiffer(project) && paintingStats(paintingAt(project, 0), colors).inPalette && paintingStats(paintingAt(project, 1), colors).inPalette;
  const explained = u.decision !== null;
  return { explored, compared, explained, total: ((explored ? 1 : 0) + (compared ? 1 : 0) + (explained ? 1 : 0)) as 0 | 1 | 2 | 3 };
}

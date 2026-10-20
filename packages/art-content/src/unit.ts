import { activeCount, silentSteps, STEPS, TRACKS, type Pattern, type Track } from '@lee-conmigo/music-engine';
import { createRhythmProject, projectById, type ArtLang, type ArtLibrary, type ArtProject, type RhythmScene } from './project.ts';
import { DEMO_LAYERS, ENCOUNTERS, RETURN_STEP, UNIT_ID, emptyUnit, type EncounterId, type Missing, type UnitProgress } from './unit-model.ts';

export * from './unit-model.ts';

export const unitOf = (lib: ArtLibrary): UnitProgress => lib.units?.[UNIT_ID] ?? emptyUnit();

/** Cambia el avance de la unidad (devuelve otra biblioteca; si nada cambió, la misma). */
export function patchUnit(lib: ArtLibrary, patch: Partial<UnitProgress>, now: number): ArtLibrary {
  const cur = unitOf(lib);
  const next: UnitProgress = { ...cur, ...patch, updatedAt: now };
  if (JSON.stringify({ ...next, updatedAt: 0 }) === JSON.stringify({ ...cur, updatedAt: 0 })) return lib;
  return { ...lib, units: { ...lib.units, [UNIT_ID]: next } };
}

/** El proyecto de la unidad. Si todavía no hay (o se borró), se crea uno en blanco. */
export function ensureUnitProject(lib: ArtLibrary, title: string, lang: ArtLang, now: number): { lib: ArtLibrary; project: ArtProject | null } {
  const cur = unitOf(lib);
  const existing = cur.projectId ? projectById(lib, cur.projectId) : undefined;
  if (existing) return { lib, project: existing };
  const made = createRhythmProject(lib, title, lang, now);
  if (!made.id) return { lib, project: null };
  const withId = patchUnit(made.lib, { projectId: made.id }, now);
  return { lib: withId, project: projectById(withId, made.id) ?? null };
}

/** Capas (filas) que tienen al menos un golpe. */
export const activeRows = (p: Pattern): Track[] => TRACKS.filter((t) => p[t].some(Boolean));

/** ¿Hay dos versiones guardadas que suenen distinto? (comparar de verdad, no guardar la misma dos veces). */
export function versionsDiffer(project: ArtProject): boolean {
  const seen = new Set(project.versions.map((v) => JSON.stringify(v.scenes)));
  return seen.size >= 2;
}

const scene = (project: ArtProject | undefined): RhythmScene | undefined => project?.scenes[0];

export function missingFor(id: EncounterId, u: UnitProgress, project: ArtProject | undefined): Missing[] {
  const s = scene(project);
  const out: Missing[] = [];
  switch (id) {
    case 'listen':
      if (u.heard.length === 0) out.push('heard');
      if (!u.returnOk) out.push('return');
      break;
    case 'build':
      if (!s || activeCount(s.pattern) === 0) out.push('pattern');
      if (!u.intention) out.push('intention');
      break;
    case 'silence':
      if (!s || activeCount(s.pattern) === 0) out.push('pattern');
      // el silencio marcado tiene que seguir siendo silencio (si después encendió un cuadro ahí, hay que elegir otro)
      if (u.silenceStep === null || !s || !silentSteps(s.pattern).includes(u.silenceStep)) out.push('silenceMark');
      break;
    case 'layer':
      if (!s || activeRows(s.pattern).length < 2) out.push('layers');
      if (!u.layerNote) out.push('layerNote');
      break;
    case 'versions':
      if (!project || !versionsDiffer(project)) out.push('versions');
      if (!u.versionReason) out.push('reason');
      break;
    case 'present':
      if (!u.presentNote) out.push('note');
      break;
  }
  return out;
}

/** Marca un encuentro como hecho si no falta nada. */
export function completeEncounter(lib: ArtLibrary, id: EncounterId, now: number): ArtLibrary {
  const u = unitOf(lib);
  const project = u.projectId ? projectById(lib, u.projectId) : undefined;
  if (missingFor(id, u, project).length > 0 || u.done.includes(id)) return lib;
  return patchUnit(lib, { done: ENCOUNTERS.filter((e) => e === id || u.done.includes(e)) }, now);
}

/** El niño toca un pulso del ejemplo: ¿es donde el patrón vuelve a empezar? `hint` = escucha otra vez (nunca «incorrecto»). */
export function answerReturn(lib: ArtLibrary, step: number, now: number): { lib: ArtLibrary; ok: boolean } {
  const ok = step === RETURN_STEP;
  return { lib: ok ? patchUnit(lib, { returnOk: true }, now) : lib, ok };
}

export function markHeard(lib: ArtLibrary, track: Track, now: number): ArtLibrary {
  const u = unitOf(lib);
  if (!DEMO_LAYERS.includes(track) || u.heard.includes(track)) return lib;
  return patchUnit(lib, { heard: [...u.heard, track] }, now);
}

/** Dejar silencio a propósito en un pulso. Solo vale si ahí no suena nada; si no, `ok` = false y no se guarda. */
export function markSilence(lib: ArtLibrary, step: number, now: number): { lib: ArtLibrary; ok: boolean } {
  const u = unitOf(lib);
  const project = u.projectId ? projectById(lib, u.projectId) : undefined;
  const s = scene(project);
  if (!s || !Number.isInteger(step) || step < 0 || step >= STEPS || !silentSteps(s.pattern).includes(step)) return { lib, ok: false };
  return { lib: patchUnit(lib, { silenceStep: step }, now), ok: true };
}

export const isDone = (u: UnitProgress) => ENCOUNTERS.every((e) => u.done.includes(e));

export interface UnitStars {
  /** Exploró: escuchó capas solas y armó un patrón. */
  explored: boolean;
  /** Comparó dos versiones que suenan distinto. */
  compared: boolean;
  /** Explicó una decisión (por qué se queda con una versión). */
  explained: boolean;
  total: 0 | 1 | 2 | 3;
}

/** Estrellas por esfuerzo (D11): nunca por «sonar mejor», por cantidad de cuadros ni por velocidad. */
export function unitStars(u: UnitProgress, project: ArtProject | undefined): UnitStars {
  const explored = u.done.includes('listen') && u.done.includes('build');
  const compared = !!project && versionsDiffer(project);
  const explained = u.versionReason !== null;
  return { explored, compared, explained, total: ((explored ? 1 : 0) + (compared ? 1 : 0) + (explained ? 1 : 0)) as 0 | 1 | 2 | 3 };
}


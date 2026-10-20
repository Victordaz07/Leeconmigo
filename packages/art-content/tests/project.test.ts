import { describe, expect, it } from 'vitest';
import { DEFAULT_KIT, toggleCell } from '@lee-conmigo/music-engine';
import {
  rhythmOf, ARTE_COPY, MAX_PROJECTS, MAX_TITLE, MAX_VERSIONS, cleanTitle, createRhythmProject, deleteProject, deleteVersion, duplicateProject, emptyLibrary, isArtLibrary,
  nextProjectId, projectById, renameProject, restoreVersion, saveVersion, updateScene, type ArtLibrary, type RhythmScene,
} from '../src/index.ts';

const NOW = 1_700_000_000_000;
const make = (): { lib: ArtLibrary; id: string } => {
  const r = createRhythmProject(emptyLibrary(), 'Mi ritmo', 'es', NOW);
  return { lib: r.lib, id: r.id! };
};
const withCell = (lib: ArtLibrary, id: string, step: number, bpm?: number): ArtLibrary => {
  const s = rhythmOf(projectById(lib, id)!)!;
  const next: RhythmScene = { ...s, pattern: toggleCell(s.pattern, 'a', step), bpm: bpm ?? s.bpm };
  return updateScene(lib, id, 0, next, NOW + 1);
};

describe('crear y editar', () => {
  it('un proyecto nuevo trae un ritmo en blanco con el juego de partida', () => {
    const { lib, id } = make();
    const p = projectById(lib, id)!;
    expect(p.scenes).toHaveLength(1);
    expect((p.scenes[0] as RhythmScene).kit).toEqual(DEFAULT_KIT);
    expect((p.scenes[0] as RhythmScene).pattern.a.some(Boolean)).toBe(false);
    expect(p.versions).toEqual([]);
    expect(isArtLibrary(lib)).toBe(true);
  });

  it('los ids son deterministas y no se repiten aunque se borre alguno', () => {
    let lib = emptyLibrary();
    const ids: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = createRhythmProject(lib, `r${i}`, 'es', NOW);
      lib = r.lib;
      ids.push(r.id!);
    }
    expect(ids).toEqual(['p1', 'p2', 'p3']);
    lib = deleteProject(lib, 'p2');
    expect(nextProjectId(lib)).toBe('p4');
  });

  it('el guardado automático reemplaza la escena y limita el tempo a 60–140', () => {
    let { lib, id } = make();
    lib = withCell(lib, id, 3, 999);
    const s = rhythmOf(projectById(lib, id)!)!;
    expect(s.pattern.a[3]).toBe(true);
    expect(s.bpm).toBe(140);
    expect(projectById(lib, id)!.updatedAt).toBe(NOW + 1);
    expect(isArtLibrary(lib)).toBe(true);
  });

  it('actualizar una escena que no existe o un proyecto que no existe no cambia nada', () => {
    const { lib, id } = make();
    const s = rhythmOf(projectById(lib, id)!)!;
    expect(updateScene(lib, id, 5, s, NOW)).toBe(lib);
    expect(updateScene(lib, 'zz', 0, s, NOW)).toBe(lib);
  });

  it('el título se limpia y nunca queda vacío', () => {
    expect(cleanTitle('   Mi   ritmo   feliz  ', 'x')).toBe('Mi ritmo feliz');
    expect(cleanTitle('   ', 'p1')).toBe('p1');
    expect(cleanTitle('a'.repeat(100), 'x').length).toBe(MAX_TITLE);
    const { lib, id } = make();
    expect(projectById(renameProject(lib, id, '   ', NOW), id)!.title).toBe('Mi ritmo');
    expect(projectById(renameProject(lib, id, 'Lluvia', NOW), id)!.title).toBe('Lluvia');
  });

  it('hay un tope de proyectos', () => {
    let lib = emptyLibrary();
    for (let i = 0; i < MAX_PROJECTS; i++) lib = createRhythmProject(lib, 'r', 'es', NOW).lib;
    const over = createRhythmProject(lib, 'r', 'es', NOW);
    expect(over.id).toBeNull();
    expect(over.lib).toBe(lib);
  });

  it('borrar quita solo ese proyecto', () => {
    let { lib, id } = make();
    lib = createRhythmProject(lib, 'Otro', 'es', NOW).lib;
    const left = deleteProject(lib, id);
    expect(left.projects.map((p) => p.title)).toEqual(['Otro']);
  });
});

describe('duplicar y versiones', () => {
  it('duplicar copia las escenas sin compartir datos y sin versiones', () => {
    let { lib, id } = make();
    lib = withCell(lib, id, 0);
    lib = saveVersion(lib, id, NOW + 2).lib;
    const r = duplicateProject(lib, id, '(otra idea)', NOW + 3);
    const copy = projectById(r.lib, r.id!)!;
    expect(copy.title).toBe('Mi ritmo (otra idea)');
    expect(copy.versions).toEqual([]);
    expect((copy.scenes[0] as RhythmScene).pattern.a[0]).toBe(true);
    const edited = withCell(r.lib, r.id!, 5);
    expect(rhythmOf(projectById(edited, id)!)!.pattern.a[5]).toBe(false);
  });

  it('las versiones se llaman A, B, C… y guardan una copia de ese momento', () => {
    let { lib, id } = make();
    lib = withCell(lib, id, 0);
    const a = saveVersion(lib, id, NOW + 2);
    lib = withCell(a.lib, id, 4);
    const b = saveVersion(lib, id, NOW + 3);
    const p = projectById(b.lib, id)!;
    expect(p.versions.map((v) => v.label)).toEqual(['A', 'B']);
    expect((p.versions[0]!.scenes[0] as RhythmScene).pattern.a[4]).toBe(false);
    expect((p.versions[1]!.scenes[0] as RhythmScene).pattern.a[4]).toBe(true);
    expect(isArtLibrary(b.lib)).toBe(true);
  });

  it('volver a una versión guarda antes lo de ahora: no se pierde nada', () => {
    let { lib, id } = make();
    lib = withCell(lib, id, 0);
    const a = saveVersion(lib, id, NOW + 2);
    lib = withCell(a.lib, id, 6);
    lib = restoreVersion(lib, id, a.versionId!, NOW + 4);
    const p = projectById(lib, id)!;
    expect((p.scenes[0] as RhythmScene).pattern.a[6]).toBe(false);
    expect((p.scenes[0] as RhythmScene).pattern.a[0]).toBe(true);
    // lo que había (con el pulso 7 encendido) quedó como versión B
    expect(p.versions.some((v) => (v.scenes[0] as RhythmScene).pattern.a[6])).toBe(true);
  });

  it('hay un tope de versiones: se descarta la más vieja', () => {
    let { lib, id } = make();
    for (let i = 0; i < MAX_VERSIONS + 3; i++) lib = saveVersion(lib, id, NOW + i).lib;
    const p = projectById(lib, id)!;
    expect(p.versions).toHaveLength(MAX_VERSIONS);
    expect(new Set(p.versions.map((v) => v.id)).size).toBe(MAX_VERSIONS);
  });

  it('borrar una versión no toca lo demás', () => {
    let { lib, id } = make();
    const a = saveVersion(lib, id, NOW);
    lib = deleteVersion(a.lib, id, a.versionId!);
    expect(projectById(lib, id)!.versions).toEqual([]);
    expect(projectById(lib, id)!.scenes).toHaveLength(1);
  });
});

describe('validación de lo guardado', () => {
  it('ida y vuelta por JSON sigue siendo válido', () => {
    let { lib, id } = make();
    lib = saveVersion(withCell(lib, id, 2), id, NOW + 5).lib;
    expect(isArtLibrary(JSON.parse(JSON.stringify(lib)))).toBe(true);
  });

  it('rechaza formato viejo, formas rotas, ids repetidos y valores fuera de rango', () => {
    const { lib } = make();
    expect(isArtLibrary(null)).toBe(false);
    expect(isArtLibrary({ ...lib, format: 2 })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: 'x' })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: [lib.projects[0], lib.projects[0]] })).toBe(false);
    const p = lib.projects[0]!;
    expect(isArtLibrary({ ...lib, projects: [{ ...p, lang: 'fr' }] })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: [{ ...p, scenes: [] }] })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: [{ ...p, scenes: [{ ...p.scenes[0], bpm: 300 }] }] })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: [{ ...p, scenes: [{ ...p.scenes[0], kit: { a: 'nada', b: 'palmas', c: 'sonaja', d: 'voz' } }] }] })).toBe(false);
    expect(isArtLibrary({ ...lib, projects: [{ ...p, scenes: [{ ...p.scenes[0], pattern: { a: [true], b: [], c: [], d: [] } }] }] })).toBe(false);
  });

  it('los textos ES/EN tienen lo mismo y nunca dicen «incorrecto» ni puntúan', () => {
    for (const lang of ['es', 'en'] as const) {
      const c = ARTE_COPY[lang];
      const all = JSON.stringify([c.intro, c.freeHint, c.gridHint, c.noCreations, c.emptyHint, c.noVersions, c.restoreNote, c.cover(0), c.cover(1), c.cover(3)]);
      expect(all).not.toMatch(/incorrect|wrong|mal\b|error|points: \d|puntos: \d/i);
    }
    expect(Object.keys(ARTE_COPY.es).sort()).toEqual(Object.keys(ARTE_COPY.en).sort());
    // cada una de las tres velocidades del taller (90, 120, 140) tiene un nombre distinto
    for (const lang of ['es', 'en'] as const) expect(new Set([90, 120, 140].map((b) => ARTE_COPY[lang].tempoWord(b))).size).toBe(3);
    expect(ARTE_COPY.es.cover(1)).toBe('1 creación');
    expect(ARTE_COPY.en.cover(2)).toBe('2 creations');
  });
});

import { describe, expect, it } from 'vitest';
import { toggleCell } from '@lee-conmigo/music-engine';
import {
  ENCOUNTERS, UNIT_ID, answerReturn, completeEncounter, deleteProject, emptyLibrary, ensureUnitProject, isArtLibrary, isDone, markHeard, markSilence, missingFor, patchUnit, projectById,
  saveVersion, unitOf, unitStars, updateScene, versionsDiffer, type ArtLibrary, type RhythmScene,
} from '../src/index.ts';

const NOW = 1_700_000_000_000;
const start = (): { lib: ArtLibrary; id: string } => {
  const r = ensureUnitProject(emptyLibrary(), 'Mi banda', 'es', NOW);
  return { lib: r.lib, id: r.project!.id };
};
const cell = (lib: ArtLibrary, id: string, track: 'a' | 'b' | 'c' | 'd', step: number): ArtLibrary => {
  const s: RhythmScene = projectById(lib, id)!.scenes[0]!;
  return updateScene(lib, id, 0, { ...s, pattern: toggleCell(s.pattern, track, step) }, NOW + 1);
};
const u = (lib: ArtLibrary) => unitOf(lib);
const project = (lib: ArtLibrary, id: string) => projectById(lib, id);

describe('arranque de la unidad', () => {
  it('crea el proyecto de la unidad una sola vez y lo recuerda', () => {
    const a = start();
    expect(u(a.lib).projectId).toBe(a.id);
    const again = ensureUnitProject(a.lib, 'otro', 'es', NOW + 5);
    expect(again.lib).toBe(a.lib);
    expect(again.project!.id).toBe(a.id);
    expect(isArtLibrary(a.lib)).toBe(true);
  });

  it('si el proyecto se borró, se crea uno nuevo y se conserva el resto del avance', () => {
    let { lib, id } = start();
    lib = cell(lib, id, 'a', 0);
    lib = patchUnit(lib, { intention: 'calm' }, NOW);
    lib = deleteProject(lib, id);
    const r = ensureUnitProject(lib, 'Mi banda', 'es', NOW + 9);
    // el proyecto nuevo está en blanco (aunque el id se reutilice, no hereda lo borrado)
    expect(r.project!.scenes[0]!.pattern.a.some(Boolean)).toBe(false);
    expect(u(r.lib).intention).toBe('calm');
    expect(u(r.lib).projectId).toBe(r.project!.id);
  });

  it('una biblioteca guardada antes de AR-04 (sin «units») sigue siendo válida y la unidad empieza vacía', () => {
    const lib = emptyLibrary();
    expect('units' in lib).toBe(false);
    expect(isArtLibrary(lib)).toBe(true);
    expect(u(lib).done).toEqual([]);
    expect(UNIT_ID).toBe('A1-U04');
  });
});

describe('encuentro 1: escuchar', () => {
  it('pide haber escuchado una capa sola y señalar dónde vuelve el patrón', () => {
    let { lib, id } = start();
    expect(missingFor('listen', u(lib), project(lib, id))).toEqual(['heard', 'return']);
    lib = markHeard(lib, 'b', NOW);
    lib = markHeard(lib, 'b', NOW); // repetir no suma
    expect(u(lib).heard).toEqual(['b']);
    expect(markHeard(lib, 'd', NOW)).toBe(lib); // la capa D no está en el ejemplo
    const wrong = answerReturn(lib, 4, NOW);
    expect(wrong.ok).toBe(false);
    expect(wrong.lib).toBe(lib);
    const right = answerReturn(lib, 0, NOW);
    expect(right.ok).toBe(true);
    expect(missingFor('listen', u(right.lib), project(right.lib, id))).toEqual([]);
  });
});

describe('encuentros 2 y 3: armar y dejar silencio', () => {
  it('armar pide al menos un cuadro y una intención (no «cuantos más, mejor»)', () => {
    let { lib, id } = start();
    expect(missingFor('build', u(lib), project(lib, id))).toEqual(['pattern', 'intention']);
    lib = cell(lib, id, 'a', 0);
    lib = patchUnit(lib, { intention: 'happy' }, NOW);
    expect(missingFor('build', u(lib), project(lib, id))).toEqual([]);
    // un solo cuadro basta, y llenar todo no cambia lo que se pide
    for (let s = 1; s < 8; s++) lib = cell(lib, id, 'a', s);
    expect(missingFor('build', u(lib), project(lib, id))).toEqual([]);
  });

  it('el silencio solo se puede marcar donde no suena nada', () => {
    let { lib, id } = start();
    lib = cell(lib, id, 'a', 0);
    lib = cell(lib, id, 'a', 4);
    expect(markSilence(lib, 4, NOW).ok).toBe(false); // ahí suena
    expect(markSilence(lib, 99, NOW).ok).toBe(false);
    const ok = markSilence(lib, 2, NOW);
    expect(ok.ok).toBe(true);
    expect(missingFor('silence', u(ok.lib), project(ok.lib, id))).toEqual([]);
  });

  it('si después enciende un cuadro en el pulso del silencio, vuelve a faltar elegir otro', () => {
    let { lib, id } = start();
    lib = cell(lib, id, 'a', 0);
    lib = markSilence(lib, 2, NOW).lib;
    lib = cell(lib, id, 'b', 2);
    expect(missingFor('silence', u(lib), project(lib, id))).toEqual(['silenceMark']);
  });
});

describe('encuentros 4, 5 y 6', () => {
  it('agregar otra capa pide dos capas con sonido y una observación', () => {
    let { lib, id } = start();
    lib = cell(lib, id, 'a', 0);
    expect(missingFor('layer', u(lib), project(lib, id))).toEqual(['layers', 'layerNote']);
    lib = cell(lib, id, 'b', 2);
    lib = patchUnit(lib, { layerNote: 'different' }, NOW);
    expect(missingFor('layer', u(lib), project(lib, id))).toEqual([]);
  });

  it('comparar versiones pide dos que suenen distinto (guardar la misma dos veces no cuenta)', () => {
    let { lib, id } = start();
    lib = cell(lib, id, 'a', 0);
    lib = saveVersion(lib, id, NOW + 2).lib;
    lib = saveVersion(lib, id, NOW + 3).lib;
    expect(versionsDiffer(project(lib, id)!)).toBe(false);
    lib = cell(lib, id, 'a', 4);
    lib = saveVersion(lib, id, NOW + 4).lib;
    expect(versionsDiffer(project(lib, id)!)).toBe(true);
    expect(missingFor('versions', u(lib), project(lib, id))).toEqual(['reason']);
    lib = patchUnit(lib, { versionReason: 'silence' }, NOW);
    expect(missingFor('versions', u(lib), project(lib, id))).toEqual([]);
  });

  it('presentar pide elegir qué contar', () => {
    const { lib, id } = start();
    expect(missingFor('present', u(lib), project(lib, id))).toEqual(['note']);
    expect(missingFor('present', u(patchUnit(lib, { presentNote: 'silence' }, NOW)), project(lib, id))).toEqual([]);
  });
});

describe('completar y estrellas por esfuerzo', () => {
  it('no se marca un encuentro al que le falta algo, y se puede marcar en cualquier orden', () => {
    let { lib, id } = start();
    expect(completeEncounter(lib, 'listen', NOW)).toBe(lib);
    lib = patchUnit(lib, { presentNote: 'repeat' }, NOW);
    lib = completeEncounter(lib, 'present', NOW);
    expect(u(lib).done).toEqual(['present']);
    expect(completeEncounter(lib, 'present', NOW)).toBe(lib); // ya estaba
    lib = cell(lib, id, 'a', 0);
    lib = patchUnit(lib, { intention: 'walk' }, NOW);
    lib = completeEncounter(lib, 'build', NOW);
    expect(u(lib).done).toEqual(['build', 'present']); // siempre en el orden de la unidad
  });

  it('las estrellas premian explorar, comparar y explicar; nunca la cantidad de cuadros', () => {
    let { lib, id } = start();
    expect(unitStars(u(lib), project(lib, id)).total).toBe(0);
    // llenar el tablero entero no da estrellas
    for (const t of ['a', 'b', 'c', 'd'] as const) for (let s = 0; s < 8; s++) lib = cell(lib, id, t, s);
    expect(unitStars(u(lib), project(lib, id)).total).toBe(0);
    lib = markHeard(lib, 'a', NOW);
    lib = answerReturn(lib, 0, NOW).lib;
    lib = patchUnit(lib, { intention: 'calm' }, NOW);
    lib = completeEncounter(lib, 'listen', NOW);
    lib = completeEncounter(lib, 'build', NOW);
    expect(unitStars(u(lib), project(lib, id))).toMatchObject({ explored: true, compared: false, explained: false, total: 1 });
    lib = saveVersion(lib, id, NOW + 2).lib;
    lib = cell(lib, id, 'a', 0);
    lib = saveVersion(lib, id, NOW + 3).lib;
    lib = patchUnit(lib, { versionReason: 'even' }, NOW);
    expect(unitStars(u(lib), project(lib, id)).total).toBe(3);
  });

  it('la unidad está hecha solo con los seis encuentros', () => {
    expect(isDone({ ...u(emptyLibrary()), done: [...ENCOUNTERS] })).toBe(true);
    expect(isDone({ ...u(emptyLibrary()), done: ENCOUNTERS.slice(1) })).toBe(false);
  });
});

describe('guardado', () => {
  it('ida y vuelta por JSON; rechaza avance roto', () => {
    let { lib, id } = start();
    lib = markHeard(lib, 'a', NOW);
    lib = cell(lib, id, 'a', 3);
    expect(isArtLibrary(JSON.parse(JSON.stringify(lib)))).toBe(true);
    const bad = (patch: object) => ({ ...lib, units: { [UNIT_ID]: { ...u(lib), ...patch } } });
    expect(isArtLibrary(bad({ intention: 'raro' }))).toBe(false);
    expect(isArtLibrary(bad({ done: ['listen', 'listen'] }))).toBe(false);
    expect(isArtLibrary(bad({ silenceStep: 9 }))).toBe(false);
    expect(isArtLibrary(bad({ heard: ['d'] }))).toBe(false);
    expect(isArtLibrary({ ...lib, units: 'x' })).toBe(false);
  });
});

describe('textos de la unidad', () => {
  it('ES y EN tienen las mismas claves y nunca dicen «incorrecto» ni «mal»', async () => {
    const { UNIT_COPY } = await import('../src/index.ts');
    expect(Object.keys(UNIT_COPY.es).sort()).toEqual(Object.keys(UNIT_COPY.en).sort());
    for (const lang of ['es', 'en'] as const) {
      const c = UNIT_COPY[lang];
      const all = JSON.stringify([c.returnHint, c.returnOk, c.silenceBusy, c.layerFeedback, c.missing, c.reasons, c.layerNotes, c.capsuleText, c.doneText]);
      expect(all).not.toMatch(/incorrect|wrong|\bmal\b|error|puntos|points/i);
      for (const e of ENCOUNTERS) expect(c.encounters[e].title.length).toBeGreaterThan(0);
    }
    // la cápsula provisional dice claramente que es inventada
    expect(UNIT_COPY.es.capsuleTag).toMatch(/inventad/i);
    expect(UNIT_COPY.en.capsuleTag).toMatch(/made-up/i);
  });
});

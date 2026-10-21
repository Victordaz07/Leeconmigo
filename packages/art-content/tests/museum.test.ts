import { describe, expect, it } from 'vitest';
import { FRAME_IDS, MUSEUM_COPY, createCollageProject, createPaintProject, createRhythmProject, emptyLibrary, frameOf, isArtLibrary, museumWorks, setFrame, duplicateProject } from '../src/index.ts';

const build = () => {
  let lib = emptyLibrary();
  lib = createPaintProject(lib, 'P', 'es', 100).lib;
  lib = createCollageProject(lib, 'C', 'es', 200).lib;
  lib = createRhythmProject(lib, 'R', 'es', 300).lib;
  return lib;
};

describe('Mi museo', () => {
  it('el marco por defecto es estable y es uno de los cuatro', () => {
    const lib = build();
    for (const p of lib.projects) {
      expect(FRAME_IDS).toContain(frameOf(p));
      expect(frameOf(p)).toBe(frameOf({ ...p }));
    }
  });
  it('elegir un marco lo guarda; elegir el mismo no cambia nada', () => {
    const lib = build();
    const id = lib.projects[0]!.id;
    const next = setFrame(lib, id, 'violet', 999);
    expect(frameOf(next.projects.find((p) => p.id === id)!)).toBe('violet');
    expect(setFrame(next, id, 'violet', 1000)).toBe(next);
    expect(isArtLibrary(next)).toBe(true);
  });
  it('un marco inválido guardado se rechaza; lo guardado antes (sin marco) sigue válido', () => {
    const lib = build();
    expect(isArtLibrary(lib)).toBe(true);
    const bad = { ...lib, projects: [{ ...lib.projects[0]!, frame: 'rojo' }] };
    expect(isArtLibrary(bad)).toBe(false);
  });
  it('la copia conserva el marco', () => {
    const lib = setFrame(build(), 'p1', 'yellow', 5);
    const id = lib.projects.find((p) => p.frame === 'yellow')!.id;
    const r = duplicateProject(lib, id, 'copia', 10);
    expect(frameOf(r.lib.projects.find((p) => p.id === r.id)!)).toBe('yellow');
  });
  it('la pared muestra lo más reciente primero y filtra por tipo', () => {
    const lib = build();
    expect(museumWorks(lib, 'all').map((p) => p.title)).toEqual(['R', 'C', 'P']);
    expect(museumWorks(lib, 'painting').map((p) => p.title)).toEqual(['P']);
    expect(museumWorks(lib, 'collage')).toHaveLength(1);
    expect(museumWorks(lib, 'rhythm')).toHaveLength(1);
  });
  it('los textos existen en los dos idiomas con los mismos marcos y filtros', () => {
    expect(Object.keys(MUSEUM_COPY.es.frames)).toEqual(Object.keys(MUSEUM_COPY.en.frames));
    expect(Object.keys(MUSEUM_COPY.es.filters)).toEqual(Object.keys(MUSEUM_COPY.en.filters));
  });
});

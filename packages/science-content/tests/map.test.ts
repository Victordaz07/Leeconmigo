import { describe, expect, it } from 'vitest';
import { LAB_FAMILIES, mapProblems, pilotUnits, SCIENCE_AREAS, SCIENCE_MAP, scienceUnitById, unitsForArea, unitsForGrade, type ScienceMap } from '../src/index.ts';

/** Expectativas de desempeño NGSS por grado (K-5 completas). Si el mapa deja una fuera, esta prueba lo dice. */
const OFFICIAL: Record<number, string[]> = {
  1: ['1-PS4-1', '1-PS4-2', '1-PS4-3', '1-PS4-4', '1-LS1-1', '1-LS1-2', '1-LS3-1', '1-ESS1-1', '1-ESS1-2'],
  2: ['2-PS1-1', '2-PS1-2', '2-PS1-3', '2-PS1-4', '2-LS2-1', '2-LS2-2', '2-LS4-1', '2-ESS1-1', '2-ESS2-1', '2-ESS2-2', '2-ESS2-3'],
  3: ['3-PS2-1', '3-PS2-2', '3-PS2-3', '3-PS2-4', '3-LS1-1', '3-LS2-1', '3-LS3-1', '3-LS3-2', '3-LS4-1', '3-LS4-2', '3-LS4-3', '3-LS4-4', '3-ESS2-1', '3-ESS2-2', '3-ESS3-1'],
  4: ['4-PS3-1', '4-PS3-2', '4-PS3-3', '4-PS3-4', '4-PS4-1', '4-PS4-2', '4-PS4-3', '4-LS1-1', '4-LS1-2', '4-ESS1-1', '4-ESS2-1', '4-ESS2-2', '4-ESS3-1', '4-ESS3-2'],
  5: ['5-PS1-1', '5-PS1-2', '5-PS1-3', '5-PS1-4', '5-PS2-1', '5-PS3-1', '5-LS1-1', '5-LS2-1', '5-ESS1-1', '5-ESS1-2', '5-ESS2-1', '5-ESS2-2', '5-ESS3-1'],
};

describe('mapa curricular de Ciencia (48 unidades)', () => {
  it('es válido: 8 unidades por grado, ids estables, textos en los dos idiomas, códigos con su grado', () => {
    expect(mapProblems(SCIENCE_MAP)).toEqual([]);
    expect(SCIENCE_MAP.units).toHaveLength(48);
    for (let g = 1; g <= 6; g++) expect(unitsForGrade(g)).toHaveLength(8);
  });

  it('cubre TODAS las expectativas NGSS de 1.º a 5.º (ninguna se cae del mapa) y no repite unidades dentro de un grado', () => {
    for (const g of [1, 2, 3, 4, 5]) {
      const used = new Set(unitsForGrade(g).flatMap((u) => u.standards));
      expect([...OFFICIAL[g]].filter((s) => !used.has(s)), `${g}.º sin cubrir`).toEqual([]);
      expect([...used].filter((s) => !OFFICIAL[g].includes(s)), `${g}.º con códigos que no existen`).toEqual([]);
    }
  });

  it('las seis unidades piloto cubren seis edades', () => {
    expect(pilotUnits().map((u) => u.id)).toEqual(['C1-U02', 'C2-U02', 'C3-U06', 'C4-U06', 'C5-U02', 'C6-U04']);
    expect(new Set(pilotUnits().map((u) => u.grade)).size).toBe(6);
  });

  it('las cuatro áreas existen y cada grado toca al menos tres (Ingeniería reaparece, no es una pestaña aparte)', () => {
    for (const a of SCIENCE_AREAS) expect(unitsForArea(a).length, a).toBeGreaterThan(0);
    for (let g = 1; g <= 6; g++) expect(new Set(unitsForGrade(g).map((u) => u.area)).size, `${g}.º`).toBeGreaterThanOrEqual(3);
    expect(unitsForArea('ingenieria').map((u) => u.grade).sort()).toEqual([1, 3, 4, 6]);
  });

  it('cada familia de laboratorio la usa al menos una unidad, y las pilotos ya saben cuáles necesitan', () => {
    const used = new Set(SCIENCE_MAP.units.flatMap((u) => u.labs));
    for (const l of LAB_FAMILIES) expect(used.has(l), l).toBe(true);
    for (const u of pilotUnits()) expect(u.labs.length, u.id).toBeGreaterThan(0);
  });

  it('las precauciones editoriales del informe están en sus unidades', () => {
    expect(scienceUnitById('C5-U02')?.caution).toMatch(/densidad/);
    expect(scienceUnitById('C6-U03')?.caution).toMatch(/familias humanas/);
    expect(scienceUnitById('C6-U07')?.caution).toMatch(/día caluroso/);
  });

  it('el validador detecta errores', () => {
    const bad = JSON.parse(JSON.stringify(SCIENCE_MAP)) as ScienceMap;
    bad.units[0].standards = ['2-PS1-1'];
    bad.units[1].title.en = '';
    bad.units[2].id = bad.units[3].id;
    bad.units.pop();
    const p = mapProblems(bad).join(' | ');
    expect(p).toMatch(/no es de 1\.º/);
    expect(p).toMatch(/falta título en/);
    expect(p).toMatch(/id repetido/);
    expect(p).toMatch(/6\.º tiene 7 unidades/);
  });
});

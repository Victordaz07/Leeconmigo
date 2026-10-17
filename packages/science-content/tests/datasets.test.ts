import { describe, expect, it } from 'vitest';
import { bandCount, DIDACTIC, inBand, LADERA_DATASETS, practiceMapProblems, PRACTICE_MAPS, provenanceLabel, quakesByZone, zoneOf } from '../src/index.ts';

describe('conjuntos de datos de las bandejas', () => {
  it('salen del modelo y coinciden con la especificación §4', () => {
    const rows = (k: string) => Object.fromEntries(LADERA_DATASETS[k].rows.map((r) => [r.id, r.values]));
    expect(rows('base')).toEqual({ ninguna: [18, 20, 19], completa: [6, 7, 5] });
    expect(rows('mixta')).toEqual({ A: [28, 30, 29], B: [4, 5, 3] });
    expect(rows('justaCobertura')).toEqual({ A: [28, 30, 29], B: [9, 10, 8] });
    expect(rows('justaPendiente')).toEqual({ A: [18, 20, 19], B: [29, 30, 28] });
  });

  it('TODO dato lleva procedencia y hoy todo es didáctico, rotulado en los dos idiomas (nunca real inventado)', () => {
    for (const d of Object.values(LADERA_DATASETS)) {
      expect(d.provenance.kind, d.id).toBe('didactic');
      expect(provenanceLabel(d.provenance).es).toMatch(/práctica/);
      expect(provenanceLabel(d.provenance).en).toMatch(/[Pp]ractice/);
    }
    expect(provenanceLabel({ kind: 'real', source: 'USGS', url: 'https://example.org', date: '2026-01-01', license: 'PD' }).es).toContain('USGS');
    expect(provenanceLabel({ kind: 'observed' }).es).toBe('Lo observaste tú');
  });
});

describe('mapas de práctica', () => {
  it('son válidos (cordillera, volcanes sobre ella, ≥ 80 % de sismos en la franja y al menos uno lejos)', () => {
    for (const m of Object.values(PRACTICE_MAPS)) expect(practiceMapProblems(m), m.id).toEqual([]);
  });

  it('el recuento coincide con la especificación: mapa A 13 de 15 y mapa B 10 de 12', () => {
    expect(bandCount(PRACTICE_MAPS.A)).toEqual({ inside: 13, total: 15 });
    expect(bandCount(PRACTICE_MAPS.B)).toEqual({ inside: 10, total: 12 });
    expect(PRACTICE_MAPS.A.volcanoes).toHaveLength(3);
    expect(PRACTICE_MAPS.B.volcanoes).toHaveLength(2);
  });

  it('T4: en el mapa B la respuesta «cerca de la cordillera» tiene más sismos que la llanura y el mar juntos', () => {
    const z = quakesByZone(PRACTICE_MAPS.B);
    expect(z).toEqual({ cerca: 10, llanura: 1, mar: 1 });
    expect(z.cerca).toBeGreaterThan(z.llanura + z.mar);
  });

  it('la franja incluye la diagonal y las zonas se reparten bien', () => {
    expect(inBand(PRACTICE_MAPS.A, { col: 3, row: 3 })).toBe(true); // diagonal de (3,2) y (4,3)
    expect(inBand(PRACTICE_MAPS.A, { col: 10, row: 1 })).toBe(false);
    expect(zoneOf(PRACTICE_MAPS.B, { col: 1, row: 2 })).toBe('mar');
    expect(zoneOf(PRACTICE_MAPS.B, { col: 4, row: 5 })).toBe('llanura');
    expect(zoneOf(PRACTICE_MAPS.B, { col: 9, row: 3 })).toBe('cerca');
  });

  it('todo mapa lleva el aviso «no es un lugar real» en los dos idiomas', () => {
    for (const m of Object.values(PRACTICE_MAPS)) {
      expect(m.disclaimer.es).toBe('Mapa de práctica: no es un lugar real');
      expect(m.disclaimer.en).toBe('Practice map: not a real place');
      expect(m.provenance).toBe(DIDACTIC);
    }
  });

  it('el validador detecta mapas malos', () => {
    const bad = JSON.parse(JSON.stringify(PRACTICE_MAPS.A));
    bad.volcanoes.push({ col: 0, row: 7 }); // fuera de la cordillera
    bad.earthquakes.push({ col: 2, row: 2 }); // repetido
    bad.earthquakes.push({ col: 99, row: 0 }); // fuera de la cuadrícula
    const p = practiceMapProblems(bad).join(' | ');
    expect(p).toMatch(/no está sobre la cordillera/);
    expect(p).toMatch(/repetido/);
    expect(p).toMatch(/fuera de la cuadrícula/);
    const all = JSON.parse(JSON.stringify(PRACTICE_MAPS.A));
    all.earthquakes = all.earthquakes.filter((e: { col: number; row: number }) => !(e.col === 10 && e.row === 1) && !(e.col === 1 && e.row === 6));
    expect(practiceMapProblems(all).join(' | ')).toMatch(/«todos», no «casi todos»/);
  });
});

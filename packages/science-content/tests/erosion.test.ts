import { describe, expect, it } from 'vitest';
import { COVERS, EROSION_MODEL, fairTest, offsetFor, runTrials, SLOPES, sedimentGrams, turbidity, type TrayConfig } from '../src/index.ts';

const cfg = (cover: TrayConfig['cover'], slope: TrayConfig['slope']): TrayConfig => ({ cover, slope });

describe('modelo de erosión (C4-U06 §3)', () => {
  it('da EXACTAMENTE los datos de la especificación (semilla 0)', () => {
    expect(runTrials(cfg('ninguna', 'media'), 'A', 0)).toEqual([18, 20, 19]);
    expect(runTrials(cfg('completa', 'media'), 'B', 0)).toEqual([6, 7, 5]);
    // ladera.mixta: cambian dos cosas.
    expect(runTrials(cfg('ninguna', 'fuerte'), 'A', 0)).toEqual([28, 30, 29]);
    expect(runTrials(cfg('completa', 'suave'), 'B', 0)).toEqual([4, 5, 3]);
    // ladera.justa.cobertura (pendiente fuerte) y ladera.justa.pendiente (sin cobertura).
    expect(runTrials(cfg('completa', 'fuerte'), 'B', 0)).toEqual([9, 10, 8]);
    expect(runTrials(cfg('ninguna', 'fuerte'), 'B', 0)).toEqual([29, 30, 28]);
    expect(runTrials(cfg('ninguna', 'media'), 'A', 0)).toEqual([18, 20, 19]);
  });

  it('es determinista: misma semilla y estado, mismos resultados', () => {
    for (const s of [0, 1, 7, -3]) expect(runTrials(cfg('parcial', 'media'), 'A', s)).toEqual(runTrials(cfg('parcial', 'media'), 'A', s));
  });

  it('el desvío de una repetición nunca pasa de ±1 g, con cualquier semilla (también negativa)', () => {
    for (const tray of ['A', 'B'] as const) for (let s = -9; s <= 9; s++) for (let t = 0; t < 6; t++) expect(Math.abs(offsetFor(tray, s, t))).toBeLessThanOrEqual(1);
  });

  it('para una pendiente fija: ninguna > parcial > completa EN CADA PRUEBA, no solo en el promedio', () => {
    for (const slope of SLOPES) for (const seed of [0, 1, 2]) for (const trial of [0, 1, 2]) {
      const g = COVERS.map((c) => sedimentGrams(cfg(c, slope), 'A', seed, trial));
      expect(g[0], `${slope} s${seed} t${trial}`).toBeGreaterThan(g[1]);
      expect(g[1]).toBeGreaterThan(g[2]);
    }
  });

  it('para una cobertura fija: suave < media < fuerte EN CADA PRUEBA', () => {
    for (const cover of COVERS) for (const seed of [0, 1, 2]) for (const trial of [0, 1, 2]) {
      const g = SLOPES.map((s) => sedimentGrams(cfg(cover, s), 'B', seed, trial));
      expect(g[0], `${cover} s${seed} t${trial}`).toBeLessThan(g[1]);
      expect(g[1]).toBeLessThan(g[2]);
    }
  });

  it('casos límite: el máximo y el mínimo, y nunca fuera de 0–40 g', () => {
    const all = COVERS.flatMap((c) => SLOPES.flatMap((s) => [0, 1, 2].flatMap((seed) => [0, 1, 2].flatMap((t) => (['A', 'B'] as const).map((tray) => sedimentGrams(cfg(c, s), tray, seed, t))))));
    expect(Math.max(...all)).toBe(30); // 29 + 1: fuerte + ninguna
    expect(Math.min(...all)).toBe(3); // 4 − 1: suave + completa
    for (const g of all) expect(g >= 0 && g <= 40).toBe(true);
  });

  it('lo que se ve en el vaso: ≤ 7 poca · 8–17 algo · ≥ 18 mucha tierra', () => {
    expect([5, 6, 7].map(turbidity)).toEqual(['poca', 'poca', 'poca']);
    expect([8, 11, 17].map(turbidity)).toEqual(['algo', 'algo', 'algo']);
    expect([18, 20, 30].map(turbidity)).toEqual(['mucha', 'mucha', 'mucha']);
    // El caso de S2: sin cobertura se ve mucha tierra y con cobertura poca.
    expect(runTrials(cfg('ninguna', 'media'), 'A', 0).map(turbidity)).toEqual(['mucha', 'mucha', 'mucha']);
    expect(runTrials(cfg('completa', 'media'), 'B', 0).map(turbidity)).toEqual(['poca', 'poca', 'poca']);
  });

  it('prueba justa: avisa cuando cambian dos cosas (como pista, no como error) y reconoce una sola', () => {
    expect(fairTest(cfg('ninguna', 'media'), cfg('completa', 'media'))).toEqual({ changed: ['cover'], fair: true });
    expect(fairTest(cfg('ninguna', 'media'), cfg('ninguna', 'fuerte'))).toEqual({ changed: ['slope'], fair: true });
    expect(fairTest(cfg('ninguna', 'fuerte'), cfg('completa', 'suave'))).toEqual({ changed: ['cover', 'slope'], fair: false });
    expect(fairTest(cfg('parcial', 'media'), cfg('parcial', 'media'))).toEqual({ changed: [], fair: false });
  });

  it('el modelo declara qué representa, sus supuestos y lo que NO representa, en los dos idiomas', () => {
    const texts = [EROSION_MODEL.represents, ...EROSION_MODEL.assumptions, ...EROSION_MODEL.doesNotRepresent, EROSION_MODEL.unit];
    for (const t of texts) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
    expect(EROSION_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(4);
    expect(EROSION_MODEL.unit.es).toMatch(/práctica/);
  });
});

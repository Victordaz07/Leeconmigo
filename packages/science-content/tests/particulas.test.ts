import { describe, expect, it } from 'vitest';
import { AIR_COUNT, DYE_COUNT, DYE_SPREAD, DYE_STEPS, FACT_TEXT, PARTICLE_MODEL, SYRINGE_GAP, SYRINGE_POSITIONS, WATER_COUNT, airDots, meanNearest, meanPairDistance, soluteDots, waterDots } from '../src/labs/particulas.ts';

describe('modelo de puntitos', () => {
  it('siempre hay los mismos puntitos: ninguno se crea ni se pierde', () => {
    for (const s of DYE_STEPS) expect(soluteDots(s)).toHaveLength(DYE_COUNT);
    for (const p of SYRINGE_POSITIONS) expect(airDots(p)).toHaveLength(AIR_COUNT);
    expect(waterDots()).toHaveLength(WATER_COUNT);
  });
  it('el modelo es siempre el mismo (semilla fija)', () => {
    expect(soluteDots(2)).toEqual(soluteDots(2));
    expect(waterDots()).toEqual(waterDots());
  });
  it('el colorante se va repartiendo: cada paso los puntitos quedan más separados', () => {
    const d = DYE_STEPS.map((s) => meanPairDistance(soluteDots(s)));
    for (let i = 1; i < d.length; i++) expect(d[i]).toBeGreaterThan(d[i - 1]);
    expect(DYE_SPREAD[0]).toBe(0);
    expect(DYE_SPREAD[4]).toBe(1);
  });
  it('al terminar, el colorante llega a todo el vaso (no se queda en una esquina)', () => {
    const end = soluteDots(4);
    const xs = end.map((p) => p.x);
    expect(Math.min(...xs)).toBeLessThan(0.3);
    expect(Math.max(...xs)).toBeGreaterThan(0.7);
  });
  it('al apretar el émbolo los puntitos del aire se acercan (hay espacio entre ellos), sin cambiar su cantidad', () => {
    const near = SYRINGE_POSITIONS.map((p) => meanNearest(airDots(p)));
    expect(near[1]).toBeLessThan(near[0]);
    expect(near[2]).toBeLessThan(near[1]);
    expect(SYRINGE_GAP[1]).toBeLessThan(SYRINGE_GAP[3]);
  });
  it('todos los puntitos caben dentro del recuadro', () => {
    for (const d of [...waterDots(), ...soluteDots(0), ...soluteDots(4), ...airDots(1), ...airDots(3)]) {
      expect(d.x).toBeGreaterThanOrEqual(0);
      expect(d.x).toBeLessThanOrEqual(1);
      expect(d.y).toBeGreaterThanOrEqual(0);
      expect(d.y).toBeLessThanOrEqual(1);
    }
  });
  it('los textos existen en los dos idiomas y el modelo dice qué NO representa (átomos, tamaño real)', () => {
    for (const t of Object.values(FACT_TEXT)) expect(t.es.trim() && t.en.trim()).toBeTruthy();
    expect(PARTICLE_MODEL.doesNotRepresent.some((t) => /átomos/.test(t.es))).toBe(true);
    expect(PARTICLE_MODEL.doesNotRepresent.some((t) => /tamaño real/.test(t.es))).toBe(true);
  });
});

describe('textos de la tabla de fenómenos', () => {
  it('hay un nombre, lo que se ve y lo que hacen los puntitos en cada fenómeno, en ES y EN', async () => {
    const { PHENOMENA, PHENOMENON_NAME, DOTS_TEXT, FACT_TEXT } = await import('../src/labs/particulas.ts');
    for (const f of PHENOMENA) {
      for (const t of [PHENOMENON_NAME[f], DOTS_TEXT[f], FACT_TEXT[f]]) {
        expect(t.es.trim()).not.toBe('');
        expect(t.en.trim()).not.toBe('');
      }
    }
  });
});

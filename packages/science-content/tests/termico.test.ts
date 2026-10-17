import { describe, expect, it } from 'vitest';
import { CRITERION_MAX_RISE, designLabel, factorOf, MAX_LAYERS, meetsCriterion, riseAt10, temperatures, THERMAL_MODEL } from '../src/index.ts';

describe('modelo térmico de la funda aislante', () => {
  it('reproduce los datos del informe: sin funda 10/14/17, funda A 10/12/14, funda B 10/11/12', () => {
    expect(temperatures([])).toEqual([10, 14, 17]);
    expect(temperatures(['espuma'])).toEqual([10, 12, 14]);
    expect(temperatures(['espuma', 'espuma'])).toEqual([10, 11, 12]);
  });

  it('el aislante NO enfría: con cualquier funda la temperatura sigue subiendo, solo más despacio', () => {
    const control = temperatures([]);
    for (const layers of [['espuma'], ['fieltro'], ['aluminio'], ['espuma', 'fieltro', 'aluminio'], ['espuma', 'espuma', 'espuma']] as const) {
      const t = temperatures(layers);
      expect(t[0]).toBe(10);
      expect(t[1]).toBeGreaterThanOrEqual(t[0]);
      expect(t[2]).toBeGreaterThanOrEqual(t[1]);
      expect(t[2]).toBeGreaterThan(10); // nunca baja del inicio
      expect(t[2]).toBeLessThanOrEqual(control[2]);
    }
  });

  it('más capas frenan más; el orden no importa en este modelo', () => {
    expect(riseAt10(['espuma', 'espuma'])).toBeLessThan(riseAt10(['espuma']));
    expect(riseAt10(['espuma'])).toBeLessThan(riseAt10([]));
    expect(temperatures(['espuma', 'fieltro'])).toEqual(temperatures(['fieltro', 'espuma']));
    expect(factorOf(['espuma', 'espuma'])).toBeCloseTo(0.25);
  });

  it('el criterio del reto (subir como máximo 3 °C con hasta 3 capas) lo cumplen unos diseños y otros no', () => {
    expect(CRITERION_MAX_RISE).toBe(3);
    expect(MAX_LAYERS).toBe(3);
    expect(meetsCriterion(['espuma', 'espuma'])).toBe(true);
    expect(meetsCriterion(['fieltro', 'espuma'])).toBe(true);
    expect(meetsCriterion(['espuma'])).toBe(false);
    expect(meetsCriterion(['aluminio', 'aluminio', 'aluminio'])).toBe(false);
    expect(meetsCriterion(['espuma', 'espuma', 'espuma', 'espuma'])).toBe(false); // más de 3 capas
  });

  it('los diseños se nombran con palabras en los dos idiomas', () => {
    expect(designLabel([], 'es')).toBe('Sin funda');
    expect(designLabel(['espuma'], 'es')).toBe('1 capa de espuma');
    expect(designLabel(['espuma', 'espuma'], 'es')).toBe('2 capas de espuma');
    expect(designLabel(['espuma', 'fieltro'], 'en')).toBe('foam + felt');
    expect(THERMAL_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(3);
  });
});

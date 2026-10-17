import { describe, expect, it } from 'vitest';
import { MECHANISM, SERIES_AXIS, SERIES_IDS, SERIES_MODEL, SERIES_NAME, SERIES_UNIT, SERIES_VALUES, TREND_TEXT, YEARS, correlation, trendOf, trendOfSeries } from '../src/labs/series.ts';

describe('series de datos del clima', () => {
  it('todas las series tienen un valor por año y caben en su eje', () => {
    for (const id of SERIES_IDS) {
      expect(SERIES_VALUES[id], id).toHaveLength(YEARS.length);
      for (const v of SERIES_VALUES[id]) {
        expect(v, id).toBeGreaterThanOrEqual(SERIES_AXIS[id].min);
        expect(v, id).toBeLessThanOrEqual(SERIES_AXIS[id].max);
      }
    }
  });

  it('la temperatura y el CO2 suben; el Sol casi no cambia; las erupciones suben y bajan sin tendencia', () => {
    expect(trendOfSeries('temp')).toBe('sube');
    expect(trendOfSeries('co2')).toBe('sube');
    expect(trendOfSeries('sol')).toBe('plano');
    expect(trendOfSeries('volcanes')).toBe('irregular');
  });

  it('la temperatura sube más rápido en los últimos años', () => {
    const t = SERIES_VALUES.temp;
    const first = (t[3] - t[0]) / 3;
    const last = (t[6] - t[3]) / 3;
    expect(last).toBeGreaterThan(first * 2);
  });

  it('el CO2 sube junto con la temperatura (correlación alta); el Sol y las erupciones no', () => {
    expect(correlation(SERIES_VALUES.temp, SERIES_VALUES.co2)).toBeGreaterThan(0.9);
    expect(Math.abs(correlation(SERIES_VALUES.temp, SERIES_VALUES.sol))).toBeLessThan(0.5);
    expect(Math.abs(correlation(SERIES_VALUES.temp, SERIES_VALUES.volcanes))).toBeLessThan(0.7);
  });

  it('clasifica series de prueba', () => {
    expect(trendOf([1, 2, 3, 4])).toBe('sube');
    expect(trendOf([5, 5.01, 5, 5.02])).toBe('plano');
    expect(trendOf([1, 4, 1, 4, 1])).toBe('irregular');
  });

  it('hay nombres, unidades, el mecanismo en cinco pasos y los límites del modelo en ES y EN', () => {
    expect(MECHANISM).toHaveLength(5);
    for (const t of [...SERIES_IDS.flatMap((i) => [SERIES_NAME[i], SERIES_UNIT[i]]), ...Object.values(TREND_TEXT), ...MECHANISM, SERIES_MODEL.represents, ...SERIES_MODEL.assumptions, ...SERIES_MODEL.doesNotRepresent, ...SERIES_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
    expect(SERIES_MODEL.assumptions[0].es).toMatch(/inventados/);
  });
});

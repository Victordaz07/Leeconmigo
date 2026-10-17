import { describe, expect, it } from 'vitest';
import { AFTERNOON_C, CLIMATE_MODEL, CLIMATE_WORD, MAX_RAIN_DAYS, RAIN_DAYS, RAIN_TICK, SEASONS, SEASON_NAME, TOWNS, TOWN_NAME, alwaysDrier, barsComplete, barsOff, peakSeason, peakTown, valueOf } from '../src/labs/clima.ts';

describe('registro del tiempo y el clima de tres pueblos', () => {
  it('los datos caben en el eje y son enteros', () => {
    for (const t of TOWNS) for (const s of SEASONS) {
      expect(Number.isInteger(RAIN_DAYS[t][s])).toBe(true);
      expect(RAIN_DAYS[t][s]).toBeGreaterThanOrEqual(0);
      expect(RAIN_DAYS[t][s]).toBeLessThanOrEqual(MAX_RAIN_DAYS);
    }
    expect(MAX_RAIN_DAYS % RAIN_TICK).toBe(0);
  });

  it('Pueblo Azul llueve más en invierno y casi nada en verano', () => {
    expect(peakSeason('azul', 'lluvia')).toBe('invierno');
    expect(peakSeason('azul', 'lluvia', 'min')).toBe('verano');
    expect(peakSeason('azul', 'temp')).toBe('verano');
  });

  it('Pueblo Seco tiene menos lluvia que los otros en todas las estaciones y es el más caluroso', () => {
    expect(alwaysDrier('seco')).toBe(true);
    expect(alwaysDrier('azul')).toBe(false);
    for (const s of SEASONS) expect(peakTown(s, 'temp')).toBe('seco');
    expect(AFTERNOON_C.seco.verano).toBeGreaterThan(AFTERNOON_C.azul.verano);
  });

  it('Pueblo Alto es el más frío en invierno y el que más llueve en verano', () => {
    expect(peakTown('invierno', 'temp', 'min')).toBe('alto');
    expect(peakTown('verano', 'lluvia')).toBe('alto');
    expect(peakTown('invierno', 'lluvia')).toBe('azul');
    expect(valueOf('alto', 'invierno', 'temp')).toBe(0);
  });

  it('las barras del niño se comparan con el registro: solo marcan las que ya dibujó y no coinciden', () => {
    expect(barsOff('azul', {})).toEqual([]);
    expect(barsOff('azul', { invierno: 12, verano: 3 })).toEqual(['verano']);
    expect(barsComplete({ invierno: 12, primavera: 8, verano: 1 })).toBe(false);
    expect(barsComplete({ invierno: 12, primavera: 8, verano: 1, otono: 6 })).toBe(true);
    expect(barsOff('azul', { invierno: 12, primavera: 8, verano: 1, otono: 6 })).toEqual([]);
  });

  it('hay nombres, descripciones y límites del modelo en ES y EN', () => {
    for (const t of [...TOWNS.map((x) => TOWN_NAME[x]), ...SEASONS.map((x) => SEASON_NAME[x]), ...TOWNS.map((x) => CLIMATE_WORD[x]), CLIMATE_MODEL.represents, ...CLIMATE_MODEL.assumptions, ...CLIMATE_MODEL.doesNotRepresent, ...CLIMATE_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
    expect(CLIMATE_MODEL.doesNotRepresent[0].es).toMatch(/día en particular/);
  });
});

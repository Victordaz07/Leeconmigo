import { describe, expect, it } from 'vitest';
import { LAYERS, MAX_BPM, MIN_BPM, STEPS, activeCount, clampBpm, emptyPattern, isValidPattern, loopLengthSeconds, silentSteps, stepSeconds, toggleCell } from '../src/index.ts';

describe('patrón de ocho pulsos', () => {
  it('son 8 columnas y 4 filas, todas en silencio al empezar', () => {
    const p = emptyPattern();
    expect(STEPS).toBe(8);
    expect(LAYERS).toEqual(['grave', 'palmas', 'sonaja', 'voz']);
    expect(isValidPattern(p)).toBe(true);
    expect(activeCount(p)).toBe(0);
    expect(silentSteps(p)).toHaveLength(8);
  });

  it('encender y apagar una casilla devuelve un patrón nuevo sin tocar el anterior', () => {
    const a = emptyPattern();
    const b = toggleCell(a, 'grave', 0);
    expect(a.grave[0]).toBe(false);
    expect(b.grave[0]).toBe(true);
    expect(toggleCell(b, 'grave', 0).grave[0]).toBe(false);
    expect(() => toggleCell(a, 'voz', 8)).toThrow(RangeError);
    expect(() => toggleCell(a, 'voz', -1)).toThrow(RangeError);
  });

  it('los pasos en silencio son los pulsos donde ninguna capa suena', () => {
    let p = emptyPattern();
    p = toggleCell(p, 'grave', 0);
    p = toggleCell(p, 'palmas', 4);
    expect(silentSteps(p)).toEqual([1, 2, 3, 5, 6, 7]);
    expect(activeCount(p)).toBe(2);
  });

  it('el tempo va de 60 a 140 BPM y un paso es un pulso de negra', () => {
    expect(clampBpm(10)).toBe(MIN_BPM);
    expect(clampBpm(999)).toBe(MAX_BPM);
    expect(clampBpm(90.4)).toBe(90);
    expect(stepSeconds(60)).toBe(1);
    expect(stepSeconds(120)).toBe(0.5);
    expect(loopLengthSeconds(120)).toBe(4);
  });

  it('rechaza patrones mal formados', () => {
    expect(isValidPattern(null)).toBe(false);
    expect(isValidPattern({ grave: [], palmas: [], sonaja: [], voz: [] })).toBe(false);
    expect(isValidPattern({ ...emptyPattern(), voz: Array(8).fill(1) })).toBe(false);
  });
});

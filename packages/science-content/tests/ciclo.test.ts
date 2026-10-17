import { describe, expect, it } from 'vitest';
import { CYCLE_MODEL, DRIVER_NAME, FLOWS, MINIMAL_CYCLE, PIECES, PIECE_NAME, checkModel, driversIn, flowBetween, flowById, isClosedCycle, whyNotFlow } from '../src/labs/ciclo.ts';

describe('modelo del ciclo del agua', () => {
  it('hay ocho flechas y cada una va de una pieza a otra distinta, con un solo motor', () => {
    expect(FLOWS).toHaveLength(8);
    for (const f of FLOWS) {
      expect(f.from).not.toBe(f.to);
      expect(PIECES).toContain(f.from);
      expect(PIECES).toContain(f.to);
      expect(['sol', 'gravedad']).toContain(f.driver);
    }
    expect(new Set(FLOWS.map((f) => f.id)).size).toBe(FLOWS.length);
    expect(new Set(FLOWS.map((f) => `${f.from}>${f.to}`)).size).toBe(FLOWS.length);
  });
  it('el Sol sube el agua (evaporación y transpiración) y la gravedad la baja', () => {
    expect(FLOWS.filter((f) => f.driver === 'sol').map((f) => f.id)).toEqual(['evaporacion', 'transpiracion']);
    for (const f of FLOWS.filter((x) => x.driver === 'sol')) expect(f.to).toBe('nube');
    for (const id of ['lluviaMontana', 'lluviaMar', 'escorrentia', 'desembocadura', 'infiltracion', 'subterranea']) expect(flowById(id)?.driver).toBe('gravedad');
  });
  it('flowBetween encuentra el flujo y no inventa los que no existen', () => {
    expect(flowBetween('mar', 'nube')?.id).toBe('evaporacion');
    expect(flowBetween('nube', 'montana')?.id).toBe('lluviaMontana');
    expect(flowBetween('mar', 'montana')).toBeUndefined();
    expect(flowBetween('rio', 'nube')).toBeUndefined();
  });
  it('un ciclo cerrado vuelve al mar; sin esa vuelta no está cerrado', () => {
    expect(isClosedCycle(MINIMAL_CYCLE)).toBe(true);
    expect(isClosedCycle(['evaporacion', 'lluviaMontana', 'escorrentia', 'desembocadura'])).toBe(true);
    expect(isClosedCycle(['evaporacion', 'lluviaMontana', 'escorrentia'])).toBe(false);
    expect(isClosedCycle(['escorrentia', 'desembocadura'])).toBe(false);
    expect(isClosedCycle([])).toBe(false);
  });
  it('un modelo vale con el ciclo cerrado y los dos motores', () => {
    expect(checkModel(MINIMAL_CYCLE)).toEqual({ closed: true, hasSun: true, hasGravity: true, ok: true });
    expect(checkModel(['evaporacion']).ok).toBe(false);
    expect(checkModel(['lluviaMar', 'escorrentia']).hasSun).toBe(false);
    expect(driversIn(['evaporacion', 'lluviaMar'])).toEqual(['sol', 'gravedad']);
    expect(driversIn(['transpiracion'])).toEqual(['sol']);
  });
  it('las flechas imposibles dan una razón de acompañamiento (sin «incorrecto»)', () => {
    for (const a of PIECES) for (const b of PIECES) {
      if (flowBetween(a, b)) continue;
      const w = whyNotFlow(a, b);
      expect(w.es.trim() && w.en.trim()).toBeTruthy();
      expect(w.es + w.en).not.toMatch(/incorrect/i);
    }
  });
  it('los textos existen en los dos idiomas y el modelo dice qué NO representa', () => {
    for (const f of FLOWS) expect(f.name.es.trim() && f.name.en.trim()).toBeTruthy();
    for (const p of PIECES) expect(PIECE_NAME[p].es && PIECE_NAME[p].en).toBeTruthy();
    for (const d of Object.values(DRIVER_NAME)) expect(d.es && d.en).toBeTruthy();
    expect(CYCLE_MODEL.doesNotRepresent.some((t) => /cuánta agua/i.test(t.es))).toBe(true);
  });
});

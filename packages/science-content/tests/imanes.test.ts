import { describe, expect, it } from 'vitest';
import { ATTRACTED, MAGNET_MARKS, MAGNET_MODEL, MAGNET_OBJECTS, MAGNET_REACH, magnetMoves } from '../src/index.ts';

describe('modelo de fuerzas e imanes', () => {
  it('el clavo se mueve cerca (marcas 1–3) y no lejos (4–5); la llave llega menos lejos', () => {
    expect(MAGNET_MARKS.map((m) => magnetMoves('clavo', m))).toEqual([true, true, true, false, false]);
    expect(MAGNET_MARKS.map((m) => magnetMoves('llave', m))).toEqual([true, true, false, false, false]);
  });

  it('un imán NO atrae todo: el plástico y el aluminio nunca se mueven, a ninguna distancia', () => {
    for (const m of MAGNET_MARKS) {
      expect(magnetMoves('bloque', m)).toBe(false);
      expect(magnetMoves('aluminio', m)).toBe(false);
    }
    expect(ATTRACTED).toEqual(['clavo', 'llave']);
    expect(MAGNET_OBJECTS.filter((o) => MAGNET_REACH[o] === 0)).toEqual(['bloque', 'aluminio']);
  });

  it('una marca fuera del recorrido nunca mueve nada', () => {
    expect(magnetMoves('clavo', 0)).toBe(false);
    expect(magnetMoves('clavo', 6)).toBe(false);
  });

  it('el modelo dice qué NO representa (no mide fuerza, no hay otros imanes, no todos los metales)', () => {
    expect(MAGNET_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(3);
    expect(MAGNET_MODEL.doesNotRepresent.some((t) => /aluminio/.test(t.es))).toBe(true);
  });
});

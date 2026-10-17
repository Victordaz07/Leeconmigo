import { describe, expect, it } from 'vitest';
import { BLOCK_SLIDE_CM, RAMP_MODEL, RELEASE_MARKS, SOUND_WORD, SPEED_WORD, isMark, pushesFarther, slideCm, slides } from '../src/labs/choques.ts';

describe('modelo de la rampa y los choques', () => {
  it('hay cuatro marcas y cada una empuja el bloque más lejos que la anterior', () => {
    expect([...RELEASE_MARKS]).toEqual([1, 2, 3, 4]);
    for (let i = 1; i < RELEASE_MARKS.length; i++) expect(pushesFarther(RELEASE_MARKS[i], RELEASE_MARKS[i - 1])).toBe(true);
    expect(pushesFarther(1, 4)).toBe(false);
  });
  it('las distancias son centímetros enteros y los textos que citan las tareas coinciden', () => {
    for (const m of RELEASE_MARKS) expect(Number.isInteger(slideCm(m))).toBe(true);
    expect(BLOCK_SLIDE_CM).toEqual({ 1: 4, 2: 9, 3: 15, 4: 22 });
  });
  it('la tabla de un niño sale en orden de marca', () => {
    expect(slides([4, 1, 3])).toEqual([4, 15, 22]);
  });
  it('las palabras de rapidez y de sonido existen en los dos idiomas', () => {
    for (const m of RELEASE_MARKS) for (const t of [SPEED_WORD[m], SOUND_WORD[m]]) expect(t.es.trim() && t.en.trim()).toBeTruthy();
  });
  it('isMark acepta solo las marcas de la rampa', () => {
    expect(isMark(2)).toBe(true);
    expect(isMark(0)).toBe(false);
    expect(isMark(5)).toBe(false);
  });
  it('el modelo deja una sola cosa por cambiar y dice qué NO representa (energía en números, otras bolas)', () => {
    expect(RAMP_MODEL.controls[0].es).toMatch(/marca/);
    expect(RAMP_MODEL.doesNotRepresent.some((t) => /números/.test(t.es))).toBe(true);
    expect(RAMP_MODEL.doesNotRepresent.some((t) => /otro tamaño o material/.test(t.es))).toBe(true);
  });
});

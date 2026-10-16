import { describe, expect, it } from 'vitest';
import { ReadAlong, splitForReadAlong } from '../src/speech/read-along.ts';

const TEXT = 'La cometa roja se quedó enredada en la rama del roble. —¿Cómo la bajamos?';

describe('¿sabe lo que estoy leyendo? (prueba de voz)', () => {
  it('cada palabra visible se une con su forma normalizada, aunque lleve signos', () => {
    const w = splitForReadAlong(TEXT);
    expect(w.map((x) => x.text)).toContain('—¿Cómo');
    expect(w.every((x) => x.idx.length === 1)).toBe(true);
  });

  it('lo leído se marca aunque Whisper cambie acentos o mayúsculas', () => {
    const r = new ReadAlong(TEXT);
    const res = r.hear('la cometa roja se quedo enredada');
    expect(res.matched).toBe(6);
    expect(res.score).toBe(1);
    expect([...r.heardWords()].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('hablar de otra cosa casi no coincide', () => {
    const r = new ReadAlong(TEXT);
    const res = r.hear('hoy vamos a jugar fútbol con mis amigos');
    expect(res.score).toBeLessThan(0.3);
  });

  it('las frases se van sumando hasta cubrir el texto', () => {
    const r = new ReadAlong(TEXT);
    r.hear('la cometa roja se quedó enredada');
    r.hear('en la rama del roble cómo la bajamos');
    expect(r.coverage()).toBe(1);
  });
});

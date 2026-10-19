import { describe, expect, it } from 'vitest';
import { DEFAULT_KIT, FAMILIES, FAMILY_NAME, SOUNDS, SOUND_IDS, TRACKS, isSoundId, isValidKit, soundsOf } from '../src/index.ts';

describe('catálogo de sonidos', () => {
  it('son 16 sonidos en 4 familias de 4', () => {
    expect(SOUND_IDS).toHaveLength(16);
    expect(new Set(SOUND_IDS).size).toBe(16);
    expect(FAMILIES).toHaveLength(4);
    for (const f of FAMILIES) expect(soundsOf(f), f).toHaveLength(4);
    for (const id of SOUND_IDS) expect(SOUNDS[id].id).toBe(id);
  });

  it('cada sonido y cada familia tienen nombre y descripción en ES y EN', () => {
    for (const id of SOUND_IDS) for (const t of [SOUNDS[id].name, SOUNDS[id].hint]) {
      expect(t.es.trim(), id).not.toBe('');
      expect(t.en.trim(), id).not.toBe('');
    }
    for (const f of FAMILIES) expect(FAMILY_NAME[f].es.trim()).not.toBe('');
  });

  it('los nombres no se repiten dentro de un idioma (el niño elige por nombre)', () => {
    expect(new Set(SOUND_IDS.map((i) => SOUNDS[i].name.es)).size).toBe(16);
    expect(new Set(SOUND_IDS.map((i) => SOUNDS[i].name.en)).size).toBe(16);
  });

  it('nada se llama «auténtico» ni atribuye una tradición cultural', () => {
    for (const id of SOUND_IDS) expect(`${SOUNDS[id].name.es} ${SOUNDS[id].hint.es}`).not.toMatch(/aut[ée]ntic|tradicional|merengue|bachata/i);
  });

  it('el juego de partida son los cuatro sonidos originales y es válido', () => {
    expect(DEFAULT_KIT).toEqual({ a: 'bombo', b: 'palmas', c: 'sonaja', d: 'voz' });
    expect(isValidKit(DEFAULT_KIT)).toBe(true);
    expect(TRACKS.every((t) => isSoundId(DEFAULT_KIT[t]))).toBe(true);
  });

  it('rechaza juegos mal formados', () => {
    expect(isValidKit(null)).toBe(false);
    expect(isValidKit({ a: 'bombo', b: 'palmas', c: 'sonaja' })).toBe(false);
    expect(isValidKit({ ...DEFAULT_KIT, d: 'guitarra' })).toBe(false);
    expect(isSoundId('triangulo')).toBe(true);
    expect(isSoundId('piano')).toBe(false);
  });

  it('las notas con tono son voz, marimba, campanita, cuerda y bajo', () => {
    expect(SOUND_IDS.filter((i) => SOUNDS[i].pitched).sort()).toEqual(['bajo', 'carillon', 'cuerda', 'marimba', 'voz']);
  });
});

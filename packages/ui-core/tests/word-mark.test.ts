import { describe, expect, it } from 'vitest';
import type { ReadingEvent } from '@lee-conmigo/contracts';
import { createSessionState, reduceSession } from '@lee-conmigo/reading-engine';
import { pilotStory, tokenizePage } from '@lee-conmigo/story-engine';
import { defaultPrefs, wordMark } from '../src/index.ts';

/** `wordMark` decide la marca de cada palabra para las DOS apps (web y nativa): estas reglas no pueden divergir. */
const N = tokenizePage(pilotStory.pages[0]).length;
const play = (...events: Array<ReadingEvent | Parameters<typeof reduceSession>[1]>) => [{ type: 'session.started' } as ReadingEvent, ...events].reduce(reduceSession, createSessionState(N));
const none = { dotted: false, echoText: false, pulse: false };

describe('wordMark', () => {
  it('solo la palabra actual se marca (amarillo); las ya leídas no cambian — no es un examen', () => {
    const s = play({ type: 'word.correct', wordIndex: 0 });
    expect(wordMark(1, s, 'reading', defaultPrefs)).toEqual({ ...none, fill: 'focus' });
    expect(wordMark(0, s, 'reading', defaultPrefs)).toEqual(none);
  });

  it('con "subrayado" la actual lleva línea azul en vez de fondo', () => {
    const s = play({ type: 'word.correct', wordIndex: 0 });
    expect(wordMark(1, s, 'reading', { ...defaultPrefs, highlight: 'subrayado' })).toEqual({ ...none, underline: 'brand' });
  });

  it('una duda es ámbar suave, nunca rojo; la pausa larga hace pulsar la palabra', () => {
    expect(wordMark(0, play({ type: 'word.uncertain', wordIndex: 0 }), 'reading', defaultPrefs)).toMatchObject({ fill: 'warnTint', underline: 'warn' });
    expect(wordMark(0, play({ type: 'pause.detected', duration: 5200 }), 'reading', defaultPrefs).pulse).toBe(true);
  });

  it('saltada = punteada; repetida = verde un instante', () => {
    expect(wordMark(0, play({ type: 'word.skipped', wordIndex: 0 }), 'reading', defaultPrefs).dotted).toBe(true);
    expect(wordMark(0, play({ type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 }), 'reading', defaultPrefs).fill).toBe('okTint');
  });

  it('sin voz oída todavía, o fuera de la lectura, no hay palabra actual marcada', () => {
    expect(wordMark(0, play(), 'reading', defaultPrefs)).toEqual(none);
    expect(wordMark(1, play({ type: 'word.correct', wordIndex: 0 }), 'select', defaultPrefs)).toEqual(none);
  });
});

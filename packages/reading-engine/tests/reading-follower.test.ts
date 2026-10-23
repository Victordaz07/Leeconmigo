import { describe, expect, it } from 'vitest';
import { ReadingFollower } from '../src/reading-follower.ts';
const make = (text: string) => new ReadingFollower(text.split(' '));

describe('reading evidence, not dictated guesses', () => {
  it('does not turn a lone last word into a whole page', () => {
    const follower = make('La niña encontró una pequeña puerta azul al fondo del jardín');
    expect(follower.accept('jardín', true, 1000).confirmed).toEqual([]);
    expect(follower.snapshot().cursor).toBe(0);
  });
  it('replaces partial hypotheses and commits only the final correction', () => {
    const follower = make('La cometa roja volaba alto');
    expect(follower.accept('la cometa roja', false, 100).preview).toEqual([0, 1, 2]);
    expect(follower.snapshot().confirmed).toEqual([]);
    expect(follower.accept('la cometa', false, 200).preview).toEqual([0, 1]);
    expect(follower.accept('la cometa', true, 300).confirmed).toEqual([0, 1]);
  });
  it('keeps a missing word unconfirmed even when it finds the next phrase', () => {
    const follower = make('la cometa roja volaba alto');
    const state = follower.accept('la cometa volaba alto', true, 100);
    expect(state.confirmed).toEqual([0, 1, 3, 4]);
    expect(state.complete).toBe(false);
  });
  it('preserves intentional repeated words while tolerating spoken stutters', () => {
    const follower = make('no no abras la puerta');
    expect(follower.accept('no no abras la la puerta', true, 100).complete).toBe(true);
  });
  it('rereading does not create new coverage', () => {
    const follower = make('la cometa roja volaba alto');
    follower.accept('la cometa roja', true, 100);
    expect(follower.accept('la cometa roja', true, 200).newlyConfirmed).toEqual([]);
    expect(follower.accept('volaba alto', true, 300).complete).toBe(true);
  });
  it('deduplicates an identical final event', () => {
    const follower = make('no no no no');
    follower.accept('no no', true, 100);
    expect(follower.accept('no no', true, 100).newlyConfirmed).toEqual([]);
  });
  it('does not match distant recurring phrases', () => {
    const follower = make('el gato duerme cerca de una ventana mientras lejos la puerta azul brilla');
    expect(follower.accept('la puerta azul brilla', true, 100).confirmed).toEqual([]);
  });
  it('handles Spanish punctuation and English contractions', () => {
    expect(make('—¡Inés, ven aquí!').accept('ines ven aqui', true, 100).complete).toBe(true);
    expect(make("Don’t open the door.").accept("don't open the door", true, 100).complete).toBe(true);
  });
  it('does not treat noise, empty text or unrelated speech as reading', () => {
    const follower = make('la luna ilumina el jardín');
    for (const text of ['', '[Música]', 'hoy quiero jugar al fútbol', 'el']) expect(follower.accept(text, true, 100).confirmed).toEqual([]);
  });
  it('discards previews for help while retaining confirmed evidence', () => {
    const follower = make('la cometa roja');
    follower.accept('la', true, 100);
    follower.accept('cometa roja', false, 200);
    follower.discardHypothesis();
    expect(follower.snapshot().preview).toEqual([]);
    expect(follower.snapshot().confirmed).toEqual([0]);
  });
  it('keeps the indices of displayed punctuation-only tokens', () => {
    expect(make('Hola — dijo Inés').accept('hola dijo ines', true, 100).confirmed).toEqual([0, 2, 3]);
  });
  it('does not create coverage for a fuzzy single word', () => {
    expect(make('maravilloso jardín').accept('maravillosa', true, 100).confirmed).toEqual([]);
  });
});

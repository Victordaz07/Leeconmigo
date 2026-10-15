import { describe, expect, it } from 'vitest';
import { ReadingProgressTracker, TextReadingMatcher, collapseRepeats, normalizeText, normalizeWord, vocabularyKey, wordSimilarity } from '../src/index.ts';

const STORY =
  'Luna es una gatita gris que vive en una casa pequeña. Todas las mañanas sale al jardín a buscar mariposas. ' +
  'Un día vio una mariposa azul y corrió detrás de ella.';

describe('normalización', () => {
  it('minúsculas, sin acentos, ñ → n, sin puntuación ni anotaciones', () => {
    expect(normalizeText('¡Corrió, PEQUEÑA mariposa! [Música]')).toEqual(['corrio', 'pequena', 'mariposa']);
    expect(normalizeWord('—¿Qué')).toBe('que');
  });

  it('clave de vocabulario: conserva acentos y quita puntuación', () => {
    expect(vocabularyKey('Puerta,')).toBe('puerta');
    expect(vocabularyKey('—¿Qué')).toBe('qué');
    expect(vocabularyKey('«Montañas».')).toBe('montañas');
  });

  it('colapsa repeticiones inmediatas de palabras y de frases', () => {
    expect(collapseRepeats(['el', 'el', 'el', 'gato'])).toEqual(['el', 'gato']);
    expect(collapseRepeats(['el', 'gato', 'el', 'gato', 'se', 'fue'])).toEqual(['el', 'gato', 'se', 'fue']);
    expect(collapseRepeats(['la', 'casa', 'la', 'luna'])).toEqual(['la', 'casa', 'la', 'luna']);
  });

  it('similitud: tolera errores pequeños, no palabras cortas distintas', () => {
    expect(wordSimilarity('gatita', 'gatito')).toBeGreaterThanOrEqual(0.7);
    expect(wordSimilarity('mariposas', 'mariposa')).toBeGreaterThanOrEqual(0.7);
    expect(wordSimilarity('sol', 'sal')).toBe(0);
  });
});

describe('TextReadingMatcher (contrato ReadingMatcher)', () => {
  const matcher = new TextReadingMatcher();

  it('lectura clara de un tramo: confianza alta y posición correcta', () => {
    const r = matcher.align(STORY, 'Todas las mañanas sale al jardín a buscar mariposas');
    expect(r.confidence).toBeGreaterThanOrEqual(0.9);
    expect(r.matchedTokens).toHaveLength(9);
    expect(r.currentTokenIndex).toBe(19);
  });

  it('tolera omisiones, repeticiones y pronunciación imperfecta', () => {
    const r = matcher.align(STORY, 'un día vio vio una mariposa asul y y corrió corrió detrás ella');
    expect(r.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('charla ajena con palabras comunes NO llega al umbral de "probablemente leyendo" (0.6)', () => {
    const r = matcher.align(STORY, 'oye mañana vamos a ir a la casa de la abuela para comer con los primos y luego jugar');
    expect(r.confidence).toBeLessThan(0.5);
  });

  it('texto vacío, símbolos o una alucinación en otro idioma no cuentan como lectura', () => {
    expect(matcher.align(STORY, '').confidence).toBe(0);
    expect(matcher.align(STORY, '♪ ♪').confidence).toBe(0);
    expect(matcher.align(STORY, 'thanks for watching subscribe to the channel').confidence).toBeLessThan(0.5);
  });

  it('marca una posible palabra difícil: una palabra esperada dentro del tramo que no se reconoció', () => {
    const r = matcher.align('el pequeño conejo despertó antes de que saliera el sol', 'el pequeño despertó antes de que saliera el sol');
    expect(r.suspectedDifficultWord).toBe(2); // "conejo"
  });
});

describe('ReadingProgressTracker (avance acumulado)', () => {
  it('cobertura y posición avanzan solo con commit()', () => {
    const t = new ReadingProgressTracker(STORY);
    const a = t.match('Luna es una gatita gris que vive en una casa pequeña');
    expect(t.state().coverage).toBe(0);
    t.commit(a);
    expect(t.state().position).toBe(10);
    expect(t.state().coverage).toBeGreaterThan(0.25);
    t.commit(t.match('Todas las mañanas sale al jardín a buscar mariposas'));
    expect(t.state().position).toBe(19);
    expect(t.coveredIndices().length).toBeGreaterThan(15);
  });

  it('una segunda pasada por el texto reinicia la cobertura', () => {
    const t = new ReadingProgressTracker(STORY);
    t.commit(t.match(STORY));
    expect(t.state().coverage).toBeGreaterThan(0.9);
    t.commit(t.match('Luna es una gatita gris que vive en una casa pequeña'));
    expect(t.state().passes).toBe(1);
    expect(t.state().coverage).toBeLessThan(0.6);
  });
});

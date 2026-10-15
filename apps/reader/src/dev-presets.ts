/**
 * Presets del panel "Ir a pantalla": arman directamente cada uno de los 20 estados del prototipo
 * (docs/04) para poder revisarlos sin recorrer la lectura. SOLO DESARROLLO.
 * Reproduce las mismas posiciones que el prototipo aprobado ("puerta", "extraño", primer cuadro 2 + 4...).
 */
import type { ReadingSessionState, WordMark } from '@lee-conmigo/contracts';
import { createSessionState, vocabularyKey } from '@lee-conmigo/reading-engine';
import { createReview, initialFlow, type FlowState, type ReviewWord } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { cleanWord } from '@lee-conmigo/ui';

export interface Preset {
  flow: FlowState;
  reading: ReadingSessionState;
  /** Tiempo de lectura de mentira para la pantalla final (segundos). */
  demoSeconds?: number;
  /** Inicio con los datos de ejemplo del prototipo (historia a medias, estrellas...), no con el progreso real. */
  homeDemo?: boolean;
  /** Tras cargar, arrancar la animación de pronunciación / de "léeme el comienzo". */
  thenPronounce?: boolean;
  thenReadStart?: boolean;
}

export function buildPreset(n: number, words: StoryWord[], reviewWords: ReviewWord[]): Preset {
  const N = words.length;
  const find = (w: string) => words.findIndex((x) => cleanWord(x.text).toLowerCase() === w);
  const first = (block: number) => words.findIndex((x) => x.blockIndex === block);
  const readTo = (k: number): Record<number, WordMark> => Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'read'])) as Record<number, WordMark>;

  const base = createSessionState(N);
  const idle: ReadingSessionState = { ...base, status: 'idle' };
  /** Sesión de lectura con voz oída, en la palabra `k`. */
  const at = (k: number, patch: Partial<ReadingSessionState> = {}): ReadingSessionState => ({
    ...base,
    status: 'listening',
    hasHeardVoice: true,
    currentWordIndex: k,
    wordMarks: readTo(k),
    ...patch,
  });
  const screen = (s: FlowState['screen']): FlowState => ({ ...initialFlow, screen: s });
  const P = find('puerta');

  switch (n) {
    case 1: return { flow: screen('select'), reading: idle };
    case 2: return { flow: screen('prep'), reading: idle };
    case 3: return { flow: screen('reading'), reading: { ...base, status: 'listening' } };
    case 4: return { flow: screen('reading'), reading: at(first(2) + 4) };
    case 5: return { flow: screen('reading'), reading: at(first(2) + 4, { pause: 'short' }) };
    case 6: return { flow: screen('reading'), reading: at(P, { pause: 'long', practicedWordIndices: [P] }) };
    case 7: {
      const i = find('extraño');
      return { flow: screen('reading'), reading: at(i, { issue: 'uncertain', issueWordIndex: i, practicedWordIndices: [i] }) };
    }
    case 8: return { flow: screen('reading'), reading: at(P, { issue: 'incorrect', issueWordIndex: P, errorCount: 1, practicedWordIndices: [P] }) };
    case 9: {
      const k = first(1) + 5;
      return { flow: screen('reading'), reading: at(k, { issue: 'repeated', issueWordIndex: k - 1, repeatedWordIndex: k - 1 }) };
    }
    case 10: {
      const k = first(3) + 7;
      return {
        flow: screen('reading'),
        reading: at(k, { wordMarks: { ...readTo(k), [k - 1]: 'skipped' }, issue: 'skipped', issueWordIndex: k - 1, errorCount: 1, practicedWordIndices: [k - 1] }),
      };
    }
    case 11: return { flow: screen('reading'), reading: at(P, { helpWordIndex: P, status: 'helping', practicedWordIndices: [P] }) };
    case 12: return { flow: screen('reading'), reading: at(P, { helpWordIndex: P, status: 'helping', practicedWordIndices: [P] }), thenPronounce: true };
    case 13: return { flow: screen('reading'), reading: at(P + 3, { recovered: true }) };
    case 14: return { flow: screen('pageDone'), reading: { ...at(N), status: 'complete' } };
    case 15: return { flow: screen('question'), reading: { ...at(N), status: 'complete' } };
    case 16: {
      const demo = [find('extraño'), find('montañas'), P].filter((i) => i >= 0);
      const totals = { pagesRead: 1, errorCount: 3, wordCount: N, practicedKeys: demo.map((i) => vocabularyKey(words[i].text)) };
      return { flow: { ...screen('end'), totals }, reading: { ...at(N), status: 'complete', errorCount: 3, practicedWordIndices: demo }, demoSeconds: 272 };
    }
    case 17: return { flow: screen('home'), reading: idle, homeDemo: true };
    case 18: return { flow: screen('progress'), reading: idle };
    case 19: return { flow: screen('reading'), reading: at(P), thenReadStart: true };
    case 20: return { flow: { ...screen('review'), review: createReview(reviewWords) }, reading: { ...at(N), status: 'complete' } };
    default: return { flow: initialFlow, reading: idle };
  }
}

/**
 * Tokenización de páginas: convierte el texto de una página en las palabras que el motor de lectura
 * sigue (`ReadingWord`), sin perder a qué bloque/línea pertenece cada una (para resaltarlas en el
 * globo correcto y mover la "cámara").
 */
import type { ReadingWord, Story, StoryPage, VocabularyEntry } from '@lee-conmigo/contracts';
import { normalizeWord, vocabularyKey } from '@lee-conmigo/reading-engine';

export interface StoryWord extends ReadingWord {
  blockIndex: number;
  blockId: string;
  lineIndex: number;
}

/** Palabras de una página, en orden de lectura. El índice de la palabra es su posición global en la página. */
export function tokenizePage(page: StoryPage): StoryWord[] {
  const out: StoryWord[] = [];
  page.blocks.forEach((block, blockIndex) => {
    block.lines.forEach((line, lineIndex) => {
      for (const text of line.split(' ').filter(Boolean)) {
        const index = out.length;
        out.push({ id: `${page.id}-w${index}`, text, index, normalized: normalizeWord(text), blockIndex, blockId: block.id, lineIndex });
      }
    });
  });
  return out;
}

/** Texto completo de la página (lo que el niño debe leer). */
export function pageText(page: StoryPage): string {
  return page.blocks.map((b) => b.lines.join(' ')).join(' ');
}

/** Entrada de vocabulario (sílabas, definición...) de una palabra tal como aparece en pantalla. */
export function lookupVocabulary(story: Story, wordText: string): VocabularyEntry | undefined {
  return story.vocabulary[vocabularyKey(wordText)];
}

/**
 * Palabras del repaso final ("armar la palabra por sílabas"): primero las que costaron y tienen más de
 * una sílaba, y si faltan, las palabras base de la historia. Sin repetidos, máximo `limit`.
 */
export function reviewWords(story: Story, words: StoryWord[], practicedWordIndices: number[], limit = 3): string[] {
  const keys = practicedWordIndices.map((i) => words[i]).filter((w): w is StoryWord => !!w).map((w) => vocabularyKey(w.text));
  return reviewWordsFromKeys(story, keys, limit);
}

/** Igual que `reviewWords`, pero partiendo de claves de vocabulario (lo que se acumula a lo largo de varias páginas). */
export function reviewWordsFromKeys(story: Story, practicedKeys: string[], limit = 3): string[] {
  const hasSyllables = (k: string) => (story.vocabulary[k]?.syllables?.length ?? 0) > 1;
  const base = (story.reviewWords ?? []).filter(hasSyllables);
  return [...new Set([...practicedKeys.filter(hasSyllables), ...base])].slice(0, limit);
}

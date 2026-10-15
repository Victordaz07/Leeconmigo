import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StoryPage } from '@lee-conmigo/contracts';
import type { StoryWord } from '@lee-conmigo/story-engine';
import type { WordMark } from '@lee-conmigo/ui-core';
import { colors, fontFamily } from '../tokens.ts';
import { wordStyle } from './word-style.ts';

interface ReadingTextProps {
  page: StoryPage;
  words: StoryWord[];
  /** Marca de cada palabra (de `wordMark`); la pantalla la calcula con el estado del motor. */
  markOf: (index: number) => WordMark;
  /** Tocar CUALQUIER palabra abre la ayuda (docs/04), no solo la "difícil" detectada. */
  onWordPress: (index: number) => void;
  /** Tamaño de letra en px (docs/06: ajustable). */
  fontSize?: number;
}

/**
 * Texto de una página en modo "illustrated reader": cada cuadro (bloque) con su título opcional y sus párrafos. Las
 * palabras son texto real de la app (docs/05: nunca imagen) y cada una se puede tocar.
 */
export function ReadingText({ page, words, markOf, onWordPress, fontSize = 27 }: ReadingTextProps) {
  const lineHeight = Math.round(fontSize * 1.6);
  return (
    <View style={styles.page}>
      {page.blocks.map((block, b) => (
        <View key={block.id} style={styles.block}>
          {block.title ? <Text style={[styles.title, { fontSize: fontSize * 0.9 }]}>{block.title}</Text> : null}
          {block.lines.map((_, l) => (
            <Text key={l} style={[styles.paragraph, { fontSize, lineHeight }]}>
              {words
                .filter((w) => w.blockIndex === b && w.lineIndex === l)
                .map((w) => (
                  <Word key={w.index} word={w} mark={markOf(w.index)} onPress={onWordPress} />
                ))}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const Word = memo(function Word({ word, mark, onPress }: { word: StoryWord; mark: WordMark; onPress: (i: number) => void }) {
  return (
    <Text>
      <Text style={wordStyle(mark)} onPress={() => onPress(word.index)} suppressHighlighting={false}>
        {word.text}
      </Text>{' '}
    </Text>
  );
}, (a, b) => a.word === b.word && a.onPress === b.onPress && JSON.stringify(a.mark) === JSON.stringify(b.mark));

const styles = StyleSheet.create({
  page: { gap: 18 },
  block: { gap: 12 },
  title: { fontFamily: fontFamily.read.bold, color: colors.navy },
  paragraph: { fontFamily: fontFamily.read.regular, color: colors.ink },
});

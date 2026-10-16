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
  /**
   * Párrafo que se está leyendo (Kitewise G8/G13): los que vienen DESPUÉS se atenúan para ayudar a concentrarse; los ya
   * leídos y el actual se ven normales. `null` = todo normal (antes de empezar a leer).
   */
  currentParagraph?: { block: number; line: number } | null;
  /** Modo Enfoque (B10): también se atenúan los ya leídos; solo la línea actual se ve oscura. */
  dimRead?: boolean;
  /**
   * Posiciones verticales para que la pantalla siga a la línea actual: cada cuadro avisa su `y` dentro del texto
   * (`line` = -1) y cada párrafo la suya dentro de su cuadro. Se suman al usarlas (no importa en qué orden lleguen).
   */
  onParagraphLayout?: (block: number, line: number, y: number) => void;
}

const isAfter = (b: number, l: number, cur: { block: number; line: number }) => b > cur.block || (b === cur.block && l > cur.line);
const isCurrent = (b: number, l: number, cur: { block: number; line: number }) => b === cur.block && l === cur.line;

/**
 * Texto de una página en modo "illustrated reader": cada cuadro (bloque) con su título opcional y sus párrafos. Las
 * palabras son texto real de la app (docs/05: nunca imagen) y cada una se puede tocar.
 */
export function ReadingText({ page, words, markOf, onWordPress, fontSize = 27, currentParagraph = null, dimRead = false, onParagraphLayout }: ReadingTextProps) {
  const lineHeight = Math.round(fontSize * 1.6);
  return (
    <View style={styles.page}>
      {page.blocks.map((block, b) => (
        <View key={block.id} style={styles.block} onLayout={onParagraphLayout ? (e) => onParagraphLayout(b, -1, e.nativeEvent.layout.y) : undefined}>
          {block.title ? <Text style={[styles.title, { fontSize: fontSize * 0.9 }]}>{block.title}</Text> : null}
          {block.lines.map((_, l) => (
            <Text
              key={l}
              onLayout={onParagraphLayout ? (e) => onParagraphLayout(b, l, e.nativeEvent.layout.y) : undefined}
              style={[styles.paragraph, { fontSize, lineHeight }, currentParagraph && (dimRead ? !isCurrent(b, l, currentParagraph) : isAfter(b, l, currentParagraph)) && styles.upcoming]}>
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
  upcoming: { color: colors.muted2 },
});

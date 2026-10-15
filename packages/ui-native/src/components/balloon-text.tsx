import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BlockLayout, StoryTextBlock } from '@lee-conmigo/contracts';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { fitText, TEXT_LINE_HEIGHT, TEXT_PARAGRAPH_GAP, TEXT_WORD_GAP, type WordMark } from '@lee-conmigo/ui-core';
import { colors, fontFamily } from '../tokens.ts';
import { wordStyle } from './word-style.ts';

/** Tope de la letra (px de la ilustración original) cuando se ajusta sola; letra mínima en pantalla. Igual que la web. */
export const DEFAULT_MAX_FONT_PX = 56;
export const MIN_FONT_SCREEN_PX = 12;

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const VALIGN = { top: 0, middle: 0.5, bottom: 1 } as const;

interface BalloonTextProps {
  block: StoryTextBlock;
  layout: BlockLayout;
  /** Palabras de ESTE cuadro, en orden. */
  words: StoryWord[];
  /** Píxeles de pantalla por píxel de la ilustración original. */
  scale: number;
  markOf: (index: number) => WordMark;
  onWordPress: (index: number) => void;
}

/**
 * El texto de un cuadro dentro de su globo dibujado. El tamaño de letra y los renglones los calcula `fitText` (ui-core) con las
 * medidas reales de Andika; aquí solo se pintan esos renglones tal cual (nunca se deja que el sistema vuelva a cortar).
 */
export function BalloonText({ block, layout, words, scale, markOf, onWordPress }: BalloonTextProps) {
  const t = layout.text!;
  const box = { left: t.x * scale, top: t.y * scale, width: t.width * scale, height: t.height * scale };
  const fit = useMemo(() => {
    const byLine = block.lines.map((_, li) => words.filter((w) => w.lineIndex === li).map((w) => w.text));
    return fitText({
      paragraphs: layout.textMode === 'flow' ? [byLine.flat()] : byLine,
      width: box.width,
      height: box.height,
      minFont: MIN_FONT_SCREEN_PX,
      maxFont: (layout.maxFontPx ?? DEFAULT_MAX_FONT_PX) * scale,
      fixedFont: layout.fontPx !== undefined ? layout.fontPx * scale : undefined,
    });
  }, [block.lines, words, layout, scale, box.width, box.height]);

  const font = fit.fontSize;
  const rowHeight = TEXT_LINE_HEIGHT * font;
  const offsetTop = Math.max(0, (box.height - fit.height) * VALIGN[layout.valign ?? 'middle']);
  const justify = JUSTIFY[layout.align ?? 'left'];

  return (
    <View style={[styles.box, box]} pointerEvents="box-none">
      <View style={{ marginTop: offsetTop }}>
        {fit.rows.map((row, ri) => (
          <View
            key={ri}
            style={{
              flexDirection: 'row',
              justifyContent: justify,
              columnGap: TEXT_WORD_GAP * font,
              height: rowHeight,
              marginTop: ri > 0 && row.paragraph !== fit.rows[ri - 1].paragraph ? TEXT_PARAGRAPH_GAP * font : 0,
            }}
          >
            {row.words.map((wi) => {
              const w = words[wi];
              return (
                <Text
                  key={w.index}
                  numberOfLines={1}
                  onPress={() => onWordPress(w.index)}
                  style={[styles.word, { fontSize: font, lineHeight: rowHeight }, wordStyle(markOf(w.index))]}
                >
                  {w.text}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'absolute', overflow: 'visible' },
  word: { fontFamily: fontFamily.read.regular, color: colors.ink, flexShrink: 0, includeFontPadding: false },
});

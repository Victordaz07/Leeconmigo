import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import type { StoryPage } from '@lee-conmigo/contracts';
import type { StoryWord } from '@lee-conmigo/story-engine';
import type { WordMark } from '@lee-conmigo/ui-core';
import { colors } from '../tokens.ts';
import { BalloonText } from './balloon-text.tsx';

interface ComicPageProps {
  page: StoryPage;
  words: StoryWord[];
  image: ImageSourcePropType | undefined;
  /** Tamaño en pantalla de la ilustración completa (misma proporción que la original). */
  width: number;
  height: number;
  /** Cuadro que se está leyendo: su globo lleva un aro azul. */
  currentBlock: number;
  highlightActive: boolean;
  markOf: (index: number) => WordMark;
  onWordPress: (index: number) => void;
}

/**
 * Página de cómic con GLOBOS DIBUJADOS en la ilustración (docs/05: arte y texto separados — el globo es arte; el texto es de la
 * app y va encima). Equivale a `ComicFitLayer` de la web.
 */
export function ComicPage({ page, words, image, width, height, currentBlock, highlightActive, markOf, onWordPress }: ComicPageProps) {
  const scale = width / page.illustration.width;
  return (
    <View style={{ width, height }}>
      {/* Ancho y alto explícitos: sin ellos, React Native Web pinta la imagen a su tamaño original (recortada). */}
      {image ? (
        <Image source={image} style={{ position: 'absolute', left: 0, top: 0, width, height }} resizeMode="stretch" accessibilityLabel={page.illustration.alt ?? ''} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.missing]} />
      )}
      {page.blocks.map((block, bi) => {
        const layout = block.layout;
        if (!layout?.text || !layout.balloon) return null;
        const b = layout.balloon;
        const active = highlightActive && bi === currentBlock;
        return (
          <View key={block.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: b.x * scale,
                top: b.y * scale,
                width: b.width * scale,
                height: b.height * scale,
                borderRadius: 30 * scale,
                borderWidth: active ? Math.max(3, 5 * scale) : 0,
                borderColor: colors.brand,
              }}
            />
            <BalloonText block={block} layout={layout} words={words.filter((w) => w.blockIndex === bi)} scale={scale} markOf={markOf} onWordPress={onWordPress} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { backgroundColor: colors.chip },
});

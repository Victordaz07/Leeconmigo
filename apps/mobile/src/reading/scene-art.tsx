import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IllustrationRef, PixelRect } from '@lee-conmigo/contracts';
import { colors } from '@lee-conmigo/ui-native';
import { storyImage } from '../story-assets';
import { ART_COPY } from './illustration-viewer';

/** A reviewed source rectangle preserves the action; device dimensions never choose a new crop. */
export function SceneArt({ illustration, crop, maxHeight, language, onEnlarge }: { illustration: IllustrationRef; crop?: PixelRect; maxHeight: number; language: 'es' | 'en'; onEnlarge: () => void }) {
  const [width, setWidth] = useState(0);
  const region = crop ?? { x: 0, y: 0, width: illustration.width, height: illustration.height };
  const scale = Math.min(width / region.width, maxHeight / region.height);
  return (
    <View style={styles.frame} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <Pressable style={styles.artButton} accessibilityRole="button" accessibilityLabel={ART_COPY[language].open} accessibilityHint={illustration.alt} onPress={onEnlarge}>
        {width > 0 && (
          <View style={{ width: region.width * scale, height: region.height * scale, overflow: 'hidden', borderRadius: 18 }}>
            <Image source={storyImage(illustration.src)} accessibilityLabel={illustration.alt} resizeMode="stretch" style={{ position: 'absolute', width: illustration.width * scale, height: illustration.height * scale, left: -region.x * scale, top: -region.y * scale }} />
          </View>
        )}
        <View style={styles.badge} pointerEvents="none"><Svg width={21} height={21} viewBox="0 0 24 24"><Circle cx={10} cy={10} r={6} fill="none" stroke="#fff" strokeWidth={2} /><Path d="M15 15L21 21M7 10h6M10 7v6" stroke="#fff" strokeWidth={2} strokeLinecap="round" /></Svg></View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({ artButton: { width: '100%', minHeight: 48, alignItems: 'center' }, badge: { position: 'absolute', right: 8, bottom: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#101727dd' }, frame: { width: '100%', alignItems: 'center', backgroundColor: colors.paper, borderRadius: 18, overflow: 'hidden' } });

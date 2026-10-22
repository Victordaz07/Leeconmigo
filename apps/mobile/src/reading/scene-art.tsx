import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { IllustrationRef, PixelRect } from '@lee-conmigo/contracts';
import { colors } from '@lee-conmigo/ui-native';
import { storyImage } from '../story-assets';

/** A reviewed source rectangle preserves the action; device dimensions never choose a new crop. */
export function SceneArt({ illustration, crop, maxHeight }: { illustration: IllustrationRef; crop?: PixelRect; maxHeight: number }) {
  const [width, setWidth] = useState(0);
  const region = crop ?? { x: 0, y: 0, width: illustration.width, height: illustration.height };
  const scale = Math.min(width / region.width, maxHeight / region.height);
  return (
    <View style={styles.frame} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <View style={{ width: region.width * scale, height: region.height * scale, overflow: 'hidden', borderRadius: 18 }}>
          <Image source={storyImage(illustration.src)} accessibilityLabel={illustration.alt} resizeMode="stretch" style={{ position: 'absolute', width: illustration.width * scale, height: illustration.height * scale, left: -region.x * scale, top: -region.y * scale }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ frame: { width: '100%', alignItems: 'center', backgroundColor: colors.paper, borderRadius: 18, overflow: 'hidden' } });

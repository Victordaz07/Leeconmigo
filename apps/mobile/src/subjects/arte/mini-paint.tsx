import { StyleSheet, View } from 'react-native';
import { PAPER, PAPER_H, PAPER_W, drawingOf, visibleStrokes, type PaintScene } from '@lee-conmigo/art-content';
import { colors, radius } from '@lee-conmigo/ui-native';
import { SvgStrokeLayer } from '../../screens/svg-stroke-layer';

const VIEW_BOX = `0 0 ${PAPER_W} ${PAPER_H}`;

/** Miniatura de solo lectura de un cuadro. Ocupa el ancho que le dé el contenedor y no recibe toques. */
export function MiniPaint({ scene, label }: { scene: PaintScene | undefined; label: string }) {
  return (
    <View style={styles.box} accessible accessibilityLabel={label}>
      {scene && <SvgStrokeLayer strokes={visibleStrokes(drawingOf(scene))} viewBox={VIEW_BOX} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', aspectRatio: PAPER_W / PAPER_H, borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line, backgroundColor: PAPER },
});

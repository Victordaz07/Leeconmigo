import { StyleSheet, View } from 'react-native';
import { BACKGROUNDS, PAPER, PAPER_H, PAPER_W, collageOf, drawingOf, paintOf, visibleStrokes, type ArtProject } from '@lee-conmigo/art-content';
import { colors } from '@lee-conmigo/ui-native';
import { SvgStrokeLayer } from '../../screens/svg-stroke-layer';
import { CollageSvg } from './collage-area';

const VIEW_BOX = `0 0 ${PAPER_W} ${PAPER_H}`;

/** Miniatura de una creación (pintura o collage), de solo lectura. Un ritmo no tiene miniatura: quien llama muestra su ♪. */
export function hasThumb(p: ArtProject): boolean {
  return !!(paintOf(p) || collageOf(p));
}

export function CreationThumb({ project, width }: { project: ArtProject; width: number }) {
  const paint = paintOf(project);
  const collage = collageOf(project);
  const height = Math.round((width * PAPER_H) / PAPER_W);
  return (
    <View style={[styles.box, { width, height, backgroundColor: collage ? BACKGROUNDS[collage.background] : PAPER }]} accessible={false} pointerEvents="none">
      {paint && <SvgStrokeLayer strokes={visibleStrokes(drawingOf(paint))} viewBox={VIEW_BOX} />}
      {collage && <CollageSvg scene={collage} />}
    </View>
  );
}

const styles = StyleSheet.create({ box: { borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: colors.line } });

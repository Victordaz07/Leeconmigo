import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { meanPressure, PAPER, strokePathData, widthAt, type Stroke } from '@lee-conmigo/art-content';

/** Respaldo en la web (solo para revisar la pantalla en el navegador): mismos trazos, pintados con SVG. En la app se usa Skia. */
const StrokeView = memo(function StrokeView({ stroke }: { stroke: Stroke }) {
  const d = strokePathData(stroke.points);
  if (!d) return null;
  return <Path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={widthAt(stroke.brush, meanPressure(stroke.points))} stroke={stroke.brush.eraser ? PAPER : stroke.brush.color} />;
});

export function StrokeLayer({ strokes }: { strokes: readonly Stroke[] }) {
  return (
    <View style={{ flex: 1 }} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Rect x={0} y={0} width="100%" height="100%" fill={PAPER} />
        {strokes.map((s) => (
          <StrokeView key={s.id} stroke={s} />
        ))}
      </Svg>
    </View>
  );
}

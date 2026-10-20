import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { meanPressure, PAPER, strokePathData, widthAt, type Stroke } from '@lee-conmigo/art-content';

/**
 * Capa de trazos pintada con SVG (`react-native-svg`, que la app ya trae). Es el motor por defecto de la prueba del lienzo: no necesita nada nativo
 * nuevo. Los trazos terminados son inmutables y van con `memo`, así solo se repinta el que se está dibujando.
 */
const StrokeView = memo(function StrokeView({ stroke }: { stroke: Stroke }) {
  const d = strokePathData(stroke.points);
  if (!d) return null;
  return <Path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={widthAt(stroke.brush, meanPressure(stroke.points))} stroke={stroke.brush.eraser ? PAPER : stroke.brush.color} />;
});

export function SvgStrokeLayer({ strokes }: { strokes: readonly Stroke[] }) {
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

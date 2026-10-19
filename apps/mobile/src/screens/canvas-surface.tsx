import { memo } from 'react';
import { Canvas, Fill, Path } from '@shopify/react-native-skia';
import { meanPressure, PAPER, strokePathData, widthAt, type Stroke } from '@lee-conmigo/art-content';

/**
 * Capa que pinta los trazos con Skia (nativo). Los trazos terminados son objetos inmutables: `memo` evita repintar los que no cambiaron, así
 * un dibujo con cientos de trazos sigue fluido mientras se dibuja el último. En la web hay una versión de respaldo con SVG (`canvas-surface.web.tsx`).
 */
const StrokeView = memo(function StrokeView({ stroke }: { stroke: Stroke }) {
  const d = strokePathData(stroke.points);
  if (!d) return null;
  return <Path path={d} style="stroke" strokeCap="round" strokeJoin="round" strokeWidth={widthAt(stroke.brush, meanPressure(stroke.points))} color={stroke.brush.eraser ? PAPER : stroke.brush.color} />;
});

export function StrokeLayer({ strokes }: { strokes: readonly Stroke[] }) {
  return (
    <Canvas style={{ flex: 1 }} pointerEvents="none">
      <Fill color={PAPER} />
      {strokes.map((s) => (
        <StrokeView key={s.id} stroke={s} />
      ))}
    </Canvas>
  );
}

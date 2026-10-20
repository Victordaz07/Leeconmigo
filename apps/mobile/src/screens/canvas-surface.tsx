import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { meanPressure, PAPER, strokePathData, widthAt, type Stroke } from '@lee-conmigo/art-content';
import { colors, fontFamily } from '@lee-conmigo/ui-native';

/**
 * Capa que pinta los trazos con Skia (nativo). Los trazos terminados son objetos inmutables: `memo` evita repintar los que no cambiaron, así
 * un dibujo con cientos de trazos sigue fluido mientras se dibuja el último. En la web hay una versión de respaldo con SVG (`canvas-surface.web.tsx`).
 *
 * Skia se carga AQUÍ, la primera vez que se abre un lienzo, y no al arrancar la app: si el módulo nativo no estuviera disponible en un equipo,
 * el error se muestra en esta pantalla en vez de cerrar toda la aplicación.
 */
type SkiaModule = typeof import('@shopify/react-native-skia');
let skia: SkiaModule | null = null;
let skiaError: string | null = null;

function loadSkia(): SkiaModule | null {
  if (skia || skiaError) return skia;
  try {
    skia = require('@shopify/react-native-skia') as SkiaModule;
  } catch (e) {
    skiaError = e instanceof Error ? e.message : String(e);
  }
  return skia;
}

const StrokeView = memo(function StrokeView({ stroke, S }: { stroke: Stroke; S: SkiaModule }) {
  const d = strokePathData(stroke.points);
  if (!d) return null;
  return <S.Path path={d} style="stroke" strokeCap="round" strokeJoin="round" strokeWidth={widthAt(stroke.brush, meanPressure(stroke.points))} color={stroke.brush.eraser ? PAPER : stroke.brush.color} />;
});

export function StrokeLayer({ strokes }: { strokes: readonly Stroke[] }) {
  const S = loadSkia();
  if (!S) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>El lienzo no se pudo abrir en este equipo</Text>
        <Text style={styles.errorText} selectable>
          {skiaError}
        </Text>
      </View>
    );
  }
  return (
    <S.Canvas style={{ flex: 1 }} pointerEvents="none">
      <S.Fill color={PAPER} />
      {strokes.map((s) => (
        <StrokeView key={s.id} stroke={s} S={S} />
      ))}
    </S.Canvas>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, padding: 16, gap: 8, backgroundColor: colors.warnTint, justifyContent: 'center' },
  errorTitle: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.orangeDeep },
  errorText: { fontFamily: 'monospace', fontSize: 12, color: colors.ink },
});

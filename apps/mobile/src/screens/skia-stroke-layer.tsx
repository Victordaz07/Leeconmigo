import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { meanPressure, PAPER, strokePathData, widthAt, type Stroke } from '@lee-conmigo/art-content';
import { colors, fontFamily } from '@lee-conmigo/ui-native';

/**
 * Capa que pinta los trazos con Skia (nativo). Es el motor que se compara con el SVG en la prueba del lienzo (AR-T2).
 *
 * Skia se carga AQUÍ, solo si el adulto elige ese motor, y no al arrancar la app. Ojo: en la tableta de Victor (Samsung) el APK 0.6.1 se cerró
 * (sin mensaje) al inicializar Skia, un fallo nativo que `try/catch` no atrapa; por eso el motor por defecto es SVG. En la web no hay Skia:
 * `skia-stroke-layer.web.tsx` lo dice.
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

export function SkiaStrokeLayer({ strokes }: { strokes: readonly Stroke[] }) {
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

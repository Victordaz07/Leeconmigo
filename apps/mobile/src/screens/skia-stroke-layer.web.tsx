import { StyleSheet, Text, View } from 'react-native';
import type { Stroke } from '@lee-conmigo/art-content';
import { colors, fontFamily } from '@lee-conmigo/ui-native';

/** En el navegador no hay Skia nativo: se avisa en vez de intentar cargarlo. */
export function SkiaStrokeLayer(_props: { strokes: readonly Stroke[] }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Skia solo existe en la app instalada. Elige SVG para probar en el navegador.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: colors.warnTint },
  text: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.orangeDeep },
});

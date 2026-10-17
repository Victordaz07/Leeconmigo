import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

interface MayaSaysProps {
  /** La pose (el dibujo viene de la app; aquí solo se pinta). `undefined` = sin Maya (Modo Enfoque): queda solo el globo. */
  pose?: { source: ImageSourcePropType; aspect: number };
  text: string;
  /** Alto de Maya. */
  height?: number;
  /** Tono de la nota: pista (amarilla) o normal (blanca). */
  tone?: 'plain' | 'hint';
}

/** Maya, la guía de Ciencia, con su globo (el texto es SIEMPRE texto real de la app, nunca parte de la imagen). */
export function MayaSays({ pose, text, height = 110, tone = 'plain' }: MayaSaysProps) {
  return (
    <View style={styles.row}>
      {pose ? <Image source={pose.source} style={{ width: height * pose.aspect, height }} resizeMode="contain" accessible={false} /> : null}
      <View style={[styles.bubble, tone === 'hint' && styles.hint]} accessibilityRole="text">
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  bubble: { flex: 1, backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 18, paddingVertical: 14, boxShadow: shadows.soft, borderWidth: 2, borderColor: colors.line },
  hint: { backgroundColor: colors.focusTint, borderColor: colors.focus },
  text: { fontFamily: fontFamily.ui.bold, fontSize: 19, lineHeight: 27, color: colors.ink },
});

import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';

/**
 * El coach de Kitewise (G7): estrella + globo con el mensaje de acompañamiento ("¡Muy bien! Sigue leyendo."). Reemplaza la
 * barra de coach: la tecnología desaparece, queda el acompañamiento (docs/06).
 */
export function CoachBubble({ message, compact }: { message: string; compact?: boolean }) {
  return (
    <View style={styles.row} accessibilityLiveRegion="polite">
      <Text style={[styles.star, compact && styles.starSmall]}>⭐</Text>
      <View style={[styles.bubble, compact && styles.bubbleSmall]}>
        <View style={styles.tail} />
        <Text style={[styles.text, compact && styles.textSmall]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  star: { fontSize: 40 },
  bubble: { backgroundColor: '#ffffff', borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10, boxShadow: shadows.chip, maxWidth: 380 },
  tail: { position: 'absolute', left: -6, top: '50%', marginTop: -7, width: 14, height: 14, backgroundColor: '#ffffff', transform: [{ rotate: '45deg' }] },
  text: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: colors.ink },
  starSmall: { fontSize: 28 },
  bubbleSmall: { paddingHorizontal: 14, paddingVertical: 7, maxWidth: 260 },
  textSmall: { fontSize: 14 },
});

import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../tokens.ts';
import { useLayout } from './use-layout.ts';

interface DialogCardProps {
  /** Ícono grande arriba (p. ej. el micrófono ámbar de la pausa). */
  icon?: ReactNode;
  title: string;
  message?: string;
  children?: ReactNode;
}

/**
 * Tarjeta centrada sobre un velo (Kitewise B11 pausa, G11 sin micrófono): estrella junto al título, mensaje tranquilo y
 * acciones abajo. Nunca rojo ni alarma (docs/06).
 */
export function DialogCard({ icon, title, message, children }: DialogCardProps) {
  const { narrow, short } = useLayout();
  const small = narrow || short;
  return (
    <View style={styles.scrim} accessibilityViewIsModal>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.center, small && styles.centerSmall]}>
        <View style={[styles.card, small && styles.cardSmall]}>
          {!short && icon}
          <View style={styles.titleRow}>
            <Text style={[styles.star, small && styles.starSmall]}>⭐</Text>
            <Text style={[styles.title, small && styles.titleSmall]}>{title}</Text>
          </View>
          {message ? <Text style={[styles.message, small && styles.messageSmall]}>{message}</Text> : null}
          {children ? <View style={styles.actions}>{children}</View> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 22, 28, 0.5)' },
  scroll: { flex: 1 },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerSmall: { padding: 12 },
  cardSmall: { paddingHorizontal: 20, paddingVertical: 20, gap: 10 },
  starSmall: { fontSize: 34 },
  titleSmall: { fontSize: 24 },
  messageSmall: { fontSize: 16 },
  card: { width: '100%', maxWidth: 780, backgroundColor: '#ffffff', borderRadius: radius.panel + 6, paddingHorizontal: 44, paddingVertical: 32, alignItems: 'center', gap: 14, boxShadow: '0px 30px 70px rgba(0, 0, 0, 0.35)' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' },
  star: { fontSize: 52 },
  title: { flexShrink: 1, fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.ink, textAlign: 'center' },
  message: { fontFamily: fontFamily.ui.bold, fontSize: 18, color: colors.muted, textAlign: 'center' },
  actions: { alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 8 },
});

import { StyleSheet, Text, View } from 'react-native';
import type { MicTone } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';
import { MicBadge } from './mic-badge.tsx';

const LABEL_COLOR: Record<MicTone, string> = { ok: colors.okMid, idle: colors.muted, warn: colors.warn };

interface CoachBarProps {
  tone: MicTone;
  listening: boolean;
  /** Estado del micrófono en palabras de niño ("Te escucho", "Te espero"…), nunca técnico (docs/06). */
  micLabel: string;
  /** Mensaje de acompañamiento del coach. */
  feedback: string;
  /** "Llevas 02:15" (tiempo leído). Opcional: en niveles altos el tiempo deja de dominar (docs/06). */
  elapsed?: string;
}

/** Barra inferior de la lectura: micrófono de colores + lo que dice el coach. */
export function CoachBar({ tone, listening, micLabel, feedback, elapsed }: CoachBarProps) {
  return (
    <View style={styles.bar}>
      <MicBadge tone={tone} pulsing={listening} size={64} />
      <View style={styles.texts}>
        <Text style={[styles.mic, { color: LABEL_COLOR[tone] }]}>{micLabel}</Text>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>
      {elapsed ? <Text style={styles.elapsed}>{elapsed}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: radius.panel,
    paddingVertical: 10,
    paddingHorizontal: 16,
    boxShadow: shadows.card,
  },
  texts: { flex: 1, gap: 2 },
  mic: { fontFamily: fontFamily.ui.black, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.6 },
  feedback: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink },
  elapsed: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.muted },
});

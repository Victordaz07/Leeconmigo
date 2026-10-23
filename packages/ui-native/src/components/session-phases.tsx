import { useTranslation } from '../interface-language.tsx';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../tokens.ts';

export interface Phase {
  label: string;
  state: 'done' | 'current' | 'todo';
}

/**
 * Píldoras de los momentos de una sesión (Kitewise `SessionPhases`): la hecha con ✓, la actual resaltada en amarillo, las
 * que faltan translúcidas. Pensadas para ir sobre una imagen oscura (banner "Misión de hoy").
 */
export function SessionPhases({ phases }: { phases: Phase[] }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {phases.map((p, i) => (
        <View key={p.label} style={[styles.pill, p.state === 'done' && styles.done, p.state === 'current' && styles.current]}>
          <Text style={[styles.text, p.state === 'current' && styles.textCurrent]}>{p.state === 'done' ? `✓ ${t(p.label)}` : `${i + 1} ${t(p.label)}`}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.18)' },
  done: { backgroundColor: 'rgba(34, 169, 92, 0.85)' },
  current: { backgroundColor: colors.phaseAprender, boxShadow: `inset 0px -3px 0px ${colors.phaseAprenderLedge}` },
  text: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: '#ffffff' },
  textCurrent: { color: colors.ink },
});

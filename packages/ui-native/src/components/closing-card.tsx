import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CLOSING_COPY, FOCUS_FACES, type EffortLang, type FocusSelfReport } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius } from '../tokens.ts';
import { Button } from './button.tsx';
import { useLayout } from './use-layout.ts';

export interface ClosingStat {
  label: string;
  value: string;
}

interface ClosingCardProps {
  name: string;
  stars: 0 | 1 | 2 | 3;
  /** Frase del esfuerzo que ganó las estrellas ("por volver a intentarlo"). */
  reason: string;
  stats: ClosingStat[];
  onAgain: () => void;
  onDone: (focus?: FocusSelfReport) => void;
  /** Idioma del niño activo. Opcional con default 'es' para no romper a quien todavía no lo pasa (docs/14). */
  lang?: EffortLang;
}

/**
 * Cierre de sesión de Kitewise (B13): estrellas POR ESFUERZO (D11), tiempo, papalote, sello del día, palabras que vuelven y
 * "¿Cómo estuvo tu enfoque?" con 3 caritas (autoevaluación, nunca nota). "Guardar en mi cuaderno" llega con Mi cuaderno (K8).
 */
export function ClosingCard({ name, stars, reason, stats, onAgain, onDone, lang = 'es' }: ClosingCardProps) {
  const [focus, setFocus] = useState<FocusSelfReport | undefined>();
  const { narrow, short } = useLayout();
  const small = narrow || short;
  return (
    <View style={styles.scrim} accessibilityViewIsModal>
      <ScrollView style={styles.flex} contentContainerStyle={[styles.center, small && styles.centerSmall]}>
      <View style={[styles.card, small && styles.cardSmall]}>
        <Text style={[styles.title, small && styles.titleSmall]}>{CLOSING_COPY.title[lang](name)}</Text>
        <View style={styles.stars} accessible accessibilityLabel={`${CLOSING_COPY.starsOf3[lang](stars)} ${reason}`}>
          {[0, 1, 2].map((i) => (
            <Text key={i} style={[styles.star, i === 1 && styles.starBig, small && styles.starSmall, small && i === 1 && styles.starBigSmall, { color: i < stars ? colors.gold : colors.track }]}>
              ★
            </Text>
          ))}
        </View>
        <Text style={styles.reason}>
          {'★'.repeat(stars)} {reason}
        </Text>
        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.stat, small && styles.statSmall]}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, small && styles.statValueSmall]}>{s.value}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.focus, small && styles.focusSmall]}>
          <Text style={[styles.focusText, small && styles.focusTextSmall]}>{CLOSING_COPY.focusQuestion[lang]}</Text>
          {FOCUS_FACES.map((f) => (
            <Pressable key={f.value} onPress={() => setFocus(f.value)} accessibilityRole="radio" accessibilityLabel={f.label[lang]} accessibilityState={{ selected: focus === f.value }} style={[styles.face, focus === f.value && styles.faceOn]}>
              <Text style={styles.faceGlyph}>{f.glyph}</Text>
            </Pressable>
          ))}
        </View>
        <View style={[styles.actions, narrow && styles.actionsNarrow]}>
          <View style={styles.flex}>
            <Button label={CLOSING_COPY.again[lang]} variant="secondary" onPress={onAgain} />
          </View>
          <View style={styles.flex}>
            <Button label={CLOSING_COPY.done[lang]} onPress={() => onDone(focus)} />
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 22, 28, 0.5)' },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerSmall: { padding: 12 },
  cardSmall: { paddingHorizontal: 18, paddingVertical: 18, gap: 10 },
  titleSmall: { fontSize: 26 },
  starSmall: { fontSize: 44, lineHeight: 52 },
  starBigSmall: { fontSize: 60, lineHeight: 68 },
  statSmall: { minWidth: '40%', paddingVertical: 8 },
  statValueSmall: { fontSize: 20 },
  focusSmall: { flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 12 },
  focusTextSmall: { flexBasis: '100%', textAlign: 'center', fontSize: 16 },
  actionsNarrow: { flexDirection: 'column-reverse', gap: 10 },
  card: { width: '100%', maxWidth: 900, backgroundColor: '#ffffff', borderRadius: radius.panel + 6, paddingHorizontal: 40, paddingVertical: 30, alignItems: 'center', gap: 14, boxShadow: '0px 30px 70px rgba(0, 0, 0, 0.35)' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.ink, textAlign: 'center' },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  star: { fontSize: 72, lineHeight: 84 },
  starBig: { fontSize: 96, lineHeight: 108 },
  reason: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: '#b26a00' },
  stats: { alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flex: 1, minWidth: 150, backgroundColor: colors.chip, borderRadius: radius.tile, paddingVertical: 12, alignItems: 'center', gap: 2 },
  statLabel: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  statValue: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.ink },
  focus: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.warnTint, borderRadius: radius.tile, paddingHorizontal: 18, paddingVertical: 10 },
  focusText: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.ink },
  face: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0px -3px 0px ${colors.focusLedge}` },
  faceOn: { backgroundColor: colors.focus, borderWidth: 3, borderColor: colors.gold },
  faceGlyph: { fontSize: 26, color: colors.ink },
  actions: { alignSelf: 'stretch', flexDirection: 'row', gap: 14, marginTop: 4 },
});

/**
 * Controles de Practicar (Kitewise B8): teclado de respuesta, "¿Qué tan seguro estás?" y escalera de pistas. Sin rojo ni
 * "incorrecto" (docs/06): la confianza usa puntos y texto (no colores de juicio) y nunca resta.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ConfidenceChoice, HintStep } from '@lee-conmigo/contracts';
import { MATH_COPY, type MathLang } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0'] as const;

export function NumericKeypad({ value, unit, onKey, onBack, compact, lang }: { value: string; unit?: string; onKey: (d: string) => void; onBack: () => void; compact?: boolean; lang: MathLang }) {
  const key = compact ? { width: 64, height: 50 } : { width: 76, height: 58 };
  return (
    <View style={styles.keypadWrap}>
      <View style={styles.display} accessibilityLabel={`${MATH_COPY.yourAnswer[lang]}: ${value || '—'}`}>
        <Text style={[styles.displayText, !value && styles.displayEmpty]}>{value || '?'}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <View style={[styles.keys, { width: key.width * 3 + 20 }]}>
        {KEYS.map((k) => (
          <Pressable key={k} onPress={() => (k === 'back' ? onBack() : onKey(k))} accessibilityRole="button" accessibilityLabel={k === 'back' ? 'Borrar' : k} style={({ pressed }) => [styles.key, key, k === 'back' && styles.keySoft, pressed && styles.pressed]}>
            <Text style={styles.keyText}>{k === 'back' ? '⌫' : k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const DOTS: Record<ConfidenceChoice, string> = { seguro: '●●●', masOMenos: '●●○', adivino: '●○○' };

export function ConfidencePicker({ value, onChange, lang, compact }: { value: ConfidenceChoice | null; onChange: (c: ConfidenceChoice) => void; lang: MathLang; compact?: boolean }) {
  return (
    <View style={styles.confWrap}>
      <Text style={styles.confQ}>{MATH_COPY.confidenceQ[lang]}</Text>
      <View style={styles.confRow}>
        {(['seguro', 'masOMenos', 'adivino'] as const).map((c) => {
          const on = c === value;
          return (
            <Pressable key={c} onPress={() => onChange(c)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={MATH_COPY.confidence[lang][c]} style={[styles.conf, compact && styles.confCompact, on && styles.confOn]}>
              <Text style={[styles.confDots, on && styles.confTextOn]}>{DOTS[c]}</Text>
              <Text style={[styles.confText, on && styles.confTextOn]}>{MATH_COPY.confidence[lang][c]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Pistas abiertas hasta el escalón `level` (1 pista, 2 ejemplo resuelto, 3 respuesta explicada). */
export function HintLadder({ hints, level, lang }: { hints: HintStep[]; level: number; lang: MathLang }) {
  if (level <= 0) return null;
  return (
    <View style={styles.hints} accessibilityLiveRegion="polite">
      {hints.slice(0, level).map((h, i) => (
        <View key={h.level} style={[styles.hint, i === level - 1 && styles.hintLast]}>
          <Text style={styles.hintTitle}>
            {i + 1}. {MATH_COPY.hintTitles[lang][i]}
          </Text>
          <Text style={styles.hintText}>{h.text[lang]}</Text>
        </View>
      ))}
    </View>
  );
}

export function PhaseTabs({ current, lang, compact }: { current: 'aprender' | 'explorar' | 'practicar' | 'juego' | 'cierre'; lang: MathLang; compact?: boolean }) {
  const order = ['aprender', 'explorar', 'practicar', 'juego'] as const;
  const idx = current === 'cierre' ? order.length : order.indexOf(current);
  return (
    <View style={styles.phases}>
      {order.map((p, i) => {
        const state = i < idx ? 'done' : i === idx ? 'current' : 'todo';
        return (
          <View key={p} style={[styles.phase, compact && styles.phaseCompact, state === 'current' && styles[`phase_${p}`], state === 'done' && styles.phaseDone]}>
            <Text style={[styles.phaseText, compact && styles.phaseTextCompact, state === 'current' && styles.phaseTextOn]}>{state === 'done' ? `✓ ${MATH_COPY.phases[lang][p]}` : MATH_COPY.phases[lang][p]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  keypadWrap: { alignItems: 'center', gap: 12 },
  display: { minWidth: 180, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: radius.tile, borderWidth: 3, borderColor: colors.brand200, paddingHorizontal: 20, paddingVertical: 8 },
  displayText: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.navy },
  displayEmpty: { color: colors.slate300 },
  unit: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.inkSoft },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  key: { borderRadius: radius.tile, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0px -4px 0px ${colors.line}, ${shadows.soft}` },
  keySoft: { backgroundColor: colors.chip },
  keyText: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.ink },
  pressed: { transform: [{ translateY: 2 }] },
  confWrap: { gap: 8, alignSelf: 'stretch' },
  confQ: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  confRow: { flexDirection: 'row', gap: 10 },
  conf: { flex: 1, minHeight: 56, borderRadius: radius.tile, backgroundColor: colors.brand50, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 2, boxShadow: `inset 0px -3px 0px ${colors.brandLedgeSoft}` },
  confCompact: { minHeight: 50 },
  confOn: { backgroundColor: colors.brand, boxShadow: `0px 0px 0px 3px ${colors.brand200}` },
  confDots: { fontSize: 14, color: colors.brand, letterSpacing: 2 },
  confText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.brand },
  confTextOn: { color: '#ffffff' },
  hints: { gap: 8, alignSelf: 'stretch' },
  hint: { backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 14, gap: 4, opacity: 0.85 },
  hintLast: { opacity: 1, boxShadow: shadows.soft },
  hintTitle: { fontFamily: fontFamily.ui.black, fontSize: 13, color: '#9a5b00' },
  hintText: { fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.ink },
  phases: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phase: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.chip },
  phaseCompact: { paddingHorizontal: 10, paddingVertical: 5 },
  phaseDone: { backgroundColor: colors.okTint },
  phase_aprender: { backgroundColor: colors.phaseAprender, boxShadow: `inset 0px -3px 0px ${colors.phaseAprenderLedge}` },
  phase_explorar: { backgroundColor: colors.phaseExplorar, boxShadow: `inset 0px -3px 0px ${colors.phaseExplorarLedge}` },
  phase_practicar: { backgroundColor: colors.phasePracticar, boxShadow: `inset 0px -3px 0px ${colors.phasePracticarLedge}` },
  phase_juego: { backgroundColor: colors.phaseJuego, boxShadow: `inset 0px -3px 0px ${colors.phaseJuegoLedge}` },
  phaseText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.inkSoft },
  phaseTextCompact: { fontSize: 12 },
  phaseTextOn: { color: colors.ink },
});

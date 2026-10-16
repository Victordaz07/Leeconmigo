import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { movementStep } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';
import { Button } from './button.tsx';
import { useLayout } from './use-layout.ts';

interface MovementBreakProps {
  kicker: string;
  title: string;
  steps: [string, string, string];
  seconds: number;
  secondsLabel: string;
  doneLabel: string;
  backLabel: string;
  /** Ilustración de fondo, tenue (la pantalla nunca va sin imagen, Kitewise SPEC §1). */
  background?: ImageSourcePropType;
  onDone: () => void;
}

/**
 * Pausa de movimiento (Kitewise B12): temporizador circular y tres movimientos, el actual resaltado. Cubre toda la
 * pantalla. El botón de volver está siempre: es una pausa para el cuerpo, no una espera obligatoria.
 */
export function MovementBreak({ kicker, title, steps, seconds, secondsLabel, doneLabel, backLabel, background, onDone }: MovementBreakProps) {
  const layout = useLayout();
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const step = movementStep(left, seconds);
  const size = layout.phone ? 170 : 240;
  const stroke = layout.phone ? 18 : 24;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const side = !layout.portrait && !layout.phone;

  return (
    <View style={styles.screen}>
      {background ? <Image source={background} style={styles.bg} blurRadius={6} resizeMode="cover" accessible={false} /> : null}
      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter }]}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>{title}</Text>
        <View style={[styles.body, side && styles.bodySide]}>
          <View style={{ width: size, height: size }} accessible accessibilityRole="timer" accessibilityLabel={`${left} ${secondsLabel}`}>
            <Svg width={size} height={size}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.track} strokeWidth={stroke} fill="#ffffff" />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={colors.ok}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${c} ${c}`}
                strokeDashoffset={c * (1 - left / seconds)}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.center}>
              <Text style={[styles.count, layout.phone && styles.countSmall]}>{left}</Text>
              <Text style={styles.unit}>{secondsLabel}</Text>
            </View>
          </View>
          <View style={styles.steps}>
            {steps.map((s, i) => {
              const done = i < step;
              const now = i === step;
              return (
                <View key={i} style={[styles.step, now && styles.stepNow]} accessibilityLabel={done ? `${s}, ${doneLabel}` : s}>
                  <View style={[styles.badge, done && styles.badgeDone]}>
                    {done ? (
                      <Svg width={18} height={18} viewBox="0 0 24 24">
                        <Path d="M5 12.5l4.5 4.5L19 7.5" stroke="#ffffff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    ) : (
                      <Text style={styles.badgeText}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.stepText, layout.phone && styles.stepTextSmall]}>{s}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <Button label={backLabel} large onPress={onDone} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFill, backgroundColor: colors.paper, zIndex: 20 },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0.35 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 22, paddingVertical: 32 },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.orangeDeep, backgroundColor: '#ffffff', borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 8, overflow: 'hidden' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 44, color: colors.navy, textAlign: 'center' },
  titleSmall: { fontSize: 28 },
  body: { alignItems: 'center', gap: 24 },
  bodySide: { flexDirection: 'row', gap: 56 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  count: { fontFamily: fontFamily.ui.black, fontSize: 64, color: colors.navy },
  countSmall: { fontSize: 46 },
  unit: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.muted },
  steps: { gap: 12, width: '100%', maxWidth: 520, minWidth: 280 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 18, paddingVertical: 14, boxShadow: shadows.soft },
  stepNow: { backgroundColor: colors.focus },
  badge: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  badgeDone: { backgroundColor: colors.ok },
  badgeText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.navy },
  stepText: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 21, color: colors.ink },
  stepTextSmall: { fontSize: 17 },
});

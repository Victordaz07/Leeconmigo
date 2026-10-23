import { useTranslation } from '../interface-language.tsx';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { MicTone } from '@lee-conmigo/ui-core';
import { colors, durations, gradients } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';
import { MicIcon } from './icons.tsx';
import { useReducedMotion } from './use-reduced-motion.ts';

/** Color de cada estado del micrófono (docs/05: verde = escuchando, gris = pausa/ayuda, ámbar = pausa larga). */
const TONE = {
  ok: { color: colors.okMid, gradient: gradients.micOk },
  idle: { color: colors.slate400, gradient: gradients.micIdle },
  warn: { color: colors.warn, gradient: gradients.micWarn },
} as const;

interface MicBadgeProps {
  tone: MicTone;
  /** Diámetro del círculo en px. */
  size?: number;
  /** Anillo que se expande suavemente mientras se escucha (se apaga si el sistema pide reducir movimiento). */
  pulsing?: boolean;
}

/** Círculo del micrófono: cambia de color según el estado en vez de mostrar texto técnico (docs/06). */
export function MicBadge({ tone, size = 96, pulsing = false }: MicBadgeProps) {
  const { t: ui } = useTranslation();
  const t = TONE[tone];
  const reduced = useReducedMotion();
  const animate = pulsing && !reduced;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(progress, { toValue: 1, duration: durations.ring, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [animate, progress]);

  const ring = size + 26; // aro blanco (8 px) + aro de color (13 px) del prototipo, redondeado
  return (
    <View style={{ width: ring, height: ring, alignItems: 'center', justifyContent: 'center' }} accessibilityRole="image" accessibilityLabel={ui("Micrófono")}>
      {animate && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulse,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: t.color,
              opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] }) }],
            },
          ]}
        />
      )}
      <View style={{ width: ring, height: ring, borderRadius: ring / 2, backgroundColor: t.color, opacity: 0.2, position: 'absolute' }} />
      <View style={{ width: size + 16, height: size + 16, borderRadius: (size + 16) / 2, backgroundColor: 'rgba(255,255,255,0.95)', position: 'absolute' }} />
      <GradientView gradient={t.gradient} style={[styles.circle, { width: size, height: size, borderRadius: size / 2, boxShadow: `0px 12px 26px ${t.color}55` }]}>
        <MicIcon size={size * 0.42} big />
      </GradientView>
    </View>
  );
}

const styles = StyleSheet.create({
  pulse: { position: 'absolute' },
  circle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});

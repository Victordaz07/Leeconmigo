import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, gradients, minTouch, radius, shadows } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';

type Variant = 'primary' | 'secondary' | 'cta';

/** Cara y "borde físico" de cada variante (docs/05: botones píldora con sombra inferior sólida, nunca planos). */
const VARIANT = {
  primary: { face: gradients.brandCta, ledge: colors.brandLedge, text: '#ffffff', glow: shadows.brandGlow },
  secondary: { face: gradients.nav, ledge: colors.line, text: colors.navy, glow: shadows.soft },
  /** Amarillo "Seguir" (banner de misión, Kitewise). */
  cta: { face: gradients.cta, ledge: '#d99a00', text: colors.ink, glow: '0px 10px 22px rgba(217, 154, 0, 0.35)' },
} as const;

const LEDGE = 5;

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Algo antes del texto (un icono). */
  icon?: ReactNode;
  disabled?: boolean;
  /** Tamaño grande (CTA "Comenzar"): 68 px de alto como en el prototipo. */
  large?: boolean;
  /** Compact adult navigation; keeps a 48 dp touch target. */
  compact?: boolean;
}

/** Botón píldora con borde inferior sólido; al tocarlo, la cara baja y el borde se aplana (como un botón de verdad). */
export function Button({ label, onPress, variant = 'primary', icon, disabled, large, compact }: ButtonProps) {
  const v = VARIANT[variant];
  const height = large ? 68 : compact ? 48 : minTouch;
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} style={disabled ? styles.disabled : undefined}>
      {({ pressed }) => (
        <View style={[styles.ledge, { backgroundColor: v.ledge, paddingTop: pressed ? LEDGE - 1 : 0, paddingBottom: pressed ? 1 : LEDGE, boxShadow: pressed ? undefined : v.glow }]}>
          <GradientView gradient={v.face} style={[styles.face, { height, paddingHorizontal: compact ? 16 : 28 }]}>
            {icon}
            <Text style={[styles.label, { color: v.text, fontSize: large ? 22 : compact ? 16 : 18 }]}>{label}</Text>
          </GradientView>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ledge: { borderRadius: radius.pill },
  face: {
    borderRadius: radius.pill,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  label: { fontFamily: fontFamily.ui.black },
  disabled: { opacity: 0.5 },
});

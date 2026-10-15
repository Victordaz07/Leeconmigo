import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { gradientPoints } from '../gradient-points.ts';
import type { Gradient } from '../tokens.ts';

export function GradientView({ gradient, style, children }: { gradient: Gradient; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { start, end } = gradientPoints(gradient.angle);
  return (
    <LinearGradient
      colors={gradient.colors as unknown as [string, string, ...string[]]}
      locations={gradient.locations as unknown as [number, number, ...number[]] | undefined}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

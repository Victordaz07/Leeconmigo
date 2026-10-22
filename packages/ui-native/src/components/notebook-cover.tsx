import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows, type Gradient } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';

interface NotebookCoverProps {
  title: string;
  subtitle: string;
  /** Arte de la portada; sin arte, el degradado de la materia con su glifo grande (nunca arte inventado). */
  image?: ImageSourcePropType;
  glyph: string;
  color: string;
  gradient: Gradient;
  /** 0–3 segmentos de progreso (`progressSegments`, ui-core). */
  segments: 0 | 1 | 2 | 3;
  /** Materia sin contenido todavía: se ve, pero atenuada y con "Pronto". */
  soon?: boolean;
  onPress?: () => void;
  /** Ancho fijo calculado por la cuadrícula (`itemWidth`); sin él, la tarjeta se estira. */
  width?: number;
}

const SPIRAL_DOTS = 9;

/** Portada de un cuaderno en la estantería de Inicio (B3): espiral, arte, ícono de materia, título y progreso. */
export function NotebookCover({ title, subtitle, image, glyph, color, gradient, segments, soon, onPress, width }: NotebookCoverProps) {
  const artHeight = width ? Math.round(Math.min(150, Math.max(96, width * 0.62))) : 150;
  return (
    <Pressable onPress={soon ? undefined : onPress} disabled={soon} accessibilityRole="button" accessibilityLabel={soon ? `${title}, pronto` : title} style={({ pressed }) => [styles.card, width ? { width, flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minWidth: undefined } : null, pressed && styles.pressed]}>
      <View style={[styles.art, { height: artHeight }]}>
        {image ? <Image source={image} style={FILL} resizeMode="cover" /> : <GradientView gradient={gradient} style={[StyleSheet.absoluteFill, styles.placeholder]}><Text style={styles.bigGlyph}>{glyph}</Text></GradientView>}
        <View style={styles.spiral} pointerEvents="none">
          {Array.from({ length: SPIRAL_DOTS }, (_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
        <GradientView gradient={gradient} style={styles.badge}>
          <Text style={styles.badgeText}>{glyph}</Text>
        </GradientView>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={3}>
          {soon ? 'Pronto' : subtitle}
        </Text>
        <View style={styles.bar}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.segment, { backgroundColor: i < segments ? color : colors.track }]} />
          ))}
        </View>
      </View>
      {soon && <View style={styles.dim} pointerEvents="none" />}
    </Pressable>
  );
}

/** Llenar el contenedor con ancho/alto explícitos (en React Native Web `absoluteFill` solo no basta para una imagen). */
const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 150, backgroundColor: '#ffffff', borderRadius: radius.card, overflow: 'hidden', boxShadow: shadows.card },
  pressed: { transform: [{ translateY: 2 }] },
  art: { height: 150, backgroundColor: colors.paper, overflow: 'hidden' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  bigGlyph: { fontFamily: fontFamily.ui.black, fontSize: 64, color: 'rgba(255,255,255,0.85)' },
  spiral: { position: 'absolute', left: 6, top: 8, bottom: 8, justifyContent: 'space-between' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ink, opacity: 0.8 },
  badge: { position: 'absolute', top: 10, right: 10, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', boxShadow: shadows.round },
  badgeText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: '#ffffff' },
  body: { flex: 1, padding: 14, gap: 6 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 19, color: colors.ink },
  subtitle: { flex: 1, fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.inkSoft },
  bar: { flexDirection: 'row', gap: 6, marginTop: 8 },
  segment: { flex: 1, height: 7, borderRadius: 4 },
  dim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(246, 248, 254, 0.45)' },
});

import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface ParticleDot {
  x: number;
  y: number;
}

/** Un grupo de puntitos del mismo tipo (agua, colorante, sal, aire) con su color y su leyenda. */
export interface ParticleGroup {
  id: string;
  dots: ParticleDot[];
  color: string;
  radius: number;
  label: string;
}

interface ParticleBenchProps {
  /** El vaso o la jeringa, tal como se ven. */
  image: ImageSourcePropType;
  width: number;
  /** `false` = solo el dibujo, sin los puntitos (antes de imaginar el modelo). */
  showDots: boolean;
  groups: ParticleGroup[];
  /** Jeringa: dónde está el émbolo dentro de la cámara (0–1 del ancho); sin él la cámara es un vaso de puntitos. */
  plunger?: number;
  /** Un tinte sobre el agua del vaso (cuando el colorante ya está repartido por todo el vaso). */
  tint?: { color: string; opacity: number };
  /** Rótulo corto del panel de puntitos. */
  panelTitle: string;
  label: string;
}

/**
 * El modelo de puntitos (C5-U01): a la izquierda lo que se ve (el vaso o la jeringa) y a la derecha lo que se imagina (los puntitos).
 * Los puntitos y su posición los da el MODELO (`labs/particulas.ts`); aquí solo se dibujan. Es un dibujo, no una fotografía.
 */
export function ParticleBench({ image, width, showDots, groups, plunger, tint, panelTitle, label }: ParticleBenchProps) {
  const inner = width - 24;
  const syringe = plunger !== undefined;
  const pictureW = showDots ? Math.round(inner * (syringe ? 0.36 : 0.4)) : Math.round(inner * 0.55);
  const panelW = Math.max(120, inner - pictureW - 10);
  const panelH = syringe ? Math.round(panelW * 0.72) : Math.round(panelW * 0.9);
  const dotAt = (d: ParticleDot, r: number) => ({ left: d.x * panelW - r, top: d.y * panelH - r });
  return (
    <View style={[styles.card, { width }]} accessible accessibilityRole="image" accessibilityLabel={label}>
      <View style={styles.row}>
        <View style={{ width: pictureW, height: pictureW }}>
          <Image source={image} style={{ width: pictureW, height: pictureW }} resizeMode="contain" accessible={false} />
          {tint ? <View pointerEvents="none" style={{ position: 'absolute', left: '19%', top: '53%', width: '62%', height: '36%', borderRadius: 16, backgroundColor: tint.color, opacity: tint.opacity }} /> : null}
        </View>
        {showDots ? (
          <View style={{ width: panelW, gap: 6 }}>
            <Text style={styles.title}>{panelTitle}</Text>
            <View style={[styles.panel, { width: panelW, height: panelH }]}>
              {groups.map((g) => g.dots.map((d, i) => <View key={`${g.id}${i}`} pointerEvents="none" style={[{ position: 'absolute', width: g.radius * 2, height: g.radius * 2, borderRadius: g.radius, backgroundColor: g.color }, dotAt(d, g.radius)]} />))}
              {syringe ? <View pointerEvents="none" style={[styles.plunger, { left: Math.min(panelW - 12, plunger * panelW), height: panelH }]} /> : null}
            </View>
          </View>
        ) : null}
      </View>
      {showDots ? (
        <View style={styles.legend}>
          {groups.map((g) => (
            <View key={g.id} style={styles.legendItem}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: g.color }} />
              <Text style={styles.legendText}>{g.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  title: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.navy, textAlign: 'center' },
  panel: { position: 'relative', backgroundColor: '#eef3fb', borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, overflow: 'hidden' },
  plunger: { position: 'absolute', top: 0, width: 12, backgroundColor: colors.slate300, borderLeftWidth: 2, borderLeftColor: colors.slate400 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink },
});

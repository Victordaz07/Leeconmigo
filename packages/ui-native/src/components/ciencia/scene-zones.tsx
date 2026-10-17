import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius } from '../../tokens.ts';
import { FILL_IMAGE } from '../math-visual/objects.tsx';

export interface SceneZone {
  id: string;
  label: string;
  /** Rectángulo tocable, en porcentaje de la imagen (0–100). */
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SceneZonesProps {
  source: ImageSourcePropType;
  /** Ancho / alto de la imagen. */
  aspect: number;
  width: number;
  zones: SceneZone[];
  selected: string[];
  onToggle: (id: string) => void;
  imageLabel: string;
}

/**
 * Escena con zonas que el niño toca para «decir lo que ve» (Ciencia S1). La imagen es solo decorado: las zonas, sus
 * nombres y su marca de elegida los pone la app (texto real, accesible).
 */
export function SceneZones({ source, aspect, width, zones, selected, onToggle, imageLabel }: SceneZonesProps) {
  const height = width / aspect;
  return (
    <View style={[styles.frame, { width, height }]} accessibilityLabel={imageLabel}>
      <Image source={source} style={FILL_IMAGE} resizeMode="cover" accessible={false} />
      {zones.map((z) => {
        const on = selected.includes(z.id);
        return (
          <Pressable
            key={z.id}
            onPress={() => onToggle(z.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={z.label}
            style={[styles.zone, { left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }, on && styles.zoneOn]}
          >
            {on ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>✓ {z.label}</Text>
              </View>
            ) : (
              <View style={styles.dot} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.chip, alignSelf: 'center' },
  zone: { position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.0)' },
  zoneOn: { backgroundColor: 'rgba(30,111,232,0.18)', borderColor: colors.brand },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 2, borderColor: colors.brand },
  chip: { backgroundColor: colors.brand, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { fontFamily: fontFamily.ui.black, fontSize: 14, color: '#ffffff' },
});

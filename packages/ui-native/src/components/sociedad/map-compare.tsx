import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, minTouch, radius, shadows } from '../../tokens.ts';

export interface MapLayer {
  id: string;
  label: string;
  source: ImageSourcePropType;
}

/**
 * Mapa por capas (`docs/research/sociedad-investigacion.md` §7): el niño cambia entre "antes" y "después" del
 * mismo lugar tocando una pestaña. No hay fecha ni escala que inventar: el plano ya trae su propio estilo "a
 * lápiz, sin fecha" (docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md).
 */
export function MapCompare({ layers, active, onChange }: { layers: MapLayer[]; active: string; onChange: (id: string) => void }) {
  const current = layers.find((l) => l.id === active) ?? layers[0];
  return (
    <View style={styles.wrap}>
      <View style={styles.frame}>
        <Image source={current.source} style={styles.image} resizeMode="cover" accessibilityLabel={current.label} />
      </View>
      <View style={styles.tabs}>
        {layers.map((l) => (
          <Pressable key={l.id} onPress={() => onChange(l.id)} accessibilityRole="button" accessibilityLabel={l.label} accessibilityState={{ selected: l.id === active }} style={[styles.tab, l.id === active && styles.tabOn]}>
            <Text style={[styles.tabText, l.id === active && styles.tabTextOn]}>{l.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, alignSelf: 'stretch' },
  frame: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.paper, boxShadow: shadows.card, aspectRatio: 1536 / 1024 },
  image: { width: '100%', height: '100%' },
  tabs: { flexDirection: 'row', gap: 10, alignSelf: 'center' },
  tab: { minHeight: minTouch, minWidth: 120, paddingHorizontal: 18, borderRadius: radius.pill, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.subjSociedad },
  tabText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  tabTextOn: { color: '#ffffff' },
});

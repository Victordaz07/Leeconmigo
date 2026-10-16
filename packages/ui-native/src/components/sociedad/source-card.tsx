import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface SourceCardData {
  id: string;
  kindLabel: string;
  title: string;
  caption: string;
  source?: ImageSourcePropType;
}

/**
 * Mesa de fuentes (`docs/research/sociedad-investigacion.md` §7): una tarjeta por fuente (mapa, foto, testimonio).
 * Con `onToggle` se puede tocar para marcarla como usada (paso "explicar"); sin él, es solo informativa (pasos
 * "fuente"/"testimonio"). Un testimonio sin imagen (`source` vacío) muestra solo su ícono de tipo.
 */
export function SourceCard({ data, selected, onToggle }: { data: SourceCardData; selected?: boolean; onToggle?: () => void }) {
  const content = (
    <View style={[styles.card, selected && styles.cardOn]}>
      {data.source ? (
        <Image source={data.source} style={styles.image} resizeMode="cover" accessible={false} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageGlyph}>“ ”</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.kind}>{data.kindLabel.toUpperCase()}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.caption}>{data.caption}</Text>
      </View>
      {selected !== undefined && <View style={[styles.check, selected && styles.checkOn]}>{selected && <Text style={styles.checkGlyph}>✓</Text>}</View>}
    </View>
  );
  if (!onToggle) return content;
  return (
    <Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityLabel={data.title} accessibilityState={{ checked: !!selected }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 220, borderRadius: radius.card, backgroundColor: '#ffffff', boxShadow: shadows.card, overflow: 'hidden' },
  cardOn: { boxShadow: shadows.brandGlow },
  image: { width: '100%', height: 130 },
  noImage: { width: '100%', height: 130, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  noImageGlyph: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.subjSociedad },
  body: { padding: 14, gap: 4 },
  kind: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.subjSociedad, letterSpacing: 0.5 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.ink },
  caption: { fontFamily: fontFamily.ui.regular, fontSize: 13, color: colors.muted },
  check: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.line },
  checkOn: { backgroundColor: colors.ok, borderColor: colors.okDark },
  checkGlyph: { color: '#ffffff', fontFamily: fontFamily.ui.black, fontSize: 16 },
});

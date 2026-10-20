import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, COLLAGE_COPY, EXAMPLE_PALETTES, UNIT2_COPY, UNIT3_COPY, UNIT_COPY, kindOf, type ArtLang, type ArtLibrary } from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ARTE_ART, COVER_ASPECT, HERO_CREAM } from './art';

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  onBack: () => void;
  onNewRhythm: () => void;
  onNewPainting: () => void;
  onNewCollage: () => void;
  onOpen: (id: string) => void;
  /** Encuentros hechos de la unidad guiada A1-U04. */
  unitDone: number;
  onOpenUnit: () => void;
  /** Encuentros hechos de la unidad guiada A2-U02. */
  unit2Done: number;
  onOpenUnit2: () => void;
  /** Encuentros hechos de la unidad guiada A1-U06. */
  unit3Done: number;
  onOpenUnit3: () => void;
}

/** Inicio del cuaderno «Arte y música»: el Taller libre destacado y las creaciones guardadas. Todo abre (D13-1), sin notas ni puntos. */
export function ArteHome({ lang, library, onBack, onNewRhythm, onNewPainting, onNewCollage, onOpen, unitDone, onOpenUnit, unit2Done, onOpenUnit2, unit3Done, onOpenUnit3 }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const u = UNIT_COPY[lang];
  const u2 = UNIT2_COPY[lang];
  const cc = COLLAGE_COPY[lang];
  const u3 = UNIT3_COPY[lang];
  const wide = layout.width >= 720;
  // tamaños explícitos (la proporción de la imagen es 3:2): así se ve igual en el teléfono y en la tableta
  const innerW = layout.width - 2 * layout.gutter;
  const heroW = wide ? Math.round(innerW * 0.62) : innerW;
  const heroH = Math.round(heroW / COVER_ASPECT);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>{t.title}</Text>
      </View>
      <Text style={styles.note}>{t.intro}</Text>

      <View style={[styles.free, wide && styles.freeWide]}>
        <Image source={ARTE_ART.hero} resizeMode="cover" accessible={false} style={{ width: heroW, height: heroH }} />
        <View style={[styles.freeText, wide && styles.freeTextWide]}>
          <Text style={styles.freeTitle}>{t.freeTitle}</Text>
          <Text style={styles.freeHint}>{t.freeHint}</Text>
          <View style={styles.freeButtons}>
            <Button label={t.newRhythm} onPress={onNewRhythm} />
            <Button label={t.newPainting} variant="secondary" onPress={onNewPainting} />
            <Button label={cc.newCollage} variant="secondary" onPress={onNewCollage} />
          </View>
        </View>
      </View>

      <Text style={styles.h3}>{t.challenges}</Text>
      <Pressable onPress={onOpenUnit} accessibilityRole="button" accessibilityLabel={`${u.title}. ${u.card(unitDone)}`} style={styles.unit}>
        <Image source={ARTE_ART.unitA1U04} resizeMode="cover" accessible={false} style={styles.unitImage} />
        <View style={styles.unitText}>
          <Text style={styles.unitTag}>{u.suggested} · {u.grade}</Text>
          <Text style={styles.unitTitle}>{u.title}</Text>
          <Text style={styles.cardMeta}>{u.blurb}</Text>
          <Text style={styles.cardMeta}>{u.card(unitDone)}</Text>
        </View>
        <Text style={styles.unitGo}>{unitDone > 0 ? u.resume : u.start} ›</Text>
      </Pressable>
      <Pressable onPress={onOpenUnit2} accessibilityRole="button" accessibilityLabel={`${u2.title}. ${u2.card(unit2Done)}`} style={styles.unit}>
        <View style={styles.unitTile} accessible={false}>
          {EXAMPLE_PALETTES.A.map((hex) => (
            <View key={hex} style={[styles.unitTileCell, { backgroundColor: hex }]} />
          ))}
        </View>
        <View style={styles.unitText}>
          <Text style={styles.unitTag}>{u2.suggested} · {u2.grade}</Text>
          <Text style={styles.unitTitle}>{u2.title}</Text>
          <Text style={styles.cardMeta}>{u2.blurb}</Text>
          <Text style={styles.cardMeta}>{u2.card(unit2Done)}</Text>
        </View>
        <Text style={styles.unitGo}>{unit2Done > 0 ? u2.resume : u2.start} ›</Text>
      </Pressable>
      <Pressable onPress={onOpenUnit3} accessibilityRole="button" accessibilityLabel={`${u3.title}. ${u3.card(unit3Done)}`} style={styles.unit}>
        <View style={[styles.unitTile, { backgroundColor: '#CFE8F7' }]} accessible={false}>
          {(['#F9D548', '#E4572E', '#3C78D8', '#4CA64C'] as const).map((hex) => (
            <View key={hex} style={styles.unitTileCell}>
              <View style={[styles.unitTileDot, { backgroundColor: hex }]} />
            </View>
          ))}
        </View>
        <View style={styles.unitText}>
          <Text style={styles.unitTag}>{u3.suggested} · {u3.grade}</Text>
          <Text style={styles.unitTitle}>{u3.title}</Text>
          <Text style={styles.cardMeta}>{u3.blurb}</Text>
          <Text style={styles.cardMeta}>{u3.card(unit3Done)}</Text>
        </View>
        <Text style={styles.unitGo}>{unit3Done > 0 ? u3.resume : u3.start} ›</Text>
      </Pressable>

      <Text style={styles.h3}>{t.creations}</Text>
      {library.projects.length === 0 ? (
        <Text style={styles.note}>{t.noCreations}</Text>
      ) : (
        <View style={styles.list}>
          {library.projects.map((p) => (
            <Pressable key={p.id} onPress={() => onOpen(p.id)} accessibilityRole="button" accessibilityLabel={t.open(p.title)} style={styles.card}>
              <Text style={styles.cardGlyph}>{kindOf(p) === 'painting' ? '🎨' : kindOf(p) === 'collage' ? '✂' : '♪'}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={styles.cardMeta}>{kindOf(p) === 'painting' ? t.paintKind : kindOf(p) === 'collage' ? cc.kind : t.rhythmKind}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
      <Text style={styles.privacy}>{t.privacy}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  free: { backgroundColor: HERO_CREAM, borderRadius: radius.card, overflow: 'hidden', boxShadow: shadows.card },
  freeWide: { flexDirection: 'row' },
  freeText: { padding: 20, gap: 10, alignItems: 'flex-start' },
  freeTextWide: { flex: 1, justifyContent: 'center' },
  freeTitle: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy },
  freeHint: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  unit: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18, boxShadow: shadows.card },
  unitImage: { width: 132, height: Math.round(132 / COVER_ASPECT), borderRadius: 14 },
  unitText: { flex: 1, gap: 4 },
  unitTag: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.brand },
  unitTitle: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  unitTile: { width: 132, height: Math.round(132 / COVER_ASPECT), borderRadius: 14, overflow: 'hidden', flexDirection: 'row', flexWrap: 'wrap' },
  unitTileCell: { width: '50%', height: '50%', alignItems: 'center', justifyContent: 'center' },
  unitTileDot: { width: 28, height: 28, borderRadius: 14 },
  unitGo: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.brand },
  freeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft },
  cardGlyph: { fontSize: 30, color: colors.brand, width: 40, textAlign: 'center' },
  cardText: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  privacy: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted, marginTop: 6 },
});

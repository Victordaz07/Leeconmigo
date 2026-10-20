import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, UNIT_COPY, type ArtLang, type ArtLibrary } from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  onBack: () => void;
  onNewRhythm: () => void;
  onOpen: (id: string) => void;
  /** Encuentros hechos de la unidad guiada A1-U04. */
  unitDone: number;
  onOpenUnit: () => void;
}

/** Inicio del cuaderno «Arte y música»: el Taller libre destacado y las creaciones guardadas. Todo abre (D13-1), sin notas ni puntos. */
export function ArteHome({ lang, library, onBack, onNewRhythm, onOpen, unitDone, onOpenUnit }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const u = UNIT_COPY[lang];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>{t.title}</Text>
      </View>
      <Text style={styles.note}>{t.intro}</Text>

      <View style={styles.free}>
        <Text style={styles.freeTitle}>{t.freeTitle}</Text>
        <Text style={styles.freeHint}>{t.freeHint}</Text>
        <Button label={t.newRhythm} onPress={onNewRhythm} />
      </View>

      <Text style={styles.h3}>{t.challenges}</Text>
      <Pressable onPress={onOpenUnit} accessibilityRole="button" accessibilityLabel={`${u.title}. ${u.card(unitDone)}`} style={styles.unit}>
        <View style={styles.unitText}>
          <Text style={styles.unitTag}>{u.suggested} · {u.grade}</Text>
          <Text style={styles.unitTitle}>{u.title}</Text>
          <Text style={styles.cardMeta}>{u.blurb}</Text>
          <Text style={styles.cardMeta}>{u.card(unitDone)}</Text>
        </View>
        <Text style={styles.unitGo}>{unitDone > 0 ? u.resume : u.start} ›</Text>
      </Pressable>

      <Text style={styles.h3}>{t.creations}</Text>
      {library.projects.length === 0 ? (
        <Text style={styles.note}>{t.noCreations}</Text>
      ) : (
        <View style={styles.list}>
          {library.projects.map((p) => (
            <Pressable key={p.id} onPress={() => onOpen(p.id)} accessibilityRole="button" accessibilityLabel={t.open(p.title)} style={styles.card}>
              <Text style={styles.cardGlyph}>♪</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={styles.cardMeta}>{t.rhythmKind}</Text>
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
  free: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 10, alignItems: 'flex-start', boxShadow: shadows.card },
  freeTitle: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy },
  freeHint: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  unit: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18, boxShadow: shadows.card },
  unitText: { flex: 1, gap: 4 },
  unitTag: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.brand },
  unitTitle: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  unitGo: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.brand },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft },
  cardGlyph: { fontSize: 30, color: colors.brand, width: 40, textAlign: 'center' },
  cardText: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  privacy: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted, marginTop: 6 },
});

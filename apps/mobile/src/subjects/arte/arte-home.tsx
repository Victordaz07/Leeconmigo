import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, COLLAGE_COPY, MUSEUM_COPY, UNIT2_COPY, UNIT3_COPY, UNIT_COPY, kindOf, type ArtLang, type ArtLibrary } from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ARTE_ART, COVER_ASPECT, HERO_CREAM, MUSEO_ART } from './art';
import { CreationThumb, hasThumb } from './creation-thumb';

/** Cuántas creaciones muestran miniatura (las más recientes). Con muchas, pintar todas a la vez pesaría; «Mi museo» (AR-M2) las guardará ya hechas. */
const THUMBS = 12;

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  onBack: () => void;
  onNewRhythm: () => void;
  onNewPainting: () => void;
  onNewCollage: () => void;
  onOpen: (id: string) => void;
  /** «Mi museo» (AR-M2). */
  onOpenMuseum: () => void;
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

interface UnitCardProps {
  phone: boolean;
  onPress: () => void;
  label: string;
  tag: string;
  title: string;
  blurb: string;
  meta: string;
  go: string;
  children: ReactNode;
}

/** Tarjeta de una unidad guiada. En una tableta va en una fila; en un teléfono la imagen y el texto van juntos y «Empezar» debajo (si no, el texto quedaba en una columna angosta). */
function UnitCard({ phone, onPress, label, tag, title, blurb, meta, go, children }: UnitCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.unit, phone && styles.unitPhone]}>
      <View style={styles.unitRow}>
        {children}
        <View style={styles.unitText}>
          <Text style={styles.unitTag}>{tag}</Text>
          <Text style={styles.unitTitle}>{title}</Text>
          <Text style={styles.cardMeta}>{blurb}</Text>
          <Text style={styles.cardMeta}>{meta}</Text>
        </View>
        {!phone && <Text style={styles.unitGo}>{go}</Text>}
      </View>
      {phone && <Text style={[styles.unitGo, styles.unitGoPhone]}>{go}</Text>}
    </Pressable>
  );
}

/** Inicio del cuaderno «Arte y música»: el Taller libre destacado y las creaciones guardadas. Todo abre (D13-1), sin notas ni puntos. */
export function ArteHome({ lang, library, onBack, onNewRhythm, onNewPainting, onNewCollage, onOpen, onOpenMuseum, unitDone, onOpenUnit, unit2Done, onOpenUnit2, unit3Done, onOpenUnit3 }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const u = UNIT_COPY[lang];
  const u2 = UNIT2_COPY[lang];
  const cc = COLLAGE_COPY[lang];
  const u3 = UNIT3_COPY[lang];
  const mu = MUSEUM_COPY[lang];
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
      <UnitCard phone={layout.phone} onPress={onOpenUnit} label={`${u.title}. ${u.card(unitDone)}`} tag={`${u.suggested} · ${u.grade}`} title={u.title} blurb={u.blurb} meta={u.card(unitDone)} go={`${unitDone > 0 ? u.resume : u.start} ›`}>
        <Image source={ARTE_ART.unitA1U04} resizeMode="cover" accessible={false} style={layout.phone ? styles.unitVisualPhone : styles.unitImage} />
      </UnitCard>
      <UnitCard phone={layout.phone} onPress={onOpenUnit2} label={`${u2.title}. ${u2.card(unit2Done)}`} tag={`${u2.suggested} · ${u2.grade}`} title={u2.title} blurb={u2.blurb} meta={u2.card(unit2Done)} go={`${unit2Done > 0 ? u2.resume : u2.start} ›`}>
        <Image source={ARTE_ART.unitA2U02} resizeMode="cover" accessible={false} style={layout.phone ? styles.unitVisualPhone : styles.unitImage} />
      </UnitCard>
      <UnitCard phone={layout.phone} onPress={onOpenUnit3} label={`${u3.title}. ${u3.card(unit3Done)}`} tag={`${u3.suggested} · ${u3.grade}`} title={u3.title} blurb={u3.blurb} meta={u3.card(unit3Done)} go={`${unit3Done > 0 ? u3.resume : u3.start} ›`}>
        <Image source={ARTE_ART.unitA1U06} resizeMode="cover" accessible={false} style={layout.phone ? styles.unitVisualPhone : styles.unitImage} />
      </UnitCard>

      <Text style={styles.h3}>{t.creations}</Text>
      {library.projects.length > 0 && (
        <Pressable onPress={onOpenMuseum} accessibilityRole="button" accessibilityLabel={`${mu.button}. ${mu.buttonHint}`} style={styles.museumBtn}>
          <Image source={MUSEO_ART.frames.coral.source} resizeMode="contain" accessible={false} style={styles.museumImg} />
          <View style={styles.unitText}>
            <Text style={styles.unitTitle}>{mu.button}</Text>
            <Text style={styles.cardMeta}>{mu.buttonHint}</Text>
          </View>
          <Text style={styles.unitGo}>›</Text>
        </Pressable>
      )}
      {library.projects.length === 0 ? (
        <Text style={styles.note}>{t.noCreations}</Text>
      ) : (
        <View style={styles.list}>
          {library.projects.map((p, i) => (
            <Pressable key={p.id} onPress={() => onOpen(p.id)} accessibilityRole="button" accessibilityLabel={t.open(p.title)} style={styles.card}>
              {i < THUMBS && hasThumb(p) ? <CreationThumb project={p} width={layout.phone ? 72 : 96} /> : <Text style={styles.cardGlyph}>{kindOf(p) === 'painting' ? '🎨' : kindOf(p) === 'collage' ? '✂' : '♪'}</Text>}
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
  unit: { gap: 10, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18, boxShadow: shadows.card },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  unitPhone: { padding: 14 },
  unitVisualPhone: { width: 88, height: Math.round(88 / COVER_ASPECT), borderRadius: 12 },
  unitGoPhone: { alignSelf: 'flex-end' },
  unitImage: { width: 132, height: Math.round(132 / COVER_ASPECT), borderRadius: 14 },
  unitText: { flex: 1, gap: 4 },
  unitTag: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.brand },
  unitTitle: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  unitGo: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.brand },
  museumBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, backgroundColor: colors.paper, borderRadius: radius.card, padding: 12, boxShadow: shadows.card },
  museumImg: { width: 84, height: 56 },
  freeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft },
  cardGlyph: { fontSize: 30, color: colors.brand, width: 40, textAlign: 'center' },
  cardText: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  privacy: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted, marginTop: 6 },
});

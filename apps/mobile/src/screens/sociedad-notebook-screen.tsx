import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SocialUnit } from '@lee-conmigo/contracts';
import { SOCIAL_COPY, type SocialLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { SOCIAL_COVERS } from '../sociedad-art';

export interface SociedadNotebookProgress {
  stepsDone: string[];
  stars: 0 | 1 | 2 | 3;
}

interface SociedadNotebookScreenProps {
  lang: SocialLang;
  unit: SocialUnit;
  progress: SociedadNotebookProgress;
  onBack: () => void;
  onOpen: () => void;
}

/**
 * Cuaderno de Sociedad abierto: hoy es una sola unidad piloto (S3-U03), así que no hay camino de varias lecciones
 * como en Matemáticas — una portada y un botón para empezar o retomar la investigación. Los estándares NO se
 * muestran al niño (solo a padres, en borrador, docs/13).
 */
export function SociedadNotebookScreen({ lang, unit, progress, onBack, onOpen }: SociedadNotebookScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = SOCIAL_COPY;
  const done = progress.stars > 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <GradientView gradient={gradients.subjSociedad} style={styles.pill}>
          <Text style={styles.pillText}>⚑ {t.subject[lang]}</Text>
        </GradientView>
      </View>

      <View style={[styles.banner, { height: layout.phone ? 150 : 220 }]}>
        <Image source={SOCIAL_COVERS.notebook} style={styles.bannerImage} resizeMode="cover" accessible={false} />
      </View>

      <Text style={styles.kicker}>{t.notebook.unit[lang].toUpperCase()} 1</Text>
      <Text style={[styles.title, layout.phone && styles.titleSmall]}>{unit.title[lang]}</Text>
      <Text style={styles.castNote}>{t.notebook.castNote[lang]}</Text>

      <View style={styles.cta}>
        <Button label={(done ? t.notebook.again : t.notebook.start)[lang](unit.title[lang])} large onPress={onOpen} />
      </View>

      {done && (
        <View style={styles.progressRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.segment, i < progress.stars && styles.segmentOn]} />
          ))}
        </View>
      )}

      <Text style={styles.draft}>{t.notebook.draft[lang]}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 14, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { paddingHorizontal: 16, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: '#ffffff' },
  banner: { borderRadius: radius.panel, overflow: 'hidden', boxShadow: shadows.card },
  bannerImage: { width: '100%', height: '100%' },
  kicker: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.subjSociedad, letterSpacing: 0.5 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  titleSmall: { fontSize: 26 },
  castNote: { fontFamily: fontFamily.ui.regular, fontSize: 15, color: colors.muted },
  cta: { marginTop: 6, alignItems: 'flex-start' },
  progressRow: { flexDirection: 'row', gap: 8 },
  segment: { width: 40, height: 10, borderRadius: 5, backgroundColor: colors.track },
  segmentOn: { backgroundColor: colors.subjSociedad },
  draft: { fontFamily: fontFamily.ui.regular, fontSize: 12, color: colors.muted2 },
});

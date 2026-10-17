import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SocialUnit } from '@lee-conmigo/contracts';
import { SOCIAL_COPY, type SocialLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { SOCIAL_COVERS } from '../sociedad-art';

export interface UnitProgress {
  stepsDone: string[];
  stars: 0 | 1 | 2 | 3;
}

/** Progreso de Sociedad de un niño: una entrada por unidad (una por grado), nunca una sola (ahora hay 6). */
export type SociedadProgress = Record<string, UnitProgress>;

export const EMPTY_UNIT_PROGRESS: UnitProgress = { stepsDone: [], stars: 0 };

interface SociedadNotebookScreenProps {
  lang: SocialLang;
  units: readonly SocialUnit[];
  progress: SociedadProgress;
  onBack: () => void;
  onOpenUnit: (unitId: string) => void;
}

/**
 * Cuaderno de Sociedad: una unidad piloto por grado (1.º–6.º), como el camino de lecciones de Matemáticas — sin
 * bloqueos, todo abre (docs/13: "sin bloqueos: todo abre; lo sugerido se destaca"). Los estándares NO se
 * muestran al niño (solo a padres, en borrador).
 */
export function SociedadNotebookScreen({ lang, units, progress, onBack, onOpenUnit }: SociedadNotebookScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = SOCIAL_COPY;
  const vertical = layout.narrow || layout.portrait;
  const next = units.find((u) => (progress[u.id]?.stars ?? 0) === 0) ?? units[0];

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

      <Text style={styles.title}>{t.notebook.title[lang]}</Text>
      <Text style={styles.castNote}>{t.notebook.castNote[lang]}</Text>

      <View style={[styles.path, vertical && styles.pathVertical]}>
        {units.map((u, i) => {
          const p = progress[u.id] ?? EMPTY_UNIT_PROGRESS;
          const done = p.stars > 0;
          const here = u.id === next.id && !done;
          return (
            <View key={u.id} style={[styles.stop, vertical && styles.stopVertical]}>
              {i > 0 && <View style={vertical ? styles.connectorV : styles.connectorH} />}
              <View style={[styles.nodeWrap, vertical && styles.nodeWrapVertical]}>
                {here && <Text style={styles.here}>{t.notebook.hereLabel[lang]}</Text>}
                <Button label={done ? '★'.repeat(p.stars) : String(u.grade)} variant={here ? 'primary' : 'secondary'} onPress={() => onOpenUnit(u.id)} />
                <Text style={styles.stopTitle} numberOfLines={2}>
                  {u.title[lang]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.draft}>{t.notebook.draft[lang]}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 14, maxWidth: 880, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { paddingHorizontal: 16, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: '#ffffff' },
  banner: { borderRadius: radius.panel, overflow: 'hidden', boxShadow: shadows.card },
  bannerImage: { width: '100%', height: '100%' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy },
  castNote: { fontFamily: fontFamily.ui.regular, fontSize: 15, color: colors.muted },
  path: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 4, marginTop: 10 },
  pathVertical: { flexDirection: 'column' },
  stop: { flexDirection: 'row', alignItems: 'center' },
  stopVertical: { flexDirection: 'column', alignItems: 'flex-start' },
  connectorH: { width: 24, height: 4, backgroundColor: colors.track, borderRadius: 2 },
  connectorV: { width: 4, height: 24, backgroundColor: colors.track, borderRadius: 2, marginLeft: 31 },
  nodeWrap: { alignItems: 'center', gap: 6, width: 110 },
  nodeWrapVertical: { flexDirection: 'row', width: '100%', gap: 14 },
  here: { fontFamily: fontFamily.ui.extrabold, fontSize: 11, color: colors.subjSociedad },
  stopTitle: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  draft: { fontFamily: fontFamily.ui.regular, fontSize: 12, color: colors.muted2, marginTop: 8 },
});

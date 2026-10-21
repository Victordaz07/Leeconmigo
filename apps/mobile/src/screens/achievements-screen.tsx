import { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeProgressStats } from '@lee-conmigo/session-engine';
import type { MathLang } from '@lee-conmigo/ui-core';
import { ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ACHIEVEMENTS_COPY } from '../achievements-copy';
import { achievementsOf, earnedCount } from '../achievements';
import { progressStoreFor, type ChildProfile } from '../app-state';
import { BADGE_IMAGES, EMPTY_IMAGES, KITE_IMAGES } from '../kitewise-art';

interface Props {
  profile: ChildProfile;
  lang: MathLang;
  onBack: () => void;
}

/** Logros (K8b): las 7 pegatinas. Las ganadas se ven a color; las que faltan, apagadas y con lo que hace falta, como una invitación. */
export function AchievementsScreen({ profile, lang, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = ACHIEVEMENTS_COPY[lang];
  const list = useMemo(() => achievementsOf(computeProgressStats(progressStoreFor(profile.id).summaries())), [profile.id]);
  const won = earnedCount(list);
  const cols = layout.width >= 900 ? 4 : layout.width >= 600 ? 3 : 2;
  const cardW = `${Math.floor(100 / cols) - 2}%` as const;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={c.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.headerText}>
          <Text style={[styles.title, layout.phone && styles.titleSmall]}>{c.title}</Text>
          <Text style={styles.count}>{c.count(won, list.length)}</Text>
        </View>
        <Image source={KITE_IMAGES.idle} resizeMode="contain" accessible={false} style={styles.kite} />
      </View>
      <Text style={styles.intro}>{c.intro}</Text>
      {won === 0 && (
        <View style={styles.empty}>
          <Image source={EMPTY_IMAGES.badges} resizeMode="contain" accessible={false} style={styles.emptyImg} />
          <Text style={styles.note}>{c.empty}</Text>
        </View>
      )}
      <View style={styles.grid}>
        {list.map((a) => {
          const t = c.badges[a.id];
          return (
            <View key={a.id} style={[styles.card, { width: cardW }]} accessible accessibilityLabel={`${t.name}. ${a.earned ? t.earned : `${t.hint} ${c.progress(a.have, a.need)}`}`}>
              <Image source={BADGE_IMAGES[a.id]} resizeMode="contain" accessible={false} style={[styles.badge, !a.earned && styles.badgeOff]} />
              <Text style={styles.name}>{t.name}</Text>
              {a.earned ? (
                <>
                  <Text style={styles.earned}>✓ {c.earned}</Text>
                  <Text style={styles.small}>{t.earned}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.small}>{t.hint}</Text>
                  {a.need > 1 && <Text style={styles.progress}>{c.progress(a.have, a.need)}</Text>}
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerText: { flex: 1 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  count: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.muted },
  kite: { width: 72, height: 72 },
  intro: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft, flex: 1 },
  empty: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.paper, borderRadius: radius.card, padding: 14, boxShadow: shadows.card },
  emptyImg: { width: 110, height: 110 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 14, gap: 4, alignItems: 'center', boxShadow: shadows.card, minWidth: 150 },
  badge: { width: 104, height: 104 },
  badgeOff: { opacity: 0.28 },
  name: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, textAlign: 'center' },
  earned: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ok },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted, textAlign: 'center' },
  progress: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.brand },
});

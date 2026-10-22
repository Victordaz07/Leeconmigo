import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LifeMission } from '@lee-conmigo/life-content';
import { VIDA_COPY, VIDA_MODULES, type VidaLang, type VidaModuleId } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, GradientView, radius, RoundButton, shadows, useLayout, type GradientName, gradients } from '@lee-conmigo/ui-native';
import { Card, Frame } from './parts';
import type { VidaArt } from './art';
import type { MissionProgress } from './player';

export type VidaProgress = Record<string, MissionProgress>;

interface NotebookProps {
  lang: VidaLang;
  module: VidaModuleId;
  gradient: GradientName;
  accent: string;
  art: VidaArt;
  glyph: string;
  mission: LifeMission;
  progress: VidaProgress;
  onBack: () => void;
  onOpen: () => void;
}

const t = VIDA_COPY;

/** Ficha de un cuaderno de «Para la vida»: de qué trata, su primera misión («Primer vistazo») y el aviso de que todo es inventado. Sin bloqueos (D9). */
export function VidaNotebook({ lang, module, gradient, accent, art, glyph, mission, progress, onBack, onOpen }: NotebookProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const meta = VIDA_MODULES[module];
  const p = progress[mission.id];
  const done = (p?.stars ?? 0) > 0;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.button.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <GradientView gradient={gradients[gradient]} style={styles.pill}>
          <Text style={styles.pillText}>{glyph} {meta.name[lang]}</Text>
        </GradientView>
        <Text style={styles.shelf}>{t.shelf[lang]} · {meta.n}</Text>
      </View>

      <GradientView gradient={gradients[gradient]} style={styles.banner}>
        <View style={styles.bannerTexts}>
          <Text style={styles.bannerGlyph}>{glyph}</Text>
          <Text style={styles.bannerText}>{meta.tagline[lang]}</Text>
          <Text style={styles.bannerGuide}>{t.guideSays[lang](meta.guide)}</Text>
        </View>
        <Image source={art.guide} style={styles.guide} resizeMode="contain" accessible={false} />
      </GradientView>

      <Text style={styles.intro}>{meta.intro[lang]}</Text>

      <Card>
        <Frame source={art.scenes[0]} />
        <Text style={[styles.badge, { color: accent }]}>{t.preview[lang].toUpperCase()}</Text>
        <Text style={styles.grade}>{t.mission[lang](mission.grade)} · {t.meetings[lang](mission.steps.length)}</Text>
        <Text style={styles.missionTitle}>{mission.title[lang]}</Text>
        <Text style={styles.blurb}>{mission.blurb[lang]}</Text>
        {done && <Text style={styles.done}>{'★'.repeat(p!.stars)}{'☆'.repeat(3 - p!.stars)} · {t.done[lang]}</Text>}
        <View style={styles.cta}>
          <Button label={done ? t.button.again[lang] : t.button.start[lang]} onPress={onOpen} large />
        </View>
      </Card>

      <Text style={styles.note}>{t.previewNote[lang]}</Text>
      <Text style={styles.note}>{mission.safety[lang]}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 16, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  pill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: '#ffffff' },
  shelf: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  banner: { borderRadius: radius.panel, padding: 22, paddingRight: 8, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 170, overflow: 'hidden', boxShadow: shadows.card },
  bannerTexts: { flex: 1, gap: 8 },
  guide: { width: 150, height: 150 },
  bannerGlyph: { fontFamily: fontFamily.ui.black, fontSize: 40, color: '#ffffff' },
  bannerText: { fontFamily: fontFamily.ui.black, fontSize: 24, lineHeight: 30, color: '#ffffff' },
  bannerGuide: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  intro: { fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 25, color: colors.ink },
  badge: { fontFamily: fontFamily.ui.black, fontSize: 12, letterSpacing: 1 },
  grade: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  missionTitle: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.ink },
  blurb: { fontFamily: fontFamily.read.regular, fontSize: 16, lineHeight: 23, color: colors.inkSoft },
  done: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.okDark },
  cta: { alignItems: 'flex-start', marginTop: 4 },
  note: { fontFamily: fontFamily.ui.bold, fontSize: 13, lineHeight: 19, color: colors.muted },
});

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FINANCE_UNITS, type FinanceUnit } from '@lee-conmigo/finance-content';
import { FINANZAS_COPY, type FinanzasLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { UnitProgress } from './player';
import { Card, Um } from './parts';

export type FinanzasProgress = Record<string, UnitProgress>;

interface NotebookProps {
  lang: FinanzasLang;
  progress: FinanzasProgress;
  onBack: () => void;
  onOpenUnit: (unit: FinanceUnit) => void;
}

const t = FINANZAS_COPY;

/** Cuaderno de Finanzas: la unidad del piloto (4.º) y el aviso de que todo el dinero es de mentira. Sin bloqueos: todo abre (D9). */
export function FinanzasNotebook({ lang, progress, onBack, onOpenUnit }: NotebookProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.button.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <GradientView gradient={gradients.subjFinanzas} style={styles.pill}>
          <Text style={styles.pillText}>◎ {t.subject[lang]}</Text>
        </GradientView>
        <Text style={styles.shelf}>{t.shelf[lang]}</Text>
      </View>

      <GradientView gradient={gradients.subjFinanzas} style={styles.banner}>
        <View style={styles.coins}>
          <Um amount={15} size="lg" />
          <Um amount={20} size="lg" />
          <Um amount={50} size="lg" />
        </View>
        <Text style={styles.bannerText}>{t.tagline[lang]}</Text>
      </GradientView>

      <Text style={styles.pretend}>{t.pretend[lang]}</Text>
      <Text style={styles.heading}>{t.notebook.unitsTitle[lang]}</Text>

      {FINANCE_UNITS.map((u) => {
        const p = progress[u.id];
        const done = (p?.stars ?? 0) > 0;
        return (
          <Card key={u.id}>
            <Text style={styles.grade}>{t.notebook.grade[lang](u.grade)} · {t.notebook.meetings[lang](u.steps.length)}</Text>
            <Text style={styles.unitTitle}>{u.title[lang]}</Text>
            <Text style={styles.blurb}>{u.blurb[lang]}</Text>
            {done && <Text style={styles.done}>{'★'.repeat(p!.stars)}{'☆'.repeat(3 - p!.stars)} · {t.notebook.done[lang]}</Text>}
            <View style={styles.cta}>
              <Button label={done ? t.button.resume[lang] : t.button.start[lang]} onPress={() => onOpenUnit(u)} large />
            </View>
          </Card>
        );
      })}
      <Text style={styles.pretend}>{t.notebook.notFirst[lang]}</Text>
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
  banner: { borderRadius: radius.panel, padding: 22, gap: 14, boxShadow: shadows.card },
  coins: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  bannerText: { fontFamily: fontFamily.ui.black, fontSize: 22, lineHeight: 28, color: '#ffffff' },
  pretend: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  heading: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  grade: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  unitTitle: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.ink },
  blurb: { fontFamily: fontFamily.read.regular, fontSize: 16, lineHeight: 23, color: colors.inkSoft },
  done: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.okDark },
  cta: { alignItems: 'flex-start', marginTop: 4 },
});

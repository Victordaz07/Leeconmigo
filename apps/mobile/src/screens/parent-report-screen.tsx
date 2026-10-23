import { useTranslation } from '@lee-conmigo/ui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SessionSummary } from '@lee-conmigo/contracts';
import type { StoryRepository } from '@lee-conmigo/story-engine';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';
import { exportReportPdf, type ExportResult } from '../report-export';
import { weeklyReport } from '../weekly-report';
import { weekRange, weeklyReportHtml } from '../weekly-report-html';

interface Props {
  profile: ChildProfile;
  summaries: SessionSummary[];
  goalMinutes: number;
  repository: StoryRepository;
  onBack: () => void;
}

const BAR_MAX = 90;
const MESSAGE: Record<ExportResult, string> = {
  shared: '',
  printed: '',
  unavailable: 'Este dispositivo no puede compartir archivos. Prueba desde otra tableta o teléfono.',
  error: 'No se pudo crear el PDF. Inténtalo otra vez.',
};

/**
 * Modo padres · Informe semanal (Kitewise P5): una página con lo de la semana, lista para guardar o compartir como PDF. Es la misma página que se
 * imprime (`weeklyReportHtml`), así lo que ve el adulto aquí es lo que sale en el PDF. Solo hay datos de lectura por ahora; el informe lo dice.
 */
export function ParentReportScreen({ profile, summaries, goalMinutes, repository, onBack }: Props) {

  const { language, t: ui } = useTranslation();
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [weeksAgo, setWeeksAgo] = useState(0);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const report = useMemo(() => weeklyReport(summaries, goalMinutes, new Date(), weeksAgo), [summaries, goalMinutes, weeksAgo]);
  const titleOf = (id: string) => repository.get(id)?.title ?? id;
  const maxMin = Math.max(report.goalMinutes, ...report.days.map((d) => d.minutes), 1);
  const q = report.comprehensionTotal > 0 ? ui("{0} de {1}", report.comprehensionCorrect, report.comprehensionTotal) : ui("Ninguna");
  const focusTotal = report.focus[1] + report.focus[2] + report.focus[3];

  const doExport = async () => {
    setBusy(true);
    setNotice('');
    const result = await exportReportPdf(weeklyReportHtml({ childName: profile.name, report, titleOf, language }), `Kitewise · ${profile.name} · ${weekRange(report.monday, report.sunday, language)}`);
    setNotice(MESSAGE[result]);
    setBusy(false);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 24), paddingBottom: insets.bottom + 28 }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={ui("Volver al panel de padres")}>
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.flex}>
          <Text style={styles.kicker}>{ui("Modo padres")}</Text>
          <Text style={[styles.title, layout.phone && styles.titleSmall]}>{ui("Informe semanal")}</Text>
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {([0, 1] as const).map((w) => (
          <Pressable key={w} onPress={() => setWeeksAgo(w)} accessibilityRole="tab" accessibilityState={{ selected: weeksAgo === w }} style={[styles.tab, weeksAgo === w && styles.tabOn]}>
            <Text style={[styles.tabText, weeksAgo === w && styles.tabTextOn]}>{w === 0 ? ui("Esta semana") : ui("Semana pasada")}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.paper}>
        <View style={styles.paperHead}>
          <Text style={styles.brand}>{ui("Kitewise · resumen semanal")}</Text>
          <Text style={styles.range}>{weekRange(report.monday, report.sunday, language)}</Text>
        </View>
        <Text style={styles.child}>{profile.name}</Text>
        <View style={[styles.cards, layout.narrow && styles.wrap]}>
          <Card label={ui("Minutos de lectura")} value={String(report.totalMinutes)} />
          <Card label={ui("Días con lectura")} value={ui("{0} de 7", report.activeDays)} />
          <Card label={ui("Días con su meta ({0} min)", report.goalMinutes)} value={String(report.goalDays)} />
          <Card label={ui("Preguntas acertadas")} value={q} />
        </View>

        <Text style={styles.h3}>{ui("Minutos por día")}</Text>
        <View style={styles.week} accessibilityLabel={ui("Minutos por día: {0}", report.days.map((d) => `${ui(d.label)} ${d.minutes}`).join(', '))}>
          {report.days.map((d) => (
            <View key={ui(d.label)} style={styles.barCol}>
              <Text style={styles.barNum}>{d.minutes > 0 ? d.minutes : ''}</Text>
              <View style={[styles.bar, { height: d.minutes > 0 ? Math.max(6, (d.minutes / maxMin) * BAR_MAX) : 3, backgroundColor: d.minutes >= report.goalMinutes ? '#22A95C' : d.minutes > 0 ? '#4B97FF' : colors.track }]} />
              <Text style={styles.barLabel}>{ui(d.label)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.h3}>{ui("Lo que leyó")}</Text>
        {report.stories.length === 0 ? (
          <Text style={styles.muted}>{ui("Esta semana no hubo lectura.")}</Text>
        ) : (
          report.stories.map((s) => (
            <View key={s.storyId} style={styles.row}>
              <Text style={[styles.rowTitle, styles.flex]} numberOfLines={1}>
                {titleOf(s.storyId)}
              </Text>
              <Text style={styles.rowMeta}>{s.minutes < 1 ? ui("Menos de 1 min") : `${s.minutes} min`}</Text>
              <Text style={styles.rowState}>{s.completed ? ui("La terminó") : ui("Va en {0} %", Math.round(s.completion * 100))}</Text>
            </View>
          ))
        )}

        <Text style={styles.h3}>{ui("Para practicar juntos")}</Text>
        {report.words.length ? (
          <View style={styles.words}>
            {report.words.slice(0, 12).map((w) => (
              <Text key={w} style={styles.word}>
                {w}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>{ui("No pidió ayuda con ninguna palabra.")}</Text>
        )}

        <Text style={styles.h3}>{ui("Enfoque (según") + " "}{profile.name})</Text>
        <Text style={styles.body}>{focusTotal ? ui("Bien: {0} · Más o menos: {1} · Le costó: {2}", report.focus[3], report.focus[2], report.focus[1]) : ui("{0} no marcó cómo estuvo su enfoque.", profile.name)}</Text>

        <Text style={styles.footer}>{ui("Generado en la tableta. Sin datos de voz ni imágenes: la voz nunca se graba ni se guarda. Es una herramienta de práctica, no una evaluación oficial.")}</Text>
      </View>

      <View style={styles.actions}>
        <Button label={busy ? ui("Preparando…") : ui("Guardar o compartir PDF")} onPress={doExport} disabled={busy} />
        <Text style={styles.hint}>{ui("El PDF se crea en este dispositivo. Tú eliges si lo guardas o a quién se lo mandas.")}</Text>
        {notice !== '' && (
          <Text style={styles.notice} accessibilityLiveRegion="polite">
            {ui(notice)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 16, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, alignSelf: 'stretch' },
  kicker: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  tabs: { flexDirection: 'row', gap: 8, alignSelf: 'stretch' },
  tab: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 999, backgroundColor: '#ffffff', borderWidth: 2, borderColor: 'transparent' },
  tabOn: { borderColor: colors.brand },
  tabText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  tabTextOn: { color: colors.brand },
  paper: { alignSelf: 'center', maxWidth: 720, width: '100%', backgroundColor: '#ffffff', borderRadius: radius.card, padding: 22, gap: 8, boxShadow: shadows.card },
  paperHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, borderBottomWidth: 3, borderBottomColor: colors.brand, paddingBottom: 8 },
  brand: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.brand },
  range: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.muted },
  child: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy, marginTop: 6 },
  cards: { flexDirection: 'row', gap: 10 },
  wrap: { flexWrap: 'wrap' },
  card: { flex: 1, minWidth: 130, backgroundColor: colors.appAlt, borderRadius: radius.tile, padding: 12, gap: 2 },
  cardLabel: { fontFamily: fontFamily.ui.bold, fontSize: 12, color: colors.muted },
  cardValue: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, marginTop: 14 },
  week: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: BAR_MAX + 44 },
  barCol: { alignItems: 'center', justifyContent: 'flex-end', width: '13%', gap: 3 },
  bar: { width: '100%', borderRadius: 6 },
  barNum: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.ink },
  barLabel: { fontFamily: fontFamily.ui.black, fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: colors.track, paddingVertical: 8 },
  rowTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  rowMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted },
  rowState: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.brand },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  word: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink, backgroundColor: '#FFF1C2', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 12 },
  body: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 22, color: colors.inkSoft },
  muted: { fontFamily: fontFamily.ui.semibold, fontSize: 15, color: colors.muted },
  footer: { fontFamily: fontFamily.ui.semibold, fontSize: 12, color: colors.muted, marginTop: 18, borderTopWidth: 1, borderTopColor: colors.track, paddingTop: 8 },
  actions: { alignSelf: 'center', maxWidth: 720, width: '100%', gap: 8, alignItems: 'flex-start' },
  hint: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted },
  notice: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: '#b25e00' },
});

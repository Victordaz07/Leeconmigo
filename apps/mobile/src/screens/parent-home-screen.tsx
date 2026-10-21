import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TodayReport } from '@lee-conmigo/session-engine';
import type { StoryRepository } from '@lee-conmigo/story-engine';
import { energyOption } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';
import { storyImage } from '../story-assets';

interface ParentHomeScreenProps {
  profile: ChildProfile;
  report: TodayReport;
  repository: StoryRepository;
  onBack: () => void;
  onSettings: () => void;
  /** Informe semanal en PDF (Kitewise P5). */
  onReport: () => void;
}

const WEEKDAY = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const FOCUS_LABEL = { 1: 'Le costó', 2: 'Más o menos', 3: 'Bien' } as const;
const BAR_MAX = 120;

/**
 * Modo padres · "Hoy con {niño}" (Kitewise P2). Todo sale de los resúmenes guardados (`todayReport`): si algo no pasó, se
 * dice ("Hoy todavía no ha leído"), nunca se rellena. Sin grabaciones porque no existen (docs/01, docs/07). Las partes del
 * diseño que dependen de funciones que aún no existen (Aula/foto de tarea, Enfoque adaptativo) no se muestran.
 */
export function ParentHomeScreen({ profile, report, repository, onBack, onSettings, onReport }: ParentHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const r = report;
  const layout = useLayout();
  const one = layout.narrow || layout.portrait;
  const maxWeek = Math.max(r.goalMinutes, ...r.week.map((d) => d.minutes));
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 24), paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.header, layout.narrow && styles.headerNarrow]}>
        <RoundButton onPress={onBack} label="Salir de Modo padres">
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.flex}>
          <Text style={styles.kicker}>Modo padres · {WEEKDAY[new Date().getDay()]}</Text>
          <Text style={[styles.title, layout.phone && styles.titleSmall]}>Hoy con {profile.name}</Text>
        </View>
        <Button label="Informe semanal" variant="secondary" onPress={onReport} />
        <Button label="Ajustes" variant="secondary" onPress={onSettings} />
        <View style={[styles.childChip, layout.narrow && styles.hidden]}>
          <GradientView gradient={gradients[profile.avatar]} style={styles.childAvatar}>
            <Text style={styles.childInitial}>{profile.name.slice(0, 1).toUpperCase()}</Text>
          </GradientView>
          <Text style={styles.childName}>{profile.name}</Text>
        </View>
      </View>

      <View style={[styles.statsRow, layout.narrow && styles.wrap]}>
        <Stat glyph="⏱" gradient="brand" label="Minutos de lectura" value={`${r.validMinutes} de ${r.goalMinutes}`} />
        <Stat glyph="◎" gradient="green" label="Preguntas" value={r.comprehensionTotal ? `${r.comprehensionCorrect} de ${r.comprehensionTotal}` : 'Ninguna hoy'} />
        <Stat glyph="☺" gradient="goldDiag" label={`Enfoque (según ${profile.name})`} value={r.focusSelfReport ? FOCUS_LABEL[r.focusSelfReport] : 'No lo dijo hoy'} />
      </View>

      <View style={[styles.columns, one && styles.columnsOne]}>
        <View style={[styles.card, styles.left, one && styles.leftOne]}>
          <Text style={styles.h3}>Lo que hizo hoy</Text>
          {r.activities.length === 0 ? (
            <Text style={styles.empty}>Hoy todavía no ha leído.</Text>
          ) : (
            r.activities.map((a) => {
              const story = repository.get(a.storyId);
              const img = story ? storyImage(story.cover?.src ?? story.pages[0].illustration.src) : undefined;
              const state = a.completed ? 'La terminó' : `Va en ${Math.round(a.completion * 100)} %`;
              return (
                <View key={a.storyId} style={styles.activity}>
                  {img ? <Image source={img} style={styles.thumb} resizeMode="cover" /> : <View style={styles.thumb} />}
                  <View style={styles.flex}>
                    <Text style={styles.activityTitle} numberOfLines={1}>
                      {story?.title ?? a.storyId}
                    </Text>
                    <Text style={styles.activityMeta}>
                      {a.minutes < 1 ? 'Menos de 1 min' : `${a.minutes} min`} · {state}
                    </Text>
                  </View>
                  <GradientView gradient={gradients.subjLectura} style={styles.subjectBadge}>
                    <Text style={styles.subjectBadgeText}>Aa</Text>
                  </GradientView>
                </View>
              );
            })
          )}
          <View style={styles.flex} />
          <Text style={styles.h3}>Esta semana</Text>
          <View style={styles.week} accessibilityLabel={`Minutos esta semana: ${r.week.map((d) => `${d.day} ${d.minutes}`).join(', ')}`}>
            {r.week.map((d) => {
              const h = d.minutes > 0 ? Math.max(10, (d.minutes / maxWeek) * BAR_MAX) : 4;
              return (
                <View key={d.day} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    {d.minutes > 0 ? <GradientView gradient={d.minutes >= r.goalMinutes ? gradients.green : gradients.barLow} style={[styles.bar, { height: h }]} /> : <View style={styles.barEmpty} />}
                  </View>
                  <Text style={styles.barLabel}>{d.day.slice(0, 1)}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.weekNote}>Verde: llegó a la meta de {r.goalMinutes} min.</Text>
        </View>

        <View style={[styles.right, one && styles.rightOne]}>
          <View style={styles.card}>
            <Text style={styles.h3}>Para practicar juntos</Text>
            {r.wordsToday.length ? (
              <>
                <Text style={styles.body}>Pídele que lea estas palabras contigo. Dos minutos bastan.</Text>
                <View style={styles.words}>
                  {r.wordsToday.slice(0, 8).map((w) => (
                    <Text key={w} style={styles.word}>
                      {w}
                    </Text>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.body}>Hoy no pidió ayuda con ninguna palabra.</Text>
            )}
          </View>
          {r.energy && (
            <View style={styles.card}>
              <Text style={styles.h3}>Cómo llegó hoy</Text>
              <Text style={styles.body}>
                {energyOption(r.energy).title} · {energyOption(r.energy).minutes} min de misión
              </Text>
            </View>
          )}
          <View style={[styles.card, styles.privacy]}>
            <Text style={styles.h3}>Privacidad</Text>
            <Text style={styles.body}>La voz de {profile.name} nunca se graba ni se almacena. Aquí solo ves tiempos, preguntas y palabras.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({ glyph, gradient, label, value }: { glyph: string; gradient: keyof typeof gradients; label: string; value: string }) {
  return (
    <View style={[styles.card, styles.stat]}>
      <GradientView gradient={gradients[gradient]} style={styles.statIcon}>
        <Text style={styles.statGlyph}>{glyph}</Text>
      </GradientView>
      <View style={styles.flex}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 18, flexGrow: 1 },
  headerNarrow: { flexWrap: 'wrap' },
  titleSmall: { fontSize: 26 },
  hidden: { display: 'none' },
  wrap: { flexWrap: 'wrap' },
  columnsOne: { flexDirection: 'column' },
  leftOne: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0 },
  rightOne: { flexGrow: 0, flexBasis: 'auto' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  kicker: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  childChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ffffff', borderRadius: radius.pill, paddingVertical: 6, paddingLeft: 6, paddingRight: 18, boxShadow: shadows.chip },
  childAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  childInitial: { fontFamily: fontFamily.ui.black, fontSize: 20, color: '#ffffff' },
  childName: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  statsRow: { flexDirection: 'row', gap: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 22, gap: 10, boxShadow: shadows.card },
  stat: { flex: 1, minWidth: 200, flexDirection: 'row', alignItems: 'center', gap: 16 },
  statIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  statGlyph: { fontSize: 26, color: '#ffffff' },
  statLabel: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  statValue: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy },
  columns: { flexDirection: 'row', gap: 16, flexGrow: 1 },
  left: { flex: 1, minHeight: 420 },
  right: { flex: 0.9, gap: 16 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  body: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 23, color: colors.inkSoft },
  empty: { fontFamily: fontFamily.ui.semibold, fontSize: 16, color: colors.muted, paddingVertical: 12 },
  activity: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.appAlt, borderRadius: radius.tile, padding: 8 },
  thumb: { width: 84, height: 60, borderRadius: 12, backgroundColor: colors.chip },
  activityTitle: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.ink },
  activityMeta: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  subjectBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  subjectBadgeText: { fontFamily: fontFamily.ui.black, fontSize: 14, color: '#ffffff' },
  week: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 16 },
  barCol: { alignItems: 'center', gap: 8 },
  barTrack: { height: BAR_MAX, justifyContent: 'flex-end' },
  bar: { width: 30, borderRadius: 10 },
  barEmpty: { width: 30, height: 4, borderRadius: 2, backgroundColor: colors.track },
  barLabel: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.muted },
  weekNote: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted, textAlign: 'center' },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  word: { fontFamily: fontFamily.read.bold, fontSize: 18, color: colors.ink, backgroundColor: colors.brand50, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6, overflow: 'hidden' },
  privacy: { backgroundColor: colors.okTint, boxShadow: undefined },
});

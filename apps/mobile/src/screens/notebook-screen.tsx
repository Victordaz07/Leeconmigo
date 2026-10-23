import { useTranslation } from '@lee-conmigo/ui-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StoryRepository } from '@lee-conmigo/story-engine';
import { NOTEBOOK_TABS, readingMinutesOfWordCount, subjectById } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, SubjectTab, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';
import type { LibraryModel, StoryEntry } from '../library-model';
import { storyImage } from '../story-assets';

interface NotebookScreenProps {
  profile: ChildProfile;
  model: LibraryModel;
  repository: StoryRepository;
  onBack: () => void;
  onRead: (storyId: string) => void;
}

const lectura = subjectById('lectura');

/**
 * Cuaderno de Lectura abierto (Kitewise B4, `docs/design/kitewise/screens/B4.webp`): a la izquierda el índice (las historias
 * del nivel del niño), a la derecha la historia elegida, y las pestañas de materia en el borde. Sin bloqueos: todo abre;
 * lo sugerido (la misión de hoy) se destaca (docs/13).
 */
export function NotebookScreen({ profile, model, repository, onBack, onRead }: NotebookScreenProps) {
  const { t: ui } = useTranslation();

  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState(model.featured.entry.id);
  const selected = model.stories.find((s) => s.entry.id === selectedId) ?? model.featured;
  const index = model.stories.indexOf(selected);
  const story = repository.get(selected.entry.id)!;
  const cover = story.cover ? storyImage(story.cover.src) : storyImage(story.pages[0].illustration.src);
  const bannerImage = storyImage(model.featuredStory.cover?.src ?? model.featuredStory.pages[0].illustration.src);
  const minutes = readingMinutesOfWordCount(selected.entry.wordCount);
  const questions = Math.min(3, story.pages.filter((p) => p.checkpoint).length);
  const cta = selected.resumePage !== null && selected.resumePage > 0 ? ui("Seguir en la página {0} ›", selected.resumePage + 1) : selected.completed ? ui("Leer otra vez ›") : ui("Empezar ›");
  const layout = useLayout();

  // Teléfono (o tablet en vertical): una sola columna que se desplaza — primero la historia elegida, luego el índice.
  if (layout.width < 1000 || layout.short || layout.portrait) {
    const g = layout.gutter;
    return (
      <ScrollView style={styles.paperScreen} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24, paddingLeft: insets.left + g, paddingRight: insets.right + g, gap: 14 }}>
        <View style={styles.topRow}>
          <RoundButton onPress={onBack} label={ui("Volver")}>
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjLectura} style={styles.subjectPill}>
            <Text style={styles.subjectPillText}>
              {lectura.glyph} {ui(lectura.name)}
            </Text>
          </GradientView>
          <View style={styles.flex} />
          <Text style={styles.meta}>{ui("Nivel") + " "}{profile.level}</Text>
        </View>
        <Text style={[styles.kicker, { color: colors.subjLectura }]}>
          {ui("HISTORIA") + " "}{index + 1} {" " + ui("DE") + " "}{model.stories.length}
        </Text>
        <Text style={[styles.title, styles.titleNarrow]} numberOfLines={3}>
          {story.title}
        </Text>
        {story.description ? <Text style={styles.desc}>{story.description}</Text> : null}
        {cover && <Image source={cover} style={[styles.cover, { height: Math.min(220, Math.round((layout.width - 2 * g) * 0.5)) }]} resizeMode="cover" />}
        <View style={styles.cards}>
          <MomentCard title={ui("Leer")} detail={`${minutes.min}–${minutes.max} min`} color={colors.phaseAprender} ledge={colors.phaseAprenderLedge} small={layout.phone} />
          <MomentCard title={ui("Preguntas")} detail={questions ? `${questions} ${questions === 1 ? ui("pregunta") : ui("preguntas")}` : ui("Sin preguntas")} color={colors.phaseExplorar} ledge={colors.phaseExplorarLedge} small={layout.phone} />
          <MomentCard title={ui("Repaso")} detail={ui("Por sílabas")} color={colors.phasePracticar} ledge={colors.phasePracticarLedge} small={layout.phone} />
        </View>
        <Button label={cta} large onPress={() => onRead(story.id)} />
        <Text style={styles.footerText}>{ui("★ Las palabras que te cuesten vuelven en el repaso.")}</Text>
        <Text style={[styles.h3, { marginTop: 8 }]}>{ui("Índice")}</Text>
        <View style={styles.index}>
          {model.stories.map((s, i) => (
            <IndexRow key={s.entry.id} n={i + 1} item={s} selected={s.entry.id === selected.entry.id} suggested={s.entry.id === model.featured.entry.id} onPress={() => setSelectedId(s.entry.id)} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.desk, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, paddingLeft: insets.left + 20 }]}>
      <View style={styles.spread}>
        {/* Página izquierda: índice */}
        <View style={styles.page}>
          <View style={styles.topRow}>
            <RoundButton onPress={onBack} label={ui("Volver")}>
              <ChevronLeftIcon />
            </RoundButton>
            <GradientView gradient={gradients.subjLectura} style={styles.subjectPill}>
              <Text style={styles.subjectPillText}>
                {lectura.glyph} {ui(lectura.name)}
              </Text>
            </GradientView>
            <View style={styles.flex} />
            <Text style={styles.meta}>{ui("Nivel") + " "}{profile.level}</Text>
          </View>
          <View style={styles.banner}>
            {bannerImage && <Image source={bannerImage} style={FILL} resizeMode="cover" />}
            <LinearGradient colors={['rgba(16,24,64,0)', 'rgba(16,24,64,0.65)']} style={StyleSheet.absoluteFill} />
            <Text style={styles.bannerText}>{ui("Mi cuaderno de lectura")}</Text>
          </View>
          <Text style={styles.h3}>{ui("Índice")}</Text>
          <ScrollView style={styles.flex} contentContainerStyle={styles.index}>
            {model.stories.map((s, i) => (
              <IndexRow key={s.entry.id} n={i + 1} item={s} selected={s.entry.id === selected.entry.id} suggested={s.entry.id === model.featured.entry.id} onPress={() => setSelectedId(s.entry.id)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.gutter} />

        {/* Página derecha: la historia elegida */}
        <View style={[styles.page, styles.rightPage]}>
          <Text style={[styles.kicker, { color: colors.subjLectura }]}>
            {ui("HISTORIA") + " "}{index + 1} {" " + ui("DE") + " "}{model.stories.length}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
          {story.description ? (
            <Text style={styles.desc} numberOfLines={3}>
              {story.description}
            </Text>
          ) : null}
          {cover && <Image source={cover} style={styles.cover} resizeMode="cover" />}
          <View style={styles.cards}>
            <MomentCard title={ui("Leer")} detail={`${minutes.min}–${minutes.max} min`} color={colors.phaseAprender} ledge={colors.phaseAprenderLedge} />
            <MomentCard title={ui("Preguntas")} detail={questions ? `${questions} ${questions === 1 ? ui("pregunta") : ui("preguntas")}` : ui("Sin preguntas")} color={colors.phaseExplorar} ledge={colors.phaseExplorarLedge} />
            <MomentCard title={ui("Repaso")} detail={ui("Por sílabas")} color={colors.phasePracticar} ledge={colors.phasePracticarLedge} />
          </View>
          <View style={styles.flex} />
          <View style={styles.footer}>
            <Text style={styles.footerStar}>★</Text>
            <Text style={styles.footerText}>{ui("Las palabras que te cuesten vuelven en el repaso.")}</Text>
            <Button label={cta} onPress={() => onRead(story.id)} />
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        {NOTEBOOK_TABS.map((s) => (
          <SubjectTab key={s.id} label={s.tab} gradient={gradients[s.gradientToken]} active={s.id === 'lectura'} soon={!s.available} />
        ))}
      </View>
    </View>
  );
}

function IndexRow({ n, item, selected, suggested, onPress }: { n: number; item: StoryEntry; selected: boolean; suggested: boolean; onPress: () => void }) {
  const { t: ui } = useTranslation();

  const label = item.completed ? ui("Leída") : suggested ? ui("Aquí") : '';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.entry.title} accessibilityState={{ selected }} style={[styles.row, selected && styles.rowSelected]}>
      <View style={[styles.num, item.completed && styles.numDone, suggested && !item.completed && styles.numHere]}>
        <Text style={[styles.numText, (item.completed || suggested) && styles.numTextOn]}>{item.completed ? '✓' : n}</Text>
      </View>
      <Text style={styles.rowTitle} numberOfLines={1}>
        {item.entry.title}
      </Text>
      {label ? <Text style={[styles.rowLabel, { color: item.completed ? colors.masteryDominado : colors.brand }]}>{label}</Text> : null}
    </Pressable>
  );
}

function MomentCard({ title, detail, color, ledge, small }: { title: string; detail: string; color: string; ledge: string; small?: boolean }) {
  return (
    <View style={[styles.card, small && styles.cardSmall, { backgroundColor: color, boxShadow: `inset 0px -5px 0px ${ledge}` }]}>
      <Text style={[styles.cardTitle, small && styles.cardTitleSmall]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {title}
      </Text>
      <Text style={styles.cardDetail}>{detail}</Text>
    </View>
  );
}

/** Llenar el contenedor con ancho/alto explícitos (en React Native Web `absoluteFill` solo no basta para una imagen). */
const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  desk: { flex: 1, flexDirection: 'row', backgroundColor: colors.desk },
  paperScreen: { flex: 1, backgroundColor: colors.paper },
  titleNarrow: { fontSize: 30 },
  spread: { flex: 1, flexDirection: 'row', backgroundColor: colors.paper, borderRadius: radius.panel, overflow: 'hidden', boxShadow: '0px 18px 40px rgba(30, 35, 64, 0.18)' },
  page: { flex: 1, padding: 28, gap: 14 },
  rightPage: { paddingRight: 32 },
  gutter: { width: 36, backgroundColor: colors.paperGutter },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subjectPill: { borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 9 },
  subjectPillText: { fontFamily: fontFamily.ui.black, fontSize: 15, color: '#ffffff' },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  banner: { height: 140, borderRadius: radius.card, overflow: 'hidden', justifyContent: 'flex-end', padding: 18, backgroundColor: colors.subjLectura },
  bannerText: { fontFamily: fontFamily.ui.black, fontSize: 28, color: '#ffffff' },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  index: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingHorizontal: 10, borderRadius: 14, borderBottomWidth: 1, borderBottomColor: colors.paperLine },
  rowSelected: { backgroundColor: colors.brand50, borderWidth: 2, borderColor: colors.brandLight },
  num: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.chip },
  numDone: { backgroundColor: colors.ok },
  numHere: { backgroundColor: colors.brand },
  numText: { fontFamily: fontFamily.ui.black, fontSize: 14, color: colors.muted },
  numTextOn: { color: '#ffffff' },
  rowTitle: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  rowLabel: { fontFamily: fontFamily.ui.black, fontSize: 13 },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 14, letterSpacing: 1 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.navy },
  desc: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: colors.inkSoft, lineHeight: 26 },
  cover: { height: 150, borderRadius: radius.card, width: '100%' },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flex: 1, minWidth: 96, borderRadius: radius.tile, padding: 14, minHeight: 84, gap: 4 },
  cardSmall: { padding: 10, minWidth: 90 },
  cardTitleSmall: { fontSize: 16 },
  cardTitle: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.ink },
  cardDetail: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.inkSoft },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footerStar: { fontSize: 34, color: colors.gold },
  footerText: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.inkSoft },
  tabs: { justifyContent: 'center', gap: 10, paddingTop: 70, alignItems: 'flex-end' },
});

import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { columnsFor, itemWidth, LIFE_SUBJECTS, SUBJECTS, VIDA_COPY, type Subject, type SubjectId } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, gradients, GradientView, navRailWidth, NotebookCover, radius, SessionPhases, StatChip, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';
import type { LibraryModel } from '../library-model';
import { storyImage } from '../story-assets';
import { MATH_COVERS } from '../math-art';
import { availableModule } from '../subjects/registry';
import { VIDA_BANNER } from '../subjects/vida/art';

const LANGUAGE_NAME = { es: 'Español', en: 'English' } as const;

interface HomeScreenProps {
  profile: ChildProfile;
  /** Minutos de la misión de hoy (según "¿Cómo llegas hoy?" o la meta del padre). */
  minutes: number;
  model: LibraryModel;
  onContinue: () => void;
  onOpenReading: () => void;
  /** Cuaderno de Matemáticas (K6): subtítulo y progreso de su portada. */
  math: { subtitle: string; segments: 0 | 1 | 2 | 3 };
  onOpenMath: () => void;
  /** Materias por módulo (Ciencia, Sociedad…): su portada sale del módulo y abre su pantalla. */
  onOpenSubject: (id: SubjectId) => void;
  /** Tocar el avatar vuelve a "¿Quién aprende hoy?" (B1). */
  onSwitchProfile: () => void;
}

/**
 * Inicio (Kitewise B3, `docs/design/kitewise/screens/B3.webp`): saludo, racha y estrellas reales, la misión de hoy y la
 * estantería de cuadernos. Hoy solo Lectura tiene contenido; las demás materias se ven como "Pronto" (no se inventan).
 */
export function HomeScreen({ profile, minutes, model, onContinue, onOpenReading, math, onOpenMath, onOpenSubject, onSwitchProfile }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const { narrow, gutter } = layout;
  const available = layout.width - navRailWidth(layout.nav) - 2 * gutter - (layout.nav === 'bottom' ? 0 : insets.right);
  const gap = narrow ? 12 : 14;
  const cols = columnsFor(available, narrow ? 150 : 160, gap);
  const coverWidth = itemWidth(available, cols, gap);
  // «Para la vida» tiene nombres largos («Pensamiento crítico»): sus portadas son un poco más anchas.
  const lifeWidth = itemWidth(available, columnsFor(available, 200, gap), gap);
  const { featured, featuredStory, stats } = model;
  const cover = featuredStory.cover ? storyImage(featuredStory.cover.src) : storyImage(featuredStory.pages[0].illustration.src);
  const resumeLabel = featured.resumePage !== null && featured.resumePage > 0 ? `${featuredStory.title} · página ${featured.resumePage + 1}` : featuredStory.title;

  const renderSubject = (s: Subject, width: number = coverWidth) => {
    const isReading = s.id === 'lectura';
    const isMath = s.id === 'mate';
    const mod = availableModule(s.id);
    const card = mod?.homeCard(profile, profile.language === 'en' ? 'en' : 'es');
    return (
      <NotebookCover
        key={s.id}
        title={s.name}
        subtitle={isReading ? resumeLabel : isMath ? math.subtitle : (card?.subtitle ?? '')}
        image={isReading ? cover : isMath ? MATH_COVERS.notebook : card?.image}
        glyph={s.glyph}
        color={colors[s.colorToken]}
        gradient={gradients[s.gradientToken]}
        segments={isReading ? model.readingSegments : isMath ? math.segments : (card?.segments ?? 0)}
        soon={!s.available && !mod}
        onPress={isReading ? onOpenReading : isMath ? onOpenMath : mod ? () => onOpenSubject(s.id) : undefined}
        width={width}
      />
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: gutter, paddingTop: insets.top + (narrow ? 16 : 28), paddingBottom: (layout.nav === 'bottom' ? 0 : insets.bottom) + 24 }]}>
      <View style={styles.header}>
        <View style={[styles.greeting, narrow && styles.greetingNarrow]}>
          <Text style={[styles.hello, narrow && styles.helloNarrow]} numberOfLines={1} adjustsFontSizeToFit>
            ¡Hola, {profile.name}!
          </Text>
          <Text style={styles.sub}>Hoy son {minutes} minutos. Yo te guío.</Text>
        </View>
        <StatChip icon={<Text style={styles.flame}>🔥</Text>} label={`${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}`} accessibilityLabel={`Racha de ${stats.streakDays} días`} />
        <StatChip icon={<Text style={styles.star}>★</Text>} label={String(stats.starsTotal)} accessibilityLabel={`${stats.starsTotal} estrellas`} />
        <Pressable onPress={onSwitchProfile} accessibilityRole="button" accessibilityLabel="Cambiar de niño">
          <GradientView gradient={gradients[profile.avatar]} style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
          </GradientView>
        </Pressable>
      </View>

      <View style={[styles.mission, narrow && styles.missionNarrow]}>
        {cover && <Image source={cover} style={FILL} resizeMode="cover" />}
        {narrow ? (
          <LinearGradient colors={['rgba(16,24,64,0.05)', 'rgba(16,24,64,0.55)', 'rgba(16,24,64,0.92)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
        ) : (
          <LinearGradient colors={['rgba(16,24,64,0.9)', 'rgba(16,24,64,0.55)', 'rgba(16,24,64,0)']} locations={[0, 0.45, 0.8]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        )}
        <View style={[styles.missionText, narrow && styles.missionTextNarrow]}>
          <Text style={styles.missionKicker}>MISIÓN DE HOY · {minutes} MIN</Text>
          <Text style={[styles.missionTitle, narrow && styles.missionTitleNarrow]} numberOfLines={2}>
            {featuredStory.title}
          </Text>
          {/* Los momentos de una sesión de Lectura de hoy (leer → preguntas → repaso), no los 4 de Kitewise: esos llegan en K5/K6. */}
          <SessionPhases phases={[{ label: 'Leer', state: 'current' }, { label: 'Preguntas', state: 'todo' }, { label: 'Repaso', state: 'todo' }]} />
        </View>
        <View style={[styles.missionCta, narrow && styles.missionCtaNarrow]}>
          <Button label="Seguir ›" variant="cta" large onPress={onContinue} />
        </View>
      </View>

      <View style={styles.shelfHeader}>
        <Text style={styles.h2}>Tus cuadernos</Text>
        <Text style={styles.shelfMeta}>
          Nivel {profile.level} · {LANGUAGE_NAME[profile.language]}
        </Text>
      </View>
      <View style={[styles.shelf, { gap }]}>
        {SUBJECTS.filter((s) => s.group !== 'vida').map((s) => renderSubject(s))}
      </View>

      <View style={styles.shelfHeader}>
        <Text style={styles.h2}>{VIDA_COPY.shelf[profile.language === 'en' ? 'en' : 'es']}</Text>
      </View>
      <View style={styles.vidaBanner}>
        <Image source={VIDA_BANNER} style={FILL} resizeMode="cover" accessible={false} />
      </View>
      <View style={[styles.shelf, { gap }]}>
        {LIFE_SUBJECTS.map((s) => renderSubject(s, lifeWidth))}
      </View>
    </ScrollView>
  );
}

/** Llenar el contenedor con ancho/alto explícitos (en React Native Web `absoluteFill` solo no basta para una imagen). */
const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 22 },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  vidaBanner: { width: '100%', aspectRatio: 2.4, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.chip },
  greeting: { flex: 1, minWidth: 220 },
  greetingNarrow: { flexBasis: '100%' },
  hello: { fontFamily: fontFamily.ui.black, fontSize: 38, color: colors.navy },
  helloNarrow: { fontSize: 30 },
  sub: { fontFamily: fontFamily.ui.bold, fontSize: 17, color: colors.muted },
  flame: { fontSize: 16 },
  star: { fontSize: 18, color: colors.ink },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#ffffff' },
  avatarText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: '#ffffff' },
  mission: { height: 190, borderRadius: radius.panel, overflow: 'hidden', backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', boxShadow: '0px 16px 36px rgba(30, 35, 64, 0.22)' },
  missionText: { flex: 1, paddingLeft: 32, paddingRight: 16, gap: 10 },
  missionKicker: { fontFamily: fontFamily.ui.black, fontSize: 14, letterSpacing: 1, color: 'rgba(255,255,255,0.85)' },
  missionTitle: { fontFamily: fontFamily.ui.black, fontSize: 34, color: '#ffffff' },
  missionCta: { paddingRight: 32, alignSelf: 'flex-end', paddingBottom: 26 },
  missionNarrow: { height: 'auto', minHeight: 210, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-end', paddingVertical: 20 },
  missionTextNarrow: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', paddingLeft: 20, paddingRight: 20 },
  missionTitleNarrow: { fontSize: 26 },
  missionCtaNarrow: { alignSelf: 'flex-start', paddingLeft: 20, paddingRight: 0, paddingBottom: 0, paddingTop: 14 },
  shelfHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  h2: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  shelfMeta: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  shelf: { flexDirection: 'row', flexWrap: 'wrap' },
});

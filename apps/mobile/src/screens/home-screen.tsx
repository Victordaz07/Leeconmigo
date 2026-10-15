import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SUBJECTS } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, gradients, GradientView, NotebookCover, radius, SessionPhases, StatChip } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';
import type { LibraryModel } from '../library-model';
import { storyImage } from '../story-assets';

const LANGUAGE_NAME = { es: 'Español', en: 'English' } as const;

interface HomeScreenProps {
  profile: ChildProfile;
  model: LibraryModel;
  onContinue: () => void;
  onOpenReading: () => void;
}

/**
 * Inicio (Kitewise B3, `docs/design/kitewise/screens/B3.webp`): saludo, racha y estrellas reales, la misión de hoy y la
 * estantería de cuadernos. Hoy solo Lectura tiene contenido; las demás materias se ven como "Pronto" (no se inventan).
 */
export function HomeScreen({ profile, model, onContinue, onOpenReading }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { featured, featuredStory, stats } = model;
  const cover = featuredStory.cover ? storyImage(featuredStory.cover.src) : storyImage(featuredStory.pages[0].illustration.src);
  const resumeLabel = featured.resumePage !== null && featured.resumePage > 0 ? `${featuredStory.title} · página ${featured.resumePage + 1}` : featuredStory.title;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 28 }]}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.hello}>¡Hola, {profile.name}!</Text>
          <Text style={styles.sub}>Hoy son {profile.dailyGoalMinutes} minutos. Yo te guío.</Text>
        </View>
        <StatChip icon={<Text style={styles.flame}>🔥</Text>} label={`${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}`} accessibilityLabel={`Racha de ${stats.streakDays} días`} />
        <StatChip icon={<Text style={styles.star}>★</Text>} label={String(stats.starsTotal)} accessibilityLabel={`${stats.starsTotal} estrellas`} />
        <GradientView gradient={gradients.sunDiag} style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
        </GradientView>
      </View>

      <View style={styles.mission}>
        {cover && <Image source={cover} style={FILL} resizeMode="cover" />}
        <LinearGradient colors={['rgba(16,24,64,0.9)', 'rgba(16,24,64,0.55)', 'rgba(16,24,64,0)']} locations={[0, 0.45, 0.8]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        <View style={styles.missionText}>
          <Text style={styles.missionKicker}>MISIÓN DE HOY · {profile.dailyGoalMinutes} MIN</Text>
          <Text style={styles.missionTitle} numberOfLines={2}>
            {featuredStory.title}
          </Text>
          {/* Los momentos de una sesión de Lectura de hoy (leer → preguntas → repaso), no los 4 de Kitewise: esos llegan en K5/K6. */}
          <SessionPhases phases={[{ label: 'Leer', state: 'current' }, { label: 'Preguntas', state: 'todo' }, { label: 'Repaso', state: 'todo' }]} />
        </View>
        <View style={styles.missionCta}>
          <Button label="Seguir ›" variant="cta" large onPress={onContinue} />
        </View>
      </View>

      <View style={styles.shelfHeader}>
        <Text style={styles.h2}>Tus cuadernos</Text>
        <Text style={styles.shelfMeta}>
          Nivel {profile.level} · {LANGUAGE_NAME[profile.language]}
        </Text>
      </View>
      <View style={styles.shelf}>
        {SUBJECTS.map((s) => {
          const isReading = s.id === 'lectura';
          return (
            <NotebookCover
              key={s.id}
              title={s.name}
              subtitle={isReading ? resumeLabel : ''}
              image={isReading ? cover : undefined}
              glyph={s.glyph}
              color={colors[s.colorToken]}
              gradient={gradients[s.gradientToken]}
              segments={isReading ? model.readingSegments : 0}
              soon={!s.available}
              onPress={isReading ? onOpenReading : undefined}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

/** Llenar el contenedor con ancho/alto explícitos (en React Native Web `absoluteFill` solo no basta para una imagen). */
const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { paddingHorizontal: 36, gap: 22 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { flex: 1 },
  hello: { fontFamily: fontFamily.ui.black, fontSize: 38, color: colors.navy },
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
  shelfHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  h2: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  shelfMeta: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  shelf: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, minHeight: 340 },
});

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, colors, fontFamily, GearIcon, HomeIcon, MathArtProvider, NavRail, TrophyIcon, useLayout, type NavRailItem } from '@lee-conmigo/ui-native';
import { resolveFocus, todayReport } from '@lee-conmigo/session-engine';
import { energyOption, progressSegments, type Energy, type SubjectId } from '@lee-conmigo/ui-core';
import { MATH_UNITS } from '@lee-conmigo/math-content';
import { loadPin, loadProfiles, mathProgressFor, newChildProfile, savePin, saveProfiles, progressStoreFor, resetProgressFor, type ChildProfile } from './src/app-state';
import { createBundledRepository } from './src/bundled-stories';
import { SHOW_DEV_TOOLS } from './src/dev-tools';
import { MATH_ART } from './src/math-art';
import { useAppFonts } from './src/fonts';
import { buildLibraryModel } from './src/library-model';
import { EnergyScreen } from './src/screens/energy-screen';
import { HomeScreen } from './src/screens/home-screen';
import { MathLessonScreen } from './src/screens/math-lesson-screen';
import { MathNotebookScreen } from './src/screens/math-notebook-screen';
import { availableModule } from './src/subjects/registry';
import { VisualReviewScreen } from './src/screens/math-visual/review-screen';
import { WorkshopScreen } from './src/screens/math-visual/workshop-screen';
import { NotebookScreen } from './src/screens/notebook-screen';
import { ParentGateScreen } from './src/screens/parent-gate-screen';
import { ParentHomeScreen } from './src/screens/parent-home-screen';
import { ParentSettingsScreen } from './src/screens/parent-settings-screen';
import { ProfilesScreen } from './src/screens/profiles-screen';
import { VoiceTestScreen } from './src/screens/voice-test-screen';
import { ReadingScreen } from './src/screens/reading-screen';
import { Showcase } from './src/screens/showcase';

type Route =
  | { name: 'home' }
  | { name: 'parentGate'; next: 'parents' | 'addChild' }
  | { name: 'parents' }
  | { name: 'settings'; isNew: boolean }
  | { name: 'voiceTest' }
  | { name: 'mathNotebook' }
  | { name: 'mathLesson'; lessonId: string }
  | { name: 'mathWorkshop' }
  | { name: 'mathReview' }
  | { name: 'subject'; id: SubjectId }
  | { name: 'notebook' } | { name: 'reading'; storyId: string; from: 'home' | 'notebook' } | { name: 'dev' } | { name: 'showcase' };

const RAIL: NavRailItem[] = [
  { key: 'home', label: 'Inicio', icon: (on) => <HomeIcon active={on} /> },
  { key: 'logros', label: 'Logros', icon: (on) => <TrophyIcon active={on} /> },
];
const RAIL_BOTTOM: NavRailItem[] = [
  { key: 'padres', label: 'Padres', icon: () => <GearIcon /> },
  ...(SHOW_DEV_TOOLS ? [{ key: 'dev', label: 'DEV', icon: () => <Text style={{ fontSize: 20 }}>⚙</Text> }] : []),
];

/**
 * Kitewise (D9/D10, docs/13): ¿Quién aprende hoy? (B1) → ¿Cómo llegas hoy? (B2, si el padre lo dejó activo) → Inicio con la estantería de cuadernos (B3) → cuaderno de Lectura (B4) → lectura. Logros y
 * Padres llegan en K4/K8. En desarrollo, "DEV" abre la lista completa de historias y la muestra de componentes.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <MathArtProvider art={MATH_ART}>
        <Root />
      </MathArtProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

function Root() {
  const fontsLoaded = useAppFonts();
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  const repository = useMemo(() => createBundledRepository(), []);
  // Perfiles y PIN se guardan en el equipo (RN-08) en cuanto cambian.
  const [profiles, setProfiles] = useState<ChildProfile[]>(loadProfiles);
  useEffect(() => saveProfiles(profiles), [profiles]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const profile = profiles.find((p) => p.id === profileId) ?? null;
  // `undefined` = todavía no respondió "¿Cómo llegas hoy?"; `null` = no se pregunta (ajuste de padres).
  const [energy, setEnergy] = useState<Energy | null | undefined>(undefined);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [parentPin, setParentPin] = useState<string | null>(loadPin);
  useEffect(() => savePin(parentPin), [parentPin]);
  const gateNext = route.name === 'parentGate' ? route.next : 'parents';
  const openGated = useCallback(
    (created: string | null) => {
      if (created) setParentPin(created);
      setRoute(gateNext === 'addChild' ? { name: 'settings', isNew: true } : { name: 'parents' });
    },
    [gateNext],
  );
  // Sube cada vez que cambia el progreso (se salió de una lectura, se borró): hay que recalcular Inicio y el cuaderno.
  const [progressVersion, setProgressVersion] = useState(0);
  const model = useMemo(() => (profile ? buildLibraryModel(repository, progressStoreFor(profile.id), profile) : null), [repository, profile, progressVersion]);

  if (!fontsLoaded) return <View style={styles.screen} />;

  const home = () => setRoute({ name: 'home' });
  if (route.name === 'parentGate') return <ParentGateScreen savedPin={parentPin} onOpen={openGated} onBack={home} />;
  if (route.name === 'settings' && route.isNew) {
    return (
      <ParentSettingsScreen
        initial={newChildProfile(profiles)}
        isNew
        onSave={(p) => {
          setProfiles((list) => [...list, p]);
          home();
        }}
        onCancel={home}
      />
    );
  }

  if (!profile || !model) {
    return (
      <ProfilesScreen
        profiles={profiles}
        onPick={(p) => {
          setProfileId(p.id);
          setEnergy(p.askEnergy ? undefined : null);
          home();
        }}
        onAdd={() => setRoute({ name: 'parentGate', next: 'addChild' })}
      />
    );
  }
  if (energy === undefined) return <EnergyScreen name={profile.name} onStart={setEnergy} />;
  // Apoyos del Modo Enfoque que rigen ahora (posición del padre + horario).
  const focus = resolveFocus(profile.focus);

  const minutes = energy ? energyOption(energy).minutes : profile.dailyGoalMinutes;
  const switchProfile = () => {
    setProfileId(null);
    setEnergy(undefined);
  };

  if (route.name === 'reading') {
    const story = repository.get(route.storyId);
    const back = route.from;
    if (story) {
      return (
        <ReadingScreen
          key={story.id}
          story={story}
          profile={profile}
          energy={energy}
          goalMinutes={minutes}
          focusReading={focus.focusReading}
          movementBreaks={focus.movementBreaks}
          onExit={() => {
            setProgressVersion((v) => v + 1);
            setRoute(back === 'home' ? { name: 'home' } : { name: 'notebook' });
          }}
        />
      );
    }
  }
  if (route.name === 'parents') {
    return (
      <ParentHomeScreen
        profile={profile}
        report={todayReport(progressStoreFor(profile.id).summaries(), minutes)}
        repository={repository}
        onBack={home}
        onSettings={() => setRoute({ name: 'settings', isNew: false })}
      />
    );
  }
  if (route.name === 'voiceTest') return <VoiceTestScreen language={profile.language === 'en' ? 'en' : 'es'} onBack={() => setRoute({ name: 'settings', isNew: false })} />;
  if (route.name === 'settings') {
    const toPanel = () => setRoute({ name: 'parents' });
    return (
      <ParentSettingsScreen
        initial={profile}
        isNew={false}
        onSave={(p) => {
          setProfiles((list) => list.map((x) => (x.id === p.id ? p : x)));
          toPanel();
        }}
        onCancel={toPanel}
        onResetProgress={() => {
          resetProgressFor(profile.id);
          setProgressVersion((v) => v + 1);
          toPanel();
        }}
        onRemove={
          profiles.length > 1
            ? () => {
                resetProgressFor(profile.id);
                setProfiles((list) => list.filter((x) => x.id !== profile.id));
                switchProfile();
                home();
              }
            : undefined
        }
        onChangePin={() => {
          setParentPin(null);
          setRoute({ name: 'parentGate', next: 'parents' });
        }}
        onVoiceTest={() => setRoute({ name: 'voiceTest' })}
      />
    );
  }
  if (route.name === 'notebook') {
    return <NotebookScreen profile={profile} model={model} repository={repository} onBack={home} onRead={(storyId) => setRoute({ name: 'reading', storyId, from: 'notebook' })} />;
  }
  const mathUnit = MATH_UNITS[0];
  const mathProgress = mathProgressFor(profile.id);
  const lang = profile.language === 'en' ? 'en' : 'es';
  if (route.name === 'mathLesson') {
    const lesson = mathUnit.lessons.find((l) => l.id === route.lessonId);
    if (lesson) {
      return (
        <MathLessonScreen
          key={lesson.id}
          lang={lang}
          unit={mathUnit}
          lesson={lesson}
          minutes={minutes}
          progress={mathProgress}
          calm={focus.reducedMotion}
          movementBreaks={focus.movementBreaks}
          profileId={profile.id}
          onExit={() => {
            setProgressVersion((v) => v + 1);
            setRoute({ name: 'mathNotebook' });
          }}
        />
      );
    }
  }
  if (route.name === 'mathWorkshop') {
    return (
      <WorkshopScreen
        lang={lang}
        grade={Math.min(6, Math.max(1, profile.level))}
        progress={mathProgress}
        roundSize={focus.roundSize}
        calm={focus.reducedMotion}
        movementBreaks={focus.movementBreaks}
        profileId={profile.id}
        onExit={() => {
          setProgressVersion((v) => v + 1);
          setRoute({ name: 'mathNotebook' });
        }}
      />
    );
  }
  if (route.name === 'mathReview') return <VisualReviewScreen onBack={() => setRoute({ name: 'dev' })} />;
  if (route.name === 'mathNotebook') {
    return (
      <MathNotebookScreen
        lang={lang}
        unit={mathUnit}
        progress={mathProgress}
        onBack={home}
        onOpenLesson={(lessonId) => setRoute({ name: 'mathLesson', lessonId })}
        onOpenWorkshop={() => setRoute({ name: 'mathWorkshop' })}
      />
    );
  }
  if (route.name === 'subject') {
    // Materias por módulo (Ciencia, Sociedad…): cada una maneja su navegación interna.
    const mod = availableModule(route.id);
    if (mod) return <mod.Screen key={route.id} profile={profile} lang={lang} minutes={minutes} focus={focus} onExit={home} />;
  }
  if (route.name === 'showcase') return <Showcase onBack={() => setRoute({ name: 'dev' })} />;
  if (route.name === 'dev') return <DevList repository={repository} onOpen={(storyId) => setRoute({ name: 'reading', storyId, from: 'home' })} onShowcase={() => setRoute({ name: 'showcase' })} onMathReview={() => setRoute({ name: 'mathReview' })} onBack={home} />;

  const onNav = (key: string) => (key === 'dev' ? setRoute({ name: 'dev' }) : key === 'padres' ? setRoute({ name: 'parentGate', next: 'parents' }) : undefined);
  const nav = <NavRail items={RAIL} bottomItems={RAIL_BOTTOM} active="home" onSelect={onNav} variant={layout.nav} bottomInset={insets.bottom} />;
  return (
    <View style={[styles.row, layout.nav === 'bottom' && styles.column]}>
      {layout.nav !== 'bottom' && nav}
      <View style={styles.screen}>
        <HomeScreen
          profile={profile}
          minutes={minutes}
          model={model}
          onContinue={() => setRoute({ name: 'reading', storyId: model.featured.entry.id, from: 'home' })}
          onOpenReading={() => setRoute({ name: 'notebook' })}
          math={{ subtitle: mathUnit.title[lang], segments: progressSegments(mathUnit.lessons.filter((l) => mathProgress.lessonsDone.has(l.id)).length, mathUnit.lessons.length) }}
          onOpenMath={() => setRoute({ name: 'mathNotebook' })}
          onOpenSubject={(id) => setRoute({ name: 'subject', id })}
          onSwitchProfile={switchProfile}
        />
      </View>
      {layout.nav === 'bottom' && nav}
    </View>
  );
}

const LANGUAGE_NAME: Record<string, string> = { es: 'Español', en: 'English' };

/** Solo desarrollo: todas las historias (todos los idiomas y niveles) y la muestra de componentes. */
function DevList({ repository, onOpen, onShowcase, onMathReview, onBack }: { repository: ReturnType<typeof createBundledRepository>; onOpen: (id: string) => void; onShowcase: () => void; onMathReview: () => void; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const stories = repository.list();
  return (
    <FlatList
      style={styles.screen}
      data={stories}
      keyExtractor={(s) => s.id}
      contentContainerStyle={[styles.list, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>DEV · {stories.length} variantes</Text>
          <View style={styles.headerButtons}>
            <Button label="‹ Inicio" variant="secondary" onPress={onBack} />
            <Button label="Ver componentes" variant="secondary" onPress={onShowcase} />
            <Button label="Matemáticas visuales" variant="secondary" onPress={onMathReview} />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={`Leer ${item.title}`}>
          <Card>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.id} · Nivel {item.level} · {LANGUAGE_NAME[item.language] ?? item.language} · {item.pageCount} págs.
            </Text>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', backgroundColor: colors.app },
  column: { flexDirection: 'column' },
  screen: { flex: 1, backgroundColor: colors.app },
  list: { paddingHorizontal: 24, gap: 12 },
  header: { gap: 12, marginBottom: 12 },
  headerButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted, marginTop: 4 },
});

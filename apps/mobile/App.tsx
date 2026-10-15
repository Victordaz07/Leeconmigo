import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, colors, fontFamily, GearIcon, HomeIcon, NavRail, TrophyIcon, type NavRailItem } from '@lee-conmigo/ui-native';
import { energyOption, type Energy } from '@lee-conmigo/ui-core';
import { PROFILES, progressStoreFor, type ChildProfile } from './src/app-state';
import { createBundledRepository } from './src/bundled-stories';
import { useAppFonts } from './src/fonts';
import { buildLibraryModel } from './src/library-model';
import { EnergyScreen } from './src/screens/energy-screen';
import { HomeScreen } from './src/screens/home-screen';
import { NotebookScreen } from './src/screens/notebook-screen';
import { ProfilesScreen } from './src/screens/profiles-screen';
import { ReadingScreen } from './src/screens/reading-screen';
import { Showcase } from './src/screens/showcase';

type Route = { name: 'home' } | { name: 'notebook' } | { name: 'reading'; storyId: string; from: 'home' | 'notebook' } | { name: 'dev' } | { name: 'showcase' };

const RAIL: NavRailItem[] = [
  { key: 'home', label: 'Inicio', icon: (on) => <HomeIcon active={on} /> },
  { key: 'logros', label: 'Logros', icon: (on) => <TrophyIcon active={on} /> },
];
const RAIL_BOTTOM: NavRailItem[] = [
  { key: 'padres', label: 'Padres', icon: () => <GearIcon /> },
  ...(__DEV__ ? [{ key: 'dev', label: 'DEV', icon: () => <Text style={{ fontSize: 20 }}>⚙</Text> }] : []),
];

/**
 * Kitewise (D9/D10, docs/13): ¿Quién aprende hoy? (B1) → ¿Cómo llegas hoy? (B2, si el padre lo dejó activo) → Inicio con la estantería de cuadernos (B3) → cuaderno de Lectura (B4) → lectura. Logros y
 * Padres llegan en K4/K8. En desarrollo, "DEV" abre la lista completa de historias y la muestra de componentes.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <Root />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

function Root() {
  const fontsLoaded = useAppFonts();
  const repository = useMemo(() => createBundledRepository(), []);
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  // `undefined` = todavía no respondió "¿Cómo llegas hoy?"; `null` = no se pregunta (ajuste de padres).
  const [energy, setEnergy] = useState<Energy | null | undefined>(undefined);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  // Sube cada vez que se sale de una lectura: el progreso cambió y hay que recalcular Inicio y el cuaderno.
  const [progressVersion, setProgressVersion] = useState(0);
  const model = useMemo(() => (profile ? buildLibraryModel(repository, progressStoreFor(profile.id), profile) : null), [repository, profile, progressVersion]);

  if (!fontsLoaded) return <View style={styles.screen} />;

  if (!profile || !model) {
    return (
      <ProfilesScreen
        profiles={PROFILES}
        onPick={(p) => {
          setProfile(p);
          setEnergy(p.askEnergy ? undefined : null);
          setRoute({ name: 'home' });
        }}
      />
    );
  }
  if (energy === undefined) return <EnergyScreen name={profile.name} onStart={setEnergy} />;

  const minutes = energy ? energyOption(energy).minutes : profile.dailyGoalMinutes;
  const switchProfile = () => {
    setProfile(null);
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
          onExit={() => {
            setProgressVersion((v) => v + 1);
            setRoute(back === 'home' ? { name: 'home' } : { name: 'notebook' });
          }}
        />
      );
    }
  }
  if (route.name === 'notebook') {
    return <NotebookScreen profile={profile} model={model} repository={repository} onBack={() => setRoute({ name: 'home' })} onRead={(storyId) => setRoute({ name: 'reading', storyId, from: 'notebook' })} />;
  }
  if (route.name === 'showcase') return <Showcase onBack={() => setRoute({ name: 'dev' })} />;
  if (route.name === 'dev') return <DevList repository={repository} onOpen={(storyId) => setRoute({ name: 'reading', storyId, from: 'home' })} onShowcase={() => setRoute({ name: 'showcase' })} onBack={() => setRoute({ name: 'home' })} />;

  return (
    <View style={styles.row}>
      <NavRail items={RAIL} bottomItems={RAIL_BOTTOM} active="home" onSelect={(key) => key === 'dev' && setRoute({ name: 'dev' })} />
      <View style={styles.screen}>
        <HomeScreen
          profile={profile}
          minutes={minutes}
          model={model}
          onContinue={() => setRoute({ name: 'reading', storyId: model.featured.entry.id, from: 'home' })}
          onOpenReading={() => setRoute({ name: 'notebook' })}
          onSwitchProfile={switchProfile}
        />
      </View>
    </View>
  );
}

const LANGUAGE_NAME: Record<string, string> = { es: 'Español', en: 'English' };

/** Solo desarrollo: todas las historias (todos los idiomas y niveles) y la muestra de componentes. */
function DevList({ repository, onOpen, onShowcase, onBack }: { repository: ReturnType<typeof createBundledRepository>; onOpen: (id: string) => void; onShowcase: () => void; onBack: () => void }) {
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
  screen: { flex: 1, backgroundColor: colors.app },
  list: { paddingHorizontal: 24, gap: 12 },
  header: { gap: 12, marginBottom: 12 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted, marginTop: 4 },
});

import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StoryCatalogEntry } from '@lee-conmigo/contracts';
import { Button, Card, colors, fontFamily } from '@lee-conmigo/ui-native';
import { createBundledRepository } from './src/bundled-stories';
import { useAppFonts } from './src/fonts';
import { ReadingScreen } from './src/screens/reading-screen';
import { Showcase } from './src/screens/showcase';

const LANGUAGE_NAME: Record<string, string> = { es: 'Español', en: 'English' };

type Route = { name: 'list' } | { name: 'showcase' } | { name: 'reading'; storyId: string };

/**
 * App nativa (docs/11). Por ahora: lista de historias reales (RN-01) → pantalla de lectura con el simulador (RN-04) y, en
 * desarrollo, la muestra de componentes (RN-02). Inicio/Biblioteca/Ficha de verdad llegan en RN-06.
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
  const stories = useMemo(() => repository.list(), [repository]);
  const [route, setRoute] = useState<Route>({ name: 'list' });
  const insets = useSafeAreaInsets();

  if (!fontsLoaded) return <View style={styles.screen} />;
  if (route.name === 'showcase') return <Showcase onBack={() => setRoute({ name: 'list' })} />;
  if (route.name === 'reading') {
    const story = repository.get(route.storyId);
    if (story) return <ReadingScreen key={story.id} story={story} onExit={() => setRoute({ name: 'list' })} />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={stories}
        keyExtractor={(s) => s.id}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Lee Conmigo</Text>
            <Text style={styles.subtitle}>{stories.length} historias listas para leer</Text>
            {__DEV__ && <Button label="Ver componentes" variant="secondary" onPress={() => setRoute({ name: 'showcase' })} />}
          </View>
        }
        renderItem={({ item }) => <StoryRow story={item} onOpen={() => setRoute({ name: 'reading', storyId: item.id })} />}
      />
    </View>
  );
}

function StoryRow({ story, onOpen }: { story: StoryCatalogEntry; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Leer ${story.title}`}>
      {({ pressed }) => (
        <Card style={pressed ? styles.pressed : undefined}>
          <Text style={styles.cardTitle}>{story.title}</Text>
          <Text style={styles.cardMeta}>
            Nivel {story.level} · {LANGUAGE_NAME[story.language] ?? story.language} · {story.pageCount}{' '}
            {story.pageCount === 1 ? 'página' : 'páginas'}
          </Text>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  list: { paddingHorizontal: 24, gap: 12 },
  header: { gap: 4, marginBottom: 12, alignItems: 'flex-start' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  subtitle: { fontFamily: fontFamily.ui.semibold, fontSize: 16, color: colors.muted, marginBottom: 12 },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted, marginTop: 4 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});

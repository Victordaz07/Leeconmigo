import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { StoryCatalogEntry } from '@lee-conmigo/contracts';
import { Button, Card, colors, fontFamily } from '@lee-conmigo/ui-native';
import { createBundledRepository } from './src/bundled-stories';
import { useAppFonts } from './src/fonts';
import { Showcase } from './src/screens/showcase';

const LANGUAGE_NAME: Record<string, string> = { es: 'Español', en: 'English' };

/**
 * App nativa (docs/11). Por ahora: la lista de historias reales (RN-01) y, en desarrollo, la muestra de componentes
 * base (RN-02). Inicio/Biblioteca de verdad llegan en RN-06.
 */
export default function App() {
  const fontsLoaded = useAppFonts();
  const stories = useMemo(() => createBundledRepository().list(), []);
  const [showcase, setShowcase] = useState(false);

  if (!fontsLoaded) return <View style={styles.screen} />;
  if (showcase) return <Showcase onBack={() => setShowcase(false)} />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={stories}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Lee Conmigo</Text>
            <Text style={styles.subtitle}>{stories.length} historias listas para leer</Text>
            {__DEV__ && <Button label="Ver componentes" variant="secondary" onPress={() => setShowcase(true)} />}
          </View>
        }
        renderItem={({ item }) => <StoryRow story={item} />}
      />
      <StatusBar style="dark" />
    </View>
  );
}

function StoryRow({ story }: { story: StoryCatalogEntry }) {
  return (
    <Card>
      <Text style={styles.cardTitle}>{story.title}</Text>
      <Text style={styles.cardMeta}>
        Nivel {story.level} · {LANGUAGE_NAME[story.language] ?? story.language} · {story.pageCount}{' '}
        {story.pageCount === 1 ? 'página' : 'páginas'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  list: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  header: { gap: 4, marginBottom: 12, alignItems: 'flex-start' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  subtitle: { fontFamily: fontFamily.ui.semibold, fontSize: 16, color: colors.muted, marginBottom: 12 },
  cardTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink },
  cardMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.muted, marginTop: 4 },
});

import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { StoryCatalogEntry } from '@lee-conmigo/contracts';
import { createBundledRepository } from './src/bundled-stories';
import { colors } from './src/theme';

const LANGUAGE_NAME: Record<string, string> = { es: 'Español', en: 'English' };

/**
 * RN-01 (docs/11): primera pantalla de la app nativa. Solo demuestra que las historias reales se leen desde los paquetes
 * compartidos del monorepo; el diseño de verdad llega con RN-02 (tokens y componentes) y RN-06 (Inicio/Biblioteca).
 */
export default function App() {
  const stories = useMemo(() => createBundledRepository().list(), []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Lee Conmigo</Text>
      <Text style={styles.subtitle}>{stories.length} historias listas para leer</Text>
      <FlatList
        data={stories}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <StoryRow story={item} />}
      />
      <StatusBar style="dark" />
    </View>
  );
}

function StoryRow({ story }: { story: StoryCatalogEntry }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{story.title}</Text>
      <Text style={styles.cardMeta}>
        Nivel {story.level} · {LANGUAGE_NAME[story.language] ?? story.language} · {story.pageCount}{' '}
        {story.pageCount === 1 ? 'página' : 'páginas'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app, paddingTop: 56, paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '900', color: colors.navy },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 4, marginBottom: 16 },
  list: { paddingBottom: 32, gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  cardMeta: { fontSize: 14, color: colors.muted, marginTop: 4 },
});

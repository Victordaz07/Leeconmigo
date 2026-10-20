import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, COLLAGE_COPY, MAX_TITLE, collageOf, type ArtLang, type ArtProject, type CollageScene } from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ArtBackdrop } from './art-backdrop';
import { CollageArea } from './collage-area';

interface Props {
  lang: ArtLang;
  project: ArtProject;
  /** Guardado automático: al terminar cada cambio. */
  onScene: (scene: CollageScene) => void;
  onRename: (title: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBack: () => void;
}

/**
 * Taller de collage (Taller libre, AR-06): se pegan piezas de papel de colores sobre un cartón, se mueven con el dedo y se cambian con botones.
 * Se guarda solo; sin nota ni «terminar».
 */
export function CollageWorkshop({ lang, project, onScene, onRename, onDuplicate, onDelete, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const c = COLLAGE_COPY[lang];
  const scene = collageOf(project)!;
  const [name, setName] = useState(project.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useCallback((a: boolean) => setDragging(a), []);

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="pintura" />
      <ScrollView scrollEnabled={!dragging} style={styles.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
        <View style={styles.header}>
          <RoundButton onPress={onBack} label={t.back}>
            <ChevronLeftIcon />
          </RoundButton>
          <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={1}>
            {c.title}
          </Text>
          <Text style={styles.saved} accessibilityLiveRegion="polite" accessibilityLabel={t.saved}>
            {layout.phone ? '✓' : `✓ ${t.saved}`}
          </Text>
        </View>

        <View style={[styles.card, layout.phone && styles.cardPhone]}>
          <TextInput value={name} onChangeText={setName} onEndEditing={() => onRename(name)} onBlur={() => onRename(name)} maxLength={MAX_TITLE} accessibilityLabel={t.nameLabel} style={styles.input} />
          <Text style={styles.note}>{c.hint}</Text>
          <CollageArea lang={lang} scene={scene} onScene={onScene} onDrawing={drag} />
        </View>

        <View style={[styles.card, layout.phone && styles.cardPhone]}>
          <View style={styles.actions}>
            <Button label={t.duplicate} variant="secondary" onPress={onDuplicate} />
            {confirmDelete ? (
              <>
                <Text style={styles.h3}>{t.removeAsk(project.title)}</Text>
                <Button label={t.removeYes} variant="secondary" onPress={onDelete} />
                <Button label={t.removeNo} onPress={() => setConfirmDelete(false)} />
              </>
            ) : (
              <Button label={t.remove} variant="secondary" onPress={() => setConfirmDelete(true)} />
            )}
          </View>
        </View>
        <Text style={styles.small}>{t.privacy}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.app },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,248,236,0.88)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 8 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  saved: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  cardPhone: { padding: 14 },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', paddingHorizontal: 14, fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
});

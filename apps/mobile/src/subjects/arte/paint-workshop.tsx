import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, MAX_TITLE, paintOf, removeFromPalette, type ArtLang, type ArtProject, type PaintScene } from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ArtBackdrop } from './art-backdrop';
import { PaintArea, pickColor } from './paint-area';
import { PaintMixer } from './paint-mixer';

interface Props {
  lang: ArtLang;
  project: ArtProject;
  /** Guardado automático: al terminar cada trazo, al deshacer/rehacer/borrar y al cambiar la paleta. */
  onScene: (scene: PaintScene) => void;
  onRename: (title: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBack: () => void;
}

/**
 * Taller de pintura (Taller libre, AR-05): un lienzo para pintar con el dedo o el lápiz y una paleta de colores que el niño mezcla con gotas
 * de pintura (modelo didáctico de `mixing.ts`). Se guarda solo; sin nota ni «terminar». Los trazos se dibujan con SVG (el motor que se probó en la tableta).
 */
export function PaintWorkshop({ lang, project, onScene, onRename, onDuplicate, onDelete, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const scene = paintOf(project)!;
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  const [name, setName] = useState(project.title);
  const [selected, setSelected] = useState(scene.palette[0]!.id);
  const [mixing, setMixing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const select = useCallback((id: string) => setSelected(id), []);

  const current = pickColor(scene.palette, selected);
  const savePalette = (palette: PaintScene['palette']) => onScene({ ...sceneRef.current, palette });

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="pintura" />
    <ScrollView scrollEnabled={!drawing} style={styles.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={1}>
          {t.paintTitle}
        </Text>
        <Text style={styles.saved} accessibilityLiveRegion="polite" accessibilityLabel={t.saved}>
          {layout.phone ? '✓' : `✓ ${t.saved}`}
        </Text>
      </View>

      <View style={[styles.card, layout.phone && styles.cardPhone]}>
        <TextInput value={name} onChangeText={setName} onEndEditing={() => onRename(name)} onBlur={() => onRename(name)} maxLength={MAX_TITLE} accessibilityLabel={t.nameLabel} style={styles.input} />
        <Text style={styles.note}>{t.paintHint}</Text>
        <PaintArea
          lang={lang}
          scene={scene}
          palette={scene.palette}
          selected={selected}
          onSelect={select}
          onScene={onScene}
          onDrawing={setDrawing}
          extraActions={
            <>
              <Button label={mixing ? t.mixClose : t.mixOpen} onPress={() => setMixing(!mixing)} />
              {scene.palette.length > 1 && <Button label={t.removeColor} variant="secondary" onPress={() => savePalette(removeFromPalette(scene.palette, current.id))} />}
            </>
          }
        />
      </View>

      {mixing && (
        <View style={[styles.card, layout.phone && styles.cardPhone]}>
          <PaintMixer lang={lang} palette={scene.palette} onSaved={(palette, id) => { savePalette(palette); setSelected(id); }} />
        </View>
      )}

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

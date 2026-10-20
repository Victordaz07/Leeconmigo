import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, MAX_TITLE, type ArtLang, type ArtProject, type RhythmScene } from '@lee-conmigo/art-content';
import { TRACKS, toggleCell, type SoundId, type Track } from '@lee-conmigo/music-engine';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { RhythmGrid } from './rhythm-grid';
import { useRhythmPlayer } from '../../audio/use-rhythm-player';

/** Tres velocidades: 60 BPM resultó demasiado lento para el taller (feedback de Victor en la tableta). */
const TEMPOS = [90, 120, 140];

interface Props {
  lang: ArtLang;
  project: ArtProject;
  /** Guardado automático: cada cambio del ritmo llega aquí y se escribe al momento. */
  onScene: (scene: RhythmScene) => void;
  onRename: (title: string) => void;
  onSaveVersion: () => void;
  onRestore: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBack: () => void;
}

/**
 * Taller de ritmo (Taller libre, AR-03): una rejilla de ocho pulsos × cuatro filas; cada fila elige su sonido entre 16. Se guarda solo,
 * sin nota ni «terminar». «Guardar esta versión» deja una copia para comparar A/B más tarde.
 */
export function RhythmWorkshop({ lang, project, onScene, onRename, onSaveVersion, onRestore, onDeleteVersion, onDuplicate, onDelete, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const scene = project.scenes[0]!;
  const player = useRhythmPlayer(scene.pattern, scene.kit, scene.bpm);
  const [name, setName] = useState(project.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const empty = TRACKS.every((r) => !scene.pattern[r].some(Boolean));

  const change = (patch: Partial<RhythmScene>) => onScene({ ...scene, ...patch });
  const toggle = (track: Track, step: number) => change({ pattern: toggleCell(scene.pattern, track, step) });
  const choose = (track: Track, sound: SoundId) => change({ kit: { ...scene.kit, [track]: sound } });
  const leave = () => {
    player.stop();
    onBack();
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={leave} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={1}>
          {t.freeTitle}
        </Text>
        <Text style={styles.saved} accessibilityLiveRegion="polite">
          ✓ {t.saved}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>{t.nameLabel}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onEndEditing={() => onRename(name)}
          onBlur={() => onRename(name)}
          maxLength={MAX_TITLE}
          accessibilityLabel={t.nameLabel}
          style={styles.input}
        />

        <Text style={styles.note}>{t.gridHint}</Text>
        <RhythmGrid lang={lang} scene={scene} cursor={player.cursor} onToggle={toggle} onChangeSound={choose} onPreview={(id) => void player.preview(id)} />
        {empty && <Text style={styles.hint}>{t.emptyHint}</Text>}

        <Text style={styles.h3}>{t.tempo}</Text>
        <View style={styles.segmented}>
          {TEMPOS.map((bpm) => (
            <Pressable key={bpm} onPress={() => change({ bpm })} accessibilityRole="button" accessibilityLabel={`${t.tempoWord(bpm)}, ${bpm} BPM`} accessibilityState={{ selected: scene.bpm === bpm }} style={[styles.segment, scene.bpm === bpm && styles.segmentOn]}>
              <Text style={[styles.segmentText, scene.bpm === bpm && styles.segmentTextOn]}>{t.tempoWord(bpm)}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>{player.playing ? <Button label={t.stop} variant="secondary" onPress={player.stop} /> : <Button label={t.play} onPress={() => void player.play()} />}</View>
        {player.error && <Text style={styles.warn}>{t.audioError}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>{t.versions}</Text>
        {project.versions.length === 0 ? (
          <Text style={styles.note}>{t.noVersions}</Text>
        ) : (
          <>
            <Text style={styles.small}>{t.restoreNote}</Text>
            {project.versions.map((v) => (
              <View key={v.id} style={styles.versionRow}>
                <Text style={styles.versionName}>{t.versionName(v.label)}</Text>
                <Button label={t.restore(v.label)} variant="secondary" onPress={() => onRestore(v.id)} />
                <Pressable onPress={() => onDeleteVersion(v.id)} accessibilityRole="button" accessibilityLabel={`${t.remove}: ${t.versionName(v.label)}`} style={styles.smallBtn}>
                  <Text style={styles.smallBtnText}>{t.remove}</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}
        <View style={styles.actions}>
          <Button label={t.saveVersion} variant="secondary" onPress={onSaveVersion} />
          <Button label={t.duplicate} variant="secondary" onPress={onDuplicate} />
        </View>
      </View>

      <View style={styles.card}>
        {confirmDelete ? (
          <>
            <Text style={styles.h3}>{t.removeAsk(project.title)}</Text>
            <View style={styles.actions}>
              <Button label={t.removeYes} variant="secondary" onPress={onDelete} />
              <Button label={t.removeNo} onPress={() => setConfirmDelete(false)} />
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            <Button label={t.remove} variant="secondary" onPress={() => setConfirmDelete(true)} />
          </View>
        )}
      </View>
      <Text style={styles.small}>{t.privacy}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  saved: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.brand },
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.orangeDeep, backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 12, overflow: 'hidden' },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', paddingHorizontal: 14, fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  segmented: { flexDirection: 'row', gap: 6, backgroundColor: colors.chip, borderRadius: 14, padding: 4 },
  segment: { flex: 1, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.brand },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  versionRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  versionName: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink, minWidth: 100 },
  smallBtn: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' },
  smallBtnText: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
});

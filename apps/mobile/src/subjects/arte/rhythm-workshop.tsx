import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARTE_COPY, MAX_TITLE, type ArtLang, type ArtProject, type RhythmScene } from '@lee-conmigo/art-content';
import { FAMILIES, FAMILY_NAME, SOUNDS, soundsOf, STEPS, TRACKS, toggleCell, type SoundId, type Track } from '@lee-conmigo/music-engine';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { useRhythmPlayer } from '../../audio/use-rhythm-player';

const TEMPOS = [60, 90, 120, 140];
const ROW_LABEL: Record<Track, string> = { a: 'A', b: 'B', c: 'C', d: 'D' };

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
  const [picking, setPicking] = useState<Track | null>(null);
  const [name, setName] = useState(project.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const empty = TRACKS.every((r) => !scene.pattern[r].some(Boolean));
  const soundName = (id: SoundId) => SOUNDS[id].name[lang];

  const change = (patch: Partial<RhythmScene>) => onScene({ ...scene, ...patch });
  const toggle = (track: Track, step: number) => change({ pattern: toggleCell(scene.pattern, track, step) });
  const choose = (track: Track, sound: SoundId) => {
    change({ kit: { ...scene.kit, [track]: sound } });
    void player.preview(sound);
  };
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
        <View style={styles.grid}>
          {TRACKS.map((track) => (
            <View key={track} style={styles.gridRow}>
              <Pressable
                onPress={() => setPicking(picking === track ? null : track)}
                accessibilityRole="button"
                accessibilityLabel={t.changeSound(soundName(scene.kit[track]))}
                accessibilityState={{ expanded: picking === track }}
                style={[styles.soundBtn, picking === track && styles.soundBtnOn]}
              >
                <Text style={styles.soundBtnText} numberOfLines={2}>
                  {soundName(scene.kit[track])}
                </Text>
              </Pressable>
              {scene.pattern[track].map((on, step) => (
                <Pressable
                  key={step}
                  onPress={() => toggle(track, step)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={on ? t.rowOn(soundName(scene.kit[track]), step + 1) : t.rowOff(soundName(scene.kit[track]), step + 1)}
                  style={[styles.cell, on && styles.cellOn, player.cursor === step && styles.cellCursor, step === 4 && styles.cellGroup]}
                >
                  <Text style={styles.cellText}>{on ? '●' : ''}</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <View style={styles.gridRow}>
            <View style={styles.layerName} />
            {Array.from({ length: STEPS }, (_, i) => (
              <Text key={i} style={[styles.stepNum, player.cursor === i && styles.stepNumOn, i === 4 && styles.cellGroup]} accessibilityLabel={t.pulse(i + 1)}>
                {i + 1}
              </Text>
            ))}
          </View>
        </View>
        {empty && <Text style={styles.hint}>{t.emptyHint}</Text>}

        {picking && (
          <View style={styles.picker}>
            <Text style={styles.h3}>{t.pickSound(ROW_LABEL[picking])}</Text>
            <Text style={styles.small}>{t.pickSoundHint}</Text>
            {FAMILIES.map((f) => (
              <View key={f} style={styles.family}>
                <Text style={styles.familyName}>{FAMILY_NAME[f][lang]}</Text>
                <View style={styles.chips}>
                  {soundsOf(f).map((id) => (
                    <Pressable key={id} onPress={() => choose(picking, id)} accessibilityRole="button" accessibilityLabel={`${soundName(id)}. ${SOUNDS[id].hint[lang]}`} accessibilityState={{ selected: scene.kit[picking] === id }} style={[styles.chip, scene.kit[picking] === id && styles.chipOn]}>
                      <Text style={[styles.chipText, scene.kit[picking] === id && styles.chipTextOn]}>{soundName(id)}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

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
  grid: { gap: 6 },
  gridRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  layerName: { width: 92 },
  soundBtn: { width: 92, minHeight: 48, borderRadius: 10, paddingHorizontal: 6, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  soundBtnOn: { borderColor: colors.brand, backgroundColor: '#ffffff' },
  soundBtnText: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, lineHeight: 15, color: colors.ink },
  cell: { flex: 1, height: 48, minWidth: 28, borderRadius: 10, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  cellGroup: { marginLeft: 6 },
  cellOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  cellCursor: { borderColor: colors.orangeDeep },
  cellText: { color: '#ffffff', fontSize: 14 },
  stepNum: { flex: 1, textAlign: 'center', fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  stepNumOn: { color: colors.orangeDeep, fontFamily: fontFamily.ui.black },
  picker: { gap: 8, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12, boxShadow: shadows.soft },
  family: { gap: 6 },
  familyName: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
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

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ARTE_COPY, type ArtLang, type RhythmScene } from '@lee-conmigo/art-content';
import { FAMILIES, FAMILY_NAME, SOUNDS, soundsOf, STEPS, TRACKS, type SoundId, type Track } from '@lee-conmigo/music-engine';
import { colors, fontFamily, radius, shadows } from '@lee-conmigo/ui-native';

const ROW_LABEL: Record<Track, string> = { a: 'A', b: 'B', c: 'C', d: 'D' };

interface Props {
  lang: ArtLang;
  scene: RhythmScene;
  cursor: number | null;
  /** Filas que se ven (por defecto las cuatro). */
  rows?: readonly Track[];
  /** Sin esto, las casillas no se pueden cambiar (p. ej. el ejemplo para escuchar). */
  onToggle?: (track: Track, step: number) => void;
  /** Sin esto, el sonido de cada fila no se puede cambiar. */
  onChangeSound?: (track: Track, sound: SoundId) => void;
  /** Para oír un sonido al elegirlo. */
  onPreview?: (sound: SoundId) => void;
  /** Con esto, los números de pulso son botones (señalar un pulso). */
  onStepPress?: (step: number) => void;
  /** Pulso marcado (p. ej. el silencio elegido). */
  markStep?: number | null;
  /** Fila que suena sola ahora (se resalta). */
  soloRow?: Track | null;
}

/** La rejilla de ocho pulsos × filas con el selector de sonidos. Compartida por el Taller libre y la unidad guiada. */
export function RhythmGrid({ lang, scene, cursor, rows = TRACKS, onToggle, onChangeSound, onPreview, onStepPress, markStep = null, soloRow = null }: Props) {
  const t = ARTE_COPY[lang];
  const [picking, setPicking] = useState<Track | null>(null);
  const soundName = (id: SoundId) => SOUNDS[id].name[lang];
  const choose = (track: Track, sound: SoundId) => {
    onChangeSound?.(track, sound);
    onPreview?.(sound);
  };
  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {rows.map((track) => (
          <View key={track} style={styles.gridRow}>
            <Pressable
              onPress={onChangeSound ? () => setPicking(picking === track ? null : track) : undefined}
              disabled={!onChangeSound}
              accessibilityRole={onChangeSound ? 'button' : 'text'}
              accessibilityLabel={onChangeSound ? t.changeSound(soundName(scene.kit[track])) : soundName(scene.kit[track])}
              accessibilityState={{ expanded: picking === track }}
              style={[styles.soundBtn, (picking === track || soloRow === track) && styles.soundBtnOn]}
            >
              <Text style={styles.soundBtnText} numberOfLines={2}>
                {soundName(scene.kit[track])}
              </Text>
            </Pressable>
            {scene.pattern[track].map((on, step) => (
              <Pressable
                key={step}
                onPress={onToggle ? () => onToggle(track, step) : undefined}
                disabled={!onToggle}
                accessibilityRole={onToggle ? 'button' : 'image'}
                accessibilityState={{ selected: on }}
                accessibilityLabel={on ? t.rowOn(soundName(scene.kit[track]), step + 1) : t.rowOff(soundName(scene.kit[track]), step + 1)}
                style={[styles.cell, on && styles.cellOn, cursor === step && styles.cellCursor, markStep === step && styles.cellMark, step === 4 && styles.cellGroup]}
              >
                <Text style={styles.cellText}>{on ? '●' : ''}</Text>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.gridRow}>
          <View style={styles.layerName} />
          {Array.from({ length: STEPS }, (_, i) => (
            <Pressable
              key={i}
              onPress={onStepPress ? () => onStepPress(i) : undefined}
              disabled={!onStepPress}
              accessibilityRole={onStepPress ? 'button' : 'text'}
              accessibilityLabel={t.pulse(i + 1)}
              accessibilityState={{ selected: markStep === i }}
              style={[styles.stepBtn, i === 4 && styles.cellGroup, onStepPress && styles.stepBtnTap, markStep === i && styles.stepBtnMark]}
            >
              <Text style={[styles.stepNum, cursor === i && styles.stepNumOn, markStep === i && styles.stepNumMark]}>{i + 1}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {picking && onChangeSound && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
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
  cellMark: { borderColor: colors.ok, borderStyle: 'dashed' },
  cellText: { color: '#ffffff', fontSize: 14 },
  stepBtn: { flex: 1, minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  stepBtnTap: { minHeight: 44, backgroundColor: colors.chip },
  stepBtnMark: { backgroundColor: colors.ok },
  stepNum: { textAlign: 'center', fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  stepNumOn: { color: colors.orangeDeep, fontFamily: fontFamily.ui.black },
  stepNumMark: { color: '#ffffff', fontFamily: fontFamily.ui.black },
  picker: { gap: 8, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12, boxShadow: shadows.soft },
  family: { gap: 6 },
  familyName: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
});

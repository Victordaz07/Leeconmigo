import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Audience, VocabularyEntry } from '@lee-conmigo/contracts';
import { copy } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius } from '../tokens.ts';
import { Button } from './button.tsx';
import { SpeakerIcon } from './icons.tsx';

interface HelpSheetProps {
  /** Palabra con la ayuda abierta (sin puntuación). `null` = cerrada. */
  word: string | null;
  entry?: VocabularyEntry;
  audience: Audience;
  onListen: () => void;
  onClose: () => void;
}

/**
 * Ayuda de una palabra (Kitewise G13, docs/03 "ayuda de pronunciación"): la palabra en sílabas ("en·re·da·da"), botón para
 * escucharla, definición corta y ejemplo si la historia los trae. Nunca dice "mal": es una ayuda que el niño pidió.
 * "Guardar en mi cuaderno" llega con Mi cuaderno (K8); hasta entonces no se muestra un botón que no hace nada.
 */
export function HelpSheet({ word, entry, audience, onListen, onClose }: HelpSheetProps) {
  const syllables = entry?.syllables?.length ? entry.syllables.join('·') : (word ?? '');
  return (
    <Modal visible={word !== null} transparent animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Cerrar ayuda">
        <ScrollView style={styles.scroll} contentContainerStyle={styles.center}>
        <Pressable style={styles.card} onPress={() => {}} accessibilityViewIsModal>
          <View style={styles.head}>
            <Text style={styles.word} accessibilityLabel={word ?? ''} adjustsFontSizeToFit numberOfLines={2}>
              {syllables}
            </Text>
            <Pressable onPress={onListen} accessibilityRole="button" accessibilityLabel={copy.help.listenWord} style={({ pressed }) => [styles.speaker, pressed && styles.pressed]}>
              <SpeakerIcon size={26} />
            </Pressable>
          </View>
          <Text style={styles.def}>
            {entry?.definition ?? copy.help.defaultDef[audience]}
            {entry?.synonym ? copy.help.synonym(entry.synonym) : ''}
          </Text>
          {entry?.example ? <Text style={styles.example}>{copy.help.example(entry.example).trim()}</Text> : null}
          <View style={styles.actions}>
            <Button label={copy.states.keepReading} variant="secondary" onPress={onClose} />
          </View>
        </Pressable>
        </ScrollView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(20, 22, 28, 0.25)' },
  scroll: { flex: 1 },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 520, backgroundColor: '#ffffff', borderRadius: radius.panel, padding: 22, gap: 12, boxShadow: '0px 24px 60px rgba(0, 0, 0, 0.3)' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  word: { flex: 1, fontFamily: fontFamily.read.bold, fontSize: 36, color: colors.ink },
  speaker: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff1e6', boxShadow: 'inset 0px -4px 0px #f7be9c' },
  pressed: { transform: [{ translateY: 2 }] },
  def: { fontFamily: fontFamily.ui.bold, fontSize: 19, color: colors.inkSoft },
  example: { fontFamily: fontFamily.read.regular, fontSize: 18, color: colors.muted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
});

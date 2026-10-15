import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Audience, VocabularyEntry } from '@lee-conmigo/contracts';
import { copy } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';
import { Button } from './button.tsx';

interface HelpSheetProps {
  /** Palabra con la ayuda abierta (sin puntuación). `null` = cerrada. */
  word: string | null;
  entry?: VocabularyEntry;
  audience: Audience;
  onListen: () => void;
  onClose: () => void;
}

/**
 * Ayuda de una palabra (docs/03 "ayuda de pronunciación", docs/04 Help modal): la palabra dividida en sílabas, escucharla,
 * definición corta, sinónimo y ejemplo si la historia los trae. Nunca dice "mal": es una ayuda que el niño pidió.
 */
export function HelpSheet({ word, entry, audience, onListen, onClose }: HelpSheetProps) {
  const syllables = entry?.syllables ?? (word ? [word] : []);
  return (
    <Modal visible={word !== null} transparent animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Cerrar ayuda">
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.syllables}>
            {syllables.map((s, i) => (
              <View key={i} style={styles.syllable}>
                <Text style={styles.syllableText}>{s}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.def}>
            {entry?.definition ?? copy.help.defaultDef[audience]}
            {entry?.synonym ? copy.help.synonym(entry.synonym) : ''}
          </Text>
          {entry?.example ? <Text style={styles.example}>{copy.help.example(entry.example).trim()}</Text> : null}
          <View style={styles.actions}>
            <Button label={copy.help.listenWord} onPress={onListen} />
            <Button label={copy.help.done} variant="secondary" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(20, 22, 28, 0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 620, backgroundColor: colors.cream, borderRadius: radius.panel, padding: 28, gap: 18, boxShadow: '0px 30px 70px rgba(0, 0, 0, 0.4)' },
  syllables: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  syllable: { backgroundColor: colors.focus, borderRadius: radius.tile, paddingHorizontal: 18, paddingVertical: 8, boxShadow: shadows.soft },
  syllableText: { fontFamily: fontFamily.read.bold, fontSize: 44, color: colors.ink },
  def: { fontFamily: fontFamily.ui.semibold, fontSize: 20, color: colors.inkSoft, textAlign: 'center' },
  example: { fontFamily: fontFamily.read.regular, fontSize: 18, color: colors.muted, textAlign: 'center', fontStyle: 'italic' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
});

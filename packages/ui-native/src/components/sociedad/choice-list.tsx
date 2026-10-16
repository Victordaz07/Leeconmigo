import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, minTouch, radius, shadows } from '../../tokens.ts';

export interface Choice {
  id: string;
  text: string;
}

/**
 * Lista de opciones de un paso (fuente / testimonio / revisar): una sola elección, nunca roja (docs/06). La
 * elegida se resalta; no hay forma de "estar mal" aquí, solo una pista aparte (`feedback`, ver copy de la
 * materia) que invita a mirar de nuevo.
 */
export function ChoiceList({ choices, selectedId, onSelect }: { choices: Choice[]; selectedId?: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.list}>
      {choices.map((c) => {
        const on = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} accessibilityRole="radio" accessibilityLabel={c.text} accessibilityState={{ selected: on }} style={[styles.choice, on && styles.choiceOn]}>
            <Text style={[styles.text, on && styles.textOn]}>{c.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, alignSelf: 'stretch' },
  choice: { minHeight: minTouch, borderRadius: radius.tile, backgroundColor: '#ffffff', paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center', boxShadow: shadows.soft },
  choiceOn: { backgroundColor: colors.subjSociedad },
  text: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.ink },
  textOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
});

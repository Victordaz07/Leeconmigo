import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, colors, fontFamily } from '@lee-conmigo/ui-native';
import type { SubjectScreenProps } from './types';

/** Pantalla de relleno de una materia que todavía no tiene contenido (no se puede llegar a ella: está "Pronto"). */
export function ComingSoon({ title, onExit }: Pick<SubjectScreenProps, 'onExit'> & { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Pronto.</Text>
      <Button label="‹ Inicio" variant="secondary" onPress={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: 24, gap: 16, alignItems: 'flex-start' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  text: { fontFamily: fontFamily.ui.bold, fontSize: 18, color: colors.muted },
});

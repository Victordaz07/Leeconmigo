import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, colors, fontFamily, MicBadge, type MicTone } from '@lee-conmigo/ui-native';

const TONES: { tone: MicTone; label: string }[] = [
  { tone: 'ok', label: 'Escuchando' },
  { tone: 'idle', label: 'Pausa / ayuda' },
  { tone: 'warn', label: 'Pausa larga' },
];

/** RN-02 (docs/11): muestra de los componentes base, para revisarlos en el teléfono. Solo en desarrollo. */
export function Showcase({ onBack }: { onBack: () => void }) {
  const [presses, setPresses] = useState(0);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Componentes base</Text>

      <Text style={styles.h2}>Tipografía</Text>
      <Card>
        <Text style={styles.read}>La luna miró la puerta azul y sonrió.</Text>
        <Text style={styles.readBold}>Andika — para leer</Text>
        <Text style={styles.ui}>Nunito — para la interfaz</Text>
      </Card>

      <Text style={styles.h2}>Botones</Text>
      <View style={styles.row}>
        <Button label="Comenzar" large onPress={() => setPresses((n) => n + 1)} />
        <Button label="Volver" variant="secondary" onPress={onBack} />
      </View>
      <Text style={styles.note}>Tocaste "Comenzar" {presses} {presses === 1 ? 'vez' : 'veces'}</Text>

      <Text style={styles.h2}>Micrófono</Text>
      <View style={styles.row}>
        {TONES.map(({ tone, label }) => (
          <View key={tone} style={styles.mic}>
            <MicBadge tone={tone} pulsing={tone === 'ok'} />
            <Text style={styles.note}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { padding: 24, paddingTop: 56, gap: 12 },
  h1: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  h2: { fontFamily: fontFamily.ui.extrabold, fontSize: 20, color: colors.ink, marginTop: 16 },
  read: { fontFamily: fontFamily.read.regular, fontSize: 28, color: colors.ink, lineHeight: 42 },
  readBold: { fontFamily: fontFamily.read.bold, fontSize: 18, color: colors.inkSoft, marginTop: 8 },
  ui: { fontFamily: fontFamily.ui.semibold, fontSize: 18, color: colors.inkSoft },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 20 },
  mic: { alignItems: 'center', gap: 8 },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, color: colors.muted },
});

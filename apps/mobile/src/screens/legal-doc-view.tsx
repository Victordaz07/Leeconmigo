import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { LegalDoc } from '../legal/copy';

/** Un documento legal a pantalla completa (aviso, política de privacidad o términos). */
export function LegalDocView({ doc, backLabel, onBack }: { doc: LegalDoc; backLabel: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 24), paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={backLabel}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} accessibilityRole="header">
          {doc.title}
        </Text>
      </View>
      <View style={styles.paper}>
        {doc.sections.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.h3} accessibilityRole="header">
              {s.title}
            </Text>
            {s.body.map((p, i) => (
              <Text key={i} style={styles.p}>
                {p}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 16, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, alignSelf: 'center', maxWidth: 760, width: '100%' },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy },
  titleSmall: { fontSize: 24 },
  paper: { alignSelf: 'center', maxWidth: 760, width: '100%', backgroundColor: '#ffffff', borderRadius: radius.card, padding: 22, gap: 18, boxShadow: shadows.card },
  section: { gap: 8 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy },
  p: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 22, color: colors.inkSoft },
});

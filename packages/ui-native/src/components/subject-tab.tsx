import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamily, sizes, type Gradient } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';

interface SubjectTabProps {
  label: string;
  gradient: Gradient;
  active?: boolean;
  /** Sin contenido todavía: atenuada y sin acción. */
  soon?: boolean;
  onPress?: () => void;
}

/** Pestaña de materia en el borde derecho del cuaderno (B4): vertical, del color de la materia; la activa sobresale más. */
export function SubjectTab({ label, gradient, active, soon, onPress }: SubjectTabProps) {
  const width = active ? sizes.tabActive : sizes.tab;
  return (
    <Pressable onPress={soon ? undefined : onPress} disabled={soon} accessibilityRole="tab" accessibilityLabel={soon ? `${label}, pronto` : label} accessibilityState={{ selected: active }}>
      <GradientView gradient={gradient} style={[styles.tab, { width, opacity: soon ? 0.55 : 1 }]}>
        <View style={styles.rotate}>
          <Text style={styles.text} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </GradientView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: { height: 116, borderTopLeftRadius: 18, borderBottomLeftRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '-4px 4px 12px rgba(30, 35, 64, 0.18)' },
  rotate: { width: 116, transform: [{ rotate: '90deg' }], alignItems: 'center' },
  text: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: '#ffffff' },
});

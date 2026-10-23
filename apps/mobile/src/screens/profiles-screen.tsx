import { useTranslation } from '@lee-conmigo/ui-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, gradients, GradientView, KiteIcon, radius, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';

interface ProfilesScreenProps {
  profiles: ChildProfile[];
  onPick: (profile: ChildProfile) => void;
  /** "Agregar niño": pasa por el PIN de padres. */
  onAdd: () => void;
}

/**
 * Elegir perfil (Kitewise B1): "¿Quién aprende hoy?" — un toque por avatar. "Agregar niño" pide el PIN de padres (P1) y
 * abre Ajustes con un perfil nuevo (P4). El encabezado usa un cielo de color: el arte del diseño era solo referencia.
 */
export function ProfilesScreen({ profiles, onPick, onAdd }: ProfilesScreenProps) {
  const { t: ui } = useTranslation();

  const insets = useSafeAreaInsets();
  const { narrow, short, width, gutter } = useLayout();
  // Tarjetas: 2 por fila en un teléfono vertical; más bajas si hay poca altura.
  const small = narrow || short;
  const cardW = small ? Math.min(200, Math.floor((width - 2 * gutter - 16) / 2)) : 230;
  const card = { width: cardW, height: small ? Math.round(cardW * 1.05) : 260 };
  const avatar = small ? Math.round(cardW * 0.48) : 128;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <GradientView gradient={gradients.sky} style={[styles.sky, { paddingTop: insets.top + (short ? 14 : 40), paddingBottom: short ? 16 : 36, gap: short ? 12 : 36 }]}>
        <View style={styles.brand}>
          <GradientView gradient={gradients.brand} style={styles.logo}>
            <KiteIcon size={26} />
          </GradientView>
          <Text style={styles.brandText}>Kitewise</Text>
        </View>
        <Text style={[styles.question, small && styles.questionSmall]}>{ui("¿Quién aprende hoy?")}</Text>
      </GradientView>
      <View style={[styles.row, { paddingHorizontal: gutter, gap: small ? 16 : 32, paddingVertical: short ? 16 : 32, paddingBottom: insets.bottom + 24 }]}>
        {profiles.map((p) => (
          <Pressable key={p.id} onPress={() => onPick(p)} accessibilityRole="button" accessibilityLabel={p.name} style={({ pressed }) => [styles.card, card, pressed && styles.pressed]}>
            <GradientView gradient={gradients[p.avatar]} style={[styles.avatar, { width: avatar, height: avatar, borderRadius: avatar / 2 }]}>
              <Text style={[styles.initial, { fontSize: avatar * 0.44 }]}>{p.name.slice(0, 1).toUpperCase()}</Text>
            </GradientView>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.meta}>{ui("Nivel") + " "}{p.level}</Text>
          </Pressable>
        ))}
        <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel={ui("Agregar niño, con PIN de padres")} style={({ pressed }) => [styles.card, card, styles.add, pressed && styles.pressed]}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.addText}>{ui("Agregar niño")}</Text>
          <Text style={styles.addMeta}>{ui("con PIN de padres")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { flexGrow: 1 },
  sky: { alignItems: 'center', paddingHorizontal: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: radius.pill, paddingVertical: 8, paddingLeft: 8, paddingRight: 22 },
  logo: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  question: { fontFamily: fontFamily.ui.black, fontSize: 44, color: colors.navy, textAlign: 'center' },
  questionSmall: { fontSize: 30 },
  row: { flexGrow: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap' },
  card: { backgroundColor: '#ffffff', borderRadius: radius.panel, alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: shadows.card },
  pressed: { transform: [{ translateY: 3 }] },
  avatar: { width: 128, height: 128, borderRadius: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#ffffff', boxShadow: shadows.round },
  initial: { fontFamily: fontFamily.ui.black, fontSize: 56, color: '#ffffff' },
  name: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.ink },
  meta: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.muted },
  add: { backgroundColor: 'transparent', borderWidth: 3, borderStyle: 'dashed', borderColor: colors.slate300, boxShadow: undefined, opacity: 0.8 },
  plus: { fontFamily: fontFamily.ui.black, fontSize: 52, color: colors.muted },
  addText: { fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.muted },
  addMeta: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted2 },
});

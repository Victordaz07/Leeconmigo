import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, gradients, GradientView, KiteIcon, radius, shadows } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';

interface ProfilesScreenProps {
  profiles: ChildProfile[];
  onPick: (profile: ChildProfile) => void;
}

/**
 * Elegir perfil (Kitewise B1): "¿Quién aprende hoy?" — un toque por avatar. "Agregar niño" va detrás del PIN de padres (K4);
 * hasta que exista, se muestra pero no abre nada. El encabezado usa un cielo de color: el arte del diseño era solo referencia.
 */
export function ProfilesScreen({ profiles, onPick }: ProfilesScreenProps) {
  return (
    <View style={styles.screen}>
      <GradientView gradient={gradients.sky} style={styles.sky}>
        <View style={styles.brand}>
          <GradientView gradient={gradients.brand} style={styles.logo}>
            <KiteIcon size={26} />
          </GradientView>
          <Text style={styles.brandText}>Kitewise</Text>
        </View>
        <Text style={styles.question}>¿Quién aprende hoy?</Text>
      </GradientView>
      <View style={styles.row}>
        {profiles.map((p) => (
          <Pressable key={p.id} onPress={() => onPick(p)} accessibilityRole="button" accessibilityLabel={p.name} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <GradientView gradient={gradients[p.avatar]} style={styles.avatar}>
              <Text style={styles.initial}>{p.name.slice(0, 1).toUpperCase()}</Text>
            </GradientView>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.meta}>Nivel {p.level}</Text>
          </Pressable>
        ))}
        <View style={[styles.card, styles.add]} accessible accessibilityLabel="Agregar niño, con PIN de padres, pronto">
          <Text style={styles.plus}>+</Text>
          <Text style={styles.addText}>Agregar niño</Text>
          <Text style={styles.addMeta}>con PIN de padres · pronto</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  sky: { alignItems: 'center', gap: 36, paddingTop: 40, paddingBottom: 36 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: radius.pill, paddingVertical: 8, paddingLeft: 8, paddingRight: 22 },
  logo: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  question: { fontFamily: fontFamily.ui.black, fontSize: 44, color: colors.navy },
  row: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap', gap: 32, paddingHorizontal: 24, paddingBottom: 40 },
  card: { width: 230, height: 260, backgroundColor: '#ffffff', borderRadius: radius.panel, alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: shadows.card },
  pressed: { transform: [{ translateY: 3 }] },
  avatar: { width: 128, height: 128, borderRadius: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#ffffff', boxShadow: shadows.round },
  initial: { fontFamily: fontFamily.ui.black, fontSize: 56, color: '#ffffff' },
  name: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.ink },
  meta: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.muted },
  add: { backgroundColor: 'transparent', borderWidth: 3, borderStyle: 'dashed', borderColor: colors.slate300, boxShadow: undefined, opacity: 0.8 },
  plus: { fontFamily: fontFamily.ui.black, fontSize: 52, color: colors.muted },
  addText: { fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.muted },
  addMeta: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted2 },
});

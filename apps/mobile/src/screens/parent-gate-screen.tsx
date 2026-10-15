import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GATE_COPY, gateKey, gateMessage, gateSubmit, isLocked, startGate, type PinKey } from '@lee-conmigo/ui-core';
import { ChevronLeftIcon, colors, fontFamily, gradients, GradientView, KiteIcon, PinPad, radius, RoundButton } from '@lee-conmigo/ui-native';
import { storyImage } from '../story-assets';

interface ParentGateScreenProps {
  /** PIN guardado, o `null` si todavía no hay (entonces se crea). */
  savedPin: string | null;
  /** Se abrió: con el PIN recién creado, si se creó ahora. */
  onOpen: (createdPin: string | null) => void;
  onBack: () => void;
}

/** Arte de la mitad izquierda: una ilustración que ya existe (el diseño traía una de referencia, sin producir). */
const HERO = 'stories/la-cometa-roja/cover.webp';

/**
 * Candado de padres (Kitewise P1). La primera vez se crea el PIN (escribir y confirmar); después se pide para entrar a
 * "Modo padres" (docs/01, D4). La lógica está en `ui-core/pin.ts`. Sin recuperación por correo (no hay cuentas ni nube):
 * si se olvida, se borran los datos de la app desde Ajustes de Android.
 */
export function ParentGateScreen({ savedPin, onOpen, onBack }: ParentGateScreenProps) {
  const insets = useSafeAreaInsets();
  const [gate, setGate] = useState(() => startGate(savedPin));
  const [now, setNow] = useState(() => Date.now());
  const locked = isLocked(gate, now);

  // Al terminar la espera, volver a dibujar para habilitar el teclado.
  useEffect(() => {
    if (!gate.lockedUntil) return;
    const ms = gate.lockedUntil - Date.now();
    if (ms <= 0) return;
    const t = setTimeout(() => setNow(Date.now()), ms + 50);
    return () => clearTimeout(t);
  }, [gate.lockedUntil]);

  useEffect(() => {
    if (gate.phase === 'open') onOpen(gate.created);
  }, [gate.phase, gate.created, onOpen]);

  const press = (key: PinKey) => {
    const t = Date.now();
    setNow(t);
    setGate((g) => gateKey(g, key, t));
  };
  const submit = () => {
    const t = Date.now();
    setNow(t);
    setGate((g) => gateSubmit(g, savedPin, t));
  };

  const creating = gate.phase === 'create' || gate.phase === 'confirm';
  const title = gate.phase === 'confirm' ? GATE_COPY.confirmTitle : creating ? GATE_COPY.createTitle : GATE_COPY.enterTitle;
  const hint = gate.phase === 'confirm' ? GATE_COPY.confirmHint : creating ? GATE_COPY.createHint : GATE_COPY.enterHint;
  const message = gateMessage(locked ? 'locked' : gate.message === 'locked' ? 'none' : gate.message);
  const hero = storyImage(HERO);

  return (
    <View style={styles.screen}>
      <View style={styles.art}>
        {hero && <Image source={hero} style={FILL} resizeMode="cover" />}
        <LinearGradient colors={['rgba(16,24,64,0)', 'rgba(16,24,64,0.75)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
        <View style={[styles.back, { top: insets.top + 20 }]}>
          <RoundButton onPress={onBack} label="Volver">
            <ChevronLeftIcon />
          </RoundButton>
        </View>
        <View style={[styles.artText, { paddingBottom: insets.bottom + 36 }]}>
          <View style={styles.brand}>
            <GradientView gradient={gradients.brand} style={styles.logo}>
              <KiteIcon size={26} />
            </GradientView>
            <Text style={styles.brandText}>Kitewise</Text>
          </View>
          <Text style={styles.tagline}>Aprender en casa, a su ritmo.</Text>
          <Text style={styles.privacy}>La voz de tu hijo nunca se graba ni se almacena.</Text>
        </View>
      </View>

      <View style={[styles.panel, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.kicker}>{creating ? `PASO ${gate.phase === 'confirm' ? 2 : 1} DE 2 · SOLO PARA PADRES` : 'MODO PADRES'}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
        <PinPad filled={gate.digits.length} onKey={press} onSubmit={submit} disabled={locked} />
        <Text style={styles.message} accessibilityLiveRegion="polite">
          {message ?? ' '}
        </Text>
      </View>
    </View>
  );
}

const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: 'row', backgroundColor: colors.app },
  art: { flex: 1, overflow: 'hidden', backgroundColor: colors.sky, justifyContent: 'flex-end' },
  back: { position: 'absolute', left: 24 },
  artText: { paddingHorizontal: 40, gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontFamily: fontFamily.ui.black, fontSize: 28, color: '#ffffff' },
  tagline: { fontFamily: fontFamily.ui.black, fontSize: 40, lineHeight: 46, color: '#ffffff' },
  privacy: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: '#ffffff' },
  panel: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 14, letterSpacing: 1, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 36, color: colors.navy, textAlign: 'center' },
  hint: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: colors.inkSoft, textAlign: 'center', marginBottom: 10 },
  message: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.inkMute, textAlign: 'center', minHeight: 24, marginTop: 6, borderRadius: radius.pill },
});

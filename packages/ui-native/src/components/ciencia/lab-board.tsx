import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';
import { useReducedMotion } from '../use-reduced-motion.ts';

export interface TrayView {
  key: string;
  title: string;
  /** Cobertura del suelo de la bandeja. */
  cover: 'ninguna' | 'parcial' | 'completa';
  /** Inclinación en grados (suave ≈ 4°, media ≈ 12°, fuerte ≈ 22°). */
  slopeDeg: number;
  /** «Sin cobertura · Muy inclinada»: lo que el niño debe poder LEER de la bandeja (no solo verlo). */
  caption: string;
  /** Cuánta tierra hay en el vaso, 0–1. `null` = todavía no se regó. */
  level: number | null;
  /** «poca tierra» / «algo de tierra» / «mucha tierra». */
  cupCaption?: string;
}

export interface LabArt {
  bandeja: ImageSourcePropType;
  tierra: ImageSourcePropType;
  cobertura: ImageSourcePropType;
  regadera: ImageSourcePropType;
}

interface LabBoardProps {
  trays: [TrayView, TrayView];
  art: LabArt;
  width: number;
  /** La regadera está regando ahora (las gotas caen). */
  watering?: boolean;
  /** Los dibujos pequeños de fondo se omiten (Modo Enfoque): quedan las bandejas y los vasos. */
  calm?: boolean;
}

/**
 * Las dos bandejas de erosión con su vaso (Ciencia, laboratorio «Paisaje y erosión»). El MODELO vive en
 * `@lee-conmigo/science-content`; esto solo lo dibuja. Las bandejas se distinguen por TEXTO (cobertura e inclinación), no solo por
 * el dibujo. Nunca muestra gramos: eso es de la báscula y la tabla.
 */
export function LabBoard({ trays, art, width, watering, calm }: LabBoardProps) {
  const gap = 14;
  const station = Math.floor((width - gap) / 2);
  return (
    <View style={[styles.row, { width, gap }]}>
      {trays.map((t) => (
        <Station key={t.key} tray={t} art={art} width={station} watering={!!watering} calm={!!calm} />
      ))}
    </View>
  );
}

function Station({ tray, art, width, watering, calm }: { tray: TrayView; art: LabArt; width: number; watering: boolean; calm: boolean }) {
  const reduced = useReducedMotion();
  const drop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!watering || reduced || calm) {
      drop.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(drop, { toValue: 1, duration: 600, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [watering, reduced, calm, drop]);

  const stage = Math.min(width - 24, 200);
  const soil = stage * 0.62;
  const cup = Math.max(56, Math.min(80, width * 0.3));
  const level = tray.level;
  return (
    <View style={[styles.station, { width }]}>
      <Text style={styles.title}>{tray.title}</Text>
      <View style={[styles.stage, { width: stage, height: stage * 0.78 }]}>
        {!calm ? <Image source={art.regadera} style={[styles.can, { width: stage * 0.4, height: stage * 0.4 }]} resizeMode="contain" accessible={false} /> : null}
        <View style={[styles.tilt, { width: stage, height: stage * 0.78, transform: [{ rotate: `${-tray.slopeDeg}deg` }] }]}>
          <Image source={art.bandeja} style={styles.tray} resizeMode="contain" accessible={false} />
          <Image source={art.tierra} style={[styles.soil, { width: soil, height: soil }]} resizeMode="contain" accessible={false} />
          {tray.cover !== 'ninguna' ? (
            <Image source={art.cobertura} style={[styles.cover, tray.cover === 'completa' ? { width: soil * 0.98, height: soil * 0.98 } : { width: soil * 0.5, height: soil * 0.5, left: stage * 0.2 }]} resizeMode="contain" accessible={false} />
          ) : null}
        </View>
        {watering && !calm && !reduced ? (
          <Animated.View style={[styles.drops, { opacity: drop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }), transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) }] }]}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.drop} />
            ))}
          </Animated.View>
        ) : null}
      </View>
      <Text style={styles.caption}>{tray.caption}</Text>
      <View style={styles.cupRow}>
        <View style={[styles.cup, { width: cup, height: cup * 1.1 }]} accessibilityLabel={tray.cupCaption ?? undefined}>
          {level !== null ? <View style={[styles.fill, { height: `${Math.max(6, Math.round(level * 100))}%` }]} /> : null}
        </View>
        <Text style={styles.cupCaption}>{level === null ? '' : tray.cupCaption ?? ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignSelf: 'center' },
  station: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, alignItems: 'center', gap: 8, boxShadow: shadows.card },
  title: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  stage: { alignItems: 'center', justifyContent: 'flex-end' },
  can: { position: 'absolute', top: -6, right: 0, zIndex: 2 },
  tilt: { alignItems: 'center', justifyContent: 'flex-end' },
  tray: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  soil: { position: 'absolute', bottom: '14%' },
  cover: { position: 'absolute', bottom: '20%' },
  drops: { position: 'absolute', top: '22%', right: '12%', flexDirection: 'row', gap: 8 },
  drop: { width: 8, height: 12, borderRadius: 6, backgroundColor: colors.brandLight },
  caption: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft, textAlign: 'center' },
  cupRow: { alignItems: 'center', gap: 4, minHeight: 100 },
  cup: { borderWidth: 3, borderColor: colors.slate400, borderTopWidth: 2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: 'rgba(220,235,255,0.5)', overflow: 'hidden', justifyContent: 'flex-end' },
  fill: { backgroundColor: '#a9744a' },
  cupCaption: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.muted, minHeight: 20, textAlign: 'center' },
});

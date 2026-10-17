import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface PathArt {
  linterna: ImageSourcePropType;
  marcos: Record<string, ImageSourcePropType>;
}

export interface PathTile {
  id: string;
  label: string;
  tried?: boolean;
}

interface LightPathBenchProps {
  art: PathArt;
  width: number;
  /** Material que está en el marco, o `null` si todavía no se puso. */
  material: string | null;
  /** La linterna está encendida y se ve qué pasa con la luz. */
  lit: boolean;
  /** `toda`, `poca`, `nada` o `rebota`: lo da el MODELO. */
  outcome: 'toda' | 'poca' | 'nada' | 'rebota' | null;
  tiles?: PathTile[];
  onMaterial?: (id: string) => void;
  resultText?: string;
  label: string;
}

const BEAM = 'rgba(255, 221, 110, 0.6)';

/**
 * La mesa de la luz (C1-U03): linterna a la izquierda, un marco con un material en el medio y una pared a la derecha. Los haces y la pared
 * iluminada o con sombra los dibuja la app (nunca la imagen); qué pasa con la luz lo da el MODELO.
 */
export function LightPathBench({ art, width, material, lit, outcome, tiles, onMaterial, resultText, label }: LightPathBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.5);
  const floor = stageH - 14;
  const lamp = Math.round(inner * 0.2);
  const frame = Math.round(inner * 0.26);
  const frameX = inner * 0.42;
  const wallX = inner * 0.86;
  const beamY = floor - frame * 0.52;
  const beamH = frame * 0.3;
  const lampRight = lamp * 0.78 + 4;
  const showBeam = lit && material !== null;
  const passes = outcome === 'toda' || outcome === 'poca';
  const brightness = outcome === 'toda' ? 1 : outcome === 'poca' ? 0.3 : 0;
  return (
    <View style={[styles.card, { width }]}>
      {tiles?.length ? (
        <View style={styles.tiles}>
          {tiles.map((t) => (
            <Pressable key={t.id} disabled={!onMaterial} onPress={() => onMaterial?.(t.id)} accessibilityRole="button" accessibilityState={{ selected: t.id === material }} accessibilityLabel={t.label} style={[styles.tile, t.id === material && styles.tileOn]}>
              <Image source={art.marcos[t.id]} style={{ width: 40, height: 40 }} resizeMode="contain" accessible={false} />
              <Text style={styles.tileText} numberOfLines={2}>
                {t.tried ? '✓ ' : ''}
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={[styles.floor, { top: floor }]} />
        {/* la pared, vista de lado, con la parte iluminada o la sombra */}
        <View style={[styles.wall, { left: wallX, top: 10, height: floor - 10 }]} />
        {showBeam && passes ? <View style={{ position: 'absolute', left: wallX - 2, top: beamY - beamH * 0.6, width: 14, height: beamH * 1.8, backgroundColor: `rgba(255, 214, 90, ${brightness})`, borderRadius: 6 }} /> : null}
        {showBeam && !passes ? <View style={{ position: 'absolute', left: wallX - 2, top: beamY - beamH * 0.6, width: 14, height: beamH * 1.8, backgroundColor: 'rgba(40, 50, 70, 0.55)', borderRadius: 6 }} /> : null}
        <Image source={art.linterna} style={{ position: 'absolute', left: 4, top: floor - lamp * 0.9, width: lamp, height: lamp }} resizeMode="contain" accessible={false} />
        {showBeam ? <View style={{ position: 'absolute', left: lampRight, top: beamY, width: frameX - lampRight + frame * 0.2, height: beamH, backgroundColor: BEAM, borderRadius: 4 }} /> : null}
        {material !== null ? <Image source={art.marcos[material]} style={{ position: 'absolute', left: frameX, top: floor - frame * 0.98, width: frame, height: frame }} resizeMode="contain" accessible={false} /> : null}
        {showBeam && passes ? <View style={{ position: 'absolute', left: frameX + frame * 0.7, top: beamY, width: wallX - frameX - frame * 0.7, height: beamH, backgroundColor: `rgba(255, 221, 110, ${outcome === 'toda' ? 0.6 : 0.22})`, borderRadius: 4 }} /> : null}
        {showBeam && outcome === 'rebota' ? <View style={{ position: 'absolute', left: frameX - inner * 0.02, top: beamY - frame * 0.3, width: inner * 0.2, height: beamH * 0.8, backgroundColor: BEAM, borderRadius: 4, transform: [{ rotate: '-28deg' }] }} /> : null}
      </View>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine },
  tileOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  tileText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink, maxWidth: 100 },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: '#dfe3f0', borderRadius: radius.tile, overflow: 'hidden' },
  floor: { position: 'absolute', left: 0, right: 0, height: 5, backgroundColor: colors.slate300 },
  wall: { position: 'absolute', width: 10, backgroundColor: '#f4f1e6', borderRadius: 4, borderWidth: 1, borderColor: colors.slate300 },
  result: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy, textAlign: 'center' },
});

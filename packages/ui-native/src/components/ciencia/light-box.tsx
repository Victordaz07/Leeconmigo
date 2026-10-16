import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { radius, shadows } from '../../tokens.ts';

export interface LightArt {
  caja: ImageSourcePropType;
  linterna: ImageSourcePropType;
  /** Un dibujo por objeto (osito, pelota, taza). */
  objetos: Record<string, ImageSourcePropType>;
}

interface LightBoxProps {
  art: LightArt;
  /** Id del objeto: `osito`, `pelota`, `taza`. */
  object: string;
  on: boolean;
  width: number;
  /** Lo que dice la caja con palabras (lector de pantalla). */
  label: string;
  /** Dónde está el interior de la caja dentro de su imagen (0–1). Se ajusta al arte final. */
  interior?: { x: number; y: number; w: number; h: number };
}

const INTERIOR = { x: 0.13, y: 0.22, w: 0.74, h: 0.58 };

/**
 * La caja de observación de C1-U02: un objeto adentro y una linterna al lado. Con la luz apagada el interior se oscurece y el
 * objeto es apenas una silueta; con la luz encendida el objeto se ve completo y un haz de luz le llega. El objeto NUNCA cambia
 * de lugar: lo único que cambia es la luz (esa es la idea de la unidad). Todo el texto lo pone la app, no la imagen.
 */
export function LightBox({ art, object, on, width, label, interior = INTERIOR }: LightBoxProps) {
  const height = Math.round(width * 0.8);
  const box = Math.round(width * 0.66);
  const boxLeft = Math.round(width * 0.02);
  const boxTop = Math.round(height * 0.05);
  const inner = { left: boxLeft + box * interior.x, top: boxTop + box * interior.y, width: box * interior.w, height: box * interior.h };
  const obj = Math.round(box * 0.4);
  const lamp = Math.round(width * 0.3);
  const lampLeft = Math.round(width * 0.7);
  const lampTop = Math.round(height * 0.5);
  // El haz sale de la linterna y llega al interior de la caja.
  const beam = `${lampLeft + lamp * 0.1},${lampTop + lamp * 0.4} ${inner.left + inner.width},${inner.top + inner.height * 0.12} ${inner.left + inner.width},${inner.top + inner.height * 0.92}`;
  return (
    <View style={[styles.frame, { width, height }]} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Image source={art.caja} style={{ position: 'absolute', left: boxLeft, top: boxTop, width: box, height: box }} resizeMode="contain" accessible={false} />
      <View pointerEvents="none" style={[styles.interior, { left: inner.left, top: inner.top, width: inner.width, height: inner.height, backgroundColor: on ? 'rgba(255,226,120,0.2)' : 'rgba(10,14,44,0.84)' }]} />
      <Image
        source={art.objetos[object]}
        style={{ position: 'absolute', left: inner.left + (inner.width - obj) / 2, top: inner.top + inner.height - obj * 1.05, width: obj, height: obj, ...(on ? null : { tintColor: '#141a3c', opacity: 0.78 }) }}
        resizeMode="contain"
        accessible={false}
      />
      {on ? (
        <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
          <Polygon points={beam} fill="rgba(255,226,120,0.4)" />
        </Svg>
      ) : null}
      <Image source={art.linterna} style={{ position: 'absolute', left: lampLeft, top: lampTop, width: lamp, height: lamp, transform: [{ rotate: '-18deg' }] }} resizeMode="contain" accessible={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: '#ffffff', borderRadius: radius.card, overflow: 'hidden', alignSelf: 'center', boxShadow: shadows.card },
  interior: { position: 'absolute', borderRadius: 14 },
});

/**
 * Objetos que se cuentan (docs/design/math-visual §2): una sola pieza reutilizada, con silueta reconocible a 24–40 px.
 * Si la app entrega el arte aprobado (`MathArtProvider`), se usa esa imagen; si no, la forma dibujada con código (la de la
 * lámina). Nunca deciden cuántos hay: eso lo dice el modelo.
 */
import { createContext, useContext, type ReactNode } from 'react';
import { Image, type ImageSourcePropType, type ImageStyle } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

/**
 * Arte aprobado para los objetos y recipientes (docs/design/math-visual/PEDIDO-IMAGENES.md). La app lo entrega con
 * `MathArtProvider` (ui-native no empaqueta imágenes); si falta una pieza, se usa la forma dibujada con código.
 */
export interface MathArt {
  seed?: ImageSourcePropType;
  sprout?: ImageSourcePropType;
  cookie?: ImageSourcePropType;
  plate?: ImageSourcePropType;
  bag?: ImageSourcePropType;
  plot?: ImageSourcePropType;
}

const MathArtContext = createContext<MathArt>({});

export function MathArtProvider({ art, children }: { art: MathArt; children: ReactNode }) {
  return <MathArtContext.Provider value={art}>{children}</MathArtContext.Provider>;
}

export const useMathArt = () => useContext(MathArtContext);

/** Una pieza de arte decorativa: el lector de pantalla la ignora (el nombre lo lleva el control que la contiene). */
function ArtImage({ source, size }: { source: ImageSourcePropType; size: number }) {
  return <Image source={source} style={{ width: size, height: size }} resizeMode="contain" accessible={false} />;
}

/** `absoluteFill` no basta en la web: la imagen tomaba su tamaño natural. Ancho y alto explícitos. */
const fill: ImageStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' };

/** Fondo de un recipiente (plato, bolsa, parcela): ocupa todo el recipiente, detrás de lo que contiene. */
export function ContainerArt({ source, mode = 'contain' }: { source: ImageSourcePropType; mode?: 'contain' | 'stretch' }) {
  return <Image source={source} style={fill} resizeMode={mode} accessible={false} />;
}

/** Colores de los objetos manipulables (lámina de Victor). Solo objetos: el texto sigue con los tokens de la app. */
export const manip = {
  cream: '#FAF5EA',
  creamDeep: '#F1E8D4',
  ink: '#233447',
  blue: '#467B9C',
  blueSoft: '#E6EFF5',
  coral: '#D77754',
  green: '#769E72',
  yellow: '#E5B74F',
  violet: '#9A7DAB',
  soil: '#B98B62',
  soilSoft: '#EADBC8',
} as const;

export function SeedIcon({ size = 36 }: { size?: number }) {
  const art = useMathArt();
  if (art.seed) return <ArtImage source={art.seed} size={size} />;
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={15} fill={manip.coral} />
      <Ellipse cx={15} cy={14} rx={4} ry={3} fill="#ffffff" opacity={0.35} />
    </Svg>
  );
}

export function SproutIcon({ size = 36 }: { size?: number }) {
  const art = useMathArt();
  if (art.sprout) return <ArtImage source={art.sprout} size={size} />;
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M20 33 V17" stroke={manip.green} strokeWidth={4} strokeLinecap="round" />
      <Ellipse cx={13} cy={15} rx={7} ry={4.5} fill={manip.green} rotation={-20} origin="13,15" />
      <Ellipse cx={27} cy={11} rx={7} ry={4.5} fill={manip.green} rotation={20} origin="27,11" />
      <Ellipse cx={20} cy={34} rx={6} ry={3.5} fill={manip.coral} />
    </Svg>
  );
}

export function CookieIcon({ size = 36 }: { size?: number }) {
  const art = useMathArt();
  if (art.cookie) return <ArtImage source={art.cookie} size={size} />;
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={16} fill={manip.yellow} />
      <Circle cx={14} cy={16} r={2.4} fill={manip.ink} />
      <Circle cx={24} cy={24} r={2.4} fill={manip.ink} />
      <Circle cx={25} cy={13} r={1.8} fill={manip.ink} />
    </Svg>
  );
}

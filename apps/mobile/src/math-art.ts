/**
 * Arte aprobado de Matemáticas (Victor, 2026-10-16; pedido en docs/design/math-visual/PEDIDO-IMAGENES.md). Generado con
 * GPT y convertido a WebP (objetos recortados a su silueta, 256 px, con transparencia). Es decorado: las cantidades las
 * dibuja la app. Antes de publicar: revisar los términos de uso de la herramienta (docs/12 §5).
 */
import type { MathArt } from '@lee-conmigo/ui-native';
import type { ImageSourcePropType } from 'react-native';

export const MATH_ART: MathArt = {
  seed: require('../assets/math/props/prop_semilla.webp'),
  sprout: require('../assets/math/props/prop_brote.webp'),
  cookie: require('../assets/math/props/prop_galleta.webp'),
  plate: require('../assets/math/props/prop_plato.webp'),
  bag: require('../assets/math/props/prop_bolsa.webp'),
  plot: require('../assets/math/props/prop_parcela.webp'),
};

type Scene = 'tenFrame' | 'equalGroups' | 'sharing';

/** Fondo de cada familia, horizontal y vertical (el centro queda despejado para el modelo). */
export const MATH_BACKGROUNDS: Record<Scene, { horizontal: ImageSourcePropType; vertical: ImageSourcePropType }> = {
  tenFrame: { horizontal: require('../assets/math/bg/bg_mate_semillero_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_semillero_vertical.webp') },
  equalGroups: { horizontal: require('../assets/math/bg/bg_mate_huerto_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_huerto_vertical.webp') },
  sharing: { horizontal: require('../assets/math/bg/bg_mate_merienda_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_merienda_vertical.webp') },
};

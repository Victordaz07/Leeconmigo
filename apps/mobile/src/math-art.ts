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

/** Portadas (Inicio y encabezado de la unidad). */
export const MATH_COVERS = {
  notebook: require('../assets/math/covers/cover_mate.webp'),
  g3u1: require('../assets/math/covers/cover_g3u1.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Mila, la guía de Matemáticas. Misma niña de las historias de lectura, en el estilo plano de este cuaderno. */
export type MilaPose = 'saluda' | 'piensa' | 'apunta' | 'celebra' | 'animo';
export const MILA: Record<MilaPose, { source: ImageSourcePropType; aspect: number }> = {
  saluda: { source: require('../assets/math/chars/char_mila_saluda.webp'), aspect: 260 / 512 },
  piensa: { source: require('../assets/math/chars/char_mila_piensa.webp'), aspect: 255 / 512 },
  apunta: { source: require('../assets/math/chars/char_mila_apunta.webp'), aspect: 366 / 512 },
  celebra: { source: require('../assets/math/chars/char_mila_celebra.webp'), aspect: 355 / 512 },
  animo: { source: require('../assets/math/chars/char_mila_animo.webp'), aspect: 261 / 512 },
};

/** Marca de "¡Estás aquí!" (Kitewise = papalote). */
export const KITE = require('../assets/math/props/prop_papalote.webp') as ImageSourcePropType;

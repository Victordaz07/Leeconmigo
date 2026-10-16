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
  frog: require('../assets/math/props/prop_saltarin.webp'),
  pizza: require('../assets/math/props/prop_pizza.webp'),
  cake: require('../assets/math/props/prop_pastel.webp'),
  clockFace: require('../assets/math/props/prop_reloj_vacio.webp'),
  treasure: require('../assets/math/props/prop_estampa.webp'),
  fruits: {
    mango: require('../assets/math/props/prop_fruta_mango.webp'),
    pera: require('../assets/math/props/prop_fruta_pera.webp'),
    uva: require('../assets/math/props/prop_fruta_uva.webp'),
    manzana: require('../assets/math/props/prop_manzana.webp'),
  },
};

type Scene = 'tenFrame' | 'equalGroups' | 'sharing' | 'placeValue' | 'numberLine' | 'fraction' | 'barModel' | 'area' | 'clock' | 'data' | 'coord' | 'ratio';

const bg = (h: ImageSourcePropType) => ({ horizontal: h, vertical: h });

/** Fondo de cada familia, horizontal y vertical (el centro queda despejado para el modelo). */
export const MATH_BACKGROUNDS: Record<Scene, { horizontal: ImageSourcePropType; vertical: ImageSourcePropType }> = {
  tenFrame: { horizontal: require('../assets/math/bg/bg_mate_semillero_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_semillero_vertical.webp') },
  equalGroups: { horizontal: require('../assets/math/bg/bg_mate_huerto_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_huerto_vertical.webp') },
  sharing: { horizontal: require('../assets/math/bg/bg_mate_merienda_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_merienda_vertical.webp') },
  // Las familias nuevas solo tienen fondo horizontal; en vertical se recorta el centro (que está despejado).
  placeValue: bg(require('../assets/math/bg/bg_mate_laboratorio.webp')),
  numberLine: bg(require('../assets/math/bg/bg_mate_camino.webp')),
  fraction: { horizontal: require('../assets/math/bg/bg_mate_merienda_horizontal.webp'), vertical: require('../assets/math/bg/bg_mate_merienda_vertical.webp') },
  barModel: bg(require('../assets/math/bg/bg_mate_mosaico.webp')),
  area: bg(require('../assets/math/bg/bg_mate_jardin_plano.webp')),
  clock: bg(require('../assets/math/bg/bg_mate_mosaico.webp')),
  data: bg(require('../assets/math/bg/bg_mate_feria.webp')),
  coord: bg(require('../assets/math/bg/bg_mate_mapa.webp')),
  ratio: bg(require('../assets/math/bg/bg_mate_laboratorio.webp')),
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

/** Ícono de cada tema del Taller (decorativo; el nombre del tema va en texto). */
export const TOPIC_ICONS: Record<Scene, ImageSourcePropType> = {
  tenFrame: require('../assets/math/props/prop_semilla.webp'),
  equalGroups: require('../assets/math/props/prop_brote.webp'),
  sharing: require('../assets/math/props/prop_galleta.webp'),
  placeValue: require('../assets/math/props/prop_caja.webp'),
  numberLine: require('../assets/math/props/prop_saltarin.webp'),
  fraction: require('../assets/math/props/prop_pizza.webp'),
  barModel: require('../assets/math/props/prop_lapiz.webp'),
  area: require('../assets/math/props/prop_parcela.webp'),
  clock: require('../assets/math/props/prop_reloj_vacio.webp'),
  data: require('../assets/math/props/prop_manzana.webp'),
  coord: require('../assets/math/props/prop_estampa.webp'),
  ratio: require('../assets/math/props/prop_frasco.webp'),
};

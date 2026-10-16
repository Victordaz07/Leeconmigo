/**
 * Arte de Ciencia (Tanda 1, unidad C4-U06). Solo decorado: los modelos, escalas, números y etiquetas los dibuja la app con
 * código (docs/design/ciencia/ESPECIFICACION.md §10). Manifiesto con el SHA-256 de los originales:
 * `docs/design/ciencia/arte/manifest-tanda-1.json`. Para agregar la Tanda 2: `scripts/ciencia-arte.py`.
 */
import type { ImageSourcePropType } from 'react-native';

/** Fondos con el centro despejado (ahí va el laboratorio); en cada uno, horizontal y vertical. */
export const CIENCIA_BACKGROUNDS = {
  laboratorio: { horizontal: require('../../../assets/ciencia/bg/bg_ciencia_laboratorio_horizontal.webp'), vertical: require('../../../assets/ciencia/bg/bg_ciencia_laboratorio_vertical.webp') },
  humedal: { horizontal: require('../../../assets/ciencia/bg/bg_ciencia_humedal_horizontal.webp'), vertical: require('../../../assets/ciencia/bg/bg_ciencia_humedal_vertical.webp') },
} satisfies Record<string, { horizontal: ImageSourcePropType; vertical: ImageSourcePropType }>;

/** Escena narrativa de C4-U06 («El misterio»): aquí sí hay detalle; es una imagen, no un modelo. Solo horizontal. */
export const CIENCIA_SCENES = {
  ladera: require('../../../assets/ciencia/bg/scene_ciencia_ladera.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Portadas: el cuaderno en Inicio y la unidad C4-U06. */
export const CIENCIA_COVERS = {
  notebook: require('../../../assets/ciencia/covers/cover_ciencia_cuaderno.webp'),
  c4u06: require('../../../assets/ciencia/covers/cover_c4_u06.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Objetos sueltos del laboratorio de Paisaje y erosión (una pieza cada uno, transparentes, cuadrados). */
export const CIENCIA_PROPS = {
  bandeja: require('../../../assets/ciencia/props/prop_bandeja.webp'),
  tierra: require('../../../assets/ciencia/props/prop_tierra.webp'),
  cobertura: require('../../../assets/ciencia/props/prop_cobertura.webp'),
  regadera: require('../../../assets/ciencia/props/prop_regadera.webp'),
  vasoSedimento: require('../../../assets/ciencia/props/prop_vaso_sedimento.webp'),
  piedritas: require('../../../assets/ciencia/props/prop_piedritas.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Maya, la guía de Ciencia (DC-4, a confirmar por Victor). Misma niña de la historia `la-isla-que-caminaba`. */
export type MayaPose = 'saluda' | 'piensa' | 'investiga' | 'apunta' | 'celebra';
export const MAYA: Record<MayaPose, { source: ImageSourcePropType; aspect: number }> = {
  saluda: { source: require('../../../assets/ciencia/chars/char_maya_saluda.webp'), aspect: 327 / 576 },
  piensa: { source: require('../../../assets/ciencia/chars/char_maya_piensa.webp'), aspect: 281 / 576 },
  investiga: { source: require('../../../assets/ciencia/chars/char_maya_investiga.webp'), aspect: 414 / 576 },
  apunta: { source: require('../../../assets/ciencia/chars/char_maya_apunta.webp'), aspect: 415 / 576 },
  celebra: { source: require('../../../assets/ciencia/chars/char_maya_celebra.webp'), aspect: 382 / 576 },
};

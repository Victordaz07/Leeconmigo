/**
 * Arte aprobado de Sociedad (Victor, 2026-10-16; pedido en `docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md`).
 * Generado con GPT y convertido a WebP. Teo reusa el diseño de "El mapa de la puerta desaparecida"
 * (`content/mapa-de-la-puerta-desaparecida/personajes.png`). Antes de publicar: revisar los términos de uso de
 * la herramienta (docs/12 §5).
 */
import type { TeoPose } from '@lee-conmigo/ui-native';
import type { ImageSourcePropType } from 'react-native';

/** Portadas (Inicio y encabezado de la unidad comparten la misma por ahora: una sola unidad piloto). */
export const SOCIAL_COVERS = {
  notebook: require('../assets/sociedad/covers/cover_sociedad.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Claves de arte que puede traer un paso/fuente de cualquier unidad, resueltas a la imagen real. */
export const SOCIAL_SCENES = {
  planoAntes: require('../assets/sociedad/scenes/plano_calle_antes.webp'),
  planoDespues: require('../assets/sociedad/scenes/plano_calle_despues.webp'),
  tarjetaFoto: require('../assets/sociedad/scenes/tarjeta_foto_arroyo.webp'),
  cuadernoViejo: require('../assets/sociedad/scenes/cuaderno_viejo.webp'),
  edificioMision: require('../assets/sociedad/scenes/edificio_mision.webp'),
  asentamientoMapa: require('../assets/sociedad/scenes/asentamiento_mapa.webp'),
} satisfies Record<string, ImageSourcePropType>;

export function resolveSocialArt(key: string | null | undefined): ImageSourcePropType | undefined {
  if (!key) return undefined;
  return (SOCIAL_SCENES as Record<string, ImageSourcePropType>)[key];
}

/** Teo, la guía de Sociedad. Mismo niño de "El mapa de la puerta desaparecida", en sus 4 poses. */
export const TEO: Record<TeoPose, { source: ImageSourcePropType; aspect: number }> = {
  saluda: { source: require('../assets/sociedad/chars/char_teo_saluda.webp'), aspect: 292 / 512 },
  piensa: { source: require('../assets/sociedad/chars/char_teo_piensa.webp'), aspect: 229 / 512 },
  apunta: { source: require('../assets/sociedad/chars/char_teo_apunta.webp'), aspect: 335 / 512 },
  celebra: { source: require('../assets/sociedad/chars/char_teo_celebra.webp'), aspect: 334 / 512 },
};

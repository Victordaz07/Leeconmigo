/**
 * Arte de «Para la vida» 02–08 (Partes 1 y 2, 43 imágenes). Solo decorado: todo texto, botón y pista lo dibuja la app, nunca la imagen.
 * Manifiesto con el SHA-256 de los originales: `docs/design/vida/arte/manifest-parte-*.json`. Para agregar más: `python3 -I scripts/vida-imagenes.py <carpeta> <lote>`
 * y se conectan aquí. Si una imagen falta, la app usa lo dibujado con código. Los animales guía son propuestas hasta que Victor las apruebe (D16).
 */
import type { ImageSourcePropType } from 'react-native';
import type { VidaModuleId } from '@lee-conmigo/ui-core';

export interface VidaArt {
  /** Portada del cuaderno en la estantería de Inicio (3:2, con el color del módulo de fondo). */
  cover: ImageSourcePropType;
  /** Fondo con el centro despejado (3:2). */
  bg: ImageSourcePropType;
  /** Una escena por encuentro de la misión, en orden (3:2, zona tranquila a la derecha). */
  scenes: [ImageSourcePropType, ImageSourcePropType, ImageSourcePropType];
  /** La guía (animal), cuerpo entero, fondo transparente (1:1). */
  guide: ImageSourcePropType;
}

/** El estante de los ocho cuadernos de «Para la vida» (3:2), para la fila de Inicio. */
export const VIDA_BANNER = require('../../../assets/vida/banner/banner_para_la_vida.webp') as ImageSourcePropType;

export const VIDA_ART: Record<VidaModuleId, VidaArt> = {
  emociones: {
    cover: require('../../../assets/vida/covers/cover_emociones_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_emociones_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_emociones_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_emociones_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_emociones_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_miel_neutral.webp') as ImageSourcePropType,
  },
  comunicacion: {
    cover: require('../../../assets/vida/covers/cover_comunicacion_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_comunicacion_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_comunicacion_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_comunicacion_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_comunicacion_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_eco_neutral.webp') as ImageSourcePropType,
  },
  digital: {
    cover: require('../../../assets/vida/covers/cover_digital_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_digital_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_digital_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_digital_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_digital_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_chispa_neutral.webp') as ImageSourcePropType,
  },
  critico: {
    cover: require('../../../assets/vida/covers/cover_critico_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_critico_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_critico_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_critico_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_critico_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_lupa_neutral.webp') as ImageSourcePropType,
  },
  autonomia: {
    cover: require('../../../assets/vida/covers/cover_autonomia_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_autonomia_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_autonomia_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_autonomia_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_autonomia_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_paso_neutral.webp') as ImageSourcePropType,
  },
  organizacion: {
    cover: require('../../../assets/vida/covers/cover_organizacion_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_organizacion_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_organizacion_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_organizacion_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_organizacion_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_ruta_neutral.webp') as ImageSourcePropType,
  },
  emprendimiento: {
    cover: require('../../../assets/vida/covers/cover_emprendimiento_cuaderno.webp') as ImageSourcePropType,
    bg: require('../../../assets/vida/bg/bg_emprendimiento_horizontal.webp') as ImageSourcePropType,
    scenes: [
      require('../../../assets/vida/scenes/scene_emprendimiento_1.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_emprendimiento_2.webp') as ImageSourcePropType,
      require('../../../assets/vida/scenes/scene_emprendimiento_3.webp') as ImageSourcePropType,
    ],
    guide: require('../../../assets/vida/guides/guide_dique_neutral.webp') as ImageSourcePropType,
  },
};

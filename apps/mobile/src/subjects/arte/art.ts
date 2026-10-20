/**
 * Arte de Arte y música (Lote A de la Tanda 1). Solo decorado: la rejilla, los pulsos, la paleta, los colores y todo texto los dibuja la app.
 * Manifiesto con el SHA-256 de los originales: `docs/design/artes/arte/manifest-lote-a.json`. Para agregar el Lote B (instrumentos) y el C
 * (pintura): `python3 -I scripts/arte-imagenes.py <carpeta> lote-b` y se conectan aquí. Si una imagen falta, la app usa lo hecho con código.
 */
import type { ImageSourcePropType } from 'react-native';

export const ARTE_ART = {
  /** Portada del cuaderno en la estantería de Inicio (3:2). */
  cover: require('../../../assets/arte/covers/cover_arte_cuaderno.webp') as ImageSourcePropType,
  /** Inicio del cuaderno: la mitad derecha está despejada (crema #FEF7EA) para los botones. */
  hero: require('../../../assets/arte/covers/hero_arte_inicio.webp') as ImageSourcePropType,
  /** Portada de la unidad A1-U04 «Mi banda deja respirar al silencio» (3:2). */
  unitA1U04: require('../../../assets/arte/covers/cover_a1_u04.webp') as ImageSourcePropType,
  /** Fondos con el centro despejado, horizontal y vertical. */
  ritmo: {
    horizontal: require('../../../assets/arte/bg/bg_arte_ritmo_horizontal.webp') as ImageSourcePropType,
    vertical: require('../../../assets/arte/bg/bg_arte_ritmo_vertical.webp') as ImageSourcePropType,
  },
  pintura: {
    horizontal: require('../../../assets/arte/bg/bg_arte_pintura_horizontal.webp') as ImageSourcePropType,
    vertical: require('../../../assets/arte/bg/bg_arte_pintura_vertical.webp') as ImageSourcePropType,
  },
};

/** Proporción de las portadas y del inicio (1536×1024). */
export const COVER_ASPECT = 1536 / 1024;
/** El crema de la mitad despejada del inicio: el fondo de la tarjeta debe coincidir para que la imagen se funda con ella. */
export const HERO_CREAM = '#FEF7EA';

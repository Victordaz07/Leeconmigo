/**
 * Arte de Arte y música (Lote A de la Tanda 1). Solo decorado: la rejilla, los pulsos, la paleta, los colores y todo texto los dibuja la app.
 * Manifiesto con el SHA-256 de los originales: `docs/design/artes/arte/manifest-lote-a.json`. Para agregar el Lote B (instrumentos) y el C
 * (pintura): `python3 -I scripts/arte-imagenes.py <carpeta> lote-b` y se conectan aquí. Si una imagen falta, la app usa lo hecho con código.
 */
import type { ImageSourcePropType } from 'react-native';
import type { SoundId } from '@lee-conmigo/music-engine';

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

/**
 * Un dibujo por sonido (Lote B, objetos con fondo transparente, 512×512). El sonido `carillon` se llama «Campanita» y su archivo es `snd_campanita`.
 * Falta `pisada` (la imagen llegó cortada y hay que volver a generarla): sin dibujo, la interfaz muestra solo el nombre.
 */
export const SOUND_ART: Partial<Record<SoundId, ImageSourcePropType>> = {
  bombo: require('../../../assets/arte/snd/snd_bombo.webp'),
  tom: require('../../../assets/arte/snd/snd_tom.webp'),
  bongo: require('../../../assets/arte/snd/snd_bongo.webp'),
  caja: require('../../../assets/arte/snd/snd_caja.webp'),
  palmas: require('../../../assets/arte/snd/snd_palmas.webp'),
  chasquido: require('../../../assets/arte/snd/snd_chasquido.webp'),
  voz: require('../../../assets/arte/snd/snd_voz.webp'),
  claves: require('../../../assets/arte/snd/snd_claves.webp'),
  bloque: require('../../../assets/arte/snd/snd_bloque.webp'),
  triangulo: require('../../../assets/arte/snd/snd_triangulo.webp'),
  sonaja: require('../../../assets/arte/snd/snd_sonaja.webp'),
  marimba: require('../../../assets/arte/snd/snd_marimba.webp'),
  carillon: require('../../../assets/arte/snd/snd_campanita.webp'),
  cuerda: require('../../../assets/arte/snd/snd_cuerda.webp'),
  bajo: require('../../../assets/arte/snd/snd_bajo.webp'),
};

/** Objetos de pintura (Lote C, 512×512 transparente). `esponja` queda reservada para los sellos y estampas (todavía no hay). */
export const PAINT_ART = {
  pincelFino: require('../../../assets/arte/props/prop_pincel_fino.webp') as ImageSourcePropType,
  pincelMedio: require('../../../assets/arte/props/prop_pincel_medio.webp') as ImageSourcePropType,
  pincelGrueso: require('../../../assets/arte/props/prop_pincel_grueso.webp') as ImageSourcePropType,
  goma: require('../../../assets/arte/props/prop_goma.webp') as ImageSourcePropType,
  paleta: require('../../../assets/arte/props/prop_paleta.webp') as ImageSourcePropType,
  bote: require('../../../assets/arte/props/prop_bote_pintura.webp') as ImageSourcePropType,
  vaso: require('../../../assets/arte/props/prop_vaso_agua.webp') as ImageSourcePropType,
  esponja: require('../../../assets/arte/props/prop_esponja.webp') as ImageSourcePropType,
};

/** Proporción de las portadas y del inicio (1536×1024). */
export const COVER_ASPECT = 1536 / 1024;
/** El crema de la mitad despejada del inicio: el fondo de la tarjeta debe coincidir para que la imagen se funda con ella. */
export const HERO_CREAM = '#FEF7EA';

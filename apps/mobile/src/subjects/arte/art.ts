/**
 * Arte de Arte y música (Lote A de la Tanda 1). Solo decorado: la rejilla, los pulsos, la paleta, los colores y todo texto los dibuja la app.
 * Manifiesto con el SHA-256 de los originales: `docs/design/artes/arte/manifest-lote-a.json`. Lotes B, B2 (pisada) y C: ya conectados. Para agregar más:
 * `python3 -I scripts/arte-imagenes.py <carpeta> <lote>` y se conectan aquí. Si una imagen falta, la app usa lo hecho con código.
 */
import type { ImageSourcePropType } from 'react-native';
import type { Background, PaperColor } from '@lee-conmigo/art-content';
import type { SoundId } from '@lee-conmigo/music-engine';

export const ARTE_ART = {
  /** Portada del cuaderno en la estantería de Inicio (3:2). */
  cover: require('../../../assets/arte/covers/cover_arte_cuaderno.webp') as ImageSourcePropType,
  /** Inicio del cuaderno: la mitad derecha está despejada (crema #FEF7EA) para los botones. */
  hero: require('../../../assets/arte/covers/hero_arte_inicio.webp') as ImageSourcePropType,
  /** Portada de la unidad A1-U04 «Mi banda deja respirar al silencio» (3:2). */
  unitA1U04: require('../../../assets/arte/covers/cover_a1_u04.webp') as ImageSourcePropType,
  /** Portada de la unidad A2-U02 «Colores que se relacionan» (3:2) y de A1-U06 «Una historia de recortes» (3:2). */
  unitA2U02: require('../../../assets/arte/covers/cover_a2_u02.webp') as ImageSourcePropType,
  unitA1U06: require('../../../assets/arte/covers/cover_a1_u06.webp') as ImageSourcePropType,
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
 * Los 16 sonidos tienen su dibujo (`pisada` llegó después, en el Lote B2, porque la primera copia vino cortada). `Partial` por si se agrega un sonido nuevo
 * sin dibujo: la interfaz muestra solo el nombre.
 */
export const SOUND_ART: Partial<Record<SoundId, ImageSourcePropType>> = {
  bombo: require('../../../assets/arte/snd/snd_bombo.webp'),
  tom: require('../../../assets/arte/snd/snd_tom.webp'),
  bongo: require('../../../assets/arte/snd/snd_bongo.webp'),
  caja: require('../../../assets/arte/snd/snd_caja.webp'),
  palmas: require('../../../assets/arte/snd/snd_palmas.webp'),
  chasquido: require('../../../assets/arte/snd/snd_chasquido.webp'),
  pisada: require('../../../assets/arte/snd/snd_pisada.webp'),
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

/** Texturas de papel (Tanda 2-A, 512×512, opacas). Se estiran sobre el cartón o sobre la pieza (no se repiten: así funciona igual en Android y en iOS). */
export const MAT_ART = {
  paperDrawing: require('../../../assets/arte/mats/mat_paper_drawing.webp') as ImageSourcePropType,
  paperWhite: require('../../../assets/arte/mats/mat_paper_white.webp') as ImageSourcePropType,
  paperFibers: require('../../../assets/arte/mats/mat_paper_fibers.webp') as ImageSourcePropType,
  kraft: require('../../../assets/arte/mats/mat_kraft_thin.webp') as ImageSourcePropType,
  cardboard: require('../../../assets/arte/mats/mat_cardboard.webp') as ImageSourcePropType,
  tissue: require('../../../assets/arte/mats/mat_paper_tissue.webp') as ImageSourcePropType,
};

/** Qué textura lleva cada «papel» de material del collage (los papeles de color son lisos). */
export const PIECE_TEXTURE: Partial<Record<PaperColor, ImageSourcePropType>> = { kraft: MAT_ART.kraft, fibers: MAT_ART.paperFibers, cardboard: MAT_ART.cardboard, tissue: MAT_ART.tissue };
/** Qué textura lleva cada fondo del cartón (los fondos de color son lisos). */
export const BOARD_TEXTURE: Partial<Record<Background, ImageSourcePropType>> = { cream: MAT_ART.paperDrawing, white: MAT_ART.paperWhite, kraft: MAT_ART.kraft, cardboard: MAT_ART.cardboard };

/** Adornos sueltos (Tanda 2-B, 512×512 transparentes). Reservados para «Mi museo» y la selección de piezas. */
export const CUT_ART = {
  tapeYellow: require('../../../assets/arte/cuts/cut_tape_yellow.webp') as ImageSourcePropType,
  tapeTurquoise: require('../../../assets/arte/cuts/cut_tape_turquoise.webp') as ImageSourcePropType,
  scrapKraft: require('../../../assets/arte/cuts/cut_scrap_kraft.webp') as ImageSourcePropType,
  scrapPaper: require('../../../assets/arte/cuts/cut_scrap_paper.webp') as ImageSourcePropType,
};

/**
 * Mi museo (Tanda 2-C): marcos de colores con el interior transparente (1024×683; `hole` = el hueco, en fracciones del marco, medido al convertir:
 * `docs/design/artes/arte/manifest-lote-2.json`), carpetas y la pared. Los usa «Mi museo» (`museum-screen.tsx`).
 */
export const MUSEO_ART = {
  frames: {
    coral: { source: require('../../../assets/arte/museo/frame_coral.webp') as ImageSourcePropType, hole: [0.1191, 0.1807, 0.7617, 0.6221] as const },
    turquoise: { source: require('../../../assets/arte/museo/frame_turquoise.webp') as ImageSourcePropType, hole: [0.1413, 0.209, 0.7161, 0.5801] as const },
    violet: { source: require('../../../assets/arte/museo/frame_violet.webp') as ImageSourcePropType, hole: [0.1497, 0.1924, 0.7025, 0.5977] as const },
    yellow: { source: require('../../../assets/arte/museo/frame_yellow.webp') as ImageSourcePropType, hole: [0.1367, 0.1865, 0.7266, 0.6201] as const },
  },
  folderCoral: require('../../../assets/arte/museo/folder_cover_coral.webp') as ImageSourcePropType,
  folderTurquoise: require('../../../assets/arte/museo/folder_cover_turquoise.webp') as ImageSourcePropType,
  wall: require('../../../assets/arte/bg/bg_museo_pared.webp') as ImageSourcePropType,
};

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

/** Las escenas por id (lo que el contenido llama `scene`): imagen y proporción. Una unidad nueva agrega las suyas aquí. */
export const SCENE_ART: Record<string, { source: ImageSourcePropType; aspect: number }> = {
  ladera: { source: CIENCIA_SCENES.ladera, aspect: 1536 / 1024 },
  humedal: { source: CIENCIA_BACKGROUNDS.humedal.horizontal, aspect: 1536 / 1024 },
  cuarto: { source: require('../../../assets/ciencia/bg/scene_c1_u02.webp'), aspect: 1536 / 1024 },
  porche: { source: require('../../../assets/ciencia/bg/scene_c2_u02.webp'), aspect: 1536 / 1024 },
  alfeizar: { source: require('../../../assets/ciencia/bg/scene_c6_u04.webp'), aspect: 1536 / 1024 },
  taller: { source: require('../../../assets/ciencia/bg/scene_c3_u06.webp'), aspect: 1536 / 1024 },
  mesaLab: { source: require('../../../assets/ciencia/bg/scene_c5_u02.webp'), aspect: 1536 / 1024 },
  patio: { source: require('../../../assets/ciencia/bg/scene_c3_u05.webp'), aspect: 1536 / 1024 }, // Lote H (provisional)
  mesaRampa: { source: require('../../../assets/ciencia/bg/scene_c4_u02.webp'), aspect: 1536 / 1024 }, // Lote I (provisional)
};

const COVER_C5_U02 = require('../../../assets/ciencia/covers/cover_c5_u02.webp');

/** Portadas: el cuaderno en Inicio y la unidad C4-U06. */
export const CIENCIA_COVERS = {
  notebook: require('../../../assets/ciencia/covers/cover_ciencia_cuaderno.webp'),
  c3u05: require('../../../assets/ciencia/covers/cover_c3_u05.webp'), // Lote H (provisional)
  c4u02: require('../../../assets/ciencia/covers/cover_c4_u02.webp'), // Lote I (provisional)
  c4u06: require('../../../assets/ciencia/covers/cover_c4_u06.webp'),
  c1u02: require('../../../assets/ciencia/covers/cover_c1_u02.webp'),
  c2u02: require('../../../assets/ciencia/covers/cover_c2_u02.webp'),
  c3u06: require('../../../assets/ciencia/covers/cover_c3_u06.webp'),
  c5u02: COVER_C5_U02,
  // Provisional: C5-U03 usa la portada de C5-U02 hasta que llegue la suya (no pedida: no hace falta para jugar).
  c5u03: COVER_C5_U02,
  c6u04: require('../../../assets/ciencia/covers/cover_c6_u04.webp'),
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

/** Arte de la unidad C1-U02 (Lote A del pedido, recibido: `docs/design/ciencia/arte/manifest-tanda-2a.json`). */
export const CIENCIA_LUZ = {
  caja: require('../../../assets/ciencia/props/prop_caja_observacion.webp'),
  linterna: require('../../../assets/ciencia/props/prop_linterna.webp'),
  objetos: {
    osito: require('../../../assets/ciencia/props/prop_objeto_osito.webp'),
    pelota: require('../../../assets/ciencia/props/prop_objeto_pelota.webp'),
    taza: require('../../../assets/ciencia/props/prop_objeto_taza.webp'),
  },
} satisfies { caja: ImageSourcePropType; linterna: ImageSourcePropType; objetos: Record<string, ImageSourcePropType> };

/** Arte de la unidad C2-U02 (Lote B del pedido, recibido: `manifest-tanda-2b.json`). */
export const CIENCIA_MATERIALES = {
  muneco: require('../../../assets/ciencia/props/prop_muneco.webp'),
  bandeja: require('../../../assets/ciencia/props/prop_bandeja_agua.webp'),
  materiales: {
    papel: require('../../../assets/ciencia/props/prop_papel_absorbente.webp'),
    tela: require('../../../assets/ciencia/props/prop_tela.webp'),
    plastico: require('../../../assets/ciencia/props/prop_plastico.webp'),
    carton: require('../../../assets/ciencia/props/prop_carton.webp'),
  },
} satisfies { muneco: ImageSourcePropType; bandeja: ImageSourcePropType; materiales: Record<string, ImageSourcePropType> };

/** Objeto compartido por C2, C5 y C6 (Lote B): un vaso de agua sin rayitas ni números. */
export const CIENCIA_COMUN = {
  vasoAgua: require('../../../assets/ciencia/props/prop_vaso_agua.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Arte de C6-U04 «Energía térmica» (Lote C, recibido: `manifest-tanda-2c.json`). */
export const CIENCIA_TERMICO = {
  vasoFrio: require('../../../assets/ciencia/props/prop_vaso_frio.webp'),
  funda: require('../../../assets/ciencia/props/prop_funda_aislante.webp'),
  termometro: require('../../../assets/ciencia/props/prop_termometro.webp'),
  capas: {
    fieltro: require('../../../assets/ciencia/props/prop_capa_fieltro.webp'),
    espuma: require('../../../assets/ciencia/props/prop_capa_espuma.webp'),
    aluminio: require('../../../assets/ciencia/props/prop_capa_aluminio.webp'),
  },
} satisfies { vasoFrio: ImageSourcePropType; funda: ImageSourcePropType; termometro: ImageSourcePropType; capas: Record<string, ImageSourcePropType> };

/** Arte de C3-U06 «Interacciones sin tocar» (Lote D, recibido: `manifest-tanda-2d.json`). El imán es GRANDE, nunca pequeño ni de neodimio. */
export const CIENCIA_IMANES = {
  iman: require('../../../assets/ciencia/props/prop_iman_grande.webp'),
  objetos: {
    clavo: require('../../../assets/ciencia/props/prop_clavo.webp'),
    llave: require('../../../assets/ciencia/props/prop_llave.webp'),
    bloque: require('../../../assets/ciencia/props/prop_bloque_plastico.webp'),
    aluminio: require('../../../assets/ciencia/props/prop_bola_aluminio.webp'),
  },
  globo: require('../../../assets/ciencia/props/prop_globo.webp'),
  papelitos: require('../../../assets/ciencia/props/prop_papelitos.webp'),
} satisfies { iman: ImageSourcePropType; objetos: Record<string, ImageSourcePropType>; globo: ImageSourcePropType; papelitos: ImageSourcePropType };

/** Arte de C5-U02 «Cantidad y propiedades» (Lote E, recibido: `manifest-tanda-2e.json`). Las muestras son polvos en platitos, no golosinas. */
export const CIENCIA_SISTEMAS = {
  frasco: require('../../../assets/ciencia/props/prop_frasco_cerrado.webp'),
  balanza: require('../../../assets/ciencia/props/prop_balanza.webp'),
  muestras: {
    sal: require('../../../assets/ciencia/props/prop_muestra_sal.webp'),
    azucar: require('../../../assets/ciencia/props/prop_muestra_azucar.webp'),
    arena: require('../../../assets/ciencia/props/prop_muestra_arena.webp'),
    harina: require('../../../assets/ciencia/props/prop_muestra_harina.webp'),
  },
} satisfies { frasco: ImageSourcePropType; balanza: ImageSourcePropType; muestras: Record<string, ImageSourcePropType> };

/** Arte de C4-U02 «Energía en movimiento» (Lote I; provisional hasta que lleguen las imágenes): rampa, bloque y la bola de siempre. */
export const CIENCIA_MOVIMIENTO = {
  rampa: require('../../../assets/ciencia/props/prop_rampa.webp'),
  bloque: require('../../../assets/ciencia/props/prop_bloque_madera.webp'),
  bola: CIENCIA_LUZ.objetos.pelota,
} satisfies { rampa: ImageSourcePropType; bloque: ImageSourcePropType; bola: ImageSourcePropType };

/** Arte de C3-U05 «Fuerzas y movimiento» (Lote H; provisional hasta que lleguen las imágenes): el carrito y el péndulo. */
export const CIENCIA_FUERZAS = {
  carrito: require('../../../assets/ciencia/props/prop_carrito.webp'),
  pendulo: require('../../../assets/ciencia/props/prop_pendulo.webp'),
} satisfies { carrito: ImageSourcePropType; pendulo: ImageSourcePropType };

/** Maya, la guía de Ciencia (DC-4, a confirmar por Victor). Misma niña de la historia `la-isla-que-caminaba`. */
export type MayaPose = 'saluda' | 'piensa' | 'investiga' | 'apunta' | 'celebra';
export const MAYA: Record<MayaPose, { source: ImageSourcePropType; aspect: number }> = {
  saluda: { source: require('../../../assets/ciencia/chars/char_maya_saluda.webp'), aspect: 327 / 576 },
  piensa: { source: require('../../../assets/ciencia/chars/char_maya_piensa.webp'), aspect: 281 / 576 },
  investiga: { source: require('../../../assets/ciencia/chars/char_maya_investiga.webp'), aspect: 414 / 576 },
  apunta: { source: require('../../../assets/ciencia/chars/char_maya_apunta.webp'), aspect: 415 / 576 },
  celebra: { source: require('../../../assets/ciencia/chars/char_maya_celebra.webp'), aspect: 382 / 576 },
};

/**
 * ¿Ya llegó el arte de cada unidad? Hasta que Victor entregue sus imágenes (docs/design/ciencia/PEDIDO-IMAGENES.md) una unidad
 * con contenido NO se abre en la app: se ve como «Pronto». Cuando llegan, se corre `scripts/ciencia-arte.py` y se pone `true`.
 */
export const UNIT_ART_READY: Record<string, boolean> = {
  'C4-U06': true,
  'C1-U02': true, // Lote A recibido (manifest-tanda-2a)
  'C2-U02': true, // Lote B recibido (manifest-tanda-2b)
  // Arte recibido (lotes C, D y E); estas unidades aún no tienen contenido, así que no se abren.
  'C3-U06': true,
  'C5-U02': true,
  'C5-U03': true, // usa el arte de Lote E (frasco, muestras) y dibuja bicarbonato/vinagre; portada provisional
  'C3-U05': false, // Lote H pedido (Tanda 3); con arte provisional solo se ve en un build de demo
  'C4-U02': false, // Lote I pedido (Tanda 3); con arte provisional solo se ve en un build de demo
  'C6-U04': true, // Lote C recibido (manifest-tanda-2c)
};

/** Un build de demo (`EXPO_PUBLIC_DEMO=1`) deja abrir las unidades con arte provisional, para probarlas antes de que llegue. */
export const SHOW_UNITS_WITHOUT_ART = process.env.EXPO_PUBLIC_DEMO === '1';

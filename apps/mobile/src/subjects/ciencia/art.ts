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
  musica: { source: require('../../../assets/ciencia/bg/scene_c1_u01.webp'), aspect: 1536 / 1024 },
  arroyo: { source: require('../../../assets/ciencia/bg/scene_c2_u08.webp'), aspect: 1536 / 1024 },
  pueblo: { source: require('../../../assets/ciencia/bg/scene_c3_u07.webp'), aspect: 1536 / 1024 },
  taller2: { source: require('../../../assets/ciencia/bg/scene_c4_u03.webp'), aspect: 1536 / 1024 },
  valle: { source: require('../../../assets/ciencia/bg/scene_c6_u07.webp'), aspect: 1536 / 1024 },
  costa: { source: require('../../../assets/ciencia/bg/scene_c6_u05.webp'), aspect: 1536 / 1024 },
  aula: { source: require('../../../assets/ciencia/bg/scene_c2_u01.webp'), aspect: 1536 / 1024 },
  sala: { source: require('../../../assets/ciencia/bg/scene_c1_u03.webp'), aspect: 1536 / 1024 },
  patio: { source: require('../../../assets/ciencia/bg/scene_c3_u05.webp'), aspect: 1536 / 1024 },
  mesaRampa: { source: require('../../../assets/ciencia/bg/scene_c4_u02.webp'), aspect: 1536 / 1024 },
};

const COVER_C5_U02 = require('../../../assets/ciencia/covers/cover_c5_u02.webp');

/** Portadas: el cuaderno en Inicio y la unidad C4-U06. */
export const CIENCIA_COVERS = {
  notebook: require('../../../assets/ciencia/covers/cover_ciencia_cuaderno.webp'),
  c1u01: require('../../../assets/ciencia/covers/cover_c1_u01.webp'),
  c2u08: require('../../../assets/ciencia/covers/cover_c2_u08.webp'),
  c3u07: require('../../../assets/ciencia/covers/cover_c3_u07.webp'),
  c4u03: require('../../../assets/ciencia/covers/cover_c4_u03.webp'),
  c5u01: require('../../../assets/ciencia/covers/cover_c5_u01.webp'),
  c6u07: require('../../../assets/ciencia/covers/cover_c6_u07.webp'),
  c6u05: require('../../../assets/ciencia/covers/cover_c6_u05.webp'),
  c2u01: require('../../../assets/ciencia/covers/cover_c2_u01.webp'),
  c1u03: require('../../../assets/ciencia/covers/cover_c1_u03.webp'),
  c3u05: require('../../../assets/ciencia/covers/cover_c3_u05.webp'),
  c4u02: require('../../../assets/ciencia/covers/cover_c4_u02.webp'),
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

const BLOQUE_MADERA = require('../../../assets/ciencia/props/prop_bloque_madera.webp');

/** Arte de C4-U02 «Energía en movimiento» (Lote I, recibido): rampa, bloque y la bola de siempre. */
export const CIENCIA_MOVIMIENTO = {
  rampa: require('../../../assets/ciencia/props/prop_rampa.webp'),
  bloque: BLOQUE_MADERA,
  bola: CIENCIA_LUZ.objetos.pelota,
} satisfies { rampa: ImageSourcePropType; bloque: ImageSourcePropType; bola: ImageSourcePropType };

/** Arte de C3-U05 «Fuerzas y movimiento» (Lote H, recibido): el carrito y el péndulo. */
export const CIENCIA_FUERZAS = {
  carrito: require('../../../assets/ciencia/props/prop_carrito.webp'),
  pendulo: require('../../../assets/ciencia/props/prop_pendulo.webp'),
} satisfies { carrito: ImageSourcePropType; pendulo: ImageSourcePropType };

/** Arte de C1-U03 «Caminos de luz» (Lote F, recibido): la linterna de siempre y los cuatro marcos. */
export const CIENCIA_CAMINOS = {
  linterna: CIENCIA_LUZ.linterna,
  marcos: {
    transparente: require('../../../assets/ciencia/props/prop_marco_transparente.webp'),
    calco: require('../../../assets/ciencia/props/prop_marco_calco.webp'),
    cartulina: require('../../../assets/ciencia/props/prop_marco_cartulina.webp'),
    aluminio: require('../../../assets/ciencia/props/prop_marco_aluminio.webp'),
  },
} satisfies { linterna: ImageSourcePropType; marcos: Record<string, ImageSourcePropType> };

/** Arte de C2-U01 «Detectives de materiales» (Lote G, recibido): la lupa y los seis objetos. */
export const CIENCIA_CLASIFICAR = {
  lupa: require('../../../assets/ciencia/props/prop_lupa.webp'),
  objetos: {
    cuchara: require('../../../assets/ciencia/props/prop_cuchara_metal.webp'),
    bloque: BLOQUE_MADERA,
    esponja: require('../../../assets/ciencia/props/prop_esponja.webp'),
    pelota: CIENCIA_LUZ.objetos.pelota,
    taza: CIENCIA_LUZ.objetos.taza,
    tela: CIENCIA_MATERIALES.materiales.tela,
  },
} satisfies { lupa: ImageSourcePropType; objetos: Record<string, ImageSourcePropType> };

/** Arte de C6-U05 «Agua en movimiento» (Lote J, recibido: `manifest-tanda-3j.json`): las piezas del modelo del ciclo del agua. */
export const CIENCIA_AGUA = {
  sol: require('../../../assets/ciencia/props/prop_sol.webp'),
  nube: require('../../../assets/ciencia/props/prop_nube.webp'),
  mar: require('../../../assets/ciencia/props/prop_mar.webp'),
  montana: require('../../../assets/ciencia/props/prop_montana.webp'),
  rio: require('../../../assets/ciencia/props/prop_rio.webp'),
  arbol: require('../../../assets/ciencia/props/prop_arbol.webp'),
  suelo: require('../../../assets/ciencia/props/prop_suelo_corte.webp'),
} satisfies Record<string, ImageSourcePropType>;

/** Arte de la Tanda 4 (lotes K–P, recibidos: `manifest-tanda-4k…4p.json`). Cada unidad usa el suyo cuando se construye. */
export const CIENCIA_VIBRACION = {
  regla: require('../../../assets/ciencia/props/prop_regla_borde.webp'),
  tambor: require('../../../assets/ciencia/props/prop_tambor.webp'),
  ligas: require('../../../assets/ciencia/props/prop_caja_ligas.webp'),
} satisfies Record<string, ImageSourcePropType>;
export const CIENCIA_TIERRA = {
  volcan: require('../../../assets/ciencia/props/prop_volcan.webp'),
  canon: require('../../../assets/ciencia/props/prop_canon.webp'),
  duna: require('../../../assets/ciencia/props/prop_duna.webp'),
} satisfies Record<string, ImageSourcePropType>;
export const CIENCIA_CLIMA = {
  copo: require('../../../assets/ciencia/props/prop_copo_nieve.webp'),
  manga: require('../../../assets/ciencia/props/prop_manga_viento.webp'),
  glaciar: require('../../../assets/ciencia/props/prop_glaciar.webp'),
} satisfies Record<string, ImageSourcePropType>;
export const CIENCIA_ENERGIA = {
  molinete: require('../../../assets/ciencia/props/prop_molinete.webp'),
  campana: require('../../../assets/ciencia/props/prop_campana.webp'),
  pila: require('../../../assets/ciencia/props/prop_pila.webp'),
  bombilla: require('../../../assets/ciencia/props/prop_bombilla.webp'),
} satisfies Record<string, ImageSourcePropType>;
export const CIENCIA_INVISIBLE = {
  jeringa: require('../../../assets/ciencia/props/prop_jeringa.webp'),
  bolsa: require('../../../assets/ciencia/props/prop_bolsa_aire.webp'),
  vasoColorante: require('../../../assets/ciencia/props/prop_vaso_colorante.webp'),
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

/**
 * ¿Ya llegó el arte de cada unidad? Hasta que Victor entregue sus imágenes (docs/design/ciencia/PEDIDO-IMAGENES.md) una unidad
 * con contenido NO se abre en la app: no aparece en el catálogo. Cuando llegan, se corre `scripts/ciencia-arte.py` y se pone `true`.
 */
export const UNIT_ART_READY: Record<string, boolean> = {
  'C4-U06': true,
  'C1-U02': true, // Lote A recibido (manifest-tanda-2a)
  'C2-U02': true, // Lote B recibido (manifest-tanda-2b)
  // Arte recibido (lotes C, D y E); estas unidades aún no tienen contenido, así que no se abren.
  'C3-U06': true,
  'C4-U03': true, // Lote N recibido (manifest-tanda-4n)
  'C1-U01': true, // Lote K recibido (manifest-tanda-4k)
  'C2-U08': true, // Lote L recibido (manifest-tanda-4l)
  'C3-U07': true, // Lote M recibido (manifest-tanda-4m)
  'C5-U01': true, // Lote O recibido (manifest-tanda-4o)
  'C5-U02': true,
  'C5-U03': true, // usa el arte de Lote E (frasco, muestras) y dibuja bicarbonato/vinagre; portada provisional
  'C2-U01': true, // Lote G recibido (manifest-tanda-3g)
  'C1-U03': true, // Lote F recibido (manifest-tanda-3f)
  'C3-U05': true, // Lote H recibido (manifest-tanda-3h)
  'C4-U02': true, // Lote I recibido (manifest-tanda-3i)
  'C6-U05': true, // Lote J recibido (manifest-tanda-3j)
  'C6-U04': true, // Lote C recibido (manifest-tanda-2c)
};

/** Un build de demo (`EXPO_PUBLIC_DEMO=1`) deja abrir las unidades con arte provisional, para probarlas antes de que llegue. */
export const SHOW_UNITS_WITHOUT_ART = process.env.EXPO_PUBLIC_DEMO === '1';

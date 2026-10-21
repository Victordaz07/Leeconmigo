/**
 * Arte del NÚCLEO de Kitewise (no de una materia): estrellas del cierre, sello del día, papalote, logros y Mi cuaderno. Todo recibido de Victor el 2026-10-21
 * (`docs/design/kitewise/PEDIDO-IMAGENES-K8.md`; manifiesto con el SHA-256 de los originales en `docs/design/kitewise/arte/manifest-k8.json`).
 * Solo decorado: los textos, los números y el estado de cada logro los dibuja la app.
 */
import type { ImageSourcePropType } from 'react-native';

export const STAR_IMAGES = {
  full: require('../assets/kitewise/stars/star_full.webp') as ImageSourcePropType,
  big: require('../assets/kitewise/stars/star_big.webp') as ImageSourcePropType,
  sleep: require('../assets/kitewise/stars/star_sleep.webp') as ImageSourcePropType,
};

export const STAMP_IMAGES = {
  daily: require('../assets/kitewise/stamps/stamp_daily.webp') as ImageSourcePropType,
  empty: require('../assets/kitewise/stamps/stamp_empty.webp') as ImageSourcePropType,
};

/** El papalote de Kitewise: sin cara. `idle` flota tranquilo (guía y ayuda); `cheer` sube con la cola ondeando (celebración). */
export const KITE_IMAGES = {
  idle: require('../assets/kitewise/kites/kite_idle.webp') as ImageSourcePropType,
  cheer: require('../assets/kitewise/kites/kite_cheer.webp') as ImageSourcePropType,
};

/** Un logro = una pegatina redonda. Las claves son las de `ACHIEVEMENTS` (`achievements.ts`). */
export const BADGE_IMAGES = {
  firstChapter: require('../assets/kitewise/badges/badge_first_chapter.webp') as ImageSourcePropType,
  explorer: require('../assets/kitewise/badges/badge_explorer.webp') as ImageSourcePropType,
  twoLanguages: require('../assets/kitewise/badges/badge_two_languages.webp') as ImageSourcePropType,
  real15: require('../assets/kitewise/badges/badge_real_15.webp') as ImageSourcePropType,
  cameBack: require('../assets/kitewise/badges/badge_came_back.webp') as ImageSourcePropType,
  adventurer: require('../assets/kitewise/badges/badge_adventurer.webp') as ImageSourcePropType,
  newWord: require('../assets/kitewise/badges/badge_new_word.webp') as ImageSourcePropType,
};

export const EMPTY_IMAGES = {
  notebook: require('../assets/kitewise/empty/empty_notebook.webp') as ImageSourcePropType,
  badges: require('../assets/kitewise/empty/empty_badges.webp') as ImageSourcePropType,
};

/** Hoja de cuaderno con renglones azul pálido y margen rosado (1024×1024). Se estira detrás del contenido de Mi cuaderno. */
export const NOTEBOOK_PAGE = require('../assets/kitewise/mats/mat_notebook_page.webp') as ImageSourcePropType;

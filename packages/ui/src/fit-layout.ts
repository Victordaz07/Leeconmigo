/**
 * Reparto de la pantalla en las páginas de cómic con globos dibujados: la ilustración se ve COMPLETA (sin recortes ni
 * "cámara"), pegada a la esquina superior derecha, y el resto de la pantalla lo ocupan una barra lateral izquierda (a lo alto
 * de toda la pantalla) y una barra inferior (bajo la ilustración). Se calcula según el tamaño disponible:
 *
 *    ┌──────┬────────────────────────┐
 *    │      │                        │
 *    │ lado │      ILUSTRACIÓN       │
 *    │      │                        │
 *    │      ├────────────────────────┤
 *    │      │     barra inferior     │
 *    └──────┴────────────────────────┘
 *
 * La ilustración es lo más grande posible dejando al menos `minSide` de ancho para la barra lateral y `minBottom` de alto
 * para la inferior; si la pantalla es más ancha o más alta de lo que la ilustración necesita, esas barras crecen.
 */

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FitLayoutInput {
  /** Tamaño disponible (px de diseño). */
  width: number;
  height: number;
  /** Proporción de la ilustración (1536 × 1024). */
  imageWidth: number;
  imageHeight: number;
  /** Mínimos de las barras. */
  minSide: number;
  minBottom: number;
  /**
   * Sin barra inferior que llenar (p. ej. "modo lectura libre"), pegar la ilustración arriba deja todo el hueco
   * sobrante como una franja vacía abajo. Centrarla reparte ese hueco arriba y abajo por igual, para que nunca
   * se vea como un panel vacío suelto.
   */
  centerVertically?: boolean;
}

export interface FitLayout {
  /** Píxeles de pantalla por píxel de la ilustración original. */
  scale: number;
  image: Box;
  side: Box;
  bottom: Box;
}

export const FIT_MIN_SIDE = 96;
export const FIT_MIN_BOTTOM = 104;

/**
 * "Modo lectura libre" (Modo padres): sin micrófono ni ayuda que mostrar, la barra inferior desaparece del
 * todo y el riel izquierdo se reduce a lo mínimo para solo los dos botones de página — la ilustración es lo
 * más grande posible, nunca tapada ni recortada por nada.
 */
export const FREE_MIN_SIDE = 84;
export const FREE_MIN_BOTTOM = 0;

export function fitLayout(i: FitLayoutInput): FitLayout {
  const scale = Math.max(0.01, Math.min((i.width - i.minSide) / i.imageWidth, (i.height - i.minBottom) / i.imageHeight));
  const w = Math.floor(i.imageWidth * scale);
  const h = Math.floor(i.imageHeight * scale);
  const y = i.centerVertically ? Math.round((i.height - h) / 2) : 0;
  return {
    scale: w / i.imageWidth,
    image: { x: i.width - w, y, width: w, height: h },
    side: { x: 0, y: 0, width: i.width - w, height: i.height },
    bottom: { x: i.width - w, y: y + h, width: w, height: i.height - (y + h) },
  };
}

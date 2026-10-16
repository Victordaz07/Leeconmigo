/**
 * Cómo se acomoda la app según la pantalla (docs/06 "orientación libre"; Kitewise G4–G6 vertical). Lógica pura: la app
 * nativa la usa con `useWindowDimensions`. Un teléfono es lo que tiene el lado corto menor de 600 dp; en vertical (de
 * cualquier tamaño) la navegación va abajo, como en el diseño G4.
 */

export const PHONE_MAX_SHORT_SIDE = 600;

export type NavStyle = 'rail' | 'railCompact' | 'bottom';

export interface Layout {
  width: number;
  height: number;
  portrait: boolean;
  /** Lado corto < 600 dp. */
  phone: boolean;
  /** Teléfono, o tablet en vertical: una sola columna en la mayoría de las pantallas. */
  narrow: boolean;
  /** Teléfono acostado: poca altura, todo debe caber o desplazarse. */
  short: boolean;
  nav: NavStyle;
  /** Margen lateral de las pantallas. */
  gutter: number;
}

export function layoutFor(width: number, height: number): Layout {
  const portrait = height >= width;
  const phone = Math.min(width, height) < PHONE_MAX_SHORT_SIDE;
  return {
    width,
    height,
    portrait,
    phone,
    narrow: width < 720,
    short: height < 520,
    nav: portrait ? 'bottom' : phone ? 'railCompact' : 'rail',
    gutter: width < 480 ? 16 : width < 900 ? 24 : 40,
  };
}

/** Cuántas columnas caben de algo que necesita al menos `minItem` de ancho. */
export function columnsFor(available: number, minItem: number, gap: number, max = 6): number {
  return Math.max(1, Math.min(max, Math.floor((available + gap) / (minItem + gap))));
}

/** Ancho de cada elemento en una cuadrícula de `cols` columnas. */
export function itemWidth(available: number, cols: number, gap: number): number {
  return Math.floor((available - gap * (cols - 1)) / cols);
}

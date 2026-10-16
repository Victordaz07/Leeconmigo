/**
 * Acomodo del texto dentro de una caja (los globos dibujados en la ilustración del cómic), SIN medir en pantalla.
 *
 * La app web mide con el navegador (`FitBox` de @lee-conmigo/ui). React Native no puede medir antes de pintar sin parpadeos,
 * así que aquí se calcula con los anchos reales de las letras de Andika (`generated/andika-metrics.ts`): qué letra es la MÁS
 * GRANDE con la que el texto cabe entero y en qué renglones queda cada palabra. La app nativa pinta exactamente esos renglones
 * (sin dejar que el sistema vuelva a cortar), así el resultado es el mismo en Android, iOS y en las pruebas.
 *
 * Mismas medidas que la web (`comic-fit.tsx`): interlineado 1,22; separación entre palabras 0,26 em; entre las líneas de un
 * cuadro (modo `lines`) 0,12 em extra.
 */
import { ANDIKA_REGULAR_WIDTHS } from './generated/andika-metrics.ts';

export const TEXT_LINE_HEIGHT = 1.22;
export const TEXT_WORD_GAP = 0.26;
export const TEXT_PARAGRAPH_GAP = 0.12;
/**
 * Margen de seguridad sobre el ancho medido (las fuentes se dibujan con pequeñas diferencias entre plataformas y aquí no se
 * aplica el "kerning"): mejor una letra apenas más chica que un renglón que no quepa.
 */
export const TEXT_WIDTH_SAFETY = 1.04;
/** Ancho de una letra que la tabla no tiene (promedio de Andika). */
const FALLBACK_EM = 0.55;

/** Ancho de una palabra en em con Andika Regular. */
export function measureWordEm(word: string, widths: Readonly<Record<string, number>> = ANDIKA_REGULAR_WIDTHS): number {
  let w = 0;
  for (const c of word) w += widths[c] ?? FALLBACK_EM;
  return w * TEXT_WIDTH_SAFETY;
}

/**
 * Tamaño más grande en [min, max] para el que `fits` es verdadero (búsqueda binaria, precisión de 0,5 px). Si ni el mínimo cabe,
 * devuelve el mínimo (el texto se verá justo, pero nunca más pequeño que eso); si el tope cabe, devuelve el tope.
 */
export function bestFontSize(fits: (px: number) => boolean, min: number, max: number): number {
  if (max <= min) return min;
  if (fits(max)) return max;
  if (!fits(min)) return min;
  let lo = min;
  let hi = max;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo * 2) / 2;
}

export interface TextRow {
  /** Índices (dentro de la lista plana de palabras recibida) de las palabras de este renglón, en orden. */
  words: number[];
  /** Párrafo (línea del cuadro) al que pertenece: el primer renglón de cada párrafo nuevo lleva el espacio extra. */
  paragraph: number;
}

export interface TextFit {
  /** Letra en px de pantalla. */
  fontSize: number;
  rows: TextRow[];
  /** No cabe ni con la letra mínima (o con la fija). */
  overflow: boolean;
  /** Alto total del texto (px). */
  height: number;
}

export interface TextFitInput {
  /** Palabras de cada párrafo (`lines`: una entrada por línea del cuadro; `flow`: una sola entrada con todo). */
  paragraphs: string[][];
  /** Caja disponible (px de pantalla). */
  width: number;
  height: number;
  minFont: number;
  maxFont: number;
  /** Letra fija (px de pantalla): no se busca el tamaño. */
  fixedFont?: number;
  /** Ancho de una palabra en em (por defecto, Andika Regular). */
  measure?: (word: string) => number;
}

/** Corta los párrafos en renglones para una letra dada (renglón voraz: entra la palabra si cabe; una palabra sola nunca se parte). */
function wrap(paragraphs: string[][], widthPx: number, font: number, measure: (w: string) => number) {
  const rows: TextRow[] = [];
  let maxRowPx = 0;
  let index = 0;
  paragraphs.forEach((words, paragraph) => {
    let row: number[] = [];
    let rowPx = 0;
    for (const word of words) {
      const wPx = measure(word) * font;
      const withGap = row.length ? rowPx + TEXT_WORD_GAP * font + wPx : wPx;
      if (row.length && withGap > widthPx) {
        rows.push({ words: row, paragraph });
        maxRowPx = Math.max(maxRowPx, rowPx);
        row = [index];
        rowPx = wPx;
      } else {
        row.push(index);
        rowPx = withGap;
      }
      index++;
    }
    if (row.length) {
      rows.push({ words: row, paragraph });
      maxRowPx = Math.max(maxRowPx, rowPx);
    }
  });
  const paragraphBreaks = Math.max(0, paragraphs.filter((p) => p.length).length - 1);
  const height = rows.length * TEXT_LINE_HEIGHT * font + paragraphBreaks * TEXT_PARAGRAPH_GAP * font;
  return { rows, height, maxRowPx };
}

export function fitText({ paragraphs, width, height, minFont, maxFont, fixedFont, measure = measureWordEm }: TextFitInput): TextFit {
  const fits = (font: number) => {
    const r = wrap(paragraphs, width, font, measure);
    return r.height <= height && r.maxRowPx <= width;
  };
  const fontSize = fixedFont ?? (width > 0 && height > 0 ? bestFontSize(fits, minFont, maxFont) : minFont);
  const r = wrap(paragraphs, width, fontSize, measure);
  return { fontSize, rows: r.rows, height: r.height, overflow: !(r.height <= height && r.maxRowPx <= width) };
}

/** ¿Todos los cuadros de la página tienen globo dibujado y caja de texto? Entonces el texto va dentro de los globos. */
export function isBalloonPage(page: { blocks: { layout?: { balloon?: unknown; text?: unknown } }[] }): boolean {
  return page.blocks.length > 0 && page.blocks.every((b) => !!b.layout?.balloon && !!b.layout.text);
}

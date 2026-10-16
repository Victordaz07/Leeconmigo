/**
 * Contextos de los ejercicios de grupos y reparto: qué se cuenta y dónde va (galletas en platos, lápices en cajas,
 * canicas en frascos, manzanas en canastas, plantas en parcelas). El dominio solo guarda la clave (`theme`); aquí están
 * las palabras con su género, para escribir frases naturales en español («cada caja» / «cada frasco», «cuántas» /
 * «cuántos») sin pegar pedazos que no concuerdan.
 */
import type { MathLang } from './math-copy.ts';

export type SharingTheme = 'cookies' | 'pencils' | 'marbles' | 'apples';
export type GroupsTheme = 'garden' | 'apples' | 'marbles';

export interface Word {
  es: [string, string];
  /** Femenino en español. */
  f: boolean;
  en: [string, string];
}

const W = (es1: string, es2: string, f: boolean, en1: string, en2: string): Word => ({ es: [es1, es2], f, en: [en1, en2] });

const ITEMS = {
  cookie: W('galleta', 'galletas', true, 'cookie', 'cookies'),
  pencil: W('lápiz', 'lápices', false, 'pencil', 'pencils'),
  marble: W('canica', 'canicas', true, 'marble', 'marbles'),
  apple: W('manzana', 'manzanas', true, 'apple', 'apples'),
  plant: W('planta', 'plantas', true, 'plant', 'plants'),
};

const BOXES = {
  plate: W('plato', 'platos', false, 'plate', 'plates'),
  bag: W('bolsa', 'bolsas', true, 'bag', 'bags'),
  box: W('caja', 'cajas', true, 'box', 'boxes'),
  jar: W('frasco', 'frascos', false, 'jar', 'jars'),
  basket: W('canasta', 'canastas', true, 'basket', 'baskets'),
  plot: W('parcela', 'parcelas', true, 'plot', 'plots'),
};

/** Lo que se cuenta y dónde va. `on`: en inglés se dice «on each plate» pero «in each box». */
export interface Nouns {
  item: Word;
  box: Word;
  on: boolean;
  /** El huerto conserva sus frases propias (plantar, cuadros de tierra). */
  garden: boolean;
}

export function sharingNouns(theme: SharingTheme | undefined, mode: 'partitive' | 'quotative'): Nouns {
  switch (theme ?? 'cookies') {
    case 'pencils':
      return { item: ITEMS.pencil, box: BOXES.box, on: false, garden: false };
    case 'marbles':
      return { item: ITEMS.marble, box: BOXES.jar, on: false, garden: false };
    case 'apples':
      return { item: ITEMS.apple, box: BOXES.basket, on: false, garden: false };
    default:
      return mode === 'partitive' ? { item: ITEMS.cookie, box: BOXES.plate, on: true, garden: false } : { item: ITEMS.cookie, box: BOXES.bag, on: false, garden: false };
  }
}

export function groupsNouns(theme: GroupsTheme | undefined): Nouns {
  switch (theme ?? 'garden') {
    case 'apples':
      return { item: ITEMS.apple, box: BOXES.basket, on: false, garden: false };
    case 'marbles':
      return { item: ITEMS.marble, box: BOXES.jar, on: false, garden: false };
    default:
      return { item: ITEMS.plant, box: BOXES.plot, on: false, garden: true };
  }
}

/** Singular o plural en el idioma pedido. */
export const word = (w: Word, lang: MathLang, n = 2) => w[lang][n === 1 ? 0 : 1];
/** Primera letra en mayúscula. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** Terminación que concuerda en español: `o(w)` → «o» / «a» (lleno/llena, otro/otra, uno/una, cuánto/cuánta). */
export const o = (w: Word) => (w.f ? 'a' : 'o');
/** Artículo determinado plural en español: los / las. */
export const los = (w: Word) => (w.f ? 'las' : 'los');
/** Artículo indeterminado en español: un / una. */
export const un = (w: Word) => (w.f ? 'una' : 'un');
/** Artículo indeterminado en inglés: a / an. */
export const a = (s: string) => (/^[aeiou]/i.test(s) ? `an ${s}` : `a ${s}`);

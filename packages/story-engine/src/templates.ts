/**
 * Plantillas de página de cómic: el contenido NO escribe coordenadas, solo elige una plantilla (`"template": "two-up"`) y el
 * motor las expande a `layout` (globo, caja del texto y encuadre) por cada bloque. Así quien genere las imágenes y los textos
 * no puede equivocarse con los números: las ilustraciones se dibujan con los globos VACÍOS en los rectángulos de abajo y el
 * texto se acomoda dentro, ocupando todo el espacio.
 *
 * Todas las medidas son píxeles de una ilustración de 1536 × 1024 (`TEMPLATE_CANVAS`). Cada "ranura" es un cuadro de la
 * página, en orden de lectura:
 *  - `panel`: el recorte de la ilustración que enfoca la cámara al leer ese cuadro (páginas sin modo "ajustado").
 *  - `balloon`: el globo VACÍO que la ilustración debe traer dibujado, BORDE INCLUIDO [x0, y0, x1, y1].
 *
 * De ahí se derivan el interior del globo (sin el borde) y la caja del texto (con un pequeño margen). Todo se puede afinar
 * después, globo por globo, con el modo editor (`layouts/<familia>.layout.json`).
 *
 * Los números salen del arte de "Mi mochila hace ¡achís!" (la primera historia hecha con estas plantillas), medidos sobre las
 * ilustraciones.
 */
import type { BlockLayout, LayoutFile, PageTemplate, PixelRect, Story, StoryPage } from '@lee-conmigo/contracts';

export const TEMPLATE_CANVAS = { width: 1536, height: 1024 } as const;
/** Grosor del borde oscuro del globo dibujado. */
export const BALLOON_BORDER_PX = 5;
/** Margen entre el interior del globo y la caja del texto. */
export const TEXT_INSET = { x: 16, y: 10 } as const;

export type Point = [number, number];

export interface TemplateSlot {
  /** Rectángulo que envuelve la viñeta (para las inclinadas, su caja envolvente). */
  panel: { x0: number; y0: number; x1: number; y1: number };
  /**
   * Forma REAL de la viñeta cuando no es un rectángulo (vértices en orden). Solo la usan la imagen guía y las pruebas: el motor
   * solo necesita saber dónde están los globos, así que las viñetas pueden ser diagonales sin cambiar nada más.
   */
  shape?: Point[];
  /** El globo es una EXPLOSIÓN (estrella) en lugar de un rectángulo redondeado: puede cruzar el borde de su viñeta. */
  burst?: boolean;
  balloon: [number, number, number, number];
  /** Caja del texto a medida (si no, la del globo con margen): p. ej. la de una explosión, que solo es útil en su centro. */
  textBox?: PixelRect;
  align?: 'left' | 'center' | 'right';
  /** Cómo se acomoda el texto por defecto: globos anchos y bajos → párrafo corrido; el resto, una frase por renglón. */
  textMode?: 'lines' | 'flow';
}

export const PAGE_TEMPLATES: Record<PageTemplate, { description: string; slots: TemplateSlot[] }> = {
  /** Dos viñetas arriba y una ancha abajo. Tres cuadros: arriba-izquierda, arriba-derecha, abajo. */
  'three-up': {
    description: 'Dos viñetas arriba (mitad izquierda y derecha) y una viñeta ancha abajo. 3 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 763, y1: 518 }, balloon: [27, 13, 747, 155] },
      { panel: { x0: 774, y0: 0, x1: 1536, y1: 518 }, balloon: [793, 11, 1511, 153] },
      { panel: { x0: 0, y0: 529, x1: 1536, y1: 1024 }, balloon: [25, 533, 1511, 645], textMode: 'flow' },
    ],
  },
  /** Dos viñetas altas, izquierda y derecha, con su globo arriba. Dos cuadros. */
  'two-up': {
    description: 'Dos viñetas altas, una a cada lado, cada una con su globo arriba. 2 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 765, y1: 1024 }, balloon: [25, 13, 749, 173] },
      { panel: { x0: 774, y0: 0, x1: 1536, y1: 1024 }, balloon: [787, 13, 1511, 173] },
    ],
  },
  /** Cuadrícula de 2 × 2 viñetas, cada una con su globo arriba. Cuatro cuadros, en orden de lectura: fila de arriba y luego la de abajo. */
  'four-up': {
    description: 'Cuadrícula de 2 × 2 viñetas, cada una con su globo arriba. 4 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 763, y1: 507 }, balloon: [22, 14, 741, 164] },
      { panel: { x0: 773, y0: 0, x1: 1536, y1: 507 }, balloon: [795, 14, 1514, 164] },
      { panel: { x0: 0, y0: 517, x1: 763, y1: 1024 }, balloon: [22, 531, 741, 681] },
      { panel: { x0: 773, y0: 517, x1: 1536, y1: 1024 }, balloon: [795, 531, 1514, 681] },
    ],
  },
  /** Cuadrícula de 3 × 2 viñetas con globos pequeños: para frases muy cortas, diálogos rápidos y onomatopeyas. Seis cuadros. */
  'six-up': {
    description: 'Cuadrícula de 3 × 2 viñetas con globos pequeños arriba de cada una (frases cortas). 6 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 505, y1: 507 }, balloon: [20, 14, 485, 164], textMode: 'flow' },
      { panel: { x0: 515, y0: 0, x1: 1020, y1: 507 }, balloon: [535, 14, 1000, 164], textMode: 'flow' },
      { panel: { x0: 1030, y0: 0, x1: 1536, y1: 507 }, balloon: [1050, 14, 1516, 164], textMode: 'flow' },
      { panel: { x0: 0, y0: 517, x1: 505, y1: 1024 }, balloon: [20, 531, 485, 681], textMode: 'flow' },
      { panel: { x0: 515, y0: 517, x1: 1020, y1: 1024 }, balloon: [535, 531, 1000, 681], textMode: 'flow' },
      { panel: { x0: 1030, y0: 517, x1: 1536, y1: 1024 }, balloon: [1050, 531, 1516, 681], textMode: 'flow' },
    ],
  },
  /** Página de LIBRO: la ilustración arriba y, debajo, una banda de texto grande (no tapa el dibujo). Un cuadro. */
  'book-1': {
    description: 'Ilustración arriba y una banda ancha de texto grande debajo (estilo libro ilustrado). 1 cuadro.',
    slots: [{ panel: { x0: 0, y0: 0, x1: 1536, y1: 700 }, balloon: [20, 712, 1516, 1004], textMode: 'flow' }],
  },
  /** Página de LIBRO con dos ilustraciones y su texto debajo de cada una. Dos cuadros. */
  'book-2': {
    description: 'Dos ilustraciones lado a lado, cada una con su banda de texto grande debajo. 2 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 763, y1: 700 }, balloon: [20, 712, 743, 1004], textMode: 'flow' },
      { panel: { x0: 773, y0: 0, x1: 1536, y1: 700 }, balloon: [793, 712, 1516, 1004], textMode: 'flow' },
    ],
  },
  /** Página de LIBRO con tres columnas: una ilustración y su texto debajo en cada una. Tres cuadros. */
  'book-3': {
    description: 'Tres columnas, cada una con su ilustración y su banda de texto debajo. 3 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 505, y1: 660 }, balloon: [16, 672, 489, 1008], textMode: 'flow' },
      { panel: { x0: 515, y0: 0, x1: 1020, y1: 660 }, balloon: [531, 672, 1004, 1008], textMode: 'flow' },
      { panel: { x0: 1030, y0: 0, x1: 1536, y1: 660 }, balloon: [1046, 672, 1520, 1008], textMode: 'flow' },
    ],
  },
  /** Dos viñetas separadas por una diagonal (como un corte de cómic). Dos cuadros. */
  'slant-2': {
    description: 'Dos viñetas separadas por una diagonal casi vertical. 2 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 806, y1: 1024 }, shape: [[0, 0], [806, 0], [730, 1024], [0, 1024]], balloon: [20, 14, 740, 164] },
      { panel: { x0: 748, y0: 0, x1: 1536, y1: 1024 }, shape: [[824, 0], [1536, 0], [1536, 1024], [748, 1024]], balloon: [850, 14, 1516, 164] },
    ],
  },
  /** Una viñeta ancha arriba y dos abajo, con las divisiones en diagonal. Tres cuadros. */
  'slant-3': {
    description: 'Una viñeta ancha arriba y dos abajo, con las divisiones inclinadas. 3 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 1536, y1: 552 }, shape: [[0, 0], [1536, 0], [1536, 462], [0, 552]], balloon: [22, 14, 1514, 164], textMode: 'flow' },
      { panel: { x0: 0, y0: 526, x1: 756, y1: 1024 }, shape: [[0, 570], [756, 526], [700, 1024], [0, 1024]], balloon: [20, 596, 690, 746] },
      { panel: { x0: 718, y0: 480, x1: 1536, y1: 1024 }, shape: [[774, 525], [1536, 480], [1536, 1024], [718, 1024]], balloon: [800, 572, 1516, 722] },
    ],
  },
  /** Dos escenas separadas por un divisor en forma de RAYO (tormenta, susto, golpe). Dos cuadros. */
  'bolt-2': {
    description: 'Dos escenas separadas por un divisor en forma de rayo: la de arriba a la izquierda y la de abajo a la derecha. 2 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 1536, y1: 688 }, shape: [[0, 0], [1536, 0], [1536, 388], [720, 638], [620, 548], [0, 688]], balloon: [22, 14, 740, 164] },
      { panel: { x0: 0, y0: 412, x1: 1536, y1: 1024 }, shape: [[0, 712], [620, 572], [720, 662], [1536, 412], [1536, 1024], [0, 1024]], balloon: [800, 856, 1514, 1004] },
    ],
  },
  /** Página estilo MANGA: seis viñetas en tres filas con las divisiones inclinadas. Seis cuadros. */
  'manga-6': {
    description: 'Seis viñetas en tres filas con las divisiones inclinadas (estilo manga). 6 cuadros.',
    slots: [
      { panel: { x0: 0, y0: 0, x1: 716, y1: 340 }, shape: [[0, 0], [716, 0], [646, 340], [0, 340]], balloon: [20, 14, 660, 164] },
      { panel: { x0: 666, y0: 0, x1: 1536, y1: 340 }, shape: [[736, 0], [1536, 0], [1536, 340], [666, 340]], balloon: [770, 14, 1516, 164] },
      { panel: { x0: 0, y0: 356, x1: 556, y1: 690 }, shape: [[0, 356], [516, 356], [556, 690], [0, 690]], balloon: [20, 372, 470, 522], textMode: 'flow' },
      { panel: { x0: 536, y0: 356, x1: 1536, y1: 690 }, shape: [[536, 356], [1536, 356], [1536, 690], [576, 690]], balloon: [610, 372, 1516, 522] },
      { panel: { x0: 0, y0: 706, x1: 896, y1: 1024 }, shape: [[0, 706], [896, 706], [836, 1024], [0, 1024]], balloon: [20, 722, 820, 872] },
      { panel: { x0: 856, y0: 706, x1: 1536, y1: 1024 }, shape: [[916, 706], [1536, 706], [1536, 1024], [856, 1024]], balloon: [930, 722, 1516, 872], textMode: 'flow' },
    ],
  },
  /** Dos viñetas apiladas con una EXPLOSIÓN en el centro que es el globo del primer cuadro (¡Pum!, ¡Zas!). Dos cuadros. */
  'burst-2': {
    description: 'Dos viñetas apiladas con una explosión en el centro que es el globo del primer cuadro (texto muy corto) y un globo abajo a la derecha. 2 cuadros.',
    slots: [
      // La explosión: texto de 1–3 palabras, centrado, en la caja inscrita en su círculo interior (radio ~0,72 del de sus puntas).
      { panel: { x0: 0, y0: 0, x1: 1536, y1: 470 }, burst: true, balloon: [598, 318, 938, 658], textBox: { x: 673, y: 423, width: 190, height: 130 }, align: 'center', textMode: 'flow' },
      { panel: { x0: 0, y0: 506, x1: 1536, y1: 1024 }, balloon: [816, 856, 1514, 1004] },
    ],
  },
  /** Una sola escena a página completa, con el globo ancho arriba. Un cuadro. */
  full: {
    description: 'Una escena a página completa con un globo ancho arriba. 1 cuadro.',
    slots: [{ panel: { x0: 0, y0: 0, x1: 1536, y1: 1024 }, balloon: [25, 13, 1511, 195], textMode: 'flow' }],
  },
};

export const TEMPLATE_NAMES = Object.keys(PAGE_TEMPLATES) as PageTemplate[];

/** La forma de la viñeta como polígono: su `shape`, o su rectángulo si no lo tiene. */
export function slotPolygon(s: TemplateSlot): Point[] {
  if (s.shape) return s.shape;
  const { x0, y0, x1, y1 } = s.panel;
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}

/** ¿El punto está dentro del polígono? (regla par-impar) */
export function pointInPolygon([px, py]: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const pct = (n: number, total: number) => Math.round((n / total) * 10000) / 100;
const rectOf = ([x0, y0, x1, y1]: [number, number, number, number]): PixelRect => ({ x: x0, y: y0, width: x1 - x0, height: y1 - y0 });

/** El globo dibujado (borde incluido) → la caja del texto: quita el borde y deja un margen. */
export function textBoxOf(balloon: PixelRect): PixelRect {
  const dx = BALLOON_BORDER_PX + TEXT_INSET.x;
  const dy = BALLOON_BORDER_PX + TEXT_INSET.y;
  return { x: balloon.x + dx, y: balloon.y + dy, width: Math.max(1, balloon.width - 2 * dx), height: Math.max(1, balloon.height - 2 * dy) };
}

/** El `bubble` (% de la ilustración) que se deriva de una caja de texto (lo usan las páginas sin globos dibujados). */
export function bubbleOf(text: PixelRect): BlockLayout['bubble'] {
  return { leftPct: pct(text.x, TEMPLATE_CANVAS.width), topPct: pct(text.y, TEMPLATE_CANVAS.height), widthPct: pct(text.width, TEMPLATE_CANVAS.width) };
}

/** El `layout` de cada cuadro de una plantilla. */
export function templateLayouts(template: PageTemplate): BlockLayout[] {
  return PAGE_TEMPLATES[template].slots.map((s) => {
    const balloon = rectOf(s.balloon);
    const text = s.textBox ?? textBoxOf(balloon);
    return { bubble: bubbleOf(text), panel: { ...s.panel }, balloon, text, align: s.align ?? 'left', valign: 'middle', textMode: s.textMode ?? 'lines' };
  });
}

/**
 * Expande las plantillas de una página: cada bloque recibe su `layout`. Una página sin `template` no cambia. Si la plantilla
 * no existe, si el número de cuadros no coincide con sus ranuras o si algún bloque ya trae `layout`, NO se expande y
 * `validateStory` lo reporta (nunca se adivina).
 */
export function expandPage(page: StoryPage): StoryPage {
  const t = page.template && PAGE_TEMPLATES[page.template];
  if (!t || t.slots.length !== page.blocks.length || page.blocks.some((b) => b.layout)) return page;
  const layouts = templateLayouts(page.template!);
  // La plantilla ya cumplió su función: la página expandida solo lleva los `layout` resultantes.
  const { template: _expanded, ...rest } = page;
  return { ...rest, blocks: page.blocks.map((b, i) => ({ ...b, layout: layouts[i] })) };
}

/**
 * Aplica a una historia los ajustes del modo editor (`LayoutFile`), que ganan a la plantilla. Solo afecta a bloques con globo
 * dibujado; lo que no esté en el archivo queda como estaba. `fontPx` de la variante > `fontPx` común > letra automática.
 */
export function applyLayoutFile(story: Story, file: LayoutFile | undefined): Story {
  if (!file) return story;
  const family = story.familyId ?? story.id;
  if (file.familyId !== family) return story;
  return {
    ...story,
    pages: story.pages.map((page) => {
      const pageFile = file.pages[page.id];
      if (!pageFile) return page;
      return {
        ...page,
        blocks: page.blocks.map((b) => {
          const o = pageFile.blocks[b.id];
          if (!o || !b.layout?.balloon) return b;
          const text = o.text ?? b.layout.text;
          const layout: BlockLayout = { ...b.layout, ...(o.balloon ? { balloon: o.balloon } : {}), ...(text ? { text, bubble: bubbleOf(text) } : {}) };
          if (o.align) layout.align = o.align;
          if (o.valign) layout.valign = o.valign;
          if (o.textMode) layout.textMode = o.textMode;
          if (o.maxFontPx !== undefined) layout.maxFontPx = o.maxFontPx;
          const fixed = o.fontPxByVariant?.[story.id] ?? o.fontPx;
          if (fixed !== undefined) layout.fontPx = fixed;
          return { ...b, layout };
        }),
      };
    }),
  };
}

/** La historia con todas sus plantillas expandidas y, si hay, los ajustes del editor (lo que carga la app). */
export function expandStory(story: Story, layoutFile?: LayoutFile): Story {
  return applyLayoutFile({ ...story, pages: story.pages.map(expandPage) }, layoutFile);
}

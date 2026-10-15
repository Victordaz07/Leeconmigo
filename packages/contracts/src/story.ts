/**
 * Esquema de historias (docs/01-PRODUCT-RULES.md, docs/05-DESIGN-SYSTEM.md).
 * Reglas: arte y texto SIEMPRE separados (el texto es dato de la app, nunca parte de la imagen);
 * multi-idioma desde el inicio; nada hardcodeado (historias, idiomas, grados).
 */

export type LanguageCode = 'es' | 'en';

/**
 * Audiencia del prototipo de Reading Session. TEMPORAL: docs/09-OPEN-DECISIONS.md #5 sigue sin
 * decidir si esto se queda o se reconcilia con los 6 niveles / 3 bandas visuales.
 */
export type Audience = 'explorador' | 'lector';

export interface IllustrationRef {
  /** Ruta relativa a los assets de la app. */
  src: string;
  width: number;
  height: number;
  alt?: string;
}

/**
 * Diseño de un bloque de texto sobre la ilustración (solo en páginas tipo cómic). Una página SIN `layout` en
 * sus bloques es una página de texto: el texto se lee en el panel lateral y la ilustración va sola.
 */
/** Rectángulo en PÍXELES de la ilustración original (1536 × 1024), desde su esquina superior izquierda. */
export interface PixelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TextAlign = 'left' | 'center' | 'right';
export type TextVAlign = 'top' | 'middle' | 'bottom';
/** `lines`: cada frase (línea) en su renglón. `flow`: todo el cuadro como un párrafo corrido (aprovecha mejor las cajas anchas y bajas). */
export type TextMode = 'lines' | 'flow';

export interface BlockLayout {
  /** Globo de texto, en % de la ilustración. */
  bubble: { leftPct: number; topPct: number; widthPct: number };
  /** Recorte (píxeles de la ilustración) que la "cámara" enfoca al leer este bloque. */
  panel: { x0: number; y0: number; x1: number; y1: number };
  /**
   * Globo YA DIBUJADO en la ilustración (con su borde). Si existe, la página es de "globos dibujados": el texto va DIRECTO en
   * el globo (sin caja encima) y este rectángulo solo sirve para resaltar el cuadro que se lee.
   */
  balloon?: PixelRect;
  /** Caja donde se acomoda el texto (dentro del globo). Por defecto, el interior del globo. */
  text?: PixelRect;
  /** Tamaño de letra fijo, en píxeles de la ilustración original. Sin él, la letra se ajusta sola para llenar la caja. */
  fontPx?: number;
  /** Tope de la letra cuando se ajusta sola (evita letras gigantes con textos muy cortos). */
  maxFontPx?: number;
  align?: TextAlign;
  valign?: TextVAlign;
  textMode?: TextMode;
}

/**
 * Ajustes hechos con el modo editor para los cuadros de una familia de historias (todas sus variantes de idioma y nivel
 * comparten cajas de texto). Viven en su propio archivo (`layouts/<familyId>.layout.json`) y ganan a los valores de la plantilla.
 */
export interface BlockLayoutOverride {
  text?: PixelRect;
  balloon?: PixelRect;
  align?: TextAlign;
  valign?: TextVAlign;
  textMode?: TextMode;
  maxFontPx?: number;
  /** Letra fija para TODAS las variantes; sin él, se ajusta sola. */
  fontPx?: number;
  /** Letra fija solo para una variante (clave = id de la historia); gana a `fontPx`. */
  fontPxByVariant?: Record<string, number>;
}

export interface LayoutFile {
  familyId: string;
  version: 1;
  pages: Record<string, { blocks: Record<string, BlockLayoutOverride> }>;
}

export interface StoryTextBlock {
  id: string;
  /** Solo informativo (voz narrativa o diálogo); la UI no depende de esto. */
  voice?: 'narration' | 'dialogue';
  /** Nombre corto del cuadro / escena ("La puerta azul"). */
  title: string;
  /** Líneas de texto del bloque (narración y diálogo). */
  lines: string[];
  layout?: BlockLayout;
}

export interface CheckpointOption {
  text: string;
  /** Imagen propia de la opción (formato para lectores pequeños), si existe. */
  image?: string;
  /**
   * Recorte [x, y, ancho, alto] de la ilustración de la página que representa la opción.
   * Permite opciones con imagen SIN assets extra (arte y texto separados, docs/05).
   */
  imageRegion?: [number, number, number, number];
}

export interface CheckpointVariant {
  audience: Audience;
  prompt: string;
  options: CheckpointOption[];
  correctIndex: number;
  correctFeedback: string;
  /** Pista o invitación a reintentar. Nunca "Incorrecto" (docs/06). */
  retryFeedback: string;
}

export interface ComprehensionCheckpoint {
  id: string;
  variants: CheckpointVariant[];
}

/**
 * Distribución fija de una página de cómic (globos y encuadres): el contenido elige el nombre y el motor pone las
 * coordenadas, así el contenido nunca lleva números. Ver `PAGE_TEMPLATES` en story-engine.
 */
export type PageTemplate =
  | 'full' | 'two-up' | 'three-up' | 'four-up' | 'six-up' | 'book-1' | 'book-2' | 'book-3'
  // Dinámicas (viñetas inclinadas, rayo, explosión): la forma de las viñetas vive solo en la ilustración.
  | 'slant-2' | 'slant-3' | 'bolt-2' | 'manga-6' | 'burst-2';

export interface StoryPage {
  id: string;
  illustration: IllustrationRef;
  /**
   * Opcional. Con `template`, los cuadros NO llevan `layout` (lo pone el motor) y su número debe coincidir con las ranuras de la
   * plantilla. Sin `template` ni `layout`, la página es de solo texto.
   */
  template?: PageTemplate;
  blocks: StoryTextBlock[];
  checkpoint?: ComprehensionCheckpoint;
}

export interface VocabularyEntry {
  syllables?: string[];
  definition?: string;
  synonym?: string;
  /** Frase corta que muestra la palabra en una situación de la vida real, fuera del cuento (pedido de Noah). */
  example?: string;
  /** Recorte [x, y, ancho, alto] de la ilustración que representa la palabra (modal de ayuda). */
  illustrationRegion?: [number, number, number, number];
}

/**
 * Lo que elige el padre para el niño: en qué idioma lee y a qué nivel de la app. TEMPORAL: docs/09 #3 sigue sin decidir
 * el modelo de niveles (elección del padre vs. desbloqueo por progreso).
 */
export interface ReadingProfile {
  language: LanguageCode;
  level: number;
}

export interface Story {
  /** Único en toda la biblioteca. Una variante de idioma/nivel suele ser `<familia>-<idioma>-n<nivel>`. */
  id: string;
  /**
   * Agrupa las VARIANTES de una misma historia (idioma × nivel) que comparten arte, páginas y cuadros (docs/01: el
   * arte se reutiliza entre niveles e idiomas; solo cambia el texto). Sin `familyId`, la historia es su propia familia.
   */
  familyId?: string;
  language: LanguageCode;
  title: string;
  /** Nivel de lectura de la app (el padre lo elige; NO depende del grado escolar: docs/01). */
  level: number;
  description?: string;
  /**
   * Categoría editorial de la historia (amistad, misterio, ciencia-ficción, oficios, fantasía, crecimiento…),
   * igual en todas las variantes de idioma/nivel de una familia. Solo alimenta el logro "Aventurero" (docs/01:
   * leer 5 categorías distintas) — no hay una lista cerrada todavía, cada historia real trae la suya.
   */
  category?: string;
  /** true = contenido de prueba para desarrollo (no se lista fuera de `npm run dev`). */
  dev?: boolean;
  /** Portada para Home / ficha de la historia. */
  cover?: IllustrationRef;
  /**
   * Dónde está lo importante de la portada, en % (x, y desde arriba a la izquierda), para el recorte panorámico del banner de
   * Inicio. Con `heroFocus` el banner usa la portada; sin él, un recorte de la primera página (el de la historia piloto).
   */
  heroFocus?: { x: number; y: number };
  /** Palabras base del repaso final cuando el niño no acumuló suficientes. */
  reviewWords?: string[];
  pages: StoryPage[];
  /** Clave = palabra en minúsculas CON acentos y sin puntuación. */
  vocabulary: Record<string, VocabularyEntry>;
}

/** Ficha resumida de una historia para listas (Inicio, biblioteca). Se deriva de la historia, no se escribe a mano. */
export interface StoryCatalogEntry {
  id: string;
  /** `familyId` de la historia (o su propio `id` si no tiene). */
  familyId: string;
  language: LanguageCode;
  title: string;
  level: number;
  description?: string;
  category?: string;
  cover?: IllustrationRef;
  pageCount: number;
  /** Total de "cuadros" (bloques de texto) de todas las páginas. */
  blockCount: number;
  wordCount: number;
  /** Historia de prueba solo para desarrollo: no se muestra a los niños. */
  dev?: boolean;
}

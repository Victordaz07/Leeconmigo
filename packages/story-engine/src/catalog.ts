/**
 * Catálogo de historias: de dónde salen y cómo se listan. Las historias son DATOS (JSON); agregar una no
 * requiere tocar componentes (docs/02, regla 9: no hardcodear historias). Hoy se empaquetan con la app;
 * más adelante llegarán como paquetes de contenido descargables (docs/02, "Descarga de contenido") detrás
 * de la misma interfaz `StoryRepository`.
 */
import type { LayoutFile, ReadingProfile, Story, StoryCatalogEntry } from '@lee-conmigo/contracts';
import { parseLayoutFile } from './layout-file.ts';
import { expandStory } from './templates.ts';
import { tokenizePage } from './tokenize.ts';
import { validateStory } from './validate.ts';

/** Ficha resumida de una historia para listas. Se deriva de la historia, no se escribe a mano. */
export function toCatalogEntry(story: Story): StoryCatalogEntry {
  return {
    id: story.id,
    familyId: story.familyId ?? story.id,
    language: story.language,
    title: story.title,
    level: story.level,
    description: story.description,
    category: story.category,
    cover: story.cover,
    pageCount: story.pages.length,
    blockCount: story.pages.reduce((n, p) => n + p.blocks.length, 0),
    wordCount: story.pages.reduce((n, p) => n + tokenizePage(p).length, 0),
    dev: story.dev,
  };
}

/**
 * Una tarjeta por HISTORIA (familia), no por variante: de cada familia se elige la variante del idioma del perfil y del
 * nivel más cercano a su nivel (a igual distancia, el más fácil). Un niño que lee en español no ve historias en inglés
 * (docs/01); solo si no hay NINGUNA en su idioma se muestran todas, para no dejar la pantalla vacía. Conserva el orden
 * en que aparece cada familia.
 */
export function pickVariants(entries: StoryCatalogEntry[], profile: ReadingProfile): StoryCatalogEntry[] {
  const inLanguage = entries.filter((e) => e.language === profile.language);
  const pool = inLanguage.length > 0 ? inLanguage : entries;
  const best = new Map<string, StoryCatalogEntry>();
  for (const e of pool) {
    const cur = best.get(e.familyId);
    const closer = !cur || Math.abs(e.level - profile.level) < Math.abs(cur.level - profile.level) || (Math.abs(e.level - profile.level) === Math.abs(cur.level - profile.level) && e.level < cur.level);
    if (closer) best.set(e.familyId, e);
  }
  return [...best.values()];
}

/** Cuántos "cuadros" (bloques de texto) hay en las páginas anteriores a `pageIndex`. */
export function blocksBeforePage(story: Story, pageIndex: number): number {
  return story.pages.slice(0, Math.max(0, pageIndex)).reduce((n, p) => n + p.blocks.length, 0);
}

export interface StoryRepository {
  /** Fichas de todas las historias disponibles, en el orden en que se registraron. */
  list(): StoryCatalogEntry[];
  get(id: string): Story | undefined;
  /**
   * Lo que necesita el modo editor: las historias de una familia TAL COMO SE ESCRIBIERON (sin plantillas expandidas ni ajustes
   * aplicados) y el archivo de ajustes guardado. Un repositorio que no edita puede no implementarlas.
   */
  sourcesOfFamily?(familyId: string): Story[];
  layoutFileOf?(familyId: string): LayoutFile | undefined;
}

export class InMemoryStoryRepository implements StoryRepository {
  private readonly byId = new Map<string, Story>();
  private readonly sources = new Map<string, Story>();
  private readonly layouts = new Map<string, LayoutFile>();

  /** `sources`: las mismas historias sin expandir (para el editor); `layouts`: archivos de ajustes por familia. */
  constructor(stories: Story[] = [], sources: Story[] = stories, layouts: LayoutFile[] = []) {
    for (const s of stories) this.byId.set(s.id, s);
    for (const s of sources) this.sources.set(s.id, s);
    for (const l of layouts) this.layouts.set(l.familyId, l);
  }

  sourcesOfFamily(familyId: string): Story[] {
    return [...this.sources.values()].filter((s) => (s.familyId ?? s.id) === familyId);
  }

  layoutFileOf(familyId: string): LayoutFile | undefined {
    return this.layouts.get(familyId);
  }

  /**
   * Un repositorio NUEVO con otro archivo de ajustes para una familia (o sin él, con `undefined`): las historias se vuelven a
   * expandir desde su origen. Así el modo editor deja la app al día al guardar, sin recargar.
   */
  withLayoutFile(familyId: string, file: LayoutFile | undefined): InMemoryStoryRepository {
    const layouts = new Map(this.layouts);
    if (file && Object.keys(file.pages).length) layouts.set(familyId, file);
    else layouts.delete(familyId);
    const sources = [...this.sources.values()];
    const stories = sources.map((s) => expandStory(s, layouts.get(s.familyId ?? s.id)));
    return new InMemoryStoryRepository(stories, sources, [...layouts.values()]);
  }

  list(): StoryCatalogEntry[] {
    return [...this.byId.values()].map(toCatalogEntry);
  }

  get(id: string): Story | undefined {
    return this.byId.get(id);
  }
}

/** Historia recibida como dato sin tipar (JSON de disco, de un paquete descargado o generado con GPT). */
export function parseStory(json: unknown, layoutFile?: LayoutFile): { story: Story; problems: string[] } | { story: null; problems: string[] } {
  const o = json as Partial<Story> | null;
  if (!o || typeof o !== 'object' || typeof o.id !== 'string' || !Array.isArray(o.pages) || typeof o.vocabulary !== 'object' || o.vocabulary === null) {
    return { story: null, problems: ['no tiene la forma de una historia (faltan id, pages o vocabulary)'] };
  }
  // Se valida lo que escribió el autor y se entrega la historia con las plantillas ya expandidas (lo que carga la app).
  return { story: expandStory(o as Story, layoutFile), problems: validateStory(o as Story) };
}

/**
 * Arma un repositorio con las historias válidas. Las inválidas NO se cargan (una historia rota no debe
 * tumbar la app ni llegar al niño) y se reportan con `onInvalid`. `layouts` son los archivos de ajustes del modo editor (uno por
 * familia); uno inválido se ignora (la plantilla manda) y se reporta.
 */
export function buildRepository(sources: unknown[], onInvalid: (id: string, problems: string[]) => void = () => {}, layouts: unknown[] = []): InMemoryStoryRepository {
  const layoutByFamily = new Map<string, LayoutFile>();
  for (const l of layouts) {
    const parsed = parseLayoutFile(l);
    if (parsed.file) layoutByFamily.set(parsed.file.familyId, parsed.file);
    else onInvalid(`layout:${(l as { familyId?: string } | null)?.familyId ?? '(sin familia)'}`, parsed.problems);
  }
  const valid: Story[] = [];
  const validSources: Story[] = [];
  const seen = new Set<string>();
  for (const src of sources) {
    const fam = (src as { familyId?: string; id?: string } | null);
    const { story, problems } = parseStory(src, layoutByFamily.get(fam?.familyId ?? fam?.id ?? ''));
    if (story && problems.length === 0 && seen.has(story.id)) onInvalid(story.id, ['id repetido: ya hay otra historia con este id (las variantes de idioma/nivel necesitan ids distintos)']);
    else if (story && problems.length === 0) {
      seen.add(story.id);
      valid.push(story);
      validSources.push(src as Story);
    } else onInvalid((src as { id?: string } | null)?.id ?? '(sin id)', problems);
  }
  return new InMemoryStoryRepository(valid, validSources, [...layoutByFamily.values()]);
}

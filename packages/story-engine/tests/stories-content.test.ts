/**
 * Control de calidad del CONTENIDO: recorre TODOS los `.json` de `stories/<idioma>/` y comprueba que cumplen el
 * esquema y las reglas (`validateStory`) y que las imágenes que citan existen en `apps/reader/public/` con las
 * medidas que declaran. Sirve para dar por buena (o rechazar) una historia nueva —también una generada con GPT /
 * DALL·E— antes de que llegue a un niño: `npm run stories:check`.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import type { IllustrationRef, LayoutFile, Story } from '@lee-conmigo/contracts';
import { PAGE_TEMPLATES, TEMPLATE_NAMES, parseStory, toCatalogEntry, validateLayoutFile } from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const storiesDir = join(here, '..', 'stories');
const publicDir = join(here, '..', '..', '..', 'apps', 'reader', 'public');

const files = readdirSync(storiesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(storiesDir, d.name)).filter((f) => f.endsWith('.json')).map((f) => ({ lang: d.name, file: f, path: join(storiesDir, d.name, f) })));

type Region = [number, number, number, number];
const insideOf = (ref: IllustrationRef, [x, y, w, h]: Region) => x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= ref.width && y + h <= ref.height;

async function checkImage(ref: IllustrationRef, where: string): Promise<string[]> {
  const path = join(publicDir, ref.src);
  if (!existsSync(path)) return [`${where}: no existe la imagen "${ref.src}" en apps/reader/public/`];
  const meta = await sharp(path).metadata();
  if (meta.width !== ref.width || meta.height !== ref.height) return [`${where}: "${ref.src}" mide ${meta.width}×${meta.height} y el JSON declara ${ref.width}×${ref.height}`];
  return [];
}

describe('contenido de las historias empaquetadas', () => {
  it('hay al menos una historia', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const f of files) {
    describe(`${f.lang}/${f.file}`, () => {
      const json = JSON.parse(readFileSync(f.path, 'utf8'));

      it('cumple el esquema y las reglas (arte/texto separados, sin "Incorrecto", sílabas coherentes...)', () => {
        const { story, problems } = parseStory(json);
        expect(story).not.toBeNull();
        expect(problems).toEqual([]);
      });

      it('el nombre del archivo es el id, y la carpeta es el idioma', () => {
        expect(basename(f.file, '.json')).toBe(json.id);
        expect(f.lang).toBe(json.language);
      });

      it('las imágenes existen y miden lo que declara el JSON', async () => {
        const { story } = parseStory(json);
        const refs: Array<[IllustrationRef, string]> = [];
        if (story?.cover) refs.push([story.cover, 'portada']);
        story?.pages.forEach((p) => refs.push([p.illustration, `${p.id}/ilustración`]));
        const problems = (await Promise.all(refs.map(([r, w]) => checkImage(r, w)))).flat();
        expect(problems).toEqual([]);
      });

      it('las opciones con imagen propia y los recortes caen dentro de la ilustración', () => {
        const { story } = parseStory(json);
        const problems: string[] = [];
        for (const p of story?.pages ?? []) {
          const { width, height } = p.illustration;
          for (const v of p.checkpoint?.variants ?? []) {
            v.options.forEach((o, i) => {
              if (o.imageRegion && !insideOf(p.illustration, o.imageRegion)) problems.push(`${p.id}/${p.checkpoint?.id}/${v.audience}/opción ${i + 1}: imageRegion fuera de la ilustración`);
              if (o.image && !existsSync(join(publicDir, o.image))) problems.push(`${p.id}/${p.checkpoint?.id}/${v.audience}/opción ${i + 1}: no existe "${o.image}"`);
            });
          }
          for (const b of p.blocks) {
            const l = b.layout;
            if (l && (l.panel.x0 < 0 || l.panel.y0 < 0 || l.panel.x1 > width || l.panel.y1 > height || l.panel.x1 <= l.panel.x0 || l.panel.y1 <= l.panel.y0)) problems.push(`${p.id}/${b.id}: panel fuera de la ilustración`);
            if (l && (l.bubble.leftPct < 0 || l.bubble.topPct < 0 || l.bubble.widthPct <= 0 || l.bubble.leftPct + l.bubble.widthPct > 100 || l.bubble.topPct > 100)) problems.push(`${p.id}/${b.id}: globo fuera de la ilustración`);
          }
        }
        // El recorte de una palabra debe caber en la ilustración de alguna página (no sabemos en cuál aparece).
        for (const [key, v] of Object.entries(story?.vocabulary ?? {})) {
          if (v.illustrationRegion && !story?.pages.some((pg) => insideOf(pg.illustration, v.illustrationRegion!))) problems.push(`vocabulario "${key}": illustrationRegion fuera de las ilustraciones`);
        }
        expect(problems).toEqual([]);
      });

      it('la ficha del catálogo se deriva sin errores', () => {
        const { story } = parseStory(json);
        const entry = toCatalogEntry(story!);
        expect(entry.pageCount).toBeGreaterThan(0);
        expect(entry.wordCount).toBeGreaterThan(0);
      });
    });
  }
});

describe('el control de calidad detecta contenido roto', () => {
  it('imagen ausente o con otras medidas que las declaradas', async () => {
    expect(await checkImage({ src: 'stories/no-existe/x.webp', width: 10, height: 10 }, 'x')).toHaveLength(1);
    const { story } = parseStory(JSON.parse(readFileSync(files[0].path, 'utf8')));
    const cover = story!.cover!;
    expect(await checkImage(cover, 'portada')).toEqual([]);
    expect((await checkImage({ ...cover, width: cover.width + 1 }, 'portada'))[0]).toMatch(/mide/);
  });

  it('un recorte fuera de la ilustración', () => {
    const ref = { src: 'x', width: 100, height: 100 };
    expect(insideOf(ref, [0, 0, 100, 100])).toBe(true);
    expect(insideOf(ref, [50, 50, 60, 10])).toBe(false);
    expect(insideOf(ref, [-1, 0, 10, 10])).toBe(false);
  });
});

describe('familias de variantes: mismo arte, mismas páginas y cuadros', () => {
  interface Loaded { file: string; story: Story }
  const stories: Loaded[] = files.map((f) => ({ file: `${f.lang}/${f.file}`, story: JSON.parse(readFileSync(f.path, 'utf8')) as Story }));
  const families = new Map<string, Loaded[]>();
  for (const l of stories) families.set(l.story.familyId ?? l.story.id, [...(families.get(l.story.familyId ?? l.story.id) ?? []), l]);
  const multi = [...families.entries()].filter(([, v]) => v.length > 1);

  it('los ids son únicos en toda la biblioteca', () => {
    const ids = stories.map((l) => l.story.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('hay al menos una familia con varias variantes (idioma × nivel)', () => {
    expect(multi.length).toBeGreaterThan(0);
  });

  for (const [family, variants] of multi) {
    describe(`familia ${family} (${variants.length} variantes)`, () => {
      const [first, ...rest] = variants;
      /** Lo que debe ser IDÉNTICO entre variantes: el arte, las páginas, los cuadros y dónde va cada globo. */
      const skeleton = (s: Story) => s.pages.map((p) => ({ id: p.id, template: p.template, src: p.illustration.src, size: [p.illustration.width, p.illustration.height], checkpoint: p.checkpoint?.id, blocks: p.blocks.map((b) => ({ id: b.id, layout: b.layout })) }));

      it('no repite (idioma, nivel)', () => {
        const keys = variants.map((v) => `${v.story.language}/${v.story.level}`);
        expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
      });

      it('todas comparten páginas, cuadros, ilustraciones y globos (para poder cambiar de idioma/nivel y retomar en la misma página)', () => {
        for (const v of rest) expect(skeleton(v.story), `${v.file} vs ${first.file}`).toEqual(skeleton(first.story));
      });

      it('las páginas con pregunta son las mismas en todas las variantes y cada una trae las dos audiencias', () => {
        // Excepto en historias de desarrollo (`dev: true`, nunca llegan a un niño): una muestra de estilo, por
        // ejemplo, puede no traer preguntas todavía a propósito.
        if (first.story.dev) return;
        const withQuestion = (s: Story) => s.pages.filter((p) => p.checkpoint).map((p) => p.id);
        expect(withQuestion(first.story).length, `${first.file} no tiene ninguna pregunta`).toBeGreaterThan(0);
        for (const v of variants) {
          expect(withQuestion(v.story), `${v.file} vs ${first.file}`).toEqual(withQuestion(first.story));
          for (const p of v.story.pages.filter((x) => x.checkpoint)) expect(p.checkpoint!.variants.map((x) => x.audience).sort(), `${v.file}/${p.id}`).toEqual(['explorador', 'lector']);
        }
      });
    });
  }
});

describe('las plantillas coinciden con el arte entregado de Mi mochila hace ¡achís!', () => {
  it('los globos expandidos caen a menos de 1,5 puntos (%) de los medidos sobre las ilustraciones', () => {
    const measured = JSON.parse(readFileSync(join(here, '..', '..', '..', 'content', 'mi-mochila-hace-achis', 'layout.json'), 'utf8')) as { pages: Array<{ id: string; blocks: Array<{ id: string; textRectPct: { leftPct: number; topPct: number; widthPct: number } }> }> };
    const { story } = parseStory(JSON.parse(readFileSync(join(storiesDir, 'es', 'mi-mochila-hace-achis-es-n1.json'), 'utf8')));
    const off: string[] = [];
    for (const page of story!.pages) {
      for (const b of page.blocks) {
        const m = measured.pages.find((x) => x.id === page.id)!.blocks.find((x) => x.id === b.id)!.textRectPct;
        const got = b.layout!.bubble;
        for (const k of ['leftPct', 'topPct', 'widthPct'] as const) if (Math.abs(got[k] - m[k]) > 1.5) off.push(`${b.id}.${k}: plantilla ${got[k]} vs arte ${m[k]}`);
      }
    }
    expect(off).toEqual([]);
  });
});

describe('la guía de contenido: rectángulos de los globos', () => {
  it('las tablas de la guía coinciden con las plantillas del motor (no se desalinean)', () => {
    const guide = readFileSync(join(here, '..', '..', '..', 'content', 'GUIA-DE-CONTENIDO.md'), 'utf8');
    // Rectángulos en negrita de las tablas: **[x0, y0, x1, y1]** ("." = corchete, para no depender de escapes).
    const inGuide = [...guide.matchAll(/[*][*].([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+).[*][*]/g)].map((m) => m.slice(1).map(Number).join(','));
    const inEngine = TEMPLATE_NAMES.flatMap((n) => PAGE_TEMPLATES[n].slots.map((slot) => slot.balloon.join(',')));
    expect([...inGuide].sort()).toEqual([...inEngine].sort());
  });
});

describe('la guía de contenido', () => {
  it('su ejemplo de JSON es una historia válida (la guía no se desalinea del validador)', () => {
    const guide = readFileSync(join(here, '..', '..', '..', 'content', 'GUIA-DE-CONTENIDO.md'), 'utf8');
    const fence = '`'.repeat(3);
    const start = guide.indexOf(`${fence}json\n`) + `${fence}json\n`.length;
    const example = guide.slice(start, guide.indexOf(`\n${fence}`, start));
    expect(example.startsWith('{')).toBe(true);
    const { story, problems } = parseStory(JSON.parse(example));
    expect(story?.id).toBe('el-faro-de-mateo-es-n1');
    expect(problems).toEqual([]);
  });
});

describe('ajustes guardados por el modo editor (layouts/*.layout.json)', () => {
  const layoutsDir = join(storiesDir, '..', 'layouts');
  const layoutFiles = existsSync(layoutsDir) ? readdirSync(layoutsDir).filter((f) => f.endsWith('.layout.json')) : [];
  const allStories = files.map((f) => JSON.parse(readFileSync(f.path, 'utf8')) as Story);

  it('es válido no tener ninguno (manda la plantilla)', () => {
    expect(Array.isArray(layoutFiles)).toBe(true);
  });

  for (const name of layoutFiles) {
    describe(name, () => {
      const json = JSON.parse(readFileSync(join(layoutsDir, name), 'utf8')) as LayoutFile;

      it('cumple el formato y el nombre del archivo es la familia', () => {
        expect(validateLayoutFile(json)).toEqual([]);
        expect(name).toBe(`${json.familyId}.layout.json`);
      });

      it('la familia existe y sus páginas y cuadros existen en TODAS sus variantes, con globo dibujado', () => {
        const members = allStories.filter((s) => (s.familyId ?? s.id) === json.familyId);
        expect(members.length, `no hay historias de la familia ${json.familyId}`).toBeGreaterThan(0);
        const problems: string[] = [];
        for (const [pageId, page] of Object.entries(json.pages)) {
          for (const blockId of Object.keys(page.blocks)) {
            for (const s of members) {
              const p = s.pages.find((x) => x.id === pageId);
              const b = p?.blocks.find((x) => x.id === blockId);
              if (!p || !b) problems.push(`${s.id}: no existe ${pageId}/${blockId}`);
              else if (!p.template) problems.push(`${s.id}: ${pageId} no tiene plantilla (globos dibujados): los ajustes no se aplicarían`);
            }
          }
        }
        expect(problems).toEqual([]);
      });

      it('las letras fijas por variante apuntan a variantes que existen', () => {
        const ids = new Set(allStories.filter((s) => (s.familyId ?? s.id) === json.familyId).map((s) => s.id));
        const bad: string[] = [];
        for (const [pageId, page] of Object.entries(json.pages)) {
          for (const [blockId, o] of Object.entries(page.blocks)) for (const v of Object.keys(o.fontPxByVariant ?? {})) if (!ids.has(v)) bad.push(`${pageId}/${blockId}: variante "${v}" no existe`);
        }
        expect(bad).toEqual([]);
      });

      it('al aplicarlos, la historia sigue siendo válida', () => {
        for (const s of allStories.filter((x) => (x.familyId ?? x.id) === json.familyId)) {
          const { problems } = parseStory(s, json);
          expect(problems).toEqual([]);
        }
      });
    });
  }
});

describe('«La noche sin luces» (prueba de estrés): conserva su forma', () => {
  const variants = files
    .filter((f) => f.file.startsWith('la-noche-sin-luces-'))
    .map((f) => ({ file: `${f.lang}/${f.file}`, story: JSON.parse(readFileSync(f.path, 'utf8')) as Story }));

  it('hay 6 variantes (es/en × niveles 1–3)', () => {
    expect(variants.map((v) => `${v.story.language}${v.story.level}`).sort()).toEqual(['en1', 'en2', 'en3', 'es1', 'es2', 'es3']);
  });

  it.each(variants.map((v) => [v.file, v.story] as const))('%s: 14 páginas, 40 cuadros, las 13 plantillas una vez, p08 sin plantilla y 7 preguntas', (_file, story) => {
    expect(story.pages).toHaveLength(14);
    expect(story.pages.reduce((n, p) => n + p.blocks.length, 0)).toBe(40);
    expect(story.pages.flatMap((p) => p.blocks.map((b) => b.id))).toEqual(Array.from({ length: 40 }, (_, i) => `b${String(i + 1).padStart(2, '0')}`));
    const templates = story.pages.filter((p) => p.template).map((p) => p.template!);
    expect([...templates].sort()).toEqual([...TEMPLATE_NAMES].sort());
    expect(story.pages.find((p) => p.id === 'p08')?.template).toBeUndefined();
    expect(story.pages.filter((p) => p.checkpoint).map((p) => `${p.id}:${p.checkpoint!.id}`)).toEqual(['p02:q01', 'p05:q02', 'p06:q03', 'p08:q04', 'p10:q05', 'p12:q06', 'p14:q07']);
  });

  it('el estribillo aparece 5 veces por variante y la última cambia el final', () => {
    for (const { file, story } of variants) {
      const all = story.pages.flatMap((p) => p.blocks.flatMap((b) => b.lines.map((l) => ({ b: b.id, l }))));
      const refrain = all.filter((x) => /^(Una luz, dos luces|One light, two lights)/.test(x.l));
      expect(refrain.length, `${file}: estribillo`).toBe(5);
      expect(refrain.at(-1)!.b).toBe('b40');
      const firstFour = new Set(refrain.slice(0, 4).map((x) => x.l));
      expect(firstFour.size, `${file}: las 4 primeras apariciones son idénticas`).toBe(1);
      expect(refrain.at(-1)!.l, `${file}: la última es distinta`).not.toBe([...firstFour][0]);
    }
  });
});

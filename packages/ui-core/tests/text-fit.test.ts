import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildRepository } from '@lee-conmigo/story-engine';
import { ANDIKA_REGULAR_WIDTHS } from '../src/generated/andika-metrics.ts';
import { bestFontSize, fitText, isBalloonPage, measureWordEm, TEXT_LINE_HEIGHT } from '../src/index.ts';

const root = (p: string) => fileURLToPath(new URL(`../../../${p}`, import.meta.url));
const readJsonDir = (dir: string) => readdirSync(root(dir)).map((f) => JSON.parse(readFileSync(root(`${dir}/${f}`), 'utf8')));
const sources = readdirSync(root('packages/story-engine/stories')).flatMap((lang) => readJsonDir(`packages/story-engine/stories/${lang}`));
const repo = buildRepository(sources, () => {}, readJsonDir('packages/story-engine/layouts'));

describe('fitText', () => {
  it('elige la letra más grande con la que todo cabe, y la corta en renglones sin partir palabras', () => {
    const fit = fitText({ paragraphs: [['La', 'luna', 'miró', 'la', 'puerta', 'azul.']], width: 200, height: 120, minFont: 10, maxFont: 80 });
    expect(fit.overflow).toBe(false);
    expect(fit.fontSize).toBeGreaterThan(10);
    expect(fit.height).toBeLessThanOrEqual(120);
    expect(fit.rows.flatMap((r) => r.words)).toEqual([0, 1, 2, 3, 4, 5]);
    // Con un punto más de letra ya no cabría (es el máximo, no uno cualquiera).
    const bigger = fitText({ paragraphs: [['La', 'luna', 'miró', 'la', 'puerta', 'azul.']], width: 200, height: 120, minFont: 10, maxFont: 80, fixedFont: fit.fontSize + 1 });
    expect(bigger.overflow).toBe(true);
  });

  it('en modo "lines" cada línea del cuadro empieza renglón nuevo', () => {
    const fit = fitText({ paragraphs: [['¡Hola!'], ['¿Vienes?']], width: 400, height: 400, minFont: 10, maxFont: 30 });
    expect(fit.rows.map((r) => r.paragraph)).toEqual([0, 1]);
  });

  it('con letra fija no busca tamaño y avisa si no cabe', () => {
    const fit = fitText({ paragraphs: [['palabra', 'larga', 'que', 'no', 'cabe']], width: 50, height: 20, minFont: 10, maxFont: 40, fixedFont: 30 });
    expect(fit.fontSize).toBe(30);
    expect(fit.overflow).toBe(true);
  });

  it('respeta el tope: un texto corto no se vuelve gigante', () => {
    expect(fitText({ paragraphs: [['Sí.']], width: 600, height: 600, minFont: 10, maxFont: 40 }).fontSize).toBe(40);
  });

  it('bestFontSize: búsqueda binaria dentro de [min, max]', () => {
    expect(bestFontSize((px) => px <= 23.3, 10, 50)).toBe(23);
    expect(bestFontSize(() => false, 10, 50)).toBe(10);
  });
});

describe('la biblioteca real', () => {
  const stories = repo.list().map((e) => repo.get(e.id)!);

  it('cada letra de cada historia tiene su ancho medido (si no, correr scripts/gen-font-metrics.mjs)', () => {
    const missing = new Set<string>();
    for (const s of stories) for (const p of s.pages) for (const b of p.blocks) for (const l of b.lines) for (const c of l) if (c !== ' ' && ANDIKA_REGULAR_WIDTHS[c] === undefined) missing.add(c);
    expect([...missing]).toEqual([]);
  });

  it('el texto de los globos dibujados cabe en una tablet (ilustración a 1180 px de ancho)', () => {
    const scale = 1180 / 1536;
    let blocks = 0;
    const overflow: string[] = [];
    for (const s of stories) {
      for (const p of s.pages) {
        if (!isBalloonPage(p)) continue;
        for (const b of p.blocks) {
          const l = b.layout!;
          const words = b.lines.map((line) => line.split(' ').filter(Boolean));
          const fit = fitText({
            paragraphs: l.textMode === 'flow' ? [words.flat()] : words,
            width: l.text!.width * scale,
            height: l.text!.height * scale,
            minFont: 12,
            maxFont: (l.maxFontPx ?? 56) * scale,
            fixedFont: l.fontPx !== undefined ? l.fontPx * scale : undefined,
          });
          blocks++;
          if (fit.overflow) overflow.push(`${s.id}/${p.id}/${b.id} (${fit.fontSize}px)`);
        }
      }
    }
    expect(blocks).toBeGreaterThan(1000);
    // Igual que en la web: unos pocos cuadros con letra fija elegida en el editor pueden quedar justos. Si este número
    // sube, una historia nueva trae un globo demasiado chico para su texto.
    expect(overflow.length, overflow.slice(0, 10).join('\n')).toBeLessThanOrEqual(Math.ceil(blocks * 0.01));
  });
});

it('measureWordEm suma los anchos de Andika (con margen de seguridad)', () => {
  expect(measureWordEm('aa')).toBeCloseTo(2 * ANDIKA_REGULAR_WIDTHS.a * 1.04, 4);
  expect(TEXT_LINE_HEIGHT).toBe(1.22);
});

// @vitest-environment jsdom
/**
 * Páginas con globos dibujados: cada plantilla (1 a 6 cuadros, cómic y libro) se dibuja con el texto de TODOS sus cuadros dentro de
 * su caja, y el reparto de la pantalla (`fitLayout`) deja la ilustración completa arriba a la derecha con las barras que sobran.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createSessionState } from '@lee-conmigo/reading-engine';
import { parseStory, tokenizePage } from '@lee-conmigo/story-engine';
import devPlantillas from '../../story-engine/stories/es/dev-plantillas.json';
import { ComicFitLayer, isBalloonPage } from '../src/comic-fit.tsx';
import { FIT_MIN_BOTTOM, FIT_MIN_SIDE, fitLayout } from '../src/fit-layout.ts';
import { defaultPrefs } from '../src/types.ts';

afterEach(cleanup);

const { story } = parseStory(devPlantillas);
const pages = story!.pages;

describe('ComicFitLayer con todas las plantillas', () => {
  it.each(pages.map((p, i) => [i + 1, p.blocks.length, p] as const))('página %i (%i cuadro(s)): todos los cuadros se dibujan con su texto', (_n, count, page) => {
    expect(isBalloonPage(page)).toBe(true);
    const words = tokenizePage(page);
    const { container } = render(
      <ComicFitLayer page={page} words={words} reading={createSessionState(words.length)} screen="select" prefs={defaultPrefs} currentBlock={0} highlightActive inSession={false} width={1200} height={800} />,
    );
    const blocks = [...container.querySelectorAll('[data-block]')];
    expect(blocks).toHaveLength(count);
    expect(blocks.map((b) => b.getAttribute('data-block'))).toEqual(page.blocks.map((b) => b.id));
    // Todas las palabras de la página están en pantalla, una vez cada una.
    expect(container.querySelectorAll('[data-block] span')).toHaveLength(words.length);
  });
});

describe('fitLayout: la ilustración completa arriba a la derecha; lo que sobra, para las barras', () => {
  const base = { imageWidth: 1536, imageHeight: 1024, minSide: FIT_MIN_SIDE, minBottom: FIT_MIN_BOTTOM };

  it.each([
    ['tablet 3:2 (1508×996)', 1508, 996],
    ['16:10 (1508×942)', 1508, 942],
    ['4:3 (1508×1131)', 1508, 1131],
    ['muy ancha (1508×940)', 1508, 940],
    ['muy alta (1508×1180)', 1508, 1180],
  ])('%s: mantiene la proporción, cabe entera y respeta los mínimos de las barras', (_n, width, height) => {
    const L = fitLayout({ width, height, ...base });
    expect(Math.abs(L.image.width / L.image.height - 1536 / 1024)).toBeLessThan(0.01);
    expect(L.image.x + L.image.width).toBe(width); // pegada a la derecha
    expect(L.image.y).toBe(0); // pegada arriba
    expect(L.side.width).toBeGreaterThanOrEqual(FIT_MIN_SIDE - 1);
    expect(L.bottom.height).toBeGreaterThanOrEqual(FIT_MIN_BOTTOM - 1);
    expect(L.side.width + L.image.width).toBe(width);
    expect(L.image.height + L.bottom.height).toBe(height);
    expect(L.scale).toBeCloseTo(L.image.width / 1536, 3);
  });

  it('una pantalla alta deja una barra inferior más grande; una ancha, una barra lateral más ancha', () => {
    const tall = fitLayout({ width: 1508, height: 1131, ...base });
    const wide = fitLayout({ width: 1508, height: 942, ...base });
    expect(tall.bottom.height).toBeGreaterThan(wide.bottom.height);
    expect(wide.side.width).toBeGreaterThan(tall.side.width);
  });
});

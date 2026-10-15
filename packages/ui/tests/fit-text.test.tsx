import { describe, expect, it } from 'vitest';
import { FIT_SLACK_PX, bestFontSize, contentFits } from '../src/fit-text';

describe('contentFits: holgura de 1–2 px en el ancho', () => {
  const box = { height: 105, width: 1263 };

  it('acepta un contenido que mide 1 px más de ancho (márgenes negativos de las palabras)', () => {
    expect(contentFits({ height: 29, scrollWidth: 1264 }, box)).toBe(true);
    expect(contentFits({ height: 29, scrollWidth: 1263 + FIT_SLACK_PX }, box)).toBe(true);
  });

  it('rechaza un desborde real de ancho o de alto', () => {
    expect(contentFits({ height: 29, scrollWidth: 1263 + FIT_SLACK_PX + 1 }, box)).toBe(false);
    expect(contentFits({ height: 106, scrollWidth: 1200 }, box)).toBe(false);
  });
});

describe('bestFontSize con un cuadro largo (p05 de «La noche sin luces», N3)', () => {
  // Cuadro de 1263 × 105 px con ~317 caracteres. A la letra mínima (12 px) el navegador midió scrollWidth = 1264 (1 px de más).
  const box = { height: 105, width: 1263 };
  const chars = 317;
  const measure = (px: number) => {
    const perLine = Math.floor(box.width / (px * 0.5));
    const lines = Math.ceil(chars / perLine);
    return { height: Math.round(lines * px * 1.22), scrollWidth: px <= 12 ? 1264 : 1263 };
  };

  it('sin holgura, la letra mínima "no cabía" y el ajuste se quedaba en el mínimo (el fallo original)', () => {
    const strict = (px: number) => measure(px).height <= box.height && measure(px).scrollWidth <= box.width;
    expect(bestFontSize(strict, 12, 40)).toBe(12);
  });

  it('con holgura, usa una letra mucho mayor que el mínimo', () => {
    const fits = (px: number) => contentFits(measure(px), box);
    const best = bestFontSize(fits, 12, 40);
    expect(best).toBeGreaterThanOrEqual(20);
    expect(fits(best)).toBe(true);
  });
});

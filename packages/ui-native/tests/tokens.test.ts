import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { gradientPoints } from '../src/gradient-points.ts';
import { colors, darkColors, gradients, minTouch, sizes } from '../src/tokens.ts';

/** La app web y la nativa tienen que verse igual: cada token de `tokens.css` debe existir aquí con el mismo valor. */
const css = readFileSync(fileURLToPath(new URL('../../ui/src/styles/tokens.css', import.meta.url)), 'utf8');
const camel = (name: string) => name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

describe('tokens nativos = tokens.css', () => {
  it('tiene todos los colores con el mismo valor', () => {
    const cssColors = [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)];
    expect(cssColors.length).toBeGreaterThan(50);
    for (const [, name, value] of cssColors) {
      expect(colors[camel(name) as keyof typeof colors], `--color-${name}`).toBe(value.toLowerCase());
    }
  });

  it('tiene todos los degradados lineales de colores sólidos con el mismo ángulo y colores', () => {
    const cssGradients = [...css.matchAll(/--grad-([a-z0-9-]+):\s*linear-gradient\((\d+)deg,\s*([^;]*)\);/g)].filter(([, , , body]) => !/rgb|transparent/.test(body));
    expect(cssGradients.length).toBeGreaterThan(30);
    for (const [, name, angle, body] of cssGradients) {
      const g = gradients[camel(name) as keyof typeof gradients];
      expect(g, `--grad-${name}`).toBeDefined();
      expect(g.angle).toBe(Number(angle));
      expect([...g.colors]).toEqual([...body.matchAll(/#[0-9a-fA-F]+/g)].map((m) => m[0].toLowerCase()));
    }
  });
});

describe('tokens nativos = tokens de Kitewise (docs/design/kitewise/tokens.css, D9)', () => {
  const kw = readFileSync(fileURLToPath(new URL('../../../docs/design/kitewise/tokens.css', import.meta.url)), 'utf8');
  const theme = kw.slice(0, kw.indexOf(":root[data-theme='dark']"));
  const dark = kw.slice(kw.indexOf(":root[data-theme='dark']"), kw.indexOf('@media'));

  it('colores y degradados de materias, momentos, dominio, papel y pausa', () => {
    const cssColors = [...theme.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)];
    expect(cssColors.length).toBeGreaterThan(20);
    for (const [, name, value] of cssColors) expect(colors[camel(name) as keyof typeof colors], `--color-${name}`).toBe(value.toLowerCase());
    for (const [, name, angle, body] of theme.matchAll(/--grad-([a-z0-9-]+):\s*linear-gradient\((\d+)deg,\s*([^;]*)\);/g)) {
      const g = gradients[camel(name) as keyof typeof gradients];
      expect(g, `--grad-${name}`).toBeDefined();
      expect(g.angle).toBe(Number(angle));
      expect([...g.colors]).toEqual([...body.matchAll(/#[0-9a-fA-F]+/g)].map((m) => m[0].toLowerCase()));
    }
  });

  it('modo oscuro y tamaños táctiles', () => {
    for (const [, name, value] of dark.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
      expect(darkColors[camel(name) as keyof typeof darkColors], `oscuro --color-${name}`).toBe(value.toLowerCase());
    }
    expect(minTouch).toBe(Number(/--size-btn-min:\s*(\d+)px/.exec(theme)![1]));
    expect(sizes.btnPrimary).toBe(Number(/--size-btn-primary:\s*(\d+)px/.exec(theme)![1]));
  });
});

describe('gradientPoints', () => {
  it('convierte ángulos CSS a los puntos de expo-linear-gradient', () => {
    expect(gradientPoints(180)).toEqual({ start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } });
    expect(gradientPoints(90)).toEqual({ start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } });
    expect(gradientPoints(0)).toEqual({ start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } });
  });
});

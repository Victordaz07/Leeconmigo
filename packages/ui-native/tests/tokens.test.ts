import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { gradientPoints } from '../src/gradient-points.ts';
import { colors, gradients } from '../src/tokens.ts';

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

describe('gradientPoints', () => {
  it('convierte ángulos CSS a los puntos de expo-linear-gradient', () => {
    expect(gradientPoints(180)).toEqual({ start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } });
    expect(gradientPoints(90)).toEqual({ start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } });
    expect(gradientPoints(0)).toEqual({ start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } });
  });
});

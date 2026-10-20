import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** El arte de Arte y música recibido (docs/design/artes/arte/manifest-*.json): cada imagen del manifiesto existe, pesa poco y se ve en miniatura. */
describe('arte de Arte y música', () => {
  const manifest = JSON.parse(readFileSync(new URL('../../../docs/design/artes/arte/manifest-lote-a.json', import.meta.url), 'utf8')) as {
    source: string;
    sha256: string;
    output: string;
    outputBytes: number;
    width: number;
    height: number;
  }[];

  it('el Lote A trae las siete imágenes pedidas', () => {
    expect(manifest.map((m) => m.source.replace('.png', '')).sort()).toEqual(
      ['bg_arte_pintura_horizontal', 'bg_arte_pintura_vertical', 'bg_arte_ritmo_horizontal', 'bg_arte_ritmo_vertical', 'cover_a1_u04', 'cover_arte_cuaderno', 'hero_arte_inicio'].sort(),
    );
  });

  it('cada imagen existe en la app, pesa menos de 350 KB y tiene el tamaño esperado', () => {
    for (const m of manifest) {
      const path = new URL(`../../../${m.output}`, import.meta.url);
      expect(existsSync(path), m.output).toBe(true);
      expect(statSync(path).size, m.output).toBe(m.outputBytes);
      expect(m.outputBytes, m.output).toBeLessThan(350 * 1024);
      expect(m.sha256).toMatch(/^[0-9a-f]{64}$/);
      const vertical = m.source.endsWith('_vertical.png');
      expect([m.width, m.height], m.source).toEqual(vertical ? [1024, 1536] : [1536, 1024]);
    }
  });
});

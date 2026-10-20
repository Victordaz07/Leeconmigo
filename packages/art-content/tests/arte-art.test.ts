import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** El arte de Arte y música recibido (docs/design/artes/arte/manifest-*.json): cada imagen del manifiesto existe, pesa poco y tiene el tamaño esperado. */
interface Entry {
  source: string;
  sha256: string;
  output: string;
  outputBytes: number;
  width: number;
  height: number;
}
const load = (lote: string): Entry[] => JSON.parse(readFileSync(new URL(`../../../docs/design/artes/arte/manifest-${lote}.json`, import.meta.url), 'utf8')) as Entry[];
const names = (m: Entry[]) => m.map((e) => e.source.replace('.png', '')).sort();

describe('arte de Arte y música', () => {
  const a = load('lote-a');
  const b = load('lote-b');
  const c = load('lote-c');

  it('el Lote A trae las siete imágenes pedidas', () => {
    expect(names(a)).toEqual(
      ['bg_arte_pintura_horizontal', 'bg_arte_pintura_vertical', 'bg_arte_ritmo_horizontal', 'bg_arte_ritmo_vertical', 'cover_a1_u04', 'cover_arte_cuaderno', 'hero_arte_inicio'].sort(),
    );
  });

  it('el Lote B trae los instrumentos (falta `snd_pisada`: llegó cortada y hay que volver a generarla)', () => {
    expect(names(b)).toEqual(
      ['snd_bajo', 'snd_bloque', 'snd_bombo', 'snd_bongo', 'snd_caja', 'snd_campanita', 'snd_chasquido', 'snd_claves', 'snd_cuerda', 'snd_marimba', 'snd_palmas', 'snd_sonaja', 'snd_tom', 'snd_triangulo', 'snd_voz'].sort(),
    );
  });

  it('el Lote C trae los ocho objetos de pintura', () => {
    expect(names(c)).toEqual(['prop_bote_pintura', 'prop_esponja', 'prop_goma', 'prop_paleta', 'prop_pincel_fino', 'prop_pincel_grueso', 'prop_pincel_medio', 'prop_vaso_agua'].sort());
  });

  it('cada imagen existe en la app, pesa menos de 350 KB y tiene el tamaño esperado', () => {
    for (const m of [...a, ...b, ...c]) {
      const path = new URL(`../../../${m.output}`, import.meta.url);
      expect(existsSync(path), m.output).toBe(true);
      expect(statSync(path).size, m.output).toBe(m.outputBytes);
      expect(m.outputBytes, m.output).toBeLessThan(350 * 1024);
      expect(m.sha256).toMatch(/^[0-9a-f]{64}$/);
      const object = m.source.startsWith('snd_') || m.source.startsWith('prop_');
      const vertical = m.source.endsWith('_vertical.png');
      expect([m.width, m.height], m.source).toEqual(object ? [512, 512] : vertical ? [1024, 1536] : [1536, 1024]);
    }
  });
});

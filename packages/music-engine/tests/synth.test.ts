import { describe, expect, it } from 'vitest';
import { LAYERS, PEAK, SAMPLE_RATE_DEFAULT, allTimbres, grave, palmas, sonaja, voz } from '../src/index.ts';

describe('timbres sintetizados', () => {
  it('hay un timbre por capa, con muestras y sin sobrepasar el pico', () => {
    const all = allTimbres();
    for (const layer of LAYERS) {
      const b = all[layer];
      expect(b.length, layer).toBeGreaterThan(SAMPLE_RATE_DEFAULT * 0.1);
      let max = 0;
      for (const v of b) {
        expect(Number.isFinite(v)).toBe(true);
        max = Math.max(max, Math.abs(v));
      }
      expect(max, layer).toBeGreaterThan(PEAK * 0.95);
      expect(max, layer).toBeLessThanOrEqual(PEAK + 1e-6);
    }
  });

  it('siempre suenan igual (sin azar) y terminan en silencio, sin clic', () => {
    for (const make of [grave, palmas, sonaja, voz]) {
      const a = make();
      const b = make();
      expect(Array.from(a.slice(0, 200))).toEqual(Array.from(b.slice(0, 200)));
      expect(Math.abs(a[a.length - 1])).toBeLessThan(0.01);
    }
  });

  it('cambian con la frecuencia de muestreo manteniendo la misma duración', () => {
    const a = grave(44100);
    const b = grave(48000);
    expect(a.length / 44100).toBeCloseTo(b.length / 48000, 2);
  });

  it('los cuatro timbres son distintos entre sí', () => {
    const t = allTimbres();
    const sig = (b: Float32Array) => Array.from(b.slice(100, 140)).map((v) => v.toFixed(3)).join();
    expect(new Set(LAYERS.map((l) => sig(t[l]))).size).toBe(4);
  });
});

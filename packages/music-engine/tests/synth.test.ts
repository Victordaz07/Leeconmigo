import { describe, expect, it } from 'vitest';
import { PEAK, SAMPLE_RATE_DEFAULT, SOUND_IDS, allSounds, makeSound, type SoundId } from '../src/index.ts';

const zeroCrossings = (b: Float32Array, from = 0, to = b.length) => {
  let n = 0;
  for (let i = from + 1; i < to; i++) if (b[i - 1] < 0 !== b[i] < 0) n++;
  return n;
};
/** Frecuencia fundamental por autocorrelación en la ventana [from, to] segundos, buscando entre `minF` y `maxF` Hz. */
function fundamental(b: Float32Array, from: number, to: number, minF: number, maxF: number): number {
  const sr = SAMPLE_RATE_DEFAULT;
  const x = b.slice(Math.round(from * sr), Math.round(to * sr));
  let best = 0;
  let bestLag = 0;
  for (let lag = Math.floor(sr / maxF); lag <= Math.ceil(sr / minF); lag++) {
    let sum = 0;
    for (let i = 0; i + lag < x.length; i++) sum += x[i] * x[i + lag];
    if (sum > best) {
      best = sum;
      bestLag = lag;
    }
  }
  return sr / bestLag;
}

/** La frecuencia con más energía en la ventana [from, to] (barrido de Fourier cada 1 Hz): sirve para campanas, que tienen parciales inarmónicos. */
function strongest(b: Float32Array, from: number, to: number, minF: number, maxF: number): number {
  const sr = SAMPLE_RATE_DEFAULT;
  const x = b.slice(Math.round(from * sr), Math.round(to * sr));
  let best = 0;
  let bestF = minF;
  for (let f = minF; f <= maxF; f += 1) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < x.length; i++) {
      const ph = (2 * Math.PI * f * i) / sr;
      re += x[i] * Math.cos(ph);
      im += x[i] * Math.sin(ph);
    }
    const mag = re * re + im * im;
    if (mag > best) {
      best = mag;
      bestF = f;
    }
  }
  return bestF;
}

/** Frecuencia aproximada por cruces por cero en los primeros `ms` milisegundos. */
const pitch = (b: Float32Array, ms = 60) => {
  const to = Math.round((SAMPLE_RATE_DEFAULT * ms) / 1000);
  return zeroCrossings(b, 0, to) / 2 / (ms / 1000);
};

describe('catálogo de 16 sonidos sintetizados', () => {
  const all = allSounds();

  it('hay 16 sonidos distintos, cada uno con muestras finitas y sin sobrepasar el pico', () => {
    expect(SOUND_IDS).toHaveLength(16);
    for (const id of SOUND_IDS) {
      const b = all[id];
      expect(b.length, id).toBeGreaterThan(SAMPLE_RATE_DEFAULT * 0.08);
      expect(b.length, id).toBeLessThan(SAMPLE_RATE_DEFAULT * 1);
      let max = 0;
      for (const v of b) {
        expect(Number.isFinite(v), id).toBe(true);
        max = Math.max(max, Math.abs(v));
      }
      expect(max, id).toBeGreaterThan(PEAK * 0.95);
      expect(max, id).toBeLessThanOrEqual(PEAK + 1e-6);
    }
  });

  it('siempre suenan igual (sin azar) y terminan en silencio, sin clic', () => {
    for (const id of SOUND_IDS) {
      const a = makeSound(id);
      const b = makeSound(id);
      expect(Array.from(a.slice(0, 300)), id).toEqual(Array.from(b.slice(0, 300)));
      expect(Math.abs(a[a.length - 1]), id).toBeLessThan(0.01);
    }
  });

  it('ningún par de sonidos es igual (huella de las primeras muestras y de la duración)', () => {
    const sig = (id: SoundId) => `${all[id].length}:${Array.from(all[id].slice(200, 260)).map((v) => v.toFixed(3)).join()}`;
    expect(new Set(SOUND_IDS.map(sig)).size).toBe(16);
  });

  it('los tambores van de más grave a más agudo: bombo < tom < bongó', () => {
    const f = (id: SoundId) => pitch(all[id], 40);
    expect(f('bombo')).toBeLessThan(f('tom'));
    expect(f('tom')).toBeLessThan(f('bongo'));
  });

  it('las notas están donde dice el catálogo: marimba en do, campanita en sol, cuerda en sol grave, bajo en do grave, voz en la', () => {
    const near = (id: SoundId, want: number, from: number, to: number) => {
      const got = fundamental(all[id], from, to, want * 0.6, want * 1.6);
      expect(Math.abs(got - want) / want, `${id}: ${got.toFixed(1)} vs ${want}`).toBeLessThan(0.04);
    };
    near('marimba', 523.25, 0.03, 0.2);
    expect(Math.abs(strongest(all.carillon, 0.02, 0.2, 600, 1000) - 783.99) / 783.99).toBeLessThan(0.02);
    near('cuerda', 196, 0.05, 0.3);
    near('bajo', 65.41, 0.03, 0.25);
    near('voz', 220, 0.04, 0.2);
  });

  it('el triángulo es de los más agudos y largos; el chasquido, de los más cortos', () => {
    expect(all.triangulo.length).toBeGreaterThan(all.claves.length * 3);
    expect(all.chasquido.length).toBeLessThanOrEqual(all.claves.length);
    expect(pitch(all.triangulo, 20)).toBeGreaterThan(pitch(all.bombo, 20) * 10);
  });

  it('cambian con la frecuencia de muestreo manteniendo la misma duración', () => {
    for (const id of SOUND_IDS) {
      const a = makeSound(id, 44100);
      const b = makeSound(id, 48000);
      expect(a.length / 44100, id).toBeCloseTo(b.length / 48000, 2);
    }
  });
});

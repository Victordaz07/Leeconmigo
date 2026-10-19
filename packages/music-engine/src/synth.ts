import type { Layer } from './pattern.ts';

/**
 * Timbres sintetizados por código (ESPECIFICACION AJUSTE 4): sin grabaciones, sin derechos que revisar, sin archivos de audio.
 * Todos devuelven muestras `Float32Array` entre −1 y 1, siempre iguales (ruido con semilla fija). El motor real las sube al reproductor.
 */
export const SAMPLE_RATE_DEFAULT = 44100;
/** Pico máximo de cada timbre (deja margen para que varias capas juntas no saturen). */
export const PEAK = 0.7;

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalize(buf: Float32Array, peak = PEAK): Float32Array {
  let max = 0;
  for (const v of buf) max = Math.max(max, Math.abs(v));
  if (max === 0) return buf;
  const k = peak / max;
  for (let i = 0; i < buf.length; i++) buf[i] *= k;
  // Cierre suave de los últimos 4 ms: sin «clic» al terminar.
  return buf;
}

function fadeEnds(buf: Float32Array, sampleRate: number): Float32Array {
  const n = Math.min(buf.length >> 1, Math.round(sampleRate * 0.004));
  for (let i = 0; i < n; i++) buf[buf.length - 1 - i] *= i / n;
  return buf;
}

/** Percusión grave: un tono que baja de ~130 Hz a ~50 Hz con caída rápida. */
export function grave(sampleRate = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = Math.round(sampleRate * 0.32);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const f = 50 + 80 * Math.exp(-t * 22);
    phase += (2 * Math.PI * f) / sampleRate;
    out[i] = Math.sin(phase) * Math.exp(-t * 9);
  }
  return fadeEnds(normalize(out), sampleRate);
}

/** Palmas: dos ráfagas muy cortas de ruido con las frecuencias graves recortadas. */
export function palmas(sampleRate = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = Math.round(sampleRate * 0.16);
  const out = new Float32Array(n);
  const r = rng(7);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const white = r() * 2 - 1;
    const hp = white - prev * 0.6; // pasa-altos simple
    prev = white;
    const env = Math.exp(-t * 55) + 0.6 * Math.exp(-Math.max(0, t - 0.012) * 70) * (t > 0.012 ? 1 : 0);
    out[i] = hp * env;
  }
  return fadeEnds(normalize(out), sampleRate);
}

/** Sonaja: ruido agudo con subida y bajada suaves. */
export function sonaja(sampleRate = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = Math.round(sampleRate * 0.2);
  const out = new Float32Array(n);
  const r = rng(19);
  let prev = 0;
  let prev2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const white = r() * 2 - 1;
    const hp = white - 1.4 * prev + 0.5 * prev2; // más agudo que las palmas
    prev2 = prev;
    prev = white;
    const env = Math.min(1, t / 0.012) * Math.exp(-t * 18);
    out[i] = hp * env;
  }
  return fadeEnds(normalize(out), sampleRate);
}

/** Sonido vocal sintetizado original (una «a» suave): armónicos de 220 Hz moldeados por dos formantes. No es la voz de nadie. */
export function voz(sampleRate = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = Math.round(sampleRate * 0.34);
  const out = new Float32Array(n);
  const f0 = 220;
  const formants = [
    { f: 800, w: 120 },
    { f: 1200, w: 160 },
  ];
  const gain = (h: number) => formants.reduce((s, fm) => s + Math.exp(-(((h * f0 - fm.f) / fm.w) ** 2)), 0.05);
  const harmonics = Array.from({ length: 14 }, (_, i) => i + 1);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, t / 0.03) * Math.exp(-Math.max(0, t - 0.08) * 7);
    let v = 0;
    for (const h of harmonics) v += (gain(h) / h) * Math.sin(2 * Math.PI * f0 * h * t);
    out[i] = v * env;
  }
  return fadeEnds(normalize(out), sampleRate);
}

const MAKERS: Record<Layer, (sampleRate: number) => Float32Array> = { grave, palmas, sonaja, voz };

/** Los cuatro timbres, listos para subirlos al reproductor. */
export function allTimbres(sampleRate = SAMPLE_RATE_DEFAULT): Record<Layer, Float32Array> {
  return { grave: MAKERS.grave(sampleRate), palmas: MAKERS.palmas(sampleRate), sonaja: MAKERS.sonaja(sampleRate), voz: MAKERS.voz(sampleRate) };
}

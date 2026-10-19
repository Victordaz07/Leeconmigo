import { SOUND_IDS, type SoundId } from './sounds.ts';

/**
 * Los 16 sonidos del estudio, sintetizados por código (ESPECIFICACION AJUSTE 4): sin grabaciones, sin derechos que revisar, sin archivos de audio.
 * Todos devuelven muestras `Float32Array` entre −1 y 1, siempre iguales (ruido con semilla fija), con un cierre suave al final (sin «clic»).
 * Las notas están todas en do mayor pentatónico, para que cualquier mezcla suene bien junta.
 */
export const SAMPLE_RATE_DEFAULT = 44100;
/** Pico máximo de cada sonido (deja margen para que varias filas juntas no saturen). */
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

function finish(buf: Float32Array, sampleRate: number): Float32Array {
  let max = 0;
  for (const v of buf) max = Math.max(max, Math.abs(v));
  if (max > 0) {
    const k = PEAK / max;
    for (let i = 0; i < buf.length; i++) buf[i] *= k;
  }
  const n = Math.min(buf.length >> 1, Math.round(sampleRate * 0.004));
  for (let i = 0; i < n; i++) buf[buf.length - 1 - i] *= i / n;
  return buf;
}

const len = (sr: number, seconds: number) => Math.round(sr * seconds);

/** Ruido blanco con pasa-altos simple (quita lo grave). */
function hpNoise(n: number, seed: number, k = 0.6): Float32Array {
  const r = rng(seed);
  const out = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const w = r() * 2 - 1;
    out[i] = w - prev * k;
    prev = w;
  }
  return out;
}

/** Ruido blanco con pasa-bajos de un polo (deja solo lo grave); `a` pequeño = más grave. */
function lpNoise(n: number, seed: number, a: number): Float32Array {
  const r = rng(seed);
  const out = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    y += a * (r() * 2 - 1 - y);
    out[i] = y;
  }
  return out;
}

/** Pasa-banda (biquad) sobre una señal: deja solo las frecuencias cerca de `f0`. */
function bandpass(x: Float32Array, f0: number, q: number, sr: number): Float32Array {
  const w = (2 * Math.PI * f0) / sr;
  const alpha = Math.sin(w) / (2 * q);
  const b0 = alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w);
  const a2 = 1 - alpha;
  const out = new Float32Array(x.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = (b0 * x[i] - b0 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = y;
    out[i] = y;
  }
  return out;
}

/** Suma de parciales (frecuencia, amplitud, caída) con subida muy corta. */
function partials(sr: number, seconds: number, parts: { f: number; a: number; d: number }[], attack = 0.002): Float32Array {
  const n = len(sr, seconds);
  const out = new Float32Array(n);
  for (const p of parts) {
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      out[i] += p.a * Math.sin(2 * Math.PI * p.f * t) * Math.exp(-t * p.d) * Math.min(1, t / attack);
    }
  }
  return out;
}

/** Tambor: tono que baja de `f0` a `f1` con caída, más un golpecito de ruido al inicio. */
function drum(sr: number, seconds: number, f0: number, f1: number, sweep: number, decay: number, click = 0.15): Float32Array {
  const n = len(sr, seconds);
  const out = new Float32Array(n);
  const noise = hpNoise(n, 3);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    phase += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-t * sweep))) / sr;
    out[i] = Math.sin(phase) * Math.exp(-t * decay) + click * noise[i] * Math.exp(-t * 120);
  }
  return out;
}

export const bombo = (sr = SAMPLE_RATE_DEFAULT): Float32Array => finish(drum(sr, 0.32, 130, 50, 22, 9, 0.05), sr);
export const tom = (sr = SAMPLE_RATE_DEFAULT): Float32Array => finish(drum(sr, 0.3, 240, 120, 24, 11, 0.1), sr);
export const bongo = (sr = SAMPLE_RATE_DEFAULT): Float32Array => finish(drum(sr, 0.18, 420, 300, 40, 26, 0.18), sr);

/** Caja: un tono seco y un «arenoso» de ruido que cae rápido. */
export function caja(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.26);
  const body = drum(sr, 0.26, 230, 170, 30, 24, 0);
  const rattle = hpNoise(n, 11, 0.3);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = 0.7 * body[i] + 0.9 * rattle[i] * Math.exp((-i / sr) * 22);
  return finish(out, sr);
}

/** Palmas: dos ráfagas muy cortas de ruido con lo grave recortado. */
export function palmas(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.16);
  const noise = hpNoise(n, 7, 0.6);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 55) + (t > 0.012 ? 0.6 * Math.exp(-(t - 0.012) * 70) : 0);
    out[i] = noise[i] * env;
  }
  return finish(out, sr);
}

/** Chasquido de dedos: un «chic» muy corto en la zona aguda-media. */
export function chasquido(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.09);
  const band = bandpass(hpNoise(n, 23, 0.3), 2600, 3, sr);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = band[i] * Math.exp((-i / sr) * 85);
  return finish(out, sr);
}

/** Pisada: un golpe sordo de ruido grave sobre un tono muy bajo. */
export function pisada(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.24);
  const thump = lpNoise(n, 29, 0.04);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    out[i] = thump[i] * 6 * Math.exp(-t * 20) + 0.5 * Math.sin(2 * Math.PI * 62 * t) * Math.exp(-t * 16);
  }
  return finish(out, sr);
}

/** Voz sintética «a» original: armónicos de 220 Hz moldeados por dos formantes. No es la voz de nadie. */
export function voz(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.34);
  const out = new Float32Array(n);
  const f0 = 220;
  const formants = [
    { f: 800, w: 120 },
    { f: 1200, w: 160 },
  ];
  const gain = (h: number) => formants.reduce((s, fm) => s + Math.exp(-(((h * f0 - fm.f) / fm.w) ** 2)), 0.05);
  const harmonics = Array.from({ length: 14 }, (_, i) => i + 1);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const env = Math.min(1, t / 0.03) * Math.exp(-Math.max(0, t - 0.08) * 7);
    let v = 0;
    for (const h of harmonics) v += (gain(h) / h) * Math.sin(2 * Math.PI * f0 * h * t);
    out[i] = v * env;
  }
  return finish(out, sr);
}

/** Claves: dos palitos de madera, muy cortos y agudos. */
export const claves = (sr = SAMPLE_RATE_DEFAULT): Float32Array =>
  finish(partials(sr, 0.14, [{ f: 1200, a: 1, d: 55 }, { f: 3310, a: 0.45, d: 80 }], 0.0005), sr);

/** Bloque de madera: madera hueca, un poco más grave que las claves. */
export const bloque = (sr = SAMPLE_RATE_DEFAULT): Float32Array =>
  finish(partials(sr, 0.18, [{ f: 820, a: 1, d: 34 }, { f: 1640, a: 0.5, d: 48 }, { f: 2460, a: 0.18, d: 70 }], 0.0005), sr);

/** Triángulo: parciales inarmónicos agudos con resonancia larga. */
export const triangulo = (sr = SAMPLE_RATE_DEFAULT): Float32Array =>
  finish(partials(sr, 0.7, [{ f: 3150, a: 1, d: 5 }, { f: 4720, a: 0.7, d: 6 }, { f: 6900, a: 0.5, d: 7.5 }, { f: 8850, a: 0.3, d: 9 }], 0.0006), sr);

/** Sonaja: ruido agudo con subida y bajada suaves. */
export function sonaja(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.2);
  const r = rng(19);
  const out = new Float32Array(n);
  let prev = 0;
  let prev2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const w = r() * 2 - 1;
    const hp = w - 1.4 * prev + 0.5 * prev2;
    prev2 = prev;
    prev = w;
    out[i] = hp * Math.min(1, t / 0.012) * Math.exp(-t * 18);
  }
  return finish(out, sr);
}

/** Marimba: placa de madera en do (523 Hz), con su segundo parcial a ~4× y caída rápida. */
export const marimba = (sr = SAMPLE_RATE_DEFAULT): Float32Array =>
  finish(partials(sr, 0.55, [{ f: 523.25, a: 1, d: 6 }, { f: 523.25 * 3.93, a: 0.35, d: 14 }, { f: 523.25 * 9.2, a: 0.08, d: 30 }], 0.0015), sr);

/** Campanita: campana clara en sol (784 Hz) con parciales inarmónicos y resonancia larga. */
export const carillon = (sr = SAMPLE_RATE_DEFAULT): Float32Array =>
  finish(partials(sr, 0.8, [{ f: 783.99, a: 1, d: 4.2 }, { f: 783.99 * 2.76, a: 0.5, d: 5.5 }, { f: 783.99 * 5.4, a: 0.25, d: 8 }, { f: 783.99 * 8.93, a: 0.1, d: 12 }], 0.001), sr);

/** Cuerda pulsada en sol grave (196 Hz) con el modelo de Karplus-Strong (una cuerda que se va apagando). */
export function cuerda(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.7);
  const period = Math.round(sr / 196);
  const r = rng(41);
  const line = new Float32Array(period);
  for (let i = 0; i < period; i++) line[i] = r() * 2 - 1;
  const out = new Float32Array(n);
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const cur = line[idx];
    const next = line[(idx + 1) % period];
    out[i] = cur;
    line[idx] = 0.4975 * (cur + next);
    idx = (idx + 1) % period;
  }
  return finish(out, sr);
}

/** Bajo: una nota muy grave en do (65 Hz) con armónicos para que se oiga también en altavoces pequeños. */
export function bajo(sr = SAMPLE_RATE_DEFAULT): Float32Array {
  const n = len(sr, 0.45);
  const f = 65.41;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let v = 0;
    for (let h = 1; h <= 8; h++) v += Math.sin(2 * Math.PI * f * h * t) / h;
    out[i] = v * Math.min(1, t / 0.008) * Math.exp(-t * 6.5);
  }
  return finish(out, sr);
}

const MAKERS: Record<SoundId, (sampleRate: number) => Float32Array> = { bombo, tom, bongo, caja, palmas, chasquido, pisada, voz, claves, bloque, triangulo, sonaja, marimba, carillon, cuerda, bajo };

/** Un sonido listo para subirlo al reproductor. */
export const makeSound = (id: SoundId, sampleRate = SAMPLE_RATE_DEFAULT): Float32Array => MAKERS[id](sampleRate);

/** Los 16 sonidos. */
export function allSounds(sampleRate = SAMPLE_RATE_DEFAULT): Record<SoundId, Float32Array> {
  return Object.fromEntries(SOUND_IDS.map((id) => [id, MAKERS[id](sampleRate)])) as Record<SoundId, Float32Array>;
}

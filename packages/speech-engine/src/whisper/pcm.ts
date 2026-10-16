/**
 * Conversión de audio PCM (módulo puro). La captura nativa entrega trozos en base64 de enteros de 16 bits; Whisper y los
 * VAD trabajan con flotantes −1…1. Todo en memoria: nada se escribe a disco (docs/07, D1).
 */

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const LOOKUP = new Uint8Array(256);
for (let i = 0; i < B64.length; i++) LOOKUP[B64.charCodeAt(i)] = i;

/** base64 → bytes (sin depender de `atob` ni de `Buffer`, que no existen en todos los motores). */
export function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i + 1 < clean.length; i += 4) {
    const a = LOOKUP[clean.charCodeAt(i)];
    const b = LOOKUP[clean.charCodeAt(i + 1)];
    const c = i + 2 < clean.length ? LOOKUP[clean.charCodeAt(i + 2)] : 0;
    const d = i + 3 < clean.length ? LOOKUP[clean.charCodeAt(i + 3)] : 0;
    const n = (a << 18) | (b << 12) | (c << 6) | d;
    if (o < out.length) out[o++] = (n >> 16) & 255;
    if (o < out.length && i + 2 < clean.length) out[o++] = (n >> 8) & 255;
    if (o < out.length && i + 3 < clean.length) out[o++] = n & 255;
  }
  return out.subarray(0, o);
}

/** PCM de 16 bits con signo, little-endian (lo que da Android `AudioRecord`) → flotantes −1…1. */
export function int16BytesToFloat32(bytes: Uint8Array): Float32Array {
  const n = Math.floor(bytes.length / 2);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let v = bytes[2 * i] | (bytes[2 * i + 1] << 8);
    if (v >= 0x8000) v -= 0x10000;
    out[i] = v / 0x8000;
  }
  return out;
}

/** Atajo: trozo base64 de PCM16 → flotantes. */
export const pcm16Base64ToFloat32 = (b64: string): Float32Array => int16BytesToFloat32(base64ToBytes(b64));

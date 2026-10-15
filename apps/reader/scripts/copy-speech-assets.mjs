// Copia a /public los archivos pesados que WhisperSpeechEngine sirve desde SU PROPIO origen (nada de
// CDN): ONNX Runtime Web (.wasm/.mjs, usados por Whisper vía Transformers.js y por el VAD Silero) y el
// modelo Silero VAD (.onnx, ~2 MB). Porte de `lee-conmigo-stt-test/scripts/copy-assets.mjs`.
// Los archivos copiados están en .gitignore: viven en node_modules y no se versionan.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(appRoot, '..', '..');
const nm = join(repoRoot, 'node_modules');

const jobs = [
  // Whisper (Transformers.js): variante "asyncify", la que Transformers.js 4.x usa por defecto
  ['onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.mjs', 'public/ort/ort-wasm-simd-threaded.asyncify.mjs'],
  ['onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.wasm', 'public/ort/ort-wasm-simd-threaded.asyncify.wasm'],
  // VAD (onnxruntime-web/wasm): variante estándar
  ['onnxruntime-web/dist/ort-wasm-simd-threaded.mjs', 'public/ort/ort-wasm-simd-threaded.mjs'],
  ['onnxruntime-web/dist/ort-wasm-simd-threaded.wasm', 'public/ort/ort-wasm-simd-threaded.wasm'],
  ['@ricky0123/vad-web/dist/silero_vad_v5.onnx', 'public/vad/silero_vad_v5.onnx'],
];

let copied = 0;
for (const [from, to] of jobs) {
  const src = join(nm, from);
  const dst = join(appRoot, to);
  if (!existsSync(src)) {
    console.error(`[copy-speech-assets] Falta ${from}. ¿Ejecutaste "npm install"?`);
    process.exit(1);
  }
  if (existsSync(dst) && statSync(dst).size === statSync(src).size) continue; // ya está
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  copied++;
}
console.log(`[copy-speech-assets] ${copied ? `${copied} archivo(s) copiado(s)` : 'todo al día'}.`);

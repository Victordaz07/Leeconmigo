// Baja los modelos de voz (whisper.cpp / ggml) a assets/models/ y verifica su SHA-256.
// No van en git (pesan ~100 MB): cada quien los baja una vez con `npm run models -w @lee-conmigo/mobile`.
// Los modelos son solo los "pesos" del reconocedor; la app nunca descarga nada al usarse (sin red, docs/07, D1).
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'assets', 'models');

export const MODELS = [
  // Whisper multilingüe (español + inglés). tiny: rápido; base: más preciso. RN-03 decide cuál se queda.
  { file: 'ggml-tiny-q8_0.bin', url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny-q8_0.bin', sha256: 'c2085835d3f50733e2ff6e4b41ae8a2b8d8110461e18821b09a15c40c42d1cca' },
  { file: 'ggml-base-q5_1.bin', url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base-q5_1.bin', sha256: '422f1ae452ade6f30a004d7e5c6a43195e4433bc370bf23fac9cc591f01a8898' },
  // Detector de voz (Silero VAD): "hay voz / no hay voz".
  { file: 'ggml-silero-v6.2.0.bin', url: 'https://huggingface.co/ggml-org/whisper-vad/resolve/main/ggml-silero-v6.2.0.bin', sha256: '2aa269b785eeb53a82983a20501ddf7c1d9c48e33ab63a41391ac6c9f7fb6987' },
];

const sha256Of = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

mkdirSync(OUT, { recursive: true });
for (const m of MODELS) {
  const dest = join(OUT, m.file);
  if (existsSync(dest) && sha256Of(dest) === m.sha256) {
    console.log(`✓ ${m.file} (ya estaba)`);
    continue;
  }
  const tmp = `${dest}.part`;
  console.log(`↓ ${m.file}…`);
  const res = await fetch(m.url);
  if (!res.ok || !res.body) throw new Error(`No se pudo bajar ${m.file}: HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
  const got = sha256Of(tmp);
  if (got !== m.sha256) {
    rmSync(tmp);
    throw new Error(`${m.file}: SHA-256 no coincide (${got}). No se usa.`);
  }
  renameSync(tmp, dest);
  console.log(`✓ ${m.file}`);
}

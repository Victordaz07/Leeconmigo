// Extrae las imágenes del prototipo de Claude Design (HTML "bundled") y las deja optimizadas en la app.
// Uso: node scripts/extract-design-assets.mjs "<ruta>/Lee Conmigo - Prototipo interactivo.html"
// (el HTML sale de design/prototypes/Prototipo_Reading_Session_tablet.zip → export/)
//
// docs/02: WebP como formato general; PNG solo para transparencias necesarias.
//   1536x1024 → ilustración de la página     (WebP)
//    540x225  → portada de la historia        (WebP)
//    238x122  → banner de "Página terminada"  (WebP)
//     80x82   → mascota (con transparencia)   (PNG)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import sharp from 'sharp';

const file = process.argv[2];
if (!file) throw new Error('Falta la ruta al HTML del prototipo');
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'reader', 'public');

const html = readFileSync(file, 'utf8');
const tag = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find((m) => m[1].trim() === 'type="__bundler/manifest"');
if (!tag) throw new Error('El HTML no es un bundle de Claude Design (no hay manifiesto)');
const manifest = JSON.parse(tag[2]);

const TARGETS = {
  '1536x1024': { out: 'stories/la-luna-y-la-puerta-azul/page-01.webp', webp: true },
  '540x225': { out: 'stories/la-luna-y-la-puerta-azul/cover.webp', webp: true },
  '238x122': { out: 'assets/banner-page-done.webp', webp: true },
  '80x82': { out: 'assets/mascot.png', webp: false },
};

for (const entry of Object.values(manifest)) {
  if (entry.mime !== 'image/png') continue;
  let buf = Buffer.from(entry.data, 'base64');
  if (entry.compressed) buf = gunzipSync(buf);
  const { width, height } = await sharp(buf).metadata();
  const target = TARGETS[`${width}x${height}`];
  if (!target) {
    console.log(`(imagen ${width}x${height} sin uso, se ignora)`);
    continue;
  }
  const dest = join(root, target.out);
  mkdirSync(dirname(dest), { recursive: true });
  const out = target.webp ? await sharp(buf).webp({ quality: 86 }).toBuffer() : await sharp(buf).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(dest, out);
  console.log(`${target.out.padEnd(52)} ${width}x${height}  ${(buf.length / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB`);
}

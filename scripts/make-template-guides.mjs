// Imágenes GUÍA de las plantillas de página (content/plantillas/<plantilla>.png y <plantilla>-numerada.png).
// Sirven como referencia de composición para el generador de imágenes: viñetas en gris claro con los globos o tarjetas de texto
// VACÍOS exactamente donde deben quedar. La versión "-numerada" marca el orden de lectura (solo para personas: no se le da al generador).
// Uso: npm run templates:guides   (lee las medidas de packages/story-engine/src/templates.ts)
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_TEMPLATES, TEMPLATE_CANVAS, slotPolygon } from '../packages/story-engine/src/templates.ts';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content', 'plantillas');
mkdirSync(outDir, { recursive: true });

const { width: W, height: H } = TEMPLATE_CANVAS;

function svgOf(slots, numbered) {
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`, `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`];
  for (const s of slots) {
    // Viñeta: su forma real (rectángulo o polígono inclinado).
    const pts = slotPolygon(s).map(([x, y]) => `${x},${y}`).join(' ');
    parts.push(`<polygon points="${pts}" fill="#DCE3EE" stroke="#9AA6BD" stroke-width="3" stroke-linejoin="round"/>`);
  }
  slots.forEach((s, i) => {
    const [x0, y0, x1, y1] = s.balloon;
    if (s.burst) {
      // Globo en forma de EXPLOSIÓN (estrella de 14 puntas) inscrita en el rectángulo del globo.
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const R = Math.min(x1 - x0, y1 - y0) / 2;
      const pts = Array.from({ length: 28 }, (_, k) => {
        const r = k % 2 === 0 ? R : R * 0.72;
        const a = (Math.PI * 2 * k) / 28 - Math.PI / 2;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      parts.push(`<polygon points="${pts}" fill="#FDF6E6" stroke="#1B2450" stroke-width="5" stroke-linejoin="round"/>`);
      if (numbered) parts.push(`<circle cx="${cx}" cy="${cy}" r="46" fill="#1E6FE8"/>`, `<text x="${cx}" y="${cy + 20}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" text-anchor="middle" fill="#FFFFFF">${i + 1}</text>`);
      return;
    }
    parts.push(`<rect x="${x0 + 2.5}" y="${y0 + 2.5}" width="${x1 - x0 - 5}" height="${y1 - y0 - 5}" rx="26" fill="#FDF6E6" stroke="#1B2450" stroke-width="5"/>`);
    if (numbered) {
      const p = s.panel;
      // El número va en el centro de la ilustración (o de la viñeta), lejos del globo.
      const poly = slotPolygon(s);
      const cx = poly.reduce((a, q) => a + q[0], 0) / poly.length;
      const cy = poly.reduce((a, q) => a + q[1], 0) / poly.length + (p.y1 - p.y0) * 0.22;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="46" fill="#1E6FE8"/>`, `<text x="${cx}" y="${cy + 20}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" text-anchor="middle" fill="#FFFFFF">${i + 1}</text>`);
    }
  });
  parts.push('</svg>');
  return parts.join('');
}

for (const [name, t] of Object.entries(PAGE_TEMPLATES)) {
  for (const numbered of [false, true]) {
    const file = join(outDir, `${name}${numbered ? '-numerada' : ''}.png`);
    const png = await sharp(Buffer.from(svgOf(t.slots, numbered))).png({ compressionLevel: 9, palette: true }).toBuffer();
    writeFileSync(file, png);
  }
  console.log(name.padEnd(8), `${t.slots.length} cuadro(s) — ${t.description}`);
}
console.log(`\nGuías en ${outDir}`);

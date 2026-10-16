/**
 * Genera `packages/ui-core/src/generated/andika-metrics.ts`: el ancho (en em) de cada letra de Andika Regular que aparece en
 * las historias. Con eso, `layoutBalloonText` (ui-core) calcula en qué tamaño y en qué renglones cabe el texto de un globo SIN
 * medir en pantalla — igual en Android, iOS y en las pruebas (docs/11, RN-05).
 *
 * Correr de nuevo si se cambia la fuente de lectura (docs/09 C2) o si aparecen letras nuevas (la prueba
 * `packages/ui-core/tests/text-fit.test.ts` avisa si una historia usa una letra sin medida).
 *
 *   node scripts/gen-font-metrics.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');
const FONT = 'node_modules/@expo-google-fonts/andika/400Regular/Andika_400Regular.ttf';
const OUT = 'packages/ui-core/src/generated/andika-metrics.ts';

const font = opentype.loadSync(FONT);
const chars = new Set();
for (let c = 32; c < 127; c++) chars.add(String.fromCharCode(c));
for (const c of 'áéíóúüñÁÉÍÓÚÜÑ¿¡«»“”‘’—–…·') chars.add(c);
const dir = 'packages/story-engine/stories';
for (const lang of readdirSync(dir)) {
  for (const f of readdirSync(`${dir}/${lang}`)) {
    const story = JSON.parse(readFileSync(`${dir}/${lang}/${f}`, 'utf8'));
    for (const p of story.pages) for (const b of p.blocks) for (const l of b.lines) for (const c of l) chars.add(c);
  }
}

const widths = {};
for (const c of [...chars].sort()) {
  const g = font.charToGlyph(c);
  if (!g || g.index === 0) continue; // la fuente no la tiene: se usa el ancho promedio
  widths[c] = Math.round((g.advanceWidth / font.unitsPerEm) * 10000) / 10000;
}

const body = `// GENERADO por scripts/gen-font-metrics.mjs a partir de ${FONT.split('/').pop()} — no editar a mano.
/** Ancho de avance de cada letra de Andika Regular, en em (1 = tamaño de la letra). */
export const ANDIKA_REGULAR_WIDTHS: Readonly<Record<string, number>> = {
${Object.entries(widths).map(([c, w]) => `  ${JSON.stringify(c)}: ${w},`).join('\n')}
};
`;
writeFileSync(OUT, body);
console.log(`${Object.keys(widths).length} letras → ${OUT}`);

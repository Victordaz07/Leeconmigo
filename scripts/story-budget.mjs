// Presupuesto de texto de las historias: ¿cabe cada cuadro en su caja con una letra cómoda?
// Estima la capacidad de cada caja (área / 462 px² por carácter ≈ letra de 27 px de la ilustración, unos 20 px en pantalla) y la compara
// con lo que escribió el autor. Sirve para revisar un paquete de contenido ANTES de montarlo. No sustituye a `npm run stories:check`.
// Uso: npm run stories:budget [-- <texto-del-id> [--strict]]   (--strict: sale con error si algún cuadro pasa del 100 %)
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_TEMPLATES, templateLayouts } from '../packages/story-engine/src/templates.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storiesDir = join(root, 'packages', 'story-engine', 'stories');
const PX2_PER_CHAR = 462;
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const filter = args.find((a) => !a.startsWith('--'));

const files = readdirSync(storiesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(storiesDir, d.name)).filter((f) => f.endsWith('.json')).map((f) => join(storiesDir, d.name, f)));

let over = 0;
let shown = 0;
for (const file of files) {
  const story = JSON.parse(readFileSync(file, 'utf8'));
  if (filter && !story.id.includes(filter)) continue;
  shown++;
  let words = 0;
  let blocks = 0;
  const rows = [];
  for (const page of story.pages) {
    const layouts = page.template && PAGE_TEMPLATES[page.template] ? templateLayouts(page.template) : null;
    page.blocks.forEach((b, i) => {
      const text = b.lines.join(' ');
      words += b.lines.reduce((n, l) => n + l.split(' ').filter(Boolean).length, 0);
      blocks++;
      const box = layouts?.[i]?.text;
      if (!box) return; // página de solo texto: se lee en el panel, sin caja que llenar
      const capacity = Math.floor((box.width * box.height) / PX2_PER_CHAR);
      rows.push({ page: page.id, template: page.template, block: b.id, chars: text.length, capacity, pct: Math.round((text.length / capacity) * 100), longest: Math.max(...b.lines.map((l) => l.length)) });
    });
  }
  const bad = rows.filter((r) => r.pct > 100);
  const tight = rows.filter((r) => r.pct > 85 && r.pct <= 100);
  const long = rows.filter((r) => r.longest > 120);
  over += bad.length + long.length;
  const max = rows.reduce((m, r) => Math.max(m, r.pct), 0);
  console.log(`${story.id.padEnd(48)} ${String(words).padStart(5)} palabras · ${String(blocks).padStart(3)} cuadros · máx. ${String(max).padStart(3)} % de su caja`);
  for (const r of bad) console.log(`   ⚠ ${r.block} (${r.page}, ${r.template}): ${r.chars} caracteres para ~${r.capacity} (${r.pct} %) — no cabe con letra cómoda; el texto se ve pequeño o el motor lo muestra frase a frase`);
  for (const r of tight) console.log(`   · ${r.block} (${r.page}, ${r.template}): ${r.pct} % — justo`);
  for (const r of long) console.log(`   ✖ ${r.block}: una frase de ${r.longest} caracteres (máx. 120)`);
}
if (!shown) console.log('Ninguna historia coincide.');
if (strict && over) {
  console.error(`\n${over} cuadro(s) fuera de presupuesto.`);
  process.exit(1);
}

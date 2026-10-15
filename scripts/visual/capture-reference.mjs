// Captura los 20 estados del prototipo aprobado de Claude Design (HTML exportado) como referencia.
// Uso: node scripts/visual/capture-reference.mjs <URL-del-prototipo> [explorador|lector|ambos]
// (sirve el HTML con cualquier servidor estático; el export está en design/prototypes/*.zip)
import { join } from 'node:path';
import { LABELS, ensureDir, freeze, launch, outDir, pad, sleep } from './common.mjs';

const url = process.argv[2];
if (!url) throw new Error('Falta la URL del prototipo');
const which = process.argv[3] ?? 'ambos';
const collapsed = process.argv[4] === 'collapsed'; // panel lateral colapsado (riel estrecho)
const audiences = which === 'ambos' ? ['explorador', 'lector'] : [which];
const dir = join(outDir, 'reference');
ensureDir(dir);

const { browser, page } = await launch({ width: 2300, height: 1300 });
await page.goto(url);
await sleep(2500);
await freeze(page);

for (const aud of audiences) {
  await page.locator('button', { hasText: aud === 'lector' ? 'Lector' : 'Explorador' }).first().click();
  await sleep(300);
  if (collapsed) {
    await page.locator('button:has(span:text-is("04"))').first().click();
    await sleep(800);
    await page.locator('button[title="Ocultar panel"]').first().click();
    await sleep(500);
  }
  for (let n = 1; n <= 20; n++) {
    await page.locator(`button:has(span:text-is("${pad(n)}"))`).first().click(); // por el número exacto del estado ("12 " también aparece en "9 a 12 años")
    await sleep(n === 12 || n === 19 ? 3000 : 900);
    const frame = page.locator('div[style*="inset: 14px"]').first();
    await frame.screenshot({ path: join(dir, `${aud}${collapsed ? '-colapsado' : ''}-${pad(n)}.png`) });
    process.stdout.write(`${aud} ${pad(n)} ${LABELS[n - 1]}\n`);
  }
}
await browser.close();

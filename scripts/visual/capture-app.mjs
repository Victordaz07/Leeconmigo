// Captura la app real en los mismos 20 estados y calcula la diferencia por píxeles contra la referencia.
// Uso: node scripts/visual/capture-app.mjs [URL-de-la-app=http://localhost:5173] [explorador|lector|ambos]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { LABELS, ensureDir, freeze, launch, outDir, pad, sleep } from './common.mjs';

const base = process.argv[2] ?? 'http://localhost:5173';
const which = process.argv[3] ?? 'ambos';
const collapsed = process.argv[4] === 'collapsed';
const tag = collapsed ? '-colapsado' : '';
const audiences = which === 'ambos' ? ['explorador', 'lector'] : [which];
const appDir = join(outDir, 'app');
const diffDir = join(outDir, 'diff');
ensureDir(appDir);
ensureDir(diffDir);

const { browser, page } = await launch({ width: 1508, height: 996 });
const rows = [];
for (const aud of audiences) {
  for (let n = 1; n <= 20; n++) {
    await page.goto(`${base}/?dev=0&screen=${n}&audience=${aud}${collapsed ? '&collapsed=1' : ''}`);
    await sleep(700);
    await freeze(page);
    await sleep(n === 12 || n === 19 ? 3000 : 900);
    const file = join(appDir, `${aud}${tag}-${pad(n)}.png`);
    await page.locator('[data-testid=tablet-canvas]').screenshot({ path: file });
    let pct = null;
    try {
      const a = PNG.sync.read(readFileSync(file));
      const b = PNG.sync.read(readFileSync(join(outDir, 'reference', `${aud}${tag}-${pad(n)}.png`)));
      if (a.width === b.width && a.height === b.height) {
        const d = new PNG({ width: a.width, height: a.height });
        const diff = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.12, includeAA: false });
        writeFileSync(join(diffDir, `${aud}${tag}-${pad(n)}.png`), PNG.sync.write(d));
        pct = (diff / (a.width * a.height)) * 100;
      } else pct = NaN;
    } catch {
      pct = null; // sin referencia
    }
    rows.push({ aud, n, pct });
    console.log(`${aud.padEnd(10)} ${pad(n)} ${LABELS[n - 1].padEnd(20)} ${pct === null ? 'sin referencia' : Number.isNaN(pct) ? 'tamaños distintos' : pct.toFixed(2) + ' % de píxeles distintos'}`);
  }
}
await browser.close();
const ok = rows.filter((r) => r.pct !== null && !Number.isNaN(r.pct));
if (ok.length) console.log(`\nMedia: ${(ok.reduce((s, r) => s + r.pct, 0) / ok.length).toFixed(2)} %  ·  peor: ${ok.sort((a, b) => b.pct - a.pct)[0].aud} ${pad(ok[0].n)} (${ok[0].pct.toFixed(2)} %)`);

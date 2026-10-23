// Browser proof of local-only failure, manual recovery, layout and word help. Native speech is covered by injected-bridge unit tests.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { prepareReading } from '../packages/story-engine/src/reading-edition.ts';
import { chromium } from 'playwright-core';
const base = process.argv[2] ?? 'http://localhost:8082';
const output = '/tmp/read-together-browser'; fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const evidence = [];
try {
  for (const lang of ['es', 'en']) {
    const es = lang === 'es';
    const source = JSON.parse(fs.readFileSync(`packages/story-engine/stories/${lang}/el-puente-de-las-luciernagas-${lang}-n3.json`, 'utf8'));
    const edition = JSON.parse(fs.readFileSync('packages/story-engine/reading-editions/el-puente-de-las-luciernagas.json', 'utf8'));
    const prepared = prepareReading(source, edition);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(({ lang }) => {
      localStorage.setItem('kitewise.v1.legal', JSON.stringify({ version: '2026-10-22-borrador', acceptedAt: new Date().toISOString(), lang }));
      localStorage.setItem('kitewise.v1.profiles', JSON.stringify([{ id: 'voice', name: 'Noah', language: lang, level: 3, dailyGoalMinutes: 15, avatar: 'sunDiag', askEnergy: false, freeReading: true, focus: { mode: 'off' } }]));
      localStorage.setItem('kitewise.v1.reading.voice', JSON.stringify({ summaries: [], resumes: [{ storyId: `el-puente-de-las-luciernagas-${lang}-n3`, pageIndex: 0, updatedAt: new Date().toISOString() }] }));
      window.browserAsrCalls = 0; window.voiceHelpCalls = [];
      window.SpeechRecognition = window.webkitSpeechRecognition = class { constructor() { window.browserAsrCalls++; throw Error('Network-capable browser ASR must never run'); } };
      window.SpeechSynthesisUtterance = class {};
      Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], speak: u => window.voiceHelpCalls.push(u.text), cancel() {}, pause() {}, resume() {}, speaking: false } });
    }, { lang });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.getByRole('button', { name: 'Noah', exact: true }).click();
    await page.getByRole('button', { name: es ? 'Seguir ›' : 'Continue ›', exact: true }).click();
    await page.getByRole('button', { name: es ? 'Leer juntos' : 'Read together', exact: true }).click();
    await page.getByText(es ? 'Esta escucha local no está disponible.' : 'This local listening option isn’t available.', { exact: false }).waitFor();
    for (const [width, height] of [[360, 800], [720, 800], [800, 720], [844, 390], [1280, 800]]) {
      await page.setViewportSize({ width, height }); await page.waitForTimeout(100);
      const button = await page.getByRole('button', { name: es ? 'Seguir leyendo' : 'Keep reading', exact: true }).boundingBox();
      assert.ok(button && button.width <= 60 && button.height <= 60 && button.y >= 0 && button.y + button.height <= height);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `${output}/local-unavailable-${lang}-${width}.png` });
    }
    await page.getByRole('button', { name: es ? 'Probar otra escucha local' : 'Try another local option', exact: true }).click();
    await page.getByRole('button', { name: es ? 'Seguir sin micrófono' : 'Continue without a microphone', exact: true }).click();
    await page.getByText(es ? 'Lectura libre' : 'Read at your own pace', { exact: false }).first().waitFor();
    const word = prepared.story.pages[0].blocks[0].lines[0].split(' ')[0];
    await page.getByRole('button', { name: word, exact: true }).first().click();
    await page.getByRole('button', { name: es ? 'Escuchar la palabra' : 'Hear the word', exact: true }).click();
    await page.waitForTimeout(100);
    assert.ok((await page.evaluate(() => window.voiceHelpCalls)).length >= 2);
    await page.getByLabel(es ? 'Cerrar ayuda' : 'Close word help', { exact: true }).getByRole('button', { name: es ? 'Seguir leyendo' : 'Keep reading', exact: true }).click();
    await page.getByLabel(es ? 'Cerrar ayuda' : 'Close word help', { exact: true }).waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => window.browserAsrCalls), 0);
    assert.deepEqual(errors, []);
    evidence.push({ language: lang, sizes: 5, unsupported: 'recovered manually', pronunciationRequests: await page.evaluate(() => window.voiceHelpCalls.length), networkCapableBrowserAsrCalls: 0, errors });
    await context.close();
  }
} finally { await browser.close(); }
fs.writeFileSync(`${output}/evidence.json`, JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));

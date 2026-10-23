// Internal browser verification. Start Expo web first; no microphone or real child data is used.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { prepareReading } from '../packages/story-engine/src/reading-edition.ts';
import { tileOrder } from '../packages/session-engine/src/review.ts';
import { vocabularyKey } from '../packages/reading-engine/src/normalize.ts';

const root = path.resolve(import.meta.dirname, '..');
const base = process.argv[2] ?? 'http://localhost:8082';
const onlyFamily = process.argv[3];
const output = process.env.READING_SCREENSHOTS_DIR ?? '/tmp/reading-pilot';
fs.mkdirSync(output, { recursive: true });
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'], headless: true });
const evidence = [];
try {
  for (const file of fs.readdirSync(path.join(root, 'packages/story-engine/reading-editions'))) {
    const edition = read('packages/story-engine/reading-editions/' + file);
    if (onlyFamily && edition.familyId !== onlyFamily) continue;
    for (const lang of ['es', 'en']) {
      const sourceName = fs.readdirSync(path.join(root, 'packages/story-engine/stories', lang)).filter(f => f.startsWith(edition.familyId)).sort().at(-1);
      const source = read(`packages/story-engine/stories/${lang}/${sourceName}`);
      const prepared = prepareReading(source, edition);
      const isEs = lang === 'es';
      const part = n => new RegExp(`^${isEs ? 'Fragmento' : 'Part'} ${n} ${isEs ? 'de' : 'of'} ${prepared.story.pages.length}`);
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
      await context.addInitScript(({ id, lang, level }) => {
        if (!localStorage.getItem('reading-pilot-seeded')) {
          localStorage.setItem('reading-pilot-seeded', 'yes');
          localStorage.setItem('kitewise.v1.legal', JSON.stringify({ version: '2026-10-22-borrador', acceptedAt: new Date().toISOString(), lang: 'es' }));
          localStorage.setItem('kitewise.v1.profiles', JSON.stringify([{ id: 'pilot', name: 'Noah', language: lang, level, dailyGoalMinutes: 15, avatar: 'sunDiag', askEnergy: false, freeReading: true, focus: { mode: 'off' } }]));
          localStorage.setItem('kitewise.v1.reading.pilot', JSON.stringify({ summaries: [], resumes: [{ storyId: id, pageIndex: 0, updatedAt: new Date().toISOString() }] }));
        }
        window.readingPilotSpeech = [];
        window.SpeechSynthesisUtterance = class {};
        Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], speak: utterance => { window.readingPilotSpeech.push({ text: utterance.text, language: utterance.lang }); }, cancel() {}, pause() {}, resume() {}, speaking: false } });
      }, { id: source.id, lang, level: source.level });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      async function enter() {
        await page.getByRole('button', { name: 'Noah', exact: true }).click();
        await page.getByRole('button', { name: isEs ? 'Seguir ›' : 'Continue ›', exact: true }).click();
        await page.getByRole('button', { name: isEs ? 'Empezar a leer' : 'Start reading', exact: true }).click();
      }
      await page.goto(base, { timeout: 60000 });
      await enter();
      await page.getByText(part(1)).waitFor();
      for (const [size, width, height] of [['tablet-horizontal', 1280, 800], ['tablet-vertical', 800, 1280], ['telefono-vertical', 390, 844], ['telefono-horizontal', 844, 390]]) {
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(200);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) {
          await page.screenshot({ path: path.join(output, 'overflow.png') });
          console.error(source.id, size, await page.evaluate(() => [...document.querySelectorAll('body *')].filter(n => n.getBoundingClientRect().right > innerWidth + 1).map(n => ({ text: n.textContent.slice(0, 70), width: n.getBoundingClientRect().width, right: n.getBoundingClientRect().right })).slice(-12)));
        }
        assert.equal(overflow, false, `${source.id}: overflow in ${size}`);
        await page.getByText(part(1)).waitFor();
        await page.screenshot({ path: path.join(output, `${edition.familyId}-${lang}-${size}.png`) });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      const word = prepared.story.pages[0].blocks[0].lines[0].split(' ')[0];
      await page.getByRole('button', { name: word, exact: true }).first().click();
      await page.getByRole('button', { name: isEs ? 'Escuchar la palabra' : 'Hear the word', exact: true }).waitFor();
      await page.getByRole('button', { name: isEs ? 'Escuchar la palabra' : 'Hear the word', exact: true }).click();
      assert.ok((await page.evaluate(() => window.readingPilotSpeech)).length >= 2);
      assert.equal((await page.evaluate(() => window.readingPilotSpeech)).at(-1).language, isEs ? 'es-US' : 'en-US');
      await page.getByRole('button', { name: isEs ? 'Seguir leyendo' : 'Keep reading', exact: true }).last().click();
      await page.getByLabel(isEs ? 'Cerrar ayuda' : 'Close word help', { exact: true }).waitFor({ state: 'hidden' });
      await page.getByText(part(1)).waitFor();
      await page.getByRole('button', { name: isEs ? 'Aumentar letra' : 'Larger text', exact: true }).click();
      const savedSize = JSON.parse(await page.evaluate(() => localStorage.getItem('kitewise.v1.reader-prefs.pilot'))).size;
      assert.ok(savedSize >= 27);

      let questions = 0;
      let reviews = 0;
      let resumeChecked = false;
      let dictionaryChecked = false;
      let helpedInSession = [];
      let guard = 0;
      while (++guard < prepared.story.pages.length * 4 + 20) {
        if (await page.getByText(isEs ? '¡Buen trabajo, Noah!' : 'Well done, Noah!', { exact: true }).isVisible()) break;
        if (await page.getByText(isEs ? 'Una pausa para recordar' : 'A moment to remember', { exact: true }).isVisible()) {
          const heading = await page.getByText(new RegExp(`^${isEs ? 'Fragmento' : 'Part'} \\d+`)).first().innerText();
          const index = Number(heading.match(/\d+/)[0]) - 1;
          const checkpoint = prepared.story.pages[index].checkpoint;
          const q = checkpoint.variants.find(v => v.audience === (source.level <= 2 ? 'explorador' : 'lector')) ?? checkpoint.variants[0];
          const wrong = q.options.findIndex((_, i) => i !== q.correctIndex);
          await page.getByRole('button', { name: q.options[wrong].text, exact: true }).click();
          await page.getByText(q.retryFeedback, { exact: true }).waitFor();
          await page.getByRole('button', { name: isEs ? 'Volver al texto' : 'Read the passage again', exact: true }).click();
          await page.getByRole('button', { name: isEs ? 'Cerrar el texto' : 'Close the passage', exact: true }).click();
          await page.getByRole('button', { name: q.options[q.correctIndex].text, exact: true }).click();
          await page.getByRole('button', { name: isEs ? 'Continuar' : 'Continue', exact: true }).click();
          questions++;
          continue;
        }
        if (await page.getByText(isEs ? 'Palabras que vuelven' : 'Words to explore again', { exact: true }).isVisible()) {
          const summary = await page.evaluate(() => JSON.parse(localStorage.getItem('kitewise.v1.reading.pilot')));
          assert.ok(summary.resumes.length > 0);
          // The domain chooses base words when a tapped name has no syllable entry.
          const keys = [...new Set([...helpedInSession, ...source.reviewWords].filter(key => (source.vocabulary[key]?.syllables?.length ?? 0) > 1))].slice(0, 3);
          const key = keys[reviews];
          const syllables = source.vocabulary[key].syllables;
          const order = tileOrder(syllables.length);
          for (let i = 0; i < syllables.length; i++) {
            const tile = order.indexOf(i);
            await page.getByRole('button', { name: `${syllables[i]}, ${tile + 1}`, exact: true }).click();
          }
          await page.getByRole('button', { name: reviews === keys.length - 1 ? (isEs ? 'Terminar el repaso' : 'Finish the practice') : (isEs ? 'Otra palabra' : 'Another word'), exact: true }).click();
          reviews++;
          continue;
        }
        const heading = await page.getByText(new RegExp(`^${isEs ? 'Fragmento' : 'Part'} \\d+`)).first().innerText();
        const index = Number(heading.match(/\d+/)[0]) - 1;
        if (index === 1 && !resumeChecked) {
          await page.getByRole('button', { name: isEs ? 'Volver al cuaderno' : 'Back to the notebook', exact: true }).click();
          const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kitewise.v1.reading.pilot')));
          assert.equal(saved.resumes[0].blockId, prepared.anchors[1].blockId);
          assert.equal(saved.resumes[0].lineIndex, prepared.anchors[1].lineIndex);
          await page.reload();
          await enter();
          await page.getByText(part(2)).waitFor();
          assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('kitewise.v1.reader-prefs.pilot'))).size, savedSize);
          resumeChecked = true;
          helpedInSession = [];
        }
        if (!dictionaryChecked) {
          const token = prepared.story.pages[index].blocks.flatMap(b => b.lines.flatMap(line => line.split(' '))).find(word => source.vocabulary[vocabularyKey(word)]);
          if (token) {
            const key = vocabularyKey(token);
            const entry = source.vocabulary[key];
            await page.getByRole('button', { name: token, exact: true }).first().click();
            const sheet = page.getByLabel(isEs ? 'Cerrar ayuda' : 'Close word help', { exact: true });
            if (entry.syllables?.length) await sheet.getByText(entry.syllables.join('·'), { exact: true }).waitFor();
            if (entry.definition) await sheet.getByText(entry.definition, { exact: false }).waitFor();
            if (entry.synonym) assert.ok((await sheet.getByText(entry.definition, { exact: false }).innerText()).includes(entry.synonym));
            if (entry.example) await sheet.getByText(entry.example, { exact: false }).waitFor();
            await page.waitForTimeout(350); // Capture the settled native modal, after its fade transition.
            await page.screenshot({ path: path.join(output, `${edition.familyId}-${lang}-word-help.png`) });
            await sheet.getByRole('button', { name: isEs ? 'Seguir leyendo' : 'Keep reading', exact: true }).click();
            await sheet.waitFor({ state: 'hidden' });
            helpedInSession.push(key);
            dictionaryChecked = true;
          }
        }
        await page.locator('#root').getByRole('button', { name: index === prepared.story.pages.length - 1 ? (isEs ? 'Terminé el cuento' : 'I finished the story') : (isEs ? 'Seguir leyendo' : 'Keep reading'), exact: true }).click();
        await page.waitForTimeout(500);
      }
      await page.getByText(isEs ? '¡Buen trabajo, Noah!' : 'Well done, Noah!', { exact: true }).waitFor();
      await page.getByRole('button', { name: isEs ? 'Listo' : 'Done', exact: true }).click();
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kitewise.v1.reading.pilot')));
      const finished = saved.summaries.filter(s => s.completion === 1);
      assert.equal(finished.length, 1);
      assert.equal(finished[0].readingMode, 'free');
      assert.equal(saved.summaries.reduce((n, s) => n + s.comprehensionTotal, 0), 3);
      assert.equal(questions, 3);
      assert.equal(reviews, 3);
      assert.equal(dictionaryChecked, true);
      assert.equal(saved.resumes.length, 0);
      assert.deepEqual(errors, []);
      evidence.push({ story: source.id, parts: prepared.story.pages.length, questions, reviews, resumeChecked, dictionaryChecked, speech: 'request routing simulated; audible speech requires a device', result: 'passed' });
      console.log('PASS', source.id, prepared.story.pages.length, 'parts, 4 sizes, help, resume, 3 questions, 3 review words, saved completion');
      await context.close();
    }
  }
  assert.ok(evidence.length >= 2, 'No complete story edition was exercised');
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }

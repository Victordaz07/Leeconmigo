// Browser verification with synthetic profiles only. Start Expo web first.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:8082';
const output = process.env.FOLD_SCREENSHOTS_DIR ?? '/tmp/fold-interface';
const sizes = [[360, 800], [720, 800], [800, 720], [900, 740], [740, 900], [720, 720], [844, 390], [1280, 800]];
const evidence = [];
(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox']
  });
  try {
    const context = await browser.newContext({
      viewport: {
        width: 720,
        height: 800
      }
    });
    await context.addInitScript(() => {
      if (!localStorage.getItem('fold-seed')) {
        localStorage.setItem('fold-seed', '1');
        localStorage.setItem('kitewise.v1.legal', JSON.stringify({
          version: '2026-10-22-borrador',
          acceptedAt: new Date().toISOString(),
          lang: 'es'
        }));
        localStorage.setItem('kitewise.v1.pin', '1234');
        localStorage.setItem('kitewise.v1.profiles', JSON.stringify([{
          id: 'fold',
          name: 'Noah',
          language: 'en',
          level: 3,
          dailyGoalMinutes: 15,
          avatar: 'sunDiag',
          askEnergy: false,
          freeReading: true,
          focus: {
            mode: 'off'
          }
        }]));
      }
      window.SpeechSynthesisUtterance = class {};
      window.testSpeech = [];
      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          getVoices: () => [],
          speak: u => window.testSpeech.push(u.text),
          cancel() {},
          speaking: false
        }
      });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    fs.mkdirSync(output, {
      recursive: true
    });
    await page.goto(base, {
      timeout: 60000
    });
    await page.getByRole('button', {
      name: 'Noah',
      exact: true
    }).click();
    await page.getByText('Your notebooks', {
      exact: true
    }).waitFor();
    await page.getByRole('button', {
      name: 'Parents',
      exact: true
    }).click();
    for (const n of ['1', '2', '3', '4']) await page.getByRole('button', {
      name: n,
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Done',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Settings',
      exact: true
    }).waitFor();
    for (const [w, h] of sizes) {
      await page.setViewportSize({
        width: w,
        height: h
      });
      await page.waitForTimeout(100);
      await page.getByText('Practice together', {
        exact: true
      }).scrollIntoViewIfNeeded();
      for (const name of ['Legal and privacy', 'Reminders', 'Weekly report', 'Settings']) {
        const b = page.getByRole('button', {
          name,
          exact: true
        });
        await b.scrollIntoViewIfNeeded();
        const box = await b.boundingBox();
        if (!box || box.y < 0 || box.y + box.height > 180) throw Error(`Unreachable header ${name} ${w} ${JSON.stringify(box)}`);
      }
      await page.screenshot({
        path: `${output}/parents-${w}.png`
      });
      evidence.push({
        screen: 'parents',
        width: w,
        height: h
      });
      console.log('PARENT PASS', w, h);
    }
    await page.getByRole('button', {
      name: 'Settings',
      exact: true
    }).click();
    await page.getByRole('textbox', {
      name: 'Child’s name',
      exact: true
    }).fill('Noah Fold');
    for (const [w, h] of sizes) {
      await page.setViewportSize({
        width: w,
        height: h
      });
      await page.getByText('Never', {
        exact: true
      }).scrollIntoViewIfNeeded();
      const save = await page.getByRole('button', {
        name: 'Save',
        exact: true
      }).boundingBox();
      if (!save || save.y < 0 || save.y + save.height > 180) throw Error(`Save out of bounds ${w}`);
      if ((await page.getByRole('textbox', {
        name: 'Child’s name',
        exact: true
      }).inputValue()) !== 'Noah Fold') throw Error('Draft lost on resize');
      evidence.push({
        screen: 'settings',
        width: w,
        height: h
      });
      console.log('SETTINGS PASS', w, h);
      await page.screenshot({
        path: `${output}/settings-${w}.png`
      });
    }
    await page.getByRole('button', {
      name: 'Save',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Leave parent mode',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Continue ›',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Start reading',
      exact: true
    }).click();
    await page.getByText(/^Part 1 of/).first().waitFor();
    for (const [w, h] of sizes) {
      await page.setViewportSize({
        width: w,
        height: h
      });
      await page.waitForTimeout(100);
      const next = await page.getByRole('button', {
        name: 'Keep reading',
        exact: true
      }).boundingBox();
      if (!next || next.width > 60 || next.height > 60) throw Error('Oversized next');
      await page.getByText(/^Part 1 of/).first().waitFor();
      const art = await page.getByRole('img').first().locator('..').boundingBox();
      const word = await page.getByRole('button', { name: 'Mila', exact: true }).first().boundingBox();
      if (!art || !word) throw Error('Missing illustration or passage');
      if (w > h ? art.x + art.width > word.x + 1 : art.y + art.height > word.y + 1) {
        throw Error(`Wrong reading arrangement at ${w}×${h}`);
      }
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
        throw Error(`Horizontal overflow at ${w}×${h}`);
      }
      await page.screenshot({
        path: `${output}/reading-${w}.png`
      });
      evidence.push({
        screen: 'reading',
        width: w,
        height: h
      });
      console.log('READING PASS', w, h);
    }
    await page.getByRole('button', {
      name: 'Mila',
      exact: true
    }).first().click();
    const sheet = page.getByLabel('Close word help', {
      exact: true
    });
    await sheet.getByRole('button', {
      name: 'Hear the word',
      exact: true
    }).click();
    if ((await page.evaluate(() => window.testSpeech.length)) < 2) throw Error('Pronunciation was not requested');
    await sheet.getByRole('button', {
      name: 'Keep reading',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Back to the notebook',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Parents',
      exact: true
    }).click();
    for (const n of ['1', '2', '3', '4']) await page.getByRole('button', {
      name: n,
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Done',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Legal and privacy',
      exact: true
    }).click();
    await page.getByText('Legal and privacy', {
      exact: true
    }).first().waitFor();
    await page.getByRole('button', {
      name: 'Back',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Reminders',
      exact: true
    }).click();
    await page.getByText('Your weekly summary', {
      exact: true
    }).waitFor();
    await page.getByRole('button', {
      name: 'Back to parent dashboard',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Weekly report',
      exact: true
    }).click();
    await page.getByText('Kitewise · weekly summary', {
      exact: true
    }).waitFor();
    await page.getByRole('button', {
      name: 'Back to parent dashboard',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Settings',
      exact: true
    }).click();
    await page.getByRole('radio', {
      name: 'Español',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Save',
      exact: true
    }).click();
    await page.getByRole('button', {
      name: 'Ajustes',
      exact: true
    }).waitFor();
    await page.getByRole('button', {
      name: 'Salir de Modo padres',
      exact: true
    }).click();
    await page.getByText('Tus cuadernos', {
      exact: true
    }).waitFor();
    await page.reload();
    await page.getByText('¿Quién aprende hoy?', {
      exact: true
    }).waitFor();
    await page.getByRole('button', {
      name: 'Noah Fold',
      exact: true
    }).click();
    await page.getByText('Tus cuadernos', {
      exact: true
    }).waitFor();
    console.log('PASS bilingual settings/legal/reminders/report, ES language persists after reload, word pronunciation preserved');
    fs.writeFileSync(`${output}/verification.json`, JSON.stringify({
      cases: evidence,
      errors,
      languageSwitch: 'en → es, persisted after reload',
      pronunciation: 'word help and repeat requested speech synthesis',
      deviceTested: false
    }, null, 2));
    if (errors.length) throw Error(errors.join('\n'));
    console.log('PASS');
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});

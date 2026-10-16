import { describe, expect, it } from 'vitest';
import { answerFields, applyWorkAction, evaluateVisual, generateVisual, initialWork, parallelExample, solutionWork, VISUAL_TEMPLATES, type VisualWork } from '@lee-conmigo/math-content';
import { visualEquation, visualFeedback, visualFieldLabel, visualHint, visualHowTo, visualPrompt } from '@lee-conmigo/ui-core';

const LANGS = ['es', 'en'] as const;
const bad = /undefined|NaN|\{|\}|incorrect/i;

describe('textos de las matemáticas visuales (dominio ↔ ES/EN)', () => {
  it('cada consigna, ayuda, casilla y mensaje que puede salir existe en los dos idiomas, sin huecos ni "incorrecto"', () => {
    const keys = new Set<string>();
    for (const t of VISUAL_TEMPLATES) {
      for (let seed = 1; seed <= 40; seed++) {
        const { model } = generateVisual(t, seed);
        // Trabajos típicos: vacío, resuelto, resuelto sin respuesta, con una pieza de más / de menos.
        const sol = solutionWork(model);
        const works: VisualWork[] = [initialWork(model), sol, { ...sol, values: {} } as VisualWork, { ...sol, values: Object.fromEntries(Object.entries(sol.values).map(([k, v]) => [k, String(Number(v) + 1)])) } as VisualWork];
        if (model.kind === 'tenFrame') works.push(applyWorkAction(model, sol, { type: 'toggleCell', index: model.target }), applyWorkAction(model, sol, { type: 'toggleCell', index: model.target - 1 }));
        if (model.kind === 'equalGroups' && model.task === 'build') works.push(applyWorkAction(model, sol, { type: 'addToGroup', group: 0 }));
        if (model.kind === 'sharing') works.push(applyWorkAction(model, sol, { type: 'place', token: model.tokenIds[0], to: model.containerIds[model.containerIds.length - 1] }));
        for (const w of works) {
          const ev = evaluateVisual(model, w);
          keys.add(ev.feedbackKey);
          for (const lang of LANGS) {
            const text = visualFeedback(ev.feedbackKey, ev.feedbackParams, lang, model);
            expect(text, `${ev.feedbackKey} ${lang}`).not.toBe('');
            expect(text).not.toMatch(bad);
          }
        }
        for (const lang of LANGS) {
          for (const text of [visualPrompt(model, lang), visualHowTo(model, lang), visualEquation(model, true), ...answerFields(model).map((f) => visualFieldLabel(f, model, lang)), ...([1, 2, 3] as const).map((l) => visualHint(model, l, parallelExample(model), lang))]) {
            expect(text).not.toMatch(bad);
          }
        }
      }
    }
    // Se ejercitaron casi todas las claves de mensaje.
    expect(keys.size).toBeGreaterThan(15);
  });

  it('la operación resuelta coincide con el modelo', () => {
    const m = generateVisual(VISUAL_TEMPLATES.find((t) => t.id === 'sharing.remainder')!, 3).model;
    if (m.kind !== 'sharing') throw new Error();
    expect(visualEquation(m, true)).toBe(`${m.total} ÷ ${m.groups} = ${m.perGroup} R ${m.remainder}`);
    expect(visualEquation(m, false)).toBe(`${m.total} ÷ ${m.groups} = □ R □`);
  });
});

describe('cada clave de mensaje del dominio tiene texto', () => {
  it('las claves literales de evaluate.ts y families/*.ts, y las armadas con plantilla, existen en ES y EN', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { readFileSync, readdirSync } = (await import('node:fs')) as { readFileSync: (u: URL, e: string) => string; readdirSync: (u: URL) => string[] };
    const dir = new URL('../../../packages/math-content/src/visual/', import.meta.url);
    const files = ['evaluate.ts', ...readdirSync(new URL('families/', dir)).map((f: string) => `families/${f}`)];
    const keys = new Set<string>();
    for (const f of files) for (const m of readFileSync(new URL(f, dir), 'utf8').matchAll(/result\(\s*[^,]+,\s*'([\w.]+)'/g)) keys.add(m[1]);
    for (const k of ['partWhole.part', 'partWhole.whole', 'compare.smaller', 'compare.larger', 'compare.difference', 'times.larger', 'times.smaller']) keys.add(`bar.explain.${k}`);
    for (const k of ['partWhole', 'compare', 'times']) keys.add(`bar.check.${k}`);
    for (const k of ['read', 'difference', 'total']) {
      keys.add(`data.explain.${k}`);
      keys.add(`data.check.${k}`);
    }
    expect(keys.size).toBeGreaterThan(80);
    const params = new Proxy({}, { get: () => 3 }) as Record<string, number>;
    for (const k of keys) for (const lang of LANGS) expect(visualFeedback(k, params, lang), `${k} ${lang}`).not.toBe('');
  });
});

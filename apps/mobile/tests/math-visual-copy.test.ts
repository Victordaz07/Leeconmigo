import { describe, expect, it } from 'vitest';
import { answerFields, applyWorkAction, intRng, evaluateVisual, generateVisual, initialWork, parallelExample, solutionWork, VISUAL_TEMPLATES, type VisualWork } from '@lee-conmigo/math-content';
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

describe('contextos de grupos y reparto', () => {
  const sharingKeys = ['sharing.start', 'sharing.compareGroups', 'sharing.keepSharing', 'sharing.startBags', 'sharing.bagSize', 'sharing.fillBag', 'sharing.moreBags', 'sharing.countOne', 'sharing.countBags', 'sharing.countLeft', 'sharing.explain', 'sharing.explainBags'];
  const groupKeys = ['groups.build', 'groups.checkEach', 'groups.countGroups', 'groups.countOne'];
  const params = { total: 13, groups: 3, perGroup: 4, remainder: 1 };

  it('las plantillas reparten los contextos y conservan los números de la versión 1', () => {
    const themes = new Map<string, Set<string>>();
    for (const id of ['groups.build', 'groups.read', 'sharing.partitive', 'sharing.quotative', 'sharing.remainder']) {
      const t = VISUAL_TEMPLATES.find((x) => x.id === id)!;
      expect(t.version).toBe(2);
      themes.set(id, new Set(Array.from({ length: 60 }, (_, i) => (generateVisual(t, i + 1).model as { theme?: string }).theme ?? '')));
    }
    expect([...themes.get('sharing.partitive')!].sort()).toEqual(['apples', 'cookies', 'marbles', 'pencils']);
    expect([...themes.get('groups.read')!].sort()).toEqual(['apples', 'garden', 'marbles']);
    // Misma semilla, mismos números que en la versión 1 (el contexto sale de la última tirada).
    const remainder = VISUAL_TEMPLATES.find((x) => x.id === 'sharing.remainder')!;
    for (let seed = 1; seed <= 50; seed++) {
      const r = intRng(seed);
      const groups = r.int(3, 4);
      const perGroup = r.int(2, 5);
      expect(generateVisual(remainder, seed).model).toMatchObject({ groups, perGroup, remainder: r.int(1, groups - 1) });
    }
  });

  it('cada contexto usa sus propias palabras, con el género correcto en español', () => {
    const pencils = { kind: 'sharing', mode: 'partitive', total: 13, groups: 3, perGroup: 4, remainder: 1, theme: 'pencils' } as const;
    expect(visualPrompt(pencils, 'es')).toBe('Reparte 13 lápices por igual entre 3 cajas. ¿Cuántos le tocan a cada caja? ¿Cuántos sobran?');
    expect(visualPrompt(pencils, 'en')).toBe('Share 13 pencils equally among 3 boxes. How many pencils does each box get? How many are left over?');
    expect(visualFeedback('sharing.compareGroups', params, 'es', pencils)).toBe('Compara las cajas. ¿Todas tienen la misma cantidad?');
    expect(visualFeedback('sharing.start', params, 'en', { ...pencils, theme: 'apples' })).toBe('Start sharing: tap an apple, then a basket.');
    const jars = { kind: 'sharing', mode: 'quotative', total: 12, groups: 3, perGroup: 4, remainder: 0, theme: 'marbles' } as const;
    expect(visualPrompt(jars, 'es')).toBe('Hay 12 canicas. Pon 4 en cada frasco. ¿Cuántos frascos llenos puedes hacer?');
    expect(visualFeedback('sharing.moreBags', params, 'es', jars)).toBe('En la bandeja todavía alcanza para otro frasco lleno.');
    expect(visualFieldLabel('answer', jars, 'es')).toBe('Frascos llenos');
    const apples = { kind: 'equalGroups', groups: 3, perGroup: 4, task: 'read', theme: 'apples' } as const;
    expect(visualPrompt(apples, 'es')).toBe('Mira las canastas. ¿Cuántas canastas hay, cuántas manzanas tiene cada una y cuántas manzanas hay en total?');
    expect(visualFieldLabel('groups', apples, 'en')).toBe('Baskets');
    // Sin contexto: lo de siempre (galletas en platos, huerto).
    expect(visualFeedback('sharing.countOne', params, 'es')).toBe('Cuenta las galletas de un solo plato.');
    expect(visualFeedback('groups.countGroups', params, 'es')).toContain('cuadros de tierra');
  });

  it('ningún contexto deja palabras de otro', () => {
    const other = { pencils: /galleta|plato|cookie|plate/i, marbles: /galleta|plato|lápi|cookie|plate|pencil/i, apples: /galleta|plato|lápi|cookie|plate|pencil/i } as const;
    for (const theme of ['pencils', 'marbles', 'apples'] as const)
      for (const mode of ['partitive', 'quotative'] as const)
        for (const k of sharingKeys)
          for (const lang of LANGS) expect(visualFeedback(k, params, lang, { kind: 'sharing', mode, total: 13, groups: 3, perGroup: 4, remainder: 1, theme })).not.toMatch(other[theme]);
    for (const theme of ['apples', 'marbles'] as const)
      for (const k of groupKeys) for (const lang of LANGS) expect(visualFeedback(k, params, lang, { kind: 'equalGroups', groups: 3, perGroup: 4, task: 'build', theme })).not.toMatch(/parcela|planta|plot|plant|tierra|soil/i);
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

import { describe, expect, it } from 'vitest';
import type { MathChallenge } from '@lee-conmigo/contracts';
import { evaluate, generateChallenge, MATH_UNITS } from '../src/index.ts';

const challenges: MathChallenge[] = MATH_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'practicar' ? [s.challenge] : []))));

describe('generador de retos', () => {
  it('hay retos que generar', () => {
    expect(challenges.length).toBeGreaterThanOrEqual(5);
  });

  for (const c of challenges) {
    it(`${c.id}: 300 semillas dan retos válidos y completos`, () => {
      const [a, b] = Object.keys(c.generator.parameters);
      for (let seed = 1; seed <= 300; seed++) {
        const g = generateChallenge(c, seed);
        // Respuesta = plantilla, dentro de rangos, sin {huecos} en ningún idioma.
        expect(g.answer).toBe(evaluate(c.generator.answerExpression, g.values));
        for (const [k, r] of Object.entries(c.generator.parameters)) {
          expect(g.values[k]).toBeGreaterThanOrEqual(Math.max(2, r.integerMin));
          expect(g.values[k]).toBeLessThanOrEqual(r.integerMax);
        }
        const texts = [g.prompt, ...g.hints.map((h) => h.text)];
        for (const t of texts) {
          expect(t.es).not.toMatch(/[{}]/);
          expect(t.en).not.toMatch(/[{}]/);
        }
        expect(g.hints.map((h) => h.type)).toEqual(['hint', 'workedExample', 'explainedAnswer']);
        // La respuesta aparece en la explicación final, en los dos idiomas.
        expect(g.hints[2].text.es).toContain(String(g.answer));
        expect(g.hints[2].text.en).toContain(String(g.answer));
        // Si se pregunta por uno de los dos números, son distintos (si no, la pregunta no distingue grupos de contenido).
        if (/^\w+$/.test(c.generator.answerExpression.trim())) expect(g.values[a]).not.toBe(g.values[b]);
        // El ejemplo resuelto no llega al mismo resultado (no regala la respuesta).
        const exampleResult = g.hints[1].text.es.match(/= (\d+)/)?.[1] ?? g.hints[1].text.es.match(/hay (\d+)/)?.[1] ?? g.hints[1].text.es.match(/contiene (\d+)/)?.[1];
        if (exampleResult) expect(Number(exampleResult)).not.toBe(g.answer);
        // El ejemplo resuelto NO usa los mismos números del reto.
        expect(g.hints[1].text.es).not.toContain(`${g.values[a]}×${g.values[b]} =`);
        // El modelo dibujado coincide con el enunciado.
        const r = g.representation;
        if (r.component === 'EqualGroups' || r.component === 'TapeDiagram') expect([r.groups, r.perGroup]).toEqual([g.values.groups, g.values.perGroup]);
        if (r.component === 'PaintGrid') expect([r.rows, r.columns]).toEqual([g.values.rows, g.values.columns]);
      }
    });
  }

  it('es determinista: la misma semilla da el mismo reto (y los mismos números en los dos idiomas)', () => {
    const c = challenges[2];
    expect(generateChallenge(c, 42)).toEqual(generateChallenge(c, 42));
    const g = generateChallenge(c, 42);
    const nums = (s: string) => s.match(/\d+/g)?.join(',');
    expect(nums(g.prompt.es)).toBe(nums(g.prompt.en));
  });

  it('las semillas dan variedad', () => {
    const c = challenges[2];
    const distinct = new Set(Array.from({ length: 40 }, (_, i) => generateChallenge(c, i + 1).answer));
    expect(distinct.size).toBeGreaterThan(10);
  });

  it('la semilla 0 es el reto del autor, con sus pistas revisadas a mano', () => {
    const g = generateChallenge(challenges[0], 0);
    expect(g.authored).toBe(true);
    expect(g.hints).toBe(challenges[0].hints);
  });
});

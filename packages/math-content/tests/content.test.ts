import { describe, expect, it } from 'vitest';
import type { MathUnit } from '@lee-conmigo/contracts';
import { evaluate, MATH_UNITS, validateUnit } from '../src/index.ts';

describe('expresiones de plantillas (sin eval)', () => {
  it('opera con nombres, enteros y paréntesis', () => {
    expect(evaluate('groups * perGroup', { groups: 3, perGroup: 4 })).toBe(12);
    expect(evaluate('(a + b) * 2 - c / 3', { a: 1, b: 2, c: 9 })).toBe(3);
  });
  it('rechaza lo que no es una operación permitida', () => {
    expect(() => evaluate('alert(1)', {})).toThrow();
    expect(() => evaluate('groups * x', { groups: 2 })).toThrow(/desconocido/);
    expect(() => evaluate('7 / 2', {})).toThrow(/exacta/);
    expect(() => evaluate('a; b', { a: 1, b: 2 })).toThrow();
  });
});

describe('unidades incluidas', () => {
  for (const unit of MATH_UNITS) {
    it(`${unit.id} pasa la revisión automática`, () => {
      expect(validateUnit(unit)).toEqual([]);
    });
  }

  it('la revisión detecta una respuesta que no coincide, una pista de menos y un modelo distinto al enunciado', () => {
    const broken = JSON.parse(JSON.stringify(MATH_UNITS[0])) as MathUnit;
    const step = broken.lessons[1].steps.find((s) => s.kind === 'practicar');
    if (step?.kind !== 'practicar') throw new Error('sin reto');
    step.challenge.answer.value = 13;
    step.challenge.hints.pop();
    if (step.challenge.representation.component === 'EqualGroups') step.challenge.representation.groups = 5;
    const errs = validateUnit(broken).join('\n');
    expect(errs).toMatch(/no coincide con la plantilla/);
    expect(errs).toMatch(/3 escalones/);
    expect(errs).toMatch(/modelo dibujado/);
  });
});

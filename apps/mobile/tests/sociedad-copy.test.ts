import { describe, expect, it } from 'vitest';
import { socialUnitById } from '@lee-conmigo/social-content';
import { SOCIAL_COPY } from '@lee-conmigo/ui-core';

const LANGS = ['es', 'en'] as const;
const bad = /undefined|NaN|\{|\}|incorrect|incorrecto/i;

function assertLocalized(path: string, l: { es: unknown; en: unknown } | undefined) {
  expect(l, path).toBeDefined();
  for (const lang of LANGS) {
    const v = l![lang];
    expect(typeof v === 'string' || typeof v === 'function', `${path}.${lang}`).toBe(true);
  }
}

describe('textos de Sociedad (interfaz ↔ ES/EN)', () => {
  it('cada texto fijo de la interfaz existe en los dos idiomas, sin huecos ni "incorrecto"', () => {
    const walk = (obj: unknown, path: string) => {
      if (obj === null || typeof obj !== 'object') return;
      const rec = obj as Record<string, unknown>;
      if ('es' in rec && 'en' in rec) {
        assertLocalized(path, rec as { es: unknown; en: unknown });
        for (const lang of LANGS) {
          const v = rec[lang];
          if (typeof v === 'string') expect(v, `${path}.${lang}`).not.toMatch(bad);
        }
        return;
      }
      for (const [k, v] of Object.entries(rec)) walk(v, `${path}.${k}`);
    };
    walk(SOCIAL_COPY, 'SOCIAL_COPY');
  });

  it('la unidad piloto s3u03 tiene los dos idiomas en cada pregunta, fuente y opción', () => {
    const unit = socialUnitById('s3u03')!;
    for (const s of unit.sources) {
      for (const lang of LANGS) {
        expect(s.title[lang], `${s.id}.title.${lang}`).toBeTruthy();
        expect(s.caption[lang], `${s.id}.caption.${lang}`).toBeTruthy();
      }
    }
    for (const step of unit.steps) {
      for (const lang of LANGS) expect(step.prompt[lang], `${step.id}.prompt.${lang}`).toBeTruthy();
      if (step.kind === 'fuente' || step.kind === 'testimonio') {
        for (const c of step.choices) for (const lang of LANGS) expect(c.text[lang], `${step.id}.${c.id}.${lang}`).toBeTruthy();
      }
      if (step.kind === 'revisar') {
        for (const c of step.choices) for (const lang of LANGS) expect(c.text[lang], `${step.id}.${c.id}.${lang}`).toBeTruthy();
      }
      if (step.kind === 'comparar') {
        for (const st of step.statements) for (const lang of LANGS) expect(st.text[lang], `${step.id}.${st.id}.${lang}`).toBeTruthy();
      }
    }
  });
});

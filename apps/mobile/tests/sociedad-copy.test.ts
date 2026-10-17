import { describe, expect, it } from 'vitest';
import { SOCIAL_UNITS } from '@lee-conmigo/social-content';
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

  it('cada unidad piloto (1.º–6.º) tiene los dos idiomas en cada pregunta, fuente y opción', () => {
    for (const unit of SOCIAL_UNITS) {
      for (const s of unit.sources) {
        for (const lang of LANGS) {
          expect(s.title[lang], `${unit.id}.${s.id}.title.${lang}`).toBeTruthy();
          expect(s.caption[lang], `${unit.id}.${s.id}.caption.${lang}`).toBeTruthy();
        }
      }
      for (const step of unit.steps) {
        for (const lang of LANGS) expect(step.prompt[lang], `${unit.id}.${step.id}.prompt.${lang}`).toBeTruthy();
        if (step.kind === 'fuente' || step.kind === 'testimonio' || step.kind === 'elegir' || step.kind === 'revisar') {
          for (const c of step.choices) for (const lang of LANGS) expect(c.text[lang], `${unit.id}.${step.id}.${c.id}.${lang}`).toBeTruthy();
        }
        if (step.kind === 'testimonio') {
          for (const lang of LANGS) expect(step.quote[lang], `${unit.id}.${step.id}.quote.${lang}`).toBeTruthy();
        }
        if (step.kind === 'comparar') {
          for (const st of step.statements) for (const lang of LANGS) expect(st.text[lang], `${unit.id}.${step.id}.${st.id}.${lang}`).toBeTruthy();
        }
      }
    }
  });
});

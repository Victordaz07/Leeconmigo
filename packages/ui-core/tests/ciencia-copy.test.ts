import { describe, expect, it } from 'vitest';
import { chartDescription, CIENCIA_COPY, LADERA_ZONES, scienceStars, scienceStarsReason, type Loc } from '../src/index.ts';

/** Recorre CIENCIA_COPY y junta todos los textos (llamando a las funciones con datos de ejemplo). */
function collect(v: unknown, out: Loc[] = []): Loc[] {
  if (typeof v === 'function') {
    const r = (v as (...a: never[]) => unknown)(...([1, 2] as never[]));
    if (typeof r === 'string') return out;
    return collect(r, out);
  }
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.es === 'string' && typeof o.en === 'string') out.push(o as unknown as Loc);
    else for (const x of Object.values(o)) collect(x, out);
  }
  return out;
}

describe('textos de la interfaz de Ciencia', () => {
  it('cada texto existe en español e inglés, sin huecos y sin «incorrecto»', () => {
    const all = [...collect(CIENCIA_COPY), ...collect(LADERA_ZONES)];
    expect(all.length).toBeGreaterThan(90);
    for (const t of all) {
      expect(t.es.trim(), t.es).not.toBe('');
      expect(t.en.trim(), t.en).not.toBe('');
      expect(t.es + t.en).not.toMatch(/incorrect|undefined|NaN|\{|\}/i);
    }
  });

  it('las cuatro píldoras y los marcos de frase del informe están', () => {
    expect(Object.values(CIENCIA_COPY.phase).map((p) => p.es)).toEqual(['Observa', 'Explora', 'Explica', 'Usa']);
    expect(CIENCIA_COPY.frame.observed).toEqual({ es: 'Observé…', en: 'I observed…' });
    expect(CIENCIA_COPY.frame.evidence.es).toBe('Mi evidencia es…');
    expect(CIENCIA_COPY.badge.practiceMap.es).toBe('Mapa de práctica: no es un lugar real');
  });

  it('la gráfica se describe con palabras para el lector de pantalla, en cada idioma', () => {
    const rows = [{ label: 'Sin cobertura', values: [18, 20, 19] }, { label: 'Con cobertura', values: [6, 7, 5] }];
    expect(chartDescription(rows, 'es')).toBe('Sin cobertura: 18, 20 y 19 gramos. Con cobertura: 6, 7 y 5 gramos.');
    expect(chartDescription([{ label: 'No cover', values: [6, 7, 5] }], 'en')).toBe('No cover: 6, 7 and 5 grams.');
    expect(chartDescription([{ label: 'Una', values: [4] }], 'es')).toBe('Una: 4 gramos.');
  });

  it('estrellas por esfuerzo: 1 por terminar, +1 pista o revisar la idea, +1 volver a probar; sin terminar no hay', () => {
    expect(scienceStars({ finished: false, usedHintOrRevised: true, triedAgain: true })).toBe(0);
    expect(scienceStars({ finished: true, usedHintOrRevised: false, triedAgain: false })).toBe(1);
    expect(scienceStars({ finished: true, usedHintOrRevised: true, triedAgain: false })).toBe(2);
    expect(scienceStars({ finished: true, usedHintOrRevised: false, triedAgain: true })).toBe(2);
    expect(scienceStars({ finished: true, usedHintOrRevised: true, triedAgain: true })).toBe(3);
    for (const a of [true, false]) for (const b of [true, false]) {
      const r = scienceStarsReason({ usedHintOrRevised: a, triedAgain: b });
      expect(r.es.trim() && r.en.trim()).toBeTruthy();
    }
  });
});

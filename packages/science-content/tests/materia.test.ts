import { describe, expect, it } from 'vitest';
import {
  JAR_WITH_WATER_G,
  KNOWN_SAMPLES,
  LAB_SUBSTANCES,
  MATTER_MODEL,
  MYSTERY_IS,
  PROPS,
  SAMPLES,
  SUBSTANCES,
  SUBSTANCE_G,
  WEIGH_STEPS,
  confusableWith,
  dissolves,
  observed,
  remainingAfter,
  scaleReading,
  stillVisible,
  totalAfter,
  totalBefore,
} from '../src/labs/materia.ts';

describe('modelo de la masa (frasco cerrado)', () => {
  it('la balanza lee en gramos enteros: frasco, sustancia aparte y total', () => {
    for (const s of SUBSTANCES) {
      expect(scaleReading(s, 0)).toBe(0);
      expect(scaleReading(s, 1)).toBe(JAR_WITH_WATER_G);
      expect(scaleReading(s, 2)).toBe(SUBSTANCE_G[s]);
      for (const n of [scaleReading(s, 3), scaleReading(s, 4)]) expect(Number.isInteger(n)).toBe(true);
    }
  });
  it('en un frasco cerrado la masa total no cambia al echar ni al disolver (conservación)', () => {
    for (const s of SUBSTANCES) {
      expect(totalBefore(s)).toBe(JAR_WITH_WATER_G + SUBSTANCE_G[s]);
      expect(scaleReading(s, 3)).toBe(totalBefore(s));
      expect(totalAfter(s)).toBe(totalBefore(s));
    }
  });
  it('los datos son los que citan los textos: sal 230 g, azúcar 235 g, hielo 240 g', () => {
    expect(totalAfter('sal')).toBe(230);
    expect(totalAfter('azucar')).toBe(235);
    expect(totalAfter('hielo')).toBe(240);
  });
  it('las acciones son cuatro y solo se ven los cristales justo al echar', () => {
    expect(WEIGH_STEPS).toHaveLength(4);
    expect([0, 1, 2, 3, 4].filter(stillVisible)).toEqual([3]);
  });
  it('en el laboratorio solo se echan sal y azúcar', () => {
    expect([...LAB_SUBSTANCES]).toEqual(['sal', 'azucar']);
  });
});

describe('propiedades de las muestras', () => {
  it('hay cuatro muestras conocidas y una X', () => {
    expect([...SAMPLES]).toEqual(['sal', 'azucar', 'arena', 'harina', 'X']);
    expect(KNOWN_SAMPLES).toHaveLength(4);
  });
  it('la muestra X da lo que da el azúcar, sin que la X lo diga', () => {
    expect(MYSTERY_IS).toBe('azucar');
    for (const p of PROPS) expect(observed('X', p)).toEqual(observed('azucar', p));
  });
  it('solo la sal y el azúcar se disuelven', () => {
    expect(KNOWN_SAMPLES.filter(dissolves)).toEqual(['sal', 'azucar']);
    expect(dissolves('X')).toBe(true);
  });
  it('el color solo NO identifica la X: la sal, el azúcar y la harina también son blancas', () => {
    expect(confusableWith('X', 'color')).toEqual(['sal', 'azucar', 'harina']);
  });
  it('«en agua» solo deja dos posibles y los granitos con la lupa distinguen la X', () => {
    expect(confusableWith('X', 'agua')).toEqual(['sal', 'azucar']);
    expect(confusableWith('X', 'granitos')).toEqual(['azucar']);
  });
  it('combinar dos pruebas deja una sola posibilidad: el azúcar', () => {
    expect(remainingAfter(['color'])).toHaveLength(3);
    expect(remainingAfter(['agua'])).toHaveLength(2);
    expect(remainingAfter(['agua', 'granitos'])).toEqual(['azucar']);
    expect(remainingAfter(['color', 'agua'])).toEqual(['sal', 'azucar']);
  });
  it('cada observación está en los dos idiomas', () => {
    for (const s of SAMPLES) for (const p of PROPS) {
      const o = observed(s, p);
      expect(o.es.trim() && o.en.trim()).toBeTruthy();
    }
  });
  it('el modelo dice qué NO representa (frasco abierto, reacciones, probar con la boca)', () => {
    expect(MATTER_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(3);
    expect(MATTER_MODEL.doesNotRepresent.some((t) => /abierto/.test(t.es))).toBe(true);
    expect(MATTER_MODEL.doesNotRepresent.some((t) => /boca/.test(t.es))).toBe(true);
  });
});

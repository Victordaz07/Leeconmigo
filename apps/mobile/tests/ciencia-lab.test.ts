import { describe, expect, it } from 'vitest';
import { LADERA_DATASETS, scienceUnitContent, type ScienceUnit } from '@lee-conmigo/science-content';
import { gramsFor, trayViews, trialsFor, SLOPE_DEG, MAX_GRAMS } from '../src/subjects/ciencia/lab-model';

const unit = scienceUnitContent('C4-U06') as ScienceUnit;
const steps = unit.sessions.flatMap((s) => s.steps);
const lab = (id: string) => steps.find((s) => s.id === id)!.lab!;

describe('modelo del laboratorio → lo que se dibuja', () => {
  it('los gramos de cada bandeja coinciden con los conjuntos de datos (nunca escritos a mano)', () => {
    expect(trialsFor(lab('s3.1'), 'a')).toEqual(LADERA_DATASETS.base.rows[0].values);
    expect(trialsFor(lab('s3.1'), 'b')).toEqual(LADERA_DATASETS.base.rows[1].values);
    expect(trialsFor(lab('s6.1'), 'a')).toEqual(LADERA_DATASETS.mixta.rows[0].values);
    expect(trialsFor(lab('s6.1'), 'b')).toEqual(LADERA_DATASETS.mixta.rows[1].values);
    const fixed = steps.find((s) => s.id === 's6.2')!.labFixed!;
    expect(trialsFor(fixed.pendiente, 'a')).toEqual(LADERA_DATASETS.justaCobertura.rows[0].values);
    expect(trialsFor(fixed.pendiente, 'b')).toEqual(LADERA_DATASETS.justaCobertura.rows[1].values);
    expect(trialsFor(fixed.cobertura, 'a')).toEqual(LADERA_DATASETS.justaPendiente.rows[0].values);
    expect(trialsFor(fixed.cobertura, 'b')).toEqual(LADERA_DATASETS.justaPendiente.rows[1].values);
  });

  it('antes de regar los vasos están vacíos; después se ve más tierra donde no hay cobertura', () => {
    const [a0, b0] = trayViews(lab('s2.3'), 0, 'es');
    expect(a0.level).toBeNull();
    expect(b0.level).toBeNull();
    const [a1, b1] = trayViews(lab('s2.3'), 1, 'es');
    expect(a1.level!).toBeGreaterThan(b1.level!);
    expect(a1.cupCaption).toBe('mucha tierra');
    expect(b1.cupCaption).toBe('poca tierra');
  });

  it('cada bandeja se puede LEER (cobertura e inclinación en texto), en los dos idiomas', () => {
    const [a, b] = trayViews(lab('s6.1'), 0, 'en');
    expect(a.caption).toBe('No cover · Steep slope');
    expect(b.caption).toBe('With cover · Gentle slope');
    expect(trayViews(lab('s6.1'), 0, 'es')[0].caption).toBe('Sin cobertura · Muy inclinada');
  });

  it('la inclinación dibujada crece con la inclinación del modelo y todo cabe en el eje', () => {
    expect(SLOPE_DEG.suave).toBeLessThan(SLOPE_DEG.media);
    expect(SLOPE_DEG.media).toBeLessThan(SLOPE_DEG.fuerte);
    for (const s of steps) for (const l of [s.lab, ...Object.values(s.labFixed ?? {})]) if (l) for (const side of ['a', 'b'] as const) for (let t = 0; t < 3; t++) expect(gramsFor(l, side, t)).toBeLessThanOrEqual(MAX_GRAMS);
  });
});

describe('mapa de práctica → lo que se dibuja', () => {
  it('la franja solo existe si la herramienta está encendida y cubre las casillas cercanas a la cordillera', async () => {
    const { PRACTICE_MAPS, bandCount } = await import('@lee-conmigo/science-content');
    const { mapView } = await import('../src/subjects/ciencia/lab-model');
    expect(mapView(PRACTICE_MAPS.A, false).band).toEqual([]);
    const v = mapView(PRACTICE_MAPS.A, true);
    expect(v.band!.length).toBeGreaterThan(PRACTICE_MAPS.A.range.length);
    const inside = new Set(v.band!.map((c) => `${c.col},${c.row}`));
    // El recuento que ve el niño al contar dentro de la franja es el que calcula la app (13 de 15).
    expect(v.quakes.filter((q) => inside.has(`${q.col},${q.row}`)).length).toBe(bandCount(PRACTICE_MAPS.A).inside);
  });
});

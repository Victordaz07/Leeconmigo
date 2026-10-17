import { describe, expect, it } from 'vitest';
import { ACTION_NAME, DEVICES, DEVICE_MODEL, DEVICE_NAME, ENERGY_MODEL, EXTRA_DEVICES, FORMS, FORM_NAME, NOTICED, diagramCheck, kindOf } from '../src/labs/transferencias.ts';

describe('dispositivos de energía: lo que entra y lo que sale', () => {
  it('la lámpara transforma electricidad en luz y calor', () => {
    expect(DEVICE_MODEL.bombilla).toEqual({ entra: 'electricidad', sale: ['luz', 'calor'], action: 'conectar' });
    expect(kindOf('bombilla')).toBe('transforma');
  });

  it('la campana transforma movimiento en sonido y el molinete transfiere movimiento', () => {
    expect(DEVICE_MODEL.campana.sale).toEqual(['sonido']);
    expect(kindOf('campana')).toBe('transforma');
    expect(DEVICE_MODEL.molinete.sale).toEqual(['movimiento']);
    expect(kindOf('molinete')).toBe('transfiere');
  });

  it('el diagrama del niño se compara con el modelo: bien, falta algo, sobra algo o entra otra cosa', () => {
    expect(diagramCheck('bombilla', 'electricidad', ['luz', 'calor']).ok).toBe(true);
    expect(diagramCheck('bombilla', 'electricidad', ['calor', 'luz']).ok).toBe(true);
    expect(diagramCheck('bombilla', 'electricidad', ['luz'])).toMatchObject({ ok: false, missing: ['calor'], extra: [], entraOk: true });
    expect(diagramCheck('bombilla', 'electricidad', ['luz', 'calor', 'sonido'])).toMatchObject({ ok: false, extra: ['sonido'] });
    expect(diagramCheck('campana', 'sonido', ['sonido'])).toMatchObject({ ok: false, entraOk: false });
    expect(diagramCheck('molinete', null, [])).toMatchObject({ ok: false, entraOk: false, missing: ['movimiento'] });
  });

  it('todo lo que sale es una forma conocida y nada sale sin que algo entre', () => {
    for (const d of DEVICES) {
      expect(FORMS).toContain(DEVICE_MODEL[d].entra);
      expect(DEVICE_MODEL[d].sale.length).toBeGreaterThan(0);
      for (const f of DEVICE_MODEL[d].sale) expect(FORMS).toContain(f);
    }
    expect(EXTRA_DEVICES.tostador.sale).toContain('calor');
    expect(EXTRA_DEVICES.timbre.sale).toEqual(['sonido']);
  });

  it('hay nombres, lo que se nota y los límites del modelo en ES y EN', () => {
    for (const t of [...FORMS.map((f) => FORM_NAME[f]), ...DEVICES.map((d) => DEVICE_NAME[d]), ...Object.values(ACTION_NAME), ...DEVICES.flatMap((d) => NOTICED[d]), ENERGY_MODEL.represents, ...ENERGY_MODEL.assumptions, ...ENERGY_MODEL.doesNotRepresent, ...ENERGY_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
  });
});

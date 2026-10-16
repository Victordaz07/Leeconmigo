import { describe, expect, it } from 'vitest';
import { gateKey, gateMessage, gateSubmit, isLocked, MAX_PIN_ATTEMPTS, PIN_LOCK_SECONDS, startGate, type GateState, type PinKey } from '../src/index.ts';

const type = (s: GateState, pin: string, now = 0) => [...pin].reduce((acc, k) => gateKey(acc, k as PinKey, now), s);

describe('candado de padres (P1)', () => {
  it('sin PIN guardado: crear, confirmar y abrir', () => {
    let s = startGate(null);
    expect(s.phase).toBe('create');
    s = gateSubmit(type(s, '2580'), null, 0);
    expect(s.phase).toBe('confirm');
    s = gateSubmit(type(s, '2580'), null, 0);
    expect(s.phase).toBe('open');
    expect(s.created).toBe('2580');
  });

  it('si la confirmación no coincide, vuelve a empezar con un mensaje neutro', () => {
    let s = gateSubmit(type(startGate(null), '1111'), null, 0);
    s = gateSubmit(type(s, '2222'), null, 0);
    expect(s.phase).toBe('create');
    expect(s.first).toBeNull();
    expect(gateMessage(s.message)).not.toMatch(/incorrect|error/i);
  });

  it('con PIN: abre solo con el correcto', () => {
    let s = gateSubmit(type(startGate('4321'), '1234'), '4321', 0);
    expect(s.phase).toBe('enter');
    expect(s.message).toBe('wrong');
    s = gateSubmit(type(s, '4321'), '4321', 0);
    expect(s.phase).toBe('open');
    expect(s.created).toBeNull();
  });

  it('el teclado acepta 4 dígitos como máximo y borra con ⌫; ✓ no hace nada si falta alguno', () => {
    let s = type(startGate(null), '123456');
    expect(s.digits).toBe('1234');
    s = gateKey(s, 'back', 0);
    expect(s.digits).toBe('123');
    expect(gateSubmit(s, null, 0)).toBe(s);
  });

  it(`tras ${MAX_PIN_ATTEMPTS} intentos espera ${PIN_LOCK_SECONDS} s y luego deja seguir`, () => {
    let s = startGate('0000');
    for (let i = 0; i < MAX_PIN_ATTEMPTS; i++) s = gateSubmit(type(s, '9999', 1000), '0000', 1000);
    expect(s.message).toBe('locked');
    expect(isLocked(s, 1000 + PIN_LOCK_SECONDS * 1000 - 1)).toBe(true);
    expect(gateKey(s, '0', 2000)).toBe(s);
    const later = 1000 + PIN_LOCK_SECONDS * 1000;
    s = gateSubmit(type(s, '0000', later), '0000', later);
    expect(s.phase).toBe('open');
  });
});

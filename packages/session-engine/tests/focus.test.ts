import { describe, expect, it } from 'vitest';
import { DEFAULT_FOCUS, FOCUS_OFF, FOCUS_ON, inSchedule, normalizeFocus, resolveFocus } from '../src/index.ts';

// 2026-10-16 es viernes (día 5).
const at = (day: string, time: string) => new Date(`2026-10-${day}T${time}:00`);

describe('Modo Enfoque', () => {
  it('Apagado, Encendido y Personalizado dan sus apoyos', () => {
    expect(resolveFocus({ mode: 'off', custom: FOCUS_ON })).toEqual(FOCUS_OFF);
    expect(resolveFocus({ mode: 'on', custom: { reducedMotion: false, roundSize: 9 } })).toEqual(FOCUS_ON);
    expect(resolveFocus({ mode: 'custom', custom: { reducedMotion: false, roundSize: 3 } })).toEqual({ reducedMotion: false, roundSize: 3 });
  });

  it('un perfil sin Modo Enfoque (guardado antes) queda apagado; datos a medias se completan', () => {
    expect(resolveFocus(undefined)).toEqual(FOCUS_OFF);
    expect(normalizeFocus(null)).toEqual(DEFAULT_FOCUS);
    expect(normalizeFocus({ mode: 'custom', custom: { roundSize: 99 } as never })).toEqual({ mode: 'custom', custom: { reducedMotion: true, roundSize: 4 } });
    expect(normalizeFocus({ mode: 'raro' as never }).mode).toBe('off');
  });

  it('con horario, solo se enciende dentro de él', () => {
    const schedule = { days: [1, 2, 3, 4, 5], from: '15:00', to: '19:00' };
    expect(resolveFocus({ mode: 'on', custom: FOCUS_ON, schedule }, at('16', '16:30'))).toEqual(FOCUS_ON);
    expect(resolveFocus({ mode: 'on', custom: FOCUS_ON, schedule }, at('16', '19:00'))).toEqual(FOCUS_OFF);
    expect(resolveFocus({ mode: 'on', custom: FOCUS_ON, schedule }, at('16', '14:59'))).toEqual(FOCUS_OFF);
    // Sábado.
    expect(resolveFocus({ mode: 'on', custom: FOCUS_ON, schedule }, at('17', '16:30'))).toEqual(FOCUS_OFF);
  });

  it('un horario que cruza la medianoche cuenta para el día en que empieza', () => {
    const night = { days: [5], from: '22:00', to: '06:00' };
    expect(inSchedule(night, at('16', '23:00'))).toBe(true);
    expect(inSchedule(night, at('17', '05:00'))).toBe(true);
    expect(inSchedule(night, at('16', '05:00'))).toBe(false);
    expect(inSchedule({ days: [5], from: '25:00', to: '06:00' }, at('16', '23:00'))).toBe(false);
  });
});

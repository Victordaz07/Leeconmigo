// @vitest-environment jsdom
/**
 * "Modo padres" (docs/01, docs/09 #1/#3): candado con PIN + idioma, nivel (libre, sin desbloqueos) y meta diaria.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { copy, ParentGateScreen, ParentSettingsScreen } from '../src/index.ts';

afterEach(cleanup);

const press = (label: string) => fireEvent.click(screen.getByRole('button', { name: label }));
const type4 = (digits: string) => [...digits].forEach((d) => press(d));

describe('ParentGateScreen: crear PIN', () => {
  it('pide el PIN dos veces y solo llama a onCreate si coinciden', () => {
    const onCreate = vi.fn();
    render(<ParentGateScreen hasPin={false} onVerify={() => false} onCreate={onCreate} onCancel={() => {}} />);
    expect(screen.getByText(copy.parentGate.createTitle)).toBeTruthy();
    type4('1234');
    expect(screen.getByText(copy.parentGate.confirmTitle)).toBeTruthy();
    type4('1234');
    expect(onCreate).toHaveBeenCalledWith('1234');
  });

  it('si la segunda vez no coincide, avisa y vuelve a pedirlo desde el principio (sin crearlo)', () => {
    const onCreate = vi.fn();
    render(<ParentGateScreen hasPin={false} onVerify={() => false} onCreate={onCreate} onCancel={() => {}} />);
    type4('1234');
    type4('9999');
    expect(screen.getByText(copy.parentGate.mismatch)).toBeTruthy();
    expect(screen.getByText(copy.parentGate.createTitle)).toBeTruthy(); // vuelve a "enter"
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('el borrador quita el último dígito', () => {
    const onCreate = vi.fn();
    render(<ParentGateScreen hasPin={false} onVerify={() => false} onCreate={onCreate} onCancel={() => {}} />);
    type4('129');
    press('Borrar');
    type4('34');
    expect(screen.getByText(copy.parentGate.confirmTitle)).toBeTruthy();
    type4('1234');
    expect(onCreate).toHaveBeenCalledWith('1234');
  });
});

describe('ParentGateScreen: verificar PIN existente', () => {
  it('con el PIN correcto entra (onVerify → true); "Volver" cancela sin pedir nada', () => {
    const onVerify = vi.fn((pin: string) => pin === '4321');
    const onCancel = vi.fn();
    render(<ParentGateScreen hasPin onVerify={onVerify} onCreate={() => {}} onCancel={onCancel} />);
    expect(screen.getByText(copy.parentGate.enterTitle)).toBeTruthy();
    type4('4321');
    expect(onVerify).toHaveBeenCalledWith('4321');
    fireEvent.click(screen.getByRole('button', { name: copy.parentGate.cancel }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('con el PIN incorrecto avisa y deja escribir de nuevo, sin llamar onCreate', () => {
    const onVerify = vi.fn(() => false);
    const onCreate = vi.fn();
    render(<ParentGateScreen hasPin onVerify={onVerify} onCreate={onCreate} onCancel={() => {}} />);
    type4('0000');
    expect(screen.getByText(copy.parentGate.wrong)).toBeTruthy();
    expect(onCreate).not.toHaveBeenCalled();
    type4('1234');
    expect(onVerify).toHaveBeenCalledTimes(2);
  });
});

describe('ParentSettingsScreen', () => {
  const base = { childName: 'Noah', language: 'es' as const, level: 2, dailyGoalMinutes: 15, freeReading: false, onSetChildName: () => {}, onSetFreeReading: () => {}, onChangePin: () => {}, onBack: () => {} };

  it('el nombre del niño se puede editar (Inicio/Progreso saludan con este nombre)', () => {
    const onSetChildName = vi.fn();
    render(<ParentSettingsScreen {...base} onSetChildName={onSetChildName} onSetLanguage={() => {}} onSetLevel={() => {}} onSetDailyGoal={() => {}} />);
    const input = screen.getByDisplayValue('Noah');
    fireEvent.change(input, { target: { value: 'Sofía' } });
    expect(onSetChildName).toHaveBeenCalledWith('Sofía');
  });

  it('cambia idioma y nivel libremente (docs/01: el padre elige, sin niveles bloqueados)', () => {
    const onSetLanguage = vi.fn();
    const onSetLevel = vi.fn();
    render(<ParentSettingsScreen {...base} onSetLanguage={onSetLanguage} onSetLevel={onSetLevel} onSetDailyGoal={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(onSetLanguage).toHaveBeenCalledWith('en');
    for (let n = 1; n <= 6; n++) expect(screen.getByText(`Nivel ${n}`)).toBeTruthy(); // los 6, ninguno "Bloqueado"
    expect(screen.queryByText('Bloqueado')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Nivel 5/ }));
    expect(onSetLevel).toHaveBeenCalledWith(5);
  });

  it('la meta diaria tiene los presets de docs/01 y un botón "Cambiar PIN"', () => {
    const onSetDailyGoal = vi.fn();
    const onChangePin = vi.fn();
    render(<ParentSettingsScreen {...base} onSetLanguage={() => {}} onSetLevel={() => {}} onSetDailyGoal={onSetDailyGoal} onChangePin={onChangePin} />);
    for (const m of [5, 10, 15, 20, 30]) expect(screen.getByText(`${m} min`)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '20 min' }));
    expect(onSetDailyGoal).toHaveBeenCalledWith(20);
    fireEvent.click(screen.getByRole('button', { name: copy.parentSettings.changePin }));
    expect(onChangePin).toHaveBeenCalled();
  });

  it('"Volver" (arriba y abajo) llama a onBack', () => {
    const onBack = vi.fn();
    render(<ParentSettingsScreen {...base} onSetLanguage={() => {}} onSetLevel={() => {}} onSetDailyGoal={() => {}} onBack={onBack} />);
    for (const btn of screen.getAllByRole('button', { name: /Volver/ })) fireEvent.click(btn);
    expect(onBack).toHaveBeenCalledTimes(2);
  });
});

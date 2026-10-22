import { describe, expect, it } from 'vitest';
import { assigned, checkOffer, finalBalance, formatUM, freeable, isMovement, isUM, isValidPlan, ledgerChecks, moveBetween, notedVsReal, opportunityCost, payUnexpected, planIssues, protects, runLedger, unassigned, viableOptions, type Movement, type Option, type Plan } from '../src/index.ts';

const mv = (id: string, kind: 'in' | 'out', amount: number): Movement => ({ id, concept: id, kind, amount });

describe('dinero ficticio', () => {
  it('UM son enteros no negativos y se escriben «N UM»', () => {
    expect(isUM(0)).toBe(true);
    expect(isUM(12)).toBe(true);
    expect(isUM(-1)).toBe(false);
    expect(isUM(1.5)).toBe(false);
    expect(formatUM(12)).toBe('12 UM');
  });
});

describe('F4.3 · un registro en orden (ejemplos del manual)', () => {
  const start = 50;
  const movs = [mv('compra1', 'out', 18), mv('ingreso', 'in', 12), mv('compra2', 'out', 9)];
  it('saldo inicial 50; −18 → 32; +12 → 44; −9 → 35', () => {
    expect(runLedger(start, movs).map((r) => r.balance)).toEqual([32, 44, 35]);
    expect(finalBalance(start, movs)).toBe(35);
    expect(ledgerChecks(start, movs)).toBe(true);
  });
  it('práctica a: saldo 40, salida 11, entrada 6, salida 8 → 27', () => {
    expect(finalBalance(40, [mv('a', 'out', 11), mv('b', 'in', 6), mv('c', 'out', 8)])).toBe(27);
  });
  it('práctica b: si falta una compra de 5, el saldo anotado queda POR ENCIMA en 5', () => {
    const r = notedVsReal(40, [mv('a', 'out', 11)], mv('falta', 'out', 5));
    expect(r.direction).toBe('above');
    expect(r.diff).toBe(5);
  });
  it('el orden importa: pagar sin dinero se marca con una pista, no como error', () => {
    const rows = runLedger(10, [mv('x', 'out', 15), mv('y', 'in', 20)]);
    expect(rows[0]!.short).toBe(true);
    expect(rows[1]!.short).toBe(false);
  });
  it('un movimiento tiene monto entero mayor que cero', () => {
    expect(isMovement(mv('a', 'out', 5))).toBe(true);
    expect(isMovement(mv('a', 'out', 0))).toBe(false);
    expect(isMovement({ id: 'a', concept: 'a', kind: 'x', amount: 3 })).toBe(false);
  });
});

describe('F4.4 / F4.8 · sobres, reserva e imprevistos', () => {
  const plan: Plan = {
    budget: 80,
    envelopes: [
      { id: 'act', label: 'activity', kind: 'essential', amount: 50, cost: 50 },
      { id: 'res', label: 'reserve', kind: 'reserve', amount: 20 },
      { id: 'free', label: 'free', kind: 'free', amount: 10 },
    ],
  };
  it('el plan de ejemplo es válido y reparte todo', () => {
    expect(isValidPlan(plan)).toBe(true);
    expect(assigned(plan)).toBe(80);
    expect(unassigned(plan)).toBe(0);
  });
  it('una reparación de 12 se paga desde la reserva: quedan 8 y lo libre no cambia', () => {
    const r = payUnexpected(plan, 12);
    expect(r.paidFromReserve).toBe(12);
    expect(r.shortfall).toBe(0);
    expect(r.plan.envelopes.find((e) => e.id === 'res')!.amount).toBe(8);
    expect(r.plan.envelopes.find((e) => e.id === 'free')!.amount).toBe(10);
  });
  it('una reparación de 25 con reserva de 20: faltan 5 y hay opciones (dinero libre, opcionales)', () => {
    const r = payUnexpected(plan, 25);
    expect(r.shortfall).toBe(5);
    expect(freeable(plan)).toBe(10);
  });
  it('sin sobre de reserva, todo el imprevisto es faltante', () => {
    const none: Plan = { budget: 30, envelopes: [{ id: 'a', label: 'a', kind: 'essential', amount: 30, cost: 30 }] };
    expect(payUnexpected(none, 7).shortfall).toBe(7);
  });
  it('un plan que reparte de más o no cubre lo esencial NO es válido (claves, no reproches)', () => {
    expect(planIssues({ ...plan, envelopes: plan.envelopes.map((e) => (e.id === 'free' ? { ...e, amount: 20 } : e)) })).toEqual(['over-budget']);
    expect(planIssues({ ...plan, envelopes: plan.envelopes.map((e) => (e.id === 'act' ? { ...e, amount: 40 } : e)) })).toEqual(['essential-uncovered']);
  });
  it('mover dinero entre sobres: solo si alcanza', () => {
    expect(moveBetween(plan, 'res', 'free', 5).envelopes.find((e) => e.id === 'free')!.amount).toBe(15);
    expect(moveBetween(plan, 'res', 'free', 99)).toBe(plan);
    expect(moveBetween(plan, 'res', 'res', 1)).toBe(plan);
  });

  // Proyecto F4.8: 100 UM; esenciales 45 y 20; decoración opcional 15; reserva 20; aparece un gasto necesario de 25
  const project: Plan = {
    budget: 100,
    envelopes: [
      { id: 'mat', label: 'materials', kind: 'essential', amount: 45, cost: 45 },
      { id: 'trans', label: 'transport', kind: 'essential', amount: 20, cost: 20 },
      { id: 'deco', label: 'decoration', kind: 'optional', amount: 15, cost: 15 },
      { id: 'res', label: 'reserve', kind: 'reserve', amount: 20 },
    ],
  };
  it('F4.8: el plan inicial es válido; no se puede «sumar 25» sin quitar de otro lado', () => {
    expect(isValidPlan(project)).toBe(true);
    expect(assigned(project) + 25).toBe(125);
  });
  it('F4.8 ejemplo: usar la reserva (20) y bajar la decoración de 15 a 10 cubre el gasto de 25', () => {
    const r = payUnexpected(project, 25);
    expect(r.shortfall).toBe(5);
    const adjusted = moveBetween(r.plan, 'deco', 'res', 5); // quita 5 de decoración; esos 5 cubren el faltante
    expect(adjusted.envelopes.find((e) => e.id === 'deco')!.amount).toBe(10);
    const spent = 20 + 5; // reserva agotada + 5 de decoración
    expect(spent).toBe(25);
  });
  it('F4.8 otro plan válido: sin decoración, gasto de 25 y 10 de reserva = 100', () => {
    const alt: Plan = { budget: 100, envelopes: [project.envelopes[0]!, project.envelopes[1]!, { id: 'unexp', label: 'unexpected', kind: 'essential', amount: 25, cost: 25 }, { id: 'res', label: 'reserve', kind: 'reserve', amount: 10 }] };
    expect(isValidPlan(alt)).toBe(true);
    expect(assigned(alt)).toBe(100);
    expect(protects(alt).reserve).toBe(10);
    expect(protects(project).optionalKept).toBe(15);
  });
});

describe('F4.2 · costo de oportunidad (ejemplo: 20 UM; A 15, B 18, C 30)', () => {
  const opts: Option[] = [{ id: 'A', label: 'A', cost: 15 }, { id: 'B', label: 'B', cost: 18 }, { id: 'C', label: 'C', cost: 30 }];
  it('C no cabe; prefieres A y luego B: eliges A → mejor alternativa descartada B; sobran 5', () => {
    expect(viableOptions(20, opts).map((o) => o.id)).toEqual(['A', 'B']);
    const r = opportunityCost(20, opts, ['A', 'B', 'C'], 'A');
    expect(r.bestDiscarded?.id).toBe('B');
    expect(r.notViable.map((o) => o.id)).toEqual(['C']);
    expect(r.leftover).toBe(5);
  });
  it('si prefieres B y eliges B, lo que dejas es A (práctica a); las 2 UM que sobran no desaparecen (práctica b)', () => {
    const r = opportunityCost(20, opts, ['B', 'A', 'C'], 'B');
    expect(r.bestDiscarded?.id).toBe('A');
    expect(r.leftover).toBe(2);
  });
  it('una opción imposible no es la alternativa sacrificada ni se puede «elegir»', () => {
    const r = opportunityCost(20, opts, ['C', 'A', 'B'], 'C');
    expect(r.chosen).toBeUndefined();
    expect(r.leftover).toBe(20);
    const ok = opportunityCost(20, opts, ['C', 'A', 'B'], 'A');
    expect(ok.bestDiscarded?.id).toBe('B'); // C está primero en tus preferencias pero no cabía: no cuenta
  });
});

describe('F4.7 · oferta sospechosa', () => {
  const offer = { id: 'ganaste', signals: ['tooGood', 'prepay', 'secrecy', 'urgency'] as const };
  it('marcar todas y solo las que están es exacto', () => {
    const r = checkOffer({ id: offer.id, signals: [...offer.signals] }, ['tooGood', 'prepay', 'secrecy', 'urgency']);
    expect(r.exact).toBe(true);
    expect(r.shouldStop).toBe(true);
  });
  it('marcar de menos o de más se señala sin «incorrecto»: qué falta y qué sobra', () => {
    const r = checkOffer({ id: offer.id, signals: [...offer.signals] }, ['prepay', 'personalData']);
    expect(r.found).toEqual(['prepay']);
    expect(r.extra).toEqual(['personalData']);
    expect(r.missed).toEqual(['tooGood', 'secrecy', 'urgency']);
    expect(r.exact).toBe(false);
  });
  it('un mensaje sin señales no pide parar (no todo mensaje es una estafa)', () => {
    expect(checkOffer({ id: 'normal', signals: [] }, []).shouldStop).toBe(false);
  });
});

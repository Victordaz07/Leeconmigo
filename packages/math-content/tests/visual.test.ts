import { describe, expect, it } from 'vitest';
import {
  buildVisualSession,
  canReveal,
  evaluateVisual,
  exerciseAttempt,
  exerciseReducer,
  generateVisual,
  initialWork,
  modelProblems,
  parallelExample,
  sharingCounts,
  solutionWork,
  startExercise,
  VISUAL_TEMPLATES,
  visualTemplateById,
  type SharingModel,
  type VisualInstance,
  type VisualWork,
} from '../src/index.ts';

const tpl = (id: string) => visualTemplateById(id)!;

/** Reparto de 12 galletas en 3 platos con la distribución pedida. */
function share(counts: number[], extraTray = 0): { m: SharingModel; w: VisualWork } {
  const inst = generateVisual(tpl('sharing.partitive'), 1);
  const m: SharingModel = { ...(inst.model as SharingModel), total: 12, groups: 3, perGroup: 4, remainder: 0, tokenIds: Array.from({ length: 12 }, (_, i) => `token-${i}`), containerIds: ['plate-0', 'plate-1', 'plate-2'] };
  const placement: Record<string, string | null> = {};
  let t = 0;
  counts.forEach((n, c) => {
    for (let i = 0; i < n; i++) placement[`token-${t++}`] = `plate-${c}`;
  });
  for (let i = 0; i < extraTray; i++) placement[`token-${t++}`] = null;
  return { m, w: { kind: 'sharing', placement, values: { answer: '4' } } };
}

describe('generador visual', () => {
  it('misma plantilla y semilla = mismo problema; 300 semillas por plantilla sin modelos imposibles', () => {
    for (const t of VISUAL_TEMPLATES) {
      expect(generateVisual(t, 42)).toEqual(generateVisual(t, 42));
      for (let seed = 1; seed <= 300; seed++) expect(modelProblems(generateVisual(t, seed).model)).toEqual([]);
    }
  });

  it('la solución de cada instancia se evalúa como correcta y el trabajo inicial no', () => {
    for (const t of VISUAL_TEMPLATES) {
      for (let seed = 1; seed <= 100; seed++) {
        const { model } = generateVisual(t, seed);
        expect(evaluateVisual(model, solutionWork(model)).outcome).toBe('correct');
        expect(evaluateVisual(model, initialWork(model)).outcome).not.toBe('correct');
      }
    }
  });

  it('dividir parte de grupos × cada uno (+ residuo), y en "hacer bolsas" hay una bolsa de más', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const q = generateVisual(tpl('sharing.quotative'), seed).model as SharingModel;
      expect(q.containerIds.length).toBe(q.groups + 1);
      const r = generateVisual(tpl('sharing.remainder'), seed).model as SharingModel;
      expect(r.remainder).toBeGreaterThan(0);
      expect(r.remainder).toBeLessThan(r.groups);
    }
  });

  it('una tanda de 3.º alterna familias y no trae bandejas de 1.º', () => {
    const s = buildVisualSession(3, 7, 6);
    expect(s).toHaveLength(6);
    expect(s.some((i) => i.model.kind === 'tenFrame')).toBe(false);
    expect(new Set(s.map((i) => i.model.kind)).size).toBeGreaterThan(1);
    for (let i = 1; i < s.length; i++) expect(s[i].templateId).not.toBe(s[i - 1].templateId);
  });
});

describe('reparto (casos de aceptación de la documentación §9)', () => {
  it('4,4,4 correcto · 5,4,3 comparar platos · 3,3,3 con 3 en la bandeja = seguir repartiendo', () => {
    const ok = share([4, 4, 4]);
    expect(evaluateVisual(ok.m, ok.w).outcome).toBe('correct');
    const uneven = share([5, 4, 3]);
    expect(evaluateVisual(uneven.m, uneven.w)).toMatchObject({ outcome: 'incorrect', feedbackKey: 'sharing.compareGroups' });
    const unfinished = share([3, 3, 3], 3);
    expect(evaluateVisual(unfinished.m, unfinished.w)).toMatchObject({ outcome: 'incomplete', feedbackKey: 'sharing.keepSharing' });
  });

  it('galleta de más, galleta ausente o plato inexistente = estado inválido (no es error del niño)', () => {
    const extra = share([4, 4, 4]);
    expect(evaluateVisual(extra.m, { ...extra.w, placement: { ...(extra.w as { placement: Record<string, string | null> }).placement, 'token-99': 'plate-0' } } as VisualWork).outcome).toBe('invalid');
    const missing = share([4, 4, 3]);
    expect(evaluateVisual(missing.m, missing.w).outcome).toBe('invalid');
    const ghost = share([4, 4, 4]);
    (ghost.w as { placement: Record<string, string | null> }).placement['token-0'] = 'plate-9';
    expect(evaluateVisual(ghost.m, ghost.w).outcome).toBe('invalid');
  });

  it('se puede poner una 5.ª galleta en un plato (para ver la desigualdad) y cada galleta está en un solo lugar', () => {
    const inst = generateVisual(tpl('sharing.partitive'), 3);
    let s = startExercise(inst);
    const m = inst.model as SharingModel;
    const first = m.tokenIds[0];
    for (let i = 0; i <= m.perGroup; i++) s = exerciseReducer(s, { type: 'work', action: { type: 'place', token: m.tokenIds[i], to: m.containerIds[0] } });
    s = exerciseReducer(s, { type: 'work', action: { type: 'place', token: first, to: m.containerIds[1] } });
    const { counts, tray } = sharingCounts(m, (s.work as { placement: Record<string, string | null> }).placement);
    expect(counts[0]).toBe(m.perGroup);
    expect(counts[1]).toBe(1);
    expect(tray + counts.reduce((a, b) => a + b, 0)).toBe(m.total);
  });

  it('con residuo pide cuántas sobran; en bolsas, una bolsa incompleta se queda en la bandeja', () => {
    const r = generateVisual(tpl('sharing.remainder'), 5).model as SharingModel;
    const sol = solutionWork(r);
    expect(evaluateVisual(r, { ...sol, values: { answer: sol.values.answer } }).feedbackKey).toBe('common.writeAll');
    expect(evaluateVisual(r, { ...sol, values: { ...sol.values, remainder: String(r.remainder + 1) } }).feedbackKey).toBe('sharing.countLeft');

    const q = generateVisual(tpl('sharing.quotative'), 5).model as SharingModel;
    const w = solutionWork(q) as Extract<VisualWork, { kind: 'sharing' }>;
    const placement = { ...w.placement };
    placement[q.tokenIds[0]] = q.containerIds[q.containerIds.length - 1]; // una galleta a la bolsa de más
    // Sin galletas en la bandeja, dos bolsas incompletas: hay que revisar el tamaño de las bolsas.
    expect(evaluateVisual(q, { ...w, placement })).toMatchObject({ outcome: 'incorrect', feedbackKey: 'sharing.fillBag' });
  });
});

describe('bandejas y grupos', () => {
  it('las fichas del enunciado no se pueden quitar; contar lo agregado', () => {
    const inst = generateVisual(tpl('tenFrame.complete10'), 4);
    const m = inst.model as Extract<VisualInstance['model'], { kind: 'tenFrame' }>;
    let s = startExercise(inst);
    s = exerciseReducer(s, { type: 'work', action: { type: 'toggleCell', index: 0 } });
    expect(s.history).toHaveLength(0);
    for (let i = m.start; i < 10; i++) s = exerciseReducer(s, { type: 'work', action: { type: 'toggleCell', index: i } });
    s = exerciseReducer(s, { type: 'work', action: { type: 'setValue', field: 'answer', value: '10' } });
    expect(exerciseReducer(s, { type: 'submit' }).evaluation?.feedbackKey).toBe('tenFrame.countAdded');
    s = exerciseReducer(s, { type: 'work', action: { type: 'setValue', field: 'answer', value: String(10 - m.start) } });
    expect(exerciseReducer(s, { type: 'submit' }).phase).toBe('solved');
  });

  it('grupos: cada parcela con lo mismo y el total; en "leer" escribe grupos, cada uno y total', () => {
    const b = generateVisual(tpl('groups.build'), 2).model as Extract<VisualInstance['model'], { kind: 'equalGroups' }>;
    const counts = Array(b.groups).fill(b.perGroup);
    counts[0] += 1;
    expect(evaluateVisual(b, { kind: 'equalGroups', counts, values: { answer: '1' } }).feedbackKey).toBe('groups.checkEach');
    const r = generateVisual(tpl('groups.read'), 2).model as Extract<VisualInstance['model'], { kind: 'equalGroups' }>;
    const w = initialWork(r);
    expect(evaluateVisual(r, { ...w, values: { groups: String(r.perGroup), perGroup: String(r.groups), answer: String(r.groups * r.perGroup) } }).feedbackKey).toBe('groups.countGroups');
  });

  it('el ejemplo paralelo de la ayuda usa otros números', () => {
    for (const t of VISUAL_TEMPLATES) {
      for (let seed = 1; seed <= 50; seed++) {
        const m = generateVisual(t, seed).model;
        const ex = parallelExample(m);
        if (m.kind === 'tenFrame') expect([ex.start, ex.added]).not.toEqual([m.start, m.target - m.start]);
        else expect([ex.groups, ex.perGroup]).not.toEqual([m.groups, m.perGroup]);
      }
    }
  });
});

describe('estado del ejercicio', () => {
  it('deshacer y empezar de nuevo no borran ayudas; cambiar algo retira el veredicto', () => {
    const inst = generateVisual(tpl('groups.build'), 9);
    let s = startExercise(inst);
    s = exerciseReducer(s, { type: 'hint' });
    s = exerciseReducer(s, { type: 'work', action: { type: 'addToGroup', group: 0 } });
    s = exerciseReducer(s, { type: 'submit' });
    expect(s.phase).toBe('reviewing');
    s = exerciseReducer(s, { type: 'work', action: { type: 'addToGroup', group: 1 } });
    expect(s.evaluation).toBeNull();
    s = exerciseReducer(s, { type: 'undo' });
    s = exerciseReducer(s, { type: 'reset' });
    expect(s.hintLevel).toBe(1);
    expect((s.work as { counts: number[] }).counts.every((c) => c === 0)).toBe(true);
  });

  it('resolver a la primera sin ayuda = evidencia independiente; ver la solución = vuelve en el repaso', () => {
    const inst = generateVisual(tpl('sharing.partitive'), 11);
    let s = startExercise(inst);
    s = { ...s, work: solutionWork(inst.model) };
    s = exerciseReducer(s, { type: 'submit' });
    expect(exerciseAttempt(s, '2026-10-16')).toMatchObject({ firstCorrect: true, maxHintLevel: 0, skipped: false });

    let t = startExercise(inst);
    expect(canReveal(t)).toBe(false);
    t = exerciseReducer(exerciseReducer(exerciseReducer(t, { type: 'hint' }), { type: 'hint' }), { type: 'hint' });
    expect(canReveal(t)).toBe(true);
    t = exerciseReducer(t, { type: 'reveal' });
    expect(exerciseAttempt(t, '2026-10-16')).toMatchObject({ firstCorrect: false, skipped: true });
  });
});

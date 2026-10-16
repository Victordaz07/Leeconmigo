/**
 * Trabajo del niño y su evaluación (documentación §7–§9). Todo puro: recibe la instancia y el trabajo, devuelve el
 * trabajo nuevo o un veredicto con una CLAVE de mensaje (el texto en ES/EN lo pone `ui-core`, nunca este código).
 *
 * Reglas: una acción de colocar siempre se acepta aunque el reparto todavía no sea correcto (poder hacer 5, 4, 3 permite
 * ver la desigualdad); un estado imposible es `invalid` y nunca se cuenta como error del niño.
 */
import { FAMILIES } from './families/index.ts';
import type { AnswerField, EqualGroupsModel, Evaluation, SharingModel, TenFrameModel, VisualModel, VisualWork, WorkAction } from './model.ts';

/** Las tres familias de la fase 1 viven en este archivo; el resto, en `families/` (mismo contrato). */
type LegacyModel = TenFrameModel | EqualGroupsModel | SharingModel;
const isLegacy = (m: VisualModel): m is LegacyModel => m.kind === 'tenFrame' || m.kind === 'equalGroups' || m.kind === 'sharing';
const family = (m: VisualModel) => {
  const f = FAMILIES[m.kind];
  if (!f) throw new Error(`Familia sin registrar: ${m.kind}`);
  return f;
};

export const MAX_FIELD_DIGITS = 3;

/** Casillas que pide cada tarea, en el orden en que se muestran. */
export function answerFields(m: VisualModel): AnswerField[] {
  if (!isLegacy(m)) return family(m).fields(m);
  if (m.kind === 'tenFrame') return m.task === 'show' ? [] : ['answer'];
  if (m.kind === 'equalGroups') return m.task === 'read' ? ['groups', 'perGroup', 'answer'] : ['answer'];
  return m.remainder > 0 ? ['answer', 'remainder'] : ['answer'];
}

/** Cuántas fichas por grupo caben como máximo al construir (para que el dibujo no se desborde). */
export const groupCapacity = (m: VisualModel) => (m.kind === 'equalGroups' ? Math.max(m.perGroup + 3, 9) : 0);

export function initialWork(m: VisualModel): VisualWork {
  if (!isLegacy(m)) return family(m).init(m);
  if (m.kind === 'tenFrame') return { kind: 'tenFrame', cells: Array.from({ length: m.capacity }, (_, i) => i < m.start), values: {} };
  if (m.kind === 'equalGroups') return { kind: 'equalGroups', counts: Array(m.groups).fill(m.task === 'read' ? m.perGroup : 0), values: {} };
  return { kind: 'sharing', placement: Object.fromEntries(m.tokenIds.map((id) => [id, null])), values: {} };
}

/** El trabajo resuelto (para "Ver solución"). */
export function solutionWork(m: VisualModel): VisualWork {
  if (!isLegacy(m)) return family(m).solution(m);
  if (m.kind === 'tenFrame') return { kind: 'tenFrame', cells: Array.from({ length: m.capacity }, (_, i) => i < m.target), values: m.task === 'show' ? {} : { answer: String(m.target - m.start) } };
  if (m.kind === 'equalGroups') {
    const values: VisualWork['values'] = { answer: String(m.groups * m.perGroup) };
    if (m.task === 'read') Object.assign(values, { groups: String(m.groups), perGroup: String(m.perGroup) });
    return { kind: 'equalGroups', counts: Array(m.groups).fill(m.perGroup), values };
  }
  const placement: Record<string, string | null> = {};
  m.tokenIds.forEach((id, i) => {
    const c = Math.floor(i / m.perGroup);
    placement[id] = i < m.groups * m.perGroup ? m.containerIds[m.mode === 'partitive' ? i % m.groups : c] : null;
  });
  const values: VisualWork['values'] = { answer: String(m.mode === 'partitive' ? m.perGroup : m.groups) };
  if (m.remainder > 0) values.remainder = String(m.remainder);
  return { kind: 'sharing', placement, values };
}

export function applyWorkAction(m: VisualModel, w: VisualWork, a: WorkAction): VisualWork {
  if (a.type === 'setValue') {
    if (!answerFields(m).includes(a.field) || !/^\d*$/.test(a.value) || a.value.length > MAX_FIELD_DIGITS) return w;
    return { ...w, values: { ...w.values, [a.field]: a.value.replace(/^0+(?=\d)/, '') } } as VisualWork;
  }
  if (m.kind !== w.kind) return w;
  if (!isLegacy(m)) return family(m).apply(m, w, a);
  if (m.kind === 'tenFrame' && w.kind === 'tenFrame' && a.type === 'toggleCell') {
    // Las fichas del enunciado están fijas; las demás se ponen y se quitan.
    if (a.index < m.start || a.index >= m.capacity) return w;
    return { ...w, cells: w.cells.map((c, i) => (i === a.index ? !c : c)) };
  }
  if (m.kind === 'equalGroups' && w.kind === 'equalGroups' && m.task === 'build' && (a.type === 'addToGroup' || a.type === 'removeFromGroup')) {
    if (a.group < 0 || a.group >= m.groups) return w;
    const delta = a.type === 'addToGroup' ? 1 : -1;
    const next = w.counts[a.group] + delta;
    if (next < 0 || next > groupCapacity(m)) return w;
    return { ...w, counts: w.counts.map((c, i) => (i === a.group ? next : c)) };
  }
  if (m.kind === 'sharing' && w.kind === 'sharing' && a.type === 'place') {
    if (!(a.token in w.placement) || (a.to !== null && !m.containerIds.includes(a.to))) return w;
    return { ...w, placement: { ...w.placement, [a.token]: a.to } };
  }
  return w;
}

/** Mensaje con su clave (el texto lo pone ui-core). */
const result = (outcome: Evaluation['outcome'], feedbackKey: string, feedbackParams: Record<string, number> = {}): Evaluation => ({ outcome, feedbackKey, feedbackParams });
const num = (v: string | undefined) => (v ? Number(v) : null);

/** ¿Qué tiene cada recipiente y qué quedó en la bandeja? Siempre se calcula desde `placement`. */
export function sharingCounts(m: SharingModel, placement: Record<string, string | null>) {
  const counts = new Map(m.containerIds.map((id) => [id, 0]));
  let tray = 0;
  for (const id of m.tokenIds) {
    const d = placement[id];
    if (d === null || d === undefined) tray++;
    else counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  return { counts: m.containerIds.map((id) => counts.get(id) ?? 0), tray };
}

export function evaluateVisual(m: VisualModel, w: VisualWork): Evaluation {
  if (m.kind !== w.kind) return result('invalid', 'common.invalid');
  if (!isLegacy(m)) return family(m).evaluate(m, w);

  if (m.kind === 'tenFrame' && w.kind === 'tenFrame') {
    if (w.cells.length !== m.capacity || w.cells.slice(0, m.start).some((c) => !c)) return result('invalid', 'common.invalid');
    const n = w.cells.filter(Boolean).length;
    const added = n - m.start;
    if (n < m.target) return result('incomplete', 'tenFrame.fewer', { target: m.target });
    if (n > m.target) return result('incorrect', 'tenFrame.more', { target: m.target });
    if (m.task === 'show') return result('correct', 'tenFrame.explainShow', { target: m.target });
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    if (answer !== added) return result('incorrect', 'tenFrame.countAdded', { start: m.start });
    return result('correct', 'tenFrame.explain', { start: m.start, added, target: m.target });
  }

  if (m.kind === 'equalGroups' && w.kind === 'equalGroups') {
    if (w.counts.length !== m.groups) return result('invalid', 'common.invalid');
    const total = m.groups * m.perGroup;
    if (m.task === 'build') {
      if (w.counts.some((c) => c === 0)) return result('incomplete', 'groups.build', { perGroup: m.perGroup });
      if (w.counts.some((c) => c !== m.perGroup)) return result('incorrect', 'groups.checkEach', { perGroup: m.perGroup });
    } else {
      const g = num(w.values.groups);
      const p = num(w.values.perGroup);
      if (g === null || p === null) return result('incomplete', 'common.writeAll');
      if (g !== m.groups) return result('incorrect', 'groups.countGroups');
      if (p !== m.perGroup) return result('incorrect', 'groups.countOne');
    }
    const answer = num(w.values.answer);
    if (answer === null) return result('incomplete', 'common.writeAnswer');
    if (answer !== total) return result('incorrect', 'groups.checkTotal', { groups: m.groups, perGroup: m.perGroup });
    return result('correct', 'groups.explain', { groups: m.groups, perGroup: m.perGroup, total });
  }

  if (m.kind === 'sharing' && w.kind === 'sharing') {
    const keys = Object.keys(w.placement);
    if (keys.length !== m.tokenIds.length || m.tokenIds.some((id) => !(id in w.placement))) return result('invalid', 'common.invalid');
    if (Object.values(w.placement).some((d) => d !== null && !m.containerIds.includes(d))) return result('invalid', 'common.invalid');
    const { counts, tray } = sharingCounts(m, w.placement);

    if (m.mode === 'partitive') {
      if (tray === m.total) return result('incomplete', 'sharing.start');
      if (new Set(counts).size > 1) return result('incorrect', 'sharing.compareGroups');
      // Todos iguales: si en la bandeja alcanza para dar uno más a cada plato, hay que seguir repartiendo.
      if (tray >= m.groups) return result('incomplete', 'sharing.keepSharing', { remaining: tray });
    } else {
      const used = counts.filter((c) => c > 0);
      if (!used.length) return result('incomplete', 'sharing.startBags', { perGroup: m.perGroup });
      if (used.some((c) => c > m.perGroup)) return result('incorrect', 'sharing.bagSize', { perGroup: m.perGroup });
      if (used.some((c) => c < m.perGroup)) return result(tray > 0 ? 'incomplete' : 'incorrect', 'sharing.fillBag', { perGroup: m.perGroup });
      if (tray >= m.perGroup) return result('incomplete', 'sharing.moreBags', { remaining: tray });
    }

    const answer = num(w.values.answer);
    const expected = m.mode === 'partitive' ? m.perGroup : m.groups;
    if (answer === null || (m.remainder > 0 && num(w.values.remainder) === null)) return result('incomplete', m.remainder > 0 ? 'common.writeAll' : 'common.writeAnswer');
    if (answer !== expected) return result('incorrect', m.mode === 'partitive' ? 'sharing.countOne' : 'sharing.countBags');
    if (m.remainder > 0 && num(w.values.remainder) !== m.remainder) return result('incorrect', 'sharing.countLeft');
    return result('correct', m.mode === 'partitive' ? 'sharing.explain' : 'sharing.explainBags', { total: m.total, groups: m.groups, perGroup: m.perGroup, remainder: m.remainder });
  }

  return result('invalid', 'common.invalid');
}

/**
 * Números para el ejemplo paralelo de la ayuda 3: la misma estructura con OTROS números (nunca la respuesta de este
 * problema).
 */
export function parallelExample(m: VisualModel): Record<string, number> {
  if (!isLegacy(m)) return family(m).example(m);
  if (m.kind === 'tenFrame') {
    const start = m.start === 6 ? 7 : 6;
    const target = m.capacity === 10 ? 10 : m.target === 13 ? 14 : 13;
    return { start, added: target - start, target };
  }
  if (m.kind === 'equalGroups') {
    const groups = m.groups === 2 ? 3 : 2;
    const perGroup = m.perGroup === 5 ? 4 : 5;
    return { groups, perGroup, total: groups * perGroup };
  }
  const groups = m.groups === 2 ? 3 : 2;
  const perGroup = m.perGroup === 3 ? 4 : 3;
  return { groups, perGroup, total: groups * perGroup };
}

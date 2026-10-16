/**
 * Revisión automática de una unidad antes de usarla (docs/research §9 "P0"): nada se muestra a un niño si su respuesta
 * no es inequívoca, si le falta un idioma, una pista o si el modelo dibujado no coincide con los números del reto.
 * Devuelve la lista de problemas (vacía = bien). No reemplaza la revisión de un docente.
 */
import type { Localized, MathChallenge, MathUnit } from '@lee-conmigo/contracts';
import { evaluate, expressionNames } from './expression.ts';

const SKILL_ID = /^g[1-6]u\d+\.s\d+$/;
const PLACEHOLDER = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

const hasBoth = (l: Localized | undefined) => !!l && l.es.trim().length > 0 && l.en.trim().length > 0;

export function validateUnit(unit: MathUnit): string[] {
  const errs: string[] = [];
  const err = (where: string, msg: string) => errs.push(`${where}: ${msg}`);

  if (unit.subject !== 'mate') err(unit.id, 'la materia debe ser "mate"');
  if (!hasBoth(unit.title)) err(unit.id, 'falta el título en algún idioma');
  if (unit.cover.containsEmbeddedTextOrNumbers !== false) err(unit.id, 'el arte no puede llevar texto ni números (docs/05)');
  if (unit.standardsReview.displayAudience !== 'parentsOnly') err(unit.id, 'los estándares son solo para padres');

  const skillIds = new Set<string>();
  for (const s of unit.skills) {
    if (skillIds.has(s.id)) err(s.id, 'habilidad repetida');
    skillIds.add(s.id);
    if (!SKILL_ID.test(s.id) || !s.id.startsWith(`${unit.id}.`)) err(s.id, `el id debe ser "${unit.id}.sN"`);
    if (!hasBoth(s.title)) err(s.id, 'falta el título en algún idioma');
  }
  for (const s of unit.skills) {
    for (const p of s.prerequisites) {
      const known = skillIds.has(p) || unit.prerequisites.includes(p) || p.startsWith('base.') || SKILL_ID.test(p);
      if (!known) err(s.id, `prerrequisito con formato desconocido "${p}"`);
    }
  }

  const ids = new Set<string>();
  const used = new Set<string>();
  for (const lesson of unit.lessons) {
    if (ids.has(lesson.id)) err(lesson.id, 'lección repetida');
    ids.add(lesson.id);
    if (lesson.unitId !== unit.id) err(lesson.id, 'unitId no coincide');
    if (!hasBoth(lesson.title)) err(lesson.id, 'falta el título en algún idioma');
    for (const sk of lesson.skillIds) if (!skillIds.has(sk)) err(lesson.id, `habilidad desconocida "${sk}"`);
    if (!lesson.steps.some((s) => s.kind === 'practicar')) err(lesson.id, 'no tiene ningún reto para practicar');
    if (lesson.steps[0]?.kind !== 'aprender') err(lesson.id, 'debe empezar por Aprender');
    if (!hasBoth(lesson.closure.prompt) || !lesson.closure.choices.every(hasBoth)) err(lesson.id, 'cierre incompleto');
    for (const step of lesson.steps) {
      if (step.kind === 'practicar') {
        const c = step.challenge;
        if (ids.has(c.id)) err(c.id, 'reto repetido');
        ids.add(c.id);
        used.add(c.skillId);
        if (!skillIds.has(c.skillId)) err(c.id, `habilidad desconocida "${c.skillId}"`);
        if (!lesson.skillIds.includes(c.skillId)) err(c.id, 'la habilidad no es de esta lección');
        validateChallenge(c, (m) => err(c.id, m));
      }
      if (step.kind === 'aprender') {
        for (const b of step.blocks) {
          if ((b.type === 'text' || b.type === 'keyIdea') && !hasBoth(b.text)) err(lesson.id, `bloque ${b.type} sin los dos idiomas`);
          if (b.type === 'vocabulary' && !b.items.every((i) => hasBoth(i.term) && hasBoth(i.definition))) err(lesson.id, 'vocabulario incompleto');
        }
      }
      if (step.kind === 'juego') {
        if (step.payload.timer !== false || step.payload.randomRewards !== false || step.payload.allowExit !== true) err(lesson.id, 'el juego no puede tener reloj ni premios al azar, y siempre se puede salir (D5)');
        if (!step.payload.pairs.every((p) => hasBoth(p.left) && Number.isFinite(p.right))) err(lesson.id, 'parejas incompletas');
        const rights = step.payload.pairs.map((p) => p.right);
        if (new Set(rights).size !== rights.length) err(lesson.id, 'dos parejas con el mismo número: el juego sería ambiguo');
      }
    }
  }
  for (const s of unit.skills) if (!used.has(s.id)) err(s.id, 'ningún reto practica esta habilidad');
  return errs;
}

function validateChallenge(c: MathChallenge, err: (m: string) => void): void {
  if (!hasBoth(c.prompt)) err('falta el enunciado en algún idioma');
  if (!hasBoth(c.feedback.tryAgain) || !hasBoth(c.feedback.success)) err('falta retroalimentación en algún idioma');
  const levels = c.hints.map((h) => `${h.level}:${h.type}`).join(',');
  if (levels !== '1:hint,2:workedExample,3:explainedAnswer') err(`necesita exactamente 3 escalones (pista, ejemplo, respuesta) y tiene "${levels}"`);
  if (!c.hints.every((h) => hasBoth(h.text))) err('una pista no tiene los dos idiomas');
  if (!Number.isInteger(c.answer.value)) err('la respuesta debe ser un número entero exacto');

  const g = c.generator;
  for (const [name, r] of Object.entries(g.parameters)) {
    if (!(r.integerMin <= r.integerMax)) err(`rango inválido para "${name}"`);
    const v = g.sampleParameters[name];
    if (v === undefined || v < r.integerMin || v > r.integerMax) err(`el ejemplo de "${name}" (${v}) está fuera del rango`);
  }
  const known = new Set([...Object.keys(g.parameters), ...Object.keys(g.derived ?? {})]);
  for (const n of expressionNames(g.answerExpression)) if (!known.has(n)) err(`la respuesta usa "${n}", que no es un parámetro`);
  try {
    const values: Record<string, number> = { ...g.sampleParameters };
    for (const [k, e] of Object.entries(g.derived ?? {})) values[k] = evaluate(e, values);
    const expected = evaluate(g.answerExpression, values);
    if (expected !== c.answer.value) err(`la respuesta (${c.answer.value}) no coincide con la plantilla (${expected})`);
  } catch (e) {
    err(String(e instanceof Error ? e.message : e));
  }
  // En las plantillas: parámetros, derivados, sus alias (`semanticBindings`) y el ejemplo resuelto (`exampleGroups`…).
  const bindings = g.semanticBindings ?? {};
  for (const [alias, target] of Object.entries(bindings)) if (!known.has(target)) err(`el alias {${alias}} apunta a "${target}", que no existe`);
  const exampleNames = [...Object.keys(g.parameters), 'total'].map((n) => `example${n[0].toUpperCase()}${n.slice(1)}`);
  const allowed = new Set([...known, ...Object.keys(bindings), ...exampleNames]);
  for (const [key, l] of Object.entries(g.localizedTemplates)) {
    if (!hasBoth(l)) err(`plantilla "${key}" sin los dos idiomas`);
    for (const lang of ['es', 'en'] as const) for (const m of l[lang].matchAll(PLACEHOLDER)) if (!allowed.has(m[1])) err(`plantilla "${key}" (${lang}) usa {${m[1]}}, que no existe`);
  }

  // El modelo que dibuja la app debe mostrar los mismos números que el enunciado.
  const r = c.representation;
  const s = g.sampleParameters;
  if ((r.component === 'EqualGroups' || r.component === 'TapeDiagram') && (r.groups !== s.groups || r.perGroup !== s.perGroup)) err('el modelo dibujado no coincide con los números del reto');
  if (r.component === 'PaintGrid' && (r.rows !== s.rows || r.columns !== s.columns)) err('la cuadrícula no coincide con los números del reto');
}

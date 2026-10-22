/**
 * Revisión automática de una misión antes de usarla. Devuelve la lista de problemas (vacía = bien). No reemplaza la revisión de un especialista
 * (bienestar, seguridad digital, etc., docs/research/vida-8-modulos.md §7).
 */
import { sortDisplayOrder } from './session.ts';
import type { LifeMission, Localized } from './types.ts';

const hasBoth = (l: Localized | undefined) => !!l && l.es.trim().length > 0 && l.en.trim().length > 0;
/** docs/06: nunca «incorrecto» ni calificar; y nada de dinero real ni datos personales reales. */
const BANNED = /\b(incorrecto|incorrect|wrong answer|calificaci[oó]n)\b/i;
const clean = (l: Localized) => !BANNED.test(l.es) && !BANNED.test(l.en);

export function validateMission(m: LifeMission): string[] {
  const errs: string[] = [];
  const err = (where: string, msg: string) => errs.push(`${where}: ${msg}`);
  for (const [k, l] of Object.entries({ title: m.title, blurb: m.blurb, safety: m.safety, offScreen: m.offScreen })) if (!hasBoth(l)) err(m.id, `falta ${k} en algún idioma`);
  if (m.steps.length < 3) err(m.id, 'muy pocos pasos');
  const ids = new Set<string>();
  for (const st of m.steps) {
    if (ids.has(st.id)) err(st.id, 'paso repetido');
    ids.add(st.id);
    for (const [k, l] of Object.entries({ title: st.title, learn: st.learn, example: st.example, prompt: st.prompt, explain: st.explain.prompt })) {
      if (!hasBoth(l)) err(st.id, `falta ${k} en algún idioma`);
      else if (!clean(l)) err(st.id, `${k} usa una palabra que nunca debe verse (docs/06)`);
    }
    if (st.explain.choices.length < 2 || st.explain.preferredChoiceIds.length === 0) err(st.id, 'el marco de explicación necesita opciones y una preferida');
    for (const c of st.explain.choices) if (!hasBoth(c.text) || !clean(c.text)) err(st.id, `opción ${c.id} mal formada`);
    for (const p of st.explain.preferredChoiceIds) if (!st.explain.choices.some((c) => c.id === p)) err(st.id, `la preferida ${p} no existe`);

    switch (st.kind) {
      case 'choose': {
        if (st.options.length < 3) err(st.id, 'necesita al menos tres caminos para comparar');
        if (!st.options.some((o) => o.preferred)) err(st.id, 'ningún camino cuida lo importante');
        if (!st.options.some((o) => !o.preferred)) err(st.id, 'todos los caminos son preferidos: no hay nada que comparar');
        if (st.minTried < 2 || st.minTried > st.options.length) err(st.id, 'minTried fuera de rango');
        for (const o of st.options) if (!hasBoth(o.text) || !hasBoth(o.result) || !clean(o.text) || !clean(o.result)) err(st.id, `camino ${o.id} mal formado`);
        if (new Set(st.options.map((o) => o.id)).size !== st.options.length) err(st.id, 'ids de caminos repetidos');
        if (!hasBoth(st.scenario)) err(st.id, 'falta el escenario');
        break;
      }
      case 'sort':
        if (st.items.length < 3) err(st.id, 'muy pocas tarjetas');
        if (new Set(st.items.map((i) => i.id)).size !== st.items.length) err(st.id, 'ids de tarjetas repetidos');
        if (sortDisplayOrder(st).every((it, i) => it.id === st.items[i]!.id)) err(st.id, 'las tarjetas se mostrarían ya en orden');
        for (const i of st.items) if (!hasBoth(i.text)) err(st.id, `tarjeta ${i.id} sin los dos idiomas`);
        if (!hasBoth(st.hint) || !hasBoth(st.solvedNote)) err(st.id, 'falta la pista o la nota de resuelto');
        break;
      case 'spot':
        if (st.items.length < 4) err(st.id, 'muy pocos elementos');
        if (!st.items.some((i) => i.sign)) err(st.id, 'ningún elemento es una señal');
        if (!st.items.some((i) => !i.sign)) err(st.id, 'todos son señales: debe haber algo que NO lo sea');
        for (const i of st.items) if (!hasBoth(i.text) || !hasBoth(i.why)) err(st.id, `elemento ${i.id} sin los dos idiomas`);
        if (!hasBoth(st.context)) err(st.id, 'falta el contexto');
        break;
    }
  }
  return errs;
}

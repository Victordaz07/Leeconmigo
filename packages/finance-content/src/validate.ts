/**
 * Revisión automática de una unidad de Finanzas antes de usarla (mismo principio que Matemáticas y Sociedad). Devuelve la lista de problemas (vacía = bien).
 * No reemplaza la revisión de un educador financiero (docs/design/finanzas/ESPECIFICACION.md §7).
 */
import { isValidPlan } from './plan.ts';
import { balanceChoices, projectPlan, initialSession } from './session.ts';
import type { FinanceUnit, Localized } from './unit.ts';

const hasBoth = (l: Localized | undefined) => !!l && l.es.trim().length > 0 && l.en.trim().length > 0;
/** Palabras que nunca deben verse (docs/06: nunca «incorrecto» ni calificar) y símbolos de dinero real (todo es ficticio: UM). */
const BANNED = /\b(incorrecto|incorrect|wrong|mal hecho|calificaci[oó]n)\b/i;
const REAL_MONEY = /[$€£¥]|\b(d[oó]lares?|dollars?|euros?|pesos?|bitcoin|bancos?|tarjeta de cr[eé]dito)\b/i;
const clean = (l: Localized) => !BANNED.test(l.es) && !BANNED.test(l.en) && !REAL_MONEY.test(l.es) && !REAL_MONEY.test(l.en);

export function validateFinanceUnit(unit: FinanceUnit): string[] {
  const errs: string[] = [];
  const err = (where: string, msg: string) => errs.push(`${where}: ${msg}`);
  if (!hasBoth(unit.title) || !hasBoth(unit.blurb)) err(unit.id, 'falta título o descripción en algún idioma');
  if (unit.steps.length < 4) err(unit.id, 'muy pocos pasos');
  const ids = new Set<string>();
  for (const st of unit.steps) {
    if (ids.has(st.id)) err(st.id, 'paso repetido');
    ids.add(st.id);
    for (const [k, l] of Object.entries({ title: st.title, learn: st.learn, example: st.example, prompt: st.prompt, explain: st.explain.prompt })) {
      if (!hasBoth(l)) err(st.id, `falta ${k} en algún idioma`);
      else if (!clean(l)) err(st.id, `${k} usa una palabra que nunca debe verse (docs/06) o dinero real`);
    }
    if (st.explain.choices.length < 2 || st.explain.preferredChoiceIds.length === 0) err(st.id, 'el marco de explicación necesita opciones y una preferida');
    for (const c of st.explain.choices) if (!hasBoth(c.text) || !clean(c.text)) err(st.id, `opción ${c.id} mal formada`);
    for (const p of st.explain.preferredChoiceIds) if (!st.explain.choices.some((c) => c.id === p)) err(st.id, `la preferida ${p} no existe`);

    switch (st.kind) {
      case 'priorities':
        if (!st.items.some((i) => i.neededWhen)) err(st.id, 'ninguna cosa es necesaria en alguna situación');
        if (!st.items.some((i) => !i.neededWhen)) err(st.id, 'debe haber algo que pueda esperar');
        break;
      case 'alternatives':
        if (!st.options.some((o) => o.cost > st.budget)) err(st.id, 'debe haber una opción que no cabe');
        if (st.options.filter((o) => o.cost <= st.budget).length < 2) err(st.id, 'debe haber al menos dos que caben');
        if (!st.leftoverChoices.some((c) => c.id === 'remain')) err(st.id, 'falta la opción «remain» en lo que sobra');
        break;
      case 'ledger':
        for (const [i, c] of st.cases.entries()) {
          const right = balanceChoices(c).filter((b) => b.kind === 'right');
          if (right.length !== 1) err(st.id, `caso ${i}: debe haber exactamente una respuesta correcta (hay ${right.length})`);
          if (balanceChoices(c).length < 3) err(st.id, `caso ${i}: muy pocas opciones distintas`);
        }
        if (!st.missingChoices.some((c) => c.id === 'above')) err(st.id, 'falta la opción «above»');
        break;
      case 'reserve': {
        const plan = { budget: st.plan.budget, envelopes: st.plan.envelopes };
        if (!isValidPlan(plan)) err(st.id, 'el plan de partida no es válido');
        const reserve = st.plan.envelopes.find((e) => e.kind === 'reserve');
        if (!reserve) err(st.id, 'falta el sobre de reserva');
        else {
          if (!(st.smallUnexpected <= reserve.amount)) err(st.id, 'el imprevisto pequeño debe caber en la reserva');
          if (!(st.bigUnexpected > reserve.amount)) err(st.id, 'el imprevisto grande debe superar la reserva (para practicar el ajuste)');
        }
        break;
      }
      case 'offer':
        if (!st.messages.some((m) => m.signals.length === 0)) err(st.id, 'debe haber un mensaje sin señales (no todo es una estafa)');
        if (!st.messages.some((m) => m.signals.length > 0)) err(st.id, 'debe haber un mensaje con señales');
        for (const m of st.messages) {
          if (!hasBoth(m.text) || !clean(m.text)) err(st.id, `mensaje ${m.id} mal formado`);
          if (m.preferredActions.length === 0) err(st.id, `mensaje ${m.id} sin acción preferida`);
          if (m.signals.length > 0 && m.preferredActions.includes('reply')) err(st.id, `mensaje ${m.id}: con señales nunca se responde normal`);
        }
        break;
      case 'project': {
        const plan = projectPlan(st, initialSession);
        // el plan de partida cubre todo lo anterior pero NO el gasto nuevo: debe obligar a ajustar
        if (isValidPlan(plan)) err(st.id, 'el proyecto debe exigir un ajuste (el plan de partida no debería ser válido con el gasto nuevo)');
        const essentials = plan.envelopes.filter((e) => e.kind === 'essential').reduce((a, e) => a + (e.cost ?? 0), 0);
        if (essentials > st.plan.budget) err(st.id, 'lo esencial no cabe en el presupuesto: no hay solución');
        if (st.step <= 0) err(st.id, 'el paso de movimiento debe ser positivo');
        break;
      }
    }
  }
  return errs;
}

/**
 * Textos de las matemáticas visuales en ES/EN (docs/design/math-visual §13). El dominio (`@lee-conmigo/math-content`)
 * devuelve claves y números; aquí se convierten en frases completas, escritas de forma natural en cada idioma (nunca
 * pegando pedazos). Tono de acompañamiento: nunca "incorrecto", nunca rojo (docs/06); se dice QUÉ revisar.
 */
import type { MathLang } from './math-copy.ts';
import { FEEDBACK_2, visualEquation2, visualFieldLabel2, visualHint2, visualHowTo2, visualPrompt2, type VisualCopyModel2 } from './math-visual-copy-2.ts';

/** Lo que estos textos necesitan del modelo (copia estructural, sin depender del paquete de contenido). */
export type VisualCopyModel =
  | VisualCopyModel2
  | { kind: 'tenFrame'; capacity: number; start: number; target: number; task: 'show' | 'complete' | 'reach' }
  | { kind: 'equalGroups'; groups: number; perGroup: number; task: 'build' | 'read' }
  | { kind: 'sharing'; mode: 'partitive' | 'quotative'; total: number; groups: number; perGroup: number; remainder: number };

type P = Record<string, number>;
type Phase1 = Exclude<VisualCopyModel, VisualCopyModel2>;
const isPhase1 = (m: VisualCopyModel): m is Phase1 => m.kind === 'tenFrame' || m.kind === 'equalGroups' || m.kind === 'sharing';
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function visualPrompt(m: VisualCopyModel, lang: MathLang): string {
  if (!isPhase1(m)) return visualPrompt2(m, lang);
  const es = lang === 'es';
  if (m.kind === 'tenFrame') {
    if (m.task === 'show') return es ? `Pon ${m.target} semillas en la bandeja.` : `Put ${m.target} seeds in the tray.`;
    if (m.task === 'complete')
      return es
        ? `Hay ${m.start} semillas en la bandeja de 10. ¿Cuántas faltan para llenarla? Agrégalas y escribe cuántas pusiste.`
        : `There are ${m.start} seeds in the 10 tray. How many more fill it up? Add them and write how many you added.`;
    return es
      ? `Hay ${m.start} semillas. Agrega semillas hasta tener ${m.target}. ¿Cuántas agregaste?`
      : `There are ${m.start} seeds. Add seeds until there are ${m.target}. How many did you add?`;
  }
  if (m.kind === 'equalGroups') {
    if (m.task === 'build')
      return es
        ? `En el huerto hay ${m.groups} parcelas y en cada una van ${m.perGroup} plantas. Planta todas y escribe cuántas plantas hay en total.`
        : `The garden has ${m.groups} plots, and each plot gets ${m.perGroup} plants. Plant them all and write how many plants there are in all.`;
    return es
      ? 'Mira el huerto. ¿Cuántas parcelas hay, cuántas plantas tiene cada una y cuántas plantas hay en total?'
      : 'Look at the garden. How many plots are there, how many plants are in each, and how many plants are there in all?';
  }
  if (m.mode === 'partitive') {
    const base = es
      ? `Reparte ${m.total} galletas por igual entre ${m.groups} platos. ¿Cuántas le tocan a cada plato?`
      : `Share ${m.total} cookies equally among ${m.groups} plates. How many cookies does each plate get?`;
    return m.remainder > 0 ? `${base} ${es ? '¿Cuántas sobran?' : 'How many are left over?'}` : base;
  }
  return es
    ? `Hay ${m.total} galletas. Pon ${m.perGroup} en cada bolsa. ¿Cuántas bolsas llenas puedes hacer?`
    : `There are ${m.total} cookies. Put ${m.perGroup} in each bag. How many full bags can you make?`;
}

/** Instrucción corta de cómo se manipula (debajo del dibujo). */
export function visualHowTo(m: VisualCopyModel, lang: MathLang): string {
  if (!isPhase1(m)) return visualHowTo2(m, lang);
  const es = lang === 'es';
  if (m.kind === 'tenFrame') return es ? 'Toca una casilla vacía para poner una semilla; tócala otra vez para quitarla.' : 'Tap an empty square to add a seed; tap it again to take it out.';
  if (m.kind === 'equalGroups')
    return m.task === 'build'
      ? es ? 'Toca + para plantar y − para quitar.' : 'Tap + to plant and − to take one out.'
      : es ? 'Cuenta con cuidado: no toques nada, solo mira.' : 'Count carefully: just look, no need to tap.';
  return es ? 'Toca una galleta y después el plato o la bolsa donde va. Toca la bandeja para devolverla.' : 'Tap a cookie, then the plate or bag it goes in. Tap the tray to put it back.';
}

export function visualFieldLabel(field: string, m: VisualCopyModel, lang: MathLang): string {
  if (!isPhase1(m)) return visualFieldLabel2(field, m, lang);
  const es = lang === 'es';
  if (field === 'groups') return es ? 'Parcelas' : 'Plots';
  if (field === 'perGroup') return es ? 'En cada una' : 'In each';
  if (field === 'remainder') return es ? 'Sobran' : 'Left over';
  if (m.kind === 'tenFrame') return es ? 'Agregaste' : 'You added';
  if (m.kind === 'equalGroups') return es ? 'En total' : 'In all';
  return m.mode === 'partitive' ? (es ? 'En cada plato' : 'On each plate') : es ? 'Bolsas llenas' : 'Full bags';
}

/** La operación que se ve debajo del modelo, con □ donde falta. */
export function visualEquation(m: VisualCopyModel, solved: boolean): string {
  if (!isPhase1(m)) return visualEquation2(m, solved);
  if (m.kind === 'tenFrame') return m.task === 'show' ? '' : `${m.start} + ${solved ? m.target - m.start : '□'} = ${m.target}`;
  if (m.kind === 'equalGroups') return m.task === 'read' && !solved ? '□ × □ = □' : `${m.groups} × ${m.perGroup} = ${solved ? m.groups * m.perGroup : '□'}`;
  if (m.mode === 'partitive') return `${m.total} ÷ ${m.groups} = ${solved ? m.perGroup : '□'}${m.remainder > 0 ? (solved ? ` R ${m.remainder}` : ' R □') : ''}`;
  return `${m.total} ÷ ${m.perGroup} = ${solved ? m.groups : '□'}${m.remainder > 0 ? (solved ? ` R ${m.remainder}` : ' R □') : ''}`;
}

const FEEDBACK: Record<string, { es: (p: P) => string; en: (p: P) => string }> = {
  'common.invalid': { es: () => 'Algo se desacomodó. Toca «Empezar de nuevo».', en: () => 'Something got mixed up. Tap “Start over”.' },
  'common.writeAnswer': { es: () => 'Ya casi: escribe tu respuesta en la casilla.', en: () => 'Almost: write your answer in the box.' },
  'common.writeAll': { es: () => 'Ya casi: llena todas las casillas.', en: () => 'Almost: fill in every box.' },
  'tenFrame.fewer': { es: (p) => `Todavía no hay ${p.target}. Cuenta las semillas otra vez.`, en: (p) => `There are not ${p.target} yet. Count the seeds again.` },
  'tenFrame.more': { es: (p) => `Hay más de ${p.target}. Revisa y quita las que sobran.`, en: (p) => `There are more than ${p.target}. Check and take out the extra ones.` },
  'tenFrame.countAdded': { es: (p) => `Cuenta solo las que pusiste tú, sin las ${p.start} del principio.`, en: (p) => `Count only the ones you added, not the ${p.start} that were there.` },
  'tenFrame.explainShow': { es: (p) => `¡Eso es! Hay ${p.target} semillas.`, en: (p) => `That’s it! There are ${p.target} seeds.` },
  'tenFrame.explain': { es: (p) => `¡Eso es! Ya había ${p.start}; con ${p.added} más llegas a ${p.target}: ${p.start} + ${p.added} = ${p.target}.`, en: (p) => `That’s it! There were ${p.start}; ${p.added} more makes ${p.target}: ${p.start} + ${p.added} = ${p.target}.` },
  'groups.build': { es: (p) => `Cada parcela necesita ${p.perGroup} plantas. Hay parcelas vacías.`, en: (p) => `Each plot needs ${p.perGroup} plants. Some plots are empty.` },
  'groups.checkEach': { es: (p) => `Revisa las parcelas: todas deben tener ${p.perGroup}.`, en: (p) => `Check the plots: each one should have ${p.perGroup}.` },
  'groups.countGroups': { es: () => 'Revisa cuántas parcelas hay: cuenta los cuadros de tierra, no las plantas.', en: () => 'Check how many plots there are: count the patches of soil, not the plants.' },
  'groups.countOne': { es: () => 'Mira una sola parcela y cuenta sus plantas.', en: () => 'Look at just one plot and count its plants.' },
  'groups.checkTotal': { es: (p) => `Revisa el total: son ${p.groups} grupos de ${p.perGroup}. Puedes sumar ${p.perGroup} cada vez.`, en: (p) => `Check the total: it is ${p.groups} groups of ${p.perGroup}. You can add ${p.perGroup} each time.` },
  'groups.explain': { es: (p) => `¡Eso es! ${p.groups} grupos de ${p.perGroup} son ${p.total}: ${p.groups} × ${p.perGroup} = ${p.total}.`, en: (p) => `That’s it! ${p.groups} groups of ${p.perGroup} make ${p.total}: ${p.groups} × ${p.perGroup} = ${p.total}.` },
  'sharing.start': { es: () => 'Empieza a repartir: toca una galleta y después un plato.', en: () => 'Start sharing: tap a cookie, then a plate.' },
  'sharing.compareGroups': { es: () => 'Compara los platos. ¿Todos tienen la misma cantidad?', en: () => 'Compare the plates. Does each one have the same amount?' },
  'sharing.keepSharing': { es: () => 'Todavía alcanza para dar una más a cada plato. Sigue repartiendo.', en: () => 'There are still enough to give each plate one more. Keep sharing.' },
  'sharing.startBags': { es: (p) => `Empieza a llenar una bolsa con ${p.perGroup} galletas.`, en: (p) => `Start filling a bag with ${p.perGroup} cookies.` },
  'sharing.bagSize': { es: (p) => `Cada bolsa lleva exactamente ${p.perGroup}. Revisa las bolsas.`, en: (p) => `Each bag holds exactly ${p.perGroup}. Check the bags.` },
  'sharing.fillBag': { es: (p) => `Hay una bolsa que no tiene ${p.perGroup}. Lo que no completa una bolsa se queda en la bandeja.`, en: (p) => `One bag does not have ${p.perGroup}. Cookies that can’t fill a whole bag stay in the tray.` },
  'sharing.moreBags': { es: () => 'En la bandeja todavía alcanza para otra bolsa llena.', en: () => 'There are still enough in the tray for another full bag.' },
  'sharing.countOne': { es: () => 'Cuenta las galletas de un solo plato.', en: () => 'Count the cookies on just one plate.' },
  'sharing.countBags': { es: () => 'Cuenta solo las bolsas llenas.', en: () => 'Count only the full bags.' },
  'sharing.countLeft': { es: () => 'Cuenta las galletas que se quedaron en la bandeja.', en: () => 'Count the cookies left in the tray.' },
  'sharing.explain': {
    es: (p) => `¡Eso es! ${p.total} galletas entre ${p.groups} platos: ${p.perGroup} en cada uno${p.remainder ? ` y sobran ${p.remainder}` : ''}. ${p.total} ÷ ${p.groups} = ${p.perGroup}${p.remainder ? ` R ${p.remainder}` : ''}.`,
    en: (p) => `That’s it! ${p.total} cookies among ${p.groups} plates: ${p.perGroup} on each${p.remainder ? `, with ${p.remainder} left over` : ''}. ${p.total} ÷ ${p.groups} = ${p.perGroup}${p.remainder ? ` R ${p.remainder}` : ''}.`,
  },
  'sharing.explainBags': {
    es: (p) => `¡Eso es! Con ${p.total} galletas salen ${p.groups} bolsas de ${p.perGroup}${p.remainder ? ` y sobran ${p.remainder}` : ''}. ${p.total} ÷ ${p.perGroup} = ${p.groups}.`,
    en: (p) => `That’s it! ${p.total} cookies make ${p.groups} bags of ${p.perGroup}${p.remainder ? `, with ${p.remainder} left over` : ''}. ${p.total} ÷ ${p.perGroup} = ${p.groups}.`,
  },
};

/** El modelo es opcional: algunos mensajes nombran a la fruta o a la persona del problema. */
export function visualFeedback(key: string, params: P, lang: MathLang, m?: VisualCopyModel): string {
  const f = FEEDBACK[key];
  if (f) return f[lang](params);
  const g = FEEDBACK_2[key];
  return g ? g[lang](params, m && !isPhase1(m) ? m : undefined) : '';
}

/** Escalera de 3 ayudas: dónde mirar → una estrategia → un ejemplo con OTROS números (`example` = parallelExample). */
export function visualHint(m: VisualCopyModel, level: 1 | 2 | 3, example: P, lang: MathLang): string {
  if (!isPhase1(m)) return visualHint2(m, level, example, lang);
  const es = lang === 'es';
  const e = example;
  if (m.kind === 'tenFrame') {
    if (level === 1) return es ? 'Mira las casillas vacías.' : 'Look at the empty squares.';
    if (level === 2) return es ? `Llena una casilla a la vez y cuenta desde ${m.start}.` : `Fill one square at a time and count on from ${m.start}.`;
    return es ? `Ejemplo: si hay ${e.start} y quieres ${e.target}, agregas ${e.added}, porque ${e.start} + ${e.added} = ${e.target}.` : `Example: with ${e.start} and a goal of ${e.target}, you add ${e.added}, because ${e.start} + ${e.added} = ${e.target}.`;
  }
  if (m.kind === 'equalGroups') {
    if (level === 1) return es ? 'Mira una parcela: todas tienen lo mismo.' : 'Look at one plot: they all have the same.';
    if (level === 2) return es ? 'Suma lo de una parcela una y otra vez, una vez por cada parcela.' : 'Add the amount in one plot again and again, once for each plot.';
    return es ? `Ejemplo: ${e.groups} parcelas con ${e.perGroup} plantas: ${Array(e.groups).fill(e.perGroup).join(' + ')} = ${e.total}, o sea ${e.groups} × ${e.perGroup} = ${e.total}.` : `Example: ${e.groups} plots with ${e.perGroup} plants: ${Array(e.groups).fill(e.perGroup).join(' + ')} = ${e.total}, so ${e.groups} × ${e.perGroup} = ${e.total}.`;
  }
  if (m.mode === 'partitive') {
    if (level === 1) return es ? 'Mira los platos: ¿tienen lo mismo?' : 'Look at the plates: do they have the same?';
    if (level === 2) return es ? 'Da una galleta a cada plato por turnos, hasta que ya no alcance para todos.' : 'Give one cookie to each plate in turn, until there are not enough for all.';
    return es ? `Ejemplo: ${e.total} galletas entre ${e.groups} platos → ${e.perGroup} en cada uno, porque ${e.groups} × ${e.perGroup} = ${e.total}.` : `Example: ${e.total} cookies among ${e.groups} plates → ${e.perGroup} on each, because ${e.groups} × ${e.perGroup} = ${e.total}.`;
  }
  if (level === 1) return es ? `Cada bolsa lleva ${m.perGroup}. Mira cuántas tiene cada una.` : `Each bag holds ${m.perGroup}. Look at how many each has.`;
  if (level === 2) return es ? `Llena una bolsa completa con ${m.perGroup} antes de empezar otra.` : `Fill one bag with ${m.perGroup} before starting another.`;
  return es ? `Ejemplo: con ${e.total} galletas y bolsas de ${e.perGroup}, salen ${e.groups} bolsas, porque ${e.groups} × ${e.perGroup} = ${e.total}.` : `Example: ${e.total} cookies in bags of ${e.perGroup} make ${e.groups} bags, because ${e.groups} × ${e.perGroup} = ${e.total}.`;
}

export const VISUAL_COPY = {
  workshop: { es: 'Taller', en: 'Workshop' },
  /** Escalera de ayuda de los ejercicios visuales: dónde mirar → estrategia → ejemplo con otros números. */
  hintTitles: { es: ['Pista', 'Estrategia', 'Ejemplo con otros números'], en: ['Hint', 'Strategy', 'Example with other numbers'] },
  workshopTitle: { es: 'Taller: aprende haciendo', en: 'Workshop: learn by doing' },
  workshopSubtitle: { es: 'Construye, reparte y cuenta con objetos.', en: 'Build, share, and count with objects.' },
  exerciseOf: { es: (n: number, t: number) => `Ejercicio ${n} de ${t}`, en: (n: number, t: number) => `Exercise ${n} of ${t}` },
  undo: { es: 'Deshacer', en: 'Undo' },
  reset: { es: 'Empezar de nuevo', en: 'Start over' },
  reveal: { es: 'Ver solución', en: 'Show solution' },
  revealed: { es: 'Así se resuelve. Este volverá en tu repaso.', en: 'Here is how it is solved. It will come back in your review.' },
  tray: { es: 'Bandeja', en: 'Tray' },
  plate: { es: (n: number) => `Plato ${n}`, en: (n: number) => `Plate ${n}` },
  bag: { es: (n: number) => `Bolsa ${n}`, en: (n: number) => `Bag ${n}` },
  plot: { es: (n: number) => `Parcela ${n}`, en: (n: number) => `Plot ${n}` },
  cookie: { es: (n: number, where: string) => `Galleta ${n}, en ${where}`, en: (n: number, where: string) => `Cookie ${n}, in ${where}` },
  done: { es: '¡Terminaste el taller!', en: 'You finished the workshop!' },
  doneDetail: { es: (n: number) => `Hiciste ${n} ${plural(n, 'ejercicio', 'ejercicios')}.`, en: (n: number) => `You did ${n} ${plural(n, 'exercise', 'exercises')}.` },
} as const;

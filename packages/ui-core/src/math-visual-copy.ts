/**
 * Textos de las matemáticas visuales en ES/EN (docs/design/math-visual §13). El dominio (`@lee-conmigo/math-content`)
 * devuelve claves y números; aquí se convierten en frases completas, escritas de forma natural en cada idioma (nunca
 * pegando pedazos). Tono de acompañamiento: nunca "incorrecto", nunca rojo (docs/06); se dice QUÉ revisar.
 */
import type { MathLang } from './math-copy.ts';
import { a, cap, groupsNouns, los, o, sharingNouns, un, word, type GroupsTheme, type Nouns, type SharingTheme } from './math-visual-nouns.ts';
import { FEEDBACK_2, visualEquation2, visualFieldLabel2, visualHint2, visualHowTo2, visualPrompt2, type VisualCopyModel2 } from './math-visual-copy-2.ts';

/** Lo que estos textos necesitan del modelo (copia estructural, sin depender del paquete de contenido). */
export type VisualCopyModel =
  | VisualCopyModel2
  | { kind: 'tenFrame'; capacity: number; start: number; target: number; task: 'show' | 'complete' | 'reach' }
  | { kind: 'equalGroups'; groups: number; perGroup: number; task: 'build' | 'read'; theme?: GroupsTheme }
  | { kind: 'sharing'; mode: 'partitive' | 'quotative'; total: number; groups: number; perGroup: number; remainder: number; theme?: SharingTheme };

type P = Record<string, number>;
type Phase1 = Exclude<VisualCopyModel, VisualCopyModel2>;
const isPhase1 = (m: VisualCopyModel): m is Phase1 => m.kind === 'tenFrame' || m.kind === 'equalGroups' || m.kind === 'sharing';
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Palabras del contexto de un ejercicio de grupos o reparto. */
export function nounsOf(m: Extract<Phase1, { kind: 'equalGroups' | 'sharing' }>): Nouns {
  return m.kind === 'equalGroups' ? groupsNouns(m.theme) : sharingNouns(m.theme, m.mode);
}

/** Nombre de un recipiente para el lector de pantalla («Caja 2», «Plate 1»). */
export function containerName(m: VisualCopyModel, n: number, lang: MathLang): string {
  return m.kind === 'equalGroups' || m.kind === 'sharing' ? `${cap(word(nounsOf(m).box, lang, 1))} ${n}` : `${n}`;
}

/** Nombre de una ficha y dónde está («Lápiz 3, en Caja 1»). */
export function tokenName(m: VisualCopyModel, n: number, where: string, lang: MathLang): string {
  const item = m.kind === 'equalGroups' || m.kind === 'sharing' ? cap(word(nounsOf(m).item, lang, 1)) : '';
  return lang === 'es' ? `${item} ${n}, en ${where}` : `${item} ${n}, in ${where}`;
}

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
    const n = nounsOf(m);
    const [I, B] = [n.item, n.box];
    if (n.garden) {
      if (m.task === 'build')
        return es
          ? `En el huerto hay ${m.groups} parcelas y en cada una van ${m.perGroup} plantas. Planta todas y escribe cuántas plantas hay en total.`
          : `The garden has ${m.groups} plots, and each plot gets ${m.perGroup} plants. Plant them all and write how many plants there are in all.`;
      return es
        ? 'Mira el huerto. ¿Cuántas parcelas hay, cuántas plantas tiene cada una y cuántas plantas hay en total?'
        : 'Look at the garden. How many plots are there, how many plants are in each, and how many plants are there in all?';
    }
    if (m.task === 'build')
      return es
        ? `Hay ${m.groups} ${B.es[1]} y en cada ${B.es[0]} van ${m.perGroup} ${I.es[1]}. Llénal${o(B)}s y escribe cuánt${o(I)}s ${I.es[1]} hay en total.`
        : `There are ${m.groups} ${B.en[1]}, and each ${B.en[0]} gets ${m.perGroup} ${I.en[1]}. Fill them all and write how many ${I.en[1]} there are in all.`;
    return es
      ? `Mira ${los(B)} ${B.es[1]}. ¿Cuánt${o(B)}s ${B.es[1]} hay, cuánt${o(I)}s ${I.es[1]} tiene cada ${B.f ? 'una' : 'uno'} y cuánt${o(I)}s ${I.es[1]} hay en total?`
      : `Look at the ${B.en[1]}. How many ${B.en[1]} are there, how many ${I.en[1]} are in each, and how many ${I.en[1]} are there in all?`;
  }
  const n = nounsOf(m);
  const [I, B] = [n.item, n.box];
  if (m.mode === 'partitive') {
    const base = es
      ? `Reparte ${m.total} ${I.es[1]} por igual entre ${m.groups} ${B.es[1]}. ¿Cuánt${o(I)}s le tocan a cada ${B.es[0]}?`
      : `Share ${m.total} ${I.en[1]} equally among ${m.groups} ${B.en[1]}. How many ${I.en[1]} does each ${B.en[0]} get?`;
    return m.remainder > 0 ? `${base} ${es ? `¿Cuánt${o(I)}s sobran?` : 'How many are left over?'}` : base;
  }
  return es
    ? `Hay ${m.total} ${I.es[1]}. Pon ${m.perGroup} en cada ${B.es[0]}. ¿Cuánt${o(B)}s ${B.es[1]} llen${o(B)}s puedes hacer?`
    : `There are ${m.total} ${I.en[1]}. Put ${m.perGroup} in each ${B.en[0]}. How many full ${B.en[1]} can you make?`;
}

/** Instrucción corta de cómo se manipula (debajo del dibujo). */
export function visualHowTo(m: VisualCopyModel, lang: MathLang): string {
  if (!isPhase1(m)) return visualHowTo2(m, lang);
  const es = lang === 'es';
  if (m.kind === 'tenFrame') return es ? 'Toca una casilla vacía para poner una semilla; tócala otra vez para quitarla.' : 'Tap an empty square to add a seed; tap it again to take it out.';
  if (m.kind === 'equalGroups')
    return m.task === 'build'
      ? groupsNouns(m.theme).garden
        ? es ? 'Toca + para plantar y − para quitar.' : 'Tap + to plant and − to take one out.'
        : es ? 'Toca + para poner y − para quitar.' : 'Tap + to put one in and − to take one out.'
      : es ? 'Cuenta con cuidado: no toques nada, solo mira.' : 'Count carefully: just look, no need to tap.';
  const { item: I, box: B } = nounsOf(m);
  const el = o(B) === 'a' ? 'la' : 'el';
  return es
    ? `Arrastra ${un(I)} ${I.es[0]} hasta ${el} ${B.es[0]} donde va, o tócal${o(I)} y después toca ${el} ${B.es[0]}. Para devolver${o(I) === 'a' ? 'la' : 'lo'}, lléval${o(I)} a la bandeja.`
    : `Drag ${a(I.en[0])} to the ${B.en[0]} it goes in, or tap it and then tap the ${B.en[0]}. To put it back, bring it to the tray.`;
}

export function visualFieldLabel(field: string, m: VisualCopyModel, lang: MathLang): string {
  if (!isPhase1(m)) return visualFieldLabel2(field, m, lang);
  const es = lang === 'es';
  if (field === 'groups' && m.kind !== 'tenFrame') return cap(word(nounsOf(m).box, lang));
  if (field === 'perGroup') return es ? `En cada ${m.kind === 'tenFrame' || nounsOf(m).box.f ? 'una' : 'uno'}` : 'In each';
  if (field === 'remainder') return es ? 'Sobran' : 'Left over';
  if (m.kind === 'tenFrame') return es ? 'Agregaste' : 'You added';
  if (m.kind === 'equalGroups') return es ? 'En total' : 'In all';
  const { box: B, on } = nounsOf(m);
  return m.mode === 'partitive' ? (es ? `En cada ${B.es[0]}` : `${on ? 'On' : 'In'} each ${B.en[0]}`) : es ? `${cap(B.es[1])} llen${o(B)}s` : `Full ${B.en[1]}`;
}

/** La operación que se ve debajo del modelo, con □ donde falta. */
export function visualEquation(m: VisualCopyModel, solved: boolean): string {
  if (!isPhase1(m)) return visualEquation2(m, solved);
  if (m.kind === 'tenFrame') return m.task === 'show' ? '' : `${m.start} + ${solved ? m.target - m.start : '□'} = ${m.target}`;
  if (m.kind === 'equalGroups') return m.task === 'read' && !solved ? '□ × □ = □' : `${m.groups} × ${m.perGroup} = ${solved ? m.groups * m.perGroup : '□'}`;
  if (m.mode === 'partitive') return `${m.total} ÷ ${m.groups} = ${solved ? m.perGroup : '□'}${m.remainder > 0 ? (solved ? ` R ${m.remainder}` : ' R □') : ''}`;
  return `${m.total} ÷ ${m.perGroup} = ${solved ? m.groups : '□'}${m.remainder > 0 ? (solved ? ` R ${m.remainder}` : ' R □') : ''}`;
}

const FEEDBACK: Record<string, { es: (p: P, n: Nouns) => string; en: (p: P, n: Nouns) => string }> = {
  'common.invalid': { es: () => 'Algo se desacomodó. Toca «Empezar de nuevo».', en: () => 'Something got mixed up. Tap “Start over”.' },
  'common.writeAnswer': { es: () => 'Ya casi: escribe tu respuesta en la casilla.', en: () => 'Almost: write your answer in the box.' },
  'common.writeAll': { es: () => 'Ya casi: llena todas las casillas.', en: () => 'Almost: fill in every box.' },
  'tenFrame.fewer': { es: (p) => `Todavía no hay ${p.target}. Cuenta las semillas otra vez.`, en: (p) => `There are not ${p.target} yet. Count the seeds again.` },
  'tenFrame.more': { es: (p) => `Hay más de ${p.target}. Revisa y quita las que sobran.`, en: (p) => `There are more than ${p.target}. Check and take out the extra ones.` },
  'tenFrame.countAdded': { es: (p) => `Cuenta solo las que pusiste tú, sin las ${p.start} del principio.`, en: (p) => `Count only the ones you added, not the ${p.start} that were there.` },
  'tenFrame.explainShow': { es: (p) => `¡Eso es! Hay ${p.target} semillas.`, en: (p) => `That’s it! There are ${p.target} seeds.` },
  'tenFrame.explain': { es: (p) => `¡Eso es! Ya había ${p.start}; con ${p.added} más llegas a ${p.target}: ${p.start} + ${p.added} = ${p.target}.`, en: (p) => `That’s it! There were ${p.start}; ${p.added} more makes ${p.target}: ${p.start} + ${p.added} = ${p.target}.` },
  'groups.build': {
    es: (p, { item: I, box: B }) => `Cada ${B.es[0]} necesita ${p.perGroup} ${I.es[1]}. Hay ${B.es[1]} vací${o(B)}s.`,
    en: (p, { item: I, box: B }) => `Each ${B.en[0]} needs ${p.perGroup} ${I.en[1]}. Some ${B.en[1]} are empty.`,
  },
  'groups.checkEach': {
    es: (p, { box: B }) => `Revisa ${los(B)} ${B.es[1]}: tod${o(B)}s deben tener ${p.perGroup}.`,
    en: (p, { box: B }) => `Check the ${B.en[1]}: each one should have ${p.perGroup}.`,
  },
  'groups.countGroups': {
    es: (_, n) =>
      n.garden ? 'Revisa cuántas parcelas hay: cuenta los cuadros de tierra, no las plantas.' : `Revisa cuánt${o(n.box)}s ${n.box.es[1]} hay: cuenta ${los(n.box)} ${n.box.es[1]}, no ${los(n.item)} ${n.item.es[1]}.`,
    en: (_, n) => (n.garden ? 'Check how many plots there are: count the patches of soil, not the plants.' : `Check how many ${n.box.en[1]} there are: count the ${n.box.en[1]}, not the ${n.item.en[1]}.`),
  },
  'groups.countOne': {
    es: (_, { item: I, box: B }) => `Mira ${un(B)} sol${o(B)} ${B.es[0]} y cuenta sus ${I.es[1]}.`,
    en: (_, { item: I, box: B }) => `Look at just one ${B.en[0]} and count its ${I.en[1]}.`,
  },
  'groups.checkTotal': { es: (p) => `Revisa el total: son ${p.groups} grupos de ${p.perGroup}. Puedes sumar ${p.perGroup} cada vez.`, en: (p) => `Check the total: it is ${p.groups} groups of ${p.perGroup}. You can add ${p.perGroup} each time.` },
  'groups.explain': { es: (p) => `¡Eso es! ${p.groups} grupos de ${p.perGroup} son ${p.total}: ${p.groups} × ${p.perGroup} = ${p.total}.`, en: (p) => `That’s it! ${p.groups} groups of ${p.perGroup} make ${p.total}: ${p.groups} × ${p.perGroup} = ${p.total}.` },
  'sharing.start': {
    es: (_, { item: I, box: B }) => `Empieza a repartir: toca ${un(I)} ${I.es[0]} y después ${un(B)} ${B.es[0]}.`,
    en: (_, { item: I, box: B }) => `Start sharing: tap ${a(I.en[0])}, then ${a(B.en[0])}.`,
  },
  'sharing.compareGroups': {
    es: (_, { box: B }) => `Compara ${los(B)} ${B.es[1]}. ¿Tod${o(B)}s tienen la misma cantidad?`,
    en: (_, { box: B }) => `Compare the ${B.en[1]}. Does each one have the same amount?`,
  },
  'sharing.keepSharing': {
    es: (_, { item: I, box: B }) => `Todavía alcanza para dar ${un(I)} más a cada ${B.es[0]}. Sigue repartiendo.`,
    en: (_, { box: B }) => `There are still enough to give each ${B.en[0]} one more. Keep sharing.`,
  },
  'sharing.startBags': {
    es: (p, { item: I, box: B }) => `Empieza a llenar ${un(B)} ${B.es[0]} con ${p.perGroup} ${I.es[1]}.`,
    en: (p, { item: I, box: B }) => `Start filling ${a(B.en[0])} with ${p.perGroup} ${I.en[1]}.`,
  },
  'sharing.bagSize': {
    es: (p, { box: B }) => `Cada ${B.es[0]} lleva exactamente ${p.perGroup}. Revisa ${los(B)} ${B.es[1]}.`,
    en: (p, { box: B }) => `Each ${B.en[0]} holds exactly ${p.perGroup}. Check the ${B.en[1]}.`,
  },
  'sharing.fillBag': {
    es: (p, { box: B }) => `Hay ${un(B)} ${B.es[0]} que no tiene ${p.perGroup}. Lo que no completa ${un(B)} ${B.es[0]} se queda en la bandeja.`,
    en: (p, { item: I, box: B }) => `One ${B.en[0]} does not have ${p.perGroup}. ${cap(I.en[1])} that can’t fill a whole ${B.en[0]} stay in the tray.`,
  },
  'sharing.moreBags': {
    es: (_, { box: B }) => `En la bandeja todavía alcanza para otr${o(B)} ${B.es[0]} llen${o(B)}.`,
    en: (_, { box: B }) => `There are still enough in the tray for another full ${B.en[0]}.`,
  },
  'sharing.countOne': {
    es: (_, { item: I, box: B }) => `Cuenta ${los(I)} ${I.es[1]} de ${un(B)} sol${o(B)} ${B.es[0]}.`,
    en: (_, { item: I, box: B, on }) => `Count the ${I.en[1]} ${on ? 'on' : 'in'} just one ${B.en[0]}.`,
  },
  'sharing.countBags': {
    es: (_, { box: B }) => `Cuenta solo ${los(B)} ${B.es[1]} llen${o(B)}s.`,
    en: (_, { box: B }) => `Count only the full ${B.en[1]}.`,
  },
  'sharing.countLeft': {
    es: (_, { item: I }) => `Cuenta ${los(I)} ${I.es[1]} que se quedaron en la bandeja.`,
    en: (_, { item: I }) => `Count the ${I.en[1]} left in the tray.`,
  },
  'sharing.explain': {
    es: (p, { item: I, box: B }) =>
      `¡Eso es! ${p.total} ${I.es[1]} entre ${p.groups} ${B.es[1]}: ${p.perGroup} en cada ${B.f ? 'una' : 'uno'}${p.remainder ? ` y ${p.remainder === 1 ? 'sobra 1' : `sobran ${p.remainder}`}` : ''}. ${p.total} ÷ ${p.groups} = ${p.perGroup}${p.remainder ? ` R ${p.remainder}` : ''}.`,
    en: (p, { item: I, box: B, on }) =>
      `That’s it! ${p.total} ${I.en[1]} among ${p.groups} ${B.en[1]}: ${p.perGroup} ${on ? 'on' : 'in'} each${p.remainder ? `, with ${p.remainder} left over` : ''}. ${p.total} ÷ ${p.groups} = ${p.perGroup}${p.remainder ? ` R ${p.remainder}` : ''}.`,
  },
  'sharing.explainBags': {
    es: (p, { item: I, box: B }) =>
      `¡Eso es! Con ${p.total} ${I.es[1]} salen ${p.groups} ${B.es[1]} de ${p.perGroup}${p.remainder ? ` y ${p.remainder === 1 ? 'sobra 1' : `sobran ${p.remainder}`}` : ''}. ${p.total} ÷ ${p.perGroup} = ${p.groups}.`,
    en: (p, { item: I, box: B }) => `That’s it! ${p.total} ${I.en[1]} make ${p.groups} ${B.en[1]} of ${p.perGroup}${p.remainder ? `, with ${p.remainder} left over` : ''}. ${p.total} ÷ ${p.perGroup} = ${p.groups}.`,
  },
};

/** Palabras para un mensaje: las del ejercicio o, sin modelo, las de siempre (huerto, galletas en platos o bolsas). */
function feedbackNouns(key: string, m?: VisualCopyModel): Nouns {
  if (m && (m.kind === 'equalGroups' || m.kind === 'sharing')) return nounsOf(m);
  if (key.startsWith('groups.')) return groupsNouns(undefined);
  return sharingNouns(undefined, /Bag/.test(key) ? 'quotative' : 'partitive');
}

/** El modelo es opcional: algunos mensajes nombran a la fruta o a la persona del problema. */
export function visualFeedback(key: string, params: P, lang: MathLang, m?: VisualCopyModel): string {
  const f = FEEDBACK[key];
  if (f) return f[lang](params, feedbackNouns(key, m));
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
    const { item: I, box: B } = nounsOf(m);
    if (level === 1) return es ? `Mira ${un(B)} ${B.es[0]}: tod${o(B)}s tienen lo mismo.` : `Look at one ${B.en[0]}: they all have the same.`;
    if (level === 2) return es ? `Suma lo de ${un(B)} ${B.es[0]} una y otra vez, una vez por cada ${B.es[0]}.` : `Add the amount in one ${B.en[0]} again and again, once for each ${B.en[0]}.`;
    return es
      ? `Ejemplo: ${e.groups} ${B.es[1]} con ${e.perGroup} ${I.es[1]}: ${Array(e.groups).fill(e.perGroup).join(' + ')} = ${e.total}, o sea ${e.groups} × ${e.perGroup} = ${e.total}.`
      : `Example: ${e.groups} ${B.en[1]} with ${e.perGroup} ${I.en[1]}: ${Array(e.groups).fill(e.perGroup).join(' + ')} = ${e.total}, so ${e.groups} × ${e.perGroup} = ${e.total}.`;
  }
  const { item: I, box: B, on } = nounsOf(m);
  if (m.mode === 'partitive') {
    if (level === 1) return es ? `Mira ${los(B)} ${B.es[1]}: ¿tienen lo mismo?` : `Look at the ${B.en[1]}: do they have the same?`;
    if (level === 2) return es ? `Da ${un(I)} ${I.es[0]} a cada ${B.es[0]} por turnos, hasta que ya no alcance para tod${o(B)}s.` : `Give one ${I.en[0]} to each ${B.en[0]} in turn, until there are not enough for all.`;
    return es
      ? `Ejemplo: ${e.total} ${I.es[1]} entre ${e.groups} ${B.es[1]} → ${e.perGroup} en cada ${B.f ? 'una' : 'uno'}, porque ${e.groups} × ${e.perGroup} = ${e.total}.`
      : `Example: ${e.total} ${I.en[1]} among ${e.groups} ${B.en[1]} → ${e.perGroup} ${on ? 'on' : 'in'} each, because ${e.groups} × ${e.perGroup} = ${e.total}.`;
  }
  if (level === 1) return es ? `Cada ${B.es[0]} lleva ${m.perGroup}. Mira cuánt${o(I)}s tiene cada ${B.f ? 'una' : 'uno'}.` : `Each ${B.en[0]} holds ${m.perGroup}. Look at how many each has.`;
  if (level === 2) return es ? `Llena ${un(B)} ${B.es[0]} complet${o(B)} con ${m.perGroup} antes de empezar otr${o(B)}.` : `Fill one ${B.en[0]} with ${m.perGroup} before starting another.`;
  return es
    ? `Ejemplo: con ${e.total} ${I.es[1]} y ${B.es[1]} de ${e.perGroup}, salen ${e.groups} ${B.es[1]}, porque ${e.groups} × ${e.perGroup} = ${e.total}.`
    : `Example: ${e.total} ${I.en[1]} in ${B.en[1]} of ${e.perGroup} make ${e.groups} ${B.en[1]}, because ${e.groups} × ${e.perGroup} = ${e.total}.`;
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
  done: { es: '¡Terminaste el taller!', en: 'You finished the workshop!' },
  doneDetail: { es: (n: number) => `Hiciste ${n} ${plural(n, 'ejercicio', 'ejercicios')}.`, en: (n: number) => `You did ${n} ${plural(n, 'exercise', 'exercises')}.` },
} as const;

/**
 * Textos de la INTERFAZ de Finanzas en ES/EN (rótulos, botones, retroalimentación, cierre). Los textos de la unidad (pasos, ejemplos, mensajes del
 * buzón) viven en `@lee-conmigo/finance-content`. Tono de acompañamiento: nunca «incorrecto», nunca rojo (docs/06, D5). El dinero es SIEMPRE ficticio
 * (UM) y nunca se mezcla con las estrellas de Kitewise. Escritos de forma natural en cada idioma, no traducidos palabra por palabra.
 */
export type FinanzasLang = 'es' | 'en';
export interface FinanzasLoc {
  es: string;
  en: string;
}
const L = (es: string, en: string): FinanzasLoc => ({ es, en });

export type FinanzasFeedback = 'affirm' | 'gentle';
export type FinanzasReason = 'adjustedAndExplained' | 'adjusted' | 'explained' | 'completed';
export type FinanzasBalanceKind = 'right' | 'forgotLast' | 'signError' | 'ignoredIncome';
export type FinanzasEnvelopeKind = 'essential' | 'optional' | 'reserve' | 'free';
export type FinanzasPlanIssue = 'over-budget' | 'essential-uncovered' | 'negative';

export const FINANZAS_COPY = {
  subject: L('Finanzas', 'Finance'),
  /** La estantería agrupa los cuadernos «Para la vida» (D14). */
  shelf: L('Para la vida', 'For life'),
  tagline: L('Decidir con dinero de mentira para aprender de verdad', 'Deciding with pretend money to learn for real'),
  /** Aviso fijo: el dinero es ficticio (docs/research/vida-01 §1). */
  pretend: L('Todo el dinero de aquí es de mentira (UM): no es dinero real ni de ningún país.', 'All the money here is pretend (UM): it is not real money from any country.'),
  um: L('UM', 'UM'),
  umLong: L('unidades monetarias de mentira', 'pretend money units'),
  button: {
    back: L('Volver', 'Back'),
    next: L('Seguir', 'Continue'),
    prev: L('Atrás', 'Previous'),
    start: L('Empezar', 'Start'),
    resume: L('Hacerlo otra vez', 'Do it again'),
    askHelp: L('Pedir ayuda a un adulto', 'Ask a grown-up for help'),
    startOver: L('Empezar de nuevo', 'Start over'),
    chooseAgain: L('Elegir otra vez', 'Choose again'),
  },
  stepOf: { es: (n: number, total: number) => `Encuentro ${n} de ${total}`, en: (n: number, total: number) => `Meeting ${n} of ${total}` },
  learn: L('Aprende', 'Learn'),
  example: L('Ejemplo resuelto', 'Worked example'),
  explainTitle: L('Explica tu decisión', 'Explain your decision'),
  pickOne: L('Elige la frase que mejor lo explica.', 'Pick the sentence that explains it best.'),
  helpNote: L('Pedir ayuda es parte de decidir bien. Habla con un adulto de confianza.', 'Asking for help is part of deciding well. Talk to a grown-up you trust.'),
  /** Retroalimentación de las frases y de las opciones: acompaña, nunca califica. */
  feedback: {
    affirm: L('Esa razón protege lo importante. 👍', 'That reason protects what matters. 👍'),
    gentle: L('Otra frase encaja mejor con lo que viste. Léelas otra vez y cambia si quieres.', 'Another sentence fits better with what you saw. Read them again and change if you like.'),
  } satisfies Record<FinanzasFeedback, FinanzasLoc>,
  /** Qué hace falta para poder seguir (siempre algo que FALTA, nunca algo «mal»). */
  missing: {
    explain: L('Falta elegir cómo explicas tu decisión.', 'You still need to pick how you explain your decision.'),
    priorities: L('Prueba una segunda situación para comparar.', 'Try a second situation to compare.'),
    alternatives: L('Todavía falta completar los pasos de arriba.', 'There are still steps above to complete.'),
    ledger: L('Falta encontrar el saldo y contestar la pregunta.', 'You still need to find the balance and answer the question.'),
    reserve: L('Falta pasar por los dos imprevistos y elegir qué haces.', 'You still need to go through both surprises and choose what to do.'),
    offer: L('Falta decidir qué haces con cada mensaje.', 'You still need to decide what to do with each message.'),
    project: L('Falta cubrir lo esencial moviendo dinero entre sobres.', 'You still need to cover the essentials by moving money between envelopes.'),
  },
  envelopeKind: {
    essential: L('Esencial', 'Essential'),
    optional: L('Opcional', 'Optional'),
    reserve: L('Reserva', 'Reserve'),
    free: L('Libre', 'Free'),
  } satisfies Record<FinanzasEnvelopeKind, FinanzasLoc>,
  priorities: {
    situation: L('Situación', 'Situation'),
    budget: { es: (n: number) => `Tienes ${n} UM`, en: (n: number) => `You have ${n} UM` },
    cost: { es: (n: number) => `${n} UM`, en: (n: number) => `${n} UM` },
    leftover: { es: (n: number) => `Te sobran ${n} UM`, en: (n: number) => `You have ${n} UM left` },
    notEnough: L('No alcanza con tu dinero', 'Your money is not enough for this'),
    fine: L('Es lo que hacía falta en esta situación.', 'This is what was needed in this situation.'),
    canWait: L('Esto puede esperar. Mira qué hace falta ahora.', 'This can wait. Look at what is needed now.'),
    needNow: { es: (what: string) => `En esta situación hace falta: ${what}.`, en: (what: string) => `In this situation you need: ${what}.` },
    nothingNeeded: L('Aquí no hace falta nada urgente: cualquier opción puede valer.', 'Nothing is urgent here: any choice can work.'),
    tried: { es: (n: number) => `Situaciones probadas: ${n} de 2`, en: (n: number) => `Situations tried: ${n} of 2` },
    needed: L('Hace falta', 'Needed'),
    optionalTag: L('Puede esperar', 'Can wait'),
  },
  alternatives: {
    budget: { es: (n: number) => `Tienes ${n} UM`, en: (n: number) => `You have ${n} UM` },
    notFitDone: L('Ese no cabe. Bien visto.', 'That one does not fit. Good eye.'),
    notFitMore: L('Mira otra vez los precios: puede que falte alguno o que sobre uno.', 'Look at the prices again: one may be missing or there may be one too many.'),
    fits: L('Cabe', 'Fits'),
    notFits: L('No cabe', 'Does not fit'),
    first: L('1.ª opción', '1st choice'),
    second: L('2.ª opción', '2nd choice'),
    leftNote: { es: (name: string) => `Lo que dejaste: ${name}.`, en: (name: string) => `What you gave up: ${name}.` },
    leftEmpty: L('No había otra opción que cupiera.', 'There was no other option that fit.'),
    leftoverIs: { es: (n: number) => `Después de pagar tu elección te sobran ${n} UM.`, en: (n: number) => `After paying for your choice you have ${n} UM left.` },
    leftoverRight: L('Así es: lo que sobra sigue siendo tuyo.', 'Right: what is left over is still yours.'),
    leftoverGentle: L('Piénsalo otra vez: pagar tu elección no hace desaparecer lo que sobra.', 'Think again: paying for your choice does not make the leftover money vanish.'),
    stepNotFit: L('1. Lo que no cabe', '1. What does not fit'),
    stepPrefer: L('2. Tu preferencia', '2. Your preference'),
    stepLeft: L('3. Lo que dejas', '3. What you give up'),
    stepLeftover: L('4. Lo que sobra', '4. What is left over'),
  },
  ledger: {
    concept: L('Qué fue', 'What it was'),
    kindIn: L('Entra', 'In'),
    kindOut: L('Sale', 'Out'),
    balance: L('Queda', 'Left'),
    start: { es: (n: number) => `Saldo inicial: ${n} UM`, en: (n: number) => `Starting balance: ${n} UM` },
    check: { es: (n: number) => `Comprobación: el saldo final es ${n} UM.`, en: (n: number) => `Check: the final balance is ${n} UM.` },
    pickBalance: L('Elige el saldo final', 'Pick the final balance'),
    hint: {
      right: L('Sí. Cada movimiento sumó o restó en su lugar.', 'Yes. Each movement added or subtracted in its place.'),
      forgotLast: L('Mira otra vez: parece que falta tener en cuenta el último movimiento.', 'Look again: it seems the last movement was left out.'),
      signError: L('Mira otra vez: lo que sale resta, no suma.', 'Look again: money going out subtracts, it does not add.'),
      ignoredIncome: L('Mira otra vez: lo que entra suma al saldo.', 'Look again: money coming in adds to the balance.'),
    } satisfies Record<FinanzasBalanceKind, FinanzasLoc>,
    missingTitle: L('Un movimiento sin anotar', 'A movement not written down'),
    missingRight: L('Sí: el registro muestra más dinero del que de verdad queda.', 'Yes: the record shows more money than is really left.'),
    missingGentle: L('Piénsalo otra vez: si no anotas un gasto, ¿el saldo anotado queda más alto o más bajo?', 'Think again: if you do not write down a spending, is the written balance higher or lower?'),
  },
  reserve: {
    plan: L('Tu plan', 'Your plan'),
    arrives: L('Llega', 'Here comes'),
    payWithReserve: L('Pagar con la reserva', 'Pay from the reserve'),
    small: L('Imprevisto pequeño', 'Small surprise'),
    big: L('Imprevisto más grande', 'Bigger surprise'),
    otherDay: L('Imagina otro día: llega un imprevisto más grande que el primero.', 'Imagine another day: a surprise bigger than the first one arrives.'),
    paid: { es: (n: number) => `La reserva pagó ${n} UM y se actualizó el saldo.`, en: (n: number) => `The reserve paid ${n} UM and the balance was updated.` },
    short: { es: (n: number) => `La reserva no alcanzó: faltan ${n} UM. Eso pasa y se puede ajustar.`, en: (n: number) => `The reserve was not enough: ${n} UM are missing. It happens and it can be adjusted.` },
    left: { es: (n: number) => `Quedan ${n} UM en la reserva.`, en: (n: number) => `${n} UM are left in the reserve.` },
    freeAvailable: { es: (n: number) => `Dinero libre y opcional disponible: ${n} UM.`, en: (n: number) => `Free and optional money available: ${n} UM.` },
    adjustTitle: L('Ajustar el plan', 'Adjust the plan'),
    rebuildTitle: L('Después', 'Afterwards'),
    answered: L('Anotado. Cualquiera de esas ideas puede servir; lo importante es decidir con calma.', 'Noted. Any of those ideas can work; what matters is deciding calmly.'),
  },
  offer: {
    mailbox: L('Buzón de mentira', 'Pretend mailbox'),
    message: { es: (n: number, total: number) => `Mensaje ${n} de ${total}`, en: (n: number, total: number) => `Message ${n} of ${total}` },
    stop: L('Ante una señal: parar y pedir ayuda', 'Spot a sign: stop and ask for help'),
    exactNone: L('Bien visto: este mensaje no tiene señales de alerta.', 'Well spotted: this message has no warning signs.'),
    exact: L('Viste todas las señales. Parar y pedir ayuda es lo seguro.', 'You saw all the signs. Stopping and asking for help is the safe thing.'),
    lookAgain: L('Mira otra vez el mensaje: puede que falte o sobre alguna señal.', 'Look at the message again: a sign may be missing or there may be one too many.'),
    actionFits: L('Esa acción te cuida.', 'That action takes care of you.'),
    actionGentle: L('Hay una acción que te cuida más. Léelas otra vez.', 'There is an action that takes better care of you. Read them again.'),
    reminder: L('Un logo o una foto no prueban que un mensaje sea de verdad.', 'A logo or a photo does not prove a message is real.'),
  },
  project: {
    unassigned: { es: (n: number) => `Sin repartir: ${n} UM`, en: (n: number) => `Not assigned: ${n} UM` },
    total: { es: (n: number) => `Dinero del proyecto: ${n} UM`, en: (n: number) => `Project money: ${n} UM` },
    howTo: L('Toca el sobre del que sale el dinero y después el que lo recibe.', 'Tap the envelope the money comes out of, then the one that receives it.'),
    from: { es: (name: string) => `Sale de: ${name}`, en: (name: string) => `From: ${name}` },
    pickTo: L('Ahora toca el sobre que lo recibe.', 'Now tap the envelope that receives it.'),
    moved: { es: (n: number) => `Movimientos: ${n}`, en: (n: number) => `Moves: ${n}` },
    reset: L('Volver al plan de antes', 'Back to the earlier plan'),
    cover: { es: (a: number, c: number) => `${a} de ${c} UM`, en: (a: number, c: number) => `${a} of ${c} UM` },
    issue: {
      'over-budget': L('Repartiste más dinero del que hay.', 'You have assigned more money than there is.'),
      'essential-uncovered': L('Todavía falta cubrir algo esencial.', 'Something essential is still not covered.'),
      negative: L('Un sobre quedó con menos de cero.', 'An envelope ended up below zero.'),
    } satisfies Record<FinanzasPlanIssue, FinanzasLoc>,
    valid: L('Tu plan cubre lo esencial. 👍', 'Your plan covers the essentials. 👍'),
    compareTitle: L('Tu plan nuevo y el de antes', 'Your new plan and the earlier one'),
    before: L('Antes', 'Before'),
    after: L('Ahora', 'Now'),
    reserveRow: L('Reserva', 'Reserve'),
    optionalRow: L('Gastos opcionales', 'Optional spending'),
    essentialRow: L('Lo esencial', 'The essentials'),
    covered: L('cubierto', 'covered'),
    notCovered: L('sin cubrir', 'not covered'),
    noWinner: L('No gana el plan que guarda más dinero: gana el que protege lo importante.', 'The plan that keeps the most money does not win: the one that protects what matters does.'),
  },
  notebook: {
    title: L('Finanzas', 'Finance'),
    unitsTitle: L('Tu unidad', 'Your unit'),
    grade: { es: (g: number) => `${g}.º grado`, en: (g: number) => `Grade ${g}` },
    meetings: { es: (n: number) => `${n} encuentros`, en: (n: number) => `${n} meetings`  },
    done: L('Hecha', 'Done'),
    notFirst: L('Más unidades llegarán después del piloto.', 'More units will come after the pilot.'),
  },
  closing: {
    reason: {
      adjustedAndExplained: L('por ajustar tu plan y explicar tu decisión', 'for adjusting your plan and explaining your decision'),
      adjusted: L('por ajustar tu plan', 'for adjusting your plan'),
      explained: L('por explicar tus decisiones', 'for explaining your decisions'),
      completed: L('por terminar la unidad', 'for finishing the unit'),
    } satisfies Record<FinanzasReason, FinanzasLoc>,
    meetings: L('Encuentros', 'Meetings'),
    plan: L('Plan ajustado', 'Plan adjusted'),
    yes: L('Sí', 'Yes'),
    notYet: L('Aún no', 'Not yet'),
  },
} as const;

export const finanzasT = (loc: FinanzasLoc, lang: FinanzasLang): string => loc[lang];

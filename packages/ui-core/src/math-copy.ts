/**
 * Textos de la interfaz del cuaderno de Matemáticas, en los dos idiomas (el contenido de las lecciones trae los suyos).
 * Tono de acompañamiento: nunca "incorrecto" (docs/06); "Revisemos…" y otra oportunidad (docs/research §5).
 */
export type MathLang = 'es' | 'en';

const L = <T>(es: T, en: T) => ({ es, en });

export const MATH_COPY = {
  subject: L('Matemáticas', 'Math'),
  phases: L({ aprender: 'Aprender', explorar: 'Explorar', practicar: 'Practicar', juego: 'Juego' }, { aprender: 'Learn', explorar: 'Explore', practicar: 'Practice', juego: 'Game' }),
  lessonOf: L((n: number, total: number) => `Lección ${n} de ${total}`, (n: number, total: number) => `Lesson ${n} of ${total}`),
  listen: L('Escuchar', 'Listen'),
  keyIdea: L('Idea clave', 'Key idea'),
  gotIt: L('¡Entendí! ›', 'Got it! ›'),
  again: L('Otra vez', 'Again'),
  next: L('Seguir ›', 'Next ›'),
  check: L('Comprobar', 'Check'),
  hint: L('Pista', 'Hint'),
  moreHelp: L('Más ayuda', 'More help'),
  later: L('Lo veo luego', 'Save for later'),
  laterNote: L('Volverá en tu repaso. ¡Sin problema!', 'It will come back in your review. No problem!'),
  confidenceQ: L('¿Qué tan seguro estás?', 'How sure are you?'),
  confidence: L({ seguro: 'Seguro', masOMenos: 'Más o menos', adivino: 'Adivino' }, { seguro: 'Sure', masOMenos: 'Kind of', adivino: 'Guessing' }),
  confidenceNote: L('Decir «adivino» también es saber algo de ti. Nunca resta.', 'Saying “guessing” tells us something too. It never takes points away.'),
  chooseConfidence: L('Antes de comprobar, dinos qué tan seguro estás.', 'Before you check, tell us how sure you are.'),
  hintTitles: L(['Pista', 'Ejemplo resuelto', 'Respuesta explicada'], ['Hint', 'Worked example', 'Answer explained']),
  yourAnswer: L('Tu respuesta', 'Your answer'),
  warmup: L('Calentamiento: vuelve algo que practicaste', 'Warm-up: something you practiced is back'),
  explore: {
    buildEqualGroups: L((g: number, p: number) => `Pon ${p} fichas en cada una de las ${g} bolsas. Toca una bolsa para agregar una ficha.`, (g: number, p: number) => `Put ${p} counters in each of the ${g} bags. Tap a bag to add a counter.`),
    connectModelToEquation: L('Toca cada grupo para contarlo.', 'Tap each group to count it.'),
    buildArray: L((r: number, c: number) => `Pinta un arreglo de ${r} filas con ${c} puntos en cada una.`, (r: number, c: number) => `Paint an array with ${r} rows of ${c} dots.`),
    modelStory: L('Toca cada parte de la barra para llenarla.', 'Tap each part of the bar to fill it.'),
    left: L((n: number) => `Quedan ${n} fichas`, (n: number) => `${n} counters left`),
    painted: L((n: number, t: number) => `Pintaste ${n} de ${t}`, (n: number, t: number) => `You painted ${n} of ${t}`),
    done: L('¡Lo armaste!', 'You built it!'),
    undo: L('Quitar una', 'Take one out'),
  },
  model: {
    groupsOf: L((g: number, p: number) => `${g} grupos de ${p}`, (g: number, p: number) => `${g} groups of ${p}`),
    rowsOf: L((r: number, c: number) => `${r} filas de ${c}`, (r: number, c: number) => `${r} rows of ${c}`),
  },
  game: {
    title: L('Une cada tarjeta con su número', 'Match each card with its number'),
    tryAnother: L('Ese no. Prueba otra pareja.', 'Not that one. Try another pair.'),
    done: L('¡Todas las parejas!', 'All pairs matched!'),
  },
  closure: { done: L('Terminar', 'Finish') },
  notebook: {
    title: L('Cuaderno de Matemáticas', 'Math notebook'),
    unit: L('Unidad', 'Unit'),
    youAreHere: L('¡Estás aquí!', 'You are here!'),
    start: L((name: string) => `Empezar: ${name} ›`, (name: string) => `Start: ${name} ›`),
    again: L((name: string) => `Otra vez: ${name} ›`, (name: string) => `Again: ${name} ›`),
    draft: L('Estándares en borrador: los revisa un docente.', 'Standards are a draft: a teacher reviews them.'),
    mastery: L({ none: 'Por empezar', explorando: 'Explorando', practicando: 'Practicando', dominado: 'Dominado' }, { none: 'Not started', explorando: 'Exploring', practicando: 'Practicing', dominado: 'Mastered' }),
  },
} as const;

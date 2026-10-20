import type { ArtLang } from './project.ts';
import type { Encounter3Id, ExampleId, Idea, Missing3, Moment, Plan } from './unit3-model.ts';

/**
 * Textos de la unidad A1-U06 «Una historia de recortes» (ES/EN). Tono de acompañamiento: nada de «correcto/incorrecto», «bien/mal» ni puntos; el niño
 * cuenta SU historia (no hay una «buena»): lo único que se mira es el orden de las escenas y qué cambia entre ellas. Frases cortas para 1.º.
 */
export interface Unit3Copy {
  title: string;
  grade: string;
  blurb: string;
  card: (done: number) => string;
  suggested: string;
  start: string;
  resume: string;
  encounter: (n: number) => string;
  encounters: Record<Encounter3Id, { title: string; goal: string }>;
  ready: string;
  readyDone: string;
  next: string;
  finish: string;
  missingTitle: string;
  missing: Record<Missing3, string>;
  // e1
  lookIntro: string;
  exampleLabel: (id: ExampleId) => string;
  exampleOrderBadge: (n: number) => string;
  lookQ: string;
  lookPicked: (n: number) => string;
  lookReset: string;
  lookHint: string;
  lookOk: string;
  // e2
  exploreIntro: string;
  exploreCount: (n: number) => string;
  // e3
  ideaIntro: string;
  ideaQ: string;
  ideas: Record<Idea, string>;
  planQ: string;
  plans: Record<Plan, string>;
  // e4
  firstIntro: string;
  sceneName: (n: number) => string;
  piecesCount: (n: number) => string;
  // e5
  nextIntro: string;
  before: string;
  startFromBefore: string;
  startFromBeforeHint: string;
  sceneChanged: string;
  sceneSame: string;
  // e6
  tellIntro: string;
  tellQ: string;
  tellSeen: (change: string) => string;
  tellNotSeen: string;
  momentQ: string;
  moments: Record<Moment, string>;
  folder: string;
  folderIdea: (l: string) => string;
  folderPlan: (l: string) => string;
  folderTold: (l: string) => string;
  folderMoment: (l: string) => string;
  capsuleNote: string;
  // cierre
  doneTitle: string;
  doneText: string;
  starsTitle: string;
  starExplored: string;
  starSequenced: string;
  starExplained: string;
  back: string;
}

const ES: Unit3Copy = {
  title: 'Una historia de recortes',
  grade: '1.º',
  blurb: 'Pega recortes de papel en tres escenas para contar algo: el principio, lo que pasa y el final.',
  card: (n) => `${n} de 6 encuentros`,
  suggested: 'Para ti',
  start: 'Empezar',
  resume: 'Seguir',
  encounter: (n) => `Encuentro ${n}`,
  encounters: {
    look: { title: 'Mira', goal: 'Poner en orden tres escenas para ver cómo va una historia.' },
    explore: { title: 'Prueba piezas', goal: 'Pegar formas y cambiarlas: más grandes, más pequeñas, giradas.' },
    idea: { title: 'Tu idea', goal: 'Elegir qué historia quieres contar y qué va a cambiar.' },
    first: { title: 'El principio', goal: 'Hacer la primera escena.' },
    next: { title: 'Lo que pasa y el final', goal: 'Hacer las otras dos escenas cambiando algo en cada una.' },
    tell: { title: 'Cuéntala', goal: 'Mirar tus tres escenas y decir qué cambió.' },
  },
  ready: 'Listo',
  readyDone: 'Hecho ✓',
  next: 'Siguiente',
  finish: 'Terminar',
  missingTitle: 'Para marcar este encuentro como hecho:',
  missing: {
    look: 'Toca las tres escenas en el orden de la historia.',
    play: 'Pega al menos tres piezas, de dos formas distintas, y cambia una (más grande, más pequeña o girada).',
    idea: 'Elige qué historia quieres contar.',
    plan: 'Elige qué va a cambiar.',
    scene1: 'Pega al menos tres piezas en la primera escena.',
    scene2: 'En la segunda escena pega al menos tres piezas y cambia algo respecto a la primera.',
    scene3: 'En la tercera escena pega al menos tres piezas y cambia algo respecto a la segunda.',
    told: 'Elige qué cambió en tu historia.',
    moment: 'Elige cuándo pasa lo más importante.',
  },
  lookIntro: 'Estas tres escenas cuentan un viaje en barco, pero están mezcladas. Míralas con calma.',
  exampleLabel: (id) => `Escena ${id}`,
  exampleOrderBadge: (n) => `${n}.º`,
  lookQ: 'Toca las escenas en el orden en que pasa la historia: primero, después y al final.',
  lookPicked: (n) => `Has tocado ${n} de 3`,
  lookReset: 'Empezar de nuevo',
  lookHint: 'Mira otra vez: ¿dónde está el barco en cada escena? ¿Hacia dónde va?',
  lookOk: 'Sí: el barco va avanzando, y así se nota cuál escena va primero, cuál después y cuál al final.',
  exploreIntro: 'Pega formas de papel en este cartón para probar. No es parte de tu historia.',
  exploreCount: (n) => (n === 1 ? 'Hay 1 pieza' : `Hay ${n} piezas`),
  ideaIntro: 'Antes de pegar, piensa qué historia quieres contar.',
  ideaQ: '¿Qué historia quieres contar?',
  ideas: { travels: 'Algo que viaja de un lado a otro', grows: 'Algo que crece', arrives: 'Alguien o algo que llega' },
  planQ: '¿Qué va a cambiar de una escena a otra?',
  plans: { moved: 'Algo se mueve de lugar', appeared: 'Aparece algo nuevo', grew: 'Algo se hace más grande o más pequeño' },
  firstIntro: 'Haz la primera escena: dónde empieza tu historia.',
  sceneName: (n) => (n === 1 ? 'Principio' : n === 2 ? 'Lo que pasa' : 'Final'),
  piecesCount: (n) => (n === 1 ? '1 pieza' : `${n} piezas`),
  nextIntro: 'Haz las otras dos escenas. Cambia algo de una a otra: mueve una pieza, agrega una nueva o hazla más grande.',
  before: 'La escena de antes',
  startFromBefore: 'Empezar con las piezas de antes',
  startFromBeforeHint: 'Así las mismas piezas siguen en la escena nueva y solo cambias lo que quieras.',
  sceneChanged: 'Ya cambió algo respecto a la escena de antes.',
  sceneSame: 'Todavía es igual a la escena de antes: cambia algo.',
  tellIntro: 'Mira tus tres escenas en orden.',
  tellQ: '¿Qué cambió en tu historia?',
  tellSeen: (c) => `Veo que en tus escenas: ${c.toLowerCase()}.`,
  tellNotSeen: 'No lo veo todavía en tus escenas. Puedes volver a una escena y cambiarlo, o elegir otra cosa.',
  momentQ: '¿Cuándo pasa lo más importante?',
  moments: { first: 'En la primera escena', middle: 'En la del medio', last: 'En la última escena' },
  folder: 'Tu carpeta',
  folderIdea: (l) => `Tu historia: ${l.toLowerCase()}.`,
  folderPlan: (l) => `Pensaste que iba a cambiar: ${l.toLowerCase()}.`,
  folderTold: (l) => `Contaste que cambió: ${l.toLowerCase()}.`,
  folderMoment: (l) => `Lo más importante pasa: ${l.toLowerCase()}.`,
  capsuleNote: 'Pronto: una mirada a artistas que cuentan historias con recortes, con su fuente.',
  doneTitle: 'Tu historia está lista',
  doneText: 'Tus tres escenas se quedan guardadas en tus creaciones. Puedes abrirlas cuando quieras.',
  starsTitle: 'Lo que hiciste',
  starExplored: 'Exploraste: ordenaste escenas y probaste piezas',
  starSequenced: 'Contaste en orden: tres escenas, y en cada una cambiaste algo',
  starExplained: 'Explicaste: dijiste qué cambió y cuándo pasa lo más importante',
  back: 'Volver',
};

const EN: Unit3Copy = {
  title: 'A story in paper cutouts',
  grade: 'Grade 1',
  blurb: 'Stick paper cutouts into three scenes to tell something: the beginning, what happens and the end.',
  card: (n) => `${n} of 6 sessions`,
  suggested: 'For you',
  start: 'Start',
  resume: 'Continue',
  encounter: (n) => `Session ${n}`,
  encounters: {
    look: { title: 'Look', goal: 'Put three scenes in order to see how a story goes.' },
    explore: { title: 'Try pieces', goal: 'Stick shapes and change them: bigger, smaller, turned.' },
    idea: { title: 'Your idea', goal: 'Pick the story you want to tell and what will change.' },
    first: { title: 'The beginning', goal: 'Make the first scene.' },
    next: { title: 'What happens and the end', goal: 'Make the other two scenes, changing something in each one.' },
    tell: { title: 'Tell it', goal: 'Look at your three scenes and say what changed.' },
  },
  ready: 'Done',
  readyDone: 'Done ✓',
  next: 'Next',
  finish: 'Finish',
  missingTitle: 'To mark this session as done:',
  missing: {
    look: 'Tap the three scenes in the order of the story.',
    play: 'Stick at least three pieces, of two different shapes, and change one (bigger, smaller or turned).',
    idea: 'Pick the story you want to tell.',
    plan: 'Pick what will change.',
    scene1: 'Stick at least three pieces in the first scene.',
    scene2: 'In the second scene stick at least three pieces and change something from the first.',
    scene3: 'In the third scene stick at least three pieces and change something from the second.',
    told: 'Pick what changed in your story.',
    moment: 'Pick when the most important thing happens.',
  },
  lookIntro: 'These three scenes tell a boat trip, but they are mixed up. Take a calm look at them.',
  exampleLabel: (id) => `Scene ${id}`,
  exampleOrderBadge: (n) => `${n}`,
  lookQ: 'Tap the scenes in the order the story happens: first, then, and at the end.',
  lookPicked: (n) => `You tapped ${n} of 3`,
  lookReset: 'Start again',
  lookHint: 'Look again: where is the boat in each scene? Where is it going?',
  lookOk: 'Yes: the boat moves along, so you can tell which scene is first, which is next and which is last.',
  exploreIntro: 'Stick paper shapes on this board to try them out. It is not part of your story.',
  exploreCount: (n) => (n === 1 ? 'There is 1 piece' : `There are ${n} pieces`),
  ideaIntro: 'Before sticking, think about the story you want to tell.',
  ideaQ: 'What story do you want to tell?',
  ideas: { travels: 'Something that travels from one side to the other', grows: 'Something that grows', arrives: 'Someone or something that arrives' },
  planQ: 'What will change from one scene to the next?',
  plans: { moved: 'Something moves to another place', appeared: 'Something new shows up', grew: 'Something gets bigger or smaller' },
  firstIntro: 'Make the first scene: where your story begins.',
  sceneName: (n) => (n === 1 ? 'Beginning' : n === 2 ? 'What happens' : 'End'),
  piecesCount: (n) => (n === 1 ? '1 piece' : `${n} pieces`),
  nextIntro: 'Make the other two scenes. Change something from one to the next: move a piece, add a new one or make one bigger.',
  before: 'The scene before',
  startFromBefore: 'Start with the pieces from before',
  startFromBeforeHint: 'That way the same pieces stay in the new scene and you only change what you want.',
  sceneChanged: 'Something already changed from the scene before.',
  sceneSame: 'It is still the same as the scene before: change something.',
  tellIntro: 'Look at your three scenes in order.',
  tellQ: 'What changed in your story?',
  tellSeen: (c) => `I can see that in your scenes: ${c.toLowerCase()}.`,
  tellNotSeen: 'I do not see it in your scenes yet. You can go back to a scene and change it, or pick something else.',
  momentQ: 'When does the most important thing happen?',
  moments: { first: 'In the first scene', middle: 'In the middle one', last: 'In the last scene' },
  folder: 'Your folder',
  folderIdea: (l) => `Your story: ${l.toLowerCase()}.`,
  folderPlan: (l) => `You thought this would change: ${l.toLowerCase()}.`,
  folderTold: (l) => `You said that: ${l.toLowerCase()}.`,
  folderMoment: (l) => `The most important thing happens: ${l.toLowerCase()}.`,
  capsuleNote: 'Coming soon: a look at artists who tell stories with paper cutouts, with their source.',
  doneTitle: 'Your story is ready',
  doneText: 'Your three scenes stay saved in your creations. You can open them whenever you want.',
  starsTitle: 'What you did',
  starExplored: 'You explored: you ordered scenes and tried pieces',
  starSequenced: 'You told it in order: three scenes, and you changed something in each',
  starExplained: 'You explained: you said what changed and when the most important thing happens',
  back: 'Back',
};

export const UNIT3_COPY: Record<ArtLang, Unit3Copy> = { es: ES, en: EN };

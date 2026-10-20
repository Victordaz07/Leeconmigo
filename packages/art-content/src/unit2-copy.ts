import type { ArtLang } from './project.ts';
import type { Change, Decision, Encounter2Id, ExampleChoice, Intention2, Missing2, Relation, Seen } from './unit2-model.ts';

/**
 * Textos de la unidad A2-U02 «Colores que se relacionan» (ES/EN). Tono de acompañamiento: nada de «correcto/incorrecto», «bien/mal» ni puntos;
 * ninguna imagen «debe» transmitir una emoción (el niño elige la suya) y las preguntas piden relacionar una diferencia con una decisión.
 */
export interface Unit2Copy {
  title: string;
  grade: string;
  blurb: string;
  card: (done: number) => string;
  suggested: string;
  start: string;
  resume: string;
  encounter: (n: number) => string;
  encounters: Record<Encounter2Id, { title: string; goal: string }>;
  ready: string;
  readyDone: string;
  next: string;
  finish: string;
  missingTitle: string;
  missing: Record<Missing2, string>;
  // e1
  lookIntro: string;
  paletteName: (c: ExampleChoice) => string;
  paletteDescription: (c: ExampleChoice) => string;
  lookQ: string;
  lookHint: string;
  lookOk: string;
  // e2
  mixIntro: string;
  mixedYes: (n: number) => string;
  mixedNo: string;
  // e3
  paletteIntro: string;
  paletteCount: (n: number) => string;
  paletteFull: string;
  relationQ: string;
  relations: Record<Relation, string>;
  // e4
  firstIntro: string;
  intentionQ: string;
  intentions: Record<Intention2, string>;
  onlyYourColors: string;
  // e5
  secondIntro: string;
  firstThumb: string;
  changedQ: string;
  changes: Record<Change, string>;
  // e6
  compareIntro: string;
  firstLabel: string;
  secondLabel: string;
  seenQ: string;
  seen: Record<Seen, string>;
  decisionQ: string;
  decisions: Record<Decision, string>;
  folder: string;
  folderPalette: string;
  folderRelation: (l: string) => string;
  folderIntention: (l: string) => string;
  folderChanged: (l: string) => string;
  capsuleNote: string;
  // cierre
  doneTitle: string;
  doneText: string;
  starsTitle: string;
  starExplored: string;
  starCompared: string;
  starExplained: string;
  back: string;
  paintingN: (n: number) => string;
  emptyPainting: string;
}

const ES: Unit2Copy = {
  title: 'Colores que se relacionan',
  grade: '2.º',
  blurb: 'Mezcla tus colores, elige una paleta de cuatro y haz dos cuadros distintos con ella.',
  card: (n) => `${n} de 6 encuentros`,
  suggested: 'Para ti',
  start: 'Empezar',
  resume: 'Seguir',
  encounter: (n) => `Encuentro ${n}`,
  encounters: {
    look: { title: 'Mira', goal: 'Mirar dos paletas y ver cuál tiene colores que se parecen más.' },
    mix: { title: 'Mezcla', goal: 'Inventar un color mezclando pinturas.' },
    palette: { title: 'Tu paleta', goal: 'Elegir cuatro colores y contar cómo se relacionan.' },
    first: { title: 'Primer cuadro', goal: 'Pintar un cuadro con tu paleta.' },
    second: { title: 'Segundo cuadro', goal: 'Pintar otro cuadro con la misma paleta, cambiando algo.' },
    compare: { title: 'Compara', goal: 'Ver qué cambió entre tus dos cuadros y por qué.' },
  },
  ready: 'Listo',
  readyDone: 'Hecho ✓',
  next: 'Siguiente',
  finish: 'Terminar',
  missingTitle: 'Para marcar este encuentro como hecho:',
  missing: {
    look: 'Toca la paleta con los colores que más se parecen.',
    mixed: 'Mezcla un color y guárdalo.',
    four: 'Elige cuatro colores para tu paleta.',
    relation: 'Cuenta cómo se relacionan tus colores.',
    strokes1: 'Pinta tu cuadro con los cuatro colores de tu paleta (unos cuantos trazos bastan).',
    intention: 'Elige cómo quieres que se vea tu cuadro.',
    strokes2: 'Pinta tu segundo cuadro con los mismos cuatro colores (unos cuantos trazos bastan).',
    changed: 'Cuenta qué cambiaste.',
    bothPaintings: 'Pinta los dos cuadros, y que no sean iguales.',
    seen: 'Elige qué diferencia ves.',
    decision: 'Cuenta por qué lo cambiaste.',
  },
  lookIntro: 'Estas son dos paletas de cuatro colores. Míralas con calma.',
  paletteName: (c) => `Paleta ${c}`,
  paletteDescription: (c) => (c === 'A' ? 'Paleta A: cuatro azules, de más oscuro a más claro' : 'Paleta B: rojo, amarillo, verde y negro'),
  lookQ: '¿En cuál de las dos se parecen más los colores entre sí?',
  lookHint: 'Mira otra vez: ¿cuál parece de una sola familia de color?',
  lookOk: 'Sí: los colores de la paleta A son de la misma familia (un azul más claro o más oscuro). Esos colores se relacionan.',
  mixIntro: 'Echa gotas de pintura hasta que salga un color que te guste, y guárdalo.',
  mixedYes: (n) => (n === 1 ? 'Ya tienes 1 color mezclado por ti.' : `Ya tienes ${n} colores mezclados por ti.`),
  mixedNo: 'Todavía no has guardado un color mezclado.',
  paletteIntro: 'Toca cuatro colores para tu paleta. Puedes cambiarlos cuando quieras.',
  paletteCount: (n) => `${n} de 4 colores elegidos`,
  paletteFull: 'Ya tienes cuatro. Toca uno elegido para quitarlo y poner otro.',
  relationQ: '¿Cómo se relacionan tus cuatro colores?',
  relations: { family: 'Son del mismo color, unos más claros y otros más oscuros', shared: 'Comparten una pintura en su mezcla', contrast: 'Son muy distintos entre sí, a propósito' },
  firstIntro: 'Pinta tu primer cuadro. Solo salen los cuatro colores de tu paleta.',
  intentionQ: '¿Cómo quieres que se vea tu cuadro?',
  intentions: { calm: 'Tranquilo', lively: 'Con mucha vida', mystery: 'Misterioso' },
  onlyYourColors: 'Los colores de tu paleta',
  secondIntro: 'Pinta otro cuadro con la misma paleta. Cambia algo: dónde pones los colores, qué tan claros u oscuros los usas, o cuánto se diferencian.',
  firstThumb: 'Tu primer cuadro',
  changedQ: '¿Qué cambiaste en tu segundo cuadro?',
  changes: { distribution: 'Dónde puse los colores', value: 'Qué tan claros u oscuros', contrast: 'Cuánto se diferencian' },
  compareIntro: 'Mira tus dos cuadros juntos.',
  firstLabel: 'Primer cuadro',
  secondLabel: 'Segundo cuadro',
  seenQ: '¿Qué diferencia ves entre tus dos cuadros?',
  seen: { where: 'Los colores están en otros lugares', light: 'Uno se ve más claro o más oscuro', contrast: 'En uno los colores se diferencian más' },
  decisionQ: '¿Por qué hiciste ese cambio?',
  decisions: { calmer: 'Quería que se sintiera más tranquilo', livelier: 'Quería que tuviera más vida', clearer: 'Quería que se viera más claro', try: 'Quería probar algo distinto' },
  folder: 'Tu carpeta',
  folderPalette: 'Tu paleta de cuatro colores:',
  folderRelation: (l) => `Tus colores: ${l.toLowerCase()}.`,
  folderIntention: (l) => `Querías un cuadro ${l.toLowerCase()}.`,
  folderChanged: (l) => `En el segundo cuadro cambiaste: ${l.toLowerCase()}.`,
  capsuleNote: 'Pronto: una mirada a obras de artistas que usan pocos colores, con su fuente.',
  doneTitle: 'Tus dos cuadros están listos',
  doneText: 'Se quedan guardados en tus creaciones. Puedes volver a abrirlos cuando quieras.',
  starsTitle: 'Lo que hiciste',
  starExplored: 'Exploraste: mezclaste un color y armaste tu paleta',
  starCompared: 'Comparaste: hiciste dos cuadros distintos con la misma paleta',
  starExplained: 'Explicaste tu decisión',
  back: 'Volver',
  paintingN: (n) => `Cuadro ${n}`,
  emptyPainting: 'Todavía no hay trazos.',
};

const EN: Unit2Copy = {
  title: 'Colors that relate',
  grade: 'Grade 2',
  blurb: 'Mix your colors, pick a four-color palette and make two different paintings with it.',
  card: (n) => `${n} of 6 sessions`,
  suggested: 'For you',
  start: 'Start',
  resume: 'Continue',
  encounter: (n) => `Session ${n}`,
  encounters: {
    look: { title: 'Look', goal: 'Look at two palettes and see which one has colors that are more alike.' },
    mix: { title: 'Mix', goal: 'Invent a color by mixing paints.' },
    palette: { title: 'Your palette', goal: 'Pick four colors and tell how they relate.' },
    first: { title: 'First painting', goal: 'Paint a picture with your palette.' },
    second: { title: 'Second painting', goal: 'Paint another picture with the same palette, changing something.' },
    compare: { title: 'Compare', goal: 'See what changed between your two paintings and why.' },
  },
  ready: 'Done',
  readyDone: 'Done ✓',
  next: 'Next',
  finish: 'Finish',
  missingTitle: 'To mark this session as done:',
  missing: {
    look: 'Tap the palette whose colors are most alike.',
    mixed: 'Mix a color and save it.',
    four: 'Pick four colors for your palette.',
    relation: 'Tell how your colors relate.',
    strokes1: 'Paint your picture with the four colors of your palette (a few strokes are enough).',
    intention: 'Pick how you want your painting to look.',
    strokes2: 'Paint your second picture with the same four colors (a few strokes are enough).',
    changed: 'Tell what you changed.',
    bothPaintings: 'Paint both pictures, and make them different.',
    seen: 'Pick the difference you see.',
    decision: 'Tell why you changed it.',
  },
  lookIntro: 'Here are two palettes of four colors. Take a calm look at them.',
  paletteName: (c) => `Palette ${c}`,
  paletteDescription: (c) => (c === 'A' ? 'Palette A: four blues, from darker to lighter' : 'Palette B: red, yellow, green and black'),
  lookQ: 'In which of the two are the colors more alike?',
  lookHint: 'Look again: which one looks like a single color family?',
  lookOk: 'Yes: the colors in palette A are one family (a lighter or darker blue). Those colors relate.',
  mixIntro: 'Add drops of paint until you get a color you like, and save it.',
  mixedYes: (n) => (n === 1 ? 'You already have 1 color you mixed.' : `You already have ${n} colors you mixed.`),
  mixedNo: 'You have not saved a mixed color yet.',
  paletteIntro: 'Tap four colors for your palette. You can change them any time.',
  paletteCount: (n) => `${n} of 4 colors picked`,
  paletteFull: 'You already have four. Tap a picked one to remove it and add another.',
  relationQ: 'How do your four colors relate?',
  relations: { family: 'They are the same color, some lighter and some darker', shared: 'They share a paint in their mix', contrast: 'They are very different from each other, on purpose' },
  firstIntro: 'Paint your first picture. Only the four colors of your palette are available.',
  intentionQ: 'How do you want your painting to look?',
  intentions: { calm: 'Calm', lively: 'Full of life', mystery: 'Mysterious' },
  onlyYourColors: 'The colors of your palette',
  secondIntro: 'Paint another picture with the same palette. Change something: where you put the colors, how light or dark you use them, or how different they are.',
  firstThumb: 'Your first painting',
  changedQ: 'What did you change in your second painting?',
  changes: { distribution: 'Where I put the colors', value: 'How light or dark', contrast: 'How different they are' },
  compareIntro: 'Look at your two paintings together.',
  firstLabel: 'First painting',
  secondLabel: 'Second painting',
  seenQ: 'What difference do you see between your two paintings?',
  seen: { where: 'The colors are in other places', light: 'One looks lighter or darker', contrast: 'In one the colors stand out more' },
  decisionQ: 'Why did you make that change?',
  decisions: { calmer: 'I wanted it to feel calmer', livelier: 'I wanted it to have more life', clearer: 'I wanted it to look clearer', try: 'I wanted to try something different' },
  folder: 'Your folder',
  folderPalette: 'Your four-color palette:',
  folderRelation: (l) => `Your colors: ${l.toLowerCase()}.`,
  folderIntention: (l) => `You wanted a ${l.toLowerCase()} painting.`,
  folderChanged: (l) => `In the second painting you changed: ${l.toLowerCase()}.`,
  capsuleNote: 'Coming soon: a look at artworks by artists who use few colors, with their source.',
  doneTitle: 'Your two paintings are ready',
  doneText: 'They stay saved in your creations. You can open them again whenever you want.',
  starsTitle: 'What you did',
  starExplored: 'You explored: you mixed a color and built your palette',
  starCompared: 'You compared: two different paintings with the same palette',
  starExplained: 'You explained your decision',
  back: 'Back',
  paintingN: (n) => `Painting ${n}`,
  emptyPainting: 'No strokes yet.',
};

export const UNIT2_COPY: Record<ArtLang, Unit2Copy> = { es: ES, en: EN };

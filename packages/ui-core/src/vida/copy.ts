/**
 * Textos de la INTERFAZ de «Para la vida» módulos 02–08 en ES/EN (rótulos, botones, retroalimentación, cierre y la ficha de cada cuaderno). Los textos de cada misión
 * (escenas, caminos, pistas) viven en `@lee-conmigo/life-content`. Tono de acompañamiento: nunca «incorrecto», nunca rojo (docs/06). Escritos de forma natural en cada
 * idioma, no traducidos palabra por palabra.
 */
export type VidaLang = 'es' | 'en';
export interface VidaLoc {
  es: string;
  en: string;
}
const L = (es: string, en: string): VidaLoc => ({ es, en });

export const VIDA_MODULE_IDS = ['emociones', 'comunicacion', 'digital', 'critico', 'autonomia', 'organizacion', 'emprendimiento'] as const;
export type VidaModuleId = (typeof VIDA_MODULE_IDS)[number];

export interface VidaModuleMeta {
  /** Número del módulo dentro de «Para la vida» (01 es Finanzas). */
  n: string;
  name: VidaLoc;
  tagline: VidaLoc;
  /** Una frase de bienvenida en la ficha del cuaderno. */
  intro: VidaLoc;
  guide: string;
}

export const VIDA_MODULES: Record<VidaModuleId, VidaModuleMeta> = {
  emociones: { n: '02', name: L('Emociones', 'Emotions'), tagline: L('Entenderme y elegir', 'Understand myself and choose'), intro: L('Aquí practicas qué hacer con lo que sientes, con historias inventadas y sin tener que contar nada tuyo.', 'Here you practice what to do with what you feel, with made-up stories and without having to share anything of your own.'), guide: 'Miel' },
  comunicacion: { n: '03', name: L('Comunicación', 'Communication'), tagline: L('Hablar, escuchar y acordar', 'Talk, listen and agree'), intro: L('Aquí pruebas respuestas distintas en conversaciones difíciles y comparas qué cambia.', 'Here you try different answers in tricky conversations and compare what changes.'), guide: 'Eco' },
  digital: { n: '04', name: L('Vida digital', 'Digital life'), tagline: L('Conectar con criterio', 'Connect with good judgment'), intro: L('Aquí practicas en pantallas de mentira: qué mirar, qué no compartir y cuándo pedir ayuda.', 'Here you practice on pretend screens: what to look at, what not to share and when to ask for help.'), guide: 'Chispa' },
  critico: { n: '05', name: L('Pensamiento crítico', 'Critical thinking'), tagline: L('Pensar antes de elegir', 'Think before you choose'), intro: L('Aquí eres detective: reúnes pistas, separas evidencia de opinión y revisas tu idea.', 'Here you are a detective: you gather clues, tell evidence from opinion and review your idea.'), guide: 'Lupa' },
  autonomia: { n: '06', name: L('Autonomía', 'Independence'), tagline: L('Puedo hacerlo paso a paso', 'I can do it step by step'), intro: L('Aquí ordenas pasos, compruebas lo que falta y aprendes cuándo pedir un adulto.', 'Here you put steps in order, check what is missing and learn when to ask a grown-up.'), guide: 'Paso' },
  organizacion: { n: '07', name: L('Organización', 'Planning'), tagline: L('Mis metas y mis estrategias', 'My goals and my strategies'), intro: L('Aquí divides tareas grandes, ajustas el plan y pruebas estrategias que te ayuden.', 'Here you break big tasks down, adjust the plan and try strategies that help you.'), guide: 'Ruta' },
  emprendimiento: { n: '08', name: L('Emprendimiento', 'Ideas that help'), tagline: L('Ideas que ayudan', 'Ideas that help'), intro: L('Aquí miras una necesidad, haces un modelo sencillo y mejoras con las opiniones de otros.', 'Here you look at a need, make a simple model and improve with other people’s opinions.'), guide: 'Dique' },
};

export type VidaFeedback = 'affirm' | 'gentle';
export type VidaReason = 'exploredAndExplained' | 'explored' | 'explained' | 'completed';
export type VidaMissing = 'explain' | 'choose' | 'sort' | 'spot';

export const VIDA_COPY = {
  shelf: L('Para la vida', 'For life'),
  preview: L('Primer vistazo', 'First look'),
  previewNote: L('Este cuaderno recién empieza: aquí tienes una primera misión. Con el tiempo habrá más.', 'This notebook is just starting: here is a first mission. There will be more over time.'),
  safetyTitle: L('Antes de empezar', 'Before you start'),
  offScreenTitle: L('Fuera de la pantalla', 'Away from the screen'),
  guideSays: { es: (name: string) => `Tu guía: ${name}`, en: (name: string) => `Your guide: ${name}` },
  button: {
    back: L('Volver', 'Back'),
    next: L('Seguir', 'Continue'),
    prev: L('Atrás', 'Previous'),
    start: L('Empezar', 'Start'),
    again: L('Hacerlo otra vez', 'Do it again'),
    askHelp: L('Pedir ayuda a un adulto', 'Ask a grown-up for help'),
    startOver: L('Empezar de nuevo', 'Start over'),
  },
  stepOf: { es: (n: number, total: number) => `Encuentro ${n} de ${total}`, en: (n: number, total: number) => `Meeting ${n} of ${total}` },
  mission: { es: (grade: number) => `Misión de ${grade}.º grado`, en: (grade: number) => `Grade ${grade} mission` },
  meetings: { es: (n: number) => `${n} encuentros`, en: (n: number) => `${n} meetings` },
  done: L('Hecha', 'Done'),
  learn: L('Aprende', 'Learn'),
  example: L('Un ejemplo', 'An example'),
  explainTitle: L('Explica tu decisión', 'Explain your decision'),
  helpNote: L('Pedir ayuda es parte de decidir bien. Habla con un adulto de confianza.', 'Asking for help is part of deciding well. Talk to a grown-up you trust.'),
  feedback: {
    affirm: L('Esa razón cuida lo importante. 👍', 'That reason looks after what matters. 👍'),
    gentle: L('Otra frase encaja mejor con lo que viste. Léelas otra vez y cambia si quieres.', 'Another sentence fits better with what you saw. Read them again and change if you like.'),
  } satisfies Record<VidaFeedback, VidaLoc>,
  /** Qué hace falta para seguir (siempre algo que FALTA, nunca algo «mal»). */
  missing: {
    explain: L('Falta elegir cómo explicas tu decisión.', 'You still need to pick how you explain your decision.'),
    choose: { es: (n: number) => `Mira al menos ${n} caminos para comparar.`, en: (n: number) => `Look at at least ${n} paths to compare.` },
    sort: L('Falta poner todas las tarjetas en su orden.', 'You still need to put all the cards in order.'),
    spot: L('Marca al menos una cosa que veas.', 'Mark at least one thing you notice.'),
  },
  choose: {
    paths: L('Caminos', 'Paths'),
    tap: L('Toca un camino para ver qué pasa.', 'Tap a path to see what happens.'),
    whatHappens: L('Qué pasa', 'What happens'),
    tried: { es: (n: number, total: number) => `Caminos mirados: ${n} de ${total}`, en: (n: number, total: number) => `Paths looked at: ${n} of ${total}` },
    affirm: L('Este camino cuida lo importante.', 'This path looks after what matters.'),
    gentle: L('Mira qué pasa y prueba otro camino para comparar.', 'See what happens and try another path to compare.'),
  },
  sort: {
    yourOrder: L('Tu orden', 'Your order'),
    cards: L('Tarjetas', 'Cards'),
    empty: L('Toca una tarjeta para ponerla aquí.', 'Tap a card to put it here.'),
    removeHint: L('Toca una tarjeta de tu orden para quitarla.', 'Tap a card in your order to take it out.'),
    wrong: L('Mira otra vez el orden: algo puede ir antes o después.', 'Look at the order again: something may go earlier or later.'),
    solved: L('¡Quedó en orden!', 'It is in order!'),
    placed: { es: (n: number, total: number) => `${n} de ${total} tarjetas`, en: (n: number, total: number) => `${n} of ${total} cards` },
  },
  spot: {
    mark: L('Toca lo que quieras marcar.', 'Tap what you want to mark.'),
    marked: L('Marcado', 'Marked'),
    exact: L('Viste todo lo importante. 👍', 'You saw everything that matters. 👍'),
    lookAgain: L('Mira otra vez: puede que falte algo o que sobre algo.', 'Look again: something may be missing or there may be something extra.'),
    exactNoSigns: L('Bien visto.', 'Well spotted.'),
  },
  closing: {
    reason: {
      exploredAndExplained: L('por comparar caminos y explicar tu decisión', 'for comparing paths and explaining your decision'),
      explored: L('por comparar caminos', 'for comparing paths'),
      explained: L('por explicar tus decisiones', 'for explaining your decisions'),
      completed: L('por terminar la misión', 'for finishing the mission'),
    } satisfies Record<VidaReason, VidaLoc>,
    meetings: L('Encuentros', 'Meetings'),
    paths: L('Caminos mirados', 'Paths looked at'),
  },
} as const;

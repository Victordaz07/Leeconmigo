/**
 * Textos de la interfaz (español), tomados del prototipo aprobado. Están centralizados aquí, no repartidos
 * por los componentes, para poder traducirlos al inglés después sin tocar la presentación (docs/02 regla 8).
 *
 * Reglas de docs/06 que estos textos respetan: feedback de acompañamiento y variado; nunca "Incorrecto";
 * nada de lenguaje técnico ("confidence", "pausa detectada") en la UI del niño.
 */
import type { Audience } from '@lee-conmigo/contracts';

/** Mensajes del "coach" durante la lectura. Cambian de tono según la audiencia (Explorador / Lector). */
export interface FeedbackSet {
  start: string;
  listen: string;
  good: string;
  short: string;
  long: string;
  uncertain: string;
  incorrect: (word: string) => string;
  repeated: string;
  skipped: (word: string) => string;
  praise: string;
  help: string;
  done: string;
  echo: string;
  echoDone: (word: string) => string;
  review: string;
}

const explorador: FeedbackSet = {
  start: 'Cuando quieras, empieza a leer.',
  listen: 'Te estoy escuchando…',
  good: 'Vas muy bien. Sigue leyendo.',
  short: 'Tómate tu tiempo.',
  long: '¿Te ayudo con esta palabra?',
  uncertain: 'Inténtalo otra vez, despacito.',
  incorrect: (w) => `Casi. Escuchemos «${w}».`,
  repeated: 'Muy bien, sigue adelante.',
  skipped: (w) => `Toca «${w}» si quieres escucharla.`,
  praise: '¡Muy bien! Sigue leyendo.',
  help: 'Léela conmigo, sílaba por sílaba.',
  done: '¡Leíste toda la página!',
  echo: 'Escucha, yo empiezo…',
  echoDone: (w) => `¡Ahora tú! Sigue desde «${w}».`,
  review: '¡Juguemos con tus palabras nuevas!',
};

const lector: FeedbackSet = {
  start: 'Empieza cuando quieras.',
  listen: 'Leyendo…',
  good: 'Buen ritmo.',
  short: 'Sin prisa.',
  long: '¿Necesitas una pista?',
  uncertain: 'Vuelve a intentarlo.',
  incorrect: (w) => `Revisa «${w}». Puedes escucharla.`,
  repeated: 'Bien, continúa.',
  skipped: (w) => `Te saltaste «${w}». Tócala para revisarla.`,
  praise: 'Bien resuelto.',
  help: 'Divídela en sílabas.',
  done: 'Página completa.',
  echo: 'Escucha cómo empieza…',
  echoDone: (w) => `Tu turno: sigue desde «${w}».`,
  review: 'Repasa las palabras que te costaron.',
};

export const copy = {
  feedback: { explorador, lector } satisfies Record<Audience, FeedbackSet>,

  mic: {
    echo: 'Yo leo',
    done: '¡Terminaste!',
    help: 'Ayuda abierta',
    longPause: 'Te espero',
    shortPause: 'En pausa',
    waiting: 'Listo para escuchar',
    listening: 'Te escucho',
  },

  nav: { home: 'Inicio', library: 'Biblioteca', achievements: 'Logros', settings: 'Ajustes' },

  home: {
    greeting: (name: string) => `¡Hola, ${name}!`,
    prompt: '¿Qué leemos hoy?',
    streakDays: (n: number) => `${n} días`,
    continueChip: 'Sigue leyendo',
    startChip: 'Empieza aquí',
    frameOf: (n: number, total: number) => `Cuadro ${n} de ${total}`,
    continue: 'Continuar  ›',
    start: 'Comenzar  ›',
    myStories: 'Mis historias',
    seeAll: 'Ver todas  ›',
    levels: 'Niveles',
    currentLevel: 'Tu nivel',
    changeLevel: 'Cambiar  ›',
    badgeNew: 'Nueva',
    badgeRead: 'Leída',
  },

  library: {
    title: 'Biblioteca',
    empty: 'Todavía no hay historias listas para tu idioma y nivel.',
    noResults: 'Ninguna historia coincide con estos filtros.',
    clearFilters: 'Quitar filtros',
    searchPlaceholder: 'Buscar por título...',
    filters: 'Filtros',
    genreLabel: 'Género',
    genreAll: 'Todos',
    /** Slug guardado en `Story.category` → nombre que ve el padre/niño (docs/01: sin lista cerrada todavía). */
    genreNames: {
      amistad: 'Amistad',
      misterio: 'Misterio',
      fantasia: 'Fantasía',
      'ciencia-ficcion': 'Ciencia ficción',
      crecimiento: 'Crecimiento personal',
      oficios: 'Oficios y vida cotidiana',
    } as Record<string, string>,
    levelLabel: 'Nivel',
    durationLabel: 'Duración',
    durationAny: 'Cualquiera',
    durationShort: 'Corta (≤10 min)',
    durationMedium: 'Media (11–20 min)',
    durationLong: 'Larga (20+ min)',
    statusLabel: 'Estado',
    statusAll: 'Todas',
    statusNew: 'Nuevas',
    statusRead: 'Leídas',
  },

  parentGate: {
    createTitle: 'Crea un PIN',
    createHint: 'Elige 4 números. Te los pediremos cada vez que quieras entrar al modo padres.',
    confirmTitle: 'Escríbelo otra vez',
    confirmHint: 'Para no equivocarnos, repite los mismos 4 números.',
    enterTitle: 'Modo padres',
    enterHint: 'Escribe tu PIN para entrar.',
    mismatch: 'No coinciden. Empecemos de nuevo.',
    wrong: 'No coincide. Intenta de nuevo.',
    cancel: 'Volver',
  },

  parentSettings: {
    title: 'Modo padres',
    childName: 'Nombre del niño',
    childNameHint: 'Cómo lo saludamos en Inicio y en Mi progreso.',
    language: 'Idioma de lectura',
    languageHint: 'En qué idioma se muestran las historias.',
    level: 'Nivel de lectura',
    levelHint: 'Tú eliges el nivel: no depende del grado escolar. Puede leer más despacio o más rápido que en la escuela.',
    dailyGoal: 'Meta diaria de lectura',
    dailyGoalHint: 'Minutos de lectura válida que se proponen cada día.',
    customGoal: 'Otro',
    minutes: (n: number) => `${n} min`,
    pin: 'PIN de padres',
    changePin: 'Cambiar PIN',
    freeReading: 'Modo lectura libre',
    freeReadingHint: 'El padre lee en voz alta (o el niño lee solo): un botón avanza la página en vez del micrófono. Las preguntas siguen apareciendo.',
    freeReadingOn: 'Activado',
    freeReadingOff: 'Desactivado',
    back: 'Volver a Inicio',
  },

  progress: {
    title: 'Mi progreso',
    starsCount: (n: number) => `${n} estrellas`,
    tabs: ['Resumen', 'Historias', 'Logros', 'Estadísticas'],
    storiesRead: 'Historias leídas',
    totalTime: 'Tiempo total',
    accuracy: 'Precisión',
    streak: 'Racha',
    weekTitle: 'Minutos leídos esta semana',
    weekGoal: (min: number) => `Meta: ${min} min al día`,
    practiced: 'Palabras que practicaste',
    badges: 'Mis logros',
  },

  select: {
    frames: (n: number) => `${n} cuadros para leer`,
    duration: (min: number, max: number) => (min === max ? `${min} ${min === 1 ? 'minuto' : 'minutos'}` : `${min}–${max} minutos`),
    category: 'Aventura',
    start: 'Comenzar',
    levelChip: (n: number) => `Nivel ${n}`,
    hidePanel: 'Ocultar panel',
    showPanel: 'Mostrar panel',
  },

  prep: {
    title: { explorador: '¡Vamos a leer!', lector: '¿Listo para leer?' } satisfies Record<Audience, string>,
    tips: {
      explorador: [
        { icon: '1', text: 'Lee en voz alta y con calma.', color: '#DCEBFF' },
        { icon: '2', text: 'La app te escucha y te acompaña.', color: '#D6F3E1' },
        { icon: '3', text: 'Si necesitas ayuda, solo toca una palabra.', color: '#FFF1B8' },
        { icon: '★', text: '¡Tú puedes!', color: '#FFE3D2' },
      ],
      lector: [
        { icon: '1', text: 'Lee en voz alta, a tu ritmo.', color: '#DCEBFF' },
        { icon: '2', text: 'Sigo tu lectura palabra por palabra.', color: '#D6F3E1' },
        { icon: '3', text: 'Toca cualquier palabra para ver su significado.', color: '#FFF1B8' },
        { icon: '4', text: 'Al final, un repaso rápido.', color: '#EDE8FF' },
      ],
    },
    start: 'Comenzar lectura',
  },

  reading: {
    story: 'Historia',
    help: 'Ayuda',
    listen: 'Escuchar',
    hint: 'Pista',
    readStart: 'Léeme el comienzo',
    pauseText: {
      explorador: '¿Necesitas ayuda? Toca la palabra o sigue leyendo.',
      lector: '¿Necesitas una pista? Toca la palabra o continúa.',
    } satisfies Record<Audience, string>,
    readStartButton: '▸ Léeme el comienzo',
    helpWith: (w: string) => `Ayúdame con «${w}»`,
    frameLabel: (n: number, total: number) => `Cuadro ${n} de ${total}`,
    frameShort: (n: number, total: number) => `${n}/${total}`,
    frameLong: (n: number, total: number) => `${n} de ${total}`,
    pageOf: (n: number, total: number) => `Página ${n} de ${total}`,
    sentenceOf: (n: number, total: number) => `Frase ${n} de ${total}`,
    showStory: 'Mostrar panel',
    hideStory: 'Ocultar panel',
    /** Tiempo LEÍDO hasta ahora (cuenta hacia arriba: sin meta del padre no hay cuenta atrás que mostrar). */
    elapsed: (mmss: string) => `Llevas ${mmss}`,
  },

  help: {
    defaultDef: {
      explorador: 'Escúchala y léela conmigo, sílaba por sílaba.',
      lector: 'Divídela en sílabas y léela en voz alta.',
    } satisfies Record<Audience, string>,
    synonym: (w: string) => `  Sinónimo: ${w}.`,
    example: (s: string) => `  Por ejemplo: ${s}`,
    listenAgain: '▸ Escuchar otra vez',
    listenWord: 'Escuchar la palabra',
    done: '¡Ya puedo!',
    inDrawing: 'en el dibujo',
  },

  /** Aviso breve y automático al terminar una página (sin botón: se pasa sola a la pregunta o a la página siguiente). */
  pageDone: { title: '¡Página terminada!', pagesOf: (n: number, total: number) => `${n} de ${total} páginas` },

  question: { label: (n: number) => `Pregunta ${n}`, continue: 'Continuar' },

  review: {
    chip: 'Repaso rápido',
    count: (i: number, n: number) => `Palabra ${i} de ${n}`,
    titleKid: 'Arma la palabra',
    titleTeen: 'Ordena las sílabas',
    listen: 'Escuchar la palabra',
    doneKid: '¡La armaste!',
    doneTeen: 'Correcto.',
    wrongKid: 'Esa va después, prueba otra.',
    wrongTeen: 'Esa va después.',
    next: 'Siguiente',
    finish: 'Terminar',
    defaultDef: 'Una palabra que practicaste hoy.',
  },

  end: {
    title: '¡Terminaste la historia!',
    time: 'Tiempo',
    accuracy: 'Precisión',
    words: 'Palabras',
    wordsPerMinute: 'Palabras/min',
    practiced: 'Palabras que practicaste',
    again: 'Leer de nuevo',
    next: 'Siguiente historia',
  },
};

export type UiCopy = typeof copy;

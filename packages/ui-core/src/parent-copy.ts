/**
 * Textos ES/EN de las pantallas de "Modo padres" que todavía no estaban traducidas: el panel "Hoy con {niño}"
 * (parent-home-screen.tsx) y los ajustes del niño (parent-settings-screen.tsx). Hasta ahora estas pantallas tenían
 * el texto fijo en español sin importar el idioma del perfil — reportado por Victor al probar el APK.
 */
import type { MathLang as ParentLang } from './math-copy.ts';

export type { ParentLang };

const L = <T>(es: T, en: T) => ({ es, en });

export const WEEKDAY_NAMES = {
  es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const satisfies Record<ParentLang, readonly string[]>;

/** Letras de los días (domingo a sábado) para el selector de horario del Modo Enfoque. */
export const WEEKDAY_LETTERS = {
  es: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
} as const satisfies Record<ParentLang, readonly string[]>;

export const PARENT_HOME_COPY = {
  back: L('Salir de Modo padres', 'Exit Parent Mode'),
  kicker: L((weekday: string) => `Modo padres · ${weekday}`, (weekday: string) => `Parent Mode · ${weekday}`),
  title: L((name: string) => `Hoy con ${name}`, (name: string) => `Today with ${name}`),
  settings: L('Ajustes', 'Settings'),
  statReadingMinutes: L('Minutos de lectura', 'Reading minutes'),
  statQuestions: L('Preguntas', 'Questions'),
  statFocus: L((name: string) => `Enfoque (según ${name})`, (name: string) => `Focus (per ${name})`),
  of: L((a: number, b: number) => `${a} de ${b}`, (a: number, b: number) => `${a} of ${b}`),
  noneToday: L('Ninguna hoy', 'None today'),
  focusLabel: {
    1: L('Le costó', 'Had trouble'),
    2: L('Más o menos', 'So-so'),
    3: L('Bien', 'Good'),
  },
  didNotSayToday: L('No lo dijo hoy', "Didn't say today"),
  whatTheyDidToday: L('Lo que hizo hoy', 'What they did today'),
  notReadYetToday: L('Hoy todavía no ha leído.', "Hasn't read yet today."),
  finishedIt: L('La terminó', 'Finished it'),
  percentThrough: L((pct: number) => `Va en ${pct} %`, (pct: number) => `${pct}% through`),
  lessThanOneMin: L('Menos de 1 min', 'Less than 1 min'),
  minutes: L((n: number) => `${n} min`, (n: number) => `${n} min`),
  thisWeek: L('Esta semana', 'This week'),
  minutesThisWeekA11y: L((s: string) => `Minutos esta semana: ${s}`, (s: string) => `Minutes this week: ${s}`),
  greenGoalNote: L((n: number) => `Verde: llegó a la meta de ${n} min.`, (n: number) => `Green: reached the ${n} min goal.`),
  practiceTogether: L('Para practicar juntos', 'To practice together'),
  practiceInstructions: L('Pídele que lea estas palabras contigo. Dos minutos bastan.', 'Ask them to read these words with you. Two minutes is enough.'),
  noWordsToday: L('Hoy no pidió ayuda con ninguna palabra.', "Didn't need help with any word today."),
  howTheyArrived: L('Cómo llegó hoy', 'How they felt today'),
  missionLine: L((title: string, minutes: number) => `${title} · ${minutes} min de misión`, (title: string, minutes: number) => `${title} · ${minutes} min mission`),
  privacy: L('Privacidad', 'Privacy'),
  privacyNote: L((name: string) => `La voz de ${name} nunca se graba ni se almacena. Aquí solo ves tiempos, preguntas y palabras.`, (name: string) => `${name}'s voice is never recorded or stored. Here you only see times, questions and words.`),
};

export const PARENT_SETTINGS_COPY = {
  backNoSave: L('Volver sin guardar', 'Back without saving'),
  addChildTitle: L('Agregar niño', 'Add child'),
  settingsOf: L((name: string) => `Ajustes de ${name}`, (name: string) => `${name}'s settings`),
  add: L('Agregar', 'Add'),
  save: L('Guardar', 'Save'),
  sectionProfile: L('Perfil', 'Profile'),
  namePlaceholder: L('Nombre', 'Name'),
  nameA11y: L('Nombre del niño', "Child's name"),
  levelLabel: L('Nivel de lectura en la app', 'Reading level in the app'),
  levelNote: L('No es el grado escolar: elige el nivel en el que lee cómodo. Puedes cambiarlo cuando quieras.', 'Not the school grade: choose the level where they read comfortably. You can change it anytime.'),
  sectionDailyTime: L('Tiempo diario', 'Daily time'),
  askEnergyToggle: L('Preguntar «¿Cómo llegas?» al empezar', 'Ask “How are you feeling?” at the start'),
  askEnergyNote: L('Si lo pregunta, la misión dura 20, 15 u 8 minutos según cómo llegue. Si no, se usa el tiempo de arriba.', "If asked, the mission lasts 20, 15 or 8 minutes depending on how they're feeling. Otherwise, the time above is used."),
  sectionReading: L('Lectura', 'Reading'),
  freeReadingToggle: L('Lectura libre', 'Free reading'),
  freeReadingNote: L('Un adulto lee en voz alta (o el niño lee solo) y la página se pasa con un botón, sin micrófono. Las preguntas siguen apareciendo.', 'An adult reads aloud (or the child reads alone) and the page turns with a button, no microphone. Questions still appear.'),
  testMic: L('Probar el micrófono', 'Test the microphone'),
  sectionFocusMode: L('Modo Enfoque', 'Focus Mode'),
  focusModes: {
    off: L('Apagado', 'Off'),
    on: L('Encendido', 'On'),
    custom: L('Personalizado', 'Custom'),
  },
  focusNoteOff: L('Todo como siempre.', 'Everything as usual.'),
  focusNoteOn: L(
    'Lectura de una línea a la vez, menos dibujos y animaciones, pausa de movimiento de 1 minuto cada 10 y rondas de 4 en el Taller de Matemáticas.',
    'One line at a time, fewer drawings and animations, a 1-minute movement break every 10, and rounds of 4 in the Math Workshop.',
  ),
  focusNoteCustom: L('Elige cada apoyo.', 'Choose each support.'),
  focusReadingToggle: L('Lectura de una línea a la vez', 'One line at a time'),
  reducedMotionToggle: L('Menos dibujos y animaciones', 'Fewer drawings and animations'),
  movementBreaksToggle: L('Pausa de movimiento cada 10 minutos', 'Movement break every 10 minutes'),
  roundSizeLabel: L('Ejercicios por ronda en el Taller', 'Exercises per round in the Workshop'),
  scheduleOnlyToggle: L('Solo en un horario', 'Only during a schedule'),
  from: L('De', 'From'),
  to: L('a', 'to'),
  startTimeA11y: L('Hora de inicio', 'Start time'),
  endTimeA11y: L('Hora de fin', 'End time'),
  outsideScheduleNote: L('Fuera de ese horario, todo como siempre.', 'Outside that schedule, everything as usual.'),
  fixScheduleNote: L('Elige al menos un día y escribe las horas como 15:00.', 'Choose at least one day and write the times like 15:00.'),
  sectionPrivacy: L('Privacidad', 'Privacy'),
  saveAudio: L('Guardar audio', 'Save audio'),
  never: L('Nunca', 'Never'),
  privacyNote: L('La voz se procesa en la tableta y no se guarda ni se envía. Kitewise solo guarda tiempos, preguntas y palabras que costaron.', "Voice is processed on the tablet and is never saved or sent. Kitewise only saves times, questions and words that were tricky."),
  sectionData: L('Datos', 'Data'),
  changePin: L('Cambiar el PIN', 'Change PIN'),
  confirmReset: L((name: string) => `¿Borrar todo el progreso de ${name}? No se puede deshacer.`, (name: string) => `Delete all of ${name}'s progress? This can't be undone.`),
  yesDelete: L('Sí, borrar', 'Yes, delete'),
  resetProgress: L((name: string) => `Borrar el progreso de ${name}`, (name: string) => `Delete ${name}'s progress`),
  confirmRemove: L((name: string) => `¿Quitar a ${name} y su progreso?`, (name: string) => `Remove ${name} and their progress?`),
  yesRemove: L('Sí, quitar', 'Yes, remove'),
  removeChild: L((name: string) => `Quitar a ${name}`, (name: string) => `Remove ${name}`),
  cancel: L('Cancelar', 'Cancel'),
  soon: L('Pronto', 'Soon'),
};

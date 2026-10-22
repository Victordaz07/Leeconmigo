import type { MathLang } from '@lee-conmigo/ui-core';
import type { NoteSubject } from './model';

/** Textos de Mi cuaderno (ES/EN). Tono de acompañamiento: nada de «bien/mal» ni puntos. */
export interface NotebookCopy {
  title: string;
  /** Subtítulo de la portada en Inicio. */
  cover: (count: number) => string;
  back: string;
  tabs: { all: string; words: string; ideas: string; drawings: string };
  wordsTitle: string;
  wordsEmpty: string;
  wordsNote: string;
  ideasTitle: string;
  ideasEmpty: string;
  drawingsTitle: string;
  drawingsEmpty: string;
  drawingsNote: string;
  newIdea: string;
  ideaPrompt: string;
  ideaPlaceholder: string;
  subjectLabel: string;
  subjects: Record<NoteSubject, string>;
  save: string;
  cancel: string;
  charsLeft: (n: number) => string;
  leftToday: (n: number) => string;
  dailyDone: string;
  full: string;
  remove: string;
  removeAsk: string;
  removeYes: string;
  removeNo: string;
  /** «Guardar en mi cuaderno» del cierre de una sesión. */
  closing: { button: string; prompt: string; placeholder: string; saved: string };
  privacy: string;
  on: (day: string) => string;
}

const ES: NotebookCopy = {
  title: 'Mi cuaderno',
  cover: (n) => (n === 0 ? 'Empieza aquí' : n === 1 ? '1 cosa guardada' : `${n} cosas guardadas`),
  back: 'Volver',
  tabs: { all: 'Todo', words: 'Palabras', ideas: 'Ideas', drawings: 'Dibujos' },
  wordsTitle: 'Palabras nuevas',
  wordsEmpty: 'Cuando una palabra te cueste al leer, aparece aquí para que la repases.',
  wordsNote: 'Estas palabras vuelven en el repaso. Aprender una palabra nueva es parte de leer.',
  ideasTitle: 'Lo que entendí',
  ideasEmpty: 'Escribe una idea con tus palabras. Una frase corta basta.',
  drawingsTitle: 'Mis dibujos',
  drawingsEmpty: 'Tus pinturas y collages de «Arte y música» aparecen aquí.',
  drawingsNote: 'Para seguir con uno, ábrelo en «Arte y música».',
  newIdea: 'Agregar una idea',
  ideaPrompt: '¿Qué entendiste o descubriste?',
  ideaPlaceholder: 'Escribe tu idea…',
  subjectLabel: '¿De qué cuaderno es?',
  subjects: { lectura: 'Lectura', mate: 'Matemáticas', ciencia: 'Ciencia', sociedad: 'Sociedad', arte: 'Arte y música', finanzas: 'Finanzas', otra: 'Otra cosa' },
  save: 'Guardar',
  cancel: 'Ahora no',
  charsLeft: (n) => `Te quedan ${n} letras`,
  leftToday: (n) => (n === 1 ? 'Hoy puedes guardar 1 idea más.' : `Hoy puedes guardar ${n} ideas más.`),
  dailyDone: 'Hoy ya guardaste tus ideas. Mañana puedes guardar más.',
  full: 'Tu cuaderno está lleno. Quita una idea para guardar otra.',
  remove: 'Quitar',
  removeAsk: '¿Quitar esta idea?',
  removeYes: 'Sí, quitarla',
  removeNo: 'No, dejarla',
  closing: { button: 'Guardar en mi cuaderno', prompt: '¿Qué entendiste o descubriste hoy?', placeholder: 'Escribe una frase corta…', saved: '✓ Guardado en tu cuaderno' },
  privacy: 'Lo que escribes se queda en esta tableta.',
  on: (d) => d,
};

const EN: NotebookCopy = {
  title: 'My notebook',
  cover: (n) => (n === 0 ? 'Start here' : n === 1 ? '1 thing saved' : `${n} things saved`),
  back: 'Back',
  tabs: { all: 'All', words: 'Words', ideas: 'Ideas', drawings: 'Drawings' },
  wordsTitle: 'New words',
  wordsEmpty: 'When a word is hard while you read, it shows up here so you can practice it.',
  wordsNote: 'These words come back in your review. Learning a new word is part of reading.',
  ideasTitle: 'What I understood',
  ideasEmpty: 'Write an idea in your own words. One short sentence is enough.',
  drawingsTitle: 'My drawings',
  drawingsEmpty: 'Your paintings and collages from “Art and music” show up here.',
  drawingsNote: 'To keep working on one, open it in “Art and music”.',
  newIdea: 'Add an idea',
  ideaPrompt: 'What did you understand or discover?',
  ideaPlaceholder: 'Write your idea…',
  subjectLabel: 'Which notebook is it from?',
  subjects: { lectura: 'Reading', mate: 'Math', ciencia: 'Science', sociedad: 'Social studies', arte: 'Art and music', finanzas: 'Finance', otra: 'Something else' },
  save: 'Save',
  cancel: 'Not now',
  charsLeft: (n) => `${n} letters left`,
  leftToday: (n) => (n === 1 ? 'Today you can save 1 more idea.' : `Today you can save ${n} more ideas.`),
  dailyDone: 'You already saved your ideas today. Tomorrow you can save more.',
  full: 'Your notebook is full. Remove an idea to save another.',
  remove: 'Remove',
  removeAsk: 'Remove this idea?',
  removeYes: 'Yes, remove it',
  removeNo: 'No, keep it',
  closing: { button: 'Save in my notebook', prompt: 'What did you understand or discover today?', placeholder: 'Write a short sentence…', saved: '✓ Saved in your notebook' },
  privacy: 'What you write stays on this tablet.',
  on: (d) => d,
};

export const NOTEBOOK_COPY: Record<MathLang, NotebookCopy> = { es: ES, en: EN };

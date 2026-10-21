/**
 * «Guardar en mi cuaderno» del cierre de cada sesión (Kitewise B13 → B14): el niño escribe una frase corta de lo que entendió y se guarda como una idea de
 * Mi cuaderno, con la materia de la sesión. Misma regla que dentro de Mi cuaderno: 3 ideas por día y con el cuaderno lleno se avisa (nunca se borra nada).
 */
import type { MathLang } from '@lee-conmigo/ui-core';
import type { NotebookSave } from '@lee-conmigo/ui-native';
import { subjectStorageFor } from './app-state';
import { NOTEBOOK_COPY } from './subjects/mi-cuaderno/copy';
import { MAX_TEXT, addNote, emptyNotebook, isNotebookData, notesLeftToday, type NoteSubject } from './subjects/mi-cuaderno/model';

/** El resultado de guardar, para que el cierre diga la verdad (guardó, ya no caben más hoy, o está lleno). */
export type SaveIdeaResult = 'ok' | 'empty' | 'daily' | 'full';

/** Guarda la idea en el cuaderno del niño. `now` se pasa para poder probarlo. */
export function saveIdeaToNotebook(profileId: string, subject: NoteSubject, text: string, now: number = Date.now()): SaveIdeaResult {
  const storage = subjectStorageFor('mi-cuaderno', profileId, emptyNotebook(), isNotebookData);
  const r = addNote(storage.load(), subject, text, now);
  if (!r.ok) return r.reason;
  storage.save(r.data);
  return 'ok';
}

/** ¿Todavía caben ideas hoy? (si no, el cierre ni ofrece el botón). */
export const canSaveIdeaToday = (profileId: string, now: number = Date.now()): boolean => notesLeftToday(subjectStorageFor('mi-cuaderno', profileId, emptyNotebook(), isNotebookData).load(), now) > 0;

/** Lo que recibe `ClosingCard` para mostrar «Guardar en mi cuaderno» (o nada, si ya guardó las de hoy). */
export function notebookSaverFor(profileId: string, subject: NoteSubject, lang: MathLang): NotebookSave | undefined {
  if (!canSaveIdeaToday(profileId)) return undefined;
  const c = NOTEBOOK_COPY[lang];
  return {
    label: c.closing.button,
    prompt: c.closing.prompt,
    placeholder: c.closing.placeholder,
    saveLabel: c.save,
    cancelLabel: c.cancel,
    savedLabel: c.closing.saved,
    dailyLabel: c.dailyDone,
    fullLabel: c.full,
    maxLength: MAX_TEXT,
    onSave: (text) => saveIdeaToNotebook(profileId, subject, text),
  };
}

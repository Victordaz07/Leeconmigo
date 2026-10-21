/**
 * Mi cuaderno (Kitewise B14, `docs/design/kitewise/SPEC.md`): el espacio PERSONAL del niño, aparte de las materias. Lógica PURA (sin React Native), para
 * probarla sin pantalla. Reúne tres cosas, todas en el dispositivo:
 *  - **Palabras nuevas:** las que le costaron al leer (salen solas del progreso de Lectura; no se guarda nada aparte).
 *  - **Ideas** («Lo que entendí»): frases cortas que el niño escribe y etiqueta con una materia. Es lo único que este módulo guarda.
 *  - **Dibujos:** sus pinturas y collages de Arte y música (se leen de ahí; no se copian).
 * Nada sale del dispositivo (D1). Sin notas, sin puntos: un cuaderno no califica.
 */
import type { SessionSummary, VocabularyEntry } from '@lee-conmigo/contracts';

export const NOTEBOOK_FORMAT = 1;
export type NoteSubject = 'lectura' | 'mate' | 'ciencia' | 'sociedad' | 'arte' | 'otra';
export const NOTE_SUBJECTS: readonly NoteSubject[] = ['lectura', 'mate', 'ciencia', 'sociedad', 'arte', 'otra'];

export interface Note {
  id: string;
  subject: NoteSubject;
  text: string;
  /** Día en que se guardó, `AAAA-MM-DD` (hora del equipo). */
  day: string;
  /** Momento exacto (ms), para ordenar. */
  at: number;
}

export interface NotebookData {
  format: typeof NOTEBOOK_FORMAT;
  notes: Note[];
}

/** Topes: que el cuaderno no crezca sin límite y que cada idea sea una frase, no un párrafo. */
export const MAX_NOTES = 100;
export const MAX_TEXT = 140;
/** Ideas nuevas por día. El diseño original decía 1 («Hoy puedes guardar 1 idea»); se dejó en 3 para no frenar al niño. Propuesta MC-1 (Victor decide). */
export const DAILY_NOTES = 3;
export const MAX_WORDS = 40;

export const emptyNotebook = (): NotebookData => ({ format: NOTEBOOK_FORMAT, notes: [] });

/** `AAAA-MM-DD` en hora local del equipo (no UTC: «hoy» es el día del niño). */
export function dayKey(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Texto limpio: espacios juntos, sin sobrantes al inicio y al final, con tope de largo. */
export const cleanText = (raw: string): string => raw.replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT).trim();

export const notesToday = (data: NotebookData, now: number): Note[] => data.notes.filter((n) => n.day === dayKey(now));
/** Cuántas ideas más puede guardar hoy. */
export const notesLeftToday = (data: NotebookData, now: number): number => Math.max(0, DAILY_NOTES - notesToday(data, now).length);

export type AddResult = { data: NotebookData; ok: true } | { data: NotebookData; ok: false; reason: 'empty' | 'daily' | 'full' };

/** Guarda una idea. No guarda si está vacía, si ya guardó las de hoy o si el cuaderno está lleno (se avisa; nunca se borra nada en silencio). */
export function addNote(data: NotebookData, subject: NoteSubject, rawText: string, now: number): AddResult {
  const text = cleanText(rawText);
  if (!text) return { data, ok: false, reason: 'empty' };
  if (notesLeftToday(data, now) === 0) return { data, ok: false, reason: 'daily' };
  if (data.notes.length >= MAX_NOTES) return { data, ok: false, reason: 'full' };
  const n = Math.max(0, ...data.notes.map((x) => Number(x.id.replace(/^n/, '')) || 0)) + 1;
  const note: Note = { id: `n${n}`, subject, text, day: dayKey(now), at: now };
  return { data: { ...data, notes: [note, ...data.notes] }, ok: true };
}

export const deleteNote = (data: NotebookData, id: string): NotebookData => (data.notes.some((n) => n.id === id) ? { ...data, notes: data.notes.filter((n) => n.id !== id) } : data);

export function isNotebookData(v: unknown): v is NotebookData {
  if (typeof v !== 'object' || v === null) return false;
  const d = v as Record<string, unknown>;
  if (d.format !== NOTEBOOK_FORMAT || !Array.isArray(d.notes) || d.notes.length > MAX_NOTES) return false;
  const ids = new Set<string>();
  for (const n of d.notes) {
    if (typeof n !== 'object' || n === null) return false;
    const x = n as Record<string, unknown>;
    if (typeof x.id !== 'string' || ids.has(x.id) || !(NOTE_SUBJECTS as readonly unknown[]).includes(x.subject)) return false;
    if (typeof x.text !== 'string' || x.text.length === 0 || x.text.length > MAX_TEXT) return false;
    if (typeof x.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(x.day) || typeof x.at !== 'number' || !Number.isFinite(x.at)) return false;
    ids.add(x.id);
  }
  return true;
}

// ---- Palabras nuevas (salen de Lectura) ----

export interface WordCard {
  /** La palabra, como la clave del vocabulario (minúsculas, con acentos). */
  word: string;
  syllables: string[];
  definition: string | null;
  example: string | null;
  storyId: string;
}

/**
 * Las palabras que le costaron al leer, de la más reciente a la más antigua, sin repetir. `lookup` busca su ficha en el vocabulario de la historia
 * (puede devolver `undefined`: la palabra se muestra igual, solo sin sílabas ni significado).
 */
export function wordsFromSummaries(summaries: readonly SessionSummary[], lookup: (storyId: string, key: string) => VocabularyEntry | undefined): WordCard[] {
  const out: WordCard[] = [];
  const seen = new Set<string>();
  const recent = [...summaries].sort((a, b) => (a.completedAt < b.completedAt ? 1 : a.completedAt > b.completedAt ? -1 : 0));
  for (const s of recent) {
    for (const key of s.wordsHelped) {
      const word = key.trim();
      if (!word || seen.has(word)) continue;
      seen.add(word);
      const e = lookup(s.storyId, word);
      out.push({ word, syllables: e?.syllables ?? [], definition: e?.definition ?? null, example: e?.example ?? null, storyId: s.storyId });
      if (out.length >= MAX_WORDS) return out;
    }
  }
  return out;
}

/** Cuántas cosas hay en el cuaderno (para la portada): palabras + ideas. */
export const savedCount = (words: number, data: NotebookData): number => words + data.notes.length;

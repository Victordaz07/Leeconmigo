import { describe, expect, it } from 'vitest';
import type { SessionSummary, VocabularyEntry } from '@lee-conmigo/contracts';
import { DAILY_NOTES, MAX_NOTES, MAX_TEXT, MAX_WORDS, addNote, cleanText, dayKey, deleteNote, emptyNotebook, isNotebookData, notesLeftToday, savedCount, wordsFromSummaries } from '../src/subjects/mi-cuaderno/model.ts';
import { NOTEBOOK_COPY } from '../src/subjects/mi-cuaderno/copy.ts';

const NOW = new Date(2026, 9, 21, 15, 30).getTime();
const DAY = 24 * 3600 * 1000;

describe('ideas', () => {
  it('limpia el texto y no guarda una idea vacía', () => {
    expect(cleanText('  Una   fracción \n es   una parte  ')).toBe('Una fracción es una parte');
    expect(cleanText('x'.repeat(500))).toHaveLength(MAX_TEXT);
    const r = addNote(emptyNotebook(), 'mate', '   ', NOW);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('empty');
  });

  it('guarda una idea con su día y la pone primero', () => {
    const a = addNote(emptyNotebook(), 'mate', 'Una fracción es una parte de un todo', NOW);
    expect(a.ok).toBe(true);
    const b = addNote(a.data, 'ciencia', 'El agua se lleva la arena', NOW + 1000);
    expect(b.data.notes.map((n) => n.subject)).toEqual(['ciencia', 'mate']);
    expect(b.data.notes[0]!.day).toBe(dayKey(NOW));
    expect(new Set(b.data.notes.map((n) => n.id)).size).toBe(2);
    expect(isNotebookData(JSON.parse(JSON.stringify(b.data)))).toBe(true);
  });

  it(`solo ${DAILY_NOTES} ideas por día; al día siguiente se puede de nuevo (nunca se borra nada para hacer lugar)`, () => {
    let d = emptyNotebook();
    for (let i = 0; i < DAILY_NOTES; i++) d = addNote(d, 'otra', `idea ${i}`, NOW + i).data;
    expect(notesLeftToday(d, NOW)).toBe(0);
    const no = addNote(d, 'otra', 'una más', NOW + 99);
    expect(no.ok).toBe(false);
    if (!no.ok) expect(no.reason).toBe('daily');
    expect(no.data).toBe(d);
    expect(notesLeftToday(d, NOW + DAY)).toBe(DAILY_NOTES);
    expect(addNote(d, 'otra', 'mañana', NOW + DAY).ok).toBe(true);
  });

  it('con el cuaderno lleno avisa, no borra', () => {
    const notes = Array.from({ length: MAX_NOTES }, (_, i) => ({ id: `n${i + 1}`, subject: 'otra' as const, text: `idea ${i}`, day: '2026-01-01', at: i }));
    const full = { format: 1 as const, notes };
    const r = addNote(full, 'otra', 'nueva', NOW);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('full');
    expect(r.data.notes).toHaveLength(MAX_NOTES);
  });

  it('quitar una idea', () => {
    const a = addNote(emptyNotebook(), 'lectura', 'hola', NOW);
    const id = a.data.notes[0]!.id;
    expect(deleteNote(a.data, id).notes).toHaveLength(0);
    expect(deleteNote(a.data, 'zzz')).toBe(a.data);
  });

  it('rechaza lo guardado roto', () => {
    const ok = addNote(emptyNotebook(), 'arte', 'hola', NOW).data;
    const bad = (patch: object) => ({ ...ok, notes: [{ ...ok.notes[0]!, ...patch }] });
    expect(isNotebookData(bad({ subject: 'deportes' }))).toBe(false);
    expect(isNotebookData(bad({ text: '' }))).toBe(false);
    expect(isNotebookData(bad({ text: 'x'.repeat(MAX_TEXT + 1) }))).toBe(false);
    expect(isNotebookData(bad({ day: 'ayer' }))).toBe(false);
    expect(isNotebookData({ ...ok, format: 2 })).toBe(false);
    expect(isNotebookData({ ...ok, notes: [ok.notes[0], ok.notes[0]] })).toBe(false);
    expect(isNotebookData(null)).toBe(false);
  });
});

const summary = (storyId: string, at: string, words: string[]): SessionSummary => ({
  storyId, language: 'es', level: 3, validReadingSeconds: 100, sessionSeconds: 120, comprehensionCorrect: 1, comprehensionTotal: 1, wordsHelped: words, completion: 1, completedAt: at,
});
const VOCAB: Record<string, VocabularyEntry> = { enredada: { syllables: ['en', 're', 'da', 'da'], definition: 'atrapada entre cosas', example: 'La cuerda quedó enredada.' }, erosión: { syllables: ['e', 'ro', 'sión'] } };
const lookup = (_id: string, key: string) => VOCAB[key];

describe('palabras nuevas (salen de Lectura)', () => {
  it('de la más reciente a la más antigua, sin repetir, con su ficha', () => {
    const list = wordsFromSummaries([summary('a', '2026-10-01T10:00:00Z', ['erosión']), summary('b', '2026-10-05T10:00:00Z', ['enredada', 'erosión'])], lookup);
    expect(list.map((w) => w.word)).toEqual(['enredada', 'erosión']);
    expect(list[0]).toMatchObject({ syllables: ['en', 're', 'da', 'da'], definition: 'atrapada entre cosas', example: 'La cuerda quedó enredada.', storyId: 'b' });
    expect(list[1]!.definition).toBeNull();
  });

  it('una palabra sin ficha se muestra igual', () => {
    const list = wordsFromSummaries([summary('a', '2026-10-01T10:00:00Z', ['luciérnaga'])], lookup);
    expect(list).toEqual([{ word: 'luciérnaga', syllables: [], definition: null, example: null, storyId: 'a' }]);
  });

  it('tiene un tope y tolera vacíos', () => {
    const many = summary('a', '2026-10-01T10:00:00Z', Array.from({ length: MAX_WORDS + 10 }, (_, i) => `palabra${i}`));
    expect(wordsFromSummaries([many], lookup)).toHaveLength(MAX_WORDS);
    expect(wordsFromSummaries([], lookup)).toEqual([]);
    expect(wordsFromSummaries([summary('a', '2026-10-01T10:00:00Z', ['', '  '])], lookup)).toEqual([]);
  });

  it('cuenta lo guardado para la portada', () => {
    const d = addNote(emptyNotebook(), 'otra', 'hola', NOW).data;
    expect(savedCount(3, d)).toBe(4);
  });
});

describe('textos', () => {
  it('ES y EN tienen lo mismo y no califican', () => {
    expect(Object.keys(NOTEBOOK_COPY.es.subjects)).toEqual(Object.keys(NOTEBOOK_COPY.en.subjects));
    expect(Object.keys(NOTEBOOK_COPY.es.tabs)).toEqual(Object.keys(NOTEBOOK_COPY.en.tabs));
    for (const lang of ['es', 'en'] as const) {
      const c = NOTEBOOK_COPY[lang];
      const all = JSON.stringify([c.wordsEmpty, c.wordsNote, c.ideasEmpty, c.dailyDone, c.full, c.leftToday(2)]).toLowerCase();
      for (const bad of ['incorrect', 'wrong', 'mal ', 'error', 'puntos', 'points']) expect(all).not.toContain(bad);
    }
    expect(NOTEBOOK_COPY.es.cover(0)).toBe('Empieza aquí');
  });
});

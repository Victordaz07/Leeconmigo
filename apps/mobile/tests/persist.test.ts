import { describe, expect, it } from 'vitest';
import type { SessionSummary } from '@lee-conmigo/contracts';
import { eraseChild, eraseEverything, KEYS, loadMath, loadSubject, PersistentProgressStore, saveMath, saveSubject, SUBJECT_KEYS, type KV } from '../src/persist/store.ts';

const memoryKV = (): KV & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, get: (k) => data.get(k) ?? null, set: (k, v) => void data.set(k, v), remove: (k) => void data.delete(k) };
};

describe('guardar en el equipo (RN-08)', () => {
  it('borrar progreso conserva el tamaño de lectura; borrar todos los datos lo elimina por niño', () => {
    const kv = memoryKV();
    kv.set(KEYS.readerPrefs('noah'), '{"size":31}');
    kv.set(KEYS.readerPrefs('ana'), '{"size":27}');
    kv.set(KEYS.language, '"en"');
    eraseChild(kv, 'noah');
    expect(kv.get(KEYS.readerPrefs('noah'))).toBe('{"size":31}');
    expect(kv.get(KEYS.language)).toBe('"en"');
    eraseEverything(kv, ['noah']);
    expect(kv.get(KEYS.readerPrefs('noah'))).toBeNull();
    expect(kv.get(KEYS.readerPrefs('ana'))).toBe('{"size":27}');
    expect(kv.get(KEYS.language)).toBeNull();
  });
  it('el progreso de Lectura sobrevive a "cerrar y abrir" la app', () => {
    const kv = memoryKV();
    const a = new PersistentProgressStore(kv, KEYS.reading('noah'));
    a.saveSummary({ storyId: 's1' } as unknown as SessionSummary);
    a.setResumePoint({ storyId: 's1', pageIndex: 2, updatedAt: '2026-10-16T10:00:00Z' } as never);
    const b = new PersistentProgressStore(kv, KEYS.reading('noah'));
    expect(b.summaries()).toHaveLength(1);
    expect(b.resumePoint('s1')).toMatchObject({ pageIndex: 2 });
    b.clearResumePoint('s1');
    expect(new PersistentProgressStore(kv, KEYS.reading('noah')).latestResumePoint()).toBeNull();
  });

  it('Matemáticas: respuestas, repaso y lecciones se guardan; borrar el progreso lo quita todo', () => {
    const kv = memoryKV();
    saveMath(kv, 'noah', { attempts: [{ skillId: 'g3u1.s2', variantId: 'x', day: '2026-10-16', firstCorrect: true, maxHintLevel: 0, constructed: true }], reviews: [], lessonsDone: new Set(['g3u1.l1']) });
    expect(loadMath(kv, 'noah')).toMatchObject({ lessonsDone: ['g3u1.l1'], attempts: [{ skillId: 'g3u1.s2' }] });
    eraseChild(kv, 'noah');
    expect(loadMath(kv, 'noah')).toEqual({ attempts: [], reviews: [], lessonsDone: [] });
  });

  it('algo guardado que no se puede leer no rompe la app: se empieza limpio', () => {
    const kv = memoryKV();
    kv.set(KEYS.math('noah'), '{roto');
    kv.set(KEYS.reading('noah'), 'null');
    expect(loadMath(kv, 'noah').attempts).toEqual([]);
    expect(new PersistentProgressStore(kv, KEYS.reading('noah')).summaries()).toEqual([]);
  });

  it('nunca se guarda audio ni texto reconocido: solo las claves conocidas', () => {
    const kv = memoryKV();
    saveMath(kv, 'n', { attempts: [], reviews: [], lessonsDone: [] });
    new PersistentProgressStore(kv, KEYS.reading('n')).saveSummary({ storyId: 's' } as unknown as SessionSummary);
    for (const k of kv.data.keys()) expect(k).toMatch(/^kitewise\.v1\.(reading|math)\./);
  });

  describe('materias nuevas (Ciencia, Sociedad)', () => {
    type Saved = { done: string[] };
    const valid = (v: unknown): v is Saved => typeof v === 'object' && v !== null && Array.isArray((v as Saved).done);
    const empty: Saved = { done: [] };

    it('cada materia guarda aparte, por niño, y sobrevive a cerrar y abrir', () => {
      const kv = memoryKV();
      saveSubject(kv, 'ciencia', 'noah', { done: ['u1.l1'] });
      saveSubject(kv, 'sociedad', 'noah', { done: ['s1'] });
      saveSubject(kv, 'ciencia', 'ana', { done: ['x'] });
      expect(loadSubject(kv, 'ciencia', 'noah', empty, valid)).toEqual({ done: ['u1.l1'] });
      expect(loadSubject(kv, 'sociedad', 'noah', empty, valid)).toEqual({ done: ['s1'] });
      expect(loadSubject(kv, 'ciencia', 'ana', empty, valid)).toEqual({ done: ['x'] });
      expect(KEYS.subject('ciencia', 'noah')).toBe('kitewise.v1.ciencia.noah');
    });

    it('lo guardado con otra forma (o corrupto) no rompe: se empieza limpio', () => {
      const kv = memoryKV();
      kv.set(KEYS.subject('ciencia', 'noah'), 'null');
      expect(loadSubject(kv, 'ciencia', 'noah', empty, valid)).toEqual(empty);
      kv.set(KEYS.subject('ciencia', 'noah'), '{"done": 5}');
      expect(loadSubject(kv, 'ciencia', 'noah', empty, valid)).toEqual(empty);
      kv.set(KEYS.subject('ciencia', 'noah'), '{no es json');
      expect(loadSubject(kv, 'ciencia', 'noah', empty, valid)).toEqual(empty);
    });

    it('"Borrar el progreso" también borra las materias nuevas, solo del niño pedido', () => {
      const kv = memoryKV();
      for (const subject of SUBJECT_KEYS) {
        saveSubject(kv, subject, 'noah', { done: ['a'] });
        saveSubject(kv, subject, 'ana', { done: ['b'] });
      }
      eraseChild(kv, 'noah');
      for (const subject of SUBJECT_KEYS) {
        expect(loadSubject(kv, subject, 'noah', empty, valid)).toEqual(empty);
        expect(loadSubject(kv, subject, 'ana', empty, valid)).toEqual({ done: ['b'] });
      }
    });
  });
});

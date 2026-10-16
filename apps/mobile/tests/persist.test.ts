import { describe, expect, it } from 'vitest';
import type { SessionSummary } from '@lee-conmigo/contracts';
import { eraseChild, KEYS, loadMath, PersistentProgressStore, saveMath, type KV } from '../src/persist/store.ts';

const memoryKV = (): KV & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, get: (k) => data.get(k) ?? null, set: (k, v) => void data.set(k, v), remove: (k) => void data.delete(k) };
};

describe('guardar en el equipo (RN-08)', () => {
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
});

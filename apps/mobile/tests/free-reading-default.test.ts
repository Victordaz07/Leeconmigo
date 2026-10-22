import { describe, expect, it } from 'vitest';
import { applyFreeReadingDefault, KEYS, type KV } from '../src/persist/store.ts';

const memoryKV = (): KV => {
  const m = new Map<string, string>();
  return { get: (k) => m.get(k) ?? null, set: (k, v) => void m.set(k, v), remove: (k) => void m.delete(k) };
};
const noah = (freeReading: boolean) => ({ id: 'noah', name: 'Noah', freeReading });

describe('lectura libre por defecto', () => {
  it('un perfil guardado sin lectura libre pasa a lectura libre UNA vez y se reescribe', () => {
    const kv = memoryKV();
    kv.set(KEYS.profiles, JSON.stringify([noah(false)]));
    const out = applyFreeReadingDefault(kv, [noah(false)], true);
    expect(out[0]!.freeReading).toBe(true);
    expect(JSON.parse(kv.get(KEYS.profiles)!)[0].freeReading).toBe(true);
    expect(JSON.parse(kv.get(KEYS.migrations)!).freeReadingDefault).toBe(true);
  });
  it('si el adulto la apaga después, se respeta: la migración ya no vuelve a encenderla', () => {
    const kv = memoryKV();
    applyFreeReadingDefault(kv, [noah(false)], true);
    const later = applyFreeReadingDefault(kv, [noah(false)], true);
    expect(later[0]!.freeReading).toBe(false);
  });
  it('con los perfiles de partida (nada guardado) no escribe perfiles, solo anota la migración', () => {
    const kv = memoryKV();
    const out = applyFreeReadingDefault(kv, [noah(false)], false);
    expect(out[0]!.freeReading).toBe(true);
    expect(kv.get(KEYS.profiles)).toBeNull();
    expect(kv.get(KEYS.migrations)).not.toBeNull();
  });
});

/** En la web (vista de desarrollo y pruebas): `localStorage`, con fallas silenciosas (modo privado, sin permiso). */
import type { KV } from './store';

export const deviceKV: KV = {
  get: (key) => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Sin almacenamiento: la app sigue funcionando en memoria.
    }
  },
  remove: (key) => {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // idem
    }
  },
};

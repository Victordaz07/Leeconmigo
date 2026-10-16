/**
 * Almacén clave → texto en el equipo (RN-08): SQLite local de Expo, síncrono, sin red. Solo datos derivados (docs/07):
 * perfiles, PIN de padres, resúmenes de sesión y respuestas de Matemáticas. Nunca audio ni texto reconocido.
 */
import Storage from 'expo-sqlite/kv-store';
import type { KV } from './store';

export const deviceKV: KV = {
  get: (key) => Storage.getItemSync(key),
  set: (key, value) => Storage.setItemSync(key, value),
  remove: (key) => {
    Storage.removeItemSync(key);
  },
};

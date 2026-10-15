/**
 * Datos de relleno que aún no vienen de ningún lado real. `streakDays`/`stars` de aquí YA NO se usan (Inicio y
 * Progreso calculan eso de verdad con `computeProgressStats`, ver `build-progress.ts`). El nombre del niño ya
 * no es de relleno: es editable de verdad, ver `parent-settings.ts` (`readChildName`/`saveChildName`).
 */
export const demoOtherStories: Array<{ id: string; title: string; meta: string; stars: number; status: 'new' | 'read'; placeholder: string }> = [
  { id: 'amigo', title: 'Un amigo especial', meta: 'Nivel 1', stars: 3, status: 'read', placeholder: 'Portada: Un amigo especial' },
  { id: 'puente', title: 'El gran puente', meta: 'Nivel 2', stars: 2, status: 'read', placeholder: 'Portada: El gran puente' },
  { id: 'tortuga', title: 'La tortuga veloz', meta: 'Nivel 2', stars: 0, status: 'new', placeholder: 'Portada: La tortuga veloz' },
];


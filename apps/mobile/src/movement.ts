import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { MOVEMENT_EVERY_MS } from '@lee-conmigo/ui-core';

/**
 * Reloj de actividad para la pausa de movimiento (Modo Enfoque, B12). Cuenta el tiempo que el niño pasa en una lectura,
 * lección o Taller (solo con la app en primer plano) y se comparte entre pantallas: 6 min leyendo + 4 en el Taller = 10.
 * Vive en memoria (no es un dato que haga falta guardar).
 */
const activeMs = new Map<string, number>();
const breaksTaken = new Map<string, number>();

/**
 * `due`: ya toca una pausa; la pantalla la ofrece en su siguiente límite natural (fin de página o de ejercicio) y al volver
 * llama `taken`. Si el apoyo está apagado, nunca toca. `counting`: si ahora cuenta el tiempo (p. ej. solo mientras lee, no
 * en la portada); cuando deja de contar, lo que ya tocaba sigue tocando.
 */
export function useMovementBreak(enabled: boolean, profileId: string, counting = true) {
  const [due, setDue] = useState(() => enabled && (activeMs.get(profileId) ?? 0) >= MOVEMENT_EVERY_MS);
  const foreground = useRef(true);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => (foreground.current = s === 'active'));
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (!enabled || !counting) return;
    const id = setInterval(() => {
      if (!foreground.current) return;
      const ms = (activeMs.get(profileId) ?? 0) + 1000;
      activeMs.set(profileId, ms);
      if (ms >= MOVEMENT_EVERY_MS) setDue(true);
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, counting, profileId]);
  return {
    due: enabled && due,
    /** Número de pausa (para variar la rutina). */
    count: breaksTaken.get(profileId) ?? 0,
    taken: () => {
      activeMs.set(profileId, 0);
      breaksTaken.set(profileId, (breaksTaken.get(profileId) ?? 0) + 1);
      setDue(false);
    },
  };
}

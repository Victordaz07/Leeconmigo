/**
 * Módulo de Ciencia. Lo edita SOLO la cuenta de Ciencia (docs/14-MATERIAS-EN-PARALELO.md): aquí se pone `available: true` cuando
 * haya contenido de verdad, y `Screen` es su cuaderno con su propia navegación interna. Hoy es un relleno: "Pronto".
 */
import type { SubjectModule } from '../types';
import { ComingSoon } from '../coming-soon';

export const cienciaModule: SubjectModule = {
  id: 'ciencia',
  available: false,
  homeCard: () => ({ subtitle: '', segments: 0 }),
  Screen: ({ onExit }) => <ComingSoon title="Ciencia" onExit={onExit} />,
};

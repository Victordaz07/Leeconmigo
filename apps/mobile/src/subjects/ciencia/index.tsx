/**
 * Módulo de Ciencia. Lo edita SOLO la cuenta de Ciencia (docs/14-MATERIAS-EN-PARALELO.md): aquí se pone `available: true` cuando
 * haya contenido de verdad, y `Screen` es su cuaderno con su propia navegación interna. Hoy es un relleno: "Pronto".
 */
import type { SubjectModule } from '../types';
import { ComingSoon } from '../coming-soon';
import { CIENCIA_COVERS } from './art';

export const cienciaModule: SubjectModule = {
  id: 'ciencia',
  available: false,
  homeCard: () => ({ subtitle: '', segments: 0, image: CIENCIA_COVERS.notebook }),
  Screen: ({ onExit }) => <ComingSoon title="Ciencia" onExit={onExit} />,
};

/**
 * Módulo de Mi cuaderno (K8 / Kitewise B14): el espacio personal del niño. Se enchufa como una materia más (docs/14) pero NO es una materia:
 * no tiene unidades ni estrellas. Guarda solo las ideas que el niño escribe; las palabras salen de Lectura y los dibujos de Arte y música.
 */
import { progressSegments } from '@lee-conmigo/ui-core';
import { progressStoreFor, subjectStorageFor } from '../../app-state';
import type { SubjectModule } from '../types';
import { NOTEBOOK_COPY } from './copy';
import { emptyNotebook, isNotebookData, savedCount } from './model';
import { wordsOf } from './vocabulary';
import { MiCuadernoScreen } from './screen';

export const miCuadernoModule: SubjectModule = {
  id: 'mi-cuaderno',
  available: true,
  homeCard: (profile, lang) => {
    const data = subjectStorageFor('mi-cuaderno', profile.id, emptyNotebook(), isNotebookData).load();
    const words = wordsOf(progressStoreFor(profile.id).summaries()).length;
    const count = savedCount(words, data);
    // Sin «avance»: la portada cuenta lo que hay (hasta 3 segmentos), nunca una nota.
    return { subtitle: NOTEBOOK_COPY[lang].cover(count), segments: progressSegments(Math.min(3, count), 3) };
  },
  Screen: ({ profile, lang, onExit }) => <MiCuadernoScreen profile={profile} lang={lang} onExit={onExit} />,
};

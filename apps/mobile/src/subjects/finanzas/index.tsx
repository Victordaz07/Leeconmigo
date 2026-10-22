/**
 * Módulo de Finanzas («Para la vida» 01, D14/D15). Lo edita SOLO la cuenta de Finanzas (docs/14-MATERIAS-EN-PARALELO.md). Dinero siempre ficticio (UM),
 * sin cuentas ni compras reales. `Screen` maneja su propia navegación (cuaderno ↔ unidad), como pide `docs/14`.
 */
import { useState } from 'react';
import { FINANCE_UNITS, type FinanceUnit } from '@lee-conmigo/finance-content';
import { progressSegments } from '@lee-conmigo/ui-core';
import { subjectStorageFor } from '../../app-state';
import type { SubjectModule } from '../types';
import { FinanzasNotebook, type FinanzasProgress } from './notebook';
import { FinanzasPlayer } from './player';

const EMPTY: FinanzasProgress = {};

function isUnitProgress(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return Array.isArray(p.stepsDone) && p.stepsDone.every((x) => typeof x === 'string') && [0, 1, 2, 3].includes(p.stars as number);
}
const isFinanzasProgress = (v: unknown): v is FinanzasProgress => typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v as Record<string, unknown>).every(isUnitProgress);

export const finanzasModule: SubjectModule = {
  id: 'finanzas',
  available: true,
  homeCard: (profile, lang) => {
    const progress = subjectStorageFor('finanzas', profile.id, EMPTY, isFinanzasProgress).load();
    const done = FINANCE_UNITS.filter((u) => (progress[u.id]?.stars ?? 0) > 0).length;
    return { subtitle: lang === 'es' ? `${done}/${FINANCE_UNITS.length} unidades` : `${done}/${FINANCE_UNITS.length} units`, segments: progressSegments(done, FINANCE_UNITS.length) };
  },
  Screen: ({ profile, lang, focus, onExit }) => {
    const storage = subjectStorageFor('finanzas', profile.id, EMPTY, isFinanzasProgress);
    const [progress, setProgress] = useState<FinanzasProgress>(() => storage.load());
    const [open, setOpen] = useState<FinanceUnit | null>(null);
    if (open) {
      return (
        <FinanzasPlayer
          lang={lang}
          unit={open}
          profileId={profile.id}
          profileName={profile.name}
          focus={focus}
          onExit={() => setOpen(null)}
          onFinish={(next) => {
            // Las estrellas guardadas son las mejores que logró (hacerlo otra vez nunca resta).
            const best = Math.max(progress[open.id]?.stars ?? 0, next.stars) as 0 | 1 | 2 | 3;
            const merged: FinanzasProgress = { ...progress, [open.id]: { stepsDone: next.stepsDone, stars: best } };
            storage.save(merged);
            setProgress(merged);
            setOpen(null);
          }}
        />
      );
    }
    return <FinanzasNotebook lang={lang} progress={progress} onBack={onExit} onOpenUnit={setOpen} />;
  },
};

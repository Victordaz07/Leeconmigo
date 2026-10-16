/**
 * Módulo de Sociedad. Lo edita SOLO la cuenta de Sociedad (docs/14-MATERIAS-EN-PARALELO.md). Seis unidades
 * piloto, una por grado 1.º–6.º (docs/design/sociedad/). `Screen` maneja su propia navegación interna (cuaderno
 * ↔ investigación), como pide `docs/14`.
 */
import { useState } from 'react';
import { SOCIAL_UNITS } from '@lee-conmigo/social-content';
import { progressSegments } from '@lee-conmigo/ui-core';
import { subjectStorageFor } from '../../app-state';
import { SociedadInvestigationScreen } from '../../screens/sociedad-investigation-screen';
import { SociedadNotebookScreen, type SociedadProgress } from '../../screens/sociedad-notebook-screen';
import type { SubjectModule } from '../types';

const EMPTY_PROGRESS: SociedadProgress = {};

function isUnitProgress(v: unknown): v is { stepsDone: string[]; stars: 0 | 1 | 2 | 3 } {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return Array.isArray(p.stepsDone) && p.stepsDone.every((x) => typeof x === 'string') && [0, 1, 2, 3].includes(p.stars as number);
}

function isSociedadProgress(v: unknown): v is SociedadProgress {
  if (typeof v !== 'object' || v === null) return false;
  return Object.values(v as Record<string, unknown>).every(isUnitProgress);
}

export const sociedadModule: SubjectModule = {
  id: 'sociedad',
  available: true,
  homeCard: (profile, lang) => {
    const progress = subjectStorageFor('sociedad', profile.id, EMPTY_PROGRESS, isSociedadProgress).load();
    const done = SOCIAL_UNITS.filter((u) => (progress[u.id]?.stars ?? 0) > 0).length;
    return { subtitle: `${done}/${SOCIAL_UNITS.length} ${lang === 'es' ? 'investigaciones' : 'investigations'}`, segments: progressSegments(done, SOCIAL_UNITS.length) };
  },
  Screen: ({ profile, lang, focus, onExit }) => {
    const storage = subjectStorageFor('sociedad', profile.id, EMPTY_PROGRESS, isSociedadProgress);
    const [progress, setProgress] = useState<SociedadProgress>(() => storage.load());
    const [openUnitId, setOpenUnitId] = useState<string | null>(null);

    if (openUnitId) {
      const unit = SOCIAL_UNITS.find((u) => u.id === openUnitId)!;
      return (
        <SociedadInvestigationScreen
          lang={lang}
          unit={unit}
          profileId={profile.id}
          profileName={profile.name}
          focus={focus}
          onExit={() => setOpenUnitId(null)}
          onFinish={(next) => {
            const merged: SociedadProgress = { ...progress, [unit.id]: { stepsDone: next.stepsDone, stars: next.stars as 0 | 1 | 2 | 3 } };
            storage.save(merged);
            setProgress(merged);
            setOpenUnitId(null);
          }}
        />
      );
    }
    return <SociedadNotebookScreen lang={lang} units={SOCIAL_UNITS} progress={progress} onBack={onExit} onOpenUnit={setOpenUnitId} />;
  },
};

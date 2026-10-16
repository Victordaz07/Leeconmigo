/**
 * Módulo de Sociedad. Lo edita SOLO la cuenta de Sociedad (docs/14-MATERIAS-EN-PARALELO.md). Primera unidad
 * piloto: S3-U03 "El paso del arroyo" (docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md). `Screen` maneja su propia
 * navegación interna (cuaderno ↔ investigación), como pide `docs/14`.
 */
import { useState } from 'react';
import { socialUnitById } from '@lee-conmigo/social-content';
import { progressSegments } from '@lee-conmigo/ui-core';
import { subjectStorageFor } from '../../app-state';
import { SociedadInvestigationScreen } from '../../screens/sociedad-investigation-screen';
import { SociedadNotebookScreen, type SociedadNotebookProgress } from '../../screens/sociedad-notebook-screen';
import type { SubjectModule } from '../types';

const UNIT = socialUnitById('s3u03')!;

const EMPTY_PROGRESS: SociedadNotebookProgress = { stepsDone: [], stars: 0 };

function isSociedadProgress(v: unknown): v is SociedadNotebookProgress {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return Array.isArray(p.stepsDone) && p.stepsDone.every((x) => typeof x === 'string') && [0, 1, 2, 3].includes(p.stars as number);
}

export const sociedadModule: SubjectModule = {
  id: 'sociedad',
  available: true,
  homeCard: (profile, lang) => {
    const progress = subjectStorageFor('sociedad', profile.id, EMPTY_PROGRESS, isSociedadProgress).load();
    return { subtitle: UNIT.title[lang], segments: progressSegments(progress.stars, 3) };
  },
  Screen: ({ profile, lang, focus, onExit }) => {
    const storage = subjectStorageFor('sociedad', profile.id, EMPTY_PROGRESS, isSociedadProgress);
    const [progress, setProgress] = useState<SociedadNotebookProgress>(() => storage.load());
    const [open, setOpen] = useState(false);

    if (open) {
      return (
        <SociedadInvestigationScreen
          lang={lang}
          unit={UNIT}
          profileId={profile.id}
          profileName={profile.name}
          focus={focus}
          onExit={() => setOpen(false)}
          onFinish={(next) => {
            const merged: SociedadNotebookProgress = { stepsDone: next.stepsDone, stars: next.stars as 0 | 1 | 2 | 3 };
            storage.save(merged);
            setProgress(merged);
            setOpen(false);
          }}
        />
      );
    }
    return <SociedadNotebookScreen lang={lang} unit={UNIT} progress={progress} onBack={onExit} onOpen={() => setOpen(true)} />;
  },
};

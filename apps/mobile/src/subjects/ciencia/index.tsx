/**
 * Módulo de Ciencia. Lo edita SOLO la cuenta de Ciencia (docs/14-MATERIAS-EN-PARALELO.md). Primera unidad jugable: C4-U06
 * «Superficies y mapas» (la ladera después de la lluvia). El cuaderno abre en la unidad; cada sesión es un reproductor de pasos.
 */
import { useMemo, useRef, useState } from 'react';
import {
  EMPTY_SCIENCE,
  finishSession,
  homeSegments,
  isScienceProgress,
  recordChoice,
  recordTask,
  saveResume,
  SCIENCE_UNITS,
  unitProgress,
  type ScienceProgress,
} from '@lee-conmigo/science-content';
import { subjectStorageFor, type ChildProfile } from '../../app-state';
import type { SubjectModule, SubjectScreenProps } from '../types';
import { CIENCIA_COVERS } from './art';
import { SessionPlayer } from './session-player';
import { UnitHome } from './unit-home';

const UNIT = SCIENCE_UNITS[0];
const storage = (profileId: string) => subjectStorageFor('ciencia', profileId, EMPTY_SCIENCE, isScienceProgress);

type View = { name: 'unit' } | { name: 'session'; id: string; startStep: number };

function CienciaScreen({ profile, lang, minutes, focus, onExit }: SubjectScreenProps) {
  const store = useMemo(() => storage(profile.id), [profile.id]);
  const [progress, setProgress] = useState<ScienceProgress>(() => store.load());
  // Siempre el último, para que dos guardados seguidos (una tarea y una pregunta) no se pisen.
  const latest = useRef(progress);
  const commit = (next: ScienceProgress) => {
    latest.current = next;
    setProgress(next);
    store.save(next);
  };
  const [view, setView] = useState<View>({ name: 'unit' });
  const unitState = unitProgress(progress, UNIT.id);
  const language = lang === 'en' ? 'en' : 'es';

  if (view.name === 'session') {
    const session = UNIT.sessions.find((s) => s.id === view.id) ?? UNIT.sessions[0];
    return (
      <SessionPlayer
        key={session.id}
        profile={profile}
        lang={language}
        focus={focus}
        unit={UNIT}
        session={session}
        startStep={view.startStep}
        savedChoices={unitState.choices}
        onTaskDone={(task, done) => commit(recordTask(latest.current, UNIT, task, done))}
        onChoice={(id, ids) => commit(recordChoice(latest.current, UNIT.id, id, ids))}
        onStep={(i) => commit(saveResume(latest.current, UNIT.id, session.id, i))}
        onLeave={(i) => {
          commit(saveResume(latest.current, UNIT.id, session.id, i));
          setView({ name: 'unit' });
        }}
        onFinish={(stars) => commit(finishSession(latest.current, UNIT.id, session.id, stars))}
        onDone={() => setView({ name: 'unit' })}
      />
    );
  }
  return (
    <UnitHome
      unit={UNIT}
      lang={language}
      progress={unitState}
      attempts={progress.attempts}
      minutes={minutes}
      onBack={onExit}
      onOpenSession={(id) => setView({ name: 'session', id, startStep: unitState.resume?.sessionId === id ? unitState.resume.step : 0 })}
    />
  );
}

export const cienciaModule: SubjectModule = {
  id: 'ciencia',
  available: true,
  homeCard: (profile: ChildProfile, lang) => ({
    subtitle: UNIT.title[lang],
    segments: homeSegments(UNIT, unitProgress(storage(profile.id).load(), UNIT.id)),
    image: CIENCIA_COVERS.notebook,
  }),
  Screen: CienciaScreen,
};

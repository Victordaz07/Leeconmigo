/**
 * Módulo de Ciencia. Lo edita SOLO la cuenta de Ciencia (docs/14-MATERIAS-EN-PARALELO.md). Primera unidad jugable: C4-U06
 * «Superficies y mapas» (la ladera después de la lluvia). El cuaderno abre en la unidad; cada sesión es un reproductor de pasos.
 */
import { useMemo, useRef, useState } from 'react';
import {
  EMPTY_SCIENCE,
  finishSession,
  isScienceProgress,
  overallSegments,
  recordChoice,
  recordTask,
  saveResume,
  SCIENCE_UNITS,
  scienceUnitById,
  unitProgress,
  type ScienceProgress,
  type ScienceUnit,
} from '@lee-conmigo/science-content';
import { subjectStorageFor, type ChildProfile } from '../../app-state';
import type { SubjectModule, SubjectScreenProps } from '../types';
import { CIENCIA_COVERS, SHOW_UNITS_WITHOUT_ART, UNIT_ART_READY } from './art';
import { CatalogScreen } from './catalog-screen';
import { SessionPlayer } from './session-player';
import { UnitHome } from './unit-home';

/** Unidades que ya se pueden jugar: tienen contenido Y su arte llegó. */
const PLAYABLE: readonly ScienceUnit[] = SCIENCE_UNITS.filter((u) => UNIT_ART_READY[u.id] || SHOW_UNITS_WITHOUT_ART);
const playableSessions = Object.fromEntries(PLAYABLE.map((u) => [u.id, u.sessions.length]));
const storage = (profileId: string) => subjectStorageFor('ciencia', profileId, EMPTY_SCIENCE, isScienceProgress);

type View = { name: 'catalog' } | { name: 'unit'; unitId: string } | { name: 'session'; unitId: string; id: string; startStep: number };

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
  const [view, setView] = useState<View>({ name: 'catalog' });
  const language = lang === 'en' ? 'en' : 'es';
  // El grado con el que abre el catálogo: el de la unidad que va empezada, o el de la primera jugable.
  const started = PLAYABLE.find((u) => unitProgress(progress, u.id).sessionsDone.length > 0 || unitProgress(progress, u.id).resume);
  const initialGrade = (started ?? PLAYABLE[0])?.grade ?? 4;

  if (view.name === 'catalog') {
    return <CatalogScreen lang={language} progress={progress} playable={playableSessions} initialGrade={initialGrade} onBack={onExit} onOpen={(unitId) => setView({ name: 'unit', unitId })} />;
  }
  const UNIT = PLAYABLE.find((u) => u.id === view.unitId) ?? PLAYABLE[0];
  const unitState = unitProgress(progress, UNIT.id);

  if (view.name === 'session') {
    const session = UNIT.sessions.find((s) => s.id === view.id) ?? UNIT.sessions[0];
    return (
      <SessionPlayer
        key={`${UNIT.id}:${session.id}`}
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
          setView({ name: 'unit', unitId: UNIT.id });
        }}
        onFinish={(stars) => commit(finishSession(latest.current, UNIT.id, session.id, stars))}
        onDone={() => setView({ name: 'unit', unitId: UNIT.id })}
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
      onBack={() => setView({ name: 'catalog' })}
      onOpenSession={(id) => setView({ name: 'session', unitId: UNIT.id, id, startStep: unitState.resume?.sessionId === id ? unitState.resume.step : 0 })}
    />
  );
}

export const cienciaModule: SubjectModule = {
  id: 'ciencia',
  available: true,
  homeCard: (profile: ChildProfile, lang) => {
    const progress = storage(profile.id).load();
    // La unidad en curso, o la primera: «Superficies y mapas», no el nombre de la materia.
    const current = PLAYABLE.find((u) => unitProgress(progress, u.id).resume) ?? PLAYABLE.find((u) => unitProgress(progress, u.id).sessionsDone.length > 0) ?? PLAYABLE[0];
    return { subtitle: current ? current.title[lang] : '', segments: overallSegments(PLAYABLE, progress), image: CIENCIA_COVERS.notebook };
  },
  Screen: CienciaScreen,
};

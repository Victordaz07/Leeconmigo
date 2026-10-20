/**
 * Módulo de Arte y música. Lo edita SOLO la cuenta de Artes (docs/14-MATERIAS-EN-PARALELO.md). Hoy: Taller libre de ritmo (ocho pulsos × cuatro
 * filas, 16 sonidos sintetizados), con guardado automático por niño y versiones A/B. Sin micrófono ni cámara; lo creado no sale del equipo.
 */
import { useMemo, useRef, useState } from 'react';
import {
  ARTE_COPY, createRhythmProject, deleteProject, deleteVersion, duplicateProject, emptyLibrary, isArtLibrary, projectById, renameProject, restoreVersion, saveVersion, updateScene,
  type ArtLang, type ArtLibrary,
} from '@lee-conmigo/art-content';
import { progressSegments } from '@lee-conmigo/ui-core';
import { subjectStorageFor } from '../../app-state';
import type { SubjectModule, SubjectScreenProps } from '../types';
import { ArteHome } from './arte-home';
import { RhythmWorkshop } from './rhythm-workshop';

const EMPTY_LIBRARY: ArtLibrary = emptyLibrary();
const storage = (profileId: string) => subjectStorageFor('arte', profileId, EMPTY_LIBRARY, isArtLibrary);

function ArteScreen({ profile, lang, onExit }: SubjectScreenProps) {
  const store = useMemo(() => storage(profile.id), [profile.id]);
  const [library, setLibrary] = useState<ArtLibrary>(() => store.load());
  // Siempre el último, para que dos cambios seguidos (un pulso y un sonido) no se pisen.
  const latest = useRef(library);
  const commit = (next: ArtLibrary) => {
    if (next === latest.current) return;
    latest.current = next;
    setLibrary(next);
    store.save(next);
  };
  const [openId, setOpenId] = useState<string | null>(null);
  const language: ArtLang = lang === 'en' ? 'en' : 'es';
  const t = ARTE_COPY[language];
  const project = openId ? projectById(library, openId) : undefined;

  if (!project) {
    return (
      <ArteHome
        lang={language}
        library={library}
        onBack={onExit}
        onNewRhythm={() => {
          const r = createRhythmProject(latest.current, t.defaultTitle, language, Date.now());
          commit(r.lib);
          if (r.id) setOpenId(r.id);
        }}
        onOpen={setOpenId}
      />
    );
  }
  const id = project.id;
  return (
    <RhythmWorkshop
      key={id}
      lang={language}
      project={project}
      onScene={(scene) => commit(updateScene(latest.current, id, 0, scene, Date.now()))}
      onRename={(title) => commit(renameProject(latest.current, id, title, Date.now()))}
      onSaveVersion={() => commit(saveVersion(latest.current, id, Date.now()).lib)}
      onRestore={(versionId) => commit(restoreVersion(latest.current, id, versionId, Date.now()))}
      onDeleteVersion={(versionId) => commit(deleteVersion(latest.current, id, versionId))}
      onDuplicate={() => {
        const r = duplicateProject(latest.current, id, t.copySuffix, Date.now());
        commit(r.lib);
        if (r.id) setOpenId(r.id);
      }}
      onDelete={() => {
        commit(deleteProject(latest.current, id));
        setOpenId(null);
      }}
      onBack={() => setOpenId(null)}
    />
  );
}

export const arteModule: SubjectModule = {
  id: 'arte',
  available: true,
  homeCard: (profile, lang) => {
    const lib = storage(profile.id).load();
    // El cuaderno no tiene «avance»: la portada muestra cuántas creaciones hay (hasta 3 segmentos), nunca una nota.
    return { subtitle: ARTE_COPY[lang === 'en' ? 'en' : 'es'].cover(lib.projects.length), segments: progressSegments(Math.min(3, lib.projects.length), 3) };
  },
  Screen: ArteScreen,
};

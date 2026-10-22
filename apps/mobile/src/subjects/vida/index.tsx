/**
 * Los siete cuadernos «Para la vida» 02–08 (Emociones, Comunicación, Vida digital, Pensamiento crítico, Autonomía, Organización, Emprendimiento), cada uno un cuaderno
 * APARTE con su propio guardado y su propia tarjeta (D14), pero con el mismo motor de misiones (`@lee-conmigo/life-content`). Hoy cada uno ofrece un «Primer vistazo»:
 * una misión corta de 3 encuentros. Finanzas (módulo 01) tiene su propio módulo.
 */
import { useState } from 'react';
import { LIFE_MISSIONS, LIFE_MODULE_IDS, type LifeModuleId } from '@lee-conmigo/life-content';
import { progressSegments, subjectById, VIDA_COPY, VIDA_MODULES } from '@lee-conmigo/ui-core';
import { colors } from '@lee-conmigo/ui-native';
import { subjectStorageFor } from '../../app-state';
import type { SubjectModule } from '../types';
import { VidaNotebook, type VidaProgress } from './notebook';
import { VidaPlayer } from './player';

const EMPTY: VidaProgress = {};

function isMissionProgress(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return Array.isArray(p.stepsDone) && p.stepsDone.every((x) => typeof x === 'string') && [0, 1, 2, 3].includes(p.stars as number);
}
const isVidaProgress = (v: unknown): v is VidaProgress => typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v as Record<string, unknown>).every(isMissionProgress);

function makeModule(id: LifeModuleId): SubjectModule {
  const mission = LIFE_MISSIONS[id];
  const subject = subjectById(id);
  const storageFor = (profileId: string) => subjectStorageFor(id, profileId, EMPTY, isVidaProgress);
  return {
    id,
    available: true,
    homeCard: (profile, lang) => {
      const done = (storageFor(profile.id).load()[mission.id]?.stars ?? 0) > 0;
      return { subtitle: done ? (lang === 'es' ? '1/1 misión' : '1/1 mission') : VIDA_COPY.preview[lang], segments: progressSegments(done ? 1 : 0, 1) };
    },
    Screen: ({ profile, lang, focus, onExit }) => {
      const storage = storageFor(profile.id);
      const [progress, setProgress] = useState<VidaProgress>(() => storage.load());
      const [open, setOpen] = useState(false);
      const accent = colors[subject.colorToken];
      if (open) {
        return (
          <VidaPlayer
            lang={lang}
            mission={mission}
            accent={accent}
            profileId={profile.id}
            profileName={profile.name}
            focus={focus}
            onExit={() => setOpen(false)}
            onFinish={(next) => {
              // Las estrellas guardadas son las mejores que logró (hacerlo otra vez nunca resta).
              const best = Math.max(progress[mission.id]?.stars ?? 0, next.stars) as 0 | 1 | 2 | 3;
              const merged: VidaProgress = { ...progress, [mission.id]: { stepsDone: next.stepsDone, stars: best } };
              storage.save(merged);
              setProgress(merged);
              setOpen(false);
            }}
          />
        );
      }
      return <VidaNotebook lang={lang} module={id} gradient={subject.gradientToken} accent={accent} glyph={subject.glyph} mission={mission} progress={progress} onBack={onExit} onOpen={() => setOpen(true)} />;
    },
  };
}

export const vidaModules = Object.fromEntries(LIFE_MODULE_IDS.map((id) => [id, makeModule(id)])) as Record<LifeModuleId, SubjectModule>;

/** Nombre legible de un módulo (para pruebas y mensajes). */
export const vidaModuleName = (id: LifeModuleId, lang: 'es' | 'en') => VIDA_MODULES[id].name[lang];

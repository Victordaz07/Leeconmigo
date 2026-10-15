/**
 * App Reader: decide qué pantalla mostrar según el flujo y conecta los componentes de `@lee-conmigo/ui`
 * con el motor (a través de `useSession`). La experiencia sigue al pie de la letra el prototipo aprobado
 * (docs/04-READING-SESSION.md); no se rediseña nada aquí.
 */
import { useMemo, useState } from 'react';
import type { LayoutFile, ReadingProfile } from '@lee-conmigo/contracts';
import { computeProgressStats, type ProgressStore } from '@lee-conmigo/session-engine';
import { InMemoryStoryRepository, emptyLayoutFile, type StoryRepository } from '@lee-conmigo/story-engine';
import { DevPanel, EndScreen, HomeScreen, LayoutEditor, LibraryScreen, ParentGateScreen, ParentSettingsScreen, ProgressScreen, SelectScreen, SessionScene, TabletCanvas, levelTilesFor, type SaveOutcome } from '@lee-conmigo/ui';
import { createBundledRepository } from './bundled-stories.ts';
import { pingEditorServer, saveLayoutFile } from './editor-client.ts';
import { DEV_TOOLS, FLAGS } from './flags.ts';
import { LocalStorageProgressStore } from './local-progress-store.ts';
import { loadProfile, saveProfile } from './profile.ts';
import { clearParentPin, readChildName, readDailyGoalMinutes, readFreeReadingMode, readParentPin, saveChildName, saveDailyGoalMinutes, saveFreeReadingMode, saveParentPin } from './parent-settings.ts';
import { buildProgressData } from './build-progress.ts';
import { useSession } from './use-session.ts';
import { VoiceLab } from './voice-lab.tsx';

/** El panel de desarrollo solo existe en desarrollo (`?dev=0` lo oculta, p. ej. para capturas de pantalla). */
const SHOW_DEV_PANEL = DEV_TOOLS && new URLSearchParams(location.search).get('dev') !== '0';

export interface AppProps {
  /** De dónde salen las historias (por defecto, las empaquetadas con la app). */
  repository?: StoryRepository;
  /** Dónde se guarda el progreso (por defecto, `localStorage`). */
  store?: ProgressStore;
  /** Idioma y nivel del niño (por defecto: `?lang=&level=` de la URL, lo guardado, o español nivel 1). */
  profile?: ReadingProfile;
  /** Cuando cambia el perfil (por defecto, se recuerda en el dispositivo). */
  onProfileChange?: (profile: ReadingProfile) => void;
  /** Cómo guardar los ajustes del editor (por defecto, el servidor de desarrollo). Pruebas: una función falsa. */
  saveLayout?: (file: LayoutFile) => Promise<SaveOutcome>;
}

export function App(props: AppProps = {}) {
  const [repository, setRepository] = useState<StoryRepository>(() => props.repository ?? createBundledRepository());
  const [store] = useState(() => props.store ?? new LocalStorageProgressStore());
  const [profile] = useState(() => props.profile ?? loadProfile());
  const [freeReading, setFreeReading] = useState(() => readFreeReadingMode());
  const s = useSession({ repository, store, profile, onProfileChange: props.onProfileChange ?? saveProfile, freeReading });
  const { story, page, words, reading, flow, prefs } = s;
  // "Mi progreso" (docs/07): los únicos números reales son los que salen de los resúmenes guardados.
  const progressStats = useMemo(() => computeProgressStats(s.summaries), [s.summaries]);

  // "Modo padres" (docs/01, docs/09 #1): candado con PIN sencillo antes de cambiar idioma, nivel o meta diaria.
  // `parentScreen` vive fuera de `flow` a propósito: se puede abrir desde Inicio o Progreso sin perder la sesión de lectura.
  const [parentScreen, setParentScreen] = useState<'closed' | 'gate' | 'settings'>('closed');
  const [parentPin, setParentPin] = useState(() => readParentPin());
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => readDailyGoalMinutes());
  const [childName, setChildName] = useState(() => readChildName());
  const openParentMode = () => setParentScreen('gate');
  const closeParentMode = () => setParentScreen('closed');

  // Biblioteca (docs/08 Fase G): pantalla propia con TODAS las historias, no ligada al flujo de lectura — igual
  // que Modo padres, vive fuera de `flow` para poder abrirse desde Inicio o Progreso sin perder la sesión.
  const [showLibrary, setShowLibrary] = useState(false);
  const openLibrary = () => setShowLibrary(true);

  // "Probar micrófono" (solo herramientas de desarrollo): WhisperSpeechEngine en vivo, fuera de una historia.
  const [voiceLabOpen, setVoiceLabOpen] = useState(false);

  // Modo editor del texto en los globos (solo herramientas de desarrollo): abre la familia de la historia que se está viendo.
  const [editing, setEditing] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const familyId = story.familyId ?? story.id;
  const canEdit = !!repository.sourcesOfFamily;
  const openEditor = () => {
    setEditing(true);
    void (props.saveLayout ? Promise.resolve(true) : pingEditorServer()).then(setCanSave);
  };

  let screen: React.ReactNode;
  switch (flow.screen) {
    case 'home':
      screen = (
        <HomeScreen
          childName={childName}
          streakDays={progressStats.streakDays}
          starsTotal={progressStats.starsTotal}
          current={s.home.current}
          stories={s.home.cards}
          levels={levelTilesFor(s.profile.level)}
          onContinue={s.home.onContinue}
          onGoHome={s.go('home')}
          onGoLibrary={openLibrary}
          onGoProgress={s.go('progress')}
          onGoSettings={openParentMode}
        />
      );
      break;
    case 'progress':
      screen = (
        <ProgressScreen
          data={buildProgressData(childName, progressStats, dailyGoalMinutes)}
          tab={flow.progressTab}
          showAccuracy={FLAGS.showAccuracyToChild}
          onTab={s.setProgressTab}
          onBack={s.go('home')}
          onGoHome={s.go('home')}
          onGoLibrary={openLibrary}
          onGoSettings={openParentMode}
        />
      );
      break;
    case 'select':
      screen = <SelectScreen story={story} page={page} words={words} reading={reading} prefs={prefs} panelOpen={!s.collapsed} onTogglePanel={s.togglePanel} onBack={s.go('home')} onStart={s.goPrep} />;
      break;
    case 'end':
      screen = <EndScreen audience={prefs.audience} page={page} stars={s.end.stars} stats={s.end.stats} practiced={s.end.practiced} onAgain={s.restart} onNext={s.go('home')} />;
      break;
    default:
      screen = (
        <SessionScene
          story={story}
          page={page}
          words={words}
          screen={flow.screen}
          reading={reading}
          prefs={prefs}
          panelCollapsed={s.collapsed}
          storyHidden={s.storyHidden}
          pronounceNonce={s.pronounceNonce}
          elapsedSeconds={s.elapsedSeconds}
          answer={flow.answer}
          review={flow.review}
          actions={s.actions}
          freeReading={freeReading}
        />
      );
  }

  if (showLibrary) {
    screen = (
      <LibraryScreen
        stories={s.library.cards.map((c) => ({ ...c, onOpen: () => { setShowLibrary(false); c.onOpen?.(); } }))}
        onBack={() => setShowLibrary(false)}
        onGoHome={() => { setShowLibrary(false); s.go('home')(); }}
        onGoProgress={() => { setShowLibrary(false); s.go('progress')(); }}
        onGoSettings={openParentMode}
      />
    );
  }

  if (parentScreen === 'gate') {
    screen = (
      <>
        {screen}
        <ParentGateScreen
          hasPin={parentPin !== null}
          onVerify={(pin) => {
            if (pin !== parentPin) return false;
            setParentScreen('settings');
            return true;
          }}
          onCreate={(pin) => {
            saveParentPin(pin);
            setParentPin(pin);
            setParentScreen('settings');
          }}
          onCancel={closeParentMode}
        />
      </>
    );
  } else if (parentScreen === 'settings') {
    screen = (
      <>
        {screen}
        <ParentSettingsScreen
          childName={childName}
          language={s.profile.language}
          level={s.profile.level}
          dailyGoalMinutes={dailyGoalMinutes}
          freeReading={freeReading}
          onSetChildName={(name) => {
            setChildName(name);
            saveChildName(name);
          }}
          onSetLanguage={(language) => s.setProfile({ ...s.profile, language })}
          onSetLevel={(level) => s.setProfile({ ...s.profile, level })}
          onSetDailyGoal={(minutes) => {
            setDailyGoalMinutes(minutes);
            saveDailyGoalMinutes(minutes);
          }}
          onSetFreeReading={(enabled) => {
            setFreeReading(enabled);
            saveFreeReadingMode(enabled);
          }}
          onChangePin={() => {
            clearParentPin();
            setParentPin(null);
            setParentScreen('gate');
          }}
          onBack={closeParentMode}
        />
      </>
    );
  }

  return (
    <>
      <TabletCanvas adaptive={s.fitMode}>{screen}</TabletCanvas>
      {SHOW_DEV_PANEL && (
        <DevPanel
          sims={s.dev.sims}
          prefs={prefs}
          onPrefs={s.setPrefs}
          autoReading={s.dev.auto}
          onToggleAuto={s.dev.toggleAuto}
          stateNumber={s.dev.stateNumber}
          onJump={s.dev.jumpTo}
          log={s.dev.log}
          timer={s.dev.timer}
          stories={s.dev.stories}
          onOpenStory={s.dev.openStory}
          pageLabel={s.dev.pageLabel}
          profile={s.dev.profile}
          onProfile={s.dev.setProfile}
          onOpenEditor={canEdit ? openEditor : undefined}
          onOpenVoiceLab={() => setVoiceLabOpen(true)}
        />
      )}
      {voiceLabOpen && <VoiceLab onExit={() => setVoiceLabOpen(false)} />}
      {editing && canEdit && (
        <LayoutEditor
          sources={repository.sourcesOfFamily!(familyId)}
          saved={repository.layoutFileOf?.(familyId) ?? emptyLayoutFile(familyId)}
          initialVariantId={story.id}
          initialPageId={page.id}
          onSave={canSave ? (props.saveLayout ?? saveLayoutFile) : undefined}
          onExit={(saved) => {
            // Lo guardado (o lo que ya estaba) se aplica al momento: la lectura usa las cajas nuevas sin recargar.
            if (repository instanceof InMemoryStoryRepository) setRepository(repository.withLayoutFile(familyId, saved));
            setEditing(false);
          }}
        />
      )}
    </>
  );
}

/**
 * Escena de la sesión de lectura: panel lateral + cómic con "cámara" + tarjetas encima.
 * Cubre los estados de docs/04: preparación, esperando voz, leyendo, pausas, palabra dudosa/incorrecta/repetida/
 * saltada/difícil, pronunciación, "¡muy bien!", fin de página, pregunta y repaso.
 *
 * Hay dos repartos de la pantalla:
 *  - CLÁSICO (prototipo aprobado): panel lateral con el texto + cómic con globos de texto encima y "cámara" que enfoca el cuadro.
 *  - AJUSTADO (páginas con globos dibujados en la ilustración, `isBalloonPage`): la ilustración COMPLETA arriba a la derecha con
 *    el texto directo en sus globos, barra lateral izquierda y barra inferior con lo que sobra (`fitLayout`).
 *
 * Solo presentación: recibe el estado de lectura ya calculado y avisa de las intenciones del niño con callbacks.
 * No conoce al motor de lectura ni a ningún proveedor de voz.
 */
import type { ReadingSessionState, Story, StoryPage } from '@lee-conmigo/contracts';
import type { ReviewState } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { lookupVocabulary } from '@lee-conmigo/story-engine';
import { asset, ComicLayer, COMIC_WIDTH, cameraOffset } from '../comic.tsx';
import { ComicFitLayer, isBalloonPage } from '../comic-fit.tsx';
import { FIT_MIN_BOTTOM, FIT_MIN_SIDE, FREE_MIN_BOTTOM, FREE_MIN_SIDE, fitLayout } from '../fit-layout.ts';
import { cn } from '../lib.ts';
import { useCanvasSize } from '../stage.tsx';
import { cleanWord, currentLineOf, deriveReadingView, type ReadingView } from '../view-model.ts';
import type { ReaderPrefs } from '../types.ts';
import { BlockText } from './block-text.tsx';
import { HelpModal, PageDoneFlourish, PauseCloud, PrepCard } from './overlays.tsx';
import { QuestionScreen } from './question.tsx';
import { ReadingBar } from './reading-bar.tsx';
import { ReviewScreen } from './review.tsx';
import { SidePanel, SideRail } from './side-panel.tsx';

export type SessionScreen = 'prep' | 'reading' | 'pageDone' | 'question' | 'review';

export interface SessionActions {
  onBack: () => void;
  onTogglePanel: () => void;
  onToggleStory: () => void;
  onWordTap: (wordIndex: number) => void;
  onAskHelp: () => void;
  onCloseHelp: () => void;
  onListen: () => void;
  onReadStart: () => void;
  onPronounce: () => void;
  onPronouncingChange?: (pronouncing: boolean) => void;
  onBegin: () => void;
  onPickAnswer: (index: number) => void;
  onContinue: () => void;
  onReviewTap: (tile: number) => void;
  onReviewNext: () => void;
  onReviewListen: () => void;
  /** "Modo lectura libre" (Modo padres): confirma a mano que la página ya se leyó, sin esperar al micrófono. */
  onFreeAdvance: () => void;
  /** "Modo lectura libre": vuelve a la página anterior (sin pedir la pregunta de nuevo). */
  onFreeBack: () => void;
}

export interface SessionSceneProps {
  story: Story;
  page: StoryPage;
  words: StoryWord[];
  screen: SessionScreen;
  reading: ReadingSessionState;
  prefs: ReaderPrefs;
  panelCollapsed: boolean;
  storyHidden: boolean;
  /** Se incrementa cada vez que se pide escuchar la pronunciación (dispara la animación de sílabas). */
  pronounceNonce: number;
  /** Tiempo LEÍDO de toda la sesión, en segundos (cuenta hacia arriba: docs/06, sin meta del padre no hay cuenta atrás). */
  elapsedSeconds: number;
  answer: number | null;
  review: ReviewState | null;
  actions: SessionActions;
  /** "Modo lectura libre" (Modo padres, docs/01): el padre lee y avanza de página con un botón, sin motor de voz. */
  freeReading?: boolean;
}

/** Tarjetas que aparecen sobre la ilustración: velo, preparación, ayuda, pausa larga, fin de página, pregunta y repaso. */
function Overlays({ p, view, pageNumber, totalPages }: { p: SessionSceneProps; view: ReadingView; pageNumber: number; totalPages: number }) {
  const { story, page, words, screen, reading, prefs, actions: a } = p;
  const helpWord = reading.helpWordIndex !== null ? words[reading.helpWordIndex] : undefined;
  const variant = page.checkpoint?.variants.find((v) => v.audience === prefs.audience) ?? page.checkpoint?.variants[0];
  return (
    <>
      {view.scrim && <div className="absolute inset-0 z-[3] animate-fade bg-[rgb(18_22_40/.45)]" onClick={a.onCloseHelp} />}

      {screen === 'prep' && <PrepCard audience={prefs.audience} onBegin={a.onBegin} />}

      {helpWord && (
        <HelpModal
          word={cleanWord(helpWord.text)}
          entry={lookupVocabulary(story, helpWord.text)}
          audience={prefs.audience}
          page={page}
          pronounceNonce={p.pronounceNonce}
          onPronounce={a.onPronounce}
          onPronouncingChange={a.onPronouncingChange}
          onClose={a.onCloseHelp}
        />
      )}

      {/* "Modo lectura libre": sin voz real que escuchar, no tiene sentido preguntar "¿necesitas ayuda?". */}
      {view.pauseCloud && !p.freeReading && <PauseCloud audience={prefs.audience} currentWord={view.currentWord} onReadStart={a.onReadStart} onAskHelp={a.onAskHelp} />}

      {screen === 'pageDone' && <PageDoneFlourish pageNumber={pageNumber} totalPages={totalPages} />}

      {screen === 'question' && variant && (
        <QuestionScreen
          audience={prefs.audience}
          page={page}
          prompt={variant.prompt}
          options={variant.options}
          correctIndex={variant.correctIndex}
          answer={p.answer}
          feedback={p.answer === null ? '' : p.answer === variant.correctIndex ? variant.correctFeedback : variant.retryFeedback}
          onPick={a.onPickAnswer}
          onContinue={a.onContinue}
        />
      )}

      {screen === 'review' && p.review && (
        <ReviewScreen
          audience={prefs.audience}
          review={p.review}
          definition={story.vocabulary[p.review.words[p.review.index].key]?.definition}
          onTap={a.onReviewTap}
          onNext={a.onReviewNext}
          onListen={a.onReviewListen}
        />
      )}
    </>
  );
}

export function SessionScene(p: SessionSceneProps) {
  const { story, page, words, screen, reading, prefs, actions: a } = p;
  const canvas = useCanvasSize();
  const view = deriveReadingView({ screen, reading, words, prefs, freeReading: p.freeReading });
  const pageNumber = story.pages.indexOf(page) + 1;
  const totalPages = story.pages.length;
  const currentLine = currentLineOf(words, reading, view.currentBlock);
  // Palabras con entrada en el diccionario de la historia (pedido de Noah): se calcula una sola vez por página para
  // marcarlas con un subrayado sutil, sea cual sea el reparto en el que se dibuje el texto.
  const vocabWords = new Set(words.filter((w) => lookupVocabulary(story, w.text) !== undefined).map((w) => w.index));
  // Página de solo texto (sin globos dibujados sobre la ilustración): fuera de "modo lectura libre" se lee en el
  // panel lateral (ahí no se puede ocultar). En modo libre se trata igual que las páginas con globo — ilustración
  // completa y texto como leyenda simple — para que nunca aparezca como "otra columna" aparte de la imagen.
  const isTextPage = !page.blocks.some((b) => b.layout);
  const freeTextPage = p.freeReading && isTextPage;

  // --- Reparto AJUSTADO: ilustración completa arriba a la derecha, barra lateral izquierda y barra inferior ------------------
  // "Modo lectura libre": sin voz real, ni barra inferior ni mucho riel que mostrar — la ilustración manda en
  // tamaño. Nunca se superpone nada sobre ella: lo único que cambia de tamaño son las barras alrededor.
  if (isBalloonPage(page) || freeTextPage) {
    const minSide = p.freeReading ? FREE_MIN_SIDE : FIT_MIN_SIDE;
    const minBottom = p.freeReading ? FREE_MIN_BOTTOM : FIT_MIN_BOTTOM;
    const L = fitLayout({ width: canvas.width, height: canvas.height, imageWidth: page.illustration.width, imageHeight: page.illustration.height, minSide, minBottom, centerVertically: p.freeReading });
    const block = page.blocks[view.currentBlock];
    return (
      <>
        <SideRail
          page={page}
          screen={screen}
          reading={reading}
          prefs={prefs}
          view={view}
          elapsedSeconds={p.elapsedSeconds}
          width={L.side.width}
          showToggle={false}
          showMascot={false}
          pageInfo={{ number: pageNumber, total: totalPages }}
          onBack={a.onBack}
          onTogglePanel={a.onTogglePanel}
          onAskHelp={a.onAskHelp}
          onListen={a.onListen}
          freeReading={p.freeReading}
          onFreeBack={a.onFreeBack}
          onFreeAdvance={a.onFreeAdvance}
        />
        <div className="relative min-w-0 flex-1 overflow-hidden bg-stage">
          {/* `key`: al cambiar de página la ilustración se monta de nuevo y entra con el efecto de cambio de página. */}
          <div key={page.id} className={cn('absolute right-0', pageNumber > 1 && 'animate-page-in')} style={{ top: L.image.y, width: L.image.width, height: L.image.height }}>
            {isBalloonPage(page) ? (
              <ComicFitLayer
                page={page}
                words={words}
                reading={reading}
                screen={screen}
                prefs={prefs}
                currentBlock={view.currentBlock}
                // "Modo lectura libre": nadie "va leyendo" una palabra concreta, así que el aro azul de "cuadro
                // activo" no debe quedar pegado en el globo todo el tiempo como si fuera un adorno permanente.
                highlightActive={screen === 'reading' && !p.freeReading}
                inSession
                onTap={a.onWordTap}
                width={L.image.width}
                height={L.image.height}
                vocabWords={vocabWords}
              />
            ) : (
              <div className="relative h-full w-full">
                <img src={asset(page.illustration.src)} alt={page.illustration.alt ?? ''} className="absolute inset-0 block h-full w-full object-cover" draggable={false} />
                {/* Leyenda simple sobre un fondo casi opaco (solo se difumina en el borde de arriba): sin caja, sin
                    borde, pero con fondo sólido donde cae el texto para que nunca se mezcle con la ilustración. */}
                <div
                  className="absolute inset-x-0 bottom-0 max-h-[58%] overflow-y-auto px-7 pb-6 pt-14"
                  style={{ background: 'linear-gradient(to top, #fff 82%, rgba(255,255,255,0) 100%)' }}
                >
                  <BlockText
                    words={words}
                    blockIndex={view.currentBlock}
                    lineCount={block?.lines.length ?? 0}
                    currentLine={currentLine}
                    fontSize={prefs.textSize}
                    hidden={false}
                    reading={reading}
                    screen={screen}
                    prefs={prefs}
                    onTap={a.onWordTap}
                    vocabWords={vocabWords}
                  />
                </div>
              </div>
            )}
          </div>
          {!p.freeReading && (
            <ReadingBar
              width={L.bottom.width}
              height={L.bottom.height}
              view={view}
              words={words}
              reading={reading}
              screen={screen}
              prefs={prefs}
              currentLine={currentLine}
              onTap={a.onWordTap}
            />
          )}
          <Overlays p={p} view={view} pageNumber={pageNumber} totalPages={totalPages} />
        </div>
      </>
    );
  }

  // --- Reparto CLÁSICO (prototipo aprobado) ---------------------------------------------------------------------------------
  const collapsed = p.panelCollapsed && !isTextPage;
  const freeze = screen === 'question' || screen === 'review';
  const offset = cameraOffset(page, view.currentBlock, collapsed, freeze);

  return (
    <>
      {collapsed ? (
        <SideRail page={page} screen={screen} reading={reading} prefs={prefs} view={view} elapsedSeconds={p.elapsedSeconds} onBack={a.onBack} onTogglePanel={a.onTogglePanel} onAskHelp={a.onAskHelp} onListen={a.onListen} />
      ) : (
        <SidePanel
          title={story.title}
          page={page}
          words={words}
          reading={reading}
          screen={screen}
          prefs={prefs}
          view={view}
          elapsedSeconds={p.elapsedSeconds}
          storyHidden={p.storyHidden}
          pageInfo={{ number: pageNumber, total: totalPages }}
          canCollapse={!isTextPage}
          onBack={a.onBack}
          onTogglePanel={a.onTogglePanel}
          onToggleStory={a.onToggleStory}
          onWordTap={a.onWordTap}
          onAskHelp={a.onAskHelp}
          onListen={a.onListen}
          onReadStart={a.onReadStart}
          freeReading={p.freeReading}
          onFreeBack={a.onFreeBack}
          onFreeAdvance={a.onFreeAdvance}
          vocabWords={vocabWords}
        />
      )}

      <div className="relative min-w-0 flex-1 overflow-hidden bg-stage">
        {/* `key`: al cambiar de página la ilustración se monta de nuevo y entra con el efecto de cambio de página. */}
        <div key={page.id} className={cn('absolute top-0 h-full transition-[left] duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)]', pageNumber > 1 && 'animate-page-in')} style={{ left: -offset, width: COMIC_WIDTH }}>
          <ComicLayer page={page} words={words} reading={reading} screen={screen} prefs={prefs} currentBlock={view.currentBlock} highlightActive={screen === 'reading'} inSession onTap={a.onWordTap} vocabWords={vocabWords} />
        </div>
        <Overlays p={p} view={view} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    </>
  );
}

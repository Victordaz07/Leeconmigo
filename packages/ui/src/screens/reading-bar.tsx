/**
 * Barra inferior de las páginas con globos dibujados: ocupa lo que le sobra a la pantalla bajo la ilustración. Lleva el mensaje
 * de acompañamiento (con la mascota en Explorador) y, mientras se lee, la FRASE ACTUAL en letra grande como apoyo de foco.
 */
import type { ReadingSessionState } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { WordSpan, asset, wordsOfLine } from '../comic.tsx';
import { DEFAULT_MAX_FONT_PX, MIN_FONT_SCREEN_PX } from '../comic-fit.tsx';
import { FitBox } from '../fit-text.tsx';
import { micColor } from '../mic.tsx';
import type { ReaderPrefs } from '../types.ts';
import type { ReadingView } from '../view-model.ts';

export interface ReadingBarProps {
  width: number;
  height: number;
  view: ReadingView;
  words: StoryWord[];
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  /** Frase (línea del cuadro) de la palabra actual. */
  currentLine: number;
  onTap: (wordIndex: number) => void;
}

const PAD = 14;

/** "Modo lectura libre": ocupa el mismo sitio que la mascota y el mensaje (nunca los dos a la vez). Se reutiliza en side-panel.tsx. */
export function FreeNavButtons({ height, onBack, onAdvance }: { height: number; onBack?: () => void; onAdvance?: () => void }) {
  const h = Math.min(height, 76);
  return (
    <div className="flex min-w-0 flex-1 items-stretch gap-2.5" style={{ height: h }}>
      <button
        type="button"
        onClick={onBack}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-[18px] bg-white text-[15px] font-black text-ink-soft shadow-[0_8px_20px_rgb(30_35_64/.12)] active:scale-[.97]"
      >
        ‹ Atrás
      </button>
      <button
        type="button"
        onClick={onAdvance}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-[18px] bg-(image:--grad-brand) text-[15px] font-black text-white shadow-[0_8px_20px_rgb(30_111_232/.35)] active:scale-[.97]"
      >
        Siguiente ›
      </button>
    </div>
  );
}

export function ReadingBar({ width, height, view, words, reading, screen, prefs, currentLine, onTap }: ReadingBarProps) {
  const kid = prefs.audience === 'explorador';
  const coachW = Math.min(Math.round(width * 0.36), 440);
  const showSentence = screen === 'reading' || screen === 'prep';
  const inner = height - 2 * PAD;
  const sentenceW = width - coachW - 3 * PAD - 8;
  const line = wordsOfLine(words, view.currentBlock, currentLine);

  return (
    <div className="absolute flex items-center gap-3.5 bg-(image:--grad-rail) px-3.5" style={{ left: 0, bottom: 0, width, height }} data-testid="reading-bar">
      <div className="flex items-center gap-3 overflow-hidden" style={{ width: showSentence ? coachW : width - 2 * PAD, height: inner }}>
        {kid ? (
          <>
            <img src={asset('assets/mascot.png')} alt="" className="flex-none animate-bob object-contain drop-shadow-[0_4px_6px_rgb(245_166_35/.35)]" style={{ height: Math.min(inner, 84), width: Math.min(inner, 84) }} draggable={false} />
            <div className="relative flex min-w-0 flex-1 items-center text-pretty rounded-[20px] bg-white px-4 font-bold leading-[1.25] text-ink shadow-[0_8px_20px_rgb(30_35_64/.12)]" style={{ minHeight: Math.min(inner, 76), fontSize: inner >= 90 ? 20 : 17 }}>
              <div className="absolute left-[-7px] top-1/2 size-4 -translate-y-1/2 rotate-45 rounded-[3px] bg-white" />
              <div className="relative py-1.5">{view.feedback}</div>
            </div>
          </>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_1px_0_#E3E8F4,0_4px_12px_rgb(30_35_64/.06)]" style={{ minHeight: Math.min(inner, 68) }}>
            <div className="size-3 flex-none rounded-full" style={{ background: micColor(view.micTone), boxShadow: `0 0 0 4px color-mix(in srgb, ${micColor(view.micTone)} 20%, transparent)` }} />
            <div className="flex-1 text-pretty py-1.5 text-base font-bold leading-[1.3] text-ink">{view.feedback}</div>
          </div>
        )}
      </div>
      {showSentence && (
        <FitBox
          width={sentenceW}
          height={inner}
          minFont={MIN_FONT_SCREEN_PX + 6}
          maxFont={DEFAULT_MAX_FONT_PX * 0.8}
          fitKey={`${view.currentBlock}:${currentLine}:${line.map((w) => w.id).join()}`}
          className="font-read text-ink"
        >
          <div data-testid="bar-sentence" className="flex flex-wrap gap-x-[.26em]" style={{ lineHeight: 1.2 }}>
            {line.map((w) => (
              <WordSpan key={w.id} word={w} reading={reading} screen={screen} prefs={prefs} onTap={onTap} />
            ))}
          </div>
        </FitBox>
      )}
    </div>
  );
}

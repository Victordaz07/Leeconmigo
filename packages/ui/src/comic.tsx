/**
 * El cómic: la ilustración con los globos de texto encima (dos capas separadas: arte y texto — docs/05),
 * y las palabras que el motor de lectura va marcando.
 */
import type { CSSProperties } from 'react';
import type { ReadingSessionState, StoryPage } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { cn } from './lib.ts';
import type { ReaderPrefs } from './types.ts';
import { wordVisual } from './view-model.ts';

/** Ruta pública de un asset de la app (sin barra inicial en los datos de la historia). */
export const asset = (path: string): string => `${import.meta.env?.BASE_URL ?? '/'}${path}`;

interface WordProps {
  word: StoryWord;
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  /** Tocar cualquier palabra abre la ayuda (docs/04). Sin esto la palabra no es interactiva (ficha de historia). */
  onTap?: (index: number) => void;
  /**
   * Índices de palabras con entrada en el diccionario de la historia (pedido de Noah): se marcan con un
   * subrayado punteado suave para que el niño sepa, ANTES de tocar, que esa palabra tiene significado,
   * sinónimo y ejemplo esperándolo — nunca tan fuerte como para distraer de la lectura.
   */
  vocabWords?: Set<number>;
}

export function WordSpan({ word, reading, screen, prefs, onTap, vocabWords }: WordProps) {
  const v = wordVisual(word.index, reading, screen, prefs);
  const hasVocab = vocabWords?.has(word.index);
  return (
    <span
      className={cn('inline-block -mx-[.12em] rounded-[.25em] px-[.12em] text-ink transition-[background,box-shadow] duration-[250ms]', onTap && 'cursor-pointer', v.className)}
      style={hasVocab ? { ...v.style, textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: 'var(--color-brand-light)', textUnderlineOffset: '3px', textDecorationThickness: '2px' } : v.style}
      onClick={onTap ? () => onTap(word.index) : undefined}
    >
      {word.text}
    </span>
  );
}

/** Las palabras de una línea de un bloque, en su orden. */
export function wordsOfLine(words: StoryWord[], blockIndex: number, lineIndex: number): StoryWord[] {
  return words.filter((w) => w.blockIndex === blockIndex && w.lineIndex === lineIndex);
}

interface ComicProps extends Omit<WordProps, 'word'> {
  page: StoryPage;
  words: StoryWord[];
  /** Bloque que la cámara enfoca (su globo se resalta con un aro azul). */
  currentBlock: number;
  /** `progresivo`: los globos aún no leídos están ocultos. */
  prefs: ReaderPrefs;
  /** El globo activo solo se resalta durante la lectura. */
  highlightActive: boolean;
  /** Estamos dentro de la sesión (preparación, lectura, fin de página...). */
  inSession: boolean;
}

/** Ilustración + globos. Ocupa todo su contenedor (el contenedor decide el tamaño y la posición de la cámara). */
export function ComicLayer({ page, words, reading, screen, prefs, currentBlock, highlightActive, inSession, onTap, vocabWords }: ComicProps) {
  const reveal = prefs.bubbles === 'progresivo';
  return (
    <>
      <img src={asset(page.illustration.src)} alt={page.illustration.alt ?? ''} className="absolute inset-0 block h-full w-full" draggable={false} />
      {page.blocks.map((block, bi) => {
        if (!block.layout) return null;
        const { leftPct, topPct, widthPct } = block.layout.bubble;
        const active = highlightActive && bi === currentBlock;
        const hidden = reveal && inSession && screen !== 'pageDone' && bi > currentBlock;
        const style: CSSProperties = {
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${widthPct}%`,
          minHeight: bi === 0 ? '8.6%' : '6%',
          boxShadow: active ? '0 0 0 4px var(--color-brand),0 10px 26px rgba(0,0,0,.3)' : '0 3px 10px rgba(0,0,0,.2)',
          opacity: hidden ? 0 : active || !inSession || screen !== 'reading' || !reading.hasHeardVoice ? 1 : 0.92,
          zIndex: active ? 2 : 1,
        };
        return (
          <div
            key={block.id}
            data-block={block.id}
            className="absolute box-border flex flex-col gap-0.5 rounded-[14px] bg-bubble px-3.5 pb-[11px] pt-2.5 font-read text-[15px] leading-[1.42] text-ink transition-[box-shadow,opacity] duration-300"
            style={style}
          >
            {block.lines.map((_, li) => (
              <div key={li} className="flex flex-wrap gap-x-[.26em]">
                {wordsOfLine(words, bi, li).map((w) => (
                  <WordSpan key={w.id} word={w} reading={reading} screen={screen} prefs={prefs} onTap={onTap} vocabWords={vocabWords} />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Geometría de la "cámara" (valores del prototipo)
// ---------------------------------------------------------------------------

/** Ancho del cómic (px de diseño): la ilustración de 1536×1024 se muestra a 1494×996. */
export const COMIC_WIDTH = 1494;
/** Ancho visible del cómic con el panel lateral abierto / colapsado. */
export const COMIC_VIEW_OPEN = 1205;
export const COMIC_VIEW_COLLAPSED = 1412;

/** Desplazamiento horizontal de la cámara para centrar el cuadro actual. */
export function cameraOffset(page: StoryPage, currentBlock: number, collapsed: boolean, freeze: boolean): number {
  if (freeze) return 0;
  const panel = page.blocks[currentBlock]?.layout?.panel;
  if (!panel) return 0;
  const view = collapsed ? COMIC_VIEW_COLLAPSED : COMIC_VIEW_OPEN;
  const cx = (((panel.x0 + panel.x1) / 2) / page.illustration.width) * COMIC_WIDTH;
  return Math.max(0, Math.min(COMIC_WIDTH - view, cx - view / 2));
}

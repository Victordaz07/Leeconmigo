/**
 * Páginas de cómic con GLOBOS DIBUJADOS en la ilustración: se ve la ilustración completa y el texto va DIRECTO en el globo
 * (sin caja encima), con la letra lo más grande que quepa (o la fija que se haya elegido en el modo editor). El cuadro que se
 * está leyendo se resalta con un aro alrededor de su globo.
 */
import { Fragment, type CSSProperties } from 'react';
import type { BlockLayout, ReadingSessionState, StoryPage, StoryTextBlock } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { WordSpan, asset, wordsOfLine } from './comic.tsx';
import { FitBox, type FitBoxInfo } from './fit-text.tsx';
import type { ReaderPrefs } from './types.ts';

/** Tope de la letra (px de la ilustración original) cuando se ajusta sola: evita letras enormes con textos muy cortos. */
export const DEFAULT_MAX_FONT_PX = 56;
/** Letra mínima en pantalla (px de diseño): por debajo, el texto se vería demasiado pequeño para leer. */
export const MIN_FONT_SCREEN_PX = 12;

/** ¿Todos los cuadros de la página tienen globo dibujado y caja de texto? Entonces se lee con el reparto "ajustado". */
export function isBalloonPage(page: StoryPage): boolean {
  return page.blocks.length > 0 && page.blocks.every((b) => !!b.layout?.balloon && !!b.layout.text);
}

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const TEXT_ALIGN = { left: 'left', center: 'center', right: 'right' } as const;

export interface BalloonTextProps {
  block: StoryTextBlock;
  layout: BlockLayout;
  blockIndex: number;
  words: StoryWord[];
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  /** Píxeles de pantalla por píxel de la ilustración original. */
  scale: number;
  onTap?: (wordIndex: number) => void;
  onFit?: (info: FitBoxInfo) => void;
  style?: CSSProperties;
  /** Índices de palabras con entrada en el diccionario de la historia (ver `WordSpan` en comic.tsx). */
  vocabWords?: Set<number>;
}

/** El texto de un cuadro dentro de su caja (`layout.text`), ajustado al espacio. */
export function BalloonText({ block, layout, blockIndex, words, reading, screen, prefs, scale, onTap, onFit, style, vocabWords }: BalloonTextProps) {
  const t = layout.text!;
  const align = layout.align ?? 'left';
  const fitKey = `${block.id}:${layout.textMode ?? 'lines'}:${block.lines.join('|')}`;
  return (
    <FitBox
      width={t.width * scale}
      height={t.height * scale}
      minFont={MIN_FONT_SCREEN_PX}
      maxFont={(layout.maxFontPx ?? DEFAULT_MAX_FONT_PX) * scale}
      fixedFont={layout.fontPx !== undefined ? layout.fontPx * scale : undefined}
      valign={layout.valign ?? 'middle'}
      fitKey={fitKey}
      onFit={onFit}
      className="absolute font-read text-ink"
      style={{ left: t.x * scale, top: t.y * scale, textAlign: TEXT_ALIGN[align], ...style }}
    >
      {layout.textMode === 'flow' ? (
        <div data-block={block.id} className="flex flex-wrap gap-x-[.26em]" style={{ lineHeight: 1.22, justifyContent: JUSTIFY[align] }}>
          {words.filter((w) => w.blockIndex === blockIndex).map((w) => (
            <WordSpan key={w.id} word={w} reading={reading} screen={screen} prefs={prefs} onTap={onTap} vocabWords={vocabWords} />
          ))}
        </div>
      ) : (
        <div data-block={block.id} className="flex flex-col" style={{ gap: '.12em', lineHeight: 1.22 }}>
          {block.lines.map((_, li) => (
            <div key={li} className="flex flex-wrap gap-x-[.26em]" style={{ justifyContent: JUSTIFY[align] }}>
              {wordsOfLine(words, blockIndex, li).map((w) => (
                <WordSpan key={w.id} word={w} reading={reading} screen={screen} prefs={prefs} onTap={onTap} vocabWords={vocabWords} />
              ))}
            </div>
          ))}
        </div>
      )}
    </FitBox>
  );
}

export interface ComicFitProps {
  page: StoryPage;
  words: StoryWord[];
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  /** Cuadro que se está leyendo (su globo se resalta). */
  currentBlock: number;
  highlightActive: boolean;
  /** Estamos dentro de la sesión (preparación, lectura, fin de página...). */
  inSession: boolean;
  onTap?: (wordIndex: number) => void;
  /** Tamaño en pantalla de la ilustración completa. */
  width: number;
  height: number;
  /** Índices de palabras con entrada en el diccionario de la historia (ver `WordSpan` en comic.tsx). */
  vocabWords?: Set<number>;
}

/** La ilustración completa con el texto en sus globos. Ocupa `width × height`; quien la usa decide dónde colocarla. */
export function ComicFitLayer({ page, words, reading, screen, prefs, currentBlock, highlightActive, inSession, onTap, width, height, vocabWords }: ComicFitProps) {
  const scale = width / page.illustration.width;
  const reveal = prefs.bubbles === 'progresivo';
  return (
    <div className="relative" style={{ width, height }}>
      <img src={asset(page.illustration.src)} alt={page.illustration.alt ?? ''} className="absolute inset-0 block h-full w-full" draggable={false} />
      {page.blocks.map((block, bi) => {
        const layout = block.layout;
        if (!layout?.text || !layout.balloon) return null;
        const active = highlightActive && bi === currentBlock;
        const hidden = reveal && inSession && screen !== 'pageDone' && bi > currentBlock;
        const b = layout.balloon;
        return (
          <Fragment key={block.id}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute transition-[box-shadow,opacity] duration-300"
              style={{
                left: b.x * scale,
                top: b.y * scale,
                width: b.width * scale,
                height: b.height * scale,
                borderRadius: 30 * scale,
                boxShadow: active ? `0 0 0 ${Math.max(3, 5 * scale)}px var(--color-brand), 0 10px 26px rgba(0,0,0,.3)` : 'none',
              }}
            />
            <BalloonText
              block={block}
              layout={layout}
              blockIndex={bi}
              words={words}
              reading={reading}
              screen={screen}
              prefs={prefs}
              scale={scale}
              onTap={onTap}
              vocabWords={vocabWords}
              style={{ opacity: hidden ? 0 : 1, transition: 'opacity .3s' }}
            />
          </Fragment>
        );
      })}
    </div>
  );
}

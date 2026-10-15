/**
 * El texto grande del cuadro actual, en el panel lateral: es la superficie donde el niño lee.
 *
 * Nunca se recorta ni se achica la letra (docs/06: tamaño de letra cómodo). Si el cuadro entero cabe, se ve entero (así es
 * en el prototipo aprobado). Si NO cabe (p. ej. los cuadros largos del nivel 3), se muestra UNA FRASE cada vez —la de la
 * palabra actual— con una fila de puntos que dice en cuál va; al leer la última palabra de la frase, aparece la siguiente.
 * "Frase" = cada elemento de `lines` del cuadro (la historia las escribe como unidades de lectura).
 */
import { useLayoutEffect, useRef, useState } from 'react';
import type { ReadingSessionState } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { WordSpan, wordsOfLine } from '../comic.tsx';
import { copy } from '../copy.ts';
import { cn } from '../lib.ts';
import type { ReaderPrefs } from '../types.ts';

export interface BlockTextProps {
  words: StoryWord[];
  blockIndex: number;
  /** Cuántas frases (líneas) tiene el cuadro. */
  lineCount: number;
  /** Frase de la palabra que se está leyendo. */
  currentLine: number;
  fontSize: number;
  /** El texto se oculta (botón "Historia"). */
  hidden: boolean;
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  onTap: (wordIndex: number) => void;
  /** Índices de palabras con entrada en el diccionario de la historia (ver `WordSpan` en comic.tsx). */
  vocabWords?: Set<number>;
}

/**
 * Se debe MONTAR de nuevo cuando cambia el cuadro, la página o el tamaño de letra (usa `key`): así vuelve a medir el cuadro
 * completo y decide otra vez si cabe.
 */
export function BlockText(p: BlockTextProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [byLine, setByLine] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const o = outer.current;
      const i = inner.current;
      if (o && i && i.offsetHeight > o.clientHeight + 1) setByLine(true);
    };
    measure();
    // La tipografía puede terminar de cargar después y cambiar los saltos de línea.
    void (typeof document !== 'undefined' ? document.fonts?.ready.then(measure) : undefined);
  }, []);

  const shown = byLine ? [Math.min(p.currentLine, p.lineCount - 1)] : Array.from({ length: p.lineCount }, (_, li) => li);

  return (
    <div ref={outer} className={cn('flex min-h-0 flex-1 flex-col justify-center gap-1 px-1.5', byLine ? 'overflow-y-auto' : 'overflow-hidden')}>
      <div ref={inner} className="flex flex-col gap-1">
        {shown.map((li) => (
          <div
            key={li}
            className={cn('flex flex-wrap gap-x-[.26em] font-read leading-normal text-ink transition-opacity duration-300', byLine && 'animate-fade')}
            style={{ fontSize: p.fontSize, opacity: p.hidden ? 0 : 1 }}
          >
            {wordsOfLine(p.words, p.blockIndex, li).map((w) => (
              <WordSpan key={w.id} word={w} reading={p.reading} screen={p.screen} prefs={p.prefs} onTap={p.onTap} vocabWords={p.vocabWords} />
            ))}
          </div>
        ))}
        {byLine && p.lineCount > 1 && (
          <div role="img" aria-label={copy.reading.sentenceOf(shown[0] + 1, p.lineCount)} className="mt-2 flex justify-center gap-1.5">
            {Array.from({ length: p.lineCount }, (_, li) => (
              <span key={li} className={cn('h-2 rounded-full transition-all duration-300', li === shown[0] ? 'w-6 bg-brand' : li < shown[0] ? 'w-2 bg-ok-mid' : 'w-2 bg-track-2')} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

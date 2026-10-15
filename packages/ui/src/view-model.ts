/**
 * Marca visual de cada palabra para la app WEB. Qué se marca lo decide `wordMark` (@lee-conmigo/ui-core, compartido con la
 * app nativa); aquí solo se traduce a estilos CSS con los tokens de `tokens.css`.
 */
import type { CSSProperties } from 'react';
import type { ReadingSessionState } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import { wordMark, type ReaderPrefs, type WordMark } from '@lee-conmigo/ui-core';

export { cleanWord, currentLineOf, deriveReadingView, FAST_WPM, readingMinutes, readingMinutesOfWordCount, SLOW_WPM, wordMark } from '@lee-conmigo/ui-core';
export type { MicTone, ReadingView, ReadingViewInput, WordMark } from '@lee-conmigo/ui-core';

export interface WordVisual {
  className?: string;
  style: CSSProperties;
}

const FILL: Record<NonNullable<WordMark['fill']>, string> = {
  focus: 'var(--color-focus)',
  warnTint: 'var(--color-warn-tint)',
  okTint: 'var(--color-ok-tint)',
  echo: 'var(--color-echo)',
};

const UNDERLINE: Record<NonNullable<WordMark['underline']>, string> = {
  brand: 'inset 0 -.14em 0 var(--color-brand)',
  warn: 'inset 0 -.1em 0 var(--color-warn)',
  echoLine: 'inset 0 -.1em 0 var(--color-echo-line)',
};

export function wordVisual(i: number, s: ReadingSessionState, screen: Screen, prefs: ReaderPrefs): WordVisual {
  const m = wordMark(i, s, screen, prefs);
  const style: CSSProperties = {};
  if (m.dotted) {
    style.backgroundImage = 'linear-gradient(to right,#B9C0D6 50%,transparent 50%)';
    style.backgroundSize = '8px 2px';
    style.backgroundRepeat = 'repeat-x';
    style.backgroundPosition = '0 100%';
  }
  if (m.fill) style.background = FILL[m.fill];
  if (m.echoText) style.color = 'var(--color-brand-strong)';
  if (m.underline) style.boxShadow = UNDERLINE[m.underline];
  return { className: m.pulse ? 'animate-pulse-soft' : undefined, style };
}

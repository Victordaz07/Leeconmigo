/**
 * Modelo de vista de la lectura: decide QUÉ se ve (color del micrófono, mensaje del coach, si hay velo o
 * nube de pausa, cómo se marca cada palabra) a partir del estado del motor. Es lógica pura, sin React:
 * se prueba aparte y los componentes solo la pintan.
 *
 * Es la lógica de `renderVals()` / `wordStyle()` del prototipo aprobado, sin los estilos en línea. Vive aquí (sin React ni
 * plataforma) para que la app web y la nativa decidan EXACTAMENTE lo mismo; cada una solo lo pinta a su manera.
 */
import type { ReadingSessionState, Story } from '@lee-conmigo/contracts';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { copy } from './copy.ts';
import type { ReaderPrefs } from './types.ts';

/** Quita la puntuación de una palabra de pantalla ("puerta." → "puerta"), conservando mayúsculas y acentos. */
export const cleanWord = (text: string): string => text.replace(/[.,!?¡¿—]/g, '');

/** Ritmo de lectura en voz alta (palabras por minuto) de un lector que apenas empieza: del más pausado al más ágil. */
export const SLOW_WPM = 40;
export const FAST_WPM = 70;

/** Igual que `readingMinutes`, pero a partir de un conteo de palabras ya calculado (p. ej. `StoryCatalogEntry.wordCount`
 * en la ficha de la biblioteca): evita tener que cargar la historia completa solo para mostrar la duración. */
export function readingMinutesOfWordCount(words: number): { min: number; max: number } {
  const min = Math.max(1, Math.round(words / FAST_WPM));
  return { min, max: Math.max(min, Math.round(words / SLOW_WPM)) };
}

/** Cuántos minutos tomaría leer la historia entera, como rango (estimación a partir del texto real; antes era un «3–5» fijo). */
export function readingMinutes(story: Story): { min: number; max: number } {
  const words = story.pages.reduce((n, p) => n + p.blocks.reduce((m, b) => m + b.lines.join(' ').split(/\s+/).filter(Boolean).length, 0), 0);
  return readingMinutesOfWordCount(words);
}

export type MicTone = 'ok' | 'idle' | 'warn';

export interface ReadingView {
  /** Sesión iniciada pero sin voz todavía ("Listo para escuchar"). */
  waiting: boolean;
  /** Se está escuchando con normalidad (sin pausa ni ayuda). */
  listening: boolean;
  micTone: MicTone;
  micLabel: string;
  feedback: string;
  /** Velo oscuro sobre el cómic (preparación, ayuda, pausa larga, fin de página). */
  scrim: boolean;
  /** Nube "¿necesitas ayuda?" de la pausa larga. */
  pauseCloud: boolean;
  /** Índice del bloque (cuadro) que la "cámara" enfoca. */
  currentBlock: number;
  /** Palabra actual, sin puntuación (para «Ayúdame con …»). */
  currentWord: string;
}

export interface ReadingViewInput {
  screen: Screen;
  reading: ReadingSessionState;
  words: StoryWord[];
  prefs: ReaderPrefs;
  /** "Modo lectura libre": nadie está hablándole al micrófono, así que una pausa larga no significa nada — nunca debe
   * oscurecer la pantalla ni pedir "¿necesitas ayuda?" como si el niño se hubiera quedado callado. */
  freeReading?: boolean;
}

const SESSION_END_SCREENS: Screen[] = ['pageDone', 'question', 'review'];

export function deriveReadingView({ screen, reading: s, words, prefs, freeReading }: ReadingViewInput): ReadingView {
  const F = copy.feedback[prefs.audience];
  const inReading = screen === 'reading';
  const waiting = inReading && !s.hasHeardVoice;
  const voiced = inReading && s.hasHeardVoice;
  const idx = Math.min(s.currentWordIndex, Math.max(words.length - 1, 0));
  const currentWord = cleanWord(words[idx]?.text ?? '');
  const echoActive = s.readStart !== null && !s.readStart.done;

  const micTone: MicTone = s.pause === 'long' ? 'warn' : s.helpWordIndex !== null || s.pause === 'short' ? 'idle' : 'ok';
  const listening = voiced && !s.pause && s.helpWordIndex === null;

  let micLabel: string = copy.mic.listening;
  if (echoActive) micLabel = copy.mic.echo;
  else if (SESSION_END_SCREENS.includes(screen)) micLabel = copy.mic.done;
  else if (s.helpWordIndex !== null) micLabel = copy.mic.help;
  else if (s.pause === 'long') micLabel = copy.mic.longPause;
  else if (s.pause === 'short') micLabel = copy.mic.shortPause;
  else if (waiting) micLabel = copy.mic.waiting;

  let feedback = F.start;
  if (voiced) {
    feedback = F.listen;
    if (s.currentWordIndex > 3 && !s.issue && !s.pause) feedback = F.good;
    if (s.pause === 'short') feedback = F.short;
    if (s.pause === 'long') feedback = F.long;
    if (s.issue === 'uncertain') feedback = F.uncertain;
    if (s.issue === 'incorrect') feedback = F.incorrect(currentWord);
    if (s.issue === 'repeated') feedback = F.repeated;
    if (s.issue === 'skipped') feedback = F.skipped(cleanWord(words[s.issueWordIndex ?? -1]?.text ?? ''));
    if (s.recovered) feedback = F.praise;
    if (s.helpWordIndex !== null) feedback = F.help;
    if (s.readStart) feedback = s.readStart.done ? F.echoDone(currentWord) : F.echo;
  }
  if (screen === 'pageDone' || screen === 'question') feedback = F.done;
  if (screen === 'review') feedback = F.review;

  const currentBlock =
    screen === 'prep' || screen === 'select' || screen === 'end' || waiting ? 0 : (words[idx]?.blockIndex ?? 0);

  return {
    waiting,
    listening,
    micTone,
    micLabel,
    feedback,
    // "pageDone" YA NO oscurece: es un aviso breve que se va solo, no una tarjeta que tapa la ilustración.
    scrim: screen === 'prep' || s.helpWordIndex !== null || (!freeReading && s.pause === 'long'),
    pauseCloud: !freeReading && inReading && s.pause === 'long' && s.helpWordIndex === null,
    currentBlock,
    currentWord,
  };
}

// ---------------------------------------------------------------------------
// Cómo se marca cada palabra
// ---------------------------------------------------------------------------

/**
 * Marca de una palabra, en términos de diseño (no de CSS): la app web la convierte en estilos (`wordVisual` de
 * @lee-conmigo/ui) y la nativa en estilos de React Native. Solo tienen marca: la palabra ACTUAL (resaltador o
 * subrayado), una duda o error suave sobre ella (ámbar, nunca rojo), la palabra REPETIDA (verde un instante), la
 * SALTADA (línea punteada), la que tiene la AYUDA abierta y las del "léeme el comienzo". Las ya leídas no cambian:
 * no es un examen.
 */
export interface WordMark {
  /** Línea punteada debajo: palabra saltada. */
  dotted: boolean;
  /** Fondo: `focus` = amarillo (actual con resaltador / ayuda), `warnTint` = duda, `okTint` = repetida, `echo` = "yo leo". */
  fill?: 'focus' | 'warnTint' | 'okTint' | 'echo';
  /** Línea inferior: `brand` (gruesa, actual con subrayado), `warn` (duda), `echoLine` ("yo leo"). */
  underline?: 'brand' | 'warn' | 'echoLine';
  /** Texto en azul (palabras que lee la app en el "léeme el comienzo"). */
  echoText: boolean;
  /** Pulso suave (pausa larga sobre la palabra actual). */
  pulse: boolean;
}

export function wordMark(i: number, s: ReadingSessionState, screen: Screen, prefs: ReaderPrefs): WordMark {
  const mark: WordMark = { dotted: s.wordMarks[i] === 'skipped', echoText: false, pulse: false };
  const cur = screen === 'reading' && s.hasHeardVoice && i === s.currentWordIndex;

  if (s.repeatedWordIndex === i) mark.fill = 'okTint';
  if (cur) {
    if (prefs.highlight === 'resaltador') mark.fill = 'focus';
    else mark.underline = 'brand';
    if (s.issue === 'uncertain' || s.issue === 'incorrect') {
      mark.fill = 'warnTint';
      mark.underline = 'warn';
    }
    if (s.pause === 'long') mark.pulse = true;
  }
  if (s.helpWordIndex === i) mark.fill = 'focus';
  const rs = s.readStart;
  if (rs && i >= rs.fromWordIndex && i < rs.fromWordIndex + 3 && i <= rs.fromWordIndex + rs.step && s.wordMarks[i] !== 'read') {
    mark.fill = 'echo';
    mark.underline = 'echoLine';
    mark.echoText = true;
    mark.pulse = false;
  }
  return mark;
}

/**
 * Frase (línea del cuadro) de la palabra que se está leyendo. Solo cuenta si esa palabra está en el cuadro `currentBlock`; si no
 * (p. ej. esperando la voz, con el cuadro 0 fijado), la primera.
 */
export function currentLineOf(words: StoryWord[], reading: ReadingSessionState, currentBlock: number): number {
  const w = words[Math.min(reading.currentWordIndex, Math.max(words.length - 1, 0))];
  return w && w.blockIndex === currentBlock ? w.lineIndex : 0;
}

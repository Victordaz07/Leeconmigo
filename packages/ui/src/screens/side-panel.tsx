import type { StoryPage } from '@lee-conmigo/contracts';
import type { ReadingSessionState } from '@lee-conmigo/contracts';
import { formatDuration } from '@lee-conmigo/session-engine';
import type { Screen } from '@lee-conmigo/session-engine';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { ChevronLeft, ChevronRight, Clock, PanelToggle, ReadFrom, Speaker } from '../icons.tsx';
import { cn } from '../lib.ts';
import { MicArcs, MicBadge, micColor, micLabelColor } from '../mic.tsx';
import { BlockText } from './block-text.tsx';
import { FreeNavButtons } from './reading-bar.tsx';
import type { ReaderPrefs } from '../types.ts';
import type { ReadingView } from '../view-model.ts';

/**
 * Tiempo LEÍDO hasta ahora, discreto (docs/06: no debe dominar la pantalla). Sin una meta del padre que definir
 * todavía (docs/09 #3), es una cuenta hacia ARRIBA de lo que ya se leyó, nunca una cuenta atrás de lo que falta.
 */
function ElapsedTime({ seconds, compact }: { seconds: number; compact?: boolean }) {
  return (
    <div
      className={cn('flex items-center gap-1.5 rounded-full bg-white font-extrabold text-muted shadow-round-sm', compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-[13px]')}
      title={copy.reading.elapsed(formatDuration(seconds))}
    >
      <Clock color="var(--color-muted)" size={compact ? 13 : 15} strokeWidth={2.6} />
      {formatDuration(seconds)}
    </div>
  );
}

export interface SidePanelProps {
  title: string;
  page: StoryPage;
  words: StoryWord[];
  reading: ReadingSessionState;
  screen: Screen;
  prefs: ReaderPrefs;
  view: ReadingView;
  /** Tiempo LEÍDO de toda la sesión, en segundos. */
  elapsedSeconds: number;
  /** El texto del cuadro actual se oculta (botón "Historia"). */
  storyHidden: boolean;
  /** Página actual de la historia; solo se muestra si tiene más de una. */
  pageInfo?: { number: number; total: number };
  /** false en páginas de solo texto: ahí el panel ES la lectura y no puede ocultarse. */
  canCollapse?: boolean;
  onBack: () => void;
  onTogglePanel: () => void;
  onToggleStory: () => void;
  onWordTap: (i: number) => void;
  onAskHelp: () => void;
  onListen: () => void;
  onReadStart: () => void;
  /** Índices de palabras con entrada en el diccionario de la historia (ver `WordSpan` en comic.tsx). */
  vocabWords?: Set<number>;
  /** "Modo lectura libre" (Modo padres): en vez de la mascota y el mensaje, dos botones para cambiar de página a mano. */
  freeReading?: boolean;
  onFreeBack?: () => void;
  onFreeAdvance?: () => void;
}

/** Segmentos de progreso por cuadro: verde = leído, azul/mitad = actual. */
function useSegments(page: StoryPage, currentBlock: number, screen: Screen) {
  return page.blocks.map((_, k) => {
    const done = screen === 'pageDone' || screen === 'question' || k < currentBlock;
    return { done, cur: k === currentBlock && !done };
  });
}

/** Panel lateral abierto: texto del cuadro, micrófono, mensaje del coach y ayudas (docs/04, pantalla "Reading"). */
export function SidePanel(p: SidePanelProps) {
  const t = copy.reading;
  const teen = p.prefs.audience === 'lector';
  const { view } = p;
  const block = p.page.blocks[view.currentBlock];
  const segs = useSegments(p.page, view.currentBlock, p.screen);
  // Página de solo texto (sin recorte por cuadro): la vista previa muestra la ilustración completa.
  const panel = block?.layout?.panel ?? { x0: 0, y0: 0, x1: p.page.illustration.width, y1: p.page.illustration.height };
  const size = p.prefs.textSize;

  // Vista previa del cuadro actual (recorte de la ilustración de 260×136).
  const pw = panel.x1 - panel.x0;
  const ph = panel.y1 - panel.y0;
  const sc = Math.max(260 / pw, 136 / ph);
  const thumb: React.CSSProperties = {
    width: p.page.illustration.width * sc,
    height: p.page.illustration.height * sc,
    left: -(panel.x0 * sc) + (260 - pw * sc) / 2,
    top: -(panel.y0 * sc) + (136 - ph * sc) / 2,
  };
  const glow = p.reading.issue === 'incorrect' && p.reading.helpWordIndex === null;
  // Frase (línea del cuadro) de la palabra actual; solo cuenta si esa palabra está en el cuadro que se muestra.
  const curWord = p.words[Math.min(p.reading.currentWordIndex, Math.max(p.words.length - 1, 0))];
  const currentLine = curWord && curWord.blockIndex === view.currentBlock ? curWord.lineIndex : 0;

  return (
    <aside className="relative z-[7] flex w-[300px] flex-none flex-col gap-4 bg-(image:--grad-panel) px-5 pb-5 pt-[22px] shadow-rail">
      <div className="flex items-start gap-2">
        <button type="button" onClick={p.onBack} aria-label="Volver" className="flex size-11 flex-none items-center justify-center rounded-full bg-transparent text-navy">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 pt-1 text-2xl font-black leading-[1.12] text-navy">
          {p.title}
          {p.pageInfo && p.pageInfo.total > 1 && <div className="mt-1 text-sm font-bold leading-normal text-muted">{t.pageOf(p.pageInfo.number, p.pageInfo.total)}</div>}
        </div>
        {(p.canCollapse ?? true) && (
          <button type="button" onClick={p.onTogglePanel} title={t.hideStory} aria-label={t.hideStory} className="flex size-10 flex-none items-center justify-center rounded-full bg-white text-navy shadow-round-sm">
            <PanelToggle mode="hide" size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex flex-1 items-center gap-[3px] rounded-full bg-track-2 p-[3px] shadow-inset-track">
          {segs.map((g, k) => (
            <div
              key={k}
              className="h-2.5 rounded-full transition-all duration-[350ms]"
              style={{
                flex: g.cur ? 2.4 : 1,
                background: g.done ? 'var(--grad-green)' : g.cur ? 'linear-gradient(180deg,#6BE39E 0%,#22A95C 50%,#E2E7F2 50%)' : '#fff',
                boxShadow: g.done || g.cur ? 'inset 0 1px 0 rgba(255,255,255,.5)' : 'none',
                opacity: g.done || g.cur ? 1 : 0.7,
              }}
            />
          ))}
        </div>
        <div className="whitespace-nowrap text-[15px] font-extrabold text-muted">{t.frameLong(view.currentBlock + 1, p.page.blocks.length)}</div>
      </div>
      <div className="-mt-2 flex justify-end">
        <ElapsedTime seconds={p.elapsedSeconds} />
      </div>

      <div className="relative box-border h-[140px] w-full flex-none overflow-hidden rounded-[20px] border-4 border-white shadow-thumb">
        <img src={asset(p.page.illustration.src)} alt="" className="absolute block max-w-none transition-all duration-[600ms] ease-in-out" style={thumb} draggable={false} />
        <div className="absolute inset-0 bg-(image:--grad-thumb-shade)" />
        <div className="absolute bottom-2 left-2.5 text-sm font-black text-white [text-shadow:0_1px_4px_rgb(0_0_0/.4)]">{block?.title}</div>
      </div>

      <BlockText
        key={`${p.page.id}:${view.currentBlock}:${size}`}
        words={p.words}
        blockIndex={view.currentBlock}
        lineCount={block?.lines.length ?? 0}
        currentLine={currentLine}
        fontSize={size}
        hidden={p.storyHidden}
        reading={p.reading}
        screen={p.screen}
        prefs={p.prefs}
        onTap={p.onWordTap}
        vocabWords={p.vocabWords}
      />

      {!p.freeReading && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2.5">
            <MicArcs tone={view.micTone} listening={view.listening} />
            <MicBadge tone={view.micTone} size={teen ? 76 : 100} pulsing={(view.listening && p.screen === 'reading') || view.waiting} rings={[8, 13]} iconSize={44} bigIcon />
            <MicArcs tone={view.micTone} listening={view.listening} mirrored />
          </div>
          <div className="min-h-4 text-[13px] font-black uppercase tracking-[.06em]" style={{ color: micLabelColor(view.micTone) }}>
            {view.micLabel}
          </div>
        </div>
      )}

      {!teen ? (
        <>
          <div className="flex min-h-[76px] items-center gap-1">
            {p.freeReading ? (
              <FreeNavButtons height={76} onBack={p.onFreeBack} onAdvance={p.onFreeAdvance} />
            ) : (
              <>
                <img src={asset('assets/mascot.png')} alt="" className="size-[78px] flex-none animate-bob object-contain drop-shadow-[0_4px_6px_rgb(245_166_35/.35)]" draggable={false} />
                <div className="relative flex-1 text-pretty rounded-[20px] bg-white px-4 py-3 text-lg font-bold leading-[1.3] text-ink shadow-[0_8px_20px_rgb(30_35_64/.12)]">
                  <div className="absolute left-[-7px] top-1/2 size-4 -translate-y-1/2 rotate-45 rounded-[3px] bg-white" />
                  <div className="relative">{view.feedback}</div>
                </div>
              </>
            )}
          </div>
          <div className={cn('grid gap-2.5', p.freeReading ? 'grid-cols-1' : 'grid-cols-3')}>
            <ActionButton onClick={p.onToggleStory} tone="lilac" label={t.story}>
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 6.5C10 5 7 4.4 3 5v13.2c4-.5 7 0 9 1.5z" fill="#6A52D9" opacity=".35" />
                <path d="M12 6.5c2-1.5 5-2.1 9-1.5v13.2c-4-.5-7 0-9 1.5z" fill="#6A52D9" opacity=".55" />
                <path d="M12 6.5C10 5 7 4.4 3 5v13.2c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.6-7 0-9 1.5zM12 6.5v13.2" fill="none" stroke="#6A52D9" strokeWidth="1.9" strokeLinejoin="round" />
              </svg>
            </ActionButton>
            {!p.freeReading && (
              <>
                <ActionButton onClick={p.onAskHelp} tone="blue" label={t.help}>
                  <span className="flex size-[34px] items-center justify-center rounded-full bg-(image:--grad-brand-dot) text-[21px] font-black text-white shadow-[inset_0_2px_0_rgb(255_255_255/.35),0_3px_6px_rgb(23_96_224/.35)]">?</span>
                </ActionButton>
                <ActionButton onClick={p.onListen} tone="peach" label={t.listen} glow={glow}>
                  <Speaker color="#E8662B" size={34} />
                </ActionButton>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {p.freeReading ? (
            <FreeNavButtons height={52} onBack={p.onFreeBack} onAdvance={p.onFreeAdvance} />
          ) : (
            <>
              <div className="flex min-h-20 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_0_#E3E8F4,0_4px_12px_rgb(30_35_64/.06)]">
                <div className="size-3 flex-none rounded-full" style={{ background: micColor(view.micTone), boxShadow: `0 0 0 4px color-mix(in srgb, ${micColor(view.micTone)} 20%, transparent)` }} />
                <div className="flex-1 text-pretty text-base font-bold leading-[1.3] text-ink">{view.feedback}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={p.onAskHelp} className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#EEF4FF] text-[15px] font-extrabold text-brand-strong">
                    <span className="flex size-[22px] items-center justify-center rounded-full bg-brand text-[13px] font-black text-white">?</span>
                    {t.hint}
                  </button>
                  <button type="button" onClick={p.onListen} className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#FFF2EA] text-[15px] font-extrabold text-orange-deep">
                    <Speaker color="#E8662B" arcs={1} size={20} />
                    {t.listen}
                  </button>
                </div>
                <button type="button" onClick={p.onReadStart} className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-violet-100 text-[15px] font-extrabold text-violet-deep">
                  <ReadFrom size={20} />
                  {t.readStart}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}

const ACTION_TONE = {
  lilac: 'bg-(image:--grad-lilac) text-violet-deep shadow-btn-action-lilac',
  blue: 'bg-(image:--grad-sky-action) text-brand shadow-btn-action-blue',
  peach: 'bg-(image:--grad-peach) text-orange shadow-btn-action-peach',
} as const;

function ActionButton({ onClick, tone, label, glow, children }: { onClick: () => void; tone: keyof typeof ACTION_TONE; label: string; glow?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('relative flex h-[84px] flex-col items-center justify-center gap-[5px] rounded-[20px] text-sm font-extrabold transition-transform duration-150 active:translate-y-0.5 active:scale-[.97]', ACTION_TONE[tone], glow && 'animate-glow')}
    >
      {children}
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------

export interface SideRailProps {
  page: StoryPage;
  screen: Screen;
  reading: ReadingSessionState;
  prefs: ReaderPrefs;
  view: ReadingView;
  /** Tiempo LEÍDO de toda la sesión, en segundos. */
  elapsedSeconds: number;
  onBack: () => void;
  onTogglePanel: () => void;
  onAskHelp: () => void;
  onListen: () => void;
  /** Ancho del riel (px de diseño). Por defecto el del riel colapsado (96). */
  width?: number;
  /** El botón para mostrar el panel del texto. Con globos dibujados no hay panel que mostrar. */
  showToggle?: boolean;
  /** La mascota del riel. Con la barra inferior, el mensaje y la mascota viven ahí. */
  showMascot?: boolean;
  /** Página actual de la historia; se muestra bajo el contador de cuadros si tiene más de una. */
  pageInfo?: { number: number; total: number };
  /**
   * "Modo lectura libre" (Modo padres): no hay voz real escuchando, así que se oculta el micrófono y los
   * botones de ayuda/escuchar (no tiene sentido preguntar "¿necesitas ayuda?" si nadie está leyendo en voz
   * alta para que la app lo note) y, en su lugar, aparecen los dos botones para cambiar de página a mano.
   */
  freeReading?: boolean;
  onFreeBack?: () => void;
  onFreeAdvance?: () => void;
}

/** "Modo lectura libre" en el riel estrecho: mismo sitio que el micrófono y los botones de ayuda/escuchar. */
function FreeNavRail({ onBack, onAdvance }: { onBack?: () => void; onAdvance?: () => void }) {
  return (
    <>
      <button type="button" onClick={onBack} aria-label="Página anterior" className="flex size-16 items-center justify-center rounded-[18px] bg-white text-ink-soft shadow-soft active:scale-[.97]">
        <ChevronLeft size={28} strokeWidth={3} />
      </button>
      <button type="button" onClick={onAdvance} aria-label="Página siguiente" className="flex size-16 items-center justify-center rounded-[18px] bg-(image:--grad-brand) text-white shadow-btn-action-blue active:scale-[.97]">
        <ChevronRight size={28} strokeWidth={3} />
      </button>
    </>
  );
}

/** Riel estrecho cuando el panel está colapsado (o barra lateral de las páginas con globos dibujados): progreso, micrófono, ayuda. */
export function SideRail({ page, screen, prefs, view, elapsedSeconds, onBack, onTogglePanel, onAskHelp, onListen, width, showToggle = true, showMascot = true, pageInfo, freeReading, onFreeBack, onFreeAdvance }: SideRailProps) {
  const segs = useSegments(page, view.currentBlock, screen);
  const kid = prefs.audience === 'explorador';
  return (
    <aside className="relative z-[7] box-border flex w-24 flex-none flex-col items-center gap-4 bg-(image:--grad-rail) pb-5 pt-[22px] shadow-rail" style={width ? { width } : undefined}>
      <button type="button" onClick={onBack} aria-label="Volver" className="flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-soft">
        <ChevronLeft size={20} strokeWidth={3} />
      </button>
      {showToggle && (
        <button type="button" onClick={onTogglePanel} title={copy.reading.showStory} aria-label={copy.reading.showStory} className="flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-soft">
          <PanelToggle mode="show" size={20} />
        </button>
      )}
      <div className="text-[15px] font-black text-navy">{copy.reading.frameShort(view.currentBlock + 1, page.blocks.length)}</div>
      {pageInfo && pageInfo.total > 1 && <div className="-mt-2 px-1 text-center text-xs font-bold leading-tight text-muted">{copy.reading.pageOf(pageInfo.number, pageInfo.total)}</div>}
      <ElapsedTime seconds={elapsedSeconds} compact />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
        {/* "Modo lectura libre": con un botón para avanzar a mano, el progreso por cuadros no aporta nada y, en páginas de
            un solo cuadro, queda como una barra suelta sin sentido — se oculta y el hueco solo sirve de espaciador. */}
        {!freeReading &&
          segs.map((g, k) => (
            <div key={k} className="w-2.5 rounded-full transition-all duration-[350ms]" style={{ height: g.cur ? 30 : 12, background: g.done ? 'var(--color-ok-mid)' : g.cur ? 'var(--color-brand)' : '#D5DAE6' }} />
          ))}
      </div>
      {freeReading ? (
        <FreeNavRail onBack={onFreeBack} onAdvance={onFreeAdvance} />
      ) : (
        <>
          <MicBadge tone={view.micTone} size={64} pulsing={(view.listening && screen === 'reading') || view.waiting} rings={[5, 8]} iconSize={30} />
          {kid && showMascot && <img src={asset('assets/mascot.png')} alt="" title={view.feedback} className="size-[52px] animate-bob object-contain" draggable={false} />}
          <button type="button" onClick={onAskHelp} aria-label={copy.reading.help} className="flex size-16 items-center justify-center rounded-[18px] bg-(image:--grad-sky-action) shadow-btn-action-blue">
            <span className="flex size-[30px] items-center justify-center rounded-full bg-brand text-lg font-black text-white">?</span>
          </button>
          <button type="button" onClick={onListen} aria-label={copy.reading.listen} className="flex size-16 items-center justify-center rounded-[18px] bg-(image:--grad-peach) shadow-btn-action-peach">
            <Speaker color="#E8662B" size={30} strokeWidth={2.2} />
          </button>
        </>
      )}
    </aside>
  );
}

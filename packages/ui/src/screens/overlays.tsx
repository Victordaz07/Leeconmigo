/** Tarjetas que aparecen sobre el cómic durante la sesión: preparación, ayuda, pausa larga y fin de página. */
import { useEffect, useRef, useState } from 'react';
import type { Audience, StoryPage, VocabularyEntry } from '@lee-conmigo/contracts';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { Check, Close, Speaker } from '../icons.tsx';

// ---------------------------------------------------------------------------
// Preparación
// ---------------------------------------------------------------------------

export function PrepCard({ audience, onBegin }: { audience: Audience; onBegin: () => void }) {
  const t = copy.prep;
  return (
    <div className="absolute inset-y-0 right-16 z-[4] my-auto flex h-fit w-[460px] animate-in flex-col gap-[22px]">
      <div className="flex flex-col gap-[22px] rounded-[30px] bg-cream px-[34px] pb-[30px] pt-[34px] shadow-float-lg">
        <div className="text-center text-[40px] font-black">{t.title[audience]}</div>
        {t.tips[audience].map((tip) => (
          <div key={tip.text} className="flex items-center gap-4">
            <div className="flex size-[52px] flex-none items-center justify-center rounded-2xl text-2xl font-black text-ink" style={{ background: tip.color }}>
              {tip.icon}
            </div>
            <div className="text-xl font-semibold leading-[1.3] text-ink-soft">{tip.text}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onBegin} className="h-[72px] rounded-full bg-brand text-2xl font-extrabold text-white shadow-[0_6px_0_#1452B0,0_14px_30px_rgb(0_0_0/.3)] active:translate-y-1 active:shadow-[0_2px_0_#1452B0]">
        {t.start}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ayuda con una palabra
// ---------------------------------------------------------------------------

interface HelpProps {
  /** Palabra sin puntuación tal como se muestra ("puerta"). */
  word: string;
  entry?: VocabularyEntry;
  audience: Audience;
  page: StoryPage;
  /** Cada vez que cambia (y no es 0) se reproduce la pronunciación sílaba por sílaba. */
  pronounceNonce: number;
  onPronounce: () => void;
  onPronouncingChange?: (pronouncing: boolean) => void;
  onClose: () => void;
}

/** Nivel 3-4 de ayuda (docs/03): pronunciación y sílabas. La animación es visual; el audio real llega con el TTS. */
export function HelpModal({ word, entry, audience, page, pronounceNonce, onPronounce, onPronouncingChange, onClose }: HelpProps) {
  const t = copy.help;
  const parts = entry?.syllables ?? [word];
  const [syl, setSyl] = useState(-1); // -1 nada · k = sílaba k resaltada · 99 = todas
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (pronounceNonce === 0) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const at = (fn: () => void, ms: number) => void timers.current.push(window.setTimeout(fn, ms));
    setSyl(-1);
    onPronouncingChange?.(true);
    parts.forEach((_, k) => at(() => setSyl(k), 200 + k * 560));
    at(() => setSyl(99), 200 + parts.length * 560);
    at(() => {
      setSyl(-1);
      onPronouncingChange?.(false);
    }, 1400 + parts.length * 560);
    return () => timers.current.forEach(clearTimeout);
    // La animación depende solo del "toque" de escuchar, no de las sílabas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronounceNonce]);

  // El sinónimo y el ejemplo de uso real (pedido de Noah) se muestran a cualquier edad: ayudan a fijar una palabra
  // nueva igual de bien a los 7 años que a los 11, y antes solo aparecían para "Lector" sin una razón de fondo.
  const def = (entry?.definition ?? t.defaultDef[audience]) + (entry?.synonym ? t.synonym(entry.synonym) : '') + (entry?.example ? t.example(entry.example) : '');
  const region = entry?.illustrationRegion;
  let imgStyle: React.CSSProperties = {};
  if (region) {
    const [x, y, w, h] = region;
    const k = Math.max(150 / w, 170 / h);
    imgStyle = { width: page.illustration.width * k, height: page.illustration.height * k, left: -x * k + (150 - w * k) / 2, top: -y * k + (170 - h * k) / 2 };
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[4] flex animate-in-fast flex-col items-center justify-center gap-6">
        <div className="pointer-events-auto flex items-center gap-[18px] rounded-full bg-cream py-3 pl-[30px] pr-3.5 shadow-float">
          <div className="flex gap-1 font-read text-[64px] font-bold leading-[1.1]">
            {parts.map((s, k) => (
              <span
                key={`${s}-${k}`}
                className="rounded-2xl px-2.5 text-ink transition-all duration-200"
                style={{ background: syl === k || syl === 99 ? 'var(--color-focus)' : 'transparent', transform: syl === k ? 'translateY(-6px)' : 'none' }}
              >
                {s}
              </span>
            ))}
          </div>
          <button type="button" onClick={onPronounce} aria-label={t.listenWord} className="flex size-[72px] items-center justify-center rounded-full bg-brand text-white">
            <Speaker color="#fff" size={36} strokeWidth={2.2} />
          </button>
        </div>
        <div className="pointer-events-auto flex w-[680px] items-center gap-6 rounded-[28px] bg-cream px-[30px] py-7 shadow-float">
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="font-read text-[40px] font-bold">{word}</div>
            <div className="text-pretty text-xl leading-[1.45] text-ink-mute">{def}</div>
            <div className="mt-2 flex gap-2.5">
              <button type="button" onClick={onPronounce} className="h-[52px] rounded-full bg-brand-100 px-[22px] text-lg font-extrabold text-brand">
                {t.listenAgain}
              </button>
              <button type="button" onClick={onClose} className="h-[52px] rounded-full bg-ok-mid px-6 text-lg font-extrabold text-white">
                {t.done}
              </button>
            </div>
          </div>
          {region && (
            <div className="relative box-content h-[170px] w-[150px] flex-none overflow-hidden rounded-[18px] border-4 border-white shadow-[0_8px_18px_rgb(30_35_64/.2)]">
              <img src={asset(page.illustration.src)} alt="" className="absolute max-w-none" style={imgStyle} draggable={false} />
              <div className="absolute bottom-2 left-2 rounded-full bg-[rgb(18_22_40/.72)] px-[9px] py-[3px] text-xs font-black text-white">{t.inDrawing}</div>
            </div>
          )}
        </div>
      </div>
      <button type="button" onClick={onClose} aria-label="Cerrar ayuda" className="absolute right-[26px] top-[26px] z-[5] flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_18px_rgb(0_0_0/.25)]">
        <Close size={22} />
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pausa larga
// ---------------------------------------------------------------------------

export function PauseCloud({ audience, currentWord, onReadStart, onAskHelp }: { audience: Audience; currentWord: string; onReadStart: () => void; onAskHelp: () => void }) {
  return (
    <div className="absolute bottom-12 right-12 z-[4] flex max-w-[606px] animate-in items-center gap-4 rounded-[40px] bg-white py-[18px] pl-[18px] pr-7 shadow-[0_18px_40px_rgb(0_0_0/.28)]">
      {audience === 'explorador' && <img src={asset('assets/mascot.png')} alt="" className="size-[76px] flex-none animate-bob object-contain" draggable={false} />}
      <div className="flex flex-col gap-3">
        <div className="text-[22px] font-extrabold leading-[1.3]">{copy.reading.pauseText[audience]}</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onReadStart} className="h-12 rounded-full bg-(image:--grad-lilac-btn) px-5 text-[17px] font-extrabold text-[#4A36B8] shadow-btn-lilac">
            {copy.reading.readStartButton}
          </button>
          <button type="button" onClick={onAskHelp} className="h-12 rounded-full bg-focus px-5 text-[17px] font-extrabold text-ink shadow-btn-focus">
            {copy.reading.helpWith(currentWord)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fin de página
// ---------------------------------------------------------------------------

/**
 * Aviso de "página terminada": una insignia que aparece un instante y se va sola (sin botón ni velo oscuro).
 * Antes había una tarjeta a pantalla completa con un botón "Siguiente página": obligaba a tocar para algo que
 * ya se sabe que toca (a la pregunta, o a la página siguiente). El cambio de verdad lo hace la ILUSTRACIÓN, que
 * entra con su propio efecto al cambiar de página (`session-scene.tsx`); esto es solo la confirmación breve.
 */
export function PageDoneFlourish({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const t = copy.pageDone;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-7 z-[4] flex justify-center">
      <div className="flex animate-pop items-center gap-2.5 rounded-full bg-white px-5 py-3 shadow-[0_14px_34px_rgb(0_0_0/.28)]">
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-(image:--grad-green) text-white">
          <Check size={18} strokeWidth={3.6} />
        </span>
        <span className="text-lg font-black text-ink">{t.title}</span>
        {totalPages > 1 && <span className="text-sm font-bold text-muted">{t.pagesOf(pageNumber, totalPages)}</span>}
      </div>
    </div>
  );
}

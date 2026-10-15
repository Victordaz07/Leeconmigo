import { isLastWord, isWordComplete, tilesOf, type ReviewState } from '@lee-conmigo/session-engine';
import type { Audience } from '@lee-conmigo/contracts';
import { copy } from '../copy.ts';
import { Check, Speaker } from '../icons.tsx';
import { cn } from '../lib.ts';

export interface ReviewProps {
  audience: Audience;
  review: ReviewState;
  /** Definición corta de la palabra actual. */
  definition?: string;
  onTap: (tile: number) => void;
  onNext: () => void;
  onListen: () => void;
}

/** Repaso rápido: armar cada palabra ordenando sus sílabas. Un error solo "sacude" la ficha (sin castigo). */
export function ReviewScreen({ audience, review: r, definition, onTap, onNext, onListen }: ReviewProps) {
  const t = copy.review;
  const teen = audience === 'lector';
  const word = r.words[r.index];
  const done = isWordComplete(r);
  const last = isLastWord(r);
  const tiles = tilesOf(word);

  return (
    <div className="absolute inset-0 z-[6] box-border flex animate-fade flex-col items-center gap-[34px] bg-app bg-(image:--grad-review-glow) px-16 pb-12 pt-[52px]">
      <div className="flex items-center gap-4 self-stretch">
        <div className="flex items-center gap-2 rounded-full bg-(image:--grad-violet) px-4 py-2 text-[15px] font-black uppercase tracking-[.06em] text-white shadow-[inset_0_1px_0_rgb(255_255_255/.35)]">{t.chip}</div>
        <div className="text-lg font-extrabold text-muted">{t.count(r.index + 1, r.words.length)}</div>
        <div className="flex-1" />
        <div className="flex gap-1.5">
          {r.words.map((w, k) => (
            <div
              key={w.key}
              className="h-3 rounded-full transition-all duration-300"
              style={{ width: k === r.index ? 30 : 12, background: k < r.index || (k === r.index && done) ? 'var(--color-ok)' : k === r.index ? 'var(--color-violet-mid)' : '#DDE3F0' }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[40px] font-black text-navy">{done ? word.key : teen ? t.titleTeen : t.titleKid}</div>
        <div className="max-w-[720px] text-pretty text-xl font-bold text-muted">{definition ?? t.defaultDef}</div>
      </div>

      <div className="flex min-h-[120px] items-center gap-3">
        {word.syllables.map((s, k) => {
          const on = k < r.built.length;
          return (
            <div
              key={`${s}-${k}`}
              className={cn(
                'box-border flex h-[110px] min-w-[120px] items-center justify-center rounded-[24px] px-[18px] font-read text-[56px] font-bold text-ink transition-all duration-[250ms]',
                on ? (done ? 'bg-ok-tint' : 'bg-white') : 'border-4 border-dashed border-slate-300 bg-white/60',
                on && 'shadow-[0_10px_22px_rgb(30_35_64/.14)]',
                on && k === r.built.length - 1 && 'animate-pop-fast',
              )}
            >
              {on ? s : ''}
            </div>
          );
        })}
        {done && (
          <div className="ml-2.5 flex size-[72px] animate-pop items-center justify-center rounded-full bg-(image:--grad-green-diag) text-white">
            <Check size={38} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 rounded-[30px] bg-white px-[26px] py-[22px] shadow-inset-well">
        {tiles.map((text, ti) => {
          const used = r.built.includes(ti);
          const bad = r.wrong === ti;
          return (
            <button
              key={`${text}-${ti}`}
              type="button"
              onClick={() => onTap(ti)}
              disabled={used}
              className={cn(
                'h-[88px] min-w-[110px] rounded-[22px] px-[22px] font-read text-[40px] font-bold transition-all duration-150',
                used ? 'bg-[#F1F3F8] text-slate-300' : bad ? 'bg-[#FFE3E3] text-ink shadow-[inset_0_-4px_0_#F5B5B5] -translate-x-1 -rotate-3' : 'bg-(image:--grad-lemon) text-ink shadow-[inset_0_2px_0_rgb(255_255_255/.7),inset_0_-5px_0_#F2CF4E,0_8px_16px_rgb(30_35_64/.12)]',
              )}
            >
              {text}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <div className="flex items-center justify-between gap-5 self-stretch">
        <button type="button" onClick={onListen} className="flex h-[60px] items-center gap-2.5 rounded-full bg-brand-100 px-[26px] text-[19px] font-extrabold text-brand">
          <Speaker color="#1E6FE8" size={26} />
          {t.listen}
        </button>
        <div className="text-xl font-extrabold text-ink-soft">{done ? (teen ? t.doneTeen : t.doneKid) : r.wrong !== null ? (teen ? t.wrongTeen : t.wrongKid) : ''}</div>
        <button
          type="button"
          onClick={onNext}
          disabled={!done}
          className={cn('h-16 rounded-full px-11 text-[22px] font-black text-white', done ? 'bg-(image:--grad-brand) shadow-[0_5px_0_#1249A8]' : 'bg-[#C7CEDD]')}
        >
          {last ? t.finish : t.next}
        </button>
      </div>
    </div>
  );
}

import type { Audience, StoryPage } from '@lee-conmigo/contracts';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { cn } from '../lib.ts';

export interface EndStat {
  label: string;
  value: string;
}

export interface EndProps {
  audience: Audience;
  page: StoryPage;
  /** 1–3 estrellas de celebración (solo Explorador). Nunca se muestra como calificación. */
  stars: 1 | 2 | 3;
  stats: EndStat[];
  practiced: string[];
  onAgain: () => void;
  onNext: () => void;
}

export function EndScreen({ audience, page, stars, stats, practiced, onAgain, onNext }: EndProps) {
  const t = copy.end;
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      <img src={asset(page.illustration.src)} alt="" className="absolute inset-0 h-full w-full scale-[1.04] object-cover blur-[6px] brightness-[.55]" draggable={false} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex w-[728px] animate-in-slow flex-col items-center gap-[26px] rounded-[40px] bg-white px-11 py-10 shadow-modal">
          <h1 className="text-center text-5xl font-black">{t.title}</h1>
          {audience === 'explorador' && (
            <div className="flex items-end gap-2">
              {[0, 1, 2].map((k) => (
                <img
                  key={k}
                  src={asset('assets/mascot.png')}
                  alt=""
                  className={cn('animate-pop object-contain', k < stars ? 'opacity-100' : 'opacity-25 grayscale')}
                  style={{ width: k === 1 ? 110 : 86, height: k === 1 ? 110 : 86, animationDelay: `${0.2 + k * 0.18}s` }}
                  draggable={false}
                />
              ))}
            </div>
          )}
          <div className="grid w-full grid-cols-3 gap-3.5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 rounded-[20px] bg-[#F1F3F9] p-4">
                <div className="text-base font-bold text-muted">{s.label}</div>
                <div className="text-[38px] font-black">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <div className="text-base font-bold text-muted">{t.practiced}</div>
            <div className="flex flex-wrap gap-2">
              {practiced.map((w) => (
                <span key={w} className="rounded-full bg-focus-tint px-4 py-1.5 font-read text-[22px] font-bold">
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3.5">
            <button type="button" onClick={onAgain} className="h-[66px] rounded-full bg-white text-[21px] font-extrabold text-ink shadow-btn-outline">
              {t.again}
            </button>
            <button type="button" onClick={onNext} className="h-[66px] rounded-full bg-brand text-[21px] font-extrabold text-white shadow-btn-brand">
              {t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

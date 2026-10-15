import type { ReactNode } from 'react';
import { copy } from '../copy.ts';
import { Book, ChevronLeft, Clock, Flame, Star, Target } from '../icons.tsx';
import { cn } from '../lib.ts';
import { NavRail } from './nav-rail.tsx';

export interface ProgressBadge {
  label: string;
  /** Carácter dentro de la insignia. */
  icon: string;
  tone: 'violet' | 'coral' | 'gold' | 'locked';
}

export interface ProgressData {
  childName: string;
  starsTotal: number;
  storiesRead: number;
  totalMinutes: number;
  /** Precisión media. TEMPORAL (docs/09 #4): el prototipo la muestra al niño; queda tras `showAccuracy`. */
  accuracy: number;
  streakDays: number;
  dailyGoalMinutes: number;
  /** Minutos por día de la semana, en orden Lun–Dom. */
  week: Array<{ day: string; minutes: number }>;
  practicedWords: string[];
  badges: ProgressBadge[];
}

export interface ProgressProps {
  data: ProgressData;
  tab: number;
  /** docs/09 #4: ¿se ve el % de precisión en las vistas del niño? Por defecto sí (comportamiento del prototipo). */
  showAccuracy: boolean;
  onTab: (tab: 0 | 1 | 2 | 3) => void;
  onBack: () => void;
  onGoHome: () => void;
  onGoLibrary: () => void;
  /** Abre el candado de "Modo padres" (docs/09 #1). */
  onGoSettings: () => void;
}

const BADGE_TONE = {
  violet: 'bg-(image:--grad-violet-diag)',
  coral: 'bg-(image:--grad-red-diag)',
  gold: 'bg-(image:--grad-gold-diag)',
  locked: 'bg-outline',
} as const;

const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('rounded-[24px] bg-white shadow-card', className)}>{children}</div>
);

function Stat({ tone, icon, label, value }: { tone: string; icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="flex flex-1 items-center gap-4 px-[22px] py-5">
      <div className={`flex size-[60px] items-center justify-center rounded-[18px] shadow-icon ${tone}`}>{icon}</div>
      <div className="flex flex-col">
        <div className="text-[15px] font-extrabold text-muted">{label}</div>
        <div className="text-[34px] font-black text-ink">{value}</div>
      </div>
    </Card>
  );
}

export function ProgressScreen({ data: d, tab, showAccuracy, onTab, onBack, onGoHome, onGoLibrary, onGoSettings }: ProgressProps) {
  const t = copy.progress;
  const maxMinutes = 14;
  return (
    <>
      <NavRail active="achievements" onHome={onGoHome} onLibrary={onGoLibrary} onAchievements={() => onTab(0)} onSettings={onGoSettings} />
      <main className="flex min-w-0 flex-1 flex-col gap-[26px] overflow-hidden bg-app bg-(image:--grad-progress-glow) px-11 pb-9 pt-[34px]">
        <header className="flex items-center gap-[18px]">
          <button type="button" onClick={onBack} aria-label="Volver" className="flex size-[52px] items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_10px_rgb(30_35_64/.12)]">
            <ChevronLeft size={22} />
          </button>
          <h1 className="flex-1 text-[38px] font-black text-navy">{t.title}</h1>
          <div className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-chip">
            <div className="flex size-[52px] items-center justify-center rounded-full bg-(image:--grad-sun-diag) text-[22px] font-black text-white">{d.childName.charAt(0)}</div>
            <div className="flex flex-col">
              <div className="text-[17px] font-black">{d.childName}</div>
              <div className="flex items-center gap-1 text-sm font-extrabold text-[#B36200]">
                <Star size={14} />
                {t.starsCount(d.starsTotal)}
              </div>
            </div>
          </div>
        </header>

        <div role="tablist" className="flex gap-2 self-start rounded-full bg-[#E8ECF6] p-1.5">
          {t.tabs.map((label, k) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => onTab(k as 0 | 1 | 2 | 3)}
              className={cn('rounded-full px-[22px] py-2.5 text-base font-black', tab === k ? 'bg-(image:--grad-brand) text-white shadow-[0_4px_10px_rgb(30_111_232/.3)]' : 'bg-transparent text-[#5A6282]')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          <Stat tone="bg-(image:--grad-violet-diag)" icon={<Book left="#fff" right="#E6DEFF" size={32} />} label={t.storiesRead} value={String(d.storiesRead)} />
          <Stat tone="bg-(image:--grad-blue-diag)" icon={<Clock size={32} />} label={t.totalTime} value={`${d.totalMinutes} min`} />
          {showAccuracy && <Stat tone="bg-(image:--grad-red-diag)" icon={<Target size={32} />} label={t.accuracy} value={`${d.accuracy}%`} />}
          <Stat tone="bg-(image:--grad-amber-diag)" icon={<Flame outer="#fff" inner="#FFE3A8" size={32} />} label={t.streak} value={copy.home.streakDays(d.streakDays)} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-5">
          <Card className="flex flex-col gap-4 px-[26px] py-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[22px] font-black">{t.weekTitle}</h2>
              <span className="text-[15px] font-extrabold text-muted">{t.weekGoal(d.dailyGoalMinutes)}</span>
            </div>
            <div className="relative grid min-h-0 flex-1 grid-cols-7 items-end gap-3.5 pt-2.5">
              {d.week.map((w) => (
                <div key={w.day} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="text-sm font-black text-ink-soft">{w.minutes ? `${w.minutes}′` : '–'}</div>
                  <div
                    className={cn('min-h-2 w-full max-w-14 rounded-[14px]', w.minutes >= d.dailyGoalMinutes ? 'bg-(image:--grad-green) shadow-icon' : w.minutes ? 'bg-(image:--grad-bar-low) shadow-icon' : 'bg-track')}
                    style={{ height: `${Math.max(8, (w.minutes / maxMinutes) * 100)}%` }}
                  />
                  <div className="text-sm font-extrabold text-muted">{w.day}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex min-h-0 flex-col gap-5">
            <Card className="flex flex-col gap-3.5 px-[26px] py-6">
              <h2 className="text-[22px] font-black">{t.practiced}</h2>
              <div className="flex flex-wrap gap-2">
                {d.practicedWords.map((w) => (
                  <span key={w} className="rounded-full bg-(image:--grad-lemon) px-4 py-1.5 font-read text-xl font-bold shadow-lemon">
                    {w}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="flex flex-1 flex-col gap-4 px-[26px] py-6">
              <h2 className="text-[22px] font-black">{t.badges}</h2>
              <div className="grid grid-cols-4 gap-2.5">
                {d.badges.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                    <div
                      className={cn(
                        'flex size-[72px] items-center justify-center rounded-full border-4 border-white text-[30px] font-black',
                        BADGE_TONE[b.tone],
                        b.tone === 'locked' ? 'text-slate-400' : 'text-white shadow-[inset_0_3px_0_rgb(255_255_255/.35),0_8px_16px_rgb(30_35_64/.18)]',
                      )}
                    >
                      {b.icon}
                    </div>
                    <div className={cn('text-[13px] font-extrabold leading-[1.2]', b.tone === 'locked' ? 'text-slate-400' : 'text-ink-soft')}>{b.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

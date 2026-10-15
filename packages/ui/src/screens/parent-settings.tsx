/**
 * "Modo padres" (docs/01, docs/09 #1/#3): detrás del PIN (`parent-gate.tsx`). Aquí el padre elige el idioma, el
 * nivel de lectura (libremente, sin desbloqueos — docs/01 DECISIÓN) y la meta diaria de lectura válida.
 */
import type { LanguageCode } from '@lee-conmigo/contracts';
import { copy } from '../copy.ts';
import { Check, ChevronLeft } from '../icons.tsx';
import { cn } from '../lib.ts';
import { READING_LEVELS } from '../levels-data.ts';
import { DAILY_GOAL_PRESETS } from '../types.ts';

export interface ParentSettingsProps {
  childName: string;
  language: LanguageCode;
  level: number;
  dailyGoalMinutes: number;
  freeReading: boolean;
  onSetChildName: (name: string) => void;
  onSetLanguage: (language: LanguageCode) => void;
  onSetLevel: (level: number) => void;
  onSetDailyGoal: (minutes: number) => void;
  onSetFreeReading: (enabled: boolean) => void;
  onChangePin: () => void;
  onBack: () => void;
}

const LEVEL_TONE = {
  green: 'bg-(image:--grad-green-diag)',
  blue: 'bg-(image:--grad-blue-diag)',
  violet: 'bg-(image:--grad-violet-diag)',
  amber: 'bg-(image:--grad-amber-diag)',
  coral: 'bg-(image:--grad-coral-diag)',
  gold: 'bg-(image:--grad-gold-diag)',
} as const;

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-[24px] bg-white px-7 py-6 shadow-card">
      <div>
        <h2 className="text-xl font-black text-ink">{title}</h2>
        <p className="text-[15px] font-bold text-muted">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export function ParentSettingsScreen({ childName, language, level, dailyGoalMinutes, freeReading, onSetChildName, onSetLanguage, onSetLevel, onSetDailyGoal, onSetFreeReading, onChangePin, onBack }: ParentSettingsProps) {
  const t = copy.parentSettings;
  const isPreset = (DAILY_GOAL_PRESETS as readonly number[]).includes(dailyGoalMinutes);

  return (
    <div className="absolute inset-0 z-10 flex animate-fade flex-col overflow-y-auto bg-app bg-(image:--grad-home-glow)">
      <header className="flex items-center gap-4 px-11 pb-2 pt-9">
        <button type="button" onClick={onBack} aria-label="Volver" className="flex size-[52px] flex-none items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_10px_rgb(30_35_64/.12)]">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[34px] font-black text-navy">{t.title}</h1>
      </header>

      <div className="flex flex-col gap-5 px-11 pb-12 pt-6">
        <Section title={t.childName} hint={t.childNameHint}>
          <input
            type="text"
            maxLength={24}
            value={childName}
            onChange={(e) => onSetChildName(e.target.value)}
            className="h-14 rounded-2xl bg-chip px-5 text-lg font-extrabold text-ink outline-none focus:ring-4 focus:ring-brand/40"
          />
        </Section>

        <Section title={t.language} hint={t.languageHint}>
          <div className="flex gap-3">
            {(['es', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onSetLanguage(lang)}
                className={cn(
                  'flex h-14 flex-1 items-center justify-center rounded-2xl text-lg font-black transition-colors',
                  language === lang ? 'bg-(image:--grad-brand) text-white shadow-[0_4px_10px_rgb(30_111_232/.3)]' : 'bg-chip text-ink-soft',
                )}
              >
                {lang === 'es' ? 'Español' : 'English'}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t.level} hint={t.levelHint}>
          <div className="grid grid-cols-3 gap-3">
            {READING_LEVELS.map((l) => {
              const active = l.n === level;
              return (
                <button
                  key={l.n}
                  type="button"
                  onClick={() => onSetLevel(l.n)}
                  className={cn(
                    'relative flex h-[72px] flex-col items-center justify-center gap-0.5 overflow-hidden rounded-2xl px-2 text-center text-white transition-transform active:scale-[.97]',
                    LEVEL_TONE[l.tone],
                    active ? 'ring-4 ring-brand ring-offset-2' : 'opacity-90',
                  )}
                >
                  <div className="text-base font-black">Nivel {l.n}</div>
                  <div className="text-[11px] font-bold leading-tight opacity-95">{l.name}</div>
                  {active && (
                    <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-white text-brand">
                      <Check size={12} strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title={t.dailyGoal} hint={t.dailyGoalHint}>
          <div className="flex flex-wrap gap-3">
            {DAILY_GOAL_PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onSetDailyGoal(m)}
                className={cn(
                  'h-12 min-w-16 rounded-full px-4 text-base font-extrabold transition-colors',
                  dailyGoalMinutes === m ? 'bg-(image:--grad-brand) text-white shadow-[0_4px_10px_rgb(30_111_232/.3)]' : 'bg-chip text-ink-soft',
                )}
              >
                {t.minutes(m)}
              </button>
            ))}
            <label className={cn('flex h-12 items-center gap-2 rounded-full px-4 text-base font-extrabold', !isPreset ? 'bg-(image:--grad-brand) text-white shadow-[0_4px_10px_rgb(30_111_232/.3)]' : 'bg-chip text-ink-soft')}>
              {t.customGoal}
              <input
                type="number"
                min={1}
                max={180}
                inputMode="numeric"
                value={isPreset ? '' : dailyGoalMinutes}
                placeholder="—"
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n > 0) onSetDailyGoal(n);
                }}
                className="w-12 border-0 bg-transparent text-center outline-none placeholder:text-current"
              />
            </label>
          </div>
        </Section>

        <Section title={t.freeReading} hint={t.freeReadingHint}>
          <div className="flex rounded-full bg-chip p-1" style={{ width: 260 }}>
            {[
              [false, t.freeReadingOff],
              [true, t.freeReadingOn],
            ].map(([value, label]) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => onSetFreeReading(value as boolean)}
                className={cn(
                  'h-11 flex-1 rounded-full text-[15px] font-extrabold transition-colors',
                  freeReading === value ? 'bg-(image:--grad-brand) text-white shadow-[0_4px_10px_rgb(30_111_232/.3)]' : 'text-ink-soft',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t.pin} hint="">
          <button type="button" onClick={onChangePin} className="h-12 self-start rounded-full bg-chip px-6 text-base font-extrabold text-ink-soft">
            {t.changePin}
          </button>
        </Section>

        <button type="button" onClick={onBack} className="mt-2 h-14 self-center rounded-full bg-(image:--grad-cta) px-9 text-lg font-black text-ink shadow-btn-cta">
          {t.back}
        </button>
      </div>
    </div>
  );
}

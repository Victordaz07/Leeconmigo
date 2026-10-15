/**
 * Biblioteca: TODAS las historias reales disponibles para el idioma/nivel actual, sin el cupo ni las tarjetas
 * de relleno de la cuadrícula "Mis historias" de Inicio (docs/08, Fase G). Antes "Biblioteca" del `NavRail`
 * abría por error la ficha de una sola historia (la destacada de Inicio) — esto es la pantalla real que faltaba.
 *
 * Dos tarjetas por fila (portada arriba, datos abajo), con buscador por título/descripción y filtros por
 * género, nivel, duración y estado (nueva/leída) — todo calculado de las historias que llegan, sin pedirle
 * nada más al motor: con 25+ historias reales ya no basta con bajar la lista a ojo.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { ChevronLeft, Clock, Filter, ImagePlaceholder, Search } from '../icons.tsx';
import { cn } from '../lib.ts';
import { NavRail } from './nav-rail.tsx';
import type { StoryCard } from './home.tsx';

export interface LibraryEntry extends StoryCard {
  description?: string;
  /** Slug de `Story.category` (docs/01: sin lista cerrada todavía) — `copy.library.genreNames` lo traduce. */
  category?: string;
  /** Todos los niveles de esta historia disponibles en el idioma actual, de menor a mayor. */
  levels: number[];
  /** Cuánto tomaría leerla entera (ver `readingMinutesOfWordCount`). */
  duration: { min: number; max: number };
}

export interface LibraryProps {
  stories: LibraryEntry[];
  onBack: () => void;
  onGoHome: () => void;
  onGoProgress: () => void;
  /** Abre el candado de "Modo padres" (docs/09 #1). */
  onGoSettings: () => void;
}

const BADGE_COLOR = { new: 'bg-coral', read: 'bg-ok' } as const;
type DurationBucket = 'any' | 'short' | 'medium' | 'long';
type StatusFilter = 'all' | 'new' | 'read';

/** Sin tildes ni mayúsculas, para que buscar "pregunta" encuentre "La pregunta que guardé...". */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function bucketOf(avgMinutes: number): Exclude<DurationBucket, 'any'> {
  if (avgMinutes <= 10) return 'short';
  if (avgMinutes <= 20) return 'medium';
  return 'long';
}

function toggled<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('rounded-full px-3.5 py-2 text-sm font-extrabold transition-colors', active ? 'bg-brand text-white shadow-chip' : 'bg-chip text-ink-soft')}
    >
      {children}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-black uppercase tracking-[.06em] text-muted">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function LibraryCard({ entry }: { entry: LibraryEntry }) {
  const home = copy.home;
  const select = copy.select;
  const t = copy.library;
  return (
    <button type="button" onClick={entry.onOpen} className="flex flex-col self-start overflow-hidden rounded-[26px] bg-white text-left shadow-card active:scale-[.99]">
      <div className="relative h-[180px] w-full flex-none bg-chip">
        {entry.cover ? (
          <img src={asset(entry.cover.src)} alt="" className="block h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 border border-dashed border-slate-300 bg-track text-center text-[13px] font-semibold text-ink-soft">
            <ImagePlaceholder />
            {entry.placeholder}
          </div>
        )}
        <div className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-black text-white shadow-[0_2px_6px_rgb(0_0_0/.2)] ${BADGE_COLOR[entry.status]}`}>
          {entry.status === 'new' ? home.badgeNew : home.badgeRead}
        </div>
        {entry.category && <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-black text-white backdrop-blur-sm">{t.genreNames[entry.category] ?? entry.category}</div>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-lg font-black leading-[1.2] text-ink">{entry.title}</div>
        {entry.description && <p className="line-clamp-2 flex-1 text-pretty text-sm leading-[1.4] text-ink-mute">{entry.description}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 rounded-full bg-chip px-3 py-1.5 text-xs font-extrabold text-ink-soft">
            <Clock color="currentColor" size={14} />
            {select.duration(entry.duration.min, entry.duration.max)}
          </div>
          {entry.levels.map((n) => (
            <span key={n} className="rounded-full bg-(image:--grad-green-chip) px-2 py-1 text-[11px] font-black text-white">
              {select.levelChip(n)}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export function LibraryScreen({ stories, onBack, onGoHome, onGoProgress, onGoSettings }: LibraryProps) {
  const t = copy.library;
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<Set<number>>(new Set());
  const [duration, setDuration] = useState<DurationBucket>('any');
  const [status, setStatus] = useState<StatusFilter>('all');

  const availableGenres = useMemo(() => [...new Set(stories.map((s) => s.category).filter((c): c is string => !!c))].sort(), [stories]);
  const availableLevels = useMemo(() => [...new Set(stories.flatMap((s) => s.levels))].sort((a, b) => a - b), [stories]);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    return stories.filter((s) => {
      if (q && !fold(s.title).includes(q) && !fold(s.description ?? '').includes(q)) return false;
      if (genres.size && (!s.category || !genres.has(s.category))) return false;
      if (levels.size && !s.levels.some((l) => levels.has(l))) return false;
      if (duration !== 'any' && bucketOf((s.duration.min + s.duration.max) / 2) !== duration) return false;
      if (status !== 'all' && s.status !== status) return false;
      return true;
    });
  }, [stories, query, genres, levels, duration, status]);

  const activeFilterCount = genres.size + levels.size + (duration !== 'any' ? 1 : 0) + (status !== 'all' ? 1 : 0);
  const clearFilters = () => {
    setGenres(new Set());
    setLevels(new Set());
    setDuration('any');
    setStatus('all');
  };

  const durationOptions: { key: DurationBucket; label: string }[] = [
    { key: 'any', label: t.durationAny },
    { key: 'short', label: t.durationShort },
    { key: 'medium', label: t.durationMedium },
    { key: 'long', label: t.durationLong },
  ];
  const statusOptions: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t.statusAll },
    { key: 'new', label: t.statusNew },
    { key: 'read', label: t.statusRead },
  ];

  return (
    <>
      <NavRail active="library" onHome={onGoHome} onLibrary={() => {}} onAchievements={onGoProgress} onSettings={onGoSettings} />
      <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden bg-app bg-(image:--grad-home-glow) px-11 pb-9 pt-[34px]">
        <header className="flex items-center gap-[18px]">
          <button type="button" onClick={onBack} aria-label="Volver" className="flex size-[52px] items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_10px_rgb(30_35_64/.12)]">
            <ChevronLeft size={22} />
          </button>
          <h1 className="flex-1 text-[38px] font-black text-navy">{t.title}</h1>
        </header>

        {stories.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-5 py-3.5 shadow-chip">
              <Search size={20} color="var(--color-muted)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full border-none bg-transparent text-base font-bold text-ink outline-none placeholder:font-semibold placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={cn('flex items-center gap-2 rounded-full px-5 py-3.5 text-base font-extrabold shadow-chip', showFilters || activeFilterCount ? 'bg-brand text-white' : 'bg-white text-ink-soft')}
            >
              <Filter size={18} />
              {t.filters}
              {activeFilterCount > 0 && <span className="flex size-[22px] items-center justify-center rounded-full bg-white/25 text-xs">{activeFilterCount}</span>}
            </button>
          </div>
        )}

        {showFilters && (
          <div className="flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-chip">
            <FilterGroup label={t.genreLabel}>
              {availableGenres.map((g) => (
                <Chip key={g} active={genres.has(g)} onClick={() => setGenres(toggled(genres, g))}>
                  {t.genreNames[g] ?? g}
                </Chip>
              ))}
            </FilterGroup>
            <FilterGroup label={t.levelLabel}>
              {availableLevels.map((l) => (
                <Chip key={l} active={levels.has(l)} onClick={() => setLevels(toggled(levels, l))}>
                  {copy.select.levelChip(l)}
                </Chip>
              ))}
            </FilterGroup>
            <FilterGroup label={t.durationLabel}>
              {durationOptions.map((o) => (
                <Chip key={o.key} active={duration === o.key} onClick={() => setDuration(o.key)}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>
            <FilterGroup label={t.statusLabel}>
              {statusOptions.map((o) => (
                <Chip key={o.key} active={status === o.key} onClick={() => setStatus(o.key)}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className="self-start text-sm font-extrabold text-brand">
                {t.clearFilters}
              </button>
            )}
          </div>
        )}

        {stories.length === 0 ? (
          <p className="text-lg font-bold text-muted">{t.empty}</p>
        ) : filtered.length === 0 ? (
          <p className="text-lg font-bold text-muted">{t.noResults}</p>
        ) : (
          <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start gap-5 overflow-y-auto pb-2 pr-1">
            {filtered.map((s) => (
              <LibraryCard key={s.id} entry={s} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

import type { IllustrationRef } from '@lee-conmigo/contracts';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { Book, Crown, Flame, Leaf, Mountain, Star, Sun, Trophy } from '../icons.tsx';
import { NavRail } from './nav-rail.tsx';
import { StoryTile } from './story-tile.tsx';

export interface StoryCard {
  id: string;
  title: string;
  /** "Nivel 1" */
  meta: string;
  /** 0–3 estrellas ganadas. */
  stars: number;
  status: 'new' | 'read';
  /** Portada; si no hay, se muestra un marcador de posición con `placeholder`. */
  cover?: IllustrationRef;
  placeholder?: string;
  onOpen?: () => void;
}

export interface LevelTile {
  n: number;
  name: string;
  icon: 'leaf' | 'sun' | 'mountain' | 'crown' | 'book' | 'trophy';
  tone: 'green' | 'blue' | 'violet' | 'amber' | 'coral' | 'gold';
  /** Es el nivel del perfil ahora mismo. Ya no hay niveles "bloqueados" (docs/01: el padre elige libremente, sin desbloqueos). */
  current?: boolean;
}

export interface HomeProps {
  childName: string;
  streakDays: number;
  starsTotal: number;
  /**
   * Historia destacada. Con `frame` es la historia a medias ("Sigue leyendo", con su barra de avance); sin `frame`
   * es una sugerencia para empezar ("Empieza aquí"), sin barra.
   */
  current: { title: string; frame?: number; totalFrames: number; image: IllustrationRef; /** Foco del recorte panorámico (%); sin él, el recorte fijo de la historia piloto. */ focus?: { x: number; y: number } };
  stories: StoryCard[];
  levels: LevelTile[];
  onContinue: () => void;
  onGoHome: () => void;
  onGoLibrary: () => void;
  onGoProgress: () => void;
  /** Abre el candado de "Modo padres" (docs/09 #1): desde ahí se cambia el nivel, el idioma y la meta diaria. */
  onGoSettings: () => void;
}

const LEVEL_ICONS = { leaf: Leaf, sun: Sun, mountain: Mountain, crown: Crown, book: Book, trophy: Trophy } as const;
const LEVEL_TONE = {
  green: 'bg-(image:--grad-green-diag)',
  blue: 'bg-(image:--grad-blue-diag)',
  violet: 'bg-(image:--grad-violet-diag)',
  amber: 'bg-(image:--grad-amber-diag)',
  coral: 'bg-(image:--grad-coral-diag)',
  gold: 'bg-(image:--grad-gold-diag)',
} as const;

const Pill = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 rounded-full bg-white px-[18px] py-2.5 text-[17px] font-black shadow-chip">{children}</div>
);

export function HomeScreen(p: HomeProps) {
  const t = copy.home;
  const resuming = p.current.frame !== undefined;
  return (
    <>
      <NavRail active="home" onHome={p.onGoHome} onLibrary={p.onGoLibrary} onAchievements={p.onGoProgress} onSettings={p.onGoSettings} />
      <main className="flex min-w-0 flex-1 flex-col gap-[30px] overflow-y-auto overflow-x-hidden bg-app bg-(image:--grad-home-glow) px-11 pb-9 pt-[34px]">
        <header className="flex items-center gap-5">
          <div className="flex flex-1 flex-col gap-0.5">
            <h1 className="text-[40px] font-black text-navy">{t.greeting(p.childName)}</h1>
            <p className="text-[19px] font-bold text-muted">{t.prompt}</p>
          </div>
          <Pill>
            <Flame size={20} />
            {t.streakDays(p.streakDays)}
          </Pill>
          <Pill>
            <Star size={20} />
            {p.starsTotal}
          </Pill>
          <button
            type="button"
            onClick={p.onGoProgress}
            aria-label={copy.progress.title}
            className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-(image:--grad-sun-diag) text-2xl font-black text-white shadow-[0_6px_16px_rgb(255_159_67/.4)]"
          >
            {p.childName.charAt(0)}
          </button>
        </header>

        <section aria-label={resuming ? t.continueChip : t.startChip} className="relative h-[280px] flex-none overflow-hidden rounded-[30px] shadow-hero">
          {p.current.focus ? (
            <img src={asset(p.current.image.src)} alt="" className="absolute inset-0 block h-full w-full object-cover" style={{ objectPosition: `${p.current.focus.x}% ${p.current.focus.y}%` }} draggable={false} />
          ) : (
            <img src={asset(p.current.image.src)} alt="" className="absolute left-[-420px] top-[-134px] block w-[1953px] max-w-none" draggable={false} />
          )}
          <div className="absolute inset-0 bg-(image:--grad-hero-shade)" />
          <div className="absolute inset-y-0 left-10 flex max-w-[460px] flex-col justify-center gap-3.5">
            <div className="self-start rounded-full bg-white/[.18] px-3.5 py-1.5 text-sm font-black uppercase tracking-[.06em] text-white">{resuming ? t.continueChip : t.startChip}</div>
            <div className="text-[42px] font-black leading-[1.05] text-white">{p.current.title}</div>
            {p.current.frame !== undefined && (
              <div className="flex items-center gap-3">
                <div className="h-3 w-[220px] overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-(image:--grad-green)" style={{ width: `${(p.current.frame / p.current.totalFrames) * 100}%` }} />
                </div>
                <div className="text-[15px] font-extrabold text-white">{t.frameOf(p.current.frame, p.current.totalFrames)}</div>
              </div>
            )}
            <button type="button" onClick={p.onContinue} className="mt-1.5 h-[58px] self-start rounded-full bg-(image:--grad-cta) px-[30px] text-xl font-black text-ink shadow-btn-cta">
              {resuming ? t.continue : t.start}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-black text-navy">{t.myStories}</h2>
            <button type="button" onClick={p.onGoLibrary} className="text-base font-extrabold text-brand">
              {t.seeAll}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {p.stories.map((s) => (
              <StoryTile key={s.id} story={s} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-black text-navy">{t.levels}</h2>
            <button type="button" onClick={p.onGoSettings} className="text-base font-extrabold text-brand">
              {t.changeLevel}
            </button>
          </div>
          <div className="grid grid-cols-6 gap-3.5">
            {p.levels.map((l) => {
              const Icon = LEVEL_ICONS[l.icon];
              return (
                <div
                  key={l.n}
                  className={`relative flex h-[120px] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[24px] px-2 text-center shadow-tile-color ${LEVEL_TONE[l.tone]} ${l.current ? 'ring-4 ring-white ring-offset-2 ring-offset-app' : ''}`}
                >
                  <div className="absolute -right-6 -top-6 size-[90px] rounded-full bg-white/[.14]" />
                  <Icon size={30} />
                  <div className="flex flex-col gap-0.5 text-white">
                    <div className="text-base font-black">Nivel {l.n}</div>
                    <div className="text-[11px] font-bold leading-tight opacity-[.92]">{l.name}</div>
                  </div>
                  {l.current && <div className="absolute bottom-1.5 rounded-full bg-black/[.18] px-2 py-0.5 text-[10px] font-black text-white">{t.currentLevel}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

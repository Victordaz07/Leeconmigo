import type { ReadingSessionState, Story, StoryPage } from '@lee-conmigo/contracts';
import type { StoryWord } from '@lee-conmigo/story-engine';
import { ComicLayer, COMIC_WIDTH, asset } from '../comic.tsx';
import { ComicFitLayer, isBalloonPage } from '../comic-fit.tsx';
import { fitLayout } from '../fit-layout.ts';
import { useCanvasSize } from '../stage.tsx';
import { copy } from '../copy.ts';
import { Adventure, Book, ChevronLeft, ChevronRight, Clock, PanelToggle, Star } from '../icons.tsx';
import type { ReaderPrefs } from '../types.ts';
import { readingMinutes } from '../view-model.ts';

export interface SelectProps {
  story: Story;
  page: StoryPage;
  words: StoryWord[];
  /** Estado de lectura en reposo (nada resaltado). */
  reading: ReadingSessionState;
  prefs: ReaderPrefs;
  panelOpen: boolean;
  onTogglePanel: () => void;
  onBack: () => void;
  onStart: () => void;
}

const Fact = ({ tone, icon, children }: { tone: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 text-base font-extrabold text-ink-soft">
    <span className={`flex size-[38px] items-center justify-center rounded-xl ${tone}`}>{icon}</span>
    {children}
  </div>
);

/** Ficha de la historia: portada, datos, "Comenzar", y el cómic completo de fondo. */
export function SelectScreen({ story, page, words, reading, prefs, panelOpen, onTogglePanel, onBack, onStart }: SelectProps) {
  const t = copy.select;
  const range = readingMinutes(story);
  const duration = t.duration(range.min, range.max);
  const canvas = useCanvasSize();
  // Páginas con globos dibujados: la ilustración completa, pegada arriba a la derecha, en el espacio que deja el panel.
  const fit = isBalloonPage(page)
    ? fitLayout({ width: canvas.width - (panelOpen ? 380 : 0), height: canvas.height, imageWidth: page.illustration.width, imageHeight: page.illustration.height, minSide: 0, minBottom: 0 })
    : null;
  return (
    <>
      {panelOpen && (
        <aside className="relative z-[2] flex w-[380px] flex-none flex-col gap-5 bg-(image:--grad-panel-select) px-7 pb-7 pt-[26px] shadow-[6px_0_24px_rgb(0_0_0/.25)]">
          <div className="flex justify-between">
            <button type="button" onClick={onBack} aria-label="Volver" className="flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-round">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={onTogglePanel} title={t.hidePanel} aria-label={t.hidePanel} className="flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-round">
              <PanelToggle mode="hide" size={20} />
            </button>
          </div>
          <div className="relative">
            {story.cover && <img src={asset(story.cover.src)} alt={story.cover.alt ?? ''} className="block aspect-[540/225] w-full rounded-[22px] border-4 border-white object-cover shadow-[0_12px_28px_rgb(30_35_64/.22)]" draggable={false} />}
            <img src={asset('assets/mascot.png')} alt="" className="absolute -bottom-[22px] -right-3 size-16 animate-bob object-contain" draggable={false} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 self-start rounded-full bg-(image:--grad-green-chip) py-1.5 pl-2.5 pr-3.5 text-sm font-black text-white shadow-[inset_0_1px_0_rgb(255_255_255/.4),0_3px_8px_rgb(39_167_94/.3)]">
              <Star size={16} fill="#fff" />
              {t.levelChip(story.level)}
            </div>
            <h1 className="text-4xl font-black leading-[1.05] text-navy">{story.title}</h1>
            <p className="text-pretty text-base leading-normal text-ink-mute">{story.description ?? ''}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Fact tone="bg-(image:--grad-tile-lilac)" icon={<Book left="#6A52D9" right="#6A52D9" leftOpacity={0.35} rightOpacity={0.55} outline="#6A52D9" size={22} />}>
              {t.frames(story.pages.reduce((n, p) => n + p.blocks.length, 0))}
            </Fact>
            <Fact tone="bg-(image:--grad-tile-blue)" icon={<Clock color="#1E6FE8" filled size={22} />}>
              {duration}
            </Fact>
            <Fact tone="bg-(image:--grad-tile-peach)" icon={<Adventure size={22} />}>
              {t.category}
            </Fact>
          </div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onStart}
            className="flex h-[68px] items-center justify-center gap-3.5 rounded-full bg-(image:--grad-brand-cta) text-[22px] font-black text-white shadow-btn-brand-lg active:translate-y-1 active:shadow-btn-brand-pressed"
          >
            {t.start}
            <span className="flex size-[34px] items-center justify-center rounded-full bg-white/[.22]">
              <ChevronRight size={16} strokeWidth={3.4} />
            </span>
          </button>
        </aside>
      )}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        {fit ? (
          <div className="absolute right-0 top-0" style={{ width: fit.image.width, height: fit.image.height }}>
            <ComicFitLayer page={page} words={words} reading={reading} screen="select" prefs={prefs} currentBlock={0} highlightActive={false} inSession={false} width={fit.image.width} height={fit.image.height} />
          </div>
        ) : (
          <div className="absolute right-0 top-0 h-full" style={{ width: COMIC_WIDTH }}>
            <ComicLayer page={page} words={words} reading={reading} screen="select" prefs={prefs} currentBlock={0} highlightActive={false} inSession={false} />
          </div>
        )}
        {!panelOpen && (
          <div className="absolute bottom-6 left-6 z-[3] flex animate-in-fast items-center gap-4 rounded-full bg-white p-2.5 shadow-[0_14px_34px_rgb(0_0_0/.3)]">
            <button type="button" onClick={onTogglePanel} title={t.showPanel} aria-label={t.showPanel} className="flex size-12 items-center justify-center rounded-full bg-chip text-ink">
              <PanelToggle mode="show" size={20} />
            </button>
            <div className="flex flex-col">
              <div className="text-[19px] font-black">{story.title}</div>
              <div className="text-[13px] font-bold text-muted">
                Nivel {story.level} · {duration.replace(/minutos?/, 'min')}
              </div>
            </div>
            <button type="button" onClick={onStart} className="h-[52px] rounded-full bg-brand px-[26px] text-lg font-extrabold text-white">
              {t.start}  ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Tarjeta de una historia en cuadrícula (portada, título, nivel, estrellas, nueva/leída). La usan Inicio
 * ("Mis historias", con cupo limitado) y Biblioteca (todas las historias reales, sin cupo) — un solo lugar
 * para no desalinear el diseño entre las dos.
 */
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { ImagePlaceholder, Star } from '../icons.tsx';
import type { StoryCard } from './home.tsx';

const BADGE_COLOR = { new: 'bg-coral', read: 'bg-ok' } as const;

export function StoryTile({ story: s }: { story: StoryCard }) {
  const t = copy.home;
  return (
    <button type="button" onClick={s.onOpen} className="flex flex-col gap-2.5 rounded-[24px] bg-white px-2.5 pb-3.5 pt-2.5 text-left shadow-card active:scale-[.98]">
      <div className="relative h-[150px] overflow-hidden rounded-[18px] bg-chip">
        {s.cover ? (
          <img src={asset(s.cover.src)} alt="" className="block h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 rounded-[18px] border border-dashed border-slate-300 bg-track text-center text-[13px] font-semibold text-ink-soft">
            <ImagePlaceholder />
            {s.placeholder}
          </div>
        )}
        <div className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-xs font-black text-white shadow-[0_2px_6px_rgb(0_0_0/.2)] ${BADGE_COLOR[s.status]}`}>
          {s.status === 'new' ? t.badgeNew : t.badgeRead}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-1.5">
        <div className="text-lg font-black leading-[1.2] text-ink">{s.title}</div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-muted">{s.meta}</div>
          <div className="flex gap-px">
            {[0, 1, 2].map((z) => (
              <Star key={z} size={16} fill={z < s.stars ? '#F5B301' : '#DDE1EC'} />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

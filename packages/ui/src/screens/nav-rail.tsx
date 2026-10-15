import type { ReactNode } from 'react';
import { copy } from '../copy.ts';
import { Book, Gear, Home, Trophy } from '../icons.tsx';
import { cn } from '../lib.ts';

export type NavItem = 'home' | 'library' | 'achievements';

interface Props {
  active: NavItem;
  onHome: () => void;
  onLibrary: () => void;
  onAchievements: () => void;
  onSettings?: () => void;
}

function Item({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-20 w-[84px] flex-col items-center justify-center gap-1 rounded-[20px] text-[13px] font-extrabold',
        active ? 'bg-(image:--grad-sky) text-brand shadow-btn-sky' : 'bg-transparent text-muted',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

/** Barra lateral de navegación de Inicio y Progreso. */
export function NavRail({ active, onHome, onLibrary, onAchievements, onSettings }: Props) {
  return (
    <nav aria-label="Navegación" className="z-[1] flex w-[120px] flex-none flex-col items-center gap-2.5 bg-(image:--grad-nav) py-7 shadow-rail-soft">
      <div className="mb-[18px] flex size-16 items-center justify-center rounded-[20px] bg-(image:--grad-coral-diag) text-[26px] font-black text-white shadow-[inset_0_2px_0_rgb(255_255_255/.35),0_8px_18px_rgb(255_94_126/.35)]">
        LC
      </div>
      <Item active={active === 'home'} onClick={onHome} icon={<Home size={30} />} label={copy.nav.home} />
      <Item active={active === 'library'} onClick={onLibrary} icon={<Book size={30} />} label={copy.nav.library} />
      <Item active={active === 'achievements'} onClick={onAchievements} icon={<Trophy size={30} />} label={copy.nav.achievements} />
      <div className="flex-1" />
      <Item active={false} onClick={onSettings ?? (() => {})} icon={<Gear size={30} />} label={copy.nav.settings} />
    </nav>
  );
}

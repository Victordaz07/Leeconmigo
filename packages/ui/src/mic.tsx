import type { CSSProperties } from 'react';
import { Mic } from './icons.tsx';
import type { MicTone } from './view-model.ts';

/** Color de cada estado del micrófono (docs/05: verde = escuchando, gris = pausa/ayuda, ámbar = pausa larga). */
const TONE = {
  ok: { color: 'var(--color-ok-mid)', gradient: 'bg-(image:--grad-mic-ok)', label: 'var(--color-ok-mid)' },
  idle: { color: 'var(--color-slate-400)', gradient: 'bg-(image:--grad-mic-idle)', label: 'var(--color-muted)' },
  warn: { color: 'var(--color-warn)', gradient: 'bg-(image:--grad-mic-warn)', label: 'var(--color-warn)' },
} as const;

export const micColor = (tone: MicTone): string => TONE[tone].color;
export const micLabelColor = (tone: MicTone): string => TONE[tone].label;

interface MicProps {
  tone: MicTone;
  /** Diámetro en px de diseño. */
  size: number;
  /** Anillo pulsante mientras se escucha. */
  pulsing: boolean;
  /** Grosor de los dos aros que rodean al círculo (8/13 en grande, 5/8 en el riel). */
  rings: [number, number];
  iconSize: number;
  bigIcon?: boolean;
}

/** Círculo del micrófono: cambia de color según el estado en vez de mostrar texto técnico. */
export function MicBadge({ tone, size, pulsing, rings, iconSize, bigIcon }: MicProps) {
  const c = TONE[tone].color;
  const style: CSSProperties = {
    width: size,
    height: size,
    boxShadow: `0 0 0 ${rings[0]}px rgb(255 255 255/.95),0 0 0 ${rings[1]}px color-mix(in srgb, ${c} 20%, transparent),inset 0 3px 0 rgb(255 255 255/.35),0 12px 26px color-mix(in srgb, ${c} 33%, transparent)`,
  };
  return (
    <div role="img" aria-label="Micrófono" className={`flex flex-none items-center justify-center rounded-full transition-[background] duration-300 ${TONE[tone].gradient} ${pulsing ? 'animate-ring' : ''}`} style={style}>
      <Mic size={iconSize} big={bigIcon} />
    </div>
  );
}

const ARCS = ['M26 18 Q20 28 26 38', 'M18 11 Q8 28 18 45', 'M10 4 Q-4 28 10 52'];

/** Ondas de voz a los lados del micrófono; se animan solo mientras se escucha. */
export function MicArcs({ tone, listening, mirrored }: { tone: MicTone; listening: boolean; mirrored?: boolean }) {
  return (
    <svg width="36" height="56" viewBox="0 0 36 56" fill="none" strokeLinecap="round" strokeWidth="4" aria-hidden="true" style={mirrored ? { transform: 'scaleX(-1)' } : undefined}>
      {ARCS.map((d, k) => (
        <path key={d} d={d} className={listening ? 'animate-arc' : undefined} style={{ stroke: TONE[tone].color, opacity: listening ? 1 : 0.25, animationDelay: listening ? `${k * 0.18}s` : undefined }} />
      ))}
    </svg>
  );
}

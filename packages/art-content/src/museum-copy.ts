import type { FrameId, MuseumFilter } from './museum.ts';
import type { ArtLang } from './project.ts';

/** Textos de «Mi museo» (ES/EN). Tono de acompañamiento: sin puntos, sin «mejor obra»; la pared solo se mira y se sigue creando. */
export interface MuseumCopy {
  button: string;
  buttonHint: string;
  title: string;
  intro: string;
  empty: string;
  filters: Record<MuseumFilter, string>;
  frames: Record<FrameId, string>;
  frameLabel: (name: string) => string;
  framesTitle: string;
  open: (title: string) => string;
  rhythmPlaque: string;
  privacy: string;
  back: string;
}

export const MUSEUM_COPY: Record<ArtLang, MuseumCopy> = {
  es: {
    button: 'Mi museo',
    buttonHint: 'Tus creaciones en una pared, con marcos',
    title: 'Mi museo',
    intro: 'Aquí cuelgan tus creaciones. Toca una para seguir trabajando en ella.',
    empty: 'La pared está esperando. Haz una pintura o un collage y aparecerá aquí.',
    filters: { all: 'Todo', painting: 'Pinturas', collage: 'Collages', rhythm: 'Ritmos' },
    frames: { coral: 'coral', turquoise: 'turquesa', violet: 'violeta', yellow: 'amarillo' },
    frameLabel: (name) => `Marco ${name}`,
    framesTitle: 'Marco',
    open: (title) => `Abrir ${title}`,
    rhythmPlaque: 'Ritmo',
    privacy: 'Tu museo vive solo en esta tableta. Nadie más lo ve.',
    back: 'Volver a Arte y música',
  },
  en: {
    button: 'My museum',
    buttonHint: 'Your creations on a wall, in frames',
    title: 'My museum',
    intro: 'Your creations hang here. Tap one to keep working on it.',
    empty: 'The wall is waiting. Make a painting or a collage and it will show up here.',
    filters: { all: 'All', painting: 'Paintings', collage: 'Collages', rhythm: 'Rhythms' },
    frames: { coral: 'coral', turquoise: 'turquoise', violet: 'violet', yellow: 'yellow' },
    frameLabel: (name) => `${name} frame`,
    framesTitle: 'Frame',
    open: (title) => `Open ${title}`,
    rhythmPlaque: 'Rhythm',
    privacy: 'Your museum lives only on this device. Nobody else sees it.',
    back: 'Back to Art and music',
  },
};

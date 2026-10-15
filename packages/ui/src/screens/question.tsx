import type { Audience, CheckpointOption, StoryPage } from '@lee-conmigo/contracts';
import { asset } from '../comic.tsx';
import { copy } from '../copy.ts';
import { Speaker } from '../icons.tsx';
import { cn } from '../lib.ts';

export interface QuestionProps {
  audience: Audience;
  page: StoryPage;
  prompt: string;
  options: CheckpointOption[];
  correctIndex: number;
  /** Opción elegida (null = ninguna todavía). */
  answer: number | null;
  /** Pista o felicitación; nunca "Incorrecto" (docs/06). */
  feedback: string;
  number?: number;
  onPick: (index: number) => void;
  onContinue: () => void;
}

/** Recorte de la ilustración de la página como imagen de una opción (arte y texto separados: sin assets extra). */
function RegionArt({ page, region }: { page: StoryPage; region: [number, number, number, number] }) {
  const [x, y, w, h] = region;
  const { width: iw, height: ih } = page.illustration;
  return (
    <div
      role="img"
      aria-hidden="true"
      className="min-h-0 w-full flex-1 rounded-[20px]"
      style={{
        backgroundImage: `url(${asset(page.illustration.src)})`,
        backgroundSize: `${(iw / w) * 100}% auto`,
        backgroundPosition: `${iw === w ? 0 : (x / (iw - w)) * 100}% ${ih === h ? 0 : (y / (ih - h)) * 100}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

/** Marcador de posición para una opción sin arte todavía (el export del prototipo no trae esa imagen). */
function PlaceholderArt() {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center rounded-[20px] bg-brand-100" aria-hidden="true">
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" stroke="#7FAEFF" strokeWidth="5" strokeLinecap="round">
        <path d="M6 20q14-14 28 0t28 0 28 0 24 0M6 40q14-14 28 0t28 0 28 0 24 0" />
      </svg>
    </div>
  );
}

export function QuestionScreen({ audience, page, prompt, options, correctIndex, answer, feedback, number = 1, onPick, onContinue }: QuestionProps) {
  const teen = audience === 'lector';
  const solved = answer === correctIndex;
  return (
    <div className="absolute inset-0 z-[6] box-border flex animate-fade flex-col gap-10 bg-cream-deep px-16 py-14">
      <div className="flex items-start gap-5">
        <button type="button" aria-label="Escuchar la pregunta" className="flex size-16 flex-none items-center justify-center rounded-full bg-brand-100">
          <Speaker color="#1E6FE8" size={32} />
        </button>
        <div className="flex-1 text-balance text-[44px] font-extrabold leading-[1.2]">{prompt}</div>
        <div className="pt-3.5 text-lg font-bold text-muted">{copy.question.label(number)}</div>
      </div>

      <div className={teen ? 'flex flex-1 flex-col justify-center gap-4' : 'grid min-h-0 flex-1 grid-cols-3 gap-7'}>
        {options.map((o, k) => {
          const picked = answer === k;
          const right = picked && k === correctIndex;
          const wrong = picked && k !== correctIndex;
          return (
            <button
              key={o.text}
              type="button"
              onClick={() => !solved && onPick(k)}
              aria-pressed={picked}
              className={cn(
                'flex rounded-[28px] bg-white text-left transition-all duration-[250ms]',
                teen ? 'flex-row items-center gap-[18px] px-6 py-[18px]' : 'min-h-0 flex-col items-stretch gap-2.5 p-3.5',
                right ? 'shadow-[0_0_0_5px_#2DB36A,0_12px_28px_rgb(45_179_106/.25)] -translate-y-1' : wrong ? 'shadow-[0_0_0_3px_#DDE1EC]' : 'shadow-[0_6px_18px_rgb(30_35_64/.1)]',
                solved && !right ? 'opacity-50' : wrong ? 'opacity-75' : 'opacity-100',
              )}
            >
              {!teen && (o.imageRegion ? <RegionArt page={page} region={o.imageRegion} /> : o.image ? <img src={asset(o.image)} alt="" className="block min-h-0 w-full flex-1 rounded-[20px] object-cover" /> : <PlaceholderArt />)}
              {teen && <span className="flex size-11 flex-none items-center justify-center rounded-full bg-chip text-lg font-black text-ink">{'ABC'[k]}</span>}
              <div className="pb-1 pt-1.5 font-read text-[28px] font-bold text-ink">{o.text}</div>
            </button>
          );
        })}
      </div>

      <div className="flex min-h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-2xl font-bold">
          {feedback && <img src={asset('assets/mascot.png')} alt="" className="size-14 mix-blend-multiply" draggable={false} />}
          <span>{feedback}</span>
        </div>
        <button
          type="button"
          onClick={onContinue}
          disabled={!solved}
          className={cn('h-[72px] rounded-full px-16 text-2xl font-extrabold text-white transition-colors duration-[250ms]', solved ? 'bg-brand shadow-[0_6px_0_#1452B0]' : 'bg-[#C7CEDD]')}
        >
          {copy.question.continue}
        </button>
      </div>
    </div>
  );
}

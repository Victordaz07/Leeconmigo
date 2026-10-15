/**
 * Panel de desarrollo "FakeReadingEngine · Simular lectura" (docs/04 y docs/08 Etapa 3).
 * NUNCA forma parte de la experiencia del niño: en la app solo se monta en desarrollo y se abre a propósito.
 */
import { useState } from 'react';
import type { Audience, LanguageCode, ReadingProfile } from '@lee-conmigo/contracts';
import { SCREEN_STATE_LABELS } from '@lee-conmigo/session-engine';
import { cn } from './lib.ts';
import type { ReaderPrefs } from './types.ts';

export interface DevSim {
  label: string;
  /** Evento del contrato que dispara (solo informativo). */
  event: string;
  run: () => void;
}

export interface DevStory {
  id: string;
  title: string;
  /** Historia de prueba (no se muestra a los niños). */
  dev?: boolean;
  active: boolean;
}

export interface DevPanelProps {
  sims: DevSim[];
  prefs: ReaderPrefs;
  onPrefs: (p: ReaderPrefs) => void;
  autoReading: boolean;
  onToggleAuto: () => void;
  /** Estado (1-20) que se ve ahora. */
  stateNumber: number;
  onJump: (n: number) => void;
  /** Últimos eventos del contrato, el más reciente primero. */
  log: string[];
  timer?: { state: string; valid: string; session: string; pauses: number };
  /** Historias disponibles, incluidas las de prueba (que no salen en Inicio). */
  stories?: DevStory[];
  onOpenStory?: (id: string) => void;
  /** Página en pantalla, p. ej. "2 / 3". */
  pageLabel?: string;
  /** Abre el modo editor del texto en los globos de la historia actual. */
  onOpenEditor?: () => void;
  /** Abre "Probar micrófono" (`WhisperSpeechEngine` en vivo, fuera del flujo de una historia). */
  onOpenVoiceLab?: () => void;
  /** Idioma y nivel de lectura del niño (lo que el padre elegirá; hoy TEMPORAL). */
  profile?: ReadingProfile;
  onProfile?: (p: ReadingProfile) => void;
  defaultOpen?: boolean;
}

const AUDIENCES: Array<[Audience, string, string]> = [
  ['explorador', 'Explorador', '6 a 8 años'],
  ['lector', 'Lector', '9 a 12 años'],
];

function Toggle<T extends string>({ value, options, onChange }: { value: T; options: Array<[T, string]>; onChange: (v: T) => void }) {
  return (
    <div className="grid gap-1.5 rounded-xl bg-dev-3 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onChange(id)} className={cn('rounded-[9px] px-2.5 py-2 text-left text-[13px] font-black text-dev-ink', value === id ? 'bg-brand' : 'bg-transparent')}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function DevPanel(p: DevPanelProps) {
  const [open, setOpen] = useState(p.defaultOpen ?? false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="fixed bottom-3 right-3 z-[60] rounded-full bg-dev px-3.5 py-2 font-mono text-xs font-bold text-dev-ink opacity-70 shadow-float hover:opacity-100"
      >
        DEV {open ? '×' : '⚙'}
      </button>
      {open && (
        <aside aria-label="Panel de desarrollo" className="fixed inset-y-0 right-0 z-50 flex w-[340px] flex-col gap-5 overflow-y-auto bg-dev p-[22px] text-dev-ink shadow-float">
          <div className="flex flex-col gap-1">
            <div className="font-mono text-xs text-muted-2">FakeReadingEngine</div>
            <div className="text-lg font-extrabold">Simular lectura</div>
            <div className="text-[13px] leading-[1.45] text-[#9AA3BF]">Panel de desarrollo, no forma parte de la app.</div>
          </div>

          {p.timer && (
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 rounded-xl bg-dev-3 px-3 py-2.5 text-[13px]">
              <span className="rounded-full bg-dev-2 px-2.5 py-0.5 font-mono text-[11px] font-bold">{p.timer.state}</span>
              <span>válido <b>{p.timer.valid}</b></span>
              <span>sesión <b>{p.timer.session}</b></span>
              <span>pausas <b>{p.timer.pauses}</b></span>
            </div>
          )}

          {p.stories && p.onOpenStory && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-extrabold">Historia{p.pageLabel ? <span className="ml-2 font-mono text-[11px] font-normal text-muted-2">página {p.pageLabel}</span> : null}</div>
              <div className="flex flex-col gap-1.5">
                {p.stories.map((st) => (
                  <button key={st.id} type="button" onClick={() => p.onOpenStory?.(st.id)} className={cn('rounded-lg px-[9px] py-[7px] text-left text-xs font-bold text-dev-ink', st.active ? 'bg-brand' : 'bg-dev-2')}>
                    Abrir «{st.title}»{st.dev ? <span className="ml-1.5 font-mono text-[10.5px] opacity-60">prueba</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.onOpenEditor && (
            <button type="button" onClick={p.onOpenEditor} className="rounded-xl bg-brand px-3.5 py-3 text-left text-sm font-extrabold text-white">
              ✎ Editar texto en los globos
              <span className="mt-0.5 block text-[11.5px] font-medium opacity-80">Mueve, redimensiona y guarda cajas y letra.</span>
            </button>
          )}

          {p.onOpenVoiceLab && (
            <button type="button" onClick={p.onOpenVoiceLab} className="rounded-xl bg-dev-2 px-3.5 py-3 text-left text-sm font-extrabold text-dev-ink">
              🎤 Probar micrófono
              <span className="mt-0.5 block text-[11.5px] font-medium opacity-70">Motor de voz real, fuera de una historia: qué oye y qué entiende.</span>
            </button>
          )}

          {p.profile && p.onProfile && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-extrabold">Idioma y nivel de lectura</div>
              <Toggle<LanguageCode> value={p.profile.language} options={[['es', 'Español'], ['en', 'English']]} onChange={(language) => p.onProfile?.({ ...p.profile!, language })} />
              <div className="grid grid-cols-6 gap-1 rounded-xl bg-dev-3 p-1">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button key={n} type="button" aria-label={`Nivel ${n}`} onClick={() => p.onProfile?.({ ...p.profile!, level: n })} className={cn('rounded-[9px] py-2 text-[13px] font-black text-dev-ink', p.profile?.level === n ? 'bg-brand' : 'bg-transparent')}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="text-xs leading-[1.45] text-muted-2">TEMPORAL (docs/09 #3): lo elegirá el padre. En cualquier build: <span className="font-mono">?lang=en&amp;level=2</span></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {p.sims.map((b) => (
              <button key={b.label} type="button" onClick={b.run} className="flex flex-col gap-[3px] rounded-[10px] bg-dev-2 p-2.5 text-left text-[13px] font-bold hover:bg-dev-line">
                <span>{b.label}</span>
                <span className="font-mono text-[10.5px] font-normal text-muted-2">{b.event}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-extrabold">Etapa del lector</div>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-dev-3 p-1">
              {AUDIENCES.map(([id, label, sub]) => (
                <button key={id} type="button" onClick={() => p.onPrefs({ ...p.prefs, audience: id })} className={cn('flex flex-col items-start gap-px rounded-[9px] px-2.5 py-2 text-dev-ink', p.prefs.audience === id ? 'bg-brand' : 'bg-transparent')}>
                  <span className="text-[13px] font-black">{label}</span>
                  <span className="text-[11px] opacity-75">{sub}</span>
                </button>
              ))}
            </div>
            <div className="text-xs leading-[1.45] text-muted-2">TEMPORAL (docs/09 #5): en la app se elegirá según el nivel del perfil.</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-extrabold">Marca de la palabra actual</div>
            <Toggle value={p.prefs.highlight} options={[['resaltador', 'Resaltador'], ['subrayado', 'Subrayado']]} onChange={(highlight) => p.onPrefs({ ...p.prefs, highlight })} />
            <div className="text-xs leading-[1.45] text-muted-2">TEMPORAL (docs/09 #2): falta decidir palabra vs. frase.</div>
            <div className="text-sm font-extrabold">Globos del cómic</div>
            <Toggle value={p.prefs.bubbles} options={[['todos', 'Todos'], ['progresivo', 'Progresivos']]} onChange={(bubbles) => p.onPrefs({ ...p.prefs, bubbles })} />
          </div>

          <button type="button" onClick={p.onToggleAuto} className={cn('rounded-xl px-3.5 py-3 text-sm font-extrabold text-white', p.autoReading ? 'bg-orange' : 'bg-ok-mid')}>
            {p.autoReading ? '■  Detener lectura automática' : '▸  Leer automáticamente'}
          </button>

          <div className="flex flex-col gap-2.5">
            <div className="text-sm font-extrabold">Ir a pantalla</div>
            <div className="grid grid-cols-2 gap-1.5">
              {SCREEN_STATE_LABELS.map((label, k) => (
                <button key={label} type="button" onClick={() => p.onJump(k + 1)} className={cn('rounded-lg px-[9px] py-[7px] text-left text-xs font-bold text-dev-ink', p.stateNumber === k + 1 ? 'bg-brand' : 'bg-dev-2')}>
                  <span className="font-mono text-[10.5px] opacity-60">{String(k + 1).padStart(2, '0')}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-extrabold">Eventos</div>
            <div className="flex min-h-[120px] flex-col gap-[5px] rounded-xl bg-dev-4 px-3.5 py-3 font-mono text-[11.5px] text-[#C9D0E4]">
              {(p.log.length ? p.log : ['esperando eventos…']).map((line, k) => (
                <div key={`${k}-${line}`} style={{ opacity: k === 0 ? 1 : Math.max(0.35, 1 - k * 0.1) }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

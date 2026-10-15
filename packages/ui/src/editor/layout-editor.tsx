/**
 * MODO EDITOR del texto en los globos. Herramienta de desarrollo (nunca forma parte de la experiencia del niño): sobre la
 * ilustración, cada cuadro tiene una caja de texto que se mueve y se redimensiona con el ratón o el dedo; a la derecha se
 * ajustan al milímetro la posición, la letra (automática o fija, para todas las variantes o solo una), la alineación y la
 * disposición. Comprueba a la vez las 6 variantes de idioma y nivel (comparten las cajas) y avisa si alguna no cabe.
 * "Guardar definitivo" escribe `layouts/<familia>.layout.json` en el proyecto; lo guardado gana a la plantilla.
 *
 * Solo presentación y estado de edición: el guardado real lo hace quien monte el editor (`onSave`).
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import type { BlockLayout, LayoutFile, PixelRect, ReadingSessionState, Story, TextAlign, TextMode, TextVAlign } from '@lee-conmigo/contracts';
import {
  clampRect, emptyLayoutFile, expandStory, historyPush, historyRedo, historyReplace, historyStart, historyUndo, layoutDiffers, moveRect, normalizeLayoutFile, patchBlock, patchBlocks,
  resetBlock, resizeRect, roundRect, setVariantFont, snapMoveRect, snapResizeRect, snapTargets, snapToBalloon, tokenizePage, MAX_FONT_PX, MIN_FONT_PX, TEMPLATE_CANVAS,
  type Handle,
} from '@lee-conmigo/story-engine';
import { BalloonText, ComicFitLayer, DEFAULT_MAX_FONT_PX } from '../comic-fit.tsx';
import type { FitBoxInfo } from '../fit-text.tsx';
import { cn } from '../lib.ts';
import { defaultPrefs } from '../types.ts';

export type SaveOutcome = { ok: true; message: string; file: LayoutFile } | { ok: false; message: string };

export interface LayoutEditorProps {
  /** Las historias de la familia TAL COMO SE ESCRIBIERON (sin plantillas expandidas): una por idioma × nivel. */
  sources: Story[];
  /** Ajustes guardados hoy (o un archivo vacío). */
  saved: LayoutFile;
  initialVariantId?: string;
  initialPageId?: string;
  /** Guardar definitivo en el proyecto. Sin él, el editor solo puede descargar el archivo. */
  onSave?: (file: LayoutFile) => Promise<SaveOutcome>;
  onExit: (saved: LayoutFile) => void;
}

const IDLE = (n: number): ReadingSessionState => ({
  currentWordIndex: 0, status: 'idle', wordCount: n, hasHeardVoice: false, wordMarks: {}, issue: null, issueWordIndex: null, pause: null, helpWordIndex: null,
  repeatedWordIndex: null, recovered: false, readStart: null, practicedWordIndices: [], errorCount: 0,
});

const HANDLES: Array<{ h: Handle; style: CSSProperties; cursor: string }> = [
  { h: 'nw', style: { left: 0, top: 0 }, cursor: 'nwse-resize' },
  { h: 'n', style: { left: '50%', top: 0 }, cursor: 'ns-resize' },
  { h: 'ne', style: { left: '100%', top: 0 }, cursor: 'nesw-resize' },
  { h: 'e', style: { left: '100%', top: '50%' }, cursor: 'ew-resize' },
  { h: 'se', style: { left: '100%', top: '100%' }, cursor: 'nwse-resize' },
  { h: 's', style: { left: '50%', top: '100%' }, cursor: 'ns-resize' },
  { h: 'sw', style: { left: 0, top: '100%' }, cursor: 'nesw-resize' },
  { h: 'w', style: { left: 0, top: '50%' }, cursor: 'ew-resize' },
];

const variantLabel = (s: Story) => `${s.language.toUpperCase()} · N${s.level}`;
const r1 = (n: number) => Math.round(n * 10) / 10;

// ---------------------------------------------------------------------------------------------------------------------------------
// Piezas pequeñas de la interfaz
// ---------------------------------------------------------------------------------------------------------------------------------

function Section({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <section className="flex flex-col gap-2 border-b border-white/10 px-4 py-3">
      <div className="text-[11px] font-black uppercase tracking-[.08em] text-white/50">{title}</div>
      {children}
      {hint && <div className="text-[11.5px] leading-snug text-white/40">{hint}</div>}
    </section>
  );
}

function Btn({ children, onClick, disabled, active, primary, title, testId, className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; active?: boolean; primary?: boolean; title?: string; testId?: string; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        primary ? 'bg-ok-mid text-white hover:brightness-110' : active ? 'bg-brand text-white' : 'bg-white/10 text-white/90 hover:bg-white/20',
        className,
      )}
    >
      {children}
    </button>
  );
}

function Seg<T extends string>({ value, options, onChange, label }: { value: T | undefined; options: Array<[T, string]>; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="grid gap-1 rounded-lg bg-black/25 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(([id, text]) => (
        <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)} className={cn('rounded-md px-2 py-1.5 text-[12.5px] font-bold', value === id ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10')}>
          {text}
        </button>
      ))}
    </div>
  );
}

function NumField({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-bold text-white/55">
      {label}
      <input
        type="number"
        aria-label={label}
        value={Number.isFinite(value) ? r1(value) : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (e.target.value !== '' && Number.isFinite(v)) onChange(v);
        }}
        className="w-full rounded-md border border-white/15 bg-black/30 px-2 py-1.5 font-mono text-[13px] text-white outline-none focus:border-brand"
      />
    </label>
  );
}

function Slider({ label, value, min, max, onChange, suffix = ' px' }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="flex flex-col gap-1 text-[12px] font-bold text-white/70">
      <span className="flex justify-between">
        {label}
        <span className="font-mono text-white">
          {r1(value)}
          {suffix}
        </span>
      </span>
      <input type="range" aria-label={label} min={min} max={max} step={0.5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[#4B97FF]" />
    </label>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// El editor
// ---------------------------------------------------------------------------------------------------------------------------------

export function LayoutEditor({ sources, saved: savedProp, initialVariantId, initialPageId, onSave, onExit }: LayoutEditorProps) {
  const family = sources[0].familyId ?? sources[0].id;
  const [hist, setHist] = useState(() => historyStart(savedProp));
  const [preview, setPreview] = useState<LayoutFile | null>(null);
  const [saved, setSaved] = useState(savedProp);
  const [variantId, setVariantId] = useState(initialVariantId && sources.some((s) => s.id === initialVariantId) ? initialVariantId : sources[0].id);
  const [pageId, setPageId] = useState(initialPageId ?? sources[0].pages[0].id);
  const [blockId, setBlockId] = useState<string | null>(null);
  const [target, setTarget] = useState<'text' | 'balloon'>('text');
  const [zoom, setZoom] = useState(1);
  const [guides, setGuides] = useState(true);
  const [snap, setSnap] = useState(true);
  const [childView, setChildView] = useState(false);
  const [fontScope, setFontScope] = useState<'all' | 'variant'>('all');
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [fits, setFits] = useState<Record<string, FitBoxInfo>>({});
  const [avail, setAvail] = useState({ w: 900, h: 600 });
  const area = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const lastEdit = useRef({ key: '', at: 0 });

  const draft = preview ?? hist.present;
  const dirty = layoutDiffers(draft, saved);

  // --- historias con los ajustes aplicados (y sin ellos, para conocer los valores de la plantilla) ---------------------------
  const expanded = useMemo(() => sources.map((s) => expandStory(s, draft)), [sources, draft]);
  const baseline = useMemo(() => sources.map((s) => expandStory(s, emptyLayoutFile(family))), [sources, family]);
  const idx = Math.max(0, sources.findIndex((s) => s.id === variantId));
  const story = expanded[idx];
  const page = story.pages.find((p) => p.id === pageId) ?? story.pages[0];
  const basePage = baseline[idx].pages.find((p) => p.id === page.id) ?? baseline[idx].pages[0];
  const words = useMemo(() => tokenizePage(page), [page]);
  const reading = useMemo(() => IDLE(words.length), [words.length]);
  const blocks = page.blocks;
  const selected = blocks.find((b) => b.id === blockId) ?? null;
  const layout: BlockLayout | undefined = selected?.layout;
  const baseLayout = basePage.blocks.find((b) => b.id === blockId)?.layout;
  const override = blockId ? (draft.pages[page.id]?.blocks[blockId] ?? {}) : {};
  const editable = blocks.every((b) => b.layout?.balloon && b.layout.text);

  // --- tamaño disponible → escala de la ilustración ----------------------------------------------------------------------------
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const measure = () => setAvail({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fitScale = Math.max(0.1, Math.min((avail.w - 40) / TEMPLATE_CANVAS.width, (avail.h - 40) / TEMPLATE_CANVAS.height));
  const scale = fitScale * zoom;
  const imgW = TEMPLATE_CANVAS.width * scale;
  const imgH = TEMPLATE_CANVAS.height * scale;

  // --- cambios e historial -----------------------------------------------------------------------------------------------------
  const commit = (next: LayoutFile, key?: string) => {
    setPreview(null);
    setHist((h) => {
      const now = Date.now();
      if (key && lastEdit.current.key === key && now - lastEdit.current.at < 900) {
        lastEdit.current.at = now;
        return historyReplace(h, next);
      }
      lastEdit.current = { key: key ?? '', at: now };
      return historyPush(h, next);
    });
    setStatus(null);
  };
  const undo = () => {
    setPreview(null);
    setHist(historyUndo);
  };
  const redo = () => {
    setPreview(null);
    setHist(historyRedo);
  };
  const patch = (p: Parameters<typeof patchBlock>[3], key?: string) => {
    if (blockId) commit(patchBlock(hist.present, page.id, blockId, p), key);
  };

  // --- rectángulo que se está editando (caja del texto o globo) --------------------------------------------------------------
  const activeRect = (b: string | null = blockId): PixelRect | undefined => {
    const l = blocks.find((x) => x.id === b)?.layout;
    return target === 'text' ? l?.text : l?.balloon;
  };
  const setRect = (r: PixelRect, key?: string) => patch({ [target]: clampRect(roundRect(r)) }, key ?? `rect:${blockId}:${target}`);

  // --- arrastrar y redimensionar ------------------------------------------------------------------------------------------------
  const drag = useRef<{ id: string; mode: 'move' | Handle; sx: number; sy: number; rect: PixelRect; base: LayoutFile } | null>(null);

  const startDrag = (e: ReactPointerEvent, id: string, mode: 'move' | Handle) => {
    const rect = target === 'text' ? blocks.find((b) => b.id === id)?.layout?.text : blocks.find((b) => b.id === id)?.layout?.balloon;
    if (!rect) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setBlockId(id);
    drag.current = { id, mode, sx: e.clientX, sy: e.clientY, rect, base: hist.present };
  };
  const onDragMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.sx) / scale;
    const dy = (e.clientY - d.sy) / scale;
    const balloon = baseLayout?.balloon ?? blocks.find((b) => b.id === d.id)?.layout?.balloon;
    const targets = snap && target === 'text' && !e.altKey && balloon ? snapTargets(balloon) : null;
    let next = d.mode === 'move' ? moveRect(d.rect, dx, dy) : resizeRect(d.rect, d.mode, dx, dy);
    if (targets) next = d.mode === 'move' ? snapMoveRect(next, targets) : snapResizeRect(next, d.mode, targets);
    setPreview(patchBlock(d.base, page.id, d.id, { [target]: roundRect(next) }));
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setPreview((p) => {
      if (p) commit(p);
      return null;
    });
  };

  // --- teclado -------------------------------------------------------------------------------------------------------------------
  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault();
      void save();
      return;
    }
    if (typing) return;
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
      return;
    }
    if (e.key === 'Escape') return setBlockId(null);
    if (e.key === 'Tab' && blocks.length) {
      e.preventDefault();
      const i = blocks.findIndex((b) => b.id === blockId);
      setBlockId(blocks[(i + (e.shiftKey ? -1 : 1) + blocks.length) % blocks.length].id);
      return;
    }
    if (e.key === '+' || e.key === '=') return setZoom((z) => Math.min(3, r1(z + 0.1)));
    if (e.key === '-') return setZoom((z) => Math.max(0.5, r1(z - 0.1)));
    const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const a = arrows[e.key];
    const r = activeRect();
    if (a && r && blockId) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      // Con Ctrl, las flechas cambian el TAMAÑO (esquina inferior derecha) en lugar de la posición.
      setRect(mod ? resizeRect(r, 'se', a[0] * step, a[1] * step) : moveRect(r, a[0] * step, a[1] * step), `nudge:${blockId}:${target}${mod ? ':size' : ''}`);
    }
  };

  // --- guardar / descargar / salir ------------------------------------------------------------------------------------------------
  async function save() {
    if (!onSave || saving) return;
    if (!layoutDiffers(hist.present, saved)) return setStatus({ kind: 'info', text: 'No hay cambios que guardar.' });
    setSaving(true);
    setStatus({ kind: 'info', text: 'Guardando…' });
    try {
      const out = await onSave(normalizeLayoutFile(hist.present));
      if (out.ok) {
        setSaved(out.file);
        setStatus({ kind: 'ok', text: out.message });
      } else setStatus({ kind: 'err', text: out.message });
    } catch (err) {
      setStatus({ kind: 'err', text: `No se pudo guardar: ${(err as Error).message}` });
    } finally {
      setSaving(false);
    }
  }
  const download = () => {
    const blob = new Blob([`${JSON.stringify(normalizeLayoutFile(hist.present), null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${family}.layout.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ kind: 'info', text: `Descargado ${family}.layout.json (cópialo a packages/story-engine/layouts/).` });
  };
  const exit = () => {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Salir y descartarlos?')) return;
    onExit(saved);
  };

  // --- letra: lo que se muestra ------------------------------------------------------------------------------------------------
  const fitOf = (vid: string, bid: string) => fits[`${vid}:${page.id}:${bid}`];
  const usedFont = blockId ? fitOf(variantId, blockId) : undefined;
  const fixedNow = layout?.fontPx;
  const maxNow = layout?.maxFontPx ?? DEFAULT_MAX_FONT_PX;
  const autoFontImg = usedFont ? r1(usedFont.font / scale) : undefined;

  const setFixed = (px: number | null, key: string) => {
    if (!blockId) return;
    if (fontScope === 'variant') return commit(setVariantFont(hist.present, page.id, blockId, variantId, px), key);
    commit(patchBlock(hist.present, page.id, blockId, { fontPx: px }), key);
  };
  /** Letra automática: quita la letra fija común y la de esta variante (las de otras variantes no se tocan). */
  const setAuto = () => {
    if (!blockId) return;
    commit(setVariantFont(patchBlock(hist.present, page.id, blockId, { fontPx: null }), page.id, blockId, variantId, null), 'font-mode');
  };
  const copyFormat = () => {
    if (!blockId) return;
    const o = hist.present.pages[page.id]?.blocks[blockId] ?? {};
    const others = blocks.filter((b) => b.id !== blockId).map((b) => b.id);
    commit(patchBlocks(hist.present, page.id, others, { align: o.align ?? null, valign: o.valign ?? null, textMode: o.textMode ?? null, maxFontPx: o.maxFontPx ?? null, fontPx: o.fontPx ?? null }));
    setStatus({ kind: 'info', text: `Formato copiado a ${others.length} cuadro(s) de la página.` });
  };

  const warnings = (bid: string) => sources.filter((s) => fitOf(s.id, bid)?.overflow).length;

  return (
    <div
      ref={root}
      data-testid="layout-editor"
      role="application"
      aria-label="Modo editor del texto en los globos"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[100] flex flex-col bg-[#161922] font-sans text-white outline-none"
    >
      {/* Barra superior */}
      <header className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#1d212c] px-3 py-2">
        <div className="mr-2 flex flex-col leading-tight">
          <span className="text-[11px] font-black uppercase tracking-[.08em] text-white/45">Modo editor</span>
          <span className="text-[15px] font-extrabold">{family}</span>
        </div>
        <div role="group" aria-label="Variante" className="flex gap-1 rounded-lg bg-black/25 p-1">
          {sources.map((s) => (
            <button key={s.id} type="button" aria-pressed={s.id === variantId} onClick={() => setVariantId(s.id)} title={s.title} className={cn('rounded-md px-2 py-1 text-[12px] font-bold', s.id === variantId ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10')}>
              {variantLabel(s)}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Página" className="flex gap-1 rounded-lg bg-black/25 p-1">
          {story.pages.map((p, i) => (
            <button key={p.id} type="button" aria-pressed={p.id === page.id} onClick={() => { setPageId(p.id); setBlockId(null); }} className={cn('rounded-md px-2 py-1 text-[12px] font-bold', p.id === page.id ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10')}>
              Pág. {i + 1}
            </button>
          ))}
        </div>
        <div className="mx-1 h-6 w-px bg-white/15" />
        <Btn testId="editor-undo" onClick={undo} disabled={!hist.past.length} title="Deshacer (Ctrl+Z)">↶ Deshacer</Btn>
        <Btn testId="editor-redo" onClick={redo} disabled={!hist.future.length} title="Rehacer (Ctrl+Y)">↷ Rehacer</Btn>
        <div className="mx-1 h-6 w-px bg-white/15" />
        <Btn onClick={() => setZoom((z) => Math.max(0.5, r1(z - 0.1)))} title="Alejar (−)">−</Btn>
        <span className="w-14 text-center font-mono text-[12px] text-white/80" aria-label="Zoom">{Math.round(zoom * 100)}%</span>
        <Btn onClick={() => setZoom((z) => Math.min(3, r1(z + 0.1)))} title="Acercar (+)">+</Btn>
        <Btn onClick={() => setZoom(1)} title="Ajustar a la pantalla">Ajustar</Btn>
        <div className="mx-1 h-6 w-px bg-white/15" />
        <Btn active={childView} onClick={() => setChildView((v) => !v)} title="Ocultar cajas y guías: ver la página como la verá el niño">Ver como el niño</Btn>
        <div className="flex-1" />
        {status && <span role="status" className={cn('max-w-[340px] truncate text-[12.5px] font-bold', status.kind === 'ok' && 'text-[#6BE39E]', status.kind === 'err' && 'text-[#FF8A7A]', status.kind === 'info' && 'text-white/70')}>{status.text}</span>}
        {dirty && <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-black" data-testid="editor-dirty">sin guardar</span>}
        <Btn testId="editor-download" onClick={download} title="Descargar el archivo de ajustes">Descargar</Btn>
        <Btn testId="editor-save" primary onClick={() => void save()} disabled={!onSave || saving || !dirty} title={onSave ? 'Escribe el archivo en el proyecto (Ctrl+S)' : 'Solo se puede guardar desde el servidor de desarrollo (npm run dev / npm run tablet)'}>
          {saving ? 'Guardando…' : 'Guardar definitivo'}
        </Btn>
        <Btn testId="editor-exit" onClick={exit}>Salir</Btn>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Lienzo */}
        <div ref={area} className="relative min-w-0 flex-1 overflow-auto bg-[conic-gradient(at_50%_50%,#20242f_25%,#1b1e28_0_50%,#20242f_0_75%,#1b1e28_0)] [background-size:24px_24px]" onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div className="grid min-h-full min-w-full place-items-center p-5">
            <div className="relative shadow-[0_10px_40px_rgb(0_0_0/.5)]" style={{ width: imgW, height: imgH }} data-testid="editor-canvas" onPointerDown={() => setBlockId(null)}>
              {editable ? (
                <ComicFitLayer page={page} words={words} reading={reading} screen="select" prefs={defaultPrefs} currentBlock={0} highlightActive={false} inSession={false} width={imgW} height={imgH} />
              ) : (
                <div className="grid size-full place-items-center bg-black/40 p-8 text-center text-sm text-white/70">Esta página no tiene globos dibujados (plantilla): no hay cajas de texto que editar.</div>
              )}

              {editable && !childView && (
                <div className="absolute inset-0">
                  {blocks.map((b) => {
                    const l = b.layout!;
                    const sel = b.id === blockId;
                    const r = target === 'text' ? l.text! : l.balloon!;
                    const bad = warnings(b.id) > 0;
                    return (
                      <div key={b.id}>
                        {guides && (
                          <div aria-hidden="true" className="pointer-events-none absolute rounded-[10px] border border-dotted border-[#F0A020]/80" style={{ left: l.balloon!.x * scale, top: l.balloon!.y * scale, width: l.balloon!.width * scale, height: l.balloon!.height * scale }} />
                        )}
                        <div
                          data-testid={`editor-box-${b.id}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`Caja de ${b.id}: ${b.title}`}
                          aria-pressed={sel}
                          onPointerDown={(e) => startDrag(e, b.id, 'move')}
                          onFocus={() => setBlockId(b.id)}
                          className={cn('absolute cursor-move touch-none', sel ? 'border-2 border-solid border-[#4B97FF] bg-[#4B97FF]/10' : 'border border-dashed border-white/80 hover:bg-white/10', bad && !sel && 'border-[#FF8A7A]')}
                          style={{ left: r.x * scale, top: r.y * scale, width: r.width * scale, height: r.height * scale }}
                        >
                          <span className={cn('pointer-events-none absolute -top-5 left-0 rounded px-1.5 py-px font-mono text-[10.5px] font-bold', sel ? 'bg-[#4B97FF] text-white' : 'bg-black/60 text-white/80')}>
                            {b.id}
                            {bad ? ' ⚠' : ''}
                          </span>
                          {sel &&
                            HANDLES.map(({ h, style, cursor }) => (
                              <span
                                key={h}
                                data-handle={h}
                                onPointerDown={(e) => startDrag(e, b.id, h)}
                                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#4B97FF] bg-white"
                                style={{ ...style, cursor, touchAction: 'none' }}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Capa oculta que mide TODAS las variantes con las cajas actuales (mismo tamaño en pantalla). */}
          {editable && (
            <div aria-hidden="true" data-testid="editor-checks" style={{ position: 'fixed', left: -99999, top: 0, width: imgW, height: imgH, visibility: 'hidden', pointerEvents: 'none' }}>
              {expanded.map((s, vi) => {
                const p = s.pages.find((x) => x.id === page.id);
                if (!p) return null;
                const w = tokenizePage(p);
                const st = IDLE(w.length);
                return (
                  <div key={s.id} className="relative" style={{ width: imgW, height: imgH }}>
                    {p.blocks.map((b, bi) =>
                      b.layout?.text ? (
                        <BalloonText
                          key={b.id}
                          block={b}
                          layout={b.layout}
                          blockIndex={bi}
                          words={w}
                          reading={st}
                          screen="select"
                          prefs={defaultPrefs}
                          scale={scale}
                          onFit={(info) => {
                            const k = `${sources[vi].id}:${p.id}:${b.id}`;
                            setFits((prev) => (prev[k] && prev[k].font === info.font && prev[k].overflow === info.overflow ? prev : { ...prev, [k]: info }));
                          }}
                        />
                      ) : null,
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inspector */}
        <aside className="flex w-[350px] flex-none flex-col overflow-y-auto border-l border-white/10 bg-[#1d212c]" aria-label="Ajustes del cuadro">
          <Section title="Cuadros de la página" hint="Toca una caja en la ilustración, o elige aquí. Tab pasa al siguiente.">
            <div className="flex flex-col gap-1">
              {blocks.map((b) => (
                <button key={b.id} type="button" aria-pressed={b.id === blockId} onClick={() => setBlockId(b.id)} className={cn('flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px]', b.id === blockId ? 'bg-brand/90 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10')}>
                  <span className="font-mono text-[11px] font-black opacity-70">{b.id}</span>
                  <span className="min-w-0 flex-1 truncate">{b.lines[0]}</span>
                  {warnings(b.id) > 0 && <span title={`No cabe en ${warnings(b.id)} variante(s)`} className="text-[#FFB4A8]">⚠ {warnings(b.id)}</span>}
                </button>
              ))}
            </div>
          </Section>

          {!selected || !layout || !editable ? (
            <div className="px-4 py-6 text-[13px] leading-relaxed text-white/50">Elige un cuadro para ajustar su caja, su letra y su alineación.</div>
          ) : (
            <>
              <Section title="Qué se mueve">
                <Seg<'text' | 'balloon'> label="Qué se mueve" value={target} onChange={setTarget} options={[['text', 'Caja del texto'], ['balloon', 'Aro del globo']]} />
                <div className="text-[11.5px] leading-snug text-white/40">{target === 'text' ? 'La caja donde se acomoda el texto (dentro del globo dibujado).' : 'El aro azul que resalta el globo del cuadro que se lee: debe coincidir con el globo de la ilustración.'}</div>
              </Section>

              <Section title={target === 'text' ? 'Posición y tamaño de la caja' : 'Posición y tamaño del aro'} hint="Píxeles de la ilustración (1536 × 1024). Flechas: 1 px · Mayús: 10 px · Ctrl: cambia el tamaño.">
                {(() => {
                  const r = activeRect();
                  if (!r) return null;
                  const set = (k: keyof PixelRect) => (v: number) => setRect({ ...r, [k]: v } as PixelRect, `rect:${blockId}:${target}:${k}`);
                  return (
                    <div className="grid grid-cols-4 gap-2">
                      <NumField label="X" value={r.x} onChange={set('x')} min={0} max={TEMPLATE_CANVAS.width} />
                      <NumField label="Y" value={r.y} onChange={set('y')} min={0} max={TEMPLATE_CANVAS.height} />
                      <NumField label="Ancho" value={r.width} onChange={set('width')} min={24} max={TEMPLATE_CANVAS.width} />
                      <NumField label="Alto" value={r.height} onChange={set('height')} min={24} max={TEMPLATE_CANVAS.height} />
                    </div>
                  );
                })()}
                <div className="flex flex-wrap gap-1.5">
                  <Btn testId="editor-snap-balloon" onClick={() => layout.balloon && patch({ text: snapToBalloon(layout.balloon) })} title="La caja del texto llena el interior del globo">Ajustar al globo</Btn>
                  <Btn active={snap} onClick={() => setSnap((v) => !v)} title="Pega la caja a los bordes y al centro del globo (Alt lo desactiva al arrastrar)">Imán</Btn>
                  <Btn active={guides} onClick={() => setGuides((v) => !v)} title="Muestra el contorno del globo dibujado">Guías</Btn>
                </div>
              </Section>

              <Section title="Letra" hint="Automática: llena la caja con la letra más grande que quepa (hasta el tope). Fija: el tamaño que elijas, en píxeles de la ilustración.">
                <Seg<'auto' | 'fixed'> label="Modo de la letra" value={fixedNow === undefined ? 'auto' : 'fixed'} onChange={(m) => (m === 'auto' ? setAuto() : setFixed(autoFontImg ?? 30, 'font'))} options={[['auto', 'Automática'], ['fixed', 'Fija']]} />
                {fixedNow === undefined ? (
                  <>
                    <Slider label="Tope de la letra" value={maxNow} min={MIN_FONT_PX} max={MAX_FONT_PX} onChange={(v) => patch({ maxFontPx: v }, `max:${blockId}`)} />
                    <div className="text-[12px] text-white/55" data-testid="editor-used-font">Letra usada: <b className="font-mono text-white">{autoFontImg ?? '—'}</b> px</div>
                  </>
                ) : (
                  <>
                    <Slider label="Tamaño de la letra" value={fixedNow} min={MIN_FONT_PX} max={MAX_FONT_PX} onChange={(v) => setFixed(v, `fixed:${blockId}:${fontScope}`)} />
                    <Seg<'all' | 'variant'> label="Alcance de la letra fija" value={fontScope} onChange={setFontScope} options={[['all', 'Todas las variantes'], ['variant', `Solo ${variantLabel(story)}`]]} />
                  </>
                )}
              </Section>

              <Section title="Alineación y disposición">
                <Seg<TextAlign> label="Alineación horizontal" value={layout.align ?? 'left'} onChange={(v) => patch({ align: v })} options={[['left', 'Izquierda'], ['center', 'Centro'], ['right', 'Derecha']]} />
                <Seg<TextVAlign> label="Alineación vertical" value={layout.valign ?? 'middle'} onChange={(v) => patch({ valign: v })} options={[['top', 'Arriba'], ['middle', 'Medio'], ['bottom', 'Abajo']]} />
                <Seg<TextMode> label="Disposición del texto" value={layout.textMode ?? 'lines'} onChange={(v) => patch({ textMode: v })} options={[['lines', 'Una frase por renglón'], ['flow', 'Párrafo corrido']]} />
              </Section>

              <Section title="Letra en cada variante" hint="Todas comparten esta caja. ⚠ = no cabe ni con la letra mínima: agranda la caja o acorta el texto.">
                <div className="flex flex-col gap-1" data-testid="editor-variant-fonts">
                  {sources.map((s) => {
                    const f = blockId ? fitOf(s.id, blockId) : undefined;
                    const fixedFor = s.id === variantId ? fixedNow : expanded[sources.indexOf(s)].pages.find((p) => p.id === page.id)?.blocks.find((b) => b.id === blockId)?.layout?.fontPx;
                    return (
                      <button key={s.id} type="button" onClick={() => setVariantId(s.id)} className={cn('flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12.5px]', s.id === variantId ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10')}>
                        <span className="font-bold">{variantLabel(s)}</span>
                        <span className="font-mono text-white/80">
                          {f ? `${r1(f.font / scale)} px` : '—'}
                          {fixedFor !== undefined ? ' · fija' : ''}
                          {f?.overflow ? ' ⚠' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              <Section title="Acciones del cuadro">
                <div className="flex flex-wrap gap-1.5">
                  <Btn onClick={copyFormat} title="Copia alineación, disposición y letra a los demás cuadros de la página">Copiar formato a la página</Btn>
                  <Btn testId="editor-reset" onClick={() => blockId && commit(resetBlock(hist.present, page.id, blockId))} disabled={!Object.keys(override).length} title="Quita todos los ajustes de este cuadro: vuelve a la plantilla">Restablecer cuadro</Btn>
                </div>
                {baseLayout?.text && (
                  <div className="font-mono text-[11px] text-white/35">
                    plantilla: x {baseLayout.text.x} · y {baseLayout.text.y} · {baseLayout.text.width}×{baseLayout.text.height}
                  </div>
                )}
              </Section>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

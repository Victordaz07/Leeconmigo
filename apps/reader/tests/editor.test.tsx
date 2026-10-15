// @vitest-environment jsdom
/**
 * Modo editor del texto en los globos: mover/redimensionar, letra, alineación, historial, guardado y salida. jsdom no calcula
 * diseño, así que aquí se prueba la lógica y el estado; el arrastre con el ratón y el ajuste real de la letra se verifican en
 * Chrome (.visual/probe-editor.mjs).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { LayoutFile } from '@lee-conmigo/contracts';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { emptyLayoutFile, expandStory } from '@lee-conmigo/story-engine';
import { LayoutEditor, type SaveOutcome } from '@lee-conmigo/ui';
import { App } from '../src/App.tsx';
import { createBundledRepository } from '../src/bundled-stories.ts';

const repo = createBundledRepository(true);
const FAMILY = 'mi-mochila-hace-achis';
const sources = repo.sourcesOfFamily!(FAMILY);

let onSave: ReturnType<typeof vi.fn<(f: LayoutFile) => Promise<SaveOutcome>>>;
let onExit: ReturnType<typeof vi.fn<(f: LayoutFile) => void>>;

beforeEach(() => {
  onSave = vi.fn(async (file: LayoutFile) => ({ ok: true as const, message: 'Guardado en layouts/x', file }));
  onExit = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const mount = (over: Partial<Parameters<typeof LayoutEditor>[0]> = {}) =>
  render(<LayoutEditor sources={sources} saved={emptyLayoutFile(FAMILY)} initialVariantId={`${FAMILY}-es-n2`} initialPageId="p01" onSave={onSave} onExit={onExit} {...over} />);
const box = (id: string) => screen.getByTestId(`editor-box-${id}`);
const select = (id: string) => fireEvent.focus(box(id));
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const savedFile = () => onSave.mock.calls.at(-1)![0];
const save = async () => {
  fireEvent.click(screen.getByTestId('editor-save'));
  await act(async () => {});
};

describe('LayoutEditor: contenido', () => {
  it('abre en la variante y página pedidas, con las 6 variantes y las 3 páginas', () => {
    mount();
    const variants = screen.getByRole('group', { name: 'Variante' });
    expect(within(variants).getAllByRole('button')).toHaveLength(6);
    expect(within(variants).getByRole('button', { name: 'ES · N2' }).getAttribute('aria-pressed')).toBe('true');
    const pages = screen.getByRole('group', { name: 'Página' });
    expect(within(pages).getAllByRole('button')).toHaveLength(3);
    expect(within(pages).getByRole('button', { name: 'Pág. 1' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('editor-box-b01')).toBeTruthy();
    expect(screen.getByTestId('editor-box-b03')).toBeTruthy();
  });

  it('cambiar de página y de variante cambia los cuadros y el texto', () => {
    mount();
    fireEvent.click(within(screen.getByRole('group', { name: 'Página' })).getByRole('button', { name: 'Pág. 2' }));
    expect(screen.getByTestId('editor-box-b04')).toBeTruthy();
    expect(screen.queryByTestId('editor-box-b01')).toBeNull();
    fireEvent.click(within(screen.getByRole('group', { name: 'Variante' })).getByRole('button', { name: 'EN · N1' }));
    expect(screen.getAllByText(/backpack/i).length).toBeGreaterThan(0);
  });

  it('sin cuadro elegido invita a elegir; al elegir uno muestra su caja y sus ajustes', () => {
    mount();
    expect(screen.getByText(/Elige un cuadro para ajustar/)).toBeTruthy();
    select('b01');
    expect(field('X').value).toBe('48'); // caja de la plantilla, arriba-izquierda
    expect(field('Ancho').value).toBe('678');
    expect(screen.getByRole('group', { name: 'Alineación horizontal' })).toBeTruthy();
  });

  it('una página sin globos dibujados avisa de que no hay nada que editar', () => {
    const plain = sources.map((s) => ({ ...s, pages: s.pages.map((p) => ({ ...p, template: undefined })) }));
    mount({ sources: plain as never });
    expect(screen.getByText(/no tiene globos dibujados/)).toBeTruthy();
  });
});

describe('LayoutEditor: ajustes', () => {
  it('escribir la posición cambia la caja, marca "sin guardar" y se puede deshacer y rehacer', () => {
    mount();
    select('b01');
    expect(screen.queryByTestId('editor-dirty')).toBeNull();
    fireEvent.change(field('X'), { target: { value: '120' } });
    expect(field('X').value).toBe('120');
    expect(screen.getByTestId('editor-dirty')).toBeTruthy();
    fireEvent.click(screen.getByTestId('editor-undo'));
    expect(field('X').value).toBe('48');
    expect(screen.queryByTestId('editor-dirty')).toBeNull();
    fireEvent.click(screen.getByTestId('editor-redo'));
    expect(field('X').value).toBe('120');
  });

  it('una ráfaga de cambios en el mismo campo es UN solo paso de deshacer', () => {
    mount();
    select('b01');
    for (const v of ['100', '110', '120', '130']) fireEvent.change(field('X'), { target: { value: v } });
    fireEvent.click(screen.getByTestId('editor-undo'));
    expect(field('X').value).toBe('48');
    expect((screen.getByTestId('editor-undo') as HTMLButtonElement).disabled).toBe(true);
  });

  it('lo que se escribe se limita a la ilustración: la caja no se sale ni baja del mínimo', async () => {
    mount();
    select('b01');
    fireEvent.change(field('X'), { target: { value: '99999' } });
    fireEvent.change(field('Alto'), { target: { value: '1' } });
    await save();
    const r = savedFile().pages.p01.blocks.b01.text!;
    expect(r.x + r.width).toBeLessThanOrEqual(1536);
    expect(r.height).toBe(24);
  });

  it('flechas: 1 px; Mayús: 10 px; Ctrl: cambian el tamaño; Tab pasa al cuadro siguiente', () => {
    mount();
    select('b01');
    const ed = screen.getByTestId('layout-editor');
    fireEvent.keyDown(ed, { key: 'ArrowRight' });
    expect(field('X').value).toBe('49');
    fireEvent.keyDown(ed, { key: 'ArrowDown', shiftKey: true });
    expect(field('Y').value).toBe('38');
    fireEvent.keyDown(ed, { key: 'ArrowRight', ctrlKey: true, shiftKey: true });
    expect(field('Ancho').value).toBe('688');
    expect(field('X').value).toBe('49');
    fireEvent.keyDown(ed, { key: 'Tab' });
    expect(field('X').value).toBe('814'); // b02: x del globo (793) + borde (5) + margen (16)
    fireEvent.keyDown(ed, { key: 'Tab', shiftKey: true });
    expect(field('X').value).toBe('49');
  });

  it('Ctrl+Z y Ctrl+Y funcionan desde el teclado', () => {
    mount();
    select('b01');
    const ed = screen.getByTestId('layout-editor');
    fireEvent.keyDown(ed, { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(ed, { key: 'z', ctrlKey: true });
    expect(field('X').value).toBe('48');
    fireEvent.keyDown(ed, { key: 'y', ctrlKey: true });
    expect(field('X').value).toBe('58');
    fireEvent.keyDown(ed, { key: 'z', ctrlKey: true });
    fireEvent.keyDown(ed, { key: 'z', ctrlKey: true, shiftKey: true }); // Ctrl+Mayús+Z = rehacer
    expect(field('X').value).toBe('58');
  });

  it('"Ajustar al globo" devuelve la caja al interior del globo', () => {
    mount();
    select('b01');
    fireEvent.change(field('Ancho'), { target: { value: '200' } });
    expect(field('Ancho').value).toBe('200');
    fireEvent.click(screen.getByTestId('editor-snap-balloon'));
    expect(field('Ancho').value).toBe('678');
  });

  it('letra fija: para todas las variantes o solo la actual; automática la quita', async () => {
    mount();
    select('b01');
    fireEvent.click(within(screen.getByRole('group', { name: 'Modo de la letra' })).getByRole('button', { name: 'Fija' }));
    fireEvent.change(screen.getByLabelText('Tamaño de la letra'), { target: { value: '31' } });
    await save();
    expect(savedFile().pages.p01.blocks.b01.fontPx).toBe(31);

    fireEvent.click(within(screen.getByRole('group', { name: 'Alcance de la letra fija' })).getByRole('button', { name: /Solo ES · N2/ }));
    fireEvent.change(screen.getByLabelText('Tamaño de la letra'), { target: { value: '25' } });
    await save();
    expect(savedFile().pages.p01.blocks.b01.fontPxByVariant).toEqual({ [`${FAMILY}-es-n2`]: 25 });

    fireEvent.click(within(screen.getByRole('group', { name: 'Modo de la letra' })).getByRole('button', { name: 'Automática' }));
    await save();
    expect(savedFile().pages.p01?.blocks.b01?.fontPx).toBeUndefined();
    expect(savedFile().pages.p01?.blocks.b01?.fontPxByVariant).toBeUndefined();
  });

  it('alineación, disposición y tope de letra se guardan en el cuadro', async () => {
    mount();
    select('b03');
    fireEvent.click(within(screen.getByRole('group', { name: 'Alineación horizontal' })).getByRole('button', { name: 'Centro' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Alineación vertical' })).getByRole('button', { name: 'Arriba' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Disposición del texto' })).getByRole('button', { name: 'Una frase por renglón' }));
    fireEvent.change(screen.getByLabelText('Tope de la letra'), { target: { value: '40' } });
    await save();
    expect(savedFile().pages.p01.blocks.b03).toEqual({ align: 'center', valign: 'top', textMode: 'lines', maxFontPx: 40 });
  });

  it('copiar formato lo lleva a los demás cuadros de la página; restablecer vuelve a la plantilla', async () => {
    mount();
    select('b01');
    fireEvent.click(within(screen.getByRole('group', { name: 'Alineación horizontal' })).getByRole('button', { name: 'Derecha' }));
    fireEvent.click(screen.getByRole('button', { name: /Copiar formato a la página/ }));
    await save();
    expect(Object.keys(savedFile().pages.p01.blocks)).toEqual(['b01', 'b02', 'b03']);
    expect(savedFile().pages.p01.blocks.b02.align).toBe('right');

    fireEvent.click(screen.getByTestId('editor-reset'));
    await save();
    expect(Object.keys(savedFile().pages.p01.blocks)).toEqual(['b02', 'b03']);
  });

  it('editar el aro del globo cambia solo el globo, no la caja del texto', async () => {
    mount();
    select('b01');
    fireEvent.click(within(screen.getByRole('group', { name: 'Qué se mueve' })).getByRole('button', { name: 'Aro del globo' }));
    expect(field('X').value).toBe('27');
    fireEvent.change(field('X'), { target: { value: '30' } });
    await save();
    expect(savedFile().pages.p01.blocks.b01).toEqual({ balloon: { x: 30, y: 13, width: 720, height: 142 } });
  });

  it('un ajuste guardado afecta a TODAS las variantes de la familia al expandirlas', () => {
    const file: LayoutFile = { familyId: FAMILY, version: 1, pages: { p01: { blocks: { b01: { align: 'center' } } } } };
    for (const s of sources) expect(expandStory(s, file).pages[0].blocks[0].layout!.align).toBe('center');
  });
});

describe('LayoutEditor: guardar, descargar y salir', () => {
  it('guarda el archivo normalizado, muestra el resultado y quita "sin guardar"', async () => {
    mount();
    select('b02');
    fireEvent.change(field('Alto'), { target: { value: '100.04' } });
    await save();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(savedFile().pages.p01.blocks.b02.text!.height).toBe(100); // se redondea al pixel
    expect(screen.getByRole('status').textContent).toMatch(/Guardado/);
    expect(screen.queryByTestId('editor-dirty')).toBeNull();
    expect((screen.getByTestId('editor-save') as HTMLButtonElement).disabled).toBe(true); // nada nuevo que guardar
  });

  it('Ctrl+S guarda', async () => {
    mount();
    select('b01');
    fireEvent.keyDown(screen.getByTestId('layout-editor'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('layout-editor'), { key: 's', ctrlKey: true });
    await act(async () => {});
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('si el guardado falla, lo dice y los cambios siguen ahí', async () => {
    onSave.mockResolvedValueOnce({ ok: false, message: 'el guardado solo se acepta desde la red local' });
    mount();
    select('b01');
    fireEvent.keyDown(screen.getByTestId('layout-editor'), { key: 'ArrowLeft' });
    await save();
    expect(screen.getByRole('status').textContent).toMatch(/solo se acepta desde la red local/);
    expect(screen.getByTestId('editor-dirty')).toBeTruthy();
    onSave.mockRejectedValueOnce(new Error('sin conexión'));
    await save();
    expect(screen.getByRole('status').textContent).toMatch(/No se pudo guardar: sin conexión/);
  });

  it('sin servidor de guardado (onSave ausente) solo se puede descargar', () => {
    mount({ onSave: undefined });
    expect((screen.getByTestId('editor-save') as HTMLButtonElement).disabled).toBe(true);
    const createUrl = vi.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByTestId('editor-download'));
    expect(createUrl).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent).toMatch(new RegExp(`${FAMILY}.layout.json`));
  });

  it('salir con cambios sin guardar pide confirmación; sin cambios sale directo y devuelve lo guardado', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    mount();
    fireEvent.click(screen.getByTestId('editor-exit'));
    expect(onExit).toHaveBeenCalledTimes(1); // sin cambios: no pregunta
    expect(confirm).not.toHaveBeenCalled();

    select('b01');
    fireEvent.keyDown(screen.getByTestId('layout-editor'), { key: 'ArrowRight' });
    fireEvent.click(screen.getByTestId('editor-exit'));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(onExit).toHaveBeenCalledTimes(1); // dijo que no: se queda
    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByTestId('editor-exit'));
    expect(onExit).toHaveBeenCalledTimes(2);
    expect(onExit.mock.calls[1][0]).toEqual(emptyLayoutFile(FAMILY)); // descartó: lo guardado sigue igual
  });

  it('"Ver como el niño" oculta las cajas y las guías', () => {
    mount();
    expect(screen.queryAllByTestId(/^editor-box-/).length).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: 'Ver como el niño' }));
    expect(screen.queryAllByTestId(/^editor-box-/).length).toBe(0);
  });
});

describe('modo editor dentro de la app', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('se abre desde el panel DEV con la familia de la historia que se ve; al guardar y salir, la lectura usa las cajas nuevas', async () => {
    const saveLayout = vi.fn(async (file: LayoutFile): Promise<SaveOutcome> => ({ ok: true, message: 'Guardado', file }));
    render(<App repository={createBundledRepository(true)} store={new MemoryProgressStore()} profile={{ language: 'es', level: 1 }} onProfileChange={() => {}} saveLayout={saveLayout} />);
    fireEvent.click(screen.getByRole('button', { name: /Mi mochila hace/ }));
    fireEvent.click(screen.getByRole('button', { name: /DEV/ }));
    fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /Editar texto en los globos/ }));
    await act(async () => {});
    expect(screen.getByTestId('layout-editor')).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Variante' }).querySelector('[aria-pressed="true"]')!.textContent).toBe('ES · N1'); // abre en la variante actual

    fireEvent.focus(screen.getByTestId('editor-box-b01'));
    fireEvent.click(within(screen.getByRole('group', { name: 'Alineación horizontal' })).getByRole('button', { name: 'Centro' }));
    fireEvent.click(screen.getByTestId('editor-save'));
    await act(async () => {});
    expect(saveLayout).toHaveBeenCalledTimes(1);
    expect(saveLayout.mock.calls[0][0].pages.p01.blocks.b01.align).toBe('center');
    fireEvent.click(screen.getByTestId('editor-exit'));
    expect(screen.queryByTestId('layout-editor')).toBeNull();
  });
});

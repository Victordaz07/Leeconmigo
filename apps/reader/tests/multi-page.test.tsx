// @vitest-environment jsdom
/**
 * Fase B (docs/08): sesión de lectura completa con VARIAS páginas — pasar de página, pregunta por página,
 * página de solo texto, fin de historia con los totales de toda la sesión, reanudación y segundo plano.
 * Usa la historia de prueba de tres páginas (`dev-tres-paginas`) con el FakeReadingEngine.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { devStory, pilotStory, InMemoryStoryRepository, tokenizePage } from '@lee-conmigo/story-engine';
import { App } from '../src/App.tsx';
import { LocalStorageProgressStore, PROGRESS_STORAGE_KEY } from '../src/local-progress-store.ts';

const repository = new InMemoryStoryRepository([pilotStory, devStory]);
let store: MemoryProgressStore;

beforeEach(() => {
  vi.useFakeTimers();
  store = new MemoryProgressStore();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
});

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const dev = () => within(screen.getByLabelText('Panel de desarrollo'));
const canvas = () => within(screen.getByTestId('tablet-canvas'));
const openDev = () => click(/DEV/);
const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { value: hidden, configurable: true });
  act(() => void document.dispatchEvent(new Event('visibilitychange')));
};

/** Abre la historia de prueba desde el panel de desarrollo y llega a la lectura de su primera página (o de la que toque). */
function startDevStory() {
  openDev();
  fireEvent.click(dev().getByRole('button', { name: /Abrir «Prueba: tres páginas»/ }));
  click('Comenzar');
  click('Comenzar lectura');
}

/**
 * Lee la página en pantalla con la lectura automática (~520 ms por palabra) hasta que aparece el aviso de
 * "página completa" (que se ve un instante y se va sola, sin tocar nada: `passPageDone`).
 */
function readCurrentPage(words: number) {
  fireEvent.click(dev().getByRole('button', { name: /Leer automáticamente/ }));
  advance(words * 520 + 700); // 400 ms de motor + 300 ms de margen, antes de que el aviso se pase solo
}

/** Espera a que el aviso de "página completa" termine su animación y se pase solo a lo que sigue. */
const passPageDone = () => advance(900);

const pageWords = (i: number) => tokenizePage(devStory.pages[i]).length;

describe('historia de varias páginas', () => {
  it('lee las 3 páginas, contesta una pregunta por página, repasa y termina con los totales de TODA la sesión', () => {
    render(<App repository={repository} store={store} />);
    startDevStory();

    // --- Página 1 (cómic) ---
    expect(canvas().getByText('Página 1 de 3')).toBeTruthy();
    readCurrentPage(pageWords(0));
    expect(screen.getByText('¡Página terminada!')).toBeTruthy();
    expect(screen.getByText('1 de 3 páginas')).toBeTruthy();
    passPageDone();
    expect(screen.getByText('¿Qué quería hacer el conejo hoy?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Dormir todo el día/ })); // se equivoca una vez: solo una pista
    expect(screen.getByText('Casi. Lee otra vez el primer cuadro.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Explorar el bosque/ }));
    click('Continuar');

    // --- Página 2 (solo texto): sigue en lectura, con la página nueva, y el panel no se puede ocultar ---
    expect(canvas().getByText('Página 2 de 3')).toBeTruthy();
    expect(screen.getByText('Listo para escuchar')).toBeTruthy(); // vuelve a esperar voz
    expect(screen.queryByRole('button', { name: 'Ocultar panel' })).toBeNull();
    expect(canvas().getAllByText('sendero').length).toBeGreaterThan(0); // el texto de la página 2 está en el panel
    readCurrentPage(pageWords(1));
    expect(screen.getByText('2 de 3 páginas')).toBeTruthy();
    passPageDone();
    expect(screen.getByText('¿Qué encontró el conejo cerca del camino?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Un río pequeño/ })); // a la primera
    click('Continuar');

    // --- Página 3 (cómic) ---
    expect(canvas().getByText('Página 3 de 3')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Ocultar panel' })).not.toBeNull(); // otra vez cómic: el panel se puede ocultar
    readCurrentPage(pageWords(2));
    expect(screen.getByText('3 de 3 páginas')).toBeTruthy();
    passPageDone();
    fireEvent.click(screen.getByRole('button', { name: /Una estrella/ }));
    click('Continuar');

    // --- Repaso (palabras base de la historia) y final ---
    expect(canvas().getByText('Repaso rápido')).toBeTruthy();
    const tiles = () => [...screen.getByTestId('tablet-canvas').querySelectorAll<HTMLButtonElement>('button.font-read')];
    while (!screen.queryByText('¡Terminaste la historia!')) {
      const texts = tiles().map((t) => t.textContent!);
      const key = Object.keys(devStory.vocabulary).find((k) => devStory.vocabulary[k].syllables!.length === texts.length && [...devStory.vocabulary[k].syllables!].sort().join('|') === [...texts].sort().join('|'))!;
      for (const syl of devStory.vocabulary[key].syllables!) fireEvent.click(tiles()[texts.indexOf(syl)]);
      const [, i, total] = canvas().getByText(/^Palabra [0-9] de [0-9]$/).textContent!.match(/([0-9]) de ([0-9])/)!;
      click(i === total ? 'Terminar' : 'Siguiente');
    }

    // El final cuenta TODAS las palabras de las 3 páginas, no solo las de la última
    const totalWords = devStory.pages.reduce((n, _, i) => n + pageWords(i), 0);
    expect(canvas().getByText(String(totalWords))).toBeTruthy();

    // --- Lo que quedó guardado: solo datos derivados ---
    const [summary, ...rest] = store.summaries();
    expect(rest).toEqual([]);
    expect(summary).toMatchObject({ storyId: 'dev-tres-paginas', language: 'es', level: 1, completion: 1, comprehensionTotal: 3, comprehensionCorrect: 2 /* la 1.ª tuvo un intento fallido */ });
    expect(summary.validReadingSeconds).toBeGreaterThan(20);
    expect(summary.stars).toBeGreaterThanOrEqual(1);
    expect(Object.keys(summary).sort()).toEqual(['completedAt', 'completion', 'comprehensionCorrect', 'comprehensionTotal', 'language', 'level', 'sessionSeconds', 'stars', 'storyId', 'validReadingSeconds', 'wordsHelped']);
    expect(store.latestResumePoint()).toBeNull(); // terminada: ya no hay nada que reanudar

    click('Siguiente historia');
    expect(screen.getByText('¡Hola, Noah!')).toBeTruthy();
  });

  it('una página sin pregunta sigue directo a la siguiente', () => {
    const noQuestion = structuredClone(devStory);
    delete noQuestion.pages[0].checkpoint;
    render(<App repository={new InMemoryStoryRepository([pilotStory, noQuestion])} store={store} />);
    startDevStory();
    readCurrentPage(pageWords(0));
    passPageDone();
    expect(canvas().getByText('Página 2 de 3')).toBeTruthy(); // sin pregunta en medio
    expect(screen.queryByText('¿Qué quería hacer el conejo hoy?')).toBeNull();
  });
});

describe('reanudación', () => {
  it('al empezar una historia se guarda dónde va, y Inicio ofrece "Sigue leyendo" con su avance', () => {
    render(<App repository={repository} store={store} />);
    startDevStory();
    expect(store.resumePoint('dev-tres-paginas')).toMatchObject({ pageIndex: 0 });
    readCurrentPage(pageWords(0));
    passPageDone();
    fireEvent.click(screen.getByRole('button', { name: /Explorar el bosque/ }));
    click('Continuar'); // pasa a la página 2 → punto de reanudación en la página 2
    expect(store.resumePoint('dev-tres-paginas')?.pageIndex).toBe(1);

    // Sale a medias: se guarda un resumen parcial (1 de 3 páginas) y el punto de reanudación se conserva
    click('Volver');
    const [partial] = store.summaries();
    expect(partial).toMatchObject({ storyId: 'dev-tres-paginas', completion: 0.33, comprehensionTotal: 1, comprehensionCorrect: 1 });
    expect(store.resumePoint('dev-tres-paginas')?.pageIndex).toBe(1);
  });

  it('Inicio muestra la historia a medias con su cuadro y "Continuar" abre la ficha en esa página', () => {
    store.setResumePoint({ storyId: 'dev-tres-paginas', pageIndex: 1, updatedAt: '2026-09-25T20:00:00.000Z' });
    render(<App repository={repository} store={store} />);
    expect(screen.getByText('Sigue leyendo')).toBeTruthy();
    expect(screen.getByText('Prueba: tres páginas')).toBeTruthy();
    expect(screen.getByText('Cuadro 4 de 8')).toBeTruthy(); // 3 cuadros de la página 1 + el primero de la 2
    click(/Continuar/);
    click('Comenzar');
    click('Comenzar lectura');
    expect(canvas().getByText('Página 2 de 3')).toBeTruthy(); // retoma donde se quedó, no desde el principio
    expect(canvas().getAllByText('sendero').length).toBeGreaterThan(0);
  });

  it('un punto de reanudación de una historia que ya no existe (o de prueba en producción) se ignora', () => {
    store.setResumePoint({ storyId: 'historia-borrada', pageIndex: 3, updatedAt: '2026-09-25T20:00:00.000Z' });
    render(<App repository={repository} store={store} />);
    expect(screen.getByText('Empieza aquí')).toBeTruthy();
  });

  it('el estado de ejemplo 17 del panel de desarrollo sigue mostrando el Inicio del prototipo (cuadro 3 de 10)', () => {
    render(<App repository={repository} store={store} />);
    openDev();
    fireEvent.click(dev().getByRole('button', { name: /^18 / })); // Progreso
    fireEvent.click(dev().getByRole('button', { name: /^17 / }));
    expect(screen.getByText('Cuadro 3 de 10')).toBeTruthy();
  });

  it('los saltos del panel de desarrollo son de mentira: no guardan resúmenes ni puntos de reanudación', () => {
    render(<App repository={repository} store={store} />);
    openDev();
    fireEvent.click(dev().getByRole('button', { name: /^16 / })); // fin de historia de ejemplo
    fireEvent.click(dev().getByRole('button', { name: /^17 / }));
    expect(store.summaries()).toEqual([]);
    expect(store.latestResumePoint()).toBeNull();
  });
});

describe('app en segundo plano (docs/03, docs/06)', () => {
  it('al pasar a segundo plano el temporizador se pausa al instante y al volver exige leer de nuevo', () => {
    render(<App repository={repository} store={store} />);
    startDevStory();
    fireEvent.click(dev().getByRole('button', { name: /^Palabra correcta/ }));
    fireEvent.click(dev().getByRole('button', { name: /Leer automáticamente/ }));
    advance(3000);
    expect(screen.getByText('READING')).toBeTruthy();

    setHidden(true);
    advance(300); // el panel de desarrollo refresca el reloj cada 250 ms; el motor ya se pausó al instante
    expect(screen.queryByText('READING')).toBeNull();
    expect(screen.getByText('PAUSED')).toBeTruthy();
    const validBefore = screen.getByText(/válido/).textContent;
    advance(5000); // segundo plano: el tiempo válido no avanza
    expect(screen.getByText(/válido/).textContent).toBe(validBefore);

    setHidden(false);
    fireEvent.click(dev().getByRole('button', { name: /^Palabra correcta/ }));
    advance(300);
    fireEvent.click(dev().getByRole('button', { name: /^Palabra correcta/ }));
    advance(300); // la lectura reciente (< 0,8 s) cuenta como evidencia; el reloj del panel se refresca cada 250 ms
    expect(screen.getByText('RESUMING')).toBeTruthy(); // necesita ~3 s de lectura válida seguida para volver a READING
  });
});

describe('LocalStorageProgressStore (progreso en el navegador)', () => {
  const summary = { storyId: 'a', language: 'es' as const, level: 1, validReadingSeconds: 60, sessionSeconds: 70, comprehensionCorrect: 1, comprehensionTotal: 2, wordsHelped: ['puerta'], completion: 1, stars: 3 as const, completedAt: '2026-09-25T20:00:00.000Z' };
  const fakeStorage = () => {
    const data = new Map<string, string>();
    return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  };

  it('guarda y recupera resúmenes y puntos de reanudación entre sesiones de la app', () => {
    const storage = fakeStorage();
    const a = new LocalStorageProgressStore(storage);
    a.saveSummary(summary);
    a.setResumePoint({ storyId: 'a', pageIndex: 2, updatedAt: '2026-09-25T20:00:00.000Z' });
    const b = new LocalStorageProgressStore(storage); // "la app se reabre"
    expect(b.summaries()).toEqual([summary]);
    expect(b.latestResumePoint()).toEqual({ storyId: 'a', pageIndex: 2, updatedAt: '2026-09-25T20:00:00.000Z' });
    b.clearResumePoint('a');
    expect(new LocalStorageProgressStore(storage).latestResumePoint()).toBeNull();
  });

  it('PRIVACIDAD: solo persiste los campos permitidos; nada de audio ni texto reconocido aunque se lo pasen', () => {
    const storage = fakeStorage();
    const s = new LocalStorageProgressStore(storage);
    s.saveSummary({ ...summary, audio: 'data:audio/wav;base64,AAAA', transcript: 'el conejo abrió la puerta' } as never);
    const raw = storage.data.get(PROGRESS_STORAGE_KEY)!;
    expect(raw).not.toMatch(/audio|transcript|conejo abrió/);
    expect(JSON.parse(raw).summaries[0]).toEqual(summary);
  });

  it('datos corruptos, con otra forma o de otra versión no rompen: se empieza limpio', () => {
    for (const bad of ['{no es json', '[]', JSON.stringify({ v: 2, summaries: [summary] }), JSON.stringify({ v: 1, summaries: [{ storyId: 1 }, summary, null], resumes: [{ storyId: 'a', pageIndex: -1, updatedAt: 'x' }, 7] })]) {
      const storage = fakeStorage();
      storage.data.set(PROGRESS_STORAGE_KEY, bad);
      const s = new LocalStorageProgressStore(storage);
      expect(() => s.summaries()).not.toThrow();
      expect(s.latestResumePoint()).toBeNull();
    }
    const partial = fakeStorage();
    partial.data.set(PROGRESS_STORAGE_KEY, JSON.stringify({ v: 1, summaries: [{ storyId: 1 }, summary, null], resumes: [] }));
    expect(new LocalStorageProgressStore(partial).summaries()).toEqual([summary]); // conserva lo válido
  });

  it('si el almacenamiento falla (cuota, modo privado) la app sigue: solo deja de persistir', () => {
    const throwing = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('cuota'); } };
    const s = new LocalStorageProgressStore(throwing);
    expect(() => s.saveSummary(summary)).not.toThrow();
    expect(s.summaries()).toEqual([summary]); // en memoria hasta cerrar la app
    expect(new LocalStorageProgressStore(null).summaries()).toEqual([]);
  });
});

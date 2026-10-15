// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReadingEvent } from '@lee-conmigo/contracts';
import { createSessionState, reduceSession } from '@lee-conmigo/reading-engine';
import { createReview, formatDuration, tilesOf } from '@lee-conmigo/session-engine';
import { pilotStory, tokenizePage } from '@lee-conmigo/story-engine';
import { EndScreen, HomeScreen, ProgressScreen, SelectScreen, SessionScene, copy, defaultPrefs, levelTilesFor, type ProgressData, type ReaderPrefs, type SessionActions, type SessionScreen } from '../src/index.ts';

afterEach(cleanup);

const story = pilotStory;
const page = story.pages[0];
const words = tokenizePage(page);
const N = words.length;
const start: ReadingEvent = { type: 'session.started' };
const readingState = (...events: Array<Parameters<typeof reduceSession>[1]>) => [start, ...events].reduce(reduceSession, createSessionState(N));
const lector: ReaderPrefs = { ...defaultPrefs, audience: 'lector' };

const noop = () => {};
const makeActions = (): SessionActions & Record<keyof SessionActions, ReturnType<typeof vi.fn>> => {
  const keys: Array<keyof SessionActions> = ['onBack', 'onTogglePanel', 'onToggleStory', 'onWordTap', 'onAskHelp', 'onCloseHelp', 'onListen', 'onReadStart', 'onPronounce', 'onPronouncingChange', 'onBegin', 'onPickAnswer', 'onContinue', 'onReviewTap', 'onReviewNext', 'onReviewListen', 'onFreeAdvance', 'onFreeBack'];
  return Object.fromEntries(keys.map((k) => [k, vi.fn()])) as never;
};

function scene(over: { screen?: SessionScreen; reading?: ReturnType<typeof readingState>; prefs?: ReaderPrefs; collapsed?: boolean; answer?: number | null; review?: ReturnType<typeof createReview> | null; elapsedSeconds?: number } = {}) {
  const actions = makeActions();
  const utils = render(
    <SessionScene
      story={story}
      page={page}
      words={words}
      screen={over.screen ?? 'reading'}
      reading={over.reading ?? readingState({ type: 'word.correct', wordIndex: 0 })}
      prefs={over.prefs ?? defaultPrefs}
      panelCollapsed={over.collapsed ?? false}
      storyHidden={false}
      pronounceNonce={0}
      elapsedSeconds={over.elapsedSeconds ?? 0}
      answer={over.answer ?? null}
      review={over.review ?? null}
      actions={actions}
    />,
  );
  return { actions, ...utils };
}

describe('SessionScene — lectura', () => {
  it('Explorador: mascota y tres ayudas (Historia, Ayuda, Escuchar); Lector: Pista, Escuchar y "Léeme el comienzo"', () => {
    scene();
    const panel = within(document.querySelector('aside')!);
    for (const label of ['Historia', 'Ayuda', 'Escuchar']) expect(panel.getByRole('button', { name: new RegExp(label) })).toBeTruthy();
    cleanup();
    scene({ prefs: lector });
    const p2 = within(document.querySelector('aside')!);
    for (const label of ['Pista', 'Escuchar', 'Léeme el comienzo']) expect(p2.getByRole('button', { name: new RegExp(label) })).toBeTruthy();
  });

  it('tocar una palabra del panel o del cómic pide ayuda para ESA palabra', () => {
    const { actions, container } = scene({ reading: readingState() });
    fireEvent.click(within(document.querySelector('aside')!).getAllByText('El')[0]);
    expect(actions.onWordTap).toHaveBeenLastCalledWith(0);
    const firstOfBlock2 = words.find((w) => w.blockIndex === 1)!;
    fireEvent.click(within(container.querySelector('[data-block="b02"]') as HTMLElement).getAllByText(firstOfBlock2.text)[0]);
    expect(actions.onWordTap).toHaveBeenLastCalledWith(firstOfBlock2.index);
  });

  it('los botones del panel avisan de la intención del niño', () => {
    const { actions } = scene();
    const panel = within(document.querySelector('aside')!);
    fireEvent.click(panel.getByRole('button', { name: /Ayuda/ }));
    fireEvent.click(panel.getByRole('button', { name: 'Escuchar' }));
    fireEvent.click(panel.getByRole('button', { name: 'Historia' }));
    fireEvent.click(panel.getByRole('button', { name: 'Volver' }));
    fireEvent.click(panel.getByRole('button', { name: copy.reading.hideStory }));
    expect(actions.onAskHelp).toHaveBeenCalled();
    expect(actions.onListen).toHaveBeenCalled();
    expect(actions.onToggleStory).toHaveBeenCalled();
    expect(actions.onBack).toHaveBeenCalled();
    expect(actions.onTogglePanel).toHaveBeenCalled();
  });

  it('panel colapsado: riel estrecho con progreso, micrófono y ayudas', () => {
    scene({ collapsed: true });
    const rail = within(document.querySelector('aside')!);
    expect(rail.getByText('1/10')).toBeTruthy();
    expect(rail.getByRole('button', { name: copy.reading.help })).toBeTruthy();
    expect(rail.getByRole('button', { name: copy.reading.showStory })).toBeTruthy();
  });

  it('el micrófono muestra el estado en palabras del niño, no términos técnicos', () => {
    scene({ reading: readingState() });
    expect(screen.getByText(copy.mic.waiting)).toBeTruthy();
    cleanup();
    scene({ reading: readingState({ type: 'pause.detected', duration: 5200 }) });
    expect(screen.getAllByText(copy.mic.longPause).length).toBeGreaterThan(0);
  });

  it('el tiempo LEÍDO se ve siempre, contando hacia arriba (docs/06: sin meta del padre, no hay cuenta atrás)', () => {
    scene({ elapsedSeconds: 125 });
    expect(screen.getByText(formatDuration(125))).toBeTruthy(); // "2:05"
    cleanup();
    scene({ collapsed: true, elapsedSeconds: 65 });
    expect(screen.getByText(formatDuration(65))).toBeTruthy(); // riel colapsado: también se ve
  });
});

describe('SessionScene — tarjetas', () => {
  it('preparación: título y consejos según la audiencia; "Comenzar lectura" empieza', () => {
    const { actions } = scene({ screen: 'prep', reading: createSessionState(N) });
    expect(screen.getByText(copy.prep.title.explorador)).toBeTruthy();
    for (const tip of copy.prep.tips.explorador) expect(screen.getByText(tip.text)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.prep.start }));
    expect(actions.onBegin).toHaveBeenCalledTimes(1);
    cleanup();
    scene({ screen: 'prep', reading: createSessionState(N), prefs: lector });
    expect(screen.getByText(copy.prep.title.lector)).toBeTruthy();
  });

  it('ayuda: sílabas, definición, y "¡Ya puedo!" / "Escuchar otra vez" avisan', () => {
    const puerta = words.find((w) => w.normalized === 'puerta')!;
    const { actions } = scene({ reading: readingState({ type: 'help.requested', wordIndex: puerta.index }) });
    expect(screen.getByText('puer')).toBeTruthy();
    expect(screen.getByText('ta')).toBeTruthy();
    expect(screen.getByText(/Una puerta es una entrada/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.help.done }));
    expect(actions.onCloseHelp).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: copy.help.listenAgain }));
    expect(actions.onPronounce).toHaveBeenCalled();
  });

  it('ayuda para el Lector añade el sinónimo', () => {
    const enorme = words.find((w) => w.normalized === 'enorme')!;
    scene({ prefs: lector, reading: readingState({ type: 'help.requested', wordIndex: enorme.index }) });
    expect(screen.getByText(/Sinónimo: gigante/)).toBeTruthy();
  });

  it('pausa larga: nube con "Léeme el comienzo" y "Ayúdame con «palabra»"', () => {
    const { actions } = scene({ reading: readingState({ type: 'pause.detected', duration: 5200 }) });
    fireEvent.click(screen.getByRole('button', { name: copy.reading.readStartButton }));
    expect(actions.onReadStart).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: copy.reading.helpWith('El') }));
    expect(actions.onAskHelp).toHaveBeenCalled();
  });

  it('fin de página: solo un aviso que se ve y ya, sin botón ni velo oscuro (avanza sola, no hace falta tocar nada)', () => {
    scene({ screen: 'pageDone', reading: readingState({ type: 'page.completed' }) });
    expect(screen.getByText(copy.pageDone.title)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Siguiente página/ })).toBeNull();
    expect(document.querySelector('.bg-\\[rgb\\(18_22_40\\/\\.45\\)\\]')).toBeNull(); // sin velo oscuro
  });
});

describe('SessionScene — pregunta y repaso', () => {
  const done = readingState({ type: 'page.completed' });

  it('pregunta (Explorador): 3 opciones con arte; "Continuar" bloqueado hasta acertar; sin "Incorrecto"', () => {
    const { actions, rerender } = scene({ screen: 'question', reading: done });
    expect(screen.getByText('¿Qué encontró el conejo en medio del bosque?')).toBeTruthy();
    const cont = screen.getByRole('button', { name: copy.question.continue }) as HTMLButtonElement;
    expect(cont.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Un bosque/ }));
    expect(actions.onPickAnswer).toHaveBeenCalledWith(0);
    void rerender;
  });

  it('pregunta acertada: "Continuar" se habilita, la respuesta queda fija y la felicitación aparece', () => {
    const { actions } = scene({ screen: 'question', reading: done, answer: 1 });
    expect(screen.getByText('¡Exacto! Encontró una puerta azul.')).toBeTruthy();
    const cont = screen.getByRole('button', { name: copy.question.continue }) as HTMLButtonElement;
    expect(cont.disabled).toBe(false);
    fireEvent.click(cont);
    expect(actions.onContinue).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Un bosque/ }));
    expect(actions.onPickAnswer).not.toHaveBeenCalled(); // ya acertó: fija
  });

  it('pregunta con respuesta equivocada: solo una pista amable', () => {
    scene({ screen: 'question', reading: done, answer: 0 });
    expect(screen.getByText('Casi. Mira el dibujo otra vez.')).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/incorrect/i);
  });

  it('pregunta (Lector): opciones de texto con letras A B C', () => {
    scene({ screen: 'question', reading: done, prefs: lector });
    expect(screen.getByText('¿Por qué crees que el conejo respiró hondo antes de abrir la puerta?')).toBeTruthy();
    for (const l of ['A', 'B', 'C']) expect(screen.getByText(l)).toBeTruthy();
  });

  it('repaso: fichas mezcladas; tocar una avisa; "Siguiente" bloqueado hasta completar la palabra', () => {
    const review = createReview([{ key: 'puerta', syllables: ['puer', 'ta'] }]);
    const { actions } = scene({ screen: 'review', reading: done, review });
    expect(screen.getByText(copy.review.titleKid)).toBeTruthy();
    const tiles = tilesOf(review.words[0]);
    fireEvent.click(screen.getByRole('button', { name: tiles[0] }));
    expect(actions.onReviewTap).toHaveBeenCalledWith(0);
    expect((screen.getByRole('button', { name: copy.review.finish }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('Regla de docs/06: el niño nunca ve "Incorrecto" ni lenguaje técnico', () => {
  const BANNED = /incorrect|error|confidence|confianza|pausa detectada|puntaje|calificaci/i;
  const cases: Array<[string, Parameters<typeof scene>[0]]> = [
    ['esperando voz', { reading: readingState() }],
    ['leyendo', { reading: readingState({ type: 'word.correct', wordIndex: 0 }) }],
    ['pausa corta', { reading: readingState({ type: 'pause.detected', duration: 1800 }) }],
    ['pausa larga', { reading: readingState({ type: 'pause.detected', duration: 5200 }) }],
    ['dudosa', { reading: readingState({ type: 'word.uncertain', wordIndex: 0 }) }],
    ['incorrecta', { reading: readingState({ type: 'word.incorrect', wordIndex: 0 }) }],
    ['repetida', { reading: readingState({ type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 }) }],
    ['saltada', { reading: readingState({ type: 'word.skipped', wordIndex: 0 }) }],
    ['ayuda', { reading: readingState({ type: 'help.requested', wordIndex: 3 }) }],
    ['léeme el comienzo', { reading: readingState({ type: 'help.requested', wordIndex: 0, kind: 'read-start' }) }],
    ['fin de página', { screen: 'pageDone', reading: readingState({ type: 'page.completed' }) }],
    ['pregunta equivocada', { screen: 'question', reading: readingState({ type: 'page.completed' }), answer: 0 }],
  ];
  for (const audience of ['explorador', 'lector'] as const) {
    for (const [name, over] of cases) {
      it(`${audience} · ${name}`, () => {
        scene({ ...over, prefs: { ...defaultPrefs, audience } });
        expect(document.body.textContent).not.toMatch(BANNED);
      });
    }
  }
});

describe('Inicio, ficha, progreso y fin', () => {
  const progress: ProgressData = {
    childName: 'Alex',
    starsTotal: 12,
    storiesRead: 5,
    totalMinutes: 28,
    accuracy: 89,
    streakDays: 4,
    dailyGoalMinutes: 10,
    week: [{ day: 'Lun', minutes: 8 }, { day: 'Mar', minutes: 12 }],
    practicedWords: ['puerta'],
    badges: [{ label: 'Primera historia', icon: '1', tone: 'violet' }],
  };

  it('Inicio: saludo, historias, niveles (sin bloqueos, docs/01) y "Continuar"', () => {
    const onContinue = vi.fn();
    const onGoSettings = vi.fn();
    render(
      <HomeScreen
        childName="Alex"
        streakDays={4}
        starsTotal={12}
        current={{ title: story.title, frame: 3, totalFrames: 10, image: page.illustration }}
        stories={[{ id: 'a', title: story.title, meta: 'Nivel 1', stars: 3, status: 'new', cover: story.cover }, { id: 'b', title: 'Otra', meta: 'Nivel 2', stars: 0, status: 'read', placeholder: 'Portada' }]}
        levels={levelTilesFor(1)}
        onContinue={onContinue}
        onGoHome={noop}
        onGoLibrary={noop}
        onGoProgress={noop}
        onGoSettings={onGoSettings}
      />,
    );
    expect(screen.getByText('¡Hola, Alex!')).toBeTruthy();
    expect(screen.getByText('Tu nivel')).toBeTruthy(); // el nivel 1 (actual) se marca; nadie está "Bloqueado" (docs/01: el padre elige libremente)
    expect(screen.queryByText('Bloqueado')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(onContinue).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: copy.nav.settings }));
    expect(onGoSettings).toHaveBeenCalled();
  });

  it('ficha: datos de la historia, "Comenzar" y panel colapsable', () => {
    const onStart = vi.fn();
    const onToggle = vi.fn();
    render(<SelectScreen story={story} page={page} words={words} reading={createSessionState(N)} prefs={defaultPrefs} panelOpen onTogglePanel={onToggle} onBack={noop} onStart={onStart} />);
    expect(screen.getByText('10 cuadros para leer')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.select.start }));
    expect(onStart).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: copy.select.hidePanel }));
    expect(onToggle).toHaveBeenCalled();
  });

  it('progreso: la "Precisión" queda tras el interruptor (docs/09 #4)', () => {
    const { rerender } = render(<ProgressScreen data={progress} tab={0} showAccuracy onTab={noop} onBack={noop} onGoHome={noop} onGoLibrary={noop} onGoSettings={noop} />);
    expect(screen.getByText('Precisión')).toBeTruthy();
    rerender(<ProgressScreen data={progress} tab={0} showAccuracy={false} onTab={noop} onBack={noop} onGoHome={noop} onGoLibrary={noop} onGoSettings={noop} />);
    expect(screen.queryByText('Precisión')).toBeNull();
  });

  it('fin: estrellas solo para Explorador; botones', () => {
    const onAgain = vi.fn();
    const props = { page, stars: 3 as const, stats: [{ label: 'Tiempo', value: '4:32' }], practiced: ['puerta'], onAgain, onNext: noop };
    const { container } = render(<EndScreen audience="explorador" {...props} />);
    expect(container.querySelectorAll('img[src*="mascot"]').length).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: copy.end.again }));
    expect(onAgain).toHaveBeenCalled();
    cleanup();
    const { container: c2 } = render(<EndScreen audience="lector" {...props} />);
    expect(c2.querySelectorAll('img[src*="mascot"]').length).toBe(0);
  });
});

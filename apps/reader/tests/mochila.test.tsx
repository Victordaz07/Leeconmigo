// @vitest-environment jsdom
/**
 * "Mi mochila hace ¡achís!": la primera historia real, con 6 variantes (es/en × niveles 1–3) que comparten el arte.
 * Comprueba que una familia sale como UNA tarjeta, que el idioma y el nivel del perfil eligen la variante, y que se lee entera.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReadingProfile } from '@lee-conmigo/contracts';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { tokenizePage } from '@lee-conmigo/story-engine';
import { App } from '../src/App.tsx';
import { createBundledRepository } from '../src/bundled-stories.ts';
import { DEFAULT_PROFILE, PROFILE_STORAGE_KEY, loadProfile, readStoredProfile, saveProfile } from '../src/profile.ts';

const repository = createBundledRepository(true);
let store: MemoryProgressStore;
beforeEach(() => {
  vi.useFakeTimers();
  store = new MemoryProgressStore();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderApp = (profile: ReadingProfile = DEFAULT_PROFILE, onProfileChange: (p: ReadingProfile) => void = () => {}) =>
  render(<App repository={repository} store={store} profile={profile} onProfileChange={onProfileChange} />);
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const dev = () => within(screen.getByLabelText('Panel de desarrollo'));
const canvas = () => within(screen.getByTestId('tablet-canvas'));

describe('la familia "Mi mochila hace ¡achís!" en el catálogo', () => {
  it('hay 6 variantes de una misma familia, con arte y esqueleto compartidos', () => {
    const family = repository.list().filter((e) => e.familyId === 'mi-mochila-hace-achis');
    expect(family.map((e) => `${e.language}-n${e.level}`).sort()).toEqual(['en-n1', 'en-n2', 'en-n3', 'es-n1', 'es-n2', 'es-n3']);
    expect(new Set(family.map((e) => `${e.pageCount}/${e.blockCount}`))).toEqual(new Set(['3/7']));
  });

  it('Inicio muestra UNA tarjeta por historia (no seis): la variante del perfil', () => {
    renderApp();
    // (la historia destacada aparece también en el banner; las tarjetas son botones)
    expect(screen.getAllByRole('button', { name: /Mi mochila hace/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /La luna y la puerta azul/ })).toHaveLength(1);
    expect(screen.queryAllByText('My Backpack Keeps Sneezing!')).toHaveLength(0); // no mezcla idiomas
  });

  it('el perfil en inglés muestra las historias en inglés y su nivel', () => {
    renderApp({ language: 'en', level: 3 });
    const card = screen.getByRole('button', { name: /My Backpack Keeps Sneezing/ });
    expect(within(card).getByText('Nivel 3')).toBeTruthy();
    expect(screen.queryAllByText('Mi mochila hace ¡achís!')).toHaveLength(0);
    expect(screen.queryAllByText('La luna y la puerta azul')).toHaveLength(0); // solo existe en español
  });

  it('cambiar idioma y nivel desde el panel de desarrollo cambia la tarjeta y se recuerda', () => {
    const saved: ReadingProfile[] = [];
    renderApp(DEFAULT_PROFILE, (p) => saved.push(p));
    click(/DEV/);
    fireEvent.click(dev().getByRole('button', { name: 'English' }));
    fireEvent.click(dev().getByRole('button', { name: 'Nivel 2' }));
    expect(saved).toEqual([{ language: 'en', level: 1 }, { language: 'en', level: 2 }]);
    expect(canvas().getByRole('button', { name: /My Backpack Keeps Sneezing/ })).toBeTruthy();
    fireEvent.click(dev().getByRole('button', { name: 'Español' }));
    expect(canvas().getByRole('button', { name: /Mi mochila hace/ })).toBeTruthy();
  });
});

describe('leer la historia completa', () => {
  it.each([
    ['es', 1],
    ['en', 3],
  ] as const)('variante %s nivel %i: 3 páginas con su pregunta, repaso y final; el resumen queda con la variante correcta', (language, level) => {
    renderApp({ language, level });
    const story = repository.get(`mi-mochila-hace-achis-${language}-n${level}`)!;
    click(new RegExp(story.title.replace(/[¡!¿?]/g, '.')));
    click('Comenzar');
    click('Comenzar lectura');
    click(/DEV/);

    story.pages.forEach((page, i) => {
      expect(canvas().getByText(`Página ${i + 1} de 3`)).toBeTruthy();
      fireEvent.click(dev().getByRole('button', { name: /Leer automáticamente/ }));
      advance(tokenizePage(page).length * 520 + 1500);
      advance(1000); // en un segundo "tick" aparte: que el aviso de "página completa" termine de pasarse solo
      const q = page.checkpoint!.variants.find((v) => v.audience === 'explorador')!;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(q.options[q.correctIndex].text) }));
      click('Continuar');
    });

    // Repaso por sílabas de las palabras base de la historia
    expect(canvas().getByText('Repaso rápido')).toBeTruthy();
    const tiles = () => [...screen.getByTestId('tablet-canvas').querySelectorAll<HTMLButtonElement>('button.font-read')];
    while (!screen.queryByText('¡Terminaste la historia!')) {
      const texts = tiles().map((t) => t.textContent!);
      const key = Object.keys(story.vocabulary).find((k) => story.vocabulary[k].syllables?.length === texts.length && [...story.vocabulary[k].syllables!].sort().join('|') === [...texts].sort().join('|'))!;
      for (const syl of story.vocabulary[key].syllables!) fireEvent.click(tiles()[texts.indexOf(syl)]);
      const [, i, total] = canvas().getByText(/^Palabra [0-9] de [0-9]$/).textContent!.match(/([0-9]) de ([0-9])/)!;
      click(i === total ? 'Terminar' : 'Siguiente');
    }

    const [summary] = store.summaries();
    expect(summary).toMatchObject({ storyId: story.id, language, level, completion: 1, comprehensionTotal: 3, comprehensionCorrect: 3 });
    expect(store.latestResumePoint()).toBeNull();
  });
});

describe('perfil de lectura (idioma y nivel)', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  };

  it('por defecto: español, nivel 1', () => {
    expect(loadProfile('', memory())).toEqual({ language: 'es', level: 1 });
  });

  it('la URL manda (?lang=en&level=2) y se recuerda para la próxima vez', () => {
    const st = memory();
    expect(loadProfile('?lang=en&level=2', st)).toEqual({ language: 'en', level: 2 });
    expect(loadProfile('', st)).toEqual({ language: 'en', level: 2 });
    expect(loadProfile('?level=3', st)).toEqual({ language: 'en', level: 3 }); // solo cambia lo que dice la URL
  });

  it('valores inválidos se ignoran (idioma desconocido, nivel fuera de 1–6 o no entero)', () => {
    const st = memory();
    for (const bad of ['?lang=fr', '?level=0', '?level=7', '?level=2.5', '?level=abc', '?level=']) expect(loadProfile(bad, st)).toEqual({ language: 'es', level: 1 });
  });

  it('datos guardados corruptos o parciales no rompen', () => {
    const st = memory();
    st.data.set(PROFILE_STORAGE_KEY, '{no json');
    expect(readStoredProfile(st)).toEqual(DEFAULT_PROFILE);
    st.data.set(PROFILE_STORAGE_KEY, JSON.stringify({ language: 'en' }));
    expect(readStoredProfile(st)).toEqual({ language: 'en', level: 1 });
    saveProfile({ language: 'es', level: 3 }, st);
    expect(readStoredProfile(st)).toEqual({ language: 'es', level: 3 });
    expect(() => saveProfile({ language: 'es', level: 3 }, { getItem: () => null, setItem: () => { throw new Error('cuota'); } })).not.toThrow();
  });
});

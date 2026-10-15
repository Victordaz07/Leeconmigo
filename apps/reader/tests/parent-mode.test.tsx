// @vitest-environment jsdom
/**
 * "Modo padres" (docs/01, docs/09 #1/#3): el engranaje de Inicio pide un PIN (se crea la primera vez), y desde ahí
 * se cambia idioma, nivel (libremente, sin desbloqueos) y meta diaria — sin perder la sesión de lectura ni el
 * progreso guardado.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { InMemoryStoryRepository, pilotStory } from '@lee-conmigo/story-engine';
import { App } from '../src/App.tsx';

let store: MemoryProgressStore;
beforeEach(() => {
  store = new MemoryProgressStore();
  localStorage.clear();
});
afterEach(cleanup);

const repository = new InMemoryStoryRepository([pilotStory]);
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const canvas = () => within(screen.getByTestId('tablet-canvas'));
const openSettings = () => click('Ajustes');
const type4 = (digits: string) => [...digits].forEach((d) => click(d));

describe('Modo padres: primera vez (crear PIN)', () => {
  it('pide el PIN dos veces, guarda uno nuevo y entra directo a los ajustes', () => {
    render(<App repository={repository} store={store} />);
    openSettings();
    expect(canvas().getByText('Crea un PIN')).toBeTruthy();
    type4('1234');
    expect(canvas().getByText('Escríbelo otra vez')).toBeTruthy();
    type4('1234');
    expect(canvas().getByText('Modo padres')).toBeTruthy(); // ya adentro
  });

  it('"Volver" en el candado no crea ningún PIN y regresa a Inicio tal cual', () => {
    render(<App repository={repository} store={store} />);
    openSettings();
    click('Volver');
    expect(canvas().getByText('¡Hola, Noah!')).toBeTruthy();
  });
});

describe('Modo padres: cambiar nivel, idioma y meta diaria', () => {
  it('cambia el nivel y se ve reflejado en Inicio (sin "Bloqueado", docs/01)', () => {
    render(<App repository={repository} store={store} profile={{ language: 'es', level: 1 }} onProfileChange={() => {}} />);
    openSettings();
    type4('1234'); // crear
    type4('1234'); // confirmar
    click(/Nivel 4/);
    click('Volver a Inicio');
    expect(canvas().getByText('Tu nivel').parentElement?.textContent).toContain('Nivel 4');
  });

  it('cambia el idioma del perfil desde Modo padres (se guarda con el mismo mecanismo que el nivel)', () => {
    const saved: Array<{ language: string; level: number }> = [];
    render(<App repository={repository} store={store} profile={{ language: 'es', level: 1 }} onProfileChange={(p) => saved.push(p)} />);
    openSettings();
    type4('1234');
    type4('1234');
    click('English');
    expect(saved).toEqual([{ language: 'en', level: 1 }]);
    click('Volver a Inicio');
    expect(canvas().getByText('¡Hola, Noah!')).toBeTruthy(); // sigue en Inicio, con normalidad
  });

  it('la meta diaria elegida se guarda en el dispositivo (persiste tras recargar la app)', () => {
    const { unmount } = render(<App repository={repository} store={store} />);
    openSettings();
    type4('1234');
    type4('1234');
    click('20 min');
    unmount();

    render(<App repository={repository} store={store} />);
    openSettings();
    type4('1234'); // el PIN ya existía: una sola vez basta
    expect(screen.getByRole('button', { name: '20 min' }).className).toMatch(/text-white/); // sigue marcada
  });
});

describe('Modo padres: PIN incorrecto y cambio de PIN', () => {
  it('un PIN equivocado no deja entrar; el correcto sí', () => {
    const { unmount } = render(<App repository={repository} store={store} />);
    openSettings();
    type4('1234');
    type4('1234');
    unmount();

    render(<App repository={repository} store={store} />);
    openSettings();
    type4('0000');
    expect(canvas().getByText('No coincide. Intenta de nuevo.')).toBeTruthy();
    type4('1234');
    expect(canvas().getByText('Modo padres')).toBeTruthy();
  });

  it('"Cambiar PIN" borra el anterior y pide crear uno nuevo la próxima vez', () => {
    const { unmount } = render(<App repository={repository} store={store} />);
    openSettings();
    type4('1234');
    type4('1234');
    click('Cambiar PIN');
    expect(canvas().getByText('Crea un PIN')).toBeTruthy(); // ya, en el momento, porque se borró
    type4('5678');
    type4('5678');
    unmount();

    render(<App repository={repository} store={store} />);
    openSettings();
    type4('1234'); // el viejo ya no sirve
    expect(canvas().getByText('No coincide. Intenta de nuevo.')).toBeTruthy();
    type4('5678');
    expect(canvas().getByText('Modo padres')).toBeTruthy();
  });
});

// @vitest-environment jsdom
/**
 * Pantalla "Biblioteca" (docs/08 Fase G): antes el ícono del `NavRail` abría por error la ficha de una sola
 * historia (la destacada de Inicio); ahora abre una pantalla propia con TODAS las historias reales disponibles
 * para el idioma/nivel actual, sin el cupo ni las tarjetas de relleno de "Mis historias" en Inicio.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { App } from '../src/App.tsx';
import { createBundledRepository } from '../src/bundled-stories.ts';

const repository = createBundledRepository(false); // como la versión para niños: sin historias de prueba
// El título en español de cada familia (las pruebas fijan el perfil a español, nivel 1).
const familyTitles = [...new Map(repository.list().filter((e) => e.language === 'es').map((e) => [e.familyId, e.title])).values()];
const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let store: MemoryProgressStore;
beforeEach(() => {
  store = new MemoryProgressStore();
});
afterEach(cleanup);

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const canvas = () => within(screen.getByTestId('tablet-canvas'));
const renderApp = () => render(<App repository={repository} store={store} profile={{ language: 'es', level: 1 }} onProfileChange={() => {}} />);

describe('Biblioteca', () => {
  it('el ícono "Biblioteca" de Inicio abre una lista con TODAS las historias reales, no la ficha de una sola', () => {
    renderApp();
    click('Biblioteca');
    expect(canvas().getByRole('heading', { name: 'Biblioteca' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Comenzar' })).toBeNull(); // eso es de la ficha, no de la lista
    for (const title of familyTitles) expect(canvas().getByRole('button', { name: new RegExp(escape(title)) })).toBeTruthy();
  });

  it('"Ver todas" en la cuadrícula de Inicio también abre la Biblioteca', () => {
    renderApp();
    click(/Ver todas/);
    expect(canvas().getByRole('heading', { name: 'Biblioteca' })).toBeTruthy();
  });

  it('tocar una historia en la Biblioteca abre su ficha (no se queda en la lista)', () => {
    renderApp();
    click('Biblioteca');
    click(new RegExp(escape(familyTitles[0])));
    expect(canvas().getByRole('button', { name: 'Comenzar' })).toBeTruthy();
    expect(screen.queryByText('Biblioteca')).toBeNull();
  });

  it('"Volver" en la Biblioteca regresa a Inicio sin perder nada', () => {
    renderApp();
    click('Biblioteca');
    click('Volver');
    expect(canvas().getByText('¡Hola, Noah!')).toBeTruthy();
  });

  it('desde Progreso, "Biblioteca" también abre la lista completa, y su ícono "Inicio" lleva a Inicio', () => {
    renderApp();
    click('Logros');
    expect(canvas().getByText('Mi progreso')).toBeTruthy();
    click('Biblioteca');
    expect(canvas().getByRole('heading', { name: 'Biblioteca' })).toBeTruthy();
    click('Inicio');
    expect(canvas().getByText('¡Hola, Noah!')).toBeTruthy();
  });
});

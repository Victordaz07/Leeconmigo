// @vitest-environment jsdom
/**
 * Prueba de humo de TODA la biblioteca: cada historia real se lee completa con el FakeReadingEngine, en dos de sus variantes (la
 * primera y la última: cubre los dos idiomas). Así, cualquier historia nueva que se agregue queda probada sin escribir código:
 * abre desde Inicio, lee todas sus páginas, contesta la pregunta cuando toca (como mucho 3 por historia: `selectCheckpointPages`),
 * hace el repaso y termina con el resumen correcto.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryProgressStore, selectCheckpointPages } from '@lee-conmigo/session-engine';
import { tokenizePage } from '@lee-conmigo/story-engine';
import { App } from '../src/App.tsx';
import { createBundledRepository } from '../src/bundled-stories.ts';

const repository = createBundledRepository(false); // como la versión para niños: sin historias de prueba
const entries = repository.list();
const families = [...new Set(entries.map((e) => e.familyId))];
const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let store: MemoryProgressStore;
beforeEach(() => {
  vi.useFakeTimers();
  store = new MemoryProgressStore();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const canvas = () => within(screen.getByTestId('tablet-canvas'));

/** Las variantes que se prueban de una familia: la primera y la última (distintos idiomas cuando hay en y es). */
const picks = families.flatMap((f) => {
  const variants = entries.filter((e) => e.familyId === f);
  return [...new Set([variants[0], variants[variants.length - 1]])].map((v) => [f, v.id] as const);
});

describe('la biblioteca completa', () => {
  it('hay historias reales cargadas y ninguna de prueba', () => {
    expect(families.length).toBeGreaterThanOrEqual(3);
    expect(entries.some((e) => e.dev)).toBe(false);
  });

  it.each(picks)('familia %s · variante %s: se lee entera, con sus preguntas (como mucho 3), el repaso y el resumen correcto', (_family, variantId) => {
    const story = repository.get(variantId)!;
    render(<App repository={repository} store={store} profile={{ language: story.language, level: story.level }} onProfileChange={() => {}} />);

    click(new RegExp(escape(story.title)));
    click('Comenzar');
    click('Comenzar lectura');
    click(/DEV/);

    const total = story.pages.length;
    const checkpointPages = selectCheckpointPages(story.pages); // como mucho 3 por historia: ver `selectCheckpointPages`
    story.pages.forEach((page, i) => {
      if (total > 1) expect(canvas().getByText(`Página ${i + 1} de ${total}`), `${variantId}: indicador de página`).toBeTruthy();
      fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /Leer automáticamente/ }));
      advance(tokenizePage(page).length * 520 + 1500);
      advance(1000); // en un segundo "tick" aparte: que el aviso de "página completa" termine de pasarse solo
      if (page.checkpoint && checkpointPages.has(i)) {
        const q = page.checkpoint.variants.find((v) => v.audience === 'explorador')!;
        // Acotado al lienzo: el panel DEV lista los títulos de TODAS las historias, y una respuesta corta (p. ej.
        // "El puente") puede coincidir con el título de otra historia ("El puente de Lolo") si se busca sin acotar.
        fireEvent.click(canvas().getByRole('button', { name: new RegExp(escape(q.options[q.correctIndex].text)) }));
        click('Continuar');
      }
    });

    // Repaso por sílabas con las palabras base de la historia
    expect(canvas().getByText('Repaso rápido'), `${variantId}: repaso`).toBeTruthy();
    const tiles = () => [...screen.getByTestId('tablet-canvas').querySelectorAll<HTMLButtonElement>('button.font-read')];
    let guard = 0;
    while (!screen.queryByText('¡Terminaste la historia!') && guard++ < 6) {
      const texts = tiles().map((t) => t.textContent!);
      const key = Object.keys(story.vocabulary).find((k) => story.vocabulary[k].syllables?.length === texts.length && [...story.vocabulary[k].syllables!].sort().join('|') === [...texts].sort().join('|'))!;
      for (const syl of story.vocabulary[key].syllables!) fireEvent.click(tiles()[texts.indexOf(syl)]);
      const [, i, n] = canvas().getByText(/^Palabra [0-9] de [0-9]$/).textContent!.match(/([0-9]) de ([0-9])/)!;
      click(i === n ? 'Terminar' : 'Siguiente');
    }
    expect(screen.getByText('¡Terminaste la historia!')).toBeTruthy();

    const [summary] = store.summaries();
    const questions = checkpointPages.size;
    expect(summary).toMatchObject({ storyId: story.id, language: story.language, level: story.level, completion: 1, comprehensionTotal: questions, comprehensionCorrect: questions });
    expect(store.latestResumePoint()).toBeNull();
  });
});

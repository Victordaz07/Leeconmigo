// @vitest-environment jsdom
/**
 * Recorrido completo de la app (Checkpoint 1 de docs/08-ROADMAP.md) con el FakeReadingEngine:
 * abrir historia → iniciar lectura → seguir palabra actual → pausa → error → ayuda → terminar página →
 * pregunta de comprensión → repaso por sílabas → fin de historia → volver al inicio.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryProgressStore } from '@lee-conmigo/session-engine';
import { InMemoryStoryRepository, pilotStory } from "@lee-conmigo/story-engine";
import { App } from '../src/App.tsx';

// Estos recorridos son de la historia piloto: con más historias en la biblioteca, la destacada de Inicio ya no sería la piloto.
const pilotOnly = new InMemoryStoryRepository([pilotStory]);
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
const openDev = () => click(/DEV/);
// Anclado al inicio: "Pausa larga" también aparece en el botón de salto "06 Pausa larga".
const sim = (label: string) => within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: new RegExp(`^${label}`) });
const isCurrentWord = (el: HTMLElement) => el.style.background === 'var(--color-focus)';

const canvas = () => within(screen.getByTestId('tablet-canvas'));

/**
 * Arma la palabra que muestra el repaso: lee las fichas (mezcladas) del DOM, averigua de qué palabra del
 * vocabulario son y las toca en el orden correcto de sílabas. Devuelve la palabra.
 */
function assembleCurrentWord(): string {
  const tiles = [...screen.getByTestId('tablet-canvas').querySelectorAll<HTMLButtonElement>('button.font-read')];
  const texts = tiles.map((t) => t.textContent!);
  const sorted = (a: string[]) => [...a].sort().join('|');
  const key = Object.keys(pilotStory.vocabulary).find((k) => pilotStory.vocabulary[k].syllables && sorted(pilotStory.vocabulary[k].syllables!) === sorted(texts));
  if (!key) throw new Error(`No se reconoce la palabra del repaso con fichas: ${texts.join(', ')}`);
  for (const syl of pilotStory.vocabulary[key].syllables!) fireEvent.click(tiles[texts.indexOf(syl)]);
  return key;
}

describe('recorrido completo con el FakeReadingEngine', () => {
  it('Inicio → ficha → preparación → lectura → fin de página → pregunta → repaso → fin → Inicio', () => {
    render(<App store={store} repository={pilotOnly} />);

    // Inicio: sin nada a medias, la historia se sugiere para empezar
    expect(screen.getByText('¡Hola, Noah!')).toBeTruthy();
    expect(screen.getByText('Empieza aquí')).toBeTruthy();
    click(/Comenzar/);

    // Ficha de la historia
    expect(screen.getByText('10 cuadros para leer')).toBeTruthy();
    click('Comenzar');

    // Preparación → empezar
    expect(screen.getByText('¡Vamos a leer!')).toBeTruthy();
    click('Comenzar lectura');
    expect(screen.getByText('Listo para escuchar')).toBeTruthy(); // esperando voz

    // Simulador: leer, pausar, equivocarse, pedir ayuda, terminar
    openDev();
    fireEvent.click(sim('Palabra correcta'));
    expect(screen.getAllByText('Te escucho').length).toBeGreaterThan(0);
    const aside = () => within(document.querySelector('aside') as HTMLElement);
    expect(aside().getAllByText('pequeño').some(isCurrentWord)).toBe(true); // la palabra actual está marcada

    fireEvent.click(sim('Pausa larga'));
    expect(screen.getByText(/¿Necesitas ayuda\?/)).toBeTruthy(); // nube de la pausa larga
    fireEvent.click(sim('Palabra incorrecta'));
    expect(screen.getByTestId('tablet-canvas').textContent).not.toMatch(/incorrect/i); // la regla es para la UI del niño, no para el panel de desarrollo
    fireEvent.click(sim('Pide ayuda'));
    expect(screen.getByRole('button', { name: '¡Ya puedo!' })).toBeTruthy(); // modal de ayuda abierto
    click('¡Ya puedo!');
    expect(screen.queryByRole('button', { name: '¡Ya puedo!' })).toBeNull();

    // Lectura automática hasta terminar la página (144 palabras · ~520 ms cada una)
    fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /Leer automáticamente/ })); // su texto empieza con un símbolo
    advance(90_000);
    advance(1000); // en un "tick" aparte: que el aviso de "página completa" termine de pasarse solo, a la pregunta

    // Pregunta de comprensión: una respuesta equivocada solo da una pista; "Continuar" sigue bloqueado
    expect(screen.getByText('¿Qué encontró el conejo en medio del bosque?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Un bosque/ }));
    expect(screen.getByText('Casi. Mira el dibujo otra vez.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Continuar' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Una puerta azul/ }));
    expect(screen.getByText('¡Exacto! Encontró una puerta azul.')).toBeTruthy();
    click('Continuar');

    // Repaso por sílabas: cada palabra se arma ordenando sus sílabas; una ficha equivocada no penaliza
    expect(canvas().getByText('Repaso rápido')).toBeTruthy();
    const armed: string[] = [];
    while (!screen.queryByText('¡Terminaste la historia!')) {
      const [, i, total] = canvas().getByText(/^Palabra [0-9] de [0-9]$/).textContent!.match(/([0-9]) de ([0-9])/)!;
      expect((canvas().getByRole('button', { name: i === total ? 'Terminar' : 'Siguiente' }) as HTMLButtonElement).disabled).toBe(true); // incompleta
      armed.push(assembleCurrentWord());
      expect((canvas().getByRole('button', { name: i === total ? 'Terminar' : 'Siguiente' }) as HTMLButtonElement).disabled).toBe(false);
      click(i === total ? 'Terminar' : 'Siguiente');
      expect(armed.length).toBeLessThan(6);
    }
    expect(armed.length).toBeGreaterThanOrEqual(3);

    // Fin de historia
    expect(screen.getByText('¡Terminaste la historia!')).toBeTruthy();
    expect(screen.getByText('Tiempo')).toBeTruthy();
    click('Siguiente historia');
    expect(screen.getByText('¡Hola, Noah!')).toBeTruthy();
  });

  it('el panel de desarrollo salta a cualquiera de los 20 estados y cada uno muestra lo esperado', () => {
    render(<App store={store} repository={pilotOnly} />);
    openDev();
    const jump = (n: number) => fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: new RegExp(`^${String(n).padStart(2, '0')} `) }));
    const expects: Record<number, string | RegExp> = {
      1: '10 cuadros para leer',
      2: '¡Vamos a leer!',
      3: 'Listo para escuchar',
      5: 'En pausa',
      6: 'Te espero',
      7: 'Inténtalo otra vez, despacito.',
      8: /Casi\. Escuchemos/,
      9: 'Muy bien, sigue adelante.',
      10: /si quieres escucharla/,
      11: '¡Ya puedo!',
      13: '¡Muy bien! Sigue leyendo.',
      14: '¡Página terminada!',
      15: '¿Qué encontró el conejo en medio del bosque?',
      16: '¡Terminaste la historia!',
      17: '¡Hola, Noah!',
      18: 'Mi progreso',
      20: 'Repaso rápido',
    };
    for (const [n, text] of Object.entries(expects)) {
      jump(Number(n));
      expect(screen.getAllByText(text).length, `estado ${n}`).toBeGreaterThan(0);
    }
    jump(12); // pronunciación
    advance(3000);
    expect(screen.getByRole('button', { name: '¡Ya puedo!' })).toBeTruthy();
    jump(19); // te leo el comienzo
    advance(3000);
    expect(screen.getAllByText(/¡Ahora tú! Sigue desde/).length).toBeGreaterThan(0);
  });

  it('el Lector ve la variante de texto y sin estrellas', () => {
    render(<App store={store} repository={pilotOnly} />);
    openDev();
    fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /Lector/ }));
    fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /^15 / }));
    expect(screen.getByText('¿Por qué crees que el conejo respiró hondo antes de abrir la puerta?')).toBeTruthy();
    fireEvent.click(within(screen.getByLabelText('Panel de desarrollo')).getByRole('button', { name: /^16 / }));
    expect(screen.getByText('Palabras/min')).toBeTruthy();
  });
});

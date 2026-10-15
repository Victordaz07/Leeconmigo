// @vitest-environment jsdom
/**
 * El texto grande del panel lateral nunca se recorta: si el cuadro no cabe, se muestra frase por frase.
 * jsdom no calcula el diseño, así que las medidas (offsetHeight / clientHeight) se simulan.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createSessionState } from '@lee-conmigo/reading-engine';
import { tokenizePage } from '@lee-conmigo/story-engine';
import { BlockText, type BlockTextProps } from '../src/screens/block-text.tsx';
import { defaultPrefs } from '../src/types.ts';

const page = {
  id: 'p1',
  illustration: { src: 'x.webp', width: 100, height: 100 },
  blocks: [
    { id: 'b1', title: 'Uno', lines: ['El sol salió temprano.', 'Los pájaros cantaban.', 'Todo estaba tranquilo.'] },
    { id: 'b2', title: 'Dos', lines: ['Fin.'] },
  ],
};
const words = tokenizePage(page);

const measure = (inner: number, outer: number) => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => inner });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => outer });
};
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight');
});

const props = (over: Partial<BlockTextProps> = {}): BlockTextProps => ({
  words,
  blockIndex: 0,
  lineCount: 3,
  currentLine: 0,
  fontSize: 27,
  hidden: false,
  reading: { ...createSessionState(words.length), status: 'listening', hasHeardVoice: true },
  screen: 'reading',
  prefs: defaultPrefs,
  onTap: () => {},
  ...over,
});

describe('BlockText', () => {
  it('si el cuadro cabe, se ve entero (como en el prototipo) y sin indicador de frases', () => {
    measure(100, 300);
    render(<BlockText {...props()} />);
    expect(screen.getByText('salió')).toBeTruthy();
    expect(screen.getByText('cantaban.')).toBeTruthy();
    expect(screen.getByText('tranquilo.')).toBeTruthy();
    expect(screen.queryByRole('img', { name: /Frase/ })).toBeNull();
  });

  it('si NO cabe, muestra solo la frase actual, con su indicador; no oculta palabras de esa frase', () => {
    measure(900, 300);
    render(<BlockText {...props({ currentLine: 1 })} />);
    expect(screen.getByText('cantaban.')).toBeTruthy(); // la frase actual, completa
    expect(screen.getByText('Los')).toBeTruthy();
    expect(screen.queryByText('salió')).toBeNull(); // otras frases, fuera
    expect(screen.queryByText('tranquilo.')).toBeNull();
    expect(screen.getByRole('img', { name: 'Frase 2 de 3' })).toBeTruthy();
  });

  it('al pasar a la frase siguiente, la que aparece es la nueva (misma página y cuadro)', () => {
    measure(900, 300);
    const { rerender } = render(<BlockText {...props({ currentLine: 0 })} />);
    expect(screen.getByText('salió')).toBeTruthy();
    rerender(<BlockText {...props({ currentLine: 2 })} />);
    expect(screen.getByText('tranquilo.')).toBeTruthy();
    expect(screen.queryByText('salió')).toBeNull();
    expect(screen.getByRole('img', { name: 'Frase 3 de 3' })).toBeTruthy();
  });

  it('las palabras de la frase siguen siendo tocables (ayuda) en el modo frase a frase', () => {
    measure(900, 300);
    const tapped: number[] = [];
    render(<BlockText {...props({ currentLine: 1, onTap: (i) => tapped.push(i) })} />);
    screen.getByText('cantaban.').click();
    expect(tapped).toEqual([words.find((w) => w.text === 'cantaban.')!.index]);
  });

  it('un cuadro de una sola frase no lleva indicador, aunque no quepa (no hay a dónde avanzar)', () => {
    measure(900, 300);
    render(<BlockText {...props({ blockIndex: 1, lineCount: 1 })} />);
    expect(screen.getByText('Fin.')).toBeTruthy();
    expect(screen.queryByRole('img', { name: /Frase/ })).toBeNull();
  });
});

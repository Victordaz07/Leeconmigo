/**
 * Candado de "Modo padres" (docs/01, docs/09 #1): un PIN de 4 dígitos, sencillo a propósito — este es un proyecto
 * familiar sin cuentas, no hace falta más que evitar que el nivel o el idioma cambien sin querer al tocar la
 * pantalla. Sin PIN guardado, esta misma pantalla sirve para CREARLO (se pide dos veces, para no equivocarse).
 */
import { useState } from 'react';
import { copy } from '../copy.ts';
import { ChevronLeft } from '../icons.tsx';
import { cn } from '../lib.ts';

export interface ParentGateProps {
  /** false = todavía no hay PIN guardado: esta pantalla sirve para crear uno. */
  hasPin: boolean;
  /** Devuelve si el PIN escrito es el correcto. */
  onVerify: (pin: string) => boolean;
  /** Solo se llama cuando `hasPin` es false y el PIN se escribió igual las dos veces. */
  onCreate: (pin: string) => void;
  onCancel: () => void;
}

const DIGITS = 4;
const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function ParentGateScreen({ hasPin, onVerify, onCreate, onCancel }: ParentGateProps) {
  const t = copy.parentGate;
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [digits, setDigits] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const press = (key: string) => {
    if (key === '⌫') {
      setError(null);
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (!key || digits.length >= DIGITS) return;
    setError(null);
    const next = digits + key;
    setDigits(next);
    if (next.length < DIGITS) return;

    if (!hasPin) {
      if (stage === 'enter') {
        setFirstPin(next);
        setStage('confirm');
        setDigits('');
        return;
      }
      if (next === firstPin) return onCreate(next);
      setError(t.mismatch);
      setStage('enter');
      setFirstPin('');
      setDigits('');
      return;
    }

    if (onVerify(next)) return; // al entrar, este componente se desmonta
    setError(t.wrong);
    setDigits('');
  };

  const title = !hasPin ? (stage === 'enter' ? t.createTitle : t.confirmTitle) : t.enterTitle;
  const hint = !hasPin ? (stage === 'enter' ? t.createHint : t.confirmHint) : t.enterHint;

  return (
    <div className="absolute inset-0 z-10 flex animate-fade flex-col items-center justify-center gap-8 bg-app bg-(image:--grad-home-glow) px-6">
      <button
        type="button"
        onClick={onCancel}
        aria-label={t.cancel}
        className="absolute left-7 top-7 flex size-[52px] items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_10px_rgb(30_35_64/.12)]"
      >
        <ChevronLeft size={22} />
      </button>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[32px] font-black text-navy">{title}</h1>
        <p className="max-w-[380px] text-base font-bold text-muted">{hint}</p>
      </div>

      <div className="flex gap-4" role="status" aria-label={`${digits.length} de ${DIGITS}`}>
        {Array.from({ length: DIGITS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'size-5 rounded-full border-4 transition-colors',
              error ? 'border-warn bg-warn-tint' : i < digits.length ? 'border-brand bg-brand' : 'border-outline bg-transparent',
            )}
          />
        ))}
      </div>

      <div className="min-h-6 text-sm font-extrabold text-warn">{error}</div>

      <div className="grid grid-cols-3 gap-4">
        {KEYPAD.map((k, i) =>
          k ? (
            <button
              key={i}
              type="button"
              onClick={() => press(k)}
              aria-label={k === '⌫' ? 'Borrar' : k}
              className="flex size-20 items-center justify-center rounded-[24px] bg-white text-3xl font-black text-ink shadow-card transition-transform active:scale-95"
            >
              {k}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}

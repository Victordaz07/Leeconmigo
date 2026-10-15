import { describe, expect, it } from 'vitest';
import type { SpeechResult } from '@lee-conmigo/contracts';
import { ManualScheduler } from '@lee-conmigo/reading-engine';
import { FakeSpeechEngine } from '../src/index.ts';

async function setup(opts = {}) {
  const sched = new ManualScheduler();
  const engine = new FakeSpeechEngine({ scheduler: sched, ...opts });
  const partials: SpeechResult[] = [];
  const finals: SpeechResult[] = [];
  const voice: boolean[] = [];
  engine.onPartialResult((r) => partials.push(r));
  engine.onFinalResult((r) => finals.push(r));
  engine.onVoiceActivity((a) => voice.push(a));
  await engine.start('es');
  return { sched, engine, partials, finals, voice };
}

describe('FakeSpeechEngine (implementa SpeechEngine sin tocar micrófono ni audio)', () => {
  it('say(): voz activa, parciales que crecen palabra por palabra, resultado final y silencio', async () => {
    const { engine, sched, partials, finals, voice } = await setup();
    const total = engine.say('el pequeño conejo despertó', { wordIntervalMs: 300 });
    expect(voice).toEqual([true]);
    sched.advance(total + 100);
    expect(partials.map((p) => p.text)).toEqual(['el', 'el pequeño', 'el pequeño conejo', 'el pequeño conejo despertó']);
    expect(partials.every((p) => !p.isFinal)).toBe(true);
    expect(finals).toHaveLength(1);
    expect(finals[0]).toMatchObject({ text: 'el pequeño conejo despertó', isFinal: true });
    expect(voice).toEqual([true, false]);
  });

  it('atMs cuenta desde start()', async () => {
    const { engine, sched, partials } = await setup();
    sched.advance(1000);
    engine.say('hola', { wordIntervalMs: 200 });
    sched.advance(300);
    expect(partials[0].atMs).toBe(1200);
  });

  it('stop() cancela lo que estaba por emitirse', async () => {
    const { engine, sched, partials } = await setup();
    engine.say('una frase larga que no se debe terminar', { wordIntervalMs: 300 });
    sched.advance(700);
    const n = partials.length;
    await engine.stop();
    sched.advance(10_000);
    expect(partials.length).toBe(n);
    expect(engine.isRunning).toBe(false);
  });

  it('las suscripciones se pueden cancelar', async () => {
    const sched = new ManualScheduler();
    const engine = new FakeSpeechEngine({ scheduler: sched });
    const got: string[] = [];
    const off = engine.onFinalResult((r) => got.push(r.text));
    await engine.start('es');
    engine.emitFinal('uno');
    off();
    engine.emitFinal('dos');
    expect(got).toEqual(['uno']);
  });

  it('isOnDeviceAvailable es configurable por idioma (para probar los fallbacks de docs/06)', async () => {
    const { engine } = await setup({ onDeviceAvailable: (l: string) => l === 'es' });
    expect(await engine.isOnDeviceAvailable('es')).toBe(true);
    expect(await engine.isOnDeviceAvailable('en')).toBe(false);
  });

  it('startError simula "micrófono sin permiso": start() falla y se notifica por onError', async () => {
    const sched = new ManualScheduler();
    const engine = new FakeSpeechEngine({ scheduler: sched, startError: { code: 'permission-denied', message: 'Sin permiso de micrófono' } });
    const errors: string[] = [];
    engine.onError((e) => errors.push(e.code));
    await expect(engine.start('es')).rejects.toThrow('Sin permiso');
    expect(errors).toEqual(['permission-denied']);
  });
});

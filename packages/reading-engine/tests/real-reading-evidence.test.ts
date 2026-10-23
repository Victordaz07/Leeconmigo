import { describe, expect, it } from 'vitest';
import { FakeSpeechEngine } from '../../speech-engine/src/fake-speech-engine.ts';
import { ManualScheduler, RealReadingEngine } from '../src/index.ts';
const setup = (text: string) => {
  const scheduler = new ManualScheduler();
  const speech = new FakeSpeechEngine({ scheduler });
  const engine = new RealReadingEngine(speech, { scheduler, language: 'es' });
  engine.startSession(text.split(' ').map((text, index) => ({ text, normalized: text, index, id: String(index) })));
  return { engine, speech };
};
describe('legacy experimental engine does not fabricate word events', () => {
  it('rejects a distant last word instead of giving credit to the entire page', () => {
    const { engine, speech } = setup('la niña encontró una pequeña puerta azul al fondo del jardín');
    speech.emitFinal('jardín');
    expect(engine.getState().wordMarks).toEqual({});
    engine.dispose();
  });
  it('marks only aligned words when recognition omits an inner word', () => {
    const { engine, speech } = setup('la cometa roja volaba alto');
    speech.emitFinal('la cometa volaba alto');
    expect(engine.getState().wordMarks[2]).toBeUndefined();
    expect(engine.getState().wordMarks[4]).toBe('read');
    engine.dispose();
  });
  it('cannot count a pronunciation helper as child reading', () => {
    const { engine, speech } = setup('la cometa roja volaba alto');
    engine.requestHelp(0);
    speech.emitFinal('la cometa roja volaba alto');
    expect(engine.getState().wordMarks).toEqual({});
    engine.dispose();
  });
});

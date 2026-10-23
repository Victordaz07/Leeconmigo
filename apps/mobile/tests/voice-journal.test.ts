import { describe, expect, it } from 'vitest';
import { VoiceJournal, VOICE_JOURNAL_KEY, type VoicePhase } from '../src/speech/voice-journal';
function store() {
  const values = new Map<string, string>();
  return { values, get: (key: string) => values.get(key) ?? null, set: (key: string, value: string) => { values.set(key, value); }, remove: (key: string) => { values.delete(key); } };
}
describe('bounded local voice stages', () => {
  it('retains the stage across a process restart without needing a Java crash report', () => {
    const kv = store(); const before = new VoiceJournal(kv, '0.2.2');
    before.begin('android'); before.record('requesting-permission');
    const after = new VoiceJournal(kv, '0.2.2');
    expect(after.previous?.steps).toEqual(['start', 'requesting-permission']);
    after.begin('whisper'); expect(after.previous?.provider).toBe('android');
  });
  it('rejects arbitrary text and does not retain extra fields in saved input', () => {
    const kv = store();
    kv.set(VOICE_JOURNAL_KEY, JSON.stringify({ version: '0.2.2', provider: 'PRIVATE NAME', transcript: 'PRIVATE WORDS', steps: ['start', 'PRIVATE WORDS', 'requesting-permission'] }));
    const journal = new VoiceJournal(kv, '0.2.2');
    expect(JSON.stringify(journal.previous)).not.toContain('PRIVATE');
    journal.record('PRIVATE WORDS' as VoicePhase);
    expect(journal.current()).toBeNull();
    journal.begin('android'); expect(kv.get(VOICE_JOURNAL_KEY)).not.toContain('PRIVATE');
  });
  it('bounds stored stages and ignores late callbacks from a prior attempt', () => {
    const kv = store(); const journal = new VoiceJournal(kv, '0.2.2');
    const old = journal.begin('android'); journal.begin('whisper');
    journal.record('error', old); expect(journal.current()?.steps).toEqual(['start']);
    for (let n = 0; n < 20; n++) { journal.record('loading'); journal.record('capturing'); }
    expect(journal.current()?.steps).toHaveLength(12);
    expect(kv.get(VOICE_JOURNAL_KEY)!.length).toBeLessThan(500);
  });
  it('diagnostic storage failures do not stop reading', () => {
    const journal = new VoiceJournal({ get: () => { throw new Error('storage'); }, set: () => { throw new Error('storage'); }, remove: () => {} }, '0.2.2');
    expect(() => { journal.begin('android'); journal.record('capturing'); }).not.toThrow();
  });
});

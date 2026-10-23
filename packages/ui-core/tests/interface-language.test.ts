import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EN_INTERFACE, translate } from '../src/interface-language.ts';
import { readingCopy } from '../src/reading-copy.ts';
import { SUBJECTS } from '../src/subjects.ts';
import { ENERGY_OPTIONS, FOCUS_FACES } from '../src/effort.ts';
import { GATE_COPY } from '../src/pin.ts';

describe('interface language', () => {
  it('preserves placeholders, inserts values literally and leaves Spanish intact', () => {
    for (const [source, english] of Object.entries(EN_INTERFACE)) {
      expect(english.trim(), source).not.toBe('');
      expect(english.match(/\{\d+\}/g)?.sort() ?? [], source).toEqual(source.match(/\{\d+\}/g)?.sort() ?? []);
    }
    expect(translate('en', 'Ajustes de {0}', 'Noah $&')).toBe('Settings for Noah $&');
    expect(translate('es', 'Ajustes de {0}', 'Noah')).toBe('Ajustes de Noah');
    expect(translate('en', 'an authored story sentence')).toBe('an authored story sentence');
  });

  it('covers dynamic subject, energy, focus and PIN labels', () => {
    const labels = [...SUBJECTS.map(s => s.name), ...ENERGY_OPTIONS.flatMap(e => [e.title, e.detail]), ...FOCUS_FACES.map(f => f.label), ...Object.values(GATE_COPY)];
    for (const label of labels) {
      if (label !== 'Normal') expect(EN_INTERFACE[label], label).toBeDefined();
    }
  });

  it('covers every literal translation key used by the native shell', () => {
    const files = ['home', 'profiles', 'energy', 'parent-home', 'parent-settings', 'parent-gate', 'parent-reminders', 'parent-report', 'notebook'];
    for (const file of files) {
      const source = readFileSync(new URL(`../../../apps/mobile/src/screens/${file}-screen.tsx`, import.meta.url), 'utf8');
      for (const [, key] of source.matchAll(/ui\("([^"\n]+)"/g)) expect(EN_INTERFACE[key], `${file}: ${key}`).toBeDefined();
    }
  });

  it('localizes reading help, navigation, preparation and feedback without changing vocabulary', () => {
    const c = readingCopy('en');
    expect(c.help.listenWord).toBe('Hear the word');
    expect(c.states.keepReading).toBe('Keep reading');
    expect(c.help.synonym('bright')).toContain('bright');
    expect(c.help.example('A firefly glowed.')).toContain('A firefly glowed.');
    expect(c.feedback.lector.incorrect('firefly')).toContain('firefly');
    expect(readingCopy('es').help.listenWord).toBe('Escuchar la palabra');
  });
});

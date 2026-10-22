import { describe, expect, it } from 'vitest';
import { LEGAL_CONFIG, LEGAL_VERSION, legalReady, type LegalConfig } from '../src/legal/config';
import { adultQuestion, isLegalConsent, needsConsent, newConsent } from '../src/legal/consent';
import { LEGAL_UI, legalDocs, PENDING } from '../src/legal/copy';
import { eraseEverything, KEYS, SUBJECT_KEYS, type KV } from '../src/persist/store';

const FULL: LegalConfig = { publisherName: 'Familia Díaz LLC', contactEmail: 'hola@example.com', privacyUrl: 'https://example.com/privacidad', governingLaw: 'el estado de California, EE. UU.' };
const memoryKV = (): KV & { keys: () => string[] } => {
  const m = new Map<string, string>();
  return { get: (k) => m.get(k) ?? null, set: (k, v) => void m.set(k, v), remove: (k) => void m.delete(k), keys: () => [...m.keys()] };
};
const flat = (lang: 'es' | 'en', c: LegalConfig = FULL) => Object.values(legalDocs(lang, c)).flatMap((d) => d.sections.flatMap((s: { title: string; body: string[] }) => [s.title, ...s.body])).join('\n');

describe('aceptación legal', () => {
  it('se pide la primera vez y cada vez que cambian los textos', () => {
    expect(needsConsent(null, LEGAL_VERSION)).toBe(true);
    const c = newConsent(LEGAL_VERSION, 'es', new Date('2026-10-22T10:00:00Z'));
    expect(isLegalConsent(c)).toBe(true);
    expect(needsConsent(c, LEGAL_VERSION)).toBe(false);
    expect(needsConsent(c, '2027-01-01-final')).toBe(true);
  });
  it('rechaza lo guardado mal formado', () => {
    for (const bad of [null, {}, { version: '', acceptedAt: '2026-10-22', lang: 'es' }, { version: 'x', acceptedAt: 'no es fecha', lang: 'es' }, { version: 'x', acceptedAt: '2026-10-22', lang: 'fr' }]) expect(isLegalConsent(bad)).toBe(false);
  });
  it('la pregunta de adultos tiene respuesta correcta y no es de tabla de primaria', () => {
    for (const seed of [0, 0.13, 0.5, 0.99]) {
      const q = adultQuestion(seed);
      expect(q.answer).toBe(q.a * q.b);
      expect(q.a).toBeGreaterThanOrEqual(12);
      expect(q.answer).toBeGreaterThan(70);
    }
  });
});

describe('textos legales', () => {
  it('ES y EN tienen los mismos documentos y secciones', () => {
    const es = legalDocs('es', FULL);
    const en = legalDocs('en', FULL);
    for (const k of ['notice', 'privacy', 'terms'] as const) {
      expect(es[k].sections.length).toBe(en[k].sections.length);
      for (const s of [...es[k].sections, ...en[k].sections]) expect(s.title.trim() && s.body.length > 0).toBeTruthy();
    }
    expect(LEGAL_UI.es.bullets.length).toBe(LEGAL_UI.en.bullets.length);
  });
  it('prometen lo que la app hace: voz nunca grabada, sin servidores, sin rastreo, borrado', () => {
    const es = flat('es');
    expect(es).toMatch(/nunca se graba/);
    expect(es).toMatch(/no sale del dispositivo|nunca sale del dispositivo/);
    expect(es).toMatch(/anuncios, analítica/);
    expect(es).toMatch(/Borrar|borrar/);
    const en = flat('en');
    expect(en).toMatch(/never recorded/);
    expect(en).toMatch(/never leaves the device/);
    expect(en).toMatch(/ads, analytics/);
  });
  it('dicen que no es tratamiento ni evaluación oficial y no mencionan condiciones médicas (D3)', () => {
    expect(flat('es')).toMatch(/no es un tratamiento, terapia, diagnóstico/i);
    expect(flat('en')).toMatch(/not treatment, therapy, a diagnosis/i);
    for (const lang of ['es', 'en'] as const) expect(flat(lang)).not.toMatch(/TDAH|ADHD|autis|dislexia|dyslexia/i);
  });
  it('con datos pendientes muestran un marcador visible; con datos completos, ninguno', () => {
    expect(legalReady()).toBe(false); // hasta que Victor dé el editor, el correo, la URL y la ley aplicable
    expect(legalReady(FULL)).toBe(true);
    expect(flat('es', LEGAL_CONFIG)).toContain(PENDING.es);
    expect(flat('en', LEGAL_CONFIG)).toContain(PENDING.en);
    expect(flat('es')).not.toContain(PENDING.es);
    expect(flat('es')).toContain('hola@example.com');
  });
  it('la política dice que la app no participa en las copias de seguridad de Android', () => {
    expect(flat('es')).toMatch(/no participa en las copias de seguridad/);
    expect(flat('en')).toMatch(/does not take part in Android’s automatic backups/);
  });
});

describe('borrar todos los datos', () => {
  it('quita perfiles, PIN, recordatorios, aceptación legal y el progreso de cada niño', () => {
    const kv = memoryKV();
    const ids = ['noah', 'mia'];
    kv.set(KEYS.profiles, '[]');
    kv.set(KEYS.pin, '1234');
    kv.set(KEYS.reminders, '{}');
    kv.set(KEYS.legal, '{}');
    for (const id of ids) {
      kv.set(KEYS.reading(id), '{}');
      kv.set(KEYS.math(id), '{}');
      for (const s of SUBJECT_KEYS) kv.set(KEYS.subject(s, id), '{}');
    }
    kv.set('otra.cosa', 'x');
    eraseEverything(kv, ids);
    expect(kv.keys()).toEqual(['otra.cosa']);
  });
});

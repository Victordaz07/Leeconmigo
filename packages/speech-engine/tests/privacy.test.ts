/**
 * Regla absoluta (docs/07, D1, docs/12 §6): la voz del niño nunca se guarda ni sale del equipo. Esta prueba falla si el
 * código de voz de la app nativa empieza a usar red, archivos o la opción de whisper.rn que escribe el audio a un WAV.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..', '..', '..');
const DIRS = [join(ROOT, 'apps', 'mobile', 'src', 'speech'), join(ROOT, 'packages', 'speech-engine', 'src', 'whisper')];
const FORBIDDEN: [RegExp, string][] = [
  [/audioOutputPath/, 'whisper.rn escribiría el audio a un archivo'],
  [/\bfetch\s*\(|XMLHttpRequest|WebSocket|axios/, 'red'],
  [/react-native-fs|expo-file-system|writeFile|createWriteStream|WavFileWriter/, 'archivos'],
  [/AsyncStorage|localStorage|indexedDB|expo-sqlite/, 'almacenamiento'],
];

/** Sin comentarios: los comentarios EXPLICAN la regla ("nunca se escribe a disco") y no deben contar. */
const code = (f: string) => readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const files = DIRS.flatMap((d) => readdirSync(d).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts')).map((f) => join(d, f)));

describe('privacidad de la voz', () => {
  it('hay código de voz que revisar', () => {
    expect(files.length).toBeGreaterThan(3);
  });
  for (const [re, why] of FORBIDDEN) {
    it(`ningún archivo de voz usa ${why}`, () => {
      // Web: `vad.ts` y `whisper-worker.ts` cargan los PESOS de los modelos desde la propia app (archivos empaquetados), no
      // envían audio. Son las únicas excepciones; cualquier otro uso de red falla.
      const hits = files.filter((f) => !(why === 'red' && /(vad|whisper-worker)\.ts$/.test(f)) && re.test(code(f)));
      expect(hits).toEqual([]);
    });
  }
});

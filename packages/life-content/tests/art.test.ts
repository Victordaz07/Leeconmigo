import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LIFE_MODULE_IDS } from '../src/index.ts';

const root = new URL('../../../', import.meta.url);
const artSrc = readFileSync(new URL('apps/mobile/src/subjects/vida/art.ts', root), 'utf8');

/** El arte de «Para la vida»: cada módulo tiene todo lo que la app pide, los archivos existen y el manifiesto los respalda. */
describe('arte de «Para la vida» 02–08', () => {
  const paths = [...artSrc.matchAll(/require\('\.\.\/\.\.\/\.\.\/(assets\/vida\/[^']+)'\)/g)].map((m) => m[1]!);

  it('43 imágenes conectadas (7 módulos × 6 + banner) y todas existen', () => {
    expect(paths).toHaveLength(43);
    expect(new Set(paths).size).toBe(43);
    for (const p of paths) expect(existsSync(new URL(`apps/mobile/${p}`, root)), p).toBe(true);
  });

  it('cada módulo tiene portada, fondo, tres escenas (una por encuentro) y su guía', () => {
    for (const id of LIFE_MODULE_IDS) {
      expect(paths.filter((p) => p.includes(`cover_${id}_`)), id).toHaveLength(1);
      expect(paths.filter((p) => p.includes(`bg_${id}_`)), id).toHaveLength(1);
      expect(paths.filter((p) => p.includes(`scene_${id}_`)), id).toHaveLength(3);
    }
    expect(paths.filter((p) => p.includes('/guides/'))).toHaveLength(7);
  });

  it('el manifiesto lleva el SHA-256 de los 43 originales', () => {
    const files = ['parte-1', 'parte-2'].flatMap((l) => JSON.parse(readFileSync(new URL(`docs/design/vida/arte/manifest-${l}.json`, root), 'utf8')) as { sha256: string; output: string }[]);
    expect(files).toHaveLength(43);
    for (const f of files) expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(new Set(files.map((f) => f.output.replace('apps/mobile/', ''))).size).toBe(43);
  });

  it('el arte no pesa de más (la app va en tablets y teléfonos modestos)', () => {
    let total = 0;
    for (const p of paths) total += readFileSync(new URL(`apps/mobile/${p}`, root)).length;
    expect(total).toBeLessThan(4 * 1024 * 1024);
  });
});

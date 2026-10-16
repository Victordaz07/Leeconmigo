import { describe, expect, it } from 'vitest';

describe('arte de Ciencia', () => {
  it('cada archivo que art.ts referencia existe, y el manifiesto lo describe', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { existsSync, readFileSync } = (await import('node:fs')) as { existsSync: (u: URL) => boolean; readFileSync: (u: URL, e: string) => string };
    const dir = new URL('../src/subjects/ciencia/', import.meta.url);
    const art = readFileSync(new URL('art.ts', dir), 'utf8');
    const files = [...art.matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]);
    expect(files.length).toBe(18); // las 18 imágenes de la Tanda 1 (la escena de la ladera es solo horizontal)
    for (const f of files) expect(existsSync(new URL(f, dir)), f).toBe(true);
    const manifest = JSON.parse(readFileSync(new URL('../../../../../docs/design/ciencia/arte/manifest-tanda-1.json', dir), 'utf8')) as { count: number; assets: { output: string; outputBytes: number }[] };
    expect(manifest.count).toBe(18);
    // Todo lo que se convirtió está conectado.
    for (const a of manifest.assets) expect(files.some((f) => f.endsWith(a.output.replace('apps/mobile/assets/ciencia/', ''))), a.output).toBe(true);
    // Peso razonable (brief: < 350 KB por imagen).
    for (const a of manifest.assets) expect(a.outputBytes, a.output).toBeLessThan(350 * 1024);
  });
});

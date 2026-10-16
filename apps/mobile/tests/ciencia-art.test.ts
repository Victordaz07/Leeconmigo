import { describe, expect, it } from 'vitest';

/** Lote A (C1-U02): arte provisional dibujado con código hasta que lleguen las imágenes de Victor. */
const PROVISIONAL = ['bg/scene_c1_u02.webp', 'covers/cover_c1_u02.webp', 'props/prop_caja_observacion.webp', 'props/prop_linterna.webp', 'props/prop_objeto_osito.webp', 'props/prop_objeto_pelota.webp', 'props/prop_objeto_taza.webp'];

describe('arte de Ciencia', () => {
  it('cada archivo que art.ts referencia existe, y el manifiesto lo describe', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { existsSync, readFileSync } = (await import('node:fs')) as { existsSync: (u: URL) => boolean; readFileSync: (u: URL, e: string) => string };
    const dir = new URL('../src/subjects/ciencia/', import.meta.url);
    const art = readFileSync(new URL('art.ts', dir), 'utf8');
    const files = [...art.matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]);
    // 18 de la Tanda 1 (la escena de la ladera es solo horizontal) + las provisionales de la Tanda 2 que ya están conectadas.
    expect(files.length).toBe(18 + PROVISIONAL.length);
    for (const f of files) expect(existsSync(new URL(f, dir)), f).toBe(true);
    const manifest = JSON.parse(readFileSync(new URL('../../../../../docs/design/ciencia/arte/manifest-tanda-1.json', dir), 'utf8')) as { count: number; assets: { output: string; outputBytes: number }[] };
    expect(manifest.count).toBe(18);
    // Todo lo que se convirtió está conectado.
    for (const a of manifest.assets) expect(files.some((f) => f.endsWith(a.output.replace('apps/mobile/assets/ciencia/', ''))), a.output).toBe(true);
    // Peso razonable (brief: < 350 KB por imagen).
    for (const a of manifest.assets) expect(a.outputBytes, a.output).toBeLessThan(350 * 1024);
  });

  it('una unidad con arte provisional NO está lista para el niño (solo se ve en un build de demo)', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { readFileSync } = (await import('node:fs')) as { readFileSync: (u: URL, e: string) => string };
    const art = readFileSync(new URL('../src/subjects/ciencia/art.ts', import.meta.url), 'utf8');
    for (const f of PROVISIONAL) expect(art).toContain(f.replace(/^[a-z]+\//, ''));
    expect(art).toMatch(/'C1-U02': false/);
    expect(art).toMatch(/'C4-U06': true/);
  });
});

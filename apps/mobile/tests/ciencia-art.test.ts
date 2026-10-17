import { describe, expect, it } from 'vitest';

/** Arte PROVISIONAL (dibujado con código) todavía conectado: vacío cuando llegaron todos los lotes de las unidades abiertas. */
const PROVISIONAL: string[] = ['props/prop_rampa.webp', 'props/prop_bloque_madera.webp', 'bg/scene_c4_u02.webp', 'covers/cover_c4_u02.webp', 'props/prop_carrito.webp', 'props/prop_pendulo.webp', 'bg/scene_c3_u05.webp', 'covers/cover_c3_u05.webp'];
/** Un manifiesto por tanda/lote recibido. */
const MANIFESTS = ['manifest-tanda-1.json', 'manifest-tanda-2a.json', 'manifest-tanda-2b.json', 'manifest-tanda-2c.json', 'manifest-tanda-2d.json', 'manifest-tanda-2e.json'];

describe('arte de Ciencia', () => {
  it('cada archivo que art.ts referencia existe, y el manifiesto lo describe', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { existsSync, readFileSync } = (await import('node:fs')) as { existsSync: (u: URL) => boolean; readFileSync: (u: URL, e: string) => string };
    const dir = new URL('../src/subjects/ciencia/', import.meta.url);
    const art = readFileSync(new URL('art.ts', dir), 'utf8');
    const files = [...art.matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]);
    // 18 de la Tanda 1 (la escena de la ladera es solo horizontal) + las 41 de la Tanda 2 (lotes A–E).
    expect(files.length).toBeGreaterThanOrEqual(59);
    for (const f of files) expect(existsSync(new URL(f, dir)), f).toBe(true);
    let total = 0;
    for (const name of MANIFESTS) {
      const manifest = JSON.parse(readFileSync(new URL(`../../../../../docs/design/ciencia/arte/${name}`, dir), 'utf8')) as { count: number; assets: { output: string; outputBytes: number }[] };
      total += manifest.count;
      // Todo lo que se convirtió está conectado.
      for (const a of manifest.assets) expect(files.some((f) => f.endsWith(a.output.replace('apps/mobile/assets/ciencia/', ''))), a.output).toBe(true);
      // Peso razonable (brief: < 350 KB por imagen).
      for (const a of manifest.assets) expect(a.outputBytes, a.output).toBeLessThan(350 * 1024);
    }
    expect(total).toBe(files.length - PROVISIONAL.length);
  });

  it('solo se abren al niño las unidades con su arte recibido (una unidad con arte provisional queda en false)', async () => {
    // @ts-expect-error -- la app no carga los tipos de Node; esta prueba corre en Node (vitest).
    const { readFileSync } = (await import('node:fs')) as { readFileSync: (u: URL, e: string) => string };
    const art = readFileSync(new URL('../src/subjects/ciencia/art.ts', import.meta.url), 'utf8');
    for (const f of PROVISIONAL) expect(art).toContain(f.replace(/^[a-z]+\//, ''));
    expect(art).toMatch(/'C1-U02': true/);
    expect(art).toMatch(/'C2-U02': true/);
    expect(art).toMatch(/'C4-U06': true/);
    // C4-U02 sigue con arte provisional (lote I): no se abre al niño hasta que lleguen las imágenes.
    expect(art).toMatch(/'C4-U02': false/);
    expect(art).toMatch(/'C3-U05': false/);
  });
});

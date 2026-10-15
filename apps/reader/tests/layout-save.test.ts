/**
 * Guardado definitivo del modo editor (apps/reader/layout-save.ts). Es una ruta que ESCRIBE EN DISCO, así que se prueba sobre
 * todo lo que debe rechazar: peticiones que llegan por un túnel público, formas de salirse de la carpeta y archivos inválidos.
 */
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_BODY_BYTES, handleLayoutSave, isLocalHost, type SaveFs, type SaveRequest } from '../layout-save.ts';

const DIR = '/proyecto/packages/story-engine/layouts';

function memoryFs() {
  const files = new Map<string, string>();
  const dirs = new Set<string>();
  const fs: SaveFs = {
    exists: (p) => files.has(p),
    mkdirp: (p) => void dirs.add(p),
    write: (p, d) => void files.set(p, d),
    remove: (p) => void files.delete(p),
  };
  return { fs, files, dirs };
}

const valid = { familyId: 'mi-historia', version: 1, pages: { p01: { blocks: { b01: { text: { x: 100.04, y: 40, width: 500, height: 120 }, align: 'center' } } } } };
const req = (over: Partial<SaveRequest> = {}): SaveRequest => ({ method: 'POST', host: 'localhost:5173', contentType: 'application/json', body: JSON.stringify(valid), ...over });

describe('isLocalHost', () => {
  it('acepta localhost y redes privadas (con o sin puerto)', () => {
    for (const h of ['localhost', 'localhost:5173', '127.0.0.1:4173', '[::1]:5173', '192.168.12.127:4173', '10.0.0.5', '172.16.3.4:80', '172.31.255.1', 'mi-pc.localhost:5173']) expect(isLocalHost(h), h).toBe(true);
  });

  it('rechaza dominios públicos, túneles e IPs públicas o mal formadas', () => {
    for (const h of [undefined, '', 'iuxgc.free.pinggy.net', 'c678e685427ec3.lhr.life', '8.8.8.8', '172.32.0.1', '172.15.0.1', '192.169.0.1', 'localhost.evil.com', '11.0.0.1', 'evil.com:5173', '192.168.1']) expect(isLocalHost(h), String(h)).toBe(false);
  });
});

describe('handleLayoutSave', () => {
  it('guarda el archivo normalizado en layouts/<familia>.layout.json', () => {
    const { fs, files, dirs } = memoryFs();
    const r = handleLayoutSave(req(), DIR, fs);
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, path: 'packages/story-engine/layouts/mi-historia.layout.json' });
    expect(dirs.has(DIR)).toBe(true);
    const text = files.get(`${join(DIR, 'mi-historia.layout.json')}`)!;
    expect(text.endsWith('\n')).toBe(true);
    expect(JSON.parse(text).pages.p01.blocks.b01.text.x).toBe(100); // 100.04 → 0,1 px
    expect(JSON.parse(text)).toEqual({ familyId: 'mi-historia', version: 1, pages: { p01: { blocks: { b01: { text: { x: 100, y: 40, width: 500, height: 120 }, align: 'center' } } } } });
  });

  it('un archivo sin ajustes borra el archivo guardado (la plantilla manda)', () => {
    const { fs, files } = memoryFs();
    files.set(`${join(DIR, 'mi-historia.layout.json')}`, '{}');
    const r = handleLayoutSave(req({ body: JSON.stringify({ familyId: 'mi-historia', version: 1, pages: {} }) }), DIR, fs);
    expect(r.json).toMatchObject({ ok: true, removed: true });
    expect(files.size).toBe(0);
    expect(handleLayoutSave(req({ body: JSON.stringify({ familyId: 'mi-historia', version: 1, pages: {} }) }), DIR, memoryFs().fs).status).toBe(200); // sin archivo previo: tampoco falla
  });

  it('rechaza lo que llega por un túnel público (Host de otro dominio) o con X-Forwarded-For', () => {
    const { fs, files } = memoryFs();
    expect(handleLayoutSave(req({ host: 'iuxgc.free.pinggy.net' }), DIR, fs).status).toBe(403);
    expect(handleLayoutSave(req({ forwardedFor: '203.0.113.9' }), DIR, fs).status).toBe(403);
    expect(handleLayoutSave(req({ host: undefined }), DIR, fs).status).toBe(403);
    expect(files.size).toBe(0);
  });

  it('el Origin, si viene, debe ser el mismo servidor (cierra el ataque desde otra página web abierta en el navegador)', () => {
    const { fs, files } = memoryFs();
    expect(handleLayoutSave(req({ origin: 'https://evil.example' }), DIR, fs).status).toBe(403);
    expect(handleLayoutSave(req({ origin: 'no es una url' }), DIR, fs).status).toBe(403);
    expect(files.size).toBe(0);
    expect(handleLayoutSave(req({ origin: 'http://localhost:5173' }), DIR, fs).status).toBe(200);
  });

  it('solo POST, solo JSON y con tope de tamaño', () => {
    const { fs } = memoryFs();
    expect(handleLayoutSave(req({ method: 'GET' }), DIR, fs).status).toBe(405);
    expect(handleLayoutSave(req({ method: 'PUT' }), DIR, fs).status).toBe(405);
    expect(handleLayoutSave(req({ contentType: 'text/plain' }), DIR, fs).status).toBe(415);
    expect(handleLayoutSave(req({ contentType: undefined }), DIR, fs).status).toBe(415);
    expect(handleLayoutSave(req({ body: 'x'.repeat(MAX_BODY_BYTES + 1) }), DIR, fs).status).toBe(413);
    expect(handleLayoutSave(req({ body: '{no es json' }), DIR, fs).status).toBe(400);
  });

  it('no hay forma de salirse de la carpeta: familyId con rutas o mayúsculas se rechaza y no escribe nada', () => {
    const { fs, files } = memoryFs();
    for (const familyId of ['../../etc/passwd', '..\\..\\x', 'a/b', 'Mayus', 'con espacio', '', '.', '-x', 'x'.repeat(0)]) {
      const r = handleLayoutSave(req({ body: JSON.stringify({ ...valid, familyId }) }), DIR, fs);
      expect(r.status, familyId).toBe(422);
    }
    expect(files.size).toBe(0);
  });

  it('un archivo inválido (caja fuera de la ilustración, campos desconocidos) devuelve 422 con los problemas y no escribe', () => {
    const { fs, files } = memoryFs();
    const bad = { ...valid, pages: { p01: { blocks: { b01: { text: { x: 1400, y: 0, width: 300, height: 50 }, evil: true } } } } };
    const r = handleLayoutSave(req({ body: JSON.stringify(bad) }), DIR, fs);
    expect(r.status).toBe(422);
    expect((r.json.problems as string[]).join(' ')).toMatch(/se sale de la ilustración.*campo desconocido "evil"/);
    expect(files.size).toBe(0);
  });

  it('un id de bloque o de página con rutas se rechaza', () => {
    const { fs, files } = memoryFs();
    const bad = { ...valid, pages: { '../x': { blocks: { b01: { align: 'left' } } } } };
    expect(handleLayoutSave(req({ body: JSON.stringify(bad) }), DIR, fs).status).toBe(422);
    expect(files.size).toBe(0);
  });
});

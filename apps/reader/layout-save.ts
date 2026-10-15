/**
 * Guardado definitivo del modo editor: escribe `packages/story-engine/layouts/<familia>.layout.json` en el proyecto. Vive SOLO
 * en el servidor de desarrollo / de prueba (`vite` y `vite preview`), nunca en la compilación para niños: es un plugin de Vite.
 *
 * Es una ruta que escribe en disco, así que es estricta:
 *  - solo acepta peticiones LOCALES: el `Host` debe ser localhost o una IP de red privada (un túnel público llega con su propio
 *    dominio y se rechaza), sin `X-Forwarded-For`, y el `Origin`, si viene, debe ser el mismo host;
 *  - valida el archivo entero con `validateLayoutFile` (familia en minúsculas-guiones: no hay forma de salirse de la carpeta);
 *  - solo escribe en la carpeta `layouts/` y con ese nombre de archivo.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import type { LayoutFile } from '@lee-conmigo/contracts';
import { normalizeLayoutFile, validateLayoutFile } from '../../packages/story-engine/src/layout-file.ts';

export const MAX_BODY_BYTES = 256 * 1024;

/** localhost, 127.x, ::1, o una IP privada (10.x, 172.16–31.x, 192.168.x). Con o sin puerto. */
export function isLocalHost(hostHeader: string | undefined): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.replace(/:\d+$/, '').replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host === '::1' || host.endsWith('.localhost')) return true;
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return a === 127 || a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

export interface SaveRequest {
  method: string;
  host?: string;
  origin?: string;
  forwardedFor?: string;
  contentType?: string;
  body: string;
}

export interface SaveFs {
  exists(path: string): boolean;
  mkdirp(path: string): void;
  write(path: string, data: string): void;
  remove(path: string): void;
}

export interface SaveResult {
  status: number;
  json: Record<string, unknown>;
}

const fail = (status: number, error: string, extra: Record<string, unknown> = {}): SaveResult => ({ status, json: { ok: false, error, ...extra } });

/** Toda la lógica del guardado, sin HTTP: recibe la petición ya leída y devuelve qué responder. */
export function handleLayoutSave(req: SaveRequest, layoutsDir: string, fs: SaveFs): SaveResult {
  if (req.method !== 'POST') return fail(405, 'usa POST');
  if (!isLocalHost(req.host) || req.forwardedFor) return fail(403, 'el guardado solo se acepta desde la red local (no a través de un túnel público)');
  if (req.origin) {
    let originHost = '';
    try {
      originHost = new URL(req.origin).host;
    } catch {
      return fail(403, 'origen inválido');
    }
    if (originHost !== req.host) return fail(403, 'origen distinto del servidor');
  }
  if (!/^application\/json/i.test(req.contentType ?? '')) return fail(415, 'el cuerpo debe ser JSON');
  if (Buffer.byteLength(req.body) > MAX_BODY_BYTES) return fail(413, 'el archivo es demasiado grande');

  let parsed: unknown;
  try {
    parsed = JSON.parse(req.body);
  } catch {
    return fail(400, 'JSON inválido');
  }
  const problems = validateLayoutFile(parsed);
  if (problems.length) return fail(422, 'el archivo no es válido', { problems });

  const file = normalizeLayoutFile(parsed as LayoutFile);
  const path = join(layoutsDir, `${file.familyId}.layout.json`);
  if (Object.keys(file.pages).length === 0) {
    // Sin ajustes: no hace falta archivo (la plantilla manda).
    if (fs.exists(path)) fs.remove(path);
    return { status: 200, json: { ok: true, removed: true, file } };
  }
  fs.mkdirp(layoutsDir);
  fs.write(path, `${JSON.stringify(file, null, 2)}\n`);
  return { status: 200, json: { ok: true, path: `packages/story-engine/layouts/${file.familyId}.layout.json`, file } };
}

const nodeFs: SaveFs = {
  exists: existsSync,
  mkdirp: (p) => void mkdirSync(p, { recursive: true }),
  write: (p, d) => writeFileSync(p, d, 'utf8'),
  remove: (p) => unlinkSync(p),
};

function readBody(req: IncomingMessage, limit: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('demasiado grande'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, json: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(json));
}

/** Plugin de Vite: `POST /__editor/layout` (guardar) y `GET /__editor/ping` (¿hay guardado disponible?). Solo en dev / preview. */
export function layoutSavePlugin(layoutsDir: string): Plugin {
  const attach = (middlewares: { use: (path: string, fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void }) => {
    middlewares.use('/__editor', (req, res, next) => {
      const url = req.url ?? '';
      const host = req.headers.host;
      if (url.startsWith('/ping')) {
        if (!isLocalHost(host) || req.headers['x-forwarded-for']) return send(res, 403, { ok: false, error: 'solo red local' });
        return send(res, 200, { ok: true });
      }
      if (!url.startsWith('/layout')) return next();
      readBody(req, MAX_BODY_BYTES + 1024)
        .then((body) => {
          const r = handleLayoutSave(
            { method: req.method ?? '', host, origin: req.headers.origin as string | undefined, forwardedFor: req.headers['x-forwarded-for'] as string | undefined, contentType: req.headers['content-type'], body },
            layoutsDir,
            nodeFs,
          );
          send(res, r.status, r.json);
        })
        .catch(() => send(res, 413, { ok: false, error: 'petición demasiado grande' }));
    });
  };
  return {
    name: 'lee-conmigo-layout-save',
    configureServer: (server) => attach(server.middlewares),
    configurePreviewServer: (server) => attach(server.middlewares),
  };
}

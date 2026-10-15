/**
 * Conexión del modo editor con el servidor de desarrollo (`apps/reader/layout-save.ts`): saber si se puede guardar y guardar.
 * En una compilación sin ese servidor (p. ej. un despliegue estático) `pingEditorServer` da `false` y el editor solo ofrece
 * descargar el archivo.
 */
import type { LayoutFile } from '@lee-conmigo/contracts';
import type { SaveOutcome } from '@lee-conmigo/ui';

export async function pingEditorServer(fetchFn: typeof fetch = fetch): Promise<boolean> {
  try {
    const r = await fetchFn('/__editor/ping', { cache: 'no-store' });
    if (!r.ok) return false;
    return ((await r.json()) as { ok?: boolean }).ok === true;
  } catch {
    return false;
  }
}

export async function saveLayoutFile(file: LayoutFile, fetchFn: typeof fetch = fetch): Promise<SaveOutcome> {
  let r: Response;
  try {
    r = await fetchFn('/__editor/layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(file) });
  } catch {
    return { ok: false, message: 'No se pudo conectar con el servidor de desarrollo.' };
  }
  const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; problems?: string[]; path?: string; removed?: boolean; file?: LayoutFile };
  if (!r.ok || !body.ok || !body.file) {
    return { ok: false, message: `${body.error ?? `Error ${r.status}`}${body.problems?.length ? `: ${body.problems.join('; ')}` : ''}` };
  }
  return { ok: true, file: body.file, message: body.removed ? 'Sin ajustes: se borró el archivo (manda la plantilla).' : `Guardado en ${body.path}` };
}

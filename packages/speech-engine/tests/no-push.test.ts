/**
 * Privacidad (D8, docs/12 §6): los avisos de Kitewise son LOCALES. `expo-notifications` trae por dentro el envío remoto de Firebase; el plugin
 * `apps/mobile/plugins/no-push.js` lo quita al compilar. Esta prueba falla si alguien lo desconecta o si los avisos empiezan a usar red.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const MOBILE = join(import.meta.dirname, '..', '..', '..', 'apps', 'mobile');
const read = (...p: string[]) => readFileSync(join(MOBILE, ...p), 'utf8');

describe('avisos sin push remoto', () => {
  it('app.json aplica el plugin que quita Firebase', () => {
    expect(JSON.parse(read('app.json')).expo.plugins).toContain('./plugins/no-push.js');
  });
  it('el plugin quita el servicio de push, su inicializador y el descubridor de componentes', () => {
    const src = read('plugins', 'no-push.js');
    for (const name of ['ExpoFirebaseMessagingService', 'FirebaseMessagingService', 'FirebaseInstanceIdReceiver', 'FirebaseInitProvider', 'ComponentDiscoveryService', 'c2dm.permission.RECEIVE']) expect(src).toContain(name);
    expect(src).toContain("'tools:node'");
  });
  it('el código de avisos no usa red ni pide un token de envío', () => {
    for (const f of ['scheduler.ts', 'sync.ts', 'plan.ts']) {
      const code = read('src', 'reminders', f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
      expect(code, f).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|getExpoPushTokenAsync|getDevicePushTokenAsync|addPushTokenListener/);
    }
  });
  it('la copia de seguridad de Android está apagada (la política de privacidad dice que la app no participa)', () => {
    expect(JSON.parse(read('app.json')).expo.android.allowBackup).toBe(false);
  });
  it('el aviso legal está conectado: la app no abre sin aceptación y existe «Borrar todos los datos»', () => {
    const app = read('App.tsx');
    expect(app).toContain('needsConsent(consent, LEGAL_VERSION)');
    expect(app).toContain('eraseAllData()');
  });
  it('la app no pide permisos que no usa: sin Internet, sin superposición ni almacenamiento externo', () => {
    const blocked: string[] = JSON.parse(read('app.json')).expo.android.blockedPermissions;
    for (const p of ['INTERNET', 'SYSTEM_ALERT_WINDOW', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']) expect(blocked).toContain(`android.permission.${p}`);
  });
});

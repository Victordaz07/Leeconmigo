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
    for (const name of ['ExpoFirebaseMessagingService', 'FirebaseInitProvider', 'ComponentDiscoveryService']) expect(src).toContain(name);
    expect(src).toContain("'tools:node'");
  });
  it('el código de avisos no usa red ni pide un token de envío', () => {
    for (const f of ['scheduler.ts', 'sync.ts', 'plan.ts']) {
      const code = read('src', 'reminders', f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
      expect(code, f).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|getExpoPushTokenAsync|getDevicePushTokenAsync|addPushTokenListener/);
    }
  });
});

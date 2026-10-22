/**
 * Kitewise solo usa avisos LOCALES. `expo-notifications` trae por dentro el servicio de envío remoto de Firebase (FCM); aquí se quita del
 * manifiesto para que la app no pueda recibir push ni contacte a Firebase (D8, docs/12: sin SDKs que recojan datos). Si algún día hiciera falta
 * push, sería una decisión explícita de privacidad, no un efecto colateral.
 */
const { withAndroidManifest } = require('expo/config-plugins');

const REMOVE = [
  'expo.modules.notifications.service.ExpoFirebaseMessagingService',
  'com.google.firebase.messaging.FirebaseMessagingService',
  'com.google.firebase.iid.FirebaseInstanceIdReceiver',
  'com.google.firebase.provider.FirebaseInitProvider',
  'com.google.firebase.components.ComponentDiscoveryService',
];
/** Permiso para recibir mensajes push de Google: la app no los usa. */
const REMOVE_PERMISSIONS = ['com.google.android.c2dm.permission.RECEIVE'];

module.exports = function withNoPush(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    const app = manifest.application[0];
    app.service = app.service ?? [];
    app.provider = app.provider ?? [];
    for (const name of REMOVE) {
      const kind = name.endsWith('Provider') ? 'provider' : name.endsWith('Receiver') ? 'receiver' : 'service';
      app[kind] = app[kind] ?? [];
      if (!app[kind].some((x) => x.$['android:name'] === name)) app[kind].push({ $: { 'android:name': name, 'tools:node': 'remove' } });
    }
    manifest['uses-permission'] = manifest['uses-permission'] ?? [];
    for (const name of REMOVE_PERMISSIONS) {
      if (!manifest['uses-permission'].some((x) => x.$['android:name'] === name)) manifest['uses-permission'].push({ $: { 'android:name': name, 'tools:node': 'remove' } });
    }
    return cfg;
  });
};

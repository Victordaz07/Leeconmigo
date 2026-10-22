/**
 * Kitewise solo usa avisos LOCALES. `expo-notifications` trae por dentro el servicio de envío remoto de Firebase (FCM); aquí se quita del
 * manifiesto para que la app no pueda recibir push ni contacte a Firebase (D8, docs/12: sin SDKs que recojan datos). Si algún día hiciera falta
 * push, sería una decisión explícita de privacidad, no un efecto colateral.
 */
const { withAndroidManifest } = require('expo/config-plugins');

const REMOVE = ['expo.modules.notifications.service.ExpoFirebaseMessagingService', 'com.google.firebase.provider.FirebaseInitProvider', 'com.google.firebase.components.ComponentDiscoveryService'];

module.exports = function withNoPush(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    const app = manifest.application[0];
    app.service = app.service ?? [];
    app.provider = app.provider ?? [];
    for (const name of REMOVE) {
      const isProvider = name.endsWith('Provider');
      const list = isProvider ? app.provider : app.service;
      if (!list.some((x) => x.$['android:name'] === name)) list.push({ $: { 'android:name': name, 'tools:node': 'remove' } });
    }
    return cfg;
  });
};

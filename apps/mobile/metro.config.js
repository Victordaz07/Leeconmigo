// Configuración de Metro para el monorepo (docs/11). Expo detecta solo los npm workspaces; aquí solo se asegura
// `require.context`, que usa `src/bundled-stories.ts` para cargar todas las historias sin listarlas a mano.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.transformer.unstable_allowRequireContext = true;

module.exports = config;

// Configuración de Metro para el monorepo (docs/11). Expo detecta solo los npm workspaces; aquí se asegura
// `require.context` (`src/bundled-stories.ts` carga todas las historias sin listarlas a mano) y los modelos de voz.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.transformer.unstable_allowRequireContext = true;
// Modelos de voz de whisper.rn (`assets/models/*.bin`, se bajan con `npm run models`): van dentro de la app, sin red.
config.resolver.assetExts.push('bin');

module.exports = config;

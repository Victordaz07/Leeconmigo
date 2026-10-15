import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contentReloadPlugin } from './content-reload.ts';
import { layoutSavePlugin } from './layout-save.ts';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
// El guardado del modo editor solo existe en el servidor de desarrollo y en el de prueba (`vite preview`), nunca en `vite build`.
const layoutsDir = here('../../packages/story-engine/layouts');
const storiesDir = here('../../packages/story-engine/stories');

/**
 * Whisper (`WhisperSpeechEngine`) fuerza `wasmPaths` a `/ort/...` (copiados por
 * `scripts/copy-speech-assets.mjs` en `public/ort/`), así que esos `.wasm` de onnxruntime-web nunca se
 * piden por su nombre con hash: Vite los detecta igual como estáticos importados desde los workers y los
 * duplicaría en el bundle (~40 MB extra, dos veces el mismo archivo). Se quitan del build final.
 */
function dropDuplicateOnnxWasm(): Plugin {
  return {
    name: 'drop-duplicate-onnx-wasm',
    apply: 'build',
    generateBundle(_opts, bundle) {
      for (const name of Object.keys(bundle)) if (name.endsWith('.wasm')) delete bundle[name];
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    contentReloadPlugin([layoutsDir, storiesDir], here('./src/bundled-stories.ts')),
    ...(command === 'serve' ? [layoutSavePlugin(layoutsDir)] : []),
    dropDuplicateOnnxWasm(),
  ],
  // `usePolling`: en discos de red / unidades asignadas (Z:) los eventos de archivos no llegan de forma fiable.
  server: { host: true, port: 5173, watch: { usePolling: true, interval: 400 } },
  // `npm run tablet`: se sirve en la red local y, si se quiere, a través de un túnel sin cuenta para verlo por
  // https desde cualquier lugar. Sirve solo archivos estáticos compilados (proyecto personal en pruebas), así que se acepta cualquier Host.
  preview: { host: true, port: 4173, allowedHosts: true },
  // Whisper (RealReadingEngine, `packages/speech-engine`): el worker corre como módulo ES, y Transformers.js
  // ya trae su propio ONNX Runtime empaquetado (Vite no debe volver a procesarlo).
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@huggingface/transformers'] },
  build: { chunkSizeWarningLimit: 2500 },
}));

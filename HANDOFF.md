# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("RN-05: …")

## Tarea en curso
Ninguna a medias. RN-01 ✅ en código (falta verla en Android real) · RN-02 ✅ · RN-04 ✅ · RN-05 ✅.

## Hecho en RN-01
- [x] `apps/mobile` (Expo SDK 57, RN 0.86, TS) dentro del monorepo
- [x] Historias reales cargadas con `require.context` (`apps/mobile/src/bundled-stories.ts`)
- [x] React unificado en 19.2.3 (`overrides` en `package.json` raíz)
- [x] tsc ✅ · `expo export --platform android` ✅ · `expo-doctor` 21/21 ✅ · `npm test` 1068 ✅ · build web ✅
- [ ] Abrir en el Android de Victor (`cd apps/mobile && npx expo run:android`)
- [x] RN-02: `packages/ui-native` (tokens, Button, Card, MicBadge) + fuentes
- [x] RN-04: pantalla de lectura con simulador (`apps/mobile/src/screens/reading-screen.tsx`) + `packages/ui-core`
- [x] RN-05: cómic con globos (`fitText` en ui-core, `ComicPage` en ui-native) + ilustraciones

## Siguiente paso exacto
1. Victor prueba en su Android (`apps/mobile/README.md`): lista → tocar una historia → "Comenzar lectura" → panel
   DEV (abajo) → "Lectura automática".
2. **RN-05** — cómic e ilustraciones en `apps/mobile`:
   - Las imágenes viven en `apps/reader/public/stories/<id>/*.webp` y las historias las citan con `src` relativo.
     Metro necesita `require()` estáticos: generar un mapa `src → require(...)` con un script
     (`scripts/gen-native-assets.mjs` → `apps/mobile/src/generated/story-assets.ts`) o usar `require.context` sobre
     esa carpeta. NO copiar las imágenes (duplicaría ~MB en el repo).
   - Ilustración de la página junto al texto (illustrated reader) y, para páginas con globos, portar `fit-layout.ts`
     + `comic-fit.tsx` (`packages/ui`): los cálculos puros a `ui-core`, el pintado a `ui-native`.
3. Luego RN-06: pregunta de comprensión + repaso + fin con estrellas + Inicio/Biblioteca/Ficha + Modo padres.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Lógica de vista compartida va en `packages/ui-core` (sin React); `packages/ui` la re-exporta — no duplicarla.
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1084/1084 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

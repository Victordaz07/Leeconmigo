# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("RN-01: …")

## Tarea en curso
RN-01 — app Expo creada; falta verla en un Android real.

## Hecho en RN-01
- [x] `apps/mobile` (Expo SDK 57, RN 0.86, TS) dentro del monorepo
- [x] Historias reales cargadas con `require.context` (`apps/mobile/src/bundled-stories.ts`)
- [x] React unificado en 19.2.3 (`overrides` en `package.json` raíz)
- [x] tsc ✅ · `expo export --platform android` ✅ · `expo-doctor` 21/21 ✅ · `npm test` 1068 ✅ · build web ✅
- [ ] Abrir en el Android de Victor (`cd apps/mobile && npx expo run:android`)  ← AQUÍ ME QUEDÉ

## Siguiente paso exacto
1. Victor prueba RN-01 en su teléfono/tablet (instrucciones en `apps/mobile/README.md`).
2. **RN-02** (no depende de lo anterior): crear `packages/ui-native` con
   - `tokens.ts`: TODOS los valores de `packages/ui/src/styles/tokens.css` (colores, radios, sombras) como objeto TS;
     reemplazar `apps/mobile/src/theme.ts` por él.
   - Fuentes Andika + Nunito con `expo-font` (`npx expo install expo-font` + `@expo-google-fonts/*` o los `.ttf`
     de `@fontsource`; verificar licencia OFL).
   - Componentes base: botón píldora con "borde físico" inferior, tarjeta, micrófono con anillo pulsante
     (`docs/05`), con una pantalla de muestra.
   Instalar paquetes SIEMPRE con `npx expo install` (elige versiones compatibles con la SDK).

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1068/1068 ✅ · `npm run typecheck`: ✅ (incluye `@lee-conmigo/mobile`)

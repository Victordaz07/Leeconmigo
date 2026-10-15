# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("RN-02: …")

## Tarea en curso
Ninguna a medias. RN-01 ✅ en código (falta verla en Android real) · RN-02 ✅.

## Hecho en RN-01
- [x] `apps/mobile` (Expo SDK 57, RN 0.86, TS) dentro del monorepo
- [x] Historias reales cargadas con `require.context` (`apps/mobile/src/bundled-stories.ts`)
- [x] React unificado en 19.2.3 (`overrides` en `package.json` raíz)
- [x] tsc ✅ · `expo export --platform android` ✅ · `expo-doctor` 21/21 ✅ · `npm test` 1068 ✅ · build web ✅
- [ ] Abrir en el Android de Victor (`cd apps/mobile && npx expo run:android`)
- [x] RN-02: `packages/ui-native` (tokens, Button, Card, MicBadge) + fuentes

## Siguiente paso exacto
1. Victor prueba en su Android (`apps/mobile/README.md`): lista de historias + "Ver componentes".
2. **RN-04** — pantalla de lectura con `FakeReadingEngine` en `apps/mobile`:
   - Mirar cómo `apps/reader/src/use-session.ts` conecta `FakeReadingEngine` + `session-engine` (flujo) con la UI, y
     replicar ese hook en `apps/mobile/src/use-session.ts` (la lógica es la misma, solo cambia la UI).
   - Primero modo texto (illustrated reader, sin globos): texto de la página con la palabra actual resaltada
     (prop `highlight`, docs/09 #2), `MicBadge` con el tono que da el view-model (`packages/ui/src/view-model.ts`
     ya calcula `MicTone` y los mensajes: reutilizar esa lógica, moverla a un paquete puro si hace falta).
   - Tocar una palabra = ayuda (modal con sílabas + `expo-speech` para pronunciar).
   - Botones de simulación DEV (como `packages/ui/src/dev-panel.tsx`).
   RN-03 (voz real) espera a tener la tablet de Noah.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1071/1071 ✅ · `npm run typecheck`: ✅ (incluye mobile y ui-native)

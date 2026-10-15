# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("K1: Inicio y cuaderno …")

## Tarea en curso
Ninguna a medias. K1 ✅ (Inicio B3 + cuaderno B4). Siguiente: K2.

## Hecho en RN-01
- [x] `apps/mobile` (Expo SDK 57, RN 0.86, TS) dentro del monorepo
- [x] Historias reales cargadas con `require.context` (`apps/mobile/src/bundled-stories.ts`)
- [x] React unificado en 19.2.3 (`overrides` en `package.json` raíz)
- [x] tsc ✅ · `expo export --platform android` ✅ · `expo-doctor` 21/21 ✅ · `npm test` 1068 ✅ · build web ✅
- [ ] Abrir en el Android de Victor (`cd apps/mobile && npx expo run:android`)
- [x] RN-02: `packages/ui-native` (tokens, Button, Card, MicBadge) + fuentes
- [x] RN-04: pantalla de lectura con simulador (`apps/mobile/src/screens/reading-screen.tsx`) + `packages/ui-core`
- [x] RN-05: cómic con globos (`fitText` en ui-core, `ComicPage` en ui-native) + ilustraciones
- [x] K0: diseño Kitewise en `docs/design/kitewise/` + D9 + plan K1–K8
- [x] K1 (parte): tokens de Kitewise en `ui-native/src/tokens.ts` con prueba de paridad
- [x] K1: componentes + Inicio (B3) + Cuaderno (B4)
- [x] D10: nombre oficial Kitewise (`com.kitewise.app`)

## Siguiente paso exacto
**K2 — Lectura dentro del cuaderno (B9) + estados (B11, G11–G13).** Referencias: `docs/design/kitewise/screens/B9.webp`,
`B11.webp`, `G11.webp` (sin micrófono), `G12.webp` (sin conexión), `G13.webp` (palabra difícil).
1. `apps/mobile/src/screens/reading-screen.tsx`: rediseñar al estilo B9 — riel izquierdo angosto con Volver, "2 / 6"
   (página), puntos de progreso por página, micrófono, botón de ayuda "?" y altavoz; ilustración grande; texto en
   tarjeta de papel a la derecha con barra de progreso arriba y pestaña "Lectura". El cómic (`ComicPage`) se queda igual.
2. B11 pausa: tarjeta ámbar "Te espero…" (hoy el coach solo cambia el mensaje).
3. G13: la `HelpSheet` al estilo del diseño (mirar G13.webp).
4. G11/G12: estados de "sin permiso de micrófono" y "sin conexión" — con `FakeReadingEngine` solo se pueden simular
   (agregar botones DEV); el real llega con RN-07.
Mantener: arte y texto separados, nunca rojo, el indicador del micrófono nunca miente.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Lógica de vista compartida va en `packages/ui-core` (sin React); `packages/ui` la re-exporta — no duplicarla.
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- Expo está en 57.0.29 (hay 57.0.30): no usar `npm dedupe`; actualizar regenerando el lockfile en tarea aparte.
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1088/1088 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

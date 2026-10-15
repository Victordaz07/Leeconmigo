# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1`

## Tarea en curso
Ninguna a medias. K4 ✅ y app adaptable a teléfonos ✅. Siguiente: lo que Victor reporte al probar en su teléfono; luego K5.

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
- [x] K2: lectura en el cuaderno (riel, hoja de papel, coach estrella) + pausa, sin micrófono, ayuda
- [x] K3: cierre por esfuerzo (D11), elegir perfil, energía del día; progreso aparte por niño
- [x] APK demo instalado por Victor ("la app funciona… vamos por buen camino"); pasos en `apps/mobile/README.md`
- [x] K4: Modo padres — PIN (P1), Hoy con el niño (P2), Ajustes + Agregar niño + lectura libre (P4)
- [x] Pantallas adaptables a teléfono y vertical (`ui-core/layout.ts`, `useLayout`) — pedido de Victor

## Siguiente paso exacto
**K5 — Practicar (B8) + pistas (G9, G10) + repaso 1-3-7.** Referencias: `docs/design/kitewise/screens/B8.webp`, `G9.webp`,
`G10.webp`, `SPEC.md` §6.
1. Mirar cómo funcionan hoy las preguntas de comprensión en la app nativa (`reading-screen.tsx`, `flow.ts` de
   session-engine) antes de tocar nada.
2. `ConfidencePicker` (Seguro / Más o menos / Adivino) antes de «Comprobar»; `HintLadder` de 3 escalones (pista →
   ejemplo → ver respuesta), "Lo veo luego" manda la pregunta al repaso. Nunca «incorrecto» ni rojo.
3. Tipos V/F y ordenar (F4-03b) si el esquema de historia los permite; si no, proponer el cambio de esquema.
4. Repaso espaciado 1-3-7 días (F4-04): lógica pura con pruebas; lo que vuelve aparece al empezar ("retos que regresan").
Victor dijo que la app tiene "muchos detalles que corregir": si manda la lista, atenderla ANTES de seguir con K5.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Lógica de vista compartida va en `packages/ui-core` (sin React); `packages/ui` la re-exporta — no duplicarla.
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- Toda pantalla nueva usa `useLayout()` (teléfono vertical/acostado y tablet): probar en 390×844, 844×390, 800×1280 y 1280×800.
- Expo está en 57.0.29 (hay 57.0.30): no usar `npm dedupe`; actualizar regenerando el lockfile en tarea aparte.
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1105/1105 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

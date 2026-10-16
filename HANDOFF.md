# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1`

## Tarea en curso
Ninguna a medias. RN-03: el APK con voz está listo; esperando la medición de Victor en la tablet.

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
- [x] RN-03 (parte código): whisper.rn + `WhisperNativeSpeechEngine` + "Prueba de voz" (Ajustes de padres)

## Siguiente paso exacto
**Esperar el resultado de la "Prueba de voz" de Victor** (tablet de Noah y su teléfono): ¿entiende bien? ¿cuánto tarda por
frase? ¿Rápido (tiny) o Preciso (base)? Anotarlo en `docs/log/` y decidir el modelo (luego quitar el otro del APK).
Después, **RN-07**: en `use-reading-session.ts`, usar `RealReadingEngine` (packages/reading-engine) con
`WhisperNativeSpeechEngine` en lugar de `FakeReadingEngine` cuando NO es lectura libre; antes de pedir el micrófono, un
aviso para padres (docs/12 §2, "La voz de tu hijo nunca se graba ni se almacena"); si no hay permiso → estado "sin
micrófono" (G11) que ya existe (`voiceProblem`). El panel DEV sigue para simular. Apagar el micrófono al salir de la
lectura o pasar a segundo plano (docs/06).
Luego K5.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Lógica de vista compartida va en `packages/ui-core` (sin React); `packages/ui` la re-exporta — no duplicarla.
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- Toda pantalla nueva usa `useLayout()` (teléfono vertical/acostado y tablet): probar en 390×844, 844×390, 800×1280 y 1280×800.
- Modelos de voz: `npm run models -w @lee-conmigo/mobile` antes de compilar (no van en git).
- En la nube, Maven Central da 429: usar `~/.gradle/init.d/maven-mirror.gradle` (ver SESSION_LOG "APK demo").
- Expo está en 57.0.29 (hay 57.0.30): no usar `npm dedupe`; actualizar regenerando el lockfile en tarea aparte.
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1105/1105 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

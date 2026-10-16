# HANDOFF — estado actual
Actualizado: 2026-10-16 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1`

## Tarea en curso
Ninguna a medias. Voz (RN-03) PAUSADA por Victor. K6: la primera unidad de Matemáticas (g3u1) ya se juega completa.

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
- [x] K6a–d: investigación en `docs/research/matematicas-investigacion.md`; contratos `contracts/src/math.ts`; paquete
      `packages/math-content` (unidad g3u1, validador, generador con semilla, dominio y repaso 1-3-7, plan de lección,
      estado de un reto); componentes `ui-native/src/components/math/`
- [x] K6e: Inicio → cuaderno de Matemáticas (camino de 4 lecciones) → lección (calentamiento, Aprender, Explorar,
      Practicar, Juego, Cierre); los intentos alimentan dominio y repaso

## Siguiente paso exacto
Victor probó el APK 0.3.0 de Matemáticas: "está demasiado simple, no hay problemas reales según como lo usan en la
escuela, se siente como de preescolar". **No agregar más unidades con el patrón actual.**
1. Victor corre `docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md` (catálogo de ejercicios reales por grado:
   CAASPP/Smarter Balanced, Illustrative Math, Eureka, enVision, SEP en español) y trae el resultado → guardarlo como
   `docs/research/matematicas-problemas-reales.md`.
2. Con eso: rehacer g3u1 con problemas de nivel real de 3.º (dos pasos, elegir la operación, incógnita en distintos
   lugares, datos de sobra, explicar/"¿quién tiene razón?"), ampliar `MathChallenge` (formatos de respuesta además del
   teclado) y los componentes de interacción que la investigación priorice.
3. Sigue pendiente: en qué nivel de matemáticas está Noah; etiquetas concepto/procedimiento/transferencia; guardar en el
   equipo (RN-08); V/F y ordenar (K5).

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
`npm test`: 1152/1152 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

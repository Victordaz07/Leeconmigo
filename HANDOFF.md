# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1`

## Tarea en curso
Ninguna a medias. Voz (RN-03) PAUSADA por Victor. Siguiente: Matemáticas (K6), empezando por la investigación.

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
**K6 — Cuaderno de Matemáticas.** Victor pausó la voz ("el asunto de las voces es muy complicado"; el motor y la Prueba
de voz quedan en el código y en el APK, sin conectar a la lectura) y pidió pasar a los demás cuadernos, empezando por
Matemáticas, con una investigación profunda para los 6 niveles en inglés y español.
1. Victor corre `docs/research/PROMPT-INVESTIGACION-MATEMATICAS.md` en una herramienta de investigación profunda y trae
   el resultado → guardarlo como `docs/research/matematicas-investigacion.md`.
2. Con eso: modelo de unidades/lecciones en `packages/contracts` (SPEC §7, aditivo), validación en `story-engine` o un
   paquete nuevo de contenido, y la primera unidad (propuesta: 3.º o el nivel de Noah) con Aprender / Explorar
   (`NumberLine` o `PaintGrid`) / Practicar con escalera de pistas. Estándares solo para padres y como borrador.
3. Pantallas B5 (camino de unidad), B6 (Aprender), B7 (Explorar), B8 (Practicar) — usar `useLayout()` desde el inicio.
No inventar contenido de matemáticas antes de tener la investigación (CLAUDE.md: no inventar; docs/09).

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

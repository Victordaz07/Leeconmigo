# HANDOFF — estado actual
Actualizado: 2026-10-16 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1`

## Materias en paralelo (D12, 2026-10-16)
Ciencia (cuenta A) y Sociedad (cuenta B) se trabajan a la vez. Su estado vive en `docs/handoff/ciencia.md` y
`docs/handoff/sociedad.md` (usa `/retomar ciencia` o `/retomar sociedad`). Este archivo queda para lo general. Reglas:
`docs/14-MATERIAS-EN-PARALELO.md`. Preparación (PREP-1) hecha: módulos enchufados como "Pronto".

## Tarea en curso
**K8a hecho (2026-10-21):** Mi cuaderno ya se abre desde Inicio (palabras de Lectura, ideas escritas por el niño, dibujos de Arte). K8b (Logros), «Guardar en mi cuaderno» en los cierres, Mi museo e informe semanal PDF también hechos (2026-10-21); falta APK para probar en Android. Detalle: `docs/log/SESSION_LOG.md`.

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
Matemáticas: las 12 representaciones de la lámina están hechas (37 plantillas, 1.º–6.º), con Taller por grado y tema,
y las lecciones de g3u1 ya traen ejercicios manipulables. Estado real y pendientes:
`docs/design/math-visual/IMPLEMENTACION.md`.
1. Victor prueba (cuando pida APK; no generar sin que lo pida).
2. Modo Enfoque: K7a ✅ (ajuste del padre + horario, Matemáticas lo respeta), K7b ✅ (Lectura B10), K7c ✅ (pausa de
   movimiento B12). Siguiente: K7d (adaptativo). Pendientes de Matemáticas: arrastrar en otras familias (el reparto ya se arrastra), lecciones de otros
   grados, revisión docente.
   (Guardar en el equipo ✅: `apps/mobile/src/persist/`. Contextos ✅: grupos y reparto ya varían — galletas,
   lápices/cajas, canicas/frascos, manzanas/canastas; palabras con género en `ui-core/math-visual-nouns.ts`.)
3. Después: siguiente cuaderno (Ciencia/Sociedad/Arte) o lo que Victor decida.

## Cuidado con
- Lo guardado en el equipo usa claves `kitewise.v1.*` (`persist/store.ts`). Si cambia el formato, subir la versión y migrar.
- Arrastrar (`DragToken` en `scenes.tsx`): soltar se hace con `setTimeout(0)`; si se cambia la ficha de lugar dentro
  del gesto, en la web el siguiente arrastre no arranca.
- Modo Enfoque: las pantallas reciben APOYOS (`resolveFocus(profile.focus)` → `reducedMotion`, `roundSize`), nunca el
  modo ni un diagnóstico (D4). Apoyo nuevo = campo en `FocusSupports` + presets + interruptor en Personalizado (P4).
- Contexto nuevo de grupos/reparto: palabras en `math-visual-nouns.ts`, dibujo en `GROUP_SCENE`/`SHARE_SCENE`
  (`visual-exercise.tsx`), arte en `MathArt`. El contexto sale de la ÚLTIMA tirada del generador: no mover esa línea
  o cambian los números de todas las semillas.
- Imágenes que llenan un contenedor: usar `FILL_IMAGE` de ui-native (en Android el 100 % no cuenta el relleno del padre).
- **No generar ni enviar APK hasta que Victor lo pida** (Victor, 2026-10-16: "no me des apk hasta que yo te diga").
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
`npm test`: 1187/1187 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

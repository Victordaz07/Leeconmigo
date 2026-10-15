# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("K2: lectura …")

## Tarea en curso
Ninguna a medias. K2 ✅ (lectura B9 + estados B11, G11, G13). Siguiente: K3.

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

## Siguiente paso exacto
**K3 — Cierre (B13), perfiles (B1) y "¿Cómo llegas?" (B2).** Referencias: `docs/design/kitewise/screens/B13.webp`, `B1.webp`,
`B2.webp`.
1. B13 en `reading-screen.tsx` (reemplaza `EndOverlay`, hay un TODO): "¡Buen trabajo, {nombre}!", 3 estrellas POR
   ESFUERZO (no por precisión: decidir cómo con `starsFor`/esfuerzo — p. ej. terminar = 1, ayuda pedida o reintento = +1,
   lectura sin pausas largas = +1; documentarlo y probarlo en ui-core), tarjetas Tiempo / Papalote (+m) / Sello del día /
   Vuelven (palabras practicadas), "¿Cómo estuvo tu enfoque?" con 3 caritas (se guarda en el resumen como autoevaluación;
   agregar el campo al contrato `SessionSummary` como opcional), botones "Guardar en mi cuaderno" (solo si K8 existe; si no,
   no mostrarlo) y "Listo".
2. B1 Elegir perfil: avatares + "Agregar niño" (pide PIN → K4). Perfiles en `app-state.ts` (todavía en memoria).
3. B2 ¿Cómo llegas?: 3 opciones 20/15/8 min → guarda `energy` en la sesión (`SPEC.md` §7 `Session`).
Pregunta abierta para Victor si hace falta: cómo se calculan las estrellas "por esfuerzo".

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

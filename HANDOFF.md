# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("K3: …")

## Tarea en curso
Ninguna a medias. K3 ✅ (cierre B13, perfiles B1, ¿Cómo llegas? B2). Siguiente: K4.

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

## Siguiente paso exacto
**K4 — Padres: bienvenida + PIN (P1), panel de hoy (P2), ajustes (P4).** Referencias: `docs/design/kitewise/screens/P1.webp`,
`P2.webp`, `P4.webp`, `SPEC.md`.
1. PIN de padres en la app nativa (la lógica de la web está en `apps/reader/src/parent-settings.ts`: reutilizar o pasar
   a `session-engine`/`ui-core` lo que sea puro). El ícono "Padres" del `NavRail` abre el candado.
2. P2 panel de hoy con datos REALES del `progressStoreFor(id)` (minutos válidos, historias, palabras practicadas,
   caritas de enfoque `focusSelfReport`, energía). Nunca grabaciones; "La voz de tu hijo nunca se graba ni se almacena."
3. P4 ajustes: meta diaria, nivel, idioma, preguntar energía (`askEnergy`), Modo Enfoque (solo guardar el ajuste; aplicarlo
   es K7), "Borrar todos los datos" (P-03). Con PIN: activar "Agregar niño" en B1 (`profiles-screen.tsx`).
Todo sigue en memoria hasta RN-08.

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
`npm test`: 1093/1093 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

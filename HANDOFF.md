# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("K1: …")

## Tarea en curso
**K1** (Kitewise, `docs/13-KITEWISE.md`): tokens ✅; faltan componentes y pantallas B3/B4.

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
- [ ] K1: componentes + Inicio (B3) + Cuaderno (B4)  ← AQUÍ ME QUEDÉ

## Siguiente paso exacto
**K1 — Inicio (B3) y Cuaderno de Lectura (B4)** en la app nativa. Referencia visual:
`docs/design/kitewise/screens/B3.webp` y `B4.webp` (y `A2.webp` para el sistema).
1. `packages/ui-native`: `NavRail` (Inicio, Logros, Padres; ícono + texto; 96 px), `NotebookCover` (arte arriba con
   espiral a la izquierda, ícono de materia arriba a la derecha, título, subtítulo, barra de progreso de 3 segmentos
   en el color de la materia), `SubjectTab` (pestaña vertical en el borde derecho, 48/64 px), `SessionPhases`
   (píldoras Calentar/Aprender/Practicar/Juego con los colores `phase*`).
2. `apps/mobile/src/screens/home-screen.tsx` (B3): saludo con nombre, racha y estrellas arriba a la derecha, banner
   "Misión de hoy" con portada de la historia en curso y botón amarillo "Seguir", estantería "Tus cuadernos" (6). Hoy
   solo Lectura tiene contenido: las demás materias se muestran con portadas de referencia y "Pronto" (no inventar
   contenido; arte pendiente en `ART-BRIEF.md`).
3. `notebook-screen.tsx` (B4) para Lectura: izquierda índice (historias del nivel del perfil con su estado),
   derecha la historia actual con portada y "Seguir" → `ReadingScreen`. Pestañas de materia a la derecha.
4. Reemplazar la lista de RN-01 en `App.tsx` por estas pantallas (lista queda solo en `__DEV__`).
Portadas: `storyImage(story.cover.src)` (`apps/mobile/src/story-assets.ts`). Mascota: `docs/design/kitewise/mascot.png`.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- React debe ser una sola versión en todo el repo (overrides). Al cambiar de SDK de Expo, actualizar overrides.
- `require.context` debe quedar literal en el código (Metro lo analiza al empaquetar).
- `android/` e `ios/` no se versionan (los genera Expo).
- Lógica de vista compartida va en `packages/ui-core` (sin React); `packages/ui` la re-exporta — no duplicarla.
- Cero SDKs de analítica/anuncios/reporte de errores (D8).
- `npm ci` en la nube: usar `--ignore-scripts` (postinstall de `onnxruntime-node`).

## Estado de pruebas
`npm test`: 1084/1084 ✅ · `npm run typecheck`: ✅ (incluye mobile, ui-native y ui-core)

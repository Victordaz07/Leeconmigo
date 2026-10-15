# SESSION_LOG — bitácora de relevo (solo se agrega, nunca se borra)

Una entrada por tarea (o por sesión si se corta a medias). Formato:

```
## AAAA-MM-DD HH:MM · Cuenta A|B · <ID tarea>
- Hecho: …
- Archivos: …
- Commits: …
- Pendiente: …
- Notas: …
```

La historia detallada anterior a este log (2026-09-27 → 2026-09-30) está en `docs/DEVLOG.md`.

---

## 2026-10-15 · Cuenta A · F1-02
- Hecho: sistema de relevo entre cuentas — `HANDOFF.md`, `docs/ROADMAP.md`, este log, `docs/DECISIONS.md`,
  `/retomar` y `/relevo` en `.claude/commands/`, protocolo en `CLAUDE.md`. Plan Maestro v2 guardado como
  `docs/10-PLAN-MAESTRO-V2.md` con sección de reconciliación (qué ya existe y qué choca con `docs/00`–`09`).
- Archivos: CLAUDE.md, HANDOFF.md, docs/10-PLAN-MAESTRO-V2.md, docs/ROADMAP.md, docs/DECISIONS.md,
  docs/log/SESSION_LOG.md, docs/design/README.md, .claude/commands/retomar.md, .claude/commands/relevo.md
- Commits: ver `git log` (rama `claude/gracious-shannon-a0238d`)
- Pendiente: respuestas de Victor a C1–C4, C6, C9 en `docs/DECISIONS.md`.
- Notas: `npm ci` falla en el postinstall de `onnxruntime-node` (descarga binarios por red) en el contenedor
  de la nube; `npm ci --ignore-scripts` funciona y las 1068 pruebas pasan.

## 2026-10-15 · Cuenta A · RN-00
- Hecho: Victor decidió migrar a React Native + Expo (D7, opción B) y publicar la app para otras familias (D8).
  Plan de migración `docs/11-MIGRACION-REACT-NATIVE.md` (RN-01…RN-09, la app vieja sigue para Noah hasta
  paridad) y lista legal/privacidad `docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md` (COPPA, California, Play
  Families, Apple Kids, descargos — a revisar con abogado). Nuevas pendientes C10 (negocio) y C11 (LLC).
- Archivos: CLAUDE.md, HANDOFF.md, docs/02, docs/09, docs/10, docs/11, docs/12, docs/DECISIONS.md, docs/ROADMAP.md
- Pendiente: RN-01 (crear `apps/mobile`).
- Notas: verificado que `contracts`, `reading-engine`, `session-engine` y `story-engine` no dependen del
  navegador (sin DOM; `progress-store.ts` ya abstrae el almacenamiento) → se reutilizan en React Native.

## 2026-10-15 · Cuenta A · RN-01
- Hecho: `apps/mobile` con Expo SDK 57 (React Native 0.86, TypeScript), dentro del monorepo. Pantalla inicial
  con la lista de historias reales leídas de `@lee-conmigo/story-engine` vía `require.context`
  (`src/bundled-stories.ts`). React unificado en 19.2.3 con `overrides` en la raíz (RN exige una sola copia;
  antes había 19.3.0 en la app web).
- Archivos: apps/mobile/*, package.json (overrides), package-lock.json
- Verificado: `tsc` del paquete nuevo ✅, `expo export --platform android` empaqueta (713 módulos; títulos de
  historias presentes en el bundle) ✅, `expo-doctor` 21/21 ✅, `npm test` 1068/1068 ✅, `npm run build` web ✅.
- Pendiente: verlo en un Android real (no hay SDK de Android en el contenedor de la nube).
- Notas: RN 0.86 pide Node ≥ 22.22.2 (aviso EBADENGINE con 22.22.0). Plantilla de Expo trae `AGENTS.md` y
  `.claude/settings.json` (plugin oficial de Expo) — se conservan.

## 2026-10-15 · Cuenta A · RN-02
- Hecho: `packages/ui-native` — `tokens.ts` (todos los colores y degradados de `tokens.css`, generados, más radios,
  sombras `boxShadow`, familias de fuente por peso, duraciones), `Button` (píldora con borde físico que baja al
  tocar), `Card`, `MicBadge` (3 tonos + anillo pulsante con Animated, se apaga con "reducir movimiento"),
  `GradientView` (ángulo CSS → expo-linear-gradient), `MicIcon` (react-native-svg). Fuentes Andika + Nunito
  empaquetadas (`apps/mobile/src/fonts.ts`). Pantalla "Ver componentes" (solo `__DEV__`). Soporte web de Expo
  para vista rápida.
- Archivos: packages/ui-native/*, apps/mobile/{App.tsx,src/fonts.ts,src/screens/showcase.tsx,package.json,README.md}
- Verificado: tsc ✅ (mobile y ui-native), prueba de paridad de tokens ✅, `expo export` android ✅ (7 .ttf
  empaquetados), web ✅ con capturas, `expo-doctor` 21/21 ✅, `npm test` 1071/1071 ✅.
- Notas: en React Native cada peso de fuente es una familia (`fontFamily.ui.black`), nunca usar `fontWeight` con
  fuentes propias. `boxShadow` necesita `rgba()`, no `rgb(r g b / a)`.

## 2026-10-15 · Cuenta A · RN-04
- Hecho: pantalla de lectura nativa con `FakeReadingEngine`. Nuevo `packages/ui-core` (puro, sin React): `copy`,
  `ReaderPrefs`, `deriveReadingView` y `wordMark` (marca semántica de cada palabra) — movidos desde `packages/ui`,
  que ahora los re-exporta (la web no cambió: sus 101 pruebas pasan sin tocarlas; `wordVisual` traduce `wordMark`
  a CSS). En `ui-native`: `ReadingText` (palabras tocables), `CoachBar`, `HelpSheet` (sílabas, definición,
  escuchar), `RoundButton`, `wordStyle`. En la app: `src/session/use-reading-session.ts` (motor + flujo + vista;
  pausa al pasar a segundo plano con `AppState`), `src/screens/reading-screen.tsx` (preparación, lectura, aviso
  de página, fin, panel DEV), `src/tts.ts` (`expo-speech`).
- Verificado: recorrido completo en la vista web con Playwright (preparación → leer → dudosa → pausa larga →
  ayuda → terminar página → página 2), sin errores de consola. tsc ✅, `npm test` 1076/1076 ✅, build web ✅,
  `expo export` android ✅, `expo-doctor` 21/21 ✅.
- Pendiente (RN-06): pregunta de comprensión y repaso por sílabas (hoy se salta de página en página),
  progreso guardado. Límite conocido: en Android el subrayado no toma color ni punteado (solo iOS).
- Notas: bug encontrado y arreglado — en "preparación" el micrófono decía "Te escucho" (el view-model de la web no
  pinta el coach en esa pantalla); en nativo se fuerza "Listo para escuchar" en gris (docs/06: el indicador del
  micrófono nunca miente).

## 2026-10-15 · Cuenta A · RN-05
- Hecho: cómic con globos en la app nativa. `packages/ui-core/src/text-fit.ts` (`fitText`): acomoda el texto en la caja
  del globo SIN medir en pantalla, con los anchos reales de Andika (`generated/andika-metrics.ts`, generado por
  `scripts/gen-font-metrics.mjs` con opentype.js). `bestFontSize` e `isBalloonPage` pasan a ui-core (la web los
  re-exporta). `ui-native`: `BalloonText` (pinta los renglones calculados) y `ComicPage` (ilustración + globos + aro del
  cuadro activo). `apps/mobile/src/story-assets.ts`: ilustraciones con `require.context` sobre
  `apps/reader/public/stories` (sin duplicar 55 MB). La pantalla elige cómic o ilustración+texto según la página.
- Verificado: paridad con la web medida en el navegador (misma caja): La cometa roja 24,57 vs 24,59 px; El puente de
  las luciérnagas 27 vs 26,5 y 33 vs 32 px. Prueba sobre TODA la biblioteca: el texto cabe en ≥ 99 % de los globos
  a tamaño tablet. Capturas web sin errores. `npm test` 1084/1084 ✅, typecheck ✅, build web ✅, export android ✅
  (61 MB por las imágenes), expo-doctor 21/21 ✅.
- Notas: en React Native Web `Image` necesita ancho/alto explícitos (si no, sale a tamaño original, recortada).
  Las páginas "tipo libro" (texto en panel dibujado) usan `maxFontPx` del editor: texto chico es el diseño actual.

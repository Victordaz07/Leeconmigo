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

## 2026-10-15 · Cuenta A · K0 + K1 (tokens)
- Hecho: Victor entregó el diseño **Kitewise** (Claude Design, 35 pantallas) y decidió basar el proyecto en él (D9).
  Guardado en `docs/design/kitewise/` (SPEC, ART-BRIEF, STANDARDS-REVIEW, tokens.css, HTML original, mascota y una
  captura .webp por pantalla). Adaptación al repo nativo y orden K1–K8 en `docs/13-KITEWISE.md`. D9 resuelve C2, C3,
  C4, C6, C9; nuevas pendientes C12 (¿nombre Kitewise?) y C13 (foto de la tarea). Tokens de Kitewise agregados a
  `packages/ui-native/src/tokens.ts` (colores, degradados, `darkColors`, `sizes`, `readSize`; `minTouch` 56 → 64) con
  prueba de paridad contra `docs/design/kitewise/tokens.css`.
- Pendiente: resto de K1 — componentes `NavRail`, `NotebookCover`, `SubjectTab`, `SessionPhases` y pantallas B3/B4.
- Notas: el handoff pide `packages/ui` (web); por D7 se hace en `ui-native`/`apps/mobile` (ver tabla en `docs/13`).
  Capturas de las pantallas se sacaron del HTML con Playwright (artboards etiquetados "B3 · …").

## 2026-10-15 · Cuenta A · D10 nombre
- Hecho: Victor decidió "Kitewise el nombre oficial" (D10, resuelve C12). App nativa: nombre "Kitewise", slug
  `kitewise`, identificador `com.kitewise.app`. CLAUDE.md, docs/12 (búsqueda de marca de "Kitewise"), docs/13 y
  README de apps/mobile actualizados. Repo, paquetes `@lee-conmigo/*` y la app Capacitor de Noah conservan el nombre.

## 2026-10-15 · Cuenta A · K1
- Hecho: Inicio (B3) y cuaderno de Lectura abierto (B4) en la app nativa. `ui-core/subjects.ts` (6 materias; solo
  Lectura disponible, el resto "Pronto"; `progressSegments` 3 segmentos sin porcentaje). `ui-native`: `NavRail`,
  `NotebookCover`, `SessionPhases`, `SubjectTab`, `StatChip`, íconos, botón `cta` amarillo. App: `app-state.ts`
  (perfil fijo Noah/es/nivel 3 hasta K3; `MemoryProgressStore` hasta RN-08), `library-model.ts` (misión de hoy =
  historia a medias → primera sin terminar), `home-screen.tsx`, `notebook-screen.tsx`; la lectura guarda resumen y
  punto de reanudación. Lista de RN-01 y muestra de componentes quedan tras "DEV" en el riel (solo desarrollo).
- Verificado: recorrido web Inicio → cuaderno → leer una página → volver: racha "1 día", "página 2", "Seguir en la
  página 2" (datos reales). tsc ✅, `npm test` 1088/1088 ✅, build web ✅, export android ✅.
- Notas: Expo publicó 57.0.30; subirlo duplicaba `expo` en node_modules (el lockfile fija 57.0.29 para los demás
  módulos) y `npm dedupe` lo rompió (subió a 58). Se quedó en 57.0.29: expo-doctor solo avisa del parche nuevo.
  Actualizar regenerando el lockfile con cuidado en una tarea aparte. React Native Web: imágenes que llenan un
  contenedor necesitan `width/height: '100%'` (no basta `absoluteFill`).

## 2026-10-15 · Cuenta A · K2
- Hecho: lectura al estilo Kitewise. `ui-native`: `ReadingRail` (volver, "n / N", puntos de página, micrófono, ayuda,
  escuchar, "›" en modo libre), `CoachBubble` (estrella + globo; reemplaza la barra de coach), `DialogCard` (B11, G11),
  `HelpSheet` rediseñada (G13: "en·re·da·da", altavoz, definición, "Seguir leyendo"), íconos `SpeakerIcon`, `HelpIcon`,
  `MicOffIcon`; `ReadingText` atenúa los párrafos que vienen después del actual. Textos nuevos en `copy.states`.
  Hook: `voiceProblem` (simulado con DEV "Sin micrófono"; el motor real lo dará en RN-07 vía `SpeechEngine.onError`),
  modo libre (pasar página con botón, acredita el tiempo real como en la web), tarjeta de pausa que el niño puede cerrar,
  párrafo actual. Página de texto (B9): ilustración de fondo + hoja de papel a la derecha + pestaña Lectura; letra por
  banda de nivel (30/25/21 px).
- Verificado: recorrido Playwright (texto → pausa larga → cerrar → ayuda → sin micrófono → modo libre → "›" → página
  2; cómic con riel) sin errores. Bug encontrado y arreglado: con "sin micrófono" el riel seguía mostrando el micrófono
  verde escuchando → ahora se oculta (docs/06). `npm test` 1088 ✅, typecheck ✅, build web ✅, export android ✅.
- Pendiente: G12 (sin conexión) — se pospone hasta que existan paquetes de contenido descargables; el texto del diseño
  ("se sincroniza cuando vuelva el internet") contradice "sin nube en v1" y habrá que ajustarlo. "Guardar en mi
  cuaderno" (G13) llega con Mi cuaderno (K8). "Pedir permiso" abrirá el permiso del sistema con el motor real (RN-07).

## 2026-10-15 · Cuenta A · K3
- Hecho: regla de estrellas por esfuerzo aprobada por Victor (D11: terminar = 1, +1 si pidió ayuda o reintentó, +1 si
  leyó sin pausas largas) en `ui-core/src/effort.ts` con pruebas; también metros del papalote, opciones de energía y
  caritas de enfoque. `SessionSummary` gana `focusSelfReport?` y `energy?` (opcionales). B13: `ClosingCard` en
  `ui-native` reemplaza `EndOverlay` (Tiempo, Papalote, Sello del día, Vuelven; "¿Cómo estuvo tu enfoque?"; "Leer de
  nuevo" / "Listo"); el resumen se guarda al cerrar, con la carita elegida. B1 `ProfilesScreen` ("Agregar niño" inactivo
  hasta K4). B2 `EnergyScreen` (20/15/8 min) → los minutos de Inicio y la meta del "Sello del día" salen de ahí.
  `app-state`: `PROFILES` + `progressStoreFor(id)` (progreso aparte por niño). Tocar el avatar en Inicio vuelve a B1.
  El micrófono del riel queda gris fuera de la lectura (antes se veía verde en el cierre).
- Verificado: recorrido Playwright B1 → B2 (Cansado) → Inicio "8 MIN" → lectura completa → B13 (2 ★ "por leer sin
  parar") → carita + Listo → Inicio con racha 1 día, 2 ★ y la misión pasa a la siguiente historia. `npm test` 1093 ✅,
  typecheck ✅, build web ✅, export android ✅.
- Nota para Victor: con esta regla, un lector fluido que no pide ayuda saca 2 estrellas, no 3 (es a propósito: premia
  esfuerzo, no precisión). Si se quiere otra cosa, se cambia en `effort.ts`.

## 2026-10-15 · Cuenta A · APK demo
- Hecho: primer APK instalable (`com.kitewise.app` 0.1.0, ~100 MB, arm64-v8a + armeabi-v7a, firmado con la llave de
  depuración — solo para probar, no para la tienda). `EXPO_PUBLIC_DEMO=1` muestra el panel de simulación (DEV ⚙) en un
  build de release (`apps/mobile/src/dev-tools.ts`), porque sin voz real (RN-07) la lectura se maneja con él. Pasos en
  `apps/mobile/README.md`. Sin permiso de micrófono todavía (llega con RN-07).
- Cómo se compiló en la nube: SDK de Android bajado a `~/android-sdk` (commandline-tools + platform 36 + build-tools
  36); Java 21 y Gradle ya venían. Maven Central (`repo.maven.apache.org`) respondía **429** desde la nube → script
  `~/.gradle/init.d/maven-mirror.gradle` que pone primero el espejo de Google
  (`maven-central.storage-download.googleapis.com/maven2`) en todas las listas de repositorios (el portal de plugins
  también redirige a Maven Central). El script vive fuera del repo: si hace falta, recrearlo igual.
- Pendiente: probarlo en la tablet/teléfono de Victor (no hay emulador aquí). Tamaño: se puede bajar mucho con un AAB
  para la tienda (Play entrega solo la arquitectura del equipo).

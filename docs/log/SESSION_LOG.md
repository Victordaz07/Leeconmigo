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

## 2026-10-15 · Cuenta A · K4
- Hecho: Modo padres en la app nativa.
  - P1 candado: `ui-core/pin.ts` (crear + confirmar, o entrar; tras 5 intentos espera 30 s; mensajes neutros) con
    pruebas; `PinPad` en `ui-native`; `parent-gate-screen.tsx`. Se abre desde "Padres" del riel y desde "Agregar niño".
  - P2 "Hoy con {niño}": `session-engine/parent-report.ts` (`todayReport`, con pruebas) — minutos de hoy vs. meta,
    preguntas, enfoque según el niño (carita de B13), lo que leyó, palabras para practicar juntos, cómo llegó, la semana.
    Solo datos guardados; si no hay, lo dice. Sin "Aula" (C13) ni "Enfoque adaptativo" (K7).
  - P4 ajustes (`parent-settings-screen.tsx`): nombre, nivel 1–6 (aclara que no es el grado escolar), idioma, tiempo
    diario, "¿Cómo llegas?", **lectura libre** (nuevo `ChildProfile.freeReading` → la sesión empieza sin micrófono y el
    consejo 2 de Preparación cambia), privacidad (audio: nunca), cambiar PIN, borrar progreso, quitar niño (si hay más de
    uno). Modo Enfoque aparece como "Pronto". La misma pantalla crea un niño nuevo (B1 "Agregar niño").
  - Perfiles y PIN viven en el estado de `App.tsx` (memoria) hasta RN-08.
- Verificado: Playwright — crear PIN, PIN equivocado y correcto, P2 tras leer, agregar a "Lía" (nivel 2), editar a Noah
  con lectura libre y leer en modo libre. `npm test` 1100 ✅, typecheck ✅, build web ✅, export android ✅.
- Pendiente: Lexend / reglilla (Lectura cómoda), Modo Enfoque (K7), pestañas Semana/Aula de P2, informe PDF (K8).

## 2026-10-15 · Cuenta A · Pantallas que se adaptan (teléfono)
- Pedido de Victor tras probar el APK: "el app está 100 % hecha para tablets… en teléfonos no se ajusta, todo está
  rígido y se distorsiona".
- Hecho: `ui-core/layout.ts` (`layoutFor`, `columnsFor`, `itemWidth`, con pruebas) + `useLayout()` en `ui-native`.
  Regla: teléfono = lado corto < 600 dp; en vertical la navegación va ABAJO (diseño G4); teléfono acostado = riel
  compacto; tablet acostada = como antes.
  - `NavRail` con variantes `rail` / `railCompact` / `bottom`. `ReadingRail` horizontal (barra de abajo) y compacta.
  - Inicio: encabezado que se acomoda, misión apilada, cuadernos en cuadrícula según el ancho (2 columnas en teléfono).
  - Perfiles, ¿Cómo llegas? (tarjetas en fila en teléfono vertical), cuaderno en una columna en pantallas estrechas o
    verticales.
  - Lectura: vertical = ilustración arriba + texto abajo (G5); teléfono acostado = ilustración a la izquierda + texto a la
    derecha. El cómic con globos se muestra completo solo si los globos se leen (escala ≥ 0.42) y no en vertical; si no,
    la ilustración va con el texto en la hoja (arte y texto separados, docs/05). Letra de lectura ×0.8 en teléfono (mín.
    18 px).
  - Diálogos (Preparación, pausa, sin micrófono, ayuda, cierre) se desplazan y se achican en pantallas chicas.
  - Padres: PIN sin la mitad de arte en teléfono/vertical (teclado más chico; acostado, título y teclado lado a lado);
    panel y ajustes en una columna.
- Ojo (React Native Web): `flex: 0` colapsa la vista; usar `flexGrow: 0, flexShrink: 0, flexBasis: 'auto'`.
  `height: undefined` no anula una altura: usar `'auto'`. `adjustsFontSizeToFit` no funciona en web.
- Verificado: capturas en 390×844, 844×390, 800×1280 y 1280×800 de todas las pantallas sin errores; `npm test` 1105 ✅,
  typecheck ✅, build web ✅, export android ✅. Falta que Victor lo pruebe en su teléfono.

## 2026-10-16 · Cuenta A · RN-03 voz real en la app nativa (prueba técnica)
- Pedido de Victor: "el app no me pide permisos para el micrófono, así que aún no me escucha".
- Hecho:
  - `whisper.rn` 0.7.4 (whisper.cpp nativo) + `@fugood/react-native-audio-pcm-stream` 1.1.4 (captura PCM solo en
    memoria; revisado: no escribe archivos) + `buffer` (lo pide `safe-buffer` de whisper.rn). Permiso `RECORD_AUDIO`
    y `NSMicrophoneUsageDescription` en `app.json`. Metro empaqueta `*.bin`.
  - Modelos ggml en `apps/mobile/assets/models/` (NO en git): `npm run models -w @lee-conmigo/mobile` los baja de
    Hugging Face y verifica SHA-256: `ggml-tiny-q8_0` (44 MB), `ggml-base-q5_1` (60 MB), `ggml-silero-v6.2.0` (VAD, 0,9 MB).
  - `@lee-conmigo/speech-engine/core` (nuevo punto de entrada, puro): `UtteranceSegmenter` (frases con histéresis,
    con pruebas), PCM base64→float, `EnergyVad` (movido a su archivo), `cleanTranscript`. La app web no cambia.
  - `apps/mobile/src/speech/whisper-native-speech-engine.ts` (contrato `SpeechEngine`): permiso → micrófono → VAD por
    energía corta frases → Silero confirma que hubo voz → Whisper transcribe en el equipo → `onFinalResult`. Cola de 2
    frases (se quedan las más recientes). Versión `.web.ts` = "no disponible" (falla cerrado).
  - Pantalla **Prueba de voz** (Ajustes de padres → "Probar el micrófono"): modelo Rápido/Preciso, idioma, lo que
    entendió y cuánto tardó por frase, promedio y si va más rápido que la voz. Se apaga al salir o al pasar a segundo plano.
  - `packages/speech-engine/tests/privacy.test.ts`: falla si el código de voz usa red, archivos, almacenamiento o
    `audioOutputPath` (docs/12 §6). Excepción documentada: la web carga los pesos de sus modelos desde la propia app.
- Verificado: compila en Gradle (NDK + CMake se instalan solos), export android ✅ con los 3 modelos, `npm test` ✅,
  typecheck ✅. NO probado en un equipo real (aquí no hay emulador).
- Pendiente: Victor prueba en la tablet de Noah y en su teléfono (latencia, precisión, ¿tiny o base?). Con eso, RN-07:
  usar este motor con `RealReadingEngine` en la lectura (aviso a padres antes de pedir el micrófono, docs/12).

## 2026-10-16 · Cuenta A · Prueba de voz: "¿sabe lo que estoy leyendo?"
- Victor: "está escuchando mi voz pero no sé si sabe lo que estoy leyendo… que escriba lo que estoy leyendo".
- Hecho: la Prueba de voz ahora (1) pinta de VERDE en la frase las palabras que el reconocimiento entendió, con el mismo
  comparador de la lectura (`ReadingProgressTracker`; `apps/mobile/src/speech/read-along.ts`, con pruebas), con barra "%
  de la frase reconocida", "Otra frase" y "Volver a empezar"; (2) escribe todo lo que entendió en un recuadro y, por frase,
  "coinciden X de Y palabras con el texto"; (3) muestra diagnóstico del motor (`onDiagnostics`): medidor del micrófono y
  segundos de audio recibidos, frases detectadas / escritas / "no eran voz" / perdidas (p. ej. mientras carga el modelo) /
  en espera / errores — para saber en qué paso se queda si no aparece texto.
- Pendiente: que Victor la use y mande captura con lo que aparece (sobre todo los contadores si no sale texto).

## 2026-10-16 · Cuenta A · Voz en pausa → Matemáticas
- Victor: "el asunto de las voces es muy complicado… pasemos a otra etapa, vamos con los demás cuadernos, comencemos por
  matemáticas… necesito un poderoso prompt para hacer una investigación profunda… para los 6 niveles… inglés y español".
- Hecho: `docs/research/PROMPT-INVESTIGACION-MATEMATICAS.md` — prompt de investigación (CA CCSSM + CA Math Framework
  2023, alcance y secuencia 1.º–6.º, pedagogía con evidencia: CRA, esquemas, ejemplos resueltos, fluidez sin ansiedad,
  WWC/NCTM; bilingüe: vocabulario, notación, diferencias EE. UU./México, problemas verbales para English Learners, cómo
  leer números en voz alta; diseño para la app: interacciones, plantillas, dominio, competencia) con entregables en formato
  fijo, incluido un JSON de una unidad según SPEC §7, y un prompt de seguimiento por grado.
- RN-03 queda ⏸️ (el motor, la Prueba de voz y el APK siguen en el repo; no se conectaron a la lectura).

## 2026-10-16 · Cuenta A · K6: cuaderno de Matemáticas (unidad g3u1)
- Victor trajo la investigación ("listo, tengo la investigación del módulo de matemáticas") → copiada a
  `docs/research/matematicas-investigacion.md`. Se siguió su ruta: 3.º, "grupos → producto → arreglo → problema".
- Hecho:
  - `packages/contracts/src/math.ts`: unidad, habilidades, lecciones, retos con plantilla, pistas de 3 escalones.
  - `packages/math-content`: `content/g3u1.json` (4 lecciones), `validateUnit` (revisión automática del contenido),
    `generateChallenge` (determinista con semilla; el ejemplo resuelto usa otros números), dominio por evidencia
    independiente + repaso a +1/+3/+7 (luego +14/+30), plan de lección según los minutos del día (8/15/20), estado de un
    reto (confianza ANTES de comprobar, "Lo veo luego", nunca "incorrecto").
  - Corrección de contenido: el reto `l3.c1` decía "fichas/grupos" en un arreglo de filas → "puntos/filas".
  - `ui-native`: `EqualGroups`, `ArrayGrid`, `TapeDiagram`, `NumericKeypad`, `ConfidencePicker`, `HintLadder`,
    `PhaseTabs`, `PairsGame`. `ui-core`: `MATH_COPY` (textos ES/EN), Matemáticas disponible en la estantería.
  - `apps/mobile`: cuaderno (`math-notebook-screen.tsx`) y lección (`math-lesson-screen.tsx`).
- Verificado: typecheck ✅, `npm test` 1152 ✅, lección 1 completa en navegador (Playwright) y capturas en 4 tamaños.
- No hecho: etiquetas concepto/procedimiento/transferencia (el dominio no exige variedad todavía); guardar en el equipo.

## 2026-10-16 · Cuenta A · Matemáticas "se siente de preescolar" → nueva investigación
- Victor (APK 0.3.0): "esta bien el app… pero siento que no hace sentido… está demasiado simple, no hay problemas reales
  según como lo usan en la escuela, se siente como de prescolar… dame un prompt".
- Hecho: `docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md` — pide, por grado 1.º–6.º, cómo se ve una semana
  real (clase, tarea, examen), ≥12 arquetipos de ejercicio con ejemplos originales EN/ES, rangos de números, pasos,
  formatos de respuesta, modelos, errores comunes, tipos de problema verbal (tablas 1 y 2 de CCSS), progresión de una
  unidad (caso 3.OA), fluidez, diagnóstico de g3u1 y componentes/plantillas para la app; con fuentes y licencias.
- Siguiente: Victor corre el prompt; luego rehacer g3u1 con esa base.

## 2026-10-16 · Cuenta A · Matemáticas visuales, fase 1
- Victor trajo una lámina de 12 representaciones y dos documentos (prompt de gráficos y especificación de implementación):
  "creo que tenemos todo". Guardados en `docs/design/math-visual/`.
- Hecho (fase 1 de la spec, de punta a punta):
  - Dominio `math-content/src/visual`: plantilla → instancia con semilla → trabajo → evaluación con claves; 7 plantillas
    (bandeja 10, bandeja 20, construir grupos, leer grupos, repartir, hacer bolsas, repartir con residuo).
  - Textos ES/EN en `ui-core/math-visual-copy.ts`; escenas en `ui-native/components/math-visual`; pantalla Taller y
    galería DEV en `apps/mobile/src/screens/math-visual`.
  - Arreglo de UX encontrado al probar: con una galleta elegida, tocar una galleta que está en otro plato la suelta ahí
    (antes la elegía, y los platos llenos eran difíciles de tocar).
  - `PEDIDO-IMAGENES.md`: lista de imágenes para GPT (Victor ofreció generarlas).
- Verificado: pruebas de invariantes y casos de aceptación; textos de todas las claves en ES/EN; Taller completo con
  Playwright en 4 tamaños.
- Pendiente: 9 familias, arrastrar, imágenes, guardar en el equipo; detalle en `IMPLEMENTACION.md`.

## 2026-10-16 · Cuenta A · Arte de Matemáticas integrado
- Victor mandó 22 imágenes generadas con GPT (12 fondos, 10 objetos); faltan las 4 de Mila (sin referencia).
- Hecho: SHA-256 verificados; revisión visual (sin texto ni números, centro despejado); WebP (fondos 22–53 KB, objetos
  recortados a 256 px con transparencia, 10–17 KB) en `apps/mobile/assets/math/`; `MathArtProvider` en ui-native (si
  falta una pieza, forma de código); fondos por familia detrás del modelo (`decor`, para que Modo Enfoque lo apague).
- Arreglos al probar: las imágenes de plato/bolsa/parcela salían a su tamaño natural en la web (ancho/alto explícitos);
  al pasar de ejercicio (Taller y lecciones) la pantalla no volvía arriba.
- Verificado: Taller completo con Playwright en 4 tamaños, sin errores.

## 2026-10-16 · Cuenta A · Arte, pedido 2 (Mila, portadas, papalote)
- Victor mandó 18 imágenes (pedido 2 completo, A y B). Verificadas (SHA-256, sin texto); Mila coincide con la de las
  historias (rizos, pasador de estrella, camiseta turquesa, overol amarillo, tenis rojos), en el estilo plano de Mate.
- Hecho: WebP (Mila 37–42 KB, portadas 61–80 KB, objetos 4–24 KB); `prop_pastel` venía con una mancha gris en el centro
  → rellenada. En uso: portada del cuaderno en Inicio, encabezado de la unidad, papalote en "¡Estás aquí!", Mila guía con
  globo de mensaje en el Taller (saluda / piensa / ánimo / apunta / celebra según el momento, nunca triste), y Mila
  celebra al terminar el Taller y las lecciones. Todo decorativo: se apaga con `decor` (Modo Enfoque, K7).
- Verificado: Taller en 4 tamaños + lección 1 completa, sin errores.

## 2026-10-16 · Cuenta A · Matemáticas: las 12 representaciones
- Victor: "adelante, vamos a intentar terminar las matemáticas hoy". Y "no me des apk hasta que yo te diga" (anotado en
  HANDOFF). Sobre imágenes: con lo que hay alcanza por ahora.
- Hecho: las 9 familias que faltaban (valor posicional, recta, fracciones, barras, área/perímetro, reloj, gráficas,
  plano, razones) con dominio, textos ES/EN, dibujos y pruebas; Taller con grado (sugerido = nivel) y temas o mezcla;
  ejercicios visuales dentro de las 4 lecciones de g3u1.
- Arreglos al probar: imagen tapaba marcas/agujas/rebanadas en la web (SVG encima); tocar el plano/recta medía mal en
  la web → una zona tocable por cruce/marca; 3×6 tenía área = perímetro → el generador lo evita; títulos de pistas.
- Verificado: 94+ pruebas de matemáticas, typecheck, recorridos en navegador en 4 tamaños. NO probado en equipo real.

## 2026-10-16 · Cuenta A · Guardar en el equipo + arreglos en teléfono
- Victor pidió el APK (0.5.0, enviado) y "continúa con lo faltante". Luego, con captura del teléfono: "Hay cosas que
  quedan fuera".
- Hecho: RN-08 guardado local con expo-sqlite (kv síncrono; `localStorage` en web): perfiles, PIN, Lectura
  (`PersistentProgressStore`) y Matemáticas (respuestas, repaso, lecciones). Pruebas (incluye datos corruptos → empieza
  limpio, que encontró un error real con `null`) y recorrido en navegador: termina la lección 1, recarga, sigue marcada.
- Arreglos de lo que "quedaba fuera" en Android: fondo de la escena no llenaba la tarjeta (100 % sin el relleno del
  padre → `FILL_IMAGE` con los 4 bordes en 0); plantas fuera de la parcela (tamaño desde el interior del marco); plano y
  recta medidos sin el relleno de su panel; botones "Juntar 10 / Desarmar 1" en columnas angostas.
- No hecho: migrar el progreso de la app Capacitor de Noah (se empieza limpio). Probar en el equipo.

## 2026-10-16 · Cuenta A · Matemáticas: más contextos en grupos y reparto
- Siguiendo "continúa con lo faltante": los ejercicios de reparto y grupos ya no son siempre galletas y plantas.
- Hecho: `theme` en los modelos (versión 2 de 5 plantillas; mismos números por semilla), palabras ES/EN con género
  (`ui-core/math-visual-nouns.ts`), dibujos con el arte que ya estaba (lápiz, canica, manzana, caja, frasco, canasta) y
  objetos acomodados dentro del hueco de cada recipiente. Etiquetas de recipiente legibles sobre el dibujo.
- Verificado: 1190 pruebas (frases exactas por contexto, ninguna palabra de otro contexto, números = v1), typecheck,
  capturas en 1280×800, 390×844 y 844×390, y 12 ejercicios resueltos tocando en el Taller. NO probado en el equipo.

## 2026-10-16 · Cuenta A · K7a: Modo Enfoque (ajuste del padre) + Matemáticas
- Hecho: tipos en `contracts/focus.ts`; presets y `resolveFocus` (posición + horario, incluso cruzando la medianoche)
  en `session-engine/focus.ts` con pruebas; `focus` en el perfil (perfiles viejos quedan en Apagado); sección real en
  Ajustes (P4): Apagado / Encendido / Personalizado (menos dibujos, ejercicios por ronda) y "Solo en un horario".
  Matemáticas lo respeta: fondo desenfocado y tenue (no se quita, SPEC §1), sin Mila, rondas de 4 en el Taller.
- Para el niño no hay etiqueta ni aviso (D4): solo ve menos cosas alrededor.
- Verificado: 1194 pruebas, typecheck, navegador (PIN → Ajustes → Encendido → Taller con 4 ejercicios y fondo tenue;
  recarga y sigue igual) en 1280×800 y 390×844.

## 2026-10-16 · Cuenta A · K7b: Lectura en Modo Enfoque (B10)
- Hecho: apoyo `focusReading` («Lectura de una línea a la vez», encendido en Encendido y elegible en Personalizado).
  En la lectura: ilustración desenfocada y tenue de fondo, una sola columna centrada, solo la línea actual oscura (las
  demás tenues, `dimRead`), sin globo del coach, y abajo 3 botones: ayuda · micrófono (o «Siguiente» en lectura libre) ·
  escuchar. La hoja se desplaza sola para que la línea actual quede a la vista.
- Verificado: 1194 pruebas, typecheck, navegador en 1280×800, 390×844 y 844×390 (leer con el panel DEV, ayuda abierta,
  avance largo con desplazamiento). NO probado en el equipo.

## 2026-10-16 · Cuenta A · K7c: pausa de movimiento (B12)
- Hecho: apoyo `movementBreaks` (Encendido; elegible en Personalizado). Cada ~10 min de actividad (lectura, lección o
  Taller, solo con la app al frente; el reloj se comparte entre pantallas) se ofrece una pausa de 60 s con 3
  movimientos, SOLO en un límite natural: al terminar una página (la siguiente espera), un paso de la lección o un
  ejercicio del Taller. "Listo, volvamos" siempre disponible. 3 rutinas ES/EN que se turnan.
- Error encontrado al probar: en Lectura, al terminar la página el reloj dejaba de contar y eso ocultaba que ya tocaba
  la pausa → se separó "contar" de "activo".
- Verificado: 1196 pruebas, typecheck, navegador con reloj simulado (Taller y Lectura: aparece, avanza el temporizador,
  la página espera y luego sigue). La lección usa el mismo patrón; no se recorrió en navegador.

## 2026-10-16 · Cuenta A · Matemáticas: arrastrar en el reparto
- Hecho: en el reparto las fichas se arrastran a un recipiente o de vuelta a la bandeja (`DragToken`: `PanResponder`,
  zonas medidas con `measureInWindow`); un toque sigue siendo un toque. Instrucción actualizada ("Arrastra… o tócala…").
- Error encontrado al probar: el segundo arrastre no arrancaba en la web porque la ficha se volvía a montar dentro del
  gesto → soltar se aplica después del gesto.
- Verificado: navegador con ratón (1280×800) y toque (390×844): 3 arrastres seguidos, devolver a la bandeja, tocar;
  6 repartos resueltos tocando. NO probado en el equipo.

## 2026-10-16 · Cuenta A · PREP-1: preparación para Ciencia y Sociedad en paralelo
- Victor: "ciencia aquí y sociedad en la otra cuenta". Antes de empezar se dejó el repo listo para no pisarse (D12).
- Hecho: módulos `apps/mobile/src/subjects/{ciencia,sociedad}` con registro (`SubjectModule`: `available`, `homeCard`,
  `Screen` con navegación propia) y ruta genérica en `App.tsx` + Inicio (no se vuelve a tocar); guardado por materia y por
  niño (`subjectStorageFor`, entra en "Borrar el progreso"); paquetes vacíos `science-content` y `social-content`;
  índices reservados en ui-core/ui-native; protocolo `docs/14`, informe `docs/design/subjects/PATRON-MATEMATICAS.md`,
  relevo por materia (`docs/handoff/`, `docs/log/<materia>.md`), secciones `CI-xx`/`SO-xx` en el ROADMAP, `/retomar` y
  `/relevo` con materia.
- Verificado: typecheck, pruebas, y navegador (Ciencia activada de prueba abre y vuelve; Sociedad sigue "Pronto").


## 2026-10-21 · Cuenta A · K8a: Mi cuaderno ya se puede usar
- Victor vio «Mi cuaderno: Pronto» en Inicio y preguntó si se podía ir trabajando. Se construyó como un módulo más (`apps/mobile/src/subjects/mi-cuaderno/`, mismo mecanismo que Ciencia/Sociedad/Arte) con 3 líneas en lo compartido que ya estaba previsto para una materia nueva: `subjects/ids.ts`, `subjects/registry.ts` y `persist/store.ts` (`SUBJECT_KEYS`, así «Borrar el progreso» también lo borra).
- Qué hace: **palabras nuevas** (las que le costaron en Lectura, con sílabas y significado de la historia; no se guarda nada aparte), **ideas** (frases de hasta 140 letras con la materia; 3 por día; se pueden quitar; con el cuaderno lleno avisa, no borra) y **dibujos** (sus pinturas y collages de Arte, leídos de ahí). Todo en el dispositivo (D1). Pestañas Todo/Palabras/Ideas/Dibujos; en tableta, dos columnas; en teléfono, una.
- Sin imágenes nuevas: el espiral y la estrella son código; cuando lleguen `mat_notebook_page`, `star_full`, `empty_notebook` (pedido K8) se cambian sin tocar la lógica.
- Falta (K8b): el botón «Guardar en mi cuaderno» del cierre de cada materia (hoy las ideas se agregan desde Mi cuaderno), Logros, informe PDF.

## 2026-10-21 · Cuenta A · K8b: Logros, estrellas dibujadas y arte del núcleo conectado
- Victor mandó los 19 PNG de los lotes K-1/K-2/K-3 (estrellas, sello, papalote, 7 logros, Mi cuaderno y 2 portadas de Arte). Todos válidos. Arte del núcleo en `apps/mobile/assets/kitewise/` con mapa en `apps/mobile/src/kitewise-art.ts`; las dos portadas, en `assets/arte/covers/`.
- **Logros** (`achievements.ts`, `screens/achievements-screen.tsx`, ruta nueva en `App.tsx` y el botón «Logros» del riel ya abre): 7 pegatinas con las reglas de `docs/01` sobre `computeProgressStats` (las mismas del prototipo web). Ganadas a color; las que faltan, apagadas con lo que hace falta y «2 de 5», sin reproche.
- **Cierre con estrellas dibujadas:** `ClosingCard` (ui-native) recibe `starImages` opcional y dibuja ganada/grande/dormida; sin la prop sigue usando `★`. Tocado (una línea cada uno): `reading-screen.tsx`, `subjects/ciencia/session-player.tsx`, `screens/sociedad-investigation-screen.tsx`.
- **Mi cuaderno:** hoja con renglones y margen rosado de fondo, cuaderno vacío en el estado sin palabras, estrella dibujada en el pie.
- Verificado en Chromium (Logros vacío y con progreso, Mi cuaderno, tarjetas de Arte, cierre). 176 pruebas de mobile + art-content.

## 2026-10-21 · cuenta A · Cierres → cuaderno, grano de papel, Mi museo, informe PDF
- PRs #32–#34 fusionados: «Guardar en mi cuaderno» en los cierres, grano de papel en la pintura, Mi museo (AR-M2), informe semanal en PDF (K8c, P5). 1725 pruebas verdes.
- Siguiente: APK a pedido de Victor (módulos nativos nuevos) y verificar en Android; luego AR-06c. Detalle en `docs/handoff/artes.md`.

## 2026-10-22 · cuenta A · Recordatorios locales (K8d)
- Modo padres → «Recordatorios»: aviso diario de lectura por niño (hora y días a elección; por defecto apagado, L–V 16:30) y aviso semanal de que el resumen está listo. Todo local; el permiso de notificaciones se pide solo al activar un aviso.
- Reglas: amables y sin culpa (D5); si hoy ya leyó no se avisa; solo se programan 7 días hacia adelante (si no abre la app en una semana, se acaban solos); se reprograman al abrir la app, al volver a ella y al terminar una sesión.
- Privacidad: `expo-notifications` trae Firebase por dentro → plugin `no-push.js` lo quita del manifiesto + prueba de guardia. Pendiente verificar el manifiesto final del APK.
- Toca lo compartido (mínimo): `App.tsx`, `parent-home-screen.tsx`, `app-state.ts`, `persist/store.ts`, `app.json`, `package.json`/lock.

## 2026-10-22 · cuenta A · Marca (K8e)
- Logo e íconos de Kitewise hechos en código (`scripts/marca.mjs`): cometa de cuatro paños sobre el azul de la marca. Reemplazan los íconos de plantilla de Expo (`icon`, adaptable, monocromo, favicon, splash) y se agregó el ícono de avisos y los gráficos de Google Play. `app.json`: fondo adaptable `#1E6FE8` e ícono del plugin de avisos. Guía: `docs/design/kitewise/BRAND.md`.

## 2026-10-22 · cuenta A · Aviso legal al iniciar (K9)
- Pantalla «Antes de empezar» (ES/EN) antes de entrar a la app: resumen de avisos, pregunta de adultos, casilla de aceptación en nombre propio y del menor; guarda versión + fecha y vuelve a pedir si cambian los textos. Modo padres → «Legal y privacidad»: textos completos, contacto y «Borrar todos los datos».
- Textos BORRADOR (avisos, política de privacidad, términos) en `apps/mobile/src/legal/copy.ts` y generados a `docs/legal/*.md` (`node scripts/legal-docs.mjs`). Paquete para el abogado: `docs/legal/REVISION-ABOGADO.md` (mapa de datos para Play, permisos, 12 preguntas).
- Privacidad técnica: `allowBackup=false`; permisos quitados: INTERNET, SYSTEM_ALERT_WINDOW, almacenamiento externo (verificar en Android real). Pruebas de guardia nuevas.
- Faltan datos de Victor (marcados [PENDIENTE]): nombre legal del editor (C11), correo de contacto, URL de la política, ley aplicable.

## 2026-10-22 · cuenta A · Lectura libre por defecto y revisión a fondo (K10)
- Pedido de Victor tras usarla Noah: la lectura con escucha no está lista, así que **lectura libre es el modo por defecto** (perfil de partida y perfiles nuevos; los perfiles ya guardados pasan a lectura libre UNA vez, `migrations.freeReadingDefault`; si el padre la apaga después, se respeta).
- Defectos encontrados y arreglados en el modo: (1) no se podía volver de página → botón ‹ (nuevo `free.forward` en el flujo: volver y seguir no cuenta la página dos veces); (2) el tiempo era el reloj de pared sin tope y no contaba al salir → reloj propio (`free-clock.ts`): solo con la app a la vista, con tope por página (2 s por palabra + 25 s) y se acredita también al salir/volver; (3) el contador «Llevas» y la barra se quedaban en cero → ahora corren (barra = avance en la historia); (4) aviso «¡Página completa!» de 0,6 s ignoraba toques → en libre se sigue a los 0,2 s sin aviso; (5) doble toque saltaba dos páginas → antirrebote de 450 ms; (6) el scroll de la hoja se quedaba donde estaba al cambiar de página → se reinicia por página; (7) el botón atrás de Android cerraba la app perdiendo la sesión → ahora cierra ayuda/cierre o sale guardando; (8) el globo del coach tapaba el texto → solo unos segundos al empezar; (9) la vista pasaba por alto `freeReading` (pausa larga podía oscurecer) → ya se le pasa.
- Verificado en Chromium con reloj simulado (tableta, teléfono vertical y Modo Enfoque): ir/volver/doble toque/10 min de inactividad acreditan solo el tope/cierre/guardado/retomar. 11 pruebas nuevas.

## 2026-10-22 · cuenta A · Finanzas (FI-01…03) y manifiesto sin Firebase
- Fix: el plugin `no-push` quita TODO el envío remoto de Firebase (servicio, receptor, permiso c2dm); verificado en el manifiesto fusionado (PR 42).
- Revisados los documentos de «Para la vida» que entregó Victor (`vida-8-modulos`, módulos 01–03). Se empieza por **Finanzas** (módulo 01): especificación adaptada con piloto 4.º «Un evento que resiste cambios» y decisiones DF-1…DF-8 (propuestas), y el dominio puro en `packages/finance-content` (UM, libro de movimientos, sobres con imprevistos, costo de oportunidad, ofertas sospechosas) con 21 pruebas que reproducen los ejemplos del manual. Sin pantallas todavía. Siguiente: confirmar DF, lista de imágenes, unidad JSON validada, textos ES/EN, módulo de app.

## 2026-10-22 · A · FI-05 Finanzas: unidad F4-U01 en JSON + motor de sesión
Unidad piloto (6 encuentros ES/EN), validador y motor de sesión puro en `packages/finance-content`; estrellas por esfuerzo. 1806 pruebas verdes. Siguiente: textos ES/EN y pantallas (FI-06/07).

## 2026-10-22 · A · FI-06/07 Finanzas: textos ES/EN y módulo en la app
Cuaderno + reproductor de la unidad F4-U01 (6 encuentros) con arte provisional en código; tarjeta «Finanzas» en la estantería. Probado en 4 tamaños con Chromium. Siguiente: imágenes de Victor y revisión de un educador.

## 2026-10-22 · A · PV-01..04 «Para la vida» 02–08 instalados (Primer vistazo) + mega pedido de imágenes
Motor de misiones compartido (`life-content`), 7 misiones ES/EN, 7 cuadernos aparte con fila «Para la vida» en Inicio, probados de punta a punta en Chromium en 4 tamaños. Mega prompt de 43 imágenes entregado en el chat y en `docs/design/vida/`. Siguiente: imágenes de Victor y revisión de especialistas.

## 2026-10-22 · A · PV-05 Arte real de «Para la vida» 02–08 conectado
Victor generó las 43 imágenes (Partes 1 y 2). Convertidas a WebP (2,6 MB) con manifiesto SHA-256; portadas en la estantería (4×2), banner del estante, guía y escena en cada misión. Probado en 4 tamaños. Finanzas sigue con arte provisional.

## 2026-10-22 · Codex · LE-01 puente: lector por escenas y ayuda por palabra
- Pedido de Victor: dos cuentos en secuencia; segundo confirmado como «El mapa de la puerta desaparecida», no el conejo. Se conserva TTS y la ayuda de TODAS las palabras como función central.
- Puente integrado en lectura libre: diez escenas en sus seis variantes, arte original encuadrado + ilustración de muestra, letra ajustable por niño, anclas compatibles con marcadores antiguos, hasta tres preguntas y tres palabras de repaso con lógica compartida.
- Comprobado: 1.834 pruebas de la suite, TypeScript en todos los paquetes, lint sin errores y recorrido Chromium ES/EN con cuatro tamaños, ayuda, reanudación, preguntas, repaso y guardado. Voz audible/Android pendientes de dispositivo; no se genera APK.
- Siguiente: LE-02. Detalle: `docs/design/reading-pilot/README.md`.

## 2026-10-22 · Codex · LE-02 mapa y cierre del piloto de dos cuentos
- «El mapa de la puerta desaparecida» integrado después del puente: veinte páginas editoriales intactas, 47 fragmentos ES / 44 EN entre párrafos. Texto, identidad y vocabulario originales preservados. Asociaciones de arte revisadas; nueva imagen de Elena escribiendo la carta, distinta de Nora con el álbum.
- Preparación basada en datos por familia; anclas de página/bloque/párrafo, textos alternativos ES/EN, encuadres revisados y ayuda con pronunciación en todas las palabras. Borrar progreso conserva la letra elegida; borrar todos los datos sí la elimina.
- Verificación final: 1.838 pruebas (125 archivos), TypeScript, lint, build web anterior, exportación web Expo y cuatro recorridos completos en Chromium (ES/EN de ambos cuentos), cada uno con cuatro tamaños, ficha de vocabulario, pronunciación simulada, reintento, relectura, preguntas, repaso y reanudación. Capturas, manifiesto y resultados: `docs/design/reading-pilot/`.
- Voz audible y experiencia nativa pendientes de dispositivo físico. No se generó APK, no se desplegó y no se fusionó en master. Rama `codex/lectura-puente-y-mapa` subida. La API de GitHub devolvió Forbidden con la autenticación disponible al intentar consultar el repo; Git HTTPS sí permite subir la rama, por lo que no se pidió ningún token al usuario.


## 2026-10-22 · Codex · LE-03 integración en master autorizada
Victor confirmó que funciona y pidió fusionar para preparar el APK. `origin/master` permanecía en abc6a79; integración fast-forward de los commits 63bec7f y 12b7030 sin conflictos ni cambios de código adicionales. Se conservan las comprobaciones completas del mismo código (1.838 pruebas, TypeScript, lint, builds web y recorridos ES/EN). La exportación Android detecta los modelos locales de voz ausentes; tanto el descargador habitual como curl fallan porque el proxy bloquea Hugging Face (HTTP 403). No se añadieron archivos falsos ni se alteró la voz. Pendiente en el entorno de compilación: `npm run models -w @lee-conmigo/mobile`, generar APK y probar en dispositivo real. No se generó APK ni se publicó en tienda.


## 2026-10-22 · Codex · LE-04 entorno Android y APK terminado
Victor pidió completar también la preparación y el APK. Dominios de modelos y `repo.reactnative.dev` añadidos al borrador de red; acceso observado y descargas comprobadas en la sesión. Herramientas oficiales verificadas por checksum fuera del checkout: SDK 36, NDK 27.1.12297006, CMake 3.22.1, Gradle 9.3.1 y JDK 17 completo (la imagen traía Java 21 sin javac). Los tres modelos originales pasaron SHA-256. Exportación Android y bundle real de 506 recursos aprobados; `assembleRelease` terminó con 610 tareas. APK `/workspace/Kitewise-lectura.apk`, 335.416.322 bytes, fuente 4fefbef, SHA-256 `3d3889fac86150874b878dd45500023ebe06ffe7659fd4bdc139ce901dfdbdca`. Firma v2 y alineación ZIP de 16 KB verificadas, cuatro arquitecturas, bundle y hashes de los tres modelos y las dos imágenes nuevas presentes. Release instalable con llave de pruebas Expo; sin publicación en tienda. Sin cambios de código/dependencias para compilar; este commit solo actualiza documentación. Metadatos en `docs/design/reading-pilot/APK-VERIFICATION.json`. Instalación y arranque reutilizables guardados en el borrador de entorno; el usuario debe revisar/guardar/publicar para conservar la preparación. Pendiente TTS audible y manejo en dispositivo real.


## 2026-10-22 · Codex · LE-05 publicación del APK: flujo preparado
El enlace local del APK no permite a Victor descargarlo en el teléfono; pide alojarlo. La API directa sigue bloqueada por el proxy pese al borrador de red, mientras el Git remoto y las páginas públicas del repo funcionan. Se prepara publicación nativa de GitHub Actions por etiquetas `apk-lectura-*` (solo bajo petición), con Node 24/JDK 17/SDK 36, dependencias y modelos verificados, build release y comprobación de firma/alineación/hashes del arte/modelos. Publica APK/checksum como prerelease con el token automático de GitHub; no requiere token personal ni servicio de archivos ajeno al repo. Actionlint 1.7.7 verificado con su checksum oficial y workflow aprobado. Sin cambios de código de la app ni dependencias. Pendiente subir etiqueta, comprobar ejecución y descargar el APK publicado.


## 2026-10-22 · Codex · LE-05 APK publicado y descarga comprobada
Publicado el prerelease público https://github.com/Victordaz07/Leeconmigo/releases/tag/apk-lectura-2026-10-22. Descarga directa https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-22/Kitewise-lectura.apk, 335.432.702 bytes, SHA-256 `4c40f656bf8e3792571fb491374396e305312d9e6f6680338ebb9d3fd7eb202a`. Workflow `39857520145`, intento 2, éxito en 29m36s, fuente 203f0c9. Se descargó el APK completo con HTTP 200 y se verificaron checksum, firma v2, alineación ZIP de 16 KB, cuatro arquitecturas, bundle, tres modelos y dos ilustraciones nuevas. Certificado igual al APK local. Evidencia: `docs/design/reading-pilot/DOWNLOAD-VERIFICATION.json`. La API local quedó accesible y permitió gestionar releases, pero la subida a `uploads.github.com` rechazó la autenticación con 401. El primer intento de CI se canceló al probar la subida directa; se eliminó únicamente el borrador vacío creado en esa prueba y se reejecutó el workflow, que publicó correctamente con su token automático. No se pidió un token personal ni se usó un servicio de archivos ajeno al repo. Sin cambios de la app ni de sus dependencias. Avisos no bloqueantes del runner: actions v4 (Node 20) forzadas a Node 24 y migración de ubuntu-latest a Ubuntu 26; revisar versiones de acciones en mantenimiento futuro. Pendiente prueba real de TTS y tacto.

## 2026-10-22 · Codex · LE-06: cuadernos invisibles en Android

Victor adjunta una captura del APK con ambas estanterías vacías. No falta el catálogo: el flex positivo heredado de NotebookCover fuerza una base cero en Yoga, aun con ancho y flexBasis auto explícitos. Se restablece flex a cero en la variante de ancho fijo. Reproducción contra los fuentes C++ de Yoga de la versión instalada de RN: antes 0 frente a 288 esperados; después pasan 84 posiciones/anchos en seis tamaños (320/375/390/844/800/1280). La comprobación lee los estilos reales del componente y se añade al workflow, sin dependencias nuevas. Chromium verifica 14 tarjetas en cinco tamaños y abrir Lectura. Sin migraciones ni borrado de datos. 1.838 pruebas / 125 archivos, TypeScript de todos los workspaces, lint del componente y actionlint correctos. Evidencia: `docs/design/reading-pilot/NOTEBOOK-LAYOUT-VERIFICATION.json`. APK corregido pendiente de publicación y descarga verificada.

LE-06, publicación: el primer workflow (`39867989902`, etiqueta `apk-lectura-2026-10-22-cuadernos`) se detuvo en la nueva comprobación, sin generar ni publicar APK. El job define NODE_ENV=production y npm ci omitía dependencias de desarrollo: se exige `--include=dev` para disponer del compilador TypeScript móvil usado por la prueba. Se añade diagnóstico de API del compilador y anotación de errores en Checks, pues los registros de GitHub redirigen a almacenamiento bloqueado por la política de red. El borrador del entorno conserva las reglas y añade los hosts concretos de registros; guardado confirmado, requiere revisión/guardado/publicación para persistir y aplicarse. La corrección de la app permanece igual.

LE-06 terminado: workflow `39868481194` / job `120136618797` correcto (19m37s), incluida la comprobación de Yoga nativo. Publicada etiqueta `apk-lectura-2026-10-22-cuadernos-r2` desde 1e6135f. APK descargado entero por HTTPS (HTTP 200, 335.432.702 bytes); SHA-256 `d11bac825e1c06da8404b490c05b91c37eaf73c7a72665032debbf72b17e444a`, checksum publicado coincidente, firma y alineación de 16 KB correctas, cuatro arquitecturas y modelos/arte originales presentes. Bundle distinto al de la versión con el fallo. Certificado igual al anterior: instalar como actualización para mantener los datos. Nuevo enlace y evidencias en README y DOWNLOAD-CUADERNOS-VERIFICATION.json. Pendiente comprobación física por Victor; no se afirma validación audible ni publicación en tienda.

## 2026-10-22 · Codex · LE-07: plegables, lector compacto e idioma

Se implementa el concepto aprobado: arte arriba en vertical, izquierda en cualquier horizontal, texto independiente y avance de 48 dp sin cubrir contenido. La cabecera del panel de padres deja de desplazarse; accesos compactos en fila horizontal y contenido con altura limitada. Panel/ajustes/cuaderno evitan columnas cuando no hay ancho suficiente, incluso al abrir/cerrar un plegable. Contexto de interfaz según idioma de perfil y preferencia local para selector/PIN; se traducen Inicio, cuadernos, padres, ajustes, recordatorios, legal (copia ya existente), ayuda, cierre, feedback, diagnósticos y PDF. Contenido editorial y pronunciación conservados; no se añade dependencia ni motor de voz. 1.843 pruebas / 126 archivos, TypeScript y lint sin errores (tres avisos anteriores); 168 portadas con Yoga en 12 tamaños; 24 casos de interfaz en ocho ventanas sin recargar, borrador conservado, controles accesibles, geometría del lector, pronunciación simulada y EN→ES persistente al reiniciar; recorridos completos del puente y mapa en ES/EN con preguntas, repaso y reanudación. Evidencias: `docs/design/fold-and-language/`. El entorno se reinició durante el cierre: fuentes y registros se conservaron. Se prepara 0.1.1 / versionCode 2 para una entrega instalable sobre el anterior. Publicación pendiente; Fold físico/TTS audible no probados.

LE-07 entrega terminada: CI `39880337558` / job `120175939662` correcto en 27m33s desde 2b29847, incluida la prueba nativa de 168 portadas. Publicada etiqueta `apk-lectura-2026-10-22-fold-idioma` y descarga HTTPS real comprobada: HTTP 200, 335.456.214 bytes, SHA-256 `7fc155c067d1009ab903d5525b8ad435a27bc6bdf50c63f0141b9ac48e191b31`, checksum coincidente, firma/alineación 16 KB, cuatro arquitecturas y modelos/arte originales. Aapt confirma `com.kitewise.app`, versionName 0.1.1, versionCode 2; mismo certificado que el APK anterior, por lo que se instala como actualización para conservar los datos. Evidencia y enlace definitivo: `docs/design/fold-and-language/APK-VERIFICATION.json` y README. Prueba física de plegado/teclado/tacto/voz audible pendiente de Victor. No publicación en tienda.

## 2026-10-22 · Codex · LE-08 / LE-09: zoom y resto del catálogo de lectura

Victor confirma que los dos libros funcionan bien y pide apreciar mejor las ilustraciones pequeñas y continuar los demás. Se añade visor independiente con lupa, pellizco 1–4× anclado a los dedos, arrastre limitado, ajustar y controles de 48 dp ES/EN. Volver/Atrás/Escape conserva el fragmento; al cambiar dimensiones se ajusta el arte, manteniendo abierto el visor. La prueba táctil detectó dos problemas y quedaron corregidos: al girar se desmontaba la vista ampliada (estado elevado al lector) y Chromium aplicaba además su zoom de página (política táctil explícita solo en web). Geometría pura en ui-core, sin dependencias nuevas ni cambios de voz.

Se preparan las 23 familias restantes: catálogo completo de 25 familias / 81 variantes de idioma/nivel, 362 asociaciones de escena. Arte/textos/vocabulario/preguntas/identidad y anclas originales conservados. Las 67 escenas que citan el fondo editorial vacío no reservan una columna de arte ni ofrecen lupa. Encuadres explícitos revisados mediante láminas; diagonales/explosiones conservan su panel; se corrige la presentación de las tres columnas de la página 2 del tren y se recuperan descripciones de originales para cuatro imágenes repetidas de la cúpula. No se modifica el contenido fuente ni se genera arte nuevo.

Validación: 1.943 pruebas / 127 archivos, TypeScript de todos los workspaces, lint sin errores/avisos, 168 portadas con Yoga real en 12 tamaños. Visor en 12 casos ES/EN con pellizco y arrastre mediante eventos táctiles Chromium, límites, ajuste, giro sin cerrar, salida y posterior pronunciación simulada. 49 recorridos completos (cada familia/idioma disponible, nivel mayor), 991 fragmentos y 145 preguntas, cuatro tamaños, ayuda, reanudación, reintentos, repaso y cierre único persistido. Exportación Android Hermes aprobada (2.255 módulos, 501 recursos). Evidencias en `docs/design/reading-catalog/`. No nuevo APK en esta tarea; 0.1.1 pública todavía no incluye estas modificaciones. Pendiente dispositivo físico para gestos y TTS audible.

## 2026-10-22 · Codex · LE-10: APK del catálogo y zoom solicitado

Victor pide preparar el APK. Se incrementa a 0.1.2 / versionCode 3 y se actualizan las notas del workflow. Además de modelos/arte piloto, se exige la presencia por SHA-256 de todas las ilustraciones referidas por las 25 ediciones. El código de lectura conserva las 1.943 pruebas y 49 recorridos aprobados en 9030303; solo cambia la versión y la preparación de entrega. Pendiente CI, publicación y descarga verificada con certificado igual al anterior.

LE-10 terminado: CI `39897427468` / job `120230978328` aprobado en 19m43s, fuente a7f3942, etiqueta `apk-lectura-2026-10-22-catalogo-zoom`. APK 0.1.2 / código 3 descargado completo por HTTPS (HTTP 200), 335.490.378 bytes, SHA-256 `bc90cccb2a4325c4a8c6164a16ed5d807c7a6663a9c3fd3f76ba1e79cb3e8a3b`, coincidente con checksum y digest de GitHub. Firma v2, alineación ZIP 16 KB, mismo certificado que 0.1.1, cuatro arquitecturas y sin debug. Hashes de las 166 ilustraciones referidas y tres modelos comprobados; 25 nombres de manifiestos de edición y el control de zoom presentes en el bundle, distinto del anterior. Metadatos y enlace en `docs/design/reading-catalog/APK-VERIFICATION.json` y README. La instalación es una actualización que conserva datos; no es publicación en tienda. Pendiente Fold físico/TTS audible. Avisos de CI no bloqueantes: acciones v4 de Java/Node/checkout y cambio de imagen Ubuntu; actualizar acciones en mantenimiento futuro.

## 2026-10-22 · Codex · VZ-01: investigación del motor de lectura con voz

Victor aprueba APK 0.1.2 y solicita investigación hiperextensa inspirada en el dictado de Gboard para leer con el niño. Se entrega `docs/research/lectura-con-voz/`: informe de ~10.000 palabras/21 apartados, auditoría, protocolo, 76 referencias técnicas/de investigación/foros, manifiesto de consultas y PDF de 54 páginas. 157 intentos HTTP y 115 recuperaciones correctas; las páginas bloqueadas no se presentan como leídas. Fuentes originales AOSP, SDKs/muestras oficiales, repositorios y resúmenes de autores, modelos/licencias y respuestas de mantenedores; no se afirma haber leído PDFs inaccesibles ni haber medido voces infantiles. Se comprobó SHA-512 del tarball Expo Speech Recognition 57.0.0 sin instalar/ejecutar, código fijado a su commit y niveles de API con metadatos oficiales SDK 36.

Hallazgos: preferencia offline no equivale a fábrica local, permiso INTERNET de la app no gobierna servicio externo por IPC; wrapper 57 exige guardas por versión/idioma y auditoría iOS; reportes de pérdida de finales al detener y fixes realtime Whisper posteriores a la versión estable 0.7.4. Moonshine publica streaming EN/ES MIT, pero binding parte de API 26 y tres ABIs frente a API 24/cuatro actuales. ML Kit Speech tiene ejemplo alfa, soporte Fold no demostrado. Se reprodujo sin audio que solo «jardín» al final de una frase produce match índice 9/score 1; el consumidor experimental acepta una palabra y emite correct de cursor a fin, pudiendo inventar cobertura. No está activado en el lector libre actual.

Recomendación: primero corregir alineación/revisiones/cobertura y tiempos, luego comparar Android estrictamente local, Moonshine y Whisper con mismo protocolo. Sin cambiar app, paquetes, voz/privacidad ni APK; sin grabar/subir voz infantil. D1 permanece y la investigación cloud es solo documental. Verificados enlaces/citas y reproducción textual; no se repite suite de app por cambios solo documentales (última suite del código: 1.943 aprobadas). PDF revisado visualmente en portada, página interior y final. Pendiente VZ-02 y ensayos físicos/acústicos; no decisión definitiva de proveedor sin medir.


## 2026-10-22 · Codex · VZ-02/VZ-05: primera escucha acompañada y laboratorio preservado

Victor autoriza implementar para probar mañana y confirma que Prueba de voz de Ajustes debe seguir como herramienta futura. Comparador nuevo con cobertura/hipótesis separadas y ventana limitada, controlador puro, sesión acompañada opcional en todos los cuentos preparados. Android local vía wrapper 57 fijado, API 33+ e idioma instalado; alternativa explícita Whisper Base y manual intacto. Endurecimiento reproducible sin logs ni archivo PCM vacío, guarda nativa estricta. Exclusión global de micrófono entre lector/laboratorio, generaciones y barreras de parada, TTS/zoom/segundo plano coordinados. Reloj acompañado solo con evidencia alineada final y límites, mixto distinguido. Laboratorio conserva modelos Whisper, ES/EN y diagnósticos, añade Android/parciales y usa el mismo comparador; transcripciones temporales. Reparado VAD que aprendía la primera voz como ruido y cancelación de trabajos Whisper. Regresión inicial 1.981 pruebas; casos adicionales y validaciones finales en curso. Compilación Kotlin release del wrapper endurecido aprobada, recorridos completos puente/mapa ES/EN aprobados y recuperación web ES/EN en cinco ventanas por idioma sin ASR externo. Preparando APK 0.2.0/código 4; descarga/validación final pendiente. Límites y protocolo de prueba física sin grabar voz: `docs/design/read-together/README.md`. No medición acústica infantil/Fold, no selección definitiva de proveedor.

Validación final del código: 1.984/134, TypeScript y lint correctos; zoom 12 casos y Yoga 168/12 aprobados. Evidencia y limitaciones en `docs/design/read-together/VALIDATION.md`.

Preparación de entrega 2026-10-23: 0.2.0/código 4, misma identidad/firma; CI ejecutará suite/TypeScript antes de compilar y comprobará la guarda nativa estricta y el lector nuevo dentro del APK. Etiqueta prevista `apk-lectura-2026-10-23-motor-lectura`.

Revisión previa a descarga: se cancela CI inicial antes de publicar para corregir dos casos con regresiones: errores/permiso retenidos hasta reintento explícito (sin nuevas solicitudes al volver del fondo o pasar de fragmento), y cobertura reiniciada al repetir un cuento de un solo fragmento. Se prepara etiqueta r2, mismo 0.2.0/código 4; no hubo APK anterior 0.2.0 publicado.

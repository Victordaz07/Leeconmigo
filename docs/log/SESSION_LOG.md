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

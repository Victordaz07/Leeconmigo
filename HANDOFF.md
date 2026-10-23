# HANDOFF — estado actual
Actualizado: 2026-10-22 · Cuenta: Codex · Rama: master
Último commit: ver `git log -1`

## Materias en paralelo (D12, 2026-10-16)
Ciencia (cuenta A) y Sociedad (cuenta B) se trabajan a la vez. Su estado vive en `docs/handoff/ciencia.md` y
`docs/handoff/sociedad.md` (usa `/retomar ciencia` o `/retomar sociedad`). Este archivo queda para lo general. Reglas:
`docs/14-MATERIAS-EN-PARALELO.md`. Preparación (PREP-1) hecha: módulos enchufados como "Pronto".

## Dónde está cada cosa (2026-10-22) — LEER PRIMERO si llegas de otra cuenta
Todo el trabajo está en `master` de `Victordaz07/Leeconmigo` (rama de trabajo `claude/gracious-shannon-a0238d` se reinicia desde `master` tras cada PR). Estado por materia, con «siguiente paso exacto»:
- Ciencia → `docs/handoff/ciencia.md` · Sociedad → `docs/handoff/sociedad.md` · Arte y música → `docs/handoff/artes.md`
- Finanzas («Para la vida» 01) → `docs/handoff/finanzas.md` (motor y app hechos; **arte real pendiente**: Victor genera el Lote A/B de `docs/design/finanzas/PEDIDO-IMAGENES.md`)
- Para la vida 02–08 (Emociones, Comunicación, Vida digital, Pensamiento crítico, Autonomía, Organización, Emprendimiento) → `docs/handoff/vida.md` (instalados como «Primer vistazo» con arte real; faltan investigación de 04–08 y revisión de especialistas)
- Decisiones confirmadas: `docs/DECISIONS.md` (D1–D16). Hoja de ruta: `docs/ROADMAP.md`. Bitácora corta: `docs/log/SESSION_LOG.md`.
- Pedidos de imágenes y manifiestos (SHA-256 de los PNG originales, que NO están en el repo): `docs/design/*/PEDIDO-IMAGENES*.md`, `docs/design/*/arte/manifest-*.json`; conversores en `scripts/*-imagenes.py`.
- Legal: `docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md`, `docs/legal/`, `apps/mobile/src/legal/config.ts`. **Pendientes de Victor:** nombre de quien publica, correo de contacto, URL pública de la política, ley aplicable (y revisión de un abogado; búsqueda manual de la marca «Kitewise»).
- Fuera del repo (solo Victor / la sesión): los `.zip` con los PNG originales, los APK (se generan a pedido), y la conversación. Un APK solo se construye cuando Victor lo pide.
- Verificación: `npm run typecheck --workspaces --if-present`, `npm run typecheck -w apps/mobile`, `npm test` (≈1820 pruebas ✅).

## Tarea en curso
**Codex · LE-07 código verificado, entrega en curso (2026-10-22):** Victor aprueba lectura compacta y pide depurar Fold vertical/horizontal e interfaz inglesa completa. Lector de los dos cuentos con arte arriba en vertical y a la izquierda en todo horizontal, avance 48 dp y espacio reservado; panel de padres con cabecera/accesos persistentes y formularios que usan columnas según ancho. Contexto ES/EN según perfil, último idioma local para selector/PIN; navegación, ajustes, ayuda, cierres, recordatorios, PDF y diagnósticos localizados. Se conservan contenido editorial, pronunciación y progreso. Pruebas: 1.843 / 126 archivos, TypeScript completo, lint sin errores (tres avisos anteriores), 168 portadas con Yoga/12 tamaños, 24 casos de interfaz/8 ventanas, cambio EN→ES persistente y recorridos completos de ambos cuentos ES/EN. Detalle y capturas: `docs/design/fold-and-language/README.md`. Preparada 0.1.1 / Android versionCode 2, mismo paquete/llave; pendiente compilar/publicar y comprobar la descarga. No se ha probado en Fold físico.

**Codex · LE-06 terminado: cuadernos restaurados y APK corregido publicado (2026-10-22):** Victor mostró ambas estanterías vacías en Android. Causa reproducida con Yoga C++ de RN 0.86.3: el flex positivo heredado con base automática y crecimiento cero anulaba el ancho solicitado. NotebookCover ahora restablece `flex: 0` en tarjetas de ancho fijo. Catálogo, almacenamiento y progreso no cambian. `npm run test:native-layout` obtiene estilos reales y comprueba 84 tarjetas en seis tamaños (requiere herramientas de desarrollo y C++20); falla antes y pasa después. Chromium: 14 portadas en cinco tamaños y apertura de Lectura. 1.838 pruebas / 125 archivos, TypeScript, lint y actionlint correctos. CI `39868481194` pasó en 19m37s y publicó desde `1e6135f`: https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-22-cuadernos-r2/Kitewise-lectura.apk · 335.432.702 bytes. Descarga HTTP 200, checksum, firma, alineación de 16 KB, cuatro arquitecturas, modelos/arte y bundle nuevo verificados. Mismo paquete/certificado que el anterior: instalar encima para conservar datos. Evidencias: `docs/design/reading-pilot/NOTEBOOK-LAYOUT-VERIFICATION.json` y `DOWNLOAD-CUADERNOS-VERIFICATION.json`. La primera etiqueta `...-cuadernos` falló en CI sin publicar: NODE_ENV=production omitía TypeScript móvil; corregido con npm ci --include=dev. Siguiente: Victor prueba visualización/tacto/TTS en el teléfono. La prueba física sigue pendiente. No usar la descarga original como versión actual ni dar rutas /workspace al teléfono.

**Codex · LE-05 terminado: APK descargable (2026-10-22):** Victor pidió una descarga para el teléfono porque el enlace interno no funcionaba. Publicado como prerelease público: https://github.com/Victordaz07/Leeconmigo/releases/tag/apk-lectura-2026-10-22 · descarga directa: https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-22/Kitewise-lectura.apk (335.432.702 bytes). GitHub Actions terminó correctamente (intento 2, 29m36s), desde la etiqueta `apk-lectura-2026-10-22` / commit 203f0c9. Descarga HTTPS real comprobada con HTTP 200, checksum coincidente, firma/alineación, cuatro arquitecturas y hashes de los tres modelos/dos imágenes nuevas. La identidad de firma coincide con el APK local. Detalle: `docs/design/reading-pilot/DOWNLOAD-VERIFICATION.json`. No entregar rutas `/workspace` como enlaces de descarga al teléfono. Para futuros APK bajo petición, subir una etiqueta `apk-lectura-*` activa `.github/workflows/android-apk.yml`; no compila por cada push a master. La autenticación local permite gestionar releases por API, pero `uploads.github.com` devolvió 401 al subir archivos: usar la publicación del workflow, con su token automático. No se requiere token personal. Siguiente: Victor instala la descarga y prueba TTS/tacto en su Android; no se ha hecho prueba física ni publicación en tienda.

**Codex · LE-01…04 terminados; APK generado (2026-10-22):** ambos cuentos integrados en `master` por petición de Victor. Código de la app compilado desde 4fefbef; después solo se actualizó documentación. Los bloqueos de Hugging Face y del repositorio de React Native se resolvieron mediante la configuración de red del entorno; los tres modelos originales descargados y verificados. SDK/NDK, Gradle y JDK 17 completo preparados fuera del checkout, sin alterar dependencias ni lógica para compilar. `assembleRelease` ✅ (610 tareas), exportación Android y bundle nativo ✅; APK universal de 335.416.322 bytes en `/workspace/Kitewise-lectura.apk`, firma v2, alineación ZIP de 16 KB, cuatro arquitecturas y presencia de modelos/arte verificados por hash. Es un release instalable con la llave de pruebas existente de Expo; no se publicó en tienda. Metadatos: `docs/design/reading-pilot/APK-VERIFICATION.json`. Se mantienen las 1.838 pruebas, TypeScript, lint y recorridos ES/EN del mismo código. Siguiente: Victor instala el APK y comprueba TTS audible, tacto y ergonomía en Android. Reconocimiento de voz sigue pausado; TTS y ayuda de TODAS las palabras se conservan. Configuración reutilizable de instalación/arranque guardada como borrador en los ajustes del entorno, pendiente de revisión/guardado/publicación por el usuario para reutilizarla.

**K8a hecho (2026-10-21):** Mi cuaderno ya se abre desde Inicio (palabras de Lectura, ideas escritas por el niño, dibujos de Arte). K8b (Logros), «Guardar en mi cuaderno» en los cierres, Mi museo e informe semanal PDF también hechos (2026-10-21); falta APK para probar en Android. Detalle: `docs/log/SESSION_LOG.md`.

Voz (RN-03) PAUSADA por Victor. K6: la primera unidad de Matemáticas (g3u1) ya se juega completa.

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

# Piloto de lectura por escenas

Petición de Victor, 2026-10-22: preparar primero **El puente de las luciérnagas** y después **El mapa de la puerta desaparecida** (Inés y Teo). La ayuda de TODAS las palabras es requisito central: pronunciación, sílabas y, cuando existen, significado, sinónimos y ejemplo.

## Descargar el APK corregido en Android

[Descargar Kitewise-lectura.apk (335 MB)](https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-22-cuadernos-r2/Kitewise-lectura.apk) · [Página de descarga](https://github.com/Victordaz07/Leeconmigo/releases/tag/apk-lectura-2026-10-22-cuadernos-r2)

Corrige las portadas invisibles de Inicio en Android. Abrir el enlace en el teléfono, descargar e instalar **sobre la versión actual** para conservar sus datos. Mismo paquete y certificado de firma; no requiere iniciar sesión en GitHub ni un servidor de desarrollo.

GitHub Actions `39868481194` compiló y publicó la etiqueta desde `1e6135f`, con la prueba de Yoga nativo correcta (19m37s de job). Descarga completa HTTP 200, SHA-256, firma, alineación de 16 KB, cuatro arquitecturas y modelos/ilustraciones originales verificados. El bundle difiere de la versión anterior. Metadatos: `DOWNLOAD-CUADERNOS-VERIFICATION.json`. Es un prerelease para pruebas familiares con la llave de pruebas existente; la comprobación física y audible siguen pendientes. La descarga inicial queda como referencia histórica en `DOWNLOAD-VERIFICATION.json`. Para futuros APK solicitados, las etiquetas `apk-lectura-*` activan el flujo; los pushes normales a master no generan APK.

## Regresión de cuadernos en Android (LE-06)

La captura del teléfono mostró los encabezados y espacios vacíos porque `NotebookCover` heredaba `flex: 1` junto a una base automática y crecimiento cero. Yoga nativo resolvía el ancho de cada tarjeta a cero. La variante con ancho calculado ahora usa `flex: 0`; no se modifican datos ni progreso.

`npm run test:native-layout` requiere las dependencias de desarrollo (`npm ci --include=dev`) y un compilador C++20 (`g++` o `CXX`). Compila el Yoga incluido con React Native, obtiene los estilos efectivos del componente real y verifica ancho, distribución y límites de 84 tarjetas en seis tamaños. No necesita SDK Android ni emulador. El componente anterior falla con ancho 0 frente a 288 esperados; el corregido pasa. GitHub también ejecuta esta comprobación antes del APK. Evidencia y límites: `NOTEBOOK-LAYOUT-VERIFICATION.json`; Chromium confirma las 14 portadas en cinco tamaños y la apertura de Lectura. La validación física sigue pendiente.

## Primer cuento: El puente de las luciérnagas

- Integrado en `apps/mobile` para lectura libre. El modo guiado existente y los demás cuentos conservan su presentación anterior.
- Diez escenas, mismas palabras y vocabulario, seis variantes ES/EN de niveles 1–3. Los textos no se reescribieron.
- Primera ilustración: muestra generada a partir del arte existente, revisada en la conversación y convertida a WebP. Las otras nueve escenas utilizan encuadres explícitos de los originales: sin globos vacíos ni recortes decididos por el dispositivo.
- Letra inicial por banda, ajustable entre 22 y 36 y guardada por niño. Un flujo con desplazamiento en vertical; dos columnas en tableta horizontal. Ningún texto se reduce para caber en una ilustración.
- Tocar cualquier palabra abre su ayuda y solicita pronunciación mediante el servicio `tts.ts` existente. El botón de la ficha permite repetirla. Se conserva el vocabulario editorial y no se generan definiciones al vuelo.
- Hasta tres preguntas del contenido existente, en límites de página, con pista, reintento y relectura del pasaje; después, repaso de tres palabras por sílabas usando el motor compartido.
- El marcador conserva página editorial, bloque y párrafo. Los marcadores antiguos de página siguen siendo válidos. Cambiar orientación o letra mantiene el fragmento. El cierre guarda una sola sesión y distingue tiempo de lectura libre de voz/simulación.
- Borrar todos los datos elimina las preferencias de letra. Borrar solo el progreso conserva esos ajustes de accesibilidad.

## Organización

`packages/story-engine/reading-editions/*.json` define la relación entre cada bloque original y su arte/encuadre. `reading-edition.ts` prepara fragmentos en límites de párrafo y traduce anclas. La app resuelve esa edición por familia, sin nombres de cuentos en el componente del lector. El texto, los idiomas, las preguntas, los identificadores y el vocabulario siguen viniendo de las historias originales.

`SceneReadingScreen` usa `useReadingSession` con comprensión/repaso activados. El flujo compartido existente sigue siendo la fuente de verdad. Las nuevas anclas y el campo opcional `readingMode` son aditivos: no invalidan datos antiguos ni requieren borrarlos.

## Comprobación reproducible

Desde la raíz: `npm run typecheck`, `npm test -- --maxWorkers=3` y `npm run build`. El repositorio no trae una configuración de lint; durante el trabajo se usa ESLint y el analizador de TypeScript en un directorio de herramientas fuera del checkout, sin cambiar dependencias ni lockfile.

Para el recorrido real en navegador: iniciar Expo web desde `apps/mobile` (`BROWSER=none npm run web -- --host localhost --port 8082`; en la nube, usar el directorio de Expo permitido y desactivar la modificación automática de TypeScript). Después, desde la raíz:

```bash
READING_SCREENSHOTS_DIR=/tmp/reading-pilot node scripts/reading-pilot-smoke.mjs http://localhost:8082 el-puente-de-las-luciernagas
```

El script crea perfiles de prueba en un contexto de navegador aislado, comprueba cuatro tamaños, ayuda por palabra, ampliación, salida/reanudación, preguntas con reintento, repaso y guardado final. La voz está simulada para verificar el texto y el idioma enviados a TTS; no demuestra cómo suena una voz instalada en Android. Las capturas se guardan fuera del repositorio. No crea APK ni enlaces de vista previa.

LE-01: suite completa 1.834 pruebas aprobadas; TypeScript de todos los paquetes aprobado; recorrido completo ES/EN del puente aprobado en Chromium. Quedan para dispositivo físico la calidad de voz, accesibilidad del sistema y ergonomía táctil.

## Segundo cuento: El mapa de la puerta desaparecida

LE-02 terminado después de cerrar LE-01. Se conservan las veinte páginas editoriales, todas sus palabras, preguntas y vocabulario de nivel 6 en ES/EN. La edición las presenta en 47 fragmentos ES y 44 EN, cortados únicamente entre párrafos; el tamaño de pantalla no altera esos límites ni sus marcadores.

Los encuadres recuperan la parte ilustrada del libro original y excluyen las zonas reservadas para texto. Se corrigieron las asociaciones de «Alguien tras la verja», «El jardín de hoy», «Un círculo bajo las hojas» y «Un camino seguro», reutilizando escenas pertinentes del mismo libro. «Una carta devuelta» tiene una ilustración nueva de Elena escribiendo en casa con Inés y Teo; ya no usa la escena de Nora con el álbum. Las dos imágenes nuevas conservan sus referencias de personajes. Inventario, dimensiones y SHA-256: `ART-MANIFEST.json`.

Los textos alternativos de cada escena se conservan en ambos idiomas. El texto narrativo original permanece intacto. No se produjeron imágenes nuevas para sustituir arte que podía recuperarse con un encuadre revisado.

## Resultado final y revisión

- 1.838 pruebas aprobadas en 125 archivos; TypeScript de todos los paquetes y lint de los archivos afectados aprobados.
- Build de producción de la app web anterior y exportación web de la app Expo aprobados.
- Cuatro recorridos completos en Chromium: puente ES/EN nivel 3 y mapa ES/EN nivel 6. Cada uno comprueba los cuatro tamaños, ayuda de vocabulario y petición de pronunciación, reintento, relectura, tres preguntas, tres palabras de repaso, salida/reanudación, preferencias y guardado final. Las pruebas de dominio cubren las ocho variantes de los dos cuentos.
- Las voces se simulan en las comprobaciones automáticas. Calidad audible, TalkBack/VoiceOver, ergonomía y persistencia del sistema requieren una prueba en Android/iOS real. El APK se generó posteriormente por petición de Victor; no se activó reconocimiento de voz.
- Integrados en `master` por petición de Victor (2026-10-22), desde `codex/lectura-puente-y-mapa` (12b7030). Después se generó el APK instalable solicitado, desde el código de 4fefbef. No se publicó en tienda.
- Android verificado: modelos reales con sus SHA-256 originales, exportación Android, bundle nativo de 506 recursos y `assembleRelease` (610 tareas). Se resolvieron los bloqueos de red de Hugging Face y `repo.reactnative.dev`, y se prepararon SDK 36, NDK 27.1, Gradle 9.3.1 y JDK 17 completo fuera del checkout. Sin cambios de dependencias ni de código para eludir requisitos.

APK local inicial (anterior a la publicación por GitHub): `/workspace/Kitewise-lectura.apk` (335.416.322 bytes), universal para arm64-v8a, armeabi-v7a, x86 y x86_64; `com.kitewise.app`, 0.1.0, Android 7+ (minSdk 24). Release sin servidor, firmado con la llave de pruebas existente de Expo. Firma, alineación ZIP de 16 KB, bundle y los tres modelos/dos ilustraciones nuevas verificados; metadatos y SHA-256 en `APK-VERIFICATION.json`. El binario y los modelos no se versionan. Sigue pendiente la prueba en un dispositivo real.

La preparación y el comando de compilación `/workspace/android-tools/build-apk.sh` están guardados en el borrador de configuración del entorno. Revisar, guardar y publicar el entorno permite conservar esa preparación; guardar el borrador no demuestra restauración en una tarea nueva.

Capturas de la app real:

| | Tableta | Teléfono | Ayuda de palabra |
|---|---|---|---|
| Puente | [Ver](previews/bridge-tablet.webp) | [Ver](previews/bridge-phone.webp) | [Ver](previews/bridge-word-help.webp) |
| Mapa | [Ver](previews/map-tablet.webp) | [Ver](previews/map-phone.webp) | [Ver](previews/map-word-help.webp) |

Para repetir ambos recorridos, omitir el último argumento de `scripts/reading-pilot-smoke.mjs`. Los resultados estructurados se guardan en `VERIFICATION.json`. No se publicó ni se desplegó una web. La aplicación sigue funcionando localmente y la ayuda utiliza el TTS existente.

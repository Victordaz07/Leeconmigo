# Piloto de lectura por escenas

Petición de Victor, 2026-10-22: preparar primero **El puente de las luciérnagas** y después **El mapa de la puerta desaparecida** (Inés y Teo). La ayuda de TODAS las palabras es requisito central: pronunciación, sílabas y, cuando existen, significado, sinónimos y ejemplo.

## Primer cuento: El puente de las luciérnagas

- Integrado en `apps/mobile` para lectura libre. El modo guiado existente y los demás cuentos conservan su presentación anterior.
- Diez escenas, mismas palabras y vocabulario, seis variantes ES/EN de niveles 1–3. Los textos no se reescribieron.
- Primera ilustración: muestra generada a partir del arte existente, revisada en la conversación y convertida a WebP. Las otras nueve escenas utilizan encuadres explícitos de los originales: sin globos vacíos ni recortes decididos por el dispositivo.
- Letra inicial por banda, ajustable entre 22 y 36 y guardada por niño. Un flujo con desplazamiento en vertical; dos columnas en tableta horizontal. Ningún texto se reduce para caber en una ilustración.
- Tocar cualquier palabra abre su ayuda y solicita pronunciación mediante el servicio `tts.ts` existente. El botón de la ficha permite repetirla. Se conserva el vocabulario editorial y no se generan definiciones al vuelo.
- Hasta tres preguntas del contenido existente, en límites de página, con pista, reintento y relectura del pasaje; después, repaso de tres palabras por sílabas usando el motor compartido.
- El marcador conserva página editorial, bloque y párrafo. Los marcadores antiguos de página siguen siendo válidos. Cambiar orientación o letra mantiene el fragmento. El cierre guarda una sola sesión y distingue tiempo de lectura libre de voz/simulación.
- Las preferencias de letra se incluyen en el borrado por niño.

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

## Siguiente cuento

LE-02: adaptar **El mapa de la puerta desaparecida** con su estilo de lectura de nivel 6, conservando sus veinte páginas editoriales y todas sus palabras. Revisar qué imagen corresponde a cada momento antes de definir los encuadres y los fragmentos.

# Bitácora de desarrollo

Registro cronológico, sesión por sesión, de cómo se construyó Lee Conmigo con Claude Code: qué se pidió, qué
se encontró, qué se decidió y por qué. No es documentación de referencia (para eso están `README.md` y
`docs/00`–`09`) — es el "por qué" detrás de cada decisión, útil para retomar el proyecto o para entender un
bug que ya se resolvió una vez. Se sigue agregando una entrada nueva al final de cada sesión de trabajo real.

---

## Modo padres (2026-09-27)

Victor pidió trabajar "la interfaz completa del app": hasta ahora la lectura funcionaba bien, pero el resto (configuración de
padres, de niveles) no tenía nada real detrás. Se agregó:

- **Candado con PIN** (`packages/ui/src/screens/parent-gate.tsx`): 4 dígitos, teclado numérico. Sin PIN guardado, la misma pantalla
  sirve para CREARLO (lo pide dos veces, para no equivocarse). Se guarda en el dispositivo (`apps/reader/src/parent-settings.ts`,
  `localStorage`); sin recuperación por correo ni bloqueo por intentos — proyecto familiar, no hace falta más (si se olvida, se
  borra desde dentro de Modo padres con "Cambiar PIN", o borrando los datos del sitio).
- **"Modo padres"** (`parent-settings.tsx`), detrás del candado: idioma de lectura, **nivel de lectura (1–6, libre, sin
  desbloqueos** — docs/01 DECISIÓN, docs/09 #3 resuelto), meta diaria de lectura (presets 5/10/15/20/30 min o personalizado,
  docs/01) y "Cambiar PIN". Reutiliza el mismo `ReadingProfile`/`onProfileChange` que ya movía el panel DEV: cambiar el nivel aquí
  es exactamente lo mismo que `?level=` o el selector de DEV, solo que ahora también existe una puerta de entrada real para el
  padre, sin depender de la URL ni de las herramientas de desarrollo.
- **Inicio**: el engranaje "Ajustes" (antes no hacía nada) abre el candado. La cuadrícula "Niveles" ya no es de relleno con
  "Bloqueado": muestra los 6 niveles reales, resalta el del perfil con "Tu nivel" y no se puede tocar directamente (solo se
  cambia en Modo padres) — con un enlace "Cambiar ›" que abre el candado.
- Nombres e iconos de los 6 niveles centralizados en `packages/ui/src/levels-data.ts` (los usan Inicio y Modo padres, un solo lugar).
- 23 pruebas nuevas (`packages/ui/tests/parent-mode.test.tsx`, `apps/reader/tests/parent-mode.test.tsx`): crear PIN, PIN
  equivocado, cambiar PIN, cambiar nivel/idioma/meta y que la meta diaria sobrevive a recargar la app.

**Deliberadamente fuera de esta pasada** (para no inflar el cambio): la meta diaria es UNA sola (no por idioma, aunque docs/01 pone
el ejemplo de "inglés 15 min, español 10 min" — se puede añadir después sin tocar el candado); "Progreso" seguía con datos de
relleno (arreglado en la pasada siguiente, ver abajo); la audiencia Explorador/Lector (docs/09 #5) sigue sin exponerse en Modo
padres, solo en el panel DEV.

## "Mi progreso" con datos reales (2026-09-27)

Victor pidió trabajar la pantalla de Progreso, que hasta ahora era 100 % de relleno del prototipo ("Alex", 89 % fijo,
racha/semana/logros inventados). Se agregó `computeProgressStats` (`packages/session-engine/src/progress-data.ts`), una función
pura que calcula todo desde los `SessionSummary` que ya se guardaban (docs/07: es lo único que existe, nunca audio ni texto
reconocido):

- **Historias leídas**: distintas con `completion >= 1`. **Minutos totales**: suma de `validReadingSeconds` de TODAS las sesiones
  (aunque no terminen). **Estrellas**: la mejor de cada historia terminada, sumadas entre historias (no se suman dos intentos de
  la misma). **"Precisión"** pasó a ser la de COMPRENSIÓN (aciertos/preguntas de los checkpoints, ponderado y no promediado por
  sesión) en vez de precisión de pronunciación, porque el error de pronunciación de una sesión vieja no se conserva (docs/07),
  solo las estrellas que salieron de él — resuelve docs/09 #4 en la práctica (queda solo lo calculable, sin inventar un número).
- **Racha**: días de calendario (hora LOCAL) seguidos hacia atrás desde hoy, o desde ayer si hoy aún no se ha leído (para no
  romper la racha a media tarde). **Semana**: lunes–domingo de calendario, no "últimos 7 días".
- **Palabras practicadas**: de `wordsHelped`, sin repetidas, de la más reciente a la más antigua.
- `apps/reader/src/build-progress.ts` traduce esas estadísticas a los 7 logros nombrados en docs/01: 5 se pueden calcular
  honestamente de lo guardado (Primer capítulo, Explorador ≥5 historias, Dos idiomas, 15 minutos reales, Regresaste por más ≥7
  días activos DISTINTOS, no la racha) y 2 quedan siempre bloqueados (Aventurero necesita "categorías" que no se guardan; Nueva
  palabra dominada necesita seguimiento de reintentos que tampoco se guarda) — nada de logros de mentira.
- Inicio y Progreso ahora comparten el mismo cálculo (`useSession` expone `summaries`, `App.tsx` llama `computeProgressStats`
  una sola vez): la racha/estrellas del saludo de Inicio y las de Progreso ya no pueden desincronizarse como con los datos de
  relleno anteriores. El nombre del niño ("Alex") sigue siendo un marcador de posición — no hay todavía un perfil real.
- 20 pruebas nuevas (`packages/session-engine/tests/progress-data.test.ts`, `apps/reader/tests/build-progress.test.ts`). 600 en
  verde en total.

## Biblioteca (2026-09-27)

Victor notó que el ícono "Biblioteca" del `NavRail` no llevaba a ninguna biblioteca: abría `s.go('select')`, la ficha de UNA
sola historia (la destacada de Inicio), nunca una lista para elegir. No era un bug de lógica — `docs/08-ROADMAP.md` pone
"Biblioteca" explícitamente en la Fase G (posterior), así que esa pantalla simplemente nunca se construyó; el ícono quedó
apuntando a lo más parecido que ya existía como placeholder temporal.

- **`LibraryScreen`** (`packages/ui/src/screens/library.tsx`, nueva): cuadrícula con TODAS las historias reales del
  idioma/nivel actual (`pickVariants` del perfil, igual que Inicio), sin el cupo de 4 espacios ni las tarjetas de relleno que
  usa "Mis historias" en Inicio cuando faltan historias. Tocar una tarjeta abre su ficha, igual que desde Inicio.
- La tarjeta de historia (portada, título, nivel, estrellas, insignia "Nueva"/"Leída") se extrajo a un componente compartido
  (`StoryTile`, `packages/ui/src/screens/story-tile.tsx`) para que Inicio y Biblioteca no puedan desalinearse visualmente.
- Vive fuera de `flow` (`showLibrary` en `App.tsx`), con el mismo patrón que "Modo padres": se abre desde el ícono
  "Biblioteca" del `NavRail` en Inicio o Progreso, o desde el enlace "Ver todas ›" de "Mis historias" (antes texto muerto),
  y no interfiere con ninguna sesión de lectura en curso.
- `useSession` expone `library.cards`: mismo cálculo de estrellas/leída-nueva que Inicio (`storyProgress` sobre los
  resúmenes guardados), reutilizado, no reinventado.
- 5 pruebas nuevas (`apps/reader/tests/library-screen.test.tsx`). 605 en verde en total.

## Formato "cuento largo", niveles 4-6: "El mapa de la puerta desaparecida" (2026-09-28)

El 2026-09-28 Victor mostró primero una muestra de 3 páginas de un estilo NUEVO (ver historial: pidió "ve pensando en
cómo lo organizaremos" mientras GPT terminaba la historia completa) y, más tarde el mismo día, la **historia completa**
(`PARTE_1_LECTURA.zip` + `PARTE_2_IMAGENES_A.zip` + `PARTE_3_IMAGENES_B.zip`, "la nueva historia"). Es la banda visual
que `docs/05-DESIGN-SYSTEM.md` llama **"Illustrated Reader" / "Literary Reader" (niveles 3-4 y 5-6)** — nunca construida
hasta ahora; todo lo montado antes es banda "Comic Story Learning" (niveles 1-2, viñetas con globos dibujados). La
muestra de 3 páginas (`dev: true`, `mapa-puerta-desaparecida-muestra`) sirvió para validar el enfoque y **se retiró**
al llegar la historia real (mismo título exacto, habría chocado con ella) — la técnica que validó (plantilla `full` +
una caja de texto grande, sin tocar el motor) es la que se usó aquí, ahora a escala completa: **5 capítulos, 20 páginas,
~4 600 palabras**, con pregunta de comprensión en cada página y 8 palabras de vocabulario por idioma.

**Estructura**: 4 páginas por capítulo — normalmente 3 ilustradas (`layout`: `side-left`/`side-right`/`bottom`/
`panorama-bottom`, un nombre editorial del paquete que describe dónde cae el texto, no una plantilla propia: las 13
páginas ilustradas usan `full` igual que la muestra) + 1 página de **solo texto** (`p06,08,10,12,14,16,18`, 7 en
total). Las páginas de solo texto no traen ilustración propia (`image: null` en el paquete) — como `illustration` es
obligatorio en `story.ts` y cambiarlo habría afectado casi todas las pantallas (`end.tsx`, `question.tsx`, `select.tsx`,
`side-panel.tsx`...), en vez de eso **reutilizan la ilustración de la página anterior de su mismo capítulo** (p06→p05,
p08→p07, etc.) y se montan SIN plantilla (`template` ausente) — es exactamente el modo "página de solo texto" que ya
existía (se lee en el panel lateral, la ilustración de fondo no lleva globo), usado por primera vez con párrafos largos
de verdad en vez de 1-2 frases cortas.

**Medir las 13 cajas de texto fue más difícil que con cualquier historia de cómic anterior**: es acuarela a página
completa con degradados suaves, así que el flood-fill de siempre (que ya había costado en "La estrella desaparecida")
se escapaba SIEMPRE por puentes borrosos de píxeles claros que conectan la zona en blanco real con reflejos pálidos de
la ilustración en cualquier parte de la imagen. Hizo falta un algoritmo distinto: en vez de inundar por vecindad, se
parte de un punto semilla dentro de la zona en blanco (según si el `layout` del paquete dice "lateral" o "franja
arriba") y se **crece un rectángulo** hacia los 4 lados mientras cada nueva fila/columna del borde sea ≥96 % crema —
tolera algo de ruido interior sin escaparse, y para justo donde cae el % de la línea (el borde real de la ilustración).
El paquete tampoco traía coordenadas esta vez (a diferencia de la muestra, que sí traía `textRegion`): las 13 cajas se
midieron así, sin ningún valor de referencia externo. Quedaron en `layouts/mapa-de-la-puerta-desaparecida.layout.json`.

Otros dos huecos que el paquete no llenaba (como ya pasó con "El puente de Lolo" y "La estrella desaparecida"): faltaba
`correctFeedback` en las 80 variantes de pregunta (solo traía `retryFeedback`) — se generó automáticamente como
`"¡Eso es! <respuesta correcta>."` / `"That's it! <answer>."`, el mismo patrón de siempre. Y las páginas de solo texto
necesitaban `title` por bloque, ya presente esta vez en el paquete (no hubo que inventarlo).

**Cajas apretadas conocidas**: 5 de las 13 páginas ilustradas (`p04, p05, p13, p17`, y `p20` al límite — todas de
`layout: bottom`, la franja más corta de las cuatro formas) tienen más texto del que cabe cómodo en su caja real, ni
siquiera contando el ajuste de letra normal — el autoajuste las mostrará con letra más chica que el resto de la
historia. No es un error de medición (se revisó visualmente: la composición de esas páginas deja poco margen arriba
por los personajes en la esquina inferior), es una limitación real del contenido tal como llegó. Aceptado por ahora,
igual que otras historias ya en la biblioteca con cuadros por encima del 100 % en nivel alto. *(Actualización: estas 5
cajas se volvieron a medir con el algoritmo corregido que se explica en la nota de "La cúpula que parpadeaba" más
abajo — mejoraron 5–8 % de área cada una; no tan dramático como en "La cúpula...", porque esta historia no tenía el
mismo patrón de franja curva angosta a los lados.)*

- Montada como historia REAL (nivel 6, sin `dev`): `mapa-de-la-puerta-desaparecida-{es,en}-n6`, aparece en Inicio y
  Biblioteca. El nivel es una elección mía (el paquete no ofrece 3 niveles como las historias de cómic, solo una
  versión) — excede bastante lo que `docs/01-PRODUCT-RULES.md` describe para nivel 6 (1 200–1 800 palabras, 1-2
  ilustraciones): esta historia tiene 4 600+ palabras y 13 ilustraciones. Queda anotado, no bloqueante.
- Material de referencia (el `LIBRO.json` original, los manuscritos y la hoja de personajes) en
  `content/mapa-de-la-puerta-desaparecida/`.
- 358 pruebas de `stories:check` en verde; la prueba de humo de la biblioteca completa (`library.test.tsx`) ya lee esta
  historia entera (ambos idiomas, las 20 páginas, 20 preguntas, repaso y resumen) sin necesitar una prueba aparte.
  780 pruebas en verde en total.
- **Sin verificar visualmente en navegador** — el navegador integrado de Claude Code no pudo conectar a
  `localhost:5173` en ninguna sesión de este trabajo. Queda pendiente que Victor la revise en su propio `npm run dev`,
  especialmente las 5 páginas de caja apretada.

**Deliberadamente fuera de alcance** (igual que en la muestra, misma decisión de Victor: simple antes que repaginado):
composición de 2 columnas (la página 2 de cada capítulo, `panorama-bottom`, se lee en 1 columna ancha), reflujo/
repaginado real en pantalla angosta o con letra ampliada, etiqueta de capítulo visible en pantalla.

## "La cúpula que parpadeaba", ciencia ficción en Marte, 4 capítulos (2026-09-28)

Segunda historia del formato "cuento largo" (misma sesión, mismo día): Vera, Ivo y su robot Pico descubren un destello
en una cúpula marciana abandonada y averiguan si fue un accidente o una señal. **4 capítulos, 16 páginas, ~2 670
palabras**, 12 páginas ilustradas + 4 de solo texto (`p03, p07, p10, p14` — una por capítulo, mismo patrón que "El mapa
de la puerta desaparecida": sin imagen propia, reutilizan la de la página anterior del mismo capítulo). Mismo paquete
editorial (`LIBRO.json`, `layout`: `side-left`/`side-right`/`bottom`/`text-only`), mismos huecos de siempre rellenados
igual (`correctFeedback` generado con el patrón `"¡Eso es! <respuesta>."` / `"That's it! <answer>."`, ausente en las 32
variantes de pregunta). Montada como historia real, nivel 6 (`la-cupula-que-parpadeaba-{es,en}-n6`); el paquete trae su
propio `targetReaderAge: 10`, coherente con el nivel elegido.

**Cajas de texto apretadas — y un algoritmo de medición corregido (2026-09-28, tras verla en pantalla).** El primer
pase con el algoritmo de "crecer un rectángulo desde una semilla" (ver la nota de "El mapa..." arriba) dejaba dos
páginas `bottom` muy apretadas (`p08`, `p15`: hasta 3 veces más texto del que cabe con letra "cómoda"). Victor la vio
en pantalla y notó el problema real: **el algoritmo crecía las 4 direcciones a la vez desde una semilla central, así
que en cuanto UNA columna a los lados dejaba de ser crema a la altura ya alcanzada, paraba de crecer el ancho ahí** —
aunque la franja en blanco siguiera siendo mucho más ancha un poco más arriba (las cúpulas de Marte son curvas: la
franja empieza angosta a los lados y se ensancha cerca del techo). El resultado: cajas angostas y altas cuando el arte
en realidad ofrecía cajas anchas y bajas, con MUCHA más área.

Se reescribió el algoritmo: en vez de una sola semilla creciendo a ciegas, prueba **muchas alturas fijas** (desde
arriba) y para cada una mide el ancho máximo disponible, quedándose con la combinación de mayor ÁREA real (para las
páginas `side-left`/`side-right` se hizo el equivalente probando anchos fijos desde el borde). Se volvieron a medir
las 25 páginas ilustradas de **ambas** historias nuevas ("El mapa..." y "La cúpula..."), no solo las apretadas — la
mejora fue general, más dramática cuanto más "ancha y baja" era la franja real disponible:

| Página | Caja anterior | Caja corregida | Capacidad cómoda antes → después |
|---|---|---|---|
| cúpula `p08` | 606×291 | **1514×236** (casi todo el ancho) | 296 % → 144 % |
| cúpula `p15` | 611×356 | **1536×277** (ancho completo) | 249 % → 125 % |
| cúpula `p02` | 765×400 | 1198×356 | 148 % → 105 % |
| cúpula `p12` | 1210×399 | 1536×388 (ancho completo) | 104 % → 84 % (ya cómoda) |
| mapa `p04`/`p05`/`p13` | — | +5–8 % de área cada una | 126–138 % → 121–129 % |

Ninguna quedó perfecta al 100 % (`p08` y `p02` de cúpula siguen algo por encima de "cómodo"), pero todas mejoraron
mucho y la letra se ve notablemente más grande en las páginas que antes eran las más chicas — confirmado en pantalla,
no solo por cálculo. No se acortó el texto de ninguna página (habría sido reescribir la prosa de Victor/GPT sin que
lo pidiera): la mejora fue enteramente de aprovechar mejor el espacio en blanco que el arte ya ofrecía.

- Material de referencia en `content/la-cupula-que-parpadeaba/`.
- 799 pruebas en verde en total (la biblioteca completa ya lee esta historia entera, ambos idiomas, sin prueba aparte).
- Sin verificar visualmente en navegador, mismo motivo que siempre esta sesión — revisar en `npm run dev`, con especial
  atención a `p08` y `p15`.

## "Nico, héroe de los libros" — trilogía, 3 libros consecutivos (2026-09-28)

Tercera entrega del formato "cuento largo" (misma sesión): Nico entra en un libro azul y vive tres miniaventuras con
Alma, Teo y Sira. **3 libros independientes y consecutivos, 10 páginas cada uno (30 en total), 5 páginas ilustradas
por libro (15 en total) + 5 "pausas de lectura" sin imagen** (`~3 420` palabras ES / `~3 429` EN entre los tres).
Paquete editorial (`LIBRO.json`) con dos diferencias de esquema nuevas respecto a los anteriores, adaptadas al
construir los JSON finales:
- `checkpoint` venía como objeto `{ explorador: {...}, lector: {...} }` (no un arreglo de variantes) y las opciones
  como `string[]` (no `{ text }[]`) — se transformaron al construir. `hint` → `retryFeedback`; `correctFeedback`
  seguía sin venir (generado igual que siempre).
- `vocabulary` venía como arreglo `{ word, syllables: "po-le-a", definition }` (sílabas como texto con guiones, no un
  arreglo) — se separó por guion al construir.

**Páginas sin imagen, resueltas distinto esta vez.** El paquete pide explícitamente no inventar PNG para ellas y
describe una "pausa de lectura a dos columnas". Las dos historias anteriores resolvían esto reutilizando la
ilustración de la página anterior — pero después de que Victor pidiera dos veces aprovechar mejor el espacio, reusar
una ilustración ajena (con su propia zona en blanco angosta) hubiera repetido el mismo problema a mayor escala. En
vez de eso, estas páginas usan una imagen **compartida y neutra**: un fondo liso color crema (el mismo tono que ya
usan las páginas ilustradas, `apps/reader/public/stories/_shared/reading-pause.webp`, generada una sola vez para las
tres historias) con la plantilla `full` ocupando casi todo el lienzo — texto mucho más grande y legible que en el
panel angosto de siempre, sin pedir prestada una escena que no corresponde a esa página. Se simplificó a **1 columna**
(no 2), la misma decisión de alcance que Victor ya tomó para el resto del formato "cuento largo".

**Serie 1→2→3**: igual que con "El caso de la estrella desaparecida", el motor no tiene concepto de serie — se
montaron como 3 historias independientes (`nico-01-la-puerta-de-papel`, `nico-02-el-ultimo-nivel`,
`nico-03-el-heroe-fuera-del-libro`) con el título numerado (`"1. La puerta de papel"`, …) para que se ordenen y no se
vean como aventuras sueltas en Biblioteca/Inicio, y la ficha de cada una dice "Libro X de 3… Leer en orden." **No se
construyó un enlace real "siguiente libro"** en la pantalla de fin de historia — el paquete lo pedía explícitamente
("navegación de serie 1→2→3"), pero ya es la segunda vez que llega una serie de varios libros; si llega una tercera,
vale la pena construir esa navegación real en vez de repetir el truco del título numerado.

**Una caja de medición realmente rota, y dos apretadas por composición (no por error).** El algoritmo v2 (ver la nota
de "La cúpula..." arriba) midió bien 13 de las 15 páginas ilustradas, pero: `nico-02-el-ultimo-nivel` página 6 (el
Borrador, con una nube de humo dorado en vez de crema lisa) midió una caja de 61×22 px — un resultado sin sentido,
arreglado a mano tras revisar la imagen (440×850 px, evitando la esquina con una mancha grisácea que rompía el
umbral de color). Y dos páginas quedaron genuinamente apretadas por cómo está compuesta la ilustración, no por un
fallo de medición: `nico-01` página 6 (el haz del faro ocupa un cielo en degradado, no hay margen liso) y `nico-03`
página 10 (una visión en acuarela del faro/puente ocupa la parte de arriba de lo que sería la zona en blanco). Ambas
se revisaron visualmente; el texto sigue cabiendo incluso en el piso de 12 px del autoajuste, solo que notablemente
más chico que el resto del libro — igual que las cajas apretadas ya documentadas en las dos historias anteriores.

**Otro bug real, esta vez en una prueba, no en el contenido.** La prueba de humo de la biblioteca (`library.test.tsx`,
código ya existente, no escrito en esta sesión) buscaba el botón de la respuesta correcta de cada pregunta SIN acotar
la búsqueda al lienzo de la app — y la respuesta correcta de una página de "El último nivel" es "El puente", que
también es un substring de "El puente de Lolo" y "El puente de las luciérnagas" en la lista de historias del panel
DEV. Se corrigió acotando esa búsqueda al `tablet-canvas`, como ya hacían las demás consultas de esa misma prueba.

- Material de referencia en `content/nico-heroe-de-los-libros/`.
- 856 pruebas en verde en total (13 nuevas de contenido + la biblioteca completa lee los 3 libros enteros, ambos
  idiomas, sin prueba aparte).
- Sin verificar visualmente en navegador — revisar especialmente las páginas de "pausa de lectura" (fondo nuevo,
  nunca probado en pantalla) y las 2 páginas apretadas mencionadas arriba.

## Dos historias nuevas e independientes (2026-09-28)

Cuarta entrega del formato "cuento largo" (misma sesión): dos historias sin relación entre sí, cada una **3
capítulos × 4 páginas = 12 páginas, 6 ilustradas + 6 "pausas de lectura" sin imagen**, para ~10 años.
`la-manana-de-los-doce-minutos` (Luna y Rafa repiten doce minutos en un observatorio hasta encontrar la causa: un
espejo movido sin avisar) y `la-isla-que-caminaba` (Maya y sus amigos investigan una plataforma bajo el manglar que
la marea desplazó). A diferencia de *El caso de la estrella desaparecida*/*El mapa...*/*La cúpula...*, aquí
`LIBRO.json` trae `chapters` como metadato informativo sobre una única historia plana de 12 páginas, no como 3
archivos separados — no hizo falta el truco del título numerado por serie.

Mismo esquema que Nico (`checkpoint` como objeto `{explorador, lector}`, `options` como `string[]`, `vocabulary`
como arreglo con sílabas en texto con guiones) y **esta vez `template:'full'` se puso desde el principio en las
páginas de pausa** (el bug de Nico —olvidarlo y quedarse con el panel angosto viejo— no se repitió).

**El umbral de color se rompió con esta entrega.** El papel de este paquete es más cálido/dorado que el de las
entregas anteriores (`g-b` de 20-25 frente al viejo techo de `gb<=18`); el algoritmo v2 no encontró banda válida en
11 de las 12 páginas ilustradas en el primer intento. Se ensanchó `isCream` a `gb<=30` y las 12 páginas midieron
bien. Aun así, **una quedó genuinamente rota, no solo apretada**: `la-isla-que-caminaba` página 11 (el atardecer con
cielo en degradado, sin zona crema lisa) midió una caja de 300×359 px cuando la zona en blanco real ocupa casi todo
el lienzo a la derecha — confirmado a mano muestreando color de fondo en varios puntos (el degradado cae apenas
fuera del umbral de forma dispersa, no por ningún objeto real de la escena). Se corrigió con una caja manual de
276×1024 px. La página 7 de la misma historia sí quedó angosta por composición real (una garza junto a un montículo
de manglar que ocupa buena parte del ancho), no por error — confirmado visualmente y aceptado igual que los casos
similares de Nico.

- Material de referencia en `content/la-manana-de-los-doce-minutos/` y `content/la-isla-que-caminaba/`.
- 894 pruebas en verde en total (la biblioteca completa ya lee ambas historias enteras, ambos idiomas, sin prueba
  aparte).
- Verificado visualmente en `npm run dev`: portada y página 1 ilustrada de ambas historias en Biblioteca/Inicio,
  checkpoint de "La mañana de los doce minutos" (respuesta correcta e incorrecta, feedback no punitivo) y su página 3
  de pausa de lectura (fondo compartido ancho, sin el bug del panel angosto de Nico).

## "La misión que perdió la Tierra" — primera de la colección "Profesiones" (2026-09-28)

Primer libro de una colección de siete, una por profesión, con protagonista y conflicto propios cada una (docs no la
menciona; la define el propio paquete). Elián sueña con ser astronauta: en un simulador escolar debe guiar un
vehículo lunar hasta zona iluminada antes de que la "noche lunar" alcance el cráter, con Asha en la radio y la
ingeniera Nora supervisando — el problema real es que el cráter bloquea la línea de vista Tierra-vehículo y las
órdenes deben esperar las ventanas breves del repetidor orbital. **12 páginas, 6 ilustradas + 6 pausas de lectura**,
mismo esquema y mismo flujo de montaje que "Dos historias nuevas" (`checkpoint:{explorador,lector}`, `vocabulary`
con sílabas en texto con guiones, `template:'full'` en las pausas desde el principio, fondo compartido
`_shared/reading-pause.webp`). El umbral de color de siempre (`isCream`) funcionó sin ajustes — el papel de este
paquete no tiene el tono cálido de "Dos historias nuevas" — y las 6 cajas de texto midieron limpio a la primera, sin
ninguna rota ni con degradados: la única a revisar visualmente fue `p10` (altura recortada a 624 px de 1024, para no
tapar el globo terráqueo de la mesa) y resultó ser exactamente eso, no un fallo de medición. La página 10 presenta
a Abril (protagonista del futuro libro de arquitectura) en la feria escolar, primer cameo cruzado de la colección —
el paquete pide explícitamente no mostrarla antes ni reutilizar a Elián en otro libro de la serie; quedó anotado en
`content/la-mision-que-perdio-la-tierra/` para cuando lleguen los siguientes seis.

- Material de referencia en `content/la-mision-que-perdio-la-tierra/`.
- 913 pruebas en verde en total (la biblioteca completa ya lee esta historia entera, ambos idiomas, sin prueba
  aparte).
- Verificado visualmente en `npm run dev`: portada y página 1 en Biblioteca/Inicio, checkpoint con respuesta
  correcta y su feedback, página 2 de pausa de lectura con el fondo ancho compartido.

## Control de versiones y primer APK real (2026-09-28)

Victor notó que, pese a todo el trabajo, no había control de versiones ni nada instalable fuera de esta sesión
("no hay nada en el repo... necesito que ya comencemos a fabricar el app"). Dos frentes en paralelo:

**Git/GitHub**: se corrió `git init` (repo local nuevo). Pendiente de Victor: configurar su identidad real de git
(`git config --global user.name/email`, con placeholders — no lo puedo hacer yo, regla de seguridad fija) y crear el
repo remoto en `github.com/victordaz07` (no hay `gh` CLI instalado en esta máquina ni credenciales cacheadas para
que yo pueda empujar sin su intervención). Una vez empujado, conectar Vercel al repo (`vercel.json` ya está listo)
deja el deploy automático en cada push — mejor que un deploy manual porque no depende de subir los 37 MB de
imágenes de historias a mano por esta interfaz.

**Primer APK Android real (2026-09-28)**: en paralelo, arrancó la Fase C del roadmap (`docs/08`) — el contenedor
Capacitor, no el motor de voz nativo (Fase D/E sigue esperando el resultado del Prototipo 00, sin tocar). Se
instaló `@capacitor/core`, `@capacitor/android`, `@capacitor/cli` en `apps/reader`, se creó
`apps/reader/capacitor.config.ts` (`appId: com.leeconmigo.app`) y se generó el proyecto nativo con
`npx cap add android` (`apps/reader/android/`, gitignorado en `build/`, `.gradle/`, `local.properties` y los
assets web copiados — solo se versiona el proyecto Gradle/Kotlin en sí). Esta máquina ya tenía Android SDK
(API 34-37) y JDK 25 instalados (Android Studio de Victor). El primer intento de compilar falló
(`Unsupported class file major version 69`: Gradle 8.14.3 no reconoce bytecode de JDK 25) — se subió el wrapper a
**Gradle 9.2.0**, que sí lo soporta, y `./gradlew assembleDebug` compiló limpio: **`app-debug.apk` (39,6 MB), con
las 9 historias completas empaquetadas dentro**, listo para instalar por USB/`adb install` en la tablet de Noah.
Sigue usando `FakeReadingEngine`/`FakeSpeechEngine` (sin voz real, respetando el gate de `docs/02`/`docs/08`: no
se conecta audio nativo hasta que el Prototipo 00 dé resultado) — es el **contenedor** instalable, no el motor de
voz. Sin firmar para producción (debug build); firmar y publicar en Play Store es un paso posterior y explícito.

## Primer motor de voz REAL: `WhisperSpeechEngine` + `RealReadingEngine` (2026-09-29)

Victor probó el APK y notó lo esperado: "no pide permisos para el micrófono... cuando leo no pasa nada" — sin
motor de voz conectado, es exactamente lo correcto, pero pidió explícitamente **empezar a construir la app
completa** en vez de seguir esperando el Prototipo 00 como gate formal. Dado que **Web Speech API queda
descartada de raíz** (manda el audio a Google, viola la regla no negociable de CLAUDE.md), la única opción
posible es reconocimiento 100% en el dispositivo — y resulta que ya existe, sin usar, en
`Z:\Lee Conmigo\lee-conmigo-stt-test` (el propio Prototipo 00: Whisper vía Transformers.js/ONNX Runtime WASM,
captura de audio, VAD Silero, comparador de texto — construido y probado en PC con audio sintético, nunca
conectado a la app real ni probado en una tablet). En vez de dejarlo como spike aparte, se portó como el primer
proveedor real:

- **`packages/speech-engine/src/whisper-speech-engine.ts`** (`WhisperSpeechEngine`, implementa el contrato
  `SpeechEngine` sin tocarlo): micrófono (`AudioCapture`, AudioWorklet a 16 kHz) → VAD Silero por tramos de voz
  (`SpeechTimeline`, con histéresis) → al cerrar un tramo, Whisper transcribe ese audio completo en un Web
  Worker (`WhisperClient`/`whisper-worker.ts`, portados casi sin cambios del spike) → `onFinalResult(texto)`.
  Simplificado respecto al spike a propósito: **no se portó su comparador de texto ni su máquina de ventanas
  con solape** (`matcher.ts`, `reading-state-machine.ts` del spike) — esa lógica ya vivía, portada y con
  pruebas, en `packages/reading-engine` desde antes (`TextReadingMatcher`, `ReadingProgressTracker`), así que
  este motor solo hace audio → texto, tal como pide el contrato.
- **`packages/reading-engine/src/real-reading-engine.ts`** (`RealReadingEngine`, primer `ReadingEngine` real):
  el pegamento — traduce `onFinalResult`/`onVoiceActivity` del `SpeechEngine` en los mismos `ReadingEvent` que
  ya emitía `FakeReadingEngine`, reutilizando `ReadingProgressTracker` para alinear el texto reconocido con las
  palabras esperadas y `LiveReadingTimer` (sin cambios) para el temporizador. Expone la misma superficie extra
  que `FakeReadingEngine` (`simulate.*`, `debugLoadState`, `isAutoReading`, `getTimerSnapshot`) para poder
  sustituirlo en `apps/reader/src/use-session.ts` con un cambio mínimo (los botones del panel DEV siguen
  funcionando igual, incluso con voz real activa — útiles para probar la UI en la tablet sin depender de hablar
  cada vez).
- **Activación**: detrás de un flag nuevo, `VITE_REAL_VOICE=1` (`apps/reader/src/flags.ts`, `REAL_VOICE`) — el
  build normal sigue usando `FakeReadingEngine`. El APK que se le mandó a Victor en esta entrega SÍ lo trae
  activado (junto con `VITE_DEV_TOOLS=1`), para poder probarlo de una vez en la tablet.
- **Permiso de micrófono**: `AndroidManifest.xml` no lo declaraba (por eso nunca se pedía). Capacitor ya
  intercepta `getUserMedia()` del WebView y pide el permiso en tiempo de ejecución
  (`BridgeWebChromeClient.onPermissionRequest`, sin código propio) — solo hacía falta declarar
  `RECORD_AUDIO`/`MODIFY_AUDIO_SETTINGS` en el manifest, que es lo que se agregó.
- **Modelo Whisper**: `tiny` multilingüe (~41 MB en WASM), se descarga de Hugging Face **la primera vez que se
  usa** (necesita internet esa vez) y se cachea en el dispositivo (Cache Storage del WebView) para las
  siguientes lecturas. Los archivos de ONNX Runtime (~40 MB) y el modelo VAD (~2 MB) sí van dentro del APK
  (`scripts/copy-speech-assets.mjs`, gitignorado — se copian de `node_modules` en cada `predev`/`prebuild`); se
  quitó del bundle de Vite una duplicación de esos `.wasm` (~40 MB extra) que Vite generaba sola sin usarse
  (`dropDuplicateOnnxWasm` en `vite.config.ts`).

**Nada de esto se ha probado en una tablet real todavía — no puedo probar micrófono/hardware desde esta sesión.**
Quedan sin verificar, y solo Victor (con Noah) puede confirmarlos en la tablet real:
- Si el diálogo de permiso de micrófono aparece y, al aceptarlo, el modelo Whisper se descarga y carga (puede
  tardar; sin indicador de carga en la UI todavía).
- Si el reconocimiento avanza la lectura razonablemente con voz infantil real (los umbrales de VAD y los
  mínimos de coincidencia del comparador son los del spike/valores por defecto, nunca calibrados con datos
  reales — docs/09 #11).
- Rendimiento en la tablet real: sin aislamiento COOP/COEP dentro del WebView de Capacitor, ONNX Runtime cae
  a 1 solo hilo WASM (más lento que el multihilo que sí se probó en PC) — pendiente de decidir si hace falta
  resolverlo.
- `suspend()`/`resume()` (app a segundo plano) paran y vuelven a arrancar el motor por completo (recarga el
  modelo) en vez de solo silenciar el micrófono — más simple y alineado con docs/06, a costa de unos segundos
  de recarga al volver.

913 pruebas en verde (sin cambios: nada de este motor tiene pruebas propias todavía, ya que depende de
hardware/red real que no se puede simular en CI sin más trabajo — pendiente si se vuelve prioridad).

**Bug real, encontrado de inmediato al probar en la tablet (2026-09-29, misma sesión):** Victor instaló el APK
y "no pide permisos... no sé si está funcionando el micrófono". Causa: `start()` cargaba el VAD y el modelo
Whisper (descarga de Hugging Face la primera vez, necesita red) **antes** de pedir el micrófono — si esa
descarga fallaba o se quedaba colgada (sin señal, red bloqueada...), `getUserMedia()` nunca se llegaba a llamar:
el permiso jamás se pedía y no había ningún error visible en la UI. Se invirtió el orden: el micrófono se pide
PRIMERO (`start()` resuelve en cuanto se concede el permiso), el VAD/Whisper se cargan DESPUÉS en segundo plano
(`onFrame` ignora los tramos hasta que el modelo esté listo). APK reconstruido (56,7 MB). Sigue sin haber
indicador de carga del modelo en la UI ni mensaje si la descarga falla — si tras aceptar el permiso la lectura
sigue sin avanzar, lo más probable es que el modelo no haya terminado de cargar (o la tablet no tenga
internet la primera vez): pendiente de verificar con Victor.

**"Probar micrófono" — pantalla de diagnóstico (2026-09-29, misma sesión):** Victor pidió explícitamente "algún
indicador de que el app me está escuchando" y "una zona dev... que me permita testear con palabras en
específico, porque no sé si funciona". Se agregó `apps/reader/src/voice-lab.tsx` (solo DEV, nunca la ve un
niño): un botón nuevo "🎤 Probar micrófono" en el panel DEV abre una pantalla propia que crea su propio
`WhisperSpeechEngine` **fuera de cualquier historia** — punto de estado (gris "sin empezar" → ámbar "pidiendo
permiso"/"cargando modelo" → verde "escuchando de verdad", pulsando cuando el VAD detecta voz ahora mismo →
rojo "error" con el mensaje real), selector es/en, y sobre todo una **lista en vivo de cada frase que Whisper
transcribió** (más reciente arriba, con el segundo exacto) — así Victor puede decir una palabra concreta y ver
literalmente qué entendió el motor, sin tener que adivinar. Requirió exponer un estado nuevo, `WhisperStatus`,
que no es parte del contrato `SpeechEngine` (el contrato no lo pide) pero sí lo expone `WhisperSpeechEngine`
como extra (`onStatus`/`getStatus`), igual que `RealReadingEngine` ya exponía `simulate`/`debugLoadState` fuera
del contrato abstracto. Verificado en el navegador integrado: el flujo completo (pedir permiso → error si se
deniega, con el mensaje real) funciona de punta a punta — el navegador de pruebas bloquea el micrófono, así que
el "escuchando de verdad" en sí solo lo puede confirmar Victor en la tablet real. APK reconstruido (56,8 MB),
typecheck y 913 pruebas en verde.

**Primer error real en la tablet, memoria del WebView (2026-09-29, misma sesión):** la pantalla "Probar
micrófono" YA cumplió su propósito a la primera: el permiso de micrófono se pidió y se concedió bien (el bug
anterior quedó confirmado arreglado), pero cargar el modelo Whisper falló con
`Error: Can't create a session. failed to allocate a buffer of size 10124990` — el WebView de Android no pudo
reservar ~9,6 MB más de memoria WASM para el modelo (`tiny`, ya el más chico disponible en este código).
Intento de arreglo (sin poder probarlo yo mismo): se agregó `android:largeHeap="true"` y
`android:hardwareAccelerated="true"` al `<application>` de `AndroidManifest.xml` — dan más margen de memoria al
proceso, aunque el WebView de Android corre en su propio proceso separado del heap Java de la app, así que
**no hay garantía de que esto sea suficiente**; es la mitigación más común y de menor riesgo, no un diagnóstico
confirmado. Se agregó también una línea de diagnóstico en la pantalla (RAM aproximada del dispositivo, núcleos,
si hay aislamiento multihilo) para que Victor la pueda copiar en el próximo reporte si el error persiste. Si
sigue fallando tras esto, el siguiente paso real es identificar cuánta RAM libre tiene la tablet en el momento
de la prueba (cerrar otras apps) — un dispositivo con poca RAM disponible puede no alcanzar para este modelo,
por chico que sea, dentro de las restricciones de memoria del WebView.

**Modelo Whisper empaquetado en el APK, no descargado (2026-09-29, misma sesión):** Victor preguntó, con razón,
"¿por qué no viene con ese motor preinstalado?" — heredado sin pensarlo del spike original (una página web
suelta, donde descargar-y-cachear al primer uso tenía sentido; en una app nativa no). Se corrigió: los 7
archivos del modelo `onnx-community/whisper-tiny` (dtype `q8`: `config.json`, `generation_config.json`,
`preprocessor_config.json`, `tokenizer.json`, `tokenizer_config.json`, `onnx/encoder_model_quantized.onnx` —
10.124.990 bytes, el tamaño EXACTO del error de memoria que reportó Victor, confirma que ahí fallaba —,
`onnx/decoder_model_merged_quantized.onnx`) se descargaron una sola vez desde Hugging Face en esta máquina
(`curl` directo a las URLs `resolve/main/...`, sin pasar por `pipeline()` de Transformers.js porque su build de
Node no soporta `device:'wasm'`) y se guardaron en `apps/reader/public/models/onnx-community/whisper-tiny/`
(~42 MB, respetando la misma estructura de carpetas que el repo de Hugging Face — así funciona la resolución de
rutas locales de Transformers.js: `env.localModelPath + modelId + '/' + archivo`). `whisper-worker.ts` cambió
de `allowRemoteModels:true` (Hub + caché de navegador) a `allowLocalModels:true, allowRemoteModels:false,
localModelPath: <origen de la app>/models/` — el modelo ya nunca depende de la red, ni la primera vez.
`whisper-protocol.ts`/`whisper-client.ts` ganaron un campo `modelsBase` (mismo patrón que `wasmBase`, ya
existente, para los archivos de ONNX Runtime). APK: 86,1 MB (subió ~29 MB, los ~42 MB del modelo comprimen
bien dentro del zip del APK). Typecheck y 913 pruebas en verde. **No pude probarlo en la tablet real** (mismo
límite de siempre) — sigue pendiente confirmar si esto por sí solo resuelve el error de memoria (probablemente
no del todo: el error viene de crear la sesión ONNX en memoria WASM, no de descargarlo, así que
`android:largeHeap` del intento anterior sigue siendo la mitigación relevante para ESE síntoma) o si además
hace falta un dispositivo con más RAM libre.

**Segundo error real en tablet: `feature_extractor` null — encontrado y arreglado en el propio navegador de esta
sesión, sin esperar a la tablet (2026-09-29, misma sesión):** el modelo empaquetado (arriba) sí cargó — el error
de memoria no volvió a aparecer — pero surgió uno nuevo: `TypeError: Cannot read properties of null (reading
'feature_extractor')`. Encontrado el motivo leyendo el código fuente de Transformers.js directamente (no hubo
que esperar a Victor para diagnosticarlo): `env.localModelPath` con `env.allowLocalModels:true` +
`env.allowRemoteModels:false` es un camino con un bug real de la librería en el navegador —
`get_file_metadata()` (la usa `get_processor_files()` para saber si hace falta `preprocessor_config.json`) solo
comprueba archivos "locales" cuando la ruta NO es una URL http(s), pero en un navegador `localModelPath`
**siempre** es una URL absoluta (no hay filesystem real) — así que con `allowRemoteModels:false` esa
comprobación nunca encuentra nada, `get_processor_files()` concluye que no hace falta feature extractor, y la
construcción del pipeline se rompe más tarde con ese `null`. Arreglo: en vez de `allowLocalModels`, se usa el
camino "remoto" de Transformers.js tal cual (el mismo mecanismo que ya funcionaba contra Hugging Face) pero
apuntado al propio origen de la app: `env.allowRemoteModels:true`, `env.remoteHost:<modelsBase>`,
`env.remotePathTemplate:'{model}/'` — mismo resultado (todo servido desde dentro del APK, cero red), sin pisar
el bug. **Esta vez sí se pudo verificar de punta a punta sin la tablet**: se inyectó un micrófono falso
silencioso (`getUserMedia` parcheado a un `MediaStreamDestination` de Web Audio) en el navegador integrado de
Claude Code para saltarse el bloqueo de micrófono de ese entorno y ejercitar el código REAL de la app
(`WhisperSpeechEngine` → VAD → Whisper) tal cual correría en la tablet — el estado pasó a "Escuchando de
verdad" (verde) sin ningún error, confirmando que el modelo carga y el pipeline completo queda listo. (Un tono
puro de prueba no disparó ninguna transcripción, como se esperaba: el VAD Silero está entrenado para voz real,
no cualquier energía de audio — no es un fallo.) APK reconstruido (86,5 MB), typecheck y 913 pruebas en verde.
Sigue pendiente que Victor confirme en la tablet real con voz de verdad (el navegador integrado no tiene
micrófono real ni es el WebView de Android).

## Cuatro libros más de "Profesiones" — Bombera, Chef, Bióloga marina, Desarrolladora de videojuegos (2026-09-29)

Cuarto, quinto, sexto y séptimo libro de la colección (después de "La misión que perdió la Tierra", el
astronauta): *La salida que nadie contaba* (Imani, bombera), *La torre que se volvió bosque* (Gael, chef),
*La luz que no estaba en el mapa* (Samuel, biología marina — fuentes NOAA sobre bioluminiscencia citadas en el
paquete) y *El puente que desaparecía* (Zoe, desarrollo de videojuegos — diseño inclusivo inspirado en W3C
WAI). Mismo esquema exacto que el libro del astronauta (12 páginas, 6 ilustradas + 6 pausas de lectura,
`checkpoint:{explorador,lector}`, vocabulario con sílabas en texto con guiones) — se montaron los 4 en un solo
paso con el mismo script parametrizado sobre las 4 familias. El umbral de color de siempre funcionó sin
ajustes en los 4. Dos páginas de *La torre que se volvió bosque* (`p05`, `p07`) midieron con menos altura de la
ideal — revisadas visualmente: `p05` es un caso de máxima-área correcto (una franja más ancha y más corta pesa
más que una más angosta a toda altura, dado cómo está compuesta la escena de los pasteles) y `p07` es un
degradado sutil cerca del borde (mismo patrón ya documentado varias veces) — ninguna rota, ambas aceptadas.

**Bug real de `packages/session-engine`, no de contenido — encontrado por ser la primera palabra de 6 sílabas
del repaso:** `stories:check`/typecheck pasaron limpio, pero la prueba de humo de la biblioteca falló para
*La luz que no estaba en el mapa* con `Cannot read properties of undefined (reading 'syllables')` en el
repaso por sílabas. Causa real, en `packages/session-engine/src/review.ts`: `tileOrder(n)` (decide en qué
orden se mezclan las fichas) tenía un respaldo fijo `[3,1,4,0,2].slice(0, n)` para `n` de sílabas ≥ 5 — para
`n=5` daba los 5 elementos completos (permutación válida, por eso nunca se detectó: ninguna historia anterior
tuvo una palabra de repaso de 6+ sílabas), pero para `n≥6` `.slice(0, n)` sobre un arreglo de solo 5 elementos
seguía devolviendo nada más esos 5 — a "bioluminiscencia" (6 sílabas: bio-lu-mi-nis-cen-cia) le faltaba una
ficha entera ("cia") que nunca se dibujaba. Diagnosticado con un `console.log` temporal dentro de la propia
prueba (mostró tiles `["nis","lu","cen","bio","mi"]`, 5 en vez de 6) — no hacía falta la tablet ni nada externo
para encontrarlo. Arreglado con un algoritmo general (intercalar desde ambos extremos hacia el centro) que da
una permutación completa para cualquier cantidad de sílabas, conservando los casos especiales de 2–4 ya
existentes. 989 pruebas en verde en total (la biblioteca completa ya lee las 4 historias nuevas enteras, ambos
idiomas, sin prueba aparte).

- Material de referencia en `content/la-salida-que-nadie-contaba/`, `content/la-torre-que-se-volvio-bosque/`,
  `content/la-luz-que-no-estaba-en-el-mapa/` y `content/el-puente-que-desaparecia/`.
- Verificado visualmente en `npm run dev`: portada y página 1 de *La torre que se volvió bosque* y *La luz que
  no estaba en el mapa* (texto bien ubicado, ilustraciones intactas), y los 4 confirmados en Biblioteca con
  nivel 6.
- **Continuidad de la colección**: ninguno de estos 4 libros menciona a Abril (la protagonista de arquitectura
  reservada para su propio libro) ni reutiliza a Elián — consistente con lo que pedía el paquete del astronauta.

## Lienzo adaptable en toda la app + pantalla completa inmersiva en Android (2026-09-29)

Victor probó en una tablet real y reportó dos problemas: "el app tiene una dimensión establecida y no se ajusta
a la pantalla" (bordes negros) y pidió que "la barra de abajo desaparezca" (la barra de navegación de Android,
que dentro de la app no cumple ninguna función más que, sin querer, tapar parte del borde negro).

**Bordes negros — causa real encontrada en el código, sin necesitar la tablet:** `TabletCanvas`
(`packages/ui/src/stage.tsx`) ya tenía un modo `adaptive` que ajusta el alto del lienzo a la proporción real de
la pantalla (dentro de un rango de 940-1180px, para no deformar el diseño) — pero solo se activaba en páginas
con plantilla durante la lectura misma (`select`, `prep`, `reading`, `pageDone`, `question`, `review`). Inicio,
Biblioteca, Progreso y Fin de historia se quedaban SIEMPRE con el alto fijo de diseño (996px), mostrando el
fondo `--color-stage` (`#14161c`, casi negro) como borde cuando la proporción real de la tablet no coincidía
— exactamente los bordes negros que describió Victor, muy probablemente vistos primero en Inicio/Biblioteca
(las primeras pantallas que se ven). Arreglo en `apps/reader/src/use-session.ts`: `fitMode` (la prop `adaptive`
de `TabletCanvas`) pasó de esa lista acotada a `true` siempre — todas las pantallas aprovechan ahora el alto
real de la pantalla. Verificado con el navegador integrado emulando un viewport de proporción muy distinta a
la de diseño (1200×1000, muy distinto de los 1508×996 aprobados): medido por DOM directo (no por captura de
pantalla, que puede confundir el recorte del propio panel de Claude Code con el borde de la app), el lienzo
ocupó el 100% del ancho y solo dejó un margen vertical pequeño e intencional (61 px de 1000, por el tope
`MAX_ADAPTIVE_HEIGHT`) — nada parecido al borde fijo de antes.

**Pantalla completa inmersiva en Android:** `MainActivity.java` ahora oculta la barra de estado y la de
navegación al abrir la app y cada vez que recupera el foco (`WindowInsetsControllerCompat`,
`BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE`: un gesto desde el borde las muestra un instante y se ocultan solas de
nuevo, así nunca queda al usuario sin forma de salir). Sin cambios en el lado web: es una configuración nativa
de Android, la única parte de Capacitor que sí es específica de la plataforma.

- Typecheck y 989 pruebas en verde (cambio de una línea en `use-session.ts`, sin tocar contenido).
- APK reconstruido (97 MB, sube por las imágenes de los 4 libros de "Profesiones" agregados antes, no por este
  cambio).
- **Sin probar en la tablet real todavía** — pendiente que Victor confirme si los bordes negros desaparecieron
  del todo y si la barra de navegación ya no aparece.

## "Modo lectura libre" (2026-09-29, misma sesión, antes de la siguiente reconstrucción)

Victor pidió, antes de instalar la siguiente versión: "un modo padres, donde el padre sea el que lee... o modo
lectura libre, donde tenga un botón para ir cambiando la página" — para leer con Noah sin depender del
micrófono/reconocimiento de voz. Implementado como un ajuste nuevo en Modo padres (`ParentSettingsScreen`,
sección "Modo lectura libre", Activado/Desactivado, persistido en `localStorage` igual que la meta diaria).

Con el modo activado:
- **Nunca se usa el motor de voz** (ni siquiera con `VITE_REAL_VOICE=1`): `use-session.ts` construye siempre
  `FakeReadingEngine` en vez de `RealReadingEngine`/`WhisperSpeechEngine` — no se pide micrófono ni se carga el
  modelo Whisper, más simple y más privado cuando el padre ya sabe que va a leer en voz alta él mismo.
- Aparece un botón real (no de desarrollo), **"Página siguiente ›"**, abajo a la derecha de la pantalla de
  lectura, en los dos repartos (ajustado y clásico). Al tocarlo, la página se marca como leída por el mismo
  camino que ya usaba el panel de desarrollo (`engine.simulate.completePage()`) — la pregunta de comprensión de
  la página, si la tiene, sigue apareciendo igual que en el modo normal.
- El tiempo real transcurrido en la página (desde que cargó hasta que se toca el botón) se acredita como
  lectura válida directamente en el temporizador (`engine.timer.machine.ingest(...)`), para que "Mi progreso" no
  se quede en cero solo por no haber voz que reconocer.

Reutiliza casi por completo mecanismos ya existentes y probados (`simulate.completePage`, el temporizador
público de ambos motores) — el código nuevo es sobre todo el ajuste persistido y el botón. Verificado de punta a
punta en el navegador integrado: activar el modo, abrir una historia, tocar "Página siguiente ›" una vez → sale
"¡Leíste toda la página!" → aparece la pregunta de comprensión → al contestar bien y continuar, pasa a la
página 2 correctamente, con el reloj ya mostrando segundos acreditados. El interruptor en Modo padres también
se probó directamente (cambia y persiste en `localStorage`).

- Typecheck y 989 pruebas en verde. APK reconstruido (97,5 MB).
- **Pendiente de decidir, no implementado todavía**: si además debería poder RETROCEDER una página (Victor
  mencionó "ir cambiando la página", en plural/genérico) — se dejó solo hacia adelante por ahora, para no
  complicar el temporizador/las preguntas ya contestadas; agregarlo es sencillo si hace falta.

## "Modo lectura libre": botones dentro de la barra, no flotando encima (2026-09-29, mismo día)

Victor mandó una captura: el botón "Página siguiente" (flotante, esquina inferior derecha) tapaba el botón DEV y
se veía mal encajado. Pidió, antes de reconstruir: **dos botones** (adelante Y atrás), que aparezcan también
mientras se ve la pregunta de comprensión, y que ocupen el sitio exacto de la mascota-estrella y su mensaje
("Cuando quieras, empieza a leer.") — quitando esos dos elementos por completo en modo lectura libre, no
agregando algo encima.

Encontrado el componente real (no el que yo pensaba): las historias "cuento largo" (todo nivel 6, con
`template:'full'`) usan el reparto AJUSTADO (`isBalloonPage`), cuya barra inferior es `ReadingBar` — ahí vive la
mascota+burbuja que salía en la captura de Victor, no en `SidePanel` (que es el reparto clásico de las historias
cómic nivel 1-3). Cambios:
- `ReadingBar` y `SidePanel` (los dos repartos, por consistencia) ganaron `freeReading`/`onFreeBack`/
  `onFreeAdvance`: con el modo activo, en el EXACTO lugar donde iba la mascota+mensaje (o la barra de
  micrófono+mensaje en audiencia "lector") aparecen dos botones, **"‹ Atrás"** y **"Siguiente ›"**, a ancho
  completo, sin overlaps con nada. Se quitó el botón flotante anterior (`FreeAdvanceButton`) por completo.
- Nuevo: **botón "Atrás"** — `freeBack()` en `use-session.ts` + nueva acción `free.back` en
  `packages/session-engine/src/flow.ts` (`reduceFlow`): vuelve directo a la página anterior (`pageIndex - 1`),
  sin pedir de nuevo la pregunta de esa página ni tocar el temporizador. No hace nada en la página 1 (sin
  deshabilitar visualmente el botón todavía — mejora simple para más adelante si hace falta).
- Como los botones viven en el panel/barra persistente (no en un overlay de una sola pantalla), aparecen igual
  durante 'reading', 'pageDone', 'question' y 'review' — exactamente lo que pidió Victor ("incluso en el área
  de las preguntas"), sin código extra para eso: es la misma barra en todos esos estados.

Verificado de punta a punta en el navegador integrado (con el mismo truco de siempre: activar el modo desde
Modo padres, abrir una historia real): página 1 → "Siguiente" → pregunta → contestar → página 2 confirmada →
"Atrás" → vuelve a página 1 confirmado. Typecheck y 989 pruebas en verde.

**NO reconstruido/desplegado todavía — Victor pidió esperar** a terminar de juntar más arreglos antes de la
siguiente compilación del APK.

## "La puerta que dejé entreabierta" — libro independiente para 10-13 años (2026-09-30)

Octava familia nivel 6, primera con un paquete editorial de esquema distinto a los siete anteriores: en vez
de párrafos por idioma, `LIBRO.json` traía un solo string de texto por página, preguntas reflexivas ABIERTAS
(sin opciones ni respuesta correcta, dos por página) y vocabulario como pares `{es,en}` sin sílabas ni
definiciones. `ENTREGA_CLAUDE.md` pedía explícitamente no asumir que el JSON ya cumplía el contrato de la app
y validar contra `packages/contracts/src/story.ts` antes de importar.

**Reemplazo de dos imágenes, pedido por Victor:** "la hoja 5 y la portada cambiala del zip, porque tienen que
ser reemplazadas" — se sustituyeron `imagenes/portada.png` y `imagenes/escena_05.png` del zip por dos
imágenes que Victor adjuntó aparte (verificadas 1536×1024, mismo estilo), antes de convertir nada a WebP. La
imagen de la página 5 se confirmó por el texto exacto (la escena de la puerta entreabierta con la mamá
asomándose coincide palabra por palabra con `TEXTO_ES.md`).

**Descubrimiento real que cambió el reparto de toda la historia:** las siete ilustraciones del zip (a
diferencia de las siete familias "cuento largo" anteriores) NO traen un panel en blanco reservado para el
texto — son escenas a sangre completa, sin espacio vacío. Montarla con `template:'full'` (el reparto AJUSTADO
que usan todas las demás historias nivel 6) habría obligado a superponer texto sobre el arte, tapando
personajes. Se detectó con un script de medición (el mismo algoritmo `growSideBand` de siempre) que no
encontró ninguna semilla de color crema en la fila central de 5 de las 7 imágenes — solo las dos reemplazadas
por Victor sí tenían panel, porque comparten el estilo de las demás familias. Se optó por el reparto CLÁSICO
(sin `template`, bloques sin `layout`): la ilustración se muestra completa e intacta, el texto se lee en el
panel lateral — ya soportado de punta a punta por `ComicLayer`/`SidePanel` sin cambios de código, incluida la
integración automática de "Modo lectura libre" (`FreeNavButtons`).

**Checkpoints reescritos, no las preguntas abiertas originales:** el contrato solo admite opción múltiple con
`correctIndex`; `stories:check` además exige que cada familia tenga al menos una página con `checkpoint`. Se
escribieron 12 preguntas nuevas de opción múltiple (`explorador` literal + `lector` interpretativa) inspiradas
en las abiertas del paquete, cuidando la advertencia de `ENTREGA_CLAUDE.md` de no convertir el desacuerdo en
culpa unilateral ni la disculpa en solución instantánea (p. ej. p05: la respuesta correcta es que la disculpa
sincera de mamá Y la vergüenza de Isa pueden existir a la vez, no que una anule a la otra). Las 24 preguntas
abiertas originales (ES/EN) se conservaron sin usar en
`content/la-puerta-que-deje-entreabierta/PREGUNTAS_ABIERTAS.md`, como material de conversación opcional para
el padre — mismo criterio que `RETOS_DE_RAZONAMIENTO.md` en *El caso de la estrella desaparecida*.

Vocabulario (12 palabras ES/EN) con sílabas y definiciones escritas para este montaje, ya que el paquete solo
traía pares de traducción. Se priorizó usar como clave la palabra tal como aparece literalmente en el texto de
cada idioma cuando fue posible (p. ej. EN "crack", "frame", "agreement", "apology" en vez de las traducciones
literales del paquete), para que tocar la palabra en pantalla abra su ayuda de verdad.

- Material de referencia en `content/la-puerta-que-deje-entreabierta/` (paquete original completo +
  `PREGUNTAS_ABIERTAS.md`).
- Typecheck y 1004 pruebas en verde (989 + 15 nuevas: `stories:check` había fallado una vez por no tener
  ningún checkpoint, antes de escribir los 12).
- Verificado de punta a punta en el navegador integrado: ficha con portada reemplazada, página 1 con arte
  original del zip y panel lateral, pregunta de la página 1 contestada correctamente, páginas 2-4 con arte
  original, página 5 con la imagen reemplazada mostrando exactamente la escena de la puerta entreabierta.
- **NO reconstruido/desplegado todavía** — sigue pendiente el mismo APK acumulado (voz real + modo lectura
  libre + botones reubicados + lienzo adaptable + pantalla completa + Profesiones + esta historia).

## Audio real de pronunciación, nombre editable y logros reales (2026-09-30)

Noah ya está usando la app a diario para leer en inglés y español. Victor preguntó qué más se podía mejorar
"aparte del motor Whisper" y pidió tres cosas: audio real en la ayuda de pronunciación, nombre del niño
editable, y revisar/mejorar el sistema de recompensas.

**Audio real (`speechSynthesis`):** la ayuda de palabra difícil (`HelpModal`) y la ficha de repaso solo animaban
sílabas en silencio — ahora suenan de verdad. `packages/ui/src/tts.ts` (nuevo): `speak(text, language)` usa el
sintetizador del navegador, cancela cualquier pronunciación anterior y elige `es-ES`/`en-US` según el idioma de
la historia. **No es un motor de reconocimiento y no graba nada — docs/07 no aplica, es la app hablando hacia
afuera** — por eso vive fuera de la abstracción `SpeechEngine` (esa es solo para entrada de voz). Cableado en
`apps/reader/src/use-session.ts`: un `useEffect` sobre `pronounceNonce` dice la palabra en ayuda actual cada vez
que se pide escucharla (botón "Escuchar", icono de altavoz, "Escuchar de nuevo"); `onReviewListen` (antes un
`() => {}` vacío) ahora dice la palabra actual del repaso. Verificado en el navegador integrado instalando un
espía sobre `speechSynthesis.speak`: confirma la llamada real con el texto, `es-ES` y velocidad 0.85 en los tres
puntos de entrada (barra de escuchar, modal de ayuda, repaso).

**Nombre del niño editable:** "Alex" era un marcador de relleno del prototipo (`apps/reader/src/mock-data.ts`).
Nuevo `readChildName`/`saveChildName` en `parent-settings.ts` (mismo patrón `localStorage` que la meta diaria),
con **"Noah" como valor por defecto** (no "Alex": es el niño real para el que se construyó la app) en vez de
crear un perfil vacío. Campo de texto nuevo en Modo padres (`ParentSettingsScreen`, primera sección, antes de
idioma) — arriba de todo porque es lo más personal. Verificado de punta a punta: cambiar el nombre en Modo
padres y volver a Inicio muestra el saludo actualizado de inmediato.

**Logros reales — "Aventurero" y "Nueva palabra dominada" (antes SIEMPRE bloqueados, `icon:'?'`):**
- **Aventurero** (5 categorías distintas): se agregó `category?: string` al contrato `Story` y a
  `SessionSummary` (viaja de la historia leída al resumen guardado, docs/07: es metadato de contenido, no dato
  del niño). Las 21 familias reales (74 archivos JSON, es+en) se etiquetaron con 6 categorías nuevas —
  `amistad`, `misterio`, `ciencia-ficcion`, `oficios` (colección Profesiones), `fantasia` (trilogía Nico),
  `crecimiento` (La puerta que dejé entreabierta) — con un script de una sola vez, borrado después de correrlo.
  `computeProgressStats` junta las categorías de historias TERMINADAS en `categoriesRead`.
- **Nueva palabra dominada**: en vez de inventar un tracker nuevo de "intentos por palabra" (habría hecho falta
  tocar el motor de lectura para detectar cada lectura correcta de una palabra ya vista), se calculó algo
  honesto con lo que YA se guardaba: si una palabra costó la PRIMERA vez que se terminó una historia y ya NO
  aparece entre las que costaron la ÚLTIMA vez que se terminó esa MISMA historia otra vez, se considera
  dominada (`masteredWordsOf` en `progress-data.ts`). Sin releer una historia completa no hay ninguna palabra
  dominada — nunca se inventa el dato.
- Iconos actualizados de `?` a 🧭 (Aventurero) y 🏅 (Nueva palabra dominada); se ven incluso bloqueados.
- Tests nuevos en `progress-data.test.ts` (categorías, palabras dominadas con y sin relectura, palabra dominada
  en otra historia NO cuenta) y reescritos en `build-progress.test.ts` (antes probaban que quedaban SIEMPRE
  bloqueados; ahora prueban el umbral real de cada uno). Arreglados 7 fixtures de pruebas de integración que
  esperaban literalmente "¡Hola, Alex!" (`app-flow`, `library-screen`, `multi-page`, `parent-mode`).
- 1011 pruebas en verde (1004 + 7). Typecheck limpio. Verificado en el navegador integrado: "Mis logros" ya
  muestra 🧭/🏅 en vez de "?".

**NO reconstruido/desplegado todavía** — sigue el mismo pedido de Victor de esperar a juntar más arreglos antes
del siguiente APK. Nada de esto necesita Capacitor/Android para funcionar (es JS puro), así que se puede seguir
usando de inmediato en `npm run dev`/`npm run tablet` mientras tanto, sin esperar una reinstalación.

## "La pregunta que guardé en el bolsillo" — libro de Amara, 10-13 años (2026-09-30)

Novena familia nivel 6. Paquete en 3 zips (texto/preguntas, arte, y un tercer zip "páginas listas" con fondos
de las 12 páginas ya con panel en blanco). **El zip de "páginas listas" llegó corrupto** — `unzip` y el
`zipfile` de Python coinciden en que le falta el índice central (`End-of-central-directory` ausente): el
archivo se cortó a mitad de subida. Se montó la historia completa igual con los otros dos zips (texto +
arte original), que ya traían todo lo necesario siguiendo el mismo patrón de siempre — el tercer zip solo
habría aportado fondos alternativos para las 5 páginas de solo texto, que de todas formas usan el fondo
compartido `_shared/reading-pause.webp`. Pendiente: si Victor quiere ese zip usado en el futuro, hay que
resubirlo completo.

**Reemplazo de imagen pedido por Victor:** mandó una imagen aparte con el mensaje "en el zip que tiene la
imagen 3, está mal esa imagen... para que la incluyas correctamente". Comparado contra el texto de la página 3
("Gabriel extendió su mapa **sobre una mesa**"): la `escena_03.png` original del zip mostraba a Gabriel
sosteniendo el mapa en alto (no coincide), mientras que la imagen adjunta lo muestra extendido sobre el
escritorio, coincidiendo exactamente — confirma que la imagen adjunta es la correcta. Se reemplazó antes de
convertir nada a WebP.

**Sí tenía panel en blanco esta vez** (a diferencia de "La puerta que dejé entreabierta", la anterior): se
montó con `template:'full'` (reparto AJUSTADO), como las demás familias nivel 6. Medirlo fue más difícil que
de costumbre: el arte tiene una textura de acuarela con manchas de color (azul/verde/amarillo) que se meten
varios cientos de píxeles dentro del panel — el algoritmo `growSideBand` de siempre, con el umbral de color
habitual, encontraba semillas y cajas de 0-50px (pura textura, ninguna banda real). Dos ajustes lo arreglaron:
(1) umbral de color mucho más permisivo (`r-b<=75, g-b<=45, r-g<=30` en vez de las diferencias ajustadas de
~20 de siempre) porque el papel de esta familia es más cálido/oscuro que el crema plano de otras; (2)
**desenfocar la imagen (`sharp().blur(12)`) antes de medir**, para que la textura fina del papel y las manchas
pequeñas de acuarela no rompan las corridas de píxeles, conservando solo las formas grandes (el panel en sí).
Con eso, las 7 cajas midieron de forma consistente (392-546 px de ancho). Dos páginas (`p06`, `p08`) quedaron
con menos ancho (~280-320 px) porque el arte real tiene manchas decorativas más grandes en esos bordes —
revisadas visualmente con recortes antes y después de ensanchar la caja: el texto autoajustable sigue
cabiendo sin problema, mismo patrón de "apretado pero no roto" ya visto en varias historias anteriores.

**Contenido sensible, tratado con cuidado (docs propio del paquete):** Amara conversa con Dios en su cuarto;
`ENTREGA_CLAUDE.md` pide explícitamente "ningún hecho se etiqueta como respuesta divina definitiva" y
conservar la agencia de Gabriel y la cautela de Celia. Los 12 checkpoints nuevos de opción múltiple (mismo
motivo que en "La puerta que dejé entreabierta": el contrato no admite las preguntas abiertas originales del
paquete) evitan declarar que Dios respondió como hecho verificable — las preguntas sobre la parte espiritual
piden reconocer lo que Celia dice explícitamente (que no finge saber la respuesta, que no le pone nombre a lo
que Amara vivió), nunca una conclusión inventada por mí. Las 24 preguntas abiertas originales quedaron sin
usar en `content/la-pregunta-que-guarde-en-el-bolsillo/PREGUNTAS_ABIERTAS.md`.

Vocabulario (12 palabras ES/EN) con sílabas y definiciones escritas para este montaje; se usó la palabra tal
como aparece en el texto cuando fue posible (p. ej. "valiente" en vez de "valentía", "forgive" en vez de
"forgiveness") para que tocarla abra la ayuda de verdad.

- Material de referencia en `content/la-pregunta-que-guarde-en-el-bolsillo/` (paquete original + `PREGUNTAS_ABIERTAS.md`).
- Typecheck y 1030 pruebas en verde (1011 + 19).
- Verificado de punta a punta en el navegador integrado: portada, páginas 1-2 con checkpoints contestados
  correctamente, página 3 con la imagen reemplazada mostrando exactamente la escena correcta, páginas 5-8
  (incluida la caja más angosta, 320px, en la página 8) con el texto bien ubicado y legible.
- **NO reconstruido/desplegado todavía** — mismo pedido de Victor de esperar.


## No está hecho

- **Vertical de tablet y teléfono**: solo existe diseño horizontal (docs/05 y docs/08 piden ambos).
- **Biblioteca**: por ahora es solo una cuadrícula (sin buscador, sin filtrar por nivel/idioma distinto al del perfil, sin
  categorías visibles al niño, aunque ya existen internamente para el logro "Aventurero") — suficiente mientras hay pocas
  historias; si la biblioteca crece mucho, estas son las primeras mejoras a considerar.
- **Más historias reales**: hay la piloto, *Mi mochila hace ¡achís!*, *El puente de las luciérnagas*, la prueba de estrés
  (*Mila, Pipo y la noche en que se apagaron las luciérnagas*), *Luna y el tren de los objetos perdidos*, *El puente de Lolo*,
  *El caso de la estrella desaparecida* (3 capítulos), *El mapa de la puerta desaparecida* (5 capítulos, 20 páginas, nivel 6),
  *La cúpula que parpadeaba* (4 capítulos, 16 páginas, nivel 6), la trilogía *Nico, héroe de los libros* (3 libros × 10
  páginas, nivel 6), las independientes *La mañana de los doce minutos* / *La isla que caminaba* (12 páginas cada una, nivel 6),
  la colección "Profesiones" — *La misión que perdió la Tierra* (astronauta), *La salida que nadie contaba* (bombera), *La torre
  que se volvió bosque* (chef), *La luz que no estaba en el mapa* (bióloga marina) y *El puente que desaparecía* (desarrolladora de
  videojuegos) — y las independientes *La puerta que dejé entreabierta* y *La pregunta que guardé en el bolsillo* (10-13 años
  cada una), 12 páginas cada una, nivel 6 — más la de plantillas de desarrollo. Falta imagen para "Un río" en la piloto.
- **Huecos de nivel 4 y 5**: 8 familias reales cubren niveles 1-3 (banda cómic) y 12 colecciones cubren solo nivel 6 — niveles 4
  y 5 no tienen ni una historia. Decisión: generar paquetes GPT nuevos específicamente para 4-5, con las plantillas
  `book-1`/`book-2`/`book-3` (banda "Illustrated Reader" de docs/05, sin medición de zona en blanco en el arte). Prompt y guía
  en `content/GUIA-DE-CONTENIDO.md`, secciones 8b/8c.
- **Series de varios capítulos**: no existe el concepto en `story.ts` ni en Inicio/Biblioteca (docs/08 nunca lo definió). *El caso
  de la estrella desaparecida* y *Nico, héroe de los libros* se montaron como historias sueltas con el título numerado a mano
  (`"1. …"`, `"2. …"`, `"3. …"`) para que al menos se ordenen y se entienda la secuencia — no hay portada de serie, ni "Capítulo 2
  de 3" como insignia, ni bloqueo hasta terminar el capítulo anterior.
- **Aro de la explosión** (`burst-2`): el aro que resalta el globo activo es un rectángulo redondeado alrededor de la estrella;
  quedaría mejor con forma de círculo/estrella.
- **Textos de la interfaz en inglés**: con una historia en inglés, botones y mensajes siguen en español (`copy.ts` está listo
  para traducir, falta el mecanismo de idioma de la interfaz).
- **Editor para la historia piloto**: el modo editor solo trabaja páginas con globos dibujados (con plantilla); los globos de
  la piloto son del diseño aprobado.
- **Voz real sin calibrar con condiciones reales**: el motor (Whisper local) ya corre en la tablet de Noah y se han corregido
  varios bugs reales encontrados ahí (ver más arriba) — pero sigue sin probarse sistemáticamente contra ruido de fondo,
  susurros, acentos distintos o varias voces a la vez (docs/09 #6/#7, protocolo original del Prototipo 00).
- **Un solo perfil de niño**: no hay selector de perfiles (para más de un hijo) ni cuenta/nube — a propósito, fuera de alcance
  de v1 (docs/09 #13).

## Relación con el Prototipo 00

La pregunta que debía responder el Prototipo 00 — ¿puede Whisper corriendo 100% local en el navegador de una tablet Android
real ser el motor de voz, sin la capa nativa Kotlin? — ya tiene respuesta parcial: **sí funciona**, corriendo dentro de la app
empaquetada con Capacitor (no como PWA suelta). `WhisperSpeechEngine` + `RealReadingEngine` están integrados de punta a punta,
se han encontrado y corregido varios bugs reales probando en la tablet física de Noah (orden mic/modelo al iniciar, permisos
de Android, memoria WASM, modelo empaquetado sin depender de red, un bug real de Transformers.js con rutas locales) — ver
`docs/DEVLOG.md` arriba para el detalle de cada uno. Noah ya está usando historias reales con este motor a diario. Lo que
falta del protocolo original es la calibración sistemática de umbrales con condiciones reales (ruido, susurro, acentos) — ver
"No está hecho" arriba.

## Siguiente etapa

1. Seguir calibrando el motor de voz con el uso real de Noah (umbrales de VAD/comparador, ver qué falsos positivos/negativos
   aparecen en uso diario, no solo en pruebas dirigidas).
2. Contenido de nivel 4-5 (hueco real en la biblioteca, ver "No está hecho").
3. Diseñar la vertical de tablet y teléfono (falta diseño, no solo código).
4. Traducir la interfaz al inglés para que una historia en inglés se sienta completa en ese idioma.

## "La cometa roja" (nivel 3) y "La octava linterna" (nivel 5) — primer contenido de nivel 5 (2026-09-30)

Dos libros independientes, entregados en el mismo formato de 3 zips (A_LECTURA_CLAUDE, B_PAGINAS_LISTAS,
C_ARTE_ORIGINAL) que las últimas dos historias. **Esta vez los 6 zips abrieron limpios** (`unzip -t` sin
errores en los 6) — a diferencia de las dos entregas anteriores, donde el zip B llegó corrupto una vez e
ilegible en la otra por textura de acuarela. *La octava linterna* es la **primera historia real de nivel 5**
de la biblioteca (cerrando parte del hueco de niveles 4-5 documentado desde el 2026-09-28).

**B (`paginas_sin_texto`) funcionó de verdad esta vez, y era mejor que C:** ambos `LIBRO.json` declaran un
`text_box_pixels` único y compartido para todas las páginas de cada libro (`{x:985,y:130,width:469,height:792}`,
idéntico en los dos). Se verificó recortando ese rectángulo exacto sobre 3-4 páginas de cada libro: panel
limpio, sin contenido de la ilustración adentro — **la primera vez que las coordenadas del propio paquete
resultaron confiables sin necesitar medir nada con `growSideBand`.** Además, en *La octava linterna* el arte
original (C) solo trae 6 escenas para 8 páginas de texto (reutiliza `escena_04.png` para las páginas 5 y 6,
por ejemplo), mientras que B sí trae una imagen única por página (`pagina_01.png`...`pagina_08.png`) — B es
estrictamente más completo que C aquí, así que se usó B como única fuente de ilustración, no solo como fondo.
Unas cuantas páginas en B traían un duplicado exacto sufijado `.writing.png` (mismo píxel por píxel que la
versión sin sufijo, comparado a ojo) — se ignoraron sin investigar más, parecen un artefacto de la generación.

**Esquema editorial más simple que "cuento largo":** sin capítulos, sin `editorial_principle` de sensibilidad,
vocabulario con **definición en español ya incluida** (solo hubo que escribir las definiciones en inglés), y
**4 preguntas abiertas planas por libro** (no 2 por página) — mucho menos denso que el patrón de Isa
Bella/Amara. Se decidió mantener la convención de la biblioteca completa (checkpoint de opción múltiple
explorador+lector en TODAS las páginas, no solo en las que traían pregunta original): las 3-4 preguntas dadas
se usaron como base en las páginas donde encajaban mejor por trama, y se escribieron a mano el resto siguiendo
el mismo criterio de fidelidad al texto que en historias anteriores. La cuarta pregunta de cada libro es una
reflexión personal sin respuesta derivable del texto (p. ej. "¿qué otra cosa podrías reparar?") — no se forzó
a opción múltiple; quedó en `content/<familia>/PREGUNTA_ABIERTA.md`.

**Bug real encontrado por `stories:check`, no por mí:** todo el vocabulario en inglés de *La cometa roja*
(`gust`, `caught`, `tear`, `patch`, `spool`) resultó ser monosílabo — el validador rechazó `reviewWords` con el
mensaje exacto `"gust" no tiene sílabas (2 o más) en el vocabulario`, algo que no había pasado en ninguna
historia anterior (siempre había al menos 3 palabras multisílabas disponibles). Solución: se agregaron 3
palabras nuevas al vocabulario en inglés que sí aparecen literalmente en el texto y sí tienen 2+ sílabas
(`caretaker`, `schoolyard`, `several`), usadas solo para `reviewWords`, dejando las 5 palabras monosílabas
como vocabulario normal (con ayuda al tocarlas, solo sin pasar por el repaso de sílabas). **Lección para
futuros paquetes**: si el vocabulario en inglés de un libro corto viene con muchas palabras de una sola
sílaba, revisar `reviewWords` contra `stories:check` antes de darlo por terminado, no asumir que 3 palabras
cualquiera alcanzan.

- Material de referencia en `content/la-cometa-roja/` y `content/la-octava-linterna/`.
- Typecheck y 1068 pruebas en verde (1030 + 38).
- Verificado de punta a punta en el navegador integrado: ficha de ambas historias (nivel 3 "Aventura" / nivel 5
  "Aventura"), página 1 de cada una con el texto bien ubicado, y la página más densa de *La octava linterna*
  (p04, 5 párrafos con diálogo) cabe sin desbordar.
- **NO reconstruido/desplegado todavía** — mismo pedido de Victor de esperar a juntar más arreglos.

# Bitácora — Sociedad

Se agrega al final, una entrada por sesión (formato corto, como `docs/log/SESSION_LOG.md`). Solo la cuenta de Sociedad.

## 2026-10-16 · Preparación (PREP-1)
- Módulo `subjects/sociedad` registrado ("Pronto"), paquete de contenido vacío, guardado por materia, índices reservados.
  Protocolo en `docs/14-MATERIAS-EN-PARALELO.md`. Siguiente: `docs/handoff/sociedad.md`.

## 2026-10-16 · SO-01: investigación entregada por Victor
- Victor entregó directamente el resultado de la investigación de Estudios Sociales (sin que esta cuenta escribiera el
  prompt primero): `docs/research/sociedad-investigacion.md`. 48 unidades propuestas (1.º–6.º, California HSS + C3
  Framework), 12 familias de interacción reutilizable, 6 lecciones de referencia completas, rúbrica de evaluación,
  guía de bilingüismo/accesibilidad y 19 fuentes con procedencia (LOC, National Archives, Smithsonian NMAI, CDE, The
  Met, NOAA, CAST).
- Es más grande que el equivalente de Matemáticas: propone "Etapa A" con *seis* unidades piloto (una por grado), no
  una sola. Decisión pendiente de Victor (DS-3): con cuál arrancar, siguiendo el patrón de Matemáticas (un solo
  piloto, no seis a la vez).
- También trae dos decisiones de identidad ya resueltas por el documento: nombre Sociedad/Estudios Sociales (DS-1,
  coincide con lo ya usado) y color ciruela `#7B4B6A` (DS-2).
- Pendiente real: muchas unidades dependen de fuentes históricas reales (mapas, documentos, recursos de museos) con
  permisos de reuso que hay que verificar antes de publicar — más curaduría que Matemáticas.
- `npm test`: 1202/1202 ✅ (sin cambios de código todavía, solo documentación).

## 2026-10-16 · SO-02: unidad piloto elegida (propuesta)

- Victor pidió que esta cuenta elija la unidad piloto más adecuada entre las 6 candidatas de "Etapa A". Se eligió
  **S3-U03** ("Un barrio cambia, pero el mapa no lo explica todo", 3.º, CA HSS 3.3): es la única de las 6 con
  escenario 100% ficticio (mapas y actas inventados, ya etiquetados así en la investigación) — cero permisos de
  fuentes reales que verificar antes de publicar, a diferencia de S4-U03 (Smithsonian NMAI), S5-U04 (National
  Archives) y S6-U02 (The Met). La investigación también conecta explícitamente 3.º con la Bahía de San Francisco
  (§4), cerca de donde vive la familia.
- Especificación completa en `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`: las 6 sesiones (de §6 de la
  investigación, aplicadas a esta unidad), solo 2 de las 12 familias de interacción (mapa por capas + mesa de
  fuentes — no las 12 de una vez, mismo patrón que Matemáticas empezando con 3/12 representaciones), rúbrica de
  evaluación acotada, vocabulario base ES/EN y nota sobre el color ciruela `#7B4B6A` (pendiente verificar
  contraste).
- Queda como **DS-3 propuesta**, no confirmada — no se avanza a SO-03 (pedir imágenes) hasta que Victor la
  confirme o pida otra unidad.
- Sin cambios de código. `npm test`: 1202/1202 ✅.

## 2026-10-16 · SO-02 v2: cambio de elenco — Inés, Teo y la abuela Elena

- Victor generó 5 imágenes a partir del pedido anterior (Teo+Nia de "La cometa roja") y, al verlas, reconoció
  que en realidad quería anclar la unidad al mundo de **"El mapa de la puerta desaparecida"** (historia de
  Lectura, nivel 6): sus personajes (Inés, Teo, la abuela Elena) y su jardín ya "juegan con geografía,
  relaciones interpersonales y mapas" — exactamente lo que necesita Sociedad.
- Se evaluaron dos caminos: (a) reusar literalmente el misterio del libro (el círculo rojo, el arco tapiado por
  la tormenta) dentro de Sociedad, o (b) reusar el elenco y el jardín, pero con un caso nuevo. Se recomendó (b)
  y Victor confirmó ("adelante"): (a) le arruinaría la sorpresa del libro a un niño que después lo lea, metería
  texto de nivel 6 en una unidad de 3.º, y dejaría dos sistemas (Lectura y Sociedad) contando la misma trama por
  separado.
- Nueva historia para esta unidad: **"El paso del arroyo"** — Inés y Teo encuentran, en la misma caja de mapas
  de la abuela, un plano viejo de su calle que muestra piedras para cruzar un arroyo (sin puente); hoy hay un
  puente. La abuela Elena aporta una fotografía (ella de niña saltando las piedras) y cuenta por qué se pidió el
  puente (más bebés y abuelos en el barrio que ya no podían cruzar saltando). Tres fuentes (plano, foto,
  testimonio), no una.
- Se encontró y reutilizó `content/mapa-de-la-puerta-desaparecida/personajes.png` — la hoja de referencia
  oficial de Inés/Teo/Elena/Nora (frente, 3/4, perfil, expresiones) que ya existía en el paquete de esa
  historia. Se copió, junto con las 5 imágenes de Victor, a `docs/design/sociedad/arte-referencia/`.
- Especificación reescrita: `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`. Pedido de imágenes reducido:
  `docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md` — de las 7 piezas originales, 2 se reusan tal cual (portada y
  escena de la abuela) de lo que Victor ya mandó; solo faltan 7 nuevas (2 planos antes/después, 1 tarjeta de
  foto, 4 poses de Teo referenciando la hoja oficial en vez de "La cometa roja").
- Sin cambios de código todavía. `npm test`: 1202/1202 ✅.

## 2026-10-16 · SO-03: llegaron las 7 imágenes + adendo de 1 pieza más

- Victor mandó las 7 piezas del pedido v2 (2 planos, 1 tarjeta de foto, 4 poses de Teo) en
  `KiteWise_Sociedad_S3_U03_7_Imagenes.zip`. Revisadas: cumplen el pedido — planos exactamente comparables (misma
  composición, solo piedras→puente), foto claramente antigua (sepia, sin texto), Teo coincide con la hoja
  oficial. Archivadas en `docs/design/sociedad/arte-entregada/` (PNG sin convertir todavía; WebP + integración
  quedan para SO-04/06).
- Victor también mandó, para comparar, el pedido 2 de Matemáticas (`KiteWise_Imagenes_Pedido_2_Para_Claude.zip`,
  18 piezas: 5.ª pose de Mila, 2 portadas, 11 props genéricos) y preguntó si Sociedad necesitaba más para quedar
  visualmente consistente.
- Análisis en `docs/design/sociedad/PEDIDO-IMAGENES-S3-U03-ADENDO.md`: el conteo total de Matemáticas (44) viene
  de **dos** pedidos — el segundo salió después de construir pantallas reales y notar gaps concretos (una pose
  para un momento de UI específico, una portada porque Inicio se veía genérico, props porque los ejercicios se
  repetían). Sociedad no tiene pantallas construidas todavía (SO-04/05/06 sin empezar), así que la comparación
  justa es contra el pedido 1 de Matemáticas (16 piezas) — ahí el pedido de Sociedad (7+2 reusadas) está en
  línea, misma disciplina de "empezar chico" (Matemáticas: 3 de 12 representaciones; Sociedad: 2 de 12 familias).
  También hay una diferencia real de materia: los props de Matemáticas son genéricos a propósito (reutilizables
  en cualquier ejercicio de conteo); el contenido de Sociedad (mapas, fotos) es específico de cada unidad por
  diseño — no tiene sentido pedir "props genéricos" todavía.
- Se identificó **una pieza real y no especulativa que faltaba**: `cover_sociedad`, portada de la materia (no de
  esta unidad) para la estantería de Inicio — Matemáticas tampoco la tenía en su pedido 1, pero al menos tenía
  un placeholder genérico; Sociedad no tiene ninguno. Pedida en el adendo. Todo lo demás (fondo de pantallas de
  interacción, 5.ª pose, marcador de progreso) se deja para un pedido 2 real, después de construir SO-06.
- `npm test`: 1202/1202 ✅ (sin cambios de código).

## 2026-10-16 · SO-04 a SO-07: la unidad piloto queda completa y jugable

- Victor mandó las 7 imágenes nuevas + `cover_sociedad` (el adendo) en dos ZIP y pidió completar todo el módulo
  de un tirón, fase por fase, sin parar a preguntar.
- Convertidas a WebP con `sharp` (recortadas a su silueta las 4 poses de Teo) y guardadas en
  `apps/mobile/assets/sociedad/{covers,scenes,chars}/`: 1536×1024 los planos/foto/portada (150–190 KB, bajo el
  presupuesto de 350 KB), 229–335×512 las poses de Teo (34–38 KB, bajo el presupuesto de 40 KB).
- **SO-04 (dominio):** `packages/contracts/src/social.ts` (tipos: `SocialUnit`, `SocialStep`, `SocialSource`…,
  aditivo, no toca `math.ts` ni `focus.ts`). `packages/social-content`: `content/s3u03.json` con las 6 sesiones
  completas en ES/EN; `validate.ts` (mismo patrón que `math-content`, con una regla propia: nunca "incorrecto" en
  ningún texto); `session.ts` (reducer puro: clasificar afirmaciones, elegir fuente, marcar fuentes usadas en
  "explicar", elegir el hueco en "revisar"; `investigationStars`/`investigationReasonKey` — mismo principio D11
  que `effortStars` de Lectura, pero propio: estrella por terminar, por usar ≥2 fuentes, por identificar el hueco
  real, nunca por adivinar). 15 pruebas nuevas, todas en verde.
- **SO-05 (textos):** `packages/ui-core/src/sociedad/copy.ts` (`SOCIAL_COPY`) — textos de interfaz reutilizables
  entre unidades futuras (no específicos de "El paso del arroyo", que vive en el JSON). El dominio devuelve
  claves (`investigationReasonKey`), nunca texto — mismo principio que Matemáticas
  (`docs/design/subjects/PATRON-MATEMATICAS.md` §2 paso 5).
- **SO-06 (pantallas):** componentes nuevos en `packages/ui-native/src/components/sociedad/` (`Teo`, `MapCompare`,
  `SourceCard`, `ChoiceList`, `StatementRow`) y dos pantallas en `apps/mobile/src/screens/`
  (`sociedad-notebook-screen.tsx`, `sociedad-investigation-screen.tsx`). Reusa `ClosingCard` y `useMovementBreak`
  de lo compartido, sin tocarlos. `subjects/sociedad/index.tsx`: `available: true`, `homeCard` real (lee el
  progreso guardado), `Screen` maneja cuaderno ↔ investigación como estado local (no toca `App.tsx`).
- **SO-07 (verificar):** `npm run typecheck` en todo el monorepo, limpio. `npm test`: **1218/1218 ✅**.
  `subjects.ts` (`SUBJECTS`) también pasa a `available: true` para Sociedad — se actualizó la prueba
  `packages/ui-core/tests/subjects.test.ts` que afirmaba lo contrario (es la prueba del propio cambio, no algo
  ajeno). `expo export --platform android` llegó a 1302 módulos y falló por los modelos de voz (`.bin`, no están
  en git, sin red en esta sesión para bajarlos) — **no relacionado con Sociedad**; se verificaron a mano las 8
  rutas de `require()` de arte y existen todas.
- **DS-2 (color ciruela) NO se aplicó**: `tests/tokens.test.ts` exige que `subjSociedad` en `tokens.ts` coincida
  exacto con `docs/design/kitewise/tokens.css` (la referencia de diseño original de Victor). Cambiar el color
  significa editar el archivo de diseño también — una decisión aparte de este módulo. Se dejó el naranja
  `#f08a10` ya aprobado.
- Pendiente real: SO-08 (revisión de un maestro) y que Victor la pruebe en un equipo real cuando pida el próximo
  APK. Detalle completo de lo que falta: `docs/handoff/sociedad.md`.

## 2026-10-16 · Expansión a las 6 unidades piloto (una por grado, 1.º–6.º)

- Victor preguntó si solo se había construido 3.º — confirmado que sí, y pidió más unidades piloto, una por
  grado restante, usando las candidatas que ya propone §17 ("Etapa A") de la investigación.
- **Generalización del motor (necesaria primero):** el tipo de paso que construí para S3 asumía "comparar dos
  capas de mapa" como forma casi universal; no le servía a 1.º (decidir una regla, sin mapa) ni a 6.º
  (simulación con razonamiento abierto). Se agregó un paso genérico `'elegir'` (elección razonada sin una
  fuente concreta) a `contracts/src/social.ts`, y `'pregunta'` pasó a aceptar una sola imagen o ninguna, no
  solo 2 capas obligatorias. `validateSocialUnit` y `evaluateSession`/`investigationStars` también se
  generalizaron: solo las unidades CON fuentes exigen los pasos "explicar"/"revisar"; en las unidades SIN
  fuentes, las estrellas 2.ª/3.ª dependen de `choiceQuality` (qué tan seguido se eligió una opción preferida).
- **Las 5 unidades nuevas**, con el mismo elenco (Inés, Teo) y el mismo principio de "nunca incorrecto":
  - **S1-U01** (1.º, CA HSS 1.1) "Una regla para compartir" — deliberación sobre compartir bloques entre 4
    niños, sin fuentes. 0 imágenes nuevas.
  - **S2-U01** (2.º, CA HSS 2.1) "Un cuaderno tiene historia" — un cuaderno viejo + una tarjeta, enseña
    observación vs. inferencia (§8 de la investigación, Library of Congress). 1 imagen nueva.
  - **S4-U03** (4.º, CA HSS 4.2) "Un edificio y las voces que le faltan" — **tema sensible** (misiones): se
    escribió con texto 100% original (nunca se reclama una fuente real tipo Smithsonian NMAI), centrado en la
    persistencia cultural indígena, nunca en escenas de coerción ni en darle al niño un papel de misionero o de
    persona sometida a trabajo forzado — siguiendo las precauciones explícitas de la investigación (§10). 1
    imagen nueva (reconstrucción arquitectónica, sin personas).
  - **S5-U04** (5.º, CA HSS 5.5-5.7) "Un ideal escrito y una realidad histórica" — **tema sensible**
    (esclavitud): las dos citas (la idea de igualdad del documento fundacional, la evidencia de esclavitud y
    falta de voto) son **paráfrasis propias**, no transcripciones oficiales — evita cualquier problema de
    precisión o derechos y mantiene el tono cuidadoso que pide la investigación. 0 imágenes (a propósito: ambas
    fuentes son de texto, sin ninguna imagen sensible que pedir).
  - **S6-U02** (6.º, CA HSS 6.2) "Un asentamiento junto al río" — simulación **expresamente ficticia** (no
    Uruk ni ningún lugar real) con 3 opciones igualmente válidas; enseña a reconocer los límites de una
    simulación simple. 1 imagen nueva.
- **Pantallas:** el cuaderno de Sociedad pasó de mostrar 1 unidad a un camino de 6 paradas (mismo patrón que el
  camino de lecciones de Matemáticas), sin bloqueos (docs/13). `SociedadProgress` ahora es un registro por
  unidad, no un solo progreso.
- Pedido de las 3 imágenes que faltan: `docs/design/sociedad/PEDIDO-IMAGENES-GRADOS-1-2-4-6.md`. Especificación
  de las 5 unidades: `docs/design/sociedad/UNIDADES-PILOTO-OTROS-GRADOS.md`.
- `npm run typecheck` en todo el monorepo: limpio. `npm test`: **1222/1222 ✅** (1218 + 4 pruebas nuevas:
  6 unidades por grado, unidad sin fuentes válida, flujo "elegir" completo con y sin opciones preferidas).
- Pendiente real: SO-08 (revisión de maestro, con atención extra a 4.º/5.º por ser temas sensibles) y las 3
  imágenes. Detalle completo en `docs/handoff/sociedad.md`.

## 2026-10-16 · SO-03: pedido de imágenes de la unidad piloto (v1, reemplazado por SO-02 v2 arriba)

- Victor pidió el prompt de imágenes directamente (sin objetar S3-U03) → DS-3 se trata como confirmada.
- Pedido completo en `docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md`: 7 piezas (portada, 2 mapas del barrio
  antes/después con la misma composición, 2 tarjetas de fuente ficticias sin texto, 4 poses de guía).
- Decisión propuesta DS-4: reutilizar a **Teo** (y a **Nia** como coprotagonista de esta unidad) de la historia
  de lectura "La cometa roja" (nivel 3, mismo grado) en vez de diseñar personajes nuevos — ya tienen arte
  aprobado y consistente (`apps/reader/public/stories/la-cometa-roja/`), ahorra una ronda completa de diseño de
  personaje nuevo (hoja de referencia, poses, Character Bible) que sí haría falta con un personaje inédito.
- Historia inventada para encuadrar las imágenes: "El Barrio de los Almendros" — Teo encuentra un mapa viejo de
  su barrio, lo compara con Nia contra cómo se ve hoy (puente y estación nuevos), investigan con dos documentos
  ficticios (acta municipal, anuncio comercial). Barrio explícitamente ficticio, no basado en ningún lugar real.
- Sin cambios de código. `npm test`: 1202/1202 ✅.

## 2026-10-16 · SO-09: llegaron las 3 imágenes finales — las 6 unidades quedan completas

- Victor mandó `cuaderno_viejo` (2.º), `edificio_mision` (4.º) y `asentamiento_mapa` (6.º) — las 3 piezas que
  faltaban del pedido en `docs/design/sociedad/PEDIDO-IMAGENES-GRADOS-1-2-4-6.md`.
- Revisadas: el cuaderno tiene solo "2005" escrito (lo único permitido), sin más texto; el edificio de la misión
  no tiene personas ni símbolos religiosos específicos; el mapa del asentamiento muestra los 3 terrenos
  (llanura, colina, bosque) sin ninguna etiqueta. Las 3 cumplen el pedido.
- Convertidas a WebP (`sharp`, 1536×1024): 172–328 KB, todas bajo el presupuesto de 350 KB (hubo que bajar la
  calidad del mapa del asentamiento de 78 a 65 para que entrara). Conectadas en
  `apps/mobile/src/sociedad-art.ts` (`SOCIAL_SCENES.cuadernoViejo/edificioMision/asentamientoMapa`) — las claves
  ya estaban escritas en el contenido JSON desde que se crearon las unidades, así que solo hizo falta registrar
  el `require()`.
- `npm run typecheck` en todo el monorepo: limpio. `npm test`: **1222/1222 ✅** (sin cambios de lógica, solo
  arte nuevo).
- **Las 6 unidades piloto de Sociedad quedan con todo su arte.** Pendiente real: solo SO-08 (revisión de un
  maestro) y verificación visual en equipo real.

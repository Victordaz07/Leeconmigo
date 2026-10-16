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

# Unidad piloto de Sociedad — S3-U03 · "El paso del arroyo"

**SO-02, v2 (2026-10-16).** Reemplaza la v1 ("Barrio de los Almendros", personaje inventado): Victor prefirió
anclar la unidad al mundo de **"El mapa de la puerta desaparecida"** (historia de Lectura, nivel 6) — mismos
personajes, mismo jardín, pero un caso **nuevo y propio de Sociedad**, no el mismo misterio del libro. Razones
del cambio en `docs/log/sociedad.md` (entrada "SO-02 v2").

## Por qué no se reusa el misterio del libro tal cual

"El mapa de la puerta desaparecida" ya tiene su propio misterio (el círculo rojo, el arco tapiado por una
tormenta) y es contenido de **nivel 6** (9-12 años, ~33 min de lectura). Repetirlo dentro de Sociedad:
- le arruinaría la sorpresa a un niño que después lo lea como historia de Lectura;
- metería un texto de nivel 6 dentro de una unidad pensada para 3.º;
- dejaría dos sistemas (ReadingEngine y el módulo de Sociedad) contando la misma trama por separado, difíciles
  de mantener sincronizados.

Por eso: **mismos personajes y mismo jardín, caso distinto.** El arco tapiado del libro no se menciona en esta
unidad — es un cambio distinto, en la calle de la abuela, no en el jardín.

## Personajes (reusar tal cual — hoja oficial ya existe)

**Inés**, **Teo** y la **abuela Elena**, de `content/mapa-de-la-puerta-desaparecida/`. Hoja de referencia
oficial (frente, 3/4, perfil, dos expresiones, cada uno): `docs/design/sociedad/arte-referencia/personajes-oficial.png`
(copia de `content/mapa-de-la-puerta-desaparecida/personajes.png`). **Adjuntar esta hoja en cualquier pedido de
imagen que incluya a Inés, Teo o Elena** — no se rediseña nada: mismo pelo, piel, ropa, edad.

**Teo es el guía recurrente de Sociedad** (como Mila lo es de Matemáticas): aparece solo, en miniatura, en una
esquina de cada ejercicio futuro.

## La historia (nueva, para esta unidad)

Inés y Teo visitan a la abuela Elena. En la misma caja de mapas viejos (de donde salió el mapa de la puerta)
encuentran **otro papel**: un plano a lápiz de la calle de la abuela. El plano muestra un arroyo que cruza la
calle — y, para pasar al otro lado, solo unas piedras colocadas en el agua. **Sin puente.**

Hoy, en cambio, hay un pequeño puente de piedra en ese mismo lugar.

Le preguntan a la abuela. Ella busca una fotografía antigua: se ve a sí misma de niña, saltando de piedra en
piedra para cruzar el arroyo. Cuenta que, con los años, más familias del barrio tuvieron bebés y abuelos que ya
no podían saltar las piedras con seguridad — así que los vecinos pidieron al ayuntamiento un puente, y lo
construyeron.

Inés y Teo comparan el plano viejo con la calle de hoy: el arroyo sigue en el mismo lugar, las casas siguen
siendo las mismas — pero ahora hay un puente donde antes solo había piedras.

**Tres fuentes, no una:** el plano viejo (mapa), la fotografía de la abuela (foto) y lo que ella misma cuenta
(testimonio oral) — ninguna por sí sola explica todo el cambio.

## Las 6 sesiones (estructura de `docs/research/sociedad-investigacion.md` §6, aplicada a este caso)

| # | Sesión | En esta unidad |
|---|---|---|
| 1 | La pregunta | Mostrar el plano viejo junto a una vista de la calle de hoy; el niño nota la diferencia (piedras → puente) y formula su pregunta. |
| 2 | Primera evidencia | Comparar el plano con la calle de hoy, capa por capa: qué sigue igual (casas, arroyo), qué es nuevo (el puente). |
| 3 | Otra mirada | La abuela muestra la fotografía (ella de niña cruzando las piedras). ¿Qué nos dice esta foto que el plano no decía? |
| 4 | Conectar | Escuchar lo que cuenta la abuela (texto/audio corto): por qué pidieron el puente. Relacionar la necesidad (bebés, abuelos) con la solución (puente). |
| 5 | Explicar o proponer | Construir una explicación con las 3 fuentes: plano + foto + testimonio. |
| 6 | Revisar y transferir | ¿Qué NO sabemos todavía con estas 3 fuentes? (p. ej.: ¿cuánto tardaron en construirlo? ¿quién lo pagó?) — nombrar qué otra fuente ayudaría a responder eso. |

## Interacciones a construir (2, igual que la v1)

1. **Mapa por capas** (`docs/research/sociedad-investigacion.md` §7): activar/desactivar capas sobre el mismo
   plano base para comparar "antes" (piedras) y "después" (puente). Fecha y escala no necesarias aquí (plano a
   lápiz sin fecha, como en el libro); sí debe quedar claro que es el mismo lugar en los dos momentos.
2. **Mesa de fuentes** (§7): 3 tarjetas esta vez (plano, foto, testimonio de la abuela), no 2 — el niño decide
   qué pregunta responde cada una y cuáles quedan abiertas.

## Evaluación (igual que v1, sin cambios)

| Dimensión | Necesita apoyo | En desarrollo | Evidencia suficiente |
|---|---|---|---|
| Uso de fuentes | Responde sin usar ninguna fuente. | Usa una fuente con ayuda. | Usa al menos 2 de las 3 fuentes para explicar el cambio. |
| Límites y revisión | Trata toda afirmación como segura. | Reconoce una duda con ayuda. | Nombra qué no se sabe todavía y qué fuente ayudaría. |

Nunca "incorrecto" ni rojo (docs/06). El error se nombra por tipo, se ofrece pista, no calificación.

## Vocabulario ES/EN (base, a completar en SO-05)

`plano`/`sketch map`, `arroyo`/`creek`, `puente`/`bridge`, `fuente`/`source`, `evidencia`/`evidence`,
`testimonio`/`account`, `cambio`/`change`, `vecinos`/`neighbors`.

## Identidad visual

- Color de Sociedad: ciruela `#7B4B6A` (DS-2) — pendiente verificar contraste contra el papel crema `#F7EFE1`.
- Estilo: acuarela digital cálida tipo storybook — el mismo de `content/mapa-de-la-puerta-desaparecida/` y de
  las 5 imágenes de referencia que mandó Victor (`docs/design/sociedad/arte-referencia/`), no el estilo plano de
  Matemáticas (el de Sociedad es más narrativo, coincide con la banda 3-4 "storybook" de `docs/05`).
- Portada: se puede reusar una de las 5 imágenes de referencia ya generadas (ver pedido de imágenes) en vez de
  pedir una nueva.

## Qué NO incluye este documento

- El misterio de "El mapa de la puerta desaparecida" (queda exclusivo de Lectura, nivel 6).
- Las otras 5 unidades piloto de "Etapa A" de la investigación.
- Las 10 familias de interacción restantes (de las 12 totales).
- Código o pantallas — eso es SO-04/05/06, después de que lleguen las imágenes nuevas (ver
  `docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md`).

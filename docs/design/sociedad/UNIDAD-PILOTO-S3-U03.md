# Unidad piloto de Sociedad — S3-U03 · "Un barrio cambia, pero el mapa no lo explica todo"

**SO-02.** Elegida como piloto único (no las 6 de "Etapa A" de `docs/research/sociedad-investigacion.md`,
siguiendo el patrón de Matemáticas: un solo piloto primero, `docs/design/subjects/PATRON-MATEMATICAS.md`).

## Por qué esta y no otra

De las 6 candidatas de la investigación (§17, Etapa A):

| Candidata | Por qué no (todavía) |
|---|---|
| S1-U01 (1.º) | Es la más simple, pero deja fuera mapas/fuentes — las dos piezas de interacción que más reutilizan otras unidades. |
| S4-U03 (4.º, misiones) | Temática central de California, pero exige fuentes reales (Smithsonian NMAI) con permisos de reuso que hay que verificar antes de publicar (§16) — más trabajo de curaduría del que conviene para un primer piloto. |
| S5-U04 (5.º) | Usa documentos reales (National Archives) — mismo problema de permisos. |
| S6-U02 (6.º) | Usa fuente real (The Met) — mismo problema de permisos. |
| **S3-U03 (3.º)** ✅ | **Escenario enteramente ficticio** (mapas y actas inventados, ya etiquetados como tal en la investigación) — cero permisos que verificar, como los manipulables inventados de Matemáticas. Enseña las dos piezas de interacción más reutilizables (mapa por capas, mesa de fuentes) sin el riesgo de licencias. Conexión local real: la investigación propone explícitamente San Francisco/la Bahía para 3.º (§4, nota de "Conexión local posible") — resuena con dónde vive la familia (Daly City). |

**Decisión propuesta DS-3** (pendiente de que Victor confirme antes de avanzar a SO-03): pilotear con S3-U03.

## La unidad (tal como la diseñó la investigación, §9)

- **Referencia curricular (borrador, sin validar por un maestro):** CA HSS 3.3.
- **Pregunta central:** «¿Qué cambió y qué evidencia explica por qué?»
- **Escenario (100% ficticio, etiquetado como tal en la UI):** dos mapas del mismo barrio, con 20 años de
  diferencia. El segundo mapa muestra un puente y una estación nuevos. Una tarjeta dice que un acta municipal
  (inventada) autorizó el puente; otra tarjeta (un anuncio comercial inventado) le atribuye todo el cambio a
  una tienda — a propósito, para que el niño note que una sola fuente no basta.
- **No es una historia real de Daly City ni de San Francisco** — es un caso de práctica. (Evitar que el niño,
  o un padre viéndolo, lo confunda con el barrio real donde vive.)

## Las 6 sesiones (estructura de `docs/research/sociedad-investigacion.md` §6, aplicada a esta unidad)

| # | Sesión | En esta unidad |
|---|---|---|
| 1 | La pregunta | Mostrar los dos mapas lado a lado; el niño nota que algo cambió y escribe/dice su pregunta. |
| 2 | Primera evidencia | Activar capas del mapa 2 (qué es nuevo, qué sigue igual); anotar observaciones. |
| 3 | Otra mirada | Leer la tarjeta del acta municipal (ficticia): ¿qué explica y qué no? |
| 4 | Conectar | Leer la tarjeta del anuncio comercial (ficticio): compararla con la del acta — ¿coinciden, se contradicen? |
| 5 | Explicar o proponer | Construir una explicación con al menos 2 materiales como evidencia. |
| 6 | Revisar y transferir | Identificar una conclusión que NO está apoyada ("todas las familias mejoraron") y decir qué otra fuente ayudaría a responderla. |

## Interacciones a construir (2, no las 12 de la lámina completa)

Siguiendo la lección de Matemáticas (empezó con 3 representaciones de 12, no las 12 a la vez):

1. **Mapa por capas** (§7): activar/desactivar capas sobre el mismo mapa base para comparar dos fechas.
   Control de calidad: fecha, escala y leyenda visibles siempre; una frontera o elemento histórico nunca se
   dibuja como si fuera el barrio real actual.
2. **Mesa de fuentes** (§7): tarjeta con autoría, fecha y tipo visibles (aquí: "escenario ficticio" en ambas);
   el niño decide qué pregunta puede responder cada una y cuáles quedan abiertas.

Las otras 10 familias (línea temporal, comparador antes/después, constructor de explicaciones, red de causas,
red de producción, presupuesto comunitario, asamblea guiada, museo digital, investigación biográfica,
comparador de sociedades) **no se construyen en este piloto** — quedan para unidades futuras que las necesiten.

## Evaluación (adaptada de la rúbrica general, §12, solo a lo que esta unidad mide)

| Dimensión | Necesita apoyo | En desarrollo | Evidencia suficiente |
|---|---|---|---|
| Uso de fuentes | Responde sin usar ninguna tarjeta. | Usa una tarjeta con ayuda. | Usa al menos 2 tarjetas para explicar el cambio. |
| Límites y revisión | Trata toda afirmación como segura. | Reconoce una duda con ayuda. | Señala la conclusión no apoyada y qué fuente ayudaría. |

Nunca "incorrecto" ni rojo (docs/06, igual que Matemáticas). El error se nombra por tipo ("esa tarjeta explica
el puente, pero no explica si todas las familias mejoraron") y se ofrece pista, no calificación.

## Vocabulario ES/EN (base, a completar en SO-05)

`mapa`/`map`, `capa`/`layer`, `fuente`/`source`, `evidencia`/`evidence`, `cambio`/`change`,
`continuidad`/`continuity`, `acta`/`record` (ficticia, aclarar que no es un documento oficial real).

## Identidad visual

- Color de Sociedad: ciruela `#7B4B6A` (DS-2, propuesto en la investigación) — **pendiente verificar contraste**
  contra el papel crema `#F7EFE1` de Kitewise antes de usarlo en texto (no solo en acentos/fondos).
- Arte: solo lo que esta unidad necesita — 2 mapas (mismo barrio, 2 fechas) + 2 tarjetas de fuente ficticia.
  Nada de texto incrustado en las imágenes (docs/05). Lista de pedido va en SO-03, no antes.

## Qué NO incluye este documento

- Las otras 5 unidades piloto de "Etapa A" del documento de investigación.
- Las 10 familias de interacción restantes.
- Fuentes reales con permisos (quedan para unidades futuras, una vez resuelto el proceso de curaduría de §16).
- Arte, código o pantallas — eso es SO-03/04/05/06, después de que Victor confirme esta elección (DS-3).

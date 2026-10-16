# Adendo al pedido de imágenes — 1 pieza más (cover de materia)

**Contexto (2026-10-16):** Victor comparó el pedido de Sociedad contra `docs/design/math-visual/PEDIDO-IMAGENES-2.md`
(Matemáticas) y preguntó si hacía falta más para que quedara consistente. Revisión honesta:

## Por qué el pedido de Sociedad es más chico que el de Matemáticas — y por qué eso está bien

El recuento completo de Matemáticas (44 piezas) viene de **dos pedidos**, no uno: el primero (16 piezas, antes de
construir ninguna pantalla) y un **segundo** (18 piezas) que salió **después** de construir las pantallas reales
y notar qué faltaba (una 5.ª pose de Mila para un momento concreto de la UI, una portada porque Inicio se veía
genérico, objetos para que los ejercicios no se repitieran siempre igual). Sociedad todavía no tiene ninguna
pantalla construida (SO-04/05/06 sin empezar) — comparar contra el pedido 1 de Matemáticas (16 piezas) es más
justo que contra el total, y en esa comparación 7+2 reusadas no es chico: Matemáticas empezó con **3** de 12
representaciones; Sociedad empieza con **2** de 12 familias de interacción, la misma disciplina.

También hay una diferencia real entre materias, no solo de cantidad: los objetos de Matemáticas son genéricos a
propósito (una canica sirve para cualquier ejercicio de conteo) — por eso Matemáticas necesita una biblioteca
grande de props reutilizables. El contenido de Sociedad (mapas, fotos, documentos) es **a propósito específico
de cada unidad** — un plano no sirve para otra unidad distinta. Pedir "props genéricos de Sociedad" ahora sería
inventar piezas sin saber si una unidad futura las va a necesitar.

## Lo único que sí hace falta ya (no especulativo)

**`cover_sociedad`** — portada de la **materia**, no de esta unidad. Matemáticas tampoco la tenía en su primer
pedido (usó un azul genérico con "½" hasta el pedido 2), pero Sociedad hoy no tiene ni siquiera ese placeholder:
en Inicio, cuando Sociedad deje de verse "Pronto", la estantería de cuadernos necesita una portada fija para la
materia, sin importar cuál unidad se construya primero. Es la única pieza que es claramente reutilizable para
siempre (a diferencia de los mapas/fotos, que son de esta unidad nada más).

| Archivo | Tamaño | Pedido |
|---|---|---|
| `cover_sociedad` | 1536×1024 | Inés y Teo con un plano/mapa extendido sobre una mesa o el suelo, en un ambiente cálido (el jardín de la abuela Elena u otro espacio neutro, no necesariamente el arroyo de esta unidad — la portada representa "investigar el pasado", no un caso concreto). **Zona tranquila a la derecha** (≈35 % del ancho) para el título "Sociedad". Adjuntar `personajes-oficial.png` como referencia. |

## Lo que se deja para después (igual que Matemáticas)

Fondo/canvas para las pantallas de "mapa por capas" y "mesa de fuentes" (no sabemos todavía cómo se van a ver —
eso es SO-06), una 5.ª pose de Teo, marcador de progreso tipo "papalote" para el camino de sesiones de Sociedad
— todo esto se pide cuando existan pantallas reales que revelen qué falta, no antes (misma lección de
`docs/design/subjects/PATRON-MATEMATICAS.md` §1: "Claude no debe inventar cómo se enseña una materia").

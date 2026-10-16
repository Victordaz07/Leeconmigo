# Pedido de imágenes 2 — para que Matemáticas se vea terminada

> **Estado (2026-10-16):** llegaron las 18 (A y B), SHA-256 verificados (`arte/manifest-original-2.json`), sin texto ni
> números. En la app: Mila (5 poses, `assets/math/chars`, 512 px de alto), portadas (`assets/math/covers`) y objetos
> (`assets/math/props`, 256 px). Arreglo: `prop_pastel` traía una mancha gris en el centro; se rellenó con el color del
> glaseado al convertirlo. En uso: portada en Inicio, encabezado de la unidad, papalote en "¡Estás aquí!", Mila guía en
> el Taller y celebra al terminar Taller y lecciones. Guardados para la fase 2: ranita, lápiz, canica, manzana,
> estampa, caja, frasco, canasta, pizza y pastel.

**Contexto:** el primer pedido (`PEDIDO-IMAGENES.md`) ya está en la app. Esto es lo que todavía hace falta para que la
estética quede pareja, ordenado por impacto. Mismas reglas: **sin texto, letras ni números**; los objetos sueltos van en
fondo transparente; nada que el niño pueda confundir con algo que hay que contar.

## Lo que NO necesita imagen (lo dibuja la app, a propósito)

Bloques de decenas y centenas, rectas numéricas, cuadrículas de área, fracciones partidas, agujas y marcas del reloj,
gráficas de barras, ejes de coordenadas, bandejas de 10. Tienen que ser **exactos** (una decena son 10 cubitos, ni 9 ni
11) y cambiar con cada ejercicio; una imagen generada no puede garantizar eso.

## Truco para que todo combine

En cada pedido a GPT **adjunta 2 imágenes que ya aprobamos** (por ejemplo `prop_galleta` y `bg_mate_merienda`) y pide:
"mismo estilo, mismo grosor de contorno, misma luz y paleta que las imágenes adjuntas". Así no cambia el estilo entre
tandas. Usa el bloque de estilo común de `PEDIDO-IMAGENES.md`.

## A — Lo que más se nota (pedir primero)

| Archivo | Tamaño | Para qué | Pedido |
|---|---|---|---|
| `char_mila_saluda`, `char_mila_piensa`, `char_mila_apunta`, `char_mila_celebra` | 1024×1024, transparente | Guía en el Taller y las lecciones | Las 4 poses del primer pedido. **Adjunta una ilustración de Mila** (historia "Mila, Pipo y la noche en que se apagaron las luciérnagas") para que salga igual. |
| `char_mila_animo` | 1024×1024, transparente | Cuando dice "Revisemos…" | Mila con el pulgar arriba y cara tranquila, amable (nunca triste ni regañando). |
| `cover_mate` | 1536×1024 | Portada del cuaderno de Matemáticas en Inicio (hoy es solo azul con "½") | Escena cálida de un taller escolar de matemáticas: mesa con frascos de fichas, bloques de colores y una ventana; **sin números ni símbolos**. Zona tranquila a la derecha. |
| `cover_g3u1` | 1536×1024 | Encabezado de la unidad "Multiplicar con grupos y arreglos" | Un taller comunitario con mesas largas y cajas organizadas en filas, gente al fondo pequeña; el tercio de abajo despejado. |
| `prop_papalote` | 1024×1024, transparente | Marca de "¡Estás aquí!" en el camino de lecciones y en la barra de progreso (Kitewise = papalote) | Un papalote (cometa) de rombo con cola de moños, colores coral y azul de la paleta, inclinado como volando. |
| `prop_saltarin` | 1024×1024, transparente | La ficha que salta en la recta numérica (fase 2) | Una ranita verde redonda y simpática, de perfil, en posición de saltar. Silueta clara a 40 px. |

## B — Para que los ejercicios no se vean todos iguales (fase 2)

Lo que más "infantiliza" es ver siempre las mismas galletas. Con estos objetos la app cambia el contexto del problema
(lápices en cajas, canicas en frascos…) sin cambiar la matemática. Todos **una sola pieza, transparente, 1024×1024**.

| Archivo | Pedido |
|---|---|
| `prop_lapiz` | Un lápiz amarillo corto, horizontal. |
| `prop_canica` | Una canica azul con brillo, vista de frente. |
| `prop_manzana` | Una manzana roja con hoja. |
| `prop_estampa` | Una estampa (sticker) redonda con una estrella, borde blanco. |
| `prop_caja` | Una caja de cartón abierta, vista de frente, vacía. |
| `prop_frasco` | Un frasco de vidrio vacío con tapa a un lado. |
| `prop_canasta` | Una canasta de mimbre vacía, vista de frente. |
| `prop_pizza` | Una pizza **entera, sin cortes**, vista desde arriba, círculo perfecto (la app dibuja las rebanadas iguales encima). |
| `prop_pastel` | Un pastel rectangular **sin cortes**, visto desde arriba (la app dibuja los cortes). |

## C — Después (no urgente)

- Portadas de Ciencia, Sociedad y Arte (`docs/design/kitewise/ART-BRIEF.md`).
- Versiones más sobrias (menos saturadas) de fondos para 5.º–6.º, cuando lleguen esas unidades.
- Fondo de cierre de sesión de Matemáticas, si al probar se siente vacío.

## Cómo entregarlas

Igual que la vez pasada: un ZIP con los PNG y los nombres de arriba. Yo verifico, convierto a WebP, recorto y conecto.
Si alguna no queda bien a 40 px o tiene algo escrito, te la devuelvo con lo que hay que corregir.

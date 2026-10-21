# Pedido de imágenes — Kitewise «núcleo»: Mi cuaderno, Logros, cierre de sesión y guía (para generar con GPT)

> **Estado (2026-10-21): RECIBIDO Y CONECTADO (19 de 19).** `KiteWise_Lotes_K1_K2_K3_19_Imagenes.zip`: revisadas una por una (sin texto, alfa limpio, 7 logros a color, 4 destellos en `star_big`, 3 moños en los papalotes, 7 puntos en `badge_came_back`, 5 banderitas, 7 círculos en `empty_badges`, 4 azules en `cover_a2_u02`). Convertidas con `scripts/kitewise-imagenes.py` (17 del núcleo, 280 KB, manifiesto `arte/manifest-k8.json`) y `scripts/arte-imagenes.py … lote-3` (2 portadas de Arte, 282 KB). Conectadas: estrellas dibujadas en el cierre de Lectura, Ciencia y Sociedad (`ClosingCard` recibe `starImages`), pantalla de **Logros** (7 pegatinas, papalote, álbum vacío), **Mi cuaderno** (hoja con renglones, cuaderno vacío, estrella) y las portadas de las dos unidades de Arte. Guardadas para después: sello del día (`STAMP_IMAGES`) y papalote que celebra (`KITE_IMAGES.cheer`).
> (Pedido original, sin pedir)  Nace de la pregunta de Victor «¿no tenemos más pendientes en lo que genera las imágenes? como la sección de Mi cuaderno».
> Revisión de lo pendiente en todo el proyecto (2026-10-21):
> - **Matemáticas** (44 piezas), **Ciencia** (Tandas 1–4 completas) y **Sociedad** (6 unidades, «todo su arte ya conectado»): sin imágenes pendientes.
> - **Arte y música:** Tanda 2 (17: materiales, adornos, museo) → `docs/design/artes/PEDIDO-IMAGENES.md`; faltan además **2 portadas de unidad** (A2-U02 y A1-U06, hoy un recuadro hecho con código) → incluidas abajo.
> - **Núcleo de Kitewise (esto):** el cierre de sesión (B13), **Mi cuaderno** (B14) y **Logros** (K8) no tienen arte propio. Hoy las estrellas son un `★` de texto; el único dibujo es `docs/design/kitewise/mascot.png` (la estrella con carita, de 80 px: no alcanza para pantalla grande). K8 todavía no está construido: estas imágenes se pueden generar antes.
> **Regla de oro:** las imágenes son adorno. Los textos, números, nombres de logros y la rejilla/espiral del cuaderno los dibuja la app. **Cero texto, letras o números dentro de una imagen.**

Formato: objetos **1024×1024** con **fondo transparente real** (actívalo como parámetro de la herramienta; no dibujes un tablero de ajedrez). Portadas **1536×1024**. Una sola pieza por archivo. Envíalas en un `.zip` con los nombres exactos. Los logros «sin ganar» los pinta la app en gris (no hace falta una imagen aparte).

## Estilo común (ya incluido en cada prompt de abajo)
> Ilustración para app educativa infantil (6–12 años), estilo cartoon suave y brillante con toque de acuarela digital cálida, colores vivos y alegres (coral, naranja, amarillo, turquesa, violeta), contornos redondeados, brillo sutil. Sin texto, sin letras, sin números, sin marcas de agua.

## Lote K-1 — estrellas, sello y guía (7)
| Archivo | Prompt (después del estilo común) | Dónde se usa |
|---|---|---|
| `star_full` | Una estrella amarilla brillante de cinco puntas con carita sonriente (ojos redondos y boca feliz), igual de simpática que una mascota, un brillito en una punta. Objeto único centrado, fondo transparente, margen amplio, sin sombra proyectada. | Cierre de sesión: estrella ganada |
| `star_big` | La misma estrella amarilla sonriente pero más grande y con cuatro destellitos alrededor y las mejillas rosadas; objeto único centrado, fondo transparente, margen amplio. | Cierre: estrella central |
| `star_sleep` | La misma estrella pero de un gris azulado muy claro, sin brillo, con los ojos cerrados y una sonrisa tranquila (dormida). Objeto único centrado, fondo transparente. | Cierre: estrella todavía sin ganar |
| `stamp_daily` | Un sello de goma redondo, como de álbum de recuerdos, con el borde de puntitos y una estrella grande en el centro, tinta coral sobre un círculo de papel crema, con un pequeño desgaste de tinta. Objeto único, fondo transparente. | «Sello del día» |
| `stamp_empty` | El mismo sello pero solo el contorno punteado de un círculo vacío en gris suave, sin estrella. Objeto único, fondo transparente. | Sello de un día sin completar |
| `kite_idle` | Un papalote (cometa) en forma de rombo, alegre, con colores vivos (coral, amarillo y turquesa), cruz de varitas, una cola larga con tres moños de colores, **sin cara**, flotando tranquilo, ligeramente inclinado. Objeto único, fondo transparente, margen amplio. | Guía de Arte (ayuda) y papalote de progreso |
| `kite_cheer` | El mismo papalote subiendo con la cola ondeando hacia arriba y tres chispitas alrededor, **sin cara**, más dinámico. Objeto único, fondo transparente. | Guía al celebrar |

## Lote K-2 — 7 logros (pegatinas redondas) · una pegatina por archivo
Estilo: pegatina redonda con un **borde blanco grueso** (como de álbum), un dibujo simple y legible a 64 px dentro, sin texto. Fondo transparente.
| Archivo | Prompt (después del estilo común) | Qué celebra |
|---|---|---|
| `badge_first_chapter` | Pegatina redonda con un libro abierto de páginas crema y una estrellita encima, fondo del círculo violeta. | Primer capítulo |
| `badge_explorer` | Pegatina redonda con una brújula dorada y una huella de camino punteada, fondo del círculo turquesa. | Explorador (5 historias) |
| `badge_two_languages` | Pegatina redonda con dos globos de diálogo que se superponen, uno coral y uno turquesa, **vacíos** (sin letras), fondo del círculo amarillo. | Dos idiomas |
| `badge_real_15` | Pegatina redonda con un reloj de arena con arena naranja cayendo, fondo del círculo coral. | 15 minutos reales |
| `badge_came_back` | Pegatina redonda con un papalote que regresa volando hacia una casita pequeña y siete puntitos de colores en arco, fondo del círculo azul cielo. | Regresaste por más (7 días distintos) |
| `badge_adventurer` | Pegatina redonda con una mochila de aventurero y cinco banderitas de colores distintos en fila, fondo del círculo verde. | Aventurero (5 categorías) |
| `badge_new_word` | Pegatina redonda con una bombilla encendida con una gema pequeña dentro y rayitas de luz, fondo del círculo rosa. | Nueva palabra dominada |

## Lote K-3 — Mi cuaderno y portadas de las dos unidades de Arte (5)
| Archivo | Prompt (después del estilo común) | Dónde se usa |
|---|---|---|
| `empty_notebook` | Un cuaderno de espiral abierto con las páginas en blanco, un lápiz amarillo apoyado y una estrellita sonriente asomando por un lado, con mucho aire alrededor. Objeto único, fondo transparente. | Mi cuaderno vacío («todavía no guardaste nada») |
| `empty_badges` | Una página de álbum de pegatinas con siete círculos vacíos de contorno punteado, ligeramente inclinada, con una cintita de papel arriba. Objeto único, fondo transparente. | Logros todavía sin ganar |
| `mat_notebook_page` (1024×1024, **opaca**, se repite en 3×3 sin costuras) | Un papel crema muy claro de cuaderno con renglones azul pálido muy tenues, horizontales y parejos, y un margen rosado muy suave a la izquierda; vista de frente, iluminación pareja, sin sombras, sin viñeta, sin agujeros ni espiral, sin objetos. Los renglones deben ser tan suaves que un texto oscuro encima se lea perfecto. | Fondo de página de Mi cuaderno e informe |
| `cover_a2_u02` (1536×1024) | La portada de una unidad de arte sobre colores que se relacionan: una paleta de pintor con cuatro manchas de pintura de la misma familia azul (de oscuro a claro) y un pincel mojado de azul, sobre un fondo suave degradado de azul cielo a crema, con unas pocas salpicaduras. Composición centrada con margen, reconocible en miniatura de 200×140. | Tarjeta de la unidad «Colores que se relacionan» |
| `cover_a1_u06` (1536×1024) | La portada de una unidad de arte sobre historias de recortes: un barquito de papel de colores navegando sobre olas de papel azul, con un sol de papel amarillo y una nube de papel blanca, todo con aspecto de recortes pegados con bordes ligeramente rasgados, sobre un fondo de cielo claro. Composición centrada con margen, reconocible en miniatura de 200×140. | Tarjeta de la unidad «Una historia de recortes» |

## Cómo se conectan (cuando lleguen)
- Convertidas a WebP con `scripts/arte-imagenes.py` ampliado (prefijos `star_`, `stamp_`, `kite_`, `badge_`, `empty_`, `mat_`) y mapeadas en un `art.ts` del núcleo; las portadas de las dos unidades van a `apps/mobile/assets/arte/covers/` y a `ARTE_ART`.
- Aceptación: sin texto incrustado · alfa limpio sobre blanco y oscuro · legible a 64 px (logros y estrellas) y en miniatura 200×140 (portadas) · < 350 KB cada una.
- **K8 (Mi cuaderno, Logros, cierre con estrellas dibujadas)** es trabajo compartido (`docs/ROADMAP.md`): estas imágenes lo desbloquean; no se construye sin que Victor lo pida.

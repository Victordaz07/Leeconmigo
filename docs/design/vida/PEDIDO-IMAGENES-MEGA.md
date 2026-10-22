# Mega pedido de imágenes — «Para la vida» módulos 02–08 (prompts listos para pegar en GPT)

> Estado (2026-10-22): propuesta. 43 imágenes (7 módulos × 6 + 1 banner). Finanzas ya tiene su propio pedido (`docs/design/finanzas/PEDIDO-IMAGENES.md`).
> Las guías (animales) son **propuestas** hasta que Victor las apruebe. Mientras llegan, la app usa arte provisional dibujado en código.

**Regla de oro:** la imagen es **escena**, no contenido. Todo texto, número, mensaje, pantalla y etiqueta lo dibuja la app. Por eso en TODAS las imágenes:
- **Cero texto, letras, números, símbolos ni marcas.** Las pantallas, libretas y carteles salen **en blanco o con formas abstractas**.
- **En los fondos el centro queda despejado** (ahí va el juego).
- **Cada guía es UNA pieza**, fondo transparente, cuerpo entero, que se entienda a 32 px.
- **Sin personas reales ni caras de adultos**: los personajes son animales.
- Nada de peligro, fuego, cuchillos ni objetos afilados a la vista.

## Estilo común (pégalo al inicio de CADA prompt)
> Ilustración 2D plana, alegre y clara para una app educativa infantil (6–12 años). Formas redondeadas, contornos suaves en azul oscuro (#233447), sombras mínimas,
> pocos detalles. Paleta base: crema #FAF5EA, azul #467B9C, coral #D77754, verde #769E72, amarillo #E5B74F, violeta #9A7DAB. Sin texto, sin letras, sin números,
> sin marcas de agua.

Formato: portadas y fondos **1536×1024**; escenas **1536×1024** con **zona tranquila a la derecha (35 % del ancho)**; guías **1024×1024** transparente.
Entrega: un `.zip` con los nombres exactos. Genera primero cada guía y **adjúntala como referencia** en las demás imágenes de ese módulo.

## Banner
| Archivo | Prompt |
|---|---|
| `banner_para_la_vida` | Un estante de madera clara con ocho cuadernos de colores distintos recostados (rosa, celeste, índigo, dorado, verde oliva, terracota, violeta y verde azulado), una planta pequeña y una lámpara. Cuadernos **sin títulos**. Composición horizontal con margen. |

## 02 · Emociones (acento rosa #E0568F · guía: Miel, osito)
| Archivo | Prompt |
|---|---|
| `cover_emociones_cuaderno` | Portada de cuaderno para estantería: un corazón redondeado de cuatro tonos (como una paleta de emociones) sostenido por dos hojas, fondo rosa suave, centrado, margen. Reconocible a 200×140. |
| `bg_emociones_horizontal` | Un rincón calmado de una sala: cojines grandes, una manta, una planta y una ventana con luz tibia. **Centro despejado.** |
| `scene_emociones_1` | Una sala con un juego de mesa desparramado y una tablet boca abajo en el suelo; a un lado un osito sentado en un puf, respirando hondo con los ojos cerrados. Sin personas. |
| `scene_emociones_2` | Un rincón de pausa: cojines, una planta, un reloj de arena (sin números) y una taza humeante; un osito sentado tranquilo mirando por la ventana. |
| `scene_emociones_3` | Una banca bajo un árbol con tres animales amables sentados cerca de un osito pequeño que sostiene una hoja; ambiente cálido, sin texto. |
| `guide_miel_neutral` | Miel, un osito de pelaje miel, de pie, cuerpo entero, mirando al frente con las patitas juntas, bufanda rosa, mejillas rosadas, ojos grandes y tranquilos. Fondo transparente. |

## 03 · Comunicación (acento cian #3BB5D9 · guía: Eco, búho)
| Archivo | Prompt |
|---|---|
| `cover_comunicacion_cuaderno` | Portada: dos globos de diálogo redondeados, uno cian y uno crema, **vacíos**, que se solapan un poco, con una pequeña oreja estilizada; fondo celeste suave, centrado. |
| `bg_comunicacion_horizontal` | Una mesa larga de aula con sillas pequeñas y una cartulina en blanco en la pared; luz de ventana. **Centro despejado.** |
| `scene_comunicacion_1` | Dos animalitos (conejo y zorro) a una mesa compartida con un dibujo a medias entre ellos; el conejo señala un lápiz, el zorro lo mira atento. Sin texto. |
| `scene_comunicacion_2` | Un círculo de cinco animales sentados en alfombra turnándose: uno sostiene una hoja grande (el «turno para hablar») y los demás escuchan. |
| `scene_comunicacion_3` | Dos animales se dan la patita junto a un cartel colaborativo terminado, **hecho de formas y colores sin letras**. Ambiente de acuerdo, cálido. |
| `guide_eco_neutral` | Eco, un búho pequeño de plumas café y crema, de pie, cuerpo entero, ojos grandes y atentos, una oreja-mechón inclinada como escuchando, bufanda celeste. Fondo transparente. |

## 04 · Vida digital e IA (acento índigo #5B6EE1 · guía: Chispa, zorro)
| Archivo | Prompt |
|---|---|
| `cover_digital_cuaderno` | Portada: una tablet redondeada con pantalla **en blanco** y un escudo pequeño al lado, con una chispa; fondo índigo suave, centrado. |
| `bg_digital_horizontal` | Un escritorio de casa con lámpara, una tablet apoyada, audífonos y una planta; pared con bandera de banderines sin letras. **Centro despejado.** |
| `scene_digital_1` | Un escritorio con una tablet cuya pantalla muestra **solo formas abstractas** (círculos y rectángulos de colores); un zorro mira con cara curiosa y una patita en la barbilla. |
| `scene_digital_2` | Una lupa grande sobre una tablet de pantalla en blanco; alrededor, pequeñas estrellitas de «mira con atención»; un zorro detective con sombrero. |
| `scene_digital_3` | Un zorro y un adulto-animal (lobo mayor, amable, sin rostro detallado) sentados juntos mirando una tablet, el zorro señalando. Ambiente de familia, tibio. |
| `guide_chispa_neutral` | Chispa, un zorro joven de pelaje naranja y pecho crema, de pie, cuerpo entero, auriculares colgando al cuello, ojos vivos, cola con punta crema. Fondo transparente. |

## 05 · Pensamiento crítico (acento dorado #B8860B · guía: Lupa, mapache)
| Archivo | Prompt |
|---|---|
| `cover_critico_cuaderno` | Portada: una lupa grande dorada sobre un signo de interrogación **hecho de huellas** (sin letras), fondo crema cálido, centrado. |
| `bg_critico_horizontal` | Un pasillo de escuela con casilleros de colores y una ventana; suelo limpio. **Centro despejado.** |
| `scene_critico_1` | El pasillo con una lonchera caída en el suelo y huellas de patitas pequeñas cerca; un mapache con lupa la observa. Sin texto. |
| `scene_critico_2` | Un tablero de corcho con hilos entre tarjetas **en blanco** y una lupa; un mapache detective con gorra piensa. |
| `scene_critico_3` | Dos caminos de huellas que se separan en un patio, con una lupa en el centro; ambiente de «a ver qué pista sirve». |
| `guide_lupa_neutral` | Lupa, un mapache pequeño con antifaz suave, gorra de detective, bufanda dorada, una lupa en la patita, cuerpo entero, mirada curiosa. Fondo transparente. |

## 06 · Autonomía (acento verde oliva #6AA84F · guía: Paso, tortuga)
| Archivo | Prompt |
|---|---|
| `cover_autonomia_cuaderno` | Portada: una mochila redonda abierta con un lápiz y un cuaderno asomando, y dos zapatos pequeños al lado; fondo verde suave, centrado. |
| `bg_autonomia_horizontal` | Un recibidor de casa con perchero bajo, un banco, una alfombra y un estante de zapatos; luz tibia. **Centro despejado.** |
| `scene_autonomia_1` | Una habitación con una mochila abierta en el suelo y materiales escolares (cuaderno, lápices, regla) ordenados en fila al lado; una tortuga mira la lista imaginaria. |
| `scene_autonomia_2` | Una mesa con un mantel y platos, vasos y servilletas **de plástico redondeado** puestos a medias; una tortuga con delantal pequeño mira qué falta. Sin objetos afilados ni fuego. |
| `scene_autonomia_3` | Un pasillo con zapatos alineados, abrigos en perchas bajas y una mochila lista junto a la puerta; una tortuga sonriente de lado. |
| `guide_paso_neutral` | Paso, una tortuga amable de caparazón verde con dibujo de hexágonos, de pie, cuerpo entero, mochila pequeña, bufanda amarilla, sonrisa tranquila. Fondo transparente. |

## 07 · Organización (acento terracota #D4663A · guía: Ruta, hormiga)
| Archivo | Prompt |
|---|---|
| `cover_organizacion_cuaderno` | Portada: un tablero con tres columnas de tarjetas de colores **en blanco**, una flecha curva y un reloj de arena; fondo terracota suave, centrado. |
| `bg_organizacion_horizontal` | Un escritorio ordenado con un tablero de corcho, notas adhesivas en blanco, un reloj de arena y una lámpara. **Centro despejado.** |
| `scene_organizacion_1` | Una mesa con un proyecto escolar a medias (cartulina, marcadores, libros) y notas adhesivas en blanco pegadas en fila; una hormiga con lista en la patita. |
| `scene_organizacion_2` | Un tablero de tres columnas con tarjetas de colores **sin letras** movidas de una columna a otra, y una hormiga empujando una tarjeta. |
| `scene_organizacion_3` | Un calendario de papel **sin números**, solo cuadros con puntos de colores, y una hormiga caminando sobre una línea de ruta con banderitas. |
| `guide_ruta_neutral` | Ruta, una hormiga amistosa de color terracota, de pie sobre dos patas, cuerpo entero, mochilita de cuero, antenas con puntitas redondas, mirada decidida. Fondo transparente. |

## 08 · Emprendimiento (acento violeta #9C4DCC · guía: Dique, castor)
| Archivo | Prompt |
|---|---|
| `cover_emprendimiento_cuaderno` | Portada: una bombilla redonda con una pequeña llave de tuerca cruzada y una planta brotando; fondo violeta suave, centrado. |
| `bg_emprendimiento_horizontal` | Un taller de proyectos con mesa de trabajo, estantes con cajas y botes, y ventana; luz de tarde. **Centro despejado.** |
| `scene_emprendimiento_1` | Un patio de escuela con una caja de «objetos perdidos» desbordada y un banco; un castor la observa pensando. Sin texto. |
| `scene_emprendimiento_2` | Una mesa de taller con cartón, cinta y tijeras **de punta redonda**, y un prototipo a medias; un castor con delantal y herramientas de papel. |
| `scene_emprendimiento_3` | Un puesto comunitario con mesa, toldo suave y letreros **vacíos**; tres animales conversan sobre una idea terminada. |
| `guide_dique_neutral` | Dique, un castor joven de pelaje café, dientes pequeños, cola plana, casco de obra pequeño, cuerpo entero, sonrisa entusiasta. Fondo transparente. |

## Notas para Claude (al recibirlas)
Convertir a WebP, manifiesto SHA-256 en `docs/design/vida/arte/`, mapa en `apps/mobile/src/subjects/vida/art.ts`, portadas en `homeCard.image` de cada módulo.

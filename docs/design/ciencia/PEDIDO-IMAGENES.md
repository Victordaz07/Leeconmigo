# Pedido de imágenes — Ciencia (prompts listos para pegar en GPT)

> **Estado (2026-10-16): la Tanda 1 llegó completa (18 de 18) y está en la app.** Revisadas: sin texto ni números, instrumentos
> sin marcas, centro despejado en los fondos, objetos y poses con fondo transparente limpio, Maya igual en las 5 poses.
> Convertidas a WebP en `apps/mobile/assets/ciencia/` (1,4 MB en total; la más pesada, la escena de la ladera, 306 KB) con
> `scripts/ciencia-arte.py`; conectadas en `apps/mobile/src/subjects/ciencia/art.ts`; manifiesto con el SHA-256 de los
> originales en `arte/manifest-tanda-1.json` (los PNG no se guardan en el repo).
> **Maya (referencia aprobada de la historia):** piel oscura, cabello trenzado con cuentas de colores y coleta con
> scrunchie lila, camisa de rayas crema y lila, overol de mezclilla azul y tenis morados. Esa es la descripción de
> referencia; la de «rizos y overol salvia» queda descartada.
> **Estilo:** salió como ilustración de cuento (acuarela digital, más detalle y sombreado), no «plana» como Matemáticas. Es
> lo que pedía el brief de arte (`ART-BRIEF.md`: «storybook cálido, acuarela digital») y combina con las portadas de
> Lectura; en Inicio se ve bien junto a las de Lectura y Matemáticas. Los cajones en verde salvia vienen de la guía.
> **Tanda 2 pedida (2026-10-16):** las otras cinco unidades piloto, 41 imágenes en 5 lotes (A–E, abajo) — **recibida completa**.
> **Tanda 3 pedida y recibida completa (2026-10-17):** cinco unidades más, una por grado (C1-U03, C2-U01, C3-U05, C4-U02, C6-U05), 28 imágenes en 5 lotes (F–J, abajo), convertidas y conectadas (`manifest-tanda-3f…3j.json`).

**Para quién:** Victor genera las imágenes y las sube al chat; Claude las convierte a WebP, las nombra y las conecta
(igual que en Matemáticas). **No hace falta pedir todo:** la **Tanda 1** alcanza para construir la primera unidad
(C4-U06). Las demás tandas se piden cuando esa unidad esté probada.

**Regla de oro (la misma de Matemáticas):** la imagen es **escena**, no ciencia. Las mediciones, escalas, números,
flechas causales, diagramas y etiquetas los dibuja la app con código. Por eso en **todas** las imágenes:

- **Cero texto, letras, números ni marcas de escala.** Los termómetros, balanzas, reglas y vasos medidores van
  **sin números ni rayitas** (la app las dibuja encima).
- **En los fondos, el centro queda despejado** (ahí va el laboratorio). Nada que se pueda confundir con algo que el niño
  deba medir o contar.
- **Cada objeto suelto es UNA sola pieza**, fondo transparente, centrada, que se entienda a 32 px.

## Estilo común (pégalo al inicio de CADA prompt)

> Ilustración 2D plana, alegre y clara para una app educativa infantil (6–12 años). Formas redondeadas, contornos suaves
> en azul oscuro (#233447), sombras mínimas, pocos detalles. Paleta: crema #FAF5EA, azul #467B9C, coral #D77754, verde
> #769E72, amarillo #E5B74F, violeta #9A7DAB. Sin texto, sin letras, sin números, sin marcas de agua.

(Es la misma paleta y estilo del arte de Matemáticas, para que la app se vea una sola. Ciencia se identifica en la
interfaz con su verde `#22a95c`, no en la ilustración.)

**Guía de Ciencia — Maya:** para sus poses, **adjunta la imagen de referencia**
`apps/reader/public/stories/la-isla-que-caminaba/cover.webp` (y `page-01.webp` si hace falta). Si GPT no la mantiene
igual, dímelo y la dejamos sin guía (ver DC-4).

Formato: fondos **1536×1024** (horizontal) y **1024×1536** (vertical); objetos **1024×1024** transparente; poses
**1024×1024** transparente, cuerpo entero. Envíalos en un `.zip` con los nombres exactos de la primera columna.

---

## Tanda 1 — para la unidad C4-U06 «Superficies y mapas» (la ladera después de la lluvia)

### Fondos (2 tamaños cada uno)

| Archivo (`_horizontal` y `_vertical`) | Prompt (después del estilo común) |
|---|---|
| `bg_ciencia_laboratorio` | Una mesa de trabajo de ciencias, de madera clara, vista de frente, con una ventana grande de luz suave y estantes con frascos **sin etiquetas** solo en los bordes laterales. **El centro y la parte de abajo quedan despejados** (superficie lisa) porque ahí la app dibuja el laboratorio. Colores suaves, poco contraste. |
| `bg_ciencia_humedal` | Un humedal de costa al amanecer: agua tranquila, juncos y pasto en los bordes, cielo claro arriba. **El centro es una explanada lisa de tierra clara o agua en calma**, sin nada que contar. Ambiente suave, luz cálida. |
| `scene_ciencia_ladera` | **Escena narrativa** (aquí sí puede haber detalle): una ladera de tierra después de una lluvia, con un surco de agua que bajó por la tierra y dejó un abanico de tierra mojada al pie; pasto en un lado de la ladera y tierra descubierta en el otro. Sin personas, sin carteles, sin texto. Composición con una **zona tranquila a la derecha** (35 % del ancho). Solo horizontal. |

### Portada del cuaderno

| Archivo | Prompt |
|---|---|
| `cover_ciencia_cuaderno` (1536×1024) | La portada del cuaderno de Ciencia para una estantería: una lupa grande, una hoja de planta y una gota de agua sobre un fondo verde suave, composición centrada y simple, con margen alrededor. **Sin ningún texto.** Reconocible en miniatura de 200×140. |
| `cover_c4_u06` (1536×1024) | La ladera de la escena anterior vista de lejos, simplificada, con gotas de lluvia y un arroyito de agua marrón; encuadre centrado, margen alrededor. Sin texto. Reconocible en miniatura de 200×140. |

### Objetos sueltos (1024×1024, transparente, una sola pieza)

| Archivo | Prompt |
|---|---|
| `prop_bandeja` | Una bandeja rectangular de plástico, poco profunda, vacía, vista desde un poco arriba, con un lado inclinado hacia un borde con pico para que salga el agua. |
| `prop_tierra` | Un montículo de tierra marrón húmeda, una sola pieza, vista de frente. |
| `prop_cobertura` | Un tapete de pasto verde recortado (rectángulo con bordes irregulares), visto desde arriba. |
| `prop_regadera` | Una regadera azul con rociador, vista de lado, vacía. |
| `prop_vaso_sedimento` | Un vaso transparente de plástico con un poco de agua marrón turbia al fondo, **sin rayitas ni números**. |
| `prop_piedritas` | Tres piedritas redondas de colores tierra (una sola imagen con las tres juntas). |

### Poses de Maya (con la imagen de referencia adjunta; transparente, cuerpo entero)

| Archivo | Prompt |
|---|---|
| `char_maya_saluda` | Maya de pie, saludando con la mano, sonriendo. |
| `char_maya_piensa` | Maya con un dedo en la barbilla, mirando hacia arriba, pensando. |
| `char_maya_investiga` | Maya agachada, mirando algo en el suelo con una lupa. |
| `char_maya_apunta` | Maya señalando hacia un lado, amable, como mostrando algo. |
| `char_maya_celebra` | Maya con los brazos arriba, contenta (sin confeti). |

Se usan chicas, en una esquina; en Modo Enfoque no aparecen.

---

## Tanda 2 — las otras cinco unidades piloto (41 imágenes, 5 lotes)

**Cómo pedirla (igual que la Tanda 1):** un chat por lote. **Adjunta en cada chat 3 imágenes ya aprobadas** como referencia de
estilo: `prop_bandeja`, `prop_regadera` y `scene_ciencia_ladera` (y, para escenas con Maya, `char_maya_saluda`). Pega primero el
**estilo común de la Tanda 2** y luego un prompt por imagen. Si una imagen sale con texto, números o marcas de escala, repítela.
Envíame cada lote en un `.zip` con los **nombres exactos** de la primera columna (PNG). Yo los convierto con
`python3 -I scripts/ciencia-arte.py <carpeta> tanda-2` (props y poses se recortan a su silueta; los PNG no se guardan).

**Estilo común de la Tanda 2 (pégalo al inicio de CADA prompt).** Es el que de verdad salió en la Tanda 1: cuento ilustrado, no plano.

> Ilustración de libro de cuentos en acuarela digital, cálida y clara, para una app educativa infantil (6–12 años). Formas
> redondeadas, contornos finos y suaves, sombreado suave, detalle moderado, colores naturales y amables. Misma mano, paleta y
> acabado que las imágenes de referencia adjuntas. **Sin texto, sin letras, sin números, sin marcas de escala, sin marcas de
> agua, sin logotipos.**

**Medidas:** portadas y escenas **1536×1024** (horizontal). Objetos **1024×1024, fondo transparente**, UNA sola pieza centrada,
legible a 32 px. Una escena lleva una **zona tranquila a la derecha (35 % del ancho)** sin detalles (ahí va el texto de la app).
Las portadas se leen en miniatura de 200×140: un solo motivo simple, con margen alrededor.

**Reglas que valen para todo (la imagen es ESCENA, no ciencia):** los números, escalas, flechas, haces de luz, gráficas y
etiquetas los dibuja la app. Los instrumentos van con la pantalla o el cuerpo **en blanco** (sin rayitas ni dígitos). Nada de
personas reales ni caras de niños en las escenas (Maya solo aparece en sus poses). Nada que invite a una práctica insegura.

### Lote A — C1-U02 «Ver en la oscuridad» (1.º) · 7 imágenes
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c1_u02` | Una linterna LED encendida iluminando, en la penumbra, la silueta de un osito de peluche; composición centrada y simple con mucho margen. Reconocible en miniatura. |
| `scene_c1_u02` | Un cuarto infantil al atardecer, con poca luz suave que entra por la ventana: sobre una mesa baja hay una caja de cartón abierta por el frente y una linterna a su lado. Sin personas, sin carteles. **Zona tranquila a la derecha.** |
| `prop_caja_observacion` | Una caja de cartón mediana abierta por el frente, vista de frente, con el **interior liso, vacío y de un beige medio uniforme** (no negro: la app lo oscurece). Una sola pieza. |
| `prop_linterna` | Una linterna LED de plástico amarillo, apagada, vista de lado, con el cristal frontal limpio. Sin rayo de luz. |
| `prop_objeto_osito` | Un osito de peluche marrón, sentado, mirando al frente, con contorno claro y forma muy reconocible. |
| `prop_objeto_pelota` | Una pelota de goma de rayas rojas y blancas, vista de frente, con contorno claro. |
| `prop_objeto_taza` | Una taza de cerámica azul con asa, vista de lado, vacía, con contorno claro. |

### Lote B — C2-U02 «Un techo para el muñeco» (2.º) · 9 imágenes
Las **cuatro piezas de material** (`papel`, `tela`, `plástico`, `cartón`) son **cuadradas e IGUALES en tamaño**, una por archivo: la prueba
justa depende de que midan lo mismo.
| Archivo | Prompt |
|---|---|
| `cover_c2_u02` | Un muñeco de madera pequeño bajo un techo de papel con gotas de lluvia cayendo alrededor; composición centrada, mucho margen. |
| `scene_c2_u02` | Un porche de madera con un muñeco de madera sentado bajo la lluvia suave, gotas y charquitos, luz gris cálida. Sin personas. **Zona tranquila a la derecha.** |
| `prop_muneco` | Un muñeco de madera pequeño, de pie, con cara sencilla y sonriente, de frente. |
| `prop_papel_absorbente` | Una hoja cuadrada de papel absorbente blanco con textura de relieve suave, vista desde arriba, esquinas rectas. |
| `prop_tela` | Un cuadrado de tela de algodón azul claro con trama visible, mismo tamaño y forma que un cuadrado perfecto, visto desde arriba. |
| `prop_plastico` | Un cuadrado de plástico transparente tipo bolsa, con brillo suave, mismo tamaño y forma que un cuadrado perfecto, visto desde arriba. |
| `prop_carton` | Un cuadrado de cartón corrugado marrón claro, mismo tamaño y forma que un cuadrado perfecto, visto desde arriba. |
| `prop_bandeja_agua` | Una bandeja rectangular de plástico, poco profunda, con un lado inclinado y un poco de agua clara en el fondo, sin rayitas. |
| `prop_vaso_agua` | Un vaso transparente de plástico con agua clara a la mitad, **sin rayitas ni números** (se usa también en C5 y C6). |

### Lote C — C6-U04 «Energía térmica» (6.º) · 8 imágenes
Para 6.º el tono es un poco más sobrio (menos «de cuento infantil»), pero la misma mano y paleta.
| Archivo | Prompt |
|---|---|
| `cover_c6_u04` | Un vaso con agua fría dentro de una funda aislante, con un sol suave detrás; composición centrada, mucho margen. |
| `scene_c6_u04` | Un alféizar soleado con un vaso de agua fría sobre un platito, luz cálida de la tarde, cortina clara. Sin personas. **Zona tranquila a la derecha.** |
| `prop_vaso_frio` | Un vaso transparente con agua fría y **gotitas de condensación por fuera**, sin rayitas ni números. |
| `prop_funda_aislante` | Una funda aislante cilíndrica de neopreno gris azulado para un vaso, abierta por arriba, vista de lado. |
| `prop_termometro` | Un termómetro digital de sonda con la **pantalla en blanco** (sin dígitos) y la punta metálica, de lado. |
| `prop_capa_fieltro` | Un cuadrado de fieltro de lana gris claro, de grosor visible, visto de un poco arriba. Una pieza. |
| `prop_capa_espuma` | Un cuadrado de espuma blanda amarilla con poros visibles, de grosor visible, visto de un poco arriba. Una pieza. |
| `prop_capa_aluminio` | Un cuadrado de lámina de aluminio arrugada y brillante, visto de un poco arriba. Una pieza. |

### Lote D — C3-U06 «Interacciones sin tocar» (3.º) · 9 imágenes
**Seguridad:** un imán **GRANDE** en herradura (nunca pequeño ni de neodimio, nunca una bola ni piezas pequeñas sueltas).
| Archivo | Prompt |
|---|---|
| `cover_c3_u06` | Un imán grande en herradura, rojo con puntas plateadas, acercándose a un clavo grande sin tocarlo; composición centrada, mucho margen. |
| `scene_c3_u06` | Una mesa de taller infantil de madera con un imán grande en herradura a un lado y varios objetos pequeños dispersos; luz de ventana. Sin personas. **Zona tranquila a la derecha.** |
| `prop_iman_grande` | Un imán grande en herradura, rojo con las puntas plateadas, de frente, **sin letras ni marcas de polos**. |
| `prop_clavo` | Un clavo grande de acero, de lado, con cabeza visible. |
| `prop_llave` | Una llave de acero plateada de casa, de frente. |
| `prop_bloque_plastico` | Un bloque de construcción de plástico verde, de frente. |
| `prop_bola_aluminio` | Una bolita grande de papel de aluminio arrugado, de frente. |
| `prop_globo` | Un globo inflado de color lila, con su nudo, de frente. |
| `prop_papelitos` | Un montoncito de papelitos de colores recortados, ligeros, vistos desde arriba. |

### Lote E — C5-U02 «Cantidad y propiedades» (5.º) · 8 imágenes
**Seguridad:** nada que parezca comida para probar; los polvos son MUESTRAS en platitos, no golosinas.
| Archivo | Prompt |
|---|---|
| `cover_c5_u02` | Un frasco con tapa cerrado sobre una balanza, con sal disolviéndose en el agua del frasco; composición centrada, mucho margen. |
| `scene_c5_u02` | Una mesa de laboratorio escolar clara con una balanza, un frasco cerrado y cuatro platitos con muestras; luz de ventana. Sin personas. **Zona tranquila a la derecha.** |
| `prop_frasco_cerrado` | Un frasco de vidrio transparente con tapa de rosca cerrado, con agua clara dentro, **sin rayitas ni números**. |
| `prop_balanza` | Una balanza digital de cocina cuadrada con la **pantalla en blanco** (sin dígitos) y el plato vacío, vista de un poco arriba. |
| `prop_muestra_sal` | Un platito blanco con un montoncito de sal gruesa de cristales blancos pequeños. |
| `prop_muestra_azucar` | Un platito blanco con un montoncito de azúcar de cristales finos y brillantes. |
| `prop_muestra_arena` | Un platito blanco con un montoncito de arena fina color beige. |
| `prop_muestra_harina` | Un platito blanco con un montoncito de harina blanca, polvo muy fino y suave. |

**Compartido:** `prop_vaso_agua` (Lote B) lo usan también C5 y C6: se pide una sola vez.

**Orden de uso en la app (lo que decide cuándo hace falta cada lote):** A → B → C → D → E (de menos a más trabajo nuevo, §6
de la especificación). Mientras llegan las imágenes yo sigo con el contenido y las pantallas; con **solo el Lote A** ya puedo
dejar jugable C1-U02.

## Tanda 3 — cinco unidades más, una por grado (28 imágenes, 5 lotes: F–J)

**Cómo pedirla:** igual que la Tanda 2 — un chat por lote, el **estilo común de la Tanda 2** al inicio de cada prompt, y adjuntas como
referencia de estilo **3 imágenes ya aprobadas** (`prop_bandeja`, `prop_regadera`, `scene_ciencia_ladera`; para el lote J agrega
`scene_c6_u04`). Mismas medidas y reglas (cero texto ni números; instrumentos y pantallas en blanco; escenas con zona tranquila
a la derecha; objetos sueltos de UNA pieza con fondo transparente). Cada lote en un `.zip` con los **nombres exactos** (PNG); yo los
convierto con `python3 -I scripts/ciencia-arte.py <carpeta> tanda-3<letra>` (ej.: `tanda-3f`).

**Ahorro:** estas cinco unidades reutilizan casi todo lo que ya existe (linterna, osito, pelota, taza, tela, cartón, plástico,
papel absorbente, vaso de agua, Maya…). Solo se piden piezas nuevas. `prop_bloque_madera` (lote G) lo comparte el lote I.

**Orden sugerido (de menos a más trabajo nuevo):** I (3) → H (4) → F (6) → G (6) → J (9). Con solo el lote I o H ya puedo abrir
una unidad; los demás no bloquean a los anteriores.

### Lote F — C1-U03 «Caminos de luz» (1.º) · 6 imágenes
*Qué hace el niño:* apunta una linterna a una pared lisa, pone delante un marco con distintos materiales y mira cuánta luz pasa
(la luz y la sombra las dibuja la app). Materiales: lámina transparente, papel de calco, cartulina, papel de aluminio.
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c1_u03` | Una linterna apuntando a un marco cuadrado de cartón con una lámina transparente, delante de una pared lisa clara; sin rayo de luz dibujado. Composición centrada y simple con mucho margen. Reconocible en miniatura. |
| `scene_c1_u03` | Un cuarto de juegos tranquilo, con una mesa baja y una pared lisa y clara al fondo; sobre la mesa, una linterna y cuatro marcos de cartón de pie, de distinto material. Luz suave de ventana. Sin personas, sin carteles. **Zona tranquila a la derecha.** |
| `prop_marco_transparente` | Un marco cuadrado de cartón verde salvia, de pie sobre una base pequeña, con una lámina de plástico **completamente transparente** y limpia (se nota solo por sus bordes y un leve reflejo). De frente. |
| `prop_marco_calco` | El mismo marco cuadrado de cartón verde salvia, de pie, con una hoja de **papel de calco lechoso y translúcido** (blanco apagado, sin dibujos). De frente. |
| `prop_marco_cartulina` | El mismo marco de cartón verde salvia, de pie, con una **cartulina opaca de color naranja** lisa. De frente. |
| `prop_marco_aluminio` | El mismo marco de cartón verde salvia, de pie, con una hoja de **papel de aluminio liso y brillante**, de frente. |

### Lote G — C2-U01 «Detectives de materiales» (2.º) · 6 imágenes
*Qué hace el niño:* observa objetos con una lupa y los agrupa en bandejas según lo que se ve y se siente (duro/blando, liso/rugoso,
de qué está hecho). Objetos: cuchara de metal, bloque de madera, esponja (nuevos) + pelota de goma, taza de cerámica, tela, plástico (ya hechos).
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c2_u01` | Una lupa grande sobre una mesa mirando un grupito de objetos distintos: una cuchara de metal, un bloque de madera y una esponja; composición centrada y simple con mucho margen. |
| `scene_c2_u01` | Una mesa de observación de un salón de clase, de madera clara, con tres bandejas lisas **vacías** y unas cajitas abiertas a los lados; luz suave de ventana. Sin personas, sin carteles. **Zona tranquila a la derecha.** |
| `prop_lupa` | Una lupa grande con mango de madera y aro plateado, con el **cristal transparente y limpio**, de frente. |
| `prop_bloque_madera` | Un bloque rectangular de madera clara con veta suave, visto en tres cuartos, sin marcas ni letras. (Lo comparte el lote I.) |
| `prop_esponja` | Una esponja de cocina amarilla rectangular con poros visibles, vista en tres cuartos, sin capa verde ni marcas. |
| `prop_cuchara_metal` | Una cuchara grande de metal plateado brillante, de lado, sin grabados. |

### Lote H — C3-U05 «Fuerzas y movimiento» (3.º) · 4 imágenes
*Qué hace el niño:* empuja un carrito con empujones más fuertes o más suaves, de frente o de lado, y mira cómo cambia su movimiento;
luego observa el patrón de un péndulo para predecir dónde estará. (Flechas de fuerza, marcas y trayectos los dibuja la app.)
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c3_u05` | Un carrito de juguete rojo rodando hacia la derecha sobre un piso liso, con una pelota quieta atrás; sin personas, sin flechas. Composición centrada y simple con mucho margen. |
| `scene_c3_u05` | Un patio de juegos tranquilo: piso liso de cemento claro en primer plano y, al fondo a un lado, un columpio de madera vacío; luz de la mañana. Sin personas, sin carteles. **Zona tranquila a la derecha.** |
| `prop_carrito` | Un carrito de juguete rojo de cuatro ruedas, tipo vagoneta, **vacío**, visto de lado, con contorno claro. |
| `prop_pendulo` | Una bola de madera azul colgada de un hilo fino desde una barra pequeña de soporte arriba, **quieta** (colgando recta), vista de frente, una sola pieza. |

### Lote I — C4-U02 «Energía en movimiento» (4.º) · 3 imágenes
*Qué hace el niño:* suelta una bola desde distintas alturas de una rampa y mide cuánto empuja un bloque (la bola es la misma: se
reutiliza `prop_objeto_pelota`; el bloque es `prop_bloque_madera` del lote G; alturas y distancias las dibuja la app).
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c4_u02` | Una bola que baja rodando por una rampa de madera y empuja un bloque de madera al final; composición centrada y simple con mucho margen. Reconocible en miniatura. |
| `scene_c4_u02` | Una mesa larga y despejada de un laboratorio escolar, de madera clara, con una ventana grande de luz suave; **el centro de la mesa queda libre**. Sin personas, sin carteles. **Zona tranquila a la derecha.** |
| `prop_rampa` | Una rampa de madera lisa e inclinada, vista de lado, con un pequeño tope en la parte alta y **sin marcas, rayas ni números**. Una sola pieza. |

### Lote J — C6-U05 «Agua en movimiento» (6.º) · 9 imágenes
*Qué hace el estudiante:* arma un modelo del ciclo del agua eligiendo las piezas (sol, mar, nube, montaña, río, árbol, suelo) y
conectándolas con flechas que dibuja la app; después revisa qué impulsa cada paso (el Sol y la gravedad).
| Archivo | Prompt (después del estilo común) |
|---|---|
| `cover_c6_u05` | Un paisaje simple: el mar a la izquierda, una montaña con la cima nevada a la derecha, una nube y el sol arriba; sin flechas. Composición centrada con mucho margen. Reconocible en miniatura. |
| `scene_c6_u05` | Un paisaje amplio de costa y montañas: un río baja de la montaña al mar, nubes ligeras y bosque en las laderas; luz cálida de la mañana. Sin personas, sin carteles, sin flechas. **Zona tranquila a la derecha.** |
| `prop_sol` | Un sol amarillo y simple con rayos cortos, **sin cara**, de frente. |
| `prop_nube` | Una nube gris azulada y redondeada de lluvia ligera, **sin gotas dibujadas**, de frente. |
| `prop_mar` | Un trozo cuadrado de océano en corte, con olas suaves y un borde de arena, visto de frente. |
| `prop_montana` | Una montaña con la cima nevada y laderas verdes, vista de frente. |
| `prop_rio` | Un tramo de río serpenteante con orillas verdes, visto desde arriba, recortado como una sola pieza. |
| `prop_arbol` | Un árbol frondoso de hojas verdes, con tronco marrón, de frente. |
| `prop_suelo_corte` | Un corte de suelo visto de lado: pasto arriba, capas de tierra y arena debajo y una zona más oscura y húmeda abajo; **sin etiquetas ni flechas**. |

## Aceptación (la reviso yo al recibirlas)

Sin texto ni números en ninguna imagen · instrumentos sin marcas · centro despejado en los fondos · objetos de una sola
pieza y fondo transparente · Maya igual a su referencia · legible en miniatura de 200×140 · peso razonable (se convierten
a WebP: fondos ≈ 25–55 KB, objetos ≈ 10–20 KB).

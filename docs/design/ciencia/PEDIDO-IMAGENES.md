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
> Falta: Tanda 2 (las otras cinco unidades piloto).

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

## Tanda 2 — las otras cinco unidades piloto (pedir después)

Las portadas (`cover_c1_u02`, `cover_c2_u02`, `cover_c3_u06`, `cover_c5_u02`, `cover_c6_u04`) son 1536×1024, un solo
motivo simple, **sin texto**, legibles a 200×140. Objetos (1024×1024 transparente, una pieza). Los instrumentos van **sin
números ni marcas**.

| Unidad | Portada (motivo) | Objetos |
|---|---|---|
| C1-U02 Ver en la oscuridad | Una linterna encendida iluminando una silueta pequeña en la oscuridad | `prop_caja_observacion` (caja de cartón abierta por un lado, vista de frente) · `prop_linterna` (linterna LED, apagada) · `prop_objeto_silueta` (un objeto simple y reconocible, p. ej. un osito) |
| C2-U02 Un techo para el muñeco | Un muñeco de madera bajo un techo de papel con gotas de lluvia | `prop_muneco` · `prop_papel_absorbente` · `prop_tela` · `prop_plastico` (cuatro piezas **cuadradas iguales**, una por archivo) · `prop_bandeja_agua` |
| C3-U06 Interacciones sin tocar | Un imán grande en herradura acercándose a un clavo, sin tocarlo | `prop_iman_grande` (en herradura, **grande**, nunca pequeño ni de neodimio) · `prop_clavo` · `prop_bloque_plastico` · `prop_regla_lisa` (regla **sin marcas ni números**) |
| C5-U02 Cantidad y propiedades | Un frasco cerrado con sal disolviéndose en agua, sobre una balanza | `prop_frasco_cerrado` · `prop_sal` (montoncito en un platito) · `prop_vaso_agua` (sin marcas) · `prop_balanza` (con la pantalla **en blanco**) |
| C6-U04 Energía térmica | Un vaso con agua fría dentro de una funda aislante, con un sol suave detrás | `prop_funda_aislante` · `prop_vaso_frio` (con gotitas de condensación) · `prop_termometro` (**sin escala ni números**) |

Fondos de Tanda 2: se reutilizan `bg_ciencia_laboratorio` y `bg_ciencia_humedal`. Si una unidad pide otro ambiente, se
pide aparte.

## Aceptación (la reviso yo al recibirlas)

Sin texto ni números en ninguna imagen · instrumentos sin marcas · centro despejado en los fondos · objetos de una sola
pieza y fondo transparente · Maya igual a su referencia · legible en miniatura de 200×140 · peso razonable (se convierten
a WebP: fondos ≈ 25–55 KB, objetos ≈ 10–20 KB).

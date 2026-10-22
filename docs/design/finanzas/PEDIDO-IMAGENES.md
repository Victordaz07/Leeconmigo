# Pedido de imágenes — Finanzas (prompts listos para pegar en GPT)

> **Estado (2026-10-22): Tanda 1 pedida** — 18 imágenes en 2 lotes (A y B) para la unidad piloto **F4-U01 «Un evento que resiste cambios»** (4.º).
> Mientras llegan, la app se construye con arte provisional dibujado en código (fichas de UM, sobres, libro, tarjetas, buzón).

**Para quién:** Victor genera las imágenes y las sube al chat en un `.zip` con los nombres exactos; Claude las convierte a WebP, las nombra y las conecta
(`apps/mobile/assets/finanzas/`, `subjects/finanzas/art.ts`, manifiesto con SHA-256 en `docs/design/finanzas/arte/`).

**Regla de oro (la de Matemáticas y Ciencia):** la imagen es **escena**, no finanzas. Las UM (fichas y billetes), los precios, los sobres, el libro de
movimientos, los mensajes del buzón y todo número o etiqueta los dibuja la app con código. Por eso en **todas** las imágenes:
- **Cero texto, letras, números, símbolos de moneda ni marcas.** Nada que parezca dinero real (sin $, €, caras de billetes) y sin logotipos.
- **En los fondos, el centro queda despejado** (ahí va el juego).
- **Cada objeto suelto es UNA sola pieza**, fondo transparente, centrada, que se entienda a 32 px.
- **Sin personas reales ni caras de adultos**; la guía es un animal (la ardilla Nuez, DF-9, propuesta).

## Estilo común (pégalo al inicio de CADA prompt)
> Ilustración 2D plana, alegre y clara para una app educativa infantil (6–12 años). Formas redondeadas, contornos suaves en azul oscuro (#233447), sombras
> mínimas, pocos detalles. Paleta: crema #FAF5EA, azul #467B9C, coral #D77754, verde #769E72, amarillo #E5B74F, violeta #9A7DAB. Sin texto, sin letras, sin números,
> sin símbolos de moneda, sin marcas de agua.

Formato: fondos **1536×1024** (horizontal) y **1024×1536** (vertical); portadas **1536×1024**; objetos y poses **1024×1024** transparente.

## Lote A — fondos, portadas y la guía (10)
| Archivo | Prompt (después del estilo común) |
|---|---|
| `bg_finanzas_mesa_horizontal` / `_vertical` | Una mesa de madera clara vista de frente, como el mostrador de un puesto de feria de barrio, con un toldo a rayas suaves arriba y cajas de madera vacías a los lados. **El centro y la parte de abajo quedan despejados** (superficie lisa) porque ahí la app dibuja los sobres y las fichas. Luz cálida y suave. |
| `scene_finanzas_evento` (solo horizontal) | **Escena narrativa**: el patio de una escuela de barrio preparado para un evento, con mesas largas, sillas, una guirnalda de banderines de colores sin letras y un toldo plegado a un lado; cielo con algunas nubes. **Sin personas.** Composición con una **zona tranquila a la derecha** (35 % del ancho). |
| `cover_finanzas_cuaderno` | La portada del cuaderno de Finanzas para una estantería: un frasco de vidrio con monedas **lisas, sin números ni símbolos**, junto a tres sobres de colores y una pequeña planta que brota; fondo amarillo suave, composición centrada y simple, con margen alrededor. **Sin ningún texto.** Reconocible en miniatura de 200×140. |
| `cover_f4_u01` | El patio del evento de la escena anterior, visto de lejos y simplificado, con una guirnalda y un toldo; encuadre centrado, margen alrededor. Sin texto. Reconocible en miniatura de 200×140. |
| `guide_nuez_neutral` | Nuez, una ardilla amable de pie, cuerpo entero, mirando al frente con las patitas juntas; pelaje café claro, cola grande y esponjosa, bufanda verde, mejillas rosadas. Ojos grandes y tranquilos. Fondo transparente. |
| `guide_nuez_pensando` | La misma ardilla Nuez (mismo diseño exacto), una patita en la barbilla, mirando hacia arriba y a un lado, expresión curiosa. Fondo transparente. |
| `guide_nuez_contenta` | La misma ardilla Nuez, sonriendo con los ojos cerrados, patitas arriba celebrando. Fondo transparente. |
| `guide_nuez_sorpresa` | La misma ardilla Nuez, ojos muy abiertos, una patita en la mejilla, un poco sorprendida pero **no asustada** (ha aparecido un imprevisto). Fondo transparente. |
| `guide_nuez_ayuda` | La misma ardilla Nuez, sentada, ofreciendo una patita abierta hacia adelante como invitando a pedir ayuda, expresión cálida. Fondo transparente. |

(Para que Nuez salga igual en las 5 poses: genera primero `guide_nuez_neutral`, y en los siguientes prompts **adjunta esa imagen aprobada** como referencia.)

## Lote B — objetos sueltos (8; 1024×1024, transparente, una sola pieza)
| Archivo | Prompt |
|---|---|
| `prop_sobre` | Un sobre de papel cerrado, color crema, con una solapa triangular y una lengüeta pequeña, vista de frente, **sin nada escrito**. |
| `prop_libreta` | Una libreta de registro abierta, vista desde un poco arriba, con páginas **en blanco** con renglones suaves (sin números ni letras) y un lápiz al lado. |
| `prop_toldo` | Un toldo de tela a rayas azul y crema, plegado a medias, para proteger de la lluvia, una sola pieza. |
| `prop_guirnalda` | Una guirnalda de banderines de papel de varios colores, **sin letras**, colgando en una curva suave. |
| `prop_taller_pintura` | Un caballete pequeño con un lienzo en blanco y dos botes de pintura, una sola pieza, sin texto. |
| `prop_taller_musica` | Un tambor pequeño y unas maracas juntos, una sola pieza, sin texto. |
| `prop_taller_ceramica` | Una vasija de barro a medio hacer sobre un torno pequeño, una sola pieza. |
| `prop_buzon` | Un buzón de correo de barrio, metálico, color azul, con la tapa cerrada y la banderita abajo, **sin letras**. |

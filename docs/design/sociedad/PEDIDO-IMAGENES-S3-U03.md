# Pedido de imágenes — Sociedad, unidad piloto S3-U03 (para generar con GPT)

**Para quién:** Victor genera las imágenes con GPT y las sube al chat; Claude las convierte a WebP, las nombra y
las conecta. GPT ya tiene el estilo de Kitewise — aquí va la historia, los personajes y el pedido exacto de
cada pieza, no la Style Bible completa.

**Unidad:** S3-U03, "Un barrio cambia, pero el mapa no lo explica todo" (3.º, CA HSS 3.3, borrador).
Especificación completa: `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`.

## La historia (para que las imágenes cuenten algo, no sean solo diagramas)

**El Barrio de los Almendros** — un barrio **completamente inventado** (no es un lugar real; no debe parecerse
a un barrio real ni llevar nombres de calles reales). Teo encuentra, en una caja vieja de su casa, un mapa
enrollado del barrio dibujado hace veinte años. Se lo lleva a Nia y lo comparan con cómo se ve el barrio hoy:
hay un puente nuevo sobre el arroyo y una estación pequeña donde antes solo había un terreno vacío. Teo y Nia
quieren saber **qué cambió y por qué** — encuentran dos papeles viejos que podrían explicarlo: un acta del
ayuntamiento y un anuncio de una tienda. Ninguno de los dos papeles por sí solo cuenta toda la historia — ese es
el punto de la lección.

**Nada de esto es investigación histórica real.** Es un caso de práctica, con un barrio, un puente, una
estación y dos documentos **inventados para la app**.

## Personajes (reusar, no rediseñar)

**Teo** y **Nia** ya existen — son los protagonistas de la historia de lectura *"La cometa roja"* (nivel 3,
`apps/reader/public/stories/la-cometa-roja/`). Son del mismo grado (3.º) que esta unidad, así que se reutilizan
tal cual para que haya continuidad visual entre Lectura y Sociedad.

**Adjunta `apps/reader/public/stories/la-cometa-roja/page-01.webp` o `page-02.webp` como imagen de referencia**
en cada pedido que incluya a Teo o a Nia, para que salgan exactamente iguales (mismo pelo, piel, ropa, edad,
estilo de acuarela cálida). No inventar ropa ni peinado nuevo — son los mismos niños, solo en un lugar distinto
(su barrio, no el patio de la escuela).

- **Teo**: niño, pelo oscuro rizado corto, piel morena clara, mejillas sonrosadas, curioso y atento.
- **Nia**: niña, pelo oscuro rizado con coletas/moño, piel morena clara, decidida, sonríe fácil.

Teo es el **guía recurrente de Sociedad** (como Mila lo es de Matemáticas): aparece solo, en miniatura, en una
esquina de cada ejercicio futuro. Nia aparece en esta unidad porque la historia es de los dos investigando
juntos, pero no hace falta darle poses de guía aparte.

## Estilo (recordatorio corto — GPT ya lo tiene)

Acuarela digital cálida tipo storybook, luz suave, personajes expresivos — el mismo estilo de
`la-cometa-roja/page-01.webp`. **Nunca texto, letras ni números dentro de ninguna imagen** (ni en los mapas, ni
en los papeles/documentos — las etiquetas y el texto los pone la app encima). Formato horizontal 3:2
(1536×1024) salvo donde se indique otra cosa.

## Las 7 piezas que hacen falta

### 1. Portada de la unidad

| Archivo | Pedido |
|---|---|
| `cover_sociedad_s3u03` | Teo y Nia sentados bajo un árbol en su barrio inventado, mirando juntos un mapa de papel viejo y enrollado que Teo sostiene abierto. Tarde cálida, casas sencillas y un arroyo pequeño al fondo (sin puente todavía — esta escena es "antes", como si el mapa los transportara). **Deja el 35 % derecho de la imagen como cielo o fondo liso y tranquilo**, sin personajes ni detalles ahí (es donde la app pone el título). 1536×1024. |

### 2. Los dos mapas del barrio (la pieza más importante — deben ser el MISMO barrio)

Vista de pájaro / isométrica, estilo ilustrado de libro infantil (no un mapa técnico/topográfico). **Las dos
imágenes deben compartir exactamente la misma composición**: mismas casas, mismas calles, mismo ángulo de
cámara y la misma posición del arroyo — para que un niño pueda comparar una contra la otra y notar qué cambió y
qué sigue igual. Genera primero una y pide la segunda "igual que la anterior, pero con estos cambios" en vez de
generarlas por separado.

| Archivo | Pedido |
|---|---|
| `mapa_barrio_antes` | El Barrio de los Almendros visto desde arriba, hace veinte años: unas 6-8 casas sencillas y coloridas, calles de tierra, un arroyo que cruza el barrio **sin ningún puente** (se cruza por un paso de piedras o no se cruza), un terreno abierto y vacío (pasto, sin construir) donde más adelante irá la estación. Sin gente, sin vehículos, sin texto ni nombres de calle. |
| `mapa_barrio_despues` | **Exactamente el mismo barrio, mismo ángulo, mismas casas** — pero hoy: el arroyo ahora tiene un puente peatonal de madera o piedra, y en el terreno que antes estaba vacío hay ahora una estación pequeña (de tren ligero o autobús, con un techo simple y un andén). El resto del barrio se ve igual que en la imagen anterior (mismas casas, mismas calles) para que el cambio sea evidente por comparación. |

### 3. Las dos tarjetas de fuente (documentos ficticios, sin texto)

Viñetas pequeñas, no escenas completas — un objeto o una escena muy cercana, como una ilustración de archivo.
1024×1024 o 3:2, a elegir lo que se vea mejor.

| Archivo | Pedido |
|---|---|
| `tarjeta_acta_municipal` | Un escritorio de madera antiguo visto de cerca, con un documento enrollado (papel envejecido, color crema) atado con un listón y un sello de cera roja, junto a un tintero y una pluma de ave. Luz cálida de ventana lateral. **El papel debe verse en blanco o con una textura de líneas onduladas que sugiera escritura antigua — nunca letras reales ni palabras legibles.** |
| `tarjeta_anuncio_comercial` | Un letrero de madera pintado a mano, colgando con cadenas frente a una tienda pequeña y antigua (fachada apenas visible detrás). El letrero tiene **solo un dibujo simple pintado** (por ejemplo, una canasta de pan o una herramienta) — **ninguna letra, ninguna palabra, ningún número** en el letrero. |

### 4. Teo — 4 poses de guía (fondo transparente, igual patrón que Mila en Matemáticas)

Mismo Teo de arriba (adjuntar la misma imagen de referencia), ahora aislado, cuerpo entero, fondo transparente,
1024×1024. Se usan pequeños en una esquina de cada pantalla; en Modo Enfoque se ocultan.

| Archivo | Pedido |
|---|---|
| `char_teo_saluda` | Teo de pie, saludando con la mano, sonriendo. |
| `char_teo_piensa` | Teo con un dedo en la barbilla, mirando hacia arriba, pensando. |
| `char_teo_apunta` | Teo señalando hacia un lado (como mostrando algo en un mapa), amable. |
| `char_teo_celebra` | Teo con los brazos arriba, contento (sin confeti ni objetos sueltos que parezcan algo para contar). |

## Cómo entregarlas

- Súbelas al chat tal como salen de GPT (PNG). Si GPT no deja fondo transparente en las 4 poses de Teo, pide
  "PNG con fondo transparente"; si aun así sale con fondo, súbela igual y lo recorto.
- El nombre del archivo da igual — dime cuál es cuál en el mensaje, o usa los nombres de la tabla.
- Antes de publicar: revisar términos de uso de la herramienta (`docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md` §5 —
  uso comercial y dueño de las imágenes).

## Cómo las reviso al llegar

Sin texto, letras ni números en ninguna · Teo y Nia iguales a como se ven en "La cometa roja" · los dos mapas
comparables (mismas casas, mismo ángulo) con solo el puente y la estación como diferencia real · el 35 %
derecho de la portada queda libre para el título · peso final < 350 KB (escenas/mapas/portada) y < 40 KB (poses
de Teo) en WebP.

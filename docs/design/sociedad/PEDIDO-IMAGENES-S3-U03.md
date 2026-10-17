# Pedido de imágenes — Sociedad, unidad piloto S3-U03 "El paso del arroyo"

**v2 (2026-10-16).** Reemplaza el pedido anterior (que usaba a Teo+Nia de "La cometa roja"). Ahora la unidad usa
a **Inés, Teo y la abuela Elena**, de "El mapa de la puerta desaparecida" — y ya tenemos 5 imágenes tuyas que
sirven como referencia/portada. Este pedido es solo lo que falta.

**Para quién:** Victor genera con GPT y sube al chat; Claude convierte a WebP, nombra y conecta.

## Ya tenemos (no hace falta volver a generarlas)

En `docs/design/sociedad/arte-referencia/` (copié las 5 que mandaste):

| Archivo | Qué muestra | Para qué sirve |
|---|---|---|
| `ref-05-mapa-y-arco.webp` | Mapa + Inés y Teo agachados señalando el arco tapiado | **Candidata a portada** de la unidad — tiene buena composición de "niños investigando". Si la usas de portada, el título va encima del cielo/pared clara arriba, no hace falta pedir otra con zona vacía. |
| `ref-02-mesa-mapa.webp` | Inés y Teo en una mesa, con un libro y un mapa extendido | Alternativa de portada, o escena de apertura ("la caja de mapas viejos"). |
| `ref-03-elena-foto.webp` | La abuela Elena mostrándoles una fotografía en el jardín | Escena de la sesión 3 ("otra mirada") — la abuela comparte una fuente. |
| `ref-01-arco-tapiado.webp` | Inés y Teo mirando el arco tapiado | Queda como referencia de estilo/jardín, no se usa en esta unidad (el arco es del misterio del libro, no de este caso). |
| `ref-04-grupo-lectura.webp` | Escena grupal leyendo bajo el naranjo | Referencia de estilo/ambiente, no imprescindible para esta unidad. |

**Elige tú cuál usar de portada** (`ref-05` o `ref-02` son las dos mejores candidatas) — dime cuál y la dejo
fija; si prefieres una nueva con el 35 % derecho despejado para el título, dímelo y la pido.

## La hoja de personajes oficial — adjúntala siempre

`docs/design/sociedad/arte-referencia/personajes-oficial.png` (copia de
`content/mapa-de-la-puerta-desaparecida/personajes.png`). Tiene a Inés, Teo, Elena y Nora: frente, caminando,
perfil y dos expresiones cada uno. **Adjunta esta hoja en cada pedido de abajo** que incluya a Inés, Teo o Elena,
para que salgan exactamente iguales.

## Lo que falta (7 piezas nuevas)

### 1. Los dos planos de la calle (la pieza más importante — deben ser EXACTAMENTE el mismo lugar)

Estilo del plano del libro: **a lápiz, papel envejecido, manchas, sin fecha, sin letras** — no un mapa a color
tipo ilustración de libro (para que se note que es "el mismo tipo de documento" que encontraron en la caja de
mapas). Genera primero uno y pide el segundo "igual que el anterior, pero con este cambio" para que coincidan.

| Archivo | Pedido |
|---|---|
| `plano_calle_antes` | Un plano a lápiz de una calle con casas sencillas a los lados y un arroyo que la cruza. En el arroyo, unas piedras planas puestas en fila para cruzar caminando — **sin ningún puente dibujado**. Sin fecha, sin nombres de calle, sin ninguna letra. Papel envejecido con una mancha o doblez, como el mapa del libro. |
| `plano_calle_despues` | **El mismo plano, mismas casas, mismo trazo** — pero con un puente pequeño dibujado sobre el arroyo en vez de las piedras. Todo lo demás igual para que el cambio sea evidente al comparar. |

### 2. La fotografía antigua de la abuela (tarjeta de fuente — close-up, no escena completa)

| Archivo | Pedido |
|---|---|
| `tarjeta_foto_arroyo` | Una fotografía antigua (blanco y negro o sepia, con borde blanco tipo foto de época) de **una niña saltando de piedra en piedra para cruzar un arroyo**, sonriendo, concentrada en el salto — es Elena de pequeña, pero no hace falta que sea idéntica a su cara adulta (es una foto borrosa/lejana, como fotos viejas reales). Fondo de casas sencillas detrás, como las del plano. **Sin texto, sin fecha escrita, sin nombres.** Encuadre cercano, como si fuera el objeto que sostiene la abuela, no una escena amplia. |

### 3. Teo — 4 poses de guía (fondo transparente, igual patrón que Mila en Matemáticas)

Usa la hoja `personajes-oficial.png` como referencia — mismo Teo (pelo oscuro, jersey rojo, mochila azul).
Aislado, cuerpo entero, fondo transparente, 1024×1024. Se usan pequeños en una esquina de cada pantalla; en
Modo Enfoque se ocultan.

| Archivo | Pedido |
|---|---|
| `char_teo_saluda` | Teo de pie, saludando con la mano, sonriendo. |
| `char_teo_piensa` | Teo con un dedo en la barbilla, mirando hacia arriba, pensando. |
| `char_teo_apunta` | Teo señalando hacia un lado (como mostrando algo en un plano), amable. |
| `char_teo_celebra` | Teo con los brazos arriba, contento. |

## Reglas (igual que siempre)

**Nunca texto, letras ni números dentro de ninguna imagen** — ni en los planos, ni en la foto, ni en nada. Las
etiquetas las pone la app encima.

## Cómo entregarlas

- Súbelas tal como salen de GPT (PNG). Si GPT no deja fondo transparente en las 4 poses de Teo, pide "PNG con
  fondo transparente"; si aun así sale con fondo, súbela igual y lo recorto.
- Dime cuál es cuál en el mensaje, o usa los nombres de la tabla.
- Antes de publicar: revisar términos de uso de la herramienta (`docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md` §5).

## Cómo las reviso al llegar

Sin texto, letras ni números · Inés/Teo/Elena iguales a `personajes-oficial.png` · los dos planos comparables
(mismas casas, mismo trazo, mismo estilo "a lápiz, sin fecha") con solo el puente como diferencia real · la foto
se ve claramente "antigua" (sepia o blanco y negro, borde de foto) · peso final < 350 KB (planos/foto) y
< 40 KB (poses de Teo) en WebP.

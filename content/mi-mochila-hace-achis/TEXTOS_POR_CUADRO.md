# Mi mochila hace ¡achís! — Textos para colocar sobre las imágenes

**Las imágenes no llevan texto.** Claude Code debe renderizar estas frases como texto real dentro de los recuadros vacíos.

Las seis versiones comparten las mismas tres páginas y los mismos siete cuadros. Cambiar idioma o nivel no cambia el arte.

## Orden de lectura

| Imagen | Cuadros | Orden |
|---|---|---|
| page-01.png | b01, b02, b03 | Arriba izquierda, arriba derecha, abajo |
| page-02.png | b04, b05 | Izquierda, derecha |
| page-03.png | b06, b07 | Izquierda, derecha |

## Extensión

| Nivel | Español | Inglés |
|---|---:|---:|
| 1 | 99 palabras | 107 palabras |
| 2 | 210 palabras | 218 palabras |
| 3 | 320 palabras | 334 palabras |

El conteo incluye únicamente narración y diálogo; excluye títulos, preguntas y vocabulario.

## Reutilización y límites de integración

- Los niveles 1 y 2 cumplen los rangos de palabras y cuadros indicados. El nivel 3 cumple 300–500 palabras y conserva los mismos siete cuadros para reutilizar íntegramente el arte, conforme a la petición más reciente. Esto se aparta del objetivo anterior de 4–6 cuadros; no se presenta como una validación de ese límite. Si el validador lo exige, Claude Code deberá permitir conservar el número de cuadros al adaptar el nivel, o agrupar unidades de lectura sin ocultar imágenes.
- Los JSON siguen los nombres de campos observados en el ejemplo aportado. No se ha recibido story.ts ni ejecutado su validador. La integración no se declara validada.
- Las posiciones finales se entregan en layout.json, separado de los textos. Las coordenadas serán zonas interiores para texto; no deben cubrir caras ni acciones.
- Los textos se dividen en 1–4 segmentos por cuadro. Los saltos tipográficos reales dependen del ancho y del tamaño de letra; no se deben truncar ni reducir hasta volverlos ilegibles. Para el nivel 3 puede mostrarse un segmento a la vez dentro del mismo recuadro cuando haga falta.
- No mostrar los títulos de bloque, identificadores, preguntas ni vocabulario dentro del arte. Son metadatos o contenido de la interfaz.
- Portada y hoja de personajes también se entregan sin letras.
- Las preguntas tienen una variante Explorador y una Lector por página. Cada variante tiene tres opciones, una respuesta y una pista amable.
- La separación silábica del vocabulario inglés sirve como apoyo; no representa una transcripción fonética.

## Nivel 1

### Página 1 · b01 · La mochila se mueve

**Español**

Mila oyó un ruido.
Su mochila azul se movía.

**English**

Mila heard a funny noise.
Her blue backpack was wiggling.

### Página 1 · b02 · Un visitante diminuto

**Español**

La abrió despacio.
¡Un dragón pequeño asomó la cabeza!

**English**

She slowly opened it.
A tiny dragon poked out its head!

### Página 1 · b03 · Burbujas por todas partes

**Español**

El dragón estornudó.
De su nariz salieron burbujas.
Mila se rio y luego lo miró con cuidado.

**English**

The dragon sneezed.
Bubbles floated from its nose.
Mila laughed, then took a closer look at her little visitor.

### Página 2 · b04 · Un poco de agua

**Español**

—¿Tienes sed?
Mila le dio agua en un tazón.
El dragón bebió, pero volvió a estornudar.

**English**

“Are you thirsty?” she asked.
Mila brought a bowl of water.
The dragon drank, but then it sneezed again.

### Página 2 · b05 · La pista amarilla

**Español**

Mila miró el bolsillo de la mochila.
Una pluma amarilla le rozaba la nariz al dragón.

**English**

Mila looked at the backpack pocket.
A yellow feather was brushing against the dragon’s nose.

### Página 3 · b06 · Se acabaron las cosquillas

**Español**

Mila sacó la pluma.
La puso en un vaso, lejos de la mochila.
¡Ya no había cosquillas!

**English**

Mila took out the feather.
She put it in a cup across the room.
No more tickles!

### Página 3 · b07 · Un amigo tranquilo

**Español**

El dragón se acomodó dentro de la mochila.
Mila sonrió.
Su nuevo amigo podía descansar.

**English**

The dragon curled up inside the open backpack.
Mila smiled.
Her new friend could finally rest.

## Nivel 2

### Página 1 · b01 · La mochila se mueve

**Español**

Mila estaba preparando sus cosas cuando escuchó un ruido extraño.
Su mochila azul se movía sobre la alfombra.
—Yo no guardé nada que pudiera saltar —murmuró, acercándose con curiosidad.

**English**

Mila was getting her things ready when she heard a strange rustle.
Her blue backpack wiggled on the rug.
“I didn’t pack anything that could jump,” she whispered, leaning closer.

### Página 1 · b02 · Un visitante diminuto

**Español**

Abrió la mochila con cuidado y encontró dos ojos brillantes.
Un pequeño dragón verde asomó la cabeza entre sus cosas.
Mila dio un salto y después soltó una carcajada.

**English**

She carefully opened the zipper and found two bright eyes looking up at her.
A tiny green dragon peeked out of the bag.
Mila jumped back, then burst into giggles.

### Página 1 · b03 · Burbujas por todas partes

**Español**

El visitante arrugó la nariz y estornudó.
En lugar de fuego, salieron burbujas que flotaron por el cuarto.
Mila quiso atraparlas, pero notó que el dragón seguía frotándose la nariz.

**English**

The visitor scrunched up its nose and sneezed.
Bubbles floated into the room instead of fire.
Mila reached to catch one, but the dragon kept rubbing its nose.
Something was bothering it.

### Página 2 · b04 · Un poco de agua

**Español**

—Tal vez tienes sed —dijo Mila.
Le acercó un tazón con agua y esperó mientras bebía.
El dragón parecía contento, hasta que otra burbuja salió volando.
El agua no había resuelto el problema.

**English**

“Maybe you need a drink,” Mila said.
She brought a bowl of water and waited while the dragon drank.
It looked happy for a moment.
Then another sneeze sent a bubble sailing past her.

### Página 2 · b05 · La pista amarilla

**Español**

Mila se quedó quieta y observó mejor.
Una pluma amarilla sobresalía del bolsillo delantero de la mochila.
Cada vez que el dragón se acercaba, la punta le rozaba la nariz.

**English**

Mila sat still and watched closely.
A yellow feather poked out of the backpack’s front pocket.
Whenever the dragon leaned toward the bag, the soft tip brushed against its nose.

### Página 3 · b06 · Se acabaron las cosquillas

**Español**

—¡Te está haciendo cosquillas!
Mila sacó la pluma y la llevó al vaso de sus materiales, al otro lado del cuarto.
Esperó un momento.
Esta vez no hubo ningún estornudo.

**English**

“That feather is tickling you!”
Mila pulled it from the pocket and placed it in her craft cup across the room.
She waited a little longer.
This time, there was no sneeze.

### Página 3 · b07 · Un amigo tranquilo

**Español**

El dragón se acomodó dentro de la mochila y cerró los ojos.
Mila sonrió mientras la última burbuja subía hacia el techo.
Su nuevo amigo ya podía descansar tranquilo.

**English**

The dragon snuggled into the open backpack and closed its eyes.
Mila smiled as the last bubble drifted toward the ceiling.
Her new friend could finally enjoy a peaceful rest.

## Nivel 3

### Página 1 · b01 · La mochila se mueve

**Español**

Mila revisaba sus cosas cuando oyó un ruido bajo la mesa.
Su mochila azul temblaba sobre la alfombra, aunque nadie la tocaba.
Se arrodilló para escuchar mejor.
Dentro, algo se movió y rozó la tela.

**English**

Mila was sorting her things when she heard a rustle under the table.
Her blue backpack trembled on the rug, even though nobody was touching it.
She knelt beside it and listened.
Something inside brushed against the fabric.

### Página 1 · b02 · Un visitante diminuto

**Español**

Abrió el cierre despacio y aparecieron dos ojos brillantes.
Un dragón verde, apenas más grande que su mano, asomó la cabeza.
Mila retrocedió sorprendida y enseguida sonrió.
El visitante parecía tan confundido como ella.

**English**

She eased the zipper open, revealing two bright eyes.
A green dragon, hardly bigger than her hand, poked its head out of the bag.
Mila jumped back in surprise, then smiled.
Her visitor looked just as puzzled as she felt.

### Página 1 · b03 · Burbujas por todas partes

**Español**

El dragón arrugó la nariz y soltó un estornudo que llenó el aire de burbujas.
Mila intentó atrapar una, encantada con aquel descubrimiento.
Entonces notó que su visitante se frotaba el hocico y volvía a estornudar.
Para ella era divertido; para él, quizá resultaba bastante molesto.

**English**

The dragon wrinkled its nose and sneezed a stream of bubbles into the air.
Delighted, Mila reached for one of the floating spheres.
Then she noticed the creature rubbing its snout before sneezing again.
The bubbles were entertaining for her, but the little dragon did not seem to be enjoying them.

### Página 2 · b04 · Un poco de agua

**Español**

Mila pensó que un poco de agua podría ayudarlo y le acercó un tazón.
El dragón bebió mientras ella esperaba con atención, sin apartar los ojos de su nariz.
Durante unos segundos todo estuvo tranquilo, pero enseguida apareció otra burbuja.
Su primera idea no había resuelto el problema: necesitaba observar mejor.

**English**

Perhaps a drink would help, Mila thought, so she fetched a small bowl of water.
The dragon drank while she watched patiently for another sneeze.
For a few seconds, everything was quiet; then a fresh bubble sailed past her shoulder.
Water had not solved the problem, and she needed another clue.

### Página 2 · b05 · La pista amarilla

**Español**

Esta vez Mila dejó de seguir las burbujas y miró alrededor de la mochila.
Del bolsillo delantero sobresalía una pluma amarilla que usaba para sus manualidades.
Cuando el dragón acercaba la cabeza, la punta suave le rozaba la nariz.
Ahí estaba la pista: los estornudos comenzaban justo después de aquel roce.

**English**

Instead of following the bubbles, Mila examined the area around the backpack.
A yellow craft feather stuck out of the front pocket, right beside the dragon’s head.
Whenever the creature leaned toward the bag, the feathery tip brushed its nose.
Mila watched again: first came the tickle, and then the sneeze.

### Página 3 · b06 · Se acabaron las cosquillas

**Español**

Mila retiró la pluma con cuidado y la llevó al vaso de materiales, al otro lado del cuarto.
Después regresó junto a la mochila y esperó en silencio.
El dragón olfateó el aire, movió las orejas y se relajó.
Ya no estornudaba; la pluma había sido la causa de las cosquillas.

**English**

She gently removed the feather and carried it to a cup of craft supplies across the room.
Back beside the backpack, Mila waited without making a sound.
The dragon sniffed the air, twitched its ears, and relaxed.
No sneeze followed; that soft yellow feather had been tickling its nose all along.

### Página 3 · b07 · Un amigo tranquilo

**Español**

El pequeño visitante se acomodó dentro de la mochila abierta y cerró los ojos.
Mila lo contempló mientras la última burbuja flotaba hacia el techo.
Al principio había intentado ayudarlo sin saber qué ocurría.
Ahora comprendía que quedarse quieta y prestar atención también podía ser una buena manera de cuidar a alguien.

**English**

The visitor curled up inside the open backpack and closed its eyes.
Mila watched the final bubble drift toward the ceiling.
At first, she had rushed to help without understanding what was wrong.
Now she knew that sitting quietly and paying close attention could be a useful way to care for someone.


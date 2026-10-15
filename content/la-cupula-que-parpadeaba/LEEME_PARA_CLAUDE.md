# La cúpula que parpadeaba

Libro de ciencia ficción para lectores de alrededor de diez años. Cuatro capítulos, dieciséis páginas de historia, doce escenas ilustradas, una portada y una hoja de personajes. Vera e Ivo investigan una luz extraña en una cúpula antigua de Marte. El misterio se explica con pistas visibles; la tormenta crea una necesidad real; el final distingue un parpadeo accidental de una señal intencional.

## Descarga

El libro se entrega en cuatro ZIP independientes para facilitar la descarga: `LA_CUPULA_PARTE_1_LECTURA.zip`, `LA_CUPULA_PARTE_2_IMAGENES_A.zip`, `LA_CUPULA_PARTE_3_IMAGENES_B.zip` y `LA_CUPULA_PARTE_4_IMAGENES_C.zip`. Descargar los cuatro y extraer cada uno **en el mismo lugar**. Sus carpetas `La_cupula_que_parpadeaba` se combinarán; no hace falta unir archivos RAR ni modificar sus extensiones. Al terminar, todo queda en esa carpeta y en su subcarpeta `imagenes`.

## Archivos

- `LEER_ES.pdf` y `READ_EN.pdf`: libro completo con portada, texto seleccionable y las mismas imágenes en ambos idiomas.
- `TEXTO_ES.md` y `TEXTO_EN.md`: prosa completa separada por página y capítulo. Inglés y español están redactados con naturalidad, sin depender de una traducción línea por línea.
- `LIBRO.json`: fuente editorial de títulos, párrafos, rutas de imagen, orden, disposición, textos alternativos, preguntas y vocabulario.
- `VISTA_PREVIA.html`: lectura adaptable con selector de idioma. Abrir dentro de la carpeta extraída para que encuentre `imagenes/`.
- `imagenes/portada.png`, `imagenes/personajes.png` y doce `pagina-NN.png`, todas de 1536 × 1024 px y sin texto narrativo incrustado.

Las páginas **3, 7, 10 y 14** son de texto, sin PNG propio. La ausencia de imagen allí es deliberada; no son páginas perdidas. Hay escenas grandes laterales, ilustraciones al pie con detalles complementarios y pausas para leer. Son estampas de libro ilustrado, no paneles de cómic.

## Lectura

La narración contiene **2 673 palabras en español y 2 597 en inglés**, cerca de 19,1 y 18,6 minutos a 140 palabras por minuto. Un lector de diez años puede tardar más, especialmente si conversa sobre las pistas. Frente al libro anterior, la versión española tiene alrededor de 42 % menos palabras. Cada página tiene un avance concreto y una pregunta de comprensión en dos variantes, `explorador` y `lector`, con tres opciones y una pista amable.

## Para integrar en la app

`LIBRO.json` es **un formato editorial de intercambio**. Adaptar sus campos al contrato efectivo de `packages/contracts/src/story.ts` y ejecutar la validación del proyecto antes de importarlo; no se afirma compatibilidad directa sin ver ese contrato. `pages[0..15]` tiene `id`, `chapter`, `layout`, `image` y `languages.es` / `languages.en`; cada idioma incluye `title`, `paragraphs`, `alt` y `checkpoint`. Los `correctIndex` son índices desde cero. `vocabulary` incluye sílabas y definición breve. La app debe superponer o colocar el texto real y reutilizar **el mismo PNG** al cambiar de idioma.

No colocar frases, globos ni subtítulos dentro de los PNG. Las áreas blancas forman parte de la composición prevista para textos de distintas longitudes. En teléfonos, dejar que el texto fluya y colocar la ilustración como una estampa, sin disminuir la tipografía hasta volverla ilegible.

## Continuidad visual y narrativa

La hoja `personajes.png` muestra frente, tres cuartos, perfil y expresiones de Vera, Ivo, Mara y Pico. Vera lleva dos trenzas y ropa naranja; Ivo, rizos cortos y chaqueta verde azulada; Mara, moño y mono azul marino; Pico es blanco, bajo, con ruedas y un ojo turquesa. Nido es el jardinero bajo de color cobre, con depósito y brazos finos. Pico permanece con los niños; Nido permanece en la cúpula de cultivo hasta la reunión final.

La colonia está en Marte. **Los humanos siempre están dentro** de corredores o cúpulas presurizadas cuando no visten trajes. El suelo rojo se ve tras vidrio sellado. La secuencia visual a conservar es: luz lejana → reflejo en vaso → sombra del ventilador → túnel protegido → gotas y hojas → Nido y brote → tormenta → circuito de calor → válvula → filtro → lámpara fija → flor → señal intencional. Cada transición responde a una pista o una acción anterior. No adelantar la identidad de Nido a las primeras páginas ni dibujar un mensaje literal en la luz.

## Dirección de arte para próximas historias

**Modo de generación:** edición con la hoja de personajes como referencia; una imagen por escena. Estilo acuarela/gouache editorial sobre papel marfil, terracota de Marte y turquesa de los vidrios, rostros expresivos y máquinas con formas reconocibles. Formato 1536 × 1024, 3:2. Escenas laterales reservan casi media página para texto; las inferiores reservan una franja superior amplia. En algunas escenas aparece un detalle cercano adicional integrado en la estampa, sin rejilla de viñetas.

**Restricciones comunes del prompt:** identidades y atuendos consistentes con `personajes.png`; causa y efecto visibles entre páginas; interior presurizado cuando hay humanos sin traje; sin letras, números, pantallas legibles, globos, logos ni marca de agua. Esta guía describe los prompts usados y las correcciones visuales: la escena 5 se ajustó para situar a los niños dentro de un corredor sellado; la 11 retiró a Nido del lugar equivocado.

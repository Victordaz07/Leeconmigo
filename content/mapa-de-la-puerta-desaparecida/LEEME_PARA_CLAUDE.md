# El mapa de la puerta desaparecida

Libro infantil completo en cinco capítulos y veinte páginas de historia, más una portada independiente. Inés y Teo siguen un mapa antiguo, distinguen pistas de conjeturas y descubren qué significaba un círculo rojo. El desenlace cierra el misterio sin convertir el jardín en un premio ni forzar una reconciliación.

## Descarga en tres partes

El material se distribuye en `PARTE_1_LECTURA.zip`, `PARTE_2_IMAGENES_A.zip` y `PARTE_3_IMAGENES_B.zip`. Descargar los tres y extraerlos **en la misma ubicación**. Cada archivo contiene la misma carpeta principal `El_mapa_de_la_puerta_desaparecida`; aceptar que las carpetas se combinen. No hace falta unir los ZIP con WinRAR ni renombrarlos como `.rar`. Al terminar, dentro de esa carpeta estarán los PDF, el JSON, los textos y una subcarpeta `imagenes` con quince PNG.

## Qué contiene este paquete

- `LEER_ES.pdf` y `READ_EN.pdf`: ediciones de lectura maquetadas, cada una con portada y veinte páginas. El texto se puede seleccionar; ninguna frase está incrustada en las ilustraciones.
- `VISTA_PREVIA.html`: vista de lectura con selector español/inglés. Hay que abrirla sin sacar los archivos de su carpeta para que carguen las imágenes relativas.
- `TEXTO_ES.md` y `TEXTO_EN.md`: manuscritos completos, separados por capítulo y página. Son dos redacciones naturales, no traducciones línea por línea.
- `LIBRO.json`: fuente estructurada de capítulos, páginas, títulos, párrafos, rutas de imagen, disposición, textos alternativos, vocabulario y preguntas de comprensión. Es un JSON editorial para la integración: **adaptar o transformar al contrato real** de `packages/contracts/src/story.ts` y validarlo allí antes de importarlo. No he supuesto que la estructura del contrato sea idéntica a esta.
- `imagenes/`: `portada.png`, `personajes.png` y trece ilustraciones de página `pagina-NN.png`, todas de 1536 × 1024 px. Las páginas 6, 8, 10, 12, 14, 16 y 18 son páginas de texto deliberadas y no tienen imagen propia.

## Lectura y composición

El relato suma 4 629 palabras en español y 4 459 en inglés. A 140 palabras por minuto supone aproximadamente 33,1 y 31,9 minutos, respectivamente, antes de hacer las preguntas. Cada capítulo ocupa cuatro páginas. Hay alternancia entre páginas con ilustración lateral, escenas ilustradas al pie y páginas de texto. Algunas ilustraciones reúnen dos detalles de una misma escena para apoyar la lectura, sin viñetas de cómic.

El texto siempre debe montarse como texto de la aplicación. Usar **la misma ilustración** para español e inglés; no hay globos ni áreas de diálogo dentro del PNG. En los PDF y la vista previa se ofrece una propuesta de composición, que puede adaptarse a cada dispositivo. Los textos completos son largos deliberadamente; permitir que el contenido fluya si un dispositivo no da espacio suficiente. No reducir las imágenes hasta convertir el libro en una cuadrícula de cómic.

## Datos de integración

`LIBRO.json` tiene `pages[0..19]`. Cada página incluye `id`, `chapter`, `layout`, `image` (`null` si es solo texto) y `languages.es` / `languages.en`. Cada idioma contiene `title`, `paragraphs`, `alt` y `checkpoint`. Hay una pregunta por página en dos variantes, `explorador` y `lector`; cada variante tiene tres `options`, un `correctIndex` basado en cero y `retryFeedback` amable. `vocabulary` proporciona palabras, separación silábica y definición breve. `cover` y `characterSheet` apuntan a los PNG correspondientes.

Mantener la continuidad visual: Inés lleva rizos castaños, jersey mostaza y pantalón verde; Teo, pelo oscuro, jersey rojo y mochila azul; Elena, pelo gris y cárdigan verde; Nora, moño oscuro, blusa verde azulada y delantal azul. La hoja `personajes.png` es la referencia de frente, tres cuartos, perfil y expresiones. Samuel aparece en la página 7 y la bibliotecaria en la 9. Elena vuelve físicamente al jardín en la página 19; antes de eso, la adulta del jardín es Nora.

La progresión visual tiene una causa y un efecto visibles: mapa → arco cerrado → fotografía antigua → tormenta → callejón → verja azul → jardín actual → círculo de piedras → regreso por otra entrada. Conservar el orden de las veinte páginas y las pausas de lectura; quitar páginas rompería las pruebas que permiten a los niños resolver el misterio.

Las imágenes no incluyen texto narrativo. Si se ofrece lectura en voz alta o un diseño a otro nivel de lectura, conservar estas mismas imágenes y sustituir solo el contenido textual montado por la aplicación.

# Instrucciones para Claude Code · Profesiones 01

Integra el libro **La misión que perdió la Tierra** en la app. Descomprime ambas partes del paquete en el mismo directorio; `LEEME_PARA_CLAUDE.md` explica la historia, el arte y la continuidad de la colección.

1. Abre `la_mision_que_perdio_la_tierra/LIBRO.json`, `packages/contracts/src/story.ts` y una historia válida de la app. Adapta el JSON editorial al contrato real y ejecuta la validación del proyecto. No supongas que el JSON editorial ya cumple ese contrato.
2. Copia `imagenes/portada.png`, `imagenes/personajes.png` y las seis imágenes `pagina-XX.png` al directorio de assets. Conserva el orden de las 12 páginas. En páginas con `image: null`, muestra la narración en un diseño de lectura sin arte de escena.
3. Renderiza el texto fuera de la imagen. Cada ilustración se reutiliza en español e inglés. `languages.es` y `languages.en` contienen narraciones propias para la misma acción visual. `correctIndex` empieza en cero; hay variantes `explorador` y `lector` con tres opciones y una pista amable por página. El vocabulario está en `vocabulary`.
4. Usa `LEER_ES.pdf`, `READ_EN.pdf` y `VISTA_PREVIA.html` como referencias de secuencia y ritmo, no como imágenes para la app. La página 10 introduce a Abril, futura protagonista de arquitectura, por primera vez en la feria de profesiones. No la muestres en escenas anteriores.
5. Comprueba el cambio de idioma sin cambiar la imagen, la legibilidad móvil de páginas con y sin ilustración, el orden de capítulos y que el episodio tenga su propio desenlace. Ejecuta `python VERIFICAR_PAQUETE.py` antes de importar.

Cada uno de los siete libros de profesiones tendrá protagonista y conflicto distintos. La feria sirve de vínculo: encuentros breves y progresivos entre niños, sin repetir el mismo evento desde todos los libros ni depender de un orden de lectura. Mantén el diseño de Abril cuando aparezca en su propio libro.

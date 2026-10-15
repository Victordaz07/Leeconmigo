# Dos libros nuevos: entrega a Claude Code

## Paquete

Dos historias independientes, para lectores de alrededor de diez años:

| Carpeta | Libro | Capítulos | Páginas | Arte |
| --- | --- | ---: | ---: | ---: |
| `la_manana_de_los_doce_minutos` | La mañana de los doce minutos | 3 | 12 | seis escenas, portada, personajes |
| `la_isla_que_caminaba` | La isla que caminaba | 3 | 12 | seis escenas, portada, personajes |

Español e inglés están escritos de forma natural para las mismas escenas. Son 1.460 / 1.450 palabras ES/EN en el primer libro y 1.411 / 1.361 en el segundo. Cada PNG mide 1536 × 1024 (3:2) y no incluye texto narrativo. Las imágenes `personajes.png` fijan vista frontal, tres cuartos, perfil y expresiones. Las páginas sin `image` son pausas de lectura, no archivos faltantes. Los PDF ilustran una posible composición; la app debe mostrar el texto real por separado.

## Instrucción para pegar en Claude Code

> Integra `Dos_historias_nuevas/` como dos historias independientes. Antes de modificar la app, abre `packages/contracts/src/story.ts`, `docs/01`, `docs/05`, `docs/09` y una historia existente que pase la validación. Usa los `LIBRO.json` como fuentes editoriales y adapta sus campos al contrato real; no asumas compatibilidad directa. Mantén las doce páginas de cada libro en orden y los tres capítulos de cuatro páginas. Para cada página conserva ES/EN, los párrafos, la pregunta de comprensión `explorador` y `lector` con tres opciones, `correctIndex` de base cero y pista amable, y el glosario con sílabas. Copia los PNG originales: portada separada, hoja de personajes y seis escenas por libro. Las imágenes son comunes a ambos idiomas y nunca deben contener texto, globos o preguntas rasterizados. Representa `image: null` como página de lectura legible; en páginas ilustradas, usa el panel lateral o un espacio que no tape personajes ni acciones. Valida el contrato y prueba en el lector ambas historias completas, cambio de idioma, preguntas y páginas sin imagen. Ejecuta build/tests relevantes e informa rutas finales y adaptaciones.

## Esquema editorial

En cada `LIBRO.json` hay `slug`, `title.es/en`, `subtitle.es/en`, `chapters[3]`, `cover`, `character_sheet`, `pages[12]` y `vocabulary.es/en`. Cada página tiene `id`, `number`, `chapter`, `image` (ruta relativa o `null`), `layout`, `languages.es/en`. Cada idioma incluye `title`, `paragraphs[]`, `alt`, `checkpoint.explorador/lector`. Cada pregunta contiene `question`, tres `options`, `correctIndex` y `hint`.

## Continuidad y comprensión visual

**La mañana:** Luna lleva broche menta, chaqueta naranja y tenis amarillos; Rafa tiene lentes redondos azules y chaleco denim; Inés, cárdigan índigo; Pip, un ojo turquesa. Luna mueve un espejo sin avisar, y el haz queda recirculando en el aro. La cometa amarilla rasgada marca el tiempo, **no causa** el bucle. El observatorio conserva notas y recuerdos mientras el exterior repite doce minutos. Inés opera el cierre de seguridad; los niños observan detrás de la línea. La feria posterior usa linterna y espejos fijos, con el aro apagado. En el texto se distingue observación, hipótesis y prueba.

**La isla:** Maya lleva trenzas con hilo rojo, camiseta turquesa y pantalones amarillos; Tomás, camiseta azul y cuaderno; Nando, sombrero de paja y camisa naranja; Elisa, uniforme azul de guardaparques. La cinta roja identifica una rama de la misma isla. Dos árboles y un poste dan puntos de referencia. Bajo las raíces hay una plataforma antigua atada al poste por cuerda floja. Marea y viento describen un arco; la bajamar deja una huella de barro. Los niños observan desde muelle y mirador, mientras dos adultas inspeccionan con cámara desde la barca. Las garzas anidan, así que la comunidad marca otra ruta y espera para decidir sobre la plataforma.

## Comprobación previa

Extrae todas las partes de cada libro en el **mismo directorio**, conservando la carpeta `Dos_historias_nuevas`. Ejecuta `python3 Dos_historias_nuevas/VERIFICAR_PAQUETE.py Dos_historias_nuevas`. Abre `VISTA_PREVIA.html` de cada libro dentro de esa estructura. Los ZIP son independientes; no se concatenan ni se renombran. No se validó contra `story.ts` aquí porque el repositorio no estaba disponible.

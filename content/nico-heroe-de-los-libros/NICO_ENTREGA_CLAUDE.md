# Entrega a Claude Code: Nico, héroe de los libros

## Qué se entrega

Tres libros independientes y consecutivos para lectores de alrededor de diez años:

1. `01_la_puerta_de_papel` — Nico descubre que puede entrar en el libro azul; resuelve una aventura con Sira y empieza a pedir ayuda fuera del libro.
2. `02_el_ultimo_nivel` — Nico, Alma y Teo se enfrentan al Borrador, que borra decisiones, mientras preparan una maqueta escolar.
3. `03_el_heroe_fuera_del_libro` — Una filtración daña el rincón de lectura; Nico escucha a Teo, ayuda a Dani a leer a su ritmo y presenta el proyecto con sus amigos.

Son **30 páginas narrativas**, diez por libro; **15 ilustraciones de página**, tres portadas y una hoja de personajes compartida. El texto tiene **3.420 palabras en español y 3.429 en inglés** en total. Los PNG son **1536 × 1024 (3:2), sin texto incrustado**. Una misma ilustración sirve para ambos idiomas. No se deben inventar PNG para las páginas con `image: null`: son pausas de lectura a dos columnas. Los PDF son una muestra de composición; la app debe usar los PNG y el texto por separado.

## Archivos y ensamblaje

Hay seis ZIP independientes, **A y B por cada libro**. Extrae los seis en el mismo directorio. Se combinarán bajo `Nico_heroe_de_los_libros/`:

- `NICO_LIBRO_1_A_LECTURA.zip` + `NICO_LIBRO_1_B_ILUSTRACIONES.zip`
- `NICO_LIBRO_2_A_LECTURA.zip` + `NICO_LIBRO_2_B_ILUSTRACIONES.zip`
- `NICO_LIBRO_3_A_LECTURA.zip` + `NICO_LIBRO_3_B_ILUSTRACIONES.zip`

Cada carpeta del libro contiene `LIBRO.json`, `TEXTO_ES.md`, `TEXTO_EN.md`, `LEER_ES.pdf`, `READ_EN.pdf`, `VISTA_PREVIA.html`, portada e imágenes de páginas. En la raíz están `PERSONAJES_SERIE.png` y `LEEME_PARA_CLAUDE.md`. Abre cada `VISTA_PREVIA.html` desde la estructura extraída para comprobar ambos idiomas. Ejecuta `python3 VALIDAR_ENTREGA.py Nico_heroe_de_los_libros` desde el directorio donde guardes este archivo y el validador.

## Instrucción lista para pegar en Claude Code

> Integra los tres libros de `Nico_heroe_de_los_libros/` en la app, en orden de `series_index`. Antes de escribir, abre `packages/contracts/src/story.ts`, `docs/01`, `docs/05`, el lector actual y una historia existente válida. Trata `LIBRO.json` como fuente editorial, **no como un objeto que ya cumple el contrato TypeScript**. Adapta los tres libros al esquema real y ejecuta su validador. Conserva exactamente el orden de las diez páginas por libro, los textos ES/EN escritos para la misma escena, las rutas de portada y PNG, las preguntas `explorador` y `lector` de cada página con tres opciones y `correctIndex` de base cero, sus pistas amables y el vocabulario con sílabas. Mantén `image: null` en las páginas de solo texto con una disposición legible. En páginas ilustradas, coloca el texto de la app en el área lateral clara o en su panel; jamás rasterices texto, globos ni preguntas dentro de los PNG. La portada es independiente. Conserva el mismo Nico, Alma y Teo entre los tres libros y usa `PERSONAJES_SERIE.png` como referencia editorial. Añade navegación de serie 1→2→3 sin bloquear la lectura individual. Verifica en el lector cada libro completo en español e inglés, el cambio de idioma sin cambiar PNG, todas las preguntas y las páginas sin imagen; después ejecuta la validación/build/tests relevantes y documenta las rutas finales y cualquier adaptación de contrato.

## Forma de los datos

Cada `LIBRO.json` contiene `slug`, `series_index`, `title.es/en`, `subtitle.es/en`, `cover`, `character_sheet`, `pages[]`, `vocabulary.es/en` y reglas de `continuity`. Cada página tiene `id`, `number` (1–10), `image` (ruta relativa o `null`), `layout`, y `languages.es/en` con `title`, `paragraphs[]`, `alt`, `checkpoint.explorador/lector`. Cada pregunta tiene `question`, tres `options`, `correctIndex` y `hint`. Los índices correctos varían entre 0, 1 y 2. No se hizo una traducción literal línea por línea.

## Reglas de historia y continuidad

- Nico entra en el mundo mientras lee el libro azul abierto y vuelve cuando se cierra; conserva recuerdos y pequeños rastros, **no poderes físicos** en la vida real.
- Sira y la ciudad de canales pertenecen al mundo del libro. Lidia se queda en el mundo real.
- El conflicto del segundo libro se resuelve dando a los personajes capacidad de decidir; no mediante una pelea. El proyecto escolar y la ciudad avanzan por colaboración.
- En el tercero, lo aprendido ayuda a Nico a detenerse, preguntar y escuchar. Teo conserva la autoría de su trabajo. Un adulto revisa la seguridad del estante y personal del edificio repara la ventana. Dani lee a su propio ritmo.
- Las imágenes no tienen texto narrativo. El inglés y el español pueden ocupar espacios distintos en la interfaz sin alterar el arte.

## Criterios de aceptación

- Tres historias localizables y navegables en el orden correcto; diez páginas cada una.
- 15 PNG de página y tres portadas encontrados y mostrados en el orden correcto; páginas `image: null` legibles.
- Misma imagen para ES y EN en cada página; todo el texto y las preguntas cambian de idioma.
- Una pregunta por página en cada variante, tres opciones, índice correcto dentro de 0–2 y pista sin decir «Incorrecto».
- Vocabulario accesible; lectura accesible en pantalla pequeña; sin texto superpuesto sobre rostros o acciones.
- Contrato `story.ts` y validación/build del repositorio superados. Documentar cualquier campo adaptado.

## Límite de esta entrega

El repositorio de la app, incluido `packages/contracts/src/story.ts`, no estaba en los archivos de esta conversación. Por eso la compatibilidad exacta con el contrato y la prueba dentro del lector deben hacerse en Claude Code con el repositorio abierto. El contenido, el arte y las comprobaciones del paquete sí están terminados.

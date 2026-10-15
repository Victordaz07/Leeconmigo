# El caso de la estrella desaparecida

Una sola historia de misterio en tres capítulos consecutivos. Cada capítulo aporta información necesaria para el siguiente. No mostrarlos como aventuras independientes ni revelar las preguntas o soluciones de capítulos posteriores antes de tiempo.

## Archivos y lectura

- Nueve páginas, cuatro viñetas por página: treinta y seis viñetas en total.
- Una portada general y una hoja de personajes para toda la historia.
- Todos los PNG a 1536 × 1024, sin texto integrado; la aplicación añade narración y títulos.
- Dieciocho JSON: tres capítulos × dos idiomas × tres niveles. Cada capítulo tiene tres preguntas, una por página, con variantes Explorador y Lector, tres opciones y pista amable.
- Vocabulario con sílabas y definiciones por versión.
- SERIE_Y_CAPITULOS.json indica orden, títulos y enlaces entre capítulos. Es información editorial para adaptar al contrato de la app.
- TEXTOS_POR_CUADRO.md contiene todo el texto legible. RETOS_DE_RAZONAMIENTO.md añade retos orales abiertos con orientaciones para el adulto separadas de la pregunta.

Leer cada imagen: arriba izquierda → arriba derecha → abajo izquierda → abajo derecha. Los IDs de página son globales p01–p09, los cuadros b01–b36 y las preguntas q01–q09. Son idénticos entre niveles e idiomas. Conservar ese vínculo aunque el sistema interno de la app necesite otros identificadores.

## Capítulos y progresión intelectual

| Capítulo | Páginas | Reto | Lo que aún falta al terminar |
|---|---|---|---|
| 1. La pista que no caminaba | 1–3 | Comparar dos rastros y distinguir una observación de una sospecha. | Saber qué hay dentro del taller y dónde está la estrella. |
| 2. La sombra que engañaba | 4–6 | Comprobar una impresión, relacionar pistas y formular una predicción. | Descubrir el objeto completo y reconstruir cómo llegó allí. |
| 3. Lo que ocurrió de verdad | 7–9 | Proponer una causa que explique todas las pistas y probar la reparación. | El misterio queda cerrado, con la estrella recuperada y bien sujeta. |

Los rangos de 80–150, 150–250 y 300–500 palabras se aplican **por capítulo**, no a los tres juntos. El número de páginas responde a las transiciones necesarias; no se fija un límite para próximas historias. Las mismas imágenes sirven para los tres niveles. Nivel 1 cuenta acciones; nivel 2 conecta acciones y motivos; nivel 3 distingue observaciones, hipótesis, pruebas y conclusiones.

## Personajes y continuidad

Luna: dos trenzas negras con lazos amarillos, gafas moradas, chaqueta menta, camiseta crema, pantalón corto azul y zapatos naranja. Nico: pelo castaño corto, camiseta morada, pantalón amarillo y zapatos menta. Son hermanos. Pico: cigüeña blanca, alas azul oscuro, gorra azul con círculo amarillo, chaleco menta, pico y patas naranja. Prepara la fiesta de la estación.

El gato del jardín es blanco, con oreja y cola negras y collar verde. Es un personaje incidental. Sus huellas no prueban que haya movido la estrella. Pico está en el taller mientras los hermanos investigan el jardín; no debe aparecer acompañándolos antes de abrir la puerta.

## Objetos que deben seguirse

- Una estrella amarilla de cinco puntas, sólida, con un aro morado arriba.
- Cinta azul con **puntos blancos**: sostiene la estrella y deja un trocito junto al camino. No confundir con la tela de rayas.
- Carro naranja con ruedas moradas. Está debajo de la estrella al ocurrir la caída y termina dentro del taller.
- Tela azul y blanca de **rayas** dentro del carro: amortigua y oculta la estrella.
- Farol de luz cálida y marco azul; perchero de madera con abrigo morado: producen la sombra.
- Dos rastros distintos: pisadas pequeñas del gato y líneas continuas de las ruedas.

La estrella y su cinta desaparecen juntas del gancho. La cinta suelta viaja con el carro; un extremo se engancha y deja un pedazo. No queda otra estrella ni otro carro en un lugar diferente.

## Reconstrucción temporal

La página 8 es una reconstrucción del accidente anterior a la búsqueda, señalada por el texto y por luz algo más cálida. La página 9 vuelve al presente. Mantener esas transiciones explícitas en todos los niveles. No usar la reconstrucción como una visión mágica de los personajes: es la narración mostrando lo ocurrido después de que han reunido las pruebas.

Antes de mostrar la página 8, puede ofrecerse el reto oral de reconstrucción. Las orientaciones del adulto contienen la solución y no deben mostrarse como pista inicial.

## Integración y ajuste

Los JSON son datos editoriales. packages/contracts/src/story.ts y el lector real no están disponibles aquí: adaptar los campos y ejecutar su validador antes de integrar. Las rutas apuntan a los PNG reales del paquete; convertir a WebP y cambiar extensiones solo si el repositorio lo requiere.

Las cadenas de lines se ajustan a varias líneas visuales dentro del recuadro. No interpretarlas como una línea rígida sin ajuste de palabras. Consultar zonas_texto.json para coordenadas interiores conservadoras y tamaños de prueba. No truncar ni incrustar texto en el PNG. El ajuste final depende de la fuente del lector.

Aplicar primero `pageOverrides[illustration.src].safeTextBoxes`: cada PNG tiene coordenadas medidas para sus cuatro recuadros. Las posiciones cambian ligeramente entre páginas. `safeTextBoxes` en la raíz es solo la referencia general. Escalar coordenadas y tipografía con el mismo factor que la imagen y mantener su relación 3:2; no usar recorte `cover` en las páginas. En pantallas pequeñas, ofrecer ampliación del cuadro o lectura del texto en panel para conservar la legibilidad.

Se usó generación de imágenes integrada con referencias de personajes y plantilla. Los prompts y correcciones están documentados. La revisión comprueba el estado de los objetos, la localización de los personajes, los cambios de tiempo, las rutas, el contenido de las preguntas y el espacio del texto.

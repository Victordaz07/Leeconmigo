# La noche sin luces — entrega para Lee Conmigo

Paquete de una historia con 14 páginas, 40 cuadros, 13 plantillas distintas y una página con texto lateral. Las mismas ilustraciones sirven para español e inglés y para los tres niveles.

## Archivos

- `apps/reader/public/stories/la-noche-sin-luces/`: 14 páginas y portada, PNG de 1536 × 1024, sin texto incrustado. Las cajas están vacías para que la app coloque el texto.
- `packages/story-engine/stories/es/` y `en/`: seis JSON con el contrato recibido, sin coordenadas ni campos de layout.
- `content/la-noche-sin-luces/characters.png`: Mila, Pipo y Tito en 2D, con vistas y expresiones.
- `content/la-noche-sin-luces/dora.png`: hoja de Dora, la nueva cigüeña.
- `content/la-noche-sin-luces/personajes-originales.webp`: referencia original suministrada, conservada para continuidad.
- `content/la-noche-sin-luces/TEXTOS_POR_CUADRO.md`: lectura humana de las seis variantes, preguntas, respuestas, pistas, vocabulario y repaso.
- `PROMPTS_DE_PRODUCCION.json`: prompts finales de las imágenes y correcciones registradas; se usó la generación de imágenes integrada con referencias.
- `plantillas/`: las trece guías originales, sin modificaciones.
- `VERIFICACION.json`, `CONTEOS_POR_CUADRO.json` y `REVISION_GLOBOS.json`: resultados de la comprobación local y mediciones aproximadas de las cajas.

## Integración

1. Copiar las carpetas `apps`, `packages` y `content` a sus ubicaciones correspondientes en el repositorio.
2. Convertir las quince imágenes de lectura de PNG a WebP conservando tamaño y nombre. Los JSON ya apuntan a `stories/la-noche-sin-luces/page-01.webp` … `page-14.webp` y `cover.webp`, tal como solicita la especificación. No se han incluido WebP convertidos.
3. Ejecutar `npm run stories:check` y `npm run stories:budget` en el repositorio. No se ejecutaron aquí porque no se proporcionó el código de la aplicación ni esos comandos.
4. Revisar las páginas cinco y nueve en el editor de cajas. La medición de regiones crema encuentra diferencias respecto a la guía: el globo inferior izquierdo de p05 está algo más arriba; algunas cajas de p09 cambian ligeramente de posición o ancho. El interior de referencia con un margen de veinte píxeles entra en los límites detectados, pero esto no certifica el ajuste tipográfico real ni sustituye la prueba en la app. Los detalles están en `REVISION_GLOBOS.json`.

La página ocho no lleva `template` y sí incluye ilustración y texto alternativo. Las preguntas aparecen únicamente en p02, p05, p06, p08, p10, p12 y p14. La última pregunta tiene dos opciones; las demás, tres. La portada usa `heroFocus: { "x": 25, "y": 68 }`.

## Dos incompatibilidades de la especificación resueltas con el cambio mínimo

- **N1, p08:** se piden dos frases entre tres cuadros, pero también al menos una frase por cuadro. Se entregan **tres frases**, una en cada cuadro, conservando los tres identificadores.
- **N3, b01:** se pide un mínimo de 408 caracteres. El estribillo obligatorio mide 43 caracteres en español y 44 en inglés. Con otras tres frases de 120 y tres espacios de unión, el máximo posible es **406 ES / 407 EN**. Se entrega exactamente ese máximo, sin cambiar el estribillo ni exceder cuatro frases.

Estos casos constan como excepciones explícitas en la verificación, no como cumplimiento literal de reglas incompatibles. No se alteraron las reglas del motor.

La sobrecarga deliberada solicitada está únicamente en **b10 y b13 del nivel 3**, en ambos idiomas, dentro de 125–135 caracteres. El resto respeta los máximos. El mínimo de b01 tiene la excepción explicada arriba.

## Revisión del contenido

| Idioma | Nivel | Palabras del relato | Vocabulario |
|---|---:|---:|---:|
| ES | 1 | 373 | 12 |
| EN | 1 | 394 | 12 |
| ES | 2 | 867 | 20 |
| EN | 2 | 879 | 20 |
| ES | 3 | 1296 | 30 |
| EN | 3 | 1339 | 30 |

Las palabras se cuentan separando el relato por espacios; no incluyen títulos, preguntas ni definiciones. Los presupuestos cuentan `lines.join(" ").length` sobre texto normalizado. Todas las variantes mantienen los cinco estribillos pedidos, siete preguntas con versiones Explorador/Lector, pistas concretas, ocho o más sinónimos y tres palabras de repaso. Cada N3 contiene frases de exactamente 120 caracteres y cuadros de cuatro frases.

Para repetir la revisión local desde la raíz de este paquete:

```bash
python3 content/la-noche-sin-luces/verificar_paquete.py
```

Esta revisión comprueba estructura, textos, vocabulario y dimensiones de PNG. La revisión visual comprobó personajes, escenas y espacios vacíos. No equivale a una prueba del simulador, renderizado de fuentes, reanudación, progreso ni lectura en voz alta en la aplicación.

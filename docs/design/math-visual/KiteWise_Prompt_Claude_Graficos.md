# KiteWise — Prompt para Claude: gráficos y ejercicios generables

Adjunta `KiteWise_Referencias_Graficas.png` y pega desde «TU TAREA» hasta el final. El SVG adjunto sirve como referencia editable. La lámina es una propuesta visual nueva; los archivos y capturas actuales del proyecto mandan para integrar tipografías, componentes y navegación.

## TU TAREA

Implementa un sistema reutilizable de representaciones matemáticas interactivas para KiteWise, app bilingüe ES/EN para estudiantes de 1.º a 6.º. La lámina adjunta muestra 12 conceptos gráficos. Necesito que el niño pueda construir, mover, colorear, medir, repartir y explicar. Cada representación debe admitir muchos problemas, variaciones y ayudas.

Primero inspecciona el proyecto: framework, componentes, tema, ejercicios existentes, recursos y sistema de idiomas. Integra la solución con esos patrones. Conserva el trabajo previo. No sustituyas la aplicación por una nueva. Trabaja dentro del alcance local; publicar queda fuera de esta tarea.

## 1. Dirección gráfica

- Ilustración 2D alegre y clara: formas redondeadas, colores vivos controlados y contornos suaves en azul oscuro o marrón. Personajes y fondos sencillos, con pocos detalles.
- La interfaz debe mantener el estilo aprobado de KiteWise. La referencia adjunta especifica las representaciones matemáticas, sin imponer una nueva identidad de marca.
- Base propuesta si faltan tokens del tema: crema #FAF5EA, tinta #233447, azul #467B9C, coral #D77754, verde #769E72, amarillo #E5B74F y violeta #9A7DAB. Revisa contraste de texto y controles; los colores de objetos no sirven por sí solos para comunicar significado.
- Una escena principal por ejercicio. Fondo discreto, personajes al margen y superficie matemática despejada. Ningún adorno debe parecer un objeto que también deba contarse.
- En móvil, pregunta arriba, representación al centro y acciones debajo. En escritorio, el apoyo puede ir a un lado. No reduzcas toda la pantalla hasta volver ilegibles los números.
- En 1.º–2.º, objetos grandes y pocas palabras. En 3.º–4.º, conectar objetos, diagramas y operaciones. En 5.º–6.º, usar diagramas más sobrios. Los rangos de grado son orientativos: habilita por habilidad y prerrequisitos.

## 2. Construcción de los gráficos

Usa SVG para cantidades, diagramas, relojes, ejes, geometría y sus etiquetas. Usa componentes existentes del proyecto para controles y texto. Reutiliza imágenes aprobadas para fondos y personajes cuando existan.

Las cantidades y geometrías se calculan con código. La IA puede ayudar a producir recursos decorativos reutilizables; no debe decidir cuántos objetos contiene cada problema ni dibujar las medidas finales.

Recursos visuales mínimos: semilla, planta, fruta, galleta, plato, caja, maceta, unidad, barra de decena, loseta y marcador. Deben ser componentes o recursos únicos reutilizados. No generar una imagen distinta por cada operación. Cada tipo de objeto debe tener una silueta fácilmente reconocible y una zona de toque independiente de su tamaño dibujado.

El estado del ejercicio controla simultáneamente enunciado, representación, respuesta y explicación. Evita mantener estos cuatro elementos en fuentes de datos independientes.

## 3. Las 12 familias gráficas

### A. Bandejas de 5, 10 y 20
**Dibujo:** celdas iguales en filas de cinco, con una ficha o semilla por celda. Llenado inicial de izquierda a derecha, primera fila antes que segunda.
**Ejemplo:** hay 7; completar 10. Respuesta: agregar 3.
**Acción:** tocar celdas vacías, añadir o retirar fichas y confirmar. Debe poderse hacer sin arrastrar.
**Generar:** cantidad inicial, capacidad, dato desconocido y objeto. Rechazar cantidad inicial mayor que capacidad.
**Variantes:** representar 8, comparar dos bandejas, completar 20, descomponer 9 en dos grupos.
**Ayuda:** resaltar espacios vacíos; después relacionarlos con 7 + 3 = 10.

### B. Valor posicional y reagrupación
**Dibujo:** cada decena contiene exactamente diez unidades visibles; cada centena usa una cuadrícula de 10 × 10. Las unidades mantienen la misma escala.
**Ejemplo:** representar 23 con dos decenas y tres unidades.
**Acción:** colocar piezas, juntar diez unidades o desarmar una decena.
**Generar:** número objetivo, denominaciones disponibles, representación inicial y necesidad de intercambio.
**Variantes:** 34 = 3 decenas + 4 unidades; 28 + 7; 42 − 16.
**Validación:** aceptar representaciones equivalentes válidas, como una decena y trece unidades para 23, cuando la consigna no exija forma convencional.

### C. Recta numérica
**Dibujo:** marcas equidistantes según una escala explícita; saltos que comienzan y terminan en valores exactos. Flechas curvas o arcos claros.
**Ejemplo:** comenzar en 4 y avanzar 3; terminar en 7.
**Acción:** mover un marcador, construir saltos o seleccionar un punto.
**Generar:** inicio, dirección, longitud de salto, número de saltos, escala y límites.
**Variantes:** restar, saltar de 5 en 5, situar 3/4, comparar decimales o enteros con signo cuando corresponda.
**Ayuda:** distinguir contar intervalos de contar marcas.

### D. Grupos iguales y arreglos
**Dibujo:** parcelas, cajas o bandejas claramente separadas con objetos idénticos. En un arreglo rectangular, filas y columnas deben ser uniformes.
**Ejemplo:** 3 parcelas con 4 plantas cada una; total 12.
**Acción:** construir grupos, completar un arreglo y relacionar con una operación.
**Generar:** número de grupos, elementos por grupo y cuál de los tres datos se pregunta.
**Variantes:** 4 filas de 6, comparar 3 × 4 y 4 × 3, mostrar la distributiva partiendo un arreglo.
**Ayuda:** resaltar un grupo completo; conectar suma repetida y producto. Define claramente qué representa cada factor.

### E. División y reparto
**Dibujo:** inventario de objetos y recipientes distintos. Cada objeto debe existir en un solo lugar a la vez.
**Ejemplo:** 12 galletas entre 3 platos; 4 por plato.
**Acción:** seleccionar un objeto y su destino, o arrastrarlo; devolverlo al inventario si hace falta.
**Generar:** total y número de grupos para reparto; total y tamaño de grupo para agrupamiento. Para divisiones exactas, generar primero divisor y cociente y calcular el dividendo.
**Variantes:** formar bolsas de 4 con 20 objetos; repartir 14 entre 4 y explicar los 2 sobrantes.
**Validación:** comprobar distribución, igualdad de grupos y sobrantes; no basta con que desaparezcan todos los objetos del inventario.

### F. Fracciones y equivalencias
**Dibujo:** barras, círculos o mosaicos divididos en partes de igual área. Para comparar, mantener iguales el entero de referencia y la escala.
**Ejemplo:** colorear 3 de 4 partes; 3/4.
**Acción:** colorear, superponer modelos, subdividir y colocar en una recta.
**Generar:** denominador, numerador, entero de referencia y operación. Progresar de fracciones propias a impropias y números mixtos según habilidad.
**Variantes:** 1/2 = 2/4; comparar 2/3 y 3/4; construir 1 1/4; sumar 1/4 + 2/4.
**Ayuda:** señalar qué cuenta el numerador y qué define el denominador. Para equivalencias, usar alineación o superposición, además del color.

### G. Modelo de barras y datos desconocidos
**Dibujo:** barras con longitudes proporcionales a sus valores; segmentos contiguos y llaves para total y partes.
**Ejemplo:** 8 + □ = 13; parte desconocida 5.
**Acción:** elegir un segmento, asignarle un valor o construir la relación parte–todo.
**Generar:** estructura del problema, valores y posición de la incógnita.
**Variantes:** falta una parte, falta el total, comparación «tiene 5 más», comparación multiplicativa cuando corresponda.
**Ayuda:** conectar el relato con las partes antes de mostrar una operación. No resolver problemas verbales por palabras clave aisladas.

### H. Área, perímetro y volumen
**Dibujo:** jardín cuadriculado con unidades cuadradas; borde separado visualmente del suelo. Para volumen, capas de cubos unitarios con profundidad legible.
**Ejemplo:** rectángulo 5 m × 3 m: área 15 m², perímetro 16 m.
**Acción:** cubrir con losetas, recorrer el borde o construir capas.
**Generar:** dimensiones, unidad, magnitud pedida y, más adelante, figuras compuestas.
**Variantes:** mismo perímetro y distinta área; lado desconocido; caja 3 × 2 × 4 con volumen 24 unidades cúbicas.
**Ayuda:** mostrar «cubrir», «rodear» o «llenar» con la unidad adecuada.

### I. Relojes y tiempo transcurrido
**Dibujo:** marcas regulares; minutero y horario diferenciados por forma y etiqueta. La posición del horario depende también de los minutos.
**Ejemplo:** 2:30; el horario queda a mitad de camino entre 2 y 3.
**Acción:** ajustar minutos, mover agujas o situar eventos en una línea temporal.
**Generar:** hora inicial, duración, granularidad y formato de presentación. Evitar ambigüedad a. m./p. m. cuando importe.
**Variantes:** 2:15 + 35 minutos = 2:50; de 3:40 a 4:10 transcurren 30 minutos.
**Ayuda:** agrupar minutos de cinco en cinco y conectar reloj analógico con digital.

### J. Datos y gráficas
**Dibujo:** pictogramas, barras o diagramas de puntos con etiquetas, escala, unidades y origen apropiados.
**Ejemplo:** mango 4, pera 6, uva 3; total 13 y diferencia pera–uva 3.
**Acción:** construir una barra, clasificar datos, leer un valor o comparar categorías.
**Generar:** categorías, frecuencias, escala, leyenda y pregunta.
**Variantes:** cada símbolo representa 2; completar una barra; hallar media, mediana o rango cuando corresponda.
**Validación:** longitud de barras proporcional al dato; nunca usar tamaños decorativos que contradigan la escala.

### K. Coordenadas y recorridos
**Dibujo:** ejes rotulados x e y; cuadrícula y marcas con escala explícita. El mapa de fantasía puede ir detrás, sin alterar las coordenadas.
**Ejemplo:** punto (3, 2): tres a la derecha y dos hacia arriba desde el origen.
**Acción:** tocar una intersección, mover un marcador o seguir una lista de puntos.
**Generar:** dominio, escala, puntos y tarea. Introducir primero el primer cuadrante; ampliar según contenido.
**Variantes:** localizar tesoros, construir un rectángulo, comparar recorridos, introducir coordenadas negativas.
**Ayuda:** animar por separado el desplazamiento horizontal y el vertical, con opción sin animación.

### L. Razones, mezclas y porcentajes
**Dibujo:** pares de grupos, tablas de razones y rectas dobles con correspondencias alineadas. Para porcentajes, cuadrícula de cien o barra con escala explícita.
**Ejemplo:** 2 medidas azules por 1 naranja; 3 naranjas requieren 6 azules.
**Acción:** añadir lotes completos, completar una tabla o escalar la mezcla.
**Generar:** razón base, factor de escala, total o dato desconocido. En un problema de medidas, especificar la unidad.
**Variantes:** receta para 2 o 6 personas; comparar precio por unidad; 25 % de 40 = 10.
**Ayuda:** distinguir mantener una razón de sumar una cantidad fija a ambos términos.

## 4. Tipos de ejercicio reutilizables

Cada representación debe admitir las acciones que tengan sentido pedagógico:

1. Construye una cantidad o modelo.
2. Completa una representación parcialmente terminada.
3. Resuelve con apoyo visual.
4. Encuentra y corrige un error en un modelo.
5. Relaciona relato, gráfico y operación.
6. Compara dos modelos y justifica.
7. Encuentra dos soluciones diferentes a una consigna abierta.

No conviertas todas las actividades en tres botones de respuesta. Implementa primero la acción manipulativa principal de cada familia; conserva selección o entrada numérica para las tareas que lo requieran.

## 5. Datos y generación

Separa definición de plantilla, instancia generada y estado del alumno. Contrato sugerido, adaptable al proyecto:

```ts
type VisualExercise = {
  id: string;
  templateId: string;
  skillId: string;
  seed: string;
  locale: 'es' | 'en';
  params: Record<string, unknown>;
  prompt: { es: string; en: string };
  visualModel: Record<string, unknown>;
  interaction: 'build' | 'place' | 'color' | 'connect' | 'input' | 'compare';
  solution: Record<string, unknown>;
  hints: Array<{ es: string; en: string }>;
};
```

Los números se muestrean dentro de reglas de habilidad, no de forma indiscriminada. Usa semilla reproducible. Construye primero una solución válida y deriva de ella los datos del problema. Valida límites, unidades, divisibilidad, escala, partes iguales, cantidad visible y consistencia de respuesta antes de mostrarlo.

La instancia debe conservar sus datos al cambiar ES/EN. Usa traducciones revisadas de plantillas para la práctica habitual; no es necesario llamar a un modelo generativo en cada intento. Si se usa generación de relatos, validar sus datos contra la instancia matemática.

## 6. Ayudas, accesibilidad y estados

- Secuencia: comprender la consigna → manipular o representar → responder → ver relación con la operación.
- Tres ayudas progresivas: señalar dónde mirar; sugerir una estrategia; mostrar un ejemplo análogo o un paso resuelto. Después de responder, explicar el caso concreto.
- Ante un error, informar qué relación necesita revisión. No usar únicamente rojo, una cruz o un sonido.
- Incluir estados inicial, selección, movimiento, colocación válida, colocación inválida, ayuda y resolución.
- Alternativa a arrastrar: seleccionar objeto y luego destino. Añadir manejo por teclado y nombres accesibles de controles y zonas.
- Zonas táctiles de aproximadamente 44 × 44 px. Pocas animaciones cortas; respetar movimiento reducido. Nunca movimiento continuo mientras el niño cuenta.
- Modo Enfoque: reducir decoración y movimiento; mantener cantidades, escalas y contraste necesarios para resolver.
- Permitir lectura de la consigna. No convertir la velocidad lectora en requisito para demostrar una habilidad matemática.

## 7. Implementación y comprobación

Comienza con bandejas, grupos iguales y reparto, compartiendo objetos y recipientes. Continúa con valor posicional, recta, fracciones y barras. Completa las demás familias con el mismo contrato.

Añade una pantalla interna de revisión con una instancia de cada representación y controles para probar sus variaciones. No presentar datos técnicos ni semillas al niño.

Comprueba las reglas importantes y el recorrido completo: generar → dibujar → interactuar → validar → ayudar → cambiar idioma → siguiente ejercicio. Verifica que una ayuda no cambie los datos ni que un cambio de idioma reinicie la respuesta. En móvil, comprueba etiquetas, cantidades, zonas de toque y reflujo. Ejecuta las comprobaciones del proyecto y pruebas de las reglas matemáticas que tengan riesgo de producir ejercicios incorrectos.

Entrega al terminar: componentes y plantillas implementados, capturas reales de las representaciones, reglas de generación, ejemplos resueltos, comprobaciones realizadas y límites pendientes. No declarar listas las 12 familias si solo existe su interfaz visual.

## 8. Referencias funcionales consultadas

Estos enlaces sirven para estudiar representaciones y comportamientos. Diseña recursos propios y verifica permisos antes de incorporar contenido ajeno.

- Marcos de conteo: https://www.mathlearningcenter.org/apps/number-frames
- Bloques de base diez: https://www.mathlearningcenter.org/apps/number-pieces
- Barras y círculos de fracciones: https://www.mathlearningcenter.org/apps/fractions

Los ejemplos y la dirección gráfica de esta propuesta son de KiteWise; los rangos de grado son orientativos y requieren alineación curricular antes de publicación.

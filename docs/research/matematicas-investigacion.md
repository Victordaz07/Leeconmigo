# Kitewise — Investigación y diseño del cuaderno de Matemáticas

**Fecha de consulta:** 15 de octubre de 2026, California. **Versión:** 1.0, propuesta para revisión docente. **Destinatarios:** contenido, diseño y desarrollo. **Archivo de destino sugerido:** `docs/research/matematicas-investigacion.md`.

Este informe desarrolla los diez entregables del archivo de encargo: 37 unidades, 111 retos originales en español e inglés, prerrequisitos por habilidad y una unidad de 3.º serializada en JSON. Es un diseño de práctica complementaria en casa; no constituye certificación curricular, currículo escolar completo ni demostración de eficacia de Kitewise. Los tres retos de cada ficha son muestras de autoría, no un banco suficiente para cubrir todas sus habilidades.

**Cómo leer la evidencia.** [Sxx] remite a un enlace de la bibliografía. «Fuerte/moderada/mínima WWC» reproduce la calificación de una recomendación de esa guía, para la población y condiciones que estudió; no califica automáticamente una app. «Propuesta» identifica decisiones originales que necesitan pilotaje. Los rangos de generación, la secuencia, las pistas y los umbrales de dominio son propuestas, salvo que se identifiquen como límites de un estándar. No se atribuyen a la investigación duraciones o porcentajes que no ha establecido.

## 1. Resumen ejecutivo

1. **Un grafo de habilidades, no una escalera por edad.** Conservar `grade` como referencia curricular y un `practiceLevel` independiente elegido por la familia. Recomendar prerrequisitos concretos sin retirar acceso a los temas del grado escolar. [S01, S02]
2. **Prioridad a relaciones numéricas.** En 1.º–2.º, suma/resta y valor posicional; en 3.º–5.º, multiplicación/división y fracciones; en 6.º, razones, racionales y álgebra inicial. Reservar práctica real a medición, geometría y datos. La clasificación de foco proviene de SAP, no es un mandato nuevo de California. [S04a–f]
3. **Comprender, calcular y aplicar.** Cada habilidad necesita un modelo, una tarea simbólica y una transferencia; tocar fichas o acertar opciones por sí solo no prueba comprensión. [S01, S05]
4. **Enseñar explícitamente con exploración guiada.** Mostrar un ejemplo corto, permitir experimentar y conectar la acción con la ecuación. No hacer que un niño con pocos prerrequisitos descubra todo solo. [S05]
5. **Bilingüismo por diseño.** Contenido natural en ambos idiomas; progreso matemático compartido y necesidades de lenguaje separadas. Audio opcional, sin reconocimiento de voz ni penalización por escucharlo. [S10, S11]
6. **Fluidez sin carrera obligatoria.** Evaluar precisión, elección de estrategia y retención. No usar cuenta regresiva, tablas de velocidad o rapidez como puerta de avance. Hay evidencia favorable a práctica cronometrada en ciertas intervenciones; no permite afirmar que todo cronometraje sea dañino. [S05, S09, S16]
7. **Los 8/15/20 minutos son presupuestos flexibles.** Incluir calentamiento y cierre; tratar 25/25/35/15 como orientación de la parte central. Una sesión de ocho minutos consolida una idea pequeña; no comprime una unidad entera. [S08; propuesta]
8. **Dominio distribuido.** Proponer al menos diez oportunidades independientes en tres días, ocho aciertos, diversidad de tareas y comprobación demorada. Nunca promover por repetir una respuesta después de verla. Es un umbral inicial de producto, no un estándar científico. [S08; propuesta]
9. **Repaso 1–3–7 con continuidad.** Respetar esos retornos; añadir comprobaciones a 14 y 30 días. Limitar la cola diaria y llevar tareas vencidas a la próxima sesión disponible, sin castigo por ausencias. [S08; propuesta]
10. **Contenido original y revisión antes de publicar.** Validar códigos y adiciones CA, accesibilidad, lectura de audio y generadores. IM primera edición y v.360 tienen licencias diferentes; material gratuito no equivale a reutilizable comercialmente. [S01, S24, S25, S26]

## 2. Alcance y secuencia por grado (1.º–6.º)

### Marco y límites de la alineación

Los CA CCSSM definen resultados por grado; el Framework ofrece orientación de enseñanza. El Framework de 2023 mantiene el trabajo con esos estándares e intensifica la organización por ideas conectadas, investigación, razonamiento, participación y acceso equitativo. No convierte la fluidez conceptual en opcional ni elimina los algoritmos exigidos en grados determinados. Frente a 2013, el cambio útil para Kitewise es conectar tareas por una idea y ofrecer varias formas de expresar una relación, no presentar una lista aislada de destrezas. [S01, S02, S03, S28]

**Implicaciones propuestas:** organizar una sesión de grupos iguales para que conecte dibujo, producto y situación; alternar explicar por selección, construir un modelo y calcular; incluir ejemplos y contraejemplos; permitir idioma del hogar. Una app individual sin respuestas por voz solo captura parte de la argumentación; ofrecer conversación opcional con un adulto, sin grabarla. Mantener tareas por toque para el niño.

**Dominios oficiales utilizados:** `Operations & Algebraic Thinking (OA)`, `Number & Operations in Base Ten (NBT)`, `Number & Operations—Fractions (NF)`, `Measurement & Data (MD)`, `Geometry (G)` en primaria, según grado; en 6.º `Ratios & Proportional Relationships (RP)`, `The Number System (NS)`, `Expressions & Equations (EE)`, `Geometry (G)`, `Statistics & Probability (SP)`. NF comienza como dominio propio en 3.º. En 6.º, el nombre SP no autoriza adelantar probabilidad formal de 7.º. [S01]

**Foco:** C = central, A = apoyo, Ad = adicional. SAP clasifica por *clusters*, de modo que una unidad puede mezclar categorías. Estas etiquetas no equivalen a prioridad para un niño específico ni a una secuencia obligatoria. La distribución de sesiones propuesta es 75/25 entre central y el conjunto de apoyo/adicional en 1.º–2.º, y 70/30 en 3.º–6.º, ajustable por necesidades; no dedicar ese porcentaje a ejercicios descontextualizados. [S04a–f; propuesta]

| Grado de referencia | Mayor parte de práctica en casa | Límites especialmente importantes |
| --- | --- | --- |
| 1.º | Relaciones aditivas hasta 20, fluidez hasta 10, decenas y unidades, longitud | Contar hasta 120 no implica enseñar formalmente centenas; no algoritmo estándar como condición de éxito. |
| 2.º | Problemas aditivos, fluidez hasta 20 y 100 según tarea, valor hasta 1000 y medición | Memoria de sumas de una cifra; arreglos preparan multiplicación. California añade conteo de 2 en 2 y estimación en 2.NBT.7.1. |
| 3.º | Grupos/división, hechos básicos, fracciones como números, área y medidas | Fluidez de productos de dos números de una cifra y divisiones relacionadas; fracciones con denominadores 2,3,4,6,8. |
| 4.º | Operaciones de varias cifras y fracciones | Algoritmo estándar de suma/resta; multiplicación y división explicadas mediante estrategias/modelos. |
| 5.º | Fracciones, decimales, división y volumen | Algoritmo estándar de multiplicación de enteros; división fraccionaria limitada a fracción unitaria÷entero o entero÷fracción unitaria. |
| 6.º | División de fracciones, razones y porcentajes, racionales, expresiones/ecuaciones | Operaciones generales con negativos no se exigen aquí; división estándar y algoritmos decimales son metas explícitas. |

Fuentes de límites: [S01]; clasificación de foco: [S04a–f]. La secuencia de las tablas es original. Las adiciones CA requieren cotejo final con un docente; no se anuncian estándares «certificados».

### Prerrequisitos y confianza

Cada ID `gNuM.sK` identifica la habilidad K de una unidad. La tabla resume entradas externas; la ficha detalla enlaces dentro de la unidad. `base.*` identifica puentes sin grado: `count10` contar y conservar cantidad hasta 10; `count12` reconocer 1–12; `count20` contar hasta 20; `compare` comparar directamente dos objetos; `shapes` reconocer objetos y formas simples. Se comprueban con 2–3 tareas por toque, ofreciendo apoyo, sin producir una nota ni diagnóstico.

«Alta» significa que el código existe y corresponde ampliamente al contenido propuesto, no que cada ejemplo cubra el estándar completo. «Media» se reserva para una subhabilidad, una interpretación local o una evidencia de aprendizaje aún parcial; «baja» significa que no debe publicarse la asociación sin corregirla. Los códigos se ven solo en el panel de padres y siempre como **borrador pendiente de validación docente**.

Las habilidades atómicas están identificadas en las fichas. Los códigos en una fila son candidatos a nivel de unidad; producción requiere asociar cada reto a un estándar principal y registrar qué parte del estándar evidencia. No mostrar todos los códigos de una unidad como si cada reto los evaluara.

### 1.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g1u1 — Contar y construir decenas | Contar desde cualquier número hasta 120; Relacionar cantidad y numeral hasta 120; Componer una decena y números 11–19; Representar dos cifras como decenas y unidades; Comparar dos números de dos cifras | 1.NBT.1, 1.NBT.2, 1.NBT.3 | base.count10, base.count20 | C | Alta de correspondencia general; borrador |
| g1u2 — Sumar, restar y entender la igualdad | Juntar y separar cantidades hasta 10; Contar hacia adelante para sumar; Completar diez y usar dobles dentro de 20; Restar usando un sumando desconocido; Reconocer igualdad y hallar un número que falta; Resolver cambio, partes y comparación con incógnitas en distintas posiciones; Sumar tres números y reagrupar sin cambiar el total | 1.OA.1, 1.OA.2, 1.OA.3, 1.OA.4, 1.OA.5, 1.OA.6, 1.OA.7, 1.OA.8 | base.count10, g1u1.s3 | C | Alta de correspondencia general; borrador |
| g1u3 — Operar con decenas y unidades | Hallar diez más y diez menos de un número de dos cifras; Sumar un número de dos cifras y uno de una cifra sin canje; Sumar con un canje de unidades por decena; Sumar un múltiplo de diez a dos cifras; Restar múltiplos de diez entre 10 y 90 | 1.NBT.4, 1.NBT.5, 1.NBT.6 | g1u1.s4, g1u2.s2, g1u2.s3, g1u2.s4 | C | Alta de correspondencia general; borrador |
| g1u4 — Medir longitudes | Ordenar tres objetos por longitud; Comparar indirectamente usando un tercer objeto; Repetir una unidad desde un mismo inicio; Contar unidades sin huecos ni superposiciones | 1.MD.1, 1.MD.2 | base.compare, base.count10 | C | Alta de correspondencia general; borrador |
| g1u5 — Leer datos y horas | Clasificar datos en hasta tres categorías; Comparar cantidades y totales de categorías; Leer y escribir horas en punto en reloj analógico y digital; Leer y escribir medias horas | 1.MD.3, 1.MD.4 | base.count10, base.count12, g1u2.s6 | A para datos; Ad para tiempo | Alta de correspondencia general; borrador |
| g1u6 — Construir figuras y partes iguales | Reconocer atributos que definen una figura; Componer figuras planas; Componer sólidos sencillos; Dividir círculos y rectángulos en mitades y cuartos; Reconocer que más partes iguales producen partes menores del mismo entero | 1.G.1, 1.G.2, 1.G.3 | base.shapes | Ad | Alta de correspondencia general; borrador |

### 2.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g2u1 — Centenas y números hasta 1000 | Canjear diez decenas por una centena; Leer y escribir hasta 1000 y forma desarrollada; Comparar tres cifras; Contar de 2, 5, 10 y 100 dentro de 1000; Hallar mentalmente ±10 y ±100 desde 100…900 | 2.NBT.1, 2.NBT.2, 2.NBT.3, 2.NBT.4, 2.NBT.8 | g1u1.s4, g1u1.s5, g1u3.s1 | C | Alta de correspondencia general; borrador |
| g2u2 — Suma y resta con estrategias | Recuperar sumas de una cifra y restas relacionadas dentro de 20; Sumar y restar con fluidez dentro de 100; Sumar hasta cuatro números de dos cifras; Sumar dentro de 1000 con modelos; Restar dentro de 1000 con descomposición; Estimar y explicar por qué funciona una estrategia | 2.OA.2, 2.NBT.5, 2.NBT.6, 2.NBT.7, 2.NBT.7.1, 2.NBT.9 | g1u2.s4, g1u3.s3, g2u1.s2 | C | Alta de correspondencia general; borrador |
| g2u3 — Problemas y grupos iguales | Resolver cambio con inicio o cambio desconocido; Resolver comparación con cantidad menor o mayor desconocida; Resolver problemas de dos pasos dentro de 100; Identificar pares e impares hasta 20; Representar arreglos de hasta 5 filas y 5 columnas como suma repetida | 2.OA.1, 2.OA.3, 2.OA.4 | g1u2.s1, g1u2.s6, g2u2.s2 | C para problemas; A para grupos | Alta de correspondencia general; borrador |
| g2u4 — Medición y recta numérica | Elegir herramienta y unidad: in, ft, cm, m; Medir una longitud con dos tamaños de unidad; Estimar longitudes y hallar diferencias; Representar sumas y restas en recta dentro de 100; Resolver problemas de longitudes en la misma unidad | 2.MD.1, 2.MD.2, 2.MD.3, 2.MD.4, 2.MD.5, 2.MD.6 | g1u2.s4, g1u4.s4, g2u2.s2 | C | Alta de correspondencia general; borrador |
| g2u5 — Dinero, relojes y datos | Leer horas a cinco minutos y distinguir a.m./p.m.; Identificar monedas y sumar centavos; Resolver problemas con dólares o centavos; Medir a la pulgada o centímetro más cercano y hacer diagrama de puntos; Crear y leer pictogramas y barras de escala uno hasta cuatro categorías | 2.MD.7, 2.MD.8, 2.MD.9, 2.MD.10 | g1u5.s2, g1u5.s4, g2u1.s4, g2u2.s2, g2u3.s3, g2u4.s1 | A para dinero/datos; Ad para tiempo | Alta de correspondencia general; borrador |
| g2u6 — Figuras, mosaicos y fracciones orales | Reconocer triángulos, cuadriláteros, pentágonos, hexágonos y cubos por atributos; Partir un rectángulo en filas y columnas de cuadrados iguales; Contar cuadrados de un mosaico; Partir círculos y rectángulos en 2, 3 o 4 áreas iguales; Reconocer partes iguales con formas diferentes | 2.G.1, 2.G.2, 2.G.3 | g1u6.s1, g1u6.s4, g2u3.s5 | Ad | Alta de correspondencia general; borrador |

### 3.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g3u1 — Multiplicar con grupos y arreglos | Identificar número de grupos y cantidad por grupo; Relacionar grupos con producto; Construir y leer arreglos rectangulares; Resolver un problema de producto desconocido | 3.OA.1, 3.OA.3 | g2u3.s5 | C | Alta de correspondencia general; borrador |
| g3u2 — Dividir y construir fluidez | Repartir un total en un número conocido de grupos iguales; Encontrar cuántos grupos de tamaño conocido caben; Hallar factor o cociente desconocido; Usar conmutativa, asociativa y distributiva; Recuperar productos de dos números de una cifra y divisiones relacionadas; Explicar patrones de operaciones | 3.OA.2, 3.OA.3, 3.OA.4, 3.OA.5, 3.OA.6, 3.OA.7, 3.OA.9 | g3u1.s2, g3u1.s3 | C | Alta de correspondencia general; borrador |
| g3u3 — Números y problemas de dos pasos | Redondear a decena o centena cercana; Sumar y restar con fluidez dentro de 1000; Multiplicar una cifra por múltiplos de diez entre 10 y 90; Resolver dos pasos con cuatro operaciones e incógnita; Estimar para comprobar razonabilidad | 3.NBT.1, 3.NBT.2, 3.NBT.3, 3.OA.8 | g2u1.s3, g2u1.s4, g2u2.s6, g2u3.s3, g3u2.s3, g3u2.s4 | Ad para NBT; C para problemas | Alta de correspondencia general; borrador |
| g3u4 — Fracciones como números | Reconocer una fracción unitaria como una parte de b partes iguales; Construir a/b a partir de unidades 1/b; Ubicar fracciones en recta, incluso mayores que uno; Reconocer equivalencias y enteros como fracciones; Comparar fracciones con numerador o denominador común | 3.NF.1, 3.NF.2, 3.NF.3, 3.G.2 | g2u4.s4, g2u6.s4 | C para NF; A para geometría | Alta de correspondencia general; borrador |
| g3u5 — Área, perímetro y cuadriláteros | Cubrir sin huecos con unidades cuadradas; Calcular área rectangular como producto; Descomponer áreas para usar distributiva y suma; Hallar perímetro y lado desconocido; Comparar misma área/distinto perímetro y viceversa; Clasificar cuadriláteros por atributos compartidos | 3.MD.5, 3.MD.6, 3.MD.7, 3.MD.8, 3.G.1 | g2u6.s1, g2u6.s3, g3u1.s3, g3u2.s4, g3u3.s2 | C para área; Ad para perímetro; A para geometría | Alta de correspondencia general; borrador |
| g3u6 — Tiempo, masa, capacidad y gráficas | Leer y escribir hora al minuto y calcular intervalos; Estimar y operar masas y volúmenes líquidos en g, kg y L; Interpretar pictogramas y barras escalados; Medir a media y cuarta pulgada; Construir e interpretar diagrama de puntos con medias y cuartas unidades | 3.MD.1, 3.MD.2, 3.MD.3, 3.MD.4 | g2u4.s1, g2u4.s4, g2u5.s1, g2u5.s5, g3u2.s5, g3u3.s4, g3u4.s2 | C para tiempo/masa/capacidad; A para datos | Alta de correspondencia general; borrador |

### 4.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g4u1 — Valor posicional, factores y patrones | Leer y escribir números hasta 1000000; Explicar que una posición vale diez veces la posición a su derecha; Comparar y redondear números de varias cifras; Sumar y restar con algoritmo estándar; Hallar factores, múltiplos y reconocer primos/compuestos de 1…100; Generar y explicar un patrón por una regla | 4.NBT.1, 4.NBT.2, 4.NBT.3, 4.NBT.4, 4.OA.4, 4.OA.5 | g2u1.s2, g3u2.s5, g3u2.s6, g3u3.s1, g3u3.s2 | C para NBT; A para factores; Ad para patrones | Alta de correspondencia general; borrador |
| g4u2 — Multiplicar, dividir e interpretar residuos | Interpretar comparación multiplicativa frente a aditiva; Resolver comparación multiplicativa con incógnita; Multiplicar hasta cuatro cifras por una y dos cifras por dos; Dividir hasta cuatro cifras entre una con modelos y cocientes parciales; Interpretar residuo según contexto; Resolver problemas de varios pasos y estimar | 4.OA.1, 4.OA.2, 4.OA.3, 4.NBT.5, 4.NBT.6 | g3u1.s4, g3u2.s3, g3u3.s3, g3u3.s5, g4u1.s2 | C | Alta de correspondencia general; borrador |
| g4u3 — Equivalencia y operaciones con fracciones | Generar equivalencias multiplicando numerador y denominador; Comparar fracciones con denominadores distintos; Sumar y restar fracciones del mismo denominador; Componer, descomponer y operar números mixtos con igual denominador; Multiplicar una fracción por un entero; Resolver problemas con esas operaciones y modelos | 4.NF.1, 4.NF.2, 4.NF.3, 4.NF.4 | g3u1.s4, g3u4.s2, g3u4.s4, g3u4.s5, g4u1.s5 | C | Alta de correspondencia general; borrador |
| g4u4 — Décimos, centésimos y decimales | Renombrar décimos como centésimos; Sumar décimos y centésimos con denominador común; Escribir fracciones de décimos y centésimos como decimales; Ubicar decimales en recta; Comparar dos decimales hasta centésimos | 4.NF.5, 4.NF.6, 4.NF.7 | g3u4.s3, g4u3.s1, g4u3.s3 | C | Alta de correspondencia general; borrador |
| g4u5 — Medidas, dinero y datos fraccionarios | Conocer equivalencias dentro del mismo sistema de medida; Convertir una unidad mayor a una menor; Resolver problemas de distancia, tiempo, masa, volumen y dinero; Usar fórmulas de área y perímetro rectangular; Leer y operar datos en diagramas de puntos de 1/2, 1/4 y 1/8 | 4.MD.1, 4.MD.2, 4.MD.3, 4.MD.4 | g2u4.s2, g3u5.s5, g3u6.s5, g4u2.s3, g4u2.s6, g4u3.s3, g4u4.s3 | A | Alta de correspondencia general; borrador |
| g4u6 — Ángulos, rectas y simetría | Distinguir puntos, segmentos, rectas y rayos; Reconocer paralelas y perpendiculares; Entender grado como 1/360 de vuelta; Medir y dibujar ángulos con transportador; Usar aditividad de ángulos para hallar uno desconocido; Clasificar triángulos y cuadriláteros por atributos; Identificar ejes de simetría | 4.MD.5, 4.MD.6, 4.MD.7, 4.G.1, 4.G.2, 4.G.3 | g3u4.s1, g3u5.s6, g4u1.s4 | Ad | Alta de correspondencia general; borrador |

### 5.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g5u1 — Valor posicional decimal | Explicar posiciones como diez veces y una décima parte; Interpretar potencias de diez y patrones al multiplicar/dividir por ellas; Leer y escribir hasta milésimos y forma desarrollada; Comparar hasta milésimos; Redondear decimales a una posición indicada | 5.NBT.1, 5.NBT.2, 5.NBT.3, 5.NBT.4 | g4u1.s2, g4u1.s3, g4u4.s3 | C | Alta de correspondencia general; borrador |
| g5u2 — Operaciones con enteros y decimales | Multiplicar enteros de varias cifras con algoritmo estándar; Dividir hasta cuatro cifras entre dos cifras con estrategias; Sumar y restar decimales hasta centésimos; Multiplicar decimales hasta centésimos con modelos y estrategias; Dividir decimales hasta centésimos con modelos y estrategias; Explicar la razonabilidad y relación inversa | 5.NBT.5, 5.NBT.6, 5.NBT.7 | g4u1.s4, g4u2.s3, g4u2.s4, g5u1.s1, g5u1.s3 | C | Alta de correspondencia general; borrador |
| g5u3 — Sumar fracciones y entender el cociente | Encontrar fracciones equivalentes con denominador común; Sumar fracciones y mixtos con denominadores distintos; Restar fracciones y mixtos con denominadores distintos; Resolver problemas y estimar con referencias como 1/2 y 1; Interpretar a/b como a÷b en reparto | 5.NF.1, 5.NF.2, 5.NF.3 | g3u2.s1, g4u3.s1, g4u3.s2, g4u3.s4 | C | Alta de correspondencia general; borrador |
| g5u4 — Multiplicar fracciones y dividir por unidades fraccionarias | Interpretar una fracción de una cantidad; Multiplicar fracción por fracción con modelo; Relacionar producto fraccionario con área rectangular; Explicar producto mayor/igual/menor según factor comparado con uno; Resolver problemas de producto con fracciones y mixtos; Dividir fracción unitaria por entero; Dividir entero por fracción unitaria | 5.NF.4, 5.NF.5, 5.NF.6, 5.NF.7 | g3u5.s2, g4u3.s5, g5u3.s1, g5u3.s5 | C | Alta de correspondencia general; borrador |
| g5u5 — Volumen, conversiones y datos | Medir volumen con cubos unitarios sin huecos; Calcular volumen como capas y l×w×h; Sumar volúmenes de prismas sin solapamiento; Convertir unidades dentro de un sistema en ambos sentidos; Resolver datos de diagrama de puntos con medidas de 1/2, 1/4 y 1/8 | 5.MD.1, 5.MD.2, 5.MD.3, 5.MD.4, 5.MD.5 | g3u5.s2, g4u5.s2, g4u5.s5, g5u2.s1, g5u2.s5, g5u3.s3 | C para volumen; A para conversiones/datos | Alta de correspondencia general; borrador |
| g5u6 — Expresiones, coordenadas y familias de figuras | Evaluar expresiones con paréntesis, corchetes y llaves; Escribir una expresión sin evaluarla; Generar dos patrones, formar pares y explicar relación; Ubicar pares ordenados en primer cuadrante; Interpretar puntos en un contexto; Reconocer herencia de atributos de subcategorías de figuras; Construir jerarquías geométricas | 5.OA.1, 5.OA.2, 5.OA.3, 5.G.1, 5.G.2, 5.G.3, 5.G.4 | g2u4.s4, g3u3.s4, g4u1.s6, g4u6.s6, g5u2.s1 | Ad | Alta de correspondencia general; borrador |

### 6.º grado — secuencia propuesta

| Unidad | Habilidades atómicas (resumen) | CA CCSSM candidato | Prerrequisitos de entrada | Central/apoyo/adicional | Confianza del código |
| --- | --- | --- | --- | --- | --- |
| g6u1 — División de fracciones y cálculo con varios dígitos | Interpretar y calcular fracción entre fracción; Resolver problemas de división de fracciones; Dividir enteros de varias cifras con algoritmo estándar; Operar decimales con algoritmos estándar; Hallar MCD de dos enteros≤100 y mcm de dos enteros≤12; Usar distributiva para extraer factor común | 6.NS.1, 6.NS.2, 6.NS.3, 6.NS.4 | g3u2.s4, g4u1.s5, g5u2.s2, g5u2.s6, g5u4.s2, g5u4.s7 | C para división de fracciones; Ad para cálculo/factores | Alta de correspondencia general; borrador |
| g6u2 — Razones, tasas y porcentajes | Describir razón parte-parte y parte-total; Construir tablas y rectas dobles de razones equivalentes; Hallar tasa por una unidad y comparar precios/velocidad; Interpretar porcentaje como razón por cien; Hallar parte, porcentaje o total a partir de los otros; Convertir unidades con razonamiento de razones | 6.RP.1, 6.RP.2, 6.RP.3 | g4u2.s2, g4u4.s3, g5u2.s5, g5u4.s2, g5u5.s4, g5u6.s4 | C | Alta de correspondencia general; borrador |
| g6u3 — Racionales, valor absoluto y coordenadas | Interpretar positivos, negativos y cero en contextos; Identificar opuestos y ubicar racionales; Comparar racionales y escribir desigualdades; Interpretar valor absoluto como distancia a cero; Ubicar puntos y reflejos en cuatro cuadrantes; Hallar distancia entre puntos con coordenada común | 6.NS.5, 6.NS.6, 6.NS.7, 6.NS.8 | g3u4.s3, g5u1.s4, g5u6.s4 | C | Alta de correspondencia general; borrador |
| g6u4 — Expresiones y estructura algebraica | Evaluar potencias con exponentes enteros no negativos en casos iniciales positivos; Escribir expresiones desde un contexto; Identificar términos, factores, coeficientes y operaciones; Sustituir valores y evaluar expresiones; Generar expresiones equivalentes con propiedades; Reconocer equivalencia para todos los valores permitidos | 6.EE.1, 6.EE.2, 6.EE.3, 6.EE.4 | g5u1.s2, g5u6.s1, g5u6.s2, g6u1.s6 | C | Alta de correspondencia general; borrador |
| g6u5 — Ecuaciones, desigualdades y relaciones | Comprobar si un valor satisface ecuación o desigualdad; Escribir ecuación para una situación; Resolver x+p=q y px=q con racionales no negativos; Representar x>c y x<c en recta y reconocer infinitas soluciones; Identificar variable independiente y dependiente; Relacionar ecuación, tabla y gráfica de dos variables | 6.EE.5, 6.EE.6, 6.EE.7, 6.EE.8, 6.EE.9 | g5u6.s5, g6u1.s1, g6u2.s2, g6u3.s3, g6u4.s2, g6u4.s4 | C | Alta de correspondencia general; borrador |
| g6u6 — Área, superficie y volumen | Derivar y usar área de triángulo y paralelogramo; Descomponer polígonos para calcular área; Calcular volumen de prisma rectangular con aristas fraccionarias; Trazar polígonos en coordenadas y hallar lados alineados a ejes; Relacionar redes de sólidos con caras; Calcular área superficial desde una red | 6.G.1, 6.G.2, 6.G.3, 6.G.4 | g2u6.s1, g3u5.s3, g5u4.s2, g5u4.s3, g5u5.s2, g6u3.s6 | A | Alta de correspondencia general; borrador |
| g6u7 — Preguntas estadísticas y distribuciones | Distinguir pregunta estadística que anticipa variación; Representar datos en puntos, histogramas y cajas; Calcular e interpretar media y mediana; Calcular rango intercuartílico y desviación media absoluta; Describir tamaño de muestra, unidad, forma, centro, dispersión y valores inusuales; Elegir medidas según distribución y contexto | 6.SP.1, 6.SP.2, 6.SP.3, 6.SP.4, 6.SP.5 | g3u6.s3, g5u5.s5, g6u1.s4 | Ad | Alta de correspondencia general; borrador |


### Razonamiento transversal y cobertura

En cada grado incluir las ocho `Standards for Mathematical Practice`: comprender/perseverar; razonar con cantidades y símbolos; argumentar/criticar; modelar; elegir herramientas; precisión; estructura; regularidad. Una propuesta por toque: elegir cuál explicación justifica un resultado, reparar un modelo, seleccionar herramienta y comparar dos procedimientos. No confundir seleccionar una explicación con producir una argumentación completa. [S01]

**Control editorial de cobertura:** las tablas reúnen los dominios y los estándares numéricos principales de los seis grados; no reemplazan una auditoría estándar por estándar y subapartado por subapartado. La autoría posterior debe añadir ítems para cada habilidad: un reto introductorio, dos o más formas de práctica y transferencia demorada. El banco ilustrativo de tres retos por unidad no basta para esa auditoría. También falta la validación externa de progresión, lenguaje, carga y accesibilidad; son condiciones de publicación, no trabajo supuestamente realizado.

## 3. Ficha por unidad

**Convenciones comunes.** Todos los retos, pistas y escenas siguientes son propuestas originales. En cada reto H1 orienta sin revelar; H2 resuelve un ejemplo distinto; H3 explica la respuesta del reto. La app muestra solo un idioma cada vez. Audio y texto usan el mismo contenido matemático. Cada unidad incluye objetivo para familia en español y para el niño en ambos idiomas.

**CRA:** el primer paso físico es opcional en casa; un manipulativo de pantalla es virtual, no un sustituto físicamente idéntico. La progresión va y vuelve entre objetos, imágenes y símbolos; no obliga a superar tres etapas rígidas. La conexión entre representaciones se apoya en [S05, S08]; los detalles de interfaz son propuestas.

**Autoría gráfica:** ninguna escena artística contiene números, letras, etiquetas, escalas, divisiones geométricas de evaluación o marcas de moneda necesarias para resolver. Esos elementos se renderizan como texto/objetos matemáticos de la app, con tamaños y proporciones exactos. Una ilustración generada no es fuente de verdad para un área, ángulo o conteo.

### Unidades de 1.º grado

#### g1u1 — Contar y construir decenas

**Estándares candidatos:** 1.NBT.1, 1.NBT.2, 1.NBT.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Reconocer cantidades y explicar el valor de cada cifra. EN: Recognize quantities and explain the value of each digit.

**Objetivo para el niño:** ES: «Agrupo de diez en diez.» EN: “I can build numbers with tens and ones.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u1.s1 | Contar desde cualquier número hasta 120 | base.count20 |
| g1u1.s2 | Relacionar cantidad y numeral hasta 120 | g1u1.s1 |
| g1u1.s3 | Componer una decena y números 11–19 | base.count10 |
| g1u1.s4 | Representar dos cifras como decenas y unidades | g1u1.s3 |
| g1u1.s5 | Comparar dos números de dos cifras | g1u1.s4 |

**Concepción errónea y distractor para detectarla:** En 42, elegir 4 como valor del 4 detecta confusión cifra/valor; incluir 40 y 2. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Fichas físicas opcionales → grupos de diez dibujados → 42 = 40 + 2.

**Explorar:** DragZone agrupa diez fichas con un toque de canje. **Practicar:** Teclado y selección de representaciones; no contar 120 objetos uno por uno.

**Tres retos bilingües originales:**

**Reto 1.** ES: Hay 1 decena y 6 unidades. ¿Qué número es? EN: What number has 1 ten and 6 ones?

**Respuesta:** 16.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Una decena vale diez. | One ten is ten ones. |
| H2 — ejemplo resuelto distinto | 1 decena y 4 unidades: 10 + 4 = 14. | 1 ten and 4 ones make 10 + 4 = 14. |
| H3 — respuesta explicada | 10 + 6 = 16: una decena y seis unidades. | 10 + 6 = 16, so the number is sixteen. |

**Reto 2.** ES: ¿Qué número sigue después de 79? EN: What number comes right after 79?

**Respuesta:** 80.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Al terminar las unidades, forma otra decena. | After nine ones, make another ten. |
| H2 — ejemplo resuelto distinto | Después de 69 viene 70. | The number after 69 is 70. |
| H3 — respuesta explicada | 79 + 1 = 80; se completa una nueva decena. | 79 + 1 = 80. The ones complete a new ten. |

**Reto 3.** ES: Elige el mayor: 42 o 37. EN: Which is greater, 42 or 37?

**Respuesta:** 42.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara primero las decenas. | Compare the tens first. |
| H2 — ejemplo resuelto distinto | 51 es mayor que 48 porque tiene 5 decenas, no 4. | 51 is greater than 48 because it has 5 tens instead of 4. |
| H3 — respuesta explicada | 42 tiene 4 decenas y 37 tiene 3; 42 es mayor. | 42 has 4 tens and 37 has 3, so 42 is greater. |

**Plantilla de generación:** n=0…120 para conteo; valor posicional y comparación=10…99. Mantener ceros internos y variar la cifra de unidades; no exigir centenas bajo 1.NBT.2. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** ten/decena; ones/unidades; digit/cifra; greater than/mayor que.

**Brief de ilustración:** Mesa con bandejas y fichas neutras; las cantidades y etiquetas las dibuja la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g1u2 — Sumar, restar y entender la igualdad

**Estándares candidatos:** 1.OA.1, 1.OA.2, 1.OA.3, 1.OA.4, 1.OA.5, 1.OA.6, 1.OA.7, 1.OA.8. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Resolver relaciones de suma y resta dentro de 20, con fluidez dentro de 10. EN: Solve addition and subtraction relationships within 20 and build fluency within 10.

**Objetivo para el niño:** ES: «Busco cómo se relacionan los números.» EN: “I can connect addition and subtraction.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u2.s1 | Juntar y separar cantidades hasta 10 | base.count10 |
| g1u2.s2 | Contar hacia adelante para sumar | g1u2.s1 |
| g1u2.s3 | Completar diez y usar dobles dentro de 20 | g1u1.s3, g1u2.s2 |
| g1u2.s4 | Restar usando un sumando desconocido | g1u2.s3 |
| g1u2.s5 | Reconocer igualdad y hallar un número que falta | g1u2.s1 |
| g1u2.s6 | Resolver cambio, partes y comparación con incógnitas en distintas posiciones | g1u2.s4, g1u2.s5 |
| g1u2.s7 | Sumar tres números y reagrupar sin cambiar el total | g1u2.s3 |

**Concepción errónea y distractor para detectarla:** En 8 + 4 = □ + 5, elegir 12 detecta interpretar = como «escribe el resultado»; la solución es 7. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Objetos → marcos de diez y barras parte/total → ecuaciones en ambos sentidos.

**Explorar:** PaintGrid de dos marcos y balanza de igualdad. **Practicar:** Teclado, completar ecuación y elegir modelo; no asociar palabra clave con operación.

**Tres retos bilingües originales:**

**Reto 1.** ES: Tienes 8 fichas y recibes 5. ¿Cuántas tienes ahora? EN: You have 8 counters and get 5 more. How many do you have now?

**Respuesta:** 13.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Usa parte del 5 para completar diez. | Use part of 5 to make ten. |
| H2 — ejemplo resuelto distinto | 8 + 4 = 8 + 2 + 2 = 12. | For 8 + 4, make 10 with 2, then add the other 2: 12. |
| H3 — respuesta explicada | 8 + 5 = 8 + 2 + 3 = 13. | 8 + 5 = 10 + 3 = 13 counters. |

**Reto 2.** ES: Hay 14 crayones. Guardas 6. ¿Cuántos quedan fuera? EN: There are 14 crayons. You put 6 away. How many are still out?

**Respuesta:** 8.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Puedes pensar: 6 más cuánto es 14. | Think: 6 plus what makes 14? |
| H2 — ejemplo resuelto distinto | Para 13 − 6, cuenta de 6 a 13: faltan 7. | For 13 − 6, count up from 6 to 13. That is 7. |
| H3 — respuesta explicada | 6 + 8 = 14, así que 14 − 6 = 8. | Since 6 + 8 = 14, there are 8 crayons left. |

**Reto 3.** ES: Completa: 7 + 3 = □ + 4. EN: Fill in the blank: 7 + 3 = □ + 4.

**Respuesta:** 6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Los dos lados deben valer lo mismo. | Both sides need the same value. |
| H2 — ejemplo resuelto distinto | En 5 + 4 = □ + 2, el total es 9; falta 7. | In 5 + 4 = □ + 2, both sides must be 9, so the blank is 7. |
| H3 — respuesta explicada | 7 + 3 = 10 y 6 + 4 = 10; falta 6. | 7 + 3 and 6 + 4 both equal 10. The blank is 6. |

**Plantilla de generación:** a,b=0…10; a+b≤20; restas con resultado no negativo. Tres sumandos de una cifra, total≤20. Variar posición de incógnita; separar fluidez≤10 de estrategias≤20. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** sum/suma o total; difference/diferencia; equal/igual; missing number/número que falta.

**Brief de ilustración:** Niños organizan materiales de arte; objetos matemáticos como capas independientes. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g1u3 — Operar con decenas y unidades

**Estándares candidatos:** 1.NBT.4, 1.NBT.5, 1.NBT.6. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Sumar dentro de 100 y explicar cambios de diez en diez. EN: Add within 100 and explain changes of ten.

**Objetivo para el niño:** ES: «Uso las decenas para calcular.» EN: “I can use tens to add and subtract.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u3.s1 | Hallar diez más y diez menos de un número de dos cifras | g1u1.s4 |
| g1u3.s2 | Sumar un número de dos cifras y uno de una cifra sin canje | g1u2.s2, g1u1.s4 |
| g1u3.s3 | Sumar con un canje de unidades por decena | g1u2.s3, g1u3.s2 |
| g1u3.s4 | Sumar un múltiplo de diez a dos cifras | g1u3.s1 |
| g1u3.s5 | Restar múltiplos de diez entre 10 y 90 | g1u1.s4, g1u2.s4 |

**Concepción errónea y distractor para detectarla:** 34 + 20 = 36 revela sumar 2 unidades en vez de 2 decenas. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques → dibujo de canjes → descomposición escrita.

**Explorar:** DragZone con canjes reversibles. **Practicar:** Teclado y elegir el canje que conserva valor; evitar imponer algoritmo de columnas.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 34 + 20. EN: What is 34 + 20?

**Respuesta:** 54.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Agregas dos decenas. | You are adding two tens. |
| H2 — ejemplo resuelto distinto | 25 + 30 = 55: 2 decenas más 3 decenas son 5. | 25 + 30 = 55 because 2 tens plus 3 tens is 5 tens. |
| H3 — respuesta explicada | 3 decenas + 2 decenas y 4 unidades forman 54. | 3 tens plus 2 tens and 4 ones make 54. |

**Reto 2.** ES: Calcula 27 + 5. EN: Find 27 + 5.

**Respuesta:** 32.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Completa la siguiente decena. | Make the next ten. |
| H2 — ejemplo resuelto distinto | 26 + 6 = 26 + 4 + 2 = 32. | 26 + 6 = 26 + 4 + 2 = 32. |
| H3 — respuesta explicada | 27 + 3 = 30; faltan 2, así que el total es 32. | Add 3 to reach 30, then 2 more. The sum is 32. |

**Reto 3.** ES: Calcula 70 − 30. EN: What is 70 − 30?

**Respuesta:** 40.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta decenas, no unidades sueltas. | Think in tens. |
| H2 — ejemplo resuelto distinto | 60 − 20 son 6 decenas menos 2: 40. | 60 − 20 is 6 tens minus 2 tens, or 40. |
| H3 — respuesta explicada | 7 decenas menos 3 decenas son 4 decenas: 40. | 7 tens minus 3 tens is 4 tens, or 40. |

**Plantilla de generación:** a=10…99; b=0…9 o múltiplo de diez; a+b≤100. Para ±10, mantener respuesta de dos cifras en primeras tareas. Restas: 10x−10y, 1≤y≤x≤9. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** regroup/reagrupar o canjear; tens/decenas; ten more/diez más.

**Brief de ilustración:** Estantería de paquetes y piezas sueltas, sin etiquetas incrustadas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g1u4 — Medir longitudes

**Estándares candidatos:** 1.MD.1, 1.MD.2. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Comparar longitudes y medir repitiendo una unidad sin huecos. EN: Compare lengths and measure by repeating a unit without gaps.

**Objetivo para el niño:** ES: «Mido con unidades del mismo tamaño.» EN: “I can measure with equal-size units.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u4.s1 | Ordenar tres objetos por longitud | base.compare |
| g1u4.s2 | Comparar indirectamente usando un tercer objeto | g1u4.s1 |
| g1u4.s3 | Repetir una unidad desde un mismo inicio | base.count10 |
| g1u4.s4 | Contar unidades sin huecos ni superposiciones | g1u4.s3 |

**Concepción errónea y distractor para detectarla:** Una tira cubierta con cuatro fichas separadas: elegir 4 como medida válida detecta ignorar huecos. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Objetos y cubos iguales → tiras → número de unidades.

**Explorar:** DragZone alinea extremos y unidades con ajuste opcional. **Practicar:** Seleccionar medición válida y teclado; evitar medir centímetros reales sobre una pantalla sin calibrar.

**Tres retos bilingües originales:**

**Reto 1.** ES: Una cinta ocupa 7 cubitos iguales, sin huecos. ¿Cuánto mide? EN: A ribbon is 7 equal cubes long with no gaps. What is its length?

**Respuesta:** 7.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada cubito cuenta como una unidad. | Each cube is one unit. |
| H2 — ejemplo resuelto distinto | Una tira que ocupa 5 cubos mide 5 unidades. | A strip covered by 5 cubes is 5 units long. |
| H3 — respuesta explicada | La cinta mide 7 unidades porque ocupa 7 cubitos seguidos. | The ribbon is 7 units long because 7 cubes cover it end to end. |

**Reto 2.** ES: Ordena estas longitudes de menor a mayor: 8, 3 y 5 unidades. EN: Order these lengths from shortest to longest: 8, 3, and 5 units.

**Respuesta:** 3, 5, 8.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Comienza por la longitud más pequeña. | Start with the shortest length. |
| H2 — ejemplo resuelto distinto | 2, 7 y 4 se ordenan 2, 4, 7. | The lengths 2, 7, and 4 go in the order 2, 4, 7. |
| H3 — respuesta explicada | 3 < 5 < 8; ese es el orden. | 3 < 5 < 8, so the order is 3, 5, 8. |

**Reto 3.** ES: A es más larga que B. B es más larga que C. ¿Cuál es la más larga? EN: A is longer than B. B is longer than C. Which is longest?

**Respuesta:** A.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Usa B para comparar las tres. | Use B to connect the comparisons. |
| H2 — ejemplo resuelto distinto | Si X supera a Y y Y supera a Z, X es la mayor. | If X is longer than Y and Y is longer than Z, X is longest. |
| H3 — respuesta explicada | A supera a B, y B a C; A es la más larga. | A is longer than B, which is longer than C. A is longest. |

**Plantilla de generación:** Longitudes enteras de 2…12 unidades virtuales; unidades idénticas; al ordenar, longitudes distintas. Incluir contraejemplos con huecos. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** length/longitud; longer/más largo; shorter/más corto; unit/unidad.

**Brief de ilustración:** Mesa de manualidades con cintas; la app superpone las unidades. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g1u5 — Leer datos y horas

**Estándares candidatos:** 1.MD.3, 1.MD.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** A para datos; Ad para tiempo. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Leer datos de hasta tres categorías y horas en punto y medias horas. EN: Read data in up to three categories and tell time to the hour and half hour.

**Objetivo para el niño:** ES: «Leo una gráfica y un reloj.» EN: “I can read a chart and a clock.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u5.s1 | Clasificar datos en hasta tres categorías | base.count10 |
| g1u5.s2 | Comparar cantidades y totales de categorías | g1u5.s1, g1u2.s6 |
| g1u5.s3 | Leer y escribir horas en punto en reloj analógico y digital | base.count12 |
| g1u5.s4 | Leer y escribir medias horas | g1u5.s3 |

**Concepción errónea y distractor para detectarla:** En 3:30, elegir 6:03 confunde posición de manecillas; destacar función de cada una sin usar solo color. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Votos con fichas/reloj físico → pictograma/reloj dibujado → totales y 3:30.

**Explorar:** Clasificar fichas; ClockHands con engranaje y etiquetas accesibles. **Practicar:** Toque en categorías y seleccionar hora; no preguntar minutos arbitrarios aún.

**Tres retos bilingües originales:**

**Reto 1.** ES: Votos: leer 6, dibujar 4, construir 3. ¿Cuántos votos hubo? EN: The votes are reading 6, drawing 4, and building 3. How many votes are there altogether?

**Respuesta:** 13.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma las tres categorías. | Add all three categories. |
| H2 — ejemplo resuelto distinto | Con 5, 3 y 2 votos: 5 + 3 + 2 = 10. | For 5, 3, and 2 votes, the total is 10. |
| H3 — respuesta explicada | 6 + 4 + 3 = 13 votos. | 6 + 4 + 3 = 13 votes. |

**Reto 2.** ES: Hay 6 votos por leer y 4 por dibujar. ¿Cuántos más hay por leer? EN: Reading has 6 votes and drawing has 4. How many more votes does reading have?

**Respuesta:** 2.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca la diferencia, no el total. | Find the difference, not the total. |
| H2 — ejemplo resuelto distinto | 7 frente a 4: faltan 3 para igualar 7. | With 7 and 4 votes, 3 more would make them equal. |
| H3 — respuesta explicada | 6 − 4 = 2; leer tiene 2 votos más. | 6 − 4 = 2. Reading has 2 more votes. |

**Reto 3.** ES: El minutero apunta al 6 y la manecilla corta está entre 3 y 4. Elige la hora. EN: The minute hand points to 6. The hour hand is between 3 and 4. What time is it?

**Respuesta:** 3:30.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El 6 del reloj marca media hora. | A minute hand at 6 means half past the hour. |
| H2 — ejemplo resuelto distinto | Entre 2 y 3, con minutero en 6, son las 2:30. | An hour hand between 2 and 3 with the minute hand at 6 shows 2:30. |
| H3 — respuesta explicada | Son las 3:30: ya pasó media hora desde las 3. | It is 3:30, half an hour after 3. |

**Plantilla de generación:** Datos: 2…3 categorías, 0…10 por categoría, total≤20. Hora: h=1…12, m∈{0,30}; manecilla horaria avanza entre horas. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** data/datos; category/categoría; half past/y media; hour/hora.

**Brief de ilustración:** Rincón de lectura y pared vacía para reloj real de la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g1u6 — Construir figuras y partes iguales

**Estándares candidatos:** 1.G.1, 1.G.2, 1.G.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad. Fuentes de alcance: [S01]; foco: [S04a].

**Objetivo para la familia:** ES: Reconocer atributos, componer figuras y distinguir mitades y cuartos. EN: Identify attributes, build shapes, and recognize halves and fourths.

**Objetivo para el niño:** ES: «Construyo figuras y partes iguales.» EN: “I can build shapes and equal parts.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g1u6.s1 | Reconocer atributos que definen una figura | base.shapes |
| g1u6.s2 | Componer figuras planas | g1u6.s1 |
| g1u6.s3 | Componer sólidos sencillos | base.shapes |
| g1u6.s4 | Dividir círculos y rectángulos en mitades y cuartos | g1u6.s2 |
| g1u6.s5 | Reconocer que más partes iguales producen partes menores del mismo entero | g1u6.s4 |

**Concepción errónea y distractor para detectarla:** Elegir dos partes de distinto tamaño como mitades revela atender al número de partes y no a su igualdad. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Papel plegado/bloques → particiones → palabras mitad/cuarto; símbolos fraccionarios no son objetivo formal aquí.

**Explorar:** DragZone de formas, selección de particiones; cortes con ajuste. **Practicar:** Elegir ejemplos y contraejemplos; evitar figura prototipo siempre orientada igual.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuántos lados tiene un triángulo aunque esté girado? EN: How many sides does a triangle have, even when it is turned?

**Respuesta:** 3.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El giro no cambia sus lados. | Turning a shape does not change its sides. |
| H2 — ejemplo resuelto distinto | Un cuadrado conserva 4 lados al girarlo. | A square still has 4 sides when it is turned. |
| H3 — respuesta explicada | Un triángulo tiene 3 lados en cualquier orientación. | A triangle has 3 sides in any position. |

**Reto 2.** ES: Un rectángulo se divide en dos partes del mismo tamaño. ¿Cómo se llama cada parte? EN: A rectangle is split into two equal-size parts. What is each part called?

**Respuesta:** mitad / half.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Son dos partes iguales del entero. | There are two equal parts of one whole. |
| H2 — ejemplo resuelto distinto | Cuatro partes iguales se llaman cuartos. | Four equal parts are called fourths. |
| H3 — respuesta explicada | Cada una es una mitad: dos mitades forman el entero. | Each part is a half. Two halves make the whole. |

**Reto 3.** ES: Del mismo círculo, ¿qué parte es mayor: una mitad o un cuarto? EN: For the same circle, which is larger: one half or one fourth?

**Respuesta:** mitad / half.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara el mismo entero dividido de dos maneras. | Compare the same whole split in two ways. |
| H2 — ejemplo resuelto distinto | Una parte de dos cubre más que una parte de cuatro. | One of two equal parts covers more than one of four. |
| H3 — respuesta explicada | La mitad es mayor: al dividir el entero en más partes iguales, cada parte disminuye. | One half is larger. More equal parts make each part smaller. |

**Plantilla de generación:** Figuras rotadas; cortes válidos solo en 2 o 4 áreas iguales. Comparar siempre el mismo entero. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** side/lado; corner/vértice o esquina; half/mitad; fourth/cuarto; whole/entero.

**Brief de ilustración:** Mosaicos y papel sin patrones que sugieran cantidades; geometría exacta renderizada por código. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

### Unidades de 2.º grado

#### g2u1 — Centenas y números hasta 1000

**Estándares candidatos:** 2.NBT.1, 2.NBT.2, 2.NBT.3, 2.NBT.4, 2.NBT.8. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Leer, componer, comparar y contar números hasta 1000. EN: Read, build, compare, and count numbers through 1,000.

**Objetivo para el niño:** ES: «Construyo números con centenas.» EN: “I can build numbers with hundreds.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u1.s1 | Canjear diez decenas por una centena | g1u1.s4 |
| g2u1.s2 | Leer y escribir hasta 1000 y forma desarrollada | g2u1.s1 |
| g2u1.s3 | Comparar tres cifras | g2u1.s2, g1u1.s5 |
| g2u1.s4 | Contar de 2, 5, 10 y 100 dentro de 1000 | g2u1.s2 |
| g2u1.s5 | Hallar mentalmente ±10 y ±100 desde 100…900 | g2u1.s1, g1u3.s1 |

**Concepción errónea y distractor para detectarla:** En 507, elegir 57 ignora el cero como marcador de posición. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques → tabla posicional → forma desarrollada.

**Explorar:** Canjear y ubicar cifras en columnas. **Practicar:** Teclado y ordenar números; no 1000 movimientos individuales.

**Tres retos bilingües originales:**

**Reto 1.** ES: Escribe el número: 5 centenas, 0 decenas y 7 unidades. EN: Write the number with 5 hundreds, 0 tens, and 7 ones.

**Respuesta:** 507.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Conserva el lugar de las decenas aunque no haya ninguna. | Keep a place for the tens, even when there are none. |
| H2 — ejemplo resuelto distinto | 3 centenas, 0 decenas y 4 unidades forman 304. | 3 hundreds, 0 tens, and 4 ones make 304. |
| H3 — respuesta explicada | 500 + 0 + 7 = 507. El cero guarda el lugar de las decenas. | 500 + 0 + 7 = 507. Zero holds the tens place. |

**Reto 2.** ES: Calcula mentalmente 462 + 100. EN: Find 462 + 100 in your head.

**Respuesta:** 562.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Agrega una centena. | Add one hundred. |
| H2 — ejemplo resuelto distinto | 351 + 100 = 451. | 351 + 100 = 451. |
| H3 — respuesta explicada | 4 centenas pasan a ser 5; decenas y unidades siguen iguales: 562. | 4 hundreds become 5 hundreds. The tens and ones stay the same: 562. |

**Reto 3.** ES: Completa contando de cinco en cinco: 185, 190, □. EN: Count by fives: 185, 190, □.

**Respuesta:** 195.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Agrega cinco una vez más. | Add five one more time. |
| H2 — ejemplo resuelto distinto | 170, 175, 180 aumenta de 5 en 5. | 170, 175, 180 goes up by 5 each time. |
| H3 — respuesta explicada | 190 + 5 = 195. | 190 + 5 = 195. |

**Plantilla de generación:** n=0…1000; tablas de centenas hasta 999, 1000 como borde. Conteos de 2 incluidos por adición CA. Para ±10/100 respetar inicio 100…900 y resultado válido. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** hundred/centena; expanded form/forma desarrollada; skip-count/contar de… en…

**Brief de ilustración:** Cajas apilables en taller comunitario, etiquetas añadidas por la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g2u2 — Suma y resta con estrategias

**Estándares candidatos:** 2.OA.2, 2.NBT.5, 2.NBT.6, 2.NBT.7, 2.NBT.7.1, 2.NBT.9. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Operar dentro de 1000 y explicar canjes; desarrollar fluidez dentro de 100. EN: Calculate within 1,000 and explain regrouping while building fluency within 100.

**Objetivo para el niño:** ES: «Elijo una estrategia y la compruebo.» EN: “I can choose a strategy and check it.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u2.s1 | Recuperar sumas de una cifra y restas relacionadas dentro de 20 | g1u2.s4 |
| g2u2.s2 | Sumar y restar con fluidez dentro de 100 | g1u3.s3, g2u2.s1 |
| g2u2.s3 | Sumar hasta cuatro números de dos cifras | g2u2.s2 |
| g2u2.s4 | Sumar dentro de 1000 con modelos | g2u1.s2, g2u2.s2 |
| g2u2.s5 | Restar dentro de 1000 con descomposición | g2u2.s4 |
| g2u2.s6 | Estimar y explicar por qué funciona una estrategia | g2u2.s4, g2u2.s5 |

**Concepción errónea y distractor para detectarla:** 302 − 185 = 283 detecta restar cifra menor de mayor sin preservar valor; incluir 117. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques canjeables → descomposición → registro escrito; algoritmo estándar no exigido en 2.º.

**Explorar:** DragZone para descomponer una centena en diez decenas. **Practicar:** Teclado, seleccionar explicación y estimación.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 58 + 27. EN: Find 58 + 27.

**Respuesta:** 85.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Separa las decenas y las unidades. | Break the numbers into tens and ones. |
| H2 — ejemplo resuelto distinto | 46 + 28 = 60 + 14 = 74. | 46 + 28 = 60 + 14 = 74. |
| H3 — respuesta explicada | 50 + 20 = 70 y 8 + 7 = 15; 70 + 15 = 85. | The tens make 70 and the ones make 15. Together they make 85. |

**Reto 2.** ES: Calcula 302 − 185. EN: What is 302 − 185?

**Respuesta:** 117.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Puedes contar desde 185 hasta 302. | You can count up from 185 to 302. |
| H2 — ejemplo resuelto distinto | Para 301 − 190: de 190 a 200 hay 10 y de 200 a 301 hay 101; total 111. | For 301 − 190, go up 10 to 200, then 101 to 301. That makes 111. |
| H3 — respuesta explicada | De 185 a 200 hay 15 y de 200 a 302 hay 102; 15 + 102 = 117. | It is 15 from 185 to 200 and 102 more to 302. The difference is 117. |

**Reto 3.** ES: Suma 24 + 16 + 35 + 25. EN: Add 24 + 16 + 35 + 25.

**Respuesta:** 100.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca parejas que completen decenas. | Look for pairs that make tens. |
| H2 — ejemplo resuelto distinto | 23 + 17 + 12 + 18 = 40 + 30 = 70. | 23 + 17 + 12 + 18 = 40 + 30 = 70. |
| H3 — respuesta explicada | 24 + 16 = 40 y 35 + 25 = 60; en total 100. | 24 + 16 makes 40, and 35 + 25 makes 60. The sum is 100. |

**Plantilla de generación:** Sumas/restas 0…1000 con resultado dentro del rango; hasta cuatro sumandos de 10…99; separar cero intermedio y canje simple/doble. 2.NBT.7.1 es adición CA. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** compose/componer; decompose/descomponer; estimate/estimar; strategy/estrategia.

**Brief de ilustración:** Materiales de biblioteca en paquetes; modelos numéricos como objetos de UI. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g2u3 — Problemas y grupos iguales

**Estándares candidatos:** 2.OA.1, 2.OA.3, 2.OA.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para problemas; A para grupos. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Modelar problemas de hasta dos pasos y preparar la multiplicación con arreglos. EN: Model one- and two-step problems and prepare for multiplication using arrays.

**Objetivo para el niño:** ES: «Represento lo que pasa antes de calcular.» EN: “I can show the story before I solve it.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u3.s1 | Resolver cambio con inicio o cambio desconocido | g1u2.s6, g2u2.s2 |
| g2u3.s2 | Resolver comparación con cantidad menor o mayor desconocida | g2u3.s1 |
| g2u3.s3 | Resolver problemas de dos pasos dentro de 100 | g2u3.s2 |
| g2u3.s4 | Identificar pares e impares hasta 20 | g1u2.s1 |
| g2u3.s5 | Representar arreglos de hasta 5 filas y 5 columnas como suma repetida | g2u3.s4 |

**Concepción errónea y distractor para detectarla:** Elegir 8 + 3 en «después de recibir 3 tengo 8» revela dependencia de la palabra recibir. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Objetos → barras de cambio/comparación y arreglos → ecuaciones.

**Explorar:** DragZone para modelar y PaintGrid para arreglos. **Practicar:** Elegir ecuación, teclado y completar un paso; evitar tablas de multiplicar como objetivo de 2.º.

**Tres retos bilingües originales:**

**Reto 1.** ES: Tenías algunas fichas. Recibes 8 y ahora tienes 23. ¿Cuántas tenías? EN: You had some counters. You get 8 more and now have 23. How many did you start with?

**Respuesta:** 15.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El número inicial más 8 da 23. | The starting number plus 8 equals 23. |
| H2 — ejemplo resuelto distinto | Si recibes 5 y terminas con 18, empezaste con 18 − 5 = 13. | If you get 5 and end with 18, you started with 18 − 5 = 13. |
| H3 — respuesta explicada | 23 − 8 = 15. Comprueba: 15 + 8 = 23. | You started with 15 because 15 + 8 = 23. |

**Reto 2.** ES: Hay 28 libros. Llegan 12 y se prestan 9. ¿Cuántos quedan? EN: There are 28 books. Then 12 arrive and 9 are checked out. How many remain?

**Respuesta:** 31.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Primero encuentra cuántos hay antes del préstamo. | First find the total before any books are checked out. |
| H2 — ejemplo resuelto distinto | 20 + 10 = 30; si se prestan 4, quedan 26. | 20 plus 10 is 30. If 4 are checked out, 26 remain. |
| H3 — respuesta explicada | 28 + 12 = 40 y 40 − 9 = 31 libros. | 28 + 12 = 40, then 40 − 9 = 31 books. |

**Reto 3.** ES: Hay 4 filas de 3 fichas. ¿Cuántas fichas hay? EN: There are 4 rows with 3 counters in each row. How many counters are there?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma una fila cada vez. | Add one row at a time. |
| H2 — ejemplo resuelto distinto | 3 filas de 2: 2 + 2 + 2 = 6. | For 3 rows of 2, add 2 + 2 + 2 = 6. |
| H3 — respuesta explicada | 3 + 3 + 3 + 3 = 12 fichas. | 3 + 3 + 3 + 3 = 12 counters. |

**Plantilla de generación:** Total y resultados intermedios 0…100; arreglos filas/columnas 1…5; paridad 0…20; incógnita en cualquier posición con historia coherente. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** array/arreglo rectangular; row/fila; column/columna; even/par; odd/impar.

**Brief de ilustración:** Preparación de juegos de mesa en centro comunitario. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g2u4 — Medición y recta numérica

**Estándares candidatos:** 2.MD.1, 2.MD.2, 2.MD.3, 2.MD.4, 2.MD.5, 2.MD.6. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Medir con unidades estándar y relacionar longitud con operaciones. EN: Measure with standard units and connect length to addition and subtraction.

**Objetivo para el niño:** ES: «Uso unidades y saltos para medir.» EN: “I can measure with units and number-line jumps.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u4.s1 | Elegir herramienta y unidad: in, ft, cm, m | g1u4.s4 |
| g2u4.s2 | Medir una longitud con dos tamaños de unidad | g2u4.s1 |
| g2u4.s3 | Estimar longitudes y hallar diferencias | g2u4.s2, g2u2.s2 |
| g2u4.s4 | Representar sumas y restas en recta dentro de 100 | g1u2.s4 |
| g2u4.s5 | Resolver problemas de longitudes en la misma unidad | g2u4.s3, g2u4.s4 |

**Concepción errónea y distractor para detectarla:** Contar las marcas en vez de los intervalos produce una unidad de más. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Regla física opcional → regla virtual marcada → diferencia/ecuación.

**Explorar:** NumberLine y regla con cero visible; medidas virtuales, no tamaño físico de pantalla. **Practicar:** Teclado y elegir unidad adecuada.

**Tres retos bilingües originales:**

**Reto 1.** ES: Una tira va de la marca 2 a la 9 en una regla en centímetros. ¿Cuánto mide? EN: A strip runs from 2 to 9 on a centimeter ruler. How long is it?

**Respuesta:** 7.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta la distancia entre las marcas. | Count the distance between the marks. |
| H2 — ejemplo resuelto distinto | De 3 a 8 hay 8 − 3 = 5 cm. | From 3 to 8 is 8 − 3 = 5 cm. |
| H3 — respuesta explicada | 9 − 2 = 7 cm. No se cuentan los números impresos. | 9 − 2 = 7 cm. Count the intervals, not the labels. |

**Reto 2.** ES: En una recta estás en 36 y avanzas 20. ¿Dónde llegas? EN: Start at 36 on a number line and move forward 20. Where do you land?

**Respuesta:** 56.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Avanza dos saltos de diez. | Make two jumps of ten. |
| H2 — ejemplo resuelto distinto | 24 → 34 → 44 suma veinte. | 24 → 34 → 44 adds twenty. |
| H3 — respuesta explicada | 36 → 46 → 56; llegas a 56. | 36 → 46 → 56. You land on 56. |

**Reto 3.** ES: Dos cintas miden 45 cm y 28 cm. ¿Cuántos centímetros más mide la primera? EN: One ribbon is 45 cm long and another is 28 cm long. How much longer is the first?

**Respuesta:** 17.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Las dos medidas usan centímetros. Busca la diferencia. | Both measurements are in centimeters. Find the difference. |
| H2 — ejemplo resuelto distinto | 40 cm − 25 cm = 15 cm. | 40 cm − 25 cm = 15 cm. |
| H3 — respuesta explicada | 45 − 28 = 17; la primera mide 17 cm más. | 45 − 28 = 17, so the first ribbon is 17 cm longer. |

**Plantilla de generación:** Longitudes enteras 1…100 en una unidad por problema; si se comparan unidades, mostrar equivalencia o el modelo; no convertir sistemas como exigencia. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** inch/pulgada; foot/pie; centimeter/centímetro; endpoint/extremo.

**Brief de ilustración:** Banco de herramientas escolar sin marcas de regla pintadas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g2u5 — Dinero, relojes y datos

**Estándares candidatos:** 2.MD.7, 2.MD.8, 2.MD.9, 2.MD.10. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** A para dinero/datos; Ad para tiempo. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Resolver situaciones con monedas, tiempo a cinco minutos y gráficas sencillas. EN: Solve situations involving coins, time to five minutes, and simple graphs.

**Objetivo para el niño:** ES: «Leo medidas y datos de mi día.» EN: “I can read time, money, and data.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u5.s1 | Leer horas a cinco minutos y distinguir a.m./p.m. | g1u5.s4, g2u1.s4 |
| g2u5.s2 | Identificar monedas y sumar centavos | g2u2.s2 |
| g2u5.s3 | Resolver problemas con dólares o centavos | g2u5.s2 |
| g2u5.s4 | Medir a la pulgada o centímetro más cercano y hacer diagrama de puntos | g2u4.s1 |
| g2u5.s5 | Crear y leer pictogramas y barras de escala uno hasta cuatro categorías | g1u5.s2, g2u3.s3 |

**Concepción errónea y distractor para detectarla:** Elegir 10¢ para una moneda grande de 5¢ revela juzgar valor por tamaño; no usar diámetro como pista. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Monedas/reloj/datos físicos → modelos → símbolos monetarios y lectura.

**Explorar:** ClockHands, fichas de monedas, gráfico de barras construible. **Practicar:** Teclado y selección; separar dólares enteros y centavos para no imponer decimales antes de tiempo.

**Tres retos bilingües originales:**

**Reto 1.** ES: Tienes una moneda de 25¢ y dos de 10¢. ¿Cuántos centavos son? EN: You have one quarter and two dimes. How many cents is that?

**Respuesta:** 45.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma valores, no cantidad de monedas. | Add the coin values, not the number of coins. |
| H2 — ejemplo resuelto distinto | Una de 25¢ y una de 5¢ suman 30¢. | A quarter and a nickel make 25 + 5 = 30 cents. |
| H3 — respuesta explicada | 25 + 10 + 10 = 45 centavos. | 25 + 10 + 10 = 45 cents. |

**Reto 2.** ES: El minutero marca 20 minutos y la manecilla corta está entre 4 y 5. ¿Qué hora es? EN: The minute hand shows 20 minutes. The hour hand is between 4 and 5. What time is it?

**Respuesta:** 4:20.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | La hora aún no ha llegado a cinco. | The hour has not reached five yet. |
| H2 — ejemplo resuelto distinto | Entre 2 y 3, con 10 minutos, se lee 2:10. | An hour hand between 2 and 3 with 10 minutes shows 2:10. |
| H3 — respuesta explicada | Son las 4:20: veinte minutos después de las cuatro. | It is 4:20, twenty minutes after four. |

**Reto 3.** ES: En una gráfica de escala uno hay 8 votos por parques y 5 por bibliotecas. ¿Cuántos más hay por parques? EN: On a graph with a scale of one, parks have 8 votes and libraries have 5. How many more votes do parks have?

**Respuesta:** 3.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara las dos alturas. | Compare the two bar heights. |
| H2 — ejemplo resuelto distinto | 9 votos frente a 7 tienen diferencia 2. | 9 votes and 7 votes differ by 2. |
| H3 — respuesta explicada | 8 − 5 = 3 votos más. | 8 − 5 = 3 more votes. |

**Plantilla de generación:** Minutos=0,5,…55; monedas valores 1,5,10,25; totales iniciales≤100¢. Datos 1…4 categorías, pictograma 1 símbolo=1; longitudes enteras para diagrama de puntos. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** quarter/moneda de 25 centavos; dime/10 centavos; nickel/5 centavos; line plot/diagrama de puntos sobre una recta.

**Brief de ilustración:** Quiosco escolar y espacio para reloj; monedas matemáticas generadas en la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g2u6 — Figuras, mosaicos y fracciones orales

**Estándares candidatos:** 2.G.1, 2.G.2, 2.G.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad. Fuentes de alcance: [S01]; foco: [S04b].

**Objetivo para la familia:** ES: Clasificar figuras y crear mitades, tercios y cuartos de un entero. EN: Classify shapes and create halves, thirds, and fourths of a whole.

**Objetivo para el niño:** ES: «Busco atributos y partes iguales.» EN: “I can find shape attributes and equal shares.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g2u6.s1 | Reconocer triángulos, cuadriláteros, pentágonos, hexágonos y cubos por atributos | g1u6.s1 |
| g2u6.s2 | Partir un rectángulo en filas y columnas de cuadrados iguales | g2u3.s5 |
| g2u6.s3 | Contar cuadrados de un mosaico | g2u6.s2 |
| g2u6.s4 | Partir círculos y rectángulos en 2, 3 o 4 áreas iguales | g1u6.s4 |
| g2u6.s5 | Reconocer partes iguales con formas diferentes | g2u6.s4 |

**Concepción errónea y distractor para detectarla:** Rechazar mitades de formas distintas pero igual área detecta confundir misma área con misma forma. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Plegado y mosaico → modelos → nombres de partes; no exigir suma de fracciones.

**Explorar:** PaintGrid y DragZone de particiones exactas. **Practicar:** Seleccionar atributos y particiones; evitar aceptar «parece igual» sin comprobar área.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuántos lados tiene un hexágono? EN: How many sides does a hexagon have?

**Respuesta:** 6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta los segmentos de su borde. | Count the straight sides around its edge. |
| H2 — ejemplo resuelto distinto | Un pentágono tiene 5 lados. | A pentagon has 5 sides. |
| H3 — respuesta explicada | Un hexágono tiene 6 lados. | A hexagon has 6 sides. |

**Reto 2.** ES: Un rectángulo tiene 3 filas de 4 cuadrados. ¿Cuántos cuadrados hay? EN: A rectangle has 3 rows of 4 squares. How many squares are there?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma los cuadrados de cada fila. | Add the squares in each row. |
| H2 — ejemplo resuelto distinto | 2 filas de 5 dan 5 + 5 = 10. | 2 rows of 5 make 5 + 5 = 10. |
| H3 — respuesta explicada | 4 + 4 + 4 = 12 cuadrados. | 4 + 4 + 4 = 12 squares. |

**Reto 3.** ES: Un círculo se reparte en 3 partes iguales. ¿Cómo se llama cada parte? EN: A circle is divided into 3 equal shares. What is each share called?

**Respuesta:** tercio / third.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El nombre indica tres partes iguales. | The name tells us there are three equal shares. |
| H2 — ejemplo resuelto distinto | En 4 partes iguales, cada una es un cuarto. | With 4 equal shares, each share is a fourth. |
| H3 — respuesta explicada | Cada parte es un tercio; tres tercios forman el entero. | Each share is a third. Three thirds make the whole. |

**Plantilla de generación:** Polígonos simples; rectángulos de hasta 5×5 para contar. Particiones de 2,3,4 áreas iguales, con enteros del mismo tamaño al comparar. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** third/tercio; equal shares/partes iguales; face/cara; hexagon/hexágono.

**Brief de ilustración:** Panel de mosaico comunitario con geometría renderizada por la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

### Unidades de 3.º grado

#### g3u1 — Multiplicar con grupos y arreglos

**Estándares candidatos:** 3.OA.1, 3.OA.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Interpretar la multiplicación como grupos iguales y arreglos rectangulares. EN: Interpret multiplication using equal groups and rectangular arrays.

**Objetivo para el niño:** ES: «Veo grupos iguales y encuentro el total.» EN: “I can find the total in equal groups.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u1.s1 | Identificar número de grupos y cantidad por grupo | g2u3.s5 |
| g3u1.s2 | Relacionar grupos con producto | g3u1.s1 |
| g3u1.s3 | Construir y leer arreglos rectangulares | g3u1.s2 |
| g3u1.s4 | Resolver un problema de producto desconocido | g3u1.s2, g3u1.s3 |

**Concepción errónea y distractor para detectarla:** 3 grupos de 4 → elegir 7 detecta sumar factores. Aceptar 4×3 para total, pero pedir por separado qué factor representa grupos. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Fichas → grupos/arreglos → g×s=T.

**Explorar:** DragZone para grupos y PaintGrid para arreglo. **Practicar:** Teclado, elegir modelo y ecuación; no usar velocidad para inferir comprensión.

**Tres retos bilingües originales:**

**Reto 1.** ES: Hay 3 bolsas con 4 fichas en cada una. ¿Cuántas fichas hay? EN: There are 3 bags with 4 counters in each bag. How many counters are there?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta cuatro por cada bolsa. | Count four for each bag. |
| H2 — ejemplo resuelto distinto | 2 bolsas de 5: 5 + 5 = 10. | 2 bags of 5 make 5 + 5 = 10. |
| H3 — respuesta explicada | 4 + 4 + 4 = 12; 3×4 = 12 fichas. | 4 + 4 + 4 = 12, so 3×4 = 12 counters. |

**Reto 2.** ES: Un arreglo tiene 4 filas de 6 puntos. ¿Cuántos puntos hay? EN: An array has 4 rows of 6 dots. How many dots are there?

**Respuesta:** 24.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada fila aporta seis puntos. | Each row has six dots. |
| H2 — ejemplo resuelto distinto | 3 filas de 5: 3×5 = 15. | 3 rows of 5 make 3×5 = 15. |
| H3 — respuesta explicada | 6 + 6 + 6 + 6 = 24; 4×6 = 24. | Four groups of six make 24, so 4×6 = 24. |

**Reto 3.** ES: Cada mesa necesita 5 hojas. Hay 7 mesas. ¿Cuántas hojas se necesitan? EN: Each table needs 5 sheets of paper. There are 7 tables. How many sheets are needed?

**Respuesta:** 35.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Hay siete grupos de cinco. | There are seven groups of five. |
| H2 — ejemplo resuelto distinto | 6 mesas con 5 hojas necesitan 6×5 = 30 hojas. | 6 tables with 5 sheets each need 6×5 = 30 sheets. |
| H3 — respuesta explicada | 7×5 = 35; se necesitan 35 hojas. | 7×5 = 35, so 35 sheets are needed. |

**Plantilla de generación:** g,s=1…9; T=g×s≤81 en contexto; 0 como caso explícito sin contar grupos de tamaño ambiguo. Hasta 10×10 como extensión de producto≤100, sin exigir memoria de hechos 10×10 bajo 3.OA.7. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** factor/factor; product/producto; equal groups/grupos iguales; array/arreglo rectangular.

**Brief de ilustración:** Mesas de taller comunitario; fichas y cantidades creadas por la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g3u2 — Dividir y construir fluidez

**Estándares candidatos:** 3.OA.2, 3.OA.3, 3.OA.4, 3.OA.5, 3.OA.6, 3.OA.7, 3.OA.9. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Comprender las dos interpretaciones de la división y usar propiedades para multiplicar y dividir. EN: Understand both meanings of division and use properties to multiply and divide.

**Objetivo para el niño:** ES: «Uso lo que sé para encontrar lo que falta.» EN: “I can use facts I know to find a missing number.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u2.s1 | Repartir un total en un número conocido de grupos iguales | g3u1.s2 |
| g3u2.s2 | Encontrar cuántos grupos de tamaño conocido caben | g3u2.s1 |
| g3u2.s3 | Hallar factor o cociente desconocido | g3u2.s2 |
| g3u2.s4 | Usar conmutativa, asociativa y distributiva | g3u1.s3, g3u2.s3 |
| g3u2.s5 | Recuperar productos de dos números de una cifra y divisiones relacionadas | g3u2.s4 |
| g3u2.s6 | Explicar patrones de operaciones | g3u2.s4 |

**Concepción errónea y distractor para detectarla:** 24÷6 → elegir 18 detecta sustituir división por resta única. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Reparto físico → grupos/barras → familias de hechos.

**Explorar:** DragZone con reparto y agrupamiento, arreglos partidos. **Practicar:** Teclado, completar factor y seleccionar descomposición; evitar solo recitar tablas ordenadas.

**Tres retos bilingües originales:**

**Reto 1.** ES: Reparte 24 fichas entre 6 personas por igual. ¿Cuántas recibe cada una? EN: Share 24 counters equally among 6 people. How many does each person get?

**Respuesta:** 4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca seis grupos con el mismo tamaño. | Make six groups of equal size. |
| H2 — ejemplo resuelto distinto | 18 fichas entre 3 personas: 18÷3 = 6 por persona. | 18 counters shared among 3 people give 6 each. |
| H3 — respuesta explicada | 6×4 = 24, así que cada persona recibe 4. | 6×4 = 24, so each person gets 4 counters. |

**Reto 2.** ES: Pon 24 fichas en bolsas de 6. ¿Cuántas bolsas completas llenas? EN: Put 24 counters into bags of 6. How many full bags can you fill?

**Respuesta:** 4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Esta vez conoces cuántas van en cada bolsa. | This time you know the number in each bag. |
| H2 — ejemplo resuelto distinto | 20 fichas en bolsas de 5 llenan 20÷5 = 4 bolsas. | 20 counters in bags of 5 fill 4 bags. |
| H3 — respuesta explicada | 24÷6 = 4; llenas 4 bolsas de 6 fichas. | 24÷6 = 4. You fill 4 bags with 6 counters each. |

**Reto 3.** ES: Usa 7×5 y 7×1 para calcular 7×6. EN: Use 7×5 and 7×1 to find 7×6.

**Respuesta:** 42.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Separa seis en cinco y uno. | Split six into five and one. |
| H2 — ejemplo resuelto distinto | 8×6 = 8×5 + 8×1 = 40 + 8 = 48. | 8×6 = 8×5 + 8×1 = 40 + 8 = 48. |
| H3 — respuesta explicada | 7×6 = 35 + 7 = 42. Distribuiste siete grupos entre cinco y uno. | 7×6 = 35 + 7 = 42, using the distributive property. |

**Plantilla de generación:** Divisor 1…9, cociente 0…9, dividendo=producto≤81; mostrar productos hasta 100 en tareas de interpretación. Nunca dividir entre cero; incluir ×0 y ×1 en lecciones específicas. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** quotient/cociente; divide/repartir o formar grupos; distributive/distributiva.

**Brief de ilustración:** Material de taller organizado en recipientes vacíos; fichas superpuestas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g3u3 — Números y problemas de dos pasos

**Estándares candidatos:** 3.NBT.1, 3.NBT.2, 3.NBT.3, 3.OA.8. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad para NBT; C para problemas. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Operar dentro de 1000 y modelar problemas de dos pasos con las cuatro operaciones. EN: Calculate within 1,000 and model two-step problems using the four operations.

**Objetivo para el niño:** ES: «Organizo dos pasos y reviso el resultado.» EN: “I can plan two steps and check my answer.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u3.s1 | Redondear a decena o centena cercana | g2u1.s3 |
| g3u3.s2 | Sumar y restar con fluidez dentro de 1000 | g2u2.s6 |
| g3u3.s3 | Multiplicar una cifra por múltiplos de diez entre 10 y 90 | g3u2.s4, g2u1.s4 |
| g3u3.s4 | Resolver dos pasos con cuatro operaciones e incógnita | g3u2.s3, g2u3.s3 |
| g3u3.s5 | Estimar para comprobar razonabilidad | g3u3.s1, g3u3.s4 |

**Concepción errónea y distractor para detectarla:** 3 bolsas de 5 y 4 fichas sueltas → elegir 27 detecta agrupar como 3×(5+4). Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques → barra y recta para redondeo → expresión de dos pasos.

**Explorar:** SequencePad para plan y NumberLine de redondeo. **Practicar:** Teclado y elegir plan; no enseñar paréntesis como fin del código 3.OA.8.

**Tres retos bilingües originales:**

**Reto 1.** ES: Redondea 347 a la centena más cercana. EN: Round 347 to the nearest hundred.

**Respuesta:** 300.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara su distancia a 300 y a 400. | Compare its distance from 300 and 400. |
| H2 — ejemplo resuelto distinto | 362 está a 38 de 400 y a 62 de 300: se redondea a 400. | 362 is 38 away from 400 and 62 from 300, so it rounds to 400. |
| H3 — respuesta explicada | 347 está a 47 de 300 y a 53 de 400; se redondea a 300. | 347 is closer to 300 than to 400, so it rounds to 300. |

**Reto 2.** ES: Calcula 6×40. EN: Find 6×40.

**Respuesta:** 240.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Piensa en seis grupos de cuatro decenas. | Think of six groups of four tens. |
| H2 — ejemplo resuelto distinto | 5×30 = 15 decenas = 150. | 5×30 is 15 tens, or 150. |
| H3 — respuesta explicada | 6×4 = 24; son 24 decenas, es decir 240. | 6×4 = 24, so 6×40 is 24 tens, or 240. |

**Reto 3.** ES: Hay 3 bolsas de 5 fichas y 4 fichas sueltas. ¿Cuántas hay en total? EN: There are 3 bags of 5 counters and 4 loose counters. How many counters are there altogether?

**Respuesta:** 19.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Encuentra primero las fichas de las bolsas. | First find the number in all the bags. |
| H2 — ejemplo resuelto distinto | 2 bolsas de 6 y 3 sueltas: 2×6 + 3 = 15. | 2 bags of 6 and 3 loose counters make 2×6 + 3 = 15. |
| H3 — respuesta explicada | 3×5 = 15; 15 + 4 = 19 fichas. | 3×5 = 15, then 15 + 4 = 19 counters. |

**Plantilla de generación:** Sumas/restas≤1000; factores a=1…9, b=10,20,…90; problemas de dos pasos con resultados enteros no negativos y divisiones exactas. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** round/redondear; reasonable/razonable; step/paso; equation/ecuación.

**Brief de ilustración:** Biblioteca en reorganización, sin cantidades dentro del arte. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g3u4 — Fracciones como números

**Estándares candidatos:** 3.NF.1, 3.NF.2, 3.NF.3, 3.G.2. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para NF; A para geometría. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Ubicar fracciones, reconocer equivalencias y comparar usando el mismo entero. EN: Place fractions on a number line, recognize equivalence, and compare using the same whole.

**Objetivo para el niño:** ES: «Las fracciones también tienen lugar en la recta.» EN: “I can place fractions on a number line.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u4.s1 | Reconocer una fracción unitaria como una parte de b partes iguales | g2u6.s4 |
| g3u4.s2 | Construir a/b a partir de unidades 1/b | g3u4.s1 |
| g3u4.s3 | Ubicar fracciones en recta, incluso mayores que uno | g3u4.s2, g2u4.s4 |
| g3u4.s4 | Reconocer equivalencias y enteros como fracciones | g3u4.s3 |
| g3u4.s5 | Comparar fracciones con numerador o denominador común | g3u4.s4 |

**Concepción errónea y distractor para detectarla:** Elegir 1/8 > 1/6 porque 8>6 detecta transferir orden de enteros al denominador. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Tiras/papel → barras y recta → a/b; entero y escala siempre explícitos.

**Explorar:** FractionBars y NumberLine con particiones iguales. **Practicar:** Ubicar, construir y elegir explicación; no contar marcas como segmentos.

**Tres retos bilingües originales:**

**Reto 1.** ES: Un entero se divide en 6 partes iguales y se toman 4. ¿Qué fracción es? EN: One whole is split into 6 equal parts. You take 4 parts. What fraction is that?

**Respuesta:** 4/6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El denominador cuenta todas las partes iguales. | The denominator counts all the equal parts in the whole. |
| H2 — ejemplo resuelto distinto | Tomar 3 de 8 partes iguales se escribe 3/8. | Taking 3 of 8 equal parts is written as 3/8. |
| H3 — respuesta explicada | Son 4 partes de 6: 4/6. | It is 4 out of 6 equal parts, or 4/6. |

**Reto 2.** ES: Completa: 1/2 = □/4. EN: Fill in the blank: 1/2 = □/4.

**Respuesta:** 2.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Divide cada mitad en dos partes iguales. | Split each half into two equal parts. |
| H2 — ejemplo resuelto distinto | 1/3 = 2/6 porque cada tercio se divide en dos. | 1/3 = 2/6 because each third is split into two. |
| H3 — respuesta explicada | Una mitad cubre dos cuartos: 1/2 = 2/4. | One half covers two fourths, so 1/2 = 2/4. |

**Reto 3.** ES: Del mismo entero, ¿cuál es mayor: 1/6 o 1/8? EN: For the same whole, which is greater: 1/6 or 1/8?

**Respuesta:** 1/6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Más partes iguales hacen más pequeña cada parte. | More equal parts make each part smaller. |
| H2 — ejemplo resuelto distinto | 1/3 es mayor que 1/4 del mismo entero. | 1/3 is greater than 1/4 of the same whole. |
| H3 — respuesta explicada | 1/6 es mayor: repartir en seis deja partes mayores que repartir en ocho. | 1/6 is greater because sixths are larger pieces than eighths of the same whole. |

**Plantilla de generación:** Denominadores de 3.º: 2,3,4,6,8. Numerador 0…2b; comparación con mismo numerador o denominador, mismo entero. Equivalencias simples por subdividir. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** numerator/numerador; denominator/denominador; unit fraction/fracción unitaria; equivalent/equivalente.

**Brief de ilustración:** Sendero y cintas de manualidades; rectas/barras matemáticas por código. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g3u5 — Área, perímetro y cuadriláteros

**Estándares candidatos:** 3.MD.5, 3.MD.6, 3.MD.7, 3.MD.8, 3.G.1. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para área; Ad para perímetro; A para geometría. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Distinguir superficie y borde, y clasificar figuras por atributos. EN: Distinguish area from perimeter and classify shapes by their attributes.

**Objetivo para el niño:** ES: «Cubro el área y recorro el perímetro.» EN: “I can cover an area and trace a perimeter.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u5.s1 | Cubrir sin huecos con unidades cuadradas | g2u6.s3 |
| g3u5.s2 | Calcular área rectangular como producto | g3u5.s1, g3u1.s3 |
| g3u5.s3 | Descomponer áreas para usar distributiva y suma | g3u5.s2, g3u2.s4 |
| g3u5.s4 | Hallar perímetro y lado desconocido | g3u3.s2 |
| g3u5.s5 | Comparar misma área/distinto perímetro y viceversa | g3u5.s4, g3u5.s2 |
| g3u5.s6 | Clasificar cuadriláteros por atributos compartidos | g2u6.s1 |

**Concepción errónea y distractor para detectarla:** Rectángulo 4×3: elegir 14 para área mezcla perímetro con área; usar unidades cuadradas para diferenciar. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Baldosas/cuerda → cuadrícula y borde → A=l×w, P=suma de lados.

**Explorar:** PaintGrid para superficie y recorrido de borde por toque. **Practicar:** Teclado con unidad, comparar pares de figuras; no colorear el borde como respuesta de área.

**Tres retos bilingües originales:**

**Reto 1.** ES: Un rectángulo mide 4 unidades por 3 unidades. ¿Cuál es su área? EN: A rectangle is 4 units long and 3 units wide. What is its area?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta filas de cuadrados de una unidad. | Count rows of unit squares. |
| H2 — ejemplo resuelto distinto | Un rectángulo de 5 por 2 cubre 5×2 = 10 unidades cuadradas. | A 5-by-2 rectangle covers 10 square units. |
| H3 — respuesta explicada | 4×3 = 12 unidades cuadradas. | 4×3 = 12 square units. |

**Reto 2.** ES: Un rectángulo tiene lados de 4 cm y 3 cm. ¿Cuál es su perímetro? EN: A rectangle has side lengths of 4 cm and 3 cm. What is its perimeter?

**Respuesta:** 14.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Recorre los cuatro lados. | Go around all four sides. |
| H2 — ejemplo resuelto distinto | Para 5 cm y 2 cm: 5 + 2 + 5 + 2 = 14 cm. | For sides of 5 cm and 2 cm, add 5 + 2 + 5 + 2 = 14 cm. |
| H3 — respuesta explicada | 4 + 3 + 4 + 3 = 14 cm de borde. | 4 + 3 + 4 + 3 = 14 cm around the edge. |

**Reto 3.** ES: ¿Un cuadrado pertenece al grupo de los cuadriláteros? EN: Is a square a quadrilateral?

**Respuesta:** sí / yes.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Un cuadrilátero tiene cuatro lados. | A quadrilateral has four sides. |
| H2 — ejemplo resuelto distinto | Un rectángulo tiene cuatro lados, por eso es cuadrilátero. | A rectangle has four sides, so it is a quadrilateral. |
| H3 — respuesta explicada | Sí. El cuadrado tiene cuatro lados y comparte ese atributo con otros cuadriláteros. | Yes. A square has four sides, which makes it a quadrilateral. |

**Plantilla de generación:** Lados enteros 1…10; áreas≤100; perímetros≤40. Figuras compuestas de rectángulos sin solapamiento; cuadriláteros variados y rotados. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** area/área; perimeter/perímetro; square unit/unidad cuadrada; rhombus/rombo.

**Brief de ilustración:** Huerto y mosaico; cuadrícula y medidas son capas exactas de la app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g3u6 — Tiempo, masa, capacidad y gráficas

**Estándares candidatos:** 3.MD.1, 3.MD.2, 3.MD.3, 3.MD.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para tiempo/masa/capacidad; A para datos. Fuentes de alcance: [S01]; foco: [S04c].

**Objetivo para la familia:** ES: Resolver medidas y leer datos con escalas y fracciones de unidad. EN: Solve measurement problems and read scaled graphs and fractional measurements.

**Objetivo para el niño:** ES: «Elijo la unidad y leo la escala.» EN: “I can choose a unit and read a scale.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g3u6.s1 | Leer y escribir hora al minuto y calcular intervalos | g2u5.s1, g2u4.s4 |
| g3u6.s2 | Estimar y operar masas y volúmenes líquidos en g, kg y L | g3u3.s4 |
| g3u6.s3 | Interpretar pictogramas y barras escalados | g2u5.s5, g3u2.s5 |
| g3u6.s4 | Medir a media y cuarta pulgada | g3u4.s2, g2u4.s1 |
| g3u6.s5 | Construir e interpretar diagrama de puntos con medias y cuartas unidades | g3u6.s4 |

**Concepción errónea y distractor para detectarla:** Cuatro símbolos con clave 5 → elegir 4 en vez de 20 detecta ignorar escala. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Recipientes/reloj/regla → escalas y rectas → operaciones con unidad.

**Explorar:** NumberLine temporal, gráficos tocables y regla fraccionada. **Practicar:** Teclado, seleccionar unidad o clave; no convertir L a mL como exigencia de 3.MD.2.

**Tres retos bilingües originales:**

**Reto 1.** ES: Empiezas a leer a las 3:18 y terminas a las 3:45. ¿Cuántos minutos lees? EN: You start reading at 3:18 and finish at 3:45. How many minutes do you read?

**Respuesta:** 27.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta hasta una hora fácil y luego hasta el final. | Count up to an easy time, then to the ending time. |
| H2 — ejemplo resuelto distinto | De 2:20 a 2:50 pasan 30 minutos. | From 2:20 to 2:50 is 30 minutes. |
| H3 — respuesta explicada | De 3:18 a 3:20 van 2 minutos y luego 25; total 27. | It is 2 minutes to 3:20 and 25 more to 3:45, for 27 minutes. |

**Reto 2.** ES: Una jarra tiene 3 L y otra 2 L. ¿Cuántos litros tienen juntas? EN: One pitcher holds 3 L and another holds 2 L. How many liters do they hold altogether?

**Respuesta:** 5.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Las dos cantidades tienen la misma unidad. | Both amounts use the same unit. |
| H2 — ejemplo resuelto distinto | 4 L + 2 L = 6 L. | 4 L + 2 L = 6 L. |
| H3 — respuesta explicada | 3 L + 2 L = 5 L. | 3 L + 2 L = 5 L. |

**Reto 3.** ES: Cada símbolo representa 5 libros. Hay 4 símbolos. ¿Cuántos libros se muestran? EN: Each symbol stands for 5 books. There are 4 symbols. How many books are shown?

**Respuesta:** 20.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Usa la clave de la gráfica. | Use the graph key. |
| H2 — ejemplo resuelto distinto | 3 símbolos de 2 libros representan 3×2 = 6 libros. | 3 symbols worth 2 books each represent 6 books. |
| H3 — respuesta explicada | 4×5 = 20 libros; cada símbolo representa cinco. | 4×5 = 20 books because each symbol stands for five. |

**Plantilla de generación:** Tiempo con minutos enteros y trayectos sencillos≤120 min; masa/capacidad en unidad común, valores enteros≤100. Gráficas escala 2,5,10. Regla a 1/2 o 1/4 in. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** elapsed time/tiempo transcurrido; mass/masa; liter/litro; scale/escala o clave.

**Brief de ilustración:** Estación de agua y materiales de excursión escolar sin etiquetas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

### Unidades de 4.º grado

#### g4u1 — Valor posicional, factores y patrones

**Estándares candidatos:** 4.NBT.1, 4.NBT.2, 4.NBT.3, 4.NBT.4, 4.OA.4, 4.OA.5. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para NBT; A para factores; Ad para patrones. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Leer números grandes y relacionar factores, múltiplos y patrones. EN: Read large numbers and connect factors, multiples, and patterns.

**Objetivo para el niño:** ES: «Busco el valor y las relaciones.» EN: “I can find place values and number patterns.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u1.s1 | Leer y escribir números hasta 1000000 | g2u1.s2 |
| g4u1.s2 | Explicar que una posición vale diez veces la posición a su derecha | g4u1.s1 |
| g4u1.s3 | Comparar y redondear números de varias cifras | g4u1.s2, g3u3.s1 |
| g4u1.s4 | Sumar y restar con algoritmo estándar | g3u3.s2, g4u1.s2 |
| g4u1.s5 | Hallar factores, múltiplos y reconocer primos/compuestos de 1…100 | g3u2.s5 |
| g4u1.s6 | Generar y explicar un patrón por una regla | g3u2.s6 |

**Concepción errónea y distractor para detectarla:** En 5000 y 500, elegir 100 como factor de cambio detecta contar ceros sin analizar valor. 1 no es primo ni compuesto. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques y agrupaciones → tabla posicional/arreglos → algoritmos y reglas.

**Explorar:** Canjes posicionales, PaintGrid de factores, SequencePad. **Practicar:** Teclado y selección de explicación; no exigir factorización prima formal.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuántas veces vale 5000 lo que vale 500? EN: How many times as much is 5,000 as 500?

**Respuesta:** 10.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara las posiciones del 5. | Compare the place values of the 5s. |
| H2 — ejemplo resuelto distinto | 700 es 10 veces 70. | 700 is 10 times as much as 70. |
| H3 — respuesta explicada | 500×10 = 5000; vale diez veces. | 500×10 = 5,000, so it is ten times as much. |

**Reto 2.** ES: Calcula 4002 − 1786. EN: Find 4,002 − 1,786.

**Respuesta:** 2216.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Puedes descomponer miles y centenas para conservar valor. | Regroup thousands and hundreds while keeping the same total. |
| H2 — ejemplo resuelto distinto | 3001 − 1895 = 1106; comprueba 1895 + 1106 = 3001. | 3,001 − 1,895 = 1,106; check by adding 1,895 + 1,106. |
| H3 — respuesta explicada | 4002 − 1786 = 2216. La suma 1786 + 2216 = 4002 lo comprueba. | 4,002 − 1,786 = 2,216. Check: 1,786 + 2,216 = 4,002. |

**Reto 3.** ES: Selecciona todos los factores de 18: 2, 3, 4, 6 y 9. EN: Select all the factors of 18: 2, 3, 4, 6, and 9.

**Respuesta:** 2, 3, 6, 9.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Un factor divide 18 sin residuo. | A factor divides 18 with no remainder. |
| H2 — ejemplo resuelto distinto | Los factores de 12 incluyen 2, 3, 4 y 6. | The factors of 12 include 2, 3, 4, and 6. |
| H3 — respuesta explicada | 18 = 2×9 = 3×6. Selecciona 2, 3, 6 y 9; 4 no divide 18 exactamente. | 18 = 2×9 = 3×6. Choose 2, 3, 6, and 9. Four is not a factor. |

**Plantilla de generación:** Enteros 0…1000000; factores/múltiplos dentro de 1…100; reglas suma/multiplicación con 4…6 términos. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** multiple/múltiplo; factor/factor; prime/primo; composite/compuesto; rule/regla.

**Brief de ilustración:** Almacén de materiales con panel numérico independiente. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g4u2 — Multiplicar, dividir e interpretar residuos

**Estándares candidatos:** 4.OA.1, 4.OA.2, 4.OA.3, 4.NBT.5, 4.NBT.6. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Resolver multiplicación de varias cifras, división por una cifra y comparación multiplicativa. EN: Solve multi-digit multiplication, one-digit division, and multiplicative comparisons.

**Objetivo para el niño:** ES: «Pienso en grupos y compruebo lo que sobra.» EN: “I can use groups and make sense of remainders.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u2.s1 | Interpretar comparación multiplicativa frente a aditiva | g3u1.s4 |
| g4u2.s2 | Resolver comparación multiplicativa con incógnita | g4u2.s1, g3u2.s3 |
| g4u2.s3 | Multiplicar hasta cuatro cifras por una y dos cifras por dos | g3u3.s3, g4u1.s2 |
| g4u2.s4 | Dividir hasta cuatro cifras entre una con modelos y cocientes parciales | g4u2.s3, g3u2.s3 |
| g4u2.s5 | Interpretar residuo según contexto | g4u2.s4 |
| g4u2.s6 | Resolver problemas de varios pasos y estimar | g4u2.s2, g4u2.s5, g3u3.s5 |

**Concepción errónea y distractor para detectarla:** «3 veces 8» → elegir 11 confunde comparación aditiva y multiplicativa. En autobuses, ignorar sobrantes cambia la respuesta. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Arreglos y reparto → modelo de área/barras → productos y cocientes parciales.

**Explorar:** PaintGrid de productos parciales; DragZone de grupos y residuo. **Practicar:** Teclado con cociente/residuo y selección de decisión contextual.

**Tres retos bilingües originales:**

**Reto 1.** ES: Una mesa tiene 8 hojas. Otra tiene 3 veces esa cantidad. ¿Cuántas tiene la segunda? EN: One table has 8 sheets. Another has 3 times as many. How many sheets does the second table have?

**Respuesta:** 24.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Son tres grupos del tamaño de ocho. | It is three groups of eight. |
| H2 — ejemplo resuelto distinto | 4 veces 6 es 4×6 = 24. | 4 times as many as 6 is 4×6 = 24. |
| H3 — respuesta explicada | 3×8 = 24 hojas; no se suman solo tres hojas. | 3×8 = 24 sheets. Three times as many means three equal groups. |

**Reto 2.** ES: Calcula 23×14. EN: Find 23×14.

**Respuesta:** 322.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Separa 14 en 10 y 4. | Break 14 into 10 and 4. |
| H2 — ejemplo resuelto distinto | 21×13 = 21×10 + 21×3 = 210 + 63 = 273. | 21×13 = 210 + 63 = 273. |
| H3 — respuesta explicada | 23×10 + 23×4 = 230 + 92 = 322. | 23×10 + 23×4 = 230 + 92 = 322. |

**Reto 3.** ES: Viajan 29 personas. En cada vehículo caben 6. ¿Cuántos vehículos se necesitan como mínimo? EN: 29 people need rides. Each vehicle holds 6 people. What is the fewest vehicles needed?

**Respuesta:** 5.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuatro vehículos no llevan a todas las personas. | Four vehicles do not hold everyone. |
| H2 — ejemplo resuelto distinto | 20 personas en vehículos de 6 necesitan 4: tres llevan 18 y faltan 2. | 20 people need 4 vehicles of 6 seats because 3 vehicles hold only 18. |
| H3 — respuesta explicada | 29÷6 = 4 y sobran 5 personas; necesitan un quinto vehículo. | 29÷6 is 4 remainder 5. Those 5 people need a fifth vehicle. |

**Plantilla de generación:** Factores≤9999×9 o 99×99. Dividendo≤9999; divisor 1…9. Generar N=dq+r con 0≤r<d y etiquetar contexto: repartir, sobrantes o redondear grupos arriba. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** times as many/veces la cantidad; remainder/residuo; partial quotient/cociente parcial.

**Brief de ilustración:** Excursión con cajas y asientos, sin números en el arte. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g4u3 — Equivalencia y operaciones con fracciones

**Estándares candidatos:** 4.NF.1, 4.NF.2, 4.NF.3, 4.NF.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Comparar fracciones y operar con denominadores iguales o un factor entero. EN: Compare fractions, calculate with like denominators, and multiply fractions by whole numbers.

**Objetivo para el niño:** ES: «Cambio la forma sin cambiar la cantidad.» EN: “I can rename fractions without changing their value.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u3.s1 | Generar equivalencias multiplicando numerador y denominador | g3u4.s4, g4u1.s5 |
| g4u3.s2 | Comparar fracciones con denominadores distintos | g4u3.s1, g3u4.s5 |
| g4u3.s3 | Sumar y restar fracciones del mismo denominador | g3u4.s2 |
| g4u3.s4 | Componer, descomponer y operar números mixtos con igual denominador | g4u3.s3 |
| g4u3.s5 | Multiplicar una fracción por un entero | g4u3.s3, g3u1.s4 |
| g4u3.s6 | Resolver problemas con esas operaciones y modelos | g4u3.s4, g4u3.s5 |

**Concepción errónea y distractor para detectarla:** 1/4 + 2/4 → elegir 3/8 detecta sumar denominadores. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Tiras → barras y recta → equivalencias y operaciones.

**Explorar:** FractionBars conserva el entero y subdivide simultáneamente. **Practicar:** Teclado fraccionario y ubicar; no enseñar multiplicación de dos fracciones como meta de 4.º.

**Tres retos bilingües originales:**

**Reto 1.** ES: Completa: 3/4 = □/12. EN: Fill in the blank: 3/4 = □/12.

**Respuesta:** 9.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El denominador se multiplicó por tres. | The denominator was multiplied by three. |
| H2 — ejemplo resuelto distinto | 2/3 = 8/12 al multiplicar ambos números por 4. | 2/3 = 8/12 by multiplying both numerator and denominator by 4. |
| H3 — respuesta explicada | 3×3 = 9 y 4×3 = 12; 3/4 = 9/12. | Multiply both parts by 3: 3/4 = 9/12. |

**Reto 2.** ES: Calcula 1/4 + 2/4. EN: Find 1/4 + 2/4.

**Respuesta:** 3/4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta cuartos; el tamaño de las partes no cambia. | Count fourths. The size of each part stays the same. |
| H2 — ejemplo resuelto distinto | 2/6 + 3/6 = 5/6. | 2 sixths plus 3 sixths is 5 sixths. |
| H3 — respuesta explicada | 1 cuarto + 2 cuartos = 3 cuartos: 3/4. | 1 fourth plus 2 fourths is 3 fourths, or 3/4. |

**Reto 3.** ES: Cada cinta mide 2/3 m. ¿Cuánto miden 3 cintas juntas? EN: Each ribbon is 2/3 m long. How long are 3 ribbons altogether?

**Respuesta:** 2 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma dos tercios tres veces. | Add two thirds three times. |
| H2 — ejemplo resuelto distinto | 2 cintas de 3/4 m suman 6/4 m, o 1 1/2 m. | 2 ribbons of 3/4 m total 6/4 m, or 1 1/2 m. |
| H3 — respuesta explicada | 3×2/3 = 6/3 = 2 m. | 3×2/3 = 6/3 = 2 m. |

**Plantilla de generación:** Denominadores 2,3,4,5,6,8,10,12,100 según alcance 4.NF. Numeradores hasta 3d; resultados no negativos en resta. Fracciones equivalentes aceptadas sin simplificación obligatoria. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** mixed number/número mixto; equivalent fraction/fracción equivalente; benchmark/punto de referencia.

**Brief de ilustración:** Cintas y paneles de color, con particiones generadas por código. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g4u4 — Décimos, centésimos y decimales

**Estándares candidatos:** 4.NF.5, 4.NF.6, 4.NF.7. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Relacionar fracciones de denominador 10 y 100 con notación decimal. EN: Connect fractions with denominators of 10 and 100 to decimal notation.

**Objetivo para el niño:** ES: «Veo la misma cantidad de dos maneras.» EN: “I can show the same amount as a fraction and a decimal.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u4.s1 | Renombrar décimos como centésimos | g4u3.s1 |
| g4u4.s2 | Sumar décimos y centésimos con denominador común | g4u4.s1, g4u3.s3 |
| g4u4.s3 | Escribir fracciones de décimos y centésimos como decimales | g4u4.s1 |
| g4u4.s4 | Ubicar decimales en recta | g4u4.s3, g3u4.s3 |
| g4u4.s5 | Comparar dos decimales hasta centésimos | g4u4.s4 |

**Concepción errónea y distractor para detectarla:** Elegir 0.45 > 0.7 porque 45>7 revela tratar partes decimales como enteros. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Cuadrículas y tiras → tabla de décimos/centésimos → 0.7 = 0.70.

**Explorar:** PaintGrid 10×10 y NumberLine. **Practicar:** Teclado decimal y comparar; no exigir algoritmos de operaciones decimales aún.

**Tres retos bilingües originales:**

**Reto 1.** ES: Escribe 7/10 como decimal. EN: Write 7/10 as a decimal.

**Respuesta:** 0.7.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El siete ocupa la posición de los décimos. | Put seven in the tenths place. |
| H2 — ejemplo resuelto distinto | 3/10 = 0.3. | 3/10 is 0.3. |
| H3 — respuesta explicada | 7/10 = 0.7; son siete décimos. | 7/10 = 0.7, or seven tenths. |

**Reto 2.** ES: Completa: 0.4 = □/100. EN: Fill in the blank: 0.4 = □/100.

**Respuesta:** 40.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada décimo contiene diez centésimos. | Each tenth contains ten hundredths. |
| H2 — ejemplo resuelto distinto | 0.6 = 6/10 = 60/100. | 0.6 = 6/10 = 60/100. |
| H3 — respuesta explicada | 0.4 = 4/10 = 40/100; falta 40. | 0.4 = 4/10 = 40/100. The missing numerator is 40. |

**Reto 3.** ES: ¿Cuál es mayor: 0.7 o 0.45? EN: Which is greater, 0.7 or 0.45?

**Respuesta:** 0.7.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Expresa ambos en centésimos. | Write both amounts in hundredths. |
| H2 — ejemplo resuelto distinto | 0.6 = 0.60 y supera a 0.52. | 0.6 = 0.60, which is greater than 0.52. |
| H3 — respuesta explicada | 0.7 = 0.70; 70 centésimos son más que 45. | 0.7 = 0.70. Seventy hundredths is greater than forty-five hundredths. |

**Plantilla de generación:** Numeradores 0…100; denominador 10 o 100; comparar inicialmente 0…1 y luego≤10. Serializar valores como enteros de centésimos. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** tenth/décimo; hundredth/centésimo; decimal point/punto decimal.

**Brief de ilustración:** Mural de piezas de color; cuadrícula matemática como capa editable. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g4u5 — Medidas, dinero y datos fraccionarios

**Estándares candidatos:** 4.MD.1, 4.MD.2, 4.MD.3, 4.MD.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** A. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Convertir a unidades menores dentro de un sistema y resolver medidas con datos. EN: Convert larger units to smaller units within a system and solve measurement problems.

**Objetivo para el niño:** ES: «Conservo la cantidad cuando cambio la unidad.» EN: “I can change units while keeping the same amount.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u5.s1 | Conocer equivalencias dentro del mismo sistema de medida | g2u4.s2 |
| g4u5.s2 | Convertir una unidad mayor a una menor | g4u5.s1, g4u2.s3 |
| g4u5.s3 | Resolver problemas de distancia, tiempo, masa, volumen y dinero | g4u5.s2, g4u2.s6, g4u4.s3 |
| g4u5.s4 | Usar fórmulas de área y perímetro rectangular | g3u5.s5 |
| g4u5.s5 | Leer y operar datos en diagramas de puntos de 1/2, 1/4 y 1/8 | g3u6.s5, g4u3.s3 |

**Concepción errónea y distractor para detectarla:** Elegir 3 m = 30 cm confunde factor de conversión; 300 cm correcto. No mezclar peso y masa como definiciones idénticas. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Instrumentos → tablas de equivalencia y barras → operación con unidades.

**Explorar:** Tabla de conversiones, NumberLine y gráfico de puntos. **Practicar:** Teclado con unidad y seleccionar representación.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuántos centímetros son 3 metros? EN: How many centimeters are in 3 meters?

**Respuesta:** 300.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada metro equivale a cien centímetros. | Each meter is 100 centimeters. |
| H2 — ejemplo resuelto distinto | 2 m = 2×100 = 200 cm. | 2 m = 2×100 = 200 cm. |
| H3 — respuesta explicada | 3×100 = 300 cm; la longitud no cambia. | 3×100 = 300 cm. The length stays the same. |

**Reto 2.** ES: Un rectángulo tiene área 24 cm² y un lado de 6 cm. ¿Cuánto mide el otro lado? EN: A rectangle has an area of 24 cm² and one side of 6 cm. What is the other side length?

**Respuesta:** 4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca el factor que falta en 6×□ = 24. | Find the missing factor in 6×□ = 24. |
| H2 — ejemplo resuelto distinto | Si el área es 15 cm² y un lado 5 cm, el otro mide 3 cm. | For an area of 15 cm² and a side of 5 cm, the other side is 3 cm. |
| H3 — respuesta explicada | 24÷6 = 4; el otro lado mide 4 cm. | 24÷6 = 4, so the other side is 4 cm. |

**Reto 3.** ES: Tres cintas miden 1/4 m, 2/4 m y 3/4 m. ¿Cuánto miden juntas? EN: Three ribbons measure 1/4 m, 2/4 m, and 3/4 m. What is their total length?

**Respuesta:** 1 1/2 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma las cantidades de cuartos. | Add the numbers of fourths. |
| H2 — ejemplo resuelto distinto | 1/8 m + 3/8 m = 4/8 m = 1/2 m. | 1/8 m + 3/8 m = 4/8 m = 1/2 m. |
| H3 — respuesta explicada | 1/4 + 2/4 + 3/4 = 6/4 = 1 1/2 m. | The lengths total 6/4 m, or 1 1/2 m. |

**Plantilla de generación:** Conversiones dentro de sistema: km/m/cm, kg/g, L/mL, hr/min/sec, lb/oz, ft/in; US gallon solo con etiqueta US. Problemas con enteros y fracciones simples/decimales accesibles; no conversión entre sistemas como meta. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** convert/convertir; ounce/onza; pound/libra; distance/distancia; line plot/diagrama de puntos.

**Brief de ilustración:** Cajas de materiales, jarras y cintas sin graduaciones dentro del arte. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g4u6 — Ángulos, rectas y simetría

**Estándares candidatos:** 4.MD.5, 4.MD.6, 4.MD.7, 4.G.1, 4.G.2, 4.G.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad. Fuentes de alcance: [S01]; foco: [S04d].

**Objetivo para la familia:** ES: Medir ángulos y clasificar figuras con rectas, ángulos y simetría. EN: Measure angles and classify shapes using lines, angles, and symmetry.

**Objetivo para el niño:** ES: «Comparo aberturas y atributos.» EN: “I can compare angle sizes and shape attributes.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g4u6.s1 | Distinguir puntos, segmentos, rectas y rayos | g3u5.s6 |
| g4u6.s2 | Reconocer paralelas y perpendiculares | g4u6.s1 |
| g4u6.s3 | Entender grado como 1/360 de vuelta | g4u6.s1, g3u4.s1 |
| g4u6.s4 | Medir y dibujar ángulos con transportador | g4u6.s3 |
| g4u6.s5 | Usar aditividad de ángulos para hallar uno desconocido | g4u6.s4, g4u1.s4 |
| g4u6.s6 | Clasificar triángulos y cuadriláteros por atributos | g4u6.s2, g4u6.s4 |
| g4u6.s7 | Identificar ejes de simetría | g4u6.s6 |

**Concepción errónea y distractor para detectarla:** Elegir el ángulo con rayos más largos como mayor detecta confundir abertura y longitud. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Plegado/giro → arcos y transportador → grados y clasificación.

**Explorar:** AngleTool con giro por toque y Geoboard; no depender de precisión fina de arrastre. **Practicar:** Seleccionar ángulo, teclado y eje con toque; aceptar la definición de trapecio configurada por docente.

**Tres retos bilingües originales:**

**Reto 1.** ES: Un ángulo recto se divide en 35° y otro ángulo. ¿Cuánto mide el otro? EN: A right angle is split into 35° and another angle. What is the other angle measure?

**Respuesta:** 55.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Un ángulo recto mide noventa grados. | A right angle measures ninety degrees. |
| H2 — ejemplo resuelto distinto | Si una parte mide 20°, la otra mide 90 − 20 = 70°. | If one part is 20°, the other is 90 − 20 = 70°. |
| H3 — respuesta explicada | 90 − 35 = 55°. Las partes suman el ángulo recto. | 90 − 35 = 55°. The two parts add to a right angle. |

**Reto 2.** ES: ¿Cómo se llaman dos rectas que se cruzan formando ángulos rectos? EN: What do we call two lines that meet at right angles?

**Respuesta:** perpendiculares / perpendicular.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca el atributo de la intersección. | Think about the angles where the lines meet. |
| H2 — ejemplo resuelto distinto | Las paralelas no se cruzan; las perpendiculares forman ángulos rectos. | Parallel lines do not meet. Perpendicular lines meet at right angles. |
| H3 — respuesta explicada | Son perpendiculares porque sus ángulos de intersección son rectos. | They are perpendicular because they meet at right angles. |

**Reto 3.** ES: ¿Cuántos ejes de simetría tiene un cuadrado? EN: How many lines of symmetry does a square have?

**Respuesta:** 4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca pliegues que hagan coincidir las mitades. | Look for folds that make the two halves match. |
| H2 — ejemplo resuelto distinto | Un rectángulo que no es cuadrado tiene dos: vertical y horizontal por el centro. | A nonsquare rectangle has two lines of symmetry through its center. |
| H3 — respuesta explicada | El cuadrado tiene cuatro: dos por los puntos medios de lados opuestos y dos diagonales. | A square has four: two through opposite side midpoints and two diagonals. |

**Plantilla de generación:** Ángulos enteros 0…180° para medir; vueltas completas como referencia de 360°; sumas parciales con total conocido. Polígonos rotados, ejemplos/no ejemplos. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** ray/rayo o semirrecta; angle/ángulo; degree/grado; parallel/paralelo; symmetry/simetría.

**Brief de ilustración:** Papel plegado y herramientas de dibujo, sin escalas artísticas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

### Unidades de 5.º grado

#### g5u1 — Valor posicional decimal

**Estándares candidatos:** 5.NBT.1, 5.NBT.2, 5.NBT.3, 5.NBT.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Interpretar, comparar y redondear decimales hasta milésimos. EN: Interpret, compare, and round decimals through thousandths.

**Objetivo para el niño:** ES: «Cada posición cambia por un factor de diez.» EN: “I can explain how each place changes by a factor of ten.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u1.s1 | Explicar posiciones como diez veces y una décima parte | g4u1.s2, g4u4.s3 |
| g5u1.s2 | Interpretar potencias de diez y patrones al multiplicar/dividir por ellas | g5u1.s1 |
| g5u1.s3 | Leer y escribir hasta milésimos y forma desarrollada | g5u1.s1 |
| g5u1.s4 | Comparar hasta milésimos | g5u1.s3 |
| g5u1.s5 | Redondear decimales a una posición indicada | g5u1.s4, g4u1.s3 |

**Concepción errónea y distractor para detectarla:** Elegir 0.305 > 0.35 porque 305>35 detecta comparar longitudes de cadena. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques redefiniendo el entero → tabla y recta → potencias y desarrollos.

**Explorar:** Tabla posicional con escala del entero explícita y NumberLine. **Practicar:** Teclado decimal y elegir explicación; no decir «se mueve el punto» como explicación única.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuál es mayor: 0.305 o 0.35? EN: Which is greater, 0.305 or 0.35?

**Respuesta:** 0.35.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Escribe las dos cantidades en milésimos. | Write both values in thousandths. |
| H2 — ejemplo resuelto distinto | 0.42 = 0.420, que supera a 0.408. | 0.42 = 0.420, which is greater than 0.408. |
| H3 — respuesta explicada | 0.35 = 0.350 y 350 milésimos superan 305 milésimos. | 0.35 = 0.350. Three hundred fifty thousandths is greater than three hundred five thousandths. |

**Reto 2.** ES: Calcula 4.7×100. EN: Find 4.7×100.

**Respuesta:** 470.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada cifra vale cien veces su valor anterior. | Each digit becomes worth one hundred times as much. |
| H2 — ejemplo resuelto distinto | 2.3×100 = 230. | 2.3×100 = 230. |
| H3 — respuesta explicada | 4.7×100 = 470; 47 décimos pasan a 470 unidades. | 4.7×100 = 470. Each digit shifts to a place worth 100 times as much. |

**Reto 3.** ES: Redondea 6.284 al centésimo más cercano. EN: Round 6.284 to the nearest hundredth.

**Respuesta:** 6.28.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Compara 6.284 con 6.28 y 6.29. | Compare 6.284 with 6.28 and 6.29. |
| H2 — ejemplo resuelto distinto | 3.476 está más cerca de 3.48 que de 3.47. | 3.476 is closer to 3.48 than to 3.47. |
| H3 — respuesta explicada | 6.284 está a 0.004 de 6.28 y a 0.006 de 6.29; queda 6.28. | 6.284 is closer to 6.28, so it rounds to 6.28. |

**Plantilla de generación:** Decimales no negativos con≤3 posiciones; potencias 10^k con k=0…3 en primeras lecciones; cálculo decimal exacto como enteros escalados. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** thousandth/milésimo; power of ten/potencia de diez; place value/valor posicional.

**Brief de ilustración:** Lupa de materiales y paneles ampliados; unidades matemáticas separadas. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g5u2 — Operaciones con enteros y decimales

**Estándares candidatos:** 5.NBT.5, 5.NBT.6, 5.NBT.7. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Multiplicar enteros con algoritmo estándar y operar decimales hasta centésimos con comprensión. EN: Multiply whole numbers with the standard algorithm and reason about operations with decimals to hundredths.

**Objetivo para el niño:** ES: «Estimo, calculo y compruebo.» EN: “I can estimate, calculate, and check.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u2.s1 | Multiplicar enteros de varias cifras con algoritmo estándar | g4u2.s3 |
| g5u2.s2 | Dividir hasta cuatro cifras entre dos cifras con estrategias | g4u2.s4, g5u2.s1 |
| g5u2.s3 | Sumar y restar decimales hasta centésimos | g5u1.s3, g4u1.s4 |
| g5u2.s4 | Multiplicar decimales hasta centésimos con modelos y estrategias | g5u1.s1, g5u2.s1 |
| g5u2.s5 | Dividir decimales hasta centésimos con modelos y estrategias | g5u2.s4, g5u2.s2 |
| g5u2.s6 | Explicar la razonabilidad y relación inversa | g5u2.s3, g5u2.s5 |

**Concepción errónea y distractor para detectarla:** 3.4 + 0.56 → elegir 0.90 detecta alinear bordes sin alinear valores posicionales. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Bloques y áreas → cuadrículas y tabla → procedimiento explicado.

**Explorar:** PaintGrid decimal y tabla posicional con canjes. **Practicar:** Teclado decimal; no exigir algoritmo estándar decimal como criterio de 5.NBT.7 (ese énfasis es 6.NS.3).

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 3.4 + 0.56. EN: Find 3.4 + 0.56.

**Respuesta:** 3.96.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Escribe 3.4 como 3.40. | Write 3.4 as 3.40. |
| H2 — ejemplo resuelto distinto | 2.3 + 0.45 = 2.30 + 0.45 = 2.75. | 2.3 + 0.45 = 2.30 + 0.45 = 2.75. |
| H3 — respuesta explicada | 3.40 + 0.56 = 3.96 al sumar posiciones del mismo valor. | Align equal place values: 3.40 + 0.56 = 3.96. |

**Reto 2.** ES: Calcula 24×36. EN: Find 24×36.

**Respuesta:** 864.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Separa 36 en 30 y 6. | Break 36 into 30 and 6. |
| H2 — ejemplo resuelto distinto | 23×12 = 230 + 46 = 276. | 23×12 = 230 + 46 = 276. |
| H3 — respuesta explicada | 24×30 + 24×6 = 720 + 144 = 864. | 24×30 + 24×6 = 720 + 144 = 864. |

**Reto 3.** ES: Una cinta mide 4.8 m. Se corta en trozos de 0.6 m. ¿Cuántos trozos salen? EN: A ribbon is 4.8 m long. It is cut into 0.6 m pieces. How many pieces are there?

**Respuesta:** 8.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca cuántas veces cabe 0.6 en 4.8. | Find how many groups of 0.6 fit in 4.8. |
| H2 — ejemplo resuelto distinto | 3.5÷0.5 = 7 porque 7×0.5 = 3.5. | 3.5÷0.5 = 7 because 7×0.5 = 3.5. |
| H3 — respuesta explicada | 4.8÷0.6 = 48÷6 = 8; salen ocho trozos. | 4.8÷0.6 = 48÷6 = 8 pieces. |

**Plantilla de generación:** Enteros de hasta cuatro cifras por dos en primera versión. Divisor entero 10…99; generar dividendo=d×q+r≤9999. Decimales con≤2 cifras, resultados finitos en generador inicial; división sin cero. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** decimal operation/operación decimal; align by place value/alinear por valor posicional; dividend/dividendo.

**Brief de ilustración:** Taller de cajas y cintas medibles sin cifras en el arte. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g5u3 — Sumar fracciones y entender el cociente

**Estándares candidatos:** 5.NF.1, 5.NF.2, 5.NF.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Sumar/restar fracciones con denominadores distintos e interpretar una fracción como división. EN: Add and subtract fractions with unlike denominators and interpret fractions as division.

**Objetivo para el niño:** ES: «Busco partes del mismo tamaño.» EN: “I can rename fractions using equal-size parts.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u3.s1 | Encontrar fracciones equivalentes con denominador común | g4u3.s1 |
| g5u3.s2 | Sumar fracciones y mixtos con denominadores distintos | g5u3.s1, g4u3.s4 |
| g5u3.s3 | Restar fracciones y mixtos con denominadores distintos | g5u3.s2 |
| g5u3.s4 | Resolver problemas y estimar con referencias como 1/2 y 1 | g5u3.s3, g4u3.s2 |
| g5u3.s5 | Interpretar a/b como a÷b en reparto | g3u2.s1, g4u3.s4 |

**Concepción errónea y distractor para detectarla:** 1/2 + 1/3 → elegir 2/5 revela sumar numeradores y denominadores sin igualar unidad. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Tiras y reparto → barras/recta → denominador común y fracción-cociente.

**Explorar:** FractionBars sincronizadas; reparto de varios enteros. **Practicar:** Teclado fraccionario, estimación y modelo; aceptar denominador común no mínimo.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 1/2 + 1/3. EN: Find 1/2 + 1/3.

**Respuesta:** 5/6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cambia ambas fracciones a sextos. | Rename both fractions in sixths. |
| H2 — ejemplo resuelto distinto | 1/2 + 1/4 = 2/4 + 1/4 = 3/4. | 1/2 + 1/4 = 2/4 + 1/4 = 3/4. |
| H3 — respuesta explicada | 1/2 = 3/6 y 1/3 = 2/6; total 5/6. | 1/2 = 3/6 and 1/3 = 2/6. The sum is 5/6. |

**Reto 2.** ES: Calcula 3/4 − 1/6. EN: Find 3/4 − 1/6.

**Respuesta:** 7/12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Usa doceavos para representar las dos cantidades. | Use twelfths to show both amounts. |
| H2 — ejemplo resuelto distinto | 2/3 − 1/4 = 8/12 − 3/12 = 5/12. | 2/3 − 1/4 = 8/12 − 3/12 = 5/12. |
| H3 — respuesta explicada | 3/4 = 9/12 y 1/6 = 2/12; 9/12 − 2/12 = 7/12. | Rename the fractions: 9/12 − 2/12 = 7/12. |

**Reto 3.** ES: Se reparten 3 metros de cinta entre 4 personas por igual. ¿Cuántos metros recibe cada persona? EN: Share 3 meters of ribbon equally among 4 people. How many meters does each person get?

**Respuesta:** 3/4 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada metro puede dividirse en cuatro. | Each meter can be split into fourths. |
| H2 — ejemplo resuelto distinto | 2 metros entre 3 personas dan 2/3 m por persona. | 2 meters shared among 3 people gives 2/3 m each. |
| H3 — respuesta explicada | 3÷4 = 3/4; cada persona recibe tres cuartos de metro. | 3÷4 = 3/4. Each person gets three fourths of a meter. |

**Plantilla de generación:** Denominadores 2…12 inicialmente, luego 20,25,100; numeradores hasta 3d; restas no negativas; reparto a=1…12 enteros entre b=2…12 personas con objetos divisibles. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** common denominator/denominador común; quotient/cociente; share/repartir.

**Brief de ilustración:** Mesa de materiales divisibles, sin estereotipos de consumo o celebraciones. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g5u4 — Multiplicar fracciones y dividir por unidades fraccionarias

**Estándares candidatos:** 5.NF.4, 5.NF.5, 5.NF.6, 5.NF.7. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Multiplicar fracciones y explicar escalamiento; dividir fracciones unitarias y enteros. EN: Multiply fractions, explain scaling, and divide unit fractions and whole numbers.

**Objetivo para el niño:** ES: «Una parte de una parte también se puede medir.» EN: “I can find a part of a part.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u4.s1 | Interpretar una fracción de una cantidad | g4u3.s5 |
| g5u4.s2 | Multiplicar fracción por fracción con modelo | g5u4.s1, g5u3.s1 |
| g5u4.s3 | Relacionar producto fraccionario con área rectangular | g5u4.s2, g3u5.s2 |
| g5u4.s4 | Explicar producto mayor/igual/menor según factor comparado con uno | g5u4.s2 |
| g5u4.s5 | Resolver problemas de producto con fracciones y mixtos | g5u4.s4 |
| g5u4.s6 | Dividir fracción unitaria por entero | g5u3.s5, g5u4.s2 |
| g5u4.s7 | Dividir entero por fracción unitaria | g5u4.s6 |

**Concepción errónea y distractor para detectarla:** Elegir 8×1/2 > 8 revela «multiplicar siempre agranda». Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Papel/tiras → área y recta → producto y divisiones con significado.

**Explorar:** PaintGrid superpone partes con patrones además de color; FractionBars. **Practicar:** Teclado fraccionario y elegir tamaño esperado; no división general fracción÷fracción como meta de 5.º.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 1/2 de 3/4. EN: What is 1/2 of 3/4?

**Respuesta:** 3/8.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Divide tres cuartos en dos partes iguales. | Split three fourths into two equal shares. |
| H2 — ejemplo resuelto distinto | La mitad de 1/3 es 1/6. | Half of 1/3 is 1/6. |
| H3 — respuesta explicada | 1/2×3/4 = 3/8; es menor que 3/4 porque tomaste la mitad. | 1/2×3/4 = 3/8. Taking half makes the amount smaller. |

**Reto 2.** ES: ¿Cuántas porciones de 1/4 L hay en 3 L? EN: How many 1/4-liter servings are in 3 liters?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada litro contiene cuatro cuartos. | Each liter contains four fourths. |
| H2 — ejemplo resuelto distinto | En 2 L caben 2×4 = 8 porciones de 1/4 L. | 2 liters contain 2×4 = 8 quarter-liter servings. |
| H3 — respuesta explicada | 3÷1/4 = 12; caben doce porciones. | 3÷1/4 = 12 servings. |

**Reto 3.** ES: Reparte 1/3 m de cinta entre 2 personas por igual. ¿Cuánto recibe cada una? EN: Share 1/3 m of ribbon equally between 2 people. How much does each person get?

**Respuesta:** 1/6 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Parte un tercio en dos partes iguales. | Split one third into two equal shares. |
| H2 — ejemplo resuelto distinto | 1/4÷2 = 1/8. | One fourth shared in two equal parts gives one eighth. |
| H3 — respuesta explicada | 1/3÷2 = 1/6 m; dos sextos reconstruyen un tercio. | 1/3÷2 = 1/6 m. Two sixths make one third. |

**Plantilla de generación:** Numeradores 1…9 y denominadores 2…12; enteros 1…12; división solo (1/b)÷n o n÷(1/b). Caso factor=1 explícito; divisores≠0. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** scaling/escalamiento; unit fraction/fracción unitaria; of/de como relación multiplicativa.

**Brief de ilustración:** Telas y paneles de mosaico, con superficies matemáticas independientes. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g5u5 — Volumen, conversiones y datos

**Estándares candidatos:** 5.MD.1, 5.MD.2, 5.MD.3, 5.MD.4, 5.MD.5. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para volumen; A para conversiones/datos. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Medir volumen con cubos y resolver conversiones y datos fraccionarios. EN: Measure volume with unit cubes and solve conversion and fractional-data problems.

**Objetivo para el niño:** ES: «Cuento capas y conservo las unidades.» EN: “I can count layers and keep track of units.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u5.s1 | Medir volumen con cubos unitarios sin huecos | g3u5.s2 |
| g5u5.s2 | Calcular volumen como capas y l×w×h | g5u5.s1, g5u2.s1 |
| g5u5.s3 | Sumar volúmenes de prismas sin solapamiento | g5u5.s2 |
| g5u5.s4 | Convertir unidades dentro de un sistema en ambos sentidos | g4u5.s2, g5u2.s5 |
| g5u5.s5 | Resolver datos de diagrama de puntos con medidas de 1/2, 1/4 y 1/8 | g4u5.s5, g5u3.s3 |

**Concepción errónea y distractor para detectarla:** Prisma 4×3×2 → elegir 24 cm² detecta unidad de superficie en volumen; exigir unidad cúbica. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Cubos físicos → capas 3D/planos → V=lwh y suma.

**Explorar:** CubeLayers permite ver capas y ocultar decoraciones; gráfico de puntos. **Practicar:** Teclado con unidad, construir capas y elegir descomposición.

**Tres retos bilingües originales:**

**Reto 1.** ES: Una caja mide 4 cm por 3 cm por 2 cm. ¿Cuál es su volumen? EN: A box measures 4 cm by 3 cm by 2 cm. What is its volume?

**Respuesta:** 24.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cada capa tiene cuatro por tres cubos. | Each layer has four by three unit cubes. |
| H2 — ejemplo resuelto distinto | Una caja 3×2×2 tiene 6 cubos por capa y 2 capas: 12 cm³. | A 3-by-2-by-2 box has 6 cubes in each of 2 layers, or 12 cm³. |
| H3 — respuesta explicada | 4×3×2 = 24 cm³. Son dos capas de doce cubos unitarios. | 4×3×2 = 24 cm³, or two layers of twelve unit cubes. |

**Reto 2.** ES: Convierte 250 cm a metros. EN: Convert 250 cm to meters.

**Respuesta:** 2.5 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cien centímetros forman un metro. | One hundred centimeters make one meter. |
| H2 — ejemplo resuelto distinto | 150 cm÷100 = 1.5 m. | 150 cm divided by 100 is 1.5 m. |
| H3 — respuesta explicada | 250÷100 = 2.5 m; son dos metros y medio. | 250÷100 = 2.5 m, or two and a half meters. |

**Reto 3.** ES: Dos cintas miden 3/4 m cada una y otra mide 1/2 m. ¿Cuánto miden juntas? EN: Two ribbons are each 3/4 m long. A third is 1/2 m long. What is their total length?

**Respuesta:** 2 m.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Expresa la media unidad en cuartos. | Rename one half in fourths. |
| H2 — ejemplo resuelto distinto | 1/4 + 1/4 + 1/2 = 1 m. | 1/4 + 1/4 + 1/2 = 1 m. |
| H3 — respuesta explicada | 3/4 + 3/4 + 2/4 = 8/4 = 2 m. | 3/4 + 3/4 + 2/4 = 8/4 = 2 m. |

**Plantilla de generación:** Dimensiones enteras 1…10 para 5.MD.5; volumen≤1000. Prismas compuestos no superpuestos. Datos en octavos y conversiones dentro del mismo sistema. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** volume/volumen; cubic unit/unidad cúbica; layer/capa; prism/prisma.

**Brief de ilustración:** Cajas abiertas y bloques neutros; dimensiones y cubos son geometría programática. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g5u6 — Expresiones, coordenadas y familias de figuras

**Estándares candidatos:** 5.OA.1, 5.OA.2, 5.OA.3, 5.G.1, 5.G.2, 5.G.3, 5.G.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad. Fuentes de alcance: [S01]; foco: [S04e].

**Objetivo para la familia:** ES: Interpretar expresiones y patrones, graficar en el primer cuadrante y clasificar figuras. EN: Interpret expressions and patterns, graph in the first quadrant, and classify shapes.

**Objetivo para el niño:** ES: «Uso reglas y atributos para organizar.» EN: “I can organize ideas using rules and attributes.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g5u6.s1 | Evaluar expresiones con paréntesis, corchetes y llaves | g3u3.s4, g5u2.s1 |
| g5u6.s2 | Escribir una expresión sin evaluarla | g5u6.s1 |
| g5u6.s3 | Generar dos patrones, formar pares y explicar relación | g4u1.s6 |
| g5u6.s4 | Ubicar pares ordenados en primer cuadrante | g5u6.s3, g2u4.s4 |
| g5u6.s5 | Interpretar puntos en un contexto | g5u6.s4 |
| g5u6.s6 | Reconocer herencia de atributos de subcategorías de figuras | g4u6.s6 |
| g5u6.s7 | Construir jerarquías geométricas | g5u6.s6 |

**Concepción errónea y distractor para detectarla:** (2,5) → elegir (5,2) revela invertir el orden; la flecha «primero horizontal» debe ser accesible. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Fichas/patrones → árboles y plano → expresiones/pares.

**Explorar:** SequencePad, CoordinatePlane con botón de avance horizontal/vertical, clasificación. **Practicar:** Toque en puntos, teclado y elegir expresión; no arrastre diminuto.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 3×(8 + 2). EN: Evaluate 3×(8 + 2).

**Respuesta:** 30.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Resuelve primero lo que está entre paréntesis. | Work inside the parentheses first. |
| H2 — ejemplo resuelto distinto | 2×(6 + 4) = 2×10 = 20. | 2×(6 + 4) = 2×10 = 20. |
| H3 — respuesta explicada | 8 + 2 = 10; 3×10 = 30. | 8 + 2 = 10, then 3×10 = 30. |

**Reto 2.** ES: ¿Cuántas unidades avanzas horizontalmente desde el origen para ubicar (2,5)? EN: How many units do you move horizontally from the origin to plot (2,5)?

**Respuesta:** 2.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | La primera coordenada indica el movimiento horizontal. | The first coordinate gives the horizontal move. |
| H2 — ejemplo resuelto distinto | Para (4,3), avanza 4 horizontalmente y 3 verticalmente. | For (4,3), move 4 horizontally and 3 vertically. |
| H3 — respuesta explicada | Avanzas 2 unidades horizontalmente y luego 5 hacia arriba. | Move 2 units horizontally, then 5 units up. |

**Reto 3.** ES: ¿Todos los cuadrados son rectángulos según la definición de cuatro ángulos rectos? EN: Are all squares rectangles when a rectangle is defined as a quadrilateral with four right angles?

**Respuesta:** sí / yes.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Revisa los atributos, no el nombre habitual. | Check the attributes rather than the familiar name. |
| H2 — ejemplo resuelto distinto | Un cuadrado también es rombo porque tiene cuatro lados iguales. | A square is also a rhombus because all four sides are equal. |
| H3 — respuesta explicada | Sí. Todo cuadrado tiene cuatro lados y cuatro ángulos rectos, así que cumple la definición de rectángulo. | Yes. Every square has four sides and four right angles, so every square meets the definition of a rectangle. |

**Plantilla de generación:** Expresiones con enteros y dos niveles de agrupación al inicio; coordenadas 0…10; patrones pares con regla explícita; definiciones inclusivas de cuadrado/rectángulo/rombo. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** ordered pair/par ordenado; parentheses/paréntesis; axis/eje; hierarchy/jerarquía.

**Brief de ilustración:** Mapa de jardín comunitario con plano de la app, sin rótulos pintados. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

### Unidades de 6.º grado

#### g6u1 — División de fracciones y cálculo con varios dígitos

**Estándares candidatos:** 6.NS.1, 6.NS.2, 6.NS.3, 6.NS.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C para división de fracciones; Ad para cálculo/factores. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Dividir fracciones con significado y consolidar algoritmos, factores y múltiplos comunes. EN: Divide fractions meaningfully and consolidate algorithms, common factors, and multiples.

**Objetivo para el niño:** ES: «Explico cuántas veces cabe una cantidad en otra.» EN: “I can explain how many groups fit in an amount.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u1.s1 | Interpretar y calcular fracción entre fracción | g5u4.s7, g5u4.s2 |
| g6u1.s2 | Resolver problemas de división de fracciones | g6u1.s1 |
| g6u1.s3 | Dividir enteros de varias cifras con algoritmo estándar | g5u2.s2 |
| g6u1.s4 | Operar decimales con algoritmos estándar | g5u2.s6 |
| g6u1.s5 | Hallar MCD de dos enteros≤100 y mcm de dos enteros≤12 | g4u1.s5 |
| g6u1.s6 | Usar distributiva para extraer factor común | g6u1.s5, g3u2.s4 |

**Concepción errónea y distractor para detectarla:** 3/4÷1/2 → elegir 3/8 detecta multiplicar por el divisor sin interpretar cociente. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Tiras/reparto → barras/recta con unidades comunes → recíproco justificado.

**Explorar:** FractionBars muestra cuántos segmentos de divisor caben, incluso una parte de grupo. **Practicar:** Teclado de fracciones, cociente decimal y elegir explicación; no regla «invierte y multiplica» sin modelo.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 3/4÷1/2. EN: Find 3/4÷1/2.

**Respuesta:** 3/2.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Expresa las dos cantidades en cuartos. | Show both amounts in fourths. |
| H2 — ejemplo resuelto distinto | 1/2÷1/4 = 2 porque dos cuartos caben en una mitad. | 1/2÷1/4 = 2 because two fourths fit in one half. |
| H3 — respuesta explicada | 3/4÷2/4 = 3/2: cabe una mitad completa y media mitad más. | 3/4÷2/4 = 3/2. One full half and half of another half fit. |

**Reto 2.** ES: Calcula 5.04÷0.6. EN: Find 5.04÷0.6.

**Respuesta:** 8.4.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Multiplica dividendo y divisor por diez. | Multiply both the dividend and divisor by ten. |
| H2 — ejemplo resuelto distinto | 3.6÷0.4 = 36÷4 = 9. | 3.6÷0.4 = 36÷4 = 9. |
| H3 — respuesta explicada | 5.04÷0.6 = 50.4÷6 = 8.4. Comprueba: 8.4×0.6 = 5.04. | 5.04÷0.6 = 50.4÷6 = 8.4. Check by multiplying 8.4×0.6. |

**Reto 3.** ES: ¿Cuál es el máximo común divisor de 24 y 36? EN: What is the greatest common factor of 24 and 36?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca el mayor número que divide a ambos. | Find the largest number that divides both numbers. |
| H2 — ejemplo resuelto distinto | El MCD de 18 y 30 es 6. | The greatest common factor of 18 and 30 is 6. |
| H3 — respuesta explicada | 24 = 2×12 y 36 = 3×12; ningún divisor común es mayor que 12. | 24 = 2×12 and 36 = 3×12. Their greatest common factor is 12. |

**Plantilla de generación:** Fracciones positivas a/b,c/d con b,d=2…12,c>0; cociente puede no ser entero. MCD entradas 1…100; mcm entradas 1…12; decimales finitos y denominador de división no cero. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** reciprocal/recíproco; greatest common factor/máximo común divisor; least common multiple/mínimo común múltiplo.

**Brief de ilustración:** Estación de cintas y recipientes con medidas renderizadas por código. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u2 — Razones, tasas y porcentajes

**Estándares candidatos:** 6.RP.1, 6.RP.2, 6.RP.3. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Usar relaciones multiplicativas, tasa unitaria y porcentajes para resolver situaciones. EN: Use multiplicative relationships, unit rates, and percents to solve problems.

**Objetivo para el niño:** ES: «Comparo cantidades por cada unidad.» EN: “I can compare quantities using a per-one rate.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u2.s1 | Describir razón parte-parte y parte-total | g4u2.s2 |
| g6u2.s2 | Construir tablas y rectas dobles de razones equivalentes | g6u2.s1, g5u6.s4 |
| g6u2.s3 | Hallar tasa por una unidad y comparar precios/velocidad | g6u2.s2, g5u2.s5 |
| g6u2.s4 | Interpretar porcentaje como razón por cien | g4u4.s3, g6u2.s1 |
| g6u2.s5 | Hallar parte, porcentaje o total a partir de los otros | g6u2.s4, g5u4.s2 |
| g6u2.s6 | Convertir unidades con razonamiento de razones | g6u2.s3, g5u5.s4 |

**Concepción errónea y distractor para detectarla:** Razón rojo:azul 2:3 → elegir 2/3 como fracción roja del total confunde parte-parte con parte-total. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Grupos y mezclas → tablas, barras, recta doble → tasas y porcentaje.

**Explorar:** RatioTable y DoubleNumberLine, PaintGrid por cien. **Practicar:** Teclado con unidad de tasa y elegir comparación; evitar multiplicación cruzada como primer método.

**Tres retos bilingües originales:**

**Reto 1.** ES: Hay 2 fichas rojas por cada 3 azules. ¿Qué fracción del total es roja? EN: There are 2 red counters for every 3 blue counters. What fraction of all the counters is red?

**Respuesta:** 2/5.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Cuenta todas las partes de un grupo completo. | Count all the parts in one complete group. |
| H2 — ejemplo resuelto distinto | Con 1 verde y 4 amarillas, la fracción verde es 1/5. | With 1 green and 4 yellow counters, the green fraction is 1/5. |
| H3 — respuesta explicada | Hay 2 + 3 = 5 partes; 2 son rojas: 2/5. | There are 5 parts altogether, and 2 are red: 2/5. |

**Reto 2.** ES: Cuatro cuadernos cuestan $6. ¿Cuánto cuesta cada uno si todos cuestan lo mismo? EN: Four notebooks cost $6. If they have the same price, what is the cost per notebook?

**Respuesta:** 1.50 USD.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Divide el costo total entre la cantidad. | Divide the total cost by the number of notebooks. |
| H2 — ejemplo resuelto distinto | Tres cuadernos por $6 cuestan $2 por cuaderno. | Three notebooks for $6 cost $2 per notebook. |
| H3 — respuesta explicada | 6÷4 = 1.50; cuesta $1.50 por cuaderno. | 6÷4 = 1.50, so the unit price is $1.50 per notebook. |

**Reto 3.** ES: El 25% de una colección son 12 fichas. ¿Cuántas fichas tiene la colección? EN: 25% of a collection is 12 counters. How many counters are in the whole collection?

**Respuesta:** 48.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Veinticinco por ciento es una cuarta parte. | Twenty-five percent is one fourth. |
| H2 — ejemplo resuelto distinto | Si 25% son 8, el total es 4×8 = 32. | If 25% is 8, the whole is 4×8 = 32. |
| H3 — respuesta explicada | Si un cuarto son 12, cuatro cuartos son 4×12 = 48. | If one fourth is 12, the whole is 4×12 = 48. |

**Plantilla de generación:** Razones a:b con enteros 1…12, factores de escala 1…8; tasa no expresada como fracción compleja en 6.RP.2. Porcentajes iniciales 10,20,25,50,75,100; ampliar tras comprensión, sin descuentos encadenados. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** ratio/razón; rate/tasa; unit rate/tasa unitaria; percent/porcentaje; per/por cada.

**Brief de ilustración:** Preparación de materiales de un taller sin productos o marcas comerciales. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u3 — Racionales, valor absoluto y coordenadas

**Estándares candidatos:** 6.NS.5, 6.NS.6, 6.NS.7, 6.NS.8. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Interpretar negativos, ordenar racionales y usar los cuatro cuadrantes. EN: Interpret negative numbers, order rational numbers, and use all four quadrants.

**Objetivo para el niño:** ES: «Ubico números a ambos lados del cero.» EN: “I can place numbers on both sides of zero.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u3.s1 | Interpretar positivos, negativos y cero en contextos | g5u1.s4 |
| g6u3.s2 | Identificar opuestos y ubicar racionales | g6u3.s1, g3u4.s3 |
| g6u3.s3 | Comparar racionales y escribir desigualdades | g6u3.s2 |
| g6u3.s4 | Interpretar valor absoluto como distancia a cero | g6u3.s2 |
| g6u3.s5 | Ubicar puntos y reflejos en cuatro cuadrantes | g6u3.s2, g5u6.s4 |
| g6u3.s6 | Hallar distancia entre puntos con coordenada común | g6u3.s4, g6u3.s5 |

**Concepción errónea y distractor para detectarla:** Elegir −8 > −3 porque 8>3 detecta ignorar posición respecto a cero. No enseñar operaciones generales con enteros como objetivo de 6.º. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Termómetro y desplazamiento → rectas/plano → orden y valor absoluto.

**Explorar:** NumberLine con cero fijo y CoordinatePlane. **Practicar:** Toque, teclado de signo y seleccionar comparación; no saltos de cálculo de enteros de 7.º.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuál es mayor: −3 o −8? EN: Which is greater, −3 or −8?

**Respuesta:** −3.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | En la recta, el mayor está más a la derecha. | The greater number is farther right on the number line. |
| H2 — ejemplo resuelto distinto | −2 > −5 porque −2 está más a la derecha. | −2 > −5 because −2 is farther to the right. |
| H3 — respuesta explicada | −3 está a la derecha de −8; por eso −3 > −8. | −3 is to the right of −8, so −3 > −8. |

**Reto 2.** ES: ¿Cuál es el valor absoluto de −6? EN: What is the absolute value of −6?

**Respuesta:** 6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Piensa en distancia al cero. | Think of distance from zero. |
| H2 — ejemplo resuelto distinto | El valor absoluto de −4 es 4. | The absolute value of −4 is 4. |
| H3 — respuesta explicada | −6 está a 6 unidades de cero, así que |−6| = 6. | −6 is 6 units from zero, so |−6| = 6. |

**Reto 3.** ES: ¿Qué distancia hay entre (−2,3) y (4,3)? EN: What is the distance between (−2,3) and (4,3)?

**Respuesta:** 6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Tienen la misma coordenada vertical. Recorre la horizontal. | They have the same vertical coordinate. Measure horizontally. |
| H2 — ejemplo resuelto distinto | De (−1,2) a (3,2) hay 1 + 3 = 4 unidades. | From (−1,2) to (3,2) is 1 + 3 = 4 units. |
| H3 — respuesta explicada | De −2 a 0 hay 2 y de 0 a 4 hay 4; total 6 unidades. | It is 2 units to zero and 4 more to 4, for a distance of 6 units. |

**Plantilla de generación:** Racionales en −10…10 al inicio, enteros/medios/décimos; distancias en horizontal o vertical únicamente; sin distancia euclidiana diagonal ni fórmula de Pitágoras. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** opposite/opuesto; absolute value/valor absoluto; negative/negativo; quadrant/cuadrante.

**Brief de ilustración:** Paisaje de elevaciones y mapa sin cifras; escalas de app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u4 — Expresiones y estructura algebraica

**Estándares candidatos:** 6.EE.1, 6.EE.2, 6.EE.3, 6.EE.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Escribir, evaluar y transformar expresiones con variables y exponentes enteros. EN: Write, evaluate, and transform expressions with variables and whole-number exponents.

**Objetivo para el niño:** ES: «Veo la estructura detrás de una expresión.» EN: “I can see how an expression is built.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u4.s1 | Evaluar potencias con exponentes enteros no negativos en casos iniciales positivos | g5u1.s2, g5u6.s1 |
| g6u4.s2 | Escribir expresiones desde un contexto | g5u6.s2 |
| g6u4.s3 | Identificar términos, factores, coeficientes y operaciones | g6u4.s2 |
| g6u4.s4 | Sustituir valores y evaluar expresiones | g6u4.s1, g6u4.s3 |
| g6u4.s5 | Generar expresiones equivalentes con propiedades | g6u4.s3, g6u1.s6 |
| g6u4.s6 | Reconocer equivalencia para todos los valores permitidos | g6u4.s5 |

**Concepción errónea y distractor para detectarla:** 3² → elegir 6 detecta confundir exponente con factor; 2(x+3) → 2x+3 detecta distribución parcial. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Fichas agrupadas → árboles de expresión/áreas → variables y equivalencias.

**Explorar:** ExpressionBuilder con fichas táctiles y área distributiva. **Practicar:** Teclado estructurado y selección de explicación; una coincidencia numérica no demuestra equivalencia.

**Tres retos bilingües originales:**

**Reto 1.** ES: Calcula 3² + 4. EN: Evaluate 3² + 4.

**Respuesta:** 13.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El exponente indica factores iguales, no una multiplicación por dos. | The exponent tells how many equal factors to use. |
| H2 — ejemplo resuelto distinto | 2³ + 1 = 2×2×2 + 1 = 9. | 2³ + 1 = 2×2×2 + 1 = 9. |
| H3 — respuesta explicada | 3² + 4 = 3×3 + 4 = 13. | 3² + 4 = 9 + 4 = 13. |

**Reto 2.** ES: Evalúa 2x + 5 si x = 4. EN: Evaluate 2x + 5 when x = 4.

**Respuesta:** 13.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Sustituye x por cuatro. | Replace x with four. |
| H2 — ejemplo resuelto distinto | Si x = 3, entonces 2x + 5 = 6 + 5 = 11. | When x = 3, 2x + 5 = 6 + 5 = 11. |
| H3 — respuesta explicada | 2×4 + 5 = 8 + 5 = 13. | 2×4 + 5 = 8 + 5 = 13. |

**Reto 3.** ES: Elige una expresión equivalente a 3(x + 2). EN: Choose an expression equivalent to 3(x + 2).

**Respuesta:** 3x + 6.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El tres multiplica a todo lo que está dentro. | Three multiplies every term inside the parentheses. |
| H2 — ejemplo resuelto distinto | 2(x + 4) = 2x + 8. | 2(x + 4) = 2x + 8. |
| H3 — respuesta explicada | 3(x + 2) = 3x + 3×2 = 3x + 6 para todo x permitido. | 3(x + 2) = 3x + 6 for every allowed value of x. |

**Plantilla de generación:** Bases enteras 1…10; exponentes iniciales 1…4, ampliar 0 tras explicar base no cero. Variables no negativas iniciales y valores racionales simples; restringir denominadores≠0; evitar 0^0. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** expression/expresión; coefficient/coeficiente; term/término; exponent/exponente.

**Brief de ilustración:** Taller de patrones con fichas algebraicas de UI. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u5 — Ecuaciones, desigualdades y relaciones

**Estándares candidatos:** 6.EE.5, 6.EE.6, 6.EE.7, 6.EE.8, 6.EE.9. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** C. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Resolver ecuaciones de un paso y representar relaciones entre variables. EN: Solve one-step equations and represent relationships between variables.

**Objetivo para el niño:** ES: «Busco valores que hagan verdadera la relación.» EN: “I can find values that make a statement true.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u5.s1 | Comprobar si un valor satisface ecuación o desigualdad | g6u4.s4 |
| g6u5.s2 | Escribir ecuación para una situación | g6u4.s2, g6u5.s1 |
| g6u5.s3 | Resolver x+p=q y px=q con racionales no negativos | g6u5.s2, g6u1.s1 |
| g6u5.s4 | Representar x>c y x<c en recta y reconocer infinitas soluciones | g6u3.s3, g6u5.s1 |
| g6u5.s5 | Identificar variable independiente y dependiente | g5u6.s5 |
| g6u5.s6 | Relacionar ecuación, tabla y gráfica de dos variables | g6u5.s5, g6u2.s2 |

**Concepción errónea y distractor para detectarla:** x+5=12 → elegir 17 revela sumar en vez de deshacer la suma. x>3 no incluye 3. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Balanza y grupos → barras/tablas/recta → ecuación y solución.

**Explorar:** BalanceEquality, NumberLine con extremos abiertos, tabla de relación. **Practicar:** Teclado y toque de región; no pedir sistemas o ecuaciones de varios pasos como requisito.

**Tres retos bilingües originales:**

**Reto 1.** ES: Resuelve x + 5 = 12. EN: Solve x + 5 = 12.

**Respuesta:** 7.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Busca qué número más cinco da doce. | Find the number that makes twelve when five is added. |
| H2 — ejemplo resuelto distinto | En y + 3 = 10, y = 7 porque 7 + 3 = 10. | For y + 3 = 10, y = 7 because 7 + 3 = 10. |
| H3 — respuesta explicada | x = 12 − 5 = 7; al sustituir, 7 + 5 = 12. | x = 7. Check: 7 + 5 = 12. |

**Reto 2.** ES: Selecciona todos los valores que cumplen x > 3: 2, 3, 4 y 5. EN: Select all values that satisfy x > 3: 2, 3, 4, and 5.

**Respuesta:** 4, 5.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Mayor que no incluye el valor del límite. | Greater than does not include the boundary value. |
| H2 — ejemplo resuelto distinto | Para x > 1, entre 0, 1 y 2 solo sirve 2. | For x > 1, only 2 works among 0, 1, and 2. |
| H3 — respuesta explicada | 4 y 5 son mayores que 3; 3 no cumple la desigualdad estricta. | 4 and 5 are greater than 3. Three does not satisfy a strict inequality. |

**Reto 3.** ES: Cada cuaderno cuesta $2. Si n es la cantidad, ¿qué ecuación da el costo c? EN: Each notebook costs $2. If n is the number of notebooks, which equation gives the cost c?

**Respuesta:** c = 2n.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | El costo cambia con la cantidad de cuadernos. | The cost depends on the number of notebooks. |
| H2 — ejemplo resuelto distinto | A $3 cada uno, el costo sería c = 3n. | At $3 each, the cost would be c = 3n. |
| H3 — respuesta explicada | c = 2n porque hay dos dólares por cada cuaderno; n es independiente y c dependiente. | c = 2n because each notebook adds two dollars. n is the input and c depends on n. |

**Plantilla de generación:** Ecuaciones de una etapa con p,q racionales no negativos, p>0 si multiplica; x≥0 al generar. Desigualdades simples estrictas; relaciones iniciales y=kx con tabla y gráfica. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** equation/ecuación; solution/solución; inequality/desigualdad; dependent/dependiente.

**Brief de ilustración:** Balanza y mesa de preparación; símbolos exactos por app. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u6 — Área, superficie y volumen

**Estándares candidatos:** 6.G.1, 6.G.2, 6.G.3, 6.G.4. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** A. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Descomponer polígonos y prismas para calcular área, superficie y volumen con medidas racionales. EN: Break polygons and prisms apart to find area, surface area, and volume with rational measurements.

**Objetivo para el niño:** ES: «Desarmo figuras para medirlas.» EN: “I can break shapes apart to measure them.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u6.s1 | Derivar y usar área de triángulo y paralelogramo | g3u5.s3, g5u4.s3 |
| g6u6.s2 | Descomponer polígonos para calcular área | g6u6.s1 |
| g6u6.s3 | Calcular volumen de prisma rectangular con aristas fraccionarias | g5u5.s2, g5u4.s2 |
| g6u6.s4 | Trazar polígonos en coordenadas y hallar lados alineados a ejes | g6u3.s6 |
| g6u6.s5 | Relacionar redes de sólidos con caras | g2u6.s1 |
| g6u6.s6 | Calcular área superficial desde una red | g6u6.s5, g6u6.s1 |

**Concepción errónea y distractor para detectarla:** Usar lado inclinado como altura en A=bh/2 detecta ignorar perpendicularidad. Superficie usa unidades cuadradas, volumen cúbicas. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Recortes/cajas → redes y diagramas → fórmulas justificadas.

**Explorar:** Geoboard, NetBuilder y CubeLayers; selección por toque como alternativa al arrastre. **Practicar:** Teclado con unidades y elegir descomposición; evitar volumen general de pirámide.

**Tres retos bilingües originales:**

**Reto 1.** ES: Un triángulo tiene base 8 cm y altura perpendicular 3 cm. ¿Cuál es su área? EN: A triangle has a base of 8 cm and a perpendicular height of 3 cm. What is its area?

**Respuesta:** 12.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Un triángulo ocupa la mitad del paralelogramo correspondiente. | A triangle is half of a matching parallelogram. |
| H2 — ejemplo resuelto distinto | Con base 6 y altura 4, A = 6×4÷2 = 12 cm². | With base 6 and height 4, the area is 6×4÷2 = 12 cm². |
| H3 — respuesta explicada | 8×3÷2 = 12 cm². Se usa la altura perpendicular. | 8×3÷2 = 12 cm², using the perpendicular height. |

**Reto 2.** ES: Un prisma rectangular mide 3 m por 2 m por 1/2 m. ¿Cuál es su volumen? EN: A rectangular prism measures 3 m by 2 m by 1/2 m. What is its volume?

**Respuesta:** 3 m³.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Multiplica el área de la base por la altura. | Multiply the base area by the height. |
| H2 — ejemplo resuelto distinto | 2×2×1/2 = 2 m³. | 2×2×1/2 = 2 m³. |
| H3 — respuesta explicada | 3×2×1/2 = 3 m³; la base de 6 m² tiene altura de medio metro. | 3×2×1/2 = 3 m³. A base of 6 m² times a height of 1/2 m gives 3 m³. |

**Reto 3.** ES: Un cubo tiene aristas de 2 cm. ¿Cuál es su área superficial? EN: A cube has edges of 2 cm. What is its surface area?

**Respuesta:** 24.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Suma el área de sus seis caras. | Add the areas of all six faces. |
| H2 — ejemplo resuelto distinto | Un cubo de arista 1 cm tiene 6 caras de 1 cm²: 6 cm². | A cube with 1 cm edges has six faces of 1 cm², for 6 cm². |
| H3 — respuesta explicada | Cada cara mide 2×2 = 4 cm²; 6×4 = 24 cm². | Each face has an area of 4 cm². Six faces total 24 cm². |

**Plantilla de generación:** Bases/alturas racionales positivas sencillas≤12; altura perpendicular mostrada. Prismas rectangulares; redes de prismas/pirámides para superficie; coordenadas con lados alineados a ejes. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** surface area/área superficial; net/red o desarrollo plano; height/altura perpendicular; base/base.

**Brief de ilustración:** Diseño de cajas y mosaicos sin texto incrustado; geometría exacta por código. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.

#### g6u7 — Preguntas estadísticas y distribuciones

**Estándares candidatos:** 6.SP.1, 6.SP.2, 6.SP.3, 6.SP.4, 6.SP.5. **Confianza:** alta a nivel de unidad; no aprobación docente. **Foco:** Ad. Fuentes de alcance: [S01]; foco: [S04f].

**Objetivo para la familia:** ES: Reconocer variabilidad y describir distribuciones con centro, dispersión y forma. EN: Recognize variability and describe distributions using center, spread, and shape.

**Objetivo para el niño:** ES: «Los datos varían y cuentan una historia.» EN: “I can describe how data vary.”

| ID de habilidad | Habilidad atómica | Prerrequisito directo |
| --- | --- | --- |
| g6u7.s1 | Distinguir pregunta estadística que anticipa variación | g3u6.s3 |
| g6u7.s2 | Representar datos en puntos, histogramas y cajas | g6u7.s1, g5u5.s5 |
| g6u7.s3 | Calcular e interpretar media y mediana | g6u7.s2, g6u1.s4 |
| g6u7.s4 | Calcular rango intercuartílico y desviación media absoluta | g6u7.s3 |
| g6u7.s5 | Describir tamaño de muestra, unidad, forma, centro, dispersión y valores inusuales | g6u7.s4 |
| g6u7.s6 | Elegir medidas según distribución y contexto | g6u7.s5 |

**Concepción errónea y distractor para detectarla:** En 2,3,3,4,18 elegir «media 6 representa el valor típico sin más» detecta no considerar valor extremo; media correcta puede ser poco descriptiva. Una elección sugiere una hipótesis de error; corroborar con un segundo ítem, no etiquetar al niño.

**CRA:** Fichas por dato → distribuciones y reparto de equilibrio → medidas numéricas.

**Explorar:** DotPlotBuilder y MeanBalance; histograma con intervalos explícitos y BoxPlot. **Practicar:** Teclado, seleccionar descripción y ordenar datos; no probabilidad formal por el nombre del dominio.

**Tres retos bilingües originales:**

**Reto 1.** ES: ¿Cuál pregunta es estadística: «¿Cuántas páginas leyeron los niños del club?» o «¿Cuánto es 4 + 5?»? EN: Which is a statistical question: “How many pages did the children in the club read?” or “What is 4 + 5?”?

**Respuesta:** primera / first.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Una pregunta estadística espera respuestas que varíen entre los casos. | A statistical question expects answers that vary across cases. |
| H2 — ejemplo resuelto distinto | «¿Cuántos libros leyó cada familia?» anticipa cantidades diferentes. | “How many books did each family read?” expects different answers. |
| H3 — respuesta explicada | La primera: distintos niños pueden leer cantidades diferentes de páginas. | The first question is statistical because different children may read different numbers of pages. |

**Reto 2.** ES: Encuentra la mediana de 2, 3, 3, 4 y 18. EN: Find the median of 2, 3, 3, 4, and 18.

**Respuesta:** 3.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Los datos ya están ordenados. Busca el del centro. | The values are already ordered. Find the middle value. |
| H2 — ejemplo resuelto distinto | En 1, 2, 6, 7, 9, la mediana es 6. | For 1, 2, 6, 7, 9, the median is 6. |
| H3 — respuesta explicada | El tercer dato es 3; quedan dos a cada lado. La mediana es 3. | The third value is 3, with two values on either side. The median is 3. |

**Reto 3.** ES: Los tiempos son 2, 4 y 6 minutos. ¿Cuál es la desviación media absoluta respecto de la media? EN: The times are 2, 4, and 6 minutes. What is the mean absolute deviation from the mean?

**Respuesta:** 4/3 min.

| Escalón | Español | English |
| --- | --- | --- |
| H1 — pista | Primero halla la media y luego las distancias a ella. | First find the mean, then each distance from the mean. |
| H2 — ejemplo resuelto distinto | En 1, 3, 5, la media es 3; distancias 2,0,2; su promedio es 4/3. | For 1, 3, 5, the mean is 3. The distances are 2, 0, 2, averaging 4/3. |
| H3 — respuesta explicada | La media es 4; distancias 2,0,2; (2+0+2)÷3 = 4/3 minutos. | The mean is 4. The distances are 2, 0, 2, so the mean absolute deviation is 4/3 minutes. |

**Plantilla de generación:** Listas ficticias de 5…12 datos no negativos; media exacta o decimal finito. Política explícita de cuartiles (excluir mediana global al partir n impar) revisable por docente; intervalos de histograma sin solapamiento. Añadir semilla, versión, validación de respuesta y distractores por error; consultar reglas globales de la sección 5.

**Vocabulario ES/EN y notas:** mean/media; median/mediana; variability/variabilidad; interquartile range/rango intercuartílico; mean absolute deviation/desviación media absoluta.

**Brief de ilustración:** Registro ficticio de tiempos de lectura; ninguna solicitud de datos del niño. Sin texto ni números incrustados; las etiquetas, cantidades, escala y geometría evaluada son objetos de la app.


## 4. Guía bilingüe completa

### Vocabulario acumulativo por grado

Este es el glosario base de autoría para todas las unidades; se acumula entre grados. La app presenta 3–5 términos por lección con audio, ejemplo visual y uso en una relación, no una lista para memorizar. La dificultad lingüística se prueba por idioma. Los términos oficiales de los dominios y los códigos permanecen en inglés para padres. Orientación general de acceso lingüístico: [S10, S11].

| Grado | ES ↔ EN | Aclaración editorial |
| --- | --- | --- |
| 1.º | contar ↔ count; cantidad ↔ amount/number; unidad ↔ one/unit; decena ↔ ten; cifra ↔ digit; número ↔ number | «Unit» puede ser unidad de medida; «ones» son unidades posicionales. |
| 1.º | sumar ↔ add; suma/total ↔ sum/total; restar ↔ subtract; diferencia ↔ difference; igual a ↔ equal to; más que/menos que ↔ more than/fewer than | «Más que» no determina por sí solo la operación. «Difference» es una cantidad, no solo «algo distinto». |
| 1.º | lado ↔ side; vértice/esquina ↔ vertex/corner; mitad ↔ half; cuarto ↔ fourth/quarter; entero ↔ whole; longitud ↔ length; hora y media ↔ half past | Presentar palabra cotidiana y término preciso juntos cuando ayude. |
| 2.º | centena ↔ hundred; forma desarrollada ↔ expanded form; comparar ↔ compare; reagrupar/canjear ↔ regroup; estimar ↔ estimate; contar de cinco en cinco ↔ count by fives | «Estimate» no significa adivinar sin fundamento. |
| 2.º | par/impar ↔ even/odd; arreglo rectangular ↔ array; fila ↔ row; columna ↔ column; tercio ↔ third; partes iguales ↔ equal shares | «Third» puede significar tercero o tercio según contexto. |
| 2.º | pulgada ↔ inch; pie ↔ foot; centímetro ↔ centimeter; metro ↔ meter; centavo ↔ cent; diagrama de puntos ↔ line plot; gráfica de barras ↔ bar graph | «Line plot» elemental no es una gráfica de líneas que conecta puntos. |
| 3.º | multiplicar ↔ multiply; factor ↔ factor; producto ↔ product; dividir ↔ divide; dividendo ↔ dividend; divisor ↔ divisor; cociente ↔ quotient | «Product» no se limita a mercancía; «table» puede ser mesa o tabla matemática. |
| 3.º | numerador ↔ numerator; denominador ↔ denominator; fracción unitaria ↔ unit fraction; equivalente ↔ equivalent; recta numérica ↔ number line | El entero de referencia no cambia al pasar de idioma. |
| 3.º | área ↔ area; perímetro ↔ perimeter; unidad cuadrada ↔ square unit; masa ↔ mass; capacidad/volumen líquido ↔ capacity/liquid volume; escala/clave ↔ scale/key; tiempo transcurrido ↔ elapsed time | «Scale» puede ser escala o balanza; «capacity» no es siempre «habilidad». |
| 4.º | múltiplo ↔ multiple; primo ↔ prime; compuesto ↔ composite; residuo ↔ remainder; veces la cantidad ↔ times as many; número mixto ↔ mixed number | Uno no es primo ni compuesto. El residuo necesita interpretación contextual. |
| 4.º | décimo ↔ tenth; centésimo ↔ hundredth; punto decimal ↔ decimal point; redondear ↔ round; convertir ↔ convert | «Round» también significa redondo; no traducir sin contexto. |
| 4.º | rombo ↔ rhombus; trapecio ↔ trapezoid (EE. UU.); paralelas ↔ parallel lines; perpendiculares ↔ perpendicular lines; rayo/semirrecta ↔ ray; transportador ↔ protractor; grado ↔ degree; simetría ↔ symmetry | «Diamond» es un nombre visual informal; «degree» aquí no es grado escolar. |
| 5.º | milésimo ↔ thousandth; potencia de diez ↔ power of ten; denominador común ↔ common denominator; escalamiento ↔ scaling; fracción impropia ↔ improper fraction | «Improper» no significa que la fracción esté mal; puede ser ≥1. |
| 5.º | volumen ↔ volume; unidad cúbica ↔ cubic unit; capa ↔ layer; prisma ↔ prism; par ordenado ↔ ordered pair; eje ↔ axis; origen ↔ origin; paréntesis ↔ parentheses; corchetes ↔ brackets; llaves ↔ braces | El plural de axis es axes. Los números mixtos no son una multiplicación implícita. |
| 6.º | razón ↔ ratio; tasa ↔ rate; tasa unitaria ↔ unit rate; porcentaje ↔ percent; por cada ↔ per; recíproco ↔ reciprocal; MCD ↔ GCF; mcm ↔ LCM | No trasladar siglas entre idiomas sin desplegar el nombre. «Ratio» puede usarse en otros contextos adultos; ante el niño usar razón. |
| 6.º | opuesto ↔ opposite; valor absoluto ↔ absolute value; racional ↔ rational number; expresión ↔ expression; ecuación ↔ equation; desigualdad ↔ inequality; término ↔ term; coeficiente ↔ coefficient; exponente ↔ exponent | «Rational» no significa «sensato» en esta tarea. Expresión no lleva necesariamente signo igual. |
| 6.º | área superficial ↔ surface area; red/desarrollo plano ↔ net; media ↔ mean; mediana ↔ median; variabilidad ↔ variability; histograma ↔ histogram; rango intercuartílico ↔ interquartile range; desviación media absoluta ↔ mean absolute deviation | «Mean» puede significar media o tener otro uso cotidiano. «Range» como dispersión no es «rango de nivel». |

### Notación recomendada para español de EE. UU.

**Propuesta de producto:** usar `es-US` con **punto decimal y coma de miles**, coherente con la hoja de la escuela: `1,234.56`. No presentarlo como única ortografía española correcta. El punto y la coma son separadores decimales admitidos; sus usos varían por región. [S17] Para primeras lecciones mostrar números pequeños sin agrupar; al enseñar miles, explicar explícitamente la coma de agrupación. En materiales internacionales existe la agrupación con espacios: ofrecer una nota para padres, no mezclar convenciones dentro de un ejercicio.

Mantener el separador mientras cambia el idioma evita transformar una tarea matemática en una prueba de configuración regional. El parser recibe una estructura numérica canónica, no una cadena traducida. El teclado principal presenta el punto; si un teclado externo introduce coma decimal, puede aceptarla solo cuando el patrón sea inequívoco y confirmar visualmente su interpretación. `1,234` es ambiguo: no convertirlo silenciosamente; pedir elegir «mil doscientos treinta y cuatro» o «uno con doscientos treinta y cuatro milésimos». No contar la corrección de formato como fallo matemático.

| Convención | Decisión para Kitewise |
| --- | --- |
| Enteros grandes | EN `one million` = ES `un millón`; EN `one billion` = ES `mil millones` (10⁹); ES `un billón` = 10¹². Este contraste es nota para familias, fuera del núcleo aritmético de primaria. [S18] |
| División | Mostrar `24 ÷ 6 = 4`, fracción y algoritmo escrito como representaciones relacionadas. En el algoritmo de EE. UU., divisor fuera a la izquierda y dividendo bajo el trazo. Los nombres «casita» y «galera» no bastan para identificar orientación. Otras disposiciones se explican con la misma relación dividendo = divisor×cociente + residuo. No invalidar otro formato correcto. |
| Multiplicación | Usar × en primaria; en 6.º introducir `3x` y `3·x` con distinción visual de variable x y signo ×. No usar asterisco como única presentación infantil. |
| Fracciones y mixtos | Usar fracción apilada accesible y versión textual equivalente. Mixto: `1 1/2`, con agrupación semántica; jamás interpretarlo como `1×1/2`. |
| Comparación | Leer «es mayor/menor que», no «la boca se come al grande» como explicación conceptual. |
| Moneda | `$1.25` = «un dólar con veinticinco centavos»; mantener `USD` en metadatos para evitar confundir otros dólares. No escribir `$25¢`. |
| Unidades | Símbolos estándar sin plural: `3 cm`, `5 kg`, `2 L`, `12 cm²`. Un espacio separa número y unidad; el símbolo ° se escribe junto al número angular. Leer siempre la unidad completa en audio. |

**Trapecio/trapezoid:** no atribuir una definición única a todo un país. El Diccionario del español de México describe exactamente un par de lados paralelos; también existen convenciones escolares inclusivas de al menos un par. [S19] Guardar `trapezoidDefinition: 'exactlyOnePair' | 'atLeastOnePair'`, mostrar la definición en la tarea y mantenerla igual en ES/EN. Una tarea que solo pide reconocer el nombre sin declarar convención tiene confianza baja de interpretación. El docente decide la convención que concuerda con su programa. Usar definiciones inclusivas coherentes para cuadrado, rectángulo y rombo; rotar figuras y ofrecer ejemplos no prototípicos.

### Dinero y sistemas de unidades

| EN | Español natural en la app | Valor o uso |
| --- | --- | --- |
| penny | moneda de un centavo | 1¢ |
| nickel | moneda de cinco centavos | 5¢ |
| dime | moneda de diez centavos | 10¢ |
| quarter | moneda de veinticinco centavos | 25¢; «un cuarto» solo tras explicar que es un cuarto de dólar. |
| dollar | dólar | 100 centavos |
| inch, foot, yard, mile | pulgada, pie, yarda, milla | Sistema usual de EE. UU.; rutas y objetos escolares. |
| ounce, pound | onza, libra | Distinguir onza de masa de onza líquida. |
| cup, pint, quart, gallon | taza, pinta, cuarto de galón, galón estadounidense | «Quart» no es «quarter». Etiquetar sistema US; no asumir galón imperial. |
| mm, cm, m, km; g, kg; mL, L | milímetro, centímetro, metro, kilómetro; gramo, kilogramo; mililitro, litro | Ciencia, medición escolar y comparación entre unidades del mismo sistema. |

Propuesta por grado: 1.º unidades no estándar; 2.º cm/m/in/ft y dinero; 3.º g/kg/L, minutos, regla fraccionaria; 4.º–5.º conversiones dentro del mismo sistema según unidad; 6.º razones para convertir, aportando equivalencias entre sistemas cuando correspondan. No exigir que se memoricen conversiones internacionales aproximadas. NIST es referencia para constantes; un galón US equivale aproximadamente a 3.785 L y difiere del imperial. [S01, S20]

### Guion de audio

Las siguientes son convenciones propuestas; no todas son exigencias por grado. La narración matemática se revisa manualmente y se guarda como texto localizado, sin depender de cómo un motor TTS interprete símbolos.

| Expresión | ES | EN |
| --- | --- | --- |
| 105 | ciento cinco | one hundred five; aceptar comprensión de one hundred and five. |
| 1,234 | mil doscientos treinta y cuatro | one thousand two hundred thirty-four |
| 21 objetos | veintiún objetos; veintiuna fichas | twenty-one objects/counters |
| 1/2; 1/3; 1/4 | un medio o una mitad; un tercio; un cuarto | one half; one third; one fourth o a quarter |
| 3/4; 5/8 | tres cuartos; cinco octavos | three fourths/three quarters; five eighths |
| 7/12; 3/100 | siete doceavos; tres centésimos | seven twelfths; three hundredths |
| 1 1/2 | uno y un medio; en medida, un metro y medio | one and one half; en contexto, one and a half meters |
| 0.05 | cero punto cero cinco; conceptual: cinco centésimos | zero point zero five; conceptual: five hundredths |
| 2.30 | dos punto tres cero si importa la escritura; dos con treinta centésimos si importa el valor posicional | two point three zero; two and thirty hundredths |
| −4; −2.5 | menos cuatro; menos dos punto cinco | negative four; negative two point five |
| 8 − 3 | ocho menos tres | eight minus three; distinguir operación de número negativo. |
| 3²; 2³; 2⁴ | tres al cuadrado; dos al cubo; dos a la cuarta potencia | three squared; two cubed; two to the fourth power |
| 4 cm²; 6 m³ | cuatro centímetros cuadrados; seis metros cúbicos | four square centimeters; six cubic meters |
| 30°; 25% | treinta grados; veinticinco por ciento | thirty degrees; twenty-five percent |
| 2:3 | dos a tres; dos por cada tres en contexto | two to three; two for every three in context |
| (−2,3) | par ordenado: menos dos, tres | ordered pair: negative two, three |
| x > 3; 2x + 5 | equis es mayor que tres; dos por equis más cinco | x is greater than three; two times x plus five |

Ordinales: primero/first, segundo/second, tercero/third, cuarto/fourth; concordancia «primera fila». Una fracción `1/3` es «un tercio», no «un tercero». En ES alternar lectura técnica y natural sin cambiar el número. Audio no lee los códigos curriculares al niño. En un ejercicio de reloj sin a.m./p.m. no inventar mañana o tarde.

### Acompañar sin contradecir a la escuela

Las diferencias que siguen son **variantes que una familia puede encontrar**, no una descripción uniforme de México, Latinoamérica o California. No se realizó una comparación nacional de currículos. El programa y la explicación del docente concreto son la referencia.

| Posible confusión | Mensaje o apoyo propuesto para la familia |
| --- | --- |
| Restar «pidiendo prestado», canjeando o compensando | Mostrar dos métodos con el mismo valor y resultado. Preguntar «¿dónde quedó representada esa decena?». Validar el procedimiento que conserve cantidades. |
| División con otra disposición de la casita | Etiquetar dividendo, divisor, cociente y residuo; vincular cada paso con la misma identidad matemática. |
| Conocer un algoritmo antes que el usado en clase | Permitir cálculo con ese método y ofrecer un puente al modelo escolar; no decir que el adulto aprendió mal. |
| Creer que usar bloques o dibujar es retroceder | Explicar que ayuda a justificar el procedimiento y detectar errores; no atar apoyos a edad o inteligencia. |
| Memorizar tablas en orden como única práctica | Añadir hechos mezclados, factores desconocidos, reparto y explicaciones; conservar memoria útil. |
| Confundir dominio con rapidez | Mostrar retención y diversidad de tareas al padre, sin ranking de velocidad. |
| Esperar el mismo tema en el mismo grado de otro país | Mostrar la habilidad actual, su prerrequisito y el código candidato de California; no comparar niños por nacionalidad. |
| Interpretar punto/coma de otra manera | Explicar `es-US`, mostrar lectura de la cantidad y aceptar entrada inequívoca sin penalización. |
| «Un cuarto», «third», «table», «mean», «net» | Añadir imagen/ejemplo y sentido matemático; no presentar una traducción aislada. |
| Un nombre de figura con otra definición | Mostrar atributos y convención del ejercicio; no marcar mal una respuesta que corresponde a otra convención no aclarada. |

Texto breve propuesto para el panel: «Tu forma de resolver también puede servir. Pídele que muestre qué representa cada paso y comparen los resultados. Si la tarea de la escuela pide una estrategia específica, ayúdale a relacionarla con la que ya conoce».

### Problemas verbales y English Learners

Propuesta editorial, no límites de lectura validados: 1.º–2.º, 1–3 oraciones y aproximadamente 15–35 palabras; 3.º–4.º, 2–4 oraciones y 25–55 palabras; 5.º–6.º, 2–5 oraciones y 35–75 palabras. Son alertas para revisar, no reglas de rechazo. La cantidad de relaciones, la posición de la incógnita y la sintaxis importan más que el conteo de palabras. Un problema breve puede ser lingüísticamente complejo.

Mantener explícito quién tiene qué, el referente de cada cantidad y la pregunta. Evitar pronombres ambiguos, dobles negaciones e información decorativa al introducir un esquema. Enseñar «cuántos más», «cada», «por cada», «en total» dentro de relaciones; no usarlos como claves automáticas de operación. Incorporar gradualmente información que no se necesita, con un objetivo específico y separado.

La recomendación de acceso no es bajar la matemática al nivel de inglés. Ofrecer audio, destacar cantidad/unidad por selección, modelos, cambio de idioma y marcos breves: «Elegí ___ porque ___» / «I chose ___ because ___». Completar o elegir una justificación permite razonar por toque. El idioma del hogar y las representaciones son recursos; la comprensión del lenguaje incluye relaciones y explicaciones, no solo vocabulario. [S10, S11]

Contextos originales: biblioteca, transporte público, jardín comunitario, juegos, materiales de arte, preparación de una excursión y cuidado del agua. Alternar nombres, estructuras familiares, capacidades y protagonistas; no vincular un grupo cultural a una ocupación o comida. No suponer jardín privado, dinero disponible, viajes o auto propio. Estas son decisiones de inclusión propuestas, no resultados experimentales.

Si las versiones ES/EN cambian números o contexto por naturalidad, deben declarar `mathVariantId` y probarse por separado; no presumir dificultad equivalente. Para cambiar idioma dentro de un reto, conservar cantidades, unidad, solución y estado, y no contarlo como un nuevo intento independiente.

## 5. Principios pedagógicos para la app

### Quince principios con fuerza de evidencia y límites

| # | Principio y acción propuesta | Evidencia y alcance |
| --- | --- | --- |
| 1 | Enseñar un procedimiento claro, modelarlo y retirar ayuda gradualmente. | WWC 2021, instrucción sistemática: **fuerte** en intervención elemental; transferencia a casa/app requiere validación. [S05] |
| 2 | Enseñar lenguaje matemático breve y preciso en uso, con audio opcional. | WWC 2021, lenguaje: **fuerte**; no prueba por sí sola una arquitectura bilingüe concreta. [S05] |
| 3 | Elegir pocas representaciones y conectar cada acción con su símbolo. | WWC 2021, representaciones: **fuerte**; IES 2007, conectar concreto/abstracto: **moderada**. CRA no es una secuencia rígida universal. [S05, S08] |
| 4 | Usar recta numérica para enteros, magnitud, fracciones y racionales. | WWC 2021: **fuerte**; respetar escala y entero. [S05] |
| 5 | Enseñar estructuras de problemas con incógnitas variadas; no palabras clave. | WWC 2021, problemas: **fuerte**; el RCT de tutoría de 3.º respalda enseñanza integrada por esquemas, no simplemente decorar un enunciado con barras. [S05, S15] |
| 6 | Tratar fracciones como números, conectar procedimientos con significado. | WWC fracciones: recomendaciones 2 y 3 **moderadas**; reparto informal, razones antes de multiplicación cruzada y formación docente: **mínimas** en esa guía. Mínima no significa ineficaz. [S06] |
| 7 | Alternar ejemplo resuelto y tarea similar; explicar qué paso conserva la relación. | IES 2007: **moderada**; no copiar el ejemplo y llamar dominio al acierto. La guía de álgebra califica analizar ejemplos y estructura como **mínima**, elegir estrategias como **moderada**, con población mayor. [S08, S27] |
| 8 | Recuperar conocimiento sin pista inicial y dar feedback después. | IES 2007, volver a exponer contenido con quizzes: **fuerte**; sondeos previos: **mínima**. Sin calificación ni presión en Kitewise. [S08] |
| 9 | Distribuir práctica en días y volver después de semanas. | IES 2007, espaciar: **moderada**. El calendario exacto 1–3–7–14–30 es propuesta. [S08] |
| 10 | Intercalar contenidos ya introducidos y pedir distinguir estrategias. | Ensayo/estudio de primaria en resta e investigación de intercalado: evidencia **prometedora y dependiente del diseño**, no una garantía universal. No mezclar temas nuevos sin instrucción. [S13] |
| 11 | Pedir revisar plan y resultado, por toque. | WWC 4–8, monitoreo/reflexión y representaciones: **fuertes**; múltiples estrategias y articulación: **moderadas**; preparar problemas para clase completa: **mínima**. No trasladar mecánicamente al hogar. [S07] |
| 12 | Dar feedback específico sobre tarea y estrategia, sin juicio sobre identidad. | Revisión de Shute: **síntesis de investigación**, no escala WWC; efectos dependen de tarea y aprendiz. [S12] |
| 13 | Medir fluidez como precisión, eficiencia razonada y flexibilidad; evitar prueba obligatoria de velocidad. | NCTM: **posición profesional**, no ensayo. WWC 2021 actividades cronometradas: **fuerte** en intervención. Estudio experimental de 1.º indica beneficios posibles de práctica con rapidez. Elegir práctica sin presión es decisión de Kitewise, no negar esos resultados. [S05, S09, S16] |
| 14 | Usar manipulativos virtuales con guía, y pedir transferencia a símbolos. | Síntesis de estudios de caso único: **prometedora con límites de generalización**; no permite afirmar que tocar pantalla sea equivalente o superior a todo manipulativo físico. [S14] |
| 15 | Reducir carga ajena al contenido y conservar desafío matemático; probar cada apoyo con niños. | Convergencia de acceso del Framework y feedback, **orientación de diseño**. No hay evidencia aquí para atribuir eficacia al modo específico ni a una cantidad exacta de ítems, colores o minutos. [S02, S12; propuesta] |

**Ansiedad y tiempo.** La síntesis de Barroso y colegas encuentra asociación negativa entre ansiedad matemática y desempeño; no demuestra que cualquier cronómetro cause esa ansiedad. [S29] La guía WWC no equivale a recomendar exámenes de velocidad públicos y de alta consecuencia. Kitewise puede desarrollar recuperación de hechos con práctica breve, elegida, feedback y estrategias sin cuenta regresiva. «Ritmo» puede acompasar una interacción estética, pero nunca cerrar la respuesta o impedir avanzar a un niño lento. La velocidad de arrastre o lectura no es fluidez matemática.

**Feedback propuesto:** «Revisemos qué representa cada decena» / «Let’s check what each ten represents»; «Las partes deben ser del mismo tamaño» / «The parts need to be equal in size»; «Este modelo muestra otra cantidad; compáralo con el enunciado» / «This model shows a different amount. Compare it with the story». Evitar elogios de inteligencia, burla, pérdida de progreso, explosiones sonoras y respuestas vacías como «Intenta otra vez» sin orientación. Nunca usar «incorrecto» ni rojo, pero comunicar con claridad que una respuesta aún no coincide; aceptar todo como válido también perjudicaría el aprendizaje. La elección exacta de color no se presenta como hallazgo científico. [S12; propuesta]

### Esquemas de problemas y reglas de generación

La secuencia propuesta es leer/escuchar → identificar cantidades y relación → construir/seleccionar modelo → escribir operación → resolver → comprobar en contexto. Las letras siguientes son metadatos de autoría, no una fórmula que todos los niños deban memorizar. [S05, S15]

| Esquema | Relación | Restricciones y variación |
| --- | --- | --- |
| Partes–total | A+B=T | Generar A y B y derivar T; alternar incógnita, evitar que toda pregunta pida total. En 1.º T≤20; 2.º problemas≤100. |
| Cambio agregar | inicio+cambio=final | Generar dos cantidades coherentes y derivar tercera. «Llegaron» puede acompañar incógnita inicial: no fijar operación por verbo. |
| Cambio quitar | inicio−cambio=final | 0≤cambio≤inicio para niveles iniciales. No retirar más objetos de los disponibles. |
| Comparación aditiva | mayor=menor+diferencia | Definir referente e incógnita explícitos; alternar mayor, menor o diferencia. No usar comparaciones de valor personal o riqueza. |
| Grupos iguales, producto | grupos×porGrupo=total | Objetos contables con grupos enteros, cantidades homogéneas. Desde 3.º. Variar arreglo, grupos separados y contexto sin dibujo. |
| Reparto | total÷grupos=porGrupo | Primeras tareas exactas; no dividir entre cero. Si el objeto no se puede partir, residuo o cantidad de grupos son parte del objetivo. |
| Agrupamiento | total÷porGrupo=grupos | No traducirlo como reparto entre personas si cambia lo desconocido. Comparar ambos significados de división. |
| Comparación multiplicativa | cantidad=k×referente | Desde 4.º; variar cantidad o factor desconocido. En español usar «tres veces la cantidad», evitando ambigüedad de «tres veces más». |
| Razón y tasa | a:b, valores equivalentes por mismo factor | Mantener unidad, orden de la razón y totalidad. Una razón parte-parte no es automáticamente una fracción del total. Desde 6.º. |
| Porcentaje | parte=(p/100)×total | Etiquetar la incógnita; generar primero solución exacta y derivar cantidades. Nunca porcentajes incompatibles con conteos enteros en una historia de personas. |
| Dos o más pasos | Composición explícita de esquemas | Rango válido en cada resultado intermedio, no solo en el final. Unidades compatibles; cada oración necesaria al introducir la estructura. |

**Motor de generación propuesto:** elegir habilidad y estructura, generar una solución válida, derivar el resto, validar unidades y magnitudes, construir distractores por error, barajar y eliminar duplicados. Guardar semilla y `templateVersion`; probar casos frontera y cualquier cambio de plantilla. No crear texto con modelo generativo en tiempo de uso. Las plantillas locales deben controlar singular/plural y concordancia separadamente en ES/EN.

**Reglas globales de calidad:** usar fracciones racionales exactas y decimales como enteros escalados; no comparar floats con igualdad cruda. No forzar simplificación si no es la habilidad. Si un distractor es equivalente a la solución, no es distractor. Para selecciones múltiples evaluar conjuntos sin importar orden; para secuencia, orden exacto. Para rectas usar marcas discretas en práctica de respuesta exacta, o tolerancia matemática declarada en estimación; nunca una tolerancia de píxeles como sustituto de concepto. No permitir que denominador, precio, longitud, área o cantidad de personas sean imposibles. En un reparto de tijeras no introducir medios objetos; en cinta sí puede haber fracciones. Todos los números que deciden la respuesta los genera la UI, no el arte.

### Interacciones táctiles

| Habilidad | Explorar | Practicar | Evitar |
| --- | --- | --- | --- |
| Conteo y valor posicional | Fichas, DragZone con canje | Seleccionar numeral, teclado, completar modelo | Cientos de arrastres y canjes automáticos que oculten el valor. |
| Suma/resta | Marcos de diez, NumberLine, barras | Teclado y elegir estrategia | Recitar una ruta fija que permita acertar sin calcular. |
| Grupos, producto y división | PaintGrid, grupos y reparto | Producto, factor/cociente desconocido, modelo | Confundir destreza motora con precisión matemática. |
| Fracciones | FractionBars, particiones exactas, NumberLine | Construir/ubicar/comparar con entero visible | Tartas de tamaños distintos sin explicar referencia; contar marcas. |
| Decimales | PaintGrid 10×10, tabla posicional | Teclado y orden | Alinear por borde visual o depender de representación binaria inexacta. |
| Medidas y tiempo | Regla virtual y ClockHands | Leer unidad/escala e intervalo | Presentar el tamaño físico en pantalla como centímetros reales. |
| Geometría y ángulos | Geoboard, AngleTool, simetría | Ejemplos/no ejemplos, medición | Dibujo a mano libre como única respuesta exacta. |
| Volumen/superficie | CubeLayers, NetBuilder | Elegir caras/capas y responder con unidad | Perspectiva que esconda cubos sin permitir girar/ver capas. |
| Razones | RatioTable, DoubleNumberLine | Tasa unitaria/porcentaje y unidad | Multiplicación cruzada como botón opaco. |
| Expresiones/ecuaciones | ExpressionBuilder, BalanceEquality | Valor, expresión equivalente, solución | Arrastre tan guiado que revele la respuesta de una tarea de dominio. |
| Datos | DotPlotBuilder, MeanBalance, histogramas/cajas | Interpretación y elección de medida | Confundir histograma con barras de categorías o pedir datos personales. |

Estas herramientas nuevas se justifican por representar relaciones no cubiertas bien por pintar/arrastrar: engranaje de manecillas, unidad invariable de fracción, tabla de razones, equivalencia de balanza y caras/capas 3D. Son propuestas de implementación, no componentes existentes comprobados. Toda interacción de arrastre debe admitir toque para seleccionar y toque para colocar, además de controles accesibles.

### Panorama de apps y programas

Las funciones están contrastadas con documentación de sus responsables a la fecha de consulta; no se compararon causalmente sus resultados ni se probaron sesiones completas de cada producto. Las opiniones de usuarios son indicios cualitativos y no una encuesta representativa.

| Producto | Enfoque útil para estudiar | Límite o crítica y decisión de Kitewise |
| --- | --- | --- |
| Khan Academy Kids | Juego y actividades guiadas; público principal 2–8 años/PreK–2; app familiar gratuita sin anuncios ni suscripción. [S21] | No usarlo como mapa de cobertura de 3.º–6.º. Que tenga juego no prueba eficacia matemática en todos los grados. Tomar claridad y calidez como referencia, crear contenido propio. |
| Zearn | Lecciones digitales conectadas y materiales escritos. Documentación de 2026–27 anuncia K–5 digital en español en School Accounts; no asumir que toda cuenta gratuita doméstica tiene exactamente esa cobertura. [S22] | Secuencia escolar y acceso de cuenta pueden no encajar con sesiones familiares cortas; es evaluación de encaje de Kitewise. La página conserva FAQs de fases anteriores: confirmar habilitación actual antes de depender de ella. |
| DreamBox | Ajusta dificultad y apoyos considerando interacciones/estrategias; integra modelos. [S23] | Su guía desaconseja papel durante lecciones para conservar su enfoque. Kitewise permitirá apoyo físico/papel, registrando ayuda del adulto sin castigar. No se pudo auditar su algoritmo propietario. |
| Prodigy | Juego de aventuras con práctica y membresías con mejoras/recompensas; descripción del proveedor. [S30] | Fairplay/CCFC y otras organizaciones presentaron una queja en 2021 por marketing de membresías y afirmaciones de eficacia. Es una denuncia histórica, no una sentencia ni prueba de la interfaz actual. Kitewise excluye ventas al niño y recompensas de azar. [S31] |
| IXL | Catálogo por habilidad, explicaciones y SmartScore; el propio proveedor aclara que no es un porcentaje. [S32] | Relatos públicos de docentes/familias describen frustración al perseguir una meta de puntuación; no validan un efecto general de salud ni eficacia. Kitewise limita sesión, no quita logros visibles por un error ni presenta puntaje al niño. [S33] |
| Beast Academy | Libros tipo cómic y problemas de razonamiento, niveles 1–5; recursos originales del proveedor. [S34] | En un hilo de familias se describe necesidad de lectura acompañada para niños que aún no leen solos; no implica que el programa carezca de narración. Kitewise ofrece audio y separa demanda de lectura del reto matemático. [S35] |
| Math Learning Center | Manipulativos de fracciones, recta, bloques, dinero, reloj y geometría; útiles para estudiar affordances. [S26] | Son herramientas que necesitan una tarea y guía; esto es inferencia de diseño. Sus apps gratuitas no tienen permiso general de copiar código, traducción o interfaz; crear implementaciones originales. |
| Eureka/EngageNY | Secuencias y conexión de modelos con procedimientos para estudiar progresiones. [S25] | Los archivos EngageNY archivados tienen restricción no comercial; no extender esa licencia a toda edición de Eureka ni copiar tareas a una app comercial sin permiso. |
| Illustrative Mathematics | Problemas y conexiones entre representaciones como referencia curricular. [S24] | Distinguir primera edición de v.360 y materiales de terceros; una app no debe presentarse como IM Certified sin autorización. |

**Licencias verificadas y ruta de reutilización:**

| Recurso concreto | Licencia/condición encontrada | Acción propuesta |
| --- | --- | --- |
| IM K–12 Math, primera edición ©2019–2021 | CC BY 4.0: permite usos comerciales y no comerciales con condiciones de atribución; marcas aparte. [S24] | Si se adapta una tarea, guardar URL, edición, autor, licencia, cambios e imágenes de terceros. No confundirla con v.360. |
| IM TK–12 Math v.360 | CC BY-NC 4.0; uso comercial requiere licencia adicional según el titular. [S24] | Referencia de enfoque; no incorporar ejercicios/arte en producto comercial sin resolver el permiso. |
| EngageNY archivado | NYSED lo identifica como CC BY-NC-SA; revisar versión exacta impresa en cada archivo. [S25] | Referencia y usos compatibles; no suponer que «educativo» equivale a «no comercial». |
| Apps de Math Learning Center | Términos de uso limitados; no permiso general de copiar, modificar o traducir apps. [S26] | Consultarlas; no extraer código, arte o tareas para clonarlas. |
| Khan Kids, Zearn, DreamBox, Prodigy, IXL, Beast Academy | No se verificó una licencia abierta general para sus apps o bancos. | Crear ejercicios originales. Gratuito, accesible públicamente y abierto son condiciones distintas. |

No se incorporaron ejercicios de esos productos en las 111 muestras. Este inventario de permisos orienta la selección de fuentes y no sustituye revisar el recurso exacto antes de reutilizarlo.

## 6. Modelo de dominio y repaso propuesto

### Qué se puede inferir de una respuesta

Guardar localmente: habilidad, ID/versión de ítem y plantilla, variante matemática, idioma mostrado, fecha local de práctica, primer resultado, apoyo matemático máximo, corrección posterior y confianza elegida. No guardar nombre, voz, ubicación ni fecha de nacimiento. El audio del enunciado, un lector de pantalla y controles accesibles **no** cuentan como ayuda matemática; una pista que revela la estructura de solución sí. Si el adulto ayuda matemáticamente, ofrecer indicador opcional «Lo hicimos con ayuda», sin exigir al niño delatarlo ni convertirlo en fallo.

Cambiar idioma no reinicia el reto ni genera evidencia independiente. Un acierto tras H2/H3 demuestra práctica acompañada, no recuperación independiente. La velocidad solo podría usarse para detectar problemas de interfaz en análisis local; no define dominio ni cambia el nivel del niño.

### Estados

| Estado visible | Criterio inicial propuesto | Siguiente paso |
| --- | --- | --- |
| Explorando | Habilidad nueva; completó ejemplo/modelo, todavía sin evidencia estable | Una interacción guiada y 2–3 tareas de baja carga. |
| Practicando | Al menos dos primeras respuestas acertadas en ítems distintos; todavía falta diversidad o retención | Proponer práctica breve y espaciada, conservando apoyos. |
| Dominado | Últimas 10 oportunidades independientes: ≥8 aciertos, en ≥3 días locales; incluir al menos 2 tareas de modelo/concepto, 4 de procedimiento y 2 de transferencia; las otras 2 equilibran cobertura. Dos aciertos demorados en ítems nuevos, uno a ≥3 y otro a ≥7 días del primer éxito, pueden estar dentro de esas 10. | Mantenimiento; no cerrar acceso ni decir que ya nunca necesitará practicar. |

Para contenidos que no admiten cálculo simbólico (p. ej. clasificación de figuras), «procedimiento» significa aplicar el criterio y «transferencia» reconocer un caso no prototípico. No imponer una clasificación artificial de tareas. Las diez oportunidades no se presentan en un examen de una vez.

**Condiciones adicionales:** al menos 2 de las evidencias deben ser respuesta construida (teclado/modelo) y no solo opción múltiple; si no procede, usar selección múltiple con contraejemplos y justificación. Ningún logro por repetir el mismo enunciado, traducirlo, barajar opciones o responder tras ver solución. No hay requisito de rapidez ni de quitar herramientas que son parte del constructo: usar recta para ubicar una fracción es la tarea, no una ayuda prohibida. Exigir cálculo sin fichas solo si se evalúa específicamente recuperación de hechos y ha habido instrucción suficiente.

**Confianza:** «Seguro/Más o menos/Adivino» se pide antes de comprobar, como prevé el producto. No usarla como prueba de capacidad ni restar puntos por honestidad. Un acierto adivinado necesita otro ítem para corroborar; un fallo con alta confianza prioriza revisar concepto. La evidencia disponible no valida estos tres botones ni el umbral; su utilidad se prueba en piloto. Puede reducirse su presentación con aprobación de diseño si interrumpe cada respuesta, manteniendo el requisito del flujo inicial.

### Agenda de repaso

1. Primer fallo, H1–H3 o «Lo veo luego»: crear una entrada por habilidad, no duplicar todas las preguntas falladas. Preparar una tarea diferente para el día siguiente.
2. Calendarizar retornos **+1, +3 y +7 días desde el episodio inicial**, como regla de producto; en cada retorno usar evidencia de primera respuesta. En +1 incluir reenseñanza breve si hubo mucha ayuda.
3. Si se acierta de forma independiente, conservar próximos retornos pendientes; tras +7 añadir +14 y +30. Si falla en un retorno, ofrecer ayuda y abrir un ciclo nuevo al día siguiente para esa habilidad, sustituyendo entradas redundantes.
4. Si no abre la app, las tareas vencidas quedan disponibles. No notificación culpabilizante, reinicio de racha ni acumulación de una «deuda» infinita. Un retorno realizado tarde no prueba retención en el intervalo que se perdió; registrar fecha real.
5. Calentamiento: máximo propuesto 2 ítems/1 min en sesión de 8 min; 3/1–2 min en 15; 4/2 min en 20. Si aparece dificultad, el niño puede volver a aprender esa habilidad y posponer lo nuevo.
6. Un fallo no elimina «dominado». Dos fallos independientes en días distintos activan «vamos a repasarlo» y reenseñanza; el historial se conserva. Panel del padre: «Necesita repaso reciente» sin borrar progreso.

**Prioridad de cola:** concepto repetidamente confundido → prerrequisito del objetivo actual → fallo reciente → mantenimiento vencido. La cola se deduplica por habilidad y usa un máximo de pendientes por sesión. Esta política y el calendario exacto son hipótesis de implementación; [S08] apoya espaciar y recuperar, no esos números concretos.

**Panel del padre:** referencia curricular en borrador, ejemplos de lo que pudo hacer, independencia/apoyos y fecha del último repaso. Puede mostrar detalle numérico, explicando límites; no «nivel de inteligencia», diagnóstico ni equivalencia automática «terminó grado 3». Recomendar dónde empezar mediante 6–10 tareas repartidas en varias sesiones, no examen de entrada largo; permitir al padre cambiar de nivel en cualquier momento.

## 7. Adaptaciones de Modo Enfoque para Matemáticas

Todas las cantidades y duraciones siguientes son propuestas para pilotar, no prescripciones clínicas. El modo se ofrece a cualquier niño y no utiliza etiquetas diagnósticas.

| Elemento | Adaptación concreta |
| --- | --- |
| Pantalla | Un reto, una pregunta y un área de respuesta. Ocultar adornos en movimiento y elementos de otras materias. |
| Texto | Enunciado en 1–3 bloques cortos; botón de audio con pausar/repetir. Mostrar cantidad y unidad juntas; no ocultar información necesaria tras memoria de trabajo. |
| Modelos | Una representación principal; botón para ver otra. No abrir bloques, recta, tabla y animación a la vez. |
| Acciones | Toque–toque como alternativa a arrastrar; deshacer; botones grandes y separados; no gestos rápidos o simultáneos. |
| Ayuda | Pista visible y disponible, sin penalización; el ejemplo resuelto abre una tarjeta que puede consultarse sin perder el reto. |
| Ritmo | Bloques iniciales de 2–4 ítems, pausa opcional de 20–40 s entre bloques largos; regresar al mismo punto. Ajustar según observación. |
| Movimiento | Invitación opcional accesible: estirarse, cambiar de postura o descansar la vista; alternativa sentada, sin exigir movimiento para avanzar. |
| Tiempo visual | Barra de avance de la sesión, no cuenta regresiva del problema. Ocultable; nunca cierra un reto pendiente ni descuenta por audio o pausa. |
| Confianza | Tres botones estables, con texto y símbolo, sin colores de juicio. Se puede escuchar el enunciado antes de elegir. |
| Respuesta | Mensaje breve y accionable; sin rojo, zumbidos, vibración de castigo o pantalla de derrota. |
| Memoria | Mantener datos visibles durante todos los pasos; ofrecer mini-resumen del problema en tareas de dos pasos. |
| Juego | Sin vidas, premios aleatorios, pérdida de racha o obligación de responder al pulso. Final predecible y botón de terminar. |
| Accesibilidad | TalkBack/VoiceOver según plataforma, orden de foco, contraste, texto escalable, reducción de movimiento; no depender solo de color o audio. Probar fracciones y expresiones como estructuras, no solo imágenes. |

### Los cuatro momentos y el cierre dentro del tiempo total

La propuesta conserva Aprender → Explorar → Practicar → Juego → Cierre. El calentamiento de repaso precede a Aprender. Las proporciones originales suman 100% antes de contar cierre y repaso, por lo que no pueden aplicarse rígidamente al tiempo total. No se encontró evidencia específica que valide 25/25/35/15 ni 8/15/20 minutos para este producto. Ajustar transiciones y necesidades, sin cortar razonamiento por reloj.

| Sesión | Calentamiento | Aprender | Explorar | Practicar | Juego | Cierre |
| --- | --- | --- | --- | --- | --- | --- |
| 20 min | 2 | 4 | 4 | 6 | 3 | 1 |
| 15 min | 1 | 3 | 3 | 5 | 2 | 1 |
| 8 min | 1 | 1.5 | 1.5 | 2.5 | 1 | 0.5 |

Los tiempos suman el total. En ocho minutos escoger una microhabilidad, un ejemplo, una exploración pequeña, 1–3 retos según carga y un juego mínimo sobre la misma relación. No evaluar menos autonomía por elegir sesión corta. El cierre pregunta por toque «¿Qué te ayudó?» y muestra una idea clave, sin examen adicional. Si un problema necesita más tiempo, guardar estado y ofrecer continuar otro día.

## 8. Esqueleto de datos en JSON para una unidad completa de 3.º

La unidad `g3u1` desarrolla cuatro habilidades mediante cuatro lecciones, cada una con los cuatro momentos. Incluye reto inicial completamente especificado, plantilla ejecutable como contrato declarativo y feedback localizado. La app debe implementar/validar el contrato: este JSON es contenido de referencia, no un motor de aprendizaje ya construido. Los componentes nuevos se marcan como propuestos.

**Campos añadidos y por qué:** `schemaVersion/contentVersion` permiten migraciones; `skills` conserva prerrequisitos; `standardsReview` mantiene borrador y confianza; `practiceLevel` separa referencia escolar de nivel; `mathVariantId` evita duplicar evidencia al cambiar idioma; `answer` es canónica; `generator` fija rangos/restricciones; `representation` separa geometría de arte; `attemptPolicy` distingue apoyo de acceso; `warmupPolicy/closure` añaden los momentos que el tipo Step original no incluye; `provenance` distingue autoría original de fuentes. `audio` es texto de narración localizado, que se puede usar en TTS local revisado; no es un archivo grabado ni una llamada a red.

La serialización conserva los tipos pedidos (`subject: 'mate'`, `grade`, títulos ES/EN, standards, prerequisites, lessons, cover y Step.kind). Los campos extra no alteran el significado de esos cuatro tipos. Cada reto incluye exactamente tres escalones de ayuda. La explicación del último escalón corresponde al mismo problema; el ejemplo del segundo cambia los números. No hay datos personales ni credenciales.

```json
{
  "id": "g3u1",
  "subject": "mate",
  "grade": 3,
  "practiceLevel": 3,
  "schemaVersion": "1.0",
  "contentVersion": "1.0.0",
  "title": {
    "es": "Multiplicar con grupos y arreglos",
    "en": "Multiply with equal groups and arrays"
  },
  "standards": [
    "3.OA.1",
    "3.OA.3"
  ],
  "standardsReview": {
    "status": "draftPendingTeacherReview",
    "confidence": "highAtUnitLevel",
    "displayAudience": "parentsOnly",
    "isCertified": false
  },
  "prerequisites": [
    "g2u3.s5"
  ],
  "skills": [
    {
      "id": "g3u1.s1",
      "title": {
        "es": "Identificar número de grupos y cantidad por grupo",
        "en": "Identify the number of groups and the amount in each group"
      },
      "prerequisites": [
        "g2u3.s5"
      ]
    },
    {
      "id": "g3u1.s2",
      "title": {
        "es": "Relacionar grupos con producto",
        "en": "Connect equal groups to a product"
      },
      "prerequisites": [
        "g3u1.s1"
      ]
    },
    {
      "id": "g3u1.s3",
      "title": {
        "es": "Construir y leer arreglos rectangulares",
        "en": "Build and read rectangular arrays"
      },
      "prerequisites": [
        "g3u1.s2"
      ]
    },
    {
      "id": "g3u1.s4",
      "title": {
        "es": "Resolver un problema de producto desconocido",
        "en": "Solve a word problem with an unknown product"
      },
      "prerequisites": [
        "g3u1.s2",
        "g3u1.s3"
      ]
    }
  ],
  "cover": {
    "artBrief": "Mesas de taller comunitario; fichas y cantidades creadas por la app.",
    "containsEmbeddedTextOrNumbers": false
  },
  "warmupPolicy": {
    "source": "localDueSkills",
    "maximumItems": {
      "minutes8": 2,
      "minutes15": 3,
      "minutes20": 4
    }
  },
  "masteryPolicyRef": "independentEvidence10.v1",
  "representationPolicy": {
    "mathIsRenderedByApp": true,
    "artIsDecorative": true,
    "dragAlternative": "tapThenTap"
  },
  "provenance": {
    "authorship": "originalKitewiseDesign",
    "evidenceReferences": [
      "S01",
      "S05",
      "S08"
    ],
    "thirdPartyExerciseCopied": false
  },
  "lessons": [
    {
      "id": "g3u1.l1",
      "unitId": "g3u1",
      "title": {
        "es": "Los grupos y lo que hay dentro",
        "en": "Groups and the amount in each group"
      },
      "skillIds": [
        "g3u1.s1"
      ],
      "steps": [
        {
          "kind": "aprender",
          "blocks": [
            {
              "type": "text",
              "text": {
                "es": "En grupos iguales hay la misma cantidad en cada grupo. Primero mira cuántos grupos hay; después mira cuántos objetos tiene uno.",
                "en": "Equal groups have the same number in each group. First count the groups. Then count the objects in one group."
              },
              "audio": {
                "es": "En grupos iguales hay la misma cantidad en cada grupo. Primero mira cuántos grupos hay; después mira cuántos objetos tiene uno.",
                "en": "Equal groups have the same number in each group. First count the groups. Then count the objects in one group."
              }
            },
            {
              "type": "keyIdea",
              "text": {
                "es": "Grupos iguales: la misma cantidad en cada grupo.",
                "en": "Equal groups: the same number in each group."
              }
            },
            {
              "type": "vocabulary",
              "items": [
                {
                  "term": {
                    "es": "grupo",
                    "en": "group"
                  },
                  "definition": {
                    "es": "Un conjunto que contamos como una unidad.",
                    "en": "A collection we count as one unit."
                  }
                },
                {
                  "term": {
                    "es": "en cada grupo",
                    "en": "in each group"
                  },
                  "definition": {
                    "es": "La cantidad que tiene un solo grupo.",
                    "en": "The number in one group."
                  }
                },
                {
                  "term": {
                    "es": "producto",
                    "en": "product"
                  },
                  "definition": {
                    "es": "El resultado de multiplicar.",
                    "en": "The result of multiplication."
                  }
                }
              ]
            },
            {
              "type": "annotatedIllustration",
              "artBrief": "Mesa de taller sin palabras ni números.",
              "overlay": {
                "component": "EqualGroups",
                "groups": 3,
                "perGroup": 4,
                "labelsAreLiveText": true
              }
            }
          ]
        },
        {
          "kind": "explorar",
          "interaction": "drag",
          "payload": {
            "component": "DragZone",
            "groups": 3,
            "perGroup": 4,
            "task": "buildEqualGroups",
            "tapAlternative": true
          }
        },
        {
          "kind": "practicar",
          "challenge": {
            "id": "g3u1.l1.c1",
            "skillId": "g3u1.s1",
            "mathVariantId": "g3u1.l1.c1.v1",
            "prompt": {
              "es": "Observa 3 bolsas de 4 fichas. ¿Cuántas bolsas hay?",
              "en": "Look at 3 bags with 4 counters in each bag. How many bags are there?"
            },
            "audio": {
              "es": "Observa 3 bolsas de 4 fichas. ¿Cuántas bolsas hay?",
              "en": "Look at 3 bags with 4 counters in each bag. How many bags are there?"
            },
            "answer": {
              "kind": "numeric",
              "value": 3
            },
            "hints": [
              {
                "level": 1,
                "type": "hint",
                "text": {
                  "es": "Cuenta las bolsas, no las fichas de dentro.",
                  "en": "Count the bags, not the counters inside."
                },
                "audio": {
                  "es": "Cuenta las bolsas, no las fichas de dentro.",
                  "en": "Count the bags, not the counters inside."
                }
              },
              {
                "level": 2,
                "type": "workedExample",
                "text": {
                  "es": "En 2 bolsas de 5 fichas hay 2 bolsas.",
                  "en": "With 2 bags of 5 counters each, there are 2 bags."
                },
                "audio": {
                  "es": "En 2 bolsas de 5 fichas hay 2 bolsas.",
                  "en": "With 2 bags of 5 counters each, there are 2 bags."
                }
              },
              {
                "level": 3,
                "type": "explainedAnswer",
                "text": {
                  "es": "Hay 3 bolsas: ese es el número de grupos. Cada grupo tiene 4 fichas.",
                  "en": "There are 3 bags, so there are 3 groups. Each group has 4 counters."
                },
                "audio": {
                  "es": "Hay 3 bolsas: ese es el número de grupos. Cada grupo tiene 4 fichas.",
                  "en": "There are 3 bags, so there are 3 groups. Each group has 4 counters."
                }
              }
            ],
            "responseMode": "numericKeypad",
            "confidenceChoices": [
              "seguro",
              "masOMenos",
              "adivino"
            ],
            "attemptPolicy": {
              "requireConfidenceBeforeCheck": true,
              "countOnlyFirstIndependentResponse": true,
              "accessibilitySupportCountsAsMathHint": false,
              "maxHintLevel": 3,
              "allowSkipToReview": true
            },
            "feedback": {
              "tryAgain": {
                "es": "Revisemos el modelo y lo que cuenta cada grupo.",
                "en": "Let’s check the model and what each group counts."
              },
              "success": {
                "es": "La respuesta coincide. Mira cómo la muestra el modelo.",
                "en": "That matches. See how the model shows the answer."
              }
            },
            "generator": {
              "templateId": "identifyGroups.v1",
              "parameters": {
                "groups": {
                  "integerMin": 1,
                  "integerMax": 5
                },
                "perGroup": {
                  "integerMin": 1,
                  "integerMax": 6
                }
              },
              "answerExpression": "groups",
              "workedExampleMustDiffer": true,
              "sampleParameters": {
                "groups": 3,
                "perGroup": 4
              },
              "templateVersion": "1.0.0",
              "derived": {
                "total": "groups * perGroup"
              },
              "evaluationPolicy": "whitelist named integer fields and multiplication; never eval arbitrary text",
              "workedExamplePolicy": {
                "chooseFirstDifferentPair": [
                  [
                    2,
                    5
                  ],
                  [
                    3,
                    4
                  ]
                ],
                "deriveAnswerFromChosenPair": true
              },
              "renderingPolicy": {
                "pluralForms": "locale-aware",
                "numbersAreLiveText": true,
                "audioFromLocalizedTemplate": true,
                "sameSeedWhenSwitchingLanguage": true
              },
              "localizedTemplates": {
                "prompt": {
                  "es": "Hay {groups} bolsas con {perGroup} fichas en cada una. ¿Cuántas bolsas hay?",
                  "en": "There are {groups} bags with {perGroup} counters in each bag. How many bags are there?"
                },
                "hint": {
                  "es": "Cuenta los grupos, no lo que hay dentro.",
                  "en": "Count the groups, not the objects inside."
                },
                "workedExample": {
                  "es": "En {exampleGroups} bolsas de {examplePerGroup} fichas hay {exampleGroups} bolsas.",
                  "en": "With {exampleGroups} bags of {examplePerGroup} counters each, there are {exampleGroups} bags."
                },
                "explainedAnswer": {
                  "es": "Hay {groups} bolsas. Ese es el número de grupos.",
                  "en": "There are {groups} bags. That is the number of groups."
                }
              }
            },
            "representation": {
              "component": "EqualGroups",
              "groups": 3,
              "perGroup": 4
            }
          }
        },
        {
          "kind": "practicar",
          "challenge": {
            "id": "g3u1.l1.c2",
            "skillId": "g3u1.s1",
            "mathVariantId": "g3u1.l1.c2.v1",
            "prompt": {
              "es": "Observa 3 bolsas de 4 fichas. ¿Cuántas fichas hay en cada bolsa?",
              "en": "Look at 3 bags with 4 counters in each bag. How many counters are in each bag?"
            },
            "audio": {
              "es": "Observa 3 bolsas de 4 fichas. ¿Cuántas fichas hay en cada bolsa?",
              "en": "Look at 3 bags with 4 counters in each bag. How many counters are in each bag?"
            },
            "answer": {
              "kind": "numeric",
              "value": 4
            },
            "hints": [
              {
                "level": 1,
                "type": "hint",
                "text": {
                  "es": "Mira una sola bolsa.",
                  "en": "Look inside just one bag."
                },
                "audio": {
                  "es": "Mira una sola bolsa.",
                  "en": "Look inside just one bag."
                }
              },
              {
                "level": 2,
                "type": "workedExample",
                "text": {
                  "es": "En 2 bolsas de 5 fichas, hay 5 fichas por bolsa.",
                  "en": "In 2 bags of 5, there are 5 counters in each bag."
                },
                "audio": {
                  "es": "En 2 bolsas de 5 fichas, hay 5 fichas por bolsa.",
                  "en": "In 2 bags of 5, there are 5 counters in each bag."
                }
              },
              {
                "level": 3,
                "type": "explainedAnswer",
                "text": {
                  "es": "Cada bolsa contiene 4 fichas. Esa es la cantidad por grupo.",
                  "en": "Each bag contains 4 counters. That is the number in each group."
                },
                "audio": {
                  "es": "Cada bolsa contiene 4 fichas. Esa es la cantidad por grupo.",
                  "en": "Each bag contains 4 counters. That is the number in each group."
                }
              }
            ],
            "responseMode": "numericKeypad",
            "confidenceChoices": [
              "seguro",
              "masOMenos",
              "adivino"
            ],
            "attemptPolicy": {
              "requireConfidenceBeforeCheck": true,
              "countOnlyFirstIndependentResponse": true,
              "accessibilitySupportCountsAsMathHint": false,
              "maxHintLevel": 3,
              "allowSkipToReview": true
            },
            "feedback": {
              "tryAgain": {
                "es": "Revisemos el modelo y lo que cuenta cada grupo.",
                "en": "Let’s check the model and what each group counts."
              },
              "success": {
                "es": "La respuesta coincide. Mira cómo la muestra el modelo.",
                "en": "That matches. See how the model shows the answer."
              }
            },
            "generator": {
              "templateId": "identifyPerGroup.v1",
              "parameters": {
                "groups": {
                  "integerMin": 1,
                  "integerMax": 5
                },
                "perGroup": {
                  "integerMin": 1,
                  "integerMax": 6
                }
              },
              "answerExpression": "perGroup",
              "workedExampleMustDiffer": true,
              "sampleParameters": {
                "groups": 3,
                "perGroup": 4
              },
              "templateVersion": "1.0.0",
              "derived": {
                "total": "groups * perGroup"
              },
              "evaluationPolicy": "whitelist named integer fields and multiplication; never eval arbitrary text",
              "workedExamplePolicy": {
                "chooseFirstDifferentPair": [
                  [
                    2,
                    5
                  ],
                  [
                    3,
                    4
                  ]
                ],
                "deriveAnswerFromChosenPair": true
              },
              "renderingPolicy": {
                "pluralForms": "locale-aware",
                "numbersAreLiveText": true,
                "audioFromLocalizedTemplate": true,
                "sameSeedWhenSwitchingLanguage": true
              },
              "localizedTemplates": {
                "prompt": {
                  "es": "Hay {groups} bolsas con {perGroup} fichas en cada una. ¿Cuántas fichas tiene cada bolsa?",
                  "en": "There are {groups} bags with {perGroup} counters in each bag. How many counters are in each bag?"
                },
                "hint": {
                  "es": "Mira un solo grupo.",
                  "en": "Look at just one group."
                },
                "workedExample": {
                  "es": "En {exampleGroups} bolsas de {examplePerGroup} fichas, cada bolsa contiene {examplePerGroup} fichas.",
                  "en": "In {exampleGroups} bags of {examplePerGroup} counters, each bag holds {examplePerGroup} counters."
                },
                "explainedAnswer": {
                  "es": "Cada bolsa tiene {perGroup} fichas.",
                  "en": "Each bag has {perGroup} counters."
                }
              }
            },
            "representation": {
              "component": "EqualGroups",
              "groups": 3,
              "perGroup": 4
            }
          }
        },
        {
          "kind": "juego",
          "game": "parejas",
          "payload": {
            "pairs": [
              {
                "left": {
                  "es": "2 bolsas con 3 fichas: número de bolsas",
                  "en": "2 bags with 3 counters each: number of bags"
                },
                "right": 2
              },
              {
                "left": {
                  "es": "2 bolsas con 3 fichas: fichas por bolsa",
                  "en": "2 bags with 3 counters each: counters per bag"
                },
                "right": 3
              }
            ],
            "timer": false,
            "randomRewards": false,
            "allowExit": true
          }
        }
      ],
      "closure": {
        "prompt": {
          "es": "¿Qué te ayudó a resolver?",
          "en": "What helped you solve it?"
        },
        "choices": [
          {
            "es": "Ver los grupos",
            "en": "Seeing the groups"
          },
          {
            "es": "Usar la suma",
            "en": "Using addition"
          },
          {
            "es": "Usar la multiplicación",
            "en": "Using multiplication"
          }
        ]
      }
    },
    {
      "id": "g3u1.l2",
      "unitId": "g3u1",
      "title": {
        "es": "De los grupos al producto",
        "en": "From equal groups to a product"
      },
      "skillIds": [
        "g3u1.s2"
      ],
      "steps": [
        {
          "kind": "aprender",
          "blocks": [
            {
              "type": "text",
              "text": {
                "es": "Tres grupos de cuatro son cuatro más cuatro más cuatro. Escribimos 3×4 = 12.",
                "en": "Three groups of four mean four plus four plus four. We can write 3×4 = 12."
              },
              "audio": {
                "es": "Tres grupos de cuatro son cuatro más cuatro más cuatro. Escribimos 3×4 = 12.",
                "en": "Three groups of four mean four plus four plus four. We can write 3×4 = 12."
              }
            },
            {
              "type": "keyIdea",
              "text": {
                "es": "Grupos iguales: la misma cantidad en cada grupo.",
                "en": "Equal groups: the same number in each group."
              }
            },
            {
              "type": "vocabulary",
              "items": [
                {
                  "term": {
                    "es": "grupo",
                    "en": "group"
                  },
                  "definition": {
                    "es": "Un conjunto que contamos como una unidad.",
                    "en": "A collection we count as one unit."
                  }
                },
                {
                  "term": {
                    "es": "en cada grupo",
                    "en": "in each group"
                  },
                  "definition": {
                    "es": "La cantidad que tiene un solo grupo.",
                    "en": "The number in one group."
                  }
                },
                {
                  "term": {
                    "es": "producto",
                    "en": "product"
                  },
                  "definition": {
                    "es": "El resultado de multiplicar.",
                    "en": "The result of multiplication."
                  }
                }
              ]
            },
            {
              "type": "annotatedIllustration",
              "artBrief": "Mesa de taller sin palabras ni números.",
              "overlay": {
                "component": "EqualGroups",
                "groups": 3,
                "perGroup": 4,
                "labelsAreLiveText": true
              }
            }
          ]
        },
        {
          "kind": "explorar",
          "interaction": "drag",
          "payload": {
            "component": "EqualGroups",
            "groups": 3,
            "perGroup": 4,
            "task": "connectModelToEquation",
            "renderEquationAsLiveText": true
          }
        },
        {
          "kind": "practicar",
          "challenge": {
            "id": "g3u1.l2.c1",
            "skillId": "g3u1.s2",
            "mathVariantId": "g3u1.l2.c1.v1",
            "prompt": {
              "es": "Hay 3 bolsas con 4 fichas en cada una. ¿Cuántas fichas hay?",
              "en": "There are 3 bags with 4 counters in each bag. How many counters are there?"
            },
            "audio": {
              "es": "Hay 3 bolsas con 4 fichas en cada una. ¿Cuántas fichas hay?",
              "en": "There are 3 bags with 4 counters in each bag. How many counters are there?"
            },
            "answer": {
              "kind": "numeric",
              "value": 12
            },
            "hints": [
              {
                "level": 1,
                "type": "hint",
                "text": {
                  "es": "Cuenta cuatro por cada bolsa.",
                  "en": "Count four for each bag."
                },
                "audio": {
                  "es": "Cuenta cuatro por cada bolsa.",
                  "en": "Count four for each bag."
                }
              },
              {
                "level": 2,
                "type": "workedExample",
                "text": {
                  "es": "2 bolsas de 5: 5 + 5 = 10.",
                  "en": "2 bags of 5 make 5 + 5 = 10."
                },
                "audio": {
                  "es": "2 bolsas de 5: 5 + 5 = 10.",
                  "en": "2 bags of 5 make 5 + 5 = 10."
                }
              },
              {
                "level": 3,
                "type": "explainedAnswer",
                "text": {
                  "es": "4 + 4 + 4 = 12; 3×4 = 12 fichas.",
                  "en": "4 + 4 + 4 = 12, so 3×4 = 12 counters."
                },
                "audio": {
                  "es": "4 + 4 + 4 = 12; 3×4 = 12 fichas.",
                  "en": "4 + 4 + 4 = 12, so 3×4 = 12 counters."
                }
              }
            ],
            "responseMode": "numericKeypad",
            "confidenceChoices": [
              "seguro",
              "masOMenos",
              "adivino"
            ],
            "attemptPolicy": {
              "requireConfidenceBeforeCheck": true,
              "countOnlyFirstIndependentResponse": true,
              "accessibilitySupportCountsAsMathHint": false,
              "maxHintLevel": 3,
              "allowSkipToReview": true
            },
            "feedback": {
              "tryAgain": {
                "es": "Revisemos el modelo y lo que cuenta cada grupo.",
                "en": "Let’s check the model and what each group counts."
              },
              "success": {
                "es": "La respuesta coincide. Mira cómo la muestra el modelo.",
                "en": "That matches. See how the model shows the answer."
              }
            },
            "generator": {
              "templateId": "equalGroups.v1",
              "parameters": {
                "groups": {
                  "integerMin": 1,
                  "integerMax": 9
                },
                "perGroup": {
                  "integerMin": 1,
                  "integerMax": 9
                }
              },
              "derived": {
                "total": "groups * perGroup"
              },
              "constraints": [
                "total <= 81",
                "groups > 0",
                "perGroup > 0"
              ],
              "answerExpression": "groups * perGroup",
              "seedPolicy": "storeLocalSeedAndTemplateVersion",
              "localizationPolicy": "renderPluralFormsAndNarrationForEachLocale",
              "hintPolicy": "regenerateAllThreeHintsFromTheSameParameters; workedExampleMustDiffer",
              "sampleParameters": {
                "groups": 3,
                "perGroup": 4
              },
              "templateVersion": "1.0.0",
              "evaluationPolicy": "whitelist named integer fields and multiplication; never eval arbitrary text",
              "workedExamplePolicy": {
                "chooseFirstDifferentPair": [
                  [
                    2,
                    5
                  ],
                  [
                    3,
                    4
                  ]
                ],
                "deriveAnswerFromChosenPair": true
              },
              "renderingPolicy": {
                "pluralForms": "locale-aware",
                "numbersAreLiveText": true,
                "audioFromLocalizedTemplate": true,
                "sameSeedWhenSwitchingLanguage": true
              },
              "semanticBindings": {
                "groupCount": "groups",
                "groupSize": "perGroup",
                "answer": "total"
              },
              "localizedTemplates": {
                "prompt": {
                  "es": "Hay {groupCount} grupos de {groupSize} fichas. ¿Cuántas fichas hay en total?",
                  "en": "There are {groupCount} equal groups of {groupSize} counters. How many counters are there altogether?"
                },
                "hint": {
                  "es": "Suma la misma cantidad por cada grupo o usa una multiplicación.",
                  "en": "Add the same amount for each group, or use multiplication."
                },
                "workedExample": {
                  "es": "{exampleGroups} grupos de {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}.",
                  "en": "{exampleGroups} groups of {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}."
                },
                "explainedAnswer": {
                  "es": "{groupCount}×{groupSize} = {total}; hay {total} fichas.",
                  "en": "{groupCount}×{groupSize} = {total}, so there are {total} counters."
                }
              }
            },
            "representation": {
              "component": "EqualGroups",
              "groups": 3,
              "perGroup": 4
            },
            "standards": [
              "3.OA.1"
            ]
          }
        },
        {
          "kind": "juego",
          "game": "parejas",
          "payload": {
            "pairs": [
              {
                "left": {
                  "es": "2 grupos de 3",
                  "en": "2 groups of 3"
                },
                "right": 6
              },
              {
                "left": {
                  "es": "3 grupos de 4",
                  "en": "3 groups of 4"
                },
                "right": 12
              },
              {
                "left": {
                  "es": "4 grupos de 5",
                  "en": "4 groups of 5"
                },
                "right": 20
              }
            ],
            "timer": false,
            "randomRewards": false,
            "allowExit": true
          }
        }
      ],
      "closure": {
        "prompt": {
          "es": "¿Qué te ayudó a resolver?",
          "en": "What helped you solve it?"
        },
        "choices": [
          {
            "es": "Ver los grupos",
            "en": "Seeing the groups"
          },
          {
            "es": "Usar la suma",
            "en": "Using addition"
          },
          {
            "es": "Usar la multiplicación",
            "en": "Using multiplication"
          }
        ]
      }
    },
    {
      "id": "g3u1.l3",
      "unitId": "g3u1",
      "title": {
        "es": "Filas y columnas",
        "en": "Rows and columns"
      },
      "skillIds": [
        "g3u1.s3"
      ],
      "steps": [
        {
          "kind": "aprender",
          "blocks": [
            {
              "type": "text",
              "text": {
                "es": "Un arreglo organiza grupos iguales en filas y columnas. Cuatro filas de seis tienen veinticuatro puntos.",
                "en": "An array organizes equal groups in rows and columns. Four rows of six contain twenty-four dots."
              },
              "audio": {
                "es": "Un arreglo organiza grupos iguales en filas y columnas. Cuatro filas de seis tienen veinticuatro puntos.",
                "en": "An array organizes equal groups in rows and columns. Four rows of six contain twenty-four dots."
              }
            },
            {
              "type": "keyIdea",
              "text": {
                "es": "Grupos iguales: la misma cantidad en cada grupo.",
                "en": "Equal groups: the same number in each group."
              }
            },
            {
              "type": "vocabulary",
              "items": [
                {
                  "term": {
                    "es": "grupo",
                    "en": "group"
                  },
                  "definition": {
                    "es": "Un conjunto que contamos como una unidad.",
                    "en": "A collection we count as one unit."
                  }
                },
                {
                  "term": {
                    "es": "en cada grupo",
                    "en": "in each group"
                  },
                  "definition": {
                    "es": "La cantidad que tiene un solo grupo.",
                    "en": "The number in one group."
                  }
                },
                {
                  "term": {
                    "es": "producto",
                    "en": "product"
                  },
                  "definition": {
                    "es": "El resultado de multiplicar.",
                    "en": "The result of multiplication."
                  }
                }
              ]
            },
            {
              "type": "annotatedIllustration",
              "artBrief": "Mesa de taller sin palabras ni números.",
              "overlay": {
                "component": "EqualGroups",
                "groups": 3,
                "perGroup": 4,
                "labelsAreLiveText": true
              }
            }
          ]
        },
        {
          "kind": "explorar",
          "interaction": "paint",
          "payload": {
            "component": "PaintGrid",
            "rows": 4,
            "columns": 6,
            "task": "buildArray",
            "showRowColumnLabelsAsLiveText": true
          }
        },
        {
          "kind": "practicar",
          "challenge": {
            "id": "g3u1.l3.c1",
            "skillId": "g3u1.s3",
            "mathVariantId": "g3u1.l3.c1.v1",
            "prompt": {
              "es": "Un arreglo tiene 4 filas de 6 puntos. ¿Cuántos puntos hay?",
              "en": "An array has 4 rows of 6 dots. How many dots are there?"
            },
            "audio": {
              "es": "Un arreglo tiene 4 filas de 6 puntos. ¿Cuántos puntos hay?",
              "en": "An array has 4 rows of 6 dots. How many dots are there?"
            },
            "answer": {
              "kind": "numeric",
              "value": 24
            },
            "hints": [
              {
                "level": 1,
                "type": "hint",
                "text": {
                  "es": "Cada fila aporta seis puntos.",
                  "en": "Each row has six dots."
                },
                "audio": {
                  "es": "Cada fila aporta seis puntos.",
                  "en": "Each row has six dots."
                }
              },
              {
                "level": 2,
                "type": "workedExample",
                "text": {
                  "es": "3 filas de 5: 3×5 = 15.",
                  "en": "3 rows of 5 make 3×5 = 15."
                },
                "audio": {
                  "es": "3 filas de 5: 3×5 = 15.",
                  "en": "3 rows of 5 make 3×5 = 15."
                }
              },
              {
                "level": 3,
                "type": "explainedAnswer",
                "text": {
                  "es": "6 + 6 + 6 + 6 = 24; 4×6 = 24.",
                  "en": "Four groups of six make 24, so 4×6 = 24."
                },
                "audio": {
                  "es": "6 + 6 + 6 + 6 = 24; 4×6 = 24.",
                  "en": "Four groups of six make 24, so 4×6 = 24."
                }
              }
            ],
            "responseMode": "numericKeypad",
            "confidenceChoices": [
              "seguro",
              "masOMenos",
              "adivino"
            ],
            "attemptPolicy": {
              "requireConfidenceBeforeCheck": true,
              "countOnlyFirstIndependentResponse": true,
              "accessibilitySupportCountsAsMathHint": false,
              "maxHintLevel": 3,
              "allowSkipToReview": true
            },
            "feedback": {
              "tryAgain": {
                "es": "Revisemos el modelo y lo que cuenta cada grupo.",
                "en": "Let’s check the model and what each group counts."
              },
              "success": {
                "es": "La respuesta coincide. Mira cómo la muestra el modelo.",
                "en": "That matches. See how the model shows the answer."
              }
            },
            "generator": {
              "templateId": "arrayTotal.v1",
              "parameters": {
                "rows": {
                  "integerMin": 1,
                  "integerMax": 9
                },
                "columns": {
                  "integerMin": 1,
                  "integerMax": 9
                }
              },
              "constraints": [
                "rows * columns <= 81"
              ],
              "answerExpression": "rows * columns",
              "workedExampleMustDiffer": true,
              "sampleParameters": {
                "rows": 4,
                "columns": 6
              },
              "templateVersion": "1.0.0",
              "derived": {
                "total": "rows * columns"
              },
              "evaluationPolicy": "whitelist named integer fields and multiplication; never eval arbitrary text",
              "workedExamplePolicy": {
                "chooseFirstDifferentPair": [
                  [
                    2,
                    5
                  ],
                  [
                    3,
                    4
                  ]
                ],
                "deriveAnswerFromChosenPair": true
              },
              "renderingPolicy": {
                "pluralForms": "locale-aware",
                "numbersAreLiveText": true,
                "audioFromLocalizedTemplate": true,
                "sameSeedWhenSwitchingLanguage": true
              },
              "semanticBindings": {
                "groupCount": "rows",
                "groupSize": "columns",
                "answer": "total"
              },
              "localizedTemplates": {
                "prompt": {
                  "es": "Un arreglo tiene {rows} filas de {columns} puntos. ¿Cuántos puntos hay?",
                  "en": "An array has {rows} rows of {columns} dots. How many dots are there?"
                },
                "hint": {
                  "es": "Suma la misma cantidad por cada grupo o usa una multiplicación.",
                  "en": "Add the same amount for each group, or use multiplication."
                },
                "workedExample": {
                  "es": "{exampleGroups} grupos de {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}.",
                  "en": "{exampleGroups} groups of {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}."
                },
                "explainedAnswer": {
                  "es": "{groupCount}×{groupSize} = {total}; hay {total} fichas.",
                  "en": "{groupCount}×{groupSize} = {total}, so there are {total} counters."
                }
              }
            },
            "representation": {
              "component": "PaintGrid",
              "rows": 4,
              "columns": 6
            },
            "standards": [
              "3.OA.1"
            ]
          }
        },
        {
          "kind": "juego",
          "game": "parejas",
          "payload": {
            "pairs": [
              {
                "left": {
                  "es": "2 grupos de 3",
                  "en": "2 groups of 3"
                },
                "right": 6
              },
              {
                "left": {
                  "es": "3 grupos de 4",
                  "en": "3 groups of 4"
                },
                "right": 12
              },
              {
                "left": {
                  "es": "4 grupos de 5",
                  "en": "4 groups of 5"
                },
                "right": 20
              }
            ],
            "timer": false,
            "randomRewards": false,
            "allowExit": true
          }
        }
      ],
      "closure": {
        "prompt": {
          "es": "¿Qué te ayudó a resolver?",
          "en": "What helped you solve it?"
        },
        "choices": [
          {
            "es": "Ver los grupos",
            "en": "Seeing the groups"
          },
          {
            "es": "Usar la suma",
            "en": "Using addition"
          },
          {
            "es": "Usar la multiplicación",
            "en": "Using multiplication"
          }
        ]
      }
    },
    {
      "id": "g3u1.l4",
      "unitId": "g3u1",
      "title": {
        "es": "Resolver una situación",
        "en": "Solve a story problem"
      },
      "skillIds": [
        "g3u1.s4"
      ],
      "steps": [
        {
          "kind": "aprender",
          "blocks": [
            {
              "type": "text",
              "text": {
                "es": "Busca cuántos grupos hay y cuánto necesita cada grupo. Multiplica para encontrar el total y comprueba qué cuenta la respuesta.",
                "en": "Find the number of groups and the amount in each group. Multiply to get the total, then check what your answer counts."
              },
              "audio": {
                "es": "Busca cuántos grupos hay y cuánto necesita cada grupo. Multiplica para encontrar el total y comprueba qué cuenta la respuesta.",
                "en": "Find the number of groups and the amount in each group. Multiply to get the total, then check what your answer counts."
              }
            },
            {
              "type": "keyIdea",
              "text": {
                "es": "Grupos iguales: la misma cantidad en cada grupo.",
                "en": "Equal groups: the same number in each group."
              }
            },
            {
              "type": "vocabulary",
              "items": [
                {
                  "term": {
                    "es": "grupo",
                    "en": "group"
                  },
                  "definition": {
                    "es": "Un conjunto que contamos como una unidad.",
                    "en": "A collection we count as one unit."
                  }
                },
                {
                  "term": {
                    "es": "en cada grupo",
                    "en": "in each group"
                  },
                  "definition": {
                    "es": "La cantidad que tiene un solo grupo.",
                    "en": "The number in one group."
                  }
                },
                {
                  "term": {
                    "es": "producto",
                    "en": "product"
                  },
                  "definition": {
                    "es": "El resultado de multiplicar.",
                    "en": "The result of multiplication."
                  }
                }
              ]
            },
            {
              "type": "annotatedIllustration",
              "artBrief": "Mesa de taller sin palabras ni números.",
              "overlay": {
                "component": "EqualGroups",
                "groups": 3,
                "perGroup": 4,
                "labelsAreLiveText": true
              }
            }
          ]
        },
        {
          "kind": "explorar",
          "interaction": "drag",
          "payload": {
            "component": "TapeDiagram",
            "groups": 7,
            "perGroup": 5,
            "task": "modelStory",
            "prompt": {
              "es": "Cada mesa necesita 5 hojas. Hay 7 mesas. ¿Cuántas hojas se necesitan?",
              "en": "Each table needs 5 sheets of paper. There are 7 tables. How many sheets are needed?"
            }
          }
        },
        {
          "kind": "practicar",
          "challenge": {
            "id": "g3u1.l4.c1",
            "skillId": "g3u1.s4",
            "mathVariantId": "g3u1.l4.c1.v1",
            "prompt": {
              "es": "Cada mesa necesita 5 hojas. Hay 7 mesas. ¿Cuántas hojas se necesitan?",
              "en": "Each table needs 5 sheets of paper. There are 7 tables. How many sheets are needed?"
            },
            "audio": {
              "es": "Cada mesa necesita 5 hojas. Hay 7 mesas. ¿Cuántas hojas se necesitan?",
              "en": "Each table needs 5 sheets of paper. There are 7 tables. How many sheets are needed?"
            },
            "answer": {
              "kind": "numeric",
              "value": 35
            },
            "hints": [
              {
                "level": 1,
                "type": "hint",
                "text": {
                  "es": "Hay siete grupos de cinco.",
                  "en": "There are seven groups of five."
                },
                "audio": {
                  "es": "Hay siete grupos de cinco.",
                  "en": "There are seven groups of five."
                }
              },
              {
                "level": 2,
                "type": "workedExample",
                "text": {
                  "es": "6 mesas con 5 hojas necesitan 6×5 = 30 hojas.",
                  "en": "6 tables with 5 sheets each need 6×5 = 30 sheets."
                },
                "audio": {
                  "es": "6 mesas con 5 hojas necesitan 6×5 = 30 hojas.",
                  "en": "6 tables with 5 sheets each need 6×5 = 30 sheets."
                }
              },
              {
                "level": 3,
                "type": "explainedAnswer",
                "text": {
                  "es": "7×5 = 35; se necesitan 35 hojas.",
                  "en": "7×5 = 35, so 35 sheets are needed."
                },
                "audio": {
                  "es": "7×5 = 35; se necesitan 35 hojas.",
                  "en": "7×5 = 35, so 35 sheets are needed."
                }
              }
            ],
            "responseMode": "numericKeypad",
            "confidenceChoices": [
              "seguro",
              "masOMenos",
              "adivino"
            ],
            "attemptPolicy": {
              "requireConfidenceBeforeCheck": true,
              "countOnlyFirstIndependentResponse": true,
              "accessibilitySupportCountsAsMathHint": false,
              "maxHintLevel": 3,
              "allowSkipToReview": true
            },
            "feedback": {
              "tryAgain": {
                "es": "Revisemos el modelo y lo que cuenta cada grupo.",
                "en": "Let’s check the model and what each group counts."
              },
              "success": {
                "es": "La respuesta coincide. Mira cómo la muestra el modelo.",
                "en": "That matches. See how the model shows the answer."
              }
            },
            "generator": {
              "templateId": "equalGroups.v1",
              "parameters": {
                "groups": {
                  "integerMin": 1,
                  "integerMax": 9
                },
                "perGroup": {
                  "integerMin": 1,
                  "integerMax": 9
                }
              },
              "derived": {
                "total": "groups * perGroup"
              },
              "constraints": [
                "total <= 81",
                "groups > 0",
                "perGroup > 0"
              ],
              "answerExpression": "groups * perGroup",
              "seedPolicy": "storeLocalSeedAndTemplateVersion",
              "localizationPolicy": "renderPluralFormsAndNarrationForEachLocale",
              "hintPolicy": "regenerateAllThreeHintsFromTheSameParameters; workedExampleMustDiffer",
              "sampleParameters": {
                "groups": 7,
                "perGroup": 5
              },
              "templateVersion": "1.0.0",
              "evaluationPolicy": "whitelist named integer fields and multiplication; never eval arbitrary text",
              "workedExamplePolicy": {
                "chooseFirstDifferentPair": [
                  [
                    2,
                    5
                  ],
                  [
                    3,
                    4
                  ]
                ],
                "deriveAnswerFromChosenPair": true
              },
              "renderingPolicy": {
                "pluralForms": "locale-aware",
                "numbersAreLiveText": true,
                "audioFromLocalizedTemplate": true,
                "sameSeedWhenSwitchingLanguage": true
              },
              "semanticBindings": {
                "groupCount": "groups",
                "groupSize": "perGroup",
                "answer": "total"
              },
              "localizedTemplates": {
                "prompt": {
                  "es": "Cada mesa necesita {perGroup} hojas. Hay {groups} mesas. ¿Cuántas hojas se necesitan?",
                  "en": "Each table needs {perGroup} sheets. There are {groups} tables. How many sheets are needed?"
                },
                "hint": {
                  "es": "Suma la misma cantidad por cada grupo o usa una multiplicación.",
                  "en": "Add the same amount for each group, or use multiplication."
                },
                "workedExample": {
                  "es": "{exampleGroups} grupos de {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}.",
                  "en": "{exampleGroups} groups of {examplePerGroup}: {exampleGroups}×{examplePerGroup} = {exampleTotal}."
                },
                "explainedAnswer": {
                  "es": "{groups}×{perGroup} = {total}; se necesitan {total} hojas.",
                  "en": "{groups}×{perGroup} = {total}, so {total} sheets are needed."
                }
              }
            },
            "representation": {
              "component": "OptionalWorkspace",
              "initialModel": null
            },
            "standards": [
              "3.OA.3"
            ],
            "answerUnit": {
              "es": "hojas",
              "en": "sheets"
            }
          }
        },
        {
          "kind": "juego",
          "game": "parejas",
          "payload": {
            "pairs": [
              {
                "left": {
                  "es": "2 grupos de 3",
                  "en": "2 groups of 3"
                },
                "right": 6
              },
              {
                "left": {
                  "es": "3 grupos de 4",
                  "en": "3 groups of 4"
                },
                "right": 12
              },
              {
                "left": {
                  "es": "4 grupos de 5",
                  "en": "4 groups of 5"
                },
                "right": 20
              }
            ],
            "timer": false,
            "randomRewards": false,
            "allowExit": true
          }
        }
      ],
      "closure": {
        "prompt": {
          "es": "¿Qué te ayudó a resolver?",
          "en": "What helped you solve it?"
        },
        "choices": [
          {
            "es": "Ver los grupos",
            "en": "Seeing the groups"
          },
          {
            "es": "Usar la suma",
            "en": "Using addition"
          },
          {
            "es": "Usar la multiplicación",
            "en": "Using multiplication"
          }
        ]
      }
    }
  ]
}
```

## 9. Riesgos, preguntas abiertas y qué debe validar un docente

### Validaciones antes de publicar

| Prioridad | Riesgo o decisión abierta | Qué se revisa y criterio de salida |
| --- | --- | --- |
| P0 | Alineación presentada como certificación | Docente revisa estándar y subapartado por habilidad/reto; código candidato y revisión visible solo a padres. Registrar aprobador y versión fuera del perfil infantil. |
| P0 | Confundir alcance ilustrativo con banco completo | Para cada habilidad producir tareas de concepto, procedimiento y transferencia en ambos idiomas. Auditar que no se promueva por una única plantilla memorizada. |
| P0 | Variantes CA y límites entre grados | Verificar 2.NBT.2 y 2.NBT.7.1, fracciones permitidas, algoritmos por grado, comparación multiplicativa, y que no se adelanten operaciones generales con negativos o probabilidad formal como requisito. |
| P0 | Respuestas ambiguas o matemáticamente inválidas | Comprobar exactitud, unidades, cero, divisores, equivalencias, redondeo, posiciones de incógnita, residuos y distractores; rechazar cualquier ítem sin respuesta inequívoca. |
| P0 | Arte que altera un conteo o medida | Datos y modelos por UI exacta; arte solo escénico. No pedir medir una imagen decorativa. |
| P0 | Idioma que tapa el razonamiento | Docente bilingüe revisa naturalidad y equivalencia matemática; observar resolución con audio y cambio de idioma. No afirmar equivalencia psicométrica ES/EN sin estudio. |
| P0 | Convenciones de trapecio, cuartiles y notación | Acordar definición, política de cuartiles y `es-US`; mostrarlas donde afectan respuesta. No inferir errores del niño por discrepancia editorial. |
| P0 | Accesibilidad o privacidad incumplida | Probar lectores de pantalla, zoom, alternativas al arrastre, uso offline, audio local y ausencia de trackers/anuncios/compras/chats. No se realizó auditoría de una app real en este trabajo. |
| P1 | Modelo de dominio produce falsos positivos | Pilotar umbral con tareas nuevas días después; registrar aciertos con apoyo aparte. No llamar «validado» al criterio 8/10. |
| P1 | Cola de repaso se vuelve carga | Observar retorno de niños con ausencias y sesiones de ocho minutos; limitar pendientes por sesión y conservar progreso. |
| P1 | Menos voz limita justificar | Usar selección de razones, reparación de modelos y conversación familiar opcional; reconocer que no reemplaza la evaluación de argumentación por docente. |
| P1 | Reutilización con licencia equivocada | Registrar edición/URL/licencia del recurso exacto, atribuciones y terceros; revisión de permisos si se incorporan adaptaciones. Las muestras aquí son originales. |
| P2 | Juego distrae o desplaza práctica | Probar si practica el mismo objetivo, tiene final claro y se puede salir; no optimizar minutos de pantalla o clics de premios. |

### Pilotaje recomendado

Primero una revisión docente de la unidad JSON de grupos iguales, después pruebas de comprensión y usabilidad con familias de distintos grados de lectura, idiomas y experiencia matemática. Diseñar participación voluntaria y registrar observaciones sin introducir recogida de datos infantiles en la app. Antes de fijar una muestra de estudio o una conclusión causal, definir objetivos, consentimiento y método apropiados. Una prueba de usabilidad descubre barreras; no demuestra por sí sola eficacia educativa.

Medidas propuestas: primera respuesta independiente en ítems nuevos; transferencia entre representaciones; retención después de una semana; apoyos requeridos; comprensión de la pregunta; capacidad de salir/reanudar y completar una sesión sin ayuda de interfaz. No usar solo tiempo de uso o satisfacción. Comparar desempeño al inicio y después puede orientar iteración, pero sin diseño adecuado no aísla el efecto de Kitewise.

### Ruta concreta para K6 del roadmap

1. Adoptar IDs de habilidades y separar `grade` de nivel de práctica.
2. Implementar `g3u1` como primera unidad: grupos → producto → arreglo → problema.
3. Construir primero fichas, grupos, PaintGrid, teclado y ayuda de tres escalones; dejar herramientas geométricas avanzadas para sus unidades.
4. Usar generadores deterministas con aritmética exacta, controles de plural y audio local.
5. Incorporar dominio y agenda de repaso como servicios separados del contenido, para cambiar criterios tras pilotaje sin reescribir lecciones.
6. Revisar contenido, accesibilidad y matemática con docente antes de publicar; ampliar el banco por habilidad y después las otras unidades.

### Alcance de lo verificado en este informe

Se consultaron fuentes oficiales, documentos de investigación y documentación de proveedores; se comprobó estructura del documento, integridad del grafo, presencia de 37 fichas y 111 muestras ES/EN con tres pistas, y serialización del JSON. La comprobación automatizada no valida la didáctica, el audio, las licencias de futuros materiales ni todos los resultados matemáticos del banco. Los ejemplos recibieron revisión de autoría; no revisión externa por docente. Varias páginas bloquearon lectura completa: se distingue acceso al resumen/documentación indexada de examen del texto completo en la bibliografía. No se ejecutó una revisión sistemática con protocolo de búsqueda exhaustivo ni se probaron todas las apps.

## 10. Bibliografía con enlaces

Las fechas de publicación son las identificadas por los documentos, no las estimaciones de «publicado hace…» de un buscador. Consulta realizada el 15 de octubre de 2026 (California). No se reproducen ejercicios de terceros. Enlaces y clasificación de evidencia se usan para localizar y auditar afirmaciones, no para implicar aval de Kitewise.

### Fuentes oficiales: CDE, CA Framework e IES/WWC

- **[S01] CDE.** [California Common Core State Standards: Mathematics](https://www.cde.ca.gov/be/st/ss/documents/ccssmathstandardaug2013.pdf). Adoptados 2010, modificados 2013; edición electrónica 2014. Grados 1–6: páginas impresas 13–46, además de glosario y Mathematical Practices. PDF consultado; códigos candidatos de este informe, con adiciones CA sujetas a revisión final.
- **[S02] CDE.** [2023 Mathematics Framework, capítulo 6: TK–5](https://www.cde.ca.gov/ci/ma/cf/documents/mathframeworkch6.pdf). Ideas conectadas, modelos, discurso y acceso. El archivo publicado tiene portada de edición posterior; distinguir año del marco y edición del PDF.
- **[S03] CDE.** [2023 Mathematics Framework, capítulo 7: Grades Six through Eight](https://www.cde.ca.gov/ci/ma/cf/documents/mathframeworkch7.pdf). Orientación de la banda 6–8; no atribuir todo el capítulo a 6.º.
- **[S05] Fuchs y colegas, IES/WWC (2021).** [Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades](https://ies.ed.gov/ncee/WWC/PracticeGuide/26). Seis recomendaciones calificadas fuertes, incluidas actividades cronometradas. Intervención, no validación directa de Kitewise.
- **[S06] Siegler y colegas, IES/WWC (2010).** [Developing Effective Fractions Instruction for Kindergarten Through 8th Grade](https://ies.ed.gov/ncee/WWC/PracticeGuide/15). Recomendaciones 2–3 moderadas; 1,4,5 mínimas.
- **[S07] Woodward y colegas, IES/WWC (2012; revisión 2018).** [Improving Mathematical Problem Solving in Grades 4 Through 8](https://ies.ed.gov/ncee/wwc/PracticeGuide/16). Recomendaciones 2–3 fuertes, 4–5 moderadas, 1 mínima.
- **[S08] Pashler y colegas, IES/WWC (2007).** [Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). Espaciado, ejemplos, representaciones y recuperación; la fuerza cambia por recomendación.
- **[S10] CDE.** [ELA/ELD Framework adoptado en 2014](https://www.cde.ca.gov/ci/rl/cf/elaeldfrmwrksbeadopted.asp) y [capítulo 2](https://www.cde.ca.gov/ci/rl/cf/documents/elaeldfwchapter2.pdf); [CA ELD Standards](https://www.cde.ca.gov/sp/ml/eldstandards.asp). Recursos de instrucción integrada y acceso lingüístico.
- **[S20] NIST.** [Guide to the SI, Appendix B.9: conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9). Referencia de unidades; distinguir constantes exactas de cifras redondeadas.
- **[S25] NYSED.** [Standards Resources and Supports: archivo EngageNY](https://www.nysed.gov/standards-instruction/standards-resources-and-supports). Identifica archivos disponibles como CC BY-NC-SA; comprobar el aviso del archivo concreto.
- **[S27] Star y colegas, IES/WWC (2015; revisión 2019).** [Teaching Strategies for Improving Algebra Knowledge in Middle and High School Students](https://ies.ed.gov/ncee/WWC/PracticeGuide/20). Uso prudente para transición de 6.º; no evidencia específica de toda primaria.
- **[S28] CDE.** [CA CCSSM Maps Instructions, adopción 2025](https://www.cde.ca.gov/ci/ma/im/cccsssminstructmath2025.asp). Distingue estándares 2010/2013 y consistencia con Framework 2023. [Anuncio de adopción del Framework, 12 de julio de 2023](https://www.cde.ca.gov/nr/ne/yr23/yr23rel54.asp).

### Investigación revisada por pares

- **[S11] Moschkovich, J. N. (2015).** [Academic literacy in mathematics for English Learners](https://escholarship.org/uc/item/3b61n1wd). *The Journal of Mathematical Behavior*. Fundamenta una visión de lenguaje matemático más amplia que vocabulario. Se consultó registro/resumen; no se atribuyen al artículo límites concretos de longitud de enunciados.
- **[S12] Shute, V. J. (2008).** [Focus on Formative Feedback](https://doi.org/10.3102/0034654307313795). *Review of Educational Research, 78*(1). Resumen del editor consultado; no se presenta como revisión del texto completo de acceso restringido.
- **[S13] Estudio de primaria (2019).** [Interleaved Learning in Elementary School Mathematics: Effects on the Flexible and Adaptive Use of Subtraction Strategies](https://doi.org/10.3389/fpsyg.2019.00086). *Frontiers in Psychology*. Texto completo consultado; intervención combina intercalado y comparación, limitación para aislar componentes.
- **[S14] Park, Bryant y Shin (2022; publicado online 2021).** [Effects of Interventions Using Virtual Manipulatives for Students With Learning Disabilities: A Synthesis of Single-Case Research](https://pubmed.ncbi.nlm.nih.gov/33845673/). Registro/resumen; no extrapolar automáticamente a todos los niños o a uso sin guía.
- **[S15] Fuchs y colegas (2009).** [Remediating Number Combination and Word Problem Deficits Among Students With Mathematics Difficulties: A Randomized Control Trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC2768320/). Estudio de intervención en 3.º; se consultó información del estudio y descripción de condiciones, no un ensayo de app doméstica.
- **[S16] Fuchs y colegas (2013).** [Effects of First-Grade Number Knowledge Tutoring With Contrasting Forms of Practice](https://pubmed.ncbi.nlm.nih.gov/24065865/). Resumen consultado; permite reconocer evidencia favorable a práctica con rapidez en condiciones específicas, sin recomendar presión universal.
- **[S29] Barroso y colegas (2021).** [A Meta-analysis of the Relation Between Math Anxiety and Math Achievement](https://pmc.ncbi.nlm.nih.gov/articles/PMC8300863/). *Psychological Bulletin*. Asociación ansiedad/desempeño; no causalidad de cualquier cronómetro. Registro/resumen consultado.

### Orientación profesional, lenguaje y documentación primaria de productos

- **[S04a–f] Student Achievement Partners.** [Focus by Grade Level](https://achievethecore.org/category/774/mathematics-focus-by-grade-level). Documentos por grado: [1](https://achievethecore.org/content/upload/SAP_Focus_Math_1.pdf), [2](https://achievethecore.org/content/upload/SAP_Focus_Math_2.pdf), [3](https://achievethecore.org/content/upload/SAP_Focus_Math_3.pdf), [4](https://achievethecore.org/content/upload/SAP_Focus_Math_4.pdf), [5](https://achievethecore.org/content/upload/SAP_Focus_Math_5.pdf), [6](https://achievethecore.org/content/upload/SAP_Focus_Math_6.pdf). Clasificación por cluster; guía de foco, no documento normativo del CDE.
- **[S09] NCTM (2023).** [Procedural Fluency in Mathematics, posición profesional](https://www.nctm.org/Standards-and-Positions/Position-Statements/Procedural-Fluency-in-Mathematics/) y [PDF oficial](https://www.nctm.org/uploadedFiles/Standards_and_Positions/Position_Statements/PROCEDURAL_FLUENCY.pdf). Contenido corroborado por indexación del PDF oficial; el servidor bloqueó la apertura completa. No se atribuye a NCTM un ensayo sobre Kitewise.
- **[S17] FundéuRAE (2025).** [Decimales: coma y punto son signos válidos](https://www.fundeu.es/recomendacion/decimales-coma-y-punto-son-ambas-validas/). Orientación lingüística basada en RAE/ASALE; la elección de `es-US` es propuesta de producto.
- **[S18] RAE/ASALE.** [Diccionario panhispánico de dudas: billón](https://www.rae.es/dpd/billón). 2.ª edición, consulta de entrada en línea.
- **[S19] El Colegio de México.** [Diccionario del español de México: trapecio](https://dem.colmex.mx/ver/trapecio). Ejemplo lexicográfico de definición exclusiva; no prueba de uniformidad en todas las escuelas de México.
- **[S21] Khan Academy.** [Khan Academy Kids](https://www.khanacademy.org/kids). Descripción de público, funciones y modelo familiar; afirmaciones de proveedor, no comparación independiente.
- **[S22] Zearn.** [Zearn en español](https://about.zearn.org/zearn-in-spanish) y [School Account: Spanish-translated digital content](https://help.zearn.org/hc/en-us/articles/30464877966231-School-Account-Spanish-translated-digital-content). Consultar plan, fase y grado concretos.
- **[S23] DreamBox.** [How Does DreamBox Math Work?](https://dreamboxlearning.zendesk.com/hc/en-us/articles/27281843188243-How-Does-DreamBox-Math-Work). Descripción de adaptación y enfoque; fuente del proveedor.
- **[S24] Illustrative Mathematics.** [Site IP Content](https://illustrativemathematics.org/site-ip-content/) y [Terms of Use, vigentes desde mayo de 2026](https://illustrativemathematics.org/terms-of-use/). Distinguen primera edición CC BY 4.0 y v.360 CC BY-NC 4.0, con marcas y terceros aparte.
- **[S26] Math Learning Center.** [Math Apps](https://www.mathlearningcenter.org/apps), [Math MultiApp](https://www.mathlearningcenter.org/mathmultiapp) y [Apps Terms of Use](https://www.mathlearningcenter.org/apps/apps-terms). Gratis para acceder no significa permiso general para copiar/crear derivados.
- **[S30] Prodigy.** [Math Memberships](https://www.prodigygame.com/Memberships/math/). Descripción actual del proveedor sobre membresías y extras, sin trasladar precios históricos.
- **[S31] Fairplay/CCFC (2021).** [Comunicado de la queja sobre Prodigy](https://fairplayforkids.org/feb-19-2021-advocates-to-ftc-prodigy-math-game-preys-on-kids-and-families/). Fuente primaria de la denuncia; no resolución regulatoria ni evidencia de prácticas actuales sin verificación adicional.
- **[S32] IXL.** [How does the SmartScore work?](https://www.ixl.com/help-center/article/1272663/how_does_the_smartscore_work) y [SmartScore Guide](https://www.ixl.com/materials/SmartScore_Guide.pdf). Función y puntuación descritas por su proveedor.
- **[S34] Beast Academy.** [Preguntas frecuentes sobre el currículo](https://help.beastacademy.com/a/1799483-frequently-asked-curriculum-questions) y [libros](https://beastacademy.com/books). Niveles, formato y uso según proveedor.

### Testimonios directos y límites de las fuentes secundarias

- **[S33] Participantes anónimos, r/Teachers (2024).** [Hilo «IXL»](https://www.reddit.com/r/Teachers/comments/1csjb3l/). Se consultó texto indexado del hilo; acceso completo no disponible. Relatos no verificados de frustración por puntuación; no se usan para describir efecto causal, frecuencia o consenso docente.
- **[S35] Participantes anónimos, r/homeschool (2026).** [Beast Academy for kid who doesn't read yet?](https://www.reddit.com/r/homeschool/comments/1rael8o/beast_academy_for_kid_who_doesnt_read_yet/). Testimonios directos sobre acompañamiento lector; no se adoptan afirmaciones generales del hilo sobre desarrollo, diagnósticos ni métodos de lectura.

No se usaron reseñas comerciales secundarias para establecer eficacia. Las conclusiones de diseño son síntesis y propuestas del informe; los estándares, grados de evidencia y condiciones de licencia remiten a las fuentes identificadas.

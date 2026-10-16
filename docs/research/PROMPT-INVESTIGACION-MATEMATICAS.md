# Prompt de investigación profunda — Cuaderno de Matemáticas (Kitewise)

Para usar en un modo de investigación profunda (Claude Research, ChatGPT Deep Research, Gemini Deep Research…).
Copia **todo** lo que está entre las dos líneas `=====`. Si la herramienta corta la respuesta, usa después el
**prompt de seguimiento por grado** (al final de este archivo).

Cuando tengas el resultado, guárdalo en `docs/research/matematicas-investigacion.md` (o pásaselo a Claude Code) para
convertirlo en el modelo de contenido y la primera unidad (tarea K6 del roadmap).

=====

# Rol

Actúa como un equipo de investigación formado por: (1) especialista en didáctica de las matemáticas de primaria
(K-6) con experiencia en el marco de California, (2) especialista en educación bilingüe inglés–español y en
estudiantes de inglés (English Learners) en matemáticas, (3) diseñador/a instruccional de productos educativos
digitales para niños, y (4) especialista en apoyos para niños con dificultades de atención y de aprendizaje de las
matemáticas (incluida la discalculia), sin lenguaje clínico.

Tu trabajo es investigar a fondo, con fuentes verificables, y entregar un **documento de diseño de contenido**
listo para que un equipo de desarrollo construya el cuaderno de Matemáticas de una app. Escribe la respuesta en
**español**, conservando en inglés los términos oficiales (nombres de estándares, dominios y códigos).

# Contexto del producto (no lo cambies; diseña dentro de él)

**Kitewise** es una app de práctica académica para niños de 1.º a 6.º grado (6–12 años), para tablet Android y
teléfono (iPad después), **bilingüe inglés/español**. La usan familias en casa, sobre todo en **California**. Es
"un multicuaderno de materias": Lectura (ya existe), **Matemáticas (lo que investigamos ahora)**, Ciencia,
Sociedad, Arte y música.

Reglas del producto que tu diseño debe respetar:

1. **Sesiones de 4 momentos:** Aprender (≈25 %) → Explorar (≈25 %) → Practicar (≈35 %) → Juego (≈15 %) → Cierre.
   Duración: 20, 15 u 8 minutos según cómo llega el niño ese día (energía alta/normal/baja).
   - *Aprender:* ilustración con anotaciones + texto corto + una idea clave + vocabulario con audio.
   - *Explorar:* interacción táctil sobre una imagen. Ya tenemos o planeamos: pintar casillas (`PaintGrid`),
     arrastrar a zonas (`DragZone`), recta numérica (`NumberLine`), ordenar una secuencia (`SequencePad`),
     encerrar/seleccionar. Puedes proponer otras si las justificas.
   - *Practicar:* un reto por pantalla. Antes de "Comprobar", el niño elige su confianza (Seguro / Más o menos /
     Adivino). Si se equivoca: escalón 1 = pista, escalón 2 = ejemplo resuelto, escalón 3 = ver la respuesta.
     "Lo veo luego" manda el reto al repaso. **Nunca se dice "incorrecto" ni se usa rojo.**
   - *Juego:* corto, sin azar de recompensas (parejas, memoria, ritmo…).
2. **Repaso espaciado:** lo que costó vuelve a los 1, 3 y 7 días, al calentar la sesión siguiente.
3. **Dominio por habilidad:** explorando → practicando → dominado. El niño nunca ve porcentajes; los padres ven
   el detalle.
4. **El nivel lo elige el padre y NO es el grado escolar.** Un niño de 4.º puede practicar en nivel 2–3. Cada
   habilidad necesita prerrequisitos claros para recomendar dónde empezar.
5. **Modo Enfoque** (para niños a quienes les cuesta concentrarse; nombre neutro, nunca "TDAH" ante el niño): una
   pregunta por pantalla, menos decoración, bloques cortos, pausas de movimiento, barra de tiempo visual.
6. **Respuestas por toque, no por voz** (teclado numérico, opción múltiple, arrastrar, recta numérica, fichas,
   barras de fracción).
7. **Arte y texto siempre separados:** la ilustración nunca lleva texto ni números "pintados"; todo número o
   palabra es texto real de la app (así el mismo arte sirve en inglés y en español).
8. **Privacidad:** no se recogen datos personales; todo se guarda en el dispositivo. Nada de anuncios, chats ni
   compras dentro de la app.
9. **Bilingüe de verdad:** cada idioma es una versión natural, **no una traducción literal**. La dificultad no
   tiene que corresponder 1 a 1 entre idiomas.
10. Los códigos de estándares se muestran **solo a los padres** y como **borrador** hasta que un docente los valide.

# Preguntas de investigación

## A. Qué enseñar en cada nivel (1 a 6)
1. Basándote en el **California Common Core State Standards for Mathematics (CA CCSSM)** y el **California
   Mathematics Framework (versión vigente, aprobada en 2023)**, arma el alcance y secuencia (*scope & sequence*)
   de 1.º a 6.º por dominio: Operations & Algebraic Thinking, Number & Operations in Base Ten, Number &
   Operations—Fractions, Measurement & Data, Geometry; y en 6.º Ratios & Proportional Relationships, The Number
   System, Expressions & Equations, Geometry, Statistics & Probability.
2. Para cada grado, identifica los **contenidos centrales** (*major work of the grade*) frente a los de apoyo y
   adicionales. ¿Qué debería ocupar la mayor parte del tiempo de práctica en casa?
3. Divide cada grado en **unidades** (6–10 por grado) y cada unidad en **habilidades atómicas** (las que se pueden
   practicar y dominar por separado). Marca los **prerrequisitos** entre habilidades, también entre grados.
4. Explica en qué cambia el Framework de California 2023 respecto a versiones anteriores (enfoque en "big ideas",
   razonamiento, fluidez con comprensión, equidad, etc.) y qué implica para una app de práctica.

## B. Cómo enseñarlo (pedagogía con evidencia)
5. Resume la evidencia más sólida aplicable a una app de práctica en casa, con fuentes, sobre:
   - progresión **concreto → representacional → abstracto (CRA)** y qué representación usar en cada tema
     (decenas y unidades, marcos de 10, rectas numéricas, modelos de barras / *tape diagrams*, áreas, barras de
     fracción…);
   - **instrucción basada en esquemas** para problemas verbales (total/partes, diferencia/comparación, cambio
     agregar/quitar, grupos iguales, comparación multiplicativa);
   - **ejemplos resueltos**, práctica espaciada e intercalada, recuperación (*retrieval practice*);
   - **fluidez sin ansiedad**: qué dice la investigación sobre las pruebas cronometradas y qué alternativas hay;
   - retroalimentación que ayuda vs. la que perjudica a niños de primaria;
   - **errores y concepciones erróneas típicas** por tema (p. ej. "multiplicar siempre agranda", "1/8 > 1/6
     porque 8 > 6", alinear decimales a la derecha, el signo = como "da el resultado").
6. Recomendaciones del **What Works Clearinghouse** (IES) y del **NCTM** que apliquen (p. ej. *Assisting Students
   Struggling with Mathematics*, *Developing Effective Fractions Instruction*, *Improving Mathematical Problem
   Solving in Grades 4 Through 8*, *Teaching Strategies for Improving Algebra Knowledge* si aplica). Di qué
   recomendación es fuerte y cuál tiene poca evidencia.
7. Apoyos para niños con dificultades de atención y de aprendizaje de matemáticas: carga cognitiva, ritmo,
   cantidad de ítems por pantalla, uso de manipulativos virtuales, lectura en voz alta del enunciado. Sin
   diagnósticos ni lenguaje clínico.

## C. Inglés y español
8. **Vocabulario matemático bilingüe por grado:** términos que cambian o confunden entre idiomas, y términos con
   falsos amigos. Incluye, como mínimo:
   - nombres de números grandes (*billion* = mil millones; "billón" en español = 10¹²);
   - separador decimal y de miles (en EE. UU. se usa punto decimal; en México también, pero en muchos países
     hispanos se usa coma). **Recomienda qué usar en la versión en español para niños en EE. UU.** y por qué;
   - notación de la división (galera / *long division* en EE. UU. vs. "casita" en México y otros formatos);
   - nombres de fracciones (*one-fourth / a quarter* — "un cuarto"; *thirds* — "tercios"), ordinales, medidas;
   - figuras y geometría (*rhombus* — rombo, *trapezoid* — trapecio: ojo, la definición cambia entre países);
   - unidades: sistema de EE. UU. (pulgadas, libras, galones) y sistema métrico, y cuándo usar cada uno;
   - dinero (dólar y centavos: *penny, nickel, dime, quarter*) y cómo decirlo en español natural.
9. **Diferencias entre la enseñanza en EE. UU. y en México/Latinoamérica** que puedan confundir a niños de
   familias hispanas o a sus padres (algoritmos distintos de resta y división, orden en que se enseñan los temas,
   nombres de estrategias). ¿Cómo ayudar a que el padre hispanohablante acompañe sin contradecir lo que se enseña
   en la escuela de California?
10. **Problemas verbales en dos idiomas:** cómo escribirlos para que la dificultad de LECTURA no tape la de
    MATEMÁTICAS (longitud, vocabulario, estructura de la oración por grado), recomendaciones para *English
    Learners* (CA ELD Framework, estrategias de lenguaje en matemáticas) y contextos culturalmente relevantes para
    familias de California sin estereotipos.
11. ¿Cómo se lee un número o una expresión en voz alta en cada idioma (para el audio de la app)? Reglas para
    fracciones, decimales, negativos, exponentes y unidades.

## D. Diseño para la app
12. Para cada tipo de habilidad, ¿qué **interacción táctil** la practica mejor y cuál evitar? Relaciónalas con
    nuestras interacciones (`PaintGrid`, `DragZone`, `NumberLine`, `SequencePad`, teclado, opción múltiple,
    barras de fracción, fichas) o propone nuevas.
13. ¿Cómo generar muchos problemas **por plantillas** (parámetros con rangos válidos por grado) sin que salgan
    números absurdos o problemas sin sentido? Da reglas de generación por esquema.
14. ¿Qué significa "dominado" para una habilidad de matemáticas en una app así (número de aciertos seguidos,
    con y sin apoyos, en días distintos)? Propón un criterio razonable y su justificación.
15. ¿Qué apps y programas existen (Khan Academy Kids, Zearn, DreamBox, Prodigy, IXL, Beast Academy, Math Learning
    Center, Eureka/EngageNY, Illustrative Mathematics…)? Qué hacen bien, qué critican los docentes y padres, y
    qué **no** deberíamos copiar (recompensas adictivas, presión por velocidad, publicidad). Indica qué recursos
    tienen licencia abierta (p. ej. CC BY) que podríamos usar como referencia **respetando la licencia**.

# Entregables (respeta este formato exacto)

1. **Resumen ejecutivo** (máx. 1 página): las 10 decisiones más importantes para el cuaderno de Matemáticas.
2. **Alcance y secuencia por grado (1.º–6.º)** en tablas: unidad · habilidades · código CA CCSSM candidato ·
   prerrequisitos · contenido central/apoyo · nivel de confianza del código (alta/media/baja).
3. **Ficha por unidad** (todas las unidades de todos los grados; si no cabe, completa 1.º–3.º y deja 4.º–6.º para
   el seguimiento):
   - objetivo en lenguaje para padres (1 frase) y para el niño (1 frase, en ES y en EN);
   - habilidades atómicas con su prerrequisito;
   - concepciones erróneas típicas y cómo detectarlas con una opción de respuesta;
   - representación recomendada (CRA) y la **interacción** de la app para Explorar y para Practicar;
   - **3 retos de ejemplo** con respuesta, en **español y en inglés escritos de forma natural** (no traducidos
     palabra por palabra), cada uno con su **escalera de 3 pistas** (pista → ejemplo resuelto → respuesta
     explicada);
   - **plantilla de generación** (parámetros y rangos);
   - vocabulario de la unidad ES/EN con notas;
   - **brief de ilustración** (escena, sin texto ni números dentro del arte).
4. **Guía bilingüe** completa: glosario por grado, convenciones de notación recomendadas para la versión en español
   en EE. UU., cómo leer números en voz alta, y la lista de "cosas que confunden a padres hispanohablantes".
5. **Principios pedagógicos para la app** (máx. 15), cada uno con su fuente y la fuerza de la evidencia.
6. **Modelo de dominio y repaso** propuesto (criterio de "dominado", qué vuelve al repaso y cuándo).
7. **Adaptaciones de Modo Enfoque** concretas para Matemáticas.
8. **Esqueleto de datos en JSON** para UNA unidad completa de 3.º grado, siguiendo esta estructura (puedes
   proponer campos extra justificándolos):
   ```ts
   type SubjectId = 'lectura' | 'mate' | 'ciencia' | 'sociedad' | 'arte';
   interface Unit { id: string; subject: SubjectId; grade: 1|2|3|4|5|6; title: { es: string; en: string };
     standards: string[]; prerequisites: string[]; lessons: Lesson[]; cover: { artBrief: string } }
   interface Lesson { id: string; unitId: string; skillIds: string[]; steps: Step[] }
   type Step =
     | { kind: 'aprender'; blocks: unknown[] }          // texto + idea clave + vocabulario (ES y EN)
     | { kind: 'explorar'; interaction: 'paint'|'drag'|'slide'|'circle'|'sequence'|string; payload: unknown }
     | { kind: 'practicar'; challenge: unknown }        // incluye pistas de 3 escalones y la plantilla
     | { kind: 'juego'; game: 'parejas'|'memoria'|'ritmo'|string };
   ```
9. **Riesgos, preguntas abiertas y qué debe validar un docente** antes de publicar.
10. **Bibliografía** con enlaces, separando fuentes oficiales (CDE, CA Framework, IES/WWC), investigación revisada
    por pares, y fuentes secundarias.

# Reglas de calidad

- **Cita cada afirmación importante** con su fuente y enlace. Prefiere fuentes oficiales y revisadas por pares.
- Si no estás seguro de un código de estándar o de un dato, **dilo** y márcalo con confianza baja. No inventes
  códigos, citas ni estadísticas.
- Distingue lo que es **evidencia** de lo que es **recomendación tuya**.
- Escribe los ejemplos en español **como hablaría un maestro bilingüe de California** (español neutro latino,
  claro, sin regionalismos fuertes), y en inglés como un maestro estadounidense de primaria.
- Nada de lenguaje clínico ni de "entrenamiento cerebral". Es práctica académica.
- Respeta las licencias: no copies ejercicios de materiales con derechos reservados; puedes describir su enfoque.
- Si algo del contexto del producto choca con la evidencia (por ejemplo, el reparto 25/25/35/15 o los 8 minutos),
  **dilo con argumentos** y propone la alternativa.

=====

## Prompt de seguimiento por grado (si la primera respuesta queda corta)

Usa este cuando la investigación principal no alcance a dar el detalle de todas las unidades. Cambia el grado:

=====

Continúa la investigación anterior del cuaderno de Matemáticas de Kitewise. Ahora entrega el entregable 3 ("Ficha
por unidad") **completo para el grado {N}** (todas sus unidades), con el mismo formato y las mismas reglas de
calidad: objetivo para padres y niño (ES/EN), habilidades atómicas con prerrequisitos, concepciones erróneas,
representación CRA e interacción de la app, 3 retos de ejemplo por unidad en español e inglés naturales con
escalera de 3 pistas, plantilla de generación con rangos, vocabulario ES/EN y brief de ilustración sin texto.
Marca el código CA CCSSM candidato con su nivel de confianza. Cita las fuentes.

=====

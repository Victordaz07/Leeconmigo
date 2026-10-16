# Prompt de investigación: cómo se ven los problemas y ejercicios de matemáticas REALES (1.º–6.º, EN/ES)

**Por qué existe (2026-10-16):** Victor probó la unidad g3u1 en el APK 0.3.0: "siento que no hace sentido… está
demasiado simple, no hay problemas reales según como lo usan en la escuela, se siente como de preescolar". La primera
investigación (`matematicas-investigacion.md`) dio la pedagogía y el modelo de datos, pero no el **catálogo de
ejercicios tal como los ve un niño en clase, en la tarea y en el examen estatal**. Este prompt pide exactamente eso.

Copiar todo lo que está entre las líneas `=====` en una herramienta de investigación profunda. Guardar el resultado como
`docs/research/matematicas-problemas-reales.md`.

=====

## Rol y contexto

Actúa como un equipo de: (1) maestro/a de primaria de California con experiencia en 1.º–6.º y en evaluación CAASPP /
Smarter Balanced, (2) autor/a de libros de texto de matemáticas en inglés y en español, (3) diseñador/a de ejercicios
digitales para tabletas.

Estoy construyendo **Kitewise**, una app de tableta/teléfono bilingüe (inglés/español) para niños de 1.º a 6.º grado en
California. Es práctica académica en casa, no tratamiento. El niño usa la app después de la escuela; los padres quieren
que lo que practica **se parezca a lo que le piden en la escuela**.

Ya tengo una primera unidad de 3.º grado ("Multiplicar con grupos iguales y arreglos", 3.OA.1 y 3.OA.3). El problema:
se siente **de preescolar**. Los ejercicios actuales son del tipo:
- "Observa 3 bolsas de 4 fichas. ¿Cuántas bolsas hay?" (con el dibujo de las 3 bolsas al lado)
- "Pinta un arreglo de 3 filas con 4 puntos."
- Un juego de unir "2 grupos de 3" con "6".
Todo es una sola operación, con números de 2 a 5, con el modelo ya dibujado, sin contexto real, sin pasos, sin
explicar, sin elegir la operación.

Necesito saber **cómo se ven de verdad** los problemas y ejercicios en las escuelas de California (y su equivalente
natural en español), grado por grado, para rediseñar el contenido.

## Fuentes que debes priorizar (cita cada afirmación con su fuente y fecha)

- California Common Core State Standards for Mathematics (CA CCSSM) y el **California Mathematics Framework 2023**
  (capítulos por grado, ejemplos de tareas).
- **Smarter Balanced / CAASPP**: ejemplos de ítems publicados (practice tests, training tests, sample items, Item
  Specifications, "Claims" 1–4: conceptos y procedimientos, resolución de problemas, comunicar el razonamiento,
  modelación y análisis de datos), descripciones de niveles de logro y tipos de respuesta (selección múltiple, selección
  múltiple con varias respuestas, ecuación/numérico, arrastrar y soltar, tabla de verdadero/falso, respuesta corta
  explicada, "performance tasks").
- Currículos usados en distritos de California: **Illustrative Mathematics K–5 / 6–8**, **Eureka Math / EngageNY**
  (y Eureka Math²), **enVision Mathematics**, **Into Math (HMH)**, **Bridges**, **Ready Mathematics (i-Ready)**. Describe
  su estructura de lección (warm-up, activities, cool-down/exit ticket, problem set, homework, "Application Problem",
  "Sprint", "Number Talk") y el tipo de ejercicios de cada parte.
- Recursos abiertos de tareas: **Illustrative Mathematics tasks**, **Achieve the Core** (tareas y "coherence map"),
  **Inside Mathematics / MARS tasks**, **Open Middle**, **Number Talks** (Sherry Parrish), **3-Act Tasks**
  (Dan Meyer / Graham Fletcher), **Which One Doesn't Belong**, **Estimation 180**, **NAEP released items**.
- En español: **libros de texto gratuitos de la SEP (México)** — "Desafíos matemáticos" y los de la Nueva Escuela
  Mexicana —, ediciones en español de enVision / Eureka ("Matemáticas de Eureka") / Illustrative Math, y los ítems en
  español (o con apoyos en español) de Smarter Balanced. Cómo se redactan los problemas de forma natural en español
  (no traducidos palabra por palabra).

**Licencias:** dime la licencia de cada fuente (CC BY, CC BY-NC-SA, propietaria…). NO copies ítems con derechos; describe
el patrón y escribe ejemplos ORIGINALES que sigan ese patrón.

## Lo que necesito, por grado (1.º, 2.º, 3.º, 4.º, 5.º y 6.º)

Para CADA grado entrega:

### A. Cómo se ve una semana real de matemáticas
- Qué hace el niño en clase, en la tarea y en un examen de unidad (cuántos ejercicios, cuánto tiempo, cuánto texto).
- Ejemplo de una página típica de tarea/"problem set" (describe su composición: cuántos de cálculo, cuántos de
  problema verbal, cuántos de explicar, cuántos con dibujo/modelo, en qué orden suben de dificultad).

### B. Catálogo de tipos de ejercicio ("arquetipos") — mínimo 12 por grado
Para cada arquetipo:
1. Nombre y estándar(es) CA CCSSM.
2. **3 ejemplos originales** en inglés Y su versión natural en español, del nivel real de ese grado (fáciles, de
   nivel, retadores). Con la respuesta y la explicación.
3. Rango de números realista (p. ej. 3.º multiplicación: factores hasta 10, productos hasta 100; problemas de dos pasos
   con las cuatro operaciones).
4. Cuántos pasos tiene y qué tiene que decidir el niño (¿elegir la operación?, ¿hay datos de sobra?, ¿la incógnita está
   al principio, en medio o al final?).
5. Formato de respuesta (número, ecuación, elegir varias, verdadero/falso, ordenar, completar tabla, dibujar en recta
   numérica/arreglo, escribir explicación corta) y cómo hacerlo en una tableta SIN teclado de texto largo.
6. Modelo/representación que se usa en la escuela (diagrama de barra/tape diagram, arreglo, recta numérica, modelo de
   área, tabla de valor posicional, fracciones en recta numérica…) y **cuándo se da dibujado y cuándo lo dibuja el niño**.
7. Errores comunes / ideas equivocadas típicas, y qué distractores usaría un examen para detectarlas.
8. Contextos de la vida real que usan los libros para ese grado (dinero, tiempo, medidas, recetas, deportes, escuela,
   tienda…) y cuáles funcionan igual en inglés y en español (cuidado con unidades: dólares, millas/pulgadas vs. sistema
   métrico; en California se usan ambos).

### C. Tipos de problema verbal (estructura)
- La clasificación de tipos de problema de suma/resta (juntar, separar, comparar, parte-parte-todo, con la incógnita en
  cada lugar) y de multiplicación/división (grupos iguales, arreglos/área, comparación multiplicativa "veces más",
  medición), con la tabla del Common Core (Tabla 1 y Tabla 2 de la Glosario) — qué tipos se esperan en cada grado.
- Problemas de **dos pasos** (3.º), **varios pasos** (4.º–6.º), con **datos de sobra**, con **residuo que hay que
  interpretar** (4.º), **estimar para ver si la respuesta es razonable**.
- Ejemplos de "performance tasks" de Smarter Balanced por grado: cómo están armados (un escenario + 3–6 preguntas
  encadenadas).

### D. Progresión dentro de una unidad
- Usa como caso concreto **3.º grado, multiplicación y división (3.OA.1–3.OA.9)**: de la primera lección a la última,
  cómo suben los números, los pasos, el texto y la independencia del modelo. Qué debería saber hacer un niño al
  terminar la unidad (con 5 ítems tipo examen final de unidad, originales).
- Lo mismo, más breve, para una unidad central de cada otro grado: 1.º suma/resta hasta 20; 2.º suma/resta hasta 1000
  con valor posicional; 4.º multiplicación de varios dígitos y división; 5.º fracciones (suma/resta con distinto
  denominador); 6.º razones y tasas.

### E. Fluidez (cálculo) sin ansiedad
- Qué se espera de memoria al final de cada grado (p. ej. 2.º: sumas/restas hasta 20; 3.º: tablas hasta 10×10) y cómo
  se practica en las escuelas (estrategias, no solo velocidad). Cuánto de la práctica diaria es fluidez vs. problemas.

### F. Diagnóstico de mi unidad
- Con lo que encontraste, explica por qué los ejemplos de arriba se sienten de preescolar (¿a qué grado y momento del
  año corresponden de verdad?) y qué le falta a una lección de 3.º para sentirse "como en la escuela".
- Propón la **mezcla ideal de una sesión de 15 minutos** en la app (cuántos ítems de cada tipo).

## Diseño para la app (al final)

1. Lista de **componentes de interacción** necesarios para cubrir el 90 % de los arquetipos en tableta (teclado
   numérico, elegir varias, arrastrar a categorías, recta numérica con punto, completar ecuación con huecos, tabla,
   diagrama de barra editable, fracciones, reloj, dinero…), ordenados por cuántos arquetipos desbloquea cada uno.
2. Cómo pedir **explicaciones/razonamiento** sin teclado largo (elegir la justificación correcta, ordenar pasos,
   "¿quién tiene razón?" entre dos niños ficticios, señalar el error en un trabajo resuelto).
3. **Plantillas** para generar variantes automáticas de cada arquetipo: parámetros, rangos, restricciones (p. ej. que el
   residuo no sea cero, que los números no se repitan, que la respuesta sea razonable en el contexto) y qué cambia entre
   inglés y español.
4. Entrega **un ejemplo en JSON** de 3 arquetipos de 3.º (un problema de dos pasos, una comparación multiplicativa
   o división con incógnita en distinto lugar, y un "¿quién tiene razón?") con este formato mínimo:
   `{ id, grade, standards[], archetype, steps, prompt:{en,es}, givenData[], distractorData[], answer, responseMode,
   representation:{type, drawnBy:"app"|"child"|"none"}, hints[3]:{en,es}, misconceptions[], generator:{parameters,
   constraints, answerExpression} }`.

## Formato de entrega

- En español, con los ejemplos de problemas en inglés Y español lado a lado.
- Tablas donde ayuden. Cada sección con sus fuentes (enlace + fecha de consulta).
- Marca claramente qué es dato de una fuente y qué es recomendación tuya.
- Si algo no se puede verificar (p. ej. un ítem real de examen que no es público), dilo; no lo inventes.

=====

## Seguimiento (si la respuesta queda corta en un grado)

> Profundiza solo en **{N}.º grado**: 25 arquetipos con 3 ejemplos originales cada uno (EN/ES), la estructura de un
> examen de unidad y de un "performance task" de Smarter Balanced de ese grado, y los errores comunes con sus
> distractores. Mismo formato y reglas de fuentes y licencias que antes.

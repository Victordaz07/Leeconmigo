# 00 — Project Master

## Qué es Lee Conmigo

Lee Conmigo es una aplicación bilingüe (inglés/español) de lectura guiada
para niños de 1.º a 6.º grado de elementary school, pensada primero para
tablet Android (iPad después). Convierte la lectura en voz alta en una
experiencia interactiva, privada y adaptable: el niño siente que está
leyendo una historia; el sistema, en silencio, escucha si realmente está
leyendo, mide tiempo real de lectura, ayuda con palabras difíciles, revisa
comprensión y protege la privacidad de la voz.

Frase de definición del producto:

> Lee Conmigo es una plataforma bilingüe de lectura guiada para niños de
> primero a sexto grado que convierte la lectura en voz alta en una
> experiencia interactiva, privada y adaptable. La aplicación escucha
> localmente mientras el niño lee, sigue aproximadamente su progreso dentro
> del texto, controla un temporizador basado en lectura real, ayuda con
> pronunciación y vocabulario, introduce actividades de comprensión dentro
> de las historias y adapta progresivamente la profundidad literaria y
> visual según el nivel escolar.

## El problema

Los sistemas de lectura típicos miden "¿cuánto tiempo estuvo abierto el
libro?". Un niño puede abrir la app, dejar correr un temporizador y no leer.
Lee Conmigo mide en cambio "¿cuánto tiempo estuvo realmente participando en
la lectura?". Ese es el principio fundamental del producto.

## Origen / caso de uso real

Construido para Noah (9 años, dificultad con la lectura), hijo de Victor.
Uso familiar en primera instancia; publicación futura para otras familias
es posible pero no es el objetivo de v1 (ver `09-OPEN-DECISIONS.md`).

## Principios esenciales (no son opcionales)

| Área | Decisión |
|---|---|
| Lectura | Principalmente en voz alta |
| Temporizador | Solo avanza durante lectura válida |
| Silencio | Después de ~10 s sin lectura válida, se pausa |
| Reanudación | Requiere ~3 s consecutivos de lectura válida |
| Validación | Voz + correspondencia aproximada con el texto + avance |
| Errores | El niño puede equivocarse sin ser penalizado constantemente |
| Voz | Nunca se almacena ni se envía fuera del dispositivo |
| Procesamiento de voz | Preferiblemente local/on-device |
| Idiomas | Inglés y español, ambos con voz natural (no traducción literal) |
| Contenido | 30 historias maestras × 6 grados × 2 idiomas (360 versiones textuales) |
| Arte | Compartido estratégicamente entre pares de grados (3 familias visuales) |
| Texto | Siempre separado de las imágenes (dos capas) |
| Comprensión | Durante la historia (checkpoints) y al final |
| Motivación | Rachas, logros y progreso visual — sin volverse videojuego |
| Padres | Controlan metas en grados iniciales (1–3); PIN protegido |
| Niños mayores (4–6) | Autonomía creciente |
| Filosofía | Apoyar, no vigilar ni castigar |

## Los 4 verbos del producto

**LEER** (decodificar el texto) → **ESCUCHAR** (el sistema confirma
participación oral) → **COMPRENDER** (preguntas, no solo pronunciación) →
**MEJORAR** (palabras difíciles y vocabulario reaparecen para reforzar).

## Lo que Lee Conmigo NO quiere ser

Una app de vigilancia · un cronómetro glorificado · un lector de PDFs · un
videojuego con libros pegados · una prueba constante · un sistema que
avergüenza al niño por equivocarse · un detector rígido de pronunciación ·
una biblioteca de imágenes con texto incrustado · un producto idéntico de
1.º a 6.º · un sistema que dependa de guardar voces infantiles.

## Personalidad de marca

Cálido, curioso, seguro, inteligente, moderno, divertido, no infantilizado,
motivador sin ser adictivo. Comunica "vamos a descubrir qué pasa", no
"tienes que completar veinte minutos".

## Usuarios

- **Niño** (6–12 años aprox.): necesita lectura guiada, confianza,
  progreso, ayuda con pronunciación, contenido apropiado a su edad,
  motivación, privacidad, autonomía creciente.
- **Padre/madre/tutor**: necesita metas, ver progreso real, comprensión,
  palabras difíciles, configurar idioma/nivel, todo sin escuchar
  grabaciones del niño (porque no existen).

## Norte del proyecto

No existe para obligar a un niño a mirar un libro 20 minutos. Existe para
que esos 20 minutos produzcan lectura real, comprensión, vocabulario,
confianza y deseo de volver — y que el padre sepa que ese tiempo fue
lectura de verdad.

## Regla de decisión para cualquier feature futura

1. ¿Ayuda al niño a leer? 2. ¿Ayuda a comprender? 3. ¿Reduce frustración?
4. ¿Respeta privacidad? 5. ¿Mantiene la lectura como protagonista?
6. ¿Escala entre grados? 7. ¿Escala entre idiomas? 8. ¿Reutiliza contenido?
9. ¿Evita peso innecesario? 10. ¿Se puede mantener técnicamente?

Si la respuesta es no a varias, reconsiderar la característica.

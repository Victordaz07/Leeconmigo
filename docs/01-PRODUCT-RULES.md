# 01 — Product Rules

## Niveles y contenido (guía de extensión aproximada)

| Grado | Palabras | Ilustraciones | Estilo |
|---|---|---|---|
| 1 | 80–150 | 7–10 paneles | Casi cómic, mucho diálogo |
| 2 | 150–250 | 6–8 | Cómic con más texto |
| 3 | 300–500 | 4–6 | Primeros párrafos |
| 4 | 600–900 | 3–4 | Illustrated reader |
| 5 | 900–1,300 | 2–3 | Literary reader con apoyo visual |
| 6 | 1,200–1,800+ | 1–2 | Casi libro tradicional |

Reglas:

- Cada historia conserva personajes, mundo y argumento en los 6 niveles;
  los mismos diseños se reutilizan aunque haya menos imágenes.
- No traducción literal entre inglés y español: cada idioma se adapta a su
  vocabulario y estructura natural. La dificultad no corresponde 1 a 1
  entre idiomas.
- **DECISIÓN:** el nivel de lectura del niño NO depende del grado escolar.
  El padre elige el nivel (ej. Noah puede estar en 4.º grado escolar pero
  leer en nivel 2–3 de la app). Ver también `09-OPEN-DECISIONS.md` sobre la
  tensión con el modelo de "niveles desbloqueables" visto en el prototipo.
- **DECISIÓN:** el control del tiempo de lectura (meta fijada por el padre
  vs. lectura libre/autónoma) es un interruptor independiente del padre,
  no algo atado rígidamente a un nivel. Por defecto: niveles 1–3 con meta
  del padre; niveles 4–6 con lectura libre, pero configurable en ambos
  sentidos.

## Bandas visuales (3 familias, no 6 estilos distintos)

- **Grades 1–2 — Comic Story Learning**: 1–4 paneles, personajes
  expresivos, fondos simples, globos de diálogo, frases cortas, apoyo
  visual constante. Grade 1 y 2 pueden compartir el mismo arte; solo
  cambia el texto (más corto/simple en 1, más desarrollado en 2).
- **Grades 3–4 — Illustrated Reader**: menos paneles, escenas completas,
  más párrafos, vocabulario más rico, checkpoints más complejos. Grade 3
  mantiene más apoyo visual; Grade 4 depende más del texto.
- **Grades 5–6 — Illustrated Novel / Literary Reader**: texto dominante,
  ilustración de apertura + ilustraciones ocasionales, composición
  editorial, tono visual más maduro, inferencias y motivaciones.

## Biblioteca

30 historias maestras × 6 grados × 2 idiomas = 360 versiones textuales.
**No** se producen 360 bibliotecas visuales independientes: el arte se
reutiliza entre niveles cercanos y entre idiomas (misma escena, texto
distinto). Ver `05-DESIGN-SYSTEM.md`.

## Control parental

- PIN de padres obligatorio para entrar al modo padre/progreso.
- Metas diarias por idioma (ej. inglés 15 min, español 10 min). Presets: 5,
  10, 15, 20, 30 min o personalizado.
- El niño no puede marcar nada como completado manualmente; solo el tiempo
  válido de lectura llena la barra de progreso.
- Panel de padres muestra: minutos válidos, historias terminadas,
  frecuencia, evolución, idioma, nivel, checkpoints de comprensión,
  palabras que necesitaron ayuda, palabras dominadas, racha. **Nunca**
  muestra grabaciones (porque no existen) ni transcripciones completas
  innecesarias.
- Mensaje visible para el padre: "La voz de tu hijo nunca se graba ni se
  almacena."

## Corrección de palabras (módulo opcional, ver `03-READING-ENGINE.md`)

- Suave y no bloqueante: nunca detiene la historia ni marca "error" en
  pantalla.
- Solo interviene ante señal clara y repetida (la misma palabra falla o
  genera duda varias veces, o el niño se atasca), no ante cada diferencia
  de pronunciación.
- Preferir el momento de fin de página/escena: "Palabras para practicar"
  (2–3 máximo), con audio de pronunciación correcta y opción de repetir.
- Umbral de confianza alto antes de mostrar cualquier corrección: una
  corrección falsa (decirle "mal" cuando dijo bien) es peor que no
  corregir — el reconocimiento de voz infantil/bilingüe se equivoca.
- El tiempo de práctica de palabras cuenta como tiempo válido (o se separa
  en categoría propia), pero nunca resta.
- El padre ve una lista de palabras difíciles recurrentes, no un puntaje
  de errores.

## Comprensión lectora

- Preguntas en límites naturales de la historia (fin de página/escena),
  nunca a mitad de frase.
- Tipos: personaje principal, tema, mensaje, secuencia, causa/efecto,
  vocabulario en contexto, predicción, inferencia (grados altos), evidencia,
  punto de vista.
- Formato: opción múltiple con imágenes en niveles bajos; respuesta corta o
  de voz en niveles altos.
- Sin castigo: una respuesta incorrecta muestra pista o vuelve al
  fragmento y permite reintentar. Nunca "Incorrecto".
- Panel de padres: % de comprensión por historia y tendencia, presentado
  como progreso, no como calificación — nunca al niño como porcentaje
  constante (ver `06-CHILD-UX-RULES.md`).

## Motivación

- Rachas con "racha protegida" (no se pierde todo por un día de enfermedad
  o un sábado libre).
- Logros que no premian solo velocidad (constancia, curiosidad,
  comprensión, esfuerzo, crecimiento): Primer capítulo, Explorador (5
  historias), Dos idiomas, 15 minutos reales, Regresaste por más (7 días
  distintos), Aventurero (5 categorías), Nueva palabra dominada.
- "Mi Mundo": cada historia terminada desbloquea un elemento visual (árbol,
  casa, barco, faro, castillo...).
- **DECISIÓN DE ALCANCE v1:** rachas + pocos logros. "Mi Mundo" completo
  (visual, construible) va en v2.
- Motivación evoluciona por edad: grados 1–2 más celebraciones/stickers;
  3–4 más colecciones/exploración; 5–6 más estadísticas/autonomía —un
  alumno de 6.º no debe sentir que usa una app de kindergarten.

## Reglas pedagógicas por grado (orientativas, a validar contra currículo real)

Grade 1: decodificación, frases cortas, vocabulario frecuente, secuencia
básica. Grade 2: mayor longitud, causa/efecto simple. Grade 3: inferencias
sencillas, vocabulario contextual. Grade 4: evidencia textual, motivación
de personajes. Grade 5: tema, comparación, punto de vista. Grade 6:
interpretación, análisis, pensamiento crítico.

Pendiente investigar el currículo real de la escuela de Noah (California,
probablemente Common Core ELA) antes de fijar el banco de preguntas
definitivo — ver `09-OPEN-DECISIONS.md`.

# 06 — Child UX Rules

## Principio principal

**La tecnología debe desaparecer detrás de la lectura.** El niño no
necesita ver que el sistema detecta voz, compara palabras, calcula pausas,
analiza comprensión o registra vocabulario. Para el niño: "estoy leyendo
una historia y la app me ayuda cuando lo necesito."

## Nunca / siempre

**Nunca:** mostrar "correcto/incorrecto" · mostrar porcentaje de precisión
de forma constante y visible al niño (sí puede aparecer al final de una
sesión como logro, no como calificación recurrente) · interrumpir cada
error de pronunciación · usar alarmas o rojo de error · convertir cada
página en examen · usar lenguaje técnico ("confidence 0.62", "pausa
detectada") en la UI del niño.

**Siempre:** feedback de acompañamiento y variado según el estado
("Sin prisa", "¿Necesitas una pista?", "Bien, continúa") · ayuda opcional y
accesible con un toque · permitir seguir leyendo tras un error sin
bloquear · dar salida fácil de un checkpoint de comprensión con pista o
reintento, nunca "Incorrecto".

## Estados del lector (deben tener diseño explícito)

Listo · Escuchando · Leyendo · Pausa natural (grace) · Temporizador
pausado · Retomando · Palabra difícil · Checkpoint · Respuesta correcta ·
Respuesta incompleta · Sesión completada · Offline · Micrófono sin permiso
· Reconocimiento no disponible.

## Errores y fallbacks

- Si el reconocimiento falla: no castigar, mantener sesión, mensaje
  discreto, permitir reintento, opción de modo manual temporal, no borrar
  progreso.
- Si no hay internet: usar contenido descargado.
- Si no hay reconocimiento local disponible: mostrar la limitación con
  claridad; **nunca enviar audio a la nube en silencio o sin
  consentimiento explícito**.

## Accesibilidad

Tamaño de fuente ajustable · contraste · espaciado · fuente alternativa ·
lectura por bloques · audio de palabras · touch targets grandes ·
orientación libre (portrait/landscape) sin bloqueo forzado salvo necesidad
real.

## Autonomía por edad

- Grados 1–3: padres controlan metas y nivel; niño solo lee.
- Grados 4–6: el niño elige qué leer, género, duración, idioma; el sistema
  sigue registrando actividad pero el temporizador deja de dominar
  visualmente la experiencia ("Hoy leíste 18 minutos" al final, no un
  contador prominente durante la lectura).

## Uso del micrófono/altavoz/pantalla

- Micrófono: solo activo durante lectura activa, indicador visible
  siempre, se detiene al salir de sesión, nunca guarda audio.
- Altavoz: pronunciación, instrucciones cortas, feedback — no lee toda la
  historia automáticamente salvo modo especial.
- Background: si la app deja de estar en primer plano, se pausa lectura,
  temporizador y micrófono de inmediato; al volver, se recupera contexto y
  se exige lectura válida antes de continuar el tiempo.

## Sesiones con Noah (protocolo de prueba, no producto final)

Sesiones cortas (15–20 min), presentadas como "ayúdame a probar una app",
nunca como examen ni con calificación. Los escenarios de "hablar de otra
cosa" o "ruido de fondo" para pruebas técnicas los hacen los adultos, sin
involucrar a Noah.

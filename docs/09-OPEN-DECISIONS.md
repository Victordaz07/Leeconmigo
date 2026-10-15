# 09 — Open Decisions

Estos puntos NO están resueltos. Claude Code no debe decidirlos en
silencio: implementar detrás de una interfaz/flag y preguntar, o dejar el
comportamiento actual del prototipo marcado como temporal en el código.

## Bloquean diseño/UX

1. **PIN de padres ausente.** Los docs de producto exigen PIN para entrar
   al modo/panel de padres. El prototipo de Reading Session actual permite
   llegar a "Mi progreso" tocando un ícono desde Home, sin fricción. →
   Decidir el mecanismo de PIN antes de construir `Parent Mode` real.
2. **Resaltado por palabra vs. por frase.** La visión original (`vision-y-
   requisitos.md`) pide explícitamente resaltado por frase u opcional,
   evitando palabra por palabra porque un reconocimiento fallido con
   resaltado equivocado confunde a un niño que ya batalla. El prototipo
   implementa resaltado de la palabra actual individual (configurable vía
   prop `highlight`, pero ese es el valor por defecto). → Confirmar si se
   mantiene el resaltado por palabra (más "vivo" mientras el motor de voz
   sea confiable) o se revierte a frase/bloque.
3. **Modelo de niveles: elección del padre vs. desbloqueo por progreso.**
   La visión dice que el padre elige el nivel del niño, independiente del
   grado escolar. El prototipo muestra una pantalla de "Niveles" con
   Nivel 3 y 4 marcados "Bloqueado" (modelo de desbloqueo tipo juego). →
   Elegir uno de los dos modelos, o combinar (padre puede desbloquear
   manualmente, o el niño avanza pero el padre puede saltar niveles).
4. **% de precisión visible al niño.** `06-CHILD-UX-RULES.md` dice que no
   debe mostrarse como calificación constante. El prototipo muestra
   "Precisión: 89%" en la pantalla de fin de historia y en "Mi progreso",
   ambas accesibles directamente por el niño. → Decidir si esa cifra se
   queda solo para audiencia "Lector" (9–12, ya tiene más autonomía/
   estadísticas) o se retira completamente de las vistas del niño y se
   deja solo en el panel de padres con PIN.
5. **2 audiencias (Explorador/Lector) vs. 3 bandas visuales (1-2/3-4/5-6)
   y 6 niveles.** El prototipo simplifica todo el sistema de grados a un
   binario por edad. → Reconciliar antes de escalar contenido: ¿las 2
   audiencias son una capa de tono/UI sobre los 6 niveles reales, o
   reemplazan el modelo de grados para v1?

## Bloquean arquitectura

6. **PWA pura vs. Capacitor+Kotlin.** Existe una preferencia registrada
   por evitar apps nativas y construir esto como web app/PWA. Los
   documentos de arquitectura (`Idea Principal...`, `LEE_CONMIGO_MASTER_
   CONTEXT_v1.md`) deciden explícitamente por Capacitor + capa nativa
   Kotlin, justificado por la fiabilidad del reconocimiento de voz
   continuo. El Prototipo 00 (Whisper en el navegador) es el experimento
   que debe zanjar esto con datos. → **No construir la capa Kotlin de
   audio hasta correr el Prototipo 00.** Si el resultado es bueno en PWA
   pura, `02-ARCHITECTURE.md` debe actualizarse.
7. **Motor de voz final**: Web Speech API nativa del navegador (envía
   audio a servidores de Google, viola la regla de privacidad) vs. Whisper
   on-device (WebAssembly/WebGPU, no probado en la tablet real) vs.
   `SpeechRecognizer.isOnDeviceRecognitionAvailable()` de Android vs.
   modelo propio futuro. → Depende directamente del resultado del
   Prototipo 00.

## Bloquean contenido

8. **Corrección de palabras en v1 o v2.** `01-PRODUCT-RULES.md` describe
   el diseño pero no está decidido si se activa desde el inicio o se prueba
   primero como modo práctica opcional (recomendación existente: probarlo
   primero y medir falsos positivos con Noah).
9. **Si las preguntas de comprensión cuentan como tiempo de lectura, no
   cuentan pero no penalizan, o cuentan aparte en categoría "comprensión".**
10. **Currículo/lista de lecturas real de la escuela de Noah** (California,
    probablemente Common Core ELA) — pendiente de investigar antes de fijar
    el banco de preguntas y el mapeo por estándar.
11. **Nivel de lectura real de Noah e idioma en el que lee mejor** —
    necesario para elegir el contenido del Prototipo 00/01.
12. **Herramienta de ilustración con consistencia por referencia** —
    verificar que la herramienta elegida acepte imágenes de referencia
    (DALL·E 3 solo no las admite); esto condiciona todo el pipeline de
    `05-DESIGN-SYSTEM.md`.
13. **Solo uso familiar vs. publicación futura para otras familias** —
    condiciona si hace falta revisión legal de privacidad infantil
    (COPPA/California) antes de cualquier lanzamiento más amplio.

## Cómo tratar estos puntos en código

- Cada punto que afecta UI (1–5) debe implementarse detrás de una
  configuración/prop explícita (como ya hace el prototipo con `etapa`,
  `highlight`, `bubbles`), nunca hardcodeado a una sola opción sin
  posibilidad de cambiarla.
- Cada punto que afecta el motor de voz (6–7) se resuelve por completo
  detrás de la abstracción `SpeechEngine`/`SpeechProvider` de
  `02-ARCHITECTURE.md`, así que no bloquea el trabajo de UI/Reading Engine
  mientras tanto.

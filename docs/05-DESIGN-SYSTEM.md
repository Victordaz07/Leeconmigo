# 05 — Design System

## Regla fundamental: arte y texto separados

Nunca se "quema" texto permanentemente dentro de una ilustración. Aunque
visualmente parezca un cómic con texto integrado (globos, cajas
narrativas), técnicamente son dos capas:

- **Capa visual**: personajes, fondos, props, paneles, decoración,
  composición.
- **Capa textual**: narración, diálogos, ayudas, resaltado, traducciones,
  pronunciación, preguntas, feedback — siempre texto real de la app, nunca
  imagen.

Razones: permite EN/ES con el mismo arte, Grade 1 y 2 con la misma escena,
cambiar tamaño de fuente, accesibilidad, seguimiento de lectura, resaltado,
correcciones editoriales sin regenerar imágenes, menor peso.

## Bandas visuales (familias, no 6 estilos distintos)

- **Grades 1–2**: formas claras, expresiones fuertes, alto contraste,
  fondos simples, composición tipo cómic, poco ruido visual.
- **Grades 3–4**: ilustración más narrativa, fondos más detallados, menos
  exageración, composición tipo storybook.
- **Grades 5–6**: estilo editorial, menos saturación, iluminación suave,
  personajes naturales, arte de apoyo (no dominante).

> El prototipo de Reading Session actual usa 2 audiencias (Explorador 6–8 /
> Lector 9–12), no estas 3 bandas — ver `09-OPEN-DECISIONS.md` para
> reconciliar antes de escalar a 6 niveles reales.

## Character Bible (por personaje recurrente)

Campos mínimos: Character ID, nombre, edad, altura relativa, complexión,
tono de piel, forma de rostro, ojos, cabello/peinado, ropa principal y
alternativa, accesorios, paleta, rasgos distintivos, proporciones,
personalidad visual, gestos frecuentes, expresiones, poses aprobadas,
elementos que NO pueden cambiar.

Hoja de referencia antes de producir escenas: frontal, 3/4, perfil,
espalda, neutral, feliz, sorprendido, preocupado, pensando, sentado,
caminando, corriendo. Esta hoja es la referencia oficial para cualquier
generación posterior.

**Riesgo técnico documentado**: usar imágenes aprobadas como referencia
visual solo funciona con generadores que acepten imágenes de referencia
(DALL·E 3 por sí solo no las admite). Verificar la herramienta de
ilustración elegida antes de comprometerse a este flujo — pendiente, ver
`09-OPEN-DECISIONS.md`.

## Naming de assets (determinista)

```
char_mateo_base_front, char_mateo_base_3q, char_mateo_happy, char_mateo_worried
bg_forest_day, bg_forest_evening, bg_school_hallway, bg_bedroom_day
prop_blue_box, prop_flashlight, prop_old_map
```

## Style Bible global

Controla: lenguaje de formas, proporciones, iluminación, profundidad,
color, saturación, sombras, grosor de línea, fondos, tratamiento facial,
expresiones, nivel de detalle, composición, tipografía, globos, cajas
narrativas, iconografía. Con variaciones controladas por las 3 bandas.

## Tokens visuales observados en el prototipo aprobado (punto de partida)

- Tipografía de lectura: **Andika** (diseñada para legibilidad infantil/
  alfabetización), pesos 400/700. Tipografía de UI: **Nunito**
  (400–900). Monoespaciada para panel de dev: **JetBrains Mono**.
- Color de texto principal (`INK`): `#1E2340`.
- Superficie de fondo de app: `#F6F7FB` / `#F6F8FE`.
- Acento primario (CTA, mic activo/leyendo): azul `#1E6FE8` → `#4B97FF`
  degradado.
- Éxito / lectura correcta / racha buena: verde `#22A95C` → `#2DB36A`.
- Alerta suave / pausa larga / ayuda disponible: ámbar `#F0A020` /
  naranja `#E8662B`.
- Palabra en foco / ayuda abierta: amarillo `#FFE45C`.
- Tarjetas: fondo blanco, `border-radius` grande (16–30px), sombras suaves
  multicapa (`inset` + `drop`), nunca bordes duros.
- Botones primarios: pill-shaped (`border-radius: 999px`), sombra inferior
  sólida tipo "botón físico" (`box-shadow: 0 Npx 0 #color`), no flat.
- Micrófono central: círculo grande con anillo pulsante (`lcRing`) mientras
  escucha; cambia de color según estado (verde=escuchando, gris=pausa/ayuda,
  ámbar=pausa larga) en vez de mostrar texto de estado técnico.
- Motion: transiciones de 0.2–0.9s, `cubic-bezier` para movimiento de
  "cámara" entre paneles del cómic, `lcPop`/`lcBob`/`lcPulse` para
  celebraciones y llamadas de atención discretas — nunca parpadeos
  agresivos ni rojo de error.

Estos tokens deben promoverse a variables de diseño reales (Tailwind
config / CSS variables) al implementar en `packages/ui`, no quedar como
estilos inline como en el prototipo (que es solo de exploración).

## Reglas para Claude Design (si se vuelve a usar para nuevas pantallas)

Priorizar lectura · evitar interfaces sobrecargadas · tipografía legible ·
adaptar apariencia por edad · controles grandes · feedback discreto · no
mostrar métricas técnicas al niño · diseñar estados de lectura/pausa/ayuda
explícitamente · Parent Mode visualmente separado · texto como UI nunca
como imagen · permitir layouts bilingües · tablet-first landscape y
portrait.

## Componentes visuales esenciales (inventario objetivo)

App Shell · Child Home · Profile Selector · Library · Story Card · Reading
Page · Comic Panel · Narration Box · Speech Bubble · Reading Highlight ·
Word Help Tooltip · Pronunciation Modal · Pause Indicator · Resume
Indicator · Checkpoint Card · Open Voice Response · Session Summary ·
Achievement Card · Reading World · Parent Dashboard (con PIN) · Goal Editor
· Progress Charts · Vocabulary View · Downloads Manager · Settings.

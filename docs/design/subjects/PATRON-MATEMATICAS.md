# El patrón de Matemáticas (para copiar en Ciencia y Sociedad)

Informe de cómo se construyó la materia que ya está hecha, qué funcionó y qué hubo que rehacer. No es una plantilla que se
llena a ciegas: es el camino y los errores a evitar. Estado real de Matemáticas: `docs/design/math-visual/IMPLEMENTACION.md`.

## 1. Lo que salió mal primero (y por qué importa)
Se construyó la unidad piloto de Matemáticas (g3u1) con ejercicios inventados por Claude: tocar números, elegir una
opción. Victor la probó: *"se siente súper raro, demasiado simple, no hay problemas reales como los usan en la escuela,
se siente como de preescolar"*. Se rehízo con una investigación y una especificación de Victor. **Lección: Claude no debe
inventar cómo se enseña una materia; hay que traer cómo se ve en una escuela real.**

## 2. El camino que funcionó (en orden)
| Paso | Qué se hizo en Matemáticas | Dónde quedó |
|---|---|---|
| 1. Investigación | Un prompt para investigar cómo son los problemas reales por grado; el resultado se guardó | `docs/research/PROMPT-INVESTIGACION-*.md`, `matematicas-investigacion.md` |
| 2. Especificación visual | Victor entregó una lámina con 12 representaciones y documentos de implementación (qué se manipula, qué error se nombra, cómo se evalúa) | `docs/design/math-visual/` |
| 3. Imágenes por tandas | Lista de pedido (`PEDIDO-IMAGENES*.md`), manifiesto JSON, Victor generó y mandó; se verificó cada una (sin texto, consistentes) y se pasó a WebP | `docs/design/math-visual/arte/`, `apps/mobile/assets/math/` |
| 4. Contratos y dominio puro | Tipos compartidos y un paquete sin React: unidades en JSON, validador, generador con semilla, dominio y repaso | `contracts/src/math.ts`, `packages/math-content/` |
| 5. Textos ES/EN | Aparte del dominio: el dominio devuelve **claves**, la app las vuelve frases | `packages/ui-core/src/math-*copy*.ts` |
| 6. Escenas y pantallas | Componentes que solo dibujan y avisan qué se tocó; la regla vive en el dominio | `packages/ui-native/src/components/math*/`, `apps/mobile/src/screens/math-*` |
| 7. Verificación | Pruebas del dominio + recorridos en navegador en 4 tamaños (1280×800, 800×1280, 390×844, 844×390) | scripts de Playwright (no están en el repo) |
| 8. Pendiente | Revisión de un maestro; probar en un equipo real | — |

## 3. Piezas que se pueden reutilizar tal cual
- `contracts`: `MathAttempt` y compañía son de Matemáticas, pero **el patrón de intento → dominio → repaso 1-3-7** sirve
  igual. Hoy vive en `packages/math-content` (`mastery.ts`, y el repaso: `updateReviews`, `dueSkills`). Si una materia lo
  necesita, **pídelo a lo compartido** (docs/14): no lo copies a ojo ni lo edites a la carrera.
- Fases de sesión Aprender → Explorar → Practicar → Juego → Cierre (`phaseOf`, `SessionPhases`).
- Modo Enfoque: se reciben apoyos (`focus.reducedMotion`, `movementBreaks`, `roundSize`) como props.
- Pausa de movimiento (`useMovementBreak`) y fondo desenfocado: ya funcionan con solo pasar `focus`.
- `Mila` y el coach: personajes ya aprobados para Matemáticas; cada materia pide su guía (ver `ART-BRIEF.md`).
- Componentes: `Button`, `RoundButton`, `NotebookCover`, `SessionPhases`, `AnswerBoxes`, `DigitPad`, `MovementBreak`.

## 4. Reglas que no cambian (valen para toda materia)
- Nunca "incorrecto" ni rojo (docs/06); el error se nombra por tipo ("contaste las rayitas…") y se ofrece pista.
- Escalera de 3 ayudas: pista → estrategia → ejemplo con **otros** datos. "Ver solución" solo después y vuelve al repaso.
- Texto es UI, nunca imagen. Arte y texto separados; nada de texto dentro del dibujo (docs/05).
- Sin porcentajes ni calificaciones al niño; los padres ven el detalle.
- Todo se puede hacer **tocando** (arrastrar nunca es la única forma, WCAG 2.5.7); zonas táctiles de 44 px o más.
- Mismo problema con la misma semilla en ES y EN; el estado del ejercicio no tiene texto (cambiar de idioma no lo reinicia).
- Estándares solo para padres y como borrador.
- Privacidad: nada de audio ni texto reconocido guardado; sin SDKs de terceros (docs/07, docs/12).
- `FILL_IMAGE` para imágenes que llenan un contenedor (en Android el 100 % no cuenta el relleno del padre).
- Android: probar en navegador no basta; Victor prueba APK solo cuando lo pide.

## 5. Errores concretos que ya pasaron (no repetir)
| Error | Causa | Arreglo |
|---|---|---|
| Imagen tapaba marcas y agujas en la web | La imagen quedaba encima del SVG | Las superposiciones van con posición absoluta (`OVER`) encima |
| Tocar el plano o la recta medía mal | Se medía el toque contra el SVG interno | Una zona tocable por cruce o marca (sin cálculos de posición) |
| En Android el fondo no llenaba la tarjeta | `width: '100%'` no cuenta el relleno del padre | `FILL_IMAGE` (los 4 bordes en 0) |
| Segundo arrastre no arrancaba en la web | La ficha se volvía a montar dentro del gesto | Soltar con `setTimeout(0)` |
| El contexto cambió los números de todas las semillas | La tirada del contexto estaba antes de los números | El contexto sale de la **última** tirada |
| Guardado con `null` rompía al abrir | `JSON.parse('null')` pasaba como válido | Validar la forma; si no es la esperada, empezar limpio |
| Una pausa nunca aparecía en Lectura | "Cuenta el tiempo" y "ya toca" estaban unidos | Separar contar de estar activo |
| Texto con género roto ("cuántos lápices"/"cuántas galletas") | Pegar pedazos de frase | Palabras con género y frases completas por idioma (`math-visual-nouns.ts`) |

## 6. Cómo se prueba una materia
- Dominio: pruebas en `packages/<materia>-content/tests` (misma semilla = mismo ejercicio; invariantes sobre cientos de
  semillas; la solución es correcta y el trabajo inicial no).
- Textos: toda clave que el dominio puede devolver tiene texto en ES y EN, sin huecos ni "incorrecto".
- Pantallas: recorrido en navegador en los 4 tamaños, sin errores de consola. `npm run typecheck` y `npm test`.

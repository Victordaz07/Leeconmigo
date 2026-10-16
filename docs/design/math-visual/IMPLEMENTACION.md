# Matemáticas visuales — qué está implementado (fase 0 y fase 1)

Fuente: `KiteWise_Documentacion_Implementacion_Interactiva.md`, `KiteWise_Prompt_Claude_Graficos.md` y la lámina
`KiteWise_Referencias_Graficas.webp/.svg` (Victor, 2026-10-16). Este archivo dice qué existe de verdad; la lámina muestra
12 familias, **solo 3 están implementadas**.

## Fase 0 — decisiones de integración (dependen del repo)

| Tema de la especificación | Decisión en Kitewise | Por qué |
|---|---|---|
| React + SVG en el navegador | **React Native** (D7). Los objetos que se cuentan son `react-native-svg`; recipientes, celdas y botones son `View`/`Pressable` | Los controles nativos dan foco, nombre accesible y toque de 44 px sin reimplementarlos; las cantidades siguen saliendo del modelo |
| Pointer Events, `getScreenCTM`, `touch-action` | **No aplica todavía**: fase 1 se resuelve tocando (galleta → plato). Arrastrar queda pendiente | WCAG 2.5.7 pide alternativa sin arrastre; se hizo primero la alternativa completa |
| Módulos `math/domain`, `math/templates` | `packages/math-content/src/visual/` (`model.ts`, `templates.ts`, `evaluate.ts`, `exercise.ts`) | El contenido de Matemáticas ya vive en ese paquete, puro y probado |
| `math/i18n` | `packages/ui-core/src/math-visual-copy.ts` | Textos compartidos y separados del algoritmo (el dominio devuelve claves) |
| Escenas | `packages/ui-native/src/components/math-visual/` (`TenFrameBoard`, `GardenPlots`, `SharingBoard`, `AnswerBoxes`, `DigitPad`) | ui-native no conoce las reglas: solo dibuja y avisa qué se tocó |
| `ExerciseShell` | `apps/mobile/src/screens/math-visual/visual-exercise.tsx` | |
| Galería de revisión | DEV → "Matemáticas visuales" (`review-screen.tsx`), con otra variante y ES/EN | Nunca se muestra al niño (ids y semillas) |
| Persistencia | En memoria (`mathProgressFor`), igual que el resto del progreso, hasta RN-08 | No hay almacenamiento local todavía en la app nueva |
| Backend / API / eventos de analítica | **No se construye** | v1 sin nube (CLAUDE.md, D8, docs/12: sin SDKs ni envío de datos) |
| Paleta de objetos | `manip` en `objects.tsx` (crema, tinta, azul, coral, verde, amarillo, violeta de la lámina) | Solo para objetos; el texto y los controles siguen con los tokens de Kitewise |
| Imágenes | Arte aprobado en `apps/mobile/assets/math/` (WebP). La app lo entrega con `MathArtProvider` (`src/math-art.ts`); ui-native no empaqueta imágenes y, si falta una pieza, usa la forma dibujada con código | Las cantidades nunca dependen de una imagen |

## Fase 1 — implementado

| Familia | Plantillas (grado orientativo) | Acción del niño | Evaluación |
|---|---|---|---|
| Bandejas de 10/20 | `tenFrame.complete10` (1–2), `tenFrame.reach20` (1–2, cruza la decena) | Tocar casillas; las semillas del enunciado están fijas; escribir cuántas agregó | Cantidad final y cantidad agregada |
| Grupos iguales | `groups.build` (2–3), `groups.read` (3) | Plantar con + / −; o leer el huerto y escribir parcelas, cada una y total | Cada grupo igual al pedido, y el total; en "leer", grupos y tamaño por separado |
| Reparto | `sharing.partitive` (3–4), `sharing.quotative` (3–4), `sharing.remainder` (4) | Tocar galleta → plato/bolsa (o la bandeja para devolverla); escribir el resultado y lo que sobra | Inventario (cada galleta en un solo lugar), igualdad, "aún alcanza para una más", bolsas exactas, residuo |

Comportamiento común (`exercise.ts`): fases trabajando / revisando / resuelto / solución vista; deshacer y empezar de
nuevo no borran ayudas; cualquier cambio retira el veredicto anterior; "Ver solución" aparece tras la 3.ª ayuda o dos
intentos por revisar y manda la habilidad al repaso (no cuenta como fallo); 3 ayudas: dónde mirar → estrategia → ejemplo
con OTROS números. Un estado imposible es `invalid` y nunca se cuenta como error del niño.

Dónde lo ve el niño: Cuaderno de Matemáticas → **Taller** (6 ejercicios del grado de la unidad, alternando tipos). Cada
ejercicio terminado se guarda como intento para dominio y repaso.

## Comprobado

- Con el arte puesto: semillas, brotes, galletas, platos, bolsas y parcelas son las imágenes de Victor; fondos semillero
  / huerto / merienda detrás de cada familia (vertical en teléfono vertical). Recorrido completo en 4 tamaños sin errores.

- `packages/math-content/tests/visual.test.ts`: misma semilla = mismo problema; 300 semillas por plantilla sin modelos
  imposibles; la solución de cada instancia es correcta y el trabajo inicial no; casos de aceptación del reparto (4,4,4 ·
  5,4,3 · 3,3,3 con 3 en la bandeja · galleta de más / ausente / plato inexistente); residuo; bolsa de más; fichas fijas;
  ayudas que sobreviven a deshacer; evidencia independiente vs. solución vista.
- `apps/mobile/tests/math-visual-copy.test.ts`: cada mensaje que el evaluador puede devolver existe en ES y EN, sin
  huecos ni la palabra "incorrecto".
- Navegador (Playwright): el Taller completo resuelto tocando, en 1280×800, 800×1280, 390×844 y 844×390, sin errores.

## Pendiente (no declarar hecho)

- Las otras 9 familias: valor posicional, recta numérica, fracciones, modelo de barras, área/perímetro, reloj, datos,
  coordenadas, razones (fases 2–3).
- Arrastrar (además de tocar) y manejo por teclado físico.
- Modo Enfoque y movimiento reducido en estas escenas (hoy no hay animaciones; falta ocultar decoración cuando llegue).
- Mila, portadas y papalote ya están en uso (pedido 2). Los fondos de prioridad B (camino, mosaico, jardín, mapa, feria,
  laboratorio) y frutas/reloj ya están en el repo para las fases 2–3, sin usar todavía.
- Modo Enfoque: `VisualExercise` tiene `decor` (fondo ilustrado) listo para que K7 lo apague.
- Guardar en el equipo (RN-08) y recuperar un ejercicio a medias.
- Problemas verbales de varios pasos y contexto real: la investigación pendiente
  (`docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md`) decide cuáles; estas escenas son la base para dibujarlos.
- Revisión docente de rangos y textos; pilotaje con Noah.

# Matemáticas visuales — qué está implementado (fase 0 y fase 1)

Fuente: `KiteWise_Documentacion_Implementacion_Interactiva.md`, `KiteWise_Prompt_Claude_Graficos.md` y la lámina
`KiteWise_Referencias_Graficas.webp/.svg` (Victor, 2026-10-16). Este archivo dice qué existe de verdad; la lámina muestra
12 familias, **solo 3 están implementadas**.

## Fase 0 — decisiones de integración (dependen del repo)

| Tema de la especificación | Decisión en Kitewise | Por qué |
|---|---|---|
| React + SVG en el navegador | **React Native** (D7). Los objetos que se cuentan son `react-native-svg`; recipientes, celdas y botones son `View`/`Pressable` | Los controles nativos dan foco, nombre accesible y toque de 44 px sin reimplementarlos; las cantidades siguen saliendo del modelo |
| Pointer Events, `getScreenCTM`, `touch-action` | Todo se resuelve tocando; el **reparto además se arrastra** (`PanResponder` + `measureInWindow` de cada recipiente; suelta donde está el dedo, fuera de todo vuelve) | WCAG 2.5.7: arrastrar nunca es la única forma |
| Módulos `math/domain`, `math/templates` | `packages/math-content/src/visual/` (`model.ts`, `templates.ts`, `evaluate.ts`, `exercise.ts`) | El contenido de Matemáticas ya vive en ese paquete, puro y probado |
| `math/i18n` | `packages/ui-core/src/math-visual-copy.ts` | Textos compartidos y separados del algoritmo (el dominio devuelve claves) |
| Escenas | `packages/ui-native/src/components/math-visual/` (`TenFrameBoard`, `GardenPlots`, `SharingBoard`, `AnswerBoxes`, `DigitPad`) | ui-native no conoce las reglas: solo dibuja y avisa qué se tocó |
| `ExerciseShell` | `apps/mobile/src/screens/math-visual/visual-exercise.tsx` | |
| Galería de revisión | DEV → "Matemáticas visuales" (`review-screen.tsx`), con otra variante y ES/EN | Nunca se muestra al niño (ids y semillas) |
| Persistencia | En el equipo (RN-08, `apps/mobile/src/persist/`) | Sin nube (v1) |
| Backend / API / eventos de analítica | **No se construye** | v1 sin nube (CLAUDE.md, D8, docs/12: sin SDKs ni envío de datos) |
| Paleta de objetos | `manip` en `objects.tsx` (crema, tinta, azul, coral, verde, amarillo, violeta de la lámina) | Solo para objetos; el texto y los controles siguen con los tokens de Kitewise |
| Imágenes | Arte aprobado en `apps/mobile/assets/math/` (WebP). La app lo entrega con `MathArtProvider` (`src/math-art.ts`); ui-native no empaqueta imágenes y, si falta una pieza, usa la forma dibujada con código | Las cantidades nunca dependen de una imagen |

## Familias implementadas (las 12 de la lámina)

Dominio en `packages/math-content/src/visual/` (fase 1 en `evaluate.ts`; el resto, un archivo por familia en
`families/` con el contrato `FamilyDef`). Textos en `ui-core/math-visual-copy.ts` y `math-visual-copy-2.ts`. Dibujos en
`ui-native/components/math-visual/scenes.tsx` y `scenes-2.tsx`. Pantalla en `apps/mobile/src/screens/math-visual/`.

| Familia | Plantillas (grado orientativo) | Acción del niño | Errores típicos que se nombran |
|---|---|---|---|
| A. Bandejas 10/20 | complete10, reach20 (1–2) | tocar casillas; escribir cuántas agregó | contar también las del principio |
| D. Grupos iguales | groups.build (2–3), groups.read (3) | plantar con + / −; leer grupos, cada uno y total | grupos desiguales; contar plantas en vez de parcelas |
| E. Reparto | partitive, quotative (3–4), remainder (4) | galleta → plato/bolsa | platos desiguales; "aún alcanza para una más"; bolsas incompletas |
| B. Valor posicional | build2 (1–2), standard3 (2–3), readRegroup (2–3) | poner/quitar piezas, juntar 10, desarmar 1 | forma no usual cuando se pide la usual; leer sin reagrupar |
| C. Recta numérica | add20 (1–2), add100, subtract100 (2–3), fraction (3–4) | saltos ±1/±10 (quedan dibujados); tocar una marca | pasarse / quedarse corto; contar marcas en vez de espacios |
| F. Fracciones | color (3), name (3–4), equivalent (3–4) | colorear partes (tira, pizza o pastel) | cuál número va arriba/abajo; "no cubre lo mismo" |
| G. Barras | partWhole20/100/1000, compare20/100 (1–3), times (3–4) | escribir en la parte "?" | usar la operación contraria |
| H. Área y perímetro | cover (3), perimeter (3–4), missingSide (4) | poner losetas; escribir | dar el área como perímetro; sumar solo 2 lados |
| I. Reloj | setHalf (1), setFive, readFive (2–3), elapsed (3–4) | ±1 h, ±5/30 min; escribir hora y minutos | aguja de la hora tras la media |
| J. Gráficas | build, difference (2–3), scaled, total (3–4) | subir/bajar barras; leer | contar rayitas con escala de 2 |
| K. Plano | plot, read (5–6) | tocar un cruce; escribir (x, y) | par al revés |
| L. Razones | scale (5–6) | lotes completos | sumar lo mismo a las dos partes |

37 plantillas; hay ejercicios para cada grado de 1.º a 6.º.

### Dónde lo ve el niño
- **Taller** (Cuaderno de Matemáticas → Taller): elige grado (el sugerido es su nivel, con ⭐; todo abre, docs/13) y un
  tema, o la "Mezcla del día" (6 ejercicios de temas distintos).
- **Lecciones de g3u1**: cada lección agrega sus ejercicios manipulables al final de Practicar (`LESSON_VISUALS` en
  `session.ts`): grupos y reparto, leer grupos, área como arreglo, comparación "veces" con barras y bolsas.

### Decisiones al implementar
- Tocar en vez de medir: cada cruce del plano y cada marca de la recta es una zona tocable con su nombre ("(3, 2)",
  "3/4"). Medir la posición del toque fallaba en la web y no es accesible.
- El arte va detrás de lo que se mide: las rebanadas de la pizza, los cortes del pastel, las marcas y agujas del reloj
  las dibuja el código encima de la imagen.
- Las ayudas visuales se titulan "Pista / Estrategia / Ejemplo con otros números".
- **Contextos** (versión 2 de `groups.*` y `sharing.*`): el reparto puede ser galletas (platos o bolsas), lápices en
  cajas, canicas en frascos o manzanas en canastas; los grupos iguales, plantas en parcelas, manzanas en canastas o
  canicas en frascos. El modelo guarda solo la clave (`theme`); las palabras, con su género («cada caja» / «cada
  frasco», «cuántos lápices»), están en `ui-core/math-visual-nouns.ts`. El contexto sale de la última tirada: los
  números de cada semilla son los mismos que en la versión 1 (hay prueba). Las demás familias conservan su objeto.

## Comprobado

- Dominio: invariantes de las 37 plantillas (300 semillas), la solución de cada una es correcta y el trabajo inicial no;
  casos: intercambio de decenas, 6/8 = 3/4, reloj 2:30 (180° y 75°), tiempo que cruza la hora, perímetro ≠ área, par
  al revés, razón aditiva, operación contraria en barras, escala de 2.
- Textos: toda clave de mensaje del dominio tiene texto en ES y EN.
- Navegador (Playwright), en 1280×800, 800×1280, 390×844 y 844×390: las 37 plantillas con 3 pistas y "Ver solución"
  (3 variantes cada una); resolver tocando reloj, plano, recta (saltos y tocar), pizza, pastel y decenas; Taller por
  tema; lección 1 completa con sus ejercicios visuales. Sin errores.

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

- Arrastrar en las demás familias (hoy solo el reparto) y teclado físico.
- Modo Enfoque: hecho lo de Matemáticas (K7a): fondo desenfocado y tenue, sin Mila, rondas cortas en el Taller.
- Unidades de otros grados con lecciones propias (hoy solo g3u1 tiene lecciones; los demás grados practican en el Taller).
- Revisión docente de rangos, textos y estándares; pilotaje con Noah. Probar en un equipo real.

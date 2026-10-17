# Bitácora — Ciencia

Se agrega al final, una entrada por sesión (formato corto, como `docs/log/SESSION_LOG.md`). Solo la cuenta de Ciencia.

## 2026-10-16 · Preparación (PREP-1)
- Módulo `subjects/ciencia` registrado ("Pronto"), paquete de contenido vacío, guardado por materia, índices reservados.
  Protocolo en `docs/14-MATERIAS-EN-PARALELO.md`. Siguiente: `docs/handoff/ciencia.md`.

## 2026-10-16 · CI-02: se analiza y adapta la investigación de Ciencias
- Victor entregó `KiteWise_Investigacion_Ciencias_1_a_6.md` ("analízalo y adáptalo, que quede impecable"). Se guardó sin
  cambios en `docs/research/ciencia-investigacion.md`.
- Hecho: especificación adaptada (`docs/design/ciencia/ESPECIFICACION.md`), mapa de las 48 unidades **como datos** con
  títulos y preguntas en ES/EN (`packages/science-content/content/mapa.json` + `map.ts` + 8 pruebas), `MAPA-UNIDADES.md` y
  `ESTANDARES.md` generados, pedido de imágenes como prompts (`PEDIDO-IMAGENES.md`).
- Verificado: las 62 expectativas NGSS de 1.º–5.º quedan cubiertas, sin códigos inventados; aritmética de las lecciones.
  **No verificado:** las 23 fuentes del informe (no las abrí) ni los códigos contra el sitio; un docente debe validarlos.
- Choques con el repo, resueltos y propuestos como DC-n: la paleta salvia viene de una guía que no está en el repo
  (Ciencia ya es `#22a95c`); el dominio de Matemáticas (10 intentos) no sirve con 8 tareas por unidad → política propia
  `scienceEvidence.v1`; «avanzar» nunca bloquea (D9); sin sincronización, PhET, voz ni dibujo libre en v1; actividades
  fuera de pantalla las enciende el padre; Maya como guía (ya tiene arte).
- Siguiente: Victor confirma DC-1…DC-8 y genera las imágenes de la Tanda 1; luego CI-03 (unidad piloto C4-U06).

## 2026-10-16 · Arte de la Tanda 1 (unidad C4-U06)
- Victor mandó `KiteWise_Ciencias_Unidad_1_18_Imagenes.zip` (18 PNG). Revisadas una por una: sin texto ni números;
  instrumentos sin marcas (el vaso sin rayitas); centro despejado en los fondos; objetos y poses con transparencia limpia
  (el «opaco» de GPT venía como alfa 253 y se normaliza); Maya idéntica en las 5 poses y fiel a la referencia aprobada.
- Hecho: `scripts/ciencia-arte.py` (reproducible: sirve para la Tanda 2), WebP en `apps/mobile/assets/ciencia/` (1,4 MB),
  manifiesto con SHA-256 en `docs/design/ciencia/arte/manifest-tanda-1.json`, `subjects/ciencia/art.ts`, prueba de que
  cada archivo existe y pesa < 350 KB, portada del cuaderno en `homeCard`.
- Observación: el estilo es de cuento (acuarela), no plano como Matemáticas; coincide con el brief y con Lectura. En Inicio la
  portada de Ciencia se ve bien junto a las otras dos (tablet y teléfono, sin errores).

## 2026-10-16 · CI-03: especificación de la unidad C4-U06
- Victor confirmó DC-1…DC-8 («déjalas así») → D13 en `docs/DECISIONS.md`.
- Hecho: `docs/design/ciencia/unidades/C4-U06.md`: ideas con sus errores, glosario ES/EN, modelo determinista de erosión
  (fórmula, desvíos por bandeja, casos límite, qué NO representa), datos didácticos, 6 sesiones con texto ES/EN por paso,
  banco de 8 tareas (cada expectativa tiene tareas que exigen su práctica) con rúbrica y pistas en 3 escalones,
  `scienceEvidence.v1` aplicado, ficha de seguridad de la actividad con adulto, accesibilidad, tono (sismos), criterios de
  publicación y preguntas para el docente.
- Hallazgo: 4-ESS2-2 (mapas) pide analizar mapas, no solo erosión → S5 con dos mapas de práctica dibujados por la app (sin
  imágenes nuevas). El orden de los desvíos de la bandeja A/B se corrigió al comprobar los números contra el modelo.

## 2026-10-16 · CI-04: dominio puro de C4-U06
- Hecho (todo con pruebas, sin pantallas): modelo de erosión que reproduce al gramo los datos de la especificación;
  conjuntos de datos generados por el modelo y dos mapas de práctica con validador (≥ 80 % de sismos en la franja y al menos
  uno fuera); `scienceEvidence.v1` (dos contextos + una sin pista explicativa; repaso 1-3-7 solo con caso nuevo; las ayudas de
  acceso no restan; «lo veo luego» no cuenta); la unidad como JSON validado (6 sesiones, 8 tareas, 4 ideas, glosario, ficha de
  seguridad) y un evaluador genérico de tareas por partes.
- Garantías que prueban las pruebas: cada respuesta válida pasa; cada distractor se rechaza con su motivo en ES/EN; las dos
  explicaciones válidas de T5 y los dos arreglos de T7 se aceptan; «todos» en T6 se rechaza pidiendo contar los puntos fuera;
  los números que citan los textos (18/20/19, «13 de 15»…) coinciden con los datos; ningún texto dice «incorrecto».
- 1250 pruebas en todo el repo, typecheck limpio.

## 2026-10-16 · CI-05/06/07: C4-U06 jugable
- Pedido de Victor: «termina el módulo completo para que ya se pueda visualizar y probar».
- Hecho: textos de la interfaz ES/EN, tipos y validador de los pasos de la unidad, progreso guardado por niño, siete
  componentes nuevos (bandejas, báscula, tabla, gráfica, mapa, escena tocable, opciones), cuaderno de la unidad y reproductor
  de sesión (24 pasos), con Modo Enfoque y «guardar y seguir después».
- Decisión de contenido: los dos arreglos válidos de la prueba (igualar inclinación o igualar pasto) llevan cada uno a su
  evidencia final con los datos que corresponden (`choiceByFix`), comprobados contra el modelo.
- Hallazgo técnico: en la versión web `locationX/Y` no existe en un toque → `tapPosition` calcula la posición con la página.
- Verificado en el navegador en 4 tamaños + Modo Enfoque; `available: true`. Sin APK (Victor lo pide cuando quiera).

## 2026-10-16 · CI-09/10/11: Tanda 2, reproductor por familias, C1-U02
- Victor pidió empezar las 5 unidades piloto restantes y el prompt de imágenes. Se escribió el pedido (41 imágenes, 5 lotes).
- El reproductor de sesión se reorganizó en familias de laboratorio (sin cambiar el comportamiento de C4-U06: el recorrido
  completo y las pruebas de comportamiento volvieron a pasar). Catálogo de las 48 unidades con «Pronto».
- C1-U02 completa en contenido y pantallas; el arte es provisional hasta el Lote A. 12 pruebas nuevas de la unidad + 3 del catálogo.
- Decisión de diseño: dos ideas (`luz.ver`, `objeto.sigue`) en tres casos (osito, pelota, «armario» = taza) en vez de la idea de
  «cambiar una sola cosa», que no es de 1.º (1-PS4-2 pide ver que un objeto solo se ve con luz).

## 2026-10-16 · CI-11b: Lote A recibido
- Se revisaron las 7 imágenes (sin texto, alfa limpio, caja ancha con interior liso), se convirtieron y se conectaron; se ajustó el
  interior de la caja y C1-U02 quedó abierta (`UNIT_ART_READY=true`). Prueba de arte: un manifiesto por lote.

## 2026-10-16 · CI-12: C2-U02 en contenido y pantallas
- Mientras Victor genera los lotes B–E, se construyó C2-U02 con arte provisional. Decisión de diseño: dos pruebas con el MISMO
  material (techo y secar) para que el niño vea que el mejor material depende del propósito (idea central de 2-PS1-2).
- Recorrido completo en el navegador (6 sesiones) sin errores. La comparación predicción/observado ahora se prueba con la respuesta
  honesta (si no coincide, se dice «no coincidió»).

## 2026-10-17 · CI-12b: Tanda 2 completa
- Llegaron los lotes B–E (34 imágenes). Revisadas, convertidas (240 + ~1,3 MB) y conectadas; C2-U02 abierta con arte real. El arte de
  C6, C3 y C5 queda listo para cuando se construyan esas unidades.

## 2026-10-17 · CI-13: C6-U04 «Energía térmica»
- Modelo térmico determinista que reproduce los datos del informe; unidad con 3 ideas y 3 estándares MS-PS3 (≥ 3 tareas cada uno).
- Nuevos componentes: gráfica de líneas trazable y banco de la funda; recorrido completo en tableta y teléfono sin errores.

## 2026-10-17 · CI-14: C3-U06 «Interacciones sin tocar»
- Modelo del imán (alcances didácticos), unidad con 3 ideas y los dos estándares 3-PS2 (≥ 3 tareas cada uno), mesa del imán con 5 marcas.
- Decisión: la electricidad estática queda fuera de esta versión (se documenta como pendiente) para no mezclar dos fuerzas en una unidad de 3.º.

## 2026-10-17 · CI-15: C5-U02 «Cantidad y propiedades» (sexta y última unidad piloto)
- Modelo de masa en frasco cerrado + propiedades de cuatro polvos y una muestra misteriosa; dos ideas, dos estándares 5-PS1 con ≥ 3 tareas cada uno.
- Decisión: sin densidad ni volumen; el color solo no identifica la muestra X (se combinan «en agua» y «con la lupa»). El hielo derretido es la transferencia de 5-PS1-2.
- Arte de Lote E conectado (frasco, balanza con pantalla en blanco, 4 muestras). Resultado: C1, C2, C3, C4, C5 y C6 jugables.

## 2026-10-17 · CI-16: C5-U03 «Mezclas bajo investigación»
- Primera unidad del catálogo fuera de los pilotos, elegida porque reutiliza la familia `matter` y el arte del Lote E (cero imágenes nuevas).
- Decisión: la sustancia nueva se decide con dos pruebas juntas (burbujas + no recuperar); mezclas siempre abiertas y en poca cantidad.

## 2026-10-17 · CI-17: C4-U02 «Energía en movimiento» (arte provisional)
- Modelo de la rampa con una sola variable (altura), unidad con 2 ideas y los dos estándares 4-PS3 con ≥ 3 tareas cada uno; verificada en tableta con arte dibujado con código.
- Pendiente: arte real del lote I y retoque de las posiciones de la rampa.

## 2026-10-17 · CI-18: C3-U05 «Fuerzas y movimiento» (arte provisional)
- Fuerzas como empujones contados (equilibrados → no cambia el movimiento) y péndulo para el patrón; dos ideas, 3-PS2-1 (4 tareas) y 3-PS2-2 (3 tareas). Verificada en tableta.
- Pendiente: arte real del lote H y revisar el giro del péndulo con la barra de la imagen real.

## 2026-10-17 · CI-19: C1-U03 «Caminos de luz» (arte provisional)
- Cuatro materiales con cuatro resultados distintos (toda / un poco / no pasa / rebota), dos ideas y 1-PS4-3 con 7 tareas; textos cortos para 1.º. Verificada en tableta.

## 2026-10-17 · Tanda 3 recibida (lotes F–J)
- 28 imágenes revisadas, convertidas y conectadas; abiertas C1-U03, C2-U01, C3-U05 y C4-U02. Retocados los bancos de la rampa, el carrito y el péndulo con el arte real.

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

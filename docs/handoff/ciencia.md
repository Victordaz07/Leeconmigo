# HANDOFF — Ciencia
Actualizado: 2026-10-16 · Cuenta: A · Rama: la de tu sesión (reiníciala desde `master` si su PR ya se fusionó) · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Ciencia**; la otra cuenta trabaja **Sociedad** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
- CI-01 ✅ Victor entregó la investigación (`docs/research/ciencia-investigacion.md`, copia sin cambios).
- CI-02 ✅ Se analizó y adaptó al repo (`docs/design/ciencia/`):
  - `ESPECIFICACION.md`: veredicto, lectura crítica (qué se verificó y qué no), arquitectura, experiencia, datos,
    laboratorios, evaluación, seguridad, visual, plan y **decisiones DC-1…DC-8 para Victor**.
  - `MAPA-UNIDADES.md` y `ESTANDARES.md`: **generados** por `python3 scripts/ciencia-mapa-md.py` desde el JSON.
  - `PEDIDO-IMAGENES.md`: prompts listos para pegar (Tanda 1 = C4-U06; Tanda 2 = otras cinco pilotos).
  - Código: `packages/science-content/content/mapa.json` (48 unidades, ES/EN, códigos, laboratorios) + `src/map.ts`
    (tipos, consultas, validador) + 8 pruebas, entre ellas **cobertura de las 62 expectativas NGSS de 1.º–5.º**.
- **Arte Tanda 1 ✅ (18 de 18)**: Victor mandó las imágenes; se revisaron (sin texto, instrumentos sin marcas, centro
  despejado, transparencias limpias, Maya consistente) y se convirtieron a WebP en `apps/mobile/assets/ciencia/` con
  `scripts/ciencia-arte.py`. Conectadas en `apps/mobile/src/subjects/ciencia/art.ts` (fondos laboratorio/humedal ×
  horizontal/vertical, escena de la ladera, portadas, 6 props, 5 poses de Maya) con prueba de que cada archivo existe.
  La portada del cuaderno ya está en `homeCard` (verificada en Inicio, tablet y teléfono).
- La materia sigue "Pronto" en Inicio (`available: false`): no hay unidad jugable.

## Decisiones: CONFIRMADAS (D13, 2026-10-16)
Victor: «déjalas así, está bien». DC-1…DC-8 ya están en `docs/DECISIONS.md` (D13). No se re-discuten.

## Siguiente paso exacto
**CI-03 ✅ hecho:** `docs/design/ciencia/unidades/C4-U06.md` (ideas, 6 sesiones con texto ES/EN, modelo de erosión,
datos didácticos, 8 tareas con rúbrica y pistas, ficha de seguridad, criterios de publicación).
**CI-04 ✅ hecho** (dominio puro de C4-U06, sin pantallas): `labs/erosion.ts` (modelo determinista, §3), `datasets.ts` (§4,
con validador de mapas), `evidence.ts` (`scienceEvidence.v1`), unidad en JSON validado y pruebas. Los números de §3/§4 ya
están calculados a mano: las pruebas deben dar EXACTAMENTE esos valores (18/20/19 · 6/7/5 · 28/30/29 · 4/5/3 …).

(Antes de CI-03 decía:)
**Esperar a Victor:** que confirme (o cambie) **DC-1…DC-8** (`ESPECIFICACION.md` §13). Las imágenes de la Tanda 1 ya llegaron.
Con eso, **CI-03**: especificación detallada de la unidad piloto recomendada **C4-U06**
(6 sesiones, 8 tareas del banco —2 observación, 2 predicción, 2 evidencia/modelo, 1 transferencia, 1 reflexión—,
glosario ES/EN, supuestos y casos límite del modelo de erosión, ficha de seguridad, datos didácticos con `provenance`).
Se puede adelantar sin riesgo: el esquema TS de unidad/sesión/tarea/`LabModel`/`Dataset` (boceto en §5) detrás de
pruebas, sin contenido final.
Cómo probar lo hecho: `npx vitest run packages/science-content`.

## Checklist
- [x] CI-01 Investigación
- [x] CI-02 Análisis y adaptación (spec, mapa, estándares, pedido de imágenes)
- [x] Arte Tanda 1 recibido y conectado
- [ ] CI-03 Especificación de la unidad piloto ← AQUÍ ME QUEDÉ (esperando DC-1…DC-8 de Victor)
- [ ] CI-04 Dominio puro: unidades, tareas, `LabModel` de Paisaje y erosión, `scienceEvidence.v1`, pruebas
- [ ] CI-05 Textos ES/EN en `packages/ui-core/src/ciencia/`
- [ ] CI-06 Pantallas del cuaderno en `subjects/ciencia/` (con Modo Enfoque: `focus`)
- [ ] CI-07 Verificar en 4 tamaños, `available: true`
- [ ] CI-08 Revisión de un maestro (estándares: borrador)

## Cuidado con
- **No se programa una unidad antes de CI-03** (lección de Matemáticas).
- Los códigos NGSS son BORRADOR y solo para padres. Citar un código no acredita cumplimiento.
- Nunca datos reales inventados ni atribuidos a NASA/NOAA/USGS: todo dato es `didactic` y se dice. Sin PhET ni terceros.
- Sin voz, foto, dibujo libre ni escritura libre en v1 (DC-8). Nunca "incorrecto" ni rojo.
- Arte: la Tanda 2 se procesa con `python3 -I scripts/ciencia-arte.py <carpeta> tanda-2` (mismos nombres) y se agrega a `art.ts`. Los PNG originales no se guardan en el repo.
- El mapa es la fuente de verdad: si lo cambias, regenera los `.md` y corre las pruebas.
- Lo compartido no se edita a la carrera (docs/14). No hay APK hasta que Victor lo pida.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
Resumen (detalle y alternativas en `ESPECIFICACION.md` §13):
- **DC-1** nivel ≠ grado, todo abre · **DC-2** 6.º = modelo integrado de California · **DC-3** sesión ≈ 15 min, con energía
  baja se guarda y retoma · **DC-4** guía = Maya · **DC-5** primera unidad = C4-U06 · **DC-6** tokens Kitewise, no la paleta
  salvia · **DC-7** «revisó su idea» cuenta como esfuerzo · **DC-8** v1 estructurada, sin voz ni respuesta libre.

## Pedidos a lo compartido
- Reutilizar de Matemáticas (hoy en `ui-native/components/math`): `BarChartBoard`, `HintLadder`, `ConfidencePicker`,
  `AnswerBoxes`, `exerciseReducer` y el repaso 1-3-7 de `math-content`. Hace falta que alguien los exponga sin copiarlos
  (candidato: pasarlos a un paquete común). **Decide Victor quién** (docs/14).
- Un tipo común `Mastery` por materia (hoy vive en `math-content`).
- `Localized` ya está en `contracts` y se usa tal cual.

## Estado de pruebas
`npm test` y `npm run typecheck` en verde al cerrar CI-02 (incluye las 8 pruebas del mapa de Ciencia).

## Actualización CI-04 (2026-10-16): dominio de C4-U06 hecho
Todo en `packages/science-content` (56 archivos / 1250 pruebas en verde en todo el repo):
- `labs/erosion.ts` — modelo determinista (`sedimentGrams`, `runTrials`, `turbidity`, `fairTest`, `EROSION_MODEL`). Reproduce
  EXACTAMENTE los datos de la especificación (18/20/19 · 6/7/5 · 28/30/29 · 4/5/3 · 9/10/8 · 29/30/28).
- `datasets.ts` — `LADERA_DATASETS` (salen del modelo, nunca a mano), `PRACTICE_MAPS` A y B, `provenanceLabel`, `bandCount`,
  `zoneOf`, `quakesByZone`, `practiceMapProblems`. Todo dato es `didactic` y lleva su rótulo.
- `evidence.ts` — `scienceEvidence.v1`: `ideaStatus`, `reviewsDue` (1-3-7 con caso nuevo), `statusByIdea`, `STAGE_LABEL`.
- `unit.ts` + `content/c4-u06.json` — la unidad (6 sesiones / 24 pasos con ES/EN, 4 ideas, glosario, ficha de seguridad, 8
  tareas con opciones, `whyNot` por distractor y 3 pistas), `evaluateTask`, `evaluatePart`, `predictionMatched`,
  `comparisonAdequate`, `unitProblems`, `dataTextProblems`.

**Siguiente: CI-05** — textos de la INTERFAZ en `packages/ui-core/src/ciencia/` (no los de la unidad, que ya están en el
JSON): rótulos de píldoras (Observa · Explora · Explica · Usa), distintivos de procedencia, marcos de frase («Observé… /
I observed…», «Mi evidencia es…», «Cambié mi idea porque…»), botones (Regar, Anotar, Arreglar la prueba, Listo), etiquetas
de estado (`STAGE_LABEL` ya existe), accesibilidad (descripción de la gráfica) y mensajes de pausa/reanudar. Después
**CI-06** (pantallas). Antes de construir la gráfica, escribir en «Pedidos a lo compartido» el uso de `BarChartBoard`.

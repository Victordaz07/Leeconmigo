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
- **La materia ya NO está "Pronto": `available: true`** con la unidad C4-U06 jugable (ver «Actualización CI-05/06/07»).

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


## Actualización CI-05/06/07 (2026-10-16): C4-U06 jugable en la app
**Qué hay (todo en lo propio de Ciencia, sin tocar archivos compartidos):**
- `packages/ui-core/src/ciencia/` — `copy.ts` (todos los textos de la interfaz ES/EN) y `effort.ts` (`scienceStars`: 1 por
  terminar + 1 por pedir ayuda o revisar la idea + 1 por volver a probar; nunca por precisión).
- `packages/science-content` — `unit.ts` ahora describe cada paso (`scene`, `lab`, `labFixed`, `choice`, `choiceByFix`, `map`,
  `glossary`) y el validador comprueba que cada arreglo deje UNA sola diferencia y que los números de `s5.2`/`s6.3` coincidan con
  los datos; `progress.ts` (progreso por niño: sesiones, estrellas, «seguir después», elecciones, cuaderno, intentos de
  evidencia — solo datos derivados, `isScienceProgress` rechaza lo que no tenga la forma).
- `packages/ui-native/src/components/ciencia/` — `LabBoard` (dos bandejas + vasos), `DataTable` y `Scale`, `BarChart` (la
  construye el niño tocando), `PracticeMap` + `LayerToggle`, `SceneZones`, `OptionList`, `MayaSays`, `tapPosition`.
- `apps/mobile/src/subjects/ciencia/` — `index.tsx` (módulo + progreso), `unit-home.tsx` (cuaderno de la unidad),
  `session-player.tsx` (los 24 pasos), `task-panel.tsx` (tareas con pista en 3 escalones y «Lo veo luego»), `lab-model.ts`
  (modelo → dibujo, probado: los gramos SIEMPRE salen del modelo).
- Modo Enfoque: sin Maya, sin fondo, sin gotas; pausa de movimiento en el límite entre pasos.

**Cómo se probó:** `npm test` (1271+ pruebas) y `npm run typecheck`; en el navegador (export web + Playwright) se jugaron las
6 sesiones completas en 4 tamaños, se comprobó que una respuesta equivocada nunca dice «incorrecto», que «Lo veo luego» deja
seguir, que contar sismos en el mapa funciona y que «Guardar y seguir después» retoma en el mismo paso.

**Pendiente (CI-08 y otros):**
- Revisión de un maestro (estándares: borrador; solo se ven en padres, y esa vista aún no existe para Ciencia).
- Interruptor del padre para la actividad con bandejas de verdad (hoy solo hay una tarjeta «Con un adulto» informativa): toca
  archivos compartidos (Modo padres) → pedirlo a Victor (docs/14).
- Repaso 1-3-7 con caso nuevo (`reviewsDue` ya existe; falta la pantalla de repaso).
- Tanda 2 de imágenes y las otras 5 unidades piloto; luego las 48 del mapa.
- Probar con un niño de verdad y ajustar textos/tiempos (la sesión debe sentirse de ≈ 15 min).
- Revisar en un teléfono/tablet real (el navegador no prueba toques con el dedo ni el audio de «Escuchar»).


## Actualización CI-09/10/11 (2026-10-16): Tanda 2 pedida, reproductor por familias, C1-U02 hecha
**Orden pedido por Victor:** «Empieza con las 5 unidades piloto restantes y el prompt para las imágenes». Orden de construcción:
C1 → C2 → C6 → C3 → C5 (de menos a más trabajo nuevo; spec §6).

- **Imágenes:** `docs/design/ciencia/PEDIDO-IMAGENES.md` → «Tanda 2», 41 imágenes en 5 lotes (A C1 · B C2 · C C6 · D C3 · E C5), con un
  estilo común que es el que de verdad salió en la Tanda 1 (acuarela de cuento). Victor las genera y las manda; se procesan con
  `python3 -I scripts/ciencia-arte.py <carpeta> tanda-2` y se pone `UNIT_ART_READY[<id>] = true` en `subjects/ciencia/art.ts`.
- **Arte provisional:** `scripts/ciencia-arte-provisional.py A` dibuja formas sencillas con los MISMOS nombres de archivo para poder
  probar. Una unidad con arte provisional NO se abre para el niño (se ve «Pronto»); solo en un build con `EXPO_PUBLIC_DEMO=1`.
- **Reproductor por familias:** `subjects/ciencia/session-player.tsx` ahora es genérico; lo que se dibuja y se hace lo pone la
  familia del paso (`families/erosion.tsx`, `map.tsx`, `light.tsx`, `scene.tsx`). Una unidad con un laboratorio nuevo agrega UNA
  familia y la registra en `families/index.ts`; no toca el reproductor. Las zonas tocables de una escena ya son datos del JSON
  (`step.zones`). El arreglo de la prueba (`choiceByFix`) se busca por la tarea de tipo `transferir`.
- **Catálogo:** `catalog-screen.tsx` muestra las 48 unidades por grado; las que no tienen contenido (o arte) dicen «Pronto».
  `homeCard` de Inicio cuenta las sesiones de todas las unidades jugables (`overallSegments`).
- **C1-U02 (1.º, «Ver en la oscuridad»):** `labs/luz.ts` (modelo: un objeto se distingue SOLO con luz; `LIGHT_MODEL` dice qué NO
  representa), `content/c1-u02.json` (6 sesiones / 23 pasos, 8 tareas, 2 ideas en 3 casos cada una, glosario, ficha de seguridad),
  `LightBox` y `ResultTable` en `ui-native/ciencia`, `families/light.tsx`. Ficha legible generada: `unidades/C1-U02.md`
  (`python3 scripts/ciencia-unidad-md.py C1-U02`). Pruebas: `tests/unit-c1u02.test.ts`.
- **Cuando llegue el Lote A:** correr el script de arte, **ajustar `interior` de `LightBox`** (dónde está el interior de la caja
  dentro de su imagen; hoy `{x:.13,y:.22,w:.74,h:.58}`), mirar la caja y el osito en los 4 tamaños y poner `UNIT_ART_READY['C1-U02']=true`.

**Siguiente:** CI-12 C2-U02 (probador de materiales: 4 materiales cuadrados iguales, «no pasó / pasó un poco / pasó mucha»,
tabla de resultados con `ResultTable`). Decisiones de diseño ya tomadas para que el arte case: 4 materiales (papel absorbente,
tela, plástico, cartón), vaso de agua compartido con C5 y C6, bandeja con pico.


## Actualización CI-11b (2026-10-16): Lote A recibido, C1-U02 abierta
- Victor mandó el Lote A (7 imágenes: portada, escena, caja, linterna, osito, pelota, taza; sin texto, objetos con fondo
  transparente limpio, caja con interior beige liso). Convertidas con `python3 -I scripts/ciencia-arte.py <carpeta> tanda-2a`
  (manifiesto `docs/design/ciencia/arte/manifest-tanda-2a.json`, 240 KB en total) y conectadas en `art.ts`.
- `LightBox`: el interior de la caja es `{x:.045,y:.275,w:.91,h:.56}` (la caja es ancha y ocupa 66 % del alto del cuadrado).
- `UNIT_ART_READY['C1-U02'] = true`: C1-U02 ya se abre sin build de demo. Verificada en el navegador (tableta horizontal y vertical,
  teléfono vertical). Un lote nuevo = un manifiesto nuevo (`tanda-2b`, `2c`…) que se suma a `MANIFESTS` en `tests/ciencia-art.test.ts`.
- Los lotes B–E siguen en preparación (Victor los está generando). El arte provisional (`scripts/ciencia-arte-provisional.py`) solo se
  usa para probar una unidad mientras llega su lote; nunca se deja conectado con la unidad abierta.


## Actualización CI-12 (2026-10-16): C2-U02 hecha en contenido y pantallas
- **Mientras llega el Lote B** (Victor lo está generando) se construyó la unidad con arte provisional
  (`python3 scripts/ciencia-arte-provisional.py B`, mismos nombres que el pedido). `UNIT_ART_READY['C2-U02']=false`: no se abre al niño.
- `labs/materiales.ts`: 4 materiales × 2 pruebas (techo: cuánta agua PASA · secar: cuánta se EMPAPA), cualitativo (nada/poco/mucho),
  datos didácticos. Cada propósito tiene UN mejor material y NO es el mismo (plástico para techo, papel para secar): el propósito decide.
  `MATERIALS_MODEL` dice qué NO representa (un material real, un techo de verdad, cantidades en gramos).
- `content/c2-u02.json` (6 sesiones / 23 pasos, 8 tareas, 2 ideas: `material.sirve` en 3 casos y `prueba.justa` en 2). Ficha:
  `unidades/C2-U02.md`. Pruebas: `unit-c2u02.test.ts`, `materiales.test.ts`; `dataTextProblems` ata los textos de evidencia al modelo.
- `MaterialTester` (ui-native) + `families/materials.tsx`: elegir una pieza, regar, medidor de agua sin números, tabla `ResultTable`
  que el niño llena mirando el medidor.
- **Cuando llegue el Lote B:** `python3 -I scripts/ciencia-arte.py <carpeta> tanda-2b`, sumar `manifest-tanda-2b.json` a `MANIFESTS` y quitar
  los 8 nombres de `PROVISIONAL` en `tests/ciencia-art.test.ts`, mirar el techo (la pieza rotada −12° sobre el muñeco) y el derrame
  en los 4 tamaños y poner `UNIT_ART_READY['C2-U02']=true`.
- **Siguiente:** CI-13 C6-U04 (energía térmica: probador + constructor de modelos + mesa de datos) con arte provisional del Lote C.


## Actualización CI-12b (2026-10-17): lotes B, C, D y E recibidos (34 imágenes) — toda la Tanda 2 está
- Victor mandó los 4 lotes; se revisaron (sin texto, instrumentos y pantallas en blanco, objetos con alfa limpio, imán GRANDE) y se
  convirtieron con `scripts/ciencia-arte.py <carpeta> tanda-2b … 2e` (manifiestos `manifest-tanda-2b.json` … `2e`). Todo está
  conectado en `art.ts`: `CIENCIA_MATERIALES` (+ `CIENCIA_COMUN.vasoAgua`), `CIENCIA_TERMICO`, `CIENCIA_IMANES`, `CIENCIA_SISTEMAS`,
  las escenas `porche`, `alfeizar`, `taller`, `mesaLab` y las portadas. `PROVISIONAL` quedó vacío y se borró el arte provisional.
- **C2-U02 se abre** (`UNIT_ART_READY=true`), verificada en tableta (horizontal) y teléfono (vertical). Se ajustó `MaterialTester`: techo
  más chico, a un palmo sobre el muñeco; la pieza del derrame cabe dentro de la bandeja.
- Nota de arte: en la portada de C2 el muñeco es una figura de clavija azul y en `prop_muneco` es de madera clara (distintos pero del
  mismo estilo). Si molesta, pedir `cover_c2_u02` otra vez con el muñeco de `prop_muneco`.
- **Siguiente (en este orden):** CI-13 C6-U04 → CI-14 C3-U06 → CI-15 C5-U02. Ya hay arte de las tres, así que cada una se verifica con
  arte real desde el primer día.


## Actualización CI-13 (2026-10-17): C6-U04 «Energía térmica» hecha y abierta
- `labs/termico.ts`: temperatura = 10 + redondeo(subida sin funda × factor de las capas); sin funda 10/14/17, 1 capa de espuma
  10/12/14, 2 capas 10/11/12 (los datos del informe). El aislante **NO enfría**: la temperatura siempre sube, más despacio
  (probado). Criterio del reto: subir ≤ 3 °C con ≤ 3 capas (lo cumplen espuma ×2, fieltro + espuma…). `THERMAL_MODEL` dice qué NO representa.
- `content/c6-u04.json` (6 sesiones / 23 pasos, 8 tareas, 3 ideas: `energia.transfiere`, `aislante.frena`, `diseno.evidencia`).
  Las 3 expectativas MS-PS3-3/4/5 tienen ≥ 3 tareas. `dataTextProblems` ata cada número de los textos (10/14/17, «subió 5 °C»…) al modelo.
  Ficha: `unidades/C6-U04.md`. Pruebas: `unit-c6u04.test.ts`, `termico.test.ts`.
- `LineChart` (el niño traza la curva del vaso sin funda tocando; las otras curvas aparecen al acertar) y `ThermalBench` (vaso, funda de
  hasta 3 capas, termómetro con la lectura como TEXTO de la app) en `ui-native/ciencia`; `families/thermal.tsx`.
- Errores del tema que la unidad corrige sin decir «incorrecto»: «la funda produce frío», «entra el frío», «la funda produce calor».
- **Siguiente:** CI-14 C3-U06 (imanes) → CI-15 C5-U02 (sistema cerrado y propiedades). El arte de ambas ya está en `art.ts`.

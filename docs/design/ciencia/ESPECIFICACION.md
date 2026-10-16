# Ciencia — especificación adaptada a Kitewise (CI-02)

**Fuente:** `docs/research/ciencia-investigacion.md` (informe de Victor, 15-oct-2026, copia sin cambios).
**Estado:** propuesta lista para que Victor confirme las decisiones `DC-n` del §13. Nada de lo que está aquí es oficial ni
está validado por un docente. Mapa de las 48 unidades: `MAPA-UNIDADES.md` (generado del JSON con pruebas).

## 0. Veredicto en una página

**Se adopta tal cual:** la base NGSS / California NGSS como referencia (no como certificación); ciencia como
investigación (fenómeno → idea previa → explorar → evidencia → explicar → transferir); 8 unidades por grado (48); las
cuatro áreas de navegación (Vida, Materia y energía, Tierra y espacio, Ingeniería); las 12 familias de laboratorio
reutilizables; las tres clases de datos que se ven distintas; las seis lecciones de referencia; la lista de errores
conceptuales; los criterios para publicar una unidad; y la honestidad de alcance (complemento, no curso certificado).

**Se adapta al repo** (detalle en §1 y §2): la evaluación (el dominio de Matemáticas exige 10 intentos y aquí hay 8
tareas por unidad); la sesión (6 sesiones por unidad ↔ los momentos de Kitewise y los 20/15/8 minutos); la paleta y los
personajes (el informe cita una guía que no está en este repo); guardado y sincronización (v1 es local, sin nube);
PhET (no se integra: sin terceros y sin conexión); las actividades fuera de pantalla (las enciende el padre).

**Se pospone:** voz como evidencia (RN-03 en pausa, D1); dibujo libre y escritura libre (ver DC-8); fotos y cámara
(C13); laboratorio libre sin unidad; extensiones fuera del núcleo (sistema solar completo, tabla periódica…).

**Qué se hace primero:** una unidad piloto de punta a punta, no las 48 (§12). Recomendación: **C4-U06**.

## 1. Lectura crítica del informe

**Verificado en esta sesión**
- Los códigos de las 48 unidades existen y llevan su grado. Una prueba (`packages/science-content/tests/map.test.ts`)
  compara contra la lista completa de expectativas de 1.º–5.º: **cubre las 62, sin sobrantes ni códigos inventados**.
  Para 6.º es una selección del modelo integrado de California (banda 6–8), como dice el informe.
- La aritmética de las lecciones: 30 + 100 + 10 = 140 g (5.º); el sedimento 18/20/19 g vs 6/7/5 g (4.º); las
  temperaturas de 6.º crecen en el orden esperado (control > funda A > funda B).
- Las 48 unidades tienen título y pregunta en español e inglés (el informe solo traía español; el inglés es nuevo y se
  revisa al escribir cada unidad).

**No verificado (decirlo claro):** no abrí las 23 fuentes ni comprobé las URLs; los códigos los contrasté con lo que
conozco de NGSS, no con el sitio. Un docente debe validarlos (`STANDARDS-REVIEW.md`).

**Puntos del informe que aquí se precisan o corrigen**

| Tema | El informe dice | Aquí queda | Por qué |
|---|---|---|---|
| Paleta | Salvia `#8FA77A`, crema `#F7EFE1`, tinta `#3B2A20`, de `GUIA_ARTE_IDENTIDAD_VISUAL.md` | La interfaz usa los tokens de Kitewise: Ciencia = `#22a95c`, papel `#fffdf8` (`ui-native/src/tokens.ts`). El arte sigue el estilo plano de Matemáticas | Esa guía no está en el repo; D9 fija el diseño Kitewise. Ver DC-6 |
| Personajes | «Maya», «Leo» | Guía de Ciencia: **Maya**, que ya existe con arte (`la-isla-que-caminaba`). Leo es nuevo: solo si hace falta | Continuidad (docs/05); un personaje por cuaderno. Ver DC-4 |
| Evaluación | «Listo para avanzar»: concepto + uso en 2 contextos + una tarea sin ayuda explicativa | Política propia `scienceEvidence.v1` (§7), no la de Matemáticas | Matemáticas pide 10 intentos, 8 aciertos y 3 días: con 8 tareas por unidad no se alcanzaría nunca |
| «Avanzar» | Sugiere un umbral | **Nunca bloquea**; solo destaca lo sugerido | D9: «sin bloqueos, todo abre» |
| Sincronización, SaaS | «estado de sincronización», licencias de SaaS | v1 es local, sin cuentas ni nube (CLAUDE.md, D8, docs/12) | Privacidad |
| PhET | Posible recurso complementario con licencia | **No se integra.** Referencia de interacción solamente | Sin SDKs ni contenido de terceros, funciona sin conexión |
| Sesiones | 6 por unidad, sin duración | Cada sesión ≈ 15 min; con energía baja se **guarda y se sigue después** (no se recorta la ciencia) | Kitewise: 20/15/8 min según energía |
| Voz | «opcional» | No hay voz en Ciencia v1 | D1; RN-03 pausado |
| Dibujos libres | «evidencia revisable» | No en v1: modelos y registros se construyen con componentes (estructurados) | No hay revisión humana en la app; ver DC-8 |
| Fotos reales de organismos | Con procedencia y permisos | Ninguna en v1 | Derechos (docs/12 §5); ilustración propia |
| Datos | Tres clases visibles | **Campo obligatorio `provenance`** en todo dato y distintivo en pantalla (§5) | Nunca atribuir mediciones inventadas a NASA, NOAA, USGS |
| Actividad física | Candidatas con fichas | El padre las enciende en Ajustes (apagadas por defecto); cada una exige su ficha y revisión (§9) | D4: control del padre; seguridad |
| 5.º U08 y 6.º U03/U06 | Cargas altas | Se marcan para revisar tras el piloto; una unidad puede tener más de 6 sesiones | El esquema no lo impide |
| Tareas | 384 como meta | Meta editorial, no compromiso. Primera tanda: 48 tareas (6 unidades) | Honestidad de alcance |

## 2. Cómo encaja en la arquitectura

El camino de Matemáticas (`docs/design/subjects/PATRON-MATEMATICAS.md`) con una diferencia de fondo: **no hay un
"generador de ejercicios aritméticos"**; hay **modelos científicos acotados y deterministas** que producen resultados
verificables.

| Pieza | Dónde | Notas |
|---|---|---|
| Módulo en la app | `apps/mobile/src/subjects/ciencia/` | Ya enchufado como «Pronto». `available: true` cuando haya una unidad completa |
| Contenido y lógica pura | `packages/science-content/` | `mapa.json` + `map.ts` (hecho, con pruebas). Siguen: unidades, tareas, laboratorios, evidencia |
| Textos ES/EN | `packages/ui-core/src/ciencia/` | El dominio devuelve **claves**; la app las vuelve frases (como Matemáticas) |
| Escenas y laboratorios | `packages/ui-native/src/components/ciencia/` | Solo dibujan y avisan qué se tocó; el modelo vive en el paquete |
| Guardado | `subjectStorageFor('ciencia', …)` | Una pieza por niño; solo datos derivados |
| Arte | `apps/mobile/assets/ciencia/` + `subjects/ciencia/art.ts` | Nada de texto dentro de la imagen |
| Contratos compartidos | `packages/contracts` | **No se tocan a la carrera** (docs/14): si hace falta un tipo común, va a «Pedidos a lo compartido» |

**Reutilizable de Matemáticas (pedirlo a lo compartido, no copiarlo):** `BarChartBoard` (Mesa de datos), `AnswerBoxes`,
`DigitPad`, `ConfidencePicker`, `HintLadder`, `SessionPhases`, `MovementBreak`/`useMovementBreak`, el patrón de repaso
1-3-7 y el reductor de ejercicio (`exerciseReducer`: trabajando → revisando → resuelto).

## 3. Mapa curricular

48 unidades, 8 por grado, ids estables `C{grado}-U0{n}` (no se renumeran). Cada una lleva: área, título y pregunta en
ES/EN, expectativas que **propone** desarrollar, borrador de actividad, laboratorios, si es piloto y, cuando aplica, la
precaución editorial del informe. Ingeniería de banda (K-2, 3-5, MS) se concreta en los retos de cada banda
(`engineeringBands`). Ver `MAPA-UNIDADES.md`.

**Regla de oro:** un código en el mapa no acredita cumplimiento; solo cuenta cuando existe una **tarea** donde el niño
realiza la práctica que exige (criterio de publicación 1 del informe, §14).

**Progresión entre grados.** Los cinco hilos del informe (luz y sonido, seres vivos, materia, Tierra y agua, diseño) se
guardan como datos al escribir las unidades, para que cada repaso exija una explicación nueva y no repita la lección.

## 4. La experiencia del niño

**Camino:** Inicio → cuaderno de Ciencia (portada verde) → áreas (Vida · Materia y energía · Tierra y espacio ·
Ingeniería) × grado sugerido (el nivel del niño, con ⭐; **todo abre**, D9) → unidad (camino de 6 sesiones) → sesión.

**La sesión** (≈ 15 min) sigue el flujo del informe, agrupado en las cuatro píldoras de Kitewise (`SessionPhases`):

| Píldora | Qué pasa | Qué se guarda |
|---|---|---|
| **Observa** | El misterio: se ve el fenómeno; el niño dice qué cree (pregunta, predicción, idea inicial) | idea inicial |
| **Explora** | Controla el laboratorio, cambia **una** cosa a la vez, repite, registra (también lo que no coincide con su predicción) | acciones y registro |
| **Explica** | Elige la evidencia que apoya su idea y arma «Afirmación · Evidencia · Razonamiento» con marcos de frase | evidencia elegida, explicación |
| **Usa** | Un caso nuevo (transferencia) y volver a la idea inicial: «Cambié mi idea porque…» | transferencia, idea final |

- **Energía baja (8 min):** la sesión **se guarda y se retoma** después de Explora o de Explica. No se acorta la
  investigación para que «quepa». Energía normal/alta: una sesión completa (15) o con un caso extra (20).
- **Ayuda en 3 escalones**, sin «incorrecto» ni rojo: pista («Mira tu registro») → compara dos casos → ejemplo en
  **otro** caso. Las ayudas de acceso (audio, idioma, tamaño) **no** son pistas y no cuentan como tales.
- **Feedback de compañía**, como en el informe: «Para el techo buscabas que el agua no atravesara. Mira tu registro».
- **Cierre:** estrellas por esfuerzo (D11) con la adaptación DC-7: «revisó su idea» cuenta como esfuerzo.
- **Fuera de pantalla:** tarjeta «Con un adulto», solo si el padre la enciende (§9). Siempre hay alternativa digital.
- **Modo Enfoque (D4):** se leen apoyos, no el modo: `focus.reducedMotion` (fondo desenfocado, sin guía),
  `focus.movementBreaks` (pausa de movimiento al terminar una sesión o un paso), sin límites de tiempo para explicar.
- **Sin tiempo límite, sin puntos por velocidad, sin cofres sorpresa** (D5).

## 4b. Cómo se ve cada tipo de tarea

| Tipo (del banco de 8) | Qué hace el niño | Cómo se evalúa |
|---|---|---|
| Observación (2) | Mira un caso o un modelo y registra lo que ve | Describe lo observado; no se pide inferir |
| Predicción con justificación (2) | Predice, prueba, compara | Distingue predicción de observación |
| Evidencia / modelo (2) | Elige datos que apoyan una conclusión o arma un modelo | Evidencia pertinente; el modelo respeta sus relaciones |
| Transferencia (1) | Resuelve otro caso con la misma idea | Aplica la idea en un contexto distinto |
| Reflexión (1) | Compara con su idea inicial | Reconoce qué cambió y por qué |

## 5. Modelo de datos (boceto; se implementa en CI-04 tras confirmar)

```ts
type Provenance =
  | { kind: 'observed' }                                                        // lo midió o vio el niño en la sesión
  | { kind: 'real'; source: string; url: string; date: string; license: string } // registro real, con procedencia
  | { kind: 'didactic'; note?: string };                                         // inventado para enseñar: se dice

interface Dataset { id: string; provenance: Provenance; unit: Localized; rows: { label: Localized; values: number[] }[] }

interface ScienceUnit { id: string /* C4-U06 */; sessions: ScienceSession[]; glossary: GlossaryEntry[]; safety?: SafetySheet; review: ReviewStatus }
interface ScienceSession { id: string; phases: { observa: Step[]; explora: Step[]; explica: Step[]; usa: Step[] } }
type ScienceTask = { id: string; kind: 'observar' | 'predecir' | 'evidencia' | 'modelo' | 'transferir' | 'reflexionar'; idea: string /* id de concepto */; contextId: string; hints: [HintId, HintId, HintId] }

interface LabModel<State, Action> {            // contrato de TODA simulación
  represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[];
  controls: { id: string; range: [number, number]; unit?: string }[];
  init(seed: number): State; apply(s: State, a: Action): State; results(s: State): Dataset; edgeCases: State[];
}
```

- **Procedencia obligatoria.** Distintivo en pantalla: «Lo observaste tú» · «Registro real (fuente, fecha)» · «Datos de
  práctica (inventados para aprender)». Hoy todo dato es **didáctico**; no existe ningún dato real.
- **Simulaciones deterministas** dentro de sus supuestos, con semilla. Separadas del aspecto visual. Cada una declara qué
  representa, supuestos, rango, unidades, casos límite y **lo que no representa** («una planta virtual no predice el
  crecimiento de cualquier especie real»).
- **Evidencia del niño (solo derivada y local):** tarea y versión, idioma, respuesta o modelo, datos usados, apoyos de
  acceso, pistas explicativas, intentos, día. **Nunca** voz, foto, ubicación ni dibujo (D1, docs/07).
- **Comportamientos esenciales:** guardar y retomar; cambiar de idioma sin reiniciar (el estado no tiene texto);
  deshacer y repetir; distinguir explorar de entregar; mostrar por qué una evidencia sirve; sin conexión; no perder el
  registro al girar el dispositivo.

## 6. Laboratorios

Las 12 familias del informe son el inventario (`LAB_FAMILIES` en el código). Orden de construcción según las seis
unidades piloto:

| Piloto | Familias | ¿Algo reutilizable? |
|---|---|---|
| C4-U06 | Paisaje y erosión · Mesa de datos | Mesa de datos = barras de Matemáticas (`BarChartBoard`) |
| C1-U02 | Luz y materiales | No |
| C2-U02 | Probador de materiales | La tabla de resultados |
| C3-U06 | Fuerzas e imanes | No |
| C5-U02 | Materia en sistemas · Constructor de modelos | Constructor = reglas de reparto/modelo de Matemáticas |
| C6-U04 | Probador de materiales · Constructor de modelos · Mesa de datos | Las tres ya hechas |

El orden C4 → C1 → C2 → C6 → C3 → C5 va de menos a más trabajo nuevo. «Arrastrar una etiqueta solo practica
reconocimiento»: cada pantalla debe permitir **comparar condiciones y usar el resultado**. Todo se puede hacer **tocando**
(WCAG 2.5.7; arrastrar nunca es la única forma).

## 7. Evaluación y dominio

**Dimensiones** (de lo guardado, solo para padres): idea científica · evidencia · investigación/modelo · comunicación.
Una respuesta en un idioma no vale más que un modelo correcto en el otro; no se evalúa acento ni velocidad lectora.

**Política `scienceEvidence.v1` (propuesta, a pilotar):** por *idea* (no por pregunta suelta):
- **explorando:** exploró y registró.
- **practicando:** explicó con evidencia pertinente en un contexto.
- **«lo explico»:** evidencia del concepto **y** de su uso en **dos contextos**, con al menos una tarea sin pista
  explicativa.
- Nunca bloquea, nunca muestra porcentajes al niño; el detalle es de los padres (como en Matemáticas).
- **Repaso espaciado 1-3-7** sobre la idea con un **caso nuevo**, no con la misma pregunta.
- Si falla, se ofrece apoyo específico y **otro caso**; no más preguntas del mismo tipo. El motivo (lectura, controles,
  concepto, gráfica, evidencia) no se «adivina» en v1: queda como idea para después (DC-8).

**La puntuación científica usa criterios verificables y respuestas aprobadas.** Ninguna IA genera respuestas, datos o reglas
de evaluación durante la sesión.

## 8. Español, inglés y accesibilidad

- Un identificador de concepto, dos textos revisados que evalúan **la misma idea**; no es traducción palabra por palabra.
- Glosario ES/EN por unidad. Términos con cuidado (del informe): *tiempo atmosférico/weather* (no «duración»), *clima*,
  *evidencia* (no «prueba definitiva»), *rasgo* (no solo humano), *materia* (no la asignatura), *fuerza ≠ energía*,
  *disolver* (no «desaparecer» ni «derretir»), *meteorización ≠ erosión*, *transferencia de energía* (nombrar dirección
  y sistema).
- Marcos de frase en la interfaz: «Observé… / I observed…», «Comparé…», «Mi evidencia es…», «Cambié mi idea porque…».
- Accesibilidad: audio con pausa y repetición, tamaño de letra ajustable, alternativa tocar-y-colocar, no depender solo
  del color, del oído o del movimiento, `useReducedMotion`, zonas táctiles ≥ 44 px, sin límites de tiempo. **No se dice
  «accesible»** hasta una auditoría técnica y pruebas con personas.

## 9. Actividades fuera de pantalla

Las 18 del informe son **candidatas**, no un catálogo. Reglas:
- Apagadas por defecto; el padre las enciende en Ajustes (D4). El niño ve «Con un adulto» solo entonces.
- Cada una necesita su **ficha de seguridad** (materiales, edad, supervisión, higiene, cierre, cuándo parar) y una
  **alternativa digital completa**; ninguna se presenta como universalmente segura.
- Excluidas del catálogo infantil autónomo: fuego, mezclas de limpiadores, microorganismos, recipientes presurizados,
  electricidad de enchufe, disecciones, animales, sustancias desconocidas, imanes pequeños o de neodimio, observar el
  Sol, láseres, agua hirviendo; los filtros caseros no se presentan como potables.
- No requieren cámara, micrófono, fotos ni ubicación.
- Datos de las 18 (`offscreen.json`) llegan con la unidad que las usa; ninguna sin revisión.

## 10. Dirección visual

- **Interfaz:** tokens de Kitewise (Ciencia `#22a95c`, degradado `subjCiencia`, papel `#fffdf8`). **El arte** sigue el
  estilo plano de Matemáticas para que la app se vea una sola (paleta y contorno del pedido de Matemáticas).
- **La imagen es escena, no ciencia.** Modelos, diagramas, mapas funcionales, escalas, flechas causales, etiquetas, cifras
  y tablas los dibuja la app con código (SVG/vista). **Nada de texto, letras ni números dentro de ninguna imagen.** No se
  pone textura ni decoración encima de algo que el niño debe interpretar.
- Por edad: 1.º–2.º escenas grandes y pocos elementos; 3.º–4.º escena + panel de pruebas; 5.º–6.º laboratorio y cuaderno
  con ilustraciones puntuales. Por dispositivo: en pantalla grande conviven experimento y registro; en teléfono se
  alternan **conservando el estado**; nunca un laboratorio encogido con controles diminutos.
- **Estado del arte (Tanda 1 recibida):** ilustración de cuento (acuarela digital), no plana; coherente con Lectura y con el
  brief de arte, y se ve bien junto a la portada de Matemáticas en Inicio. Maya tiene sus 5 poses con la referencia aprobada.
  La interfaz sigue con los tokens de Kitewise (DC-6 solo se refiere a la UI, no al arte).
- **Inventario:** 48 portadas y 12 familias interactivas; escenas internas solo cuando expliquen algo nuevo. Primera
  tanda = 6 unidades piloto → `PEDIDO-IMAGENES.md` (prompts listos para pegar).

## 11. Guardarraíles (lo que no se hace)

No inventar datos reales ni atribuirlos a una institución · no marcar dominio por completar una animación · no declarar
alineación completa por citar códigos · no usar IA para generar respuestas o puntuar · no «incorrecto», no rojo, no
porcentajes al niño · no límites de tiempo · no voz, fotos ni cámara · no PhET ni terceros · no un único «método
científico» rígido (las prácticas se repiten e iteran) · no temas de bandas posteriores como requisito de un grado
(estaciones por inclinación, sistema solar completo, fases lunares geométricas, tabla periódica, genética avanzada) ·
no convertir una simulación en «demostración de lo que pasa en cualquier lugar» · no un día caluroso como prueba de clima.

## 12. Plan por etapas

| Etapa | Qué | IDs | Depende de |
|---|---|---|---|
| 0 | Investigación guardada, mapa validado, esta especificación, pedido de imágenes | CI-01 ✅ · CI-02 ✅ | — |
| 1 | **Victor confirma** DC-1…DC-8 y genera las imágenes de la 1.ª unidad | — | Victor |
| 2 | Especificación detallada de la unidad piloto (6 sesiones, 8 tareas, glosario, supuestos del modelo, ficha de seguridad) | CI-03 | DC-1…DC-3 |
| 3 | Dominio puro + laboratorio + textos ES/EN + pruebas | CI-04, CI-05 | etapa 2 |
| 4 | Pantallas: cuaderno, unidad, sesión, laboratorio, cierre, Enfoque | CI-06 | etapa 3 + arte |
| 5 | Verificar en 4 tamaños; `available: true` | CI-07 | etapa 4 |
| 6 | Revisión de un docente y prueba con niños | CI-08 | etapa 5 |
| 7 | Las otras cinco pilotos, familia por familia; luego las 42 restantes | CI-09… | piloto probado |

**Unidad piloto recomendada: C4-U06 «Superficies y mapas»** (la lección «La ladera después de la lluvia»). Razones:
(a) es el piloto del brief de arte; (b) corresponde a la edad de Noah; (c) estrena **una** familia nueva (Paisaje y
erosión) porque la Mesa de datos reutiliza las barras de Matemáticas; (d) la lección ya está diseñada en el informe, con
datos didácticos. Segunda: C1-U02 (la más simple, para probar 1.º).

Criterios para publicar una unidad: los 10 del informe (§14), tal cual.

## 13. Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)

| # | Propuesta | Alternativa | Mientras tanto |
|---|---|---|---|
| **DC-1** | Nivel ≠ grado: `C{n}` se ofrece al niño de nivel *n* (sugerido ⭐), pero **todo abre** | Atar la unidad al grado escolar | Como Matemáticas (docs/01, D9) |
| **DC-2** | 6.º usa la selección del modelo integrado de California (banda 6–8), como dice el informe | Otra secuencia distrital | Se guardan marco y versión aparte (`framework`) |
| **DC-3** | Sesión ≈ 15 min; con energía baja se **guarda y se retoma**; las cuatro píldoras Observa · Explora · Explica · Usa | Recortar la sesión a 8 min | Diseño del §4 |
| **DC-4** | Guía de Ciencia: **Maya** (ya existe con arte en `la-isla-que-caminaba`). Leo solo si hace falta | Pipo, o sin guía | Sin guía hasta decidir; en Enfoque no aparece |
| **DC-5** | Primera unidad: **C4-U06**; segunda C1-U02 | Otra de las seis | C4-U06 |
| **DC-6** | Interfaz con tokens Kitewise y arte plano como Matemáticas; **no** se adopta la paleta salvia/crema/marrón | Adoptarla (hay que pasar la guía al repo) | Tokens Kitewise |
| **DC-7** | «Revisó su idea» cuenta como esfuerzo en las estrellas (D11): 1 por terminar, +1 si pidió ayuda o **revisó su idea**, +1 sin pausas largas | Solo las reglas de Lectura | Propuesta |
| **DC-8** | v1 sin voz, dibujo libre ni escritura libre: todo con componentes (estructurado). Diagnóstico automático de «por qué falló» queda para después | Incluir respuesta libre revisada por un adulto | v1 estructurada |

## 14. Pendientes y riesgos

- Revisión de un docente: estándares, conceptos, profundidad por grado, y las dos versiones de idioma.
- Verificar las fuentes del informe (no las abrí) y los permisos de cualquier recurso externo.
- Sobrecarga de 5.º U08 y 6.º U03/U06: revisar tras el piloto.
- Fichas de seguridad de las 18 actividades candidatas; revisión una por una.
- Auditoría de accesibilidad antes de decir «conforme».
- Prueba con niños de ambos idiomas y capacidades lectoras; un piloto pequeño detecta problemas, **no demuestra eficacia**.
- Las duraciones, estrellas y el mapa de 48 son decisiones de producto **por probar**, no hallazgos de la investigación.

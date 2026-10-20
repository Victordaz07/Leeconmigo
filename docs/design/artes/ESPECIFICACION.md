# Arte y música — especificación para Kitewise

Origen: `docs/research/artes-investigacion.md` (investigación de Victor, copia sin cambios). Esta especificación la **adapta a lo que
hay en el repo** (React Native + Expo, cuaderno «Arte y música» ya diseñado en D9). Lo que dice la investigación y no se cambia aquí sigue
valiendo tal cual; lo que se ajusta está marcado **AJUSTE**.

Estado: **especificación + prueba técnica de audio (AR-T1)**. Todavía no hay talleres programados.

## 1. Decisión de producto (D14)

- Arte y música es **el cuaderno que ya existe** en el diseño (`SubjectId` `arte`, hoy «Pronto»). No se crea otra materia.
- Los demás documentos que Victor entregó (Finanzas, Emociones, Comunicación y los otros módulos de «Para la vida») son **cuadernos
  separados, uno por módulo**, cada uno con su propio módulo de app y su propio relevo. No se mezclan con Artes.
- El nombre del espacio de creación libre es **Taller libre**; «sandbox» es solo el nombre interno.

## 2. Lectura crítica

**Se adopta sin cambios**
- Tres puertas al mismo taller: *Inventar* (libre, sin nota), *Aceptar un reto* (criterios visibles), *Descubrir* (obra o práctica cultural).
- Una creación que viaja entre talleres (dibujo → recorte → personaje → animación; ritmo → banda sonora).
- Evaluar decisiones justificadas, no «parecido», clics ni efectos. Nunca nota al gusto. Ninguna IA que haga la obra por el niño ni que
  opine que una obra infantil es «mala» o infiera salud emocional de un dibujo.
- Escenarios y datos ficticios rotulados; audio y voz opcionales; galería **privada**; nada se publica ni se comparte sin decisión adulta.
- Seis talleres (música, pintura, escultura/volumen, collage y diseño, movimiento y teatro, animación y medios) y 48 unidades como mapa
  (6 encuentros por unidad). Lista completa en el documento de investigación §10.

**AJUSTE 1 — la plataforma.** La investigación habla de web (Web Audio, Pointer Events, IndexedDB). Kitewise es React Native (D7). Equivalencias:

| La investigación dice | En Kitewise |
|---|---|
| Web Audio con reloj de audio | `react-native-audio-api` (implementa la API de Web Audio en nativo). **A probar en tableta real (AR-T1).** |
| Pointer Events (ratón, tacto, lápiz) | `react-native-gesture-handler` + lienzo de Skia (`@shopify/react-native-skia`). **A probar (AR-T2).** |
| Ensamblaje 3D | `expo-gl` + three (o `react-three-fiber`). **A probar (AR-T3).** Hasta tener el resultado, el 3D es la última pieza. |
| IndexedDB | `expo-sqlite` (ya está) + archivos del teléfono para PNG. Lo guardado es **local**; no se promete «para siempre». |
| Exportar MP4/GIF/WAV/MIDI/GLB | Solo **proyecto editable + PNG** al inicio; cada formato nuevo se agrega cuando se pruebe en el dispositivo. |

**AJUSTE 2 — dependencias nativas nuevas.** Audio, lienzo y 3D no están en el APK actual. Cada una exige un *development build* nuevo y
prueba en un teléfono o tablet de verdad (el navegador no basta para audio parejo). Por eso AR-T1/T2/T3 van **antes** de construir talleres.

**AJUSTE 3 — regla de oro del repo.** Toda capacidad nativa tiene su `Fake*` para construir y probar sin dispositivo:
`AudioOutput` (real: audio-api; falso: `FakeAudioOutput`), lo mismo para el lienzo. La interfaz no depende de ninguna librería concreta.

**AJUSTE 4 — sonidos.** La primera versión **no usa grabaciones**: los timbres se **sintetizan por código** (tambor grave, palmas, sonaja,
sonido vocal sintetizado). Así no hay derechos que revisar ni archivos de audio pesados. Los bancos culturales (güira, tambora…) llegan
después, con fuente, intérprete, lugar y permiso por escrito, y nunca llamados «auténticos» por el solo hecho de usar el timbre.

**AJUSTE 5 — privacidad.** Artes **no usa el micrófono ni la cámara**. Las grabaciones propias y la fotografía de objetos quedan fuera
hasta una revisión de privacidad (igual que C13). Las creaciones nunca salen del dispositivo (D1 se aplica por analogía).

## 3. Arquitectura

```
apps/mobile/src/subjects/arte/            módulo de la materia (cuaderno Arte y música)
packages/art-content/                      unidades A1-U01…A6-U08 como datos validados (JSON + validador), como science-content
packages/music-engine/                     lógica PURA del secuenciador (sin React Native) + FakeAudioOutput + pruebas
packages/ui-core/src/arte/                 textos ES/EN
packages/ui-native/src/components/arte/    componentes (rejilla de pasos, paleta, etc.)
docs/design/artes/  docs/handoff/artes.md  docs/log/artes.md  filas AR-xx del ROADMAP
```

### Proyecto editable (pieza de unión)
Un `ArtProject` guarda: id estable, versión de formato, título, idioma, fechas, **escenas** y **referencias a recursos**. Cada taller guarda su
propio dato (patrón rítmico, trazos, transformaciones 3D, fotogramas) y comparte solo **identificadores, operaciones (deshacer/rehacer/
duplicar) y metadatos de derechos**. No hay un «archivo gigante». Versiones: cada «guardar versión» es una copia ligera; el original siempre
se puede recuperar. Se guarda en SQLite, por niño (como el progreso de las otras materias). «Borrar el progreso» también borra los proyectos.

### Secuenciador (AR-T1 → primer taller)
Contrato puro en `packages/music-engine` (ya construido en AR-T1):
- `Pattern`: 8 columnas (pulsos de negra en 4/4, dos grupos de cuatro) × 4 filas (percusión grave, palmas, sonaja, voz sintetizada).
  **Un paso = un pulso**; si algún día hay corcheas se rotula distinto y se muestra la subdivisión (la investigación lo pide explícito).
- **Cada fila elige su sonido** entre un catálogo de **16** (§3b). La fila solo dice *cuándo* suena; el niño decide *qué* suena. Se puede repetir el mismo sonido en dos filas. Cambiar un sonido mientras suena vale para los golpes que aún no se programaron.
- Tempo 60–140 BPM (decisión de diseño revisable); un cambio de tempo se aplica **en el siguiente ciclo** (regla fija, nunca a mitad).
- Planificador con **anticipación** (lookahead): se programan los golpes en el reloj de audio con ~100 ms de adelanto; el cursor visual
  se sincroniza con ese mismo reloj. **Nunca** se confía en un temporizador de interfaz para disparar sonidos.
- Repetición sin huecos añadidos: el paso 8 enlaza con el paso 1 sin pausa. Detener/reanudar, solo/silencio por capa, dos versiones A/B.

### 3b. Catálogo de 16 sonidos (4 familias × 4)

Todos **sintetizados por código** (sin grabaciones ni derechos), de corta duración y con un cierre suave. Criterios de selección: (1) cubrir las familias que un niño reconoce (tambores, cuerpo, madera/metal, notas); (2) que sean **distintos entre sí** al oído (grave/medio/agudo, seco/resonante, con tono/sin tono); (3) que sirvan para un ritmo de un golpe por pulso; (4) las notas con tono van **todas en do mayor pentatónico**, para que cualquier mezcla suene bien junta; (5) ninguno se presenta como «auténtico» de una tradición (los bancos culturales llegan después, con permiso y fuente).

| Familia | Sonido | Cómo suena | Con tono |
|---|---|---|---|
| Tambores | Bombo | golpe grave y profundo | — |
| | Tambor medio | tambor redondo, tono medio | — |
| | Bongó | tambor pequeño, agudo y seco | — |
| | Caja | golpe seco con «arena» | — |
| Cuerpo y voz | Palmas | dos manos que aplauden | — |
| | Chasquido | dedos, muy corto | — |
| | Pisada | pie que pisa el suelo | — |
| | Voz «a» | voz sintética original (no es la de nadie) | la (220 Hz) |
| Madera, metal y sonajas | Claves | dos palitos de madera | — |
| | Bloque de madera | madera hueca, «toc» | — |
| | Triángulo | metal brillante, resuena | — |
| | Sonaja | semillas que se sacuden | — |
| Con tono (notas) | Marimba | placa de madera | do (523 Hz) |
| | Campanita | campana clara | sol (784 Hz) |
| | Cuerda | cuerda pulsada | sol grave (196 Hz) |
| | Bajo | nota muy grave y redonda | do grave (65 Hz) |

Lo que **no** hay en v1 (a propósito): piano/teclado y flauta (necesitan más de una nota para sonar a instrumento; llegan con «dibuja una melodía»), instrumentos con grabaciones reales y bancos culturales (güira, tambora…). El juego de partida es bombo, palmas, sonaja y voz. El niño escucha cada sonido **al tocarlo** en el selector.

## 4. Experiencia (cuaderno «Arte y música»)

- **Inicio del cuaderno:** estantería de talleres + **Taller libre** destacado + los retos sugeridos para el grado. **Todo abre** (D13-1: el nivel
  no es el grado; se destaca lo sugerido).
- **Taller libre:** sin nota, sin ranking, sin «terminar». Guardado automático. Para no asustar con el lienzo vacío: «empieza con una
  mancha», «transforma este sonido», «combina dos materiales»; se pueden descartar.
- **Retos** (1 por unidad piloto): intención clara, criterios visibles, explicar una decisión (elegir entre opciones, señalar o dibujar;
  escribir es opcional).
- **Descubrir:** cápsula cultural breve (qué escuchamos o vemos, quién lo creó, dónde y cuándo, para qué, qué decisión artística notamos).
  Cada fuente con atribución; ningún audio o imagen se descarga sin permiso de uso.
- **Modo Enfoque / accesibilidad:** animación decorativa desactivable; todo cambio de estado también con texto o forma (no solo color ni
  solo sonido); el secuenciador se maneja con botones rotulados; cursor visual del ritmo sin afirmar que reemplaza la escucha.
- **Estrellas por esfuerzo (D11):** exploró, comparó dos versiones, explicó una decisión. Nunca por «sonar mejor» ni por cantidad de clics.

## 5. Primer piloto: A1-U04 «Mi ritmo de ocho pulsos» (1.º)

Seis encuentros: (1) escuchar un patrón y una capa sola, (2) armar un patrón, (3) dejar un silencio a propósito, (4) agregar otra capa y
comparar, (5) guardar dos versiones A/B, (6) presentar y conectar con una escucha cultural breve. Concepto: repetición, timbre y silencio.
Evidencia: señala dónde vuelve el patrón y explica o muestra una elección. Feedback ejemplo: «Escucha esta capa sola. ¿Quieres
conservarla igual o cambiar algo?». Nunca «más cuadros activos = mejor». Lo escrito en la investigación §11 manda para el detalle.

Hasta que Victor confirme los temas y la escucha cultural, el encuentro 6 queda con una cápsula **provisional ficticia** rotulada.

## 6. Pruebas técnicas (antes de construir talleres)

| ID | Qué se prueba | Pasa si… | Si falla |
|---|---|---|---|
| **AR-T1** | Secuenciador de 8 pasos con `react-native-audio-api` en la tableta de Victor | 5 min a 60/90/140 BPM sin huecos ni «arrastres» que se oigan; cursor visual alineado; detener/reanudar limpio; vuelta desde segundo plano sin quedar sonando | Probar otro enfoque (muestras prehechas en bucle, o motor propio nativo) **antes** de seguir |
| **AR-T2** | Lienzo con Skia: trazo con dedo/lápiz, grosor, deshacer, 60 s de dibujo seguido | Sin pérdida de trazos, cancelar un trazo no lo deja colgado, memoria estable | Lienzo de SVG (más simple, menos capas) |
| **AR-T3** | Escena 3D con 5 sólidos y cámara con `expo-gl` | ≥ 30 cuadros/s en la tableta, vistas frente/lado/arriba correctas | Vistas 2.5D etiquetadas como tales (la investigación ya lo prevé) |

AR-T1 (aprobada): pantalla **Prueba de audio** en Ajustes de padres. AR-T2 (construida): pantalla **Prueba del lienzo**, mismo lugar; los toques usan el sistema de gestos de React Native, por lo que no se necesita `react-native-gesture-handler`. Resultados a `docs/log/artes.md`.

## 7. Evaluación (propuesta por validar; no diagnostica talento)

Dimensiones: exploración, técnica con intención, decisión artística, revisión, contexto, presentación/reflexión (investigación §13).
Modo libre: sin nota. Modo reto: criterios visibles y relacionados con la intención. Objetivos verificables (pulso, A/B, timbre, vistas)
conviven con resultados expresivos abiertos. Portafolio mínimo por reto: intención, obra, una versión anterior si aplica, una decisión
explicada, una fuente cultural. No se registra cada movimiento del niño.

## 8. Currículo y estándares

California reconoce cinco disciplinas (danza, artes mediáticas, música, teatro, artes visuales). Las unidades llevan la disciplina
principal (VA, MU, MA, TH, DA). Los códigos de estándares **no se asignan por parecido**: la matriz detallada va en la fase de autoría, y
**solo se ve en la vista de padres, como borrador** hasta que un maestro la valide (igual que NGSS/HSS).

## 9. Fases (filas AR-xx del ROADMAP)

| ID | Qué |
|---|---|
| AR-01 | Investigación recibida y copiada (hecho) |
| AR-02 | Esta especificación y decisión D14 (hecho) |
| AR-T1 | Prueba técnica de audio: motor puro + `FakeAudioOutput` + pantalla de prueba (✅ aprobada en la tableta, 2026-10-19) |
| AR-T2 | Prueba técnica del lienzo (Skia): `packages/art-content` + pantalla de prueba (hecho el código; **falta probar en la tableta**) |
| AR-T3 | Prueba técnica 3D |
| AR-03 | Módulo `arte` enchufado + `packages/art-content` + esquema de proyecto y guardado por niño (✅ hecho; abre con el Taller libre de ritmo) |
| AR-04 | Taller de ritmo (A1-U04) completo con Taller libre y portafolio (✅ hecho; la escucha cultural sigue provisional) |
| AR-05 | Pintura y paleta (modelo de mezcla documentado en `MODELO-MEZCLA.md`): ✅ taller libre y mezclador; ✅ AR-05b: unidad guiada A2-U02 |
| AR-06 | ✅ AR-06a Taller de collage; AR-06b unidad A1-U06 «Una historia de recortes»; AR-06c flipbook. Collage y flipbook; recorridos «ritmo → composición» y «dibujo → collage → animación» |
| AR-07 | Ensamblaje 3D (si AR-T3 pasa) |
| AR-08 | Cápsulas culturales (con permisos) y revisión de un maestro |

## 10. Decisiones para Victor (propuestas `DA-n`; no se aplican hasta que confirme)

- **DA-1** Primera unidad: **A1-U04 «Mi ritmo de ocho pulsos»** (1.º) y, después, A2-U02 (paleta) y A3-U03 (criatura 3D). Todo abre; lo sugerido se destaca.
- **DA-2** Los **16 sonidos** (§3b) **sintetizados por código** en la primera versión; bancos culturales solo con permiso por escrito. ¿Cambiarías alguno del catálogo?
- **DA-3** Artes **sin micrófono ni cámara** en v1; la galería es privada y no se comparte.
- **DA-4** Estándares de California: borrador solo para padres hasta validación de un maestro.
- **DA-5** ¿Qué guía acompaña en Artes? (Maya acompaña Ciencia; ¿otra o la misma?)
- **DA-6** Tempo inicial 60–140 BPM y 8 pasos = 8 negras (como pide la investigación).
- **DA-7** Aprobar dependencias nativas nuevas (audio-api, Skia, gesture-handler, expo-gl) → APK nuevo para probar.
- **DA-8** Arte (imágenes): por tandas con prompts, como en Ciencia; la lista nace de `ART-BRIEF.md` + esta especificación.

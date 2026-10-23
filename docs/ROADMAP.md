# ROADMAP — tareas con ID (tabla viva)

Visión y fases de producto: `docs/08-ROADMAP.md`. Plan que origina estos IDs: `docs/10-PLAN-MAESTRO-V2.md`.
Estados: ✅ hecho · 🟡 en curso · ⬜ por hacer · ⏸️ bloqueado (esperando decisión, ver `docs/DECISIONS.md`).
Regla: tareas de ~30–45 min. Si una crece, se divide aquí (`F2-04a`, `F2-04b`…).

> Desde D7, las tareas de UI de F2–F6 se construyen en la app nueva (`apps/mobile`), no en `apps/reader`.
> Las de lógica pura (p. ej. F2-04a) sirven para las dos.

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| **F0** | **Diseño (Claude Design)** | | | |
| F0-01 | Variante "Modo Enfoque" de las pantallas existentes + pantallas nuevas (ver plan §3) | ✅ | – | entregado: `docs/design/kitewise/` |
| F0-02 | Decidir tipografía/paleta (C2, C3) | ✅ | – | resuelto por el diseño Kitewise (D9) |
| **K** | **Kitewise** (D9, `docs/13`) — construido sobre la app nativa | | | |
| K0 | Guardar el diseño en el repo, registrar decisiones y plan | ✅ | A | `docs/design/kitewise/`, `docs/13` |
| K1 | Tokens Kitewise + NotebookCover/SubjectTab/NavRail/SessionPhases; Inicio (B3) y Cuaderno de Lectura (B4) | ✅ | A | progreso real en memoria (persistencia = RN-08) |
| K2 | Lectura en el cuaderno (B9) + estados (B11, G11–G13) | ✅ | A | G12 (sin conexión) pospuesto: hoy todo va dentro de la app, no hay nada que descargar |
| K3 | Cierre (B13), perfiles (B1), ¿Cómo llegas? (B2) | ✅ | A | estrellas por esfuerzo (D11); "Agregar niño" espera el PIN (K4) |
| K4 | Padres: P1, P2, P4 | ✅ | A | PIN, panel de hoy con datos reales, ajustes + agregar niño + lectura libre; Enfoque = K7 |
| K5 | Practicar (B8, G9, G10) + repaso 1-3-7 | 🟡 | A | hecho para Matemáticas (teclado, confianza, 3 pistas, "Lo veo luego", repaso 1-3-7 en el calentamiento); falta V/F y ordenar (G9, G10) |
| K6 | Unidades/lecciones + Aprender/Explorar + camino (B5–B7); 1.ª unidad de Matemáticas | 🟡 | A | unidad g3u1 jugable de punta a punta (`packages/math-content`, `math-notebook-screen`, `math-lesson-screen`); **Victor: "demasiado simple, de preescolar"** → investigación de problemas reales (`docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md`) y rehacer g3u1; falta también: guardar en el teléfono (RN-08), etiquetas concepto/procedimiento/transferencia, revisión docente, más unidades |
| K6v | Matemáticas visuales (spec `docs/design/math-visual/`): las 12 familias + Taller por grado/tema + en lecciones | ✅ | A | 37 plantillas 1.º–6.º; pendientes en `IMPLEMENTACION.md` (arrastre, Enfoque, guardar, revisión docente) |
| K7 | Modo Enfoque (B10, B12), oscuro (G1–G3), vertical (G4–G6) | 🟡 | A | vertical + teléfono ✅ (`layoutFor`); faltan el resto de Enfoque (K7b–d) y modo oscuro |
| K7a | Enfoque: ajuste del padre (Apagado/Encendido/Personalizado + horario) guardado por perfil; Matemáticas lo respeta | ✅ | A | `contracts/focus.ts`, `session-engine/focus.ts` (`resolveFocus`, con pruebas), P4; Taller y lecciones: fondo desenfocado, sin Mila, rondas de 4 |
| K7b | Enfoque en Lectura (B10): arte desenfocado de fondo, 1 frase resaltada, 3 botones | ✅ | A | apoyo `focusReading` («Lectura de una línea a la vez»); `FocusPage` en `reading-screen.tsx`, `FocusReadingBar`; la hoja sigue a la línea actual |
| K7c | Pausa de movimiento (B12): 60–90 s cada ~10 min | ✅ | A | apoyo `movementBreaks`; 60 s, 3 rutinas ES/EN (`ui-core/movement.ts`), `MovementBreak` (ui-native); reloj de actividad compartido (`apps/mobile/src/movement.ts`); sale al terminar página / paso / ejercicio |
| K7d | Enfoque adaptativo (toques erráticos, pausas largas; sin cámara ni audio) | ⬜ | | el niño no ve avisos |
| K8a | **Mi cuaderno (B14)**: palabras nuevas (salen de Lectura), ideas que el niño escribe («Lo que entendí», 140 letras, 3 por día, con materia) y sus dibujos de Arte y música; módulo `apps/mobile/src/subjects/mi-cuaderno/`; sin imágenes nuevas (espiral y estrella hechas con código) | ✅ | A | 11 pruebas; verificado en navegador (tableta y teléfono: ideas, tope diario, palabras, dibujos, reabrir). Propuesta **MC-1**: 3 ideas por día (el diseño decía 1) |
| K8b | **Logros** (7 pegatinas, reglas de `docs/01` sobre el progreso de Lectura; ganadas a color, las que faltan apagadas y con «2 de 5») y **estrellas dibujadas en el cierre** (Lectura, Ciencia, Sociedad) | ✅ | A | `achievements.ts`/`achievements-screen.tsx` + 8 pruebas (con las del arte); imágenes K-1/K-2/K-3 recibidas y conectadas. Verificado en navegador |
| K8c | «Guardar en mi cuaderno» en el cierre de cada materia ✅, informe PDF ✅ (Lectura), sello del día dibujado, foto de tarea | 🟡 | – | «Guardar en mi cuaderno» hecho (Lectura, Ciencia, Sociedad; `notebook-save.ts`); informe semanal P5 en Modo padres (`weekly-report*.ts`, `parent-report-screen.tsx`, `expo-print` + `expo-sharing`; solo datos de lectura por ahora, sin estándares); necesita APK nuevo (módulos nativos); foto espera C13; `STAMP_IMAGES` y `KITE_IMAGES.cheer` ya están en `kitewise-art.ts` |
| K8d | Recordatorios locales: aviso diario de lectura por niño + aviso del resumen semanal, en Modo padres | ✅ | A | `apps/mobile/src/reminders/`, `parent-reminders-screen.tsx`, `expo-notifications` SIN push remoto (`plugins/no-push.js`). Verificar en Android real |
| K8e | Marca: logo de la cometa, ícono de la app (clásico, adaptable y monocromo), favicon, ícono de avisos, gráficos de Google Play | ✅ | A | `scripts/marca.mjs` → `apps/mobile/assets/` y `assets/brand/`; guía en `docs/design/kitewise/BRAND.md`. Falta: búsqueda de marca (docs/12 §5) y, si Victor quiere, un ícono ilustrado generado como imagen |
| K9 | Aviso legal al iniciar (ES/EN), política de privacidad y términos (borrador), «Legal y privacidad» y «Borrar todos los datos» en Modo padres; permisos mínimos | ✅ | A | BORRADOR: revisión del abogado + datos de Victor pendientes (`docs/legal/REVISION-ABOGADO.md`). Verificar en Android real que sin INTERNET nada se rompe |
| K10 | Lectura libre: modo por defecto + revisión a fondo (volver de página, tiempo real acotado, sin aviso lento, scroll al inicio, botón atrás de Android guarda, ayuda del coach breve) | ✅ | A | `session/free-clock.ts`, `use-reading-session.ts`, `reading-screen.tsx`, `free.forward` en `session-engine`. Pendiente: probar en el Android de Noah. Límite conocido: si Android mata la app en segundo plano a mitad de una historia, se pierden los minutos de esa sesión (la página sí se retoma) |
| **RN** | **Migración a React Native + Expo** (D7, `docs/11`) | | | |
| RN-00 | Registrar decisión, plan de migración y lista legal | ✅ | A | `claude/gracious-shannon-a0238d` |
| RN-01 | Crear `apps/mobile` (Expo + TS) usando `contracts`/`reading-engine`/`story-engine` | 🟡 | A | código listo y empaquetando; falta verlo en el Android de Victor (`npx expo run:android`) |
| RN-02 | Tokens en TS + fuentes + componentes base en `packages/ui-native` | ✅ | A | botón, tarjeta, micrófono; Andika + Nunito empaquetadas |
| RN-03 | Prueba técnica de voz con `whisper.rn` en la tablet de Noah | ⏸️ | A | pausado por Victor (2026-10-16: "el asunto de las voces es muy complicado"); motor + Prueba de voz quedan en el APK |
| RN-04 | Pantalla de lectura con `FakeReadingEngine` | ✅ | A | texto + palabra actual + coach/mic + ayuda (sílabas, `expo-speech`) + panel DEV; lógica de vista compartida en `packages/ui-core` |
| RN-05 | Cómic: globos + acomodo de texto (24 historias) | ✅ | A | `fitText` (ui-core) con medidas de Andika, paridad con la web ±3 %; ilustraciones vía `require.context` (sin copiar) |
| RN-06 | Resto del flujo + Modo padres con PIN → **RN-CP1** paridad con simulador | ⬜ | – | se hace con las pantallas de Kitewise (K1–K4) |
| RN-07 | `WhisperNativeSpeechEngine` + `RealReadingEngine` | ⬜ | – | depende de RN-03 |
| RN-08 | Almacenamiento local + migración del progreso de Noah | 🟡 | A | guardado en el equipo ✅ (`apps/mobile/src/persist/`, expo-sqlite kv; perfiles, PIN, Lectura y Matemáticas); la migración desde la app Capacitor no se hace: empieza limpio |
| RN-09 | Build iOS | ⬜ | – | necesita cuenta Apple / EAS |
| **P** | **Publicación** (D8, `docs/12`) | | | |
| P-01 | Revisión con abogado (COPPA / California) | ⬜ | Victor | |
| P-02 | Política de privacidad, términos, avisos y descargos (borradores para el abogado) | ⬜ | – | |
| P-03 | Botón "Borrar todos los datos" + candado de padres para enlaces externos | 🟡 | A | "Borrar el progreso" por niño en P4; falta borrar TODO (con RN-08) |
| P-04 | Cuenta Google Play + prueba cerrada con familias | ⬜ | Victor | depende de C11 |
| P-05 | Búsqueda de marca "Lee Conmigo" + términos de las herramientas de ilustración | ⬜ | Victor | |
| **F1** | **Repo y relevo** | | | |
| F1-01 | Monorepo Vite + React + TS | ✅ | – | ya existía |
| F1-02 | `HANDOFF.md`, `docs/ROADMAP.md`, `docs/log/SESSION_LOG.md`, `docs/DECISIONS.md`, `/retomar`, `/relevo`, protocolo en `CLAUDE.md` | ✅ | A | `claude/gracious-shannon-a0238d` |
| F1-03 | Tests base (Vitest) + typecheck + deploy de prueba (Vercel) | ✅ | – | ya existía (1068 pruebas) |
| F1-04 | Script `npm run check` = typecheck + test, para que `/retomar` sea un solo comando | ⬜ | – | |
| **F2** | **Base de la app** | | | |
| F2-01 | PIN de padre | ✅ | – | `apps/reader/src/parent-settings.ts` |
| F2-01b | Perfiles múltiples (selector con avatar) | ✅ | A | app nativa (K3/K4), resuelto por D9 |
| F2-02 | Tokens de diseño de F0 + componentes base | 🟡 | – | tokens del prototipo ya en `packages/ui/src/styles/tokens.css`; faltan los de F0 |
| F2-03 | Navegación niño / padre | ✅ | – | ya existía |
| F2-04a | Modo Enfoque: tipos `FocusSettings` + `FOCUS_PRESETS` + resolución por horario (lógica pura + tests) | ⬜ | – | contracts + session-engine |
| F2-04b | Modo Enfoque: persistencia + pantalla en Modo padres (Apagado/Encendido/Personalizado) | ⬜ | – | `apps/reader` + `packages/ui` |
| F2-04c | Modo Enfoque: aplicar apoyos ya posibles sin diseño nuevo (umbrales de voz al `ReadingTimer`, movimiento reducido, 1 pregunta por pantalla) | ⬜ | – | |
| F2-04d | Modo Enfoque: apoyos que necesitan pantallas de F0 (barra de tiempo, meta/caritas, pausa de movimiento, elección de actividad) | ⬜ | – | depende de F0-01 |
| **F3** | **Voz y temporizador** | | | |
| F3-01 | Reconocimiento en el dispositivo, fallar cerrado | ✅ | – | Whisper local (WASM) |
| F3-02 | Temporizador por actividad de voz | ✅ | – | umbrales fijos 10 s / 3 s; configurables en F2-04c |
| F3-03 | Calibración en la tablet de Noah (ruido, susurro, acentos) — registrar en el log | ⬜ | – | `docs/09` #6/#7 |
| **F4** | **Lectura y cuestionarios** | | | |
| F4-01 | Formato JSON de historia | ✅ | – | `packages/contracts/src/story.ts` |
| F4-01b | Etiquetas de estándares en el esquema (opcional) | ⏸️ | – | C9 |
| F4-02 | Lector por niveles | ✅ | – | cómic / illustrated reader; nivel 4 sin contenido |
| F4-03 | Motor de cuestionarios: opción múltiple | ✅ | – | |
| F4-03b | Tipos nuevos: V/F, ordenar, unir, "toca la oración que lo demuestra" | ⬜ | – | |
| F4-04 | Repetición espaciada (1, 3, 7 días) | ⬜ | – | |
| **F5** | **Matemáticas** | | | ⏸️ todo F5 espera C4 |
| F5-01 | Plantillas de problemas por esquema (total / diferencia / cambio / grupos iguales) | ⏸️ | – | |
| F5-02 | Entradas: teclado, opción múltiple, recta numérica, fichas, fracciones | ⏸️ | – | |
| F5-03 | Pistas por escalones + ejemplo resuelto | ⏸️ | – | |
| F5-04 | Contador de "práctica activa" separado del de lectura | ⏸️ | – | |
| **F6** | **Panel de padres** | | | |
| F6-01 | Tarjeta diaria (3 números) + semana | ⬜ | – | "Mi progreso" ya existe con datos reales; falta la vista de padre |
| F6-02 | Recompensas y canje | ⬜ | – | |
| F6-03 | Resumen para compartir con la maestra (opcional) | ⬜ | – | |
| **F7** | **Contenido Unidad 1** (grado de Noah, EN/ES, revisión humana) | ⬜ | – | espera grado/temas (plan §6) |
| **F8** | **Prueba con Noah** (2 semanas, notas en `docs/log/`) | ⬜ | – | |

---

## Ciencia — solo la cuenta de Ciencia edita estas filas (`docs/14`, `docs/handoff/ciencia.md`)

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| PREP-1 | Preparación: módulo, registro, paquete vacío, guardado por materia, protocolo | ✅ | A | enchufado como "Pronto" |
| CI-01 | Investigación de Ciencia | ✅ | A | Victor entregó el informe: `docs/research/ciencia-investigacion.md` |
| CI-02 | Analizar y adaptar el informe: mapa de 48 unidades como datos validados, especificación, pedido de imágenes, estándares | ✅ | A | `docs/design/ciencia/`, `packages/science-content` (mapa.json + 8 pruebas, cubre las 62 expectativas NGSS 1.º–5.º); **espera DC-1…DC-8 de Victor** |
| CI-03 | Especificación detallada de la unidad piloto (6 sesiones, 8 tareas, glosario, supuestos del modelo, ficha de seguridad) | ✅ | A | `docs/design/ciencia/unidades/C4-U06.md`; DC-1…DC-8 confirmadas (D13). | recomendada C4-U06; **imágenes de la Tanda 1 ✅ recibidas y en la app** (18 de 18, `assets/ciencia/`, `subjects/ciencia/art.ts`); espera DC-1…DC-8 |
| CI-04 | Dominio puro de C4-U06 en `packages/science-content`: modelo de erosión, datos y mapas de práctica, `scienceEvidence.v1`, unidad en JSON validado, evaluador de tareas + pruebas | ✅ | A | 56 archivos / 1250 pruebas; los datos salen del modelo y los textos que citan números se comprueban contra ellos |
| CI-05 | Textos ES/EN en `ui-core/src/ciencia/` | ✅ | A | `copy.ts` (rótulos, píldoras, distintivos, marcos de frase, pantallas) + `effort.ts` (estrellas por esfuerzo, D13) |
| CI-06 | Pantallas del cuaderno de Ciencia (con Modo Enfoque) | ✅ | A | Unidad C4-U06 jugable: cuaderno de la unidad + reproductor de sesión (6 sesiones / 24 pasos), laboratorio de bandejas, báscula, tabla, gráfica, mapas de práctica, retomar, cierre con estrellas por esfuerzo, progreso guardado por niño |
| CI-07 | Verificar en 4 tamaños y `available: true` | ✅ | A | Recorrido completo de las 6 sesiones en tableta (horizontal/vertical) y teléfono (vertical/horizontal), Modo Enfoque (sin Maya ni fondo) y «guardar y seguir después». `available: true` |
| CI-08 | Revisión de un maestro (estándares: borrador) | ⬜ | – | |
| CI-09 | Pedido de imágenes de la Tanda 2 (5 unidades piloto, 41 imágenes en 5 lotes A–E) | ✅ | A | `docs/design/ciencia/PEDIDO-IMAGENES.md`; espera que Victor las genere |
| CI-10 | Reproductor de sesión por «familias» de laboratorio (erosión, mapa, escena, luz) y catálogo de las 48 unidades | ✅ | A | `subjects/ciencia/families/`, `catalog-screen.tsx`; una unidad nueva solo agrega su familia |
| CI-11 | C1-U02 «Ver en la oscuridad»: modelo de la luz, unidad en JSON validado, caja de luz y tabla de observaciones | ✅ | A | Lote A recibido (7 imágenes, `manifest-tanda-2a.json`); `UNIT_ART_READY['C1-U02']=true`; verificada en tableta y teléfono |
| CI-12 | C2-U02 «Un techo para el muñeco» (probador de materiales): modelo, unidad en JSON validado, familia `materials` | ✅ | A | Lote B recibido (9 imágenes, `manifest-tanda-2b.json`); `UNIT_ART_READY['C2-U02']=true`; verificada en tableta y teléfono |
| CI-13 | C6-U04 «Energía térmica»: modelo térmico, unidad en JSON validado, banco de la funda y gráfica de líneas | ✅ | A | Lote C recibido (8 imágenes); verificada en tableta y teléfono; 3 expectativas MS-PS3 con ≥ 3 tareas cada una |
| CI-14 | C3-U06 «Interacciones sin tocar»: modelo del imán, unidad en JSON validado y mesa del imán | ✅ | A | Lote D recibido (9 imágenes); verificada en tableta y teléfono; la electricidad estática del mapa queda pendiente (globo y papelitos ya tienen arte) |
| CI-15 | C5-U02 «Cantidad y propiedades»: modelo de masa y propiedades, unidad en JSON validado, balanza con frasco cerrado y tabla de muestras | ✅ | A | Lote E recibido (8 imágenes); verificada en tableta y teléfono (ES); con esto **las 6 unidades piloto están jugables** |
| CI-16 | C5-U03 «Mezclas bajo investigación» (5-PS1-4): modelo de mezclas, unidad en JSON validado y tabla de pruebas | ✅ | A | Sin imágenes nuevas: usa el arte del Lote E y dibuja bicarbonato, vinagre y agua; portada provisional (la de C5-U02). Verificada en tableta (ES) |
| CI-17 | C4-U02 «Energía en movimiento» (4.º): modelo de la rampa, contenido y banco de la rampa | ✅ | A | Lote I recibido (3 imágenes); verificada en tableta; abierta al niño |
| CI-18 | C3-U05 «Fuerzas y movimiento» (3.º): carrito con empujones, péndulo y contenido | ✅ | A | Lote H recibido (4 imágenes); verificada en tableta; abierta al niño |
| CI-19 | C1-U03 «Caminos de luz» (1.º): materiales y luz, contenido y banco de la linterna | ✅ | A | Lote F recibido (6 imágenes); verificada en tableta; abierta al niño |
| CI-20 | C2-U01 «Detectives de materiales» (2.º): clasificar por propiedades, contenido y mesa del detective | ✅ | A | Lote G recibido (6 imágenes); verificada en tableta; abierta al niño |
| CI-21 | C6-U05 «Agua en movimiento» (6.º): modelo del ciclo del agua, contenido y constructor de flechas | ✅ | A | Lote J recibido (9 imágenes); verificada en tableta; abierta al niño. Con esto la **Tanda 3 está completa** |
| CI-22 | C5-U01 «Materia invisible» (5.º) — lote O | ✅ | A | Lote O recibido; modelo de puntitos (colorante, sal, aire en jeringa), familia `particles`, 13.ª unidad abierta; sin mecanismos atómicos formales |
| CI-23 | C3-U07 «Tiempo y clima» (3.º) — lote M | ✅ | A | Lote M recibido; registro de tres pueblos (tabla, barras de lluvia, comparación), familia `climate`, 14.ª unidad abierta; datos de práctica |
| CI-24 | C2-U08 «Una Tierra que cambia» (2.º) — lote L | ✅ | A | Lote L recibido; sucesos rápidos y lentos con dos pistas, bandejas con plantas (sin gramos); familia `earth`; 15.ª unidad abierta |
| CI-25 | C1-U01 «Vibraciones» (1.º) — lote K | ✅ | A | Lote K recibido; mesa de vibraciones (regla, tambor con arroz, ligas), familia `vibration`; 16.ª unidad abierta |
| CI-26 | C4-U03 «Transferir y transformar» (4.º) — lote N | ✅ | A | Lote N recibido; tres dispositivos (lámpara, campana, molinete), diagrama de lo que entra y lo que sale, familia `energy`; 17.ª unidad abierta |
| CI-27 | C6-U07 «Evidencias de cambio» (6.º) — lote P | ✅ | A | Lote P recibido; series de práctica (temperatura, CO2, Sol, erupciones) y cadena del mecanismo, familia `trend`; 18.ª unidad abierta. Con esto la **Tanda 4 está completa**. Un docente debe revisar el tono de las conclusiones |

---

## Sociedad — solo la cuenta de Sociedad edita estas filas (`docs/14`, `docs/handoff/sociedad.md`)

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| PREP-1 | Preparación: módulo, registro, paquete vacío, guardado por materia, protocolo | ✅ | A | enchufado como "Pronto" |
| SO-01 | Prompt de investigación de Sociedad → Victor lo corre | ✅ | B | resultado: `docs/research/sociedad-investigacion.md` |
| SO-02 | Especificación visual/interactiva en `docs/design/sociedad/` | ✅ (v2) | B | `UNIDAD-PILOTO-S3-U03.md`; elenco cambiado a Inés/Teo/Elena (DS-4), caso "El paso del arroyo" |
| SO-03 | Lista de imágenes por tandas + manifiesto | ✅ | B | las 8 piezas llegaron (7 + `cover_sociedad` del adendo), convertidas y conectadas |
| SO-04 | Dominio puro en `packages/social-content` + pruebas | ✅ | B | `contracts/src/social.ts` (motor generalizado: +paso `'elegir'`), 6 unidades (1.º–6.º) en `content/`, 19 pruebas |
| SO-05 | Textos ES/EN en `ui-core/src/sociedad/` | ✅ | B | `SOCIAL_COPY`; el dominio devuelve claves, no texto |
| SO-06 | Pantallas del cuaderno de Sociedad (con Modo Enfoque) | ✅ | B | cuaderno = camino de 6 unidades (como Matemáticas); `available: true` |
| SO-07 | Verificar en 4 tamaños y `available: true` | ✅ (parcial) | B | typecheck + test ✅ (1222/1222); sin verificación visual en equipo real (ver handoff) |
| SO-08 | Revisión de un maestro (estándares: borrador) | ⬜ | – | pendiente real; atención extra a 4.º/5.º (temas sensibles) |
| SO-09 | 3 imágenes que faltan (2.º, 4.º, 6.º) | ✅ | B | llegaron, convertidas y conectadas — las 6 unidades tienen todo su arte |
| SO-10 | Investigación de validación histórica (prompt propio) → correcciones aplicadas | ✅ | B | 4.º y 5.º revisión profunda (cita/opciones corregidas), 1.º/2.º/6.º cambios menores (estándar, enfoque); no sustituye SO-08 |

## Arte y música — cuaderno `arte` (D14, `docs/design/artes/ESPECIFICACION.md`, `docs/handoff/artes.md`)

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| AR-01 | Investigación de Artes y de los módulos «Para la vida» recibida y copiada | ✅ | A | `docs/research/artes-investigacion.md`, `vida-*.md` |
| AR-02 | Especificación adaptada al repo + decisión D14 | ✅ | A | `docs/design/artes/ESPECIFICACION.md` |
| AR-T1 | Prueba técnica de audio: motor puro (`packages/music-engine`), `FakeAudioOutput`, 16 sonidos sintetizados elegibles por fila, pantalla «Prueba de audio» | ✅ | A | Tableta de Victor: 4 corridas de 5 min (60/90/120/140 BPM), todas «parejo», 0 congelamientos. Falta solo la comprobación corta de salir a segundo plano y volver |
| AR-T2 | Prueba técnica del lienzo: `packages/art-content` (22 pruebas) + pantalla «Prueba del lienzo» con motor **SVG** (por defecto) y **Skia** | 🟡 | A | Skia hizo que la app se cerrara en la tableta de Victor (fallo nativo, sin registro). SVG en la tableta: 1 min, 13 trazos, 0 cuadros lentos, «todo bien»; faltan dos dedos/palma y lápiz. Skia queda opcional hasta tener `adb logcat -b crash -d` |
| AR-T3 | Prueba técnica 3D (`expo-gl`) | ⬜ | – | después de AR-T2 |
| AR-03 | Módulo `arte` enchufado (portada, inicio con Taller libre y creaciones) + modelo de proyecto editable en `packages/art-content` (guardado validado por niño, versiones A/B, topes) + Taller libre de ritmo con guardado automático | ✅ | A | 37 pruebas del paquete; 1601 en total; verificado en navegador (crear, editar, tocar, nombrar, versiones, duplicar, borrar). Falta probarlo en la tableta con un APK nuevo |
| AR-04 | Unidad guiada A1-U04 «Mi banda deja respirar al silencio»: 6 encuentros (escucha, armar, silencio, otra capa, dos versiones A/B, presentar) sobre el Taller de ritmo, portafolio («Tu carpeta»), estrellas por esfuerzo, cápsula cultural PROVISIONAL inventada y rotulada | ✅ | A | 52 pruebas del paquete; verificado en navegador de punta a punta. Falta probarlo en la tableta (APK nuevo) y que Victor confirme temas y escucha cultural reales (DA-1…8) |
| AR-05 | Taller de pintura (Taller libre): lienzo SVG con trazos guardados, paleta de colores por receta y **mezclador de gotas** con modelo didáctico RYB documentado (`MODELO-MEZCLA.md`); escenas de pintura en el proyecto editable | ✅ | A | 79 pruebas del paquete (17 del mezclador); verificado en navegador. Probado en la tableta (APK 0.8.0) |
| AR-05b | Unidad guiada A2-U02 «Colores que se relacionan» (2.º): 6 encuentros (mira dos paletas, mezcla, paleta de 4, primer cuadro, segundo cuadro con la misma paleta, compara) sobre un proyecto de pintura de DOS cuadros; evidencia = relaciona una diferencia con una decisión; estrellas por esfuerzo; sin emociones predeterminadas | ✅ | A | 94 pruebas del paquete; verificado en navegador (tableta y teléfono) de punta a punta. Se extrajeron `PaintArea`/`PaintMixer` del Taller de pintura. Falta probarla en la tableta (APK nuevo) y la portada ilustrada de la unidad (ahora es un recuadro de 4 azules hecho con código) |
| AR-06a | Taller de collage (Taller libre): piezas de papel (6 formas × 10 colores, 6 fondos), arrastrar con un dedo, más grande/pequeña, girar, capas, copiar, quitar, deshacer/rehacer; guardado automático por niño | ✅ | A | 110 pruebas del paquete (16 del collage); verificado en navegador (tableta y teléfono: pegar, arrastrar, capas, deshacer, reabrir). Falta probarlo en la tableta con lápiz y con dos dedos |
| AR-06b | Unidad guiada A1-U06 «Una historia de recortes» (1.º): 6 encuentros (ordenar 3 escenas de ejemplo, probar piezas, idea, escena 1, escenas 2 y 3, cuéntala) sobre un collage de CUATRO cartones; evidencia = ordena escenas, nombra un cambio y cuándo pasa lo más importante; estrellas por esfuerzo; sin emociones predeterminadas | ✅ | A | 129 pruebas del paquete (19 de la unidad); verificado en navegador (tableta y teléfono) de punta a punta. Falta probarla en la tableta y la portada ilustrada (hoy un recuadro de 4 colores hecho con código) |
| AR-06c | Flipbook y recorrido «dibujo → collage → animación» (reutilizar la pintura propia como pieza) | ⬜ | – | |
| AR-07 | Ensamblaje 3D (si AR-T3 pasa) | ⬜ | – | |
| AR-08 | Cápsulas culturales con permisos y revisión de un maestro | ⬜ | – | |
| AR-M0 | Mejoras de Arte (informe 21-oct-2026) · Etapa 0: base recuperable (cerrar y reabrir a mitad de una obra en la tableta; áreas táctiles) | ⬜ | A | `docs/design/artes/PLAN-MEJORAS.md` |
| AR-M1 | Etapa 1 · materialidad y claridad: papel bajo el lienzo, bandeja de materiales con muestras, selección con contorno doble y asas, barra de la pieza junto al cartón (teléfono), celdas vacías legibles, guardado honesto con miniatura | 🟡 | A | **Hecho (solo código):** barra de la pieza debajo del cartón, selección con doble contorno, silencio como círculo hueco y columna activa resaltada en el ritmo, miniaturas de pintura y collage en «Tus creaciones», tarjetas de unidades legibles en teléfono. **Tanda 2 recibida y conectada al collage:** 4 papeles de material (kraft, fibras, cartón, seda) y 8 fondos (2 con textura nueva). **Falta:** papel bajo el lienzo de pintura (la goma pinta del color del papel: hay que hacerla borrar de verdad) y bandeja de materiales con muestras |
| AR-M2 | Etapa 2 · «Mi museo» (galería, continuar, duplicar, versiones, marcos) | ✅ | A | Pared + marcos de colores (elige el niño) + filtros con carpetas; solo en el dispositivo (DA-12). Duplicar/versiones siguen dentro de cada taller |
| AR-M3 | Etapa 3 · profundidad: 3 pinceles, simetría/duplicar, papeles y bordes rasgados, una obra real por unidad con créditos, comparación A/B de ritmo | ⬜ | A | Necesita DA-9/10/11 y licencias verificadas |
| AR-M4 | Etapa 4 · una sola apuesta grande (flipbook AR-06c, recorte libre o mezcla avanzada) | ⬜ | – | Después del museo y del rendimiento medido |

## Finanzas — cuaderno `finanzas` («Para la vida» módulo 01, D14; `docs/design/finanzas/ESPECIFICACION.md`, `docs/handoff/finanzas.md`)

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| FI-01 | Investigación del módulo recibida y copiada | ✅ | A | `docs/research/vida-01-economia-finanzas.md` |
| FI-02 | Especificación adaptada al repo + piloto 4.º + decisiones DF-1…DF-8 (propuestas) | ✅ | A | pendiente de confirmar por Victor |
| FI-03 | Dominio puro del piloto: UM, libro de movimientos, sobres/imprevistos, costo de oportunidad, ofertas sospechosas | ✅ | A | `packages/finance-content`, 21 pruebas |
| FI-04 | Lista de imágenes del piloto (portada, escenas, guía) por tanda | ✅ | A | `PEDIDO-IMAGENES.md`; Victor las genera |
| FI-05 | Unidad F4-U01 en JSON validado + estrellas por esfuerzo | ✅ | A | `content/f4u01.json`, `session.ts`, `validate.ts`; 44 pruebas |
| FI-06 | Textos ES/EN en `ui-core/src/finanzas/` | ✅ | A | `copy.ts` + prueba |
| FI-07 | Módulo de app `subjects/finanzas/` (cuaderno, sobres, libro, buzón, proyecto) + estantería «Para la vida» | ✅ | A | arte provisional dibujado en código; compartido tocado: ids, registry, subjects, store, tokens, mi-cuaderno |
| FI-08 | Verificar en 4 tamaños + revisión de un educador financiero | ⬜ | – | |

## Para la vida 02–08 — cuadernos `emociones`, `comunicacion`, `digital`, `critico`, `autonomia`, `organizacion`, `emprendimiento` (D14/D16; `docs/handoff/vida.md`)
| ID | Qué | Estado | Cuenta | Notas |
|---|---|---|---|---|
| PV-01 | Motor de misiones compartido + validador (`packages/life-content`) | ✅ | A | elegir/ordenar/detectar + «Explica» + estrellas por esfuerzo |
| PV-02 | 7 misiones «Primer vistazo» ES/EN (3 encuentros cada una) | ✅ | A | 04–08 sin investigación completa: revisión de especialista antes de ampliar |
| PV-03 | 7 cuadernos en la app + fila «Para la vida» en Inicio | ✅ | A | arte provisional en código |
| PV-04 | Mega pedido de imágenes (43) | ✅ | A | `docs/design/vida/PEDIDO-IMAGENES-MEGA.md`; Victor las genera |
| PV-05 | Conectar imágenes reales (portadas, escenas, guías) | ✅ | A | 43 imágenes (Partes 1 y 2) en WebP, `subjects/vida/art.ts`, manifiesto SHA-256 |
| PV-06 | Investigar y ampliar 04–08 (una investigación por módulo) | ⬜ | A | no se programa antes de investigar |
| PV-07 | Revisión de especialistas y prueba con niños | ⬜ | – | |

## Piloto de lectura por escenas (Victor, 2026-10-22)

| ID | Tarea | Estado | Nota |
|---|---|---|---|
| LE-01 | El puente de las luciérnagas: escenas, letra ajustable, ayuda de todas las palabras, preguntas y repaso | ✅ | Lector libre nativo, ES/EN; lógica, TypeScript y recorrido Chromium en cuatro tamaños. `docs/design/reading-pilot/README.md` |
| LE-02 | El mapa de la puerta desaparecida (Inés y Teo): adaptar arte y lectura larga | ✅ | Veinte páginas conservadas, fragmentos estables ES/EN, arte revisado y carta de Elena nueva; recorridos completos, ayuda, reanudación, preguntas y repaso comprobados. Pendiente dispositivo físico |
| LE-03 | Integrar ambos cuentos en master por petición de Victor | ✅ | Fast-forward sin conflictos; requisitos de APK resueltos en LE-04 |
| LE-04 | Preparar herramientas y generar APK con ambos cuentos | ✅ | Release universal desde 4fefbef, 610 tareas; firma, alineación y modelos/arte verificados. Metadatos en `docs/design/reading-pilot/APK-VERIFICATION.json`; pendiente probar en dispositivo |
| LE-05 | Alojar APK en una descarga HTTPS para el teléfono | ✅ | GitHub prerelease `apk-lectura-2026-10-22`; workflow y descarga HTTP 200, checksum/firma/modelos/arte comprobados. `DOWNLOAD-VERIFICATION.json` |
| LE-06 | Recuperar portadas de cuadernos en Android y publicar APK corregido | ✅ | Causa reproducida con Yoga; 84 comprobaciones nativas, 14 cuadernos en cinco tamaños web, 1.838 pruebas. APK `apk-lectura-2026-10-22-cuadernos-r2` descargado y verificado; mismo certificado. `DOWNLOAD-CUADERNOS-VERIFICATION.json` |
| LE-07 | Lectura compacta, ventanas plegables y ES/EN consistente | ✅ | 1.843 pruebas, 168 portadas Yoga, 24 casos de interfaz y ambos cuentos ES/EN. APK 0.1.1 publicado y descargado/verificado; pendiente Fold físico. `docs/design/fold-and-language/README.md` |
| LE-08 | Ilustraciones ampliables: pellizco, arrastre, botones, volver al mismo fragmento y cambios de orientación | ✅ | 12 casos táctiles ES/EN; zoom 1–4×, controles 48 dp, sin dependencias nuevas. `docs/design/reading-catalog/` |
| LE-09 | Continuar el resto de los cuentos con el lector por escenas | ✅ | 23 familias nuevas, 25 totales / 81 variantes; arte y texto preservados, encuadres revisados, texto solo cuando no hay ilustración. 1.943 pruebas, 49 recorridos completos, exportación Android; sin APK nuevo |
| LE-10 | Publicar APK con zoom y los 25 cuentos adaptados | ✅ | 0.1.2 / código 3 publicado; HTTP 200, checksum/digest, misma firma, 169 recursos, 25 ediciones y zoom verificados. `docs/design/reading-catalog/APK-VERIFICATION.json` |

## Motor de lectura con voz (investigación solicitada por Victor, 2026-10-22)

| ID | Tarea | Estado | Nota |
|---|---|---|---|
| VZ-01 | Investigar Gboard/Android, motores locales, APIs, estudios infantiles y proyectos similares | ✅ | Informe, auditoría, plan, 76 referencias y PDF de 54 páginas en `docs/research/lectura-con-voz/`; sin activar voz ni alterar D1 |
| VZ-02 | Separar hipótesis/cursor/cobertura y corregir falsos avances del motor experimental | ✅ | `ReadingFollower`, controlador y regresiones de falsos rangos; evidencia final y tiempos limitados. |
| VZ-03 | Diagnóstico Android de reconocimiento estrictamente local ES/EN en Fold | 🟡 | Código/lifecycle/compilación release aprobados; Prueba de voz conserva Whisper y añade Android. Fold/idiomas reales pendientes. |
| VZ-04 | Comparar streaming local EN/ES con referencia Whisper | ⬜ | Moonshine candidato; Sherpa/Picovoice alternativas. Compatibilidad, licencia, latencia, falsos avances, memoria y batería |
| VZ-05 | Integrar primer recorrido acompañado preservando manual y ayuda por palabra | ✅ | `docs/design/read-together/`: Android local, alternativa Whisper, micrófono único, TTS/zoom/pausas y tiempos. APK 0.2.0/código 4 r3 publicado y verificado; validación física pendiente. |
| VZ-06 | Calibración breve con lectura real sin grabar/subir voz | ⬜ | Sesiones amables y métricas agregadas; no generalizar una voz a toda la población infantil |
| VZ-07 | Elegir motor y alcance publicable según resultados | ⬜ | Dispositivos/idiomas comprobados, limitaciones explícitas; pronunciación fonética evaluada como proyecto aparte |
| VZ-08 | Investigar cierre de Leer juntos y publicar actualización con diagnóstico local mínimo | 🟡 | APK 0.2.1/código 5 publicado y verificado, CI 40015852789; contención nativa, regresión JVM e informe local mínimo. Confirmar causa exacta/resolución en Fold. `docs/design/read-together/CRASH-FIX.md` |
| VZ-09 | Recuperación de permiso y reporte visible tras repetición del cierre de 0.2.1 | 🟡 | APK 0.2.2/código 6 publicado/verificado, CI 40023754028; Queues.MAIN, permiso/ajustes y reporte siempre visible con etapas/salidas Android. Confirmar diálogo y causa/resolución física en Fold. `docs/design/read-together/PERMISSION-FIX.md` |

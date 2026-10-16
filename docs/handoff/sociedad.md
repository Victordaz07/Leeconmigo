# HANDOFF — Sociedad
Actualizado: 2026-10-16 · Cuenta: B · Rama: `claude/sociedad-victor` · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Sociedad**; la otra cuenta trabaja **Ciencia** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
**6 unidades piloto, una por grado (1.º–6.º), todas completas y jugables, con TODO su arte ya conectado.** Mismo
elenco en las 6: Inés y Teo (de "El mapa de la puerta desaparecida", DS-4), guiados por Teo. El cuaderno de
Sociedad es un camino de 6 paradas (como Matemáticas), no una sola unidad. `available: true` en el módulo y en
`SUBJECTS` — ya no se ve "Pronto" en Inicio.

| Grado | Unidad | Fuentes/motor | Arte |
|---|---|---|---|
| 1.º | S1-U01 "Una regla para compartir" | puro razonamiento (`elegir`) | no necesita (solo Teo) |
| 2.º | S2-U01 "Un cuaderno tiene historia" | mapa+testimonio, observación vs. inferencia | ✅ `cuaderno_viejo` |
| 3.º | S3-U03 "El paso del arroyo" | mapa por capas + mesa de fuentes | ✅ completa |
| 4.º | S4-U03 "Un edificio y las voces que le faltan" | fuente+testimonio, tema sensible | ✅ `edificio_mision` |
| 5.º | S5-U04 "Un ideal escrito y una realidad histórica" | 2 testimonios + clasificar, tema sensible | no necesita (a propósito) |
| 6.º | S6-U02 "Un asentamiento junto al río" | simulación ficticia, puro razonamiento | ✅ `asentamiento_mapa` |

Hecho: SO-01 a SO-09 para las 6 (ver checklist). Pendiente real: **solo SO-08** (revisión de un maestro, con
atención extra a 4.º y 5.º por temas sensibles) y la verificación visual en equipo real.

## Antes de empezar
1. Lee `docs/14-MATERIAS-EN-PARALELO.md` y `docs/design/subjects/PATRON-MATEMATICAS.md`.
2. Lee `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md` y `docs/design/sociedad/UNIDADES-PILOTO-OTROS-GRADOS.md`
   (las 6 especificaciones) y `docs/research/sociedad-investigacion.md` (la investigación completa de Victor).
3. `git fetch origin master && git merge origin/master`, `npm ci --ignore-scripts` si hace falta, `npm test`.

## Qué se construyó

| Pieza | Dónde |
|---|---|
| Contrato (`SocialUnit`, `SocialStep` con 6 tipos de paso, `SocialSource`…) | `packages/contracts/src/social.ts` |
| Contenido de las 6 unidades (JSON, ES/EN) | `packages/social-content/content/{s1u01,s2u01,s3u03,s4u03,s5u04,s6u02}.json` |
| Dominio puro: sesión (reducer), validador, evaluación, estrellas (generalizadas para unidades sin fuentes) | `packages/social-content/src/{session,validate,units}.ts` |
| Textos de interfaz ES/EN (no específicos de una unidad) | `packages/ui-core/src/sociedad/copy.ts` (`SOCIAL_COPY`) |
| Componentes: Teo (guía), mapa por capas, tarjeta de fuente, lista de opciones, afirmación clasificable | `packages/ui-native/src/components/sociedad/` |
| Arte convertido a WebP (<350 KB escenas, <40 KB poses) | `apps/mobile/assets/sociedad/{covers,scenes,chars}/`, mapeado en `apps/mobile/src/sociedad-art.ts` |
| Pantallas: cuaderno (camino de 6 unidades) e investigación (hasta 7 pasos + cierre) | `apps/mobile/src/screens/sociedad-notebook-screen.tsx`, `sociedad-investigation-screen.tsx` |
| Módulo enchufado, `available: true`, progreso por unidad y por niño | `apps/mobile/src/subjects/sociedad/index.tsx` (`SociedadProgress` = un registro por unidad) |

**El motor de pasos se generalizó** (no se quedó solo en "mapa por capas + mesa de fuentes" de 3.º): se agregó
un tipo de paso `'elegir'` (elección razonada sin una fuente concreta — 1.º y 6.º lo usan) y `'pregunta'` ahora
acepta una sola imagen o ninguna, no solo 2 capas para comparar. Nunca "incorrecto": una opción no preferida da
una pista suave, nunca bloquea seguir (`feedbackFor`).

**Estrellas del cierre (D11, por esfuerzo), generalizadas:** en unidades CON fuentes (2.º, 3.º, 4.º, 5.º) siguen
igual (terminar + usar ≥2 fuentes + identificar el hueco real). En unidades SIN fuentes (1.º, 6.º), la 2.ª y
3.ª estrella dependen de `choiceQuality` — qué tan seguido el niño quedó con una opción preferida entre los
pasos de elección — nunca de "adivinar".

## Lo que falta / siguiente paso exacto

1. **SO-08 — revisión de un maestro**, las 6, con **atención extra a 4.º y 5.º** (temas sensibles: misiones,
   esclavitud): se escribió con mucho cuidado (texto propio, no fuentes reales reclamadas, sin escenas gráficas
   ni juegos de dominación, siguiendo las precauciones explícitas de `docs/research/sociedad-investigacion.md`
   §10), pero un maestro de verdad tiene que confirmar que el tono y el contenido están bien antes de que
   cualquier niño las use. `standardsReview.confidence: "lowSensitiveTopic"` en esas dos, para que se note la
   diferencia con las demás.
2. **Verificación visual en 4 tamaños**: solo se verificó `npm run typecheck` (monorepo completo, limpio) y
   `npm test` (**1222/1222** ✅). **No se corrió la app real** — `expo export --platform android` llegó hasta
   1302 módulos y falló en un punto **no relacionado** (modelos de voz `.bin` ausentes, sin red en esta sesión
   para bajarlos). Falta que Victor la abra en su Android/tablet cuando pida el próximo APK.
3. **Sin reanudar a medias**: cerrar una investigación y volver a abrirla empieza de cero. Aceptable por ahora;
   si se siente mal en uso real, guardar `stepIndex` y las respuestas parciales.
4. **"Otra vez" del cierre** vuelve al cuaderno, no reinicia en el lugar. Simple y seguro, pero no es "otra vez"
   literal como en Lectura.
5. Lo que ya se dejó fuera a propósito del pedido de imágenes original (fondo de pantallas, 5.ª pose de Teo,
   marcador de progreso tipo "papalote") sigue para un pedido futuro, una vez que haya más pantallas construidas
   que digan qué hace falta de verdad.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
- **DS-1**: nombre en la interfaz **Sociedad**; nombre completo **Estudios Sociales / Social Studies**. Base
  curricular: California History–Social Science + C3 Framework (NCSS).
- **DS-2 (parqueada, NO aplicada)**: la investigación proponía ciruela `#7B4B6A` para `subjSociedad`. **No se
  aplicó**: el token vive en `packages/ui-native/src/tokens.ts`, que una prueba (`tests/tokens.test.ts`) exige
  que coincida EXACTO con `docs/design/kitewise/tokens.css` (la referencia de diseño original de Victor, D9).
  Cambiarlo ahí también es una decisión aparte, más grande que un ajuste de Sociedad — se dejó el naranja
  `#f08a10` ya aprobado en el diseño. Si Victor quiere el ciruela, hay que actualizar los dos archivos juntos.
- **DS-3 (confirmada)**: unidad piloto de 3.º, **S3-U03**, "El paso del arroyo".
- **DS-4 (confirmada)**: elenco **Inés y Teo** (de "El mapa de la puerta desaparecida") en las 6 unidades, con
  un caso nuevo cada vez — nunca el mismo misterio del libro.
- **DS-5 (propuesta, 2026-10-16):** las 6 unidades piloto (una por grado) descritas arriba, construidas de una
  vez a pedido de Victor. Las unidades de 4.º y 5.º tocan temas sensibles (misiones, esclavitud) — tratadas con
  cuidado (texto original, sin fuentes reales reclamadas) pero **necesitan confirmación explícita de Victor
  y/o revisión de un maestro antes de que Noah u otro niño las use**, más que las demás.

## Pedidos a lo compartido
- `MovementBreakScreen` (`apps/mobile/src/screens/movement-break-screen.tsx`) no recibe el fondo por prop: usa
  `MATH_BACKGROUNDS` de Matemáticas siempre. Si se quiere un fondo propio de Sociedad, hay que agregarle un prop
  `background` opcional (cambio chico, pero toca un archivo compartido) — anotado, no hecho todavía.

## Cuidado con
- Guardado: `subjectStorageFor('sociedad', profile.id, …)` — ahora `SociedadProgress` es un registro por unidad
  (`Record<unitId, {stepsDone, stars}>`), no un solo progreso. Validado por `isSociedadProgress`.
- No hay APK hasta que Victor lo pida.
- Nada de audio ni texto reconocido guardado; sin SDKs de terceros.
- Antes de agregar una 7.ª unidad: revisar si el paso que necesitas ya existe (`pregunta`, `comparar`, `fuente`,
  `testimonio`, `elegir`, `explicar`, `revisar`) antes de inventar un tipo de paso nuevo.

## Estado de pruebas
`npm test`: **1222/1222 ✅** (1202 + 20 nuevas: dominio de las 6 unidades, validación, textos ES/EN). `npm run
typecheck` en todo el monorepo: limpio. `expo export --platform android`: llega a 1302 módulos, falla por
modelos de voz ausentes (no relacionado con Sociedad).

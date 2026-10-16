# HANDOFF — Sociedad
Actualizado: 2026-10-16 · Cuenta: B · Rama: `claude/sociedad-victor` · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Sociedad**; la otra cuenta trabaja **Ciencia** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
**La unidad piloto está completa y jugable de principio a fin.** S3-U03, "El paso del arroyo" (3.º, CA HSS 3.3,
borrador): Inés, Teo y la abuela Elena (de "El mapa de la puerta desaparecida", DS-4) investigan por qué la
calle de la abuela tiene hoy un puente donde un plano viejo solo mostraba piedras para cruzar. `available: true`
en el módulo y en `SUBJECTS` — ya no se ve "Pronto" en Inicio.

Hecho: SO-01 a SO-07 (ver checklist). Pendiente real: SO-08 (revisión de un maestro) y algunos ajustes menores
que quedaron anotados abajo en "Lo que falta / siguiente paso".

## Antes de empezar
1. Lee `docs/14-MATERIAS-EN-PARALELO.md` y `docs/design/subjects/PATRON-MATEMATICAS.md`.
2. Lee `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md` (la especificación) y `docs/research/sociedad-investigacion.md`
   (la investigación completa de Victor — 48 unidades futuras posibles, base del diseño).
3. `git fetch origin master && git merge origin/master`, `npm ci --ignore-scripts` si hace falta, `npm test`.

## Qué se construyó (SO-04 a SO-07)

| Pieza | Dónde |
|---|---|
| Contrato (`SocialUnit`, `SocialStep`, `SocialSource`…) | `packages/contracts/src/social.ts` |
| Contenido de la unidad (JSON, ES/EN) | `packages/social-content/content/s3u03.json` |
| Dominio puro: sesión (reducer), validador, evaluación, estrellas | `packages/social-content/src/{session,validate,units}.ts` |
| Textos de interfaz ES/EN (no específicos de una unidad) | `packages/ui-core/src/sociedad/copy.ts` (`SOCIAL_COPY`) |
| Componentes de pantalla: Teo (guía), mapa por capas, tarjeta de fuente, lista de opciones, afirmación clasificable | `packages/ui-native/src/components/sociedad/` |
| Arte convertido a WebP y dentro del presupuesto (<350 KB escenas, <40 KB poses) | `apps/mobile/assets/sociedad/{covers,scenes,chars}/`, mapeado en `apps/mobile/src/sociedad-art.ts` |
| Pantallas: cuaderno (portada + botón empezar/de nuevo) e investigación (6 pasos + cierre) | `apps/mobile/src/screens/sociedad-notebook-screen.tsx`, `sociedad-investigation-screen.tsx` |
| Módulo enchufado, `available: true`, guardado por niño | `apps/mobile/src/subjects/sociedad/index.tsx` (usa `subjectStorageFor`, ya compartido) |

Las 6 sesiones (pregunta → comparar → fuente → testimonio → explicar → revisar) siguen exactamente
`docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`. Nunca "incorrecto": una opción no preferida da una pista suave
(`feedbackFor` → `'gentle'`) y siempre se puede seguir. Las estrellas del cierre (D11, por esfuerzo) usan
`investigationStars`: 1 por terminar, +1 por usar ≥2 fuentes, +1 por identificar el hueco real en "revisar" — no
por adivinar.

## Lo que falta / siguiente paso exacto

1. **SO-08 — revisión de un maestro.** El estándar CA HSS 3.3 sigue como borrador (`standardsReview`), solo
   visible a padres. No se ha validado con un docente.
2. **Verificación visual en 4 tamaños**: solo se verificó `npm run typecheck` (monorepo completo, limpio) y
   `npm test` (1218/1218 ✅). **No se corrió la app real** — `expo export --platform android` llegó hasta 1302
   módulos y falló en un punto **no relacionado** (los modelos de voz `.bin` no están en git, como ya documenta
   `HANDOFF.md`; no hay red en esta sesión para bajarlos). Los archivos de arte de Sociedad se verificaron a mano
   (existen en las rutas exactas que usa `require()`). Falta que Victor la abra en su Android/tablet cuando pida
   el próximo APK.
3. **Sin reanudar a medias**: cerrar la investigación y volver a abrirla empieza de cero (no retoma el paso
   3 si saliste ahí). Aceptable para una investigación corta de 6 pasos; si se siente mal en uso real, hay que
   guardar `stepIndex` y las respuestas parciales, no solo el resultado final.
4. **"Otra vez" del cierre** (`ClosingCard.onAgain`) hoy vuelve al cuaderno, no reinicia en el lugar. Simple y
   seguro, pero no es "otra vez" en el sentido literal de Lectura (quedarse leyendo). Ajustar si Victor lo nota raro.
5. **Pausa de movimiento** (Modo Enfoque) reusa `MovementBreakScreen`, que hoy trae su propio fondo de
   Matemáticas (no acepta un fondo por `prop`) — ver "Pedidos a lo compartido" abajo.
6. Todo lo que ya se dejó fuera a propósito en el pedido de imágenes (fondo de pantallas, 5.ª pose de Teo,
   marcador de progreso tipo "papalote") sigue para un pedido 2 real, ahora que sí hay pantallas construidas que
   pueden decir qué hace falta de verdad.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
- **DS-1**: nombre en la interfaz **Sociedad**; nombre completo **Estudios Sociales / Social Studies**. Base
  curricular: California History–Social Science + C3 Framework (NCSS).
- **DS-2 (parqueada, NO aplicada)**: la investigación proponía ciruela `#7B4B6A` para `subjSociedad`. **No se
  aplicó**: el token vive en `packages/ui-native/src/tokens.ts`, que una prueba (`tests/tokens.test.ts`) exige
  que coincida EXACTO con `docs/design/kitewise/tokens.css` (la referencia de diseño original de Victor, D9).
  Cambiarlo ahí también es una decisión aparte, más grande que un ajuste de Sociedad — se dejó el naranja
  `#f08a10` ya aprobado en el diseño. Si Victor quiere el ciruela, hay que actualizar los dos archivos juntos.
- **DS-3 (confirmada)**: unidad piloto **S3-U03**, "El paso del arroyo".
- **DS-4 (confirmada)**: elenco **Inés, Teo y la abuela Elena** (de "El mapa de la puerta desaparecida"), con un
  caso nuevo cada vez — nunca el mismo misterio del libro.

## Pedidos a lo compartido
- `MovementBreakScreen` (`apps/mobile/src/screens/movement-break-screen.tsx`) no recibe el fondo por prop: usa
  `MATH_BACKGROUNDS` de Matemáticas siempre. Si se quiere un fondo propio de Sociedad en la pausa de movimiento,
  hay que agregarle un prop `background` opcional (cambio chico, pero toca un archivo compartido) — anotado,
  no hecho todavía.

## Cuidado con
- Guardado: `subjectStorageFor('sociedad', profile.id, …)`, validado por `isSociedadProgress` en
  `subjects/sociedad/index.tsx` — si cambia la forma, subir la validación para que rechace lo viejo.
- No hay APK hasta que Victor lo pida.
- Nada de audio ni texto reconocido guardado; sin SDKs de terceros.

## Estado de pruebas
`npm test`: **1218/1218 ✅** (1202 + 16 nuevas: dominio, validación, textos ES/EN). `npm run typecheck` en todo
el monorepo: limpio. `expo export --platform android`: llega a 1302 módulos, falla por modelos de voz ausentes
(no relacionado con Sociedad, ver punto 2 arriba).

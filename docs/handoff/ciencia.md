# HANDOFF — Ciencia
Actualizado: 2026-10-16 · Cuenta: A · Rama: (la de tu sesión) · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Ciencia**; la otra cuenta trabaja **Sociedad** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
Preparación hecha (PREP-1): el módulo `apps/mobile/src/subjects/ciencia/` está registrado y enchufado a la app, el paquete
`packages/science-content` existe vacío y el guardado por materia funciona. **No hay contenido, ni arte, ni investigación.**
En Inicio Ciencia se ve como "Pronto" (`available: false`).

## Antes de empezar
1. Lee `docs/14-MATERIAS-EN-PARALELO.md` y `docs/design/subjects/PATRON-MATEMATICAS.md` (el patrón y los errores ya cometidos).
2. Lee `CLAUDE.md` (reglas de privacidad, arte y texto separados, DECISIÓN/PENDIENTE) y `docs/DECISIONS.md`.
3. `git fetch origin master && git merge origin/master`, `npm ci --ignore-scripts` si hace falta, `npm test`.
4. Unidad piloto propuesta en el diseño: **Erosión y agua (4.º)** (`NGSS 4-ESS2-1`, borrador sin validar). Ojo: el nivel de la app NO es el
   grado escolar (docs/01); pregunta a Victor en qué nivel debe empezar.

## Siguiente paso exacto
**CI-01 — NO programar todavía.** Escribe el prompt de investigación para Victor (como el de Matemáticas:
`docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md`): cómo se enseña y se practica Ciencia en una escuela
real por grado (qué actividades, qué manipulan, qué errores comunes, qué vocabulario), cómo se ve en pantalla, y qué NO
debe parecer "de preescolar". Guárdalo en `docs/research/PROMPT-INVESTIGACION-CIENCIA.md`, avísale a Victor para que
lo corra y espera el resultado en `docs/research/`. Mientras tanto, puedes avanzar en paralelo sin riesgo con:
- la lista de imágenes a pedir (partiendo de `docs/design/kitewise/ART-BRIEF.md`; portada + escenas por lección + diagramas sin etiquetas; ambiente de costa/humedal), sin pedirlas hasta tener la
  especificación;
- el esquema de la unidad en JSON (sin contenido final).

## Checklist
- [ ] CI-01 Prompt de investigación de Ciencia → Victor lo corre
- [ ] CI-02 Especificación visual/interactiva en `docs/design/ciencia/` (qué se manipula, qué error se nombra, cómo se evalúa)
- [ ] CI-03 Lista de imágenes por tandas + manifiesto (Victor las genera)
- [ ] CI-04 Dominio puro en `packages/science-content` (unidades JSON, validador, generador con semilla, dominio, pruebas)
- [ ] CI-05 Textos ES/EN en `packages/ui-core/src/ciencia/`
- [ ] CI-06 Pantallas del cuaderno en `subjects/ciencia/` (con Modo Enfoque: `focus`)
- [ ] CI-07 Verificar en 4 tamaños, documentar, `available: true`
- [ ] CI-08 Revisión de un maestro (estándares: solo padres, borrador)

## Cuidado con
- No edites lo compartido (docs/14). Si lo necesitas, anótalo abajo en "Pedidos a lo compartido".
- Guardado: `subjectStorageFor('ciencia', profile.id, vacío, esValido)`; la forma de lo guardado la decides tú, pero la
  validación debe rechazar lo viejo si la cambias.
- No hay APK hasta que Victor lo pida.
- Nada de audio ni texto reconocido guardado; sin SDKs de terceros.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
_(ninguna todavía — usa `DC-1`, `DC-2`…)_

## Pedidos a lo compartido
_(ninguno todavía)_

## Estado de pruebas
Al dejar la preparación: `npm test` todo en verde (1201+ pruebas) y `npm run typecheck` limpio.

# HANDOFF — Sociedad
Actualizado: 2026-10-16 · Cuenta: B · Rama: (la de tu sesión) · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Sociedad**; la otra cuenta trabaja **Ciencia** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
Preparación hecha (PREP-1): el módulo `apps/mobile/src/subjects/sociedad/` está registrado y enchufado a la app, el paquete
`packages/social-content` existe vacío y el guardado por materia funciona. **No hay contenido, ni arte, ni investigación.**
En Inicio Sociedad se ve como "Pronto" (`available: false`).

## Antes de empezar
1. Lee `docs/14-MATERIAS-EN-PARALELO.md` y `docs/design/subjects/PATRON-MATEMATICAS.md` (el patrón y los errores ya cometidos).
2. Lee `CLAUDE.md` (reglas de privacidad, arte y texto separados, DECISIÓN/PENDIENTE) y `docs/DECISIONS.md`.
3. `git fetch origin master && git merge origin/master`, `npm ci --ignore-scripts` si hace falta, `npm test`.
4. Unidad piloto propuesta en el diseño: **Regiones de California (4.º)** (`HSS 4.1`, borrador sin validar). Ojo: el nivel de la app NO es el
   grado escolar (docs/01); pregunta a Victor en qué nivel debe empezar.

## Siguiente paso exacto
**SO-01 — NO programar todavía.** Escribe el prompt de investigación para Victor (como el de Matemáticas:
`docs/research/PROMPT-INVESTIGACION-PROBLEMAS-MATEMATICAS.md`): cómo se enseña y se practica Sociedad en una escuela
real por grado (qué actividades, qué manipulan, qué errores comunes, qué vocabulario), cómo se ve en pantalla, y qué NO
debe parecer "de preescolar". Guárdalo en `docs/research/PROMPT-INVESTIGACION-SOCIEDAD.md`, avísale a Victor para que
lo corra y espera el resultado en `docs/research/`. Mientras tanto, puedes avanzar en paralelo sin riesgo con:
- la lista de imágenes a pedir (partiendo de `docs/design/kitewise/ART-BRIEF.md`; el mapa va por capas separadas y tocables: Costa, Valle Central, Sierra Nevada y Desierto), sin pedirlas hasta tener la
  especificación;
- el esquema de la unidad en JSON (sin contenido final).

## Checklist
- [ ] SO-01 Prompt de investigación de Sociedad → Victor lo corre
- [ ] SO-02 Especificación visual/interactiva en `docs/design/sociedad/` (qué se manipula, qué error se nombra, cómo se evalúa)
- [ ] SO-03 Lista de imágenes por tandas + manifiesto (Victor las genera)
- [ ] SO-04 Dominio puro en `packages/social-content` (unidades JSON, validador, generador con semilla, dominio, pruebas)
- [ ] SO-05 Textos ES/EN en `packages/ui-core/src/sociedad/`
- [ ] SO-06 Pantallas del cuaderno en `subjects/sociedad/` (con Modo Enfoque: `focus`)
- [ ] SO-07 Verificar en 4 tamaños, documentar, `available: true`
- [ ] SO-08 Revisión de un maestro (estándares: solo padres, borrador)

## Cuidado con
- No edites lo compartido (docs/14). Si lo necesitas, anótalo abajo en "Pedidos a lo compartido".
- Guardado: `subjectStorageFor('sociedad', profile.id, vacío, esValido)`; la forma de lo guardado la decides tú, pero la
  validación debe rechazar lo viejo si la cambias.
- No hay APK hasta que Victor lo pida.
- Nada de audio ni texto reconocido guardado; sin SDKs de terceros.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
_(ninguna todavía — usa `DS-1`, `DS-2`…)_

## Pedidos a lo compartido
_(ninguno todavía)_

## Estado de pruebas
Al dejar la preparación: `npm test` todo en verde (1201+ pruebas) y `npm run typecheck` limpio.

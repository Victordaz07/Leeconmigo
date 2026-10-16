# 14 — Dos materias a la vez (Ciencia y Sociedad)

**DECISIÓN (Victor, 2026-10-16, D12):** Ciencia se trabaja en una cuenta de Claude y Sociedad en la otra, al mismo
tiempo. Este documento dice cómo, para que no se pisen. Complementa el "Protocolo de relevo" de `CLAUDE.md`.

## Quién es quién
| Materia | Cuenta | Rama de trabajo | Paquete de contenido | Módulo en la app | IDs en el ROADMAP |
|---|---|---|---|---|---|
| Ciencia | A | `claude/ciencia-*` (o la que asigne la sesión) | `packages/science-content` | `apps/mobile/src/subjects/ciencia/` | `CI-xx` |
| Sociedad | B | `claude/sociedad-*` (o la que asigne la sesión) | `packages/social-content` | `apps/mobile/src/subjects/sociedad/` | `SO-xx` |

Si una cuenta cambia de materia, se cambia aquí y en `docs/handoff/`.

## Qué es de cada cuenta (solo se edita lo propio)
**De Ciencia:** `apps/mobile/src/subjects/ciencia/**`, `packages/science-content/**`, `packages/ui-core/src/ciencia/**`,
`packages/ui-native/src/components/ciencia/**`, `apps/mobile/assets/ciencia/**`, `docs/handoff/ciencia.md`,
`docs/log/ciencia.md`, `docs/design/ciencia/**`, `docs/research/*ciencia*`, sus filas `CI-xx`.

**De Sociedad:** lo mismo con `sociedad` / `social-content` / `SO-xx`.

**Compartido (NO se edita desde una materia sin avisar a Victor):** `apps/mobile/App.tsx`, `home-screen.tsx`,
`subjects/registry.ts`, `subjects/types.ts`, `persist/store.ts`, `ui-core/src/index.ts`, `ui-native/src/index.ts`,
`ui-native/src/components/` (menos su carpeta), `contracts`, `math-content`, `reading-engine`, `session-engine`,
`HANDOFF.md`, `docs/DECISIONS.md`, `CLAUDE.md`, `package.json`.

Si una materia necesita algo de lo compartido (un componente que sirve a las dos, un campo nuevo en `contracts`…):
1. **No lo edites a la carrera.** Escríbelo en tu `docs/handoff/<materia>.md` → sección "Pedidos a lo compartido",
   con qué necesitas y por qué.
2. Si es chico y no choca (p. ej. una línea en un archivo compartido), hazlo en un PR **solo de eso**, pequeño, y avisa.
3. Si lo necesitan las dos, decide Victor quién lo hace; la otra espera o lo duplica en su carpeta por ahora.

## Cómo se enchufa una materia (ya está hecho; no se vuelve a tocar `App.tsx`)
- `subjects/<materia>/index.tsx` exporta un `SubjectModule` (`types.ts`): `available`, `homeCard` y `Screen`.
- `Screen` recibe `profile`, `lang`, `minutes`, `focus` (apoyos del Modo Enfoque) y `onExit`. **La navegación interna es
  suya** (estado local). Para el Modo Enfoque lee apoyos concretos (`focus.reducedMotion`, `focus.movementBreaks`…).
- Cuando haya contenido de verdad: `available: true`. Hasta entonces se ve "Pronto" en la estantería.
- Guardado: `subjectStorageFor('ciencia', profile.id, vacío, esValido)` (`app-state.ts`). Va aparte, por niño, y entra
  solo en "Borrar el progreso". Si cambias la forma de lo guardado, la validación debe rechazar lo viejo.
- Textos ES/EN: en `packages/ui-core/src/<materia>/`. Dibujos de la materia: en `packages/ui-native/src/components/<materia>/`
  o dentro de tu módulo si no los comparte nadie.
- Arte: `apps/mobile/assets/<materia>/`, y su mapa en `subjects/<materia>/art.ts`. Nunca texto dentro de la imagen.

## Ramas, PR y fusión
- Una rama por materia, con commits chicos y push después de cada paso (como siempre).
- **PR pequeños a `master`**, no uno gigante al final. Antes de abrir uno: `git fetch origin master && git merge
  origin/master` en tu rama, corre `npm run typecheck` y `npm test`.
- `package-lock.json`: si hay conflicto, **no lo edites a mano**: acepta el de `master`, corre `npm install
  --ignore-scripts` y commitea el resultado.
- Pruebas: cada cuenta corre todo (`npm test`). Si falla algo que no es suyo, avisa en su handoff y no lo "arregla" en
  silencio (puede ser el trabajo de la otra cuenta a medias).
- Nunca `git push --force` a `master`, ni reescribir ramas de la otra cuenta.

## Relevo (los créditos se acaban en cualquier momento)
- Cada materia tiene SU `docs/handoff/<materia>.md` (estado, siguiente paso exacto, cuidado con, pedidos a lo compartido)
  y SU `docs/log/<materia>.md` (bitácora corta, se agrega al final). `HANDOFF.md` queda para lo general.
- `/retomar ciencia` o `/retomar sociedad` leen lo suyo; `/relevo ciencia` o `/relevo sociedad` lo dejan al día.
- ROADMAP: cada materia tiene su sección (`CI-xx`, `SO-xx`). Se editan solo las filas propias.

## Decisiones, estándares y dudas
- Las decisiones de una materia se anotan como `DC-n` (Ciencia) o `DS-n` (Sociedad) en su handoff, como **propuestas**;
  Victor las confirma, y recién ahí se pasan a `docs/DECISIONS.md`. Así los números no chocan.
- Los estándares (NGSS, HSS) son **borrador** hasta que un maestro los valide (`docs/design/kitewise/STANDARDS-REVIEW.md`).
  Solo se ven en la vista de padres.
- Lo que no esté decidido no se inventa: se deja detrás de una bandera y se le pregunta a Victor (`CLAUDE.md`).

## Orden de trabajo de cada materia (lo aprendido en Matemáticas)
Ver `docs/design/subjects/PATRON-MATEMATICAS.md`. En resumen, **no se programa antes de investigar**: la primera versión de
Matemáticas se sintió "de preescolar" porque se construyó antes de ver cómo se ven los ejercicios reales en la escuela.
1. Prompt de investigación para Victor → resultado en `docs/research/`.
2. Especificación visual/interactiva (qué se manipula, qué errores se nombran) → `docs/design/<materia>/`.
3. Lista de imágenes a pedir (por tandas, con manifiesto) → Victor las genera.
4. Dominio puro y probado (`packages/<materia>-content`), sin pantallas.
5. Pantallas y textos ES/EN. 6. Verificar en 4 tamaños. 7. Revisión de un maestro.

## Lo que ve Victor / lo que decide Victor
- Imágenes: cada materia deja su lista de pedido; Victor las genera y las manda (puede haber dos listas a la vez).
- APK: **solo cuando Victor lo pida** (regla vigente). Un APK lleva lo que haya en `master` o en la rama que él diga.
- Estándares: los valida un maestro, no Claude.

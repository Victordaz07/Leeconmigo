# HANDOFF — Sociedad
Actualizado: 2026-10-16 · Cuenta: B · Rama: `claude/sociedad-victor` · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md`
Tu materia es **Sociedad**; la otra cuenta trabaja **Ciencia** en paralelo. Edita solo lo tuyo (ver docs/14).

## Dónde estamos
Preparación hecha (PREP-1). **SO-01 hecho**: Victor ya corrió la investigación y entregó el resultado completo —
`docs/research/sociedad-investigacion.md` (48 unidades propuestas, 1.º–6.º, base California HSS + C3 Framework, 12
familias de interacción reutilizable, 6 lecciones de referencia ya diseñadas, rúbrica, bilingüismo, accesibilidad,
19 fuentes citadas con procedencia). Es más completo que el prompt original de Matemáticas: ya trae buena parte de lo
que pediría SO-02. Sigue sin haber contenido en la app, ni arte, ni código. En Inicio Sociedad se ve como "Pronto"
(`available: false`).

## Antes de empezar
1. Lee `docs/14-MATERIAS-EN-PARALELO.md` y `docs/design/subjects/PATRON-MATEMATICAS.md` (el patrón y los errores ya cometidos).
2. Lee `CLAUDE.md` (reglas de privacidad, arte y texto separados, DECISIÓN/PENDIENTE) y `docs/DECISIONS.md`.
3. `git fetch origin master && git merge origin/master`, `npm ci --ignore-scripts` si hace falta, `npm test`.
4. Lee `docs/research/sociedad-investigacion.md` completo antes de tocar código — en especial §4 (mapa de 48 unidades),
   §7 (12 familias de interacción), §9 (6 lecciones de referencia) y §17 (plan de producción: propone "Etapa A" de
   *seis* unidades piloto, una por grado — más grande que el piloto único de Matemáticas, g3u1).

## Siguiente paso exacto
**SO-02 — Especificación visual/interactiva, pero primero acotar el alcance con Victor.** La investigación propone
seis unidades piloto (una por grado); Matemáticas empezó con **una sola** unidad piloto y funcionó mejor así. Antes de
escribir la especificación en `docs/design/sociedad/`, confirmar con Victor:
- Con cuál unidad/grado empezar (candidatas de la propia Etapa A del documento: S1-U01, S2-U01, S3-U03, S4-U03,
  S5-U04 o S6-U02) — igual que en Matemáticas, el nivel de la app no es el grado escolar (docs/01).
- Qué tan literal seguir las "12 familias de interacción" del documento para la primera unidad (probablemente no las
  12 de una vez — Matemáticas empezó con solo 3 representaciones, no las 12/37 completas).
- Las unidades que usan fuentes reales (documentos, mapas históricos, recursos de Smithsonian/National Archives/LOC)
  necesitan verificar permisos de reuso antes de publicar (§16 "Permisos y recursos") — más trabajo de curaduría que
  Matemáticas, que usaba manipulables inventados.

Una vez acotado: escribir la especificación de **esa única unidad** en `docs/design/sociedad/` (qué se manipula, qué
error se nombra, cómo se evalúa, qué fuentes concretas se usan y con qué atribución) — no las 48 de un golpe.

## Checklist
- [x] SO-01 Prompt de investigación de Sociedad → Victor lo corrió (resultado: `docs/research/sociedad-investigacion.md`)
- [ ] SO-02 Especificación visual/interactiva de la unidad piloto (una sola) en `docs/design/sociedad/`
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
- **DS-1**: nombre en la interfaz **Sociedad**; nombre completo en documentos/vista de padres **Estudios Sociales /
  Social Studies** (ya usado así en docs/14, esto solo lo deja explícito). Base curricular: California History–Social
  Science + enfoque de investigación C3 Framework (NCSS) — complementario, no currículo nacional obligatorio.
- **DS-2**: color de identidad de Sociedad: ciruela `#7B4B6A` (propuesto en la investigación, a verificar contraste
  contra el papel crema `#F7EFE1` de Kitewise antes de usarlo en texto).
- **DS-3** (pendiente de Victor): cuál de las 6 unidades candidatas de "Etapa A" usar como piloto único — ver
  "Siguiente paso exacto" arriba. No se avanza a SO-02 sin esto.

## Pedidos a lo compartido
_(ninguno todavía)_

## Estado de pruebas
Al dejar la preparación: `npm test` todo en verde (1202/1202) y `npm run typecheck` limpio (verificado de nuevo al
traer `master` el 2026-10-16, sesión de Sociedad).

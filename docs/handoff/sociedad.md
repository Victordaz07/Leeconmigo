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
**SO-03 — esperando que Victor genere y mande las 7 imágenes.** Pedido completo en
`docs/design/sociedad/PEDIDO-IMAGENES-S3-U03.md`: historia del "Barrio de los Almendros" (ficticio), reutiliza a
**Teo y Nia** (de la historia de lectura "La cometa roja", mismo grado) en vez de personajes nuevos, con
referencia a `apps/reader/public/stories/la-cometa-roja/page-01.webp`. 7 piezas: portada, 2 mapas del barrio
(antes/después, misma composición), 2 tarjetas de fuente ficticias (acta municipal, anuncio comercial, sin
texto) y 4 poses de Teo como guía (igual patrón que `char_mila_*` en Matemáticas).
DS-3 (unidad S3-U03) se trata como confirmada — Victor pidió avanzar directo a las imágenes.
Cuando lleguen: convertir a WebP, revisar contra la lista de "Cómo las reviso al llegar" del pedido, y seguir
con SO-04 (dominio puro en `packages/social-content`).

**SO-02 — hecho.** Se escribió la
especificación de **una sola** unidad piloto (igual que Matemáticas con g3u1, no las 6 de "Etapa A"):
`docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md` — **S3-U03, "Un barrio cambia, pero el mapa no lo explica todo"**
(3.º, CA HSS 3.3). Se eligió esta de las 6 candidatas porque es la única con escenario 100% ficticio (sin fuentes
reales que requieran verificar permisos todavía) y porque la propia investigación la conecta con la Bahía de San
Francisco (§4). Usa solo 2 de las 12 familias de interacción (mapa por capas, mesa de fuentes) — como Matemáticas,
que empezó con 3 de 12 representaciones, no las 12 de una vez.
**No avanzar a SO-03 (pedir imágenes) sin que Victor confirme DS-3** (puede pedir otra unidad; ver "Decisiones
propuestas" abajo).

## Checklist
- [x] SO-01 Prompt de investigación de Sociedad → Victor lo corrió (resultado: `docs/research/sociedad-investigacion.md`)
- [x] SO-02 Especificación visual/interactiva de la unidad piloto (una sola): `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md` — propuesta, falta confirmación de Victor (DS-3)
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
- **DS-3** (confirmada en la práctica, 2026-10-16): usar **S3-U03** ("Un barrio cambia...", 3.º, CA HSS 3.3) como
  unidad piloto única — Victor pidió el pedido de imágenes directamente, sin objetar la elección. Razones y
  alternativas descartadas en `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`.
- **DS-4** (propuesta): reutilizar a **Teo** (de "La cometa roja") como guía recurrente de Sociedad, en vez de
  diseñar un personaje nuevo — mismo grado (3.º), ya tiene arte de referencia aprobado. Nia aparece en esta
  unidad como coprotagonista de la historia, sin poses de guía propias.

## Pedidos a lo compartido
_(ninguno todavía)_

## Estado de pruebas
Al dejar la preparación: `npm test` todo en verde (1202/1202) y `npm run typecheck` limpio (verificado de nuevo al
traer `master` el 2026-10-16, sesión de Sociedad).

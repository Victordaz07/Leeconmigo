# Relevo — «Para la vida» módulos 02–08 (cuenta A)
Estado (2026-10-22): los siete módulos están instalados como cuadernos aparte con un «Primer vistazo» jugable (D16). Finanzas (01) tiene su propio relevo (`finanzas.md`).

## Hecho
- `packages/life-content`: tipos, motor (`session.ts`: elegir/ordenar/detectar, «Explica tu decisión», estrellas por esfuerzo), validador (`validate.ts`) y 7 misiones ES/EN (`src/missions/*.ts`). Pruebas en `tests/life.test.ts`.
- Textos de la interfaz: `packages/ui-core/src/vida/copy.ts` (también la ficha de cada módulo, `VIDA_MODULES`).
- App: `apps/mobile/src/subjects/vida/` (`index` fábrica de los 7 módulos, `notebook`, `player`, `bodies`, `parts`). Arte provisional dibujado en código.
- Compartido tocado (una línea cada uno): `subjects/ids.ts`, `registry.ts`, `ui-core/src/subjects.ts` (+7 materias, `group: 'vida'`, `LIFE_SUBJECTS`), `persist/store.ts` (SUBJECT_KEYS), `ui-native/src/tokens.ts` (+7 colores/degradados), `home-screen.tsx` (fila «Para la vida»), `apps/mobile/package.json`.
- Mi cuaderno: las ideas guardadas desde estos cuadernos usan la materia «Otra cosa».
- Mega pedido de imágenes: `docs/design/vida/PEDIDO-IMAGENES-MEGA.md` (43 imágenes).

- Arte real conectado (2026-10-22, Partes 1 y 2, 43 imágenes): `scripts/vida-imagenes.py` → `apps/mobile/assets/vida/**` (2,6 MB), manifiesto en `docs/design/vida/arte/manifest-parte-*.json`, mapa en `subjects/vida/art.ts`. Portada en Inicio, banner del estante sobre la fila «Para la vida», guía y escena de cada encuentro dentro de la misión (Modo Enfoque `reducedMotion` los oculta). Prueba de que existen y pesan poco: `packages/life-content/tests/art.test.ts`.
- `NotebookCover` (ui-native): con `width` fijo ahora también anula `flexGrow/flexBasis` (antes solo `flex: undefined`, que en web no lo anulaba).

## Siguiente paso exacto
1. Finanzas (01) sigue con arte provisional: esperar su Lote A/B (`docs/design/finanzas/PEDIDO-IMAGENES.md`).
2. Por módulo, antes de ampliar: investigación (04–08) → especificación → misiones nuevas → revisión de un especialista. Emociones (02) y Comunicación (03) ya tienen investigación completa (8 lecciones por grado).
3. Probar en un Android real y con niños: ¿entienden la situación, comparan caminos y justifican?

## Cuidado con
- Nunca «incorrecto»; sin pedir datos, contraseñas ni relatos personales reales; escenarios ficticios y con aviso (`safety`).
- Autonomía: nada con calor, herramientas, limpieza ni comida sin revisión específica (V6).
- Vida digital: pantallas y mensajes siempre de mentira.
- Las guías (animales) y la lista de misiones son propuestas hasta que Victor las apruebe.

## Pedidos a lo compartido
- (ninguno por ahora)

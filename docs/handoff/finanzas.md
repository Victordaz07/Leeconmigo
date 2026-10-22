# Relevo — Finanzas («Para la vida» · módulo 01)
Estado (2026-10-22, cuenta A): investigación recibida (`docs/research/vida-01-economia-finanzas.md`), especificación y dominio puro del piloto F4-U01 hechos.

## Hecho
- `docs/design/finanzas/ESPECIFICACION.md` (adaptación, piloto 4.º, decisiones DF-1…DF-8 PROPUESTAS).
- `packages/finance-content`: `money`, `ledger` (registro de movimientos), `plan` (sobres, imprevistos, reserva), `opportunity` (costo de oportunidad), `offers` (ofertas sospechosas). 21 pruebas con los ejemplos resueltos del manual.

## Hecho (2)
- D15: DF-1…DF-8 confirmadas. Lista de imágenes (Tanda 1) en `PEDIDO-IMAGENES.md`; Victor las genera.
- Unidad F4-U01 (`content/f4u01.json`, 6 encuentros ES/EN) + `validate.ts` + `session.ts` (reductor, vistas, retroalimentación por CLAVES, estrellas por esfuerzo). 44 pruebas.

## Hecho (3) — FI-06/07
- Textos ES/EN: `packages/ui-core/src/finanzas/copy.ts`. Módulo: `apps/mobile/src/subjects/finanzas/` (`index`, `notebook`, `player`, `bodies`, `parts`), `available: true`.
- Verificado en Chromium (web) en 1180×900, 800×1280, 390×844 y 844×390: unidad completa de principio a fin, sin errores de consola ni desborde.
- Compartido tocado (una línea cada uno): `subjects/ids.ts`, `registry.ts`, `ui-core/src/subjects.ts` (+`finanzas`), `persist/store.ts` (SUBJECT_KEYS), `ui-native/src/tokens.ts` (`subjFinanzas`), `ui-core/src/index.ts`, `mi-cuaderno/model.ts`+`copy.ts` (materia «Finanzas» para guardar ideas), `apps/mobile/package.json`.

## Siguiente paso exacto (actualizado 2)
1. Cuando Victor mande las imágenes (Lote A y B): convertir a WebP + manifiesto SHA-256 y reemplazar el arte provisional (portada, sobres, buzón, guía Nuez si DF-9 se aprueba).
2. FI-08: revisión de un educador financiero y probar en Android real.
3. Después: Emociones (módulo 02) y Comunicación (módulo 03), cada uno cuaderno aparte (D14).

## (anterior)
FI-06/07: textos ES/EN en `ui-core/src/finanzas/copy.ts` y módulo `apps/mobile/src/subjects/finanzas/` con arte provisional (dibujado en código); registrar en lo compartido. Las imágenes reales se conectan cuando Victor las mande.

## (anterior)
1. Victor confirma DF-1…DF-8 (o los ajusta) y mira la lista de imágenes (`PEDIDO-IMAGENES.md`, aún por escribir al confirmar).
2. Unidad F4-U01 como JSON validado (`packages/finance-content/content/`) con los 6 encuentros, validador (todo cuadra: sumas, ejemplos del manual) y estrellas por esfuerzo.
3. Textos ES/EN en `packages/ui-core/src/finanzas/`; módulo `apps/mobile/src/subjects/finanzas/` (registrar UNA línea en `subjects/ids.ts`, `registry.ts`, `ui-core/subjects.ts`, `persist/store.ts` SUBJECT_KEYS: compartido, avisar).

## Cuidado con
- UM ≠ recompensas de Kitewise. Nunca precios reales ni marcas. Sin ruta de inversión en v1 (revisión legal antes).
- No premiar riqueza; los dos planes válidos se comparan por lo que protegen (`protects`).
- Textos: el dominio devuelve CLAVES, no frases; nunca «incorrecto» (D5, docs/06).

## Pedidos a lo compartido
- (cuando toque) fila «Para la vida» en la estantería de Inicio y `SubjectId 'finanzas'`.

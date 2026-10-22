# Relevo — Finanzas («Para la vida» · módulo 01)
Estado (2026-10-22, cuenta A): investigación recibida (`docs/research/vida-01-economia-finanzas.md`), especificación y dominio puro del piloto F4-U01 hechos.

## Hecho
- `docs/design/finanzas/ESPECIFICACION.md` (adaptación, piloto 4.º, decisiones DF-1…DF-8 PROPUESTAS).
- `packages/finance-content`: `money`, `ledger` (registro de movimientos), `plan` (sobres, imprevistos, reserva), `opportunity` (costo de oportunidad), `offers` (ofertas sospechosas). 21 pruebas con los ejemplos resueltos del manual.

## Siguiente paso exacto
1. Victor confirma DF-1…DF-8 (o los ajusta) y mira la lista de imágenes (`PEDIDO-IMAGENES.md`, aún por escribir al confirmar).
2. Unidad F4-U01 como JSON validado (`packages/finance-content/content/`) con los 6 encuentros, validador (todo cuadra: sumas, ejemplos del manual) y estrellas por esfuerzo.
3. Textos ES/EN en `packages/ui-core/src/finanzas/`; módulo `apps/mobile/src/subjects/finanzas/` (registrar UNA línea en `subjects/ids.ts`, `registry.ts`, `ui-core/subjects.ts`, `persist/store.ts` SUBJECT_KEYS: compartido, avisar).

## Cuidado con
- UM ≠ recompensas de Kitewise. Nunca precios reales ni marcas. Sin ruta de inversión en v1 (revisión legal antes).
- No premiar riqueza; los dos planes válidos se comparan por lo que protegen (`protects`).
- Textos: el dominio devuelve CLAVES, no frases; nunca «incorrecto» (D5, docs/06).

## Pedidos a lo compartido
- (cuando toque) fila «Para la vida» en la estantería de Inicio y `SubjectId 'finanzas'`.

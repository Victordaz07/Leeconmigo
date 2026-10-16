---
description: Dejar todo listo para que la otra cuenta siga (actualiza HANDOFF, log y roadmap; commit + push)
---

Se pueden acabar los créditos en cualquier momento. Deja el repo listo para el relevo AHORA, sin empezar trabajo nuevo:

1. Si hay cambios sin commit: si funcionan, commit normal (`<ID>: …`); si están a medias, commit con prefijo `WIP: <ID>: …`.
2. Sobrescribe `HANDOFF.md` con la plantilla de ese archivo: fecha/hora, cuenta (A o B — pregúntame si no lo sé),
   rama, último commit, tarea en curso, checklist (hecho / falta, marcando "← AQUÍ ME QUEDÉ"), **siguiente paso
   exacto** (archivo y línea aproximada + cómo probarlo), "cuidado con", estado de pruebas real (corre `npm test`).
3. Agrega (no borres nada) una entrada a `docs/log/SESSION_LOG.md` con el formato de ese archivo.
4. Actualiza la fila de la tarea en `docs/ROADMAP.md` (estado, cuenta, rama).
5. Commit `relevo: <ID>` y `git push -u origin <rama>`. Confirma que el push salió bien.
6. Dime en 2 líneas qué quedó y qué debe escribir la otra cuenta (`/retomar`).

Cuenta / notas extra: $ARGUMENTS

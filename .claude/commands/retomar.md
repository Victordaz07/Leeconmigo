---
description: Retomar el trabajo donde lo dejó la otra cuenta (protocolo de relevo, pasos 1–4)
---

Sigue el "Protocolo de relevo → AL INICIAR" de `CLAUDE.md`:

1. Lee `HANDOFF.md`, luego `docs/ROADMAP.md`, luego las últimas 3 entradas de `docs/log/SESSION_LOG.md` y
   `docs/DECISIONS.md` (para no re-discutir nada de ahí).
2. Corre `git status`, `git log --oneline -10` y las pruebas (`npm test`; si no hay `node_modules`, primero
   `npm ci --ignore-scripts`).
3. Si hay cambios sin commit, revísalos y dime qué son antes de tocar nada.
4. Responde en español, corto:
   - **Dónde estamos:** tarea en curso (ID), rama, último commit.
   - **Estado de pruebas:** X/Y, y si alguna falla, si es esperada según HANDOFF.
   - **Siguiente paso exacto:** el de `HANDOFF.md`.
   - **Bloqueos:** decisiones pendientes que afecten a esta tarea.

No empieces a programar hasta que yo confirme, salvo que `HANDOFF.md` diga explícitamente que se puede seguir sin preguntar.

$ARGUMENTS

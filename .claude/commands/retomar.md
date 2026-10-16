---
description: Retomar el trabajo donde lo dejó la otra cuenta (protocolo de relevo, pasos 1–4)
---

Sigue el "Protocolo de relevo → AL INICIAR" de `CLAUDE.md`.

**Si el argumento es una materia (`ciencia` o `sociedad`):** trabajas en paralelo con otra cuenta (`docs/14-MATERIAS-EN-PARALELO.md`).
Lee, en este orden: `docs/14-MATERIAS-EN-PARALELO.md`, `docs/handoff/<materia>.md`, las últimas 3 entradas de
`docs/log/<materia>.md`, tu sección del `docs/ROADMAP.md` y `docs/DECISIONS.md`. Trae `master` a tu rama
(`git fetch origin master && git merge origin/master`). Luego el resto de los pasos de abajo, y en "Siguiente paso
exacto" usa el de tu handoff, no el de `HANDOFF.md`. Edita solo lo de tu materia.

**Si no hay materia:**

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

# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("F1-02: sistema de relevo entre cuentas …")

## Tarea en curso
Ninguna en código. F1-02 (sistema de relevo) terminada. Esperando decisiones de Victor.

## Hecho en esta tarea (F1-02)
- [x] `docs/10-PLAN-MAESTRO-V2.md` (plan v2 + reconciliación con el repo)
- [x] `docs/DECISIONS.md` (confirmadas D1–D6 / pendientes C1–C4, C6, C9)
- [x] `docs/ROADMAP.md` (IDs del plan con estado real)
- [x] `docs/log/SESSION_LOG.md`, `docs/design/README.md`
- [x] `/retomar` y `/relevo` en `.claude/commands/`
- [x] Protocolo de relevo en `CLAUDE.md`

## Siguiente paso exacto
1. Victor responde las preguntas pendientes de `docs/DECISIONS.md` (sobre todo C1 Capacitor vs PWA, C4
   matemáticas, C6 multi-perfil). Al responder: mover la fila a "Confirmadas" y desbloquear en `docs/ROADMAP.md`.
2. Sin esperar esas respuestas se puede empezar **F2-04a**: tipos `FocusSettings` en `packages/contracts`,
   `FOCUS_PRESETS` + función pura `resolveFocusSettings(settings, now)` (aplica el horario) en
   `packages/session-engine`, con tests. No toca UI ni decisiones abiertas.

## Cuidado con
- `npm ci` falla en el contenedor de la nube (postinstall de `onnxruntime-node` descarga binarios). Usar
  `npm ci --ignore-scripts`; las pruebas no lo necesitan.
- `packages/ui` nunca lee almacenamiento ni importa el motor: los ajustes llegan por props.
- Ningún componente pregunta "¿es TDAH?" — solo por el apoyo concreto (D4).

## Estado de pruebas
`npm test`: 1068/1068 ✅ (26 archivos)

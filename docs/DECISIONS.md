# DECISIONS — decisiones tomadas (no se re-discuten)

Cada decisión lleva fecha, quién la tomó y por qué. Para cambiar una, Victor tiene que decirlo explícitamente;
entonces se marca la vieja como ~~reemplazada~~ y se agrega la nueva abajo. Las decisiones de producto
originales siguen en `docs/00`–`09` (marcadas `DECISIÓN`); este archivo recoge las nuevas.

## Confirmadas

| # | Fecha | Decisión | Por qué / origen |
|---|---|---|---|
| D1 | 2026-10-15 | La voz del niño nunca se guarda ni sale de la tablet; si no hay reconocimiento local, se desactiva la voz (fallar cerrado). | Ya era regla absoluta (`docs/07`). Plan v2 §5.2. |
| D2 | 2026-10-15 | El repo es la única fuente de verdad entre las cuentas A y B. Protocolo de relevo en `CLAUDE.md`. | Plan v2 §2 y §5.7. |
| D3 | 2026-10-15 | La app es práctica académica, no tratamiento; nada de "entrenamiento cerebral" ni lenguaje clínico. | Plan v2 §5.6. Coherente con `docs/00` ("apoyar, no vigilar"). |
| D4 | 2026-10-15 | "Modo Enfoque": controlado solo por el padre (tras PIN), con nombre neutro para el niño — nunca "TDAH" en la UI del niño. Los componentes leen apoyos concretos (`timerStyle`, `questionsPerScreen`…), nunca un booleano "es TDAH". | Plan v2 §1 y §5.5. (El "por perfil" depende de C6 abajo.) |
| D5 | 2026-10-15 | En ningún modo: cofres sorpresa, rachas que castigan, juego infinito, mensajes de culpa. | Plan v2 §1. Coherente con `docs/01` (racha protegida) y `docs/06`. |
| D6 | 2026-10-15 | `docs/DEVLOG.md` y `docs/08-ROADMAP.md` se conservan; `docs/log/SESSION_LOG.md` y `docs/ROADMAP.md` son las versiones cortas para el relevo. | Evitar perder historia del proyecto (plan v2 §7 C8). |
| D7 | 2026-10-15 | **Plataforma: React Native + Expo.** Pantallas nativas, Android primero, iOS después desde el mismo código. Se reutilizan los paquetes de lógica (`contracts`, `reading-engine`, `session-engine`, `story-engine`); se rehacen UI y app. La app Capacitor actual sigue en uso para Noah hasta tener paridad. Plan: `docs/11-MIGRACION-REACT-NATIVE.md`. | Victor eligió la opción B tras comparar Capacitor+voz nativa / React Native / Kotlin. Resuelve C1 (la propuesta "PWA" queda ~~descartada~~) y `docs/09` #6; reemplaza la plataforma de `docs/02`. |
| D8 | 2026-10-15 | **La app se publicará para otras familias** (Play Store primero, App Store después). Antes de publicar: revisión legal de privacidad infantil (COPPA / California) y todo lo de `docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md`. | Amigos de Noah y otras madres ya la quieren. Resuelve `docs/09` #13. |

## Pendientes de confirmar por Victor (NO aplicar hasta que responda)

Vienen del Plan Maestro v2 (`docs/10-PLAN-MAESTRO-V2.md` §7) y chocan con algo ya escrito o construido.

| # | Propuesta | Choca con | Comportamiento mientras tanto |
|---|---|---|---|
| C2 | Fuente de lectura Atkinson Hyperlegible / Lexend | `docs/05`: Andika + Nunito | Se mantiene Andika. Si se cambia, va como token en `tokens.css`, no fuente por componente. |
| C3 | Fondo crema + modo oscuro | `docs/05`: `#F6F7FB` | Se mantiene la paleta actual. |
| C4 | Módulo de matemáticas (F5) y respuestas por toque (plan §5.3) | `docs/00`: producto centrado en lectura | No se empieza F5 hasta confirmar. |
| C6 | Perfiles múltiples (Modo Enfoque "por perfil"). Con D8 (publicar) es casi seguro que hará falta: familias con varios hijos | DEVLOG: un solo perfil, multi-perfil fuera de v1 | Modo Enfoque se diseña con `profileId` en la firma, pero hay un único perfil. |
| C9 | Etiquetar contenido con códigos estatales de California (plan §5.4) | `docs/09` #10: currículo de Noah sin investigar | Campo opcional en el esquema cuando se haga F4-01b; sin códigos inventados. |
| C10 | Modelo de negocio: gratis, pago único o suscripción | Nada todavía (D8 solo dice "publicar") | Sin pagos ni compras en la app. |
| C11 | Publicar como persona o como LLC | — | Preguntar antes de crear las cuentas de desarrollador. |

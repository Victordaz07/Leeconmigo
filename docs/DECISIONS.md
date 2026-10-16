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
| D9 | 2026-10-15 | **El diseño Kitewise es la referencia de producto y UX/UI** ("vamos a basar el proyecto alrededor del diseño"). Multicuaderno de materias, sesiones de 4 momentos, Modo Enfoque, padres. Se construye en React Native (D7). Detalle y adaptación: `docs/13-KITEWISE.md`, material en `docs/design/kitewise/`. | Victor, al entregar el diseño de Claude Design. Resuelve C2 (Andika+Nunito, Lexend alternativa), C3 (paleta actual + papel + modo oscuro), C4 (sí matemáticas y otras materias), C6 (varios perfiles), C9 (estándares solo para padres, como borrador) y `docs/09` #3 (sin bloqueos). |
| D10 | 2026-10-15 | **Nombre oficial: Kitewise.** La app nativa se llama Kitewise (nombre visible, tienda, identificador `com.kitewise.app`). "Lee Conmigo" queda como nombre histórico del repo y de la app Capacitor de Noah; los paquetes internos conservan el prefijo `@lee-conmigo/`. | Victor: "Kitewise el nombre oficial". Resuelve C12. Antes de publicar: búsqueda de marca "Kitewise" (`docs/12` §5). |
| D11 | 2026-10-15 | **Estrellas del cierre por ESFUERZO, nunca por precisión** (Kitewise B13): 1 por terminar la historia, +1 si pidió ayuda o volvió a intentar una palabra, +1 si leyó sin pausas largas. Implementado en `packages/ui-core/src/effort.ts` (`effortStars`), con pruebas. | Propuesta aprobada por Victor: "me parece bien esa regla". Coherente con `docs/06` (sin calificaciones) y D5. |

## Pendientes de confirmar por Victor (NO aplicar hasta que responda)

Vienen del Plan Maestro v2 (`docs/10-PLAN-MAESTRO-V2.md` §7) y chocan con algo ya escrito o construido.

| # | Propuesta | Choca con | Comportamiento mientras tanto |
|---|---|---|---|
| C10 | Modelo de negocio: gratis, pago único o suscripción | Nada todavía (D8 solo dice "publicar") | Sin pagos ni compras en la app. |
| C11 | Publicar como persona o como LLC | — | Preguntar antes de crear las cuentas de desarrollador. |
| C13 | Foto de la tarea (P3): cámara + lectura de la foto en el dispositivo | Capacidad nueva con datos del niño; `docs/12` | No se construye hasta una revisión de privacidad; queda al final (K8). |

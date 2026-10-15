# Lee Conmigo

Lee Conmigo is a bilingual (English/Spanish) read-aloud reading tutor app for
children in grades 1–6, built primarily for Android tablets (iPad later).

Read `/docs` before writing any code. The documents there are the approved
source of truth for this project. Do not silently override a decision marked
`DECISIÓN` in these docs — if a real platform limitation forces a change,
propose the alternative but keep the same functional/pedagogical goal.

If a document says a topic is `PENDIENTE` (see `docs/09-OPEN-DECISIONS.md`),
do not invent an answer — implement behind an abstraction/flag and ask.

## Core architecture

Frontend: React + Vite + TypeScript
Mobile runtime: Capacitor
Android native layer: Kotlin
State: local-first, no cloud in v1

## Architectural rule (non-negotiable)

The UI must NEVER depend directly on Android speech APIs, Google Speech,
Whisper, or any other speech provider. All speech functionality passes
through the `SpeechEngine` abstraction. The UI communicates with
`ReadingEngine` exclusively through the contracts in `packages/contracts`.

Text is never permanently baked into an illustration. Art (visual layer) and
text (narration/dialogue/UI) are always separate.

## Primary systems

StoryEngine · ReadingEngine · SpeechEngine · SessionEngine · ProgressEngine

## Development rule

Every native capability must ship a mock/simulator implementation
(`Fake*Engine`) so the full experience can be built and tested in a browser
before Android/voice are connected. Do not connect real Android speech
functionality until the Fake-engine version of the current vertical slice is
approved.

## Privacy rule (non-negotiable)

The child's voice audio is never persisted to disk and never leaves the
device. See `docs/07-PRIVACY-AUDIO.md`.

## Product documentation

@docs/00-PROJECT-MASTER.md
@docs/01-PRODUCT-RULES.md
@docs/02-ARCHITECTURE.md
@docs/03-READING-ENGINE.md
@docs/04-READING-SESSION.md
@docs/05-DESIGN-SYSTEM.md
@docs/06-CHILD-UX-RULES.md
@docs/07-PRIVACY-AUDIO.md
@docs/08-ROADMAP.md
@docs/09-OPEN-DECISIONS.md
@docs/DECISIONS.md

Plan Maestro v2 (propuesta de lectura + matemáticas + Modo Enfoque, con su
reconciliación contra lo ya construido): `docs/10-PLAN-MAESTRO-V2.md`. Las
partes que chocan con una `DECISIÓN` están en `docs/DECISIONS.md` →
"Pendientes de confirmar" y no se aplican hasta que Victor responda.

## Current stage (see 08-ROADMAP.md for detail)

- Reading Session UI/UX prototype (Claude Design canvas, Spanish, single
  story "La luna y la puerta azul") exists and is approved as a starting
  visual/interaction reference — see `04-READING-SESSION.md`.
- Prototipo 00 (real speech recognition test on Noah's tablet) has not run
  yet. **Do not build the real SpeechEngine/Android audio layer before that
  test produces a decision** — build everything else against
  `FakeSpeechEngine` first.

## PROTOCOLO DE RELEVO (obligatorio)

Este proyecto lo trabajan dos cuentas de Claude (A y B). Los créditos pueden
acabarse en cualquier momento, sin aviso. El repo es la única memoria
compartida. Por eso:

AL INICIAR (o con `/retomar`):
1. Lee `HANDOFF.md`, luego `docs/ROADMAP.md` y las últimas 3 entradas de
   `docs/log/SESSION_LOG.md`.
2. Corre `git status`, `git log --oneline -10` y `npm test` (sin
   `node_modules`: `npm ci --ignore-scripts` primero).
3. Si hay cambios sin commit, revísalos antes de tocar nada.
4. Di en una línea dónde estás y cuál es el siguiente paso.

MIENTRAS TRABAJAS:
5. Tareas pequeñas (máx. ~30–45 min). Si una tarea es grande, divídela en
   `docs/ROADMAP.md`.
6. Después de CADA paso que funcione: commit + push (mensaje "F3-02: ...").
7. Actualiza `HANDOFF.md` cada vez que completes un checkbox, NO solo al final.
8. Si algo queda a medias, commit con prefijo "WIP:" y explica en `HANDOFF.md`
   dónde quedó.

AL TERMINAR UNA TAREA (o con `/relevo` al ver el aviso de ~80–90 % de límite):
9. Agrega entrada a `docs/log/SESSION_LOG.md`, marca ✅ en `docs/ROADMAP.md`,
   actualiza `HANDOFF.md` con la siguiente tarea, commit + push.

NUNCA:
- Re-discutir algo ya registrado en `docs/DECISIONS.md` (sección "Confirmadas").
- Aplicar algo de "Pendientes de confirmar" sin respuesta de Victor.
- Dejar trabajo sin push.
- Guardar o enviar audio del niño fuera del dispositivo.

`docs/DEVLOG.md` sigue siendo la bitácora narrativa larga (el porqué
detallado de cada cambio grande); `SESSION_LOG.md` es la corta para el relevo.

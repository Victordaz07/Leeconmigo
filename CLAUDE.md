# Kitewise (formerly Lee Conmigo)

Official product name: **Kitewise** (DECISIÓN D10). The repo, the internal `@lee-conmigo/*`
packages and Noah's Capacitor app keep the old name.

Lee Conmigo is a bilingual (English/Spanish) read-aloud reading tutor app for
children in grades 1–6, built primarily for Android tablets (iPad later).

Read `/docs` before writing any code. The documents there are the approved
source of truth for this project. Do not silently override a decision marked
`DECISIÓN` in these docs — if a real platform limitation forces a change,
propose the alternative but keep the same functional/pedagogical goal.

If a document says a topic is `PENDIENTE` (see `docs/09-OPEN-DECISIONS.md`),
do not invent an answer — implement behind an abstraction/flag and ask.

## Core architecture

**Migrating (DECISIÓN D7, 2026-10-15):** React Native + Expo, Android first,
iOS later — plan in `docs/11-MIGRACION-REACT-NATIVE.md`. Pure-logic packages
(`contracts`, `reading-engine`, `session-engine`, `story-engine`) are shared;
UI is rebuilt in `apps/mobile` + `packages/ui-native`.

Current app (stays in use for Noah until parity): React + Vite + TypeScript
in Capacitor (`apps/reader`, `packages/ui`). Whisper runs locally in the WebView.

State: local-first, no cloud in v1.

The app will be published to other families (D8): no third-party SDKs that
collect data, and everything in `docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md`
before release.

## Architectural rule (non-negotiable)

The UI must NEVER depend directly on Android speech APIs, Google Speech,
Whisper, or any other speech provider. All speech functionality passes
through the `SpeechEngine` abstraction. The UI communicates with
`ReadingEngine` exclusively through the contracts in `packages/contracts`.

Text is never permanently baked into an illustration. Art (visual layer) and
text (narration/dialogue/UI) are always separate.

## Design reference (DECISIÓN D9)

The Kitewise design (`docs/design/kitewise/`, adapted in `docs/13-KITEWISE.md`) is the product
and UX/UI reference: subject notebooks, 4-moment sessions, Focus Mode, parents. Build it in
React Native (`apps/mobile`, `packages/ui-native`, `packages/ui-core`), not in the web app.
Screenshots of every screen are in `docs/design/kitewise/screens/`.

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
@docs/11-MIGRACION-REACT-NATIVE.md
@docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md
@docs/13-KITEWISE.md

Plan Maestro v2 (propuesta de lectura + matemáticas + Modo Enfoque, con su
reconciliación contra lo ya construido): `docs/10-PLAN-MAESTRO-V2.md`. Las
partes que chocan con una `DECISIÓN` están en `docs/DECISIONS.md` →
"Pendientes de confirmar" y no se aplican hasta que Victor responda.

## Current stage (see 08-ROADMAP.md for detail)

- Reading Session UI/UX prototype (Claude Design canvas, Spanish, single
  story "La luna y la puerta azul") exists and is approved as a starting
  visual/interaction reference — see `04-READING-SESSION.md`.
- Real voice already works in the Capacitor app (Whisper local, see
  `docs/DEVLOG.md`). In the React Native app, voice starts with a technical
  test (RN-03, `whisper.rn`) before building on it — build screens against
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

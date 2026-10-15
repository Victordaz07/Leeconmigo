# 10 — Plan Maestro v2 (propuesta, 2026-10-15)

**Lectura + Matemáticas + Cuestionarios + Modo Enfoque · Trabajo con 2 cuentas de Claude · Diseño primero**
Basado en: `claude/investigacion-curriculo-california-tdah.md` (documento fuera de este repo).

> **Estado de este documento:** PROPUESTA. Se escribió como si el proyecto empezara desde cero, pero el repo
> ya tiene mucho construido (ver `docs/DEVLOG.md`). La sección **§7 Reconciliación** dice qué partes ya están
> hechas, cuáles encajan sin conflicto y cuáles chocan con una `DECISIÓN` de `docs/00`–`09`. Lo que choca
> NO se aplica hasta que Victor lo confirme (ver `docs/DECISIONS.md` → "Pendientes de confirmar").
> El sistema de relevo entre cuentas (§2) sí está implementado: `HANDOFF.md`, `docs/ROADMAP.md`,
> `docs/log/SESSION_LOG.md`, `docs/DECISIONS.md`, `/retomar`, `/relevo`.

---

## 0. Orden de trabajo (propuesto)

| Fase | Qué | Dónde | Resultado |
|---|---|---|---|
| **F0** | Plan visual UX/UI y sistema de diseño | Claude Design | Pantallas aprobadas + tokens de diseño |
| **F1** | Repo + sistema de relevo entre cuentas (log) | Claude Code | `CLAUDE.md`, `HANDOFF.md`, log |
| **F2** | Base: perfiles, PIN de padre, ajustes, Modo Enfoque (interruptor) | Claude Code | App navegable |
| **F3** | Voz en el dispositivo + temporizador de lectura | Claude Code | Prueba técnica en la tablet de Noah |
| **F4** | Lector de historias + cuestionarios | Claude Code | 1 historia completa con preguntas |
| **F5** | Módulo de matemáticas (problemas verbales) | Claude Code | Ronda de 3.º grado funcionando |
| **F6** | Panel de padres (reporte diario) | Claude Code | 3 números por día |
| **F7** | Contenido: Unidad 1 (5 historias, grado de Noah, EN/ES) | Claude (chat) + revisión humana | Unidad lista |
| **F8** | Prueba real con Noah (2 semanas) y ajustes | Familia | Lista de cambios para v2 |

Regla de oro: **cada fase termina con algo que se puede probar en la tablet.**

---

## 1. Modo Enfoque (apoyo de atención): interruptor encendido / apagado

### Cómo se activa
- Lo controla **solo el padre**, en *Ajustes → Perfil del niño → Modo de apoyo de atención*, protegido con PIN.
- Es **por perfil** (Noah puede tenerlo encendido y Ariella apagado).
- Tres posiciones: **Apagado** (estándar) · **Encendido** (todos los apoyos) · **Personalizado** (el padre
  enciende apoyos uno por uno).
- Se puede programar: p. ej. encendido de lunes a viernes después de la escuela, apagado los fines de semana.
- Nombre visible para el niño: **"Modo Enfoque"** (nunca "TDAH" en la interfaz del niño).

### Qué cambia

| Apoyo | Apagado | Encendido |
|---|---|---|
| Duración del bloque | La que ponga el padre | Bloques de 5–8 min con pausa entre bloques |
| Preguntas por pantalla | Hasta 3 | 1 sola |
| Tamaño de ronda (quiz/mate) | 5–10 | 3–5 |
| Temporizador | Número (mm:ss) | Barra visual que se llena ("minutos ganados") |
| Pausa por silencio | Aviso discreto | Aviso amable + animación suave, nunca alarma |
| Umbrales de voz | 10 s pausa / 3 s reanuda | Configurables (p. ej. 15 s / 2 s) |
| Recompensas | Estrellas al final | Estrella inmediata por cada logro + canje diario definido por el padre |
| Pausas de movimiento | No | Opcional: 60–90 s ("¡estírate como un árbol!") entre bloques |
| Automonitoreo | No | Antes: "¿cuál es tu meta?" · Después: "¿cómo estuvo tu enfoque?" (1–3 caritas) |
| Elección | Ruta fija | Elige entre 2 actividades ("¿historia o mate primero?") |
| Decoración / animaciones | Normal | Reducidas (menos distracción) |
| Rondas de velocidad (tablas) | Disponibles | Solo tras 90 % de precisión, y opcionales |
| Lectura en voz de la app (ayuda) | Según ajuste | Según ajuste (sigue siendo decisión del padre) |

Lo que **nunca** se hace en ningún modo: cofres sorpresa, rachas que castigan, juego infinito, mensajes de culpa.

### Implementación técnica (propuesta)
```ts
type FocusMode = 'off' | 'on' | 'custom';
interface FocusSettings {
  mode: FocusMode;
  blockMinutes: number;          // 5–8 en 'on'
  questionsPerScreen: 1 | 3;
  roundSize: number;             // 3–5 en 'on'
  timerStyle: 'digits' | 'bar';
  silencePauseSec: number;       // default 10
  resumeAfterSec: number;        // default 3
  instantRewards: boolean;
  movementBreaks: boolean;
  selfMonitoring: boolean;
  choiceBetweenActivities: boolean;
  reducedMotion: boolean;
  speedRoundsGate: number;       // 0.9
  schedule?: { days: number[]; from: string; to: string };
}
export const FOCUS_PRESETS: Record<'off' | 'on', FocusSettings> = { /* ... */ };
```
Un solo hook `useFocusSettings(profileId)` y todos los componentes leen de ahí. **Ningún componente pregunta
"¿es TDAH?"**; preguntan por el apoyo concreto (`settings.timerStyle === 'bar'`). Así el modo personalizado
sale gratis.

> En este monorepo el lugar natural es: tipos en `packages/contracts`, presets + resolución por horario
> (lógica pura, testeable) en `packages/session-engine`, persistencia en `apps/reader/src` (como
> `parent-settings.ts`), y los componentes de `packages/ui` reciben los valores por props — `ui` nunca lee
> almacenamiento. `silencePauseSec`/`resumeAfterSec` llegan al `ReadingTimer` como configuración, sin que el
> temporizador sepa nada de "Modo Enfoque".

---

## 2. Trabajar con 2 cuentas de Claude sin perder el hilo  ✅ implementado

El **repositorio de GitHub es la memoria compartida**. Ninguna cuenta guarda el estado "en su cabeza": todo
queda escrito en el repo, con commit y push frecuentes. Si a la Cuenta A se le acaban los créditos a mitad de
una tarea, la Cuenta B abre el repo, escribe `/retomar` y sigue.

- **Cuenta A** = `A` · **Cuenta B** = `B` (se firma en cada entrada del log).
- Las dos cuentas necesitan acceso al mismo repo (`Victordaz07/Leeconmigo`) desde Claude Code.
- Archivos: `HANDOFF.md` (estado AHORA), `docs/ROADMAP.md` (tareas con ID), `docs/log/SESSION_LOG.md`
  (bitácora corta, solo se agrega), `docs/DECISIONS.md` (no se re-discute), `docs/design/` (exportaciones de
  Claude Design), `.claude/commands/retomar.md`, `.claude/commands/relevo.md`.
- El protocolo completo está en `CLAUDE.md` → "Protocolo de relevo".
- `docs/DEVLOG.md` se conserva como bitácora narrativa larga (el "por qué" detallado); `SESSION_LOG.md` es la
  versión corta para retomar rápido.

---

## 3. Plan visual UX/UI (Fase 0 — Claude Design)

### Principios de diseño
1. **Tablet Android en horizontal** (1280×800 de referencia), también vertical.
2. **Dos públicos**: niño (grande, simple, cálido) y padre (claro, rápido, datos mínimos).
3. **El texto manda**: en lectura, nada compite con las palabras.
4. **Modo Enfoque visible solo por sus efectos** (menos cosas en pantalla), no por etiquetas.
5. **Bilingüe real**: cada pantalla diseñada para textos ~25 % más largos en español.

### Sistema de diseño (tokens a definir en Claude Design)
- **Tipografía (propuesta, choca con docs/05 — ver §7)**: lectura en *Atkinson Hyperlegible* o *Lexend*;
  títulos con una redonda amigable. Lectura: 28–32 px en 1.º–2.º, 24 px en 3.º–4.º, 20–22 px en 5.º–6.º;
  interlineado 1,5–1,7; máx. ~60 caracteres por línea.
- **Color (propuesta, choca con docs/05 — ver §7)**: fondo crema suave (no blanco puro), texto casi negro,
  1 color de acción, 1 de éxito, 1 de pausa (ámbar suave, nunca rojo alarma). Modo oscuro.
- **Componentes**: botón grande (mín. 64 px de alto), teclado numérico, tarjeta de pregunta, barra de tiempo,
  estrella, burbuja de cómic, pista (escalones), carita de enfoque.
- **Movimiento**: transiciones cortas; versión "movimiento reducido" para Modo Enfoque.

### Pantallas

**Padre:** 1. Bienvenida + crear PIN · 2. Crear perfil del niño (nombre, grado, idioma principal) · 3. Ajustes
del perfil (tiempo diario, idioma, **Modo Enfoque: Apagado / Encendido / Personalizado**, horario) · 4. Panel
diario (minutos leídos, aciertos, enfoque autoevaluado) + vista semanal · 5. Recompensas del día.

**Niño:** 6. Elegir perfil (avatar) · 7. Inicio: mapa de unidades + misión del día · 8. Meta antes de empezar
(Modo Enfoque) · 9. Lectura grado 1–2 (cómic + burbujas) · 10. Lectura grado 3–4 (ilustración + párrafos) ·
11. Lectura grado 5–6 (texto + ilustración pequeña) · 12. Estado de pausa ("Te espero… ¡sigue leyendo!") ·
13. Cuestionario (1 pregunta por pantalla; opción múltiple, V/F, ordenar, unir, "toca la oración que lo
demuestra") · 14. Problema de matemáticas (teclado / recta numérica / fichas / barras de fracción) · 15. Pista
por escalones + ejemplo resuelto · 16. Pausa de movimiento (60–90 s) · 17. Fin de sesión: estrellas + "¿cómo
estuvo tu enfoque?" · 18. Repaso (preguntas que regresan).

Cada pantalla del niño en **dos variantes: Modo Enfoque apagado / encendido**.

> Las pantallas 9–13, 17 y 18 ya existen (prototipo aprobado + app real). En Claude Design conviene partir de
> ellas y diseñar solo la **variante Modo Enfoque** y las pantallas nuevas (2, 3-Enfoque, 4, 5, 6, 8, 14, 15,
> 16), no rediseñar desde cero (`docs/04`).

### Prompt inicial para Claude Design
> Diseña el sistema visual y las pantallas de "Lee Conmigo", una app bilingüe (inglés/español) para tablet
> Android en horizontal (1280×800) para niños de 6 a 12 años que leen en voz alta. La app escucha al niño y un
> temporizador solo avanza mientras lee. Incluye lectura de historias (estilo cómic en 1.º–2.º, más texto en
> 3.º–6.º), cuestionarios de comprensión, problemas de matemáticas leídos en voz alta que se responden con
> teclado numérico, y un panel para padres tipo tarjeta de reporte diario. Tiene un "Modo Enfoque" para niños
> con dificultades de atención: una pregunta por pantalla, barra de tiempo visual, menos decoración,
> recompensas inmediatas y pausas de movimiento. Estilo: cálido, amigable, profesional, nada infantil en
> exceso; fondo crema, tipografía muy legible (Atkinson Hyperlegible o Lexend), botones grandes, colores
> tranquilos, ámbar suave para "pausa" (nunca rojo). Empieza por: 1) sistema de diseño (color, tipografía,
> componentes), 2) pantalla de lectura grado 3–4 en ambas variantes de Modo Enfoque, 3) pantalla de problema
> de matemáticas, 4) panel del padre.

Entregable de F0: pantallas aprobadas, exportadas a `docs/design/` y tokens promovidos a
`packages/ui/src/styles/tokens.css` (ya existe; el plan original decía `src/styles/tokens.css`).

---

## 4. Roadmap con IDs de tarea

Ver `docs/ROADMAP.md` (tabla viva con estado, cuenta y rama). Ahí cada ID del plan está marcado con lo que ya
existe en el repo.

---

## 5. Decisiones propuestas por el plan

1. PWA, no app nativa.
2. La voz del niño nunca se guarda ni sale de la tablet; si no hay reconocimiento local, se desactiva la voz.
3. Respuestas de matemáticas por toque, no por voz.
4. Contenido etiquetado con códigos estatales de California, no con libros de texto.
5. Modo Enfoque por perfil, controlado por el padre, con nombre neutro para el niño.
6. La app es práctica académica, no tratamiento; nada de "entrenamiento cerebral".
7. El repo es la única fuente de verdad entre las cuentas A y B.

Cuáles quedan confirmadas y cuáles necesitan una respuesta: `docs/DECISIONS.md`.

## 6. Pendiente de confirmar (del plan)
- Grado actual de Noah y temas de ciencias / estudios sociales de este año (preguntar a la maestra).
- ~~Nombre del repo en GitHub y que ambas cuentas tengan acceso.~~ El repo es `Victordaz07/Leeconmigo`
  (no `lee-conmigo`); falta confirmar que la Cuenta B tenga acceso.
- Soporte de reconocimiento de voz en el dispositivo en la tablet real (F3-03) — ya resuelto en parte:
  Whisper local corre en la tablet de Noah (ver `docs/DEVLOG.md`).

---

## 7. Reconciliación con el repo actual

### Ya hecho (no rehacer)
- **F1-01/F1-03**: monorepo Vite + React 19 + TS, Vitest (1068 pruebas), typecheck estricto, deploy Vercel.
- **F2-01 (parcial)**: PIN de padre y Modo padres (`apps/reader/src/parent-settings.ts`) — un solo perfil, en
  `localStorage`, no IndexedDB.
- **F2-02 (parcial)**: tokens en `packages/ui/src/styles/tokens.css` (los del prototipo aprobado).
- **F3-01/F3-02**: reconocimiento 100 % local con Whisper (WASM) + VAD + `ReadingTimer` (10 s / 3 s). El plan
  proponía Web Speech API con `processLocally = true` o vosk-browser; Whisper local ya cumple "fallar cerrado".
- **F4-01/F4-02/F4-03 (parcial)**: formato JSON de historia, lector por niveles (cómic / illustrated reader),
  preguntas de opción múltiple, repaso de sílabas, 24 historias EN/ES.

### Choques con decisiones escritas (requieren respuesta de Victor)
| # | Plan v2 dice | Repo / docs dicen | Pregunta |
|---|---|---|---|
| C1 | "PWA, no app nativa" | App Capacitor ya empaquetada y probada en la tablet; la voz NO usa Kotlin (Whisper corre en el WebView) | ✅ Resuelto (D7): ni PWA ni Capacitor → React Native + Expo (`docs/11`) |
| C2 | Tipografía Atkinson Hyperlegible / Lexend | `docs/05`: Andika (lectura) + Nunito (UI) del prototipo aprobado | ¿Cambiar fuente de lectura? |
| C3 | Fondo crema, modo oscuro | `docs/05`: `#F6F7FB` (gris azulado claro) | ¿Cambiar paleta? |
| C4 | Módulo de matemáticas (F5) | `docs/00`: producto de lectura; regla "¿mantiene la lectura como protagonista?" | ¿Matemáticas entra en el alcance de v1? |
| C5 | Rachas: "nunca rachas que castigan" | `docs/01`: rachas con "racha protegida" | Compatible — se confirma, no es choque real |
| C6 | Perfiles múltiples (Noah + Ariella) | DEVLOG: "un solo perfil, a propósito fuera de v1" | ¿Se abre multi-perfil ahora? (Modo Enfoque es "por perfil") |
| C7 | Estructura `src/config/focusMode.ts` | Monorepo `packages/*` + `apps/reader` | Se adapta a la estructura existente (§1) — no requiere decisión |
| C8 | `docs/ROADMAP.md` / `SESSION_LOG.md` | Ya existían `docs/08-ROADMAP.md` y `docs/DEVLOG.md` | Resuelto: se crean los nuevos y se conservan los viejos (08 = visión, ROADMAP = tareas; DEVLOG = narrativa, SESSION_LOG = relevo) |

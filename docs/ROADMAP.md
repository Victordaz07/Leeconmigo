# ROADMAP — tareas con ID (tabla viva)

Visión y fases de producto: `docs/08-ROADMAP.md`. Plan que origina estos IDs: `docs/10-PLAN-MAESTRO-V2.md`.
Estados: ✅ hecho · 🟡 en curso · ⬜ por hacer · ⏸️ bloqueado (esperando decisión, ver `docs/DECISIONS.md`).
Regla: tareas de ~30–45 min. Si una crece, se divide aquí (`F2-04a`, `F2-04b`…).

> Desde D7, las tareas de UI de F2–F6 se construyen en la app nueva (`apps/mobile`), no en `apps/reader`.
> Las de lógica pura (p. ej. F2-04a) sirven para las dos.

| ID | Tarea | Estado | Cuenta | Rama / nota |
|---|---|---|---|---|
| **F0** | **Diseño (Claude Design)** | | | |
| F0-01 | Variante "Modo Enfoque" de las pantallas existentes + pantallas nuevas (ver plan §3) | ⬜ | – | Victor en Claude Design; exportar a `docs/design/` |
| F0-02 | Decidir tipografía/paleta (C2, C3) | ⏸️ | – | espera respuesta de Victor |
| **RN** | **Migración a React Native + Expo** (D7, `docs/11`) | | | |
| RN-00 | Registrar decisión, plan de migración y lista legal | ✅ | A | `claude/gracious-shannon-a0238d` |
| RN-01 | Crear `apps/mobile` (Expo + TS) usando `contracts`/`reading-engine`/`story-engine` | 🟡 | A | código listo y empaquetando; falta verlo en el Android de Victor (`npx expo run:android`) |
| RN-02 | Tokens en TS + fuentes + componentes base en `packages/ui-native` | ✅ | A | botón, tarjeta, micrófono; Andika + Nunito empaquetadas |
| RN-03 | Prueba técnica de voz con `whisper.rn` en la tablet de Noah | ⬜ | – | decide el motor de voz nativo |
| RN-04 | Pantalla de lectura con `FakeReadingEngine` | ✅ | A | texto + palabra actual + coach/mic + ayuda (sílabas, `expo-speech`) + panel DEV; lógica de vista compartida en `packages/ui-core` |
| RN-05 | Cómic: globos + acomodo de texto (24 historias) | ✅ | A | `fitText` (ui-core) con medidas de Andika, paridad con la web ±3 %; ilustraciones vía `require.context` (sin copiar) |
| RN-06 | Resto del flujo + Modo padres con PIN → **RN-CP1** paridad con simulador | ⬜ | – | |
| RN-07 | `WhisperNativeSpeechEngine` + `RealReadingEngine` | ⬜ | – | depende de RN-03 |
| RN-08 | Almacenamiento local + migración de progreso → **RN-CP2** Noah usa la nueva | ⬜ | – | |
| RN-09 | Build iOS | ⬜ | – | necesita cuenta Apple / EAS |
| **P** | **Publicación** (D8, `docs/12`) | | | |
| P-01 | Revisión con abogado (COPPA / California) | ⬜ | Victor | |
| P-02 | Política de privacidad, términos, avisos y descargos (borradores para el abogado) | ⬜ | – | |
| P-03 | Botón "Borrar todos los datos" + candado de padres para enlaces externos | ⬜ | – | en la app nueva |
| P-04 | Cuenta Google Play + prueba cerrada con familias | ⬜ | Victor | depende de C11 |
| P-05 | Búsqueda de marca "Lee Conmigo" + términos de las herramientas de ilustración | ⬜ | Victor | |
| **F1** | **Repo y relevo** | | | |
| F1-01 | Monorepo Vite + React + TS | ✅ | – | ya existía |
| F1-02 | `HANDOFF.md`, `docs/ROADMAP.md`, `docs/log/SESSION_LOG.md`, `docs/DECISIONS.md`, `/retomar`, `/relevo`, protocolo en `CLAUDE.md` | ✅ | A | `claude/gracious-shannon-a0238d` |
| F1-03 | Tests base (Vitest) + typecheck + deploy de prueba (Vercel) | ✅ | – | ya existía (1068 pruebas) |
| F1-04 | Script `npm run check` = typecheck + test, para que `/retomar` sea un solo comando | ⬜ | – | |
| **F2** | **Base de la app** | | | |
| F2-01 | PIN de padre | ✅ | – | `apps/reader/src/parent-settings.ts` |
| F2-01b | Perfiles múltiples (selector con avatar) | ⏸️ | – | C6 |
| F2-02 | Tokens de diseño de F0 + componentes base | 🟡 | – | tokens del prototipo ya en `packages/ui/src/styles/tokens.css`; faltan los de F0 |
| F2-03 | Navegación niño / padre | ✅ | – | ya existía |
| F2-04a | Modo Enfoque: tipos `FocusSettings` + `FOCUS_PRESETS` + resolución por horario (lógica pura + tests) | ⬜ | – | contracts + session-engine |
| F2-04b | Modo Enfoque: persistencia + pantalla en Modo padres (Apagado/Encendido/Personalizado) | ⬜ | – | `apps/reader` + `packages/ui` |
| F2-04c | Modo Enfoque: aplicar apoyos ya posibles sin diseño nuevo (umbrales de voz al `ReadingTimer`, movimiento reducido, 1 pregunta por pantalla) | ⬜ | – | |
| F2-04d | Modo Enfoque: apoyos que necesitan pantallas de F0 (barra de tiempo, meta/caritas, pausa de movimiento, elección de actividad) | ⬜ | – | depende de F0-01 |
| **F3** | **Voz y temporizador** | | | |
| F3-01 | Reconocimiento en el dispositivo, fallar cerrado | ✅ | – | Whisper local (WASM) |
| F3-02 | Temporizador por actividad de voz | ✅ | – | umbrales fijos 10 s / 3 s; configurables en F2-04c |
| F3-03 | Calibración en la tablet de Noah (ruido, susurro, acentos) — registrar en el log | ⬜ | – | `docs/09` #6/#7 |
| **F4** | **Lectura y cuestionarios** | | | |
| F4-01 | Formato JSON de historia | ✅ | – | `packages/contracts/src/story.ts` |
| F4-01b | Etiquetas de estándares en el esquema (opcional) | ⏸️ | – | C9 |
| F4-02 | Lector por niveles | ✅ | – | cómic / illustrated reader; nivel 4 sin contenido |
| F4-03 | Motor de cuestionarios: opción múltiple | ✅ | – | |
| F4-03b | Tipos nuevos: V/F, ordenar, unir, "toca la oración que lo demuestra" | ⬜ | – | |
| F4-04 | Repetición espaciada (1, 3, 7 días) | ⬜ | – | |
| **F5** | **Matemáticas** | | | ⏸️ todo F5 espera C4 |
| F5-01 | Plantillas de problemas por esquema (total / diferencia / cambio / grupos iguales) | ⏸️ | – | |
| F5-02 | Entradas: teclado, opción múltiple, recta numérica, fichas, fracciones | ⏸️ | – | |
| F5-03 | Pistas por escalones + ejemplo resuelto | ⏸️ | – | |
| F5-04 | Contador de "práctica activa" separado del de lectura | ⏸️ | – | |
| **F6** | **Panel de padres** | | | |
| F6-01 | Tarjeta diaria (3 números) + semana | ⬜ | – | "Mi progreso" ya existe con datos reales; falta la vista de padre |
| F6-02 | Recompensas y canje | ⬜ | – | |
| F6-03 | Resumen para compartir con la maestra (opcional) | ⬜ | – | |
| **F7** | **Contenido Unidad 1** (grado de Noah, EN/ES, revisión humana) | ⬜ | – | espera grado/temas (plan §6) |
| **F8** | **Prueba con Noah** (2 semanas, notas en `docs/log/`) | ⬜ | – | |

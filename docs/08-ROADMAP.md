# 08 — Roadmap

Regla de secuencia: **construir de adentro hacia afuera, con vertical
slices pequeñas y completas.** No expandir a la siguiente fase hasta que
la anterior esté demostrada. No conectar Android/voz real hasta que la
experiencia funcione completa con `FakeReadingEngine`.

## Estado actual (a la fecha de este documento)

- ✅ Documentación base congelada (este `/docs`).
- ✅ Contrato `ReadingEngine`/`ReadingEvent` definido y ya validado contra
  un prototipo funcional real.
- ✅ **Reading Session UI/UX prototipada** (Claude Design canvas): una
  historia completa en español, 20 estados, panel de simulación de
  eventos, pantallas Home/Select/Prep/Reading/Help/PageDone/Question/
  Review/End/Progress. Esto ya cubre gran parte de las Etapas 3–7 de abajo
  a nivel de diseño/interacción — falta extraer su lógica a un
  `FakeReadingEngine` real en código (paquete, no HTML de un solo archivo)
  y conectarlo a componentes React reales.
- ⬜ Prototipo 00 (prueba técnica de reconocimiento de voz real en la
  tablet de Noah) — **no se ha ejecutado todavía**. Ver
  `claude/prototipo-00-prueba-reconocimiento-voz.md` original para el
  protocolo completo (escenarios A–I, métricas y umbrales, matriz de
  decisión PWA-Whisper vs. Capacitor+Kotlin vs. nativo).
- ⬜ Proyecto base React/Vite/TypeScript con Capacitor aún no creado como
  repo real.

## Siguiente paso inmediato

1. Crear el proyecto base (React + Vite + TypeScript) e importar la lógica
   del prototipo de Reading Session como código real (`packages/
   reading-engine`, `packages/ui`), no como el HTML monolítico actual.
2. En paralelo, correr el **Prototipo 00** en la tablet real de Noah para
   decidir con datos el motor de voz (ver matriz de decisión en el doc
   original) antes de tocar Kotlin/Android.
3. Resolver los puntos de `09-OPEN-DECISIONS.md` que bloquean diseño (PIN
   de padres, modelo de niveles, resaltado por palabra/frase) antes de dar
   el prototipo por "congelado".

## Fases técnicas generales

| Fase | Contenido |
|---|---|
| A — Prototype Core | React/Vite/TS, Reading Session, FakeReadingEngine, FakeSpeechEngine |
| B — Full Reading Session | Varias páginas, comic, transiciones, comprensión, fin de historia |
| C — Mobile Container | Capacitor, proyecto Android, permisos, almacenamiento local |
| D — Native Audio | Kotlin, micrófono, AudioRecord, VAD, eventos de audio |
| E — Speech | Reconocimiento real, resultados parciales, confianza, fallbacks |
| F — Reading Intelligence | Word alignment, pausas, repeticiones, saltos, errores, fluidez, ayuda |
| G — Product Expansion | Biblioteca, perfiles, progreso, recompensas, padres, cloud sync |

## Checkpoints de "no avanzar sin esto"

- **Checkpoint 1** (antes de Fase C/D): demostrar en navegador el flujo
  completo con `FakeReadingEngine` — abrir historia, iniciar lectura,
  seguir palabra actual, simular pausa, simular error, pedir ayuda,
  terminar página, pregunta de comprensión, pasar de página. *(Ya
  demostrado por el prototipo actual para una historia/página; falta
  extenderlo a múltiples páginas/historias reales — Fase B).*
- **Checkpoint 2** (antes de Fase E): Android abre, micrófono funciona,
  VAD funciona, eventos de audio funcionan, UI se comporta igual que en
  navegador.
- **Checkpoint 3** (antes de Fase G): voz real + alineación + seguimiento +
  ayuda + sesión completa funcionando con una historia real, no solo el
  piloto.

## Qué NO construir primero

30 historias completas · 360 adaptaciones · cientos de ilustraciones ·
backend complejo · tienda/marketplace · social · rankings públicos. Primero
demostrar Reading Engine + Reader UX con una sola historia real.

## Fases posteriores (resumen, detalle en documentos originales del
proyecto si se necesita expandir cada una)

Normalización de texto (mayúsculas, puntuación, contracciones, ES/EN) ·
Word Alignment Engine · Reading Intelligence (clasificar correcta/
incierta/incorrecta/omitida/repetida/autocorrección) · Help Engine con
niveles · Text-to-Speech · Sesiones y métricas (WPM, pausas, ayuda,
errores) · Comprensión · Progress Engine (personalización futura) ·
Biblioteca · Perfil infantil · Recompensas · Experiencia de padres · Cloud
sync (local-first, offline siempre debe funcionar) · iOS/iPad (solo cuando
Android esté estable — mismo core React/Capacitor, solo cambia la capa
nativa) · Optimización (batería, CPU, memoria, tamaño de app) · Beta con
condiciones reales (lectura rápida/lenta, susurro, ruido, acento,
repetición, hermanos hablando, tablet barata/rápida, internet
intermitente).

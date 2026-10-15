# 13 — Kitewise: el diseño que guía el proyecto

**DECISIÓN (Victor, 2026-10-15, `docs/DECISIONS.md` D9):** "Tenemos el aspecto visual y algunas mejoras que
implementaremos; vamos a basar el proyecto alrededor del diseño, y luego mejoramos y ajustamos."

El diseño de Claude Design **Kitewise** (35 pantallas) es la referencia de producto y de UX/UI. Lee Conmigo pasa de
"libro de lectura" a **multicuaderno de materias** (Lectura, Matemáticas, Ciencia, Sociedad, Arte y música + Mi
cuaderno), con sesiones de 4 momentos (Aprender → Explorar → Practicar → Juego → Cierre).

Material completo en `docs/design/kitewise/`:
- `SPEC.md`: especificación principal (concepto, navegación, flujo, pantallas, componentes, reglas, modelo de datos).
- `screens/*.webp`: captura de cada pantalla (A1–A2, B1–B14, P1–P5, G1–G14).
- `Kitewise-UX-Final.html`: el lienzo original (abrir en el navegador).
- `tokens.css`: tokens nuevos (extienden los existentes).
- `ART-BRIEF.md`: arte por producir (Ciencia, Sociedad, Arte). `STANDARDS-REVIEW.md`: estándares de California, BORRADOR.

## Cómo se adapta al repo (lo que cambia respecto al handoff)

El handoff se escribió para la app web (`packages/ui`, Tailwind). Por **D7** la app se construye en **React Native**:

| El handoff dice | Aquí se hace |
|---|---|
| Componentes nuevos en `packages/ui` | En `packages/ui-native` (pintado) + `packages/ui-core` (lógica pura compartida) |
| `src/styles/tokens.css` | `packages/ui-native/src/tokens.ts` (los tokens de Kitewise se agregan con prueba de paridad contra `docs/design/kitewise/tokens.css`) |
| Rediseñar `home.tsx`, `end.tsx`, `parent-settings.tsx`… | Pantallas nuevas en `apps/mobile/src/screens/` |
| `data-focus`, `data-theme`, media query de orientación | Contexto de tema en React Native (`useColorScheme`, `useWindowDimensions`) que los componentes leen |
| `apps/reader` (web) | Sigue como está para Noah hasta la paridad (RN-CP2); no se rediseña |

Lo que **no cambia**: el motor de lectura y de voz, las reglas de `docs/06` (nunca «incorrecto» ni rojo), la privacidad
(`docs/07`, D1), arte y texto separados, Andika/Nunito.

## Lo que el diseño resuelve de las preguntas abiertas

- **C2 fuente:** se queda Andika + Nunito; **Lexend** como alternativa en Ajustes (dislexia).
- **C3 paleta:** se mantiene la actual + superficies de cuaderno (papel crema) + **modo oscuro** cálido.
- **C4 matemáticas:** sí, y además Ciencia, Sociedad y Arte y música.
- **C6 perfiles:** sí, varios niños (B1, "Agregar niño" pide PIN).
- **C9 estándares:** se etiquetan, pero solo los ven los padres, y como «borrador» hasta que un docente los valide.
- **Modo Enfoque:** Apagado / Encendido / Personalizado, horario, pausa de movimiento, más "Enfoque adaptativo".
- **docs/09 #3 niveles:** "sin bloqueos: todo abre; lo sugerido se destaca".

## Lo que sigue abierto (ver `docs/DECISIONS.md`)

- **C12 nombre:** ¿la app pasa a llamarse **Kitewise** o sigue "Lee Conmigo"? Afecta tienda, marca (búsqueda de marca,
  `docs/12` §5) e identificador de la app.
- **C13 foto de la tarea (P3):** usar la cámara y leer la foto en el dispositivo es una capacidad nueva. Antes de
  construirla: revisión de privacidad (`docs/12`). Se deja para el final.
- **Contenido:** Matemáticas, Ciencia, Sociedad y Arte no tienen lecciones todavía (solo el piloto de 4.º del diseño).
  Arte pendiente (`ART-BRIEF.md`). Los estándares, sin validar.

## Orden de construcción (IDs en `docs/ROADMAP.md`)

Primero la **estructura** con el contenido que ya existe (Lectura), luego las piezas nuevas:

| ID | Qué | Pantallas |
|---|---|---|
| K1 | Tokens de Kitewise + `NotebookCover`, `SubjectTab`, `NavRail`, `SessionPhases`; Inicio con misión del día y estantería de cuadernos; Cuaderno de Lectura abierto | B3, B4 |
| K2 | Lectura dentro del cuaderno (rail con progreso, pestaña de materia) y estados: pausa ámbar, palabra difícil, sin micrófono, sin conexión | B9, B11, G11–G13 |
| K3 | Cierre de sesión (estrellas por esfuerzo, papalote, carita de enfoque) + perfiles + "¿Cómo llegas?" | B13, B1, B2 |
| K4 | Padres: bienvenida+PIN, panel de hoy, ajustes (Modo Enfoque, accesibilidad, privacidad) | P1, P2, P4 |
| K5 | Practicar: `ConfidencePicker`, `HintLadder`, V/F y ordenar; repaso 1-3-7 días | B8, G9, G10 |
| K6 | Modelo de unidades/lecciones + Aprender, Explorar (`PaintGrid`, `DragZone`, `NumberLine`) + camino de unidad; primera unidad de Matemáticas | B5, B6, B7 |
| K7 | Modo Enfoque (B10, B12, adaptativo), modo oscuro (G1–G3), vertical (G4–G6) | B10, B12, G1–G6 |
| K8 | Mi cuaderno, Logros, informe PDF, foto de la tarea (tras C13) | B14, P5, P3 |

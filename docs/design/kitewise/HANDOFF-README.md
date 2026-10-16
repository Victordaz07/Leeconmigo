# Kitewise — paquete de entrega para Claude Code

Evolución de **Lee Conmigo** (repo `Victordaz07/Leeconmigo`, rama `master`) hacia un multicuaderno de materias para niños de 1.º a 6.º. No es una app nueva: se reutiliza el motor de voz, `packages/ui`, el rail, los botones físicos, la mascota y Andika/Nunito.

## Contenido
- `reference/Kitewise-UX-Final.html` — las 35 pantallas, abrir en el navegador (lienzo con zoom). Etiquetas: A (mapa y sistema), B (niño), P (padres), G (oscuro, vertical, lecturas 1–2 y 5–6, preguntas V/F y ordenar, estados, arte).
- `docs/design/README.md` — **especificación principal**: concepto, navegación, flujo, tabla pantalla → archivo del repo a modificar, componentes nuevos, reglas, modelo de datos, orden de construcción.
- `docs/design/ART-BRIEF.md` — encargo de arte original (pendiente de producir).
- `docs/design/STANDARDS-REVIEW.md` — estándares de California: borrador, sin validar por docente.
- `src/styles/tokens.css` — tokens nuevos que **extienden** `packages/ui/src/styles/tokens.css` (no lo reemplazan).
- `reference/assets/mascot.png` — mascota actual.

## Prompt para pegar en Claude Code
> Lee `CLAUDE.md` y `docs/00`–`09` del repo, y luego `kitewise-handoff/docs/design/README.md`. Abre `reference/Kitewise-UX-Final.html` como referencia visual. Implementa por fases, en este orden, y haz commit al final de cada una con las pruebas en verde:
> 1. Copia `tokens.css` a `src/styles/` y enlázalo después del de `packages/ui`. Crea `NotebookCover`, `NotebookSpread`, `SubjectTab`; rediseña `home.tsx` (pantalla B3) con estantería de cuadernos y misión del día; añade B4 (cuaderno abierto). Usa contenido existente de Lectura.
> 2. Sesión de 4 momentos (`SessionPhases`), pantalla de cierre B13, check-in de energía B2, perfiles B1.
> 3. Practicar (B8): `HintLadder`, `ConfidencePicker`, preguntas V/F (G9) y ordenar (G10); repaso espaciado 1-3-7 días.
> 4. Explorar (B7): `PaintGrid`, `DragZone`, `NumberLine`, con rechazo de palma.
> 5. Modo Enfoque (B10, B12), oscuro (G1–G3) y vertical (G4–G6) con los tokens `data-focus`, `data-theme` y la media query de orientación.
> 6. Estados (G11–G13) y lecturas 1.º–2.º y 5.º–6.º (G7, G8).
> 7. Padres: P1, P2, P4; luego P3 (foto de tarea, procesada solo en el dispositivo) y P5 (informe PDF).
>
> Reglas que no se negocian: nunca «incorrecto» ni rojo de error; el texto es UI, nunca imagen; la voz y las fotos no salen del dispositivo; la UI no depende de un proveedor de voz concreto; botones táctiles ≥ 64 px; textos en español hasta ~25 % más largos (sin anchos fijos). No muestres códigos de estándares a los niños y marca como «borrador» lo que no esté validado (ver `STANDARDS-REVIEW.md`). No inventes arte: usa los placeholders hasta que exista el arte de `ART-BRIEF.md`. Si algo del diseño choca con el motor o los tests existentes, detente y pregunta.

## Pendientes conocidos
Arte original para Ciencia, Sociedad y Arte · validación docente de estándares · contenido real por unidad (hoy solo hay piloto de 4.º) · confirmar herramienta de ilustración (ver `docs/09`).

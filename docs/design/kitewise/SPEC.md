# Kitewise — UX/UI final (handoff para Claude Code)

Fuente visual: `Kitewise UX Final.dc.html` (21 pantallas, 1280×800). Tokens: `src/styles/tokens.css` (extiende `packages/ui/src/styles/tokens.css`; no sustituye nada).
Esto es una **evolución de Lee Conmigo**, no una app nueva: se conserva el motor de voz, el rail, los botones físicos, la mascota, Andika/Nunito y las reglas de `docs/06-CHILD-UX-RULES.md`.

## 1. Concepto: de «libro de lectura» a «multicuaderno de materias»
- Cada materia es un **cuaderno** (portada con arte real, espiral, pestaña de color). Materias: Lectura, Matemáticas, Ciencia, Sociedad, Arte y música. Más **Mi cuaderno** (personal).
- La lectura (el motor actual) pasa a ser **un tipo de página** dentro del cuaderno de Lectura. Nada del motor cambia.
- Dentro de un cuaderno hay **unidades** (por grado, estándares de California). Cada unidad = lecciones. Cada lección = sesión de 4 momentos.
- **Regla visual:** ninguna pantalla va sin imagen de referencia. Si una pantalla es de texto (Enfoque), la ilustración queda como fondo desenfocado a baja opacidad, no se elimina.

## 2. Navegación
- Niño: rail izquierdo (Inicio, Logros, Padres). Dentro de un cuaderno: pestañas de materia en el borde derecho. Atrás siempre arriba a la izquierda.
- Padres: detrás de PIN (ya existe `parent-gate.tsx`).
- Sin bloqueos (decisión existente en `docs/01`): todo abre; lo sugerido se destaca.

## 3. Flujo
Elegir perfil (B1) → ¿Cómo llegas? (B2) → Inicio (B3) → Cuaderno (B4) → Unidad (B5) → Sesión: **Aprender (B6) → Explorar (B7) → Practicar (B8) → Juego → Cierre (B13)**. Siempre disponibles: Pausa (B11), Pausa de movimiento (B12), Mi cuaderno (B14), Repaso (calentamiento).
Padres: Bienvenida+PIN (P1) → Panel (P2) → Aula (P3) / Ajustes (P4) / Informe (P5).

## 4. Pantallas (id del lienzo → qué hacer en el repo)
| Id | Pantalla | Base existente | Cambio |
|---|---|---|---|
| A1/A2 | Mapa y sistema | — | Referencia |
| B1 | Elegir perfil | nuevo | Avatares + «Agregar niño» (pide PIN) |
| B2 | ¿Cómo llegas? | nuevo | 3 opciones: 20 / 15 / 8 min. Guarda `energy` en la sesión |
| B3 | Inicio | `screens/home.tsx` | Hero = misión del día con 4 momentos; sección «Tus cuadernos» (6 tarjetas) en lugar de «Mis historias» y «Niveles» |
| B4 | Cuaderno abierto | `library.tsx` (concepto) | Índice de unidades (izq.) + unidad actual con 3 lecciones (der.), pestañas |
| B5 | Camino de unidad | nuevo | Nodos + papalote. Fondo = arte de la unidad desenfocado |
| B6 | Aprender | nuevo | Ilustración con anotaciones + texto Andika + idea clave + vocabulario con audio |
| B7 | Explorar | nuevo | Interacción táctil sobre la imagen (pintar, arrastrar, deslizar, encerrar) |
| B8 | Practicar | `question.tsx` | + selector de confianza (Seguro / Más o menos / Adivino) antes de «Comprobar» |
| B9 | Lectura Enfoque off | `side-panel.tsx` (SideRail) + `reading-bar.tsx` | Igual; añadir pestaña Lectura |
| B10 | Lectura Enfoque on | nuevo estado | `data-focus="on"`: arte desenfocado de fondo, 1 frase resaltada, 3 botones |
| B11 | Pausa | `overlays.tsx` | Tarjeta ámbar «Te espero…» |
| B12 | Pausa de movimiento | nuevo | Temporizador circular + 3 poses, 60–90 s cada 10 min en Enfoque |
| B13 | Cierre | `screens/end.tsx` | Estrellas por esfuerzo, papalote +m, sello, carita de enfoque, «Guardar en mi cuaderno» |
| B14 | Mi cuaderno | nuevo | Palabras, descubrimientos, dibujos |
| P1 | Bienvenida + PIN | `parent-gate.tsx` | Paso 1 de 3 (PIN → perfil → idioma) |
| P2 | Panel de hoy | `progress.tsx` (concepto) | Tarjeta de reporte + lo que hizo hoy con miniaturas |
| P3 | Aula: foto de tarea | nuevo | Cámara → temas + estándar → «Practicar estos temas» |
| P4 | Ajustes | `parent-settings.tsx` | + Modo Enfoque (Apagado / Encendido / Personalizado), energía, accesibilidad, privacidad |
| P5 | Informe | nuevo | Una página, exportable a PDF |

## 5. Componentes nuevos (`packages/ui`)
`NotebookCover`, `NotebookSpread` (espiral + dos páginas), `SubjectTab`, `SessionPhases` (4 píldoras), `KiteProgress`, `MasteryBar` (3 segmentos), `ConfidencePicker`, `HintLadder` (3 escalones), `PaintGrid`, `DragZone`, `NumberLine`, `SequencePad`, `EnergyPicker`, `MovementTimer`, `NotebookEntry`, `ReportCard`, `ArtBackdrop` (imagen desenfocada para Enfoque).
Reutilizar: `NavRail`, `MicBadge`, `Speaker`, botones físicos, `FitBox`, `BlockText`.

## 6. Reglas de comportamiento
- Sesión: Aprender 25 % · Explorar 25 % · Practicar 35 % · Juego 15 %. Duración 20 / 15 / 8 min según energía.
- Error: pista (escalón 1) → ejemplo resuelto (2) → ver respuesta (3). «Lo veo luego» manda el reto al repaso. Nunca «incorrecto», nunca rojo.
- Repaso espaciado: lo fallado vuelve al día 1, 3 y 7, en el calentamiento. El niño ve «retos que regresan».
- Dominio por habilidad: `explorando → practicando → dominado`. Sin porcentajes al niño. Padres ven detalle.
- Enfoque adaptativo: señales = toques erráticos y pausas largas (sin cámara ni audio). Al detectar dispersión: `data-focus="on"`, ofrecer pausa de movimiento. El niño no ve avisos.
- Racha: días de descanso planeados no la rompen.
- Táctil: rechazo de palma siempre; vibración suave opcional (apagada en Enfoque); mínimo 64 px.
- Privacidad: voz y fotos se procesan en el dispositivo, no se guardan ni se suben. Cámara solo con permiso del padre.
- Texto es UI, nunca imagen. Textos ES ~25 % más largos: ninguna caja con ancho fijo para texto.

## 7. Modelo de datos (additivo a `packages/contracts`)
```ts
type SubjectId = 'lectura' | 'mate' | 'ciencia' | 'sociedad' | 'arte';
type Mastery = 'none' | 'explorando' | 'practicando' | 'dominado';
interface Unit { id: string; subject: SubjectId; grade: 1|2|3|4|5|6; title: string; standards: string[]; lessons: Lesson[]; cover: IllustrationRef }
interface Lesson { id: string; unitId: string; steps: Step[] }
type Step =
 | { kind: 'aprender'; blocks: LearnBlock[] }
 | { kind: 'explorar'; interaction: 'paint'|'drag'|'slide'|'circle'|'sequence'; payload: unknown }
 | { kind: 'practicar'; challenge: Challenge }
 | { kind: 'juego'; game: 'parejas'|'memoria'|'ritmo' };
interface SkillState { skillId: string; mastery: Mastery; lastSeen: string; due: string[] /* repaso 1,3,7 */ }
interface Session { energy: 'high'|'normal'|'low'; minutes: 20|15|8; focus: 'off'|'on'|'auto'; phaseLog: unknown[] }
interface ClassTopic { subject: SubjectId; skillId: string; weekOf: string } // «Aula»
```
Estándares (CCSS, NGSS, HSS, VAPA) son borrador: validar con un docente antes de publicar.

## 8. Orden de construcción sugerido
1. Tokens + `NotebookCover/Spread/SubjectTab`, B3 y B4 (estructura nueva, con contenido existente de Lectura).
2. Sesión de 4 momentos + `SessionPhases` + B13.
3. Practicar (B8) con `HintLadder` y `ConfidencePicker`; repaso espaciado.
4. Explorar: `PaintGrid`, `DragZone`, `NumberLine`.
5. Enfoque (B10, B12) + Enfoque adaptativo.
6. Padres: P1, P2, P4; luego P3 (foto) y P5.
7. Ciencia, Sociedad, Arte: contenido por plantillas; revisión docente.

## 9. Pendiente
Modo oscuro · vertical · estados sin micrófono / sin conexión / palabra difícil · lectura 1.º–2.º (cómic) y 5.º–6.º · tipos V/F y ordenar · arte original para Ciencia, Sociedad y Arte (hoy se usan portadas existentes de la app como referencia).

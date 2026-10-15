# 07 — Privacy & Audio (regla absoluta)

## La voz del niño no se almacena. Nunca.

```
MICRÓFONO → BUFFER TEMPORAL → RECONOCIMIENTO LOCAL → TEXTO TEMPORAL
   → READING MATCHER → MÉTRICAS/PROGRESO → DESCARTAR AUDIO
```

No deben crearse archivos de audio persistentes (nunca algo como
`children_audio/noah_september25.wav`). Los fragmentos reconocidos viven
solo en memoria durante la sesión; al terminar solo se guardan
estadísticas derivadas (duración, tiempo válido, historia, nivel, idioma,
páginas, checkpoints, palabras con dificultad, % completado).

- El reconocimiento debe realizarse localmente siempre que la plataforma y
  el dispositivo lo permitan.
- Si un dispositivo/idioma no soporta reconocimiento local: limitar
  funciones o pedir autorización explícita para procesar en otro lugar;
  **nunca enviar audio a la nube en silencio**.
- Introducir cualquier proveedor externo que requiera enviar audio fuera
  del dispositivo debe ser una decisión explícita de arquitectura y
  privacidad, no un efecto colateral de una integración.
- Las respuestas abiertas por voz (comprensión) siguen la misma regla:
  se procesan temporalmente y se descartan; no se conserva grabación.

## Qué SÍ se puede guardar (datos derivados)

```json
{
  "storyId": "story_07",
  "grade": 3,
  "language": "en",
  "validReadingSeconds": 842,
  "sessionSeconds": 1021,
  "comprehensionCorrect": 5,
  "comprehensionTotal": 6,
  "wordsHelped": ["through", "enormous"],
  "completion": 0.82
}
```

## Entidades principales de datos

```
UserAccount, ChildProfile, ParentProfile, Story, StoryVersion, Scene,
Character, Asset, ReadingSession, ReadingProgress, VocabularyItem,
ComprehensionResult, Goal, Achievement, Streak, DownloadPackage, Settings
```

```json
// ChildProfile
{
  "id": "child_001",
  "displayName": "Noah",
  "grade": 3,
  "primaryLanguage": "en",
  "enabledLanguages": ["en", "es"],
  "dailyGoalMinutes": 15,
  "readingPreferences": {}
}
```

No guardar datos innecesarios más allá de esto.

## Acceso de padres

Modo Padres protegido por PIN u otro mecanismo sencillo. **El prototipo de
Reading Session actual no implementa este PIN gate** (se llega a la
pantalla de progreso tocando un ícono desde Home sin fricción) — corregir
antes de producción; ver `09-OPEN-DECISIONS.md`.

## Seguridad infantil

Mínima recolección de datos · no almacenar audio · no exponer perfil
públicamente · no chat social abierto · no publicidad dirigida · no
interacción con desconocidos · controles parentales reales · diseño
adecuado para menores. La revisión legal específica de privacidad infantil
(COPPA / leyes de California, dado que Noah está en California) debe
hacerse antes de cualquier lanzamiento fuera del uso familiar — ver
`09-OPEN-DECISIONS.md`.

## Métricas de producto a evitar

No incentivar velocidad excesiva, lectura superficial ni acumulación
artificial de tiempo válido. Las métricas de producto (minutos válidos,
sesiones completadas, retorno semanal, historias terminadas, palabras
dominadas, comprensión, abandono, uso por idioma) sirven para mejorar el
producto, no para presionar al niño.

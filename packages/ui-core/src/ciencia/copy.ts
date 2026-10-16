/**
 * Textos de la INTERFAZ de Ciencia en ES/EN (rótulos, botones, distintivos, marcos de frase). Los textos de la unidad (pasos,
 * tareas, pistas, glosario) viven en `@lee-conmigo/science-content`. Tono de acompañamiento: nunca «incorrecto», nunca rojo
 * (docs/06). Escritos de forma natural en cada idioma, no traducidos palabra por palabra.
 */
export type CienciaLang = 'es' | 'en';
export interface Loc {
  es: string;
  en: string;
}
const L = (es: string, en: string): Loc => ({ es, en });

export type CienciaPhase = 'observa' | 'explora' | 'explica' | 'usa';
export type CienciaCover = 'ninguna' | 'parcial' | 'completa';
export type CienciaSlope = 'suave' | 'media' | 'fuerte';

export const CIENCIA_COPY = {
  subject: L('Ciencia', 'Science'),
  /** Las cuatro píldoras de cada sesión (SessionPhases). */
  phase: { observa: L('Observa', 'Observe'), explora: L('Explora', 'Explore'), explica: L('Explica', 'Explain'), usa: L('Usa', 'Use') } satisfies Record<CienciaPhase, Loc>,
  button: {
    next: L('Seguir', 'Continue'),
    check: L('Comprobar', 'Check'),
    hint: L('Pista', 'Hint'),
    moreHelp: L('Más ayuda', 'More help'),
    done: L('Listo', 'Done'),
    water: L('Regar', 'Water it'),
    waterAgain: L('Regar otra vez', 'Water again'),
    writeDown: L('Anotar', 'Write it down'),
    saveLater: L('Guardar y seguir después', 'Save and continue later'),
    later: L('Lo veo luego', 'I’ll see it later'),
    undo: L('Deshacer', 'Undo'),
    startOver: L('Empezar de nuevo', 'Start over'),
    back: L('Volver', 'Back'),
    start: L('Empezar', 'Start'),
    resume: L('Seguir donde iba', 'Continue where I left off'),
    again: L('Hacer de nuevo', 'Do it again'),
    revealQuakes: L('Ver los sismos', 'Show the earthquakes'),
    toNotebook: L('Ir al cuaderno', 'Go to the notebook'),
  },
  /** Distintivos de procedencia (se ven siempre junto a los datos). */
  badge: {
    practiceData: L('Datos de práctica (inventados para aprender)', 'Practice data (made up for learning)'),
    practiceMap: L('Mapa de práctica: no es un lugar real', 'Practice map: not a real place'),
    observed: L('Lo observaste tú', 'You observed this'),
  },
  /** Marcos de frase (apoyo para explicar; no una fórmula obligatoria). */
  frame: {
    observed: L('Observé…', 'I observed…'),
    compared: L('Comparé…', 'I compared…'),
    evidence: L('Mi evidencia es…', 'My evidence is…'),
    changedMind: L('Cambié mi idea porque…', 'I revised my idea because…'),
    matched: L('Mi predicción coincidió.', 'My prediction matched.'),
    notMatched: L('Mi predicción no coincidió.', 'My prediction didn’t match.'),
  },
  tray: { A: L('Bandeja A', 'Tray A'), B: L('Bandeja B', 'Tray B'), left: L('Izquierda', 'Left'), right: L('Derecha', 'Right') },
  cover: { ninguna: L('Sin cobertura', 'No cover'), parcial: L('Cobertura parcial', 'Partial cover'), completa: L('Con cobertura', 'With cover') } satisfies Record<CienciaCover, Loc>,
  slope: { suave: L('Poco inclinada', 'Gentle slope'), media: L('Inclinación media', 'Medium slope'), fuerte: L('Muy inclinada', 'Steep slope') } satisfies Record<CienciaSlope, Loc>,
  controls: { cover: L('Cobertura', 'Cover'), slope: L('Inclinación', 'Slope') },
  /** Lo que se ve en el vaso. */
  cup: { poca: L('poca tierra', 'a little soil'), algo: L('algo de tierra', 'some soil'), mucha: L('mucha tierra', 'a lot of soil') },
  cupTitle: (tray: string) => L(`Vaso de la ${tray}`, `${tray} cup`),
  trial: (n: number) => L(`Prueba ${n}`, `Trial ${n}`),
  trialOf: (n: number, t: number) => L(`Prueba ${n} de ${t}`, `Trial ${n} of ${t}`),
  scale: { title: L('Báscula', 'Scale'), weighed: (g: number) => L(`Pesé ${g} g`, `I weighed ${g} g`) },
  table: { title: L('Mi tabla de datos', 'My data table'), empty: L('Sin anotar', 'Not written yet') },
  chart: {
    title: L('Mi gráfica', 'My graph'),
    axis: L('gramos de sedimento', 'grams of sediment'),
    check: L('Comprueba tu gráfica con tu tabla.', 'Check your graph against your table.'),
    matches: L('Tu gráfica coincide con tu tabla.', 'Your graph matches your table.'),
    differs: L('Alguna barra no coincide con tu tabla. Mira la fila de esa prueba.', 'A bar doesn’t match your table. Look at that trial’s row.'),
  },
  map: {
    layers: L('Capas', 'Layers'),
    relief: L('Montañas', 'Mountains'),
    volcanoes: L('Volcanes', 'Volcanoes'),
    quakes: L('Sismos', 'Earthquakes'),
    band: L('Franja', 'Band'),
    bandHint: L('La franja marca una casilla alrededor de la cordillera.', 'The band marks one square around the mountain range.'),
    zone: { cerca: L('Cerca de la cordillera', 'Near the mountain range'), llanura: L('En la llanura lejana', 'On the far plain'), mar: L('En el mar', 'At sea') },
    quakesIn: (inside: number, total: number) => L(`${inside} de ${total} sismos caen dentro de la franja.`, `${inside} of ${total} earthquakes fall inside the band.`),
    revealed: (cerca: number, lejos: number) => L(`Se ven ${cerca} sismos cerca de la cordillera y ${lejos} lejos.`, `${cerca} earthquakes are near the range and ${lejos} are far from it.`),
    cell: (c: number, r: number) => L(`Casilla columna ${c + 1}, fila ${r + 1}`, `Square column ${c + 1}, row ${r + 1}`),
  },
  notebook: {
    sessionOf: (n: number, t: number) => L(`Sesión ${n} de ${t}`, `Session ${n} of ${t}`),
    sessions: L('Las 6 sesiones', 'The 6 sessions'),
    done: L('Hecha', 'Done'),
    current: L('Sigue aquí', 'Pick up here'),
    todo: L('Todavía no', 'Not yet'),
    ideas: L('Mis ideas', 'My ideas'),
    ideasEmpty: L('Aquí aparecen las ideas que vas explicando.', 'The ideas you explain show up here.'),
    glossary: L('Palabras de ciencia', 'Science words'),
    entries: L('Mi cuaderno', 'My notebook'),
    entriesEmpty: L('Aquí quedan tus explicaciones.', 'Your explanations are saved here.'),
    nextUp: L('Sigue', 'Next'),
    minutes: L('≈ 15 min', '≈ 15 min'),
    allDone: L('Terminaste la unidad. Puedes repasar cuando quieras.', 'You finished the unit. You can review whenever you like.'),
  },
  idea: {
    initial: L('Mi idea de al principio', 'My first idea'),
    now: L('Mi idea ahora', 'My idea now'),
    unchanged: L('No cambió', 'It didn’t change'),
    changed: L('Cambió', 'It changed'),
  },
  closing: {
    title: L('¡Sesión terminada!', 'Session finished!'),
    stars: (n: number) => L(`${n} ${n === 1 ? 'estrella' : 'estrellas'} por tu esfuerzo`, `${n} ${n === 1 ? 'star' : 'stars'} for your effort`),
    savedForLater: L('Guardado. Seguimos cuando quieras.', 'Saved. We’ll continue whenever you like.'),
  },
  guide: {
    hello: L('Soy Maya. Vamos a investigar.', 'I’m Maya. Let’s investigate.'),
    think: L('Piensa con calma. No hay prisa.', 'Think it over. There’s no rush.'),
    wellDone: L('¡Muy bien!', 'Nicely done!'),
  },
  /** Rótulos de las pantallas de la unidad (cuaderno, sesión, tareas). */
  screen: {
    unit: L('Unidad', 'Unit'),
    pickUp: L('Seguir', 'Continue'),
    begin: L('Empezar', 'Start'),
    review: L('Repasar', 'Review'),
    stepOf: (n: number, t: number) => L(`Paso ${n} de ${t}`, `Step ${n} of ${t}`),
    hintOf: (n: number) => L(`Pista ${n} de 3`, `Hint ${n} of 3`),
    listen: L('Escuchar', 'Listen'),
    leave: L('Salir de la sesión', 'Leave the session'),
    leaveBody: L('Tu avance queda guardado. Seguimos cuando quieras.', 'Your progress is saved. We’ll continue whenever you like.'),
    keepGoing: L('Seguir en la sesión', 'Stay in the session'),
    tryAgainNote: L('Mira otra vez y prueba de nuevo. No hay prisa.', 'Look again and try once more. There’s no rush.'),
    selectMore: (n: number) => L(`Elige ${n} o más`, `Pick at least ${n}`),
    rainPrompt: L('Toca la regadera para llover sobre las dos bandejas.', 'Tap the watering can to rain on both trays.'),
    rainAgain: L('Puedes regar otra vez para comprobar.', 'You can water again to check.'),
    trialsDone: L('Ya hiciste todas las pruebas.', 'You did all the trials.'),
    weighPrompt: L('Toca una casilla vacía para pesar ese vaso.', 'Tap an empty cell to weigh that cup.'),
    weighing: (tray: string, trial: number) => L(`Pesando el vaso de la ${tray}, prueba ${trial}`, `Weighing ${tray}’s cup, trial ${trial}`),
    tableDone: L('Tu tabla está completa.', 'Your table is complete.'),
    chartPrompt: L('Toca cada columna a la altura de tu dato.', 'Tap each column at the height of your data.'),
    chartHelp: L('Si dudas, mira tu tabla: cada barra va con un dato.', 'If you’re unsure, look at your table: each bar matches one number.'),
    predicted: L('Predijiste', 'You predicted'),
    observed: L('Lo que viste', 'What you saw'),
    countPrompt: L('Toca los sismos dentro de la franja para contarlos.', 'Tap the earthquakes inside the band to count them.'),
    counted: (n: number) => L(`Contados: ${n}`, `Counted: ${n}`),
    revealNow: L('Se revelan los sismos del mapa.', 'The map’s earthquakes are revealed.'),
    initialIdea: L('Tu idea de al principio', 'Your idea at the start'),
    fixedPrompt: L('Así queda la prueba arreglada:', 'This is the fixed test:'),
    lessonSaved: L('Guardaste esta sesión para seguir después.', 'You saved this session to continue later.'),
    skipNote: L('Queda para repasar más adelante.', 'It’s saved for review later.'),
    checkNote: L('Elige una respuesta para seguir.', 'Pick an answer to continue.'),
    mapDescription: L('Mapa de práctica con casillas: relieve, volcanes y sismos.', 'Practice map made of squares: relief, volcanoes and earthquakes.'),
    safetyTitle: L('Con un adulto', 'With a grown-up'),
    safetyBody: L('Hay una versión con bandejas de verdad para hacer con un adulto. La enciende tu familia en Modo padres.', 'There is a version with real trays to do with a grown-up. Your family turns it on in Parent mode.'),
    sessionsHeading: L('Las sesiones de esta unidad', 'The sessions in this unit'),
    stageHeading: L('Cómo va cada idea', 'How each idea is going'),
    notebookHeading: L('Mis explicaciones', 'My explanations'),
    wordsHeading: L('Palabras de ciencia', 'Science words'),
    minutesEach: L('≈ 15 min cada una', '≈ 15 min each'),
    ofTotal: (n: number, t: number) => L(`${n} de ${t} sesiones`, `${n} of ${t} sessions`),
    questionLabel: L('La gran pregunta', 'The big question'),
    resume: L('Seguir donde iba', 'Continue where I left off'),
    sessionDone: L('Sesión hecha', 'Session done'),
    steps: L('Pasos', 'Steps'),
  },
  a11y: {
    sceneZone: (name: string) => L(`Zona de la escena: ${name}`, `Scene zone: ${name}`),
    option: (n: number, t: number) => L(`Opción ${n} de ${t}`, `Option ${n} of ${t}`),
    notebookCover: L('Portada del cuaderno de Ciencia', 'Science notebook cover'),
  },
} as const;

/** Ayuda para quien usa lector de pantalla: lo que dice la gráfica con palabras (informe §10). */
export function chartDescription(rows: { label: string; values: number[] }[], lang: CienciaLang): string {
  const and = lang === 'es' ? ' y ' : ' and ';
  const unit = lang === 'es' ? 'gramos' : 'grams';
  const join = (v: number[]) => (v.length <= 1 ? v.join('') : `${v.slice(0, -1).join(', ')}${and}${v[v.length - 1]}`);
  return rows.map((r) => `${r.label}: ${join(r.values)} ${unit}.`).join(' ');
}

/** Rótulo de cada zona tocable de la escena de la ladera (S1). */
export const LADERA_ZONES = {
  pasto: L('pasto', 'grass'),
  tierra: L('tierra descubierta', 'bare soil'),
  surco: L('surco', 'gully'),
  pie: L('tierra mojada al pie', 'wet soil at the bottom'),
  arroyo: L('arroyo', 'stream'),
} as const;

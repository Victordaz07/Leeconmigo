import type { ArtLang } from './project.ts';
import type { EncounterId, Intention, LayerNote, Missing, PresentNote, VersionReason } from './unit-model.ts';

/**
 * Textos de la unidad A1-U04 «Mi banda deja respirar al silencio» (ES/EN). Tono de acompañamiento: nada de «correcto/incorrecto», «bien/mal»
 * ni puntos; el feedback dice qué escuchar o qué se puede cambiar (docs/06, investigación §11). Nunca «más cuadros = mejor».
 */
export interface UnitCopy {
  title: string;
  grade: string;
  blurb: string;
  /** Portada de la unidad en el inicio del cuaderno. */
  card: (done: number) => string;
  suggested: string;
  start: string;
  resume: string;
  encounter: (n: number) => string;
  encounters: Record<EncounterId, { title: string; goal: string }>;
  // comunes
  ready: string;
  readyDone: string;
  next: string;
  missingTitle: string;
  missing: Record<Missing, string>;
  layer: (letter: string) => string;
  soloBtn: (letter: string) => string;
  allTogether: string;
  stop: string;
  nowListening: (what: string) => string;
  // e1
  listenIntro: string;
  returnQ: string;
  returnHint: string;
  returnOk: string;
  // e2
  intentionQ: string;
  intentions: Record<Intention, string>;
  buildTip: string;
  // e3
  silenceIntro: string;
  silencePick: string;
  silenceBusy: string;
  silenceSet: (pulse: number) => string;
  // e4
  layerIntro: string;
  layerFeedback: string;
  layerQ: string;
  layerNotes: Record<LayerNote, string>;
  // e5
  versionsIntro: string;
  versionSaved: (label: string) => string;
  listenVersion: (label: string) => string;
  listenNow: string;
  reasonQ: string;
  reasons: Record<VersionReason, string>;
  // e6
  presentIntro: string;
  folder: string;
  folderIntention: (label: string) => string;
  folderSilence: (pulse: number) => string;
  folderLayers: (n: number) => string;
  folderVersions: (n: number) => string;
  folderReason: (label: string) => string;
  capsuleTag: string;
  capsuleTitle: string;
  capsuleText: string;
  presentQ: string;
  presentNotes: Record<PresentNote, string>;
  finish: string;
  // cierre
  doneTitle: string;
  doneText: string;
  starsTitle: string;
  starExplored: string;
  starCompared: string;
  starExplained: string;
  back: string;
}

const ES: UnitCopy = {
  title: 'Mi banda deja respirar al silencio',
  grade: '1.º',
  blurb: 'Escucha, arma tu ritmo, deja un silencio a propósito y compara dos versiones.',
  card: (n) => `${n} de 6 encuentros`,
  suggested: 'Para ti',
  start: 'Empezar',
  resume: 'Seguir',
  encounter: (n) => `Encuentro ${n}`,
  encounters: {
    listen: { title: 'Escucha', goal: 'Escuchar cada capa sola y ver dónde vuelve el patrón.' },
    build: { title: 'Arma tu patrón', goal: 'Elegir cómo quieres que suene tu banda y armar el patrón.' },
    silence: { title: 'Un silencio', goal: 'Dejar un silencio a propósito.' },
    layer: { title: 'Otra capa', goal: 'Agregar otra capa y escuchar qué cambia.' },
    versions: { title: 'Dos versiones', goal: 'Guardar dos versiones, compararlas y elegir.' },
    present: { title: 'Presenta', goal: 'Mostrar tu banda y contar una idea.' },
  },
  ready: 'Listo',
  readyDone: 'Hecho ✓',
  next: 'Siguiente',
  missingTitle: 'Para marcar este encuentro como hecho:',
  missing: {
    heard: 'Escucha una capa sola.',
    return: 'Toca el pulso donde el patrón vuelve a empezar.',
    intention: 'Elige cómo quieres que suene tu banda.',
    pattern: 'Enciende al menos un cuadro.',
    silence: 'Deja un silencio.',
    silenceMark: 'Toca el número de un pulso donde no suene nada.',
    layers: 'Haz sonar al menos dos capas.',
    layerNote: 'Cuenta qué notaste.',
    versions: 'Guarda dos versiones que suenen distinto.',
    reason: 'Cuenta por qué te quedas con una.',
    note: 'Elige qué quieres contar.',
  },
  layer: (l) => `Capa ${l}`,
  soloBtn: (l) => `Escuchar la capa ${l} sola`,
  allTogether: 'Escuchar todas juntas',
  stop: 'Parar',
  nowListening: (w) => `Escuchando: ${w}`,
  listenIntro: 'Cada capa es un sonido que se repite. Escucha una sola, luego todas juntas.',
  returnQ: 'Mira el cursor. ¿En qué pulso vuelve a empezar el patrón?',
  returnHint: 'Escucha otra vez y mira el cursor: cuando llega al último pulso, ¿a dónde vuelve?',
  returnOk: 'Sí: después del pulso 8 vuelve al pulso 1, sin pausa. Ese es el ciclo.',
  intentionQ: '¿Cómo quieres que suene tu banda?',
  intentions: { calm: 'Tranquila', happy: 'Alegre', walk: 'De caminata' },
  buildTip: 'Toca los cuadros para que suene un sonido en ese pulso. No hay un número correcto de cuadros.',
  silenceIntro: 'Un silencio también es música: es cuando la banda respira. Elige un pulso donde no suene nada.',
  silencePick: 'Toca el número del pulso donde quieres tu silencio.',
  silenceBusy: 'Ahí suena algo. Elige un pulso vacío o apaga ese cuadro.',
  silenceSet: (n) => `Tu silencio está en el pulso ${n}.`,
  layerIntro: 'Agrega otra capa con otro sonido. Escucha cada capa sola y luego las dos juntas.',
  layerFeedback: 'Escucha esta capa sola. ¿Quieres conservarla igual o cambiar algo?',
  layerQ: '¿Qué notaste al agregar la otra capa?',
  layerNotes: { fuller: 'Se oye más lleno', different: 'Se oye distinto', same: 'Casi igual' },
  versionsIntro: 'Guarda tu ritmo como una versión. Cambia algo. Guarda otra. Escucha las dos y elige.',
  versionSaved: (l) => `Guardaste la versión ${l}.`,
  listenVersion: (l) => `Escuchar la versión ${l}`,
  listenNow: 'Escuchar lo que tengo ahora',
  reasonQ: '¿Por qué te quedas con una?',
  reasons: { silence: 'Deja más silencio', even: 'Suena más parejo', another: 'Quiero probar otra cosa' },
  presentIntro: 'Mira tu carpeta y escucha tu banda por última vez.',
  folder: 'Tu carpeta',
  folderIntention: (l) => `Quisiste una banda ${l.toLowerCase()}.`,
  folderSilence: (n) => `Dejaste un silencio en el pulso ${n}.`,
  folderLayers: (n) => (n === 1 ? 'Tu banda tiene 1 capa.' : `Tu banda tiene ${n} capas.`),
  folderVersions: (n) => (n === 1 ? 'Guardaste 1 versión.' : `Guardaste ${n} versiones.`),
  folderReason: (l) => `Te quedas con una porque: ${l.toLowerCase()}.`,
  capsuleTag: 'Ejemplo inventado',
  capsuleTitle: 'Los tambores de la Plaza de las Lunas',
  capsuleText: 'En un pueblo imaginario, cada tarde un grupo toca un ritmo corto que se repite, y deja un silencio antes de volver a empezar. Es un cuento para pensar en tu banda; pronto habrá una escucha de verdad, con su fuente.',
  presentQ: '¿Qué quieres contar de tu banda?',
  presentNotes: { repeat: 'Mi patrón vuelve a empezar', silence: 'Dejé un silencio a propósito', layer: 'Agregué otra capa' },
  finish: 'Terminar',
  doneTitle: 'Tu banda está lista',
  doneText: 'Se queda guardada en tus creaciones. Puedes volver a abrirla cuando quieras.',
  starsTitle: 'Lo que hiciste',
  starExplored: 'Exploraste: escuchaste y armaste tu patrón',
  starCompared: 'Comparaste dos versiones',
  starExplained: 'Explicaste tu decisión',
  back: 'Volver',
};

const EN: UnitCopy = {
  title: 'My band lets silence breathe',
  grade: 'Grade 1',
  blurb: 'Listen, build your rhythm, leave a silence on purpose and compare two versions.',
  card: (n) => `${n} of 6 sessions`,
  suggested: 'For you',
  start: 'Start',
  resume: 'Continue',
  encounter: (n) => `Session ${n}`,
  encounters: {
    listen: { title: 'Listen', goal: 'Listen to each layer alone and see where the pattern comes back.' },
    build: { title: 'Build your pattern', goal: 'Pick how you want your band to sound and build the pattern.' },
    silence: { title: 'A silence', goal: 'Leave a silence on purpose.' },
    layer: { title: 'Another layer', goal: 'Add another layer and listen to what changes.' },
    versions: { title: 'Two versions', goal: 'Save two versions, compare them and choose.' },
    present: { title: 'Present', goal: 'Show your band and share one idea.' },
  },
  ready: 'Done',
  readyDone: 'Done ✓',
  next: 'Next',
  missingTitle: 'To mark this session as done:',
  missing: {
    heard: 'Listen to one layer alone.',
    return: 'Tap the beat where the pattern starts again.',
    intention: 'Pick how you want your band to sound.',
    pattern: 'Turn on at least one square.',
    silence: 'Leave a silence.',
    silenceMark: 'Tap the number of a beat where nothing sounds.',
    layers: 'Make at least two layers sound.',
    layerNote: 'Tell what you noticed.',
    versions: 'Save two versions that sound different.',
    reason: 'Tell why you keep one.',
    note: 'Pick what you want to share.',
  },
  layer: (l) => `Layer ${l}`,
  soloBtn: (l) => `Listen to layer ${l} alone`,
  allTogether: 'Listen to all together',
  stop: 'Stop',
  nowListening: (w) => `Listening: ${w}`,
  listenIntro: 'Each layer is a sound that repeats. Listen to one alone, then all together.',
  returnQ: 'Watch the cursor. On which beat does the pattern start again?',
  returnHint: 'Listen again and watch the cursor: when it reaches the last beat, where does it go next?',
  returnOk: 'Yes: after beat 8 it goes back to beat 1, with no pause. That is the cycle.',
  intentionQ: 'How do you want your band to sound?',
  intentions: { calm: 'Calm', happy: 'Happy', walk: 'Like a walk' },
  buildTip: 'Tap the squares to make a sound on that beat. There is no right number of squares.',
  silenceIntro: 'A silence is music too: it is when the band breathes. Pick a beat where nothing sounds.',
  silencePick: 'Tap the number of the beat where you want your silence.',
  silenceBusy: 'Something sounds there. Pick an empty beat or turn that square off.',
  silenceSet: (n) => `Your silence is on beat ${n}.`,
  layerIntro: 'Add another layer with a different sound. Listen to each layer alone, then both together.',
  layerFeedback: 'Listen to this layer alone. Do you want to keep it the same or change something?',
  layerQ: 'What did you notice when you added the other layer?',
  layerNotes: { fuller: 'It sounds fuller', different: 'It sounds different', same: 'Almost the same' },
  versionsIntro: 'Save your rhythm as a version. Change something. Save another one. Listen to both and choose.',
  versionSaved: (l) => `You saved version ${l}.`,
  listenVersion: (l) => `Listen to version ${l}`,
  listenNow: 'Listen to what I have now',
  reasonQ: 'Why do you keep one?',
  reasons: { silence: 'It leaves more silence', even: 'It sounds steadier', another: 'I want to try something else' },
  presentIntro: 'Look at your folder and listen to your band one more time.',
  folder: 'Your folder',
  folderIntention: (l) => `You wanted a ${l.toLowerCase()} band.`,
  folderSilence: (n) => `You left a silence on beat ${n}.`,
  folderLayers: (n) => (n === 1 ? 'Your band has 1 layer.' : `Your band has ${n} layers.`),
  folderVersions: (n) => (n === 1 ? 'You saved 1 version.' : `You saved ${n} versions.`),
  folderReason: (l) => `You keep one because: ${l.toLowerCase()}.`,
  capsuleTag: 'Made-up example',
  capsuleTitle: 'The drums of Moon Square',
  capsuleText: 'In an imaginary town, every afternoon a group plays a short rhythm that repeats, and leaves a silence before starting again. It is a story to think about your band; a real listening, with its source, is coming soon.',
  presentQ: 'What do you want to share about your band?',
  presentNotes: { repeat: 'My pattern starts again', silence: 'I left a silence on purpose', layer: 'I added another layer' },
  finish: 'Finish',
  doneTitle: 'Your band is ready',
  doneText: 'It stays saved in your creations. You can open it again whenever you want.',
  starsTitle: 'What you did',
  starExplored: 'You explored: you listened and built your pattern',
  starCompared: 'You compared two versions',
  starExplained: 'You explained your decision',
  back: 'Back',
};

export const UNIT_COPY: Record<ArtLang, UnitCopy> = { es: ES, en: EN };

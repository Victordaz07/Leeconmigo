import type { ArtLang } from './project.ts';

/**
 * Textos de Arte y música (ES/EN). Tono de acompañamiento (docs/06): nada de «bien/mal», «correcto/incorrecto» ni puntos; un silencio también
 * es música. Viven aquí (y no en `ui-core`) para que la cuenta de Artes no edite archivos compartidos (docs/14).
 */
export interface ArteCopy {
  title: string;
  /** Subtítulo de la portada del cuaderno en Inicio. */
  cover: (creations: number) => string;
  intro: string;
  privacy: string;
  freeTitle: string;
  freeHint: string;
  newRhythm: string;
  challenges: string;
  creations: string;
  noCreations: string;
  back: string;
  defaultTitle: string;
  copySuffix: string;
  open: (title: string) => string;
  rhythmKind: string;
  // taller de ritmo
  nameLabel: string;
  gridHint: string;
  pulse: (n: number) => string;
  rowOn: (sound: string, n: number) => string;
  rowOff: (sound: string, n: number) => string;
  changeSound: (sound: string) => string;
  pickSound: (row: string) => string;
  pickSoundHint: string;
  tempo: string;
  tempoWord: (bpm: number) => string;
  play: string;
  stop: string;
  saved: string;
  saveVersion: string;
  versions: string;
  noVersions: string;
  versionName: (label: string) => string;
  restore: (label: string) => string;
  restoreNote: string;
  duplicate: string;
  remove: string;
  removeAsk: (title: string) => string;
  removeYes: string;
  removeNo: string;
  audioError: string;
  /** Ritmo en blanco: un empujón amable, no una orden. */
  emptyHint: string;
}

const ES: ArteCopy = {
  title: 'Arte y música',
  cover: (n) => (n === 0 ? 'Taller libre' : n === 1 ? '1 creación' : `${n} creaciones`),
  intro: 'Aquí inventas tu propia música. No hay notas ni puntos: tú decides cómo suena.',
  privacy: 'Lo que creas se queda en esta tableta.',
  freeTitle: 'Taller libre',
  freeHint: 'Haz un ritmo a tu manera. Cada cuadro es un pulso.',
  newRhythm: 'Nuevo ritmo',
  challenges: 'Retos',
  creations: 'Tus creaciones',
  noCreations: 'Todavía no hay creaciones. ¡Empieza con un ritmo!',
  back: 'Volver',
  defaultTitle: 'Mi ritmo',
  copySuffix: '(otra idea)',
  open: (t) => `Abrir ${t}`,
  rhythmKind: 'Ritmo de ocho pulsos',
  nameLabel: 'Nombre',
  gridHint: 'Toca un cuadro para que suene en ese pulso. Un silencio también es música.',
  pulse: (n) => `Pulso ${n}`,
  rowOn: (s, n) => `${s}, pulso ${n}: suena`,
  rowOff: (s, n) => `${s}, pulso ${n}: silencio`,
  changeSound: (s) => `Sonido: ${s}. Toca para cambiarlo`,
  pickSound: (row) => `Sonido de la fila ${row}`,
  pickSoundHint: 'Toca uno para elegirlo: se oye al tocarlo.',
  tempo: 'Velocidad',
  tempoWord: (bpm) => (bpm <= 70 ? 'Lento' : bpm <= 100 ? 'Medio' : bpm <= 130 ? 'Rápido' : 'Muy rápido'),
  play: 'Tocar',
  stop: 'Parar',
  saved: 'Guardado',
  saveVersion: 'Guardar esta versión',
  versions: 'Tus versiones',
  noVersions: 'Guarda una versión para compararla con otra más tarde.',
  versionName: (l) => `Versión ${l}`,
  restore: (l) => `Volver a la versión ${l}`,
  restoreNote: 'Lo que tienes ahora se guarda como versión nueva: no se pierde nada.',
  duplicate: 'Probar otra idea',
  remove: 'Borrar',
  removeAsk: (t) => `¿Borrar «${t}»?`,
  removeYes: 'Sí, borrar',
  removeNo: 'No',
  audioError: 'No se pudo abrir el sonido en este equipo.',
  emptyHint: 'Empieza con un cuadro. ¿Cómo suena?',
};

const EN: ArteCopy = {
  title: 'Art & music',
  cover: (n) => (n === 0 ? 'Free workshop' : n === 1 ? '1 creation' : `${n} creations`),
  intro: 'Here you invent your own music. No grades, no points: you decide how it sounds.',
  privacy: 'What you make stays on this tablet.',
  freeTitle: 'Free workshop',
  freeHint: 'Make a rhythm your way. Each square is one beat.',
  newRhythm: 'New rhythm',
  challenges: 'Challenges',
  creations: 'Your creations',
  noCreations: 'No creations yet. Start with a rhythm!',
  back: 'Back',
  defaultTitle: 'My rhythm',
  copySuffix: '(another idea)',
  open: (t) => `Open ${t}`,
  rhythmKind: 'Eight-beat rhythm',
  nameLabel: 'Name',
  gridHint: 'Tap a square to make it sound on that beat. A silence is music too.',
  pulse: (n) => `Beat ${n}`,
  rowOn: (s, n) => `${s}, beat ${n}: sounds`,
  rowOff: (s, n) => `${s}, beat ${n}: silence`,
  changeSound: (s) => `Sound: ${s}. Tap to change it`,
  pickSound: (row) => `Sound for row ${row}`,
  pickSoundHint: 'Tap one to choose it: you hear it as you tap.',
  tempo: 'Speed',
  tempoWord: (bpm) => (bpm <= 70 ? 'Slow' : bpm <= 100 ? 'Medium' : bpm <= 130 ? 'Fast' : 'Very fast'),
  play: 'Play',
  stop: 'Stop',
  saved: 'Saved',
  saveVersion: 'Save this version',
  versions: 'Your versions',
  noVersions: 'Save a version to compare it with another one later.',
  versionName: (l) => `Version ${l}`,
  restore: (l) => `Go back to version ${l}`,
  restoreNote: 'What you have now is saved as a new version: nothing is lost.',
  duplicate: 'Try another idea',
  remove: 'Delete',
  removeAsk: (t) => `Delete “${t}”?`,
  removeYes: 'Yes, delete',
  removeNo: 'No',
  audioError: 'The sound could not start on this device.',
  emptyHint: 'Start with one square. How does it sound?',
};

export const ARTE_COPY: Record<ArtLang, ArteCopy> = { es: ES, en: EN };

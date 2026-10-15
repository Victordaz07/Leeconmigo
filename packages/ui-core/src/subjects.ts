/**
 * Materias de Kitewise (D9, `docs/design/kitewise/SPEC.md` §1): cada una es un cuaderno con su color e ícono. Datos puros
 * (sin React): la app web y la nativa leen lo mismo.
 *
 * `available`: hoy solo Lectura tiene contenido (las historias). Las demás se muestran como "Pronto" — no se inventa
 * contenido ni arte (`docs/design/kitewise/ART-BRIEF.md`).
 */
export type SubjectId = 'lectura' | 'mate' | 'ciencia' | 'sociedad' | 'arte' | 'mi-cuaderno';

export interface Subject {
  id: SubjectId;
  /** Nombre en la estantería y en la pestaña. */
  name: string;
  /** Nombre corto para la pestaña vertical del borde. */
  tab: string;
  /** Glifo del ícono de la materia (texto de la app, nunca imagen). */
  glyph: string;
  /** Token de color (`colors.<colorToken>`) y de degradado (`gradients.<gradientToken>`) en ui-native. */
  colorToken: 'subjLectura' | 'subjMate' | 'subjCiencia' | 'subjSociedad' | 'subjArte';
  gradientToken: 'subjLectura' | 'subjMate' | 'subjCiencia' | 'subjSociedad' | 'subjArte';
  available: boolean;
}

export const SUBJECTS: readonly Subject[] = [
  { id: 'lectura', name: 'Lectura', tab: 'Lectura', glyph: 'Aa', colorToken: 'subjLectura', gradientToken: 'subjLectura', available: true },
  { id: 'mate', name: 'Matemáticas', tab: 'Matemáticas', glyph: '½', colorToken: 'subjMate', gradientToken: 'subjMate', available: false },
  { id: 'ciencia', name: 'Ciencia', tab: 'Ciencia', glyph: '✳', colorToken: 'subjCiencia', gradientToken: 'subjCiencia', available: false },
  { id: 'sociedad', name: 'Sociedad', tab: 'Sociedad', glyph: '⚑', colorToken: 'subjSociedad', gradientToken: 'subjSociedad', available: false },
  { id: 'arte', name: 'Arte y música', tab: 'Arte y música', glyph: '♪', colorToken: 'subjArte', gradientToken: 'subjArte', available: false },
  { id: 'mi-cuaderno', name: 'Mi cuaderno', tab: 'Mi cuaderno', glyph: '✎', colorToken: 'subjLectura', gradientToken: 'subjLectura', available: false },
];

/** Materias con pestaña en el borde del cuaderno (Mi cuaderno es personal: no lleva pestaña). */
export const NOTEBOOK_TABS = SUBJECTS.filter((s) => s.id !== 'mi-cuaderno');

export const subjectById = (id: SubjectId): Subject => SUBJECTS.find((s) => s.id === id)!;

/**
 * Barra de 3 segmentos de la portada del cuaderno: cuántos se llenan según lo terminado. Nunca un porcentaje al niño
 * (SPEC §6: "sin porcentajes al niño"); con algo empezado se llena al menos uno.
 */
export function progressSegments(done: number, total: number): 0 | 1 | 2 | 3 {
  if (total <= 0 || done <= 0) return 0;
  if (done >= total) return 3;
  return Math.max(1, Math.min(2, Math.round((done / total) * 3))) as 1 | 2;
}

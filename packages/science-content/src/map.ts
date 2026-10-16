/**
 * Mapa curricular de Ciencia: 8 unidades por grado, 48 en total (`docs/design/ciencia/ESPECIFICACION.md` §3). Es DISEÑO
 * ORIGINAL de Kitewise sobre las expectativas de California NGSS, no un currículo oficial ni validado: los códigos son
 * BORRADOR hasta que un docente los revise y solo los ven los padres (`docs/design/kitewise/STANDARDS-REVIEW.md`).
 */
import type { Localized } from '@lee-conmigo/contracts';
import mapa from '../content/mapa.json';

/** Las cuatro áreas de navegación. Ingeniería no es una pestaña de manualidades: reaparece en todos los grados. */
export const SCIENCE_AREAS = ['vida', 'materia', 'tierra', 'ingenieria'] as const;
export type ScienceArea = (typeof SCIENCE_AREAS)[number];

/** Las 12 familias de laboratorio reutilizables (informe §6). Una unidad usa las que necesita; ninguna es una animación suelta. */
export const LAB_FAMILIES = [
  'mesa-observacion',
  'luz-materiales',
  'vibracion-ondas',
  'probador-materiales',
  'jardin-investigacion',
  'fuerzas-imanes',
  'energia-choques',
  'paisaje-erosion',
  'constructor-modelos',
  'mesa-datos',
  'materia-sistemas',
  'taller-ingenieria',
] as const;
export type LabFamily = (typeof LAB_FAMILIES)[number];

export interface ScienceUnitEntry {
  /** `C4-U06`: grado 4, unidad 6. Estable: no se renumera. */
  id: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  area: ScienceArea;
  title: Localized;
  /** La pregunta que abre la unidad (la del misterio). */
  question: Localized;
  /** Expectativas que la unidad PROPONE desarrollar. Citar un código no acredita cumplimiento: hace falta una tarea que exija la práctica. */
  standards: string[];
  /** Borrador de autoría (ES). Se reescribe en la especificación de cada unidad. */
  activity: string;
  /** Familias de laboratorio que usaría. Vacío = por decidir en la especificación de la unidad. */
  labs: LabFamily[];
  /** Una de las seis unidades de la primera tanda (se construyen primero). */
  pilot: boolean;
  /** Error conceptual o límite de profundidad que la autoría debe respetar. */
  caution?: string;
}

export interface ScienceMap {
  version: number;
  status: 'draftPendingTeacherReview' | 'teacherValidated';
  framework: { name: string; note: string };
  /** Expectativas de ingeniería que se trabajan en cada banda a través de los retos de las unidades (por grado). */
  engineeringBands: Record<string, string[]>;
  units: ScienceUnitEntry[];
}

export const SCIENCE_MAP = mapa as ScienceMap;

export const scienceUnitById = (id: string): ScienceUnitEntry | undefined => SCIENCE_MAP.units.find((u) => u.id === id);
export const unitsForGrade = (grade: number): ScienceUnitEntry[] => SCIENCE_MAP.units.filter((u) => u.grade === grade);
export const unitsForArea = (area: ScienceArea, grade?: number): ScienceUnitEntry[] => SCIENCE_MAP.units.filter((u) => u.area === area && (grade === undefined || u.grade === grade));
export const pilotUnits = (): ScienceUnitEntry[] => SCIENCE_MAP.units.filter((u) => u.pilot);

const STANDARD = /^(?:[1-5]-(?:PS|LS|ESS)\d-\d|MS-(?:PS|LS|ESS|ETS)\d-\d)$/;
const ENGINEERING = /^(?:K-2-ETS1-\d|3-5-ETS1-\d|MS-ETS1-\d)$/;

/** Comprueba el mapa (lista vacía = válido). */
export function mapProblems(map: ScienceMap): string[] {
  const p: string[] = [];
  const ids = new Set<string>();
  for (const u of map.units) {
    if (ids.has(u.id)) p.push(`${u.id}: id repetido`);
    ids.add(u.id);
    if (!new RegExp(`^C${u.grade}-U0[1-8]$`).test(u.id)) p.push(`${u.id}: el id no coincide con el grado ${u.grade}`);
    if (!SCIENCE_AREAS.includes(u.area)) p.push(`${u.id}: área desconocida`);
    for (const l of ['es', 'en'] as const) {
      if (!u.title[l]?.trim()) p.push(`${u.id}: falta título ${l}`);
      if (!u.question[l]?.trim()) p.push(`${u.id}: falta pregunta ${l}`);
    }
    if (!u.activity.trim()) p.push(`${u.id}: falta la actividad`);
    if (!u.standards.length) p.push(`${u.id}: sin expectativas`);
    for (const s of u.standards) {
      if (!STANDARD.test(s)) p.push(`${u.id}: código con formato raro (${s})`);
      // Las expectativas de 1.º–5.º llevan su grado; las de 6.º son del modelo integrado de la banda 6–8.
      else if (u.grade <= 5 ? !s.startsWith(`${u.grade}-`) : !s.startsWith('MS-')) p.push(`${u.id}: ${s} no es de ${u.grade}.º`);
    }
    for (const l of u.labs) if (!LAB_FAMILIES.includes(l)) p.push(`${u.id}: laboratorio desconocido (${l})`);
  }
  for (let g = 1; g <= 6; g++) {
    const n = map.units.filter((u) => u.grade === g).length;
    if (n !== 8) p.push(`${g}.º tiene ${n} unidades (deben ser 8)`);
    const band = map.engineeringBands[String(g)];
    if (!band?.length) p.push(`${g}.º sin expectativas de ingeniería de banda`);
    else for (const s of band) if (!ENGINEERING.test(s)) p.push(`${g}.º: ingeniería con formato raro (${s})`);
  }
  return p;
}

export const SCIENCE_MAP_PROBLEMS = mapProblems(SCIENCE_MAP);

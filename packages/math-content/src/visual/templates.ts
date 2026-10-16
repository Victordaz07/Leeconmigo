/**
 * Plantillas de la fase 1 y su generador determinista (documentación §6): misma plantilla + versión + semilla = mismo
 * problema, en los dos idiomas. Se elige primero una SOLUCIÓN válida y de ella salen los datos (para dividir: grupos y
 * cuántos por grupo → total; nunca dos números al azar y redondear).
 *
 * Los rangos por grado son orientativos (CA CCSSM: 1.OA.6 sumar hasta 20 cruzando la decena; 2.OA.4 y 3.OA.1 grupos
 * iguales; 3.OA.2 los dos sentidos de dividir; 4.OA.3 residuo que hay que interpretar). Revisión docente pendiente.
 */
import { FAMILIES } from './families/index.ts';
import { intRng, type IntRng } from './rng.ts';
import type { EqualGroupsModel, GroupsTheme, SharingModel, SharingTheme, TenFrameModel, VisualFamily, VisualInstance, VisualModel } from './model.ts';

export const GENERATOR_VERSION = 1;

export interface VisualTemplate {
  id: string;
  version: number;
  family: VisualFamily;
  skillId: string;
  /** Grados en que tiene sentido (orientativo; se habilita por habilidad). */
  grades: [number, number];
  generate(r: IntRng): VisualModel;
}

const ids = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}-${i}`);

const SHARING_THEMES: SharingTheme[] = ['cookies', 'pencils', 'marbles', 'apples'];
const GROUPS_THEMES: GroupsTheme[] = ['garden', 'apples', 'marbles'];
/** El contexto se elige AL FINAL, con la última tirada: los números de cada semilla son los mismos que en la versión 1. */
const pick = <T,>(r: IntRng, list: T[]) => list[r.int(0, list.length - 1)]!;

function sharing(r: IntRng, mode: SharingModel['mode'], groups: number, perGroup: number, remainder: number): SharingModel {
  const total = groups * perGroup + remainder;
  // En "hacer bolsas" se muestra una bolsa de más: contar las bolsas no puede ser la respuesta.
  const containers = mode === 'partitive' ? groups : groups + 1;
  return { kind: 'sharing', mode, total, groups, perGroup, remainder, tokenIds: ids('token', total), containerIds: ids('box', containers), theme: pick(r, SHARING_THEMES) };
}

export const VISUAL_TEMPLATES: VisualTemplate[] = [
  {
    id: 'tenFrame.complete10',
    version: 1,
    family: 'tenFrame',
    skillId: 'g1.oa.makeTen',
    grades: [1, 2],
    generate: (r): TenFrameModel => ({ kind: 'tenFrame', capacity: 10, start: r.int(3, 8), target: 10, task: 'complete' }),
  },
  {
    id: 'tenFrame.reach20',
    version: 1,
    family: 'tenFrame',
    skillId: 'g1.oa.add20',
    grades: [1, 2],
    generate: (r): TenFrameModel => {
      // Cruza la decena: empieza en 6–9 y termina en 11–18.
      const start = r.int(6, 9);
      return { kind: 'tenFrame', capacity: 20, start, target: r.int(11, Math.min(18, start + 9)), task: 'reach' };
    },
  },
  {
    id: 'groups.build',
    version: 2,
    family: 'equalGroups',
    skillId: 'g3u1.s2',
    grades: [2, 3],
    generate: (r): EqualGroupsModel => {
      const groups = r.int(3, 5);
      // Nunca cuadrados (3 grupos de 3): así se nota qué número es cuál.
      let perGroup = r.int(3, 6);
      if (perGroup === groups) perGroup = groups + 1;
      return { kind: 'equalGroups', groups, perGroup, task: 'build', theme: pick(r, GROUPS_THEMES) };
    },
  },
  {
    id: 'groups.read',
    version: 2,
    family: 'equalGroups',
    skillId: 'g3u1.s2',
    grades: [3, 3],
    generate: (r): EqualGroupsModel => {
      const groups = r.int(3, 6);
      let perGroup = r.int(4, 9);
      if (perGroup === groups) perGroup = groups + 2;
      return { kind: 'equalGroups', groups, perGroup, task: 'read', theme: pick(r, GROUPS_THEMES) };
    },
  },
  {
    id: 'sharing.partitive',
    version: 2,
    family: 'sharing',
    skillId: 'g3.oa.divideShare',
    grades: [3, 4],
    generate: (r) => {
      const groups = r.int(2, 4);
      return sharing(r, 'partitive', groups, r.int(3, 6), 0);
    },
  },
  {
    id: 'sharing.quotative',
    version: 2,
    family: 'sharing',
    skillId: 'g3.oa.divideGroups',
    grades: [3, 4],
    generate: (r) => {
      const groups = r.int(3, 5);
      return sharing(r, 'quotative', groups, r.int(2, 5), 0);
    },
  },
  {
    id: 'sharing.remainder',
    version: 2,
    family: 'sharing',
    skillId: 'g4.oa.remainder',
    grades: [4, 4],
    generate: (r) => {
      const groups = r.int(3, 4);
      const perGroup = r.int(2, 5);
      return sharing(r, 'partitive', groups, perGroup, r.int(1, groups - 1));
    },
  },
];

/** Plantillas de las familias de `families/` (mismo formato). */
for (const f of Object.values(FAMILIES)) {
  for (const t of f!.templates) VISUAL_TEMPLATES.push({ ...t, family: f!.kind as VisualFamily });
}

export const visualTemplateById = (id: string) => VISUAL_TEMPLATES.find((t) => t.id === id);

/** Comprueba las invariantes de un modelo antes de mostrarlo (lista vacía = válido). */
export function modelProblems(m: VisualModel): string[] {
  if (m.kind !== 'tenFrame' && m.kind !== 'equalGroups' && m.kind !== 'sharing') return FAMILIES[m.kind]!.problems(m);
  const p: string[] = [];
  const int = (n: number) => Number.isInteger(n) && n >= 0;
  if (m.kind === 'tenFrame') {
    if (!int(m.start) || !int(m.target)) p.push('enteros');
    if (m.target > m.capacity || m.start > m.target) p.push('rango');
    if (m.task !== 'show' && m.start === m.target) p.push('nada que agregar');
  } else if (m.kind === 'equalGroups') {
    if (!int(m.groups) || !int(m.perGroup) || m.groups < 2 || m.perGroup < 2) p.push('grupos');
  } else {
    if (m.total !== m.groups * m.perGroup + m.remainder) p.push('total');
    if (m.tokenIds.length !== m.total || new Set(m.tokenIds).size !== m.total) p.push('fichas');
    if (new Set(m.containerIds).size !== m.containerIds.length) p.push('recipientes');
    const limit = m.mode === 'partitive' ? m.groups : m.perGroup;
    if (m.remainder < 0 || m.remainder >= limit) p.push('residuo');
    if (m.containerIds.length !== (m.mode === 'partitive' ? m.groups : m.groups + 1)) p.push('cuántos recipientes');
  }
  return p;
}

/** Crea la instancia de una plantilla con una semilla. Si la plantilla no logra un modelo válido, es un error del código. */
export function generateVisual(t: VisualTemplate, seed: number): VisualInstance {
  const model = t.generate(intRng(seed));
  const problems = modelProblems(model);
  if (problems.length) throw new Error(`${t.id}#${seed}: ${problems.join(', ')}`);
  return { schemaVersion: 1, instanceId: `${t.id}@v${t.version}#${seed}`, templateId: t.id, templateVersion: t.version, generatorVersion: GENERATOR_VERSION, skillId: t.skillId, seed, model };
}

/** Plantillas de un grado (y, si se pide, de una sola familia). Si no hay del grado exacto, las del grado más cercano. */
export function templatesFor(grade: number, family?: VisualFamily): VisualTemplate[] {
  const pool = family ? VISUAL_TEMPLATES.filter((t) => t.family === family) : VISUAL_TEMPLATES;
  const fits = pool.filter((t) => t.grades[0] <= grade && grade <= t.grades[1]);
  if (fits.length) return fits;
  const distance = (t: VisualTemplate) => Math.min(Math.abs(t.grades[0] - grade), Math.abs(t.grades[1] - grade));
  const best = Math.min(...pool.map(distance));
  return pool.filter((t) => distance(t) === best);
}

/** Familias que tienen algo para ese grado (los temas del Taller). */
export const familiesFor = (grade: number): VisualFamily[] => [...new Set(VISUAL_TEMPLATES.filter((t) => t.grades[0] <= grade && grade <= t.grades[1]).map((t) => t.family))];

/**
 * Una tanda de práctica: las plantillas del grado (de un tema o de todos), alternando para no repetir la misma seguida.
 * En la mezcla se intercalan familias distintas.
 */
export function buildVisualSession(grade: number, seed: number, count: number, family?: VisualFamily): VisualInstance[] {
  let pool = templatesFor(grade, family);
  if (!family) {
    // Mezcla: una plantilla por familia por vuelta, con el orden de las familias barajado por la semilla.
    const byFamily = new Map<VisualFamily, VisualTemplate[]>();
    for (const t of pool) byFamily.set(t.family, [...(byFamily.get(t.family) ?? []), t]);
    const r = intRng(seed);
    const fams = [...byFamily.keys()].sort((x, y) => (x < y ? -1 : 1));
    for (let i = fams.length - 1; i > 0; i--) {
      const j = r.int(0, i);
      [fams[i], fams[j]] = [fams[j], fams[i]];
    }
    pool = [];
    for (let round = 0; pool.length < count * 2 && round < 6; round++) for (const f of fams) pool.push(byFamily.get(f)![round % byFamily.get(f)!.length]);
  }
  return Array.from({ length: count }, (_, i) => generateVisual(pool[i % pool.length], seed * 31 + i + 1));
}

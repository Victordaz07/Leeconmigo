/**
 * Plantillas de la fase 1 y su generador determinista (documentación §6): misma plantilla + versión + semilla = mismo
 * problema, en los dos idiomas. Se elige primero una SOLUCIÓN válida y de ella salen los datos (para dividir: grupos y
 * cuántos por grupo → total; nunca dos números al azar y redondear).
 *
 * Los rangos por grado son orientativos (CA CCSSM: 1.OA.6 sumar hasta 20 cruzando la decena; 2.OA.4 y 3.OA.1 grupos
 * iguales; 3.OA.2 los dos sentidos de dividir; 4.OA.3 residuo que hay que interpretar). Revisión docente pendiente.
 */
import { rng } from '../generate.ts';
import type { EqualGroupsModel, SharingModel, TenFrameModel, VisualFamily, VisualInstance, VisualModel } from './model.ts';

export const GENERATOR_VERSION = 1;

export interface IntRng {
  /** Entero en [min, max], ambos incluidos. */
  int(min: number, max: number): number;
}

export function intRng(seed: number): IntRng {
  const next = rng(seed);
  return { int: (min, max) => min + Math.floor(next() * (max - min + 1)) };
}

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

function sharing(mode: SharingModel['mode'], groups: number, perGroup: number, remainder: number): SharingModel {
  const total = groups * perGroup + remainder;
  // En "hacer bolsas" se muestra una bolsa de más: contar las bolsas no puede ser la respuesta.
  const containers = mode === 'partitive' ? groups : groups + 1;
  return { kind: 'sharing', mode, total, groups, perGroup, remainder, tokenIds: ids('token', total), containerIds: ids(mode === 'partitive' ? 'plate' : 'bag', containers) };
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
    version: 1,
    family: 'equalGroups',
    skillId: 'g3u1.s2',
    grades: [2, 3],
    generate: (r): EqualGroupsModel => {
      const groups = r.int(3, 5);
      // Nunca cuadrados (3 grupos de 3): así se nota qué número es cuál.
      let perGroup = r.int(3, 6);
      if (perGroup === groups) perGroup = groups + 1;
      return { kind: 'equalGroups', groups, perGroup, task: 'build' };
    },
  },
  {
    id: 'groups.read',
    version: 1,
    family: 'equalGroups',
    skillId: 'g3u1.s2',
    grades: [3, 3],
    generate: (r): EqualGroupsModel => {
      const groups = r.int(3, 6);
      let perGroup = r.int(4, 9);
      if (perGroup === groups) perGroup = groups + 2;
      return { kind: 'equalGroups', groups, perGroup, task: 'read' };
    },
  },
  {
    id: 'sharing.partitive',
    version: 1,
    family: 'sharing',
    skillId: 'g3.oa.divideShare',
    grades: [3, 4],
    generate: (r) => sharing('partitive', r.int(2, 4), r.int(3, 6), 0),
  },
  {
    id: 'sharing.quotative',
    version: 1,
    family: 'sharing',
    skillId: 'g3.oa.divideGroups',
    grades: [3, 4],
    generate: (r) => sharing('quotative', r.int(3, 5), r.int(2, 5), 0),
  },
  {
    id: 'sharing.remainder',
    version: 1,
    family: 'sharing',
    skillId: 'g4.oa.remainder',
    grades: [4, 4],
    generate: (r) => {
      const groups = r.int(3, 4);
      return sharing('partitive', groups, r.int(2, 5), r.int(1, groups - 1));
    },
  },
];

export const visualTemplateById = (id: string) => VISUAL_TEMPLATES.find((t) => t.id === id);

/** Comprueba las invariantes de un modelo antes de mostrarlo (lista vacía = válido). */
export function modelProblems(m: VisualModel): string[] {
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

/** Una tanda de práctica para un grado: las plantillas de ese grado, alternando familias (no el mismo tipo seguido). */
export function buildVisualSession(grade: number, seed: number, count: number): VisualInstance[] {
  const fits = VISUAL_TEMPLATES.filter((t) => t.grades[0] <= grade && grade <= t.grades[1]);
  const pool = fits.length ? fits : VISUAL_TEMPLATES;
  return Array.from({ length: count }, (_, i) => generateVisual(pool[i % pool.length], seed * 31 + i + 1));
}

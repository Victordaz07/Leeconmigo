/**
 * Revisión automática de una unidad de Sociedad antes de usarla (mismo principio que
 * `@lee-conmigo/math-content` `validate.ts`, docs/14 "Orden de trabajo"). Devuelve la lista de problemas (vacía =
 * bien). No reemplaza la revisión de un docente.
 */
import type { Localized, SocialStep, SocialUnit } from '@lee-conmigo/contracts';

const hasBoth = (l: Localized | undefined) => !!l && l.es.trim().length > 0 && l.en.trim().length > 0;

/** Palabras que nunca deben aparecer en el texto que ve el niño (docs/06: nunca "incorrecto" ni calificar). */
const BANNED = /\b(incorrecto|incorrect|wrong|mal hecho|calificaci[oó]n|grade:)\b/i;
const noBannedWords = (l: Localized) => !BANNED.test(l.es) && !BANNED.test(l.en);

export function validateSocialUnit(unit: SocialUnit): string[] {
  const errs: string[] = [];
  const err = (where: string, msg: string) => errs.push(`${where}: ${msg}`);

  if (!hasBoth(unit.title)) err(unit.id, 'falta el título en algún idioma');
  if (unit.standardsReview.displayAudience !== 'parentsOnly') err(unit.id, 'los estándares son solo para padres (docs/13)');
  if (unit.cast.length === 0) err(unit.id, 'no tiene elenco (docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md)');

  const sourceIds = new Set<string>();
  for (const s of unit.sources) {
    if (sourceIds.has(s.id)) err(s.id, 'fuente repetida');
    sourceIds.add(s.id);
    if (!hasBoth(s.title)) err(s.id, 'falta el título en algún idioma');
    if (!hasBoth(s.caption)) err(s.id, 'falta la descripción en algún idioma');
    if (!noBannedWords(s.caption)) err(s.id, 'la descripción usa una palabra que nunca debe verse (docs/06)');
  }

  const stepIds = new Set<string>();
  for (const step of unit.steps) {
    if (stepIds.has(step.id)) err(step.id, 'paso repetido');
    stepIds.add(step.id);
    if (!hasBoth(step.prompt)) err(step.id, 'falta la pregunta en algún idioma');
    if (!noBannedWords(step.prompt)) err(step.id, 'la pregunta usa una palabra que nunca debe verse (docs/06)');
    validateStep(step, sourceIds, (m) => err(step.id, m));
  }

  // Solo las unidades que SÍ trabajan con fuentes (mapa, foto, testimonio) tienen que enseñar a usarlas y a
  // reconocer huecos (docs/research/sociedad-investigacion.md §12). Una unidad de puro razonamiento cívico
  // (p. ej. S1-U01, sin fuentes históricas) no necesita estos dos pasos.
  if (unit.sources.length > 0) {
    if (!unit.steps.some((s) => s.kind === 'explicar')) err(unit.id, 'tiene fuentes, así que no puede faltar el paso "explicar" (usar ≥2 fuentes)');
    if (!unit.steps.some((s) => s.kind === 'revisar')) err(unit.id, 'tiene fuentes, así que no puede faltar el paso "revisar" (nombrar lo que no se sabe)');
  }
  if (unit.steps.length < 4) err(unit.id, 'muy pocos pasos para una investigación/deliberación completa');

  return errs;
}

function validateStep(step: SocialStep, sourceIds: Set<string>, err: (m: string) => void): void {
  switch (step.kind) {
    case 'pregunta':
      if (step.layers) {
        if (step.layers.length < 2) err('si trae capas, necesita al menos 2 para comparar');
        for (const l of step.layers) if (!hasBoth(l.label)) err(`la capa "${l.id}" no tiene los dos idiomas`);
      }
      break;
    case 'comparar':
      if (step.layers.length < 2) err('necesita al menos 2 capas para comparar');
      if (step.statements.length === 0) err('no tiene ninguna afirmación para clasificar');
      for (const s of step.statements) {
        if (!hasBoth(s.text)) err(`la afirmación "${s.id}" no tiene los dos idiomas`);
        if (!noBannedWords(s.text)) err(`la afirmación "${s.id}" usa una palabra que nunca debe verse (docs/06)`);
      }
      if (!step.statements.some((s) => s.status === 'nuevo')) err('ninguna afirmación marca algo "nuevo": el paso no mostraría ningún cambio real');
      break;
    case 'fuente':
    case 'testimonio':
      if (!sourceIds.has(step.sourceId)) err(`la fuente "${step.sourceId}" no existe`);
      if (step.kind === 'testimonio' && !hasBoth(step.quote)) err('falta la cita en algún idioma');
    // eslint-disable-next-line no-fallthrough -- valida lo que 'fuente'/'testimonio'/'elegir' comparten (opciones).
    case 'elegir':
      if (step.choices.length < 2) err('necesita al menos 2 opciones');
      for (const c of step.choices) if (!hasBoth(c.text)) err(`la opción "${c.id}" no tiene los dos idiomas`);
      if (step.preferredChoiceIds.length === 0) err('no tiene ninguna opción preferida');
      for (const id of step.preferredChoiceIds) if (!step.choices.some((c) => c.id === id)) err(`la opción preferida "${id}" no existe entre las opciones`);
      break;
    case 'explicar':
      if (step.minSources < 2) err('debe pedir al menos 2 fuentes (docs/research/sociedad-investigacion.md §12: usar ≥2 fuentes)');
      for (const id of step.sourceIds) if (!sourceIds.has(id)) err(`la fuente "${id}" no existe`);
      if (step.sourceIds.length < step.minSources) err('ofrece menos fuentes de las que pide usar');
      break;
    case 'revisar':
      if (step.choices.length < 2) err('necesita al menos 2 opciones');
      for (const c of step.choices) if (!hasBoth(c.text)) err(`la opción "${c.id}" no tiene los dos idiomas`);
      if (!step.choices.some((c) => c.id === step.gapChoiceId)) err(`la opción del hueco "${step.gapChoiceId}" no existe entre las opciones`);
      break;
  }
}

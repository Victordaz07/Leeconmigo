import type { Story } from '@lee-conmigo/contracts';
import { PAGE_TEMPLATES, TEMPLATE_NAMES } from './templates.ts';
import { tokenizePage } from './tokenize.ts';

/**
 * Valida una historia y devuelve la lista de problemas (vacía = válida). No lanza excepciones: sirve
 * para tests y para validar paquetes de contenido (incluido el generado con GPT) antes de cargarlos.
 */
export function validateStory(story: Story): string[] {
  const problems: string[] = [];
  const err = (msg: string) => problems.push(`${story.id}: ${msg}`);

  if (!story.id) problems.push('historia sin id');
  if (!story.title) err('sin título');
  if (story.familyId !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(story.familyId)) err(`familyId inválido "${story.familyId}" (minúsculas, números y guiones)`);
  if (story.heroFocus && (![story.heroFocus.x, story.heroFocus.y].every((n) => Number.isFinite(n) && n >= 0 && n <= 100) || !story.cover)) err('heroFocus necesita cover y x, y entre 0 y 100');
  if (!['es', 'en'].includes(story.language)) err(`idioma no soportado "${story.language}"`);
  if (!Number.isInteger(story.level) || story.level < 1) err(`nivel inválido "${story.level}"`);
  if (story.pages.length === 0) err('no tiene páginas');

  const pageIds = new Set<string>();
  const blockIds = new Set<string>();
  const checkpointIds = new Set<string>();
  for (const page of story.pages) {
    if (pageIds.has(page.id)) err(`id de página repetido "${page.id}"`);
    pageIds.add(page.id);

    // Arte y texto separados: el texto es dato, nunca parte de la imagen (docs/05).
    if (!page.illustration?.src) err(`${page.id}: sin ilustración`);
    if (page.blocks.length === 0) err(`${page.id}: sin bloques de texto`);

    for (const b of page.blocks) {
      if (blockIds.has(b.id)) err(`${page.id}: id de bloque repetido "${b.id}"`);
      blockIds.add(b.id);
      if (b.lines.length === 0 || b.lines.every((l) => l.trim() === '')) err(`${page.id}/${b.id}: bloque sin texto`);
    }

    if (page.template !== undefined) {
      const t = PAGE_TEMPLATES[page.template];
      if (!t) err(`${page.id}: plantilla desconocida "${page.template}" (las hay: ${TEMPLATE_NAMES.join(', ')})`);
      else {
        if (t.slots.length !== page.blocks.length) err(`${page.id}: la plantilla "${page.template}" lleva ${t.slots.length} cuadro(s) y la página tiene ${page.blocks.length}`);
        if (page.blocks.some((b) => b.layout)) err(`${page.id}: con "template" los cuadros no llevan "layout" (lo pone el motor)`);
      }
    }

    // Una página es de cómic (todos los bloques con globo) o de texto (ninguno). Mezclar dejaría bloques sin
    // dónde mostrarse sobre la ilustración.
    const withLayout = page.blocks.filter((b) => b.layout).length;
    if (withLayout !== 0 && withLayout !== page.blocks.length) err(`${page.id}: mezcla bloques con y sin globo (layout); usa layout en todos o en ninguno`);

    // Cada palabra de pantalla debe tener forma normalizada: si no, los índices del comparador se desfasan.
    for (const w of tokenizePage(page)) {
      if (w.normalized === '') err(`${page.id}: la "palabra" ${w.index} ("${w.text}") no tiene letras; desalinearía el comparador`);
    }

    const cp = page.checkpoint;
    if (cp) {
      if (checkpointIds.has(cp.id)) err(`${page.id}: id de pregunta repetido "${cp.id}"`);
      checkpointIds.add(cp.id);
      if (cp.variants.length === 0) err(`${page.id}/${cp.id}: la pregunta no tiene variantes`);
      const audiences = new Set<string>();
      for (const v of cp.variants) {
        if (audiences.has(v.audience)) err(`${page.id}/${cp.id}: variante repetida para "${v.audience}"`);
        audiences.add(v.audience);
        if (!v.prompt.trim()) err(`${page.id}/${cp.id}: pregunta sin texto`);
        if (v.options.length < 2) err(`${page.id}/${cp.id}: menos de 2 opciones`);
        if (v.correctIndex < 0 || v.correctIndex >= v.options.length) err(`${page.id}/${cp.id}: correctIndex fuera de rango`);
        if (/incorrect/i.test(v.retryFeedback)) err(`${page.id}/${cp.id}: el feedback nunca debe decir "Incorrecto" (docs/06)`);
      }
    }
  }

  for (const [key, entry] of Object.entries(story.vocabulary)) {
    if (key !== key.toLowerCase()) err(`vocabulario: la clave "${key}" debe estar en minúsculas`);
    if (entry.syllables && entry.syllables.join('') !== key.normalize('NFC')) {
      err(`vocabulario: las sílabas de "${key}" (${entry.syllables.join('-')}) no reconstruyen la palabra`);
    }
  }

  // El repaso final arma palabras por sílabas: cada palabra base necesita sílabas.
  for (const key of story.reviewWords ?? []) {
    if ((story.vocabulary[key]?.syllables?.length ?? 0) < 2) err(`reviewWords: "${key}" no tiene sílabas (2 o más) en el vocabulario`);
  }
  return problems;
}

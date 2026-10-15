/**
 * Archivo de ajustes de una familia de historias (`layouts/<familyId>.layout.json`), escrito por el modo editor.
 * Validación estricta: es lo único que el servidor de desarrollo acepta guardar en disco, y lo que la app carga al arrancar.
 */
import type { BlockLayoutOverride, LayoutFile, PixelRect } from '@lee-conmigo/contracts';
import { TEMPLATE_CANVAS } from './templates.ts';

export const LAYOUT_FILE_VERSION = 1 as const;
export const MIN_FONT_PX = 8;
export const MAX_FONT_PX = 200;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ID = /^[A-Za-z0-9_-]{1,64}$/;
const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

function rectProblem(r: unknown, where: string): string | null {
  const o = r as Partial<PixelRect> | null;
  if (!o || typeof o !== 'object' || !isNum(o.x) || !isNum(o.y) || !isNum(o.width) || !isNum(o.height)) return `${where}: rectángulo inválido (x, y, width, height)`;
  if (o.width < 8 || o.height < 8) return `${where}: la caja es demasiado pequeña (mínimo 8 px)`;
  if (o.x < 0 || o.y < 0 || o.x + o.width > TEMPLATE_CANVAS.width + 0.5 || o.y + o.height > TEMPLATE_CANVAS.height + 0.5) return `${where}: la caja se sale de la ilustración (${TEMPLATE_CANVAS.width}×${TEMPLATE_CANVAS.height})`;
  return null;
}

/** Problemas de un archivo de ajustes (vacío = válido). Nunca lanza. */
export function validateLayoutFile(input: unknown): string[] {
  const f = input as Partial<LayoutFile> | null;
  if (!f || typeof f !== 'object') return ['el archivo no es un objeto'];
  const problems: string[] = [];
  if (typeof f.familyId !== 'string' || !SLUG.test(f.familyId)) problems.push('familyId inválido (minúsculas, números y guiones)');
  if (f.version !== LAYOUT_FILE_VERSION) problems.push(`version debe ser ${LAYOUT_FILE_VERSION}`);
  if (!f.pages || typeof f.pages !== 'object' || Array.isArray(f.pages)) return [...problems, 'pages debe ser un objeto'];
  for (const [pageId, page] of Object.entries(f.pages)) {
    if (!ID.test(pageId)) problems.push(`id de página inválido "${pageId}"`);
    if (!page || typeof page !== 'object' || !page.blocks || typeof page.blocks !== 'object') {
      problems.push(`${pageId}: falta "blocks"`);
      continue;
    }
    for (const [blockId, o] of Object.entries(page.blocks as Record<string, BlockLayoutOverride>)) {
      const where = `${pageId}/${blockId}`;
      if (!ID.test(blockId)) problems.push(`id de bloque inválido "${blockId}"`);
      if (!o || typeof o !== 'object') {
        problems.push(`${where}: ajuste inválido`);
        continue;
      }
      for (const key of ['text', 'balloon'] as const) {
        if (o[key] !== undefined) {
          const p = rectProblem(o[key], `${where}.${key}`);
          if (p) problems.push(p);
        }
      }
      if (o.align !== undefined && !['left', 'center', 'right'].includes(o.align)) problems.push(`${where}.align inválido`);
      if (o.valign !== undefined && !['top', 'middle', 'bottom'].includes(o.valign)) problems.push(`${where}.valign inválido`);
      if (o.textMode !== undefined && !['lines', 'flow'].includes(o.textMode)) problems.push(`${where}.textMode inválido`);
      for (const key of ['maxFontPx', 'fontPx'] as const) {
        const v = o[key];
        if (v !== undefined && (!isNum(v) || v < MIN_FONT_PX || v > MAX_FONT_PX)) problems.push(`${where}.${key}: entre ${MIN_FONT_PX} y ${MAX_FONT_PX}`);
      }
      if (o.fontPxByVariant !== undefined) {
        if (!o.fontPxByVariant || typeof o.fontPxByVariant !== 'object') problems.push(`${where}.fontPxByVariant inválido`);
        else for (const [variant, v] of Object.entries(o.fontPxByVariant)) if (!ID.test(variant) || !isNum(v) || v < MIN_FONT_PX || v > MAX_FONT_PX) problems.push(`${where}.fontPxByVariant["${variant}"] inválido`);
      }
      const known = new Set(['text', 'balloon', 'align', 'valign', 'textMode', 'maxFontPx', 'fontPx', 'fontPxByVariant']);
      for (const k of Object.keys(o)) if (!known.has(k)) problems.push(`${where}: campo desconocido "${k}"`);
    }
  }
  return problems;
}

/** Archivo vacío (sin ajustes) de una familia. */
export function emptyLayoutFile(familyId: string): LayoutFile {
  return { familyId, version: LAYOUT_FILE_VERSION, pages: {} };
}

export function parseLayoutFile(json: unknown): { file: LayoutFile; problems: string[] } | { file: null; problems: string[] } {
  const problems = validateLayoutFile(json);
  return problems.length === 0 ? { file: json as LayoutFile, problems } : { file: null, problems };
}

/**
 * Archivo canónico para guardar: solo lo que difiere de un valor vacío, con las claves en orden estable para que los cambios
 * en el control de versiones se lean bien. Los valores redondean a 0,1 px.
 */
export function normalizeLayoutFile(file: LayoutFile): LayoutFile {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const rect = (r: PixelRect): PixelRect => ({ x: r1(r.x), y: r1(r.y), width: r1(r.width), height: r1(r.height) });
  const pages: LayoutFile['pages'] = {};
  for (const pageId of Object.keys(file.pages).sort()) {
    const blocks: Record<string, BlockLayoutOverride> = {};
    for (const blockId of Object.keys(file.pages[pageId].blocks).sort()) {
      const o = file.pages[pageId].blocks[blockId];
      const out: BlockLayoutOverride = {};
      if (o.balloon) out.balloon = rect(o.balloon);
      if (o.text) out.text = rect(o.text);
      if (o.align) out.align = o.align;
      if (o.valign) out.valign = o.valign;
      if (o.textMode) out.textMode = o.textMode;
      if (o.maxFontPx !== undefined) out.maxFontPx = r1(o.maxFontPx);
      if (o.fontPx !== undefined) out.fontPx = r1(o.fontPx);
      if (o.fontPxByVariant && Object.keys(o.fontPxByVariant).length) {
        out.fontPxByVariant = Object.fromEntries(Object.keys(o.fontPxByVariant).sort().map((k) => [k, r1(o.fontPxByVariant![k])]));
      }
      if (Object.keys(out).length) blocks[blockId] = out;
    }
    if (Object.keys(blocks).length) pages[pageId] = { blocks };
  }
  return { familyId: file.familyId, version: LAYOUT_FILE_VERSION, pages };
}

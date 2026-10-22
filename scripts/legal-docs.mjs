/**
 * Genera `docs/legal/*.md` (para publicar en una página web y para el abogado) con LOS MISMOS textos que muestra la app (`apps/mobile/src/legal/copy.ts`).
 * Uso: node scripts/legal-docs.mjs   (Node 22+, que entiende TypeScript sin compilar). Se corre cada vez que cambian los textos o `config.ts`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'apps', 'mobile', 'src', 'legal');
const { LEGAL_CONFIG, LEGAL_VERSION, legalReady } = await import(join(SRC, 'config.ts'));
const { legalDocs } = await import(join(SRC, 'copy.ts'));
const OUT = join(ROOT, 'docs', 'legal');
mkdirSync(OUT, { recursive: true });

const FILES = { privacy: { es: 'politica-de-privacidad', en: 'privacy-policy' }, terms: { es: 'terminos-de-uso', en: 'terms-of-use' }, notice: { es: 'avisos-importantes', en: 'important-notices' } };
const DRAFT = { es: '> ⚠️ **BORRADOR sin revisión legal.** No publicar hasta que un abogado lo revise y se completen los datos marcados como [PENDIENTE].', en: '> ⚠️ **DRAFT without legal review.** Do not publish until a lawyer reviews it and the items marked [PENDING] are filled in.' };

for (const lang of ['es', 'en']) {
  const docs = legalDocs(lang, LEGAL_CONFIG);
  for (const [key, names] of Object.entries(FILES)) {
    const d = docs[key];
    const body = d.sections.map((s) => `## ${s.title}\n\n${s.body.map((p) => (p.startsWith('• ') ? `- ${p.slice(2)}` : p)).join('\n\n').replace(/\n\n- /g, '\n- ')}`).join('\n\n');
    const head = `# ${d.title}\n\n${legalReady() ? '' : `${DRAFT[lang]}\n\n`}_${lang === 'es' ? 'Versión' : 'Version'}: ${LEGAL_VERSION}_\n\n`;
    writeFileSync(join(OUT, `${names[lang]}.${lang}.md`), `${head}${body}\n`);
  }
}
console.log('docs/legal generado (versión', LEGAL_VERSION + ')', legalReady() ? '' : '— con datos [PENDIENTE]');

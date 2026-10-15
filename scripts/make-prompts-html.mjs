// Genera UN solo HTML con todo lo que hace falta para pedirle la historia "La noche sin luces" a GPT:
// prompts con botón de copiar, imágenes guía de las plantillas y la especificación completa.
// Lee content/PROMPT-GPT-LA-NOCHE-SIN-LUCES.md y content/ESPECIFICACION-HISTORIA-LARGA-PRUEBA-DE-ESTRES.md (fuente única: no se duplica texto).
// Uso: npm run prompts:html   →   content/PROMPTS-LA-NOCHE-SIN-LUCES.html
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = join(root, 'content');
const promptMd = readFileSync(join(content, 'PROMPT-GPT-LA-NOCHE-SIN-LUCES.md'), 'utf8').replace(/\r\n/g, '\n');
const specMd = readFileSync(join(content, 'ESPECIFICACION-HISTORIA-LARGA-PRUEBA-DE-ESTRES.md'), 'utf8').replace(/\r\n/g, '\n');

// ---------- markdown mínimo ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => (u.startsWith('http') ? `<a href="${u}">${t}</a>` : `<span class="lnk">${t}</span>`));
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[Number(i)])}</code>`);
  return s;
}

function cells(row) {
  const inner = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  const out = [];
  let cur = '';
  let tick = false;
  for (const ch of inner) {
    if (ch === '`') tick = !tick;
    if (ch === '|' && !tick) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const isBlockStart = (l) => /^```/.test(l) || /^#{1,6} /.test(l) || /^\|/.test(l) || /^>/.test(l) || /^([-*]|\d+\.) /.test(l) || /^---+\s*$/.test(l);

function md(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="code"><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^\s*$/.test(l)) {
      i++;
      continue;
    }
    const h = /^(#{1,6}) (.*)$/.exec(l);
    if (h) {
      const n = Math.min(h[1].length + 1, 6);
      out.push(`<h${n}>${inline(h[2])}</h${n}>`);
      i++;
      continue;
    }
    if (/^---+\s*$/.test(l)) {
      out.push('<hr>');
      i++;
      continue;
    }
    if (/^\|/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) {
      const head = cells(l);
      const align = cells(lines[i + 1]).map((c) => (/:$/.test(c) ? 'r' : ''));
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
      const th = head.map((c, k) => `<th${align[k] ? ` class="${align[k]}"` : ''}>${inline(c)}</th>`).join('');
      const tb = rows.map((r) => `<tr>${r.map((c, k) => `<td${align[k] ? ` class="${align[k]}"` : ''}>${inline(c)}</td>`).join('')}</tr>`).join('');
      out.push(`<div class="tw"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`);
      continue;
    }
    if (/^>/.test(l)) {
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${md(buf.join('\n'))}</blockquote>`);
      continue;
    }
    if (/^([-*]|\d+\.) /.test(l)) {
      const ordered = /^\d+\./.test(l);
      const items = [];
      while (i < lines.length) {
        const m = /^([-*]|\d+\.) (.*)$/.exec(lines[i]);
        if (m) {
          items.push(m[2]);
          i++;
        } else if (/^\s+\S/.test(lines[i]) && items.length) {
          items[items.length - 1] += ' ' + lines[i].trim();
          i++;
        } else break;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`);
      continue;
    }
    const buf = [l];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

// ---------- extraer las piezas del .md de prompts ----------
const cut = promptMd.indexOf('\n## 1. Prompt de TEXTO');
if (cut < 0) throw new Error('No encontré el encabezado "## 1. Prompt de TEXTO" en el .md de prompts');
const intro = promptMd.slice(0, cut).replace(/^# .*\n/, '').trim();
const fenced = [...promptMd.matchAll(/^```text\n([\s\S]*?)^```/gm)].map((m) => m[1].replace(/\n$/, ''));
if (fenced.length !== 3) throw new Error(`Se esperaban 3 bloques \`\`\`text (texto, Dora, base) y hay ${fenced.length}`);
const [textPrompt, dora, base] = fenced;

const requiredTokens = [
  'Idioma: <es | en>',
  'Nivel: <1 | 2 | 3>',
  '<idioma>',
  '<nivel>',
  '"language": "<es|en>"',
  '"level": <1|2|3>',
  '"<título en ese idioma, ≤ 60 caracteres>"',
];
for (const t of requiredTokens) if (!textPrompt.includes(t)) throw new Error(`El prompt de texto ya no contiene «${t}»: actualiza prompts-page.template.html`);
if (!base.includes('<pega aquí la fila de la página>')) throw new Error('El prompt base perdió el marcador <pega aquí la fila de la página>');

const titles = {
  es: /Título ES: "([^"]+)"/.exec(textPrompt)?.[1],
  en: /Título EN: "([^"]+)"/.exec(textPrompt)?.[1],
};
if (!titles.es || !titles.en) throw new Error('No encontré los títulos ES/EN en el prompt de texto');

// Tabla 2.2 (una fila por imagen)
const pages = [];
for (const line of promptMd.split('\n')) {
  const c = /^\| `((?:page-\d\d|cover)\.png)` \|/.test(line) ? cells(line) : null;
  if (!c) continue;
  const file = c[0].replace(/`/g, '');
  const tpl = /plantillas\/([a-z0-9-]+)\.png/.exec(c[1])?.[1] ?? null;
  const pageNo = /^page-(\d\d)/.exec(file)?.[1];
  pages.push({ file, page: pageNo ? `p${pageNo}` : 'portada', template: tpl, scene: c[2] });
}
if (pages.length !== 15) throw new Error(`Se esperaban 15 filas de imágenes y hay ${pages.length}`);

// ---------- imágenes incrustadas ----------
const uri = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`;
const templates = ['full', 'two-up', 'three-up', 'four-up', 'six-up', 'book-1', 'book-2', 'book-3', 'slant-2', 'slant-3', 'bolt-2', 'manga-6', 'burst-2'];
const counts = { full: 1, 'two-up': 2, 'three-up': 3, 'four-up': 4, 'six-up': 6, 'book-1': 1, 'book-2': 2, 'book-3': 3, 'slant-2': 2, 'slant-3': 3, 'bolt-2': 2, 'manga-6': 6, 'burst-2': 2 };
const guides = {};
const numbered = {};
for (const t of templates) {
  guides[t] = uri(join(content, 'plantillas', `${t}.png`), 'image/png');
  numbered[t] = uri(join(content, 'plantillas', `${t}-numerada.png`), 'image/png');
}
for (const p of pages) if (p.template && !guides[p.template]) throw new Error(`Plantilla desconocida en la tabla de imágenes: ${p.template}`);
const characters = uri(join(content, 'el-puente-de-las-luciernagas', 'characters.webp'), 'image/webp');

// ---------- montar ----------
const data = { textPrompt, titles, dora, base, pages, templates, counts, guides, numbered, characters };
const BS = String.fromCharCode(92);
const json = JSON.stringify(data)
  .split('<').join(BS + 'u003c')
  .split(String.fromCharCode(0x2028)).join(BS + 'u2028')
  .split(String.fromCharCode(0x2029)).join(BS + 'u2029');
const specBody = md(specMd).replace(/^<h2>/, '<h2 style="margin-top:0">');
const html = readFileSync(join(root, 'scripts', 'prompts-page.template.html'), 'utf8')
  .replace('__USE_HTML__', () => md(intro))
  .replace('__SPEC_HTML__', () => specBody)
  .replace('__DATA__', () => json);

const outFile = join(content, 'PROMPTS-LA-NOCHE-SIN-LUCES.html');
writeFileSync(outFile, html);
console.log(`${outFile}\n  ${(html.length / 1024).toFixed(0)} KB · prompt de texto ${textPrompt.length} caracteres · ${pages.length} imágenes · ${templates.length} plantillas`);

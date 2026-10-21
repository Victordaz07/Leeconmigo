/**
 * El informe semanal como una página HTML para imprimir a PDF (Kitewise P5). Sin imágenes, sin fuentes ni enlaces externos: nada se descarga y nada
 * sale de la tableta salvo el archivo que el adulto decide compartir. Todo texto que viene de datos pasa por `esc` (no se confía en nada).
 */
import type { WeeklyReport } from './weekly-report';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** «12–18 oct» (o «28 sep–4 oct» si cruza de mes). */
export function weekRange(monday: Date, sunday: Date): string {
  const a = `${monday.getDate()} ${MONTHS[monday.getMonth()]}`;
  const b = `${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`;
  return monday.getMonth() === sunday.getMonth() ? `${monday.getDate()}–${b}` : `${a}–${b}`;
}

export const reportFileName = (name: string, monday: Date): string => {
  const slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'nino';
  return `kitewise-${slug}-${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
};

interface Input {
  childName: string;
  report: WeeklyReport;
  /** Título de cada historia por id (si falta, se muestra el id). */
  titleOf: (storyId: string) => string;
}

export function weeklyReportHtml({ childName, report: r, titleOf }: Input): string {
  const maxMin = Math.max(r.goalMinutes, ...r.days.map((d) => d.minutes), 1);
  const bars = r.days
    .map((d) => {
      const h = d.minutes > 0 ? Math.max(6, Math.round((d.minutes / maxMin) * 90)) : 3;
      const color = d.minutes >= r.goalMinutes ? '#22A95C' : d.minutes > 0 ? '#4B97FF' : '#DDE2EE';
      return `<div class="bar"><div class="num">${d.minutes > 0 ? d.minutes : ''}</div><div class="col" style="height:${h}px;background:${color}"></div><div class="lbl">${esc(d.label)}</div></div>`;
    })
    .join('');
  const stories = r.stories.length
    ? r.stories
        .map((s) => `<tr><td>${esc(titleOf(s.storyId))}</td><td class="r">${s.minutes < 1 ? 'Menos de 1 min' : `${s.minutes} min`}</td><td class="r st">${s.completed ? 'La terminó' : `Va en ${Math.round(s.completion * 100)} %`}</td></tr>`)
        .join('')
    : '<tr><td colspan="3" class="muted">Esta semana no hubo lectura.</td></tr>';
  const q = r.comprehensionTotal > 0 ? `${r.comprehensionCorrect} de ${r.comprehensionTotal}` : 'Ninguna';
  const focusTotal = r.focus[1] + r.focus[2] + r.focus[3];
  const focus = focusTotal
    ? `Bien: ${r.focus[3]} · Más o menos: ${r.focus[2]} · Le costó: ${r.focus[1]}`
    : `${esc(childName)} no marcó cómo estuvo su enfoque.`;
  const words = r.words.length ? r.words.slice(0, 12).map((w) => `<span class="chip">${esc(w)}</span>`).join('') : '<span class="muted">No pidió ayuda con ninguna palabra.</span>';
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(reportFileName(childName, r.monday))}</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E2340; margin: 0; font-size: 13px; line-height: 1.45; }
  header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid #1E6FE8; padding-bottom: 8px; }
  h1 { font-size: 20px; margin: 0; color: #1E6FE8; }
  .range { font-weight: 700; color: #6B7194; }
  h2 { font-size: 22px; margin: 14px 0 10px; }
  h3 { font-size: 14px; margin: 18px 0 6px; }
  .cards { display: flex; gap: 10px; }
  .card { flex: 1; background: #F4F6FC; border-radius: 10px; padding: 10px 12px; }
  .card .k { font-size: 11px; font-weight: 700; color: #6B7194; }
  .card .v { font-size: 22px; font-weight: 800; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 7px 4px; border-top: 1px solid #E3E6F0; }
  .r { text-align: right; white-space: nowrap; }
  .st { color: #1E6FE8; font-weight: 700; }
  .muted { color: #6B7194; }
  .bars { display: flex; justify-content: space-between; align-items: flex-end; height: 130px; padding: 0 6px; }
  .bar { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 13%; }
  .col { width: 100%; border-radius: 6px; }
  .num { font-size: 11px; font-weight: 700; margin-bottom: 3px; }
  .lbl { font-size: 11px; font-weight: 700; color: #6B7194; margin-top: 4px; }
  .chip { display: inline-block; background: #FFF1C2; border-radius: 999px; padding: 3px 11px; margin: 0 6px 6px 0; font-weight: 700; }
  footer { margin-top: 26px; font-size: 11px; color: #6B7194; border-top: 1px solid #E3E6F0; padding-top: 8px; }
</style></head><body>
<header><h1>Kitewise · resumen semanal</h1><span class="range">${esc(weekRange(r.monday, r.sunday))}</span></header>
<h2>${esc(childName)}</h2>
<div class="cards">
  <div class="card"><div class="k">Minutos de lectura</div><div class="v">${r.totalMinutes}</div></div>
  <div class="card"><div class="k">Días con lectura</div><div class="v">${r.activeDays} de 7</div></div>
  <div class="card"><div class="k">Días que llegó a su meta (${r.goalMinutes} min)</div><div class="v">${r.goalDays}</div></div>
  <div class="card"><div class="k">Preguntas acertadas</div><div class="v">${q}</div></div>
</div>
<h3>Minutos por día</h3>
<div class="bars">${bars}</div>
<h3>Lo que leyó</h3>
<table>${stories}</table>
<h3>Para practicar juntos</h3>
<div>${words}</div>
<h3>Enfoque (según ${esc(childName)})</h3>
<div>${focus}</div>
<footer>Generado en la tableta. Sin datos de voz ni imágenes: la voz nunca se graba ni se guarda. Es una herramienta de práctica, no una evaluación oficial.</footer>
</body></html>`;
}

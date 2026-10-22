/**
 * Genera la marca de Kitewise (logo, íconos de la app, favicon, ícono de avisos, gráficos de la tienda) desde el dibujo vectorial de la cometa.
 * Uso: node scripts/marca.mjs   (necesita Chromium de Playwright: PLAYWRIGHT_BROWSERS_PATH o /opt/pw-browsers)
 * Todo sale de este archivo: para cambiar la marca se edita aquí y se vuelve a correr. Sin texto dentro de las imágenes salvo el nombre (que se
 * dibuja con Nunito Black, la fuente de la interfaz).
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'apps', 'mobile', 'assets');
const BRAND = join(OUT, 'brand');
mkdirSync(BRAND, { recursive: true });
const FONT = readFileSync(join(ROOT, 'node_modules', '@expo-google-fonts', 'nunito', '900Black', 'Nunito_900Black.ttf')).toString('base64');

const C = { coral: '#F2705A', coralLight: '#FF8C75', yellow: '#F5B820', turquoise: '#25B3A5', paper: '#FFF8EC', navy: '#1B2A6B', blue: '#1E6FE8', blueLight: '#4B97FF', spar: '#FFF8EC' };

/** Un moño de la cola (dos alas y un nudo). */
const bow = (x, y, rot, color) => `<g transform="translate(${x} ${y}) rotate(${rot})" stroke="${color}" stroke-width="12" stroke-linejoin="round"><path d="M0 0 L-62 -36 L-62 36 Z" fill="${color}"/><path d="M0 0 L62 -36 L62 36 Z" fill="${color}"/><circle r="14" fill="${color}" stroke="${C.paper}" stroke-width="5"/></g>`;

/** La cometa completa en un lienzo de 1024 (centrada, inclinada). `mono` la dibuja de un solo color (ícono monocromo). */
export function kite({ mono = null, string = C.paper } = {}) {
  const fill = (c) => mono ?? c;
  const T = [512, 110], R = [722, 360], L = [302, 360], B = [512, 680], M = [512, 360];
  const panel = (a, b, c, color) => `<path d="M${a} L${b} L${c} Z" fill="${fill(color)}" stroke="${mono ?? C.paper}" stroke-width="${mono ? 0 : 7}" stroke-linejoin="round"/>`;
  const tail = `M512 680 C 470 750, 580 780, 540 850 C 515 895, 470 905, 462 935`;
  const parts = mono
    ? `<path d="M${T} L${R} L${B} L${L} Z" fill="${mono}"/><path d="${tail}" fill="none" stroke="${mono}" stroke-width="16" stroke-linecap="round"/>${bow(523, 765, -8, mono)}${bow(522, 868, 8, mono)}`
    : `${panel(T, R, M, C.yellow)}${panel(T, L, M, C.coral)}${panel(L, B, M, C.turquoise)}${panel(R, B, M, C.coralLight)}
       <path d="M${T} L${B} M${L} L${R}" stroke="${C.spar}" stroke-width="14" stroke-linecap="round"/>
       <path d="M${T} L${R} L${B} L${L} Z" fill="none" stroke="${C.spar}" stroke-width="14" stroke-linejoin="round"/>
       <circle cx="${M[0]}" cy="${M[1]}" r="17" fill="${C.paper}"/>
       <path d="${tail}" fill="none" stroke="${string}" stroke-width="9" stroke-linecap="round"/>
       ${bow(523, 765, -8, C.turquoise)}${bow(522, 868, 8, C.yellow)}`;
  return `<g transform="rotate(-14 512 520)">${parts}</g>`;
}

/** Caja que ocupa la cometa (se mide una vez en Chromium) para poder centrarla y darle el tamaño justo en cada lienzo. */
let BOX = null;
/** Coloca la cometa con su centro en (cx, cy) y una altura total `h` (en el lienzo de destino). */
const placed = (markup, cx, cy, h) => {
  const k = h / BOX.h;
  return `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-(BOX.x + BOX.w / 2)} ${-(BOX.y + BOX.h / 2)})">${markup}</g>`;
};

const bg = (id = 'bg') => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.blueLight}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
  <radialGradient id="${id}g" cx="0.3" cy="0.2" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <rect width="1024" height="1024" fill="url(#${id})"/><rect width="1024" height="1024" fill="url(#${id}g)"/>
  <ellipse cx="180" cy="900" rx="230" ry="70" fill="#fff" opacity="0.16"/><ellipse cx="880" cy="820" rx="190" ry="55" fill="#fff" opacity="0.12"/>`;

const svg = (w, h, inner, vb = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">${inner}</svg>`;

/** Variantes de ícono (1024×1024). */
const ICON = {
  /** El ícono de la app: fondo azul + cometa. Sin transparencia (iOS/Play lo recortan solos). */
  icon: () => svg(1024, 1024, `${bg()}${placed(kite(), 512, 512, 760)}`),
  /** Android adaptable: fondo y primer plano por separado (la cometa dentro de la zona segura, el 66 % central). */
  'android-icon-background': () => svg(1024, 1024, bg()),
  'android-icon-foreground': () => svg(1024, 1024, placed(kite(), 512, 512, 560)),
  /** Ícono temático de Android 13+: una sola silueta (el sistema la tiñe). */
  'android-icon-monochrome': () => svg(1024, 1024, placed(kite({ mono: '#000000' }), 512, 512, 560)),
  /** Pantalla de carga: la cometa sola sobre transparente. */
  'splash-icon': () => svg(1024, 1024, placed(kite(), 512, 512, 760)),
  /** Favicon (web): fondo azul + cometa grande. */
  favicon: () => svg(1024, 1024, `${bg('fv')}${placed(kite(), 512, 512, 860)}`),
  /** Ícono pequeño de los avisos de Android: silueta blanca sobre transparente. */
  'notification-icon': () => svg(1024, 1024, placed(kite({ mono: '#ffffff' }), 512, 512, 940)),
  /** Ícono de Google Play (512): el mismo ícono. */
  'play-icon': () => svg(1024, 1024, `${bg('pl')}${placed(kite(), 512, 512, 760)}`),
};

const wordmark = (color, accent, size = 200) => `<text x="0" y="0" font-family="NunitoBlack" font-size="${size}" fill="${color}">Kite<tspan fill="${accent}">wise</tspan></text>`;
const fontFace = `<style>@font-face{font-family:'NunitoBlack';src:url(data:font/ttf;base64,${FONT}) format('truetype');}</style>`;

/** Logo horizontal (cometa + nombre) sobre transparente, para fondo claro y para fondo azul. */
const LOGO_H = (dark) => svg(1400, 400, `${fontFace}${placed(kite({ string: dark ? '#C9A36F' : C.paper }), 170, 200, 360)}<g transform="translate(380 262)">${wordmark(dark ? C.navy : '#ffffff', dark ? C.blue : C.yellow)}</g>`);
/** Gráfico de la tienda (1024×500): fondo azul + logo. */
const FEATURE = () => svg(1024, 500, `${fontFace}<defs><linearGradient id="ft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.blueLight}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs><rect width="1024" height="500" fill="url(#ft)"/><ellipse cx="150" cy="470" rx="260" ry="60" fill="#fff" opacity="0.14"/><ellipse cx="900" cy="430" rx="220" ry="50" fill="#fff" opacity="0.12"/>${placed(kite(), 230, 250, 420)}<g transform="translate(410 285)">${wordmark('#ffffff', C.yellow, 138)}</g>`);

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
// medir la cometa (una vez)
await page.setViewportSize({ width: 1024, height: 1024 });
await page.setContent(`<html><body style="margin:0">${svg(1024, 1024, `<g id="k">${kite()}</g>`)}</body></html>`);
BOX = await page.evaluate(() => { const r = document.getElementById('k').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
writeFileSync(join(BRAND, 'kite-mark.svg'), svg(1024, 1024, placed(kite(), 512, 512, 940)));
writeFileSync(join(BRAND, 'kite-icon.svg'), ICON.icon());
async function render(markup, w, h, file, { transparent = true } = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:transparent">${markup}</body></html>`);
  await page.waitForTimeout(150);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}
const withSize = (markup, size) => markup.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);


await render(ICON.icon(), 1024, 1024, join(OUT, 'icon.png'), { transparent: false });
await render(ICON['android-icon-background'](), 1024, 1024, join(OUT, 'android-icon-background.png'), { transparent: false });
await render(ICON['android-icon-foreground'](), 1024, 1024, join(OUT, 'android-icon-foreground.png'));
await render(ICON['android-icon-monochrome'](), 1024, 1024, join(OUT, 'android-icon-monochrome.png'));
await render(ICON['splash-icon'](), 1024, 1024, join(OUT, 'splash-icon.png'));
await render(withSize(ICON.favicon(), 96), 96, 96, join(OUT, 'favicon.png'), { transparent: false });
await render(withSize(ICON['notification-icon'](), 256), 256, 256, join(BRAND, 'notification-icon.png'));
await render(withSize(ICON['play-icon'](), 512), 512, 512, join(BRAND, 'play-icon-512.png'), { transparent: false });
await render(LOGO_H(true), 1400, 400, join(BRAND, 'logo-horizontal.png'));
await render(LOGO_H(false), 1400, 400, join(BRAND, 'logo-horizontal-blanco.png'));
await render(FEATURE(), 1024, 500, join(BRAND, 'play-feature-1024x500.png'), { transparent: false });
await browser.close();
console.log('Marca generada en', OUT);

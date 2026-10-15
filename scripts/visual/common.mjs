// Utilidades compartidas por las capturas de comparación visual (prototipo de Claude Design vs. app real).
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const outDir = join(root, '.visual');
export const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(existsSync);

/** Nombres de los 20 estados (docs/04). */
export const LABELS = ['Selección', 'Preparación', 'Esperando voz', 'Leyendo', 'Pausa corta', 'Pausa larga', 'Palabra dudosa', 'Palabra incorrecta', 'Palabra repetida', 'Palabra saltada', 'Palabra difícil', 'Pronunciación', '¡Muy bien!', 'Fin de página', 'Pregunta', 'Fin de historia', 'Inicio', 'Progreso', 'Te leo el comienzo', 'Repaso rápido'];

export const pad = (n) => String(n).padStart(2, '0');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch(viewport) {
  if (!CHROME) throw new Error('No se encontró Chrome');
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport });
  return { browser, page };
}

/** Apaga animaciones y transiciones para que las capturas sean deterministas. */
export const freeze = (page) => page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });

export const ensureDir = (d) => mkdirSync(d, { recursive: true });

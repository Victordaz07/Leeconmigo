// Native layout regression: requires a C++20 compiler, no Android SDK/emulator.
// Reads the actual component's resolved styles; does NOT substitute browser CSS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { columnsFor, itemWidth, layoutFor } from '../packages/ui-core/src/layout.ts';
import { SUBJECTS, LIFE_SUBJECTS } from '../packages/ui-core/src/subjects.ts';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
// Mobile pins the compiler API; the root TypeScript 7 package is CLI-only.
const ts = createRequire(new URL('../apps/mobile/package.json', import.meta.url))('typescript');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'kitewise-yoga-'));
const yoga = path.join(root, 'node_modules/react-native/ReactCommon/yoga');
function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', cwd: root });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}
function sources(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? sources(path.join(dir, e.name)) : e.name.endsWith('.cpp') ? [path.join(dir, e.name)] : []);
}
try {
  assert.ok(ts.ModuleKind && ts.JsxEmit && ts.transpileModule,
    'Mobile TypeScript compiler API missing: install development tools with npm ci --include=dev.');
  const binary = path.join(temp, 'probe');
  run(process.env.CXX || 'g++', ['-std=c++20', '-O0', '-I', yoga,
    path.join(root, 'scripts/notebook-layout-probe.cpp'), ...sources(path.join(yoga, 'yoga')), '-o', binary]);
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(root, 'packages/ui-native/src/components/notebook-cover.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(compiled, { exports: module.exports, require: id => {
    if (id === 'react-native') return { Image: 'Image', Pressable: 'Pressable', Text: 'Text', View: 'View', StyleSheet: { create: s => s, absoluteFill: {} } };
    if (id === '../tokens.ts') return { colors: {}, fontFamily: { ui: {} }, radius: {}, shadows: {} };
    if (id === './gradient-view.tsx') return { GradientView: 'GradientView' };
    if (id === '../interface-language.tsx') return { useTranslation: () => ({ t: text => text }) };
    return require(id);
  } });
  const { NotebookCover } = module.exports;
  let checked = 0;
  for (const [width, height] of [[320, 720], [375, 812], [390, 844], [844, 390], [800, 1280], [1280, 800], [360, 800], [720, 800], [800, 720], [900, 740], [740, 900], [720, 720]]) {
    const layout = layoutFor(width, height);
    const rail = layout.nav === 'bottom' ? 0 : layout.nav === 'railCompact' ? 80 : 112;
    const available = width - rail - 2 * layout.gutter;
    const gap = layout.narrow ? 12 : 14;
    for (const life of [false, true]) {
      const subjects = life ? LIFE_SUBJECTS : SUBJECTS.filter(s => s.group !== 'vida');
      const cols = columnsFor(available, life ? 200 : layout.narrow ? 150 : 160, gap);
      const cardWidth = itemWidth(available, cols, gap);
      const element = NotebookCover({ title: 'Lectura', subtitle: '', glyph: 'Aa', gradient: {}, segments: 0, width: cardWidth });
      const style = Object.assign({}, ...element.props.style({ pressed: false }).flat(Infinity).filter(Boolean));
      const args = [available, subjects.length, gap, ...['width', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'minWidth'].map(k => typeof style[k] === 'number' ? style[k] : 'nan')].map(String);
      const cards = JSON.parse(run(binary, args));
      for (const [i, card] of cards.entries()) {
        assert.equal(card.width, cardWidth, `${width}×${height}, ${subjects[i].id}: collapsed/wrong width`);
        assert.ok(card.left >= 0 && card.left + card.width <= available, 'Card outside shelf');
        assert.equal(card.top, Math.floor(i / cols) * (250 + gap), 'Wrong wrapping');
        checked++;
      }
    }
  }
  console.log(`PASS: ${checked} notebook layouts, 12 phone/tablet/foldable sizes, native Yoga from installed React Native.`);
} catch (error) {
  // Surface useful diagnostics via the Checks API even when CI log storage is unavailable.
  if (process.env.GITHUB_ACTIONS) console.error(`::error::${String(error).replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')}`);
  throw error;
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

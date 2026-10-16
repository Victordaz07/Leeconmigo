/**
 * Textos ES/EN de las familias de la fase 2–3 (valor posicional, recta, fracciones, barras, área, reloj, datos, plano y
 * razones). Mismas reglas que `math-visual-copy.ts`: frases completas en cada idioma, nunca "incorrecto"; se dice qué
 * revisar. Los problemas verbales usan nombres y objetos que funcionan igual en los dos idiomas.
 */
import type { MathLang } from './math-copy.ts';

type P = Record<string, number>;

export type FruitName = 'mango' | 'pera' | 'uva' | 'manzana';
export type BarItem = 'marbles' | 'stickers' | 'pencils' | 'apples';

export type VisualCopyModel2 =
  | { kind: 'placeValue'; target: number; task: 'build' | 'standard' | 'read' }
  | { kind: 'numberLine'; denominator: number; start: number; target: number; jumps: number[]; task: 'add' | 'subtract' | 'locate' }
  | { kind: 'fraction'; shape: 'bar' | 'pizza' | 'cake'; denominator: number; numerator: number; task: 'color' | 'name' | 'equivalent'; ref?: { numerator: number; denominator: number } }
  | { kind: 'barModel'; structure: 'partWhole' | 'compare' | 'times'; a: number; b: number; factor?: number; unknown: 'part' | 'whole' | 'smaller' | 'larger' | 'difference'; names: [string, string]; item: BarItem }
  | { kind: 'area'; rows: number; cols: number; task: 'cover' | 'perimeter' | 'missingSide' }
  | { kind: 'clock'; task: 'set' | 'read' | 'elapsed'; time: number; duration: number; step: number }
  | { kind: 'data'; categories: FruitName[]; values: number[]; scale: number; task: 'build' | 'read' | 'difference' | 'total'; ask: number[] }
  | { kind: 'coord'; max: number; x: number; y: number; task: 'plot' | 'read' }
  | { kind: 'ratio'; a: number; b: number; lots: number; task: 'scale' };

const FRUIT: Record<FruitName, { es: string; en: string }> = {
  mango: { es: 'mango', en: 'mango' },
  pera: { es: 'pera', en: 'pear' },
  uva: { es: 'uvas', en: 'grapes' },
  manzana: { es: 'manzana', en: 'apple' },
};
export const fruitName = (f: FruitName, lang: MathLang) => FRUIT[f][lang];

/** Objeto del problema: plural y género en español (para "cuántas / cuántos"). */
const ITEM: Record<BarItem, { es: string; en: string; fem: boolean }> = {
  marbles: { es: 'canicas', en: 'marbles', fem: true },
  stickers: { es: 'estampas', en: 'stickers', fem: true },
  pencils: { es: 'lápices', en: 'pencils', fem: false },
  apples: { es: 'manzanas', en: 'apples', fem: true },
};

const SHAPE = { bar: { es: 'la tira', en: 'the strip' }, pizza: { es: 'la pizza', en: 'the pizza' }, cake: { es: 'el pastel', en: 'the cake' } } as const;

/** "2:05", "11:30". */
export const timeText = (minutes: number) => {
  const w = ((minutes % 720) + 720) % 720;
  const h = Math.floor(w / 60);
  return `${h === 0 ? 12 : h}:${String(w % 60).padStart(2, '0')}`;
};

const frac = (n: number, d: number) => `${n}/${d}`;

export function visualPrompt2(m: VisualCopyModel2, lang: MathLang): string {
  const es = lang === 'es';
  switch (m.kind) {
    case 'placeValue':
      if (m.task === 'read') return es ? '¿Qué número forman estas piezas? Si hay 10 unidades o más, júntalas en una decena.' : 'What number do these pieces make? If there are 10 or more ones, trade them for a ten.';
      if (m.task === 'standard') return es ? `Construye el ${m.target} con centenas, decenas y unidades, usando las menos piezas posibles.` : `Build ${m.target} with hundreds, tens, and ones, using as few pieces as you can.`;
      return es ? `Construye el número ${m.target} con decenas y unidades.` : `Build the number ${m.target} with tens and ones.`;
    case 'numberLine': {
      if (m.task === 'locate') return es ? `Lleva la ranita a ${frac(m.target, m.denominator)} en la recta.` : `Move the frog to ${frac(m.target, m.denominator)} on the number line.`;
      const n = Math.abs(m.target - m.start);
      const tens = m.jumps.some((j) => Math.abs(j) === 10);
      const how = tens ? (es ? ' Puedes saltar de 10 en 10 y de 1 en 1.' : ' You can jump by tens and by ones.') : '';
      return m.task === 'add'
        ? es ? `La ranita está en ${m.start} y avanza ${n}. ¿En qué número cae?${how}` : `The frog is on ${m.start} and hops forward ${n}. Where does it land?${how}`
        : es ? `La ranita está en ${m.start} y regresa ${n}. ¿En qué número cae?${how}` : `The frog is on ${m.start} and hops back ${n}. Where does it land?${how}`;
    }
    case 'fraction': {
      const s = SHAPE[m.shape][lang];
      if (m.task === 'color') return es ? `Colorea ${frac(m.numerator, m.denominator)} de ${s}.` : `Color ${frac(m.numerator, m.denominator)} of ${s}.`;
      if (m.task === 'name') return es ? `¿Qué fracción de ${s} está coloreada?` : `What fraction of ${s} is colored?`;
      const r = m.ref!;
      return es
        ? `Colorea la misma cantidad que ${frac(r.numerator, r.denominator)}, pero ${s} está partid${m.shape === 'cake' ? 'o' : 'a'} en ${m.denominator} partes iguales. Después escribe la fracción.`
        : `Color the same amount as ${frac(r.numerator, r.denominator)}, but ${s} is cut into ${m.denominator} equal parts. Then write the fraction.`;
    }
    case 'barModel':
      return barStory(m, lang);
    case 'area':
      if (m.task === 'cover') return es ? `Cubre el jardín de ${m.cols} m por ${m.rows} m con losetas de 1 m². ¿Cuál es su área?` : `Cover the ${m.cols} m by ${m.rows} m garden with 1 m² tiles. What is its area?`;
      if (m.task === 'perimeter') return es ? `Van a poner una cerca alrededor de un jardín de ${m.cols} m por ${m.rows} m. ¿Cuántos metros de cerca hacen falta?` : `A fence goes all the way around a ${m.cols} m by ${m.rows} m garden. How many meters of fence are needed?`;
      return es ? `Un jardín rectangular tiene un área de ${m.rows * m.cols} m². Uno de sus lados mide ${m.cols} m. ¿Cuánto mide el otro lado?` : `A rectangular garden has an area of ${m.rows * m.cols} m². One side is ${m.cols} m long. How long is the other side?`;
    case 'clock':
      if (m.task === 'read') return es ? '¿Qué hora marca el reloj?' : 'What time does the clock show?';
      if (m.task === 'set') return es ? `Mueve las agujas hasta las ${timeText(m.time)}.` : `Move the hands to ${timeText(m.time)}.`;
      return es
        ? `La clase de arte empieza a las ${timeText(m.time)} y dura ${m.duration} minutos. Pon el reloj en la hora en que termina.`
        : `Art class starts at ${timeText(m.time)} and lasts ${m.duration} minutes. Set the clock to the time it ends.`;
    case 'data': {
      const f = (i: number) => fruitName(m.categories[i], lang);
      if (m.task === 'build') return es ? 'La clase votó por su fruta favorita. Arma la gráfica de barras con los votos de la tabla.' : 'The class voted for their favorite fruit. Build the bar graph with the votes in the table.';
      if (m.task === 'read') return es ? `¿Cuántos votos tiene ${f(m.ask[0])}?` : `How many votes does ${f(m.ask[0])} have?`;
      if (m.task === 'difference') return es ? `¿Cuántos votos más tiene ${f(m.ask[0])} que ${f(m.ask[1])}?` : `How many more votes does ${f(m.ask[0])} have than ${f(m.ask[1])}?`;
      return es ? '¿Cuántos votos hay en total?' : 'How many votes are there in all?';
    }
    case 'coord':
      return m.task === 'plot'
        ? es ? `Pon el tesoro en el punto (${m.x}, ${m.y}).` : `Put the treasure at the point (${m.x}, ${m.y}).`
        : es ? '¿En qué punto está el tesoro? Escribe sus coordenadas.' : 'Where is the treasure? Write its coordinates.';
    case 'ratio':
      return es
        ? `La pintura del mural lleva ${m.a} medidas de azul por cada ${m.b} de naranja. Si usas ${m.b * m.lots} medidas de naranja, ¿cuántas de azul necesitas? Agrega lotes completos.`
        : `The mural paint uses ${m.a} scoops of blue for every ${m.b} of orange. If you use ${m.b * m.lots} scoops of orange, how many scoops of blue do you need? Add whole batches.`;
  }
}

function barStory(m: Extract<VisualCopyModel2, { kind: 'barModel' }>, lang: MathLang): string {
  const [A, B] = m.names;
  const it = ITEM[m.item];
  const es = lang === 'es';
  const q = es ? (it.fem ? 'Cuántas' : 'Cuántos') : 'How many';
  const items = it[lang];
  const d = m.a - m.b;
  const f = m.factor ?? 1;
  if (m.structure === 'partWhole') {
    const total = m.a + m.b;
    return m.unknown === 'part'
      ? es ? `${A} y ${B} tienen ${total} ${items} entre los dos. ${A} tiene ${m.a}. ¿${q} tiene ${B}?` : `${A} and ${B} have ${total} ${items} together. ${A} has ${m.a}. How many does ${B} have?`
      : es ? `${A} tiene ${m.a} ${items} y ${B} tiene ${m.b}. ¿${q} tienen entre los dos?` : `${A} has ${m.a} ${items} and ${B} has ${m.b}. How many do they have together?`;
  }
  if (m.structure === 'compare') {
    if (m.unknown === 'smaller') return es ? `${A} tiene ${m.a} ${items}. ${B} tiene ${d} menos que ${A}. ¿${q} tiene ${B}?` : `${A} has ${m.a} ${items}. ${B} has ${d} fewer than ${A}. How many does ${B} have?`;
    if (m.unknown === 'larger') return es ? `${B} tiene ${m.b} ${items}. ${A} tiene ${d} más que ${B}. ¿${q} tiene ${A}?` : `${B} has ${m.b} ${items}. ${A} has ${d} more than ${B}. How many does ${A} have?`;
    return es ? `${A} tiene ${m.a} ${items} y ${B} tiene ${m.b}. ¿${q} más tiene ${A} que ${B}?` : `${A} has ${m.a} ${items} and ${B} has ${m.b}. How many more does ${A} have than ${B}?`;
  }
  return m.unknown === 'larger'
    ? es ? `${B} tiene ${m.b} ${items}. ${A} tiene ${f} veces esa cantidad. ¿${q} tiene ${A}?` : `${B} has ${m.b} ${items}. ${A} has ${f} times as many. How many does ${A} have?`
    : es ? `${A} tiene ${m.a} ${items}, que es ${f} veces lo que tiene ${B}. ¿${q} tiene ${B}?` : `${A} has ${m.a} ${items}, which is ${f} times as many as ${B} has. How many does ${B} have?`;
}

export function visualHowTo2(m: VisualCopyModel2, lang: MathLang): string {
  const es = lang === 'es';
  switch (m.kind) {
    case 'placeValue':
      return m.task === 'read' ? (es ? 'Cuenta primero las decenas y después las unidades.' : 'Count the tens first, then the ones.') : es ? 'Toca + y − para poner o quitar piezas. «Juntar 10» cambia 10 unidades por una decena.' : 'Tap + and − to add or take away pieces. “Trade 10” swaps 10 ones for a ten.';
    case 'numberLine':
      return m.task === 'locate' ? (es ? 'Toca la recta o usa las flechas para mover la ranita.' : 'Tap the line or use the arrows to move the frog.') : es ? 'Toca los botones de salto. Cada salto queda marcado.' : 'Tap the jump buttons. Every jump is marked.';
    case 'fraction':
      return m.task === 'name' ? (es ? 'Cuenta las partes coloreadas y las partes en total.' : 'Count the colored parts and all the parts.') : es ? 'Toca una parte para colorearla; tócala otra vez para quitar el color.' : 'Tap a part to color it; tap it again to clear it.';
    case 'barModel':
      return es ? 'La barra muestra el problema. Escribe el número que falta en la parte con «?».' : 'The bars show the problem. Write the missing number in the part with “?”.';
    case 'area':
      return m.task === 'cover' ? (es ? 'Toca cada cuadro para poner una loseta.' : 'Tap each square to place a tile.') : es ? 'Mira las medidas de los lados.' : 'Look at the side lengths.';
    case 'clock':
      return m.task === 'read' ? (es ? 'La aguja corta marca la hora; la larga, los minutos.' : 'The short hand shows the hour; the long hand shows the minutes.') : es ? 'Usa los botones para mover la hora y los minutos.' : 'Use the buttons to move the hour and the minutes.';
    case 'data':
      return m.task === 'build' ? (es ? 'Toca + y − para subir o bajar cada barra.' : 'Tap + and − to raise or lower each bar.') : es ? `Mira la escala: cada rayita vale ${m.scale}.` : `Check the scale: each line is worth ${m.scale}.`;
    case 'coord':
      return m.task === 'plot' ? (es ? 'Toca un cruce de la cuadrícula. Primero cuenta hacia la derecha y luego hacia arriba.' : 'Tap a point where lines cross. Count right first, then up.') : es ? 'Primero el número de abajo (x), luego el del lado (y).' : 'First the number along the bottom (x), then the one up the side (y).';
    case 'ratio':
      return es ? 'Cada lote trae la receta completa. Toca «+ Lote» hasta tener la naranja que pide.' : 'Each batch is the whole recipe. Tap “+ Batch” until you have the orange you need.';
  }
}

export function visualFieldLabel2(field: string, m: VisualCopyModel2, lang: MathLang): string {
  const es = lang === 'es';
  const L: Record<string, [string, string]> = {
    numerator: ['Numerador (arriba)', 'Numerator (top)'],
    denominator: ['Denominador (abajo)', 'Denominator (bottom)'],
    hour: ['Hora', 'Hour'],
    minute: ['Minutos', 'Minutes'],
    x: ['x', 'x'],
    y: ['y', 'y'],
  };
  if (L[field]) return L[field][es ? 0 : 1];
  switch (m.kind) {
    case 'placeValue':
      return es ? 'El número' : 'The number';
    case 'numberLine':
      return es ? 'Cae en' : 'Lands on';
    case 'barModel':
      return es ? 'Respuesta' : 'Answer';
    case 'area':
      return m.task === 'cover' ? (es ? 'Área (m²)' : 'Area (m²)') : m.task === 'perimeter' ? (es ? 'Cerca (m)' : 'Fence (m)') : es ? 'Otro lado (m)' : 'Other side (m)';
    case 'data':
      return es ? 'Votos' : 'Votes';
    case 'ratio':
      return es ? 'Medidas de azul' : 'Scoops of blue';
    default:
      return es ? 'Respuesta' : 'Answer';
  }
}

export function visualEquation2(m: VisualCopyModel2, solved: boolean): string {
  switch (m.kind) {
    case 'placeValue': {
      if (!solved) return '';
      const h = Math.floor(m.target / 100) * 100;
      const t = Math.floor((m.target % 100) / 10) * 10;
      const o = m.target % 10;
      return `${[h, t, o].filter((x) => x > 0).join(' + ')} = ${m.target}`;
    }
    case 'numberLine': {
      if (m.task === 'locate') return '';
      const n = Math.abs(m.target - m.start);
      return `${m.start} ${m.task === 'add' ? '+' : '−'} ${n} = ${solved ? m.target : '□'}`;
    }
    case 'fraction':
      return solved && m.task === 'equivalent' && m.ref ? `${frac(m.ref.numerator, m.ref.denominator)} = ${frac(m.numerator, m.denominator)}` : '';
    case 'barModel': {
      if (!solved) return '';
      const f = m.factor ?? 1;
      if (m.structure === 'partWhole') return m.unknown === 'whole' ? `${m.a} + ${m.b} = ${m.a + m.b}` : `${m.a + m.b} − ${m.a} = ${m.b}`;
      if (m.structure === 'compare') return m.unknown === 'smaller' ? `${m.a} − ${m.a - m.b} = ${m.b}` : m.unknown === 'larger' ? `${m.b} + ${m.a - m.b} = ${m.a}` : `${m.a} − ${m.b} = ${m.a - m.b}`;
      return m.unknown === 'larger' ? `${m.b} × ${f} = ${m.a}` : `${m.a} ÷ ${f} = ${m.b}`;
    }
    case 'area':
      if (!solved) return '';
      return m.task === 'perimeter' ? `${m.cols} + ${m.rows} + ${m.cols} + ${m.rows} = ${2 * (m.rows + m.cols)} m` : m.task === 'cover' ? `${m.rows} × ${m.cols} = ${m.rows * m.cols} m²` : `${m.rows * m.cols} ÷ ${m.cols} = ${m.rows} m`;
    case 'clock':
      return solved ? timeText(m.task === 'elapsed' ? m.time + m.duration : m.time) : '';
    case 'ratio':
      return solved ? `${m.a} : ${m.b} = ${m.a * m.lots} : ${m.b * m.lots}` : '';
    default:
      return '';
  }
}

type FB = { es: (p: P, m?: VisualCopyModel2) => string; en: (p: P, m?: VisualCopyModel2) => string };

const fruitOf = (m: VisualCopyModel2 | undefined, i: number, lang: MathLang) => (m && m.kind === 'data' ? fruitName(m.categories[i], lang) : '');
const nameOf = (m: VisualCopyModel2 | undefined, i: 0 | 1) => (m && m.kind === 'barModel' ? m.names[i] : '');

export const FEEDBACK_2: Record<string, FB> = {
  // Valor posicional
  'placeValue.start': { es: (p) => `Pon piezas hasta formar el ${p.target}.`, en: (p) => `Add pieces until you make ${p.target}.` },
  'placeValue.fewer': { es: (p) => `Todavía no llegas al ${p.target}. Cuenta tus decenas y tus unidades.`, en: (p) => `You haven’t reached ${p.target} yet. Count your tens and your ones.` },
  'placeValue.more': { es: (p) => `Te pasaste del ${p.target}. Revisa cuántas decenas y unidades pusiste.`, en: (p) => `That’s more than ${p.target}. Check how many tens and ones you used.` },
  'placeValue.bundle': { es: () => 'Vale lo mismo, pero hay 10 o más piezas en un lugar. Júntalas con «Juntar 10».', en: () => 'It has the right value, but one place has 10 or more pieces. Trade them with “Trade 10”.' },
  'placeValue.readBundle': { es: () => 'Hay más de 10 unidades: junta 10 en una decena y vuelve a contar.', en: () => 'There are more than 10 ones: trade 10 for a ten and count again.' },
  'placeValue.readCount': { es: () => 'Cuenta otra vez: cada barra vale 10 y cada cubito vale 1.', en: () => 'Count again: each rod is worth 10 and each cube is worth 1.' },
  'placeValue.explain': { es: (p) => `¡Eso es! ${p.h ? `${p.h} centenas, ` : ''}${p.t} decenas y ${p.o} unidades forman el ${p.target}.`, en: (p) => `That’s it! ${p.h ? `${p.h} hundreds, ` : ''}${p.t} tens and ${p.o} ones make ${p.target}.` },
  'placeValue.explainRead': { es: (p) => `¡Eso es! Las piezas forman el ${p.target}.`, en: (p) => `That’s it! The pieces make ${p.target}.` },
  // Recta
  'numberLine.jump': { es: (p) => `Empieza en ${p.start}: toca un botón de salto.`, en: (p) => `Start at ${p.start}: tap a jump button.` },
  'numberLine.tooFar': { es: (p) => `Te pasaste. Desde ${p.start} son ${p.n} en total: regresa un poco.`, en: (p) => `You went too far. From ${p.start} it is ${p.n} in all: hop back a little.` },
  'numberLine.notYet': { es: (p) => `Todavía no. Desde ${p.start} faltan saltos para completar ${p.n}.`, en: (p) => `Not yet. From ${p.start} you still need more hops to make ${p.n}.` },
  'numberLine.whereLanded': { es: () => 'Mira dónde quedó la ranita y escribe ese número.', en: () => 'Look where the frog landed and write that number.' },
  'numberLine.moveMarker': { es: () => 'Mueve la ranita por la recta.', en: () => 'Move the frog along the line.' },
  'numberLine.countParts': { es: (p) => `Cada entero está partido en ${p.denominator} partes iguales. Cuenta los espacios desde el 0, no las rayitas.`, en: (p) => `Each whole is cut into ${p.denominator} equal parts. Count the spaces from 0, not the marks.` },
  'numberLine.explainAdd': { es: (p) => `¡Eso es! ${p.start} + ${p.n} = ${p.target}${p.tens ? `: ${p.tens} saltos de 10 y ${p.ones} de 1` : ''}.`, en: (p) => `That’s it! ${p.start} + ${p.n} = ${p.target}${p.tens ? `: ${p.tens} jumps of 10 and ${p.ones} of 1` : ''}.` },
  'numberLine.explainSubtract': { es: (p) => `¡Eso es! ${p.start} − ${p.n} = ${p.target}${p.tens ? `: ${p.tens} saltos de 10 y ${p.ones} de 1 hacia atrás` : ''}.`, en: (p) => `That’s it! ${p.start} − ${p.n} = ${p.target}${p.tens ? `: ${p.tens} jumps of 10 and ${p.ones} of 1 back` : ''}.` },
  'numberLine.explainLocate': { es: (p) => `¡Eso es! ${p.numerator}/${p.denominator}: ${p.numerator} espacios de ${p.denominator} en cada entero.`, en: (p) => `That’s it! ${p.numerator}/${p.denominator}: ${p.numerator} spaces, with ${p.denominator} in each whole.` },
  // Fracciones
  'fraction.start': { es: () => 'Toca una parte para colorearla.', en: () => 'Tap a part to color it.' },
  'fraction.countColored': { es: (p) => `${p.numerator}/${p.denominator} son ${p.numerator} de las ${p.denominator} partes. Cuenta las coloreadas.`, en: (p) => `${p.numerator}/${p.denominator} means ${p.numerator} of the ${p.denominator} parts. Count the colored ones.` },
  'fraction.sameAmount': { es: (p) => `Compara con ${p.refNumerator}/${p.refDenominator}: ¿cubre lo mismo del entero?`, en: (p) => `Compare with ${p.refNumerator}/${p.refDenominator}: does it cover the same amount of the whole?` },
  'fraction.denominator': { es: () => 'El número de abajo dice en cuántas partes iguales está partido el entero.', en: () => 'The bottom number tells how many equal parts the whole has.' },
  'fraction.numerator': { es: () => 'El número de arriba dice cuántas partes están coloreadas.', en: () => 'The top number tells how many parts are colored.' },
  'fraction.explainColor': { es: (p) => `¡Eso es! ${p.numerator} de ${p.denominator} partes iguales: ${p.numerator}/${p.denominator}.`, en: (p) => `That’s it! ${p.numerator} of ${p.denominator} equal parts: ${p.numerator}/${p.denominator}.` },
  'fraction.explainName': { es: (p) => `¡Eso es! Hay ${p.numerator} partes coloreadas de ${p.denominator}: ${p.numerator}/${p.denominator}.`, en: (p) => `That’s it! ${p.numerator} of the ${p.denominator} parts are colored: ${p.numerator}/${p.denominator}.` },
  'fraction.explainEquivalent': { es: (p) => `¡Eso es! ${p.refNumerator}/${p.refDenominator} y ${p.numerator}/${p.denominator} cubren lo mismo: son equivalentes.`, en: (p) => `That’s it! ${p.refNumerator}/${p.refDenominator} and ${p.numerator}/${p.denominator} cover the same amount: they are equivalent.` },
  // Barras
  'bar.writeInBar': { es: () => 'Toca la parte con «?» y escribe el número que falta.', en: () => 'Tap the part with “?” and write the missing number.' },
  'bar.otherOperation': { es: () => 'Revisa la barra: ¿se juntan las dos cantidades o se busca una parte?', en: () => 'Look at the bars again: are you putting the amounts together or finding one part?' },
  'bar.check.partWhole': { es: () => 'Las dos partes juntas forman el total. Revisa tu cuenta.', en: () => 'The two parts together make the total. Check your math.' },
  'bar.check.compare': { es: () => 'Compara las barras: la diferencia es lo que una tiene de más.', en: () => 'Compare the bars: the difference is the extra one has.' },
  'bar.check.times': { es: () => 'Una barra son varias copias iguales de la otra. Revisa cuántas copias.', en: () => 'One bar is several equal copies of the other. Check how many copies.' },
  'bar.explain.partWhole.part': { es: (p, m) => `¡Eso es! ${p.a + p.value} − ${p.a} = ${p.value}. ${nameOf(m, 1)} tiene ${p.value}.`, en: (p, m) => `That’s it! ${p.a + p.value} − ${p.a} = ${p.value}. ${nameOf(m, 1)} has ${p.value}.` },
  'bar.explain.partWhole.whole': { es: (p) => `¡Eso es! ${p.a} + ${p.b} = ${p.value} entre los dos.`, en: (p) => `That’s it! ${p.a} + ${p.b} = ${p.value} together.` },
  'bar.explain.compare.smaller': { es: (p, m) => `¡Eso es! ${p.a} − ${p.a - p.b} = ${p.value}. ${nameOf(m, 1)} tiene ${p.value}.`, en: (p, m) => `That’s it! ${p.a} − ${p.a - p.b} = ${p.value}. ${nameOf(m, 1)} has ${p.value}.` },
  'bar.explain.compare.larger': { es: (p, m) => `¡Eso es! ${p.b} + ${p.a - p.b} = ${p.value}. ${nameOf(m, 0)} tiene ${p.value}.`, en: (p, m) => `That’s it! ${p.b} + ${p.a - p.b} = ${p.value}. ${nameOf(m, 0)} has ${p.value}.` },
  'bar.explain.compare.difference': { es: (p) => `¡Eso es! ${p.a} − ${p.b} = ${p.value} de diferencia.`, en: (p) => `That’s it! ${p.a} − ${p.b} = ${p.value} more.` },
  'bar.explain.times.larger': { es: (p) => `¡Eso es! ${p.factor} veces ${p.b} es ${p.b} × ${p.factor} = ${p.value}.`, en: (p) => `That’s it! ${p.factor} times ${p.b} is ${p.b} × ${p.factor} = ${p.value}.` },
  'bar.explain.times.smaller': { es: (p) => `¡Eso es! ${p.a} ÷ ${p.factor} = ${p.value}, porque ${p.value} × ${p.factor} = ${p.a}.`, en: (p) => `That’s it! ${p.a} ÷ ${p.factor} = ${p.value}, because ${p.value} × ${p.factor} = ${p.a}.` },
  // Área
  'area.cover': { es: (p) => `Faltan ${p.left} losetas para cubrir todo el jardín.`, en: (p) => `${p.left} more tiles to cover the whole garden.` },
  'area.countRows': { es: (p) => `Cuenta por filas: ${p.rows} filas de ${p.cols} losetas.`, en: (p) => `Count by rows: ${p.rows} rows of ${p.cols} tiles.` },
  'area.notArea': { es: () => 'Ese número es lo que cubre el suelo (el área). La cerca va solo por el borde.', en: () => 'That number is what covers the ground (the area). The fence only goes around the edge.' },
  'area.fourSides': { es: () => 'Sumaste dos lados. La cerca da toda la vuelta: son cuatro lados.', en: () => 'You added two sides. The fence goes all the way around: four sides.' },
  'area.addSides': { es: (p) => `Suma los cuatro lados: ${p.cols}, ${p.rows}, ${p.cols} y ${p.rows}.`, en: (p) => `Add all four sides: ${p.cols}, ${p.rows}, ${p.cols}, and ${p.rows}.` },
  'area.missingSide': { es: (p) => `¿Qué número por ${p.cols} da ${p.area}?`, en: (p) => `What number times ${p.cols} makes ${p.area}?` },
  'area.explainArea': { es: (p) => `¡Eso es! ${p.rows} filas de ${p.cols}: ${p.rows} × ${p.cols} = ${p.area} m².`, en: (p) => `That’s it! ${p.rows} rows of ${p.cols}: ${p.rows} × ${p.cols} = ${p.area} m².` },
  'area.explainPerimeter': { es: (p) => `¡Eso es! ${p.cols} + ${p.rows} + ${p.cols} + ${p.rows} = ${p.perimeter} m de cerca.`, en: (p) => `That’s it! ${p.cols} + ${p.rows} + ${p.cols} + ${p.rows} = ${p.perimeter} m of fence.` },
  'area.explainMissing': { es: (p) => `¡Eso es! ${p.rows} × ${p.cols} = ${p.area}, así que el otro lado mide ${p.rows} m.`, en: (p) => `That’s it! ${p.rows} × ${p.cols} = ${p.area}, so the other side is ${p.rows} m.` },
  // Reloj
  'clock.move': { es: () => 'Mueve las agujas con los botones.', en: () => 'Move the hands with the buttons.' },
  'clock.minuteHand': { es: () => 'Revisa la aguja larga: marca los minutos, de 5 en 5 en cada número.', en: () => 'Check the long hand: it shows the minutes, 5 for each number.' },
  'clock.hourHand': { es: (p) => (p.minute >= 30 ? 'Revisa la aguja corta: cuando pasa de la media, ya va camino a la siguiente hora.' : 'Revisa la aguja corta: marca la hora.'), en: (p) => (p.minute >= 30 ? 'Check the short hand: after half past, it is moving toward the next hour.' : 'Check the short hand: it shows the hour.') },
  'clock.explainSet': { es: (p) => `¡Eso es! Son las ${p.hour}:${String(p.minute).padStart(2, '0')}.`, en: (p) => `That’s it! It is ${p.hour}:${String(p.minute).padStart(2, '0')}.` },
  'clock.explainRead': { es: (p) => `¡Eso es! Son las ${p.hour}:${String(p.minute).padStart(2, '0')}.`, en: (p) => `That’s it! It is ${p.hour}:${String(p.minute).padStart(2, '0')}.` },
  'clock.explainElapsed': {
    es: (p) => `¡Eso es! De las ${p.startHour}:${String(p.startMinute).padStart(2, '0')}, ${p.duration} minutos después son las ${p.hour}:${String(p.minute).padStart(2, '0')}.`,
    en: (p) => `That’s it! ${p.duration} minutes after ${p.startHour}:${String(p.startMinute).padStart(2, '0')} it is ${p.hour}:${String(p.minute).padStart(2, '0')}.`,
  },
  // Datos
  'data.start': { es: () => 'Sube las barras con + según la tabla.', en: () => 'Raise the bars with + to match the table.' },
  'data.checkBar': { es: (p, m) => `Revisa la barra de ${fruitOf(m, p.index, 'es')}: en la tabla tiene ${p.value}.`, en: (p, m) => `Check the ${fruitOf(m, p.index, 'en')} bar: the table says ${p.value}.` },
  'data.scale': { es: (p) => `Contaste rayitas, pero cada una vale ${p.scale}. Lee el número de la escala.`, en: (p) => `You counted lines, but each one is worth ${p.scale}. Read the number on the scale.` },
  'data.check.read': { es: (p, m) => `Sigue el borde de arriba de la barra de ${fruitOf(m, p.i, 'es')} hasta la escala.`, en: (p, m) => `Follow the top of the ${fruitOf(m, p.i, 'en')} bar across to the scale.` },
  'data.check.difference': { es: (p, m) => `Lee las dos barras, ${fruitOf(m, p.i, 'es')} y ${fruitOf(m, p.j, 'es')}, y busca la diferencia.`, en: (p, m) => `Read both bars, ${fruitOf(m, p.i, 'en')} and ${fruitOf(m, p.j, 'en')}, and find the difference.` },
  'data.check.total': { es: () => 'Lee cada barra y suma todos los votos.', en: () => 'Read every bar and add all the votes.' },
  'data.explainBuild': { es: () => '¡Eso es! La gráfica muestra los mismos votos que la tabla.', en: () => 'That’s it! The graph shows the same votes as the table.' },
  'data.explain.read': { es: (p, m) => `¡Eso es! ${fruitOf(m, p.i, 'es')} tiene ${p.value} votos.`, en: (p, m) => `That’s it! ${fruitOf(m, p.i, 'en')} has ${p.value} votes.` },
  'data.explain.difference': { es: (p) => `¡Eso es! ${p.a} − ${p.b} = ${p.value} votos más.`, en: (p) => `That’s it! ${p.a} − ${p.b} = ${p.value} more votes.` },
  'data.explain.total': { es: (p) => `¡Eso es! En total hay ${p.value} votos.`, en: (p) => `That’s it! There are ${p.value} votes in all.` },
  // Plano
  'coord.place': { es: () => 'Toca un cruce de la cuadrícula para poner el tesoro.', en: () => 'Tap a point on the grid to place the treasure.' },
  'coord.swapped': { es: () => 'Casi: el orden importa. Primero se cuenta hacia la derecha (x) y después hacia arriba (y).', en: () => 'Close: order matters. Count right first (x), then up (y).' },
  'coord.checkX': { es: () => 'Revisa cuánto avanzaste hacia la derecha (x).', en: () => 'Check how far right you went (x).' },
  'coord.checkY': { es: () => 'Revisa cuánto subiste (y).', en: () => 'Check how far up you went (y).' },
  'coord.explain': { es: (p) => `¡Eso es! (${p.x}, ${p.y}): ${p.x} a la derecha y ${p.y} hacia arriba.`, en: (p) => `That’s it! (${p.x}, ${p.y}): ${p.x} right and ${p.y} up.` },
  // Razones
  'ratio.lots': { es: (p) => `Necesitas ${p.orange} medidas de naranja; cada lote trae ${p.b}. Ajusta los lotes.`, en: (p) => `You need ${p.orange} scoops of orange; each batch has ${p.b}. Adjust the batches.` },
  'ratio.additive': { es: (p) => `Sumaste lo mismo a las dos. Para que el color no cambie, cada lote repite ${p.a} de azul por ${p.b} de naranja.`, en: (p) => `You added the same amount to both. To keep the color, every batch repeats ${p.a} blue for ${p.b} orange.` },
  'ratio.countBlue': { es: (p) => `Cuenta el azul de todos los lotes: ${p.a} en cada uno.`, en: (p) => `Count the blue in every batch: ${p.a} in each.` },
  'ratio.explain': { es: (p) => `¡Eso es! ${p.lots} lotes de ${p.a} azul y ${p.b} naranja: ${p.blue} azul por ${p.orange} naranja.`, en: (p) => `That’s it! ${p.lots} batches of ${p.a} blue and ${p.b} orange: ${p.blue} blue for ${p.orange} orange.` },
};

export function visualHint2(m: VisualCopyModel2, level: 1 | 2 | 3, e: P, lang: MathLang): string {
  const es = lang === 'es';
  const H = (a: string, b: string) => (es ? a : b);
  switch (m.kind) {
    case 'placeValue':
      if (level === 1) return H('Mira cuántas decenas tiene el número.', 'Look at how many tens the number has.');
      if (level === 2) return H('Pon primero las decenas y después las unidades.', 'Place the tens first, then the ones.');
      return H(`Ejemplo: ${e.target} son ${e.t} decenas y ${e.o} unidades.`, `Example: ${e.target} is ${e.t} tens and ${e.o} ones.`);
    case 'numberLine':
      if (m.task === 'locate') {
        if (level === 1) return H('Mira cuántos espacios hay entre el 0 y el 1.', 'Look at how many spaces there are between 0 and 1.');
        if (level === 2) return H('El número de abajo dice en cuántos espacios se parte cada entero; el de arriba, cuántos avanzas.', 'The bottom number tells how many spaces each whole has; the top number, how many to move.');
        return H(`Ejemplo: ${e.numerator}/${e.denominator} es avanzar ${e.numerator} espacios cuando cada entero tiene ${e.denominator}.`, `Example: ${e.numerator}/${e.denominator} means moving ${e.numerator} spaces when each whole has ${e.denominator}.`);
      }
      if (level === 1) return H('Mira cuánto tienes que avanzar en total.', 'Look at how far you need to go in all.');
      if (level === 2) return H('Da primero los saltos de 10 y luego los de 1.', 'Do the jumps of 10 first, then the jumps of 1.');
      return H(`Ejemplo: de ${e.start}, avanzar 14 es un salto de 10 y 4 de 1: llegas a ${e.target}.`, `Example: from ${e.start}, moving 14 is one jump of 10 and 4 of 1: you land on ${e.target}.`);
    case 'fraction':
      if (level === 1) return H('Cuenta en cuántas partes iguales está partido el entero.', 'Count how many equal parts the whole has.');
      if (level === 2) return m.task === 'equivalent' ? H('Si las partes son más chicas, necesitas más partes para cubrir lo mismo.', 'If the parts are smaller, you need more of them to cover the same amount.') : H('El número de arriba son las partes que cuentas; el de abajo, todas las partes.', 'The top number is the parts you count; the bottom number is all the parts.');
      return H(`Ejemplo: ${e.numerator}/${e.denominator} es colorear ${e.numerator} de ${e.denominator} partes iguales.`, `Example: ${e.numerator}/${e.denominator} means coloring ${e.numerator} of ${e.denominator} equal parts.`);
    case 'barModel':
      if (level === 1) return H('Mira qué parte de la barra tiene el «?».', 'Find the part of the bars with the “?”.');
      if (level === 2) return m.structure === 'times' ? H('Una barra está hecha de copias iguales de la otra.', 'One bar is made of equal copies of the other.') : H('Si falta el total, juntas las partes. Si falta una parte, al total le quitas la otra.', 'If the total is missing, put the parts together. If a part is missing, take the other part away from the total.');
      return m.structure === 'times' ? H(`Ejemplo: ${e.factor} veces ${e.b} es ${e.b} × ${e.factor} = ${e.a}.`, `Example: ${e.factor} times ${e.b} is ${e.b} × ${e.factor} = ${e.a}.`) : H(`Ejemplo: si entre dos tienen ${e.a} y uno tiene ${e.b}, el otro tiene ${e.a} − ${e.b} = ${e.value}.`, `Example: if two kids have ${e.a} together and one has ${e.b}, the other has ${e.a} − ${e.b} = ${e.value}.`);
    case 'area':
      if (level === 1) return m.task === 'perimeter' ? H('El perímetro va por el borde, alrededor.', 'The perimeter goes around the edge.') : H('El área es lo que cubre el suelo.', 'The area is what covers the ground.');
      if (level === 2) return m.task === 'perimeter' ? H('Suma los cuatro lados.', 'Add all four sides.') : H('Cuenta por filas: filas × losetas en cada fila.', 'Count by rows: rows × tiles in each row.');
      return m.task === 'perimeter' ? H(`Ejemplo: un jardín de ${e.cols} por ${e.rows} lleva ${e.cols} + ${e.rows} + ${e.cols} + ${e.rows} = ${2 * (e.rows + e.cols)} m.`, `Example: a ${e.cols} by ${e.rows} garden needs ${e.cols} + ${e.rows} + ${e.cols} + ${e.rows} = ${2 * (e.rows + e.cols)} m.`) : H(`Ejemplo: ${e.rows} filas de ${e.cols} son ${e.rows} × ${e.cols} = ${e.rows * e.cols} m².`, `Example: ${e.rows} rows of ${e.cols} is ${e.rows} × ${e.cols} = ${e.rows * e.cols} m².`);
    case 'clock':
      if (level === 1) return H('La aguja larga son los minutos; la corta, la hora.', 'The long hand is the minutes; the short hand is the hour.');
      if (level === 2) return m.task === 'elapsed' ? H('Avanza primero hasta la hora en punto y luego suma lo que falta.', 'Move to the next o’clock first, then add what is left.') : H('Cuenta los minutos de 5 en 5 en cada número.', 'Count the minutes by 5s at each number.');
      return m.task === 'elapsed' ? H(`Ejemplo: de las ${e.startHour}:${String(e.startMinute).padStart(2, '0')}, 20 minutos llegan a las ${e.startHour + 1}:00 y 10 más son las ${e.hour}:${String(e.minute).padStart(2, '0')}.`, `Example: from ${e.startHour}:${String(e.startMinute).padStart(2, '0')}, 20 minutes gets to ${e.startHour + 1}:00 and 10 more is ${e.hour}:${String(e.minute).padStart(2, '0')}.`) : H(`Ejemplo: a las ${e.hour}:${String(e.minute).padStart(2, '0')} la aguja larga está en el 6 y la corta, entre el ${e.hour} y el ${e.hour + 1}.`, `Example: at ${e.hour}:${String(e.minute).padStart(2, '0')} the long hand is on 6 and the short hand is between ${e.hour} and ${e.hour + 1}.`);
    case 'data':
      if (level === 1) return H(`Mira la escala: cada rayita vale ${m.scale}.`, `Look at the scale: each line is worth ${m.scale}.`);
      if (level === 2) return m.task === 'difference' ? H('Lee las dos barras y resta la menor de la mayor.', 'Read both bars and subtract the smaller from the larger.') : H('Sigue la parte de arriba de la barra hasta el número de la escala.', 'Follow the top of the bar across to the number on the scale.');
      return H(`Ejemplo: si una barra llega a ${e.a} y otra a ${e.b}, la diferencia es ${e.a} − ${e.b} = ${e.value}.`, `Example: if one bar reaches ${e.a} and another reaches ${e.b}, the difference is ${e.a} − ${e.b} = ${e.value}.`);
    case 'coord':
      if (level === 1) return H('Empieza en el 0, la esquina de abajo.', 'Start at 0, the bottom corner.');
      if (level === 2) return H('El primer número dice cuánto vas a la derecha; el segundo, cuánto subes.', 'The first number says how far right; the second, how far up.');
      return H(`Ejemplo: (${e.x}, ${e.y}) es ${e.x} a la derecha y ${e.y} hacia arriba.`, `Example: (${e.x}, ${e.y}) is ${e.x} right and ${e.y} up.`);
    case 'ratio':
      if (level === 1) return H('Mira cuánta naranja lleva un lote.', 'Look at how much orange one batch has.');
      if (level === 2) return H('Cada lote nuevo repite toda la receta: el azul y el naranja crecen juntos.', 'Each new batch repeats the whole recipe: blue and orange grow together.');
      return H(`Ejemplo: con ${e.a} de azul por ${e.b} de naranja, ${e.lots} lotes son ${e.blue} de azul y ${e.orange} de naranja.`, `Example: with ${e.a} blue for ${e.b} orange, ${e.lots} batches make ${e.blue} blue and ${e.orange} orange.`);
  }
}

/** Nombres de los temas del Taller (una familia por tema). */
export const TOPIC_COPY: Record<string, { es: string; en: string }> = {
  tenFrame: { es: 'Bandejas de 10', en: 'Ten frames' },
  equalGroups: { es: 'Grupos iguales', en: 'Equal groups' },
  sharing: { es: 'Repartir', en: 'Sharing' },
  placeValue: { es: 'Decenas y unidades', en: 'Tens and ones' },
  numberLine: { es: 'Recta numérica', en: 'Number line' },
  fraction: { es: 'Fracciones', en: 'Fractions' },
  barModel: { es: 'Problemas con barras', en: 'Bar models' },
  area: { es: 'Área y perímetro', en: 'Area and perimeter' },
  clock: { es: 'La hora', en: 'Telling time' },
  data: { es: 'Gráficas', en: 'Graphs' },
  coord: { es: 'Plano y coordenadas', en: 'Coordinate grid' },
  ratio: { es: 'Razones y mezclas', en: 'Ratios' },
};

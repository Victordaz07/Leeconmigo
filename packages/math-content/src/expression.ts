/**
 * Evaluador SEGURO de las expresiones de las plantillas (`groups * perGroup`). Solo acepta nombres de parámetros, enteros,
 * + − × ÷ y paréntesis; nunca usa `eval` ni ejecuta texto (docs/research §8: "never eval arbitrary text"). La división
 * debe ser exacta: un reto de primaria con resultado decimal escondido es un error de contenido.
 */

type Token = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: '+' | '-' | '*' | '/' } | { t: '('} | { t: ')' };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) i++;
    else if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9]/.test(src[j])) j++;
      out.push({ t: 'num', v: Number(src.slice(i, j)) });
      i = j;
    } else if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: 'id', v: src.slice(i, j) });
      i = j;
    } else if (c === '+' || c === '-' || c === '*' || c === '/') {
      out.push({ t: 'op', v: c });
      i++;
    } else if (c === '(' || c === ')') {
      out.push({ t: c });
      i++;
    } else throw new Error(`Carácter no permitido en la expresión: "${c}"`);
  }
  return out;
}

/** Nombres que usa una expresión (para validar que existen). */
export function expressionNames(src: string): string[] {
  return [...new Set(tokenize(src).flatMap((t) => (t.t === 'id' ? [t.v] : [])))];
}

/** Evalúa con los valores dados. Lanza error si falta un nombre, sobra algo o una división no es exacta. */
export function evaluate(src: string, values: Record<string, number>): number {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const expr = (): number => {
    let v = term();
    for (let t = peek(); t && t.t === 'op' && (t.v === '+' || t.v === '-'); t = peek()) {
      p++;
      const r = term();
      v = t.v === '+' ? v + r : v - r;
    }
    return v;
  };
  const term = (): number => {
    let v = factor();
    for (let t = peek(); t && t.t === 'op' && (t.v === '*' || t.v === '/'); t = peek()) {
      p++;
      const r = factor();
      if (t.v === '*') v *= r;
      else {
        if (r === 0 || v % r !== 0) throw new Error(`División no exacta o entre cero en "${src}"`);
        v /= r;
      }
    }
    return v;
  };
  const factor = (): number => {
    const t = toks[p++];
    if (!t) throw new Error(`Expresión incompleta: "${src}"`);
    if (t.t === 'num') return t.v;
    if (t.t === 'id') {
      if (!(t.v in values)) throw new Error(`Nombre desconocido "${t.v}" en "${src}"`);
      return values[t.v];
    }
    if (t.t === '(') {
      const v = expr();
      if (toks[p++]?.t !== ')') throw new Error(`Falta ")" en "${src}"`);
      return v;
    }
    if (t.t === 'op' && t.v === '-') return -factor();
    throw new Error(`Expresión inválida: "${src}"`);
  };
  const v = expr();
  if (p !== toks.length) throw new Error(`Sobra texto en la expresión: "${src}"`);
  return v;
}

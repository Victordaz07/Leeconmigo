import type { TextStyle } from 'react-native';
import type { WordMark } from '@lee-conmigo/ui-core';
import { colors } from '../tokens.ts';

const FILL: Record<NonNullable<WordMark['fill']>, string> = {
  focus: colors.focus,
  warnTint: colors.warnTint,
  okTint: colors.okTint,
  echo: colors.echo,
};

const UNDERLINE: Record<NonNullable<WordMark['underline']>, string> = {
  brand: colors.brand,
  warn: colors.warn,
  echoLine: colors.echoLine,
};

/**
 * Estilo nativo de una palabra a partir de su marca (`wordMark`, @lee-conmigo/ui-core: la misma decisión que la app web).
 * Límite conocido: Android no colorea ni punteá el subrayado (`textDecorationColor/Style` son de iOS); se ve como subrayado
 * del color del texto. Nunca rojo (docs/06).
 */
export function wordStyle(m: WordMark): TextStyle | undefined {
  if (!m.fill && !m.underline && !m.dotted && !m.echoText) return undefined;
  const s: TextStyle = {};
  if (m.fill) s.backgroundColor = FILL[m.fill];
  if (m.underline || m.dotted) {
    s.textDecorationLine = 'underline';
    if (m.underline) s.textDecorationColor = UNDERLINE[m.underline];
    if (m.dotted && !m.underline) {
      s.textDecorationStyle = 'dotted';
      s.textDecorationColor = colors.slate400;
    }
  }
  if (m.echoText) s.color = colors.brandStrong;
  return s;
}

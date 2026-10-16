/**
 * Juego de parejas (momento Juego): unir cada tarjeta con su número. Sin reloj, sin vidas, sin premios al azar y con
 * salida siempre (D5, docs/research §7). Un intento que no coincide solo dice "prueba otra pareja": nada de rojo.
 */
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PairsGame as PairsGameData } from '@lee-conmigo/contracts';
import { MATH_COPY, type MathLang } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export function PairsGame({ data, lang, onDone, narrow }: { data: PairsGameData; lang: MathLang; onDone: () => void; narrow?: boolean }) {
  // Números en otro orden (determinista: girar la lista), para que no queden alineados con su tarjeta.
  const rights = useMemo(() => data.pairs.map((p) => p.right).map((_, i, arr) => arr[(i + 1) % arr.length]), [data]);
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [miss, setMiss] = useState(false);
  const done = matched.size === data.pairs.length;

  const pickRight = (value: number) => {
    if (left === null) return;
    if (data.pairs[left].right === value) {
      const m = new Set(matched).add(left);
      setMatched(m);
      setLeft(null);
      setMiss(false);
    } else setMiss(true);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{MATH_COPY.game.title[lang]}</Text>
      <View style={[styles.cols, narrow && styles.colsNarrow]}>
        <View style={styles.col}>
          {data.pairs.map((p, i) => {
            const isDone = matched.has(i);
            return (
              <Pressable key={i} disabled={isDone} onPress={() => { setLeft(i); setMiss(false); }} accessibilityRole="button" accessibilityState={{ selected: left === i, disabled: isDone }} style={[styles.card, left === i && styles.cardOn, isDone && styles.cardDone]}>
                <Text style={styles.cardText}>{isDone ? `✓ ${p.left[lang]}` : p.left[lang]}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.col, styles.numbers]}>
          {rights.map((n, i) => {
            const usedBy = [...matched].some((k) => data.pairs[k].right === n);
            return (
              <Pressable key={i} disabled={usedBy || left === null} onPress={() => pickRight(n)} accessibilityRole="button" style={[styles.num, usedBy && styles.cardDone, left !== null && !usedBy && styles.numReady]}>
                <Text style={styles.numText}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={styles.msg} accessibilityLiveRegion="polite">
        {done ? MATH_COPY.game.done[lang] : miss ? MATH_COPY.game.tryAnother[lang] : ' '}
      </Text>
      {done && (
        <Pressable onPress={onDone} accessibilityRole="button" style={styles.next}>
          <Text style={styles.nextText}>{MATH_COPY.next[lang]}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, alignItems: 'center' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.navy, textAlign: 'center' },
  cols: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  colsNarrow: { gap: 12 },
  col: { gap: 10 },
  numbers: { alignItems: 'center' },
  card: { minHeight: 60, maxWidth: 360, justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 3, borderColor: 'transparent', boxShadow: shadows.soft },
  cardOn: { borderColor: colors.brand },
  cardDone: { backgroundColor: colors.okTint, boxShadow: undefined },
  cardText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  num: { width: 76, height: 60, borderRadius: radius.tile, backgroundColor: colors.phaseJuego, alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0px -4px 0px ${colors.phaseJuegoLedge}` },
  numReady: { transform: [{ scale: 1.04 }] },
  numText: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.ink },
  msg: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.inkMute, minHeight: 22 },
  next: { backgroundColor: colors.brand, borderRadius: radius.pill, paddingHorizontal: 28, paddingVertical: 12 },
  nextText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: '#ffffff' },
});

import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ARTE_COPY, MAX_DROPS, PIGMENTS, PIGMENT_NAME, addDrop, addToPalette, dropsOf, emptyRecipe, hexOf, recipeText, removeDrop, type ArtLang, type PaletteColor, type Pigment, type Recipe } from '@lee-conmigo/art-content';
import { Button, colors, fontFamily } from '@lee-conmigo/ui-native';
import { PAINT_ART } from './art';

const PIGMENT_LABEL_COLOR: Record<Pigment, string> = { red: '#FF0000', yellow: '#FFFF00', blue: '#2A5F99', white: '#FFFFFF', black: '#000000' };

interface Props {
  lang: ArtLang;
  palette: PaletteColor[];
  /** El color mezclado ya está en la paleta nueva; `id` es el del color recién guardado. */
  onSaved: (palette: PaletteColor[], id: string) => void;
}

/**
 * Mezclador de gotas (modelo didáctico de `mixing.ts`): se echan gotas de las cinco pinturas y el resultado se guarda como un color nuevo de la paleta.
 * Lo usan el Taller de pintura y la unidad A2-U02.
 */
export function PaintMixer({ lang, palette, onSaved }: Props) {
  const t = ARTE_COPY[lang];
  const [recipe, setRecipe] = useState<Recipe>(emptyRecipe());
  const [saved, setSaved] = useState(false);
  const rName = (p: Pigment) => PIGMENT_NAME[p][lang];
  const total = dropsOf(recipe);
  const mixHex = total > 0 ? hexOf(recipe) : null;
  const change = (next: Recipe) => {
    setRecipe(next);
    setSaved(false);
  };
  const save = () => {
    if (total === 0) return;
    const r = addToPalette(palette, recipe);
    if (r.id === null) return;
    onSaved(r.palette, r.id);
    setSaved(true);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Image source={PAINT_ART.vaso} resizeMode="contain" accessible={false} style={styles.titleImg} />
        <Text style={styles.h3}>{t.mixTitle}</Text>
      </View>
      <Text style={styles.note}>{t.mixHint}</Text>
      <View style={styles.pots}>
        {PIGMENTS.map((p) => (
          <View key={p} style={styles.pot}>
            <Pressable onPress={() => change(addDrop(recipe, p))} accessibilityRole="button" accessibilityLabel={`${t.mixAdd(rName(p))}. ${recipe[p]}`} style={styles.jar}>
              <Image source={PAINT_ART.bote} resizeMode="contain" accessible={false} style={styles.jarImg} />
              <View style={[styles.potDot, { backgroundColor: PIGMENT_LABEL_COLOR[p] }, p === 'white' && styles.potWhite]}>
                <Text style={[styles.potCount, { color: p === 'yellow' || p === 'white' ? '#1E2340' : '#ffffff' }]}>{recipe[p] > 0 ? recipe[p] : '+'}</Text>
              </View>
            </Pressable>
            <Text style={styles.potName}>{rName(p)}</Text>
            <Pressable onPress={() => change(removeDrop(recipe, p))} disabled={recipe[p] === 0} accessibilityRole="button" accessibilityLabel={t.mixRemove(rName(p))} accessibilityState={{ disabled: recipe[p] === 0 }} style={[styles.potMinus, recipe[p] === 0 && styles.potMinusOff]}>
              <Text style={styles.potMinusText}>− {t.mixRemoveShort}</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Text style={styles.h3}>{t.mixResult}</Text>
      <View style={styles.mixRow}>
        <View style={[styles.mixSwatch, mixHex ? { backgroundColor: mixHex } : styles.mixSwatchEmpty]} accessibilityLabel={total > 0 ? recipeText(recipe, lang) : t.mixEmpty} />
        <Text style={styles.line}>{total > 0 ? recipeText(recipe, lang) : t.mixEmpty}</Text>
      </View>
      {total >= MAX_DROPS && <Text style={styles.small}>{t.mixFull}</Text>}
      <View style={styles.actions}>
        <Button label={t.mixSave} onPress={save} disabled={total === 0} />
        <Button label={t.mixClear} variant="secondary" onPress={() => change(emptyRecipe())} disabled={total === 0} />
      </View>
      {saved && <Text style={styles.ok}>✓ {t.mixSaved}</Text>}
      <Text style={styles.small}>{t.mixNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  line: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  ok: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.ok },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleImg: { width: 44, height: 44 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  pots: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'flex-start' },
  pot: { alignItems: 'center', gap: 2, width: 96 },
  jar: { width: 88, height: 88, alignItems: 'center', justifyContent: 'flex-end' },
  jarImg: { position: 'absolute', top: 0, left: 0, width: 88, height: 88 },
  potDot: { width: 46, height: 46, borderRadius: 23, marginBottom: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(0,0,0,0.15)' },
  potWhite: { borderColor: colors.line },
  potCount: { fontFamily: fontFamily.ui.black, fontSize: 24 },
  potName: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  potMinus: { width: 92, minHeight: 44, borderRadius: 12, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  potMinusOff: { opacity: 0.4 },
  potMinusText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.inkSoft },
  mixRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mixSwatch: { width: 96, height: 96, borderRadius: 20, borderWidth: 3, borderColor: colors.line },
  mixSwatchEmpty: { backgroundColor: '#ffffff', borderStyle: 'dashed' },
});

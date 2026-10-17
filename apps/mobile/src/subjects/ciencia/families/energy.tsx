import { Text, View } from 'react-native';
import { ACTION_NAME, DEVICES, DEVICE_MODEL, DEVICE_NAME, FORMS, FORM_NAME, NOTICED, diagramCheck, kindOf, type Device, type Form } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, DeviceBench, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_ENERGIA } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: si ya se usó el dispositivo y el diagrama que arma el niño (lo que entra y lo que sale). */
interface Bag {
  used?: boolean;
  entra?: Form | null;
  sale?: Form[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const IMAGE: Record<Device, (typeof CIENCIA_ENERGIA)[keyof typeof CIENCIA_ENERGIA]> = { bombilla: CIENCIA_ENERGIA.bombilla, campana: CIENCIA_ENERGIA.campana, molinete: CIENCIA_ENERGIA.molinete };
const EFFECT = { bombilla: 'glow', campana: 'rings', molinete: 'spin' } as const;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Los dispositivos de energía (C4-U03): usar un dispositivo, dibujar lo que entra y lo que sale, y la tabla de los tres. */
export const energyFamily: Family = {
  id: 'energy',
  owns: (step) => !!step.energy,
  initial: (step) => ({ bag: { used: !!step.energy?.static, entra: null, sale: [] } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const k = step.energy;
    const bag = bagOf(ctx);
    if (!k || step.kind !== 'probar') return true;
    if (k.view === 'device') return !!bag.used || local.skipped;
    if (k.view === 'diagram' && k.device) return diagramCheck(k.device, bag.entra ?? null, bag.sale ?? []).ok || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, calm, patch } = ctx;
    const k = step.energy;
    if (!k) return null;
    const c = CIENCIA_COPY.energy;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });

    if (k.view === 'table') {
      return (
        <View style={fstyles.stack}>
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.colEnters[lang], c.colExits[lang], c.colKind[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={DEVICES.map((d) => ({
              id: d,
              label: DEVICE_NAME[d][lang],
              cells: [{ text: FORM_NAME[DEVICE_MODEL[d].entra][lang] }, { text: DEVICE_MODEL[d].sale.map((f) => FORM_NAME[f][lang]).join(' + ') }, { text: (kindOf(d) === 'transforma' ? c.transforms : c.transfers)[lang] }],
            }))}
          />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const device = k.device as Device;
    const model = DEVICE_MODEL[device];
    // En el diagrama el dispositivo ya se usó antes: se muestra funcionando.
    const used = k.static || k.view === 'diagram' ? true : !!bag.used;
    const noticed = used ? NOTICED[device].map((t) => t[lang]).join(' · ') : c.nothingYet[lang];
    const bench = (
      <DeviceBench
        image={IMAGE[device]}
        source={device === 'bombilla' ? CIENCIA_ENERGIA.pila : undefined}
        width={visualWidth}
        effect={EFFECT[device]}
        on={used}
        calm={calm}
        caption={noticed}
        label={c.benchLabel(DEVICE_NAME[device][lang].toLowerCase())[lang]}
      />
    );

    if (k.view === 'device') {
      return (
        <View style={fstyles.stack}>
          {bench}
          {!k.static && step.kind === 'probar' ? (
            <View style={fstyles.buttonsRow}>
              <Button label={ACTION_NAME[model.action][lang]} onPress={() => set({ used: true })} />
              <Text style={fstyles.helper}>{(used ? c.used : c.nothingYet)[lang]}</Text>
            </View>
          ) : null}
          <Text style={fstyles.helper}>{c.safe[lang]}</Text>
        </View>
      );
    }

    // ---- diagrama: lo que entra y lo que sale
    const entra = k.static ? model.entra : bag.entra ?? null;
    const sale = k.static ? model.sale : bag.sale ?? [];
    const check = diagramCheck(device, entra, sale);
    const hint = check.ok ? c.diagramOk : !check.entraOk && entra !== null ? c.hintEnters : check.extra.length ? c.hintExtra : entra !== null && check.missing.length && sale.length ? c.hintMissing : null;
    return (
      <View style={fstyles.stack}>
        {bench}
        <Text style={fstyles.helper}>{c.pickEnters[lang]}</Text>
        <View style={fstyles.buttonsRow}>
          {FORMS.map((f) => (
            <Button key={f} label={cap(FORM_NAME[f][lang])} variant={entra === f ? 'primary' : 'secondary'} disabled={!!k.static} onPress={() => set({ entra: f })} />
          ))}
        </View>
        <Text style={fstyles.helper}>{c.pickExits[lang]}</Text>
        <View style={fstyles.buttonsRow}>
          {FORMS.map((f) => (
            <Button key={f} label={cap(FORM_NAME[f][lang])} variant={sale.includes(f) ? 'primary' : 'secondary'} disabled={!!k.static} onPress={() => set({ sale: sale.includes(f) ? sale.filter((x) => x !== f) : [...sale, f] })} />
          ))}
        </View>
        {hint ? <Text style={fstyles.helper}>{hint[lang]}</Text> : null}
      </View>
    );
  },
};

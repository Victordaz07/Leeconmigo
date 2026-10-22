/** Ayudas para escribir las misiones sin repetir estructura. Solo construyen datos. */
import type { Choice, ChooseOption, Explain, Localized, SpotItem } from './types.ts';

export const L = (es: string, en: string): Localized => ({ es, en });
export const ch = (id: string, es: string, en: string): Choice => ({ id, text: L(es, en) });
export const opt = (id: string, es: string, en: string, resEs: string, resEn: string, preferred: boolean): ChooseOption => ({ id, text: L(es, en), result: L(resEs, resEn), preferred });
export const sp = (id: string, es: string, en: string, sign: boolean, whyEs: string, whyEn: string): SpotItem => ({ id, text: L(es, en), sign, why: L(whyEs, whyEn) });
/** El primer marco es el preferido. */
export const exp = (pEs: string, pEn: string, ...choices: Choice[]): Explain => ({ prompt: L(pEs, pEn), choices, preferredChoiceIds: [choices[0]!.id] });

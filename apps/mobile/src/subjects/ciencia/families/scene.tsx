import { Image } from 'react-native';
import { radius, SceneZones } from '@lee-conmigo/ui-native';
import { SCENE_ART } from '../art';
import type { Family } from './types';

/** Escena de cuento (imagen) con, si el paso lo pide, zonas que el niño toca para decir lo que ve. */
export const sceneFamily: Family = {
  id: 'scene',
  owns: (step) => !!step.scene && !!SCENE_ART[step.scene],
  visual: ({ step, task, lang, visualWidth, picks, setPicks, done }) => {
    const art = SCENE_ART[step.scene as string];
    if (!art) return null;
    const zones = step.zones;
    if (!zones) return <Image source={art.source} style={{ width: visualWidth, height: visualWidth / art.aspect, borderRadius: radius.card }} resizeMode="cover" accessible={false} accessibilityLabel={step.text[lang]} />;
    const selected = picks[task?.id ?? '']?.[zones.part] ?? [];
    return (
      <SceneZones
        source={art.source}
        aspect={art.aspect}
        width={visualWidth}
        zones={zones.items.map((z) => ({ id: z.id, x: z.x, y: z.y, w: z.w, h: z.h, label: z.label[lang] }))}
        selected={selected}
        imageLabel={step.text[lang]}
        onToggle={(id) => {
          if (!task || done[task.id]) return;
          setPicks((p) => {
            const cur = p[task.id]?.[zones.part] ?? [];
            return { ...p, [task.id]: { ...p[task.id], [zones.part]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } };
          });
        }}
      />
    );
  },
};

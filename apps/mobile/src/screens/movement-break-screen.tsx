import { MOVEMENT_COPY, MOVEMENT_SECONDS, routineFor, type MathLang } from '@lee-conmigo/ui-core';
import { MovementBreak } from '@lee-conmigo/ui-native';
import { MATH_BACKGROUNDS } from '../math-art';

/** La pausa de movimiento (B12) con su rutina y su fondo; `n` = número de pausa, para no repetir siempre la misma. */
export function MovementBreakScreen({ n, lang, onDone }: { n: number; lang: MathLang; onDone: () => void }) {
  const r = routineFor(n);
  return (
    <MovementBreak
      kicker={MOVEMENT_COPY.kicker[lang]}
      title={r.title[lang]}
      steps={[r.steps[0][lang], r.steps[1][lang], r.steps[2][lang]]}
      seconds={MOVEMENT_SECONDS}
      secondsLabel={MOVEMENT_COPY.seconds[lang]}
      doneLabel={MOVEMENT_COPY.stepDone[lang]}
      backLabel={MOVEMENT_COPY.back[lang]}
      background={MATH_BACKGROUNDS.numberLine.horizontal}
      onDone={onDone}
    />
  );
}

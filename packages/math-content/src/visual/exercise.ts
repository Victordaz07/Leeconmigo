/**
 * Estado de UN ejercicio visual (documentación §7). Separa:
 * - la fase de resolución (working → reviewing → solved / revealed),
 * - el gesto temporal (`selected`: la galleta tocada que espera su destino),
 * - el registro de ayudas e intentos, que deshacer o empezar de nuevo NUNCA borran.
 *
 * Cambiar de idioma no pasa por aquí: el estado no tiene texto, así que el trabajo se conserva.
 */
import type { MathAttempt } from '../mastery.ts';
import { applyWorkAction, evaluateVisual, initialWork, solutionWork } from './evaluate.ts';
import type { Evaluation, VisualInstance, VisualWork, WorkAction } from './model.ts';

export type ExercisePhase = 'working' | 'reviewing' | 'solved' | 'revealed';

export interface ExerciseState {
  instance: VisualInstance;
  work: VisualWork;
  /** Trabajos anteriores para "Deshacer" (solo cambios del modelo, no de las casillas). */
  history: VisualWork[];
  phase: ExercisePhase;
  /** Veredicto de la última comprobación; se retira en cuanto el niño cambia algo. */
  evaluation: Evaluation | null;
  selected: string | null;
  /** Escalón de ayuda abierto (0 = ninguno). */
  hintLevel: 0 | 1 | 2 | 3;
  /** Primera comprobación con veredicto matemático (correcto/no): la que cuenta como evidencia. */
  firstCheck: { correct: boolean; hintLevel: number } | null;
  /** Comprobaciones con veredicto "revisa esto" (para ofrecer "Ver solución" sin esperar a la ayuda 3). */
  misses: number;
}

export type ExerciseAction =
  | { type: 'work'; action: WorkAction }
  | { type: 'select'; token: string | null }
  | { type: 'undo' }
  | { type: 'reset' }
  | { type: 'hint' }
  | { type: 'submit' }
  | { type: 'reveal' };

const HISTORY_LIMIT = 50;

export function startExercise(instance: VisualInstance): ExerciseState {
  return { instance, work: initialWork(instance.model), history: [], phase: 'working', evaluation: null, selected: null, hintLevel: 0, firstCheck: null, misses: 0 };
}

/** ¿Ya puede ver la solución? Tras la tercera ayuda o tras dos intentos que había que revisar. */
export const canReveal = (s: ExerciseState) => s.phase !== 'solved' && s.phase !== 'revealed' && (s.hintLevel >= 3 || s.misses >= 2);

export function exerciseReducer(s: ExerciseState, a: ExerciseAction): ExerciseState {
  const done = s.phase === 'solved' || s.phase === 'revealed';
  switch (a.type) {
    case 'work': {
      if (done) return s;
      const work = applyWorkAction(s.instance.model, s.work, a.action);
      if (work === s.work) return s;
      const modelChange = a.action.type !== 'setValue';
      return {
        ...s,
        work,
        history: modelChange ? [...s.history, s.work].slice(-HISTORY_LIMIT) : s.history,
        selected: a.action.type === 'place' ? null : s.selected,
        phase: 'working',
        evaluation: null,
      };
    }
    case 'select':
      return done ? s : { ...s, selected: s.selected === a.token ? null : a.token };
    case 'undo': {
      if (done || !s.history.length) return s;
      // Deshacer cambia el modelo pero conserva lo escrito en las casillas.
      const prev = s.history[s.history.length - 1];
      return { ...s, work: { ...prev, values: s.work.values } as VisualWork, history: s.history.slice(0, -1), selected: null, phase: 'working', evaluation: null };
    }
    case 'reset':
      return done ? s : { ...s, work: initialWork(s.instance.model), history: [...s.history, s.work].slice(-HISTORY_LIMIT), selected: null, phase: 'working', evaluation: null };
    case 'hint':
      return done ? s : { ...s, hintLevel: Math.min(3, s.hintLevel + 1) as ExerciseState['hintLevel'] };
    case 'submit': {
      if (done) return s;
      const evaluation = evaluateVisual(s.instance.model, s.work);
      if (evaluation.outcome === 'invalid') return { ...s, evaluation };
      const verdict = evaluation.outcome === 'correct' || evaluation.outcome === 'incorrect';
      return {
        ...s,
        evaluation,
        selected: null,
        phase: evaluation.outcome === 'correct' ? 'solved' : 'reviewing',
        firstCheck: s.firstCheck ?? (verdict ? { correct: evaluation.outcome === 'correct', hintLevel: s.hintLevel } : null),
        misses: s.misses + (evaluation.outcome === 'incorrect' ? 1 : 0),
      };
    }
    case 'reveal':
      if (done) return s;
      return { ...s, work: solutionWork(s.instance.model), phase: 'revealed', selected: null, evaluation: evaluateVisual(s.instance.model, solutionWork(s.instance.model)) };
  }
}

/**
 * Lo que se guarda para dominio y repaso cuando el ejercicio termina. Ver la solución cuenta como "lo veo luego" (vuelve
 * en el repaso), nunca como fallo.
 */
export function exerciseAttempt(s: ExerciseState, day: string): MathAttempt | null {
  if (s.phase !== 'solved' && s.phase !== 'revealed') return null;
  const first = s.firstCheck;
  return {
    skillId: s.instance.skillId,
    variantId: s.instance.instanceId,
    day,
    firstCorrect: s.phase === 'solved' && !!first?.correct,
    maxHintLevel: (first?.correct ? first.hintLevel : s.hintLevel) as MathAttempt['maxHintLevel'],
    skipped: s.phase === 'revealed',
    constructed: true,
  };
}

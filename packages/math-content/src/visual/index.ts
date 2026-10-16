export * from './model.ts';
export { buildVisualSession, generateVisual, GENERATOR_VERSION, intRng, modelProblems, VISUAL_TEMPLATES, visualTemplateById } from './templates.ts';
export type { IntRng, VisualTemplate } from './templates.ts';
export { answerFields, applyWorkAction, evaluateVisual, groupCapacity, initialWork, MAX_FIELD_DIGITS, parallelExample, sharingCounts, solutionWork } from './evaluate.ts';
export { canReveal, exerciseAttempt, exerciseReducer, startExercise } from './exercise.ts';
export type { ExerciseAction, ExercisePhase, ExerciseState } from './exercise.ts';

export { copy } from './copy.ts';
export type { FeedbackSet, UiCopy } from './copy.ts';
export { defaultPrefs, DAILY_GOAL_PRESETS, DEFAULT_DAILY_GOAL_MINUTES } from './types.ts';
export type { ReaderPrefs } from './types.ts';
export { cleanWord, currentLineOf, deriveReadingView, FAST_WPM, readingMinutes, readingMinutesOfWordCount, SLOW_WPM, wordMark } from './view-model.ts';
export type { MicTone, ReadingView, ReadingViewInput, WordMark } from './view-model.ts';
export { bestFontSize, fitText, isBalloonPage, measureWordEm, TEXT_LINE_HEIGHT, TEXT_PARAGRAPH_GAP, TEXT_WIDTH_SAFETY, TEXT_WORD_GAP } from './text-fit.ts';
export type { TextFit, TextFitInput, TextRow } from './text-fit.ts';
export { NOTEBOOK_TABS, progressSegments, subjectById, SUBJECTS } from './subjects.ts';
export type { Subject, SubjectId } from './subjects.ts';
export { effortReason, effortStars, ENERGY_OPTIONS, energyOption, FOCUS_FACES, KITE_SECONDS_PER_METER, kiteMeters } from './effort.ts';
export type { EffortInput, Energy, EnergyOption, FocusSelfReport } from './effort.ts';
export { GATE_COPY, gateKey, gateMessage, gateSubmit, isCompletePin, isLocked, MAX_PIN_ATTEMPTS, PIN_LENGTH, PIN_LOCK_SECONDS, startGate } from './pin.ts';
export type { GateLang, GateMessage, GatePhase, GateState, PinKey } from './pin.ts';
export { columnsFor, itemWidth, layoutFor, PHONE_MAX_SHORT_SIDE } from './layout.ts';
export type { Layout, NavStyle } from './layout.ts';
export { MATH_COPY } from './math-copy.ts';
export type { MathLang } from './math-copy.ts';
export { containerName, nounsOf, tokenName, VISUAL_COPY, visualEquation, visualFeedback, visualFieldLabel, visualHint, visualHowTo, visualPrompt } from './math-visual-copy.ts';
export type { GroupsTheme, SharingTheme } from './math-visual-nouns.ts';
export type { VisualCopyModel } from './math-visual-copy.ts';
export { fruitName, timeText, TOPIC_COPY } from './math-visual-copy-2.ts';
export type { BarItem, FruitName, VisualCopyModel2 } from './math-visual-copy-2.ts';
export { MOVEMENT_COPY, MOVEMENT_EVERY_MS, MOVEMENT_ROUTINES, MOVEMENT_SECONDS, movementStep, routineFor } from './movement.ts';
export type { MovementRoutine } from './movement.ts';

// ---- Ciencia: lo edita solo la cuenta de Ciencia (docs/14) ----
export * from './ciencia/index.ts';

// ---- Sociedad: lo edita solo la cuenta de Sociedad (docs/14) ----
export * from './sociedad/index.ts';

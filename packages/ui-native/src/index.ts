export * from './tokens.ts';
export { Button } from './components/button.tsx';
export { Card } from './components/card.tsx';
export { GradientView } from './components/gradient-view.tsx';
export { gradientPoints } from './gradient-points.ts';
export { ChevronLeftIcon, GearIcon, HelpIcon, HomeIcon, KiteIcon, MicIcon, MicOffIcon, SpeakerIcon, TrophyIcon } from './components/icons.tsx';
export { MicBadge } from './components/mic-badge.tsx';
export type { MicTone } from '@lee-conmigo/ui-core';
export { useReducedMotion } from './components/use-reduced-motion.ts';
export { CoachBar } from './components/coach-bar.tsx';
export { HelpSheet } from './components/help-sheet.tsx';
export { ReadingText } from './components/reading-text.tsx';
export { wordStyle } from './components/word-style.ts';
export { RoundButton } from './components/round-button.tsx';
export { BalloonText, DEFAULT_MAX_FONT_PX, MIN_FONT_SCREEN_PX } from './components/balloon-text.tsx';
export { ComicPage } from './components/comic-page.tsx';
export { NavRail, navRailWidth, type NavRailItem } from './components/nav-rail.tsx';
export { NotebookCover } from './components/notebook-cover.tsx';
export { SessionPhases, type Phase } from './components/session-phases.tsx';
export { StatChip } from './components/stat-chip.tsx';
export { SubjectTab } from './components/subject-tab.tsx';
export { CoachBubble } from './components/coach-bubble.tsx';
export { DialogCard } from './components/dialog-card.tsx';
export { FocusReadingBar, ReadingRail } from './components/reading-rail.tsx';
export { MovementBreak } from './components/movement-break.tsx';
export { ClosingCard, type ClosingStat } from './components/closing-card.tsx';
export { PinPad } from './components/pin-pad.tsx';
export { useLayout } from './components/use-layout.ts';
export { ArrayGrid, EqualGroups, TapeDiagram } from './components/math/models.tsx';
export { ConfidencePicker, HintLadder, NumericKeypad, PhaseTabs } from './components/math/practice.tsx';
export { PairsGame } from './components/math/pairs-game.tsx';
export { ContainerArt, CookieIcon, FILL_IMAGE, ItemIcon, manip, MathArtProvider, SeedIcon, SproutIcon, useContainerArt, useMathArt } from './components/math-visual/objects.tsx';
export type { CountContainer, CountItem, MathArt } from './components/math-visual/objects.tsx';
export { GardenPlots, SharingBoard, TenFrameBoard } from './components/math-visual/scenes.tsx';
export type { SharingToken } from './components/math-visual/scenes.tsx';
export { AnswerBoxes, DigitPad } from './components/math-visual/answers.tsx';
export type { AnswerBox } from './components/math-visual/answers.tsx';
export { AreaBoard, BarChartBoard, BarModelBoard, ClockBoard, CoordBoard, FractionBoard, NumberLineBoard, PlaceValueBoard, RatioBoard } from './components/math-visual/scenes-2.tsx';
export type { BarRow, PlaceValueLabels } from './components/math-visual/scenes-2.tsx';

// ---- Ciencia: lo edita solo la cuenta de Ciencia (docs/14) ----
export * from './components/ciencia/index.ts';

// ---- Sociedad: lo edita solo la cuenta de Sociedad (docs/14) ----
export * from './components/sociedad/index.ts';

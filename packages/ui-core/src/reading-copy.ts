import { copy, type FeedbackSet } from './copy.ts';
import type { InterfaceLanguage } from './interface-language.ts';

const feedback: FeedbackSet = {
  start: 'Start reading when you are ready.', listen: 'I’m listening…', good: 'You’re doing well. Keep reading.',
  short: 'Take your time.', long: 'Would you like a hint?', uncertain: 'Let’s try again, slowly.',
  incorrect: word => `Let’s listen to “${word}”.`, repeated: 'Keep going.', skipped: word => `Tap “${word}” to hear it.`,
  praise: 'Well done.', help: 'Read it one syllable at a time.', done: 'Page complete!', echo: 'Listen to the beginning…',
  echoDone: word => `Your turn: continue from “${word}”.`, review: 'Let’s practise your words.',
};
const english = {
  ...copy,
  feedback: { explorador: feedback, lector: feedback },
  mic: { echo: 'My turn', done: 'Finished!', help: 'Word help', longPause: 'Take your time', shortPause: 'Paused', waiting: 'Ready to listen', listening: 'Listening' },
  prep: {
    title: { explorador: 'Let’s read!', lector: 'Ready to read?' },
    tips: {
      explorador: [{ icon: '1', text: 'Read aloud, slowly and calmly.', color: '#DCEBFF' }, { icon: '2', text: 'The app listens and helps you.', color: '#D6F3E1' }, { icon: '3', text: 'Tap any word when you need help.', color: '#FFF1B8' }, { icon: '★', text: 'You can do this!', color: '#FFE3D2' }],
      lector: [{ icon: '1', text: 'Read aloud at your own pace.', color: '#DCEBFF' }, { icon: '2', text: 'I follow your reading word by word.', color: '#D6F3E1' }, { icon: '3', text: 'Tap any word for help.', color: '#FFF1B8' }, { icon: '4', text: 'Finish with a little word practice.', color: '#EDE8FF' }],
    }, start: 'Start reading', freeTip: 'When you finish a page, tap › to continue. Tap ‹ to go back.',
  },
  reading: {
    story: 'Story', help: 'Help', listen: 'Listen', hint: 'Hint', readStart: 'Read me the beginning',
    pauseText: { explorador: 'Need help? Tap a word or keep reading.', lector: 'Need a hint? Tap a word or keep reading.' },
    readStartButton: '▸ Read me the beginning', helpWith: (word: string) => `Help me with “${word}”`,
    frameLabel: (n: number, total: number) => `Frame ${n} of ${total}`,
    sentenceOf: (n: number, total: number) => `Sentence ${n} of ${total}`, showStory: 'Show story', hideStory: 'Hide story', elapsed: (time: string) => `Reading time ${time}`,
  },
  help: {
    defaultDef: { explorador: 'Listen, then read it with me, one syllable at a time.', lector: 'Break it into syllables and read it aloud.' },
    synonym: (word: string) => `  Similar word: ${word}.`, example: (sentence: string) => `  For example: ${sentence}`,
    listenAgain: '▸ Listen again', listenWord: 'Hear the word', done: 'I can do it!', inDrawing: 'in the picture',
  },
  pageDone: { title: 'Page complete!', pagesOf: (n: number, total: number) => `${n} of ${total} pages` },
  question: { label: (n: number) => `Question ${n}`, continue: 'Continue' },
  review: { chip: 'Word practice', count: (n: number, total: number) => `Word ${n} of ${total}`, titleKid: 'Build the word', titleTeen: 'Order the syllables', listen: 'Hear the word', doneKid: 'You built it!', doneTeen: 'You got it.', wrongKid: 'That comes later. Try another one.', wrongTeen: 'That comes later.', next: 'Next', finish: 'Finish', defaultDef: 'A word you practised today.' },
  states: { pauseTitle: 'Take your time. Keep reading when you’re ready!', pauseMessage: 'The timer is paused. Nothing is lost.', pauseStop: 'Done for today', pauseContinue: 'Keep reading', voiceTitle: 'I need to hear you to help with your reading.', voiceMessage: 'An adult needs to give permission. You can use the reading button for now.', voiceUnavailableMessage: 'I cannot listen on this device. You can use the reading button.', voiceAskAdult: 'Ask an adult for permission', voiceFreeReading: 'Read with the button', keepReading: 'Keep reading', nextPage: 'Next page', freeHint: 'Read the page and tap › to continue (‹ to go back).' },
};

export const readingCopy = (language: InterfaceLanguage) => language === 'en' ? english : copy;

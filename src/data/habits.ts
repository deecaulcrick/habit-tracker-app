import type { Accent } from '@/constants/theme';

export type HabitTemplate = {
  name: string;
  emoji: string;
  accent: Accent;
  identity: string;
  target: number;
  unit: string;
};

/** Identity-first habit starters, à la "Atomic Habits". */
export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    name: 'Drink water',
    emoji: '💧',
    accent: 'sky',
    identity: 'I am someone who stays hydrated',
    target: 8,
    unit: 'glasses',
  },
  {
    name: 'Hit my protein',
    emoji: '🍗',
    accent: 'tangerine',
    identity: 'I fuel my body well',
    target: 1,
    unit: 'time',
  },
  { name: 'Eat veggies', emoji: '🥦', accent: 'mint', identity: 'I eat the rainbow', target: 3, unit: 'servings' },
  {
    name: 'Morning walk',
    emoji: '🌤️',
    accent: 'lemon',
    identity: 'I am a person who moves daily',
    target: 1,
    unit: 'walk',
  },
  {
    name: 'Log my meals',
    emoji: '📝',
    accent: 'grape',
    identity: 'I am mindful of what I eat',
    target: 3,
    unit: 'meals',
  },
  {
    name: 'No late snacks',
    emoji: '🌙',
    accent: 'grape',
    identity: 'My kitchen closes after dinner',
    target: 1,
    unit: 'time',
  },
  { name: 'Sleep 8 hours', emoji: '😴', accent: 'sky', identity: 'I am well rested', target: 1, unit: 'night' },
  {
    name: 'Workout',
    emoji: '🏋️',
    accent: 'tomato',
    identity: 'I am an athlete in training',
    target: 1,
    unit: 'session',
  },
  {
    name: 'Skip sugary drinks',
    emoji: '🚫',
    accent: 'bubblegum',
    identity: 'I drink what serves me',
    target: 1,
    unit: 'time',
  },
  { name: 'Stretch', emoji: '🧘', accent: 'mint', identity: 'I take care of my body', target: 1, unit: 'session' },
  { name: 'Weigh in', emoji: '⚖️', accent: 'lemon', identity: 'I track my progress', target: 1, unit: 'time' },
  { name: 'Eat slowly', emoji: '🐢', accent: 'tangerine', identity: 'I savour every bite', target: 3, unit: 'meals' },
];

export const HABIT_EMOJIS = [
  '💧',
  '🥦',
  '🍎',
  '🍗',
  '🥗',
  '🏃',
  '🚶',
  '🏋️',
  '🧘',
  '😴',
  '🌙',
  '📝',
  '⚖️',
  '🚫',
  '🍵',
  '☀️',
  '🧠',
  '❤️',
  '🦷',
  '📵',
  '🐢',
  '🎯',
  '🔥',
  '✨',
];

export const GOAL_EMOJIS = ['🎯', '⚖️', '👗', '🏖️', '💪', '🏃', '❤️', '🌱', '🏆', '⭐', '🎉', '🧘'];

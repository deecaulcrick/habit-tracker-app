export type CardioType = {
  id: string;
  name: string;
  emoji: string;
  met: number;
  hasDistance: boolean;
};

/** MET values from the Compendium of Physical Activities (moderate effort). */
export const CARDIO: CardioType[] = [
  { id: 'walk', name: 'Walk', emoji: '🚶', met: 3.5, hasDistance: true },
  { id: 'brisk-walk', name: 'Brisk walk', emoji: '🏃‍♀️', met: 4.3, hasDistance: true },
  { id: 'run', name: 'Run', emoji: '🏃', met: 9.8, hasDistance: true },
  { id: 'cycle', name: 'Cycling', emoji: '🚴', met: 7.5, hasDistance: true },
  { id: 'swim', name: 'Swimming', emoji: '🏊', met: 7, hasDistance: true },
  { id: 'hiit', name: 'HIIT', emoji: '⚡', met: 8, hasDistance: false },
  { id: 'elliptical', name: 'Elliptical', emoji: '🌀', met: 5, hasDistance: false },
  { id: 'row', name: 'Rowing', emoji: '🚣', met: 7, hasDistance: true },
  { id: 'dance', name: 'Dance', emoji: '💃', met: 5.5, hasDistance: false },
  { id: 'jump-rope', name: 'Jump rope', emoji: '🪢', met: 11, hasDistance: false },
  { id: 'stairs', name: 'Stair climber', emoji: '🪜', met: 9, hasDistance: false },
  { id: 'hike', name: 'Hike', emoji: '🥾', met: 6, hasDistance: true },
  { id: 'yoga', name: 'Yoga', emoji: '🧘', met: 2.5, hasDistance: false },
  { id: 'pilates', name: 'Pilates', emoji: '🤸', met: 3, hasDistance: false },
];

export type StrengthExercise = { id: string; name: string; emoji: string; group: string };

export const STRENGTH: StrengthExercise[] = [
  { id: 'squat', name: 'Squat', emoji: '🦵', group: 'Legs' },
  { id: 'lunge', name: 'Lunges', emoji: '🦵', group: 'Legs' },
  { id: 'deadlift', name: 'Deadlift', emoji: '🏋️', group: 'Back' },
  { id: 'rdl', name: 'Romanian deadlift', emoji: '🏋️', group: 'Legs' },
  { id: 'hip-thrust', name: 'Hip thrust', emoji: '🍑', group: 'Glutes' },
  { id: 'bench', name: 'Bench press', emoji: '💪', group: 'Chest' },
  { id: 'pushup', name: 'Push-ups', emoji: '💪', group: 'Chest' },
  { id: 'ohp', name: 'Shoulder press', emoji: '🙆', group: 'Shoulders' },
  { id: 'row', name: 'Dumbbell row', emoji: '🚣', group: 'Back' },
  { id: 'pullup', name: 'Pull-ups', emoji: '🧗', group: 'Back' },
  { id: 'lat', name: 'Lat pulldown', emoji: '⬇️', group: 'Back' },
  { id: 'curl', name: 'Bicep curl', emoji: '💪', group: 'Arms' },
  { id: 'tricep', name: 'Tricep dips', emoji: '🔻', group: 'Arms' },
  { id: 'plank', name: 'Plank', emoji: '🧱', group: 'Core' },
  { id: 'crunch', name: 'Crunches', emoji: '🔥', group: 'Core' },
  { id: 'kb-swing', name: 'Kettlebell swing', emoji: '🔔', group: 'Full body' },
  { id: 'burpee', name: 'Burpees', emoji: '🐸', group: 'Full body' },
];

/** Resistance training, general effort. */
export const STRENGTH_MET = 5;

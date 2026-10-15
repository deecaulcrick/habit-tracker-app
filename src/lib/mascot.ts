import type { Mood } from '@/components/Mascot';

type Ctx = {
  name: string;
  hour: number;
  eaten: number;
  target: number;
  habitPct: number | null;
  fasting: boolean;
  steps: number;
  stepGoal: number;
  workedOut: boolean;
  isToday: boolean;
};

const pick = <T>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];

/** Mochi reads the day and picks a mood + something encouraging to say. */
export function mascotSays(c: Ctx): { mood: Mood; line: string } {
  const seed = new Date().getDate() + c.hour;
  const n = c.name || 'friend';

  if (!c.isToday) {
    return { mood: 'chill', line: 'Looking back? Every day you showed up counts. 📖' };
  }
  if (c.habitPct === 1) {
    return {
      mood: 'excited',
      line: pick(
        [
          `Every habit done! You're on fire, ${n}! 🔥`,
          'Perfect day! Mochi is doing a happy wiggle!',
          'All atoms complete. Tiny wins, big change ✨',
        ],
        seed
      ),
    };
  }
  if (c.eaten > c.target * 1.1) {
    return { mood: 'worried', line: 'A bit over today. No stress — a walk helps and tomorrow is fresh! 🌱' };
  }
  if (c.fasting) {
    return {
      mood: c.hour >= 21 || c.hour < 6 ? 'sleepy' : 'chill',
      line: pick(
        [
          'Fasting strong! Sip some water or tea 🍵',
          'You got this. Hunger comes in waves — ride it out 🌊',
          'Fasting mode: on. Mochi believes in you!',
        ],
        seed
      ),
    };
  }
  if (c.hour >= 22 || c.hour < 5) {
    return { mood: 'sleepy', line: 'Sleep is a superpower for fat loss. Night night 😴' };
  }
  if (c.workedOut && c.steps >= c.stepGoal) {
    return { mood: 'proud', line: `Workout AND step goal? Legendary, ${n}! 💪` };
  }
  if (c.eaten === 0 && c.hour >= 11) {
    return { mood: 'hungry', line: "Psst… nothing logged yet. What's on the menu? 🍽️" };
  }
  if (c.steps >= c.stepGoal) {
    return { mood: 'proud', line: 'Step goal smashed! Your legs are heroes 👟' };
  }
  if (c.hour < 12) {
    return {
      mood: 'happy',
      line: pick(
        [
          `Morning, ${n}! Let's stack some tiny wins today ☀️`,
          'New day, new atoms to fill! Start with a glass of water 💧',
          'Rise and shine! What habit will you crush first?',
        ],
        seed
      ),
    };
  }
  if ((c.habitPct ?? 0) >= 0.5) {
    return { mood: 'happy', line: 'Over halfway through your habits. Keep rolling! 🛼' };
  }
  return {
    mood: 'happy',
    line: pick(
      [
        'Small steps, every day. That is the whole secret 🌱',
        "You don't need perfect — just consistent 💜",
        'A 10-minute walk after meals works wonders 🚶',
      ],
      seed
    ),
  };
}

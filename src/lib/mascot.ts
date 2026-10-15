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

export type MascotLine = { mood: Mood; line: string; emoji: string };

const pick = <T>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];

/** Mochi reads the day and picks a mood, something encouraging to say, and an emoji. */
export function mascotSays(c: Ctx): MascotLine {
  const seed = new Date().getDate() + c.hour;
  const n = c.name || 'friend';

  if (!c.isToday) {
    return { mood: 'chill', line: 'Looking back? Every day you showed up counts.', emoji: '📖' };
  }
  if (c.habitPct === 1) {
    return pick<MascotLine>(
      [
        { mood: 'excited', line: `Every habit done! You're on fire, ${n}!`, emoji: '🔥' },
        { mood: 'excited', line: 'Perfect day! Mochi is doing a happy wiggle!', emoji: '🥳' },
        { mood: 'excited', line: 'All atoms complete. Tiny wins, big change.', emoji: '✨' },
      ],
      seed
    );
  }
  if (c.eaten > c.target * 1.1) {
    return { mood: 'worried', line: 'A bit over today. No wahala, a walk helps and tomorrow is fresh!', emoji: '🌱' };
  }
  if (c.fasting) {
    return pick<MascotLine>(
      [
        { mood: 'chill', line: 'Fasting strong! Sip water, zobo (no sugar) or tea.', emoji: '🍵' },
        { mood: 'chill', line: 'Hunger comes in waves. Ride it out, you got this!', emoji: '🌊' },
        {
          mood: c.hour >= 21 || c.hour < 6 ? 'sleepy' : 'chill',
          line: 'Fasting mode: on. Mochi believes in you!',
          emoji: '💪',
        },
      ],
      seed
    );
  }
  if (c.hour >= 22 || c.hour < 5) {
    return { mood: 'sleepy', line: 'Sleep is a superpower for fat loss. Night night!', emoji: '😴' };
  }
  if (c.workedOut && c.steps >= c.stepGoal) {
    return { mood: 'proud', line: `Workout AND step goal? Legendary, ${n}!`, emoji: '🏆' };
  }
  if (c.eaten === 0 && c.hour >= 11) {
    return { mood: 'hungry', line: 'Psst… nothing logged yet. Wetin you chop today?', emoji: '🍲' };
  }
  if (c.steps >= c.stepGoal) {
    return { mood: 'proud', line: 'Step goal smashed! Your legs are heroes.', emoji: '👟' };
  }
  if (c.hour < 12) {
    return pick<MascotLine>(
      [
        { mood: 'happy', line: `Good morning, ${n}! Let's stack some tiny wins today.`, emoji: '☀️' },
        { mood: 'happy', line: 'Abeg start with a glass of water before anything else!', emoji: '💧' },
        { mood: 'happy', line: 'Rise and shine! Which habit are you crushing first?', emoji: '🌤️' },
      ],
      seed
    );
  }
  if ((c.habitPct ?? 0) >= 0.5) {
    return { mood: 'happy', line: 'Over halfway through your habits. Keep rolling!', emoji: '🛼' };
  }
  return pick<MascotLine>(
    [
      { mood: 'happy', line: 'Small steps, every day. That is the whole secret.', emoji: '🌱' },
      { mood: 'happy', line: 'Fist-sized swallow, plenty of soup and veggies. You go dey alright!', emoji: '🥬' },
      { mood: 'happy', line: 'A 10-minute walk after meals works wonders.', emoji: '🚶' },
    ],
    seed
  );
}

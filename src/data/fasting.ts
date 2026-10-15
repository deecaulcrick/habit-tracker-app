import type { Accent } from '@/constants/theme';

export type FastPlan = { id: string; name: string; fastHours: number; blurb: string; accent: Accent };

export const FAST_PLANS: FastPlan[] = [
  { id: '13', name: '13:11', fastHours: 13, blurb: 'Circadian rhythm. Great first step.', accent: 'mint' },
  { id: '16', name: '16:8', fastHours: 16, blurb: 'The classic. Skip breakfast or late snacks.', accent: 'grape' },
  { id: '18', name: '18:6', fastHours: 18, blurb: 'A tighter eating window.', accent: 'sky' },
  { id: '20', name: '20:4', fastHours: 20, blurb: 'Warrior style. One big meal plus a snack.', accent: 'tangerine' },
  { id: '23', name: 'OMAD', fastHours: 23, blurb: 'One meal a day.', accent: 'bubblegum' },
  { id: '36', name: '36h', fastHours: 36, blurb: 'Monk fast. For experienced fasters only.', accent: 'tomato' },
];

/** Rough, simplified stages: a motivating guide rather than medical advice. */
export const FAST_STAGES = [
  { at: 0, emoji: '🍽️', title: 'Digesting', body: 'Your body is processing your last meal.' },
  { at: 4, emoji: '📉', title: 'Blood sugar settling', body: 'Insulin is dropping back to baseline.' },
  { at: 8, emoji: '🔄', title: 'Switching fuel', body: 'Stored glycogen is being used up.' },
  { at: 12, emoji: '🔥', title: 'Fat-burning mode', body: 'Your body leans more on fat for energy.' },
  { at: 16, emoji: '✨', title: 'Deep fast', body: 'Ketone levels start to climb.' },
  { at: 24, emoji: '🧹', title: 'Cleanup crew', body: 'Cellular recycling (autophagy) ramps up.' },
];

export function stageFor(hours: number) {
  let s = FAST_STAGES[0];
  for (const st of FAST_STAGES) if (hours >= st.at) s = st;
  return s;
}

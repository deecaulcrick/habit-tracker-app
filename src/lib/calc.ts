export type Sex = 'female' | 'male';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type Units = 'metric' | 'imperial';

export const ACTIVITY: Record<ActivityLevel, { label: string; hint: string; factor: number }> = {
  sedentary: { label: 'Couch potato', hint: 'Desk job, little exercise', factor: 1.2 },
  light: { label: 'Light mover', hint: 'Walks, 1–3 workouts a week', factor: 1.375 },
  moderate: { label: 'Busy bee', hint: '3–5 workouts a week', factor: 1.55 },
  active: { label: 'Athlete', hint: 'Hard training most days', factor: 1.725 },
};

/** Mifflin-St Jeor resting energy. */
export function bmr(sex: Sex, kg: number, cm: number, age: number) {
  return Math.round(10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161));
}

export function tdee(sex: Sex, kg: number, cm: number, age: number, level: ActivityLevel) {
  return Math.round(bmr(sex, kg, cm, age) * ACTIVITY[level].factor);
}

/** ~7700 kcal per kg of body fat. */
export function dailyTarget(sex: Sex, kg: number, cm: number, age: number, level: ActivityLevel, weeklyLossKg: number) {
  const deficit = Math.round((weeklyLossKg * 7700) / 7);
  const floor = sex === 'male' ? 1500 : 1200;
  return Math.max(floor, Math.round((tdee(sex, kg, cm, age, level) - deficit) / 10) * 10);
}

/** Protein: ~1.6 g per kg of goal weight, a common target while losing fat. */
export function proteinTarget(goalKg: number) {
  return Math.round(goalKg * 1.6);
}

/** Calories burned from a MET value. */
export function metKcal(met: number, kg: number, minutes: number) {
  return Math.round(met * kg * (minutes / 60));
}

export function stepsKcal(steps: number, kg: number) {
  return Math.round(steps * 0.0005 * kg);
}

export function bmi(kg: number, cm: number) {
  const m = cm / 100;
  return kg / (m * m);
}

export const kgToLb = (kg: number) => kg * 2.20462;
export const lbToKg = (lb: number) => lb / 2.20462;
export const cmToFtIn = (cm: number) => {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
};
export const ftInToCm = (ft: number, inch: number) => (ft * 12 + inch) * 2.54;

export function fmtWeight(kg: number, units: Units, digits = 1) {
  return units === 'imperial' ? `${kgToLb(kg).toFixed(digits)} lb` : `${kg.toFixed(digits)} kg`;
}

export function weightUnit(units: Units) {
  return units === 'imperial' ? 'lb' : 'kg';
}

export function toDisplayWeight(kg: number, units: Units) {
  return units === 'imperial' ? kgToLb(kg) : kg;
}

export function fromDisplayWeight(v: number, units: Units) {
  return units === 'imperial' ? lbToKg(v) : v;
}

/** XP → level. Each level needs a bit more than the last. */
export function levelFromXp(xp: number) {
  let level = 1;
  let need = 100;
  let rest = xp;
  while (rest >= need) {
    rest -= need;
    level += 1;
    need = Math.round(need * 1.25);
  }
  return { level, into: rest, need };
}

export const XP = {
  food: 5,
  water: 2,
  habit: 10,
  workout: 25,
  weight: 15,
  fastComplete: 60,
} as const;

export function fmtHeight(cm: number, units: Units) {
  if (units === 'metric') return `${Math.round(cm)} cm`;
  const { ft, inch } = cmToFtIn(cm);
  return `${ft}′${inch}″`;
}

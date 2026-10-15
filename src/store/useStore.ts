import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Accent } from '@/constants/theme';
import type { Food } from '@/data/foods';
import type { MealSlot } from '@/data/meals';
import type { ActivityLevel, Sex, Units } from '@/lib/calc';
import { XP, fmtWeight } from '@/lib/calc';
import { addDays, dateKey, todayKey } from '@/lib/date';
import { uid } from '@/lib/id';

export type Profile = {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  startWeightKg: number;
  goalWeightKg: number;
  activity: ActivityLevel;
  weeklyLossKg: number;
  units: Units;
  calorieTarget: number;
  proteinTarget: number;
  stepGoal: number;
  mascotColor: Accent;
  fastPlanId: string;
  startedAt: string;
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  accent: Accent;
  identity: string;
  target: number;
  unit: string;
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  goalId?: string;
  createdAt: string;
};

export type Goal = {
  id: string;
  title: string;
  emoji: string;
  accent: Accent;
  why: string;
  deadline?: string;
  createdAt: string;
  achievedAt?: string;
};

export type FoodEntry = {
  id: string;
  date: string;
  meal: MealSlot;
  name: string;
  emoji: string;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  at: number;
};

export type StrengthSet = { reps: number; kg: number };

export type Workout = {
  id: string;
  date: string;
  kind: 'cardio' | 'strength';
  typeId: string;
  name: string;
  emoji: string;
  minutes: number;
  distanceKm?: number;
  sets?: StrengthSet[];
  kcal: number;
  at: number;
};

export type WeightEntry = { date: string; kg: number };

export type Fast = { id: string; start: number; end?: number; targetHours: number };

type State = {
  profile: Profile | null;
  habits: Habit[];
  /** date → habitId → count */
  habitLogs: Record<string, Record<string, number>>;
  goals: Goal[];
  foods: FoodEntry[];
  customFoods: Food[];
  workouts: Workout[];
  /** Manually logged steps per day (added on top of the pedometer). */
  manualSteps: Record<string, number>;
  /** Last pedometer reading per day, cached so history survives. */
  sensorSteps: Record<string, number>;
  weights: WeightEntry[];
  activeFast: Fast | null;
  fasts: Fast[];
  xp: number;
  celebrate: { id: string; title: string; body: string } | null;
};

type Actions = {
  completeOnboarding: (p: Profile, habits: Omit<Habit, 'id' | 'createdAt'>[]) => void;
  updateProfile: (p: Partial<Profile>) => void;

  saveHabit: (h: Omit<Habit, 'id' | 'createdAt'> & { id?: string }) => void;
  deleteHabit: (id: string) => void;
  tapHabit: (id: string, date: string) => void;
  resetHabit: (id: string, date: string) => void;

  saveGoal: (g: Omit<Goal, 'id' | 'createdAt'> & { id?: string }) => string;
  deleteGoal: (id: string) => void;
  toggleGoalAchieved: (id: string) => void;

  addFood: (e: Omit<FoodEntry, 'id' | 'at'>) => void;
  removeFood: (id: string) => void;
  saveCustomFood: (f: Omit<Food, 'id'>) => Food;

  addWorkout: (w: Omit<Workout, 'id' | 'at'>) => void;
  removeWorkout: (id: string) => void;

  addManualSteps: (date: string, steps: number) => void;
  setSensorSteps: (date: string, steps: number) => void;

  logWeight: (kg: number, date?: string) => void;

  startFast: (targetHours: number, start?: number) => void;
  endFast: () => void;
  cancelFast: () => void;
  removeFast: (id: string) => void;

  dismissCelebrate: () => void;
  resetAll: () => void;
};

const initial: State = {
  profile: null,
  habits: [],
  habitLogs: {},
  goals: [],
  foods: [],
  customFoods: [],
  workouts: [],
  manualSteps: {},
  sensorSteps: {},
  weights: [],
  activeFast: null,
  fasts: [],
  xp: 0,
  celebrate: null,
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      completeOnboarding: (profile, habits) => {
        const now = todayKey();
        set({
          profile,
          habits: habits.map((h) => ({ ...h, id: uid(), createdAt: now })),
          weights: [{ date: now, kg: profile.startWeightKg }],
          goals: [
            {
              id: uid(),
              title: `Reach ${fmtWeight(profile.goalWeightKg, profile.units)}`,
              emoji: '⚖️',
              accent: 'grape',
              why: 'Feel lighter, stronger and more confident.',
              createdAt: now,
            },
          ],
        });
      },

      updateProfile: (p) => {
        const cur = get().profile;
        if (cur) set({ profile: { ...cur, ...p } });
      },

      saveHabit: ({ id, ...rest }) => {
        if (id) {
          set({ habits: get().habits.map((h) => (h.id === id ? { ...h, ...rest } : h)) });
        } else {
          set({ habits: [...get().habits, { ...rest, id: uid(), createdAt: todayKey() }] });
        }
      },

      deleteHabit: (id) => set({ habits: get().habits.filter((h) => h.id !== id) }),

      tapHabit: (id, date) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;
        const day = { ...(get().habitLogs[date] ?? {}) };
        const cur = day[id] ?? 0;
        // Tapping a finished habit wraps back to zero so mistakes are easy to undo.
        const next = cur >= habit.target ? 0 : cur + 1;
        day[id] = next;
        const finished = next === habit.target;
        const delta = next > cur ? (finished ? XP.habit : 1) : -(XP.habit + Math.max(0, cur - 1));
        set({
          habitLogs: { ...get().habitLogs, [date]: day },
          xp: Math.max(0, get().xp + delta),
        });
      },

      resetHabit: (id, date) => {
        const day = { ...(get().habitLogs[date] ?? {}) };
        delete day[id];
        set({ habitLogs: { ...get().habitLogs, [date]: day } });
      },

      saveGoal: ({ id, ...rest }) => {
        if (id) {
          set({ goals: get().goals.map((g) => (g.id === id ? { ...g, ...rest } : g)) });
          return id;
        }
        const newId = uid();
        set({ goals: [...get().goals, { ...rest, id: newId, createdAt: todayKey() }] });
        return newId;
      },

      deleteGoal: (id) =>
        set({
          goals: get().goals.filter((g) => g.id !== id),
          habits: get().habits.map((h) => (h.goalId === id ? { ...h, goalId: undefined } : h)),
        }),

      toggleGoalAchieved: (id) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return;
        const achieving = !goal.achievedAt;
        set({
          goals: get().goals.map((g) => (g.id === id ? { ...g, achievedAt: achieving ? todayKey() : undefined } : g)),
          xp: get().xp + (achieving ? 200 : -200),
          celebrate: achieving
            ? { id: uid(), title: 'Goal smashed!', body: `${goal.title}. Mochi is SO proud of you.` }
            : null,
        });
      },

      addFood: (e) => set({ foods: [...get().foods, { ...e, id: uid(), at: Date.now() }], xp: get().xp + XP.food }),
      removeFood: (id) => set({ foods: get().foods.filter((f) => f.id !== id) }),
      saveCustomFood: (f) => {
        const food: Food = { ...f, id: `custom-${uid()}` };
        set({ customFoods: [food, ...get().customFoods] });
        return food;
      },

      addWorkout: (w) =>
        set({ workouts: [...get().workouts, { ...w, id: uid(), at: Date.now() }], xp: get().xp + XP.workout }),
      removeWorkout: (id) => set({ workouts: get().workouts.filter((w) => w.id !== id) }),

      addManualSteps: (date, steps) => {
        const cur = get().manualSteps[date] ?? 0;
        set({ manualSteps: { ...get().manualSteps, [date]: Math.max(0, cur + steps) } });
      },
      setSensorSteps: (date, steps) => {
        if (get().sensorSteps[date] === steps) return;
        set({ sensorSteps: { ...get().sensorSteps, [date]: steps } });
      },

      logWeight: (kg, date = todayKey()) => {
        const others = get().weights.filter((w) => w.date !== date);
        const weights = [...others, { date, kg }].sort((a, b) => a.date.localeCompare(b.date));
        const p = get().profile;
        const hitGoal = p && kg <= p.goalWeightKg && !others.some((w) => w.kg <= p.goalWeightKg);
        set({
          weights,
          xp: get().xp + XP.weight,
          celebrate: hitGoal
            ? { id: uid(), title: 'Goal weight reached!', body: 'You did it! Time to set a new adventure.' }
            : get().celebrate,
        });
      },

      startFast: (targetHours, start = Date.now()) => set({ activeFast: { id: uid(), start, targetHours } }),

      endFast: () => {
        const f = get().activeFast;
        if (!f) return;
        const end = Date.now();
        const hours = (end - f.start) / 3_600_000;
        const success = hours >= f.targetHours;
        set({
          activeFast: null,
          fasts: [{ ...f, end }, ...get().fasts],
          xp: get().xp + (success ? XP.fastComplete : Math.round(hours * 2)),
          celebrate: success
            ? { id: uid(), title: 'Fast complete!', body: `${hours.toFixed(1)} hours. Mochi is doing a happy wiggle.` }
            : null,
        });
      },

      cancelFast: () => set({ activeFast: null }),
      removeFast: (id) => set({ fasts: get().fasts.filter((f) => f.id !== id) }),

      dismissCelebrate: () => set({ celebrate: null }),
      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'mochi-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ celebrate: _c, ...rest }) => rest,
    }
  )
);

/* ---------- Selectors & derived helpers ---------- */

export function habitScheduledOn(h: Habit, date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return h.days.includes(new Date(y, m - 1, d).getDay()) && date >= h.createdAt;
}

export function currentWeight(weights: WeightEntry[], fallback: number) {
  return weights.length ? weights[weights.length - 1].kg : fallback;
}

export function dayTotals(foods: FoodEntry[], date: string) {
  return foods
    .filter((f) => f.date === date)
    .reduce(
      (t, f) => ({
        kcal: t.kcal + f.kcal,
        protein: t.protein + f.protein,
        carbs: t.carbs + f.carbs,
        fat: t.fat + f.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
}

export function burnedOn(workouts: Workout[], date: string) {
  return workouts.filter((w) => w.date === date).reduce((n, w) => n + w.kcal, 0);
}

export function stepsOn(s: Pick<State, 'manualSteps' | 'sensorSteps'>, date: string) {
  return (s.sensorSteps[date] ?? 0) + (s.manualSteps[date] ?? 0);
}

/** Share of scheduled habit check-ins completed on a day (0–1), or null if none scheduled. */
export function dayCompletion(habits: Habit[], logs: State['habitLogs'], date: string) {
  const due = habits.filter((h) => habitScheduledOn(h, date));
  if (!due.length) return null;
  const done = due.filter((h) => (logs[date]?.[h.id] ?? 0) >= h.target).length;
  return done / due.length;
}

/** Consecutive days (ending today, or yesterday if today isn't finished yet) where every due habit was done. */
export function perfectStreak(habits: Habit[], logs: State['habitLogs']) {
  let day = todayKey();
  if (dayCompletion(habits, logs, day) !== 1) day = addDays(day, -1);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const c = dayCompletion(habits, logs, day);
    if (c === null) {
      if (habits.every((h) => h.createdAt > day)) break;
    } else if (c < 1) break;
    else streak++;
    day = addDays(day, -1);
  }
  return streak;
}

export function habitStreak(h: Habit, logs: State['habitLogs']) {
  let day = todayKey();
  if ((logs[day]?.[h.id] ?? 0) < h.target) day = addDays(day, -1);
  let streak = 0;
  for (let i = 0; i < 365 && day >= h.createdAt; i++) {
    if (habitScheduledOn(h, day)) {
      if ((logs[day]?.[h.id] ?? 0) >= h.target) streak++;
      else break;
    }
    day = addDays(day, -1);
  }
  return streak;
}

/** 0–1 consistency over the last `n` days for the given habits. */
export function consistency(habits: Habit[], logs: State['habitLogs'], n = 14) {
  let due = 0;
  let done = 0;
  for (let i = 0; i < n; i++) {
    const day = dateKey(new Date(Date.now() - i * 86_400_000));
    for (const h of habits) {
      if (!habitScheduledOn(h, day)) continue;
      due++;
      if ((logs[day]?.[h.id] ?? 0) >= h.target) done++;
    }
  }
  return due ? done / due : 0;
}

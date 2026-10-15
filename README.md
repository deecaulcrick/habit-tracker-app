# Mochi 🌱 — habits for weight loss

A fun, colourful habit tracker for weight loss, built with Expo + React Native. Your buddy **Mochi** (a squishy
rice-cake with a sprout) cheers you on, changes mood based on your day, and throws confetti when you hit a goal.

Inspired by the soft, pastel UI of Bite Pal and the identity-based "atoms" habits of Atoms. Built Nigeria-first:
the food database and meal ideas lead with everyday Nigerian food (jollof, swallows, soups, beans, suya, zobo…).

## Features

| Area | What you get |
| --- | --- |
| **Onboarding** | Name, body stats, current → goal weight, activity level, weekly pace. Calculates a daily calorie target (Mifflin-St Jeor TDEE minus a deficit) and protein target. Pick starter habits and Mochi's colour. |
| **Today** | Mochi + a contextual message, a week strip with daily habit rings, calories eaten / burned / left with macro bars, quick cards for steps, fasting, weight and workouts. |
| **Habits ("atoms")** | Identity-based habits ("I am someone who…"), multi-count habits (e.g. 8 glasses of water) shown as orbiting dots, scheduled days, per-habit streaks and a perfect-day streak. Tap to check in, long-press to edit. |
| **Goals** | Create goals with a why, emoji, colour and deadline, link habits to them and track 14-day consistency. Mark achieved for a celebration. |
| **Food** | Diary by meal and a ~150-item food database, Nigerian staples first (rice dishes, swallows, soups & stews, beans, proteins, snacks, fruit, drinks), then common international foods. Search, categories, recents, servings, custom foods and quick-add. Weekly calorie chart vs target. |
| **Meal ideas** | Lighter takes on Nigerian favourites (egusi with a fist-sized eba, efo riro & fish, beans & air-fried dodo, pepper soup…) with ingredients and method, tag filters, and an auto-built Nigerian day plan that fits your calorie target. Log any recipe in one tap. |
| **Move** | Step counting from the phone's pedometer (iOS Core Motion / Android step counter) plus manual adds. Log cardio (MET-based calorie estimates, intensity, distance) and strength (sets × reps × weight, with "last time" hints). |
| **Fasting** | 13:11, 16:8, 18:6, 20:4, OMAD and 36h plans, live timer ring, back-dating, fasting stages, history and stats. |
| **Me** | Level & XP, mascot colour picker, weight journey with a trend chart, goals, habit list, editable targets, metric / imperial. |

All data is stored on the device (AsyncStorage). There's no account or backend.

## Illustrations

- **3D emoji** come from [Fluent Emoji 3D](https://github.com/microsoft/fluentui-emoji) (MIT). Only the ones the app
  uses are bundled into `assets/emoji/`. After adding a new emoji anywhere in `src/`, run `npm run emoji`.
- **Nigerian dishes** that have no emoji (jollof, eba, egusi, efo riro, okra, banga, dodo, abacha…) are hand-drawn SVG
  illustrations in `src/components/FoodArt.tsx`. Use them with `emoji: 'art:<id>'` in the data files.

## Run it

```bash
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator) or `w` (web), or scan the QR code with **Expo Go**.

> Step counting needs a real device. Web and simulators fall back to manual step entry.

## Project layout

```
src/
  app/                 Expo Router screens
    (tabs)/            Today, Food, Move, Fast, Me
    onboarding.tsx     First-run flow (guarded by Stack.Protected)
    add-food.tsx, add-workout.tsx, habit-editor.tsx, goal-editor.tsx,
    log-weight.tsx, edit-profile.tsx, meal-ideas.tsx, meal/[id].tsx
  components/          Mascot, UI kit, Emo (3D emoji), FoodArt (dish illustrations), tab bar, charts, habit atoms
  data/                Foods, exercises (METs), meal ideas, fasting plans, habit templates
  lib/                 Calorie maths, dates, mascot messages, helpers
  store/               Zustand store persisted to AsyncStorage
```

## Scripts

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
npm run emoji      # re-bundle 3D emoji after adding new ones
```

_Calorie and fasting guidance in the app is general information, not medical advice._

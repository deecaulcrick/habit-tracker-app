import type { Accent } from '@/constants/theme';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MealIdea = {
  id: string;
  name: string;
  emoji: string;
  slot: MealSlot;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  minutes: number;
  tags: string[];
  accent: Accent;
  ingredients: string[];
  steps: string[];
};

export const MEAL_SLOTS: { key: MealSlot; label: string; emoji: string; accent: Accent }[] = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅', accent: 'lemon' },
  { key: 'lunch', label: 'Lunch', emoji: '🥪', accent: 'mint' },
  { key: 'dinner', label: 'Dinner', emoji: '🍽️', accent: 'grape' },
  { key: 'snack', label: 'Snacks', emoji: '🍿', accent: 'bubblegum' },
];

export const MEAL_IDEAS: MealIdea[] = [
  {
    id: 'berry-oats',
    name: 'Berry protein overnight oats',
    emoji: '🫐',
    slot: 'breakfast',
    kcal: 380,
    protein: 30,
    carbs: 48,
    fat: 8,
    minutes: 5,
    tags: ['High protein', 'Meal prep'],
    accent: 'grape',
    ingredients: [
      '½ cup rolled oats',
      '½ cup Greek yogurt (0%)',
      '½ scoop vanilla protein',
      '½ cup almond milk',
      '½ cup mixed berries',
      '1 tsp chia seeds',
    ],
    steps: [
      'Stir oats, yogurt, protein, milk and chia in a jar.',
      'Top with berries, seal and refrigerate overnight.',
      'Eat cold or warm for 60 seconds.',
    ],
  },
  {
    id: 'veggie-scramble',
    name: 'Rainbow veggie egg scramble',
    emoji: '🍳',
    slot: 'breakfast',
    kcal: 320,
    protein: 26,
    carbs: 14,
    fat: 18,
    minutes: 10,
    tags: ['Low carb', 'Vegetarian'],
    accent: 'lemon',
    ingredients: [
      '2 eggs + 3 egg whites',
      '½ bell pepper, diced',
      'Handful spinach',
      '4 cherry tomatoes',
      '1 slice wholegrain toast',
    ],
    steps: [
      'Sauté pepper and tomatoes for 3 minutes.',
      'Add spinach until wilted.',
      'Pour in whisked eggs and fold gently until just set.',
      'Serve with toast.',
    ],
  },
  {
    id: 'pb-banana-toast',
    name: 'PB banana crunch toast',
    emoji: '🍌',
    slot: 'breakfast',
    kcal: 340,
    protein: 12,
    carbs: 46,
    fat: 12,
    minutes: 4,
    tags: ['Quick', 'Vegetarian'],
    accent: 'tangerine',
    ingredients: [
      '1 slice wholegrain toast',
      '1 tbsp peanut butter',
      '½ banana, sliced',
      'Pinch of cinnamon',
      '1 tsp honey',
    ],
    steps: [
      'Toast the bread.',
      'Spread peanut butter, top with banana.',
      'Finish with cinnamon and a drizzle of honey.',
    ],
  },
  {
    id: 'yogurt-parfait',
    name: 'Tropical yogurt parfait',
    emoji: '🥭',
    slot: 'breakfast',
    kcal: 290,
    protein: 22,
    carbs: 38,
    fat: 5,
    minutes: 3,
    tags: ['High protein', 'Quick'],
    accent: 'lemon',
    ingredients: ['170 g Greek yogurt (0%)', '½ cup mango cubes', '2 tbsp granola', '1 tbsp coconut flakes'],
    steps: ['Layer yogurt and mango in a glass.', 'Top with granola and coconut.'],
  },
  {
    id: 'chicken-bowl',
    name: 'Chicken burrito bowl',
    emoji: '🌯',
    slot: 'lunch',
    kcal: 520,
    protein: 42,
    carbs: 55,
    fat: 14,
    minutes: 20,
    tags: ['High protein', 'Meal prep'],
    accent: 'tangerine',
    ingredients: [
      '120 g grilled chicken',
      '½ cup brown rice',
      '¼ cup black beans',
      'Salsa & lettuce',
      '¼ avocado',
      'Lime wedge',
    ],
    steps: [
      'Season chicken with cumin, paprika, salt; grill 6 minutes per side.',
      'Slice and layer over rice, beans and lettuce.',
      'Top with salsa, avocado and a squeeze of lime.',
    ],
  },
  {
    id: 'tuna-wrap',
    name: 'Crunchy tuna wrap',
    emoji: '🥙',
    slot: 'lunch',
    kcal: 410,
    protein: 34,
    carbs: 32,
    fat: 15,
    minutes: 8,
    tags: ['Quick', 'High protein'],
    accent: 'sky',
    ingredients: [
      '1 can tuna, drained',
      '1 tbsp light mayo + 1 tbsp Greek yogurt',
      'Diced cucumber & celery',
      '1 tortilla wrap',
      'Lettuce',
    ],
    steps: ['Mix tuna with mayo, yogurt and diced veg.', 'Pile onto the wrap with lettuce and roll tightly.'],
  },
  {
    id: 'lentil-soup',
    name: 'Cosy red lentil soup',
    emoji: '🍲',
    slot: 'lunch',
    kcal: 360,
    protein: 20,
    carbs: 56,
    fat: 6,
    minutes: 30,
    tags: ['Vegan', 'Meal prep'],
    accent: 'tomato',
    ingredients: [
      '¾ cup red lentils',
      '1 carrot, 1 onion, 2 garlic cloves',
      '1 tsp cumin, ½ tsp turmeric',
      '3 cups veg stock',
      'Lemon juice',
    ],
    steps: [
      'Soften onion, carrot and garlic for 5 minutes.',
      'Add spices, lentils and stock; simmer 20 minutes.',
      'Blend half, stir back in, finish with lemon.',
    ],
  },
  {
    id: 'greek-salad',
    name: 'Greek chickpea salad',
    emoji: '🥗',
    slot: 'lunch',
    kcal: 430,
    protein: 18,
    carbs: 40,
    fat: 22,
    minutes: 10,
    tags: ['Vegetarian', 'No cook'],
    accent: 'mint',
    ingredients: [
      '¾ cup chickpeas',
      'Cucumber, tomato, red onion',
      '30 g feta',
      '6 olives',
      '1 tbsp olive oil + lemon + oregano',
    ],
    steps: [
      'Chop the veg into chunky pieces.',
      'Toss with chickpeas, feta and olives.',
      'Dress with oil, lemon and oregano.',
    ],
  },
  {
    id: 'salmon-traybake',
    name: 'Sheet-pan salmon & greens',
    emoji: '🐟',
    slot: 'dinner',
    kcal: 480,
    protein: 36,
    carbs: 30,
    fat: 22,
    minutes: 25,
    tags: ['High protein', 'One pan'],
    accent: 'bubblegum',
    ingredients: [
      '120 g salmon fillet',
      '1 cup broccoli',
      '1 small sweet potato, cubed',
      '1 tsp olive oil',
      'Lemon, garlic, dill',
    ],
    steps: [
      'Roast sweet potato at 200°C / 400°F for 10 minutes.',
      'Add salmon and broccoli, season, roast 12 more minutes.',
      'Finish with lemon and dill.',
    ],
  },
  {
    id: 'turkey-chili',
    name: 'Turkey & bean chili',
    emoji: '🌶️',
    slot: 'dinner',
    kcal: 450,
    protein: 38,
    carbs: 42,
    fat: 12,
    minutes: 35,
    tags: ['High protein', 'Meal prep'],
    accent: 'tomato',
    ingredients: [
      '120 g lean turkey mince',
      '½ cup kidney beans',
      '½ can chopped tomatoes',
      'Onion, pepper, garlic',
      'Chili powder, cumin, paprika',
    ],
    steps: [
      'Brown turkey with onion and garlic.',
      'Add pepper, spices, tomatoes and beans.',
      'Simmer 20 minutes. Top with Greek yogurt.',
    ],
  },
  {
    id: 'tofu-stirfry',
    name: 'Sticky sesame tofu stir-fry',
    emoji: '🥢',
    slot: 'dinner',
    kcal: 470,
    protein: 28,
    carbs: 48,
    fat: 18,
    minutes: 20,
    tags: ['Vegan', 'Quick'],
    accent: 'grape',
    ingredients: [
      '150 g firm tofu, cubed',
      '2 cups stir-fry veg',
      '½ cup rice',
      '1 tbsp soy sauce + 1 tsp honey + ginger',
      '1 tsp sesame seeds',
    ],
    steps: [
      'Crisp tofu in a hot pan for 6 minutes.',
      'Add veg and stir-fry 4 minutes.',
      'Toss in sauce, serve over rice with sesame.',
    ],
  },
  {
    id: 'zoodle-bolognese',
    name: 'Zoodle bolognese',
    emoji: '🍝',
    slot: 'dinner',
    kcal: 410,
    protein: 34,
    carbs: 22,
    fat: 20,
    minutes: 25,
    tags: ['Low carb', 'High protein'],
    accent: 'tangerine',
    ingredients: [
      '120 g lean beef mince',
      '2 courgettes, spiralised',
      '½ cup passata',
      'Onion, garlic, basil',
      '1 tbsp parmesan',
    ],
    steps: [
      'Brown beef with onion and garlic.',
      'Add passata and simmer 10 minutes.',
      'Warm zoodles 2 minutes, top with sauce and parmesan.',
    ],
  },
  {
    id: 'apple-pb',
    name: 'Apple & PB dippers',
    emoji: '🍎',
    slot: 'snack',
    kcal: 190,
    protein: 4,
    carbs: 28,
    fat: 8,
    minutes: 2,
    tags: ['Quick', 'Vegan'],
    accent: 'tomato',
    ingredients: ['1 apple, sliced', '1 tbsp peanut butter'],
    steps: ['Slice, dip, crunch.'],
  },
  {
    id: 'cottage-bowl',
    name: 'Cottage cheese berry bowl',
    emoji: '🍓',
    slot: 'snack',
    kcal: 160,
    protein: 14,
    carbs: 17,
    fat: 3,
    minutes: 2,
    tags: ['High protein'],
    accent: 'bubblegum',
    ingredients: ['½ cup cottage cheese', '½ cup strawberries', 'Drizzle of honey'],
    steps: ['Top cottage cheese with berries and honey.'],
  },
  {
    id: 'edamame',
    name: 'Chili-lime edamame',
    emoji: '🫛',
    slot: 'snack',
    kcal: 150,
    protein: 13,
    carbs: 10,
    fat: 6,
    minutes: 5,
    tags: ['Vegan', 'High protein'],
    accent: 'mint',
    ingredients: ['1 cup edamame in pods', 'Chili flakes, lime, flaky salt'],
    steps: ['Steam edamame 4 minutes.', 'Toss with chili, lime and salt.'],
  },
  {
    id: 'choc-mousse',
    name: 'Protein chocolate mousse',
    emoji: '🍫',
    slot: 'snack',
    kcal: 180,
    protein: 22,
    carbs: 14,
    fat: 4,
    minutes: 3,
    tags: ['High protein', 'Sweet tooth'],
    accent: 'grape',
    ingredients: ['170 g Greek yogurt (0%)', '1 tbsp cocoa powder', '½ scoop chocolate protein', 'Sweetener to taste'],
    steps: ['Whisk everything until silky.', 'Chill 10 minutes if you can wait.'],
  },
];

/** Pick one idea per slot whose total lands closest to the calorie target. */
export function buildDayPlan(target: number, seed: number): MealIdea[] {
  const bySlot = (s: MealSlot) => MEAL_IDEAS.filter((m) => m.slot === s);
  const b = bySlot('breakfast');
  const l = bySlot('lunch');
  const d = bySlot('dinner');
  const s = bySlot('snack');
  const combos: MealIdea[][] = [];
  for (const x of b) for (const y of l) for (const z of d) for (const w of s) combos.push([x, y, z, w]);
  const scored = combos
    .map((c) => {
      const kcal = c.reduce((n, m) => n + m.kcal, 0);
      return { c, diff: Math.abs(target - kcal) };
    })
    .sort((p, q) => p.diff - q.diff)
    .slice(0, 12);
  return scored[Math.abs(seed) % scored.length].c;
}

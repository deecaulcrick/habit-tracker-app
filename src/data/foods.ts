export type FoodCategory =
  | 'rice'
  | 'swallow'
  | 'soup'
  | 'protein'
  | 'beans'
  | 'breakfast'
  | 'snack'
  | 'fruit'
  | 'veg'
  | 'drink'
  | 'dairy'
  | 'meal';

export type Food = {
  id: string;
  name: string;
  /** A 3D emoji glyph, or `art:<id>` for one of our hand-drawn food illustrations. */
  emoji: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  category: FoodCategory;
  /** Nigerian / West African staple — listed first. */
  ng?: boolean;
};

type Row = [id: string, name: string, emoji: string, serving: string, kcal: number, p: number, c: number, f: number];

const make = (category: FoodCategory, ng: boolean, rows: Row[]): Food[] =>
  rows.map(([id, name, emoji, serving, kcal, protein, carbs, fat]) => ({
    id,
    name,
    emoji,
    serving,
    kcal,
    protein,
    carbs,
    fat,
    category,
    ng: ng || undefined,
  }));

/**
 * Approximate values for typical home-cooked Nigerian portions. Oil and
 * portion size vary a lot between kitchens, so treat these as good guides.
 */
const NIGERIAN: Food[] = [
  ...make('rice', true, [
    ['jollof', 'Jollof rice', 'art:jollof', '1 cup (200 g)', 350, 6, 58, 10],
    ['fried-rice', 'Nigerian fried rice', 'art:fried-rice', '1 cup (200 g)', 330, 7, 50, 11],
    ['rice-stew', 'White rice & stew', 'art:rice-stew', '1 cup + ½ cup stew', 380, 6, 52, 16],
    ['ofada', 'Ofada rice & ayamase', 'art:ofada', '1 cup + sauce', 520, 12, 55, 28],
    ['coconut-rice', 'Coconut rice', 'art:coconut-rice', '1 cup', 380, 6, 56, 14],
    ['native-jollof', 'Native jollof (palm oil)', 'art:native-jollof', '1 cup', 370, 8, 55, 13],
    ['tuwo', 'Tuwo shinkafa', 'art:tuwo', '1 medium wrap', 330, 6, 74, 1],
  ]),
  ...make('swallow', true, [
    ['eba', 'Eba (garri)', 'art:eba', '1 medium wrap', 360, 1, 86, 0],
    ['pounded-yam', 'Pounded yam', 'art:pounded-yam', '1 medium wrap', 400, 5, 95, 1],
    ['amala', 'Amala', 'art:amala', '1 medium wrap', 330, 3, 78, 1],
    ['semo', 'Semovita', 'art:semo', '1 medium wrap', 380, 12, 78, 2],
    ['fufu', 'Fufu (akpu)', 'art:fufu', '1 medium wrap', 330, 1, 80, 0],
    ['wheat', 'Wheat swallow', 'art:wheat', '1 medium wrap', 300, 10, 62, 2],
    ['oat-swallow', 'Oat swallow', 'art:oat-swallow', '1 medium wrap', 250, 9, 44, 5],
  ]),
  ...make('soup', true, [
    ['egusi', 'Egusi soup', 'art:egusi', '1 cup with meat', 350, 18, 8, 28],
    ['efo', 'Efo riro', 'art:efo', '1 cup with assorted', 260, 16, 8, 18],
    ['okra', 'Okra soup', 'art:okra', '1 cup with fish', 180, 14, 10, 9],
    ['ogbono', 'Ogbono soup', 'art:ogbono', '1 cup', 300, 15, 8, 24],
    ['banga', 'Banga soup', 'art:banga', '1 cup', 380, 14, 6, 34],
    ['afang', 'Afang soup', 'art:afang', '1 cup', 280, 18, 8, 20],
    ['edikang', 'Edikang ikong', 'art:edikang', '1 cup', 260, 18, 8, 18],
    ['oha', 'Oha soup', 'art:oha', '1 cup', 280, 16, 10, 20],
    ['nsala', 'Ofe nsala (white soup)', 'art:nsala', '1 cup', 260, 22, 8, 15],
    ['goat-pepper-soup', 'Goat meat pepper soup', 'art:pepper-soup', '1 bowl', 280, 30, 5, 15],
    ['fish-pepper-soup', 'Catfish pepper soup', 'art:pepper-soup', '1 bowl', 230, 28, 4, 11],
    ['stew', 'Tomato stew', 'art:stew', '½ cup', 180, 2, 8, 16],
    ['miyan-kuka', 'Miyan kuka', 'art:ogbono', '1 cup', 180, 8, 14, 10],
    ['abacha', 'Abacha (African salad)', 'art:abacha', '1 plate', 400, 10, 50, 18],
    ['nkwobi', 'Nkwobi', 'art:banga', '1 bowl', 450, 30, 5, 35],
  ]),
  ...make('beans', true, [
    ['moi-moi', 'Moi moi', '🫔', '1 wrap', 180, 10, 18, 8],
    ['akara', 'Akara', '🧆', '3 balls', 230, 8, 15, 15],
    ['ewa-agoyin', 'Ewa agoyin', 'art:beans', '1 cup + sauce', 420, 15, 45, 20],
    ['beans-porridge', 'Beans porridge', 'art:beans', '1 cup', 320, 15, 45, 9],
    ['okpa', 'Okpa', '🫔', '1 wrap', 330, 15, 40, 12],
  ]),
  ...make('protein', true, [
    ['suya', 'Suya', '🍢', '100 g', 250, 26, 5, 14],
    ['kilishi', 'Kilishi', '🥓', '30 g', 120, 15, 6, 4],
    ['asun', 'Asun (spicy goat)', '🍖', '100 g', 290, 24, 3, 20],
    ['goat-meat', 'Goat meat (boiled)', '🍖', '100 g', 145, 27, 0, 3],
    ['beef-stew', 'Beef (stewed)', '🥩', '3 pieces (100 g)', 220, 26, 0, 13],
    ['fried-chicken-ng', 'Fried chicken', '🍗', '1 thigh', 280, 22, 4, 19],
    ['grilled-chicken', 'Grilled chicken', '🍗', '1 piece', 200, 25, 0, 11],
    ['turkey-ng', 'Fried turkey', '🦃', '1 piece', 300, 28, 0, 20],
    ['titus', 'Fried fish (titus)', '🐟', '1 piece', 230, 20, 0, 16],
    ['tilapia', 'Grilled tilapia', '🐠', '1 whole', 320, 52, 0, 12],
    ['croaker', 'Grilled croaker', '🐟', '1 whole', 300, 48, 0, 11],
    ['ponmo', 'Ponmo', '🥓', '1 piece', 70, 8, 0, 4],
    ['snail', 'Snail', '🐌', '3 pieces', 90, 16, 2, 1],
    ['gizzard', 'Peppered gizzard', '🍢', '5 pieces', 150, 22, 3, 6],
    ['boiled-egg', 'Boiled egg', '🥚', '1 egg', 78, 6, 1, 5],
    ['egg-sauce', 'Egg sauce', '🍳', '½ cup', 180, 9, 6, 13],
    ['sardines', 'Sardines (tin)', '🥫', '1 tin', 190, 22, 0, 11],
    ['stockfish', 'Stockfish', '🐟', '50 g', 150, 32, 0, 1],
  ]),
  ...make('breakfast', true, [
    ['pap', 'Pap (ogi / akamu)', '🥣', '1 cup, milk & sugar', 180, 3, 38, 2],
    ['custard', 'Custard', '🍮', '1 cup, with milk', 200, 5, 36, 4],
    ['tom-brown', 'Tom brown', '🥣', '1 cup', 220, 7, 38, 5],
    ['yam-boiled', 'Boiled yam', '🍠', '2 slices (150 g)', 175, 2, 41, 0],
    ['yam-porridge', 'Yam porridge (asaro)', 'art:asaro', '1 cup', 330, 4, 60, 9],
    ['fried-yam', 'Fried yam', '🍟', '4 pieces', 300, 3, 45, 13],
    ['agege', 'Agege bread', '🍞', '2 slices', 160, 5, 32, 1],
    ['indomie', 'Indomie noodles', '🍜', '1 pack (70 g)', 350, 7, 46, 15],
    ['naija-spag', 'Jollof spaghetti', '🍝', '1 cup', 320, 8, 48, 10],
    ['garri-soak', 'Soaked garri + groundnut', '🥣', '1 bowl', 400, 8, 70, 10],
    ['masa', 'Masa (waina)', '🫓', '3 pieces', 260, 5, 45, 7],
    ['tea-milk', 'Tea with milk & sugar', '🍵', '1 mug', 90, 2, 14, 3],
  ]),
  ...make('snack', true, [
    ['dodo', 'Fried plantain (dodo)', 'art:dodo', '½ plantain', 220, 1, 30, 11],
    ['boiled-plantain', 'Boiled plantain', '🍌', '1 medium', 220, 2, 57, 0],
    ['boli', 'Boli (roasted plantain)', '🍌', '1 medium', 230, 2, 60, 1],
    ['gizdodo', 'Gizdodo', 'art:dodo', '1 cup', 380, 18, 30, 21],
    ['puff-puff', 'Puff-puff', '🧆', '3 balls', 300, 4, 42, 13],
    ['chin-chin', 'Chin chin', '🍪', '1 handful (30 g)', 150, 3, 18, 7],
    ['meat-pie', 'Meat pie', '🥟', '1 pie', 380, 9, 38, 21],
    ['sausage-roll', 'Sausage roll', '🌭', '1 roll', 250, 6, 20, 16],
    ['buns', 'Buns', '🍩', '1 bun', 200, 3, 24, 10],
    ['plantain-chips', 'Plantain chips', '🍌', '1 pack (50 g)', 260, 1, 30, 15],
    ['roasted-corn', 'Roasted corn', '🌽', '1 cob', 120, 4, 25, 2],
    ['ube', 'Ube (African pear)', '🍆', '2 pears', 120, 2, 6, 10],
    ['groundnut', 'Roasted groundnut', '🥜', '1 handful (30 g)', 170, 7, 5, 14],
    ['boiled-groundnut', 'Boiled groundnut', '🥜', '1 cup', 190, 8, 13, 13],
    ['tiger-nuts', 'Tiger nuts (aya)', '🌰', '30 g', 140, 1, 19, 7],
    ['cashew', 'Cashew nuts', '🥜', '30 g', 160, 5, 9, 12],
  ]),
  ...make('fruit', true, [
    ['agbalumo', 'Agbalumo (udara)', '🍊', '2 fruits', 70, 1, 17, 0],
    ['pawpaw', 'Pawpaw', '🍈', '1 cup', 60, 1, 15, 0],
    ['mango-ng', 'Mango', '🥭', '1 medium', 200, 3, 50, 1],
    ['pineapple', 'Pineapple', '🍍', '1 cup', 82, 1, 22, 0],
    ['watermelon-ng', 'Watermelon', '🍉', '2 cups', 92, 2, 23, 0],
    ['orange-ng', 'Orange', '🍊', '1 medium', 62, 1, 15, 0],
    ['banana-ng', 'Banana', '🍌', '1 medium', 105, 1, 27, 0],
    ['garden-egg', 'Garden egg', '🍆', '2 pieces', 40, 2, 9, 0],
    ['coconut', 'Coconut chunks', '🥥', '30 g', 100, 1, 4, 10],
    ['cucumber-ng', 'Cucumber', '🥒', '1 medium', 30, 1, 7, 0],
    ['carrot-ng', 'Carrot', '🥕', '1 medium', 25, 1, 6, 0],
  ]),
  ...make('drink', true, [
    ['zobo', 'Zobo (sweetened)', '🍷', '1 cup', 90, 0, 23, 0],
    ['zobo-nosugar', 'Zobo (no sugar)', '🍷', '1 cup', 10, 0, 2, 0],
    ['kunu', 'Kunu', '🧋', '1 cup', 150, 3, 32, 1],
    ['malt', 'Malt drink', '🍺', '1 bottle (330 ml)', 230, 1, 55, 0],
    ['minerals', 'Soft drink (minerals)', '🥤', '1 bottle (350 ml)', 150, 0, 40, 0],
    ['chapman', 'Chapman', '🍹', '1 glass', 180, 0, 45, 0],
    ['palm-wine', 'Palm wine', '🥛', '1 cup', 100, 1, 12, 0],
    ['lager', 'Lager beer', '🍺', '1 bottle (600 ml)', 250, 2, 20, 0],
    ['fura', 'Fura da nono', '🥛', '1 cup', 200, 6, 30, 6],
    ['milk-ng', 'Evaporated milk', '🥛', '2 tbsp', 40, 2, 3, 2],
  ]),
];

const INTERNATIONAL: Food[] = [
  ...make('protein', false, [
    ['egg', 'Egg', '🥚', '1 large', 72, 6, 0, 5],
    ['chicken', 'Chicken breast', '🍗', '120 g cooked', 198, 37, 0, 4],
    ['salmon', 'Salmon fillet', '🐟', '120 g', 250, 25, 0, 16],
    ['tuna', 'Tuna (canned)', '🥫', '1 can, drained', 120, 26, 0, 1],
    ['tofu', 'Firm tofu', '🧈', '150 g', 216, 24, 4, 12],
    ['shrimp', 'Shrimp / prawns', '🍤', '100 g', 99, 24, 0, 0],
    ['protein-shake', 'Protein shake', '🥤', '1 scoop + water', 120, 24, 3, 1],
  ]),
  ...make('breakfast', false, [
    ['oats', 'Oatmeal', '🥣', '1 cup cooked', 158, 6, 27, 3],
    ['toast', 'Wholegrain toast', '🍞', '1 slice', 80, 4, 14, 1],
    ['cornflakes', 'Cornflakes + milk', '🥣', '1 bowl', 220, 7, 40, 3],
  ]),
  ...make('rice', false, [
    ['rice', 'Plain white rice', '🍚', '1 cup cooked', 205, 4, 45, 0],
    ['brown-rice', 'Brown rice', '🍙', '1 cup cooked', 218, 5, 46, 2],
    ['pasta', 'Pasta', '🍝', '1 cup cooked', 220, 8, 43, 1],
    ['potato', 'Irish potato (boiled)', '🥔', '1 medium', 161, 4, 37, 0],
    ['sweet-potato', 'Sweet potato', '🍠', '1 medium', 112, 2, 26, 0],
  ]),
  ...make('veg', false, [
    ['salad', 'Side salad', '🥗', '2 cups, light dressing', 80, 2, 8, 5],
    ['spinach', 'Spinach (efo tete)', '🥬', '1 cup cooked', 41, 5, 7, 0],
    ['broccoli', 'Broccoli', '🥦', '1 cup', 55, 4, 11, 0],
    ['peppers', 'Bell pepper', '🫑', '1 medium', 30, 1, 7, 0],
  ]),
  ...make('fruit', false, [
    ['apple', 'Apple', '🍎', '1 medium', 95, 0, 25, 0],
    ['avocado', 'Avocado', '🥑', '½ fruit', 120, 1, 6, 11],
    ['berries', 'Mixed berries', '🫐', '1 cup', 70, 1, 17, 0],
    ['grapes', 'Grapes', '🍇', '1 cup', 104, 1, 27, 0],
  ]),
  ...make('dairy', false, [
    ['greek-yogurt', 'Greek yogurt (0%)', '🥛', '170 g', 100, 18, 6, 0],
    ['yoghurt-ng', 'Sweetened yoghurt', '🥛', '1 cup', 180, 7, 30, 3],
    ['cheese', 'Cheddar', '🧀', '30 g', 120, 7, 0, 10],
  ]),
  ...make('snack', false, [
    ['dark-choc', 'Dark chocolate', '🍫', '2 squares', 110, 1, 9, 8],
    ['popcorn', 'Popcorn', '🍿', '3 cups', 93, 3, 19, 1],
    ['cookie', 'Biscuits / cookies', '🍪', '2 pieces', 150, 2, 20, 7],
    ['doughnut', 'Doughnut', '🍩', '1 glazed', 250, 3, 31, 14],
    ['cake', 'Cake slice', '🍰', '1 slice', 350, 4, 50, 15],
  ]),
  ...make('drink', false, [
    ['coffee', 'Black coffee', '☕', '1 cup', 2, 0, 0, 0],
    ['latte', 'Latte', '☕', '12 oz', 150, 10, 15, 6],
    ['juice', 'Fruit juice (carton)', '🧃', '1 cup', 112, 1, 26, 0],
    ['smoothie', 'Fruit smoothie', '🍹', '16 oz', 250, 4, 55, 2],
  ]),
  ...make('meal', false, [
    ['pizza', 'Pizza slice', '🍕', '1 slice', 285, 12, 36, 10],
    ['burger', 'Burger', '🍔', '1 burger', 540, 25, 40, 30],
    ['fries', 'Chips / fries', '🍟', 'medium', 365, 4, 48, 17],
    ['shawarma', 'Chicken shawarma', '🌯', '1 wrap', 550, 30, 50, 25],
    ['sandwich', 'Chicken sandwich', '🥪', '1 sandwich', 400, 28, 40, 13],
  ]),
];

export const FOODS: Food[] = [...NIGERIAN, ...INTERNATIONAL];

export const FOOD_CATEGORIES: { key: FoodCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'rice', label: 'Rice & pasta' },
  { key: 'swallow', label: 'Swallow' },
  { key: 'soup', label: 'Soups & stews' },
  { key: 'protein', label: 'Protein' },
  { key: 'beans', label: 'Beans' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'snack', label: 'Snacks' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'veg', label: 'Veg' },
  { key: 'drink', label: 'Drinks' },
  { key: 'dairy', label: 'Dairy' },
  { key: 'meal', label: 'Takeaway' },
];

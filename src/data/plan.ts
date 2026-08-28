/* ------------------------------------------------------------------
   ₦40K STUDENT KITCHEN — data model
   Lagos • 30 days • 60 meals • no refrigerator
   All money values are PLAN ESTIMATES derived from the item prices
   below. Nothing is invented as an "exact market price": every figure
   is computed from these unit estimates so the whole app stays
   internally consistent.
------------------------------------------------------------------ */

export const BUDGET = 40_000;

export type Tag =
  | 'RICE'
  | 'BEANS'
  | 'PASTA'
  | 'SWEET POTATO'
  | 'PLANTAIN'
  | 'SOUP'
  | 'EGG'
  | 'FISH';

export type Item = 'egg2' | 'beans' | 'sp' | 'plantain' | 'veg' | 'cray' | 'yam' | 'fish';

/** Estimated cost of one portion of a purchased (non-pantry) item. */
export const PRICES: Record<Item, number> = {
  egg2: 400, // 2 eggs @ ~₦200
  beans: 400, // 1 portion from 2 paints (≈ ₦4,000)
  sp: 700, // sweet potatoes, ₦500–₦1,000 per meal
  plantain: 400, // 1/5 of a ₦2,000 bunch
  veg: 250, // half of a small ₦500 market purchase
  cray: 120, // crayfish flavour portion
  yam: 800, // yam for one meal
  fish: 0, // NEVER counted inside the ₦40,000
};

/** Shared cooking cost per meal: oil, seasoning, onion/pepper, rice top-up, misc. */
export const BASE_PER_MEAL = 170;
export const EGG_UNIT = 200;

export type Meal = {
  name: string;
  tags: Tag[];
  items: Item[];
  time: string;
};

export type Day = {
  day: number;
  lunch: Meal;
  dinner: Meal;
  batch?: string;
};

const m = (name: string, tags: Tag[], items: Item[], time: string): Meal => ({
  name,
  tags,
  items,
  time,
});

export const DAYS: Day[] = [
  // ---------------- WEEK 1 ----------------
  {
    day: 1,
    lunch: m('Jollof Rice + 2 Eggs', ['RICE', 'EGG'], ['egg2', 'cray'], '35–45 min'),
    dinner: m('Beans Porridge + Garri', ['BEANS'], ['beans', 'cray'], '45–55 min'),
    batch: 'Beans day — cook a small batch, half is tomorrow’s Rice & Beans.',
  },
  {
    day: 2,
    lunch: m('Jollof Spaghetti', ['PASTA'], [], '20–25 min'),
    dinner: m('Rice & Beans', ['RICE', 'BEANS'], ['beans'], '10–15 min reheat'),
  },
  {
    day: 3,
    lunch: m('Beans + Fried Plantain', ['BEANS', 'PLANTAIN'], ['beans', 'plantain'], '15–20 min'),
    dinner: m('Sweet Potato + Egg Sauce', ['SWEET POTATO', 'EGG'], ['sp', 'egg2'], '25–30 min'),
  },
  {
    day: 4,
    lunch: m('Rice + Vegetable Sauce', ['RICE', 'SOUP'], ['veg', 'cray'], '30–35 min'),
    dinner: m('Jollof Macaroni', ['PASTA'], [], '20–25 min'),
  },
  {
    day: 5,
    lunch: m('Concoction Rice', ['RICE', 'SOUP'], ['veg', 'cray'], '35–40 min'),
    dinner: m('Eba + Okra Soup', ['SOUP'], ['veg'], '20–25 min'),
  },
  {
    day: 6,
    lunch: m('Sweet Potato Porridge', ['SWEET POTATO'], ['sp'], '25–30 min'),
    dinner: m('White Rice + Egg Sauce', ['RICE', 'EGG'], ['egg2', 'veg'], '30–35 min'),
  },
  {
    day: 7,
    lunch: m('Jollof Rice + 2 Eggs', ['RICE', 'EGG'], ['egg2', 'cray'], '35–45 min'),
    dinner: m('Beans + Fried Plantain', ['BEANS', 'PLANTAIN'], ['beans', 'plantain'], '30–40 min'),
    batch: 'Second beans batch of the week — finish it tomorrow.',
  },
  // ---------------- WEEK 2 ----------------
  {
    day: 8,
    lunch: m('Yam + Egg Sauce', ['EGG'], ['yam', 'egg2'], '25–30 min'),
    dinner: m('Pepper-Fried Spaghetti', ['PASTA'], [], '20–25 min'),
  },
  {
    day: 9,
    lunch: m('Rice + Fish Stew', ['RICE', 'FISH'], ['fish', 'veg'], '40–45 min'),
    dinner: m('Beans Porridge + Garri', ['BEANS'], ['beans'], '45–55 min'),
    batch: 'Beans + garri stretch the pot — cook once, eat twice.',
  },
  {
    day: 10,
    lunch: m('Beans + Fried Plantain', ['BEANS', 'PLANTAIN'], ['beans', 'plantain'], '15–20 min'),
    dinner: m('Jollof Macaroni + 2 Eggs', ['PASTA', 'EGG'], ['egg2'], '25–30 min'),
  },
  {
    day: 11,
    lunch: m('Concoction Rice', ['RICE', 'SOUP'], ['veg', 'cray'], '35–40 min'),
    dinner: m('Eba + Vegetable Soup', ['SOUP'], ['veg', 'cray'], '25–30 min'),
  },
  {
    day: 12,
    lunch: m('Jollof Spaghetti + 2 Eggs', ['PASTA', 'EGG'], ['egg2'], '25–30 min'),
    dinner: m('Sweet Potato Porridge', ['SWEET POTATO'], ['sp'], '25–30 min'),
  },
  {
    day: 13,
    lunch: m('Palm-Oil Rice', ['RICE'], [], '30–35 min'),
    dinner: m('Jollof Rice + Crayfish', ['RICE'], ['cray'], '35–40 min'),
  },
  {
    day: 14,
    lunch: m('Spaghetti + Fish Sauce', ['PASTA', 'FISH'], ['fish', 'veg'], '30–35 min'),
    dinner: m('Concoction Rice', ['RICE', 'SOUP'], ['veg'], '35–40 min'),
  },
  // ---------------- WEEK 3 ----------------
  {
    day: 15,
    lunch: m('Jollof Rice', ['RICE'], [], '35–40 min'),
    dinner: m('Eba + Okra Soup', ['SOUP'], ['veg'], '20–25 min'),
  },
  {
    day: 16,
    lunch: m('Beans + Fried Plantain', ['BEANS', 'PLANTAIN'], ['beans', 'plantain'], '30–40 min'),
    dinner: m('Rice & Beans', ['RICE', 'BEANS'], ['beans'], '10–15 min reheat'),
    batch: 'Beans batch — the pot covers both meals today.',
  },
  {
    day: 17,
    lunch: m('Sweet Potato + Egg Sauce', ['SWEET POTATO', 'EGG'], ['sp', 'egg2'], '25–30 min'),
    dinner: m('Jollof Spaghetti', ['PASTA'], ['cray'], '20–25 min'),
  },
  {
    day: 18,
    lunch: m('White Rice + Egg Sauce', ['RICE', 'EGG'], ['egg2', 'veg'], '30–35 min'),
    dinner: m('Eba + Vegetable Soup', ['SOUP'], ['veg', 'cray'], '25–30 min'),
  },
  {
    day: 19,
    lunch: m('Concoction Rice', ['RICE', 'SOUP'], ['veg'], '35–40 min'),
    dinner: m('Pepper-Fried Macaroni + 2 Eggs', ['PASTA', 'EGG'], ['egg2'], '25–30 min'),
  },
  {
    day: 20,
    lunch: m('Yam + Egg Sauce', ['EGG'], ['yam', 'egg2'], '25–30 min'),
    dinner: m('Rice + Fish Stew', ['RICE', 'FISH'], ['fish', 'veg'], '40–45 min'),
  },
  {
    day: 21,
    lunch: m('Palm-Oil Rice + Crayfish', ['RICE'], ['cray'], '30–35 min'),
    dinner: m('Sweet Potato Porridge', ['SWEET POTATO'], ['sp'], '25–30 min'),
  },
  // ---------------- WEEK 4 ----------------
  {
    day: 22,
    lunch: m('Jollof Rice + 2 Eggs', ['RICE', 'EGG'], ['egg2'], '35–45 min'),
    dinner: m('Rice + Vegetable Sauce', ['RICE', 'SOUP'], ['veg', 'cray'], '30–35 min'),
  },
  {
    day: 23,
    lunch: m('Beans Porridge + Garri', ['BEANS'], ['beans', 'cray'], '45–55 min'),
    dinner: m('Jollof Macaroni', ['PASTA'], [], '20–25 min'),
    batch: 'Last beans batch — cook small, finish tomorrow.',
  },
  {
    day: 24,
    lunch: m('Beans + Fried Plantain', ['BEANS', 'PLANTAIN'], ['beans', 'plantain'], '15–20 min'),
    dinner: m('Sweet Potato + Egg Sauce', ['SWEET POTATO', 'EGG'], ['sp', 'egg2'], '25–30 min'),
  },
  {
    day: 25,
    lunch: m('Concoction Rice', ['RICE', 'SOUP'], ['veg', 'cray'], '35–40 min'),
    dinner: m('Eba + Okra Soup', ['SOUP'], ['veg'], '20–25 min'),
  },
  {
    day: 26,
    lunch: m('Jollof Spaghetti + 2 Eggs', ['PASTA', 'EGG'], ['egg2'], '25–30 min'),
    dinner: m('Rice + Fish Sauce', ['RICE', 'FISH'], ['fish', 'veg'], '35–40 min'),
  },
  {
    day: 27,
    lunch: m('White Rice + Egg Sauce', ['RICE', 'EGG'], ['egg2', 'veg'], '30–35 min'),
    dinner: m('Pepper-Fried Spaghetti + 2 Eggs', ['PASTA', 'EGG'], ['egg2'], '25–30 min'),
  },
  {
    day: 28,
    lunch: m('Jollof Macaroni + 2 Eggs', ['PASTA', 'EGG'], ['egg2', 'cray'], '25–30 min'),
    dinner: m('Palm-Oil Rice', ['RICE'], [], '30–35 min'),
  },
  {
    day: 29,
    lunch: m('Concoction Rice', ['RICE', 'SOUP'], ['veg', 'cray'], '35–40 min'),
    dinner: m('Eba + Vegetable Soup', ['SOUP'], ['veg', 'cray'], '25–30 min'),
  },
  {
    day: 30,
    lunch: m('Jollof Rice + 2 Eggs', ['RICE', 'EGG'], ['egg2', 'cray'], '35–45 min'),
    dinner: m('Jollof Spaghetti', ['PASTA'], [], '20–25 min'),
  },
];

/* ------------------------------------------------------------------
   MARKET RUNS — cash out of pocket (this is what "spent" tracks)
------------------------------------------------------------------ */
export type Purchase = {
  day: number;
  item: string;
  qty: string;
  cost: number;
  outside?: boolean;
  board?: string;
};

export const PURCHASES: Purchase[] = [
  { day: 1, item: 'Eggs', qty: '12 loose', cost: 2_400, board: 'eggs' },
  { day: 1, item: 'Beans', qty: '1 paint', cost: 2_000, board: 'beans' },
  { day: 1, item: 'Palm oil', qty: '1 litre', cost: 1_800, board: 'palmoil' },
  { day: 1, item: 'Seasoning & salt', qty: 'restock', cost: 800, board: 'seasoning' },
  { day: 1, item: 'Onions', qty: 'small net', cost: 500, board: 'onions' },
  { day: 1, item: 'Dry pepper', qty: 'top-up', cost: 200, board: 'pepper' },
  { day: 1, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 3, item: 'Plantain', qty: '1 bunch', cost: 2_000, board: 'plantain' },
  { day: 3, item: 'Sweet potatoes', qty: '2 meals', cost: 1_400, board: 'sp' },
  { day: 4, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 7, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 7, item: 'Onion', qty: '2 bulbs', cost: 200, board: 'onions' },
  { day: 7, item: 'Fresh pepper', qty: 'small cup', cost: 200, board: 'onions' },
  { day: 8, item: 'Yam', qty: '1 small tuber', cost: 800, board: 'yam' },
  { day: 8, item: 'Crayfish', qty: '~500 g', cost: 2_040, board: 'cray' },
  { day: 8, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 9, item: 'Fish', qty: '1 piece (outside ₦40K)', cost: 0, outside: true },
  { day: 11, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 12, item: 'Sweet potatoes', qty: '1 meal', cost: 700, board: 'sp' },
  { day: 14, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 14, item: 'Fish', qty: '1 piece (outside ₦40K)', cost: 0, outside: true },
  { day: 15, item: 'Eggs', qty: '12 loose', cost: 2_400, board: 'eggs' },
  { day: 15, item: 'Beans', qty: '1 paint', cost: 2_000, board: 'beans' },
  { day: 15, item: 'Palm oil', qty: '1 litre', cost: 1_800, board: 'palmoil' },
  { day: 15, item: 'Vegetable oil', qty: '750 ml', cost: 1_500, board: 'vegoil' },
  { day: 15, item: 'Seasoning', qty: 'top-up', cost: 700, board: 'seasoning' },
  { day: 15, item: 'Onions', qty: 'small net', cost: 500, board: 'onions' },
  { day: 15, item: 'Rice top-up', qty: '½ paint', cost: 1_400, board: 'rice' },
  { day: 17, item: 'Sweet potatoes', qty: '1 meal', cost: 700, board: 'sp' },
  { day: 18, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 20, item: 'Yam', qty: '1 small tuber', cost: 800, board: 'yam' },
  { day: 20, item: 'Fish', qty: '1 piece (outside ₦40K)', cost: 0, outside: true },
  { day: 22, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 23, item: 'Eggs', qty: '12 loose', cost: 2_400, board: 'eggs' },
  { day: 23, item: 'Sweet potatoes', qty: '2 meals', cost: 1_400, board: 'sp' },
  { day: 25, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 26, item: 'Fish', qty: '1 piece (outside ₦40K)', cost: 0, outside: true },
  { day: 29, item: 'Vegetables', qty: 'small bunch', cost: 500, board: 'veg' },
  { day: 29, item: 'Market transport', qty: 'misc', cost: 600, board: 'misc' },
];

/* ------------------------------------------------------------------
   PANTRY — already owned, NOT bought from the ₦40,000
------------------------------------------------------------------ */
export type PantryKey = 'rice' | 'garri' | 'spaghetti' | 'macaroni' | 'tomato' | 'pepper' | 'oil';

export const PANTRY: { key: PantryKey; label: string; owned: number; unit: string; step: number }[] =
  [
    { key: 'rice', label: 'Rice', owned: 2, unit: 'paints', step: 0.1 },
    { key: 'garri', label: 'Garri', owned: 3, unit: 'paints', step: 0.12 },
    { key: 'spaghetti', label: 'Spaghetti', owned: 3, unit: 'packs', step: 0.34 },
    { key: 'macaroni', label: 'Macaroni', owned: 9, unit: 'packs', step: 1 },
    { key: 'tomato', label: 'Tomato paste', owned: 28, unit: 'sachets', step: 0.9 },
    { key: 'pepper', label: 'Dry pepper', owned: 25, unit: 'sachets', step: 0.4 },
    { key: 'oil', label: 'Palm oil', owned: 75, unit: 'ml', step: 25 },
  ];

/** Extra pantry stock arriving from the shopping plan (palm oil, rice top-up). */
export const PANTRY_TOPUPS: { day: number; key: PantryKey; amount: number }[] = [
  { day: 1, key: 'oil', amount: 1_000 },
  { day: 15, key: 'oil', amount: 1_000 },
  { day: 15, key: 'rice', amount: 0.5 },
  { day: 1, key: 'pepper', amount: 4 },
];

export function pantryDraw(meal: Meal): Record<PantryKey, number> {
  const n = meal.name.toLowerCase();
  return {
    rice: meal.tags.includes('RICE') ? 0.1 : 0,
    garri: /eba|garri/.test(n) ? 0.12 : 0,
    spaghetti: /spaghetti/.test(n) ? 0.34 : 0,
    macaroni: /macaroni/.test(n) ? 1 : 0,
    tomato: /jollof|concoction|sauce|stew|soup/.test(n) ? 0.9 : 0,
    pepper: 0.4,
    oil: 25,
  };
}

/* ------------------------------------------------------------------
   DERIVED SELECTORS
------------------------------------------------------------------ */
export const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US');
export const pad = (n: number) => String(n).padStart(2, '0');

export function mealCost(meal: Meal): number {
  return BASE_PER_MEAL + meal.items.reduce((s, i) => s + PRICES[i], 0);
}

export const dayCost = (d: Day) => mealCost(d.lunch) + mealCost(d.dinner);

export const allMeals = DAYS.flatMap((d) => [d.lunch, d.dinner]);
export const countItem = (i: Item) => allMeals.filter((x) => x.items.includes(i)).length;

export const PLAN = (() => {
  const eggs = countItem('egg2') * 2;
  const beans = countItem('beans');
  const sp = countItem('sp');
  const plantain = countItem('plantain');
  const veg = countItem('veg');
  const cray = countItem('cray');
  const yam = countItem('yam');
  const fish = countItem('fish');

  const board = {
    eggs: eggs * EGG_UNIT,
    beans: beans * PRICES.beans,
    sp: sp * PRICES.sp,
    plantain: plantain * PRICES.plantain,
    veg: veg * PRICES.veg,
    cray: cray * PRICES.cray,
    yam: yam * PRICES.yam,
    palmoil: 3_600,
    vegoil: 1_500,
    onions: 1_400,
    seasoning: 1_500,
    rice: 1_400,
    pepper: 200,
    misc: 600,
  } as Record<string, number>;

  const plannedSpend = Object.values(board).reduce((a, b) => a + b, 0);
  const mealTotal = allMeals.reduce((s, x) => s + mealCost(x), 0);

  return {
    eggs,
    beans,
    sp,
    plantain,
    veg,
    cray,
    yam,
    fish,
    board,
    plannedSpend,
    mealTotal,
    reserve: BUDGET - plannedSpend,
    perMeal: mealTotal / 60,
  };
})();

export const weekOf = (day: number) => (day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4);
export const WEEK_RANGES: [number, number][] = [
  [1, 7],
  [8, 14],
  [15, 21],
  [22, 30],
];
export const WEEK_NOTE: Record<number, string> = {
  1: 'Bulk restock week',
  2: 'Fresh buys only',
  3: 'Bulk restock week',
  4: 'Fresh buys only',
};

const inWeek = (w: number) => {
  const [a, b] = WEEK_RANGES[w - 1];
  return PURCHASES.filter((p) => p.day >= a && p.day <= b);
};

export function weekTarget(w: number) {
  return inWeek(w).reduce((s, p) => s + (p.outside ? 0 : p.cost), 0);
}
export function weekSpentToDate(w: number, day: number) {
  return inWeek(w)
    .filter((p) => p.day <= day)
    .reduce((s, p) => s + (p.outside ? 0 : p.cost), 0);
}

export function spentToDate(day: number) {
  return PURCHASES.filter((p) => p.day <= day).reduce((s, p) => s + (p.outside ? 0 : p.cost), 0);
}
export const remainingAfter = (day: number) => BUDGET - spentToDate(day);

export function itemUseToDate(item: Item, day: number) {
  return DAYS.filter((d) => d.day <= day)
    .flatMap((d) => [d.lunch, d.dinner])
    .filter((x) => x.items.includes(item)).length;
}

export function pantryAt(day: number) {
  return PANTRY.map((p) => {
    const used = DAYS.filter((d) => d.day <= day)
      .flatMap((d) => [d.lunch, d.dinner])
      .reduce((s, x) => s + pantryDraw(x)[p.key], 0);
    const added = PANTRY_TOPUPS.filter((t) => t.day <= day && t.key === p.key).reduce(
      (s, t) => s + t.amount,
      0,
    );
    const left = Math.max(0, p.owned + added - used);
    return { ...p, used, added, left, pct: Math.min(100, (left / (p.owned + added)) * 100) };
  });
}

export const purchasesOn = (day: number) => PURCHASES.filter((p) => p.day === day);

export const dayById = (day: number) => DAYS.find((d) => d.day === day)!;

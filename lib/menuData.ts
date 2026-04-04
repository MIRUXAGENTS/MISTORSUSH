export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  nameHe?: string;
  price: number;
  ingredients: string;
  ingredientsEn: string;
  ingredientsHe?: string;
  image?: string;
  is_available?: boolean;
}

export interface MenuCategory {
  category: string;
  categoryEn: string;
  categoryHe?: string;
  slug: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    category: 'Классические роллы',
    categoryEn: 'Classic Rolls',
    categoryHe: 'רולים קלאסיים',
    slug: 'classic_rolls',
    items: [],
  },
  {
    category: 'Запеченные роллы',
    categoryEn: 'Baked Rolls',
    categoryHe: 'רולים אפויים',
    slug: 'baked_rolls',
    items: [],
  },
  {
    category: 'Необычные роллы',
    categoryEn: 'Unusual Rolls',
    categoryHe: 'רולים יוצאי דופן',
    slug: 'unusual_rolls',
    items: [],
  },
  {
    category: 'Рисовые гамбургеры',
    categoryEn: 'Rice Burgers',
    categoryHe: 'המבורגרי אורז',
    slug: 'burgers',
    items: [],
  },
  {
    category: 'Гункан и суши',
    categoryEn: 'Gunkan and Sushi',
    categoryHe: 'גונקן וסושי',
    slug: 'gunkan',
    items: [],
  },
  {
    category: 'Напитки',
    categoryEn: 'Drinks',
    categoryHe: 'משקאות',
    slug: 'drinks',
    items: [],
  },
];

export const categoryBg: Record<string, { bg: string; border: string }> = {
  classic_rolls: { bg: 'bg-[#12141a]', border: 'border-[#1e2330]' },
  baked_rolls:   { bg: 'bg-[#1c1814]', border: 'border-[#2e2620]' },
  unusual_rolls: { bg: 'bg-[#1c1a14]', border: 'border-[#423821]' },
  burgers:       { bg: 'bg-[#1e1c16]', border: 'border-[#332b21]' },
  gunkan:        { bg: 'bg-[#181a1d]', border: 'border-[#252a33]' },
  drinks:        { bg: 'bg-[#2a2d39]', border: 'border-[#3a3e4c]' },
};

export const categoryIcons: Record<string, string> = {
  'Классические роллы': '🍣',
  'Запеченные роллы': '🔥',
  'Необычные роллы': '✨',
  'Рисовые гамбургеры': '🍔',
  'Гункан и суши': '🥢',
  'Напитки': '🥤',
};

/** Helper: get display name for an item based on lang */
export function getItemName(item: MenuItem, lang: string): string {
  if (lang === 'he' && item.nameHe) return item.nameHe;
  if (lang === 'en') return item.nameEn;
  return item.name;
}

/** Helper: get display ingredients for an item based on lang */
export function getItemIngredients(item: MenuItem, lang: string): string {
  if (lang === 'he' && item.ingredientsHe) return item.ingredientsHe;
  if (lang === 'en') return item.ingredientsEn;
  return item.ingredients;
}

/** Helper: get display category name based on lang */
export function getCategoryName(cat: MenuCategory, lang: string): string {
  if (lang === 'he' && cat.categoryHe) return cat.categoryHe;
  if (lang === 'en') return cat.categoryEn;
  return cat.category;
}

/** Helper: resolve full image path if shorthand is used */
export function resolveImagePath(image: string | undefined | null, categorySlug: string): string | null {
  if (!image) return null;

  let processed = image;
  // Auto-fix: if it starts with /img/ but not /img/products/, insert it
  if (processed.startsWith('/img/') && !processed.startsWith('/img/products/')) {
    processed = processed.replace('/img/', '/img/products/');
  }

  // If it's already a full path or URL, return as is
  if (processed.startsWith('/') || processed.startsWith('http')) {
    return processed;
  }
  
  // Otherwise, assume it's just a filename in the standard category folder
  return `/img/products/${categorySlug}/${processed}`;
}

/** Helper: resolve image path specifically for a MenuItem */
export function getItemImage(item: MenuItem, categorySlug: string): string | null {
  return resolveImagePath(item.image, categorySlug);
}

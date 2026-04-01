'use client';

import { MenuCategory } from '@/lib/menuData';
import { useLang } from '@/context/LangContext';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategoryIndex: number;
  isSearchActive: boolean;
  onSelect: (index: number) => void;
}

export default function CategoryNav({
  categories,
  activeCategoryIndex,
  isSearchActive,
  onSelect,
}: CategoryNavProps) {
  const { lang } = useLang();

  return (
    <nav className="overflow-x-auto no-scrollbar flex gap-2 px-4 py-3 border-t border-white/5" id="categoryNav">
      {categories.map((cat, index) => {
        const isActive = !isSearchActive && index === activeCategoryIndex;
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect(index)}
            className={`category-link whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
              isActive
                ? 'text-brand border-brand/30 bg-brand/10'
                : 'text-muted border-white/5 bg-card hover:bg-white/5'
            }`}
          >
            {lang === 'en' ? cat.categoryEn : cat.category}
          </button>
        );
      })}
    </nav>
  );
}

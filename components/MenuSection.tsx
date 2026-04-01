'use client';

import { MenuCategory, MenuItem } from '@/lib/menuData';
import { useLang } from '@/context/LangContext';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  category: MenuCategory;
  filteredItems?: MenuItem[]; // If search is active
  onImageClick: (url: string) => void;
}

export default function MenuSection({ category, filteredItems, onImageClick }: MenuSectionProps) {
  const { lang, t } = useLang();
  const itemsToRender = filteredItems || category.items;

  if (itemsToRender.length === 0) return null;

  return (
    <div id={category.slug} className="scroll-mt-36" data-category={category.slug}>
      <h2 className="text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 drop-shadow-sm px-1">
        <div className="w-1.5 h-6 sm:h-8 bg-brand rounded-full shadow-[0_0_10px_rgba(230,57,70,0.5)]"></div>
        {lang === 'en' ? category.categoryEn : category.category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {itemsToRender.map((item) => (
          <ProductCard key={item.id} item={item} categorySlug={category.slug} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  );
}

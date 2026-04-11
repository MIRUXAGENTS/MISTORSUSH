'use client';

import { MenuCategory, MenuItem, getCategoryName } from '@/lib/menuData';
import { useLang } from '@/context/LangContext';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  category: MenuCategory;
  filteredItems?: MenuItem[];
  onImageClick: (url: string) => void;
  showTitle?: boolean;
}

export default function MenuSection({ category, filteredItems, onImageClick, showTitle = true }: MenuSectionProps) {
  const { lang } = useLang();
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated so we can use client-side language
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const itemsToRender = filteredItems || category.items.filter(i => i.is_available !== false || true);

  if (itemsToRender.length === 0) return null;

  return (
    <div id={category.slug} className="scroll-mt-36" data-category={category.slug}>
      {showTitle && (
        <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center text-white uppercase tracking-tight">
          {getCategoryName(category, lang || 'ru')}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {itemsToRender.map((item) => (
          <ProductCard key={item.id} item={item} categorySlug={category.slug} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  );
}

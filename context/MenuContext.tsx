'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { sb } from '@/lib/supabase';
import { MenuCategory, menuCategories } from '@/lib/menuData';
import { SupabaseProduct } from '@/lib/supabase-server';

export interface MenuContextType {
  menuData: MenuCategory[];
  loading: boolean;
  refetchMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType>({ menuData: [], loading: true, refetchMenu: async () => { } });

export const useMenu = () => useContext(MenuContext);

/**
 * Transform raw Supabase products into MenuCategory structure
 */
function transformProductsToMenu(products: SupabaseProduct[]): MenuCategory[] {
  const liveCategories: MenuCategory[] = menuCategories.map(cat => ({
    ...cat,
    items: []
  }));

  products.forEach(p => {
    let catObj = liveCategories.find(c => c.slug === p.category);
    if (!catObj) {
      catObj = { category: p.category, categoryEn: p.category, slug: p.category, items: [] };
      liveCategories.push(catObj);
    }

    if (p.is_available) {
      catObj.items.push({
        id: String(p.id),
        name: p.name,
        nameEn: p.name_en || '',
        nameHe: p.name_he || '',
        price: p.price,
        ingredients: p.ingredients || '',
        ingredientsEn: p.ingredients_en || '',
        ingredientsHe: p.ingredients_he || '',
        image: p.image_url,
        is_available: p.is_available
      });
    }
  });

  return liveCategories.filter(c => c.items.length > 0);
}

export const MenuProvider = ({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData?: SupabaseProduct[];
}) => {
  const [menuData, setMenuData] = useState<MenuCategory[]>(() => {
    // Initialize from server data if provided
    if (initialData && initialData.length > 0) {
      return transformProductsToMenu(initialData);
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    // If we have initial data, we're not loading
    return !initialData || initialData.length === 0;
  });

  const refetchMenu = async () => {
    setLoading(true);
    const { data, error } = await sb.from('products').select('*').neq('category', 'system_config');
    if (error || !data) {
      setLoading(false);
      return;
    }
    setMenuData(transformProductsToMenu(data));
    setLoading(false);
  };

  return <MenuContext.Provider value={{ menuData, loading, refetchMenu }}>{children}</MenuContext.Provider>;
};

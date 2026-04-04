'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { sb } from '@/lib/supabase';
import { MenuCategory, menuCategories } from '@/lib/menuData';

interface MenuContextType {
  menuData: MenuCategory[];
  loading: boolean;
}

const MenuContext = createContext<MenuContextType>({ menuData: [], loading: true });

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveMenu() {
      const { data, error } = await sb.from('products').select('*').neq('category', 'system_config');
      if (error || !data) {
        setLoading(false);
        return;
      }

      // Initialize all categories with empty items array
      const liveCategories: MenuCategory[] = menuCategories.map(cat => ({
        ...cat,
        items: []
      }));

      data.forEach(p => {
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
            price: p.price,
            ingredients: p.ingredients || '',
            ingredientsEn: p.ingredients_en || '',
            image: p.image_url,
            is_available: p.is_available
          });
        }
      });

      setMenuData(liveCategories.filter(c => c.items.length > 0));
      setLoading(false);
    }

    fetchLiveMenu();
  }, []);

  return <MenuContext.Provider value={{ menuData, loading }}>{children}</MenuContext.Provider>;
};

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLang } from '@/context/LangContext';
import { menuData, MenuItem } from '@/lib/menuData';
import { verifyPromoDay } from '@/lib/promoUtils';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Components
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuSection from '@/components/MenuSection';
import CartWidget from '@/components/CartWidget';
import NavDrawer from '@/components/NavDrawer';
import ScrollTopButton from '@/components/ScrollTopButton';

// Modals
import CartModal from '@/components/modals/CartModal';
import UpsellModal from '@/components/modals/UpsellModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import AuthModal from '@/components/modals/AuthModal';
import ProfileModal from '@/components/modals/ProfileModal';
import ImageLightbox from '@/components/modals/ImageLightbox';

import { useCart } from '@/context/CartContext';

export default function Home() {
  const { cart } = useCart();
  const { lang, t } = useLang();

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Upsell state
  const [upsellSuggestions, setUpsellSuggestions] = useState<MenuItem[]>([]);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    checkSession();
    verifyPromoDay().then(setIsPromoActive);

    // Auth listener
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const { data: { session } } = await sb.auth.getSession();
    setCurrentUser(session?.user || null);
  }

  // Scroll spy for categories
  useEffect(() => {
    if (searchQuery) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      let activeIndex = 0;
      for (let i = menuData.length - 1; i >= 0; i--) {
        const el = document.getElementById(menuData[i].slug);
        if (el && el.offsetTop <= scrollPos) {
          activeIndex = i;
          break;
        }
      }
      setActiveCategoryIndex(activeIndex);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchQuery]);

  const scrollToCategory = (index: number) => {
    setSearchQuery('');
    setActiveCategoryIndex(index);
    const el = document.getElementById(menuData[index].slug);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120, // offset for fixed header + nav
        behavior: 'smooth',
      });
    }
  };

  const handleCheckoutClick = () => {
    const suggestions = getUpsellSuggestions();
    if (suggestions.length === 0) {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    } else {
      setUpsellSuggestions(suggestions);
      setIsCartOpen(false);
      setIsUpsellOpen(true);
    }
  };

  const getUpsellSuggestions = (): MenuItem[] => {
    if (Object.keys(cart).length === 0) return [];

    let hasSushi = false;
    let hasDrinks = false;
    let hasSauces = false;

    const sushiCategories = ["Классические роллы", "Запеченные роллы"];
    const drinksCategory = "Напитки";
    const saucesCategory = "Соусы";

    for (const id of Object.keys(cart)) {
      if (cart[id] > 0) {
        let itemCat = "";
        menuData.forEach(c => c.items.forEach(i => { if (i.id === id) itemCat = c.category; }));
        if (sushiCategories.includes(itemCat)) hasSushi = true;
        if (itemCat === drinksCategory) hasDrinks = true;
        if (itemCat === saucesCategory) hasSauces = true;
      }
    }

    const availableDrinks = menuData.find(c => c.category === drinksCategory)?.items || [];
    const availableSauces = menuData.find(c => c.category === saucesCategory)?.items || [];

    let cheapRolls: MenuItem[] = [];
    menuData.filter(c => sushiCategories.includes(c.category)).forEach(cat => {
      cat.items.forEach(i => { if (i.price < 30) cheapRolls.push(i); });
    });

    let allOtherItems: MenuItem[] = [];
    menuData.forEach(cat => cat.items.forEach(i => allOtherItems.push(i)));

    const getRandom = (arr: MenuItem[], n: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    let suggestions: MenuItem[] = [];
    if (hasSushi && !hasDrinks && !hasSauces) {
      suggestions = [...getRandom(availableDrinks, 3), ...getRandom(availableSauces, 3)];
    } else if (hasSushi && hasDrinks && !hasSauces) {
      suggestions = [...getRandom(availableSauces, 3), ...getRandom(cheapRolls, 3)];
    } else if (hasSushi && hasSauces && !hasDrinks) {
      suggestions = [...getRandom(availableDrinks, 3), ...getRandom(cheapRolls, 3)];
    }

    if (suggestions.length < 6) {
      const needed = 6 - suggestions.length;
      const currentIds = new Set(suggestions.map(i => i.id));
      const paddingPool = allOtherItems.filter(i => !currentIds.has(i.id));
      suggestions = [...suggestions, ...getRandom(paddingPool, needed)];
    }

    return suggestions.slice(0, 6);
  };

  // Search filtering
  const filteredMenuData = useMemo(() => {
    if (!searchQuery) return menuData;
    const lowerQ = searchQuery.toLowerCase();

    return menuData.map(cat => {
      const filteredItems = cat.items.filter(item =>
        item.name.toLowerCase().includes(lowerQ) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(lowerQ)) ||
        item.ingredients.toLowerCase().includes(lowerQ) ||
        (item.ingredientsEn && item.ingredientsEn.toLowerCase().includes(lowerQ))
      );
      return { ...cat, items: filteredItems };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <Header
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => currentUser ? setIsProfileOpen(true) : setIsAuthOpen(true)}
          isLoggedIn={!!currentUser}
        />
        <CategoryNav
          categories={menuData}
          activeCategoryIndex={activeCategoryIndex}
          isSearchActive={searchQuery.length > 0}
          onSelect={scrollToCategory}
        />
      </div>

      <main className="pt-[230px] sm:pt-[240px] px-4 pb-24 max-w-7xl mx-auto space-y-12">
        {searchQuery && (
          <div className="mb-8 text-white/80 font-medium">
            {t('searchResults')} "{searchQuery}": {filteredMenuData.reduce((acc, cat) => acc + cat.items.length, 0)} {lang === 'en' ? 'items found' : 'найдено'}
            {filteredMenuData.length === 0 && (
              <div className="mt-8 text-center text-muted text-lg">{t('noResults')}</div>
            )}
          </div>
        )}

        {(searchQuery ? filteredMenuData : menuData).map(cat => (
          <MenuSection
            key={cat.slug}
            category={cat}
            filteredItems={searchQuery ? cat.items : undefined}
            onImageClick={(url) => setLightboxImage(url)}
          />
        ))}
      </main>

      {/* Globals UI */}
      <CartWidget onOpen={() => setIsCartOpen(true)} isPromoActive={isPromoActive} />
      <ScrollTopButton />

      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={menuData}
        activeCategoryIndex={activeCategoryIndex}
        onSelectCategory={scrollToCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckoutClick}
        isPromoActive={isPromoActive}
      />

      <UpsellModal
        isOpen={isUpsellOpen}
        suggestions={upsellSuggestions}
        onSkip={() => { setIsUpsellOpen(false); setIsCheckoutOpen(true); }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBack={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }}
        isPromoActive={isPromoActive}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsProfileOpen(true)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => { sb.auth.signOut(); setIsProfileOpen(false); }}
        currentUser={currentUser}
      />

      <ImageLightbox
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage || ''}
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}

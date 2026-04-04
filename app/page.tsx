'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useLang } from '@/context/LangContext';
import { MenuItem, MenuCategory } from '@/lib/menuData';
import { useMenu } from '@/context/MenuContext';
import { verifyPromoDay } from '@/lib/promoUtils';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

// Components
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuSection from '@/components/MenuSection';
import CartWidget from '@/components/CartWidget';
import NavDrawer from '@/components/NavDrawer';
import ScrollTopButton from '@/components/ScrollTopButton';
import Footer from '@/components/Footer';

// Modals
import CartModal from '@/components/modals/CartModal';
import UpsellModal from '@/components/modals/UpsellModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import AuthModal from '@/components/modals/AuthModal';
import ProfileModal from '@/components/modals/ProfileModal';
import AccessibilityModal from '@/components/modals/AccessibilityModal';
import AboutModal from '@/components/modals/AboutModal';
import PromotionsModal from '@/components/modals/PromotionsModal';
const ImageLightbox = dynamic(() => import('@/components/modals/ImageLightbox'), { ssr: false });

import { useCart } from '@/context/CartContext';

export default function Home() {
  const { cart } = useCart();
  const { lang, t } = useLang();

  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [isSiteDisabled, setIsSiteDisabled] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPromosOpen, setIsPromosOpen] = useState(false);

  // Upsell state
  const [upsellSuggestions, setUpsellSuggestions] = useState<MenuItem[]>([]);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { menuData, loading } = useMenu();

  // Dynamic header height
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(320);



  // Initial load
  useEffect(() => {
    checkSession();
    verifyPromoDay().then(setIsPromoActive);
    checkSiteStatus();

    // Auth listener
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Measure fixed header height dynamically
  useEffect(() => {
    if (!headerRef.current) return;
    const obs = new ResizeObserver(() => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    });
    obs.observe(headerRef.current);
    setHeaderHeight(headerRef.current.offsetHeight);
    return () => obs.disconnect();
  }, []);

  async function checkSiteStatus() {
    const { data, error } = await sb.from('products').select('is_available').eq('name', 'system_site_status').single();
    if (!error && data && data.is_available === false) {
      setIsSiteDisabled(true);
    }
  }

  async function checkSession() {
    const { data: { session } } = await sb.auth.getSession();
    setCurrentUser(session?.user || null);
  }

  // Category nav: update active index, NO scroll
  const selectCategory = (index: number) => {
    setSearchQuery('');
    setActiveCategoryIndex(index);
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
      <div ref={headerRef} className="absolute sm:fixed top-0 left-0 w-full z-50 bg-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
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
          onSelect={selectCategory}
        />
      </div>

      <main style={{ paddingTop: headerHeight + 12 }} className="px-4 sm:px-8 pb-24 w-full space-y-12 sm:pt-0">
        {searchQuery && (
          <div className="mb-8 text-white/80 font-medium">
            {t('searchResults')} "{searchQuery}": {filteredMenuData.reduce((acc, cat) => acc + cat.items.length, 0)} {lang === 'en' ? 'items found' : 'найдено'}
            {filteredMenuData.length === 0 && (
              <div className="mt-8 text-center text-muted text-lg">{t('noResults')}</div>
            )}
          </div>
        )}

        {searchQuery ? (
          filteredMenuData.map(cat => (
            <MenuSection
              key={cat.slug}
              category={cat}
              filteredItems={cat.items}
              onImageClick={(url) => setLightboxImage(url)}
            />
          ))
        ) : (
          menuData[activeCategoryIndex] && (
            <MenuSection
              key={menuData[activeCategoryIndex].slug}
              category={menuData[activeCategoryIndex]}
              onImageClick={(url) => setLightboxImage(url)}
            />
          )
        )}
      </main>

      {/* Globals UI */}
      <CartWidget onOpen={() => setIsCartOpen(true)} isPromoActive={isPromoActive} />
      <ScrollTopButton />

      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={menuData}
        activeCategoryIndex={activeCategoryIndex}
        onSelectCategory={selectCategory}
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
        onGoToCart={() => { setIsUpsellOpen(false); setIsCartOpen(true); }}
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

      {/* Accessibility Floating Button */}
      <button
        onClick={() => setIsAccessibilityOpen(true)}
        className="fixed left-4 bottom-24 w-12 h-12 bg-white text-blue-600 rounded-full shadow-2xl flex items-center justify-center z-[50] hover:scale-110 active:scale-95 transition-all border-2 border-transparent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="1.5" />
          <path d="M7 11h10M9 11v3l2 2v4M15 11v3l-2 2v4" />
        </svg>
      </button>

      <ImageLightbox
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage || ''}
        onClose={() => setLightboxImage(null)}
      />

      {isSiteDisabled && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-dark border border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.15)] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full" />
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner bg-amber-500/10 text-amber-500 border border-amber-500/20 relative z-10 animate-pulse">
              ⏳
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-4 relative z-10">
              {lang === 'ru' ? (
                <>Готовим с любовью, но сейчас —<br /><span className="text-amber-500">очень стараемся успеть!</span></>
              ) : (
                <>Cooking with love, but right now —<br /><span className="text-amber-500">we're working at full capacity!</span></>
              )}
            </h2>
            <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-6 relative z-10" />
            <div className="space-y-4 text-white/80 font-medium leading-relaxed text-sm relative z-10">
              <p>
                {lang === 'ru'
                  ? "Друзья, мы получили очень много заказов и хотим, чтобы каждый из них был выполнен идеально. Чтобы не подвести вас и сохранить качество, мы временно приостановили прием новых чеков."
                  : "Friends, we've received many orders and want each one to be perfect. To maintain quality and not let you down, we've temporarily paused accepting new orders."}
              </p>
              <p>
                {lang === 'ru'
                  ? "Пожалуйста, загляните к нам чуть позже — мы скоро разберемся с текущими заказами и снова будем в строю. Приносим извинения за неудобства!"
                  : "Please check back a bit later — we'll handle the current queue and be back in action soon. Sorry for the inconvenience!"}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 w-full relative z-10">
              <p className="text-[#25D366] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 text-center leading-snug">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {lang === 'ru'
                  ? "Ваш уже оформленный заказ в работе и будет доставлен вовремя"
                  : "Your already placed order is being processed and will be delivered on time"}
              </p>
            </div>
          </div>
        </div>
      )}

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <PromotionsModal
        isOpen={isPromosOpen}
        onClose={() => setIsPromosOpen(false)}
        isPromoActive={isPromoActive}
      />
      <Footer
        onAboutClick={() => setIsAboutOpen(true)}
        onPromosClick={() => setIsPromosOpen(true)}
      />
    </>
  );
}

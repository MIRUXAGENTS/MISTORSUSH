'use client';

import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { menuData } from '@/lib/menuData';

interface CartWidgetProps {
  onOpen: () => void;
  isPromoActive: boolean;
}

export default function CartWidget({ onOpen, isPromoActive }: CartWidgetProps) {
  const { cartCount, cartSubtotal, cart } = useCart();
  const { t } = useLang();

  function calculateDiscount(): number {
    if (!isPromoActive) return 0;
    const bakedCat = menuData.find((c) => c.category === 'Запеченные роллы');
    if (!bakedCat) return 0;
    const bakedIds = new Set(bakedCat.items.filter((i) => i.is_available !== false).map((i) => i.id));
    const prices: number[] = [];
    for (const [id, count] of Object.entries(cart)) {
      if (count > 0 && bakedIds.has(id)) {
        const item = bakedCat.items.find((i) => i.id === id);
        if (item) for (let j = 0; j < count; j++) prices.push(item.price);
      }
    }
    const freeCount = Math.floor(prices.length / 3);
    if (freeCount === 0) return 0;
    prices.sort((a, b) => a - b);
    return prices.slice(0, freeCount).reduce((s, p) => s + p, 0);
  }

  const discount = calculateDiscount();
  const total = cartSubtotal - discount;

  return (
    <div
      id="cartWidget"
      className={`fixed bottom-0 left-0 w-full p-4 transform transition-transform duration-300 z-40 ${
        cartCount > 0 ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
    >
      <div
        className="glass-cart rounded-2xl flex justify-between items-center p-4 cursor-pointer active:scale-95 transition-transform"
        onClick={onOpen}
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/90">
            {t('inCart')} {cartCount} {t('pcs')}
          </span>
          <span className="text-xl font-bold">{total}₪</span>
        </div>
        <div className="flex items-center gap-2 bg-white text-brand px-5 py-2.5 rounded-xl font-semibold shadow-lg">
          <span>{t('orderBtn')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

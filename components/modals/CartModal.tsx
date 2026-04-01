'use client';

import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { menuData } from '@/lib/menuData';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  isPromoActive: boolean;
}

export default function CartModal({ isOpen, onClose, onCheckout, isPromoActive }: CartModalProps) {
  const { cartItems, addToCart, removeFromCart, cartSubtotal } = useCart();
  const { lang, t } = useLang();

  function calculateDiscount(): number {
    if (!isPromoActive) return 0;
    const bakedCat = menuData.find((c) => c.category === 'Запеченные роллы');
    if (!bakedCat) return 0;
    const bakedIds = new Set(bakedCat.items.filter((i) => i.is_available !== false).map((i) => i.id));
    const prices: number[] = [];
    for (const ci of cartItems) {
      if (bakedIds.has(ci.item.id)) {
        for (let j = 0; j < ci.count; j++) prices.push(ci.item.price);
      }
    }
    const freeCount = Math.floor(prices.length / 3);
    if (freeCount === 0) return 0;
    prices.sort((a, b) => a - b);
    return prices.slice(0, freeCount).reduce((s, p) => s + p, 0);
  }

  const discount = calculateDiscount();
  const total = cartSubtotal - discount;
  const isEmpty = cartItems.length === 0;

  return (
    <div
      id="cartModal"
      className={`fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-dark w-full sm:w-[450px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0 sm:translate-y-0' : 'translate-y-full sm:translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{t('myCart')}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="p-4 overflow-y-auto flex-grow custom-scrollbar space-y-2">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-48 text-center pt-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-muted mb-4 opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <p className="text-white/60 font-medium tracking-wide">{t('cartEmpty')}</p>
              <p className="text-xs text-white/30 mt-1">{t('cartEmptySub')}</p>
            </div>
          ) : (
            <>
              {cartItems.map((ci) => (
                <div key={ci.item.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <div className="flex-1 pr-3">
                    <h4 className="text-[15px] font-bold text-white/95">
                      {lang === 'en' ? ci.item.nameEn : ci.item.name}
                    </h4>
                    <span className="text-brand font-bold mt-0.5 inline-block text-[15px]">{ci.item.price}₪</span>
                  </div>
                  <div className="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shrink-0">
                    <button onClick={() => removeFromCart(ci.item.id)} className="w-8 h-8 flex items-center justify-center text-muted active:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{ci.count}</span>
                    <button onClick={() => addToCart(ci.item.id)} className="w-8 h-8 flex items-center justify-center text-brand active:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between items-center py-2 text-brand text-sm font-bold border-t border-brand/30 mt-2">
                  <span>{t('promo2plus1Popup')}</span>
                  <span>-{discount}₪</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-card rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80 font-medium text-sm">{t('total')}</span>
            <span className="text-2xl font-bold text-brand">{total}₪</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onCheckout}
              disabled={isEmpty}
              className="w-full bg-brand text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition shadow-lg shadow-brand/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
            >
              {t('checkoutBtn')}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white/5 text-white/90 font-medium py-3 rounded-xl active:scale-[0.98] transition border border-white/10"
            >
              {t('continueBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

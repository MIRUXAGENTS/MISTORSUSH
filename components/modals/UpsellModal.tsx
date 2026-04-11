'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MenuItem, getItemName } from '@/lib/menuData';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';

interface UpsellModalProps {
  isOpen: boolean;
  onSkip: () => void;
  onGoToCart: () => void;
  suggestions: MenuItem[];
}

export default function UpsellModal({ isOpen, onSkip, onGoToCart, suggestions }: UpsellModalProps) {
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const { lang, t } = useLang();

  // Track if the user added any upsell items in this session
  const [upsellAdded, setUpsellAdded] = useState(false);

  // Reset state when modal is opened fresh
  useEffect(() => {
    if (isOpen) setUpsellAdded(false);
  }, [isOpen]);

  const handleAdd = (id: string) => {
    addToCart(id);
    setUpsellAdded(true);
  };

  const handleRemove = (id: string, currentCount: number) => {
    removeFromCart(id);
    // If removing the last upsell item set added back to false
    if (currentCount <= 1) {
      const anyLeft = suggestions.some(s => getItemCount(s.id) > (s.id === id ? 1 : 0));
      if (!anyLeft) setUpsellAdded(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[55] flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div
        className={`bg-dark w-full sm:w-[500px] md:w-[700px] lg:w-[940px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-transform duration-300 ${isOpen ? 'translate-y-0 sm:translate-y-0' : 'translate-y-full sm:translate-y-10'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onSkip} className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 active:text-white active:scale-95 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-white tracking-tight">{t('upsellTitle')}</h2>
          </div>
        </div>

        <div className="pt-6 pb-2 overflow-x-hidden overflow-y-auto flex-grow custom-scrollbar">
          <div className="flex flex-nowrap lg:grid lg:grid-cols-6 overflow-x-auto lg:overflow-visible gap-4 pb-6 no-scrollbar -mx-4 lg:mx-0 px-4 lg:px-6 snap-x snap-mandatory">
            {suggestions.map((item) => {
              const count = getItemCount(item.id);
              return (
                <div key={item.id} className="upsell-card shrink-0 w-[140px] lg:w-full lg:max-w-[140px] bg-card p-3 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center relative overflow-hidden group snap-center min-h-[160px]">
                  {item.image && (
                    <div className="w-[90px] h-[90px] mb-2 flex items-center justify-center relative bg-white/5 rounded-xl">
                      <Image src={item.image} alt={item.name} fill sizes="90px" className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <h3 className={`font-bold text-[13px] leading-tight text-center text-white/95 line-clamp-2 min-h-[30px] w-full mb-1 ${!item.image ? 'mt-4' : ''}`}>
                    {getItemName(item, lang)}
                  </h3>
                  <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-white/5 h-[40px]">
                    <span className="font-bold text-sm text-brand">{item.price}₪</span>
                    {count > 0 ? (
                      <div className="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shadow-inner">
                        <button type="button" onClick={() => handleRemove(item.id, count)} className="w-7 h-7 flex items-center justify-center text-muted hover:text-white active:scale-95 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">{count}</span>
                        <button type="button" onClick={() => handleAdd(item.id)} className="w-7 h-7 flex items-center justify-center text-brand hover:text-white active:scale-95 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => handleAdd(item.id)} className="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center active:scale-90 transition-all border border-white/10 hover:bg-white/10 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-card rounded-b-2xl shrink-0">
          {upsellAdded ? (
            <button
              type="button"
              onClick={onGoToCart}
              className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span>{t('upsellCheckoutBtn')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="w-full bg-white/5 text-white/90 border border-white/10 font-bold py-3.5 rounded-xl active:scale-[0.98] transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>{t('upsellNoThanks')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

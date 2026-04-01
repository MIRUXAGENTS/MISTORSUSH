'use client';

import Image from 'next/image';
import { MenuItem, categoryBg } from '@/lib/menuData';
import { useLang } from '@/context/LangContext';
import CartControls from './CartControls';

interface ProductCardProps {
  item: MenuItem;
  categorySlug: string;
  onImageClick: (url: string) => void;
}

export default function ProductCard({ item, categorySlug, onImageClick }: ProductCardProps) {
  const { lang, t } = useLang();
  const isAvailable = item.is_available !== false;
  const colors = categoryBg[categorySlug] || { bg: 'bg-card', border: 'border-white/5' };
  const isUnusual = categorySlug === 'unusual_rolls';
  const shadowClass = isUnusual
    ? 'shadow-[0_0_20px_rgba(218,165,32,0.15)] shadow-black/40'
    : 'shadow-lg shadow-black/30';

  return (
    <div
      className={`product-card flex gap-4 ${colors.bg} p-4 rounded-[1.5rem] border ${colors.border} ${shadowClass} transition-all duration-300 ${!isAvailable ? 'opacity-60 grayscale-[0.7] contrast-[0.8]' : ''} relative group hover:border-brand/40`}
    >
      {/* Out of stock badge */}
      {!isAvailable && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center">
          <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
            {t('outOfStock')}
          </span>
        </div>
      )}

      {/* Image */}
      {item.image && (
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg relative transition-all group-hover:scale-105 duration-300 cursor-zoom-in"
          onClick={() => onImageClick(item.image!)}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
            </svg>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div className="mb-2">
          <h3 className="font-bold text-[14px] sm:text-[16px] leading-snug text-white/95 mb-1 line-clamp-2">
            {lang === 'en' ? item.nameEn : item.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-muted leading-relaxed line-clamp-2 opacity-70">
            {lang === 'en' ? item.ingredientsEn : item.ingredients}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className={`font-black text-sm sm:text-lg text-brand ${!isAvailable ? 'opacity-50' : ''}`}>
            {item.price}₪
          </span>
          <CartControls item={item} />
        </div>
      </div>
    </div>
  );
}

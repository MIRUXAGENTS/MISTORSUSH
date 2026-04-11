import Image from 'next/image';
import { MenuItem, categoryBg, getItemName, getItemImage, getItemIngredients } from '@/lib/menuData';
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

  const displayName = getItemName(item, lang);
  const imageUrl = getItemImage(item, categorySlug);
  // Always show the "other" language as subtitle  
  const subName = lang === 'ru' ? item.nameEn : lang === 'en' ? item.name : item.nameEn;

  return (
    <div
      className={`product-card relative flex gap-3 ${colors.bg} p-4 rounded-[1.5rem] border ${colors.border} shadow-lg shadow-black/30 transition-all duration-300 group hover:border-brand/30 ${!isAvailable ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
      {/* Out of stock overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.5rem] pointer-events-none">
          <span className="bg-black/55 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
            {t('outOfStock')}
          </span>
        </div>
      )}

      {/* Image thumbnail (left) */}
      {imageUrl && (
        <div
          className="w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden relative cursor-zoom-in bg-black/20"
          onClick={() => isAvailable && onImageClick(imageUrl)}
        >
          <Image
            src={imageUrl}
            alt={`${displayName} - Суши Ашкелон Mistorsush`}
            fill
            sizes="72px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex-grow flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-[15px] leading-snug text-white/95 line-clamp-2">
            {displayName}
          </h3>
          {subName && (
            <p className="text-[11px] text-white/40 font-medium mt-0.5 line-clamp-1">
              {subName}
            </p>
          )}
          {/* Show ingredients only for lang-matched description if no image */}
          {!imageUrl && (
            <p className="text-[10px] text-muted leading-relaxed line-clamp-2 opacity-60 mt-1">
              {getItemIngredients(item, lang)}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className={`font-black text-[18px] text-brand leading-none ${!isAvailable ? 'opacity-50' : ''}`}>
            {item.price}<span className="text-[12px] font-bold">₪</span>
          </span>
          <CartControls item={item} />
        </div>
      </div>
    </div>
  );
}

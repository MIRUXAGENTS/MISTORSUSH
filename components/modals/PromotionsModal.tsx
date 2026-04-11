'use client';

import { useLang } from '@/context/LangContext';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPromoActive: boolean;
}

export default function PromotionsModal({ isOpen, onClose, isPromoActive }: PromotionsModalProps) {
  const { lang, t } = useLang();

  if (!isOpen) return null;

  const promos = [
    {
      id: 'friday_2plus1',
      title: lang === 'ru' ? 'Акция Пятницы: 2+1' : lang === 'he' ? 'מבצע 2+1 (שישי)' : 'Friday Promo: 2+1',
      description: lang === 'ru' 
        ? 'Купи два любых запеченных ролла и получи третий в подарок! Акция действует каждую пятницу на все виды запеченных роллов.' 
        : lang === 'he'
          ? 'קנו שני רולים אפויים מכל סוג וקבלו את השלישי במתנה! המבצע תקף בכל יום שישי על כל סוגי הרולים האפויים.'
          : 'Buy any two baked rolls and get the third one free! Promotion active every Friday on all types of baked rolls.',
      isActive: isPromoActive,
      icon: '🍣',
      time: lang === 'ru' ? 'Каждую пятницу' : lang === 'he' ? 'בכל יום שישי' : 'Every Friday'
    },
    {
      id: 'free_delivery',
      title: lang === 'ru' ? 'Бесплатная доставка' : lang === 'he' ? 'משלוח חינם' : 'Free Delivery',
      description: lang === 'ru' 
        ? 'Бесплатная доставка по Ашкелону при заказе от 250₪. Наслаждайтесь любимыми вкусами без лишних трат.' 
        : lang === 'he'
          ? 'משלוח חינם באשקלון בהזמנה מעל 250₪. תיהנו מהטעמים האהובים עליכם ללא עלויות נוספות.'
          : 'Free delivery in Ashkelon for orders over 250₪. Enjoy your favorite flavors without extra costs.',
      isActive: true, // Always active
      icon: '🏠',
      time: lang === 'ru' ? 'Всегда' : lang === 'he' ? 'תמיד' : 'Always'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      <div 
        className="bg-dark border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden relative animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        dir={lang === 'he' ? 'rtl' : 'ltr'}
      >
        <div className="p-8 pb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {lang === 'ru' ? 'Акции и Бонусы' : lang === 'he' ? 'מבצעים ובונוסים' : 'Promotions & Bonuses'}
            </h2>
            <button 
              onClick={onClose}
              className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 ${lang === 'he' ? 'mr-auto' : ''}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {promos.map((promo) => (
              <div 
                key={promo.id}
                className={`relative p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${
                  promo.isActive 
                  ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-emerald-500/5 border-emerald-500/20'
                }`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-4 ${lang === 'he' ? 'left-4' : 'right-4'} flex items-center gap-2`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    {lang === 'ru' ? 'Активно' : lang === 'he' ? 'פעיל' : 'Active'}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    <div className="w-full h-full rounded-full animate-ping opacity-30 bg-emerald-500" />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border bg-emerald-500/10 border-emerald-500/20">
                    {promo.icon}
                  </div>
                  <div className="space-y-1 text-start">
                    <h3 className="text-white font-black uppercase text-sm tracking-wide">{promo.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {promo.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                      <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{promo.time}</span>
                    </div>
                  </div>
                </div>

                {/* Decorative element */}
                <div className={`absolute -bottom-4 ${lang === 'he' ? '-left-4' : '-right-4'} w-20 h-20 blur-[40px] rounded-full transition-opacity group-hover:opacity-100 opacity-0 bg-emerald-500/10`} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center" />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { lang } = useLang();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      <div 
        className="bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        dir={lang === 'he' ? 'rtl' : 'ltr'}
      >
        {/* Header Image/Pattern */}
        <div className="h-32 bg-gradient-to-r from-brand/20 to-emerald-500/10 relative">
          <button 
            onClick={onClose}
            className={`absolute top-6 ${lang === 'he' ? 'left-6' : 'right-6'} w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10`}
          >
            ✕
          </button>
        </div>

        <div className="px-8 pb-10 -mt-12 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-dark overflow-hidden shadow-2xl mb-4 bg-card">
              <Image 
                src="/img/mistorsush_logo.webp" 
                alt="Vladislav Mazur" 
                width={96} 
                height={96} 
                className="object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              MISTOR<span className="text-brand">SUSHI</span>
            </h2>
            <p className="text-brand font-bold text-xs uppercase tracking-widest mt-1">
              {lang === 'ru' ? 'Авторский проект Владислава Мазура' : lang === 'he' ? 'פרויקט מקורי של ולדיסלב מזור' : 'Original Project by Vladislav Mazur'}
            </p>

            <div className="w-12 h-1 bg-brand rounded-full my-6" />

            <div className="space-y-6 text-white/80 text-sm leading-relaxed max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
              <p>
                {lang === 'ru' 
                  ? 'Добро пожаловать в Mistorsushi — авторский проект, где страсть к японской кухне встречается с безупречным качеством.' 
                  : lang === 'he' 
                    ? 'ברוכים הבאים ל-Mistorsushi - פרויקט מקורי שבו תשוקה למטבח היפני פוגשת איכות ללא פשרות.' 
                    : 'Welcome to Mistorsushi — an original project where passion for Japanese cuisine meets flawless quality.'}
              </p>

              <p>
                {lang === 'ru'
                  ? 'Основатель и шеф-повар проекта — Владислав Мазур, предприниматель из Ашкелона, который превратил свою любовь к созданию идеальных суши в дело всей жизни. Mistorsushi — это не массовое производство, а личный бренд, построенный на принципах самосовершенствования и искренной любви к своему делу.'
                  : lang === 'he'
                    ? 'המייסד והשף הראשי - ולדיסלב מזור, יזם מאשקלון, הפך את האהבה שלו להכנת סושי מושלם למשימת חייו. Mistorsushi הוא לא ייצור המוני, אלא מותג אישי הבנוי על עקרונות של שיפור עצמי ואהבה כנה למקצוע.'
                    : 'The founder and head chef — Vladislav Mazur, an entrepreneur from Ashkelon, turned his love for creating perfect sushi into a lifelong mission. Mistorsushi is not mass production, but a personal brand built on principles of self-improvement and sincere love for the craft.'}
              </p>

              <div className="grid grid-cols-1 gap-4 text-start">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-brand text-base">✨</span> {lang === 'ru' ? 'Только лучшее' : lang === 'he' ? 'רק הטוב ביותר' : 'Only the Best'}
                  </h3>
                  <p className="text-xs opacity-70">
                    {lang === 'ru'
                      ? 'Мы используем исключительно свежие ингредиенты. Каждый ролл — это гармония вкуса, созданная из продуктов высшего качества.'
                      : lang === 'he'
                        ? 'אנו משתמשים אך ורק ברכיבים טריים. כל רול הוא הרמוניה של טעמים, שנוצר מחומרי גלם באיכות פרימיום.'
                        : 'We use only the freshest ingredients. Every roll is a harmony of taste, created from premium products.'}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-brand text-base">🍣</span> {lang === 'ru' ? 'Авторский подход' : lang === 'he' ? 'גישה אישית' : 'Signature Approach'}
                  </h3>
                  <p className="text-xs opacity-70">
                    {lang === 'ru'
                      ? 'Наши рецепты — это сочетание классики и уникального видения шеф-повара, чтобы вы могли каждый раз открывать для себя что-то новое.'
                      : lang === 'he'
                        ? 'המתכונים שלנו הם שילוב של קלאסיקה עם חזון ייחודי של השף, כדי שתוכלו לגלות משהו חדש בכל פעם.'
                        : 'Our recipes combine classics with the unique vision of the chef, so you can discover something new every time.'}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-brand text-base">❤️</span> {lang === 'ru' ? 'Эстетика и удовольствие' : lang === 'he' ? 'אסתטיקה והנאה' : 'Aesthetics and Pleasure'}
                  </h3>
                  <p className="text-xs opacity-70">
                    {lang === 'ru'
                      ? 'Мы верим, что еда должна радовать не только вкусом, но и видом. Наш слоган: «Закажи себе немного удовольствия» — это то, что мы вкладываем в каждый заказ.'
                      : lang === 'he'
                        ? 'אנו מאמינים שאוכל צריך לשמח לא רק את החך, אלא גם את העין. הסלוגן שלנו: "תזמין לעצמך קצת הנאה" - זה מה שאנו משקיעים בכל הזמנה.'
                        : 'We believe food should delight not just the palate, but the eye. Our slogan: "Order yourself a bit of pleasure" is what we put into every order.'}
                  </p>
                </div>
              </div>

              <p className="pt-4 font-medium italic text-center border-t border-white/5">
                {lang === 'ru' 
                  ? 'С уважением, Владислав Мазур и команда Mistorsushi.' 
                  : lang === 'he'
                    ? 'בכבוד רב, ולדיסלב מזור וצוות Mistorsushi.'
                    : 'Respectfully, Vladislav Mazur and the Mistorsushi team.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

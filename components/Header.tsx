'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

export default function Header({ onOpenDrawer, onOpenCart, onOpenAuth, isLoggedIn, isAdmin }: HeaderProps) {
  const router = useRouter();
  const { cartCount } = useCart();
  const { lang, toggleLang, t } = useLang();

  return (
    <header className="bg-dark border-b border-white/10" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center px-4 py-3 relative">
        {/* Logo / Hamburger */}
        <div className="relative z-10 flex items-center shrink-0">
          <button onClick={onOpenDrawer} className="relative group active:scale-95 transition-transform duration-200">
            <Image
              src="/img/mistorsush_logo.webp"
              alt="Mistorsush Logo"
              width={64}
              height={64}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full shadow-lg border border-white/20 bg-white/5 group-hover:border-brand/40 transition-colors"
            />
            <div className={`absolute -bottom-1 ${lang === 'he' ? '-left-1' : '-right-1'} bg-brand text-white p-1 rounded-full shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* Right icons (now on the left in RTL) */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          {/* Lang */}
          <button onClick={toggleLang} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black tracking-wider text-white active:scale-95 transition shadow-lg border border-white/5">
            {lang.toUpperCase()}
          </button>

          {/* Admin */}
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin')} 
              title="Админ-панель"
              className="px-3 sm:px-4 h-9 rounded-full bg-brand flex items-center justify-center text-white active:scale-95 transition shadow-lg shadow-brand/20 border border-brand/50 text-[9px] sm:text-[10px] font-black uppercase tracking-widest"
            >
              Admin
            </button>
          )}
          
          {/* Account */}
          <button onClick={onOpenAuth} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition shadow-lg border border-white/5 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            {isLoggedIn && <div className={`absolute -top-0.5 ${lang === 'he' ? '-left-0.5' : '-right-0.5'} w-3 h-3 bg-emerald-500 border-2 border-dark rounded-full`} />}
          </button>
          {/* Cart */}
          <button onClick={onOpenCart} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 active:scale-95 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartCount > 0 && (
              <div className={`absolute -top-1 ${lang === 'he' ? '-left-1' : '-right-1'} bg-brand text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm shadow-black/50`}>
                {cartCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Brand Title */}
      <div className="flex flex-col items-center justify-center pb-2 pt-1 w-full">
        <h1 className="text-[20px] font-bold tracking-[0.3em] text-white/95 uppercase drop-shadow-md">
          MISTOR<span className="text-brand font-black">SUSH</span>
        </h1>
        <div className="w-10 h-[3px] bg-brand mt-2 rounded-full shadow-[0_0_8px_rgba(230,57,70,0.6)]" />
      </div>

      {/* Subtitles & Hours */}
      <div className="px-4 pb-4 flex flex-col items-center justify-center space-y-1.5 mt-2">
        <p className="text-[11px] font-bold tracking-widest text-muted uppercase text-center">
          {t('subtitle')}
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 mt-2 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">
            {lang === 'ru' ? 'работаем каждый день 12:00 — 23:00' : lang === 'he' ? 'פתוחים כל יום 12:00 — 23:00' : 'Open daily 12:00 — 23:00'}
          </span>
        </div>
      </div>

      {/* Friday promo banner */}
      <div className="w-full bg-gradient-to-r from-[#171a21] via-card to-[#171a21] border-y border-white/5 py-3.5 px-6 relative overflow-hidden flex items-center justify-center sm:justify-start shadow-xl shadow-black/30 group mt-1">
        <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-brand/20 blur-[30px] rounded-full" />
        <div className="absolute -right-5 -top-5 w-20 h-20 bg-white/10 blur-[25px] rounded-full" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 border border-brand/30 text-brand shadow-[0_0_15px_rgba(230,57,70,0.2)] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div className={`flex flex-col ${lang === 'he' ? 'text-right' : 'text-left'} justify-center`}>
            <span className="text-brand font-black text-sm uppercase tracking-wider leading-none">
              {t('promoTitle')}
            </span>
            <span className="text-white/90 text-[11px] font-medium leading-tight mt-1.5">
              {lang === 'ru' ? 'Все запеченные роллы' : lang === 'he' ? 'כל הרולים האפויים' : 'All baked rolls'}
              {' '}<strong className="text-white bg-white/10 px-1.5 py-0.5 rounded leading-none shadow-sm ml-1">2+1</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

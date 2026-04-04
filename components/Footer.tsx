'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/context/LangContext';

interface FooterProps {
  onAboutClick: () => void;
  onPromosClick: () => void;
}

export default function Footer({ onAboutClick, onPromosClick }: FooterProps) {
  const { lang } = useLang();

  const socialLinks = [
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com/mvladislavmistorsushi' },
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/972559284670' },
  ];

  const infoItems = [
    { name: lang === 'ru' ? 'Акции' : 'Promotions', onClick: onPromosClick },
    { name: lang === 'ru' ? 'О нас' : 'About Us', onClick: onAboutClick },
  ];

  return (
    <footer className="relative bg-[#0a0c10] border-t border-white/5 py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex items-center gap-4">
              <Image 
                src="/img/mistorsush_logo.webp" 
                alt="Logo" 
                width={64} 
                height={64} 
                className="rounded-full border border-white/10 shadow-2xl transition-transform hover:scale-105 duration-500"
              />
              <h2 className="text-xl font-black tracking-[0.3em] text-white uppercase">
                MISTOR<span className="text-brand">SUSH</span>
              </h2>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              {lang === 'ru' 
                ? 'Доставка суши в Ашкелоне. Только свежие ингредиенты.' 
                : 'Sushi delivery in Ashkelon. Only fresh ingredients.'}
            </p>
            
            {/* Socials Grouped Left/Center */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 hover:border-brand/40 hover:bg-brand/10 transition-all duration-500 shadow-lg"
                  title={social.name}
                >
                  <span className="text-lg">
                    {social.icon === '📸' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.097 3.389l-.717 2.624 2.691-.706c.801.441 1.713.689 2.686.689 3.181 0 5.767-2.586 5.767-5.767s-2.586-5.767-5.757-5.767zm3.387 8.064c-.156.438-.756.711-1.047.747-.282.034-.563.056-1.57-.363-1.008-.419-1.895-1.393-2.316-1.952-.421-.559-.724-1.21-.724-1.86s.331-1.246.541-1.456c.21-.21.458-.263.611-.263h.426c.137 0 .323.003.491.402.169.399.576 1.404.626 1.504.05.1.084.216.017.349s-.099.149-.199.266c-.099.117-.216.262-.308.353-.102.102-.204.214-.087.414.117.2.52 1.107 1.117 1.637.771.686 1.42 1.107 1.63 1.206.21.1.336.084.462-.063s.541-.632.684-.849c.143-.217.282-.184.471-.117s1.201.566 1.411.666c.21.1.35.15.399.233.05.083.05.483-.106.919z" />
                      </svg>
                    )}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Info Column & Hours */}
          <div className="flex flex-col items-center md:items-end space-y-8">
            <div className="flex gap-x-8 gap-y-4 flex-wrap justify-center md:justify-end">
              {infoItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={item.onClick}
                  className="text-muted hover:text-white text-sm font-black uppercase tracking-widest transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col items-center md:items-end bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
              <span className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-2">
                {lang === 'ru' ? 'График работы' : 'Opening Hours'}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[#25D366] text-xl font-black tracking-wider">12:00 — 23:00</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)]"></span>
                </span>
              </div>
              <span className="text-[9px] text-muted uppercase tracking-widest font-bold mt-2 opacity-60">
                {lang === 'ru' ? '* Каждый день' : '* Open Daily'}
              </span>
            </div>
          </div>

        </div>

        {/* Copyright & Made by */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-[10px] font-black uppercase tracking-widest">
            © 2026 MISTORSUSH. {lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
          </p>
          <div className="text-muted text-[10px] font-black uppercase tracking-[0.15em]">
            {lang === 'ru' ? 'Сделано в ' : 'Made by '}
            <a 
              href="https://mirux.io" 
              className="text-white hover:text-brand transition-all duration-300 font-black relative group"
            >
              MIRUX
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-brand/0 group-hover:bg-brand transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

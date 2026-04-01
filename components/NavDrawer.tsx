'use client';

import Image from 'next/image';
import { MenuCategory, categoryIcons } from '@/lib/menuData';
import { useLang } from '@/context/LangContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  activeCategoryIndex: number;
  onSelectCategory: (index: number) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
}

export default function NavDrawer({
  isOpen,
  onClose,
  categories,
  activeCategoryIndex,
  onSelectCategory,
  searchQuery,
  onSearch,
  onClearSearch,
}: NavDrawerProps) {
  const { lang } = useLang();

  return (
    <div className={`fixed inset-0 z-[60] flex pointer-events-none ${isOpen ? 'pointer-events-auto' : ''}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        className={`relative w-[300px] max-w-[85vw] bg-dark h-full shadow-2xl flex flex-col transform transition-transform duration-300 pointer-events-auto border-r border-white/10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-card">
          <div className="flex items-center gap-3">
            <Image src="/img/mistorsush_logo.png" alt="Logo" width={40} height={40} className="rounded-full border border-white/10" />
            <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase flex flex-col leading-tight">
              MISTOR<span className="text-brand">SUSH</span>
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-4 bg-dark/30 border-b border-white/10">
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search...' : 'Поиск...'}
              className="w-full bg-card/60 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
            />
            <button onClick={onClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-muted hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category links */}
        <div className="flex-grow overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
          {categories.map((cat, index) => {
            const isActive = index === activeCategoryIndex && !searchQuery;
            const icon = categoryIcons[cat.category] || '🍱';
            const availableCount = cat.items.filter((i) => i.is_available !== false).length;
            return (
              <button
                key={cat.slug}
                onClick={() => { onSelectCategory(index); onClose(); }}
                className={`w-full text-left px-4 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                  isActive
                    ? 'bg-brand/10 text-brand border-brand/30 shadow-[inset_0_0_20px_rgba(230,57,70,0.05)]'
                    : 'bg-transparent text-white/80 border-transparent hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[13px] tracking-wider uppercase">{lang === 'en' ? cat.categoryEn : cat.category}</span>
                  <span className="text-[10px] text-muted font-medium uppercase tracking-widest mt-0.5 opacity-60">
                    {availableCount} {lang === 'en' ? 'items' : 'позиций'}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 ml-auto ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10 text-center text-muted text-[10px] tracking-widest uppercase">
          © Mistorsush 2026
        </div>
      </div>
    </div>
  );
}

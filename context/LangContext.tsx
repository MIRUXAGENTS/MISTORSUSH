'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { i18n, Lang, I18nKeys } from '@/lib/i18n';

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: I18nKeys) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && (stored === 'ru' || stored === 'en')) setLang(stored);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'ru' ? 'en' : 'ru';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const t = useCallback(
    (key: I18nKeys): string => i18n[lang][key] as string,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}

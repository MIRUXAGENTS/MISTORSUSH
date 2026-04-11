'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/context/LangContext';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AccessMode = 'stop-animations' | 'monochrome' | 'contrast' | 'invert' | 'readable-font' | 'highlight-links' | 'sepia' | 'screen-reader';

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const { t, lang } = useLang();
  const [activeModes, setActiveModes] = useState<Set<AccessMode>>(new Set());
  const [fontSizeLevel, setFontSizeLevel] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    const savedModes = localStorage.getItem('accessibilityModes');
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    
    if (savedModes) {
      const modesArray = JSON.parse(savedModes) as AccessMode[];
      const modesSet = new Set(modesArray);
      setActiveModes(modesSet);
      modesArray.forEach(mode => document.body.classList.add(`accessibility-${mode}`));
    }
    
    if (savedFontSize) {
      const size = parseFloat(savedFontSize);
      setFontSizeLevel(size);
      document.documentElement.style.fontSize = `${size}rem`;
    }
  }, []);

  const toggleAccessMode = (mode: AccessMode) => {
    const newModes = new Set(activeModes);
    if (newModes.has(mode)) {
      newModes.delete(mode);
      document.body.classList.remove(`accessibility-${mode}`);
    } else {
      newModes.add(mode);
      document.body.classList.add(`accessibility-${mode}`);
    }
    setActiveModes(newModes);
    localStorage.setItem('accessibilityModes', JSON.stringify(Array.from(newModes)));
  };

  const adjustFontSize = (delta: number) => {
    const newLevel = Math.min(Math.max(fontSizeLevel + delta, 0.8), 1.4);
    setFontSizeLevel(newLevel);
    document.documentElement.style.fontSize = `${newLevel}rem`;
    localStorage.setItem('accessibilityFontSize', newLevel.toString());
  };

  const resetAll = () => {
    activeModes.forEach(mode => document.body.classList.remove(`accessibility-${mode}`));
    setActiveModes(new Set());
    setFontSizeLevel(1);
    document.documentElement.style.fontSize = '1rem';
    localStorage.removeItem('accessibilityModes');
    localStorage.removeItem('accessibilityFontSize');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Screen Reader logic
  useEffect(() => {
    if (!activeModes.has('screen-reader')) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('p, h1, h2, h3, h4, span, button, a, label');
      if (target && window.speechSynthesis) {
        const text = (target as HTMLElement).innerText;
        if (text) {
          window.speechSynthesis.cancel();
          const uttr = new SpeechSynthesisUtterance(text);
          uttr.lang = lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US';
          window.speechSynthesis.speak(uttr);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [activeModes, lang]);

  if (!isOpen) return null;

  const modes: { id: AccessMode; icon: string; label: string }[] = [
    { id: 'stop-animations', icon: '🚫', label: lang === 'ru' ? 'Без анимаций' : lang === 'he' ? 'עצור אנימציות' : 'Stop Animations' },
    { id: 'monochrome', icon: '⚫', label: lang === 'ru' ? 'Монохром' : lang === 'he' ? 'מונוכרום' : 'Monochrome' },
    { id: 'contrast', icon: '🌓', label: lang === 'ru' ? 'Контраст' : lang === 'he' ? 'ניגודיות' : 'Contrast' },
    { id: 'invert', icon: '🔄', label: lang === 'ru' ? 'Инверсия' : lang === 'he' ? 'היפוך צבעים' : 'Invert' },
    { id: 'readable-font', icon: 'Aa', label: lang === 'ru' ? 'Шрифт Arial' : lang === 'he' ? 'גופן קריא' : 'Readable Font' },
    { id: 'highlight-links', icon: '🔗', label: lang === 'ru' ? 'Ссылки' : lang === 'he' ? 'הדגש קישורים' : 'Highlight Links' },
    { id: 'sepia', icon: '📜', label: lang === 'ru' ? 'Сепия' : lang === 'he' ? 'ספייה' : 'Sepia' },
    { id: 'screen-reader', icon: '🔊', label: lang === 'ru' ? 'Чтение вслух' : lang === 'he' ? 'קורא מסך' : 'Screen Reader' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#f0f2f5] w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-white px-6 py-5 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="8" r="1.5" />
                <path d="M7 11h10M9 11v3l2 2v4M15 11v3l-2 2v4" />
              </svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">
              {lang === 'ru' ? 'Доступность' : lang === 'he' ? 'נגישות' : 'Accessibility'}
            </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-grow bg-[#f0f2f5]">
          <div className="grid grid-cols-2 gap-3">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => toggleAccessMode(mode.id)}
                className={`bg-white p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all hover:shadow-md active:scale-95 border-2 relative group ${
                  activeModes.has(mode.id) ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {mode.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">
                  {mode.label}
                </span>
                {activeModes.has(mode.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-0.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-2.5 h-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {/* Font Size Control */}
            <div className="bg-white p-3 rounded-2xl flex flex-col items-center gap-2 border-2 border-transparent">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {lang === 'ru' ? 'Шрифт' : lang === 'he' ? 'גודל גופן' : 'Font Size'}
              </span>
              <div className="flex gap-1 w-full">
                <button onClick={() => adjustFontSize(-0.1)} className="flex-grow py-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-700 font-black transition">-</button>
                <button onClick={() => adjustFontSize(0.1)} className="flex-grow py-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-700 font-black transition">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 flex gap-2 border-t border-gray-200">
          <button onClick={resetAll} className="flex-grow py-4 bg-gray-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {lang === 'ru' ? 'Сбросить всё' : lang === 'he' ? 'אפס הכל' : 'Reset All'}
          </button>
        </div>
      </div>
    </div>
  );
}

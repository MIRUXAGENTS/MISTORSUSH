'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { sb } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useLang();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onClose();
      } else {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await sb.from('profiles').insert([{ id: data.user.id, email, full_name: '', phone: '', address: '' }]);
        }
        alert(t('alertAuthSuccessRegister'));
        setMode('login');
      }
    } catch (err: unknown) {
      alert(t('alertError') + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[70] flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-dark w-full sm:w-[400px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] transform transition-transform duration-300 ${isOpen ? 'translate-y-0 sm:translate-y-0' : 'translate-y-full sm:translate-y-10'}`}>
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight">{mode === 'login' ? t('authLoginTitle') : t('authRegisterTitle')}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@mail.com" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand transition text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">{t('authPassLab')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand transition text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition shadow-lg shadow-brand/20 mt-4 uppercase text-xs tracking-widest disabled:opacity-60">
              {loading ? '...' : (mode === 'login' ? t('authLoginBtn') : t('authRegisterBtn'))}
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-[11px] text-muted hover:text-white transition-colors uppercase tracking-widest font-bold">
                {mode === 'login' ? t('authNoAccount') : t('authHaveAccount')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

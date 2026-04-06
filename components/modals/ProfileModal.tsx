'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import OrderDetailsModal from './OrderDetailsModal';
import { isAdmin } from '@/lib/authUtils';
import { useRouter } from 'next/navigation';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentUser: User | null;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_sum: number;
  order_type: string;
  items_json: { order_items: string };
}

export default function ProfileModal({ isOpen, onClose, onLogout, currentUser }: ProfileModalProps) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [floor, setFloor] = useState('');
  const [entrance, setEntrance] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Order Details State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadProfile();
      loadOrders();
    }
  }, [isOpen, currentUser]);

  async function loadProfile() {
    if (!sb || !currentUser) return;
    const { data } = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
    if (data) {
      setName(data.full_name || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setApt(data.apt || '');
      setFloor(data.floor || '');
      setEntrance(data.entrance || '');
    }
  }

  async function loadOrders() {
    if (!sb || !currentUser) return;
    const { data } = await sb.from('orders').select('*').eq('customer_email', currentUser.email).order('created_at', { ascending: false }).limit(10);
    setOrders(data || []);
  }

  async function saveProfile() {
    if (!sb || !currentUser) return;
    setSavingProfile(true);
    const { error } = await sb.from('profiles').update({ full_name: name, phone, address, apt, floor, entrance }).eq('id', currentUser.id);
    setSavingProfile(false);
    if (error) alert(t('alertError') + error.message);
    else alert(t('alertProfileUpdated'));
  }

  async function changePassword() {
    if (!sb || !currentUser) return;
    if (newPass !== confirmPass) { alert(t('validationPassMatch')); return; }
    if (newPass.length < 6) { alert(t('validationPassShort')); return; }
    setChangingPass(true);
    try {
      const { error: authError } = await sb.auth.signInWithPassword({ email: currentUser.email!, password: oldPass });
      if (authError) throw authError;
      const { error } = await sb.auth.updateUser({ password: newPass });
      if (error) throw error;
      alert(t('alertPassChanged'));
      setShowSettings(false);
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } catch (err: unknown) {
      alert(t('alertError') + (err as Error).message);
    } finally {
      setChangingPass(false);
    }
  }

  function getStatusStyle(status: string): string {
    switch (status) {
      case 'new': return 'text-brand border-brand/20 bg-brand/5';
      case 'Готовится': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case 'Курьер в пути': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case 'Завершен': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
      default: return 'text-muted border-white/10 bg-white/5';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'new': return t('statusNew');
      case 'Готовится': return t('statusCooking');
      case 'Курьер в пути': return t('statusTransit');
      case 'Завершен': return t('statusCompleted');
      default: return status;
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  return (
    <div className={`fixed inset-0 z-[70] flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-dark w-full sm:w-[500px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-10'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-card/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-xl shadow-inner">👤</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">{name || t('profileUnnamed')}</h2>
                {isAdmin(currentUser?.email) && (
                  <span className="bg-brand/20 text-brand border border-brand/30 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                    Админ
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted font-bold tracking-widest uppercase">{currentUser?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-brand transition-colors border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.127 1.046 1.046 0 0 0-.645.87l-.213 1.282c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.046 1.046 0 0 0-.645-.87 6.558 6.558 0 0 1-.22-.127 1.046 1.046 0 0 0-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {showSettings ? (
            <div className="p-6 space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand/80 border-b border-brand/10 pb-2">{t('settingsSecurity')}</h3>
              <div className="space-y-3">
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">{t('settingsOldPass')}</label><input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="••••••••" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand transition text-sm mt-1" /></div>
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">{t('settingsNewPass')}</label><input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand transition text-sm mt-1" /></div>
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted ml-1">{t('settingsConfirmPass')}</label><input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="••••••••" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand transition text-sm mt-1" /></div>
                <button onClick={changePassword} disabled={changingPass} className="w-full bg-brand text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition shadow-lg shadow-brand/20 uppercase text-xs tracking-widest disabled:opacity-60">
                  {changingPass ? '...' : t('settingsUpdateBtn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Profile fields */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand/80 border-b border-brand/10 pb-2">{t('profileTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('nameField')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                  <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('phoneField')}</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                </div>
                <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('addressField')}</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('aptField')}</label><input type="text" value={apt} onChange={(e) => setApt(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                  <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('floorField')}</label><input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                  <div className="space-y-1"><label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('entranceField')}</label><input type="text" value={entrance} onChange={(e) => setEntrance(e.target.value)} className="w-full bg-card border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand/40 transition" /></div>
                </div>
                <button onClick={saveProfile} disabled={savingProfile} className="text-[10px] font-black uppercase tracking-widest text-brand hover:text-white transition-colors disabled:opacity-60">
                  {savingProfile ? '...' : t('profileSaveBtn')}
                </button>
              </div>

              {/* Order history */}
              <div className="space-y-4 pt-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand/80 border-b border-brand/10 pb-2">{t('profileHistoryTitle')}</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted text-[10px] uppercase font-bold tracking-widest opacity-50 italic">{t('profileOrdersEmpty')}</div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => openOrderDetails(order)}
                        className="bg-card/50 border border-white/5 rounded-2xl p-4 space-y-2 group hover:border-brand/20 transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-muted tracking-widest">{new Date(order.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU')}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>{getStatusText(order.status)}</span>
                        </div>
                        <div className="text-[12px] font-bold text-white/80">{order.total_sum}₪ • {order.order_type}</div>
                        <div className="text-[9px] text-muted font-medium line-clamp-2 italic opacity-60">{(order.items_json?.order_items || '').split('\n')[0]}...</div>
                        <div className="text-[8px] text-brand/50 font-black uppercase tracking-widest pt-1 flex items-center gap-1 group-hover:text-brand transition-colors">
                          {lang === 'en' ? 'View details' : 'Подробнее'}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2 h-2">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-dark/50 flex flex-col gap-3">
          {isAdmin(currentUser?.email) && (
            <button 
              onClick={() => { onClose(); router.push('/admin'); }}
              className="w-full bg-brand text-white font-black py-3 rounded-xl active:scale-[0.98] transition shadow-lg shadow-brand/20 uppercase text-[10px] tracking-[0.2em]"
            >
              Перейти в Админ-панель
            </button>
          )}
          <button onClick={onLogout} className="w-full bg-white/5 text-muted hover:text-brand hover:border-brand/20 border border-white/10 font-black py-3 rounded-xl active:scale-[0.98] transition uppercase text-[10px] tracking-[0.2em]">
            {t('profileLogoutBtn')}
          </button>
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

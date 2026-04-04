'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { getItemName } from '@/lib/menuData';
import { useMenu } from '@/context/MenuContext';
import { sb } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  isPromoActive: boolean;
  currentUser: User | null;
}

export default function CheckoutModal({ isOpen, onClose, onBack, isPromoActive, currentUser }: CheckoutModalProps) {
  const { cartItems, cartSubtotal, cart, clearCart } = useCart();
  const { lang, t } = useLang();
  const { menuData } = useMenu();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [orderTiming, setOrderTiming] = useState<'asap' | 'scheduled'>('asap');
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const aptRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const entranceRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Set today's date as default
  useEffect(() => {
    if (dateRef.current) {
      const today = new Date().toISOString().split('T')[0];
      dateRef.current.value = today;
      dateRef.current.min = today;
    }
  }, [isOpen]);

  // Auto-fill form from user's saved profile
  useEffect(() => {
    if (!isOpen || !currentUser || !sb) return;
    sb.from('profiles')
      .select('full_name,phone,address,apt,floor,entrance')
      .eq('id', currentUser.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if (data.full_name && nameRef.current && !nameRef.current.value)
          nameRef.current.value = data.full_name;
        if (data.phone && phoneRef.current && !phoneRef.current.value)
          phoneRef.current.value = data.phone;
        if (data.address && addressRef.current && !addressRef.current.value)
          addressRef.current.value = data.address;
        if (data.apt && aptRef.current && !aptRef.current.value)
          aptRef.current.value = data.apt;
        if (data.floor && floorRef.current && !floorRef.current.value)
          floorRef.current.value = data.floor;
        if (data.entrance && entranceRef.current && !entranceRef.current.value)
          entranceRef.current.value = data.entrance;
      });
  }, [isOpen, currentUser]);

  function calculateDiscount(): number {
    if (!isPromoActive) return 0;
    const bakedCat = menuData.find((c) => c.category === 'Запеченные роллы');
    if (!bakedCat) return 0;
    const bakedIds = new Set(bakedCat.items.filter((i) => i.is_available !== false).map((i) => i.id));
    const prices: number[] = [];
    for (const ci of cartItems) {
      if (bakedIds.has(ci.item.id)) {
        for (let j = 0; j < ci.count; j++) prices.push(ci.item.price);
      }
    }
    const freeCount = Math.floor(prices.length / 3);
    if (freeCount === 0) return 0;
    prices.sort((a, b) => a - b);
    return prices.slice(0, freeCount).reduce((s, p) => s + p, 0);
  }

  const discount = calculateDiscount();
  const subtotal = cartSubtotal;
  const finalSubtotal = subtotal - discount;
  const deliveryCost = orderType === 'delivery' && finalSubtotal < 250 ? 30 : 0;
  const total = finalSubtotal + deliveryCost;

  async function handleSubmit() {
    if (honeypotRef.current?.value) return;

    const lastOrderTime = localStorage.getItem('lastOrderTime');
    if (lastOrderTime && Date.now() - parseInt(lastOrderTime) < 3 * 60 * 1000) {
      alert(t('alertOrderWait'));
      return;
    }

    const name = nameRef.current?.value.trim() || '';
    const phone = phoneRef.current?.value.trim() || '';
    const address = addressRef.current?.value.trim() || '';

    if (!name) { alert(t('validationEmpty')); return; }
    if (!phone) { alert(t('validationEmpty')); return; }
    if (orderType === 'delivery' && !address) { alert(t('validationEmpty')); return; }

    let deliveryTimeText = t('timingASAP');
    if (orderTiming === 'scheduled') {
      const date = dateRef.current?.value;
      const time = timeRef.current?.value;
      if (!date || !time) { alert(t('alertOrderPreorderSelect')); return; }
      const hour = parseInt(time.split(':')[0]);
      if (hour < 12 || hour >= 23) { alert(t('alertOrderTimeRange')); return; }
      deliveryTimeText = `${date} ${time}`;
    }

    const apt = aptRef.current?.value.trim() || '';
    const floor = floorRef.current?.value.trim() || '';
    const entrance = entranceRef.current?.value.trim() || '';
    const comment = commentRef.current?.value.trim() || '';

    const fullAddress = `${address}${apt ? ', кв.' + apt : ''}${floor ? ', эт.' + floor : ''}${entrance ? ', под.' + entrance : ''}`;

    const orderItemsText = cartItems
      .map((ci) => {
        const displayName = getItemName(ci.item, lang);
        return `${displayName} x${ci.count} (${ci.item.price * ci.count}₪)`;
      })
      .join('\n');

    let orderDetailsForDb = orderItemsText;
    if (discount > 0) orderDetailsForDb += `\nСкидка: -${discount}₪`;
    if (deliveryCost > 0) orderDetailsForDb += `\nДоставка: +${deliveryCost}₪`;

    setSubmitting(true);
    try {
      if (sb) {
        const orderData: Record<string, unknown> = {
          customer_name: name,
          customer_phone: phone,
          delivery_address: orderType === 'delivery' ? fullAddress : 'Самовывоз',
          order_type: orderType === 'delivery' ? 'Доставка' : 'Самовывоз',
          comment,
          total_sum: total,
          status: 'new',
          delivery_time: deliveryTimeText,
          items_json: { cart, order_items: orderDetailsForDb },
        };
        if (currentUser) orderData.customer_email = currentUser.email;
        const { error } = await sb.from('orders').insert([orderData]);
        if (error) { alert(t('alertError') + error.message); setSubmitting(false); return; }
      }

      localStorage.setItem('lastOrderTime', Date.now().toString());
      alert(t('alertOrderSuccess'));

      let msg = lang === 'en' ? '🍣 *New Mistorsush Order!* 🍣\n\n' : '🍣 *Новый заказ Mistorsush!* 🍣\n\n';
      msg += `*${t('nameField')}:* ${name}\n`;
      msg += `*${t('phoneField')}:* ${phone}\n`;
      msg += `*${t('receiving')}:* ${orderType === 'delivery' ? t('delivery') + ' 🚚' : t('pickup') + ' 🚶‍♂️'}\n`;
      msg += `*${t('timingLab')}:* ${deliveryTimeText}\n\n`;
      if (orderType === 'delivery') msg += `${t('whatsappAddress')} ${fullAddress}\n\n`;
      msg += `${t('whatsappOrderTitle')}\n${orderItemsText}`;
      if (discount > 0) msg += `\n\n*${t('discount2plus1')}:* -${discount}₪`;
      if (deliveryCost > 0) msg += `\n*${t('deliveryCostLabel')}:* ${deliveryCost}₪`;
      else if (orderType === 'delivery') msg += `\n*${t('deliveryCostLabel')}:* ${t('freeDelivery')}`;
      msg += `\n\n*${t('totalToPay')} ${total}₪*`;
      if (comment) msg += `\n\n*${t('commentField')}:* ${comment}`;

      clearCart();
      onClose();
      window.location.href = `https://wa.me/972559284670?text=${encodeURIComponent(msg)}`;
    } catch (err: unknown) {
      alert(t('alertError') + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[60] flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-dark w-full sm:w-[450px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] transform transition-transform duration-300 ${isOpen ? 'translate-y-0 sm:translate-y-0' : 'translate-y-full sm:translate-y-10'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 active:text-white active:scale-95 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            <h2 className="text-xl font-bold text-white">{t('checkoutTitle')}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">
          {/* Order type toggle */}
          <div className="flex bg-card p-1 rounded-xl mb-6 relative">
            <div className={`absolute w-[calc(50%-4px)] h-[calc(100%-8px)] bg-brand rounded-lg shadow-sm transition-transform duration-300 top-1 left-1 ${orderType === 'pickup' ? 'translate-x-full' : 'translate-x-0'}`} />
            <button type="button" onClick={() => setOrderType('delivery')} className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${orderType === 'delivery' ? 'text-white' : 'text-white/60'}`}>{t('delivery')}</button>
            <button type="button" onClick={() => setOrderType('pickup')} className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${orderType === 'pickup' ? 'text-white' : 'text-white/60'}`}>{t('pickup')}</button>
          </div>

          <div className="space-y-4 pb-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('nameField')} <span className="text-brand">*</span></label>
              <input ref={nameRef} type="text" placeholder={t('namePlaceholder')} maxLength={50} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('phoneField')} <span className="text-brand">*</span></label>
              <input ref={phoneRef} type="tel" placeholder="05x-xxxxxxx" maxLength={20} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" />
            </div>
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true"><input ref={honeypotRef} type="text" tabIndex={-1} autoComplete="off" /></div>

            {/* Delivery fields */}
            {orderType === 'delivery' && (
              <div className="space-y-4">
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-white/90 mb-2 border-b border-white/10 pb-2">{t('addressTitle')}</h3>
                  <p className="text-[11px] text-muted mb-3 leading-relaxed">
                    {t('courierFee')} <strong className="text-white">30₪</strong><br />
                    <span className="text-brand font-bold">{t('freeDeliveryNotice')}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('addressField')} <span className="text-brand">*</span></label>
                  <input ref={addressRef} type="text" placeholder={t('addressPlaceholder')} maxLength={100} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('aptField')}</label><input ref={aptRef} type="number" placeholder="№" className="w-full bg-card border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" /></div>
                  <div><label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('floorField')}</label><input ref={floorRef} type="text" placeholder="№" className="w-full bg-card border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" /></div>
                  <div><label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('entranceField')}</label><input ref={entranceRef} type="text" placeholder="№" maxLength={10} className="w-full bg-card border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition text-sm" /></div>
                </div>
              </div>
            )}

            {/* Pre-order timing (logged in users only) */}
            {currentUser && (
              <div className="pt-2 border-t border-white/5 space-y-4">
                <label className="block text-[11px] font-semibold text-muted mb-1 ml-1 uppercase tracking-[0.2em]">{t('timingLab')}</label>
                <div className="flex bg-dark/50 rounded-2xl p-1 border border-white/5 relative h-11">
                  <div className={`absolute inset-y-1 left-1 w-1/2 bg-white/5 rounded-xl transition-all duration-300 ${orderTiming === 'scheduled' ? 'translate-x-full' : 'translate-x-0'}`} />
                  <button type="button" onClick={() => setOrderTiming('asap')} className={`flex-1 text-[10px] font-black uppercase tracking-widest relative z-10 ${orderTiming === 'asap' ? 'text-white' : 'text-white/40'}`}>{t('timingASAP')}</button>
                  <button type="button" onClick={() => setOrderTiming('scheduled')} className={`flex-1 text-[10px] font-black uppercase tracking-widest relative z-10 ${orderTiming === 'scheduled' ? 'text-white' : 'text-white/40'}`}>{t('timingScheduled')}</button>
                </div>
                {orderTiming === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('timingDate')}</label>
                      <input ref={dateRef} type="date" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand transition text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black tracking-widest text-muted ml-1">{t('timingTime')}</label>
                      <input ref={timeRef} type="time" min="12:00" max="23:00" className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand transition text-xs" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comment */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-muted mb-1.5 ml-1 uppercase tracking-wide">{t('commentField')}</label>
              <textarea ref={commentRef} placeholder={t('commentPlaceholder')} rows={2} maxLength={200} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand transition resize-none text-sm" />
            </div>
          </div>

          {/* Summary */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="bg-card/40 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="flex justify-between text-xs text-muted uppercase font-black tracking-widest">
                <span>{t('subtotal')}</span><span className="text-white">{subtotal}₪</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-brand font-black uppercase tracking-widest">
                  <span>{t('discount2plus1')}</span><span>-{discount}₪</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between text-xs text-muted uppercase font-black tracking-widest">
                  <span>{t('deliveryCostLabel')}</span><span>{deliveryCost}₪</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/5 mt-1 uppercase tracking-wider">
                <span>{t('totalToPay')}</span><span className="text-brand">{total}₪</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl active:scale-[0.98] transition shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] disabled:opacity-70"
            >
              <span>{submitting ? t('alertOrderProcessing') : t('sendWhatsapp')}</span>
              {!submitting && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

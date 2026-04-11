'use client';

import { useLang } from '@/context/LangContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const { lang, t } = useLang();

  if (!isOpen || !order) return null;

  const date = new Date(order.created_at).toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-dark border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-white/5">
          <div className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              {lang === 'ru' ? `Заказ №${order.id}` : `Order #${order.id}`}
            </h3>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{date}</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          {/* Status & Timing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-[9px] uppercase font-black text-brand tracking-widest block mb-1">
                {lang === 'ru' ? 'Тип заказа' : 'Order Type'}
              </span>
              <span className="text-sm font-bold text-white">{order.order_type}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-[9px] uppercase font-black text-brand tracking-widest block mb-1">
                {lang === 'ru' ? 'Время доставки' : 'Delivery Time'}
              </span>
              <span className="text-sm font-bold text-white">{order.delivery_time || (lang === 'ru' ? 'Как можно скорее' : 'ASAP')}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-black text-muted tracking-[0.2em] ml-1">
              {lang === 'ru' ? 'Состав заказа' : 'Order Items'}
            </span>
            <div className="bg-card/50 rounded-2xl p-5 border border-white/5 space-y-3 shadow-inner">
               <pre className="text-[13px] font-bold text-white/90 tracking-tight whitespace-pre-wrap font-sans leading-relaxed">
                 {order.items_json?.order_items || ''}
               </pre>
            </div>
          </div>

          {/* Address if delivery */}
          {order.order_type === 'Доставка' && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-black tracking-[0.2em] text-muted opacity-50 ml-1">
                {lang === 'ru' ? 'Адрес доставки' : 'Delivery Address'}
              </span>
              <div className="bg-dark/40 rounded-2xl p-4 border border-white/5">
                <span className="text-xs font-bold text-white/80 leading-relaxed italic">
                  🛵 {order.delivery_address}
                </span>
              </div>
            </div>
          )}

          {/* Comment */}
          {order.comment && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-black tracking-[0.2em] text-muted opacity-50 ml-1">
                {lang === 'ru' ? 'Комментарий' : 'Comment'}
              </span>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 italic">
                <span className="text-xs text-white/60 leading-relaxed font-medium">"{order.comment}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-white/5 border-t border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-muted tracking-widest">
              {lang === 'ru' ? 'Итого к оплате' : 'Total Amout'}
            </span>
            <span className="text-2xl font-black text-white">{order.total_sum}₪</span>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white text-dark font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:bg-brand hover:text-white transition-all active:scale-95"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

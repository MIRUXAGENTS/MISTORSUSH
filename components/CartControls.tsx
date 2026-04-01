'use client';

import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/lib/menuData';

interface CartControlsProps {
  item: MenuItem;
}

export default function CartControls({ item }: CartControlsProps) {
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const count = getItemCount(item.id);
  const available = item.is_available !== false;

  if (!available) return null;

  if (count > 0) {
    return (
      <div className="flex items-center bg-dark rounded-full p-0.5 border border-white/10 shadow-inner">
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-7 h-7 flex items-center justify-center text-muted active:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-bold text-white">{count}</span>
        <button
          onClick={() => addToCart(item.id)}
          className="w-7 h-7 flex items-center justify-center text-brand active:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => addToCart(item.id)}
      className="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition shadow-lg shadow-brand/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  );
}

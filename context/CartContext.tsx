'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import { MenuItem } from '@/lib/menuData';
import { useMenu } from '@/context/MenuContext';

export interface CartItem {
  item: MenuItem;
  count: number;
}

type Cart = Record<string, number>;

interface CartState {
  cart: Cart;
}

type CartAction =
  | { type: 'ADD'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const prev = state.cart[action.id] || 0;
      return { cart: { ...state.cart, [action.id]: prev + 1 } };
    }
    case 'REMOVE': {
      const prev = state.cart[action.id] || 0;
      if (prev <= 1) {
        const next = { ...state.cart };
        delete next[action.id];
        return { cart: next };
      }
      return { cart: { ...state.cart, [action.id]: prev - 1 } };
    }
    case 'CLEAR':
      return { cart: {} };
    default:
      return state;
  }
}

interface CartContextValue {
  cart: Cart;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartItems: CartItem[];
  getItemCount: (id: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: {} });
  const { menuData } = useMenu();

  const getItem = useCallback((id: string): MenuItem | null => {
    for (const cat of menuData) {
      const found = cat.items.find((i) => i.id === id);
      if (found) return found;
    }
    return null;
  }, [menuData]);

  const addToCart = useCallback((id: string) => {
    const item = getItem(id);
    if (item && item.is_available === false) return;
    dispatch({ type: 'ADD', id });
  }, [getItem]);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const cartItems: CartItem[] = Object.entries(state.cart)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const item = getItem(id);
      return { item, count };
    })
    .filter((ci): ci is { item: MenuItem; count: number } => ci.item != null);

  const cartCount = cartItems.reduce((a, ci) => a + ci.count, 0);
  const cartSubtotal = cartItems.reduce((a, ci) => a + ci.item.price * ci.count, 0);

  const getItemCount = (id: string) => state.cart[id] || 0;

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartItems,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

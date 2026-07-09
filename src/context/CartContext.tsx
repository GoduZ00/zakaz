import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, SkuVariant } from '../types';

interface ToastInfo {
  text: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (product: Product, qty?: number, sku?: SkuVariant) => void;
  removeItem: (productId: number, article?: string) => void;
  updateQuantity: (productId: number, qty: number, article?: string) => void;
  clearCart: () => void;
  total: number;
  toast: ToastInfo | null;
  clearToast: () => void;
  showToast: (text: string, image?: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'zakaz_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const clearToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((text: string, image?: string) => setToast({ text, image }), []);

  const addItem = useCallback((product: Product, qty = 1, sku?: SkuVariant) => {
    setItems((prev) => {
      const key = sku ? `${product.id}_${sku.article}` : `${product.id}`;
      const idx = prev.findIndex((i) => {
        const ik = i.sku ? `${i.product.id}_${i.sku.article}` : `${i.product.id}`;
        return ik === key;
      });
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty, sku }];
    });
    setToast({ text: `«${product.name}» добавлен в корзину`, image: product.images?.[0] });
  }, []);

  const removeItem = useCallback((productId: number, article?: string) => {
    setItems((prev) => prev.filter((i) => {
      const key = i.sku ? `${i.product.id}_${i.sku.article}` : `${i.product.id}`;
      return key !== (article ? `${productId}_${article}` : `${productId}`);
    }));
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number, article?: string) => {
    if (qty <= 0) { removeItem(productId, article); return; }
    setItems((prev) => prev.map((i) => {
      const match = article
        ? i.product.id === productId && i.sku?.article === article
        : i.product.id === productId && !i.sku;
      return match ? { ...i, quantity: qty } : i;
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.length;
  const total = items.reduce((s, i) => s + (i.sku?.price ?? i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQuantity, clearCart, total, toast, clearToast, showToast }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

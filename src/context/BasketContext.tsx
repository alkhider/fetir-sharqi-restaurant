import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  notes?: string;
  size?: 'medium' | 'large';
}

interface BasketContextType {
  items: BasketItem[];
  addItem: (item: Omit<BasketItem, 'quantity'>) => void;
  addItemWithSize: (baseId: string, item: Omit<BasketItem, 'quantity' | 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  totalItems: number;
  totalPrice: number;
}

const BasketContext = createContext<BasketContextType | null>(null);

const BASKET_STORAGE_KEY = 'fetir-basket';

function loadBasket(): BasketItem[] {
  try {
    const stored = localStorage.getItem(BASKET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBasket(items: BasketItem[]) {
  localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>(loadBasket);

  useEffect(() => {
    saveBasket(items);
  }, [items]);

  const addItem = useCallback((newItem: Omit<BasketItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const addItemWithSize = useCallback((baseId: string, item: Omit<BasketItem, 'quantity' | 'id'>) => {
    const sizeId = item.size ? `${baseId}-${item.size}` : baseId;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === sizeId);
      if (existing) {
        return prev.map((i) =>
          i.id === sizeId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: sizeId, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearBasket = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <BasketContext.Provider
      value={{
        items,
        addItem,
        addItemWithSize,
        removeItem,
        updateQuantity,
        clearBasket,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}

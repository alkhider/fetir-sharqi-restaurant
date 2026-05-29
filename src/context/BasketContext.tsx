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
      // Use composite key for size variants: "id-medium" or "id-large"
      const compositeId = newItem.size ? `${newItem.id}-${newItem.size}` : newItem.id;
      const existing = prev.find((item) =>
        item.size ? `${item.id}-${item.size}` === compositeId : item.id === compositeId
      );
      if (existing) {
        return prev.map((item) => {
          const itemCompositeId = item.size ? `${item.id}-${item.size}` : item.id;
          return itemCompositeId === compositeId
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((compositeId: string) => {
    setItems((prev) => prev.filter((item) => {
      const itemCompositeId = item.size ? `${item.id}-${item.size}` : item.id;
      return itemCompositeId !== compositeId;
    }));
  }, []);

  const updateQuantity = useCallback((compositeId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => {
        const itemCompositeId = item.size ? `${item.id}-${item.size}` : item.id;
        return itemCompositeId !== compositeId;
      }));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        const itemCompositeId = item.size ? `${item.id}-${item.size}` : item.id;
        return itemCompositeId === compositeId ? { ...item, quantity } : item;
      })
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

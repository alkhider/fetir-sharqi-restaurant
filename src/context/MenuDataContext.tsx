import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { categories as defaultCategories } from '@/data/menuItems';
import type { MenuItem, MenuCategory } from '@/data/menuItems';

const STORAGE_KEY = 'fetir-menu-data';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function loadFromStorage(): MenuCategory[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(cats: MenuCategory[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch { /* ignore */ }
}

function exportToCSV(cats: MenuCategory[]): string {
  const rows: string[] = ['ID,Name,Description,Price,PriceLarge,Calories,CaloriesLarge,Category'];
  cats.forEach((cat) =>
    cat.items.forEach((item) => {
      rows.push(
        [item.id, item.name, item.description, item.price, item.priceLarge ?? '', item.calories, item.caloriesLarge ?? '', item.category].join(',')
      );
    })
  );
  return rows.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */
interface MenuDataContextType {
  categories: MenuCategory[];
  allItems: MenuItem[];
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  resetToDefault: () => void;
  exportToCSV: () => void;
  importFromCSV: (csvText: string) => { imported: number; errors: string[] };
}

const MenuDataContext = createContext<MenuDataContextType | null>(null);

export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    return loadFromStorage() ?? defaultCategories;
  });

  /* persist on change */
  useEffect(() => {
    saveToStorage(categories);
  }, [categories]);

  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories]);

  const updateItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }))
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setCategories(defaultCategories);
  }, []);

  const exportToCSVCallback = useCallback(() => {
    const csv = exportToCSV(categories);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fetir-sharqi-menu-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [categories]);

  const importFromCSV = useCallback(
    (csvText: string): { imported: number; errors: string[] } => {
      const lines = csvText
        .replace(/^\uFEFF/, '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) return { imported: 0, errors: ['Empty CSV'] };

      const errors: string[] = [];
      let imported = 0;

      setCategories((prevCats) => {
        const newCats = prevCats.map((cat) => ({ ...cat, items: [...cat.items] }));

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length < 8) {
            errors.push(`Line ${i}: not enough columns`);
            continue;
          }
          const [id, name, description, priceStr, priceLargeStr, caloriesStr, caloriesLargeStr, category] = cols;

          const price = parseFloat(priceStr);
          if (isNaN(price) || price <= 0) {
            errors.push(`Line ${i}: invalid price "${priceStr}"`);
            continue;
          }

          const priceLarge = priceLargeStr ? parseFloat(priceLargeStr) : undefined;
          const calories = parseFloat(caloriesStr) || 0;
          const caloriesLarge = caloriesLargeStr ? parseFloat(caloriesLargeStr) : undefined;

          const cat = newCats.find((c) => c.key === category);
          if (!cat) {
            errors.push(`Line ${i}: category "${category}" not found`);
            continue;
          }

          const idx = cat.items.findIndex((item) => item.id === id);
          if (idx >= 0) {
            cat.items[idx] = {
              ...cat.items[idx],
              ...(name && { name: name.trim() }),
              ...(description !== undefined && { description: description.trim() }),
              price,
              ...(priceLarge !== undefined && { priceLarge }),
              calories,
              ...(caloriesLarge !== undefined && { caloriesLarge }),
            };
          } else {
            cat.items.push({
              id: id.trim(),
              name: name.trim(),
              description: description.trim(),
              price,
              ...(priceLarge !== undefined && { priceLarge }),
              calories,
              ...(caloriesLarge !== undefined && { caloriesLarge }),
              category: category.trim(),
              image: '/food-mushaltat.png',
            });
          }
          imported++;
        }
        return newCats;
      });

      return { imported, errors };
    },
    []
  );

  return (
    <MenuDataContext.Provider
      value={{
        categories,
        allItems,
        updateItem,
        resetToDefault,
        exportToCSV: exportToCSVCallback,
        importFromCSV,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  );
}

export function useMenuData() {
  const ctx = useContext(MenuDataContext);
  if (!ctx) throw new Error('useMenuData must be used within MenuDataProvider');
  return ctx;
}

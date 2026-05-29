import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

/* ─── Types ─── */
export interface Offer {
  id: string;
  title: string;
  description: string;
  terms: string;
  badge: string;
  icon: 'percent' | 'gift' | 'truck' | 'tag' | 'clock';
  image: string;
  bgGradient: string;
  expiryDays: number;
  active: boolean;
}

export interface WorkingDay {
  day: string;
  dayEn: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface OffersContextType {
  offers: Offer[];
  workingDays: WorkingDay[];
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  addOffer: (offer: Offer) => void;
  removeOffer: (id: string) => void;
  updateWorkingDay: (dayEn: string, updates: Partial<WorkingDay>) => void;
  resetToDefault: () => void;
  exportToCSV: () => void;
}

/* ─── Defaults ─── */
const STORAGE_KEY = 'fetir-offers-data';

const defaultOffers: Offer[] = [
  {
    id: 'family',
    title: 'عرض العائلة',
    description: 'احصل على خصم 20% على طلباتك التي تتجاوز 150 ريال سعودي',
    terms: 'العرض ساري على جميع أصناف المنيو. لا يشمل العروض المخفضة الأخرى.',
    badge: 'خصم 20%',
    icon: 'percent',
    image: '/food-mushaltat.png',
    bgGradient: 'from-[#D4A844] to-[#B8942E]',
    expiryDays: 7,
    active: true,
  },
  {
    id: 'double-mushaltat',
    title: 'عرض المشلتت المزدوج',
    description: 'اشترِ 2 فطيرة مشلتت واحصل على الثالثة مجاناً',
    terms: 'العرض ساري على فطائر المشلتت فقط. الفطيرة المجانية تكون من نفس النوع أو أقل سعراً.',
    badge: 'اشترِ 2 واحصل على 1',
    icon: 'gift',
    image: '/food-mushaltat.png',
    bgGradient: 'from-[#D4652A] to-[#B85420]',
    expiryDays: 14,
    active: true,
  },
  {
    id: 'free-delivery',
    title: 'عرض التوفير',
    description: 'توصيل مجاني على الطلبات فوق 100 ريال سعودي',
    terms: 'العرض ساري داخل نطاق توصيل محدد. يرجى التأكد من العنوان عند الطلب.',
    badge: 'توصيل مجاني',
    icon: 'truck',
    image: '/food-hadik.png',
    bgGradient: 'from-[#6B7F59] to-[#556B47]',
    expiryDays: 30,
    active: true,
  },
];

const defaultWorkingDays: WorkingDay[] = [
  { day: 'السبت', dayEn: 'saturday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الأحد', dayEn: 'sunday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الإثنين', dayEn: 'monday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الثلاثاء', dayEn: 'tuesday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الأربعاء', dayEn: 'wednesday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الخميس', dayEn: 'thursday', open: '16:00', close: '01:00', isClosed: false },
  { day: 'الجمعة', dayEn: 'friday', open: '14:00', close: '01:00', isClosed: false },
];

/* ─── Storage helpers ─── */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ─── Context ─── */
const OffersContext = createContext<OffersContextType | null>(null);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-offers`, defaultOffers)
  );
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-hours`, defaultWorkingDays)
  );

  useEffect(() => { saveToStorage(`${STORAGE_KEY}-offers`, offers); }, [offers]);
  useEffect(() => { saveToStorage(`${STORAGE_KEY}-hours`, workingDays); }, [workingDays]);

  // Cross-tab sync: listen for storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}-offers` && e.newValue) {
        try { setOffers(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
      if (e.key === `${STORAGE_KEY}-hours` && e.newValue) {
        try { setWorkingDays(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateOffer = useCallback((id: string, updates: Partial<Offer>) => {
    setOffers((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      // Dispatch custom event for same-tab sync
      setTimeout(() => window.dispatchEvent(new CustomEvent('fetir-offers-changed')), 0);
      return next;
    });
  }, []);

  const addOffer = useCallback((offer: Offer) => {
    setOffers((prev) => [...prev, offer]);
    setTimeout(() => window.dispatchEvent(new CustomEvent('fetir-offers-changed')), 0);
  }, []);

  const removeOffer = useCallback((id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    setTimeout(() => window.dispatchEvent(new CustomEvent('fetir-offers-changed')), 0);
  }, []);

  const updateWorkingDay = useCallback((dayEn: string, updates: Partial<WorkingDay>) => {
    setWorkingDays((prev) => prev.map((d) => (d.dayEn === dayEn ? { ...d, ...updates } : d)));
    setTimeout(() => window.dispatchEvent(new CustomEvent('fetir-hours-changed')), 0);
  }, []);

  const resetToDefault = useCallback(() => {
    setOffers(defaultOffers);
    setWorkingDays(defaultWorkingDays);
  }, []);

  const exportToCSV = useCallback(() => {
    const rows: string[] = ['\uFEFFID,Title,Description,Badge,Icon,Image,Gradient,ExpiryDays,Active'];
    offers.forEach((o) => {
      rows.push([o.id, o.title, o.description, o.badge, o.icon, o.image, o.bgGradient, o.expiryDays, o.active].join(','));
    });
    rows.push('', 'Day,DayEn,Open,Close,IsClosed');
    workingDays.forEach((w) => {
      rows.push([w.day, w.dayEn, w.open, w.close, w.isClosed].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fetir-offers-hours-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [offers, workingDays]);

  return (
    <OffersContext.Provider
      value={{ offers, workingDays, updateOffer, addOffer, removeOffer, updateWorkingDay, resetToDefault, exportToCSV }}
    >
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error('useOffers must be used within OffersProvider');
  return ctx;
}

export function getFormattedHours(workingDays: WorkingDay[]): { label: string; hours: string }[] {
  const active = workingDays.filter((d) => !d.isClosed);
  if (active.length === 0) return [{ label: 'مغلق', hours: '—' }];

  // Group consecutive days with same hours
  const groups: { days: string[]; open: string; close: string }[] = [];
  let current: { days: string[]; open: string; close: string } | null = null;

  for (const day of workingDays) {
    if (day.isClosed) continue;
    if (!current || current.open !== day.open || current.close !== day.close) {
      current = { days: [day.day], open: day.open, close: day.close };
      groups.push(current);
    } else {
      current.days.push(day.day);
    }
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'م' : 'ص';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return groups.map((g) => {
    const label = g.days.length > 1 ? `${g.days[0]} – ${g.days[g.days.length - 1]}` : g.days[0];
    return { label, hours: `${formatTime(g.open)} – ${formatTime(g.close)}` };
  });
}

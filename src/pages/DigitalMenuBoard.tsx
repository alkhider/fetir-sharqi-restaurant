import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Phone, MapPin, Clock } from 'lucide-react';
import { categories } from '@/data/menuItems';
import type { MenuItem } from '@/data/menuItems';

const ROTATION_INTERVAL = 8000; // 8 seconds per category

/* ─── TV-Optimized Price Card ─── */
function TVItemCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="flex items-center justify-between py-3 px-4 border-b border-ghee-gold/15 last:border-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.isHot && (
          <Flame className="w-5 h-5 text-ember-orange shrink-0" />
        )}
        <div className="min-w-0">
          <span className="text-dough-cream font-bold text-lg leading-tight block truncate">
            {item.name}
          </span>
          {item.calories > 0 && (
            <span className="text-warm-brown text-xs font-tajawal">
              {item.calories} سعرة
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 mr-4">
        {item.priceLarge ? (
          <div className="flex items-center gap-3">
            <span className="text-warm-brown text-base">
              و <span className="text-ghee-gold font-bold text-xl">{item.price}</span>
              <span className="text-warm-brown text-sm mr-1">ر.س</span>
            </span>
            <span className="text-warm-brown/40">|</span>
            <span className="text-warm-brown text-base">
              ك <span className="text-ember-orange font-bold text-xl">{item.priceLarge}</span>
              <span className="text-warm-brown text-sm mr-1">ر.س</span>
            </span>
          </div>
        ) : (
          <span className="text-ghee-gold font-bold text-xl">
            {item.price} <span className="text-warm-brown text-base font-normal">ر.س</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Live Clock ─── */
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-ghee-gold">
      <Clock className="w-5 h-5" />
      <span className="font-cairo font-bold text-lg tabular-nums">
        {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="text-warm-brown text-sm font-tajawal">
        {time.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
      </span>
    </div>
  );
}

/* ─── Main Digital Board ─── */
export default function DigitalMenuBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-rotate categories
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const currentCategory = categories[activeIndex];

  // Split items into two columns
  const { leftItems, rightItems } = useMemo(() => {
    const items = currentCategory.items;
    const mid = Math.ceil(items.length / 2);
    return { leftItems: items.slice(0, mid), rightItems: items.slice(mid) };
  }, [currentCategory]);

  return (
    <div className="min-h-[100dvh] bg-crust-dark flex flex-col overflow-hidden" dir="rtl">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-crust-dark border-b-2 border-ghee-gold/30 shrink-0">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="فطير شرقي" className="w-14 h-14 rounded-full border-2 border-ghee-gold" />
          <div>
            <h1 className="font-cairo font-bold text-2xl text-ghee-gold leading-tight">فطير شرقي</h1>
            <p className="text-warm-brown text-sm font-tajawal">مطعم الفطائر الشرقية الأصيلة</p>
          </div>
        </div>
        <LiveClock />
      </header>

      {/* Category Title */}
      <div className="text-center py-3 bg-ghee-gold/10 border-b border-ghee-gold/20 shrink-0">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentCategory.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="font-cairo font-bold text-3xl text-ghee-gold"
          >
            {currentCategory.label}
            <span className="text-warm-brown text-lg font-normal mr-3">({currentCategory.items.length} صنف)</span>
          </motion.h2>
        </AnimatePresence>

        {/* Category Dots */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {categories.map((cat, i) => (
            <div
              key={cat.key}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === activeIndex ? 'bg-ghee-gold' : 'bg-warm-brown/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Items Grid — Two Columns */}
      <main className="flex-1 px-8 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.key}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-x-12 h-full"
          >
            {/* Left Column */}
            <div className="flex flex-col">
              {leftItems.map((item, i) => (
                <TVItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
            {/* Right Column */}
            <div className="flex flex-col">
              {rightItems.map((item, i) => (
                <TVItemCard key={item.id} item={item} index={i + leftItems.length} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Marquee Bar */}
      <footer className="shrink-0 bg-ghee-gold/10 border-t-2 border-ghee-gold/30 px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-dough-cream/80 text-sm font-tajawal">
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-ghee-gold" />
              055-678-7630
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-ghee-gold" />
              طريق الأمير محمد بن سلمان — حي الخالدية — المدينة المنورة
            </span>
          </div>
          <div className="text-ghee-gold font-cairo font-bold text-sm">
            fetirsharqi.sa
          </div>
        </div>
      </footer>
    </div>
  );
}

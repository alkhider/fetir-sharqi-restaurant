import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Flame,
  Search,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { useBasket } from '@/context/BasketContext';
import { categories, hotItemIds } from '@/data/menuItems';
import type { MenuItem } from '@/data/menuItems';
import { cn } from '@/lib/utils';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const allItems = categories.flatMap((c) => c.items);

const tabList = [
  { key: 'all', label: 'الكل' },
  ...categories.map((c) => ({ key: c.key, label: c.label })),
];

/* ─── 3D Tilt Card ─── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-3deg', '3deg']);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      className={className}
      style={{
        perspective: 800,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/* ─── Quantity Control ─── */
function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full border-2 border-ghee-gold text-crust-dark flex items-center justify-center hover:bg-ghee-gold transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <motion.span
        key={value}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-6 text-center font-cairo font-bold text-crust-dark"
      >
        {value}
      </motion.span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full bg-ghee-gold text-crust-dark flex items-center justify-center hover:bg-[#E5B84B] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Menu Item Card ─── */
function MenuCard({
  item,
  onAdd,
  quantity,
  onQuantityChange,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  quantity: number;
  onQuantityChange: (id: string, q: number) => void;
}) {
  const isHot = hotItemIds.has(item.id);

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="glass-card overflow-hidden group"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Hot badge */}
          {isHot && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-ember-orange text-white px-3 py-1 rounded-full text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>الأكثر مبيعاً</span>
            </div>
          )}
          {/* Quick add */}
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onAdd(item)}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-ghee-gold text-white flex items-center justify-center shadow-gold hover:shadow-gold-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="absolute bottom-3 right-3 bg-white rounded-full px-1 py-1 shadow-lg border border-ghee-gold/20">
              <QuantityControl
                value={quantity}
                onChange={(q) => onQuantityChange(item.id, q)}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-cairo font-bold text-lg text-crust-dark mb-1">
            {item.name}
          </h3>
          <p className="font-tajawal text-warm-brown text-[13px] leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-ghee-gold text-xl font-bold">
                {item.price}{' '}
                <span className="text-sm font-normal text-warm-brown">ر.س</span>
                {item.priceLarge && (
                  <span className="text-sm text-warm-brown/60 mr-2">
                    / {item.priceLarge} كبير
                  </span>
                )}
              </span>
              <span className="text-warm-brown/60 text-xs font-tajawal mt-0.5">
                {item.calories} سعرة
                {item.caloriesLarge && ` / ${item.caloriesLarge} كبير`}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (quantity === 0) {
                  onAdd(item);
                } else {
                  onQuantityChange(item.id, quantity + 1);
                }
              }}
              className="btn-primary px-4 py-2 text-sm font-bold flex items-center gap-1.5"
            >
              أضف للسلة
            </motion.button>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─── Basket Drawer ─── */
function BasketDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPrice, clearBasket } = useBasket();
  const vat = Math.round(totalPrice * 0.15 * 100) / 100;
  const total = totalPrice + vat;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="fixed top-0 left-0 h-full w-full sm:w-[420px] max-w-[95vw] bg-dough-cream z-[80] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[rgba(212,168,68,0.2)]">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-ghee-gold" />
                <h2 className="font-cairo font-bold text-xl text-crust-dark">
                  سلة الطلبات
                </h2>
                {items.length > 0 && (
                  <span className="bg-ghee-gold text-crust-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearBasket}
                    className="text-warm-brown hover:text-error-red transition-colors p-1"
                    title="إفراغ السلة"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-cream transition-colors"
                >
                  <X className="w-6 h-6 text-crust-dark" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingCart className="w-20 h-20 text-warm-brown/20" />
                  <p className="font-cairo font-bold text-lg text-warm-brown">
                    السلة فارغة
                  </p>
                  <p className="text-body text-warm-brown/70">
                    أضف بعض الأصناف اللذيذة!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 btn-primary text-sm"
                  >
                    تصفح المنيو
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.size ? `${item.id}-${item.size}` : item.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 pb-4 border-b border-[rgba(140,94,60,0.1)]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-cairo font-semibold text-crust-dark text-sm truncate">
                            {item.name}
                          </h4>
                          {item.size && (
                            <span className="text-[10px] bg-ghee-gold/20 text-ghee-gold px-1.5 py-0.5 rounded-full font-bold">
                              {item.size === 'medium' ? 'وسط' : 'كبير'}
                            </span>
                          )}
                          <p className="text-ghee-gold font-bold text-sm mt-0.5">
                            {item.price * item.quantity}{' '}
                            <span className="text-xs font-normal">ر.س</span>
                          </p>
                        </div>
                        <QuantityControl
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.size ? `${item.id}-${item.size}` : item.id, q)}
                        />
                        <button
                          onClick={() => removeItem(item.size ? `${item.id}-${item.size}` : item.id)}
                          className="text-warm-brown/50 hover:text-error-red transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[rgba(212,168,68,0.2)] bg-surface-cream/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-body">
                    <span className="text-warm-brown">المجموع</span>
                    <span className="font-bold text-crust-dark">
                      {totalPrice.toFixed(2)} ر.س
                    </span>
                  </div>
                  <div className="flex justify-between text-body">
                    <span className="text-warm-brown">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-bold text-crust-dark">
                      {vat.toFixed(2)} ر.س
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-[rgba(140,94,60,0.15)] pt-2">
                    <span className="text-crust-dark font-cairo">الإجمالي</span>
                    <span className="text-ghee-gold font-cairo">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center btn-primary py-3.5"
                >
                  إتمام الطلب
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-warm-brown hover:text-crust-dark font-semibold text-sm mt-3 transition-colors"
                >
                  مواصلة التسوق
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Menu Page ─── */
export default function Menu() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sizePickerItem, setSizePickerItem] = useState<MenuItem | null>(null);
  const { items, addItem, updateQuantity } = useBasket();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredItems =
    activeTab === 'all'
      ? allItems.filter((i) =>
          i.name.includes(search) || i.description.includes(search)
        )
      : categories
          .find((c) => c.key === activeTab)
          ?.items.filter(
            (i) => i.name.includes(search) || i.description.includes(search)
          ) ?? [];

  const getItemQuantity = useCallback(
    (id: string) =>
      items
        .filter((i) => i.id === id)
        .reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const handleAdd = useCallback(
    (item: MenuItem) => {
      if (item.priceLarge) {
        // Show size picker for items with both sizes
        setSizePickerItem(item);
        return;
      }
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
      setDrawerOpen(true);
    },
    [addItem]
  );

  const scrollToCategory = (key: string) => {
    setActiveTab(key);
    if (key === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[key];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // IntersectionObserver to update active tab on scroll
  useEffect(() => {
    // Don't override 'all' when user manually selected it
    if (activeTab === 'all') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.getAttribute('data-category') ?? 'all');
          }
        });
      },
      { rootMargin: '-160px 0px -60% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div className="min-h-[100dvh] bg-dough-cream">
      {/* Page Header */}
      <section className="bg-crust-dark pt-[72px] pb-10 relative overflow-hidden">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-caption text-ghee-gold/80 mb-4 mt-6">
            <Link to="/" className="hover:underline">
              الرئيسية
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ghee-gold">المنيو</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="font-cairo font-bold text-section-title text-dough-cream mb-2"
          >
            منيو فطير شرقي
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
            className="text-body-large text-ghee-gold/80 font-tajawal mb-6"
          >
            اختار اللي يعجبك وأضفه للسلة
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.3 }}
            className="max-w-[480px] relative"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
            <input
              type="text"
              placeholder="ابحث في المنيو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pr-12 pl-4 rounded-xl bg-dough-cream text-crust-dark font-tajawal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-ghee-gold/50 transition-shadow"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-[72px] z-40 bg-dough-cream/92 backdrop-blur-md border-b border-[rgba(212,168,68,0.15)] shadow-sm">
        <div className="container-custom">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {tabList.map((tab, i) => (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => scrollToCategory(tab.key)}
                className={cn(
                  'relative px-5 py-2.5 rounded-full font-cairo font-semibold text-sm whitespace-nowrap transition-colors',
                  activeTab === tab.key
                    ? 'bg-crust-dark text-dough-cream'
                    : 'bg-surface-cream text-crust-dark hover:bg-[rgba(212,168,68,0.15)]'
                )}
              >
                {tab.key === 'all' ? tab.label : tab.label}
                {tab.key === 'mushaltat' && (
                  <Flame className="inline-block w-3.5 h-3.5 mr-1 text-ember-orange" />
                )}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-crust-dark rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <section className="container-custom py-10 pb-20">
        {activeTab === 'all' && !search ? (
          // Show ALL items in a flat grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={handleAdd}
                quantity={getItemQuantity(item.id)}
                onQuantityChange={(id, q) =>
                  q === 0
                    ? updateQuantity(id, 0)
                    : updateQuantity(id, q)
                }
              />
            ))}
          </div>
        ) : (
          // Show filtered items in a grid
          <>
            {activeTab !== 'all' && !search && (
              <div
                ref={(el) => {
                  sectionRefs.current[activeTab] = el;
                }}
                data-category={activeTab}
                className="flex items-center gap-4 mb-8"
              >
                <img
                  src={categories.find((c) => c.key === activeTab)?.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <h2 className="font-cairo font-bold text-2xl text-crust-dark">
                  {categories.find((c) => c.key === activeTab)?.label}
                </h2>
                <div className="flex-1 h-px bg-[rgba(140,94,60,0.15)]" />
                <span className="text-caption text-warm-brown bg-surface-cream px-3 py-1 rounded-full">
                  {filteredItems.length} صنف
                </span>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-warm-brown/20 mx-auto mb-4" />
                <p className="font-cairo font-bold text-lg text-warm-brown">
                  لا توجد نتائج
                </p>
                <p className="text-body text-warm-brown/60 mt-1">
                  جرب بحثًا مختلفًا
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAdd={handleAdd}
                    quantity={getItemQuantity(item.id)}
                    onQuantityChange={(id, q) =>
                      q === 0
                        ? updateQuantity(id, 0)
                        : updateQuantity(id, q)
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Basket Drawer */}
      <BasketDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Size Picker Modal */}
      <AnimatePresence>
        {sizePickerItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSizePickerItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-cream rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={sizePickerItem.image}
                  alt={sizePickerItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSizePickerItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 right-4 left-4">
                  <h3 className="font-cairo font-bold text-xl text-white">
                    {sizePickerItem.name}
                  </h3>
                  <p className="text-white/70 text-sm truncate">{sizePickerItem.description}</p>
                </div>
              </div>

              {/* Size Options */}
              <div className="p-5 space-y-3">
                <p className="text-center font-cairo font-bold text-crust-dark text-lg">
                  اختر الحجم
                </p>

                {/* Medium */}
                <button
                  onClick={() => {
                    addItem({
                      id: sizePickerItem.id,
                      name: `${sizePickerItem.name} (وسط)`,
                      price: sizePickerItem.price,
                      image: sizePickerItem.image,
                      size: 'medium',
                    });
                    setSizePickerItem(null);
                    setDrawerOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-dough-cream border-2 border-transparent hover:border-ghee-gold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ghee-gold/20 flex items-center justify-center">
                      <span className="font-bold text-ghee-gold text-sm">M</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-crust-dark group-hover:text-ghee-gold transition-colors">وسط</p>
                      <p className="text-xs text-warm-brown">{sizePickerItem.calories} سعرة</p>
                    </div>
                  </div>
                  <span className="font-cairo font-bold text-xl text-ghee-gold">{sizePickerItem.price} ر.س</span>
                </button>

                {/* Large */}
                <button
                  onClick={() => {
                    addItem({
                      id: sizePickerItem.id,
                      name: `${sizePickerItem.name} (كبير)`,
                      price: sizePickerItem.priceLarge!,
                      image: sizePickerItem.image,
                      size: 'large',
                    });
                    setSizePickerItem(null);
                    setDrawerOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-dough-cream border-2 border-transparent hover:border-ghee-gold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ember-orange/20 flex items-center justify-center">
                      <span className="font-bold text-ember-orange text-sm">L</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-crust-dark group-hover:text-ghee-gold transition-colors">كبير</p>
                      <p className="text-xs text-warm-brown">{sizePickerItem.caloriesLarge} سعرة</p>
                    </div>
                  </div>
                  <span className="font-cairo font-bold text-xl text-ghee-gold">{sizePickerItem.priceLarge} ر.س</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating basket button (mobile) */}
      <AnimatePresence>
        {items.length > 0 && !drawerOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 left-6 z-50 bg-ghee-gold text-crust-dark w-14 h-14 rounded-full shadow-gold-lg flex items-center justify-center"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-ember-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

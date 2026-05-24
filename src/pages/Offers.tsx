import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Tag, Clock, ShoppingBag, ChevronLeft, Percent, Gift, Truck } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { useOffers } from '@/context/OffersContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const iconMap = { percent: Percent, gift: Gift, truck: Truck, tag: Tag, clock: Clock };

/* ─── Countdown Timer ─── */
function CountdownTimer({ expiryDays }: { expiryDays: number }) {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const expiry = now + expiryDays * 24 * 60 * 60 * 1000;
    const diff = expiry - now;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [expiryDays]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const units = [
    { value: timeLeft.days, label: 'يوم' },
    { value: timeLeft.hours, label: 'ساعة' },
    { value: timeLeft.minutes, label: 'دقيقة' },
    { value: timeLeft.seconds, label: 'ثانية' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-ember-orange" />
      <span className="text-caption text-warm-brown">ينتهي خلال:</span>
      <div className="flex gap-1.5">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center bg-crust-dark/5 rounded-lg px-2 py-1 min-w-[36px]">
            <span className="font-mono font-bold text-sm text-crust-dark">{String(unit.value).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Offer Card ─── */
function OfferCard({ offer, index }: { offer: any; index: number }) {
  const IconComp = iconMap[offer.icon as keyof typeof iconMap] || Tag;
  const [fromColor, toColor] = offer.bgGradient.replace('from-[', '').replace(']', '').split(' to-[');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.08 }}
      className="glass-card overflow-hidden group"
    >
      {/* Top banner */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(to bottom right, ${fromColor || '#D4A844'}, ${toColor || '#B8942E'})` }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
        </div>
        <img src={offer.image} alt={offer.title}
          className="w-28 h-28 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500" />
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-white/95 text-crust-dark px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-ghee-gold" />
          {offer.badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <IconComp className="w-6 h-6 text-ghee-gold" />
          <h3 className="font-cairo font-bold text-xl text-crust-dark">{offer.title}</h3>
        </div>
        <p className="text-body text-warm-brown mb-4 leading-relaxed">{offer.description}</p>

        {/* Terms */}
        <div className="bg-surface-cream/60 rounded-xl p-3 mb-5">
          <p className="text-caption text-warm-brown/80 leading-relaxed">
            <span className="font-bold text-crust-dark">الشروط:</span> {offer.terms}
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-5"><CountdownTimer expiryDays={offer.expiryDays} /></div>

        {/* CTA */}
        <Link to="/menu"
          className={cn('flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all',
            'bg-ghee-gold text-crust-dark hover:bg-[#E5B84B] hover:shadow-gold-lg', 'active:scale-[0.98]')}>
          <ShoppingBag className="w-4.5 h-4.5" />
          اطلب الآن
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Main Offers Page ─── */
export default function Offers() {
  const location = useLocation();
  const { offers } = useOffers();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force re-render when offers change from another tab/component
  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener('fetir-offers-changed', handler);
    return () => window.removeEventListener('fetir-offers-changed', handler);
  }, []);

  // Also reload when route changes (navigating from management to display)
  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [location.pathname]);

  const activeOffers = offers.filter((o) => o.active);

  return (
    <div key={`${location.pathname}-${refreshKey}`} className="min-h-[100dvh] bg-dough-cream">
      {/* Hero */}
      <section className="relative bg-crust-dark pt-[72px] pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-ghee-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ember-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-caption text-ghee-gold/80 mb-4 mt-6">
            <Link to="/" className="hover:underline">الرئيسية</Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-ghee-gold">العروض</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOutExpo }} className="text-center max-w-2xl mx-auto">
            <h1 className="font-cairo font-bold text-section-title text-dough-cream mb-3">عروض فطير شرقي</h1>
            <p className="text-body-large text-ghee-gold/80 font-tajawal">اكتشف أحدث عروضنا الخاصة ووفّر أكثر على طلباتك المفضلة</p>
          </motion.div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="container-custom py-16 -mt-8">
        {activeOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeOffers.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-warm-brown font-tajawal text-lg">لا توجد عروض نشطة حالياً</div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="container-custom pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOutExpo }} className="bg-crust-dark rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ghee-gold/10 to-ember-orange/10" />
          <div className="relative z-10">
            <h2 className="font-cairo font-bold text-2xl md:text-3xl text-dough-cream mb-3">تابعنا على السوشال ميديا</h2>
            <p className="text-body text-ghee-gold/70 mb-6 max-w-lg mx-auto font-tajawal">لمتابعة أحدث العروض والمفاجآت قبل الجميع</p>
            <div className="flex gap-4 justify-center">
              <a href="https://instagram.com/fetir.sharqi" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-ember-orange hover:bg-ember-orange/80 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                متابعة على إنستقرام
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

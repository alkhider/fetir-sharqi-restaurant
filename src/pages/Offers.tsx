import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, ShoppingBag, ChevronLeft, Percent, Truck, Gift } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Offer {
  id: string;
  title: string;
  description: string;
  terms: string;
  badge: string;
  icon: React.ReactNode;
  image: string;
  bgGradient: string;
  expiryDays: number;
}

const offers: Offer[] = [
  {
    id: 'family',
    title: 'عرض العائلة',
    description: 'احصل على خصم 20% على طلباتك التي تتجاوز 150 ريال سعودي',
    terms: 'العرض ساري على جميع أصناف المنيو. لا يشمل العروض المخفضة الأخرى.',
    badge: 'خصم 20%',
    icon: <Percent className="w-6 h-6" />,
    image: '/food-mushaltat.png',
    bgGradient: 'from-[#D4A844] to-[#B8942E]',
    expiryDays: 7,
  },
  {
    id: 'double-mushaltat',
    title: 'عرض المشلتت المزدوج',
    description: 'اشترِ 2 فطيرة مشلتت واحصل على الثالثة مجاناً',
    terms: 'العرض ساري على فطائر المشلتت فقط. الفطيرة المجانية تكون من نفس النوع أو أقل سعراً.',
    badge: 'اشترِ 2 واحصل على 1',
    icon: <Gift className="w-6 h-6" />,
    image: '/food-mushaltat.png',
    bgGradient: 'from-[#D4652A] to-[#B85420]',
    expiryDays: 14,
  },
  {
    id: 'free-delivery',
    title: 'عرض التوفير',
    description: 'توصيل مجاني على الطلبات فوق 100 ريال سعودي',
    terms: 'العرض ساري داخل نطاق توصيل محدد. يرجى التأكد من العنوان عند الطلب.',
    badge: 'توصيل مجاني',
    icon: <Truck className="w-6 h-6" />,
    image: '/food-hadik.png',
    bgGradient: 'from-[#6B7F59] to-[#556B47]',
    expiryDays: 30,
  },
];

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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
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
          <div
            key={unit.label}
            className="flex flex-col items-center bg-crust-dark/5 rounded-lg px-2 py-1 min-w-[36px]"
          >
            <span className="font-mono font-bold text-sm text-crust-dark">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Offer Card ─── */
function OfferCard({
  offer,
  index,
}: {
  offer: Offer;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.08 }}
      className="glass-card overflow-hidden group"
    >
      {/* Top banner */}
      <div
        className={cn(
          'relative h-40 bg-gradient-to-br flex items-center justify-center overflow-hidden',
          offer.bgGradient
        )}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
        </div>
        <img
          src={offer.image}
          alt={offer.title}
          className="w-28 h-28 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-white/95 text-crust-dark px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-ghee-gold" />
          {offer.badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-ghee-gold">{offer.icon}</span>
          <h3 className="font-cairo font-bold text-xl text-crust-dark">
            {offer.title}
          </h3>
        </div>
        <p className="text-body text-warm-brown mb-4 leading-relaxed">
          {offer.description}
        </p>

        {/* Terms */}
        <div className="bg-surface-cream/60 rounded-xl p-3 mb-5">
          <p className="text-caption text-warm-brown/80 leading-relaxed">
            <span className="font-bold text-crust-dark">الشروط:</span> {offer.terms}
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-5">
          <CountdownTimer expiryDays={offer.expiryDays} />
        </div>

        {/* CTA */}
        <Link
          to="/menu"
          className={cn(
            'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all',
            'bg-ghee-gold text-crust-dark hover:bg-[#E5B84B] hover:shadow-gold-lg',
            'active:scale-[0.98]'
          )}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          اطلب الآن
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Main Offers Page ─── */
export default function Offers() {
  return (
    <div className="min-h-[100dvh] bg-dough-cream">
      {/* Hero */}
      <section className="relative bg-crust-dark pt-[72px] pb-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-ghee-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ember-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-caption text-ghee-gold/80 mb-4 mt-6">
            <Link to="/" className="hover:underline">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-ghee-gold">العروض</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-cairo font-bold text-section-title text-dough-cream mb-3">
              عروض فطير شرقي
            </h1>
            <p className="text-body-large text-ghee-gold/80 font-tajawal">
              اكتشف أحدث عروضنا الخاصة ووفّر أكثر على طلباتك المفضلة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="container-custom py-16 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-custom pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="bg-gradient-to-r from-crust-dark to-[#3D3024] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-ghee-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-ember-orange rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <h2 className="font-cairo font-bold text-2xl md:text-3xl text-dough-cream mb-3">
              لا تفوت الفرصة!
            </h2>
            <p className="text-dough-cream/70 font-tajawal mb-6 max-w-md mx-auto">
              العروض محدودة الوقت. اطلب الآن واستمتع بألذ الفطائر الشرقية
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <ShoppingBag className="w-5 h-5" />
              تصفح المنيو
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

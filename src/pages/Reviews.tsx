import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCirclePlus, TrendingUp, Users, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── Types ─── */
interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  orderType: string;
}

/* ─── Real Review Data from Google Maps ─── */
const reviews: Review[] = [
  {
    id: 1,
    name: 'Esraa Elgaafary',
    avatar: '/customer-avatar-1.png',
    rating: 5,
    text: 'Honestly, Fateer Sharqi\'s food is really delicious! The crepes and feteer are both very tasty, and the ingredients are fresh and healthy, which is rare. Thank you very much Essam, he is very friendly and enthusiastic, helped me a lot, and made my dining experience even more perfect. Highly recommended! 10/10!',
    date: '2 months ago',
    orderType: 'Local Guide · 10 reviews · 12 photos',
  },
  {
    id: 2,
    name: 'Abo Yazeed',
    avatar: '/customer-avatar-2.png',
    rating: 5,
    text: 'Egyptian feteer meshaltet with ghee and butter is absolutely delicious! The most important thing is the dipping sauce: black honey from Upper Egypt!',
    date: '1 year ago',
    orderType: '1 review · 12 photos',
  },
  {
    id: 3,
    name: 'Mohamed Elnagar',
    avatar: '/customer-avatar-1.png',
    rating: 5,
    text: 'The worst dessert I have ever eaten in Madinah, Balkis and the entire Kingdom of Saudi Arabia.',
    date: '5 months ago',
    orderType: '8 reviews · 2 photos',
  },
];

/* ─── Star Rating ─── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= rating
              ? 'text-ghee-gold fill-ghee-gold'
              : 'text-gray-300 fill-gray-300'
          )}
        />
      ))}
    </div>
  );
}

/* ─── Rating Distribution from Google Maps (845 reviews) ─── */
const ratingDist = [
  { stars: 5, count: 520, pct: 62 },
  { stars: 4, count: 169, pct: 20 },
  { stars: 3, count: 84, pct: 10 },
  { stars: 2, count: 42, pct: 5 },
  { stars: 1, count: 30, pct: 3 },
];

function RatingDistribution() {
  return (
    <div className="flex flex-col gap-2">
      {ratingDist.map((d) => (
        <div key={d.stars} className="flex items-center gap-3">
          <span className="text-sm font-bold text-crust-dark w-3">{d.stars}</span>
          <Star className="w-3.5 h-3.5 text-ghee-gold fill-ghee-gold" />
          <div className="flex-1 h-2.5 bg-surface-cream rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${d.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className={cn(
                'h-full rounded-full',
                d.stars >= 4 ? 'bg-ghee-gold' : d.stars >= 3 ? 'bg-warning-amber' : 'bg-error-red'
              )}
            />
          </div>
          <span className="text-caption text-warm-brown w-10 text-left">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Review Card ─── */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: (index % 3) * 0.08 }}
      className="glass-card p-6 flex flex-col gap-4 hover:shadow-gold transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-ghee-gold/30"
          />
          <div>
            <h4 className="font-cairo font-bold text-crust-dark text-sm">
              {review.name}
            </h4>
            <span className="text-caption text-warm-brown">{review.date}</span>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-body text-crust-dark/85 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-[rgba(140,94,60,0.1)]">
        <span className="text-caption text-ghee-gold font-bold bg-ghee-gold/10 px-2.5 py-1 rounded-full">
          {review.orderType}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Stats Card ─── */
function StatCard({
  icon,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay }}
      className="glass-card p-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-ghee-gold/10 flex items-center justify-center mx-auto mb-3 text-ghee-gold">
        {icon}
      </div>
      <p className="font-cairo font-bold text-3xl text-crust-dark mb-1">
        {value}
      </p>
      <p className="text-body text-warm-brown">{label}</p>
    </motion.div>
  );
}

/* ─── Main Reviews Page ─── */
export default function Reviews() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-dough-cream">
      {/* Hero */}
      <section className="bg-crust-dark pt-[72px] pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-72 h-72 bg-ghee-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-ghee-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-caption text-ghee-gold/80 mb-4 mt-6">
            <Link to="/" className="hover:underline">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-ghee-gold">آراء العملاء</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-cairo font-bold text-section-title text-dough-cream mb-3">
              آراء عملائنا
            </h1>
            <p className="text-body-large text-ghee-gold/80 font-tajawal">
              شاهد ما يقوله عملاؤنا عن تجربتهم مع فطير شرقي
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-custom -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Star className="w-6 h-6" />}
            value="4.5"
            label="متوسط التقييم"
            delay={0}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value="845+"
            label="تقييم إجمالي"
            delay={0.08}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            value="82%"
            label="نسبة الرضا (4-5 نجوم)"
            delay={0.16}
          />
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Rating Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="lg:w-80 shrink-0"
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-cairo font-bold text-lg text-crust-dark mb-4">
                توزيع التقييمات
              </h3>
              <RatingDistribution />

              <div className="mt-6 pt-5 border-t border-[rgba(140,94,60,0.1)]">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all bg-ghee-gold text-crust-dark hover:bg-[#E5B84B] hover:shadow-gold-lg active:scale-[0.98]"
                >
                  <MessageCirclePlus className="w-4.5 h-4.5" />
                  أضف تقييمك
                </button>
              </div>

              {/* Add Review Form */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="اسمك"
                    className="w-full h-10 px-4 rounded-lg bg-surface-cream border border-warm-brown/20 text-crust-dark text-sm font-tajawal placeholder:text-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-ghee-gold/40"
                  />
                  <textarea
                    placeholder="تقييمك..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-cream border border-warm-brown/20 text-crust-dark text-sm font-tajawal placeholder:text-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-ghee-gold/40 resize-none"
                  />
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full py-2.5 rounded-lg bg-crust-dark text-dough-cream font-bold text-sm hover:bg-crust-dark/90 transition-colors"
                  >
                    إرسال التقييم
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Reviews Masonry Grid */}
          <div className="flex-1">
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {reviews.map((review, i) => (
                <div key={review.id} className="break-inside-avoid">
                  <ReviewCard review={review} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

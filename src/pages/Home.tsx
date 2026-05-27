import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ChevronDown,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Flame,
  Award,
  Beef,
  Truck,
  Plus,
} from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { useLanguage } from '@/context/LanguageContext'
import { useOffers, getFormattedHours } from '@/context/OffersContext';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const dishes = [
  {
    id: 'mushaltat',
    name: 'فطيرة مشلتت وسط',
    nameEn: 'Mushaltat Pie Medium',
    desc: 'عجينة المشلتت اللذيذه من أفخم أنواع الدقيق والزبد البقري',
    descEn: 'Mushaltat dough made from premium flour and cow ghee',
    price: 25,
    image: '/item-m1.png',
    category: 'مشلتت',
    categoryEn: 'Mushaltat',
  },
  {
    id: 'mix-lahm',
    name: 'فطيرة مكس لحوم',
    nameEn: 'Mix Meat Pie',
    desc: 'لحم بقري بلدي محلي وسجق وبسطرمة مع جبنة رومي',
    descEn: 'Local beef, sausage & pastirma with romy cheese',
    price: 40,
    image: '/item-s1.png',
    category: 'حادق',
    categoryEn: 'Savory',
  },
  {
    id: 'helw',
    name: 'فطيرة حلو بالعسل',
    nameEn: 'Sweet Honey Pie',
    desc: 'عسل طبيعي مع كريمة طازجة وسكر بودرة',
    descEn: 'Natural honey with fresh cream & powdered sugar',
    price: 20,
    image: '/item-sw3.png',
    category: 'حلو',
    categoryEn: 'Sweet',
  },
  {
    id: 'crepe',
    name: 'كريب دجاج رانش',
    nameEn: 'Chicken Ranch Crepe',
    desc: 'دجاج مشوي مع صوص الرانش والخضار الطازج',
    descEn: 'Grilled chicken with ranch sauce & fresh veggies',
    price: 28,
    image: '/item-cr2.png',
    category: 'كريب',
    categoryEn: 'Crepe',
  },
  {
    id: 'pizza',
    name: 'بيتزا وجه مشكل',
    nameEn: 'Mixed Face Pizza',
    desc: 'عجينة رقيقة مع جبنة موزاريلا حقيقية ومواد طازجة',
    descEn: 'Thin dough with real mozzarella & fresh toppings',
    price: 35,
    image: '/item-pf1.png',
    category: 'بيتزا',
    categoryEn: 'Pizza',
  },
  {
    id: 'hawawshi',
    name: 'حواوشي لحم',
    nameEn: 'Hawawshi Meat',
    desc: 'لحم بقري مفروم متبل ببهارات شرقية في عجينة مقرمشة',
    descEn: 'Spiced ground beef in crispy dough',
    price: 30,
    image: '/item-hw1.png',
    category: 'حواوشي',
    categoryEn: 'Hawawshi',
  },
];

const categories = [
  { label: 'الكل', labelEn: 'All', value: 'all' },
  { label: 'مشلتت', labelEn: 'Mushaltat', value: 'مشلتت' },
  { label: 'حادق', labelEn: 'Savory', value: 'حادق' },
  { label: 'حلو', labelEn: 'Sweet', value: 'حلو' },
  { label: 'كريب', labelEn: 'Crepe', value: 'كريب' },
  { label: 'بيتزا', labelEn: 'Pizza', value: 'بيتزا' },
  { label: 'حواوشي', labelEn: 'Hawawshi', value: 'حواوشي' },
];

const testimonials = [
  {
    id: 1,
    name: 'أحمد السيد',
    nameEn: 'Ahmed Al-Sayed',
    stars: 5,
    text: 'أفضل فطير مشلتت في المدينة! العجينة طرية والحشوة وافرة. أنصح الجميع بتجربته.',
    textEn: 'Best mushaltat pie in Madinah! Soft dough and generous filling.',
    source: 'Google Review',
    avatar: '/customer-avatar-1.png',
  },
  {
    id: 2,
    name: 'فاطمة العلي',
    nameEn: 'Fatima Al-Ali',
    stars: 5,
    text: 'السمن البقري يفرق كثير! الطعم أصيل والخدمة سريعة. صرنا نطلب كل أسبوع.',
    textEn: 'The real ghee makes a huge difference! Authentic taste, fast service.',
    source: 'Instagram',
    avatar: '/customer-avatar-2.png',
  },
  {
    id: 3,
    name: 'خالد الراجحي',
    nameEn: 'Khaled Al-Rajhi',
    stars: 4,
    text: 'الكريب لذيذ بس أتمنى يضيفون أكثر من نكهة. الفطير المشلتت 10/10 بلا منازع.',
    textEn: 'The crepe is delicious but I wish they had more flavors. Mushaltat is 10/10.',
    source: 'Google Review',
    avatar: '/customer-avatar-3.png',
  },
];

const marqueeItems = [
  { name: 'فطيرة مشلتت كبير', nameEn: 'Large Mushaltat', price: 35, image: '/item-m1.png' },
  { name: 'فطيرة مكس لحوم', nameEn: 'Mix Meat Pie', price: 40, image: '/item-s1.png' },
  { name: 'فطيرة سجق', nameEn: 'Sausage Pie', price: 32, image: '/item-s5.png' },
  { name: 'كريب دجاج رانش', nameEn: 'Chicken Ranch Crepe', price: 28, image: '/item-cr2.png' },
  { name: 'فطيرة مكس جبن', nameEn: 'Mix Cheese Pie', price: 22, image: '/item-s2.png' },
  { name: 'فطيرة بسطرمة كيري', nameEn: 'Pastirma Kiri Pie', price: 38, image: '/item-s8.png' },
];

const features = [
  { icon: Award, title: 'جودة عالية', titleEn: 'Premium Quality', desc: 'مكونات منتقاة بعناية', descEn: 'Carefully selected ingredients' },
  { icon: Beef, title: 'سمن بقري 100%', titleEn: '100% Real Ghee', desc: 'سمن بلدي أصلي', descEn: 'Authentic local ghee' },
  { icon: Flame, title: 'لحوم طازجة', titleEn: 'Fresh Meat', desc: 'لحم يومي طازج', descEn: 'Daily fresh meat' },
  { icon: Truck, title: 'توصيل سريع', titleEn: 'Fast Delivery', desc: 'نوصلك بأسرع وقت', descEn: 'Quick delivery to your door' },
];

/* ------------------------------------------------------------------ */
/*  Tilt Card Component                                                */
/* ------------------------------------------------------------------ */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotate({
      x: (y - 0.5) * -8,
      y: (x - 0.5) * 8,
    });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Hours Card (dynamic from OffersContext) ─── */
function HoursCard() {
  const { workingDays } = useOffers();
  const formatted = getFormattedHours(workingDays);
  const { t } = useLanguage();
  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-ghee-gold" />
        <h3 className="font-cairo font-bold text-crust-dark">{t('ساعات العمل', 'Opening Hours')}</h3>
      </div>
      <div className="space-y-3">
        {formatted.map((h, i) => (
          <div key={i} className={`flex justify-between items-center ${i > 0 ? 'border-t border-ghee-gold/10 pt-3' : ''}`}>
            <span className="text-crust-dark/80 text-sm font-tajawal">{h.label}</span>
            <span className="text-ghee-gold font-semibold text-sm font-mono">{h.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Home Page                                                     */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { addItem } = useBasket();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  /* testimonials carousel */
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* hero particles via CSS for performance */
  const heroRef = useRef<HTMLDivElement>(null);

  const filteredDishes =
    activeCategory === 'all'
      ? dishes
      : dishes.filter((d) => d.category === activeCategory);

  return (
    <div className="overflow-hidden">
      {/* ============================================================= */}
      {/* SECTION 2: HERO                                               */}
      {/* ============================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-mushaltat.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(43,33,24,0.85)] via-[rgba(43,33,24,0.3)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(43,33,24,0.5)] to-transparent" />
        </div>

        {/* Floating Particles (CSS-based for performance) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-ghee-gold/20 animate-float"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center pt-[72px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            {/* Eyebrow */}
            <motion.p
              variants={staggerChild}
              className="text-ghee-gold font-tajawal font-medium text-sm tracking-[0.1em] mb-4"
            >
              {t('مطعم فطير شرقي — المدينة المنورة', 'Fetir Sharqi Restaurant — Madinah')}
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={staggerChild}
              className="font-cairo text-hero-display text-dough-cream max-w-3xl"
            >
              {t('فطير يهتم بصحتك', 'Pie That Cares For Your Health')}
            </motion.h1>

            {/* Golden accent line */}
            <motion.div
              variants={staggerChild}
              className="w-24 h-1 bg-ghee-gold rounded-full mt-6 mb-6"
            />

            {/* Subheadline */}
            <motion.p
              variants={staggerChild}
              className="text-dough-cream/90 font-tajawal text-body-large max-w-[600px] mb-8"
            >
              {t(
                'مشلتت بالسمن البقري 100%، جبنة موزاريلا حقيقية، لحم بقري طازج',
                'Mushaltat with 100% real cow ghee, authentic mozzarella, fresh beef'
              )}
            </motion.p>

            {/* CTA Row */}
            <motion.div
              variants={staggerChild}
              className="flex flex-wrap items-center justify-center gap-4 mb-10"
            >
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                {t('اطلب الآن', 'Order Now')}
              </Link>
              <a
                href="https://wa.me/966557478343"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-ghee-gold text-ghee-gold font-semibold hover:bg-ghee-gold/10 transition-colors"
              >
                {t('تواصل معنا', 'Contact Us')}
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={staggerChild}
              className="flex flex-wrap items-center justify-center gap-6 text-dough-cream/70 text-caption"
            >
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-ghee-gold fill-ghee-gold" />
                {t('4.5 تقييم Google', '4.5 Google Rating')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-ghee-gold" />
                {t('مفتوح حتى 1:00 ص', 'Open until 1:00 AM')}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-ghee-gold" />
                {t('الإسكان، شارع الأمير محمد', 'Al Iskan, Prince Mohammed St')}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-6 h-6 text-dough-cream/60 animate-bounce-subtle" />
        </motion.div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 3: HOT ITEMS MARQUEE                                  */}
      {/* ============================================================= */}
      <section className="bg-ember-orange py-5 overflow-hidden">
        <div className="container-custom mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-white" />
          <span className="font-cairo font-bold text-lg text-white">
            {t('الأكثر مبيعاً', 'Best Sellers')}
          </span>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee gap-6 shrink-0 pr-6">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 shrink-0 hover:bg-white/25 transition-colors cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={t(item.name, item.nameEn)}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-crust-dark font-semibold text-xs whitespace-nowrap">
                    {t(item.name, item.nameEn)}
                  </p>
                  <p className="text-ember-orange font-bold text-sm">{item.price} {t('ر.س', 'SAR')}</p>
                </div>
                <span className="flex items-center gap-1 bg-ember-orange/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {t('الأكثر طلباً', 'Hot')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 4: SIGNATURE DISHES GRID                              */}
      {/* ============================================================= */}
      <section className="bg-dough-cream section-padding">
        <div className="container-custom">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="font-cairo text-section-title text-crust-dark mb-3">
              {t('تشكيلتنا المميزة', 'Our Signature Collection')}
            </h2>
            <p className="text-body text-warm-brown mb-4">
              {t(
                'اختار من فطايرنا الشرقية اللي تذوب في الفم',
                'Choose from our mouth-watering Eastern pies'
              )}
            </p>
            <div className="w-[60px] h-[3px] bg-ghee-gold rounded-full mx-auto" />
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                variants={staggerChild}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'px-5 py-2.5 rounded-full font-cairo font-semibold text-sm transition-all duration-300',
                  activeCategory === cat.value
                    ? 'bg-crust-dark text-dough-cream'
                    : 'bg-surface-cream text-crust-dark hover:bg-ghee-gold/20'
                )}
              >
                {t(cat.label, cat.labelEn)}
              </motion.button>
            ))}
          </motion.div>

          {/* Dish Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                >
                  <TiltCard>
                    <div className="glass-card overflow-hidden group">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={dish.image}
                          alt={t(dish.name, dish.nameEn)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="absolute top-3 left-3 bg-crust-dark/80 text-dough-cream text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                          {t(dish.category, dish.categoryEn)}
                        </span>
                      </div>
                      {/* Body */}
                      <div className="p-5">
                        <h3 className="font-cairo font-bold text-lg text-crust-dark mb-1">
                          {t(dish.name, dish.nameEn)}
                        </h3>
                        <p className="text-warm-brown text-[13px] font-tajawal line-clamp-2 mb-4 min-h-[2.4em]">
                          {t(dish.desc, dish.descEn)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-ghee-gold font-bold text-lg">
                            {dish.price} {t('ر.س', 'SAR')}
                          </span>
                          <button
                            onClick={() =>
                              addItem({
                                id: dish.id,
                                name: t(dish.name, dish.nameEn),
                                price: dish.price,
                                image: dish.image,
                              })
                            }
                            className="flex items-center gap-1.5 bg-ghee-gold text-crust-dark font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-[#E5B84B] hover:shadow-gold transition-all duration-200 active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            {t('أضف للسلة', 'Add')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION: WHY US                                               */}
      {/* ============================================================= */}
      <section className="bg-surface-cream section-padding">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="font-cairo text-section-title text-crust-dark mb-3">
              {t('لماذا فطير شرقي؟', 'Why Fetir Sharqi?')}
            </h2>
            <div className="w-[60px] h-[3px] bg-ghee-gold rounded-full mx-auto" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerChild}
                className="glass-card p-8 text-center hover:shadow-gold transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-ghee-gold/15 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-ghee-gold" />
                </div>
                <h3 className="font-cairo font-bold text-lg text-crust-dark mb-2">
                  {t(f.title, f.titleEn)}
                </h3>
                <p className="text-warm-brown text-sm font-tajawal">
                  {t(f.desc, f.descEn)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 5: TESTIMONIALS                                       */}
      {/* ============================================================= */}
      <section className="relative bg-crust-dark section-padding overflow-hidden">
        {/* Background Image */}
        <img
          src="/testimonial-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-crust-dark/50 to-crust-dark/80" />

        <div className="relative z-10 container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="font-cairo text-section-title text-dough-cream mb-3">
              {t('آراء عملائنا', 'Customer Reviews')}
            </h2>
            <p className="text-body-large text-ghee-gold">
              {t('شوف اللي قالوه عن فطير شرقي', 'See what they said about Fetir Sharqi')}
            </p>
          </motion.div>

          {/* Testimonial Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((tm) => (
              <motion.div
                key={tm.id}
                variants={staggerChild}
                className="glass-card-dark p-8 flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < tm.stars ? 'text-ghee-gold fill-ghee-gold' : 'text-dough-cream/20'
                      )}
                    />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-dough-cream/90 font-tajawal text-base leading-relaxed italic mb-6 flex-1">
                  &ldquo;{t(tm.text, tm.textEn)}&rdquo;
                </p>
                {/* Divider */}
                <div className="border-t border-ghee-gold/10 pt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={tm.avatar}
                      alt={t(tm.name, tm.nameEn)}
                      className="w-12 h-12 rounded-full object-cover border-2 border-ghee-gold/30"
                    />
                    <div>
                      <p className="text-dough-cream font-cairo font-semibold text-sm">
                        {t(tm.name, tm.nameEn)}
                      </p>
                      <span className="text-ghee-gold/70 text-xs font-tajawal">
                        {tm.source}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Carousel dots (for mobile feel) */}
          <div className="flex items-center justify-center gap-2 mt-8 md:hidden">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-colors',
                  i === activeTestimonial ? 'bg-ghee-gold' : 'bg-dough-cream/30'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 6: CTA BANNER                                         */}
      {/* ============================================================= */}
      <section className="bg-ghee-gold py-20 md:py-28">
        <div className="container-custom text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerChild}
              className="font-cairo font-extrabold text-crust-dark mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              {t('جوعان؟ لا تنتظر!', 'Hungry? Don\'t Wait!')}
            </motion.h2>
            <motion.p
              variants={staggerChild}
              className="text-crust-dark/80 font-tajawal font-medium text-body-large max-w-lg mx-auto mb-8"
            >
              {t(
                'اطلب الآن ووصلك الطازج لباب بيتك',
                'Order now and get fresh food delivered to your door'
              )}
            </motion.p>
            <motion.div variants={staggerChild}>
              <a
                href="https://wa.me/966557478343"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-crust-dark font-bold text-lg px-12 py-5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 animate-pulse-scale"
                style={{ animationDuration: '3s' }}
              >
                <Phone className="w-6 h-6" />
                {t('اطلب عبر الواتساب', 'Order via WhatsApp')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 7: LOCATION & HOURS                                   */}
      {/* ============================================================= */}
      <section className="bg-surface-cream section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Column: Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2
                variants={staggerChild}
                className="font-cairo text-card-title text-crust-dark mb-6"
              >
                {t('زورنا هنا', 'Visit Us')}
              </motion.h2>

              <motion.div variants={staggerChild} className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-ghee-gold shrink-0 mt-0.5" />
                  <span className="text-crust-dark text-body font-tajawal">
                    {t(
                      'شارع الأمير محمد بن عبدالعزيز، حي الإسكان، المدينة المنورة',
                      'Prince Mohammed Bin Abdulaziz St, Al Iskan, Madinah'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-ghee-gold shrink-0" />
                  <a
                    href="tel:+966557478343"
                    className="text-ghee-gold font-semibold text-body hover:underline"
                  >
                    +966 55 747 8343
                  </a>
                </div>
              </motion.div>

              {/* Hours Card */}
              <HoursCard />

              {/* Social Links */}
              <motion.div variants={staggerChild} className="flex items-center gap-3">
                <span className="text-warm-brown text-sm font-tajawal mr-2">
                  {t('تابعنا:', 'Follow us:')}
                </span>
                <a
                  href="https://instagram.com/fetir.sharqi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ghee-gold/10 border border-ghee-gold/30 flex items-center justify-center text-ghee-gold hover:bg-ghee-gold hover:text-crust-dark transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/fetir.sharqi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ghee-gold/10 border border-ghee-gold/30 flex items-center justify-center text-ghee-gold hover:bg-ghee-gold hover:text-crust-dark transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="rounded-2xl overflow-hidden border-2 border-ghee-gold shadow-gold h-[400px] lg:h-full min-h-[400px]"
            >
              <iframe
                title="Fetir Sharqi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.689451000572!2d39.64985947631637!3d24.461557461101734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15bdbfe2bd47c7ed%3A0xd4acf1649db1cce6!2z2YHYt9mK2LEg2LTYsdmC2Yoo2YXYtNmE2KrYqiDZiCDYrdin2K_ZgiDZiCDYrdmE2Ygg2Ygg2YPYsdmK2Kgg2Ygg2KjZitiq2LLYpyAp!5e0!3m2!1sen!2sbe!4v1779627899772!5m2!1sen!2sbe"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION: INSTAGRAM FEED TEASER                                */}
      {/* ============================================================= */}
      <section className="bg-dough-cream py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <a
              href="https://instagram.com/fetir.sharqi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ghee-gold hover:text-ember-orange transition-colors mb-3"
            >
              <Instagram className="w-6 h-6" />
              <span className="font-cairo font-bold text-xl">@fetir.sharqi</span>
            </a>
            <p className="text-warm-brown text-body">
              {t('تابعنا على إنستقرام', 'Follow us on Instagram')} —{' '}
              <span className="font-bold text-crust-dark">12K+</span>{' '}
              {t('متابع', 'followers')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto"
          >
            {[
              '/item-m1.png',
              '/item-s1.png',
              '/item-sw3.png',
              '/item-cr2.png',
              '/hero-mushaltat.png',
              '/item-pf1.png',
              '/item-hw1.png',
              '/item-m2.png',
              '/item-sw1.png',
            ].map((img, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

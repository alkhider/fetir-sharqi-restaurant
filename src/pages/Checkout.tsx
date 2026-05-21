import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
  User,
  Phone,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Truck,
  CreditCard,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Home,
  Store,
  Banknote,
} from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FormData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'card';
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const generateOrderNumber = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `FS-${yy}${mm}${dd}-${seq}`;
};

const saudiPhoneRegex = /^(5\d{8})$/;

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('966')) return digits.slice(3);
  if (digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const VAT_RATE = 0.15;
const DELIVERY_FEE = 18;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Checkout() {
  const { items, totalPrice, updateQuantity, clearBasket } = useBasket();

  /* --- form state --- */
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    notes: '',
    orderType: 'delivery',
    paymentMethod: 'cash',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber] = useState(() => generateOrderNumber());
  const [promoCode, setPromoCode] = useState('');

  /* --- derived pricing --- */
  const subtotal = totalPrice;
  const vat = subtotal * VAT_RATE;
  const deliveryFee = form.orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + vat + deliveryFee;

  /* --- validation --- */
  const validate = useCallback((): boolean => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) {
      next.fullName = 'الاسم الكامل مطلوب';
    } else if (form.fullName.trim().length < 3) {
      next.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    const phoneDigits = formatPhone(form.phone);
    if (!phoneDigits) {
      next.phone = 'رقم الجوال مطلوب';
    } else if (!saudiPhoneRegex.test(phoneDigits)) {
      next.phone = 'رقم الجوال غير صحيح (مثال: 55 747 8343)';
    }

    if (form.orderType === 'delivery' && !form.address.trim()) {
      next.address = 'العنوان مطلوب للتوصيل';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validate();
    }
  }, [form, touched, validate]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* --- WhatsApp message --- */
  const whatsappMessage = useMemo(() => {
    const lines: string[] = [];
    lines.push('🥧 *طلب جديد من فطير شرقي*');
    lines.push('━━━━━━━━━━━━━━━');
    lines.push(`👤 *الاسم:* ${form.fullName || '—'}`);
    lines.push(`📱 *الجوال:* +966 ${formatPhone(form.phone) || '—'}`);
    if (form.orderType === 'delivery') {
      lines.push(`📍 *العنوان:* ${form.address || '—'}`);
    } else {
      lines.push('📍 *استلام من الفرع*');
    }
    lines.push('━━━━━━━━━━━━━━━');
    lines.push('🛒 *الطلب:*');
    items.forEach((item) => {
      lines.push(`• ${item.name} ×${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ر.س`);
      if (item.notes) lines.push(`  📝 ${item.notes}`);
    });
    lines.push('━━━━━━━━━━━━━━━');
    lines.push(`💰 *المجموع:* ${subtotal.toFixed(2)} ر.س`);
    lines.push(`📦 *التوصيل:* ${deliveryFee > 0 ? deliveryFee.toFixed(2) + ' ر.س' : 'مجاني'}`);
    lines.push(`🧾 *الضريبة (15%):* ${vat.toFixed(2)} ر.س`);
    lines.push(`💳 *الإجمالي:* ${total.toFixed(2)} ر.س`);
    lines.push(`💵 *طريقة الدفع:* ${form.paymentMethod === 'cash' ? 'كاش' : 'شبكة (مدى/فيزا)'}`);
    if (form.notes) lines.push(`📝 *ملاحظات:* ${form.notes}`);
    lines.push(`🏷️ *رقم الطلب:* #${orderNumber}`);
    return lines.join('\n');
  }, [form, items, subtotal, vat, deliveryFee, total, orderNumber]);

  /* --- submit --- */
  const handleSubmit = () => {
    setTouched({ fullName: true, phone: true, address: true });
    if (!validate()) return;

    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/966557478343?text=${encoded}`, '_blank');

    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#D4A844', '#E5B84B', '#27AE60', '#FDF6EC', '#D4652A'],
      disableForReducedMotion: true,
    });

    /* save order to localStorage history */
    try {
      const history = JSON.parse(localStorage.getItem('fetir-orders') || '[]');
      history.unshift({
        orderNumber,
        date: new Date().toISOString(),
        items: [...items],
        total,
        status: 'pending',
        paymentMethod: form.paymentMethod,
      });
      localStorage.setItem('fetir-orders', JSON.stringify(history.slice(0, 50)));
    } catch { /* ignore */ }

    clearBasket();
  };

  /* --- empty basket --- */
  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-[100dvh] bg-dough-cream pt-[72px]">
        {/* Header */}
        <div className="bg-crust-dark py-10">
          <div className="container-custom max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Link to="/" className="text-ghee-gold hover:underline">الرئيسية</Link>
              <ChevronRight className="w-4 h-4 text-ghee-gold/60" />
              <span className="text-ghee-gold/60">إتمام الطلب</span>
            </div>
            <h1 className="font-cairo font-bold text-section-title text-dough-cream">
              إتمام طلبك
            </h1>
            <p className="text-ghee-gold/80 mt-1">راجع طلبك وأرسله مباشرة للمطعم</p>
          </div>
        </div>

        <div className="container-custom max-w-[1200px] mx-auto px-4 py-20 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-surface-cream flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-warm-brown/40" />
          </div>
          <h2 className="font-cairo font-bold text-2xl text-crust-dark mb-2">
            السلة فارغة
          </h2>
          <p className="text-warm-brown mb-6 text-center max-w-sm">
            لم تضف أي أصناف إلى السلة بعد. تصفح المنيو واختر ما يعجبك!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-ghee-gold text-crust-dark font-bold px-8 py-4 rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-[1.03] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            تصفح المنيو
          </Link>
        </div>
      </div>
    );
  }

  /* --- success screen --- */
  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-dough-cream pt-[72px] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
          {/* Checkmark */}
          <div className="w-24 h-24 rounded-full bg-success-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-success-green" />
          </div>

          <h1 className="font-cairo font-bold text-[28px] text-crust-dark mb-3">
            تم إرسال طلبك!
          </h1>
          <p className="text-warm-brown text-body mb-6 leading-relaxed">
            تم إرسال طلبك بنجاح عبر الواتساب. سنتواصل معك خلال دقائق لتأكيد الطلب.
          </p>

          {/* Order reference */}
          <div className="bg-surface-cream rounded-xl px-6 py-4 mb-6 inline-flex flex-col items-center gap-1">
            <span className="text-sm text-warm-brown">رقم الطلب</span>
            <span className="font-mono font-bold text-lg text-crust-dark">
              #{orderNumber}
            </span>
          </div>

          {/* Estimated time */}
          <div className="flex items-center justify-center gap-2 text-success-green font-semibold mb-8">
            <Clock className="w-5 h-5" />
            <span>الوقت المتوقع: 30–45 دقيقة</span>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-center gap-2 text-warm-brown text-sm mb-10">
            <Phone className="w-4 h-4" />
            <span>للاستفسار: </span>
            <a href="tel:+966557478343" className="text-ghee-gold font-semibold hover:underline" dir="ltr">
              +966 55 747 8343
            </a>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 bg-ghee-gold text-crust-dark font-bold px-6 py-3 rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-[1.03] transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              متابعة التسوق
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-ghee-gold text-ghee-gold font-bold px-6 py-3 rounded-xl hover:bg-ghee-gold/10 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================== */
  /*  MAIN CHECKOUT UI                                                  */
  /* ================================================================== */
  return (
    <div className="min-h-[100dvh] bg-dough-cream pt-[72px]">
      {/* ---- Header ---- */}
      <div className="bg-crust-dark py-10">
        <div className="container-custom max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link to="/" className="text-ghee-gold hover:underline">الرئيسية</Link>
            <ChevronRight className="w-4 h-4 text-ghee-gold/60" />
            <Link to="/menu" className="text-ghee-gold hover:underline">المنيو</Link>
            <ChevronRight className="w-4 h-4 text-ghee-gold/60" />
            <span className="text-ghee-gold/60">إتمام الطلب</span>
          </div>
          <h1 className="font-cairo font-bold text-section-title text-dough-cream">
            إتمام طلبك
          </h1>
          <p className="text-ghee-gold/80 mt-1">راجع طلبك وأرسله مباشرة للمطعم</p>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="container-custom max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ============================================================ */}
          {/*  LEFT: Order Summary                                         */}
          {/* ============================================================ */}
          <div className="lg:w-[55%] order-1 lg:order-1">
            <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-[100px]">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-cairo font-bold text-xl text-crust-dark">
                    ملخص الطلب
                  </h2>
                  <span className="bg-ghee-gold/15 text-crust-dark text-xs font-bold px-2.5 py-1 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)} أصناف
                  </span>
                </div>
                <Link
                  to="/menu"
                  className="text-sm text-ghee-gold font-semibold hover:underline"
                >
                  تعديل
                </Link>
              </div>

              {/* Items list */}
              <div className="max-h-[400px] overflow-y-auto space-y-3 mb-6 pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 bg-surface-cream/50 rounded-xl p-3"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-crust-dark leading-tight">
                            {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-warm-brown mt-0.5">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-sm text-crust-dark whitespace-nowrap">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </p>
                      </div>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-warm-brown/20 flex items-center justify-center text-crust-dark hover:bg-ghee-gold/20 transition-colors"
                        >
                          {item.quantity <= 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-error-red" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-sm font-bold text-crust-dark w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-warm-brown/20 flex items-center justify-center text-crust-dark hover:bg-ghee-gold/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="كود الخصم"
                  className="flex-1 h-11 bg-dough-cream border border-warm-brown/20 rounded-xl px-4 text-sm focus:outline-none focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20 transition-all"
                />
                <button className="h-11 px-5 bg-crust-dark text-dough-cream font-semibold rounded-xl hover:bg-crust-dark/90 transition-colors text-sm">
                  تطبيق
                </button>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 border-t border-warm-brown/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-brown">المجموع</span>
                  <span className="font-semibold text-crust-dark">{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-brown">رسوم التوصيل</span>
                  <span className="font-semibold text-crust-dark">
                    {form.orderType === 'delivery' ? `${deliveryFee.toFixed(2)} ر.س` : 'مجاني'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-brown">الضريبة (15%)</span>
                  <span className="font-semibold text-crust-dark">{vat.toFixed(2)} ر.س</span>
                </div>
                <div className="border-t border-ghee-gold/30 pt-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-crust-dark">الإجمالي</span>
                    <span className="font-extrabold text-ghee-gold text-metric-display">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated time */}
              <div className="flex items-center gap-2 mt-5 text-success-green text-sm font-semibold bg-success-green/5 rounded-xl px-4 py-2.5">
                <Clock className="w-4 h-4" />
                <span>الوقت المتوقع: 25–35 دقيقة</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/*  RIGHT: Customer Details Form                                */}
          {/* ============================================================ */}
          <div className="lg:w-[45%] order-2 lg:order-2">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-cairo font-bold text-xl text-crust-dark mb-5">
                بيانات التوصيل
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                    الاسم الكامل <span className="text-error-red">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="محمد أحمد"
                      className={cn(
                        'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                        errors.fullName && touched.fullName
                          ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                          : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                      )}
                    />
                  </div>
                  {errors.fullName && touched.fullName && (
                    <p className="text-error-red text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                    رقم الجوال <span className="text-error-red">*</span>
                  </label>
                  <div className="relative flex gap-2">
                    <span className="h-12 flex items-center px-3 bg-surface-cream border border-warm-brown/20 rounded-xl text-sm font-semibold text-crust-dark shrink-0" dir="ltr">
                      +966
                    </span>
                    <div className="relative flex-1">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        placeholder="55 747 8343"
                        dir="ltr"
                        className={cn(
                          'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                          errors.phone && touched.phone
                            ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                            : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                        )}
                      />
                    </div>
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-error-red text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-sm font-semibold text-crust-dark mb-2">
                    نوع الطلب
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleChange('orderType', 'delivery')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border',
                        form.orderType === 'delivery'
                          ? 'bg-ghee-gold border-ghee-gold text-crust-dark shadow-gold'
                          : 'bg-surface-cream border-warm-brown/20 text-warm-brown hover:border-ghee-gold/50'
                      )}
                    >
                      <Truck className="w-4 h-4" />
                      توصيل
                    </button>
                    <button
                      onClick={() => handleChange('orderType', 'pickup')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border',
                        form.orderType === 'pickup'
                          ? 'bg-ghee-gold border-ghee-gold text-crust-dark shadow-gold'
                          : 'bg-surface-cream border-warm-brown/20 text-warm-brown hover:border-ghee-gold/50'
                      )}
                    >
                      <Store className="w-4 h-4" />
                      استلام من الفرع
                    </button>
                  </div>
                </div>

                {/* Address (conditional) */}
                {form.orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                      العنوان <span className="text-error-red">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-3 w-5 h-5 text-warm-brown/50" />
                      <textarea
                        value={form.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                        placeholder="حي الإسكان، شارع..."
                        rows={3}
                        className={cn(
                          'w-full bg-dough-cream border rounded-xl pr-10 pl-4 pt-2.5 text-sm focus:outline-none transition-all resize-none',
                          errors.address && touched.address
                            ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                            : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                        )}
                      />
                    </div>
                    {errors.address && touched.address && (
                      <p className="text-error-red text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                    ملاحظات إضافية <span className="text-warm-brown/50">(اختياري)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-warm-brown/50" />
                    <textarea
                      value={form.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="أي طلبات خاصة..."
                      rows={2}
                      className="w-full bg-dough-cream border border-warm-brown/20 rounded-xl pr-10 pl-4 pt-2.5 text-sm focus:outline-none focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-crust-dark mb-2">
                    طريقة الدفع
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleChange('paymentMethod', 'cash')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border',
                        form.paymentMethod === 'cash'
                          ? 'bg-ghee-gold border-ghee-gold text-crust-dark shadow-gold'
                          : 'bg-surface-cream border-warm-brown/20 text-warm-brown hover:border-ghee-gold/50'
                      )}
                    >
                      <Banknote className="w-4 h-4" />
                      كاش عند الاستلام
                    </button>
                    <button
                      onClick={() => handleChange('paymentMethod', 'card')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border',
                        form.paymentMethod === 'card'
                          ? 'bg-ghee-gold border-ghee-gold text-crust-dark shadow-gold'
                          : 'bg-surface-cream border-warm-brown/20 text-warm-brown hover:border-ghee-gold/50'
                      )}
                    >
                      <CreditCard className="w-4 h-4" />
                      شبكة (مدى/فيزا)
                    </button>
                  </div>
                </div>

                {/* WhatsApp Preview Accordion */}
                <div className="border border-warm-brown/15 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowPreview((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface-cream/50 hover:bg-surface-cream transition-colors"
                  >
                    <span className="text-sm font-semibold text-crust-dark">معاينة الرسالة</span>
                    {showPreview ? (
                      <ChevronUp className="w-4 h-4 text-warm-brown" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-warm-brown" />
                    )}
                  </button>
                  {showPreview && (
                    <div className="p-4 bg-crust-dark/5 border-t border-warm-brown/10">
                      <pre
                        className="text-xs text-crust-dark font-mono leading-relaxed whitespace-pre-wrap break-words"
                        dir="ltr"
                        style={{ textAlign: 'left' }}
                      >
                        {whatsappMessage}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full h-14 bg-success-green text-white font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(39,174,96,0.3)] hover:shadow-[0_6px_24px_rgba(39,174,96,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  إرسال الطلب عبر واتساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Delivery Info Banner ---- */}
      <div className="bg-surface-cream py-12 mt-8">
        <div className="container-custom max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <InfoCard
              icon={<Truck className="w-8 h-8" />}
              title="توصيل سريع"
              desc="نوصلك طلبك خلال 25–35 دقيقة"
            />
            <InfoCard
              icon={<CreditCard className="w-8 h-8" />}
              title="دفع عند الاستلام"
              desc="ادفع نقدي أو بالبطاقة عند استلام طلبك"
            />
            <InfoCard
              icon={<Clock className="w-8 h-8" />}
              title="تتبع طلبك"
              desc="تابع حالة طلبك لحظة بلحظة"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/*  Sub-components                                                       */
/* ===================================================================== */

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-6">
      <div className="w-14 h-14 rounded-full bg-ghee-gold/10 flex items-center justify-center text-ghee-gold">
        {icon}
      </div>
      <h3 className="font-cairo font-bold text-base text-crust-dark">{title}</h3>
      <p className="text-sm text-warm-brown leading-relaxed">{desc}</p>
    </div>
  );
}

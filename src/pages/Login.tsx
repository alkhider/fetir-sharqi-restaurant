import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  MapPin,
  ShoppingBag,
  Star,
  Gift,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Home,
  Settings,
  Award,
  Check,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface LoginForm {
  phone: string;
  password: string;
}

interface RegisterForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  agreeTerms: boolean;
}

interface MockOrder {
  orderNumber: string;
  date: string;
  items: string;
  itemCount: number;
  total: number;
  status: 'delivered' | 'preparing' | 'cancelled' | 'pending';
}

/* ------------------------------------------------------------------ */
/*  Constants & Mock Data                                              */
/* ------------------------------------------------------------------ */
const CURRENT_POINTS = 1250;

const REWARDS = [
  { label: 'خصم 10%', points: 500, icon: <Star className="w-5 h-5" />, available: true },
  { label: 'توصيل مجاني', points: 300, icon: <Package className="w-5 h-5" />, available: true },
  { label: 'خصم 20%', points: 1000, icon: <Award className="w-5 h-5" />, available: true },
  { label: 'فطيرة مجانية', points: 1500, icon: <Gift className="w-5 h-5" />, available: false },
];

const MOCK_ORDERS: MockOrder[] = [
  { orderNumber: 'FS-250108-284', date: '8 يناير 2025', items: 'فطيرة مشلتت (كبير)، كريب دجاج رانش', itemCount: 2, total: 52, status: 'delivered' },
  { orderNumber: 'FS-241215-891', date: '15 ديسمبر 2024', items: 'حواوشي لحم، فطيرة حلو بالعسل، مشروب', itemCount: 3, total: 68, status: 'delivered' },
  { orderNumber: 'FS-241128-452', date: '28 نوفمبر 2024', items: 'بيتزا فايس، فطيرة مشلتت', itemCount: 2, total: 45, status: 'delivered' },
  { orderNumber: 'FS-241103-117', date: '3 نوفمبر 2024', items: 'كريب دجاج رانش ×2، حواوشي', itemCount: 3, total: 78, status: 'cancelled' },
  { orderNumber: 'FS-240912-634', date: '12 سبتمبر 2024', items: 'فطيرة مشلتت (وسط)، عصير', itemCount: 2, total: 32, status: 'delivered' },
  { orderNumber: 'FS-240818-905', date: '18 أغسطس 2024', items: 'فطيرة حلو بالعسل ×2', itemCount: 2, total: 40, status: 'delivered' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const saudiPhoneRegex = /^(5\d{8})$/;

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('966')) return digits.slice(3);
  if (digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const getPasswordStrength = (pwd: string): { label: string; color: string; width: number } => {
  if (!pwd) return { label: '', color: '', width: 0 };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { label: 'ضعيفة', color: 'bg-error-red', width: 25 };
  if (score === 2) return { label: 'متوسطة', color: 'bg-warning-amber', width: 50 };
  if (score === 3) return { label: 'جيدة', color: 'bg-ghee-gold', width: 75 };
  return { label: 'قوية', color: 'bg-success-green', width: 100 };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('fetir-auth') === '1';
  });
  const [showPassword, setShowPassword] = useState(false);

  /* Login form */
  const [loginForm, setLoginForm] = useState<LoginForm>({ phone: '', password: '' });
  const [loginErrors, setLoginErrors] = useState<Partial<LoginForm>>({});
  const [loginTouched, setLoginTouched] = useState<Record<string, boolean>>({});

  /* Register form */
  const [regForm, setRegForm] = useState<RegisterForm>({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '', address: '', agreeTerms: false,
  });
  const [regErrors, setRegErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [regTouched, setRegTouched] = useState<Record<string, boolean>>({});

  /* Password strength */
  const pwdStrength = getPasswordStrength(regForm.password);

  /* --- Validation --- */
  const validateLogin = useCallback((): boolean => {
    const next: Partial<LoginForm> = {};
    const phoneDigits = formatPhone(loginForm.phone);
    if (!phoneDigits) next.phone = 'رقم الجوال مطلوب';
    else if (!saudiPhoneRegex.test(phoneDigits)) next.phone = 'رقم الجوال غير صحيح';
    if (!loginForm.password) next.password = 'كلمة المرور مطلوبة';
    else if (loginForm.password.length < 6) next.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    setLoginErrors(next);
    return Object.keys(next).length === 0;
  }, [loginForm]);

  const validateRegister = useCallback((): boolean => {
    const next: Partial<Record<keyof RegisterForm, string>> = {};
    if (!regForm.fullName.trim()) next.fullName = 'الاسم الكامل مطلوب';
    else if (regForm.fullName.trim().length < 3) next.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';

    const phoneDigits = formatPhone(regForm.phone);
    if (!phoneDigits) next.phone = 'رقم الجوال مطلوب';
    else if (!saudiPhoneRegex.test(phoneDigits)) next.phone = 'رقم الجوال غير صحيح';

    if (regForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) {
      next.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!regForm.password) next.password = 'كلمة المرور مطلوبة';
    else if (regForm.password.length < 6) next.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';

    if (regForm.password !== regForm.confirmPassword) {
      next.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    if (!regForm.agreeTerms) next.agreeTerms = 'يجب الموافقة على الشروط والأحكام';
    setRegErrors(next);
    return Object.keys(next).length === 0;
  }, [regForm]);

  useEffect(() => {
    if (Object.keys(loginTouched).length > 0) validateLogin();
  }, [loginForm, loginTouched, validateLogin]);

  useEffect(() => {
    if (Object.keys(regTouched).length > 0) validateRegister();
  }, [regForm, regTouched, validateRegister]);

  /* --- Handlers --- */
  const handleLoginSubmit = () => {
    setLoginTouched({ phone: true, password: true });
    if (!validateLogin()) return;
    setIsLoggedIn(true);
    localStorage.setItem('fetir-auth', '1');
  };

  const handleRegisterSubmit = () => {
    setRegTouched({ fullName: true, phone: true, password: true, confirmPassword: true, agreeTerms: true });
    if (!validateRegister()) return;
    setIsLoggedIn(true);
    localStorage.setItem('fetir-auth', '1');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('fetir-auth');
    setActiveTab('login');
    setLoginForm({ phone: '', password: '' });
    setLoginTouched({});
    setLoginErrors({});
  };

  /* ================================================================== */
  /*  LOYALTY DASHBOARD (shown when logged in)                          */
  /* ================================================================== */
  if (isLoggedIn) {
    return (
      <div className="min-h-[100dvh] bg-dough-cream pt-[72px]">
        {/* Header */}
        <div className="bg-crust-dark py-8">
          <div className="container-custom max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Link to="/" className="text-ghee-gold hover:underline">الرئيسية</Link>
              <ChevronRight className="w-4 h-4 text-ghee-gold/60" />
              <span className="text-ghee-gold/60">حسابي</span>
            </div>
            <h1 className="font-cairo font-bold text-section-title text-dough-cream">
              لوحة العميل
            </h1>
          </div>
        </div>

        <div className="container-custom max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ---- Sidebar ---- */}
            <aside className="lg:w-[260px] shrink-0">
              <div className="lg:sticky lg:top-[100px] space-y-6">
                {/* User card */}
                <div className="glass-card rounded-2xl p-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-ghee-gold text-crust-dark font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                    {regForm.fullName ? regForm.fullName.charAt(0) : 'م'}
                  </div>
                  <h3 className="font-cairo font-bold text-base text-crust-dark">
                    {regForm.fullName || 'محمد أحمد'}
                  </h3>
                  <p className="text-xs text-warm-brown mt-1" dir="ltr">
                    +966 {formatPhone(regForm.phone || '557478343')}
                  </p>
                </div>

                {/* Nav */}
                <nav className="glass-card rounded-2xl overflow-hidden">
                  <SidebarItem icon={<Home className="w-5 h-5" />} label="لوحتي" active />
                  <SidebarItem icon={<Package className="w-5 h-5" />} label="طلباتي" />
                  <SidebarItem icon={<Star className="w-5 h-5" />} label="نقاطي" />
                  <SidebarItem icon={<Settings className="w-5 h-5" />} label="الإعدادات" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-error-red hover:bg-error-red/5 transition-colors text-right"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-semibold">تسجيل الخروج</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* ---- Main Content ---- */}
            <main className="flex-1 space-y-8">
              {/* Loyalty Points Hero */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ghee-gold via-ghee-gold to-[#C49A3A] p-6 md:p-8">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232B2118' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Points */}
                    <div>
                      <p className="text-sm text-crust-dark/70 mb-1">نقاطك الحالية</p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-metric-display text-crust-dark">
                          {CURRENT_POINTS.toLocaleString('ar-SA')}
                        </span>
                        <span className="text-lg text-crust-dark">نقطة</span>
                      </div>
                      <p className="text-sm text-crust-dark/70 mt-2">
                        250 نقطة للمكافأة التالية!
                      </p>
                    </div>
                    {/* Progress */}
                    <div className="md:w-1/2">
                      <div className="h-3 bg-crust-dark/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-crust-dark rounded-full transition-all duration-1000"
                          style={{ width: '80%' }}
                        />
                      </div>
                      <p className="text-xs text-crust-dark/60 mt-2">
                        كل 1 ريال = 1 نقطة
                      </p>
                    </div>
                  </div>

                  {/* Quick reward */}
                  <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 inline-flex items-center gap-2">
                    <Gift className="w-5 h-5 text-crust-dark" />
                    <span className="text-sm font-semibold text-crust-dark">
                      خصم 10% على طلبك القادم — متاح الآن!
                    </span>
                  </div>
                </div>
              </section>

              {/* Rewards Catalog */}
              <section>
                <h2 className="font-cairo font-bold text-xl text-crust-dark mb-4">
                  مكافآت الولاء
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {REWARDS.map((reward) => (
                    <div
                      key={reward.label}
                      className={cn(
                        'glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all',
                        reward.available ? 'opacity-100' : 'opacity-60'
                      )}
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        reward.available ? 'bg-ghee-gold/15 text-ghee-gold' : 'bg-warm-brown/10 text-warm-brown'
                      )}>
                        {reward.icon}
                      </div>
                      <h3 className="font-bold text-base text-crust-dark">{reward.label}</h3>
                      <p className="text-sm text-warm-brown">
                        {reward.points.toLocaleString('ar-SA')} نقطة
                      </p>
                      <button
                        disabled={!reward.available || CURRENT_POINTS < reward.points}
                        className={cn(
                          'w-full py-2 rounded-xl text-sm font-semibold transition-all',
                          reward.available && CURRENT_POINTS >= reward.points
                            ? 'bg-ghee-gold text-crust-dark hover:shadow-gold hover:scale-[1.02]'
                            : 'bg-surface-cream text-warm-brown cursor-not-allowed'
                        )}
                      >
                        {CURRENT_POINTS >= reward.points ? 'استبدال' : 'نقاط غير كافية'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Order History */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-cairo font-bold text-xl text-crust-dark">
                    سجل الطلبات
                  </h2>
                  <span className="text-sm text-warm-brown">آخر 6 طلبات</span>
                </div>
                <div className="glass-card rounded-2xl overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_100px_120px] gap-4 bg-crust-dark text-dough-cream px-5 py-3 text-sm font-semibold">
                    <span>رقم الطلب</span>
                    <span>التاريخ</span>
                    <span>الأصناف</span>
                    <span className="text-center">الحالة</span>
                    <span className="text-left">الإجمالي</span>
                  </div>
                  {/* Rows */}
                  <div className="divide-y divide-warm-brown/10">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.orderNumber}
                        className="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_100px_120px] gap-2 md:gap-4 px-5 py-4 hover:bg-ghee-gold/5 transition-colors"
                      >
                        <div className="flex items-center justify-between md:justify-start gap-2">
                          <span className="md:hidden text-xs text-warm-brown">الطلب:</span>
                          <span className="font-mono text-sm font-semibold text-crust-dark">
                            #{order.orderNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between md:justify-start gap-2">
                          <span className="md:hidden text-xs text-warm-brown">التاريخ:</span>
                          <div className="flex items-center gap-1.5 text-sm text-warm-brown">
                            <Clock className="w-3.5 h-3.5" />
                            {order.date}
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-start gap-2">
                          <span className="md:hidden text-xs text-warm-brown">الأصناف:</span>
                          <span className="text-sm text-crust-dark truncate max-w-[200px]">
                            {order.items}
                          </span>
                        </div>
                        <div className="flex items-center justify-between md:justify-center gap-2">
                          <span className="md:hidden text-xs text-warm-brown">الحالة:</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-2">
                          <span className="md:hidden text-xs text-warm-brown">الإجمالي:</span>
                          <span className="font-bold text-sm text-crust-dark">
                            {order.total.toFixed(2)} ر.س
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section>
                <h2 className="font-cairo font-bold text-xl text-crust-dark mb-4">
                  إجراءات سريعة
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    to="/menu"
                    className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-gold transition-all hover:scale-[1.02] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-ghee-gold/10 flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-crust-dark transition-colors">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-crust-dark">طلب سريع</h3>
                      <p className="text-xs text-warm-brown">اطلب من المنيو</p>
                    </div>
                  </Link>
                  <button className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-gold transition-all hover:scale-[1.02] group text-right">
                    <div className="w-12 h-12 rounded-full bg-ghee-gold/10 flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-crust-dark transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-crust-dark">تعديل العنوان</h3>
                      <p className="text-xs text-warm-brown">تحديث عنوان التوصيل</p>
                    </div>
                  </button>
                  <button className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-gold transition-all hover:scale-[1.02] group text-right">
                    <div className="w-12 h-12 rounded-full bg-ghee-gold/10 flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-crust-dark transition-colors">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-crust-dark">المكافآت</h3>
                      <p className="text-xs text-warm-brown">استبدل نقاطك</p>
                    </div>
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================== */
  /*  LOGIN / REGISTER FORMS                                            */
  /* ================================================================== */
  return (
    <div className="min-h-[100dvh] bg-dough-cream pt-[72px]">
      {/* Header */}
      <div className="bg-crust-dark py-8">
        <div className="container-custom max-w-[520px] mx-auto px-4 text-center">
          <h1 className="font-cairo font-bold text-section-title text-dough-cream">
            انضم لعائلة فطير شرقي
          </h1>
          <p className="text-ghee-gold/80 mt-2">سجل الآن واكسب نقاط الولاء مع كل طلب</p>
        </div>
      </div>

      <div className="container-custom max-w-[520px] mx-auto px-4 py-10">
        {/* Benefits row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <BenefitCard icon={<Star className="w-5 h-5" />} title="نقاط ولاء" desc="اكسب نقطة مع كل ريال" />
          <BenefitCard icon={<Gift className="w-5 h-5" />} title="عروض حصرية" desc="خصومات للأعضاء فقط" />
          <BenefitCard icon={<Package className="w-5 h-5" />} title="حفظ الطلبات" desc="أعد طلبك المفضل بسرعة" />
        </div>

        {/* Glassmorphic form card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img
              src="/logo.png"
              alt="Fetir Sharqi"
              className="w-20 h-20 rounded-full border-4 border-ghee-gold object-cover"
            />
          </div>
          <p className="text-center font-cairo font-bold text-2xl text-crust-dark mb-6">
            أهلاً وسهلاً!
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl bg-surface-cream p-1 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300',
                activeTab === 'login'
                  ? 'bg-ghee-gold text-crust-dark shadow-sm'
                  : 'text-warm-brown hover:text-crust-dark'
              )}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300',
                activeTab === 'register'
                  ? 'bg-ghee-gold text-crust-dark shadow-sm'
                  : 'text-warm-brown hover:text-crust-dark'
              )}
            >
              إنشاء حساب
            </button>
          </div>

          {/* ==================== LOGIN TAB ==================== */}
          {activeTab === 'login' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  رقم الجوال
                </label>
                <div className="relative flex gap-2">
                  <span className="h-12 flex items-center px-3 bg-surface-cream border border-warm-brown/20 rounded-xl text-sm font-semibold text-crust-dark shrink-0" dir="ltr">
                    +966
                  </span>
                  <div className="relative flex-1">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                    <input
                      type="tel"
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm((p) => ({ ...p, phone: e.target.value }))}
                      onBlur={() => setLoginTouched((p) => ({ ...p, phone: true }))}
                      placeholder="55 747 8343"
                      dir="ltr"
                      className={cn(
                        'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                        loginErrors.phone && loginTouched.phone
                          ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                          : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                      )}
                    />
                  </div>
                </div>
                {loginErrors.phone && loginTouched.phone && (
                  <p className="text-error-red text-xs mt-1">{loginErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    onBlur={() => setLoginTouched((p) => ({ ...p, password: true }))}
                    placeholder="••••••"
                    className={cn(
                      'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-12 text-sm focus:outline-none transition-all',
                      loginErrors.password && loginTouched.password
                        ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                        : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                    )}
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/50 hover:text-warm-brown"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginErrors.password && loginTouched.password && (
                  <p className="text-error-red text-xs mt-1">{loginErrors.password}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="text-left">
                <button className="text-sm text-ghee-gold font-semibold hover:underline">
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Submit */}
              <button
                onClick={handleLoginSubmit}
                className="w-full h-14 bg-ghee-gold text-crust-dark font-bold text-lg rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                تسجيل الدخول
              </button>

              {/* Guest mode */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  localStorage.setItem('fetir-auth', '1');
                }}
                className="w-full h-12 border-2 border-warm-brown/20 text-warm-brown font-semibold rounded-xl hover:border-ghee-gold hover:text-ghee-gold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserCircle className="w-5 h-5" />
                تجربة الزائر
              </button>
            </div>
          )}

          {/* ==================== REGISTER TAB ==================== */}
          {activeTab === 'register' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  الاسم الكامل <span className="text-error-red">*</span>
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm((p) => ({ ...p, fullName: e.target.value }))}
                    onBlur={() => setRegTouched((p) => ({ ...p, fullName: true }))}
                    placeholder="محمد أحمد العلي"
                    className={cn(
                      'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                      regErrors.fullName && regTouched.fullName
                        ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                        : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                    )}
                  />
                </div>
                {regErrors.fullName && regTouched.fullName && (
                  <p className="text-error-red text-xs mt-1">{regErrors.fullName}</p>
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
                      value={regForm.phone}
                      onChange={(e) => setRegForm((p) => ({ ...p, phone: e.target.value }))}
                      onBlur={() => setRegTouched((p) => ({ ...p, phone: true }))}
                      placeholder="55 747 8343"
                      dir="ltr"
                      className={cn(
                        'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                        regErrors.phone && regTouched.phone
                          ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                          : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                      )}
                    />
                  </div>
                </div>
                {regErrors.phone && regTouched.phone && (
                  <p className="text-error-red text-xs mt-1">{regErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  البريد الإلكتروني <span className="text-warm-brown/50">(اختياري)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
                    onBlur={() => setRegTouched((p) => ({ ...p, email: true }))}
                    placeholder="email@example.com"
                    dir="ltr"
                    className={cn(
                      'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                      regErrors.email && regTouched.email
                        ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                        : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                    )}
                  />
                </div>
                {regErrors.email && regTouched.email && (
                  <p className="text-error-red text-xs mt-1">{regErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  كلمة المرور <span className="text-error-red">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regForm.password}
                    onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                    onBlur={() => setRegTouched((p) => ({ ...p, password: true }))}
                    placeholder="••••••"
                    className={cn(
                      'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-12 text-sm focus:outline-none transition-all',
                      regErrors.password && regTouched.password
                        ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                        : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                    )}
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/50 hover:text-warm-brown"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {regForm.password && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-surface-cream rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-300', pwdStrength.color)}
                        style={{ width: `${pwdStrength.width}%` }}
                      />
                    </div>
                    <p className={cn('text-xs mt-1', pwdStrength.color.replace('bg-', 'text-'))}>
                      {pwdStrength.label}
                    </p>
                  </div>
                )}
                {regErrors.password && regTouched.password && (
                  <p className="text-error-red text-xs mt-1">{regErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  تأكيد كلمة المرور <span className="text-error-red">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/50" />
                  <input
                    type="password"
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    onBlur={() => setRegTouched((p) => ({ ...p, confirmPassword: true }))}
                    placeholder="••••••"
                    className={cn(
                      'w-full h-12 bg-dough-cream border rounded-xl pr-10 pl-4 text-sm focus:outline-none transition-all',
                      regErrors.confirmPassword && regTouched.confirmPassword
                        ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
                        : 'border-warm-brown/20 focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20'
                    )}
                  />
                </div>
                {regErrors.confirmPassword && regTouched.confirmPassword && (
                  <p className="text-error-red text-xs mt-1">{regErrors.confirmPassword}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-crust-dark mb-1.5">
                  العنوان الافتراضي <span className="text-warm-brown/50">(اختياري)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-warm-brown/50" />
                  <textarea
                    value={regForm.address}
                    onChange={(e) => setRegForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="حي الإسكان، شارع..."
                    rows={2}
                    className="w-full bg-dough-cream border border-warm-brown/20 rounded-xl pr-10 pl-4 pt-2.5 text-sm focus:outline-none focus:border-ghee-gold focus:ring-2 focus:ring-ghee-gold/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div>
                <button
                  onClick={() => setRegForm((p) => ({ ...p, agreeTerms: !p.agreeTerms }))}
                  className="flex items-start gap-2 text-right"
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    regForm.agreeTerms
                      ? 'bg-ghee-gold border-ghee-gold'
                      : 'border-warm-brown/30'
                  )}>
                    {regForm.agreeTerms && <Check className="w-3.5 h-3.5 text-crust-dark" />}
                  </div>
                  <span className="text-sm text-crust-dark">
                    أوافق على{' '}
                    <span className="text-ghee-gold font-semibold hover:underline cursor-pointer">شروط الاستخدام</span>
                    {' '}و{' '}
                    <span className="text-ghee-gold font-semibold hover:underline cursor-pointer">سياسة الخصوصية</span>
                  </span>
                </button>
                {regErrors.agreeTerms && regTouched.agreeTerms && (
                  <p className="text-error-red text-xs mt-1">{regErrors.agreeTerms}</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleRegisterSubmit}
                className="w-full h-14 bg-ghee-gold text-crust-dark font-bold text-lg rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                إنشاء حساب
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-warm-brown/15" />
            <span className="text-xs text-warm-brown font-medium">أو</span>
            <div className="flex-1 h-px bg-warm-brown/15" />
          </div>

          {/* Social login buttons */}
          <button className="w-full h-12 bg-white border border-warm-brown/15 rounded-xl font-semibold text-sm text-crust-dark flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            تسجيل بواسطة Google
          </button>
          <button className="w-full h-12 bg-crust-dark text-dough-cream rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-crust-dark/90 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            تسجيل بواسطة Apple
          </button>

          {/* Bottom link */}
          <p className="text-center text-sm text-warm-brown mt-6">
            {activeTab === 'login' ? (
              <>
                مستخدم جديد؟{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-ghee-gold font-bold hover:underline"
                >
                  إنشاء حساب
                </button>
              </>
            ) : (
              <>
                عندك حساب؟{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-ghee-gold font-bold hover:underline"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/*  Sub-components                                                       */
/* ===================================================================== */

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-xl p-3 flex flex-col items-center text-center gap-2">
      <div className="w-10 h-10 rounded-full bg-ghee-gold/10 flex items-center justify-center text-ghee-gold">
        {icon}
      </div>
      <h3 className="font-bold text-xs text-crust-dark">{title}</h3>
      <p className="text-[11px] text-warm-brown leading-snug">{desc}</p>
    </div>
  );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors text-right',
        active
          ? 'border-r-[3px] border-ghee-gold bg-ghee-gold/10 text-crust-dark'
          : 'text-warm-brown hover:bg-surface-cream hover:text-crust-dark'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: MockOrder['status'] }) {
  const config = {
    delivered: { label: 'تم التوصيل', className: 'bg-success-green/10 text-success-green' },
    preparing: { label: 'قيد التحضير', className: 'bg-warning-amber/10 text-warning-amber' },
    pending: { label: 'معلق', className: 'bg-ghee-gold/10 text-ghee-gold' },
    cancelled: { label: 'ملغي', className: 'bg-error-red/10 text-error-red' },
  };
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold', c.className)}>
      {status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
      {(status === 'pending' || status === 'preparing') && <Clock className="w-3.5 h-3.5" />}
      {c.label}
    </span>
  );
}

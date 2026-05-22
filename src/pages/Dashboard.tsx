import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Megaphone,
  TrendingUp,
  ClipboardList,
  Users,
  FileUp,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Download,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/* ─────────────────────── animation helpers ─────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

/* ─────────────────────── mock data ─────────────────────── */

const monthlySales = [
  { month: 'Jul 2025', sales: 52000, orders: 890 },
  { month: 'Aug 2025', sales: 58000, orders: 1020 },
  { month: 'Sep 2025', sales: 64000, orders: 1120 },
  { month: 'Oct 2025', sales: 71000, orders: 1250 },
  { month: 'Nov 2025', sales: 78000, orders: 1380 },
  { month: 'Dec 2025', sales: 86000, orders: 1520 },
  { month: 'Jan 2026', sales: 92000, orders: 1630 },
  { month: 'Feb 2026', sales: 88000, orders: 1560 },
  { month: 'Mar 2026', sales: 95000, orders: 1670 },
  { month: 'Apr 2026', sales: 102000, orders: 1820 },
  { month: 'May 2026', sales: 108700, orders: 1836 },
];



const kpiSparkline = [42, 45, 48, 52, 56, 54, 58, 62, 60, 65, 68];

const orderTypeData = [
  { name: 'سفري', value: 42, color: '#D4A844' },
  { name: 'محلي', value: 25, color: '#D4652A' },
  { name: 'هاتف', value: 18, color: '#6B7F59' },
  { name: 'كيتا', value: 10, color: '#5B8FA8' },
  { name: 'هنجر ستيشن', value: 5, color: '#8C5E3C' },
];

const paymentTypeData = [
  { name: 'شبكة', value: 55, color: '#D4A844' },
  { name: 'نقدي', value: 35, color: '#6B7F59' },
  { name: 'آجل', value: 10, color: '#D4652A' },
];

const adSalesCorrelation = [
  { date: '01 May', adSpend: 1200, sales: 2800, messages: 45 },
  { date: '02 May', adSpend: 1350, sales: 3100, messages: 52 },
  { date: '03 May', adSpend: 1100, sales: 2900, messages: 38 },
  { date: '04 May', adSpend: 1500, sales: 3800, messages: 68 },
  { date: '05 May', adSpend: 1400, sales: 3600, messages: 61 },
  { date: '06 May', adSpend: 900, sales: 2400, messages: 32 },
  { date: '07 May', adSpend: 1600, sales: 4200, messages: 75 },
  { date: '08 May', adSpend: 1450, sales: 3900, messages: 63 },
  { date: '09 May', adSpend: 1300, sales: 3500, messages: 55 },
  { date: '10 May', adSpend: 1550, sales: 4100, messages: 72 },
  { date: '11 May', adSpend: 1000, sales: 2600, messages: 35 },
  { date: '12 May', adSpend: 1700, sales: 4500, messages: 80 },
  { date: '13 May', adSpend: 1500, sales: 4000, messages: 66 },
  { date: '14 May', adSpend: 1200, sales: 3100, messages: 48 },
  { date: '15 May', adSpend: 1800, sales: 4800, messages: 88 },
  { date: '16 May', adSpend: 1600, sales: 4400, messages: 74 },
  { date: '17 May', adSpend: 1100, sales: 2900, messages: 41 },
  { date: '18 May', adSpend: 1750, sales: 4700, messages: 85 },
  { date: '19 May', adSpend: 1400, sales: 3600, messages: 58 },
  { date: '20 May', adSpend: 1900, sales: 5100, messages: 92 },
  { date: '21 May', adSpend: 1650, sales: 4500, messages: 78 },
  { date: '22 May', adSpend: 1300, sales: 3400, messages: 52 },
  { date: '23 May', adSpend: 1550, sales: 4200, messages: 70 },
  { date: '24 May', adSpend: 1000, sales: 2700, messages: 36 },
  { date: '25 May', adSpend: 1700, sales: 4600, messages: 82 },
  { date: '26 May', adSpend: 1450, sales: 3900, messages: 64 },
  { date: '27 May', adSpend: 1200, sales: 3200, messages: 49 },
  { date: '28 May', adSpend: 1600, sales: 4300, messages: 73 },
  { date: '29 May', adSpend: 1350, sales: 3700, messages: 57 },
  { date: '30 May', adSpend: 1800, sales: 4900, messages: 87 },
];

const topItems = [
  { name: 'مشلتت وسط', category: 'مشلتت', qty: 4820, revenue: 144600, trend: 'up' as const },
  { name: 'سجق', category: 'حادق', qty: 3650, revenue: 91250, trend: 'up' as const },
  { name: 'مكس جبن', category: 'مشلتت', qty: 3180, revenue: 79500, trend: 'up' as const },
  { name: 'دجاج فاهيتا', category: 'كريب', qty: 2890, revenue: 115600, trend: 'up' as const },
  { name: 'مشلتت كبير', category: 'مشلتت', qty: 2640, revenue: 105600, trend: 'up' as const },
  { name: 'ببروني', category: 'بيتزا', qty: 2410, revenue: 84350, trend: 'down' as const },
  { name: 'حواوشي', category: 'حواوشي', qty: 2230, revenue: 66900, trend: 'down' as const },
  { name: 'كريب زنجر', category: 'كريب', qty: 2150, revenue: 75250, trend: 'up' as const },
  { name: 'مشلتت صغير', category: 'مشلتت', qty: 1980, revenue: 39600, trend: 'up' as const },
  { name: 'نوتيلا', category: 'حلو', qty: 1860, revenue: 46500, trend: 'up' as const },
  { name: 'كريب مشكل', category: 'كريب', qty: 1720, revenue: 60200, trend: 'down' as const },
  { name: 'سجق رومي', category: 'حادق', qty: 1650, revenue: 49500, trend: 'up' as const },
  { name: 'مكس لحوم', category: 'مشلتت', qty: 1580, revenue: 55300, trend: 'up' as const },
  { name: 'تونة', category: 'حادق', qty: 1420, revenue: 42600, trend: 'down' as const },
  { name: 'عسل وجبن', category: 'حلو', qty: 1350, revenue: 33750, trend: 'up' as const },
];

const forecastData = [
  { day: '1', historical: 3200, forecast: null, lower: null, upper: null },
  { day: '5', historical: 3400, forecast: null, lower: null, upper: null },
  { day: '10', historical: 3100, forecast: null, lower: null, upper: null },
  { day: '15', historical: 3800, forecast: null, lower: null, upper: null },
  { day: '20', historical: 3600, forecast: null, lower: null, upper: null },
  { day: '25', historical: 4100, forecast: null, lower: null, upper: null },
  { day: '30', historical: 3900, forecast: null, lower: null, upper: null },
  { day: '35', historical: 4200, forecast: null, lower: null, upper: null },
  { day: '40', historical: 4000, forecast: null, lower: null, upper: null },
  { day: '45', historical: 3800, forecast: null, lower: null, upper: null },
  { day: '50', historical: 4300, forecast: null, lower: null, upper: null },
  { day: '55', historical: 4100, forecast: null, lower: null, upper: null },
  { day: '60', historical: 4500, forecast: 4500, lower: 4200, upper: 4800 },
  { day: '65', historical: null, forecast: 4600, lower: 4250, upper: 4950 },
  { day: '70', historical: null, forecast: 4700, lower: 4350, upper: 5050 },
  { day: '75', historical: null, forecast: 4800, lower: 4400, upper: 5200 },
  { day: '80', historical: null, forecast: 4750, lower: 4350, upper: 5150 },
  { day: '85', historical: null, forecast: 4900, lower: 4450, upper: 5350 },
  { day: '90', historical: null, forecast: 5000, lower: 4500, upper: 5500 },
];

const channelData = [
  { name: 'مباشر', value: 45, fill: '#D4A844' },
  { name: 'هنجر ستيشن', value: 35, fill: '#5B8FA8' },
  { name: 'كيتا', value: 20, fill: '#D4652A' },
];

const seasonalityData = [
  ['#FDF6EC', '#FDF6EC', '#FDF6EC', '#F5E6D0', '#E5B84B', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0', '#FDF6EC'],
  ['#FDF6EC', '#FDF6EC', '#FDF6EC', '#F5E6D0', '#E5B84B', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0', '#FDF6EC'],
  ['#FDF6EC', '#FDF6EC', '#FDF6EC', '#F5E6D0', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#F5E6D0', '#FDF6EC'],
  ['#FDF6EC', '#FDF6EC', '#F5E6D0', '#E5B84B', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0'],
  ['#FDF6EC', '#FDF6EC', '#F5E6D0', '#E5B84B', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0'],
  ['#FDF6EC', '#FDF6EC', '#F5E6D0', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0'],
  ['#FDF6EC', '#FDF6EC', '#F5E6D0', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#D4A844', '#E5B84B', '#F5E6D0'],
];

const dayLabels = ['سبت', 'جمعة', 'خميس', 'أربعاء', 'ثلاثاء', 'إثنين', 'أحد'];
const hourLabels = ['12ص', '2ص', '4ص', '6ص', '8ص', '10ص', '12م', '2م', '4م', '6م', '8م', '10م'];

/* ─────────────────────── date filtering helpers ─────────────────────── */

const weeklySales = [
  { month: 'Sun', sales: 18500, orders: 320 },
  { month: 'Mon', sales: 16200, orders: 285 },
  { month: 'Tue', sales: 17800, orders: 310 },
  { month: 'Wed', sales: 22400, orders: 390 },
  { month: 'Thu', sales: 26100, orders: 450 },
  { month: 'Fri', sales: 19500, orders: 340 },
  { month: 'Sat', sales: 18800, orders: 325 },
];

const dailySales = [
  { month: '6 AM', sales: 1200, orders: 22 },
  { month: '8 AM', sales: 2100, orders: 38 },
  { month: '10 AM', sales: 2800, orders: 52 },
  { month: '12 PM', sales: 4200, orders: 78 },
  { month: '2 PM', sales: 5100, orders: 92 },
  { month: '4 PM', sales: 6800, orders: 118 },
  { month: '6 PM', sales: 8900, orders: 152 },
  { month: '8 PM', sales: 10200, orders: 178 },
  { month: '10 PM', sales: 9500, orders: 165 },
  { month: '12 AM', sales: 6200, orders: 108 },
];

const quarterlySales = [
  { month: 'Jul', sales: 62165, orders: 1282 },
  { month: 'Aug', sales: 63784, orders: 1232 },
  { month: 'Sep', sales: 51593, orders: 1027 },
  { month: 'Oct', sales: 60301, orders: 1142 },
  { month: 'Nov', sales: 81671, orders: 1529 },
  { month: 'Dec', sales: 104572, orders: 1858 },
  { month: 'Jan', sales: 141734, orders: 2337 },
  { month: 'Feb', sales: 91576, orders: 1491 },
  { month: 'Mar', sales: 124537, orders: 1926 },
];

function getFilteredSales(range: string) {
  switch (range) {
    case 'اليوم': return dailySales;
    case 'الأسبوع': return weeklySales;
    case 'الشهر': return monthlySales;
    case '3 أشهر': return quarterlySales;
    case 'سنة': return monthlySales;
    default: return monthlySales;
  }
}

function getFilteredAdCorrelation(range: string) {
  const len = range === 'اليوم' ? 7 : range === 'الأسبوع' ? 14 : range === 'الشهر' ? 30 : adSalesCorrelation.length;
  return adSalesCorrelation.slice(-len);
}

function getFilteredKPIs(range: string) {
  switch (range) {
    case 'اليوم':
      return { totalSales: 4087, totalOrders: 66, avgOrder: 61.9, adSpend: 478 };
    case 'الأسبوع':
      return { totalSales: 28612, totalOrders: 464, avgOrder: 61.7, adSpend: 3346 };
    case 'الشهر':
      return { totalSales: 94970, totalOrders: 1669, avgOrder: 56.9, adSpend: 12663 };
    case '3 أشهر':
      return { totalSales: 284912, totalOrders: 5007, avgOrder: 56.9, adSpend: 37990 };
    case 'سنة':
      return { totalSales: 949700, totalOrders: 16696, avgOrder: 56.9, adSpend: 45230 };
    default:
      return { totalSales: 949700, totalOrders: 16696, avgOrder: 56.9, adSpend: 45230 };
  }
}

function getSparklineForRange(range: string) {
  switch (range) {
    case 'اليوم': return [40, 42, 48, 55, 62, 68, 65];
    case 'الأسبوع': return [38, 42, 45, 52, 56, 60, 65];
    case 'الشهر': return kpiSparkline;
    case '3 أشهر': return [35, 40, 48, 55, 62, 58, 65];
    case 'سنة': return kpiSparkline;
    default: return kpiSparkline;
  }
}

function getChartSubtitle(range: string) {
  switch (range) {
    case 'اليوم': return 'اليوم — كل ساعتين';
    case 'الأسبوع': return 'هذا الأسبوع — يومياً';
    case 'الشهر': return 'May 2026';
    case '3 أشهر': return 'Mar — May 2026';
    case 'سنة': return 'Jul 2025 — May 2026';
    default: return 'Jul 2025 — May 2026';
  }
}

/* ─────────────────────── sidebar ─────────────────────── */

const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard', active: true },
  { icon: ShoppingCart, label: 'المبيعات', path: '/dashboard', active: false },
  { icon: Megaphone, label: 'الإعلانات', path: '/dashboard', active: false },
  { icon: TrendingUp, label: 'التنبؤات', path: '/dashboard', active: false },
  { icon: ClipboardList, label: 'الطلبات', path: '/operations', active: false },
  { icon: Users, label: 'إدارة العملاء', path: '/dashboard', active: false },
  { icon: FileUp, label: 'رفع الفواتير', path: '/data-processor', active: false },
];

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside
      dir="rtl"
      className="fixed top-0 right-0 h-full w-[280px] bg-crust-dark z-40 flex flex-col overflow-y-auto"
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-6 border-b border-ghee-gold/15">
        <img src="/logo-white.png" alt="logo" className="w-14 h-14 rounded-full object-cover" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-tajawal font-semibold transition-all duration-200',
              item.active
                ? 'bg-ghee-gold/15 text-ghee-gold border-r-2 border-ghee-gold'
                : 'text-dough-cream/70 hover:text-dough-cream hover:bg-white/5'
            )}
          >
            <item.icon className="w-[22px] h-[22px] shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-ghee-gold/15">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-10 h-10 rounded-full bg-ghee-gold/20 flex items-center justify-center text-ghee-gold font-cairo font-bold text-sm">
            أ م
          </div>
          <div className="text-right">
            <p className="text-dough-cream font-tajawal font-semibold text-sm">أحمد محمد</p>
            <p className="text-dough-cream/50 font-tajawal text-xs">مدير النظام</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-error-red/80 hover:text-error-red text-sm font-tajawal transition-colors">
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────── top bar ─────────────────────── */

const dateRanges = ['اليوم', 'الأسبوع', 'الشهر', '3 أشهر', 'سنة'];

interface TopBarProps {
  activeRange: string;
  onRangeChange: (range: string) => void;
}

function TopBar({ activeRange, onRangeChange }: TopBarProps) {
  const today = 'الثلاثاء، 20 مايو 2026';

  return (
    <div
      dir="rtl"
      className="h-16 bg-dough-cream border-b border-warm-brown/10 flex items-center justify-between px-6 sticky top-0 z-30"
    >
      {/* Title + Date */}
      <div className="flex items-center gap-4">
        <h1 className="font-cairo font-bold text-xl text-crust-dark">لوحة التحكم</h1>
        <span className="text-warm-brown text-sm font-tajawal">{today}</span>
      </div>

      {/* Date Range Selector */}
      <div className="hidden md:flex items-center bg-surface-cream rounded-full p-1 gap-1">
        {dateRanges.map((range) => (
          <button
            key={range}
            onClick={() => onRangeChange(range)}
            className={cn(
              'relative px-4 py-1.5 rounded-full text-sm font-tajawal font-semibold transition-all duration-200',
              activeRange === range
                ? 'text-crust-dark bg-ghee-gold shadow-gold'
                : 'text-warm-brown hover:text-crust-dark'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl text-warm-brown hover:text-ghee-gold hover:bg-ghee-gold/10 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="relative p-2 rounded-xl text-warm-brown hover:text-ghee-gold hover:bg-ghee-gold/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-error-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-cream hover:bg-ghee-gold/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-ghee-gold/20 flex items-center justify-center text-crust-dark font-cairo font-bold text-xs">
            أ م
          </div>
          <ChevronDown className="w-4 h-4 text-warm-brown" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── KPI card ─────────────────────── */

interface KPICardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  sparkline?: number[];
  index: number;
  decimals?: number;
}

function KPICard({ label, value, suffix, prefix, change, icon: Icon, accent, sparkline, index, decimals = 0 }: KPICardProps) {
  const isPositive = change >= 0;
  const sparkPoints = useMemo(() => {
    if (!sparkline || sparkline.length === 0) return '';
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    return sparkline
      .map((v, i) => {
        const x = (i / (sparkline.length - 1)) * 80 + 10;
        const y = 50 - ((v - min) / range) * 40;
        return `${x},${y}`;
      })
      .join(' ');
  }, [sparkline]);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-5 shadow-glass"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full',
            isPositive ? 'bg-sage-green/15 text-sage-green' : 'bg-error-red/15 text-error-red'
          )}
        >
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="font-inter font-bold text-metric-display text-crust-dark mb-1">
        {prefix}
        <CountUp end={value} duration={1.5} separator="," decimals={decimals} />
        {suffix}
      </div>
      <p className="text-warm-brown text-sm font-tajawal mb-3">{label}</p>
      {sparkline && (
        <svg viewBox="0 0 100 60" className="w-full h-12" preserveAspectRatio="none">
          <polyline
            points={sparkPoints}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.div>
  );
}

/* ─────────────────────── custom chart tooltip ─────────────────────── */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-ghee-gold/30 rounded-xl px-4 py-3 shadow-lg">
      <p className="font-tajawal font-semibold text-crust-dark text-sm mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-tajawal">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-warm-brown">{entry.name}:</span>
          <span className="text-crust-dark font-bold">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── table sort header ─────────────────────── */

function SortIcon({ field, sortField, sortDir }: { field: string; sortField: string; sortDir: 'asc' | 'desc' }) {
  if (sortField !== field) return <Minus className="w-3 h-3 text-warm-brown/40" />;
  return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-ghee-gold" /> : <ArrowDown className="w-3 h-3 text-ghee-gold" />;
}

/* ─────────────────────── main dashboard ─────────────────────── */

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState('الشهر');
  const [sortField, setSortField] = useState<'qty' | 'revenue'>('revenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const toggleSort = useCallback((field: 'qty' | 'revenue') => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('desc');
      return field;
    });
  }, []);

  const sortedItems = useMemo(() => {
    const sorted = [...topItems].sort((a, b) => {
      const diff = a[sortField] - b[sortField];
      return sortDir === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [sortField, sortDir]);

  // Filtered data based on selected range
  const filteredSales = useMemo(() => getFilteredSales(activeRange), [activeRange]);
  const filteredAdCorrelation = useMemo(() => getFilteredAdCorrelation(activeRange), [activeRange]);
  const filteredKPIs = useMemo(() => getFilteredKPIs(activeRange), [activeRange]);
  const filteredSparkline = useMemo(() => getSparklineForRange(activeRange), [activeRange]);
  const chartSubtitle = useMemo(() => getChartSubtitle(activeRange), [activeRange]);

  return (
    <div dir="rtl" className="min-h-[100dvh] bg-dough-cream">
      <AdminSidebar />

      {/* Main content offset by sidebar */}
      <div className="mr-[280px] min-h-[100dvh] flex flex-col">
        <TopBar activeRange={activeRange} onRangeChange={setActiveRange} />

        {/* ─── KPI Cards Row ─── */}
        <section className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            label="إجمالي المبيعات"
            value={filteredKPIs.totalSales}
            suffix=" ر.س"
            change={12.5}
            icon={TrendingUp}
            accent="#D4A844"
            sparkline={filteredSparkline.map((v) => v * 1000)}
            index={0}
          />
          <KPICard
            label="عدد الطلبات"
            value={filteredKPIs.totalOrders}
            change={8.3}
            icon={ShoppingCart}
            accent="#6B7F59"
            index={1}
          />
          <KPICard
            label="متوسط قيمة الطلب"
            value={filteredKPIs.avgOrder}
            suffix=" ر.س"
            change={3.2}
            icon={ClipboardList}
            accent="#D4652A"
            index={2}
            decimals={2}
          />
          <KPICard
            label="تكلفة الإعلانات"
            value={filteredKPIs.adSpend}
            suffix=" ر.س"
            change={-5.1}
            icon={Megaphone}
            accent="#5B8FA8"
            index={3}
          />
        </section>

        {/* ─── Revenue Analytics + Sales Breakdown ─── */}
        <section className="px-6 pb-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Revenue Trend Chart */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="xl:col-span-3 bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-cairo font-bold text-lg text-crust-dark">تحليل المبيعات</h3>
                  <p className="text-warm-brown text-xs font-tajawal mt-0.5">{chartSubtitle}</p>
                </div>
                <button className="p-2 rounded-lg text-warm-brown hover:text-ghee-gold hover:bg-ghee-gold/10 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={filteredSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A844" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A844" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,94,60,0.1)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#8C5E3C' }}
                    axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#8C5E3C' }}
                    axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="المبيعات (ر.س)"
                    stroke="#D4A844"
                    strokeWidth={2}
                    fill="url(#salesGrad)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sales Breakdown */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="xl:col-span-2 bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
            >
              <h3 className="font-cairo font-bold text-lg text-crust-dark mb-4">توزيع المبيعات</h3>

              {/* Order Type Pie */}
              <div className="mb-6">
                <p className="text-warm-brown text-xs font-tajawal font-semibold mb-2">حسب نوع الطلب</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={orderTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {orderTypeData.map((entry, i) => (
                        <Cell key={`ot-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(212,168,68,0.3)',
                        fontFamily: 'Tajawal',
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="left"
                      layout="vertical"
                      wrapperStyle={{ fontSize: 12, fontFamily: 'Tajawal', right: 0 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Type Pie */}
              <div>
                <p className="text-warm-brown text-xs font-tajawal font-semibold mb-2">حسب طريقة الدفع</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={paymentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                      animationBegin={300}
                    >
                      {paymentTypeData.map((entry, i) => (
                        <Cell key={`pt-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(212,168,68,0.3)',
                        fontFamily: 'Tajawal',
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="left"
                      layout="vertical"
                      wrapperStyle={{ fontSize: 12, fontFamily: 'Tajawal', right: 0 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Advertising vs Sales Correlation ─── */}
        <section className="px-6 pb-6">
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-surface-cream rounded-xl p-6 shadow-glass"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-cairo font-bold text-lg text-crust-dark">تأثير الإعلانات على المبيعات</h3>
                <p className="text-warm-brown text-xs font-tajawal mt-1">
                  يُظهر هذا الرسم العلاقة بين الإنفاق الإعلاني ونسبة المبيعات عبر الزمن
                </p>
              </div>
              <button className="p-2 rounded-lg text-warm-brown hover:text-ghee-gold hover:bg-ghee-gold/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={filteredAdCorrelation} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,94,60,0.1)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fontFamily: 'Inter', fill: '#8C5E3C' }}
                  axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10, fontFamily: 'Inter', fill: '#8C5E3C' }}
                  axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="left"
                  tick={{ fontSize: 10, fontFamily: 'Inter', fill: '#8C5E3C' }}
                  axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                  tickFormatter={(v: number) => `${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontFamily: 'Tajawal', fontSize: 12 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="adSpend"
                  name="الإنفاق الإعلاني"
                  fill="#D4652A"
                  fillOpacity={0.5}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sales"
                  name="المبيعات"
                  stroke="#D4A844"
                  strokeWidth={2.5}
                  dot={false}
                  animationDuration={1200}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="messages"
                  name="المحادثات"
                  stroke="#6B7F59"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#6B7F59' }}
                  strokeDasharray="5 5"
                  animationDuration={1400}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-sage-green/10 border border-sage-green/20 rounded-xl p-4">
                <p className="text-sage-green font-cairo font-bold text-base">أعلى عائد إعلاني: 5.2×</p>
                <p className="text-crust-dark/70 text-xs font-tajawal mt-1">كل 1 ر.س إعلانات = 5.2 ر.س مبيعات</p>
              </div>
              <div className="bg-ghee-gold/10 border border-ghee-gold/20 rounded-xl p-4">
                <p className="text-ghee-gold font-cairo font-bold text-base">أفضل يوم: الأربعاء</p>
                <p className="text-crust-dark/70 text-xs font-tajawal mt-1">الإعلانات الأربعاء تحقق أعلى مبيعات</p>
              </div>
              <div className="bg-chart-blue/10 border border-chart-blue/20 rounded-xl p-4">
                <p className="text-chart-blue font-cairo font-bold text-base">تكلفة المحادثة: 2.4 ر.س</p>
                <p className="text-crust-dark/70 text-xs font-tajawal mt-1">متوسط تكلفة بدء محادثة</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Top Items Table ─── */}
        <section className="px-6 pb-6">
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cairo font-bold text-lg text-crust-dark">الأصناف الأكثر مبيعاً</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ghee-gold/30 text-warm-brown hover:text-ghee-gold hover:border-ghee-gold transition-colors text-sm font-tajawal">
                <Download className="w-4 h-4" />
                تصدير
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-crust-dark text-dough-cream">
                    <th className="px-4 py-3 text-right text-sm font-tajawal font-semibold rounded-tr-xl">الصنف</th>
                    <th className="px-4 py-3 text-right text-sm font-tajawal font-semibold">الفئة</th>
                    <th
                      className="px-4 py-3 text-right text-sm font-tajawal font-semibold cursor-pointer hover:text-ghee-gold transition-colors"
                      onClick={() => toggleSort('qty')}
                    >
                      <span className="inline-flex items-center gap-1">
                        الكمية المباعة
                        <SortIcon field="qty" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-tajawal font-semibold cursor-pointer hover:text-ghee-gold transition-colors"
                      onClick={() => toggleSort('revenue')}
                    >
                      <span className="inline-flex items-center gap-1">
                        الإيرادات (ر.س)
                        <SortIcon field="revenue" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-tajawal font-semibold rounded-tl-xl">الاتجاه</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, i) => (
                    <tr
                      key={item.name}
                      className={cn(
                        'border-b border-warm-brown/10 hover:bg-ghee-gold/5 transition-colors',
                        i % 2 === 0 ? 'bg-dough-cream/50' : 'bg-white'
                      )}
                    >
                      <td className="px-4 py-3 text-sm font-tajawal font-semibold text-crust-dark">{item.name}</td>
                      <td className="px-4 py-3 text-sm font-tajawal text-warm-brown">{item.category}</td>
                      <td className="px-4 py-3 text-sm font-inter text-crust-dark">{item.qty.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-inter font-semibold text-crust-dark">
                        {item.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {item.trend === 'up' ? (
                          <span className="inline-flex items-center gap-1 text-sage-green">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-bold">صاعد</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-error-red">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-bold">هابط</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* ─── Predictive Forecasting ─── */}
        <section className="px-6 pb-6">
          <motion.div
            custom={8}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-crust-dark rounded-xl p-6 shadow-glass"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-cairo font-bold text-section-title text-dough-cream">التنبؤ بالمبيعات</h3>
                  <span className="px-3 py-1 bg-ghee-gold/20 text-ghee-gold text-xs font-bold rounded-full">
                    مدعوم بالتحليل التنبؤي
                  </span>
                </div>
                <p className="text-ghee-gold/80 text-sm font-tajawal">
                  تحليل الذكاء الاصطناعي للأنماط والتوقعات المستقبلية
                </p>
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="bg-white/5 border border-ghee-gold/15 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A844" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A844" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6B7F59" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6B7F59" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,94,60,0.15)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#FDF6EC', opacity: 0.6 }}
                    axisLine={{ stroke: 'rgba(212,168,68,0.2)' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#FDF6EC', opacity: 0.6 }}
                    axisLine={{ stroke: 'rgba(212,168,68,0.2)' }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(43,33,24,0.95)',
                      border: '1px solid rgba(212,168,68,0.3)',
                      borderRadius: 12,
                      fontFamily: 'Tajawal',
                      color: '#FDF6EC',
                    }}
                    itemStyle={{ color: '#FDF6EC' }}
                  />
                  <Legend
                    wrapperStyle={{ fontFamily: 'Tajawal', fontSize: 12, color: '#FDF6EC' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="historical"
                    name="المبيعات الفعلية"
                    stroke="#D4A844"
                    strokeWidth={2}
                    fill="url(#histGrad)"
                    connectNulls={false}
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    name="التوقع"
                    stroke="#6B7F59"
                    strokeWidth={2.5}
                    strokeDasharray="8 4"
                    fill="url(#forecastGrad)"
                    connectNulls={false}
                    animationDuration={1500}
                  />
                  {/* Lower confidence */}
                  <Area
                    type="monotone"
                    dataKey="lower"
                    name="الحد الأدنى"
                    stroke="none"
                    fill="#6B7F59"
                    fillOpacity={0.08}
                    connectNulls={false}
                  />
                  {/* Upper confidence line (for fill stacking we use upper data directly) */}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Predictions Cards + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Predictions */}
              <div className="bg-white/5 border border-ghee-gold/15 rounded-xl p-5">
                <h4 className="font-cairo font-bold text-base text-dough-cream mb-4">التوقعات الرئيسية</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-crust-dark border border-ghee-gold/20 rounded-lg p-3">
                    <p className="text-dough-cream/50 text-xs font-tajawal mb-1">المتوقع الشهري</p>
                    <p className="text-ghee-gold font-inter font-bold text-xl">1,250 طلب</p>
                  </div>
                  <div className="bg-crust-dark border border-ghee-gold/20 rounded-lg p-3">
                    <p className="text-dough-cream/50 text-xs font-tajawal mb-1">أفضل يوم</p>
                    <p className="text-ghee-gold font-inter font-bold text-xl">الخميس</p>
                  </div>
                  <div className="bg-crust-dark border border-ghee-gold/20 rounded-lg p-3">
                    <p className="text-dough-cream/50 text-xs font-tajawal mb-1">أفضل ساعة</p>
                    <p className="text-ghee-gold font-inter font-bold text-xl">8-10 مساءً</p>
                  </div>
                  <div className="bg-crust-dark border border-ghee-gold/20 rounded-lg p-3">
                    <p className="text-dough-cream/50 text-xs font-tajawal mb-1">نمو متوقع</p>
                    <p className="text-sage-green font-inter font-bold text-xl">+15%</p>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-gradient-to-br from-ghee-gold/20 to-ember-orange/10 border border-ghee-gold/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-ghee-gold" />
                  <h4 className="font-cairo font-bold text-base text-dough-cream">توصيات ذكية</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm font-tajawal text-dough-cream/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-ghee-gold mt-2 shrink-0" />
                    زيادة الإعلانات يوم الأربعاء 25% — توقع ارتفاع مبيعات 18%
                  </li>
                  <li className="flex items-start gap-2 text-sm font-tajawal text-dough-cream/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-ghee-gold mt-2 shrink-0" />
                    ترقية كريب الدجاج رانش في المنيو — الطلب عليه في ارتفاع
                  </li>
                  <li className="flex items-start gap-2 text-sm font-tajawal text-dough-cream/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-ghee-gold mt-2 shrink-0" />
                    تفعيل عرض "فطيرتين بسعر واحد" أيام الأحد-الثلاثاء (أقل أيام المبيعات)
                  </li>
                  <li className="flex items-start gap-2 text-sm font-tajawal text-dough-cream/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-ghee-gold mt-2 shrink-0" />
                    زيادة الإعلانات يومي الأحد-الاثنين — أقل أيام المبيعات وفرصة للنمو
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Customer Channel + Payment ─── */}
        <section className="px-6 pb-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Channel Analysis */}
            <motion.div
              custom={9}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
            >
              <h3 className="font-cairo font-bold text-lg text-crust-dark mb-4">تحليل العملاء</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(140,94,60,0.1)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#8C5E3C' }}
                    axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 12, fontFamily: 'Tajawal', fill: '#2B2118' }}
                    axisLine={{ stroke: 'rgba(140,94,60,0.15)' }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, '']}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(212,168,68,0.3)',
                      fontFamily: 'Tajawal',
                    }}
                  />
                  <Bar dataKey="value" name="النسبة" radius={[0, 8, 8, 0]} barSize={28}>
                    {channelData.map((entry, i) => (
                      <Cell key={`ch-${i}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="bg-ghee-gold/10 border border-ghee-gold/20 rounded-lg p-3">
                  <p className="text-crust-dark text-sm font-tajawal font-semibold">الزبائن المباشرون يمثلون 45% من المبيعات</p>
                  <p className="text-warm-brown text-xs font-tajawal mt-1">تقليل عمولة التطبيقات يزيد الربحية بنسبة 20%</p>
                </div>
                <div className="bg-sage-green/10 border border-sage-green/20 rounded-lg p-3">
                  <p className="text-crust-dark text-sm font-tajawal font-semibold">فرصة: زيادة المبيعات المباشرة</p>
                  <p className="text-warm-brown text-xs font-tajawal mt-1">استهداف العملاء على السوشيال ميديا لتوجيههم للطلب المباشر</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              custom={10}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
            >
              <h3 className="font-cairo font-bold text-lg text-crust-dark mb-4">طرق الدفع</h3>
              <div className="space-y-5">
                {[
                  { name: 'شبكة (مدى/فيزا)', value: 55, color: '#D4A844' },
                  { name: 'نقدي', value: 35, color: '#6B7F59' },
                  { name: 'آجل', value: 10, color: '#D4652A' },
                ].map((method) => (
                  <div key={method.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-tajawal text-crust-dark font-semibold">{method.name}</span>
                      <span className="text-sm font-inter font-bold" style={{ color: method.color }}>
                        {method.value}%
                      </span>
                    </div>
                    <div className="h-3 bg-surface-cream rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${method.value}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: method.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-warm-brown/10">
                <p className="text-warm-brown text-sm font-tajawal mb-2">تحليل سريع</p>
                <p className="text-crust-dark text-sm font-tajawal leading-relaxed">
                  55% من الدفعات عبر الشبكة يعني تدفق نقدي منظم وأسهل للتتبع. نسبة 35% نقدي تستدعي 
                  تركيزاً على إدارة الصندوق وتوثيق الإيصالات. يُنصح بتشجيع الدفع الإلكتروني لتقليل الأخطاء.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Seasonality Heatmap ─── */}
        <section className="px-6 pb-8">
          <motion.div
            custom={11}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white/72 backdrop-blur-[20px] border border-ghee-gold/25 rounded-xl p-6 shadow-glass"
          >
            <h3 className="font-cairo font-bold text-lg text-crust-dark mb-2">الأنماط الموسمية</h3>
            <p className="text-warm-brown text-sm font-tajawal mb-6">
              شدة اللون تعكس حجم المبيعات — الأحمر الغامق = أعلى مبيعات
            </p>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hour headers */}
                <div className="grid grid-cols-[80px_repeat(12,1fr)] gap-1 mb-1">
                  <div />
                  {hourLabels.map((h) => (
                    <div key={h} className="text-center text-xs font-inter text-warm-brown/70 py-1">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {seasonalityData.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-[80px_repeat(12,1fr)] gap-1 mb-1">
                    <div className="flex items-center justify-end pr-2 text-xs font-tajawal font-semibold text-crust-dark">
                      {dayLabels[ri]}
                    </div>
                    {row.map((color, ci) => (
                      <motion.div
                        key={ci}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: ri * 0.02 + ci * 0.005, duration: 0.2 }}
                        className="aspect-square rounded-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ))}

                {/* Legend */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <span className="text-xs font-tajawal text-warm-brown">منخفض</span>
                  <div className="flex gap-0.5">
                    {['#FDF6EC', '#F5E6D0', '#E5B84B', '#D4A844', '#D4A844'].map((c, i) => (
                      <div key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c, opacity: 0.4 + i * 0.15 }} />
                    ))}
                  </div>
                  <span className="text-xs font-tajawal text-warm-brown">مرتفع</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-surface-cream rounded-lg p-4">
              <p className="text-crust-dark text-sm font-tajawal font-semibold mb-1">
                أوقات الذروة المتوقعة: الخميس-الجمعة 8-11 مساءً
              </p>
              <p className="text-warm-brown text-xs font-tajawal">
                يُلاحظ أن المبيعات تصل لذروتها في المساء وخلال نهاية الأسبوع. يُنصح بتكثيف الإعلانات 
                يومي الأحد والاثنين لتعويض الانخفاض الطبيعي في هذه الفترة.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
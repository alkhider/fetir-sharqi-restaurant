import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  Calendar,
  ChevronDown,
  X,
  Printer,
  Phone,
  MapPin,
  Check,
  Circle,
  ArrowRight,
  LayoutGrid,
  Table2,
  Filter,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { cn } from '@/lib/utils';
import { generateMockOrders } from '@/data/mockOrders';

// ─── Types ───────────────────────────────────────────────────────
type OrderStatus = 'جديد' | 'قيد التحضير' | 'جاهز' | 'تم التوصيل' | 'ملغي';
type OrderType = 'سفري' | 'محلي' | 'كيتا' | 'هنجر ستيشن';
type PaymentMethod = 'نقدي' | 'شبكة' | 'مدى' | 'فيزا';

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  type: OrderType;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  payment: PaymentMethod;
  address?: string;
  timeline: { status: OrderStatus; time: string }[];
}

// ─── Status Config ───────────────────────────────────────────────
const statusConfig: Record<OrderStatus, { color: string; bg: string; border: string; text: string }> = {
  'جديد': { color: '#F39C12', bg: 'bg-[#F39C12]/15', border: 'border-[#F39C12]', text: 'text-[#F39C12]' },
  'قيد التحضير': { color: '#D4A844', bg: 'bg-[#D4A844]/15', border: 'border-[#D4A844]', text: 'text-[#D4A844]' },
  'جاهز': { color: '#27AE60', bg: 'bg-[#27AE60]/15', border: 'border-[#27AE60]', text: 'text-[#27AE60]' },
  'تم التوصيل': { color: '#27AE60', bg: 'bg-[#27AE60]/15', border: 'border-[#27AE60]', text: 'text-[#27AE60]' },
  'ملغي': { color: '#C0392B', bg: 'bg-[#C0392B]/15', border: 'border-[#C0392B]', text: 'text-[#C0392B]' },
};

const statusFlow: OrderStatus[] = ['جديد', 'قيد التحضير', 'جاهز', 'تم التوصيل'];

// ─── Mock Data ───────────────────────────────────────────────────
// Real customer names from Google Maps reviews + real menu items
const mockOrders: Order[] = (() => {
  const generated = generateMockOrders();
  const statusMap: Record<string, OrderStatus> = {
    pending: 'جديد',
    preparing: 'قيد التحضير',
    ready: 'جاهز',
    completed: 'تم التوصيل',
    cancelled: 'ملغي',
  };
  const typeMap: Record<string, OrderType> = {
    'سفري': 'سفري',
    'محلي': 'محلي',
    'كيتا': 'كيتا',
    'هنجر ستيشن': 'هنجر ستيشن',
  };
  const paymentMap: Record<string, PaymentMethod> = {
    'نقدي': 'نقدي',
    'شبكة': 'شبكة',
    'مدى': 'مدى',
    'فيزا': 'فيزا',
  };

  return generated.map((order, idx) => {
    const status = statusMap[order.status] || 'جديد';
    // Build a realistic timeline based on status
    const timeline: { status: OrderStatus; time: string }[] = [];
    const baseTime = order.time;
    if (status === 'جديد' || status === 'قيد التحضير' || status === 'جاهز' || status === 'تم التوصيل') {
      timeline.push({ status: 'جديد', time: baseTime });
    }
    if (status === 'قيد التحضير' || status === 'جاهز' || status === 'تم التوصيل') {
      timeline.push({ status: 'قيد التحضير', time: addMinutes(baseTime, 5) });
    }
    if (status === 'جاهز' || status === 'تم التوصيل') {
      timeline.push({ status: 'جاهز', time: addMinutes(baseTime, 15) });
    }
    if (status === 'تم التوصيل') {
      timeline.push({ status: 'تم التوصيل', time: addMinutes(baseTime, 30) });
    }
    if (status === 'ملغي') {
      timeline.push({ status: 'جديد', time: baseTime });
      timeline.push({ status: 'ملغي', time: addMinutes(baseTime, 5) });
    }

    return {
      id: order.id,
      date: order.date,
      time: order.time,
      customer: order.customer,
      phone: order.phone,
      type: typeMap[order.type] || 'سفري',
      items: order.items.map(item => ({
        name: item.name,
        size: item.size || undefined,
        quantity: item.qty,
        price: item.price * item.qty,
        notes: idx === 0 ? 'بدون بصل' : undefined,
      })),
      amount: order.amount,
      status,
      payment: paymentMap[order.payment] || 'نقدي',
      timeline,
    };
  });
})();

function addMinutes(timeStr: string, mins: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m + mins);
  return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// ─── Status Badge ────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
        cfg.bg,
        cfg.text
      )}
    >
      {status === 'تم التوصيل' && <Check className="w-3 h-3" />}
      {status}
    </span>
  );
}

// ─── Stats Card ──────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  onClick,
  active,
}: {
  label: string;
  value: number;
  color: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full text-right rounded-xl p-4 bg-[#FDF6EC] border transition-all shadow-glass',
        active ? 'ring-2 ring-offset-1' : 'hover:shadow-lg',
      )}
      style={{
        borderRight: `4px solid ${color}`,
        ...(active ? { ringColor: color } : {}),
      }}
    >
      <p className="font-cairo font-bold text-2xl" style={{ color }}>{value}</p>
      <p className="font-tajawal text-xs text-[#8C5E3C] mt-1">{label}</p>
    </motion.button>
  );
}

// ─── Order Detail Drawer ─────────────────────────────────────────
function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];
  const tax = +(order.amount * 0.15).toFixed(2);
  const total = +(order.amount + tax).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-start"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="relative w-full max-w-[480px] h-full bg-[#FDF6EC] overflow-y-auto shadow-2xl mr-auto"
        style={{ direction: 'rtl' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FDF6EC] border-b border-[rgba(212,168,68,0.2)] p-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-[#2B2118]">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="font-tajawal text-xs text-[#8C5E3C] mt-1">
              تم الاستلام: {order.time} — {order.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2B2118]/5 transition-colors"
          >
            <X className="w-5 h-5 text-[#2B2118]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)]">
            <h3 className="font-cairo font-bold text-base text-[#2B2118] mb-3">معلومات العميل</h3>
            <div className="space-y-2">
              <p className="font-tajawal font-semibold text-[15px] text-[#2B2118]">{order.customer}</p>
              <a href={`tel:${order.phone}`} className="flex items-center gap-2 font-mono text-sm text-[#5B8FA8]">
                <Phone className="w-4 h-4" />
                {order.phone}
              </a>
              <span className={cn(
                'inline-block px-2 py-0.5 rounded-md text-xs font-bold',
                order.type === 'سفري' && 'bg-[#D4A844]/15 text-[#D4A844]',
                order.type === 'محلي' && 'bg-[#6B7F59]/15 text-[#6B7F59]',
                order.type === 'كيتا' && 'bg-[#5B8FA8]/15 text-[#5B8FA8]',
                order.type === 'هنجر ستيشن' && 'bg-[#D4652A]/15 text-[#D4652A]',
              )}>
                {order.type}
              </span>
              {order.address && (
                <p className="flex items-center gap-2 text-sm text-[#8C5E3C]">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {order.address}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)]">
            <h3 className="font-cairo font-bold text-base text-[#2B2118] mb-3">الأصناف</h3>
            <table className="w-full">
              <thead>
                <tr className="text-xs font-bold text-[#8C5E3C] border-b border-[rgba(212,168,68,0.15)]">
                  <th className="py-2 text-right">#</th>
                  <th className="py-2 text-right">الصنف</th>
                  <th className="py-2 text-center">الكمية</th>
                  <th className="py-2 text-left">السعر</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-[rgba(212,168,68,0.08)] last:border-0">
                    <td className="py-2 font-mono text-xs text-[#8C5E3C]">{i + 1}</td>
                    <td className="py-2 font-tajawal text-sm">
                      {item.name}
                      {item.size && <span className="text-[#8C5E3C] mr-1">({item.size})</span>}
                      {item.notes && <p className="text-[11px] text-[#8C5E3C]">{item.notes}</p>}
                    </td>
                    <td className="py-2 text-center font-mono text-sm">×{item.quantity}</td>
                    <td className="py-2 text-left font-mono text-sm font-bold">{item.price} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing */}
          <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)]">
            <div className="space-y-2 font-tajawal text-sm">
              <div className="flex justify-between">
                <span className="text-[#8C5E3C]">المجموع</span>
                <span className="font-mono font-semibold">{order.amount} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C5E3C]">الضريبة (15%)</span>
                <span className="font-mono">{tax} ر.س</span>
              </div>
              <div className="border-t border-[rgba(212,168,68,0.2)] pt-2 flex justify-between font-bold text-base">
                <span>الإجمالي</span>
                <span className="font-mono text-[#D4A844]">{total} ر.س</span>
              </div>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#F5E6D0] text-xs font-bold text-[#2B2118]">
                  {order.payment}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)]">
            <h3 className="font-cairo font-bold text-base text-[#2B2118] mb-3">الجدول الزمني</h3>
            <div className="space-y-0">
              {statusFlow.map((s, i) => {
                const entry = order.timeline.find((t) => t.status === s);
                const isActive = !!entry;
                const isCurrent = order.status === s;
                return (
                  <div key={s} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {isActive ? (
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center',
                          isCurrent ? 'bg-[#D4A844] text-white' : 'bg-[#27AE60] text-white'
                        )}>
                          {isCurrent ? <Circle className="w-4 h-4 fill-current" /> : <Check className="w-4 h-4" />}
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-[#8C5E3C]/30 flex items-center justify-center">
                          <Circle className="w-3 h-3 text-[#8C5E3C]/30" />
                        </div>
                      )}
                      {i < statusFlow.length - 1 && (
                        <div className={cn(
                          'w-0.5 h-8',
                          isActive ? 'bg-[#D4A844]/40' : 'bg-[#8C5E3C]/15'
                        )} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={cn(
                        'font-tajawal text-sm font-semibold',
                        isActive ? 'text-[#2B2118]' : 'text-[#8C5E3C]/50'
                      )}>
                        {s}
                      </p>
                      {entry && (
                        <p className="font-mono text-[11px] text-[#8C5E3C]">{entry.time}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 pb-6">
            {nextStatus && (
              <button
                onClick={() => onStatusChange(order.id, nextStatus)}
                className="w-full py-3 rounded-xl bg-[#D4A844] text-[#2B2118] font-cairo font-bold hover:bg-[#E5B84B] transition-all shadow-gold hover:shadow-gold-lg flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                تحديث إلى: {nextStatus}
              </button>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl border border-[#2B2118]/15 text-[#2B2118] font-tajawal font-semibold text-sm hover:bg-[#2B2118]/5 transition-all flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                طباعة
              </button>
              {order.status !== 'ملغي' && order.status !== 'تم التوصيل' && (
                <button
                  onClick={() => onStatusChange(order.id, 'ملغي')}
                  className="flex-1 py-2.5 rounded-xl border border-[#C0392B] text-[#C0392B] font-tajawal font-semibold text-sm hover:bg-[#C0392B]/5 transition-all"
                >
                  إلغاء الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Kanban Card ─────────────────────────────────────────────────
function KanbanCard({
  order,
  onClick,
  onStatusChange,
}: {
  order: Order;
  onClick: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const cfg = statusConfig[order.status];
  const next = statusFlow[statusFlow.indexOf(order.status) + 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur rounded-lg p-3 border border-[rgba(212,168,68,0.15)] shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[11px] font-bold text-[#2B2118]">{order.id}</span>
        <span className="font-mono text-[11px] text-[#8C5E3C]">{order.time}</span>
      </div>
      <p className="font-tajawal font-semibold text-sm text-[#2B2118] mb-1 truncate">{order.customer}</p>
      <p className="font-tajawal text-[11px] text-[#8C5E3C] truncate mb-2">
        {order.items.map((i) => i.name).join(' + ')}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-cairo font-bold text-sm" style={{ color: cfg.color }}>
          {order.amount} ر.س
        </span>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-bold', cfg.bg, cfg.text)}>
          {order.type}
        </span>
      </div>
      {next && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(order.id, next);
          }}
          className="w-full mt-2 py-1 rounded-md text-[10px] font-bold bg-[#D4A844]/10 text-[#D4A844] hover:bg-[#D4A844]/20 transition-colors flex items-center justify-center gap-1"
        >
          <ArrowRight className="w-3 h-3" />
          {next}
        </button>
      )}
    </motion.div>
  );
}

// ─── Main Operations Page ────────────────────────────────────────
export default function Operations() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'الكل'>('الكل');
  const [typeFilter, setTypeFilter] = useState<OrderType | 'الكل'>('الكل');
  const [search, setSearch] = useState('');
  const [activeStat, setActiveStat] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => {
    const todayOrders = orders.length;
    const newCount = orders.filter((o) => o.status === 'جديد').length;
    const preparingCount = orders.filter((o) => o.status === 'قيد التحضير').length;
    const readyCount = orders.filter((o) => o.status === 'جاهز').length;
    const deliveredCount = orders.filter((o) => o.status === 'تم التوصيل').length;
    const cancelledCount = orders.filter((o) => o.status === 'ملغي').length;
    return { todayOrders, newCount, preparingCount, readyCount, deliveredCount, cancelledCount };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'الكل' || o.status === statusFilter;
      const matchType = typeFilter === 'الكل' || o.type === typeFilter;
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.includes(search) ||
        o.phone.includes(search);
      return matchStatus && matchType && matchSearch;
    });
  }, [orders, statusFilter, typeFilter, search]);

  // Kanban columns
  const kanbanColumns: { title: string; status: OrderStatus; color: string }[] = [
    { title: 'جديدة', status: 'جديد', color: '#F39C12' },
    { title: 'قيد التحضير', status: 'قيد التحضير', color: '#D4A844' },
    { title: 'جاهزة', status: 'جاهز', color: '#27AE60' },
    { title: 'تم التوصيل', status: 'تم التوصيل', color: '#5B8FA8' },
  ];

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              timeline: [...o.timeline, { status: newStatus, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }],
            }
          : o
      )
    );
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              timeline: [...prev.timeline, { status: newStatus, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }],
            }
          : null
      );
    }
    setShowStatusDropdown(null);
  };

  const handleStatClick = (key: string, status?: OrderStatus) => {
    setActiveStat(key);
    if (status) {
      setStatusFilter(status);
    } else {
      setStatusFilter('الكل');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDF6EC]" style={{ direction: 'rtl' }}>
      <AdminSidebar activeItem="الطلبات" />

      {/* Main Content */}
      <div className="mr-[280px] min-h-[100dvh] flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FDF6EC]/92 backdrop-blur border-b border-[rgba(212,168,68,0.15)] px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="font-cairo font-bold text-xl text-[#2B2118]">إدارة الطلبات</h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#27AE60]/10 text-[#27AE60] text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27AE60] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27AE60]" />
                </span>
                مباشر
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-white/70 rounded-lg border border-[rgba(212,168,68,0.2)] overflow-hidden">
                <button
                  onClick={() => setView('kanban')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all',
                    view === 'kanban' ? 'bg-[#D4A844] text-[#2B2118]' : 'text-[#8C5E3C] hover:bg-[#D4A844]/10'
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kanban
                </button>
                <button
                  onClick={() => setView('table')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all',
                    view === 'table' ? 'bg-[#D4A844] text-[#2B2118]' : 'text-[#8C5E3C] hover:bg-[#D4A844]/10'
                  )}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  جدول
                </button>
              </div>
              <button className="p-2 rounded-lg border border-[rgba(212,168,68,0.2)] text-[#8C5E3C] hover:bg-[#D4A844]/10 transition-all">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5E3C]" />
              <input
                type="text"
                placeholder="بحث برقم الطلب أو العميل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pr-9 pl-3 rounded-lg bg-white/70 border border-[rgba(212,168,68,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'الكل')}
                className="appearance-none h-9 pl-8 pr-3 rounded-lg bg-white/70 border border-[rgba(212,168,68,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] cursor-pointer"
              >
                <option value="الكل">كل الحالات</option>
                <option value="جديد">جديد</option>
                <option value="قيد التحضير">قيد التحضير</option>
                <option value="جاهز">جاهز</option>
                <option value="تم التوصيل">تم التوصيل</option>
                <option value="ملغي">ملغي</option>
              </select>
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5E3C] pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as OrderType | 'الكل')}
                className="appearance-none h-9 pl-8 pr-3 rounded-lg bg-white/70 border border-[rgba(212,168,68,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] cursor-pointer"
              >
                <option value="الكل">كل الأنواع</option>
                <option value="سفري">سفري</option>
                <option value="محلي">محلي</option>
                <option value="كيتا">كيتا</option>
                <option value="هنجر ستيشن">هنجر ستيشن</option>
              </select>
              <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5E3C] pointer-events-none" />
            </div>
            <button className="h-9 px-3 rounded-lg bg-white/70 border border-[rgba(212,168,68,0.2)] text-[#8C5E3C] hover:bg-[#D4A844]/10 transition-all flex items-center gap-1.5 font-tajawal text-sm">
              <Calendar className="w-4 h-4" />
              اليوم
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-5 gap-4">
            <StatCard label="طلبات اليوم" value={stats.todayOrders} color="#D4A844" onClick={() => handleStatClick('all')} active={activeStat === 'all'} />
            <StatCard label="جديدة" value={stats.newCount} color="#F39C12" onClick={() => handleStatClick('new', 'جديد')} active={activeStat === 'new'} />
            <StatCard label="قيد التحضير" value={stats.preparingCount} color="#D4A844" onClick={() => handleStatClick('prep', 'قيد التحضير')} active={activeStat === 'prep'} />
            <StatCard label="جاهزة" value={stats.readyCount} color="#27AE60" onClick={() => handleStatClick('ready', 'جاهز')} active={activeStat === 'ready'} />
            <StatCard label="متوسط وقت التحضير" value={18} color="#5B8FA8" onClick={() => handleStatClick('avg')} active={activeStat === 'avg'} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            {view === 'kanban' ? (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-4 gap-4 h-full"
              >
                {kanbanColumns.map((col) => {
                  const colOrders = filteredOrders.filter((o) => o.status === col.status);
                  return (
                    <div
                      key={col.status}
                      className="bg-[#F5E6D0]/50 rounded-xl border-t-[3px] flex flex-col"
                      style={{ borderColor: col.color }}
                    >
                      {/* Column Header */}
                      <div className="p-3 flex items-center justify-between">
                        <h3 className="font-cairo font-bold text-sm text-[#2B2118]">
                          {col.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: col.color }}
                        >
                          {colOrders.length}
                        </span>
                      </div>
                      {/* Column Cards */}
                      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                        <AnimatePresence>
                          {colOrders.map((order) => (
                            <KanbanCard
                              key={order.id}
                              order={order}
                              onClick={() => setSelectedOrder(order)}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </AnimatePresence>
                        {colOrders.length === 0 && (
                          <div className="text-center py-8 text-[#8C5E3C]/50 font-tajawal text-sm border-2 border-dashed border-[#8C5E3C]/20 rounded-lg">
                            لا توجد طلبات
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/70 backdrop-blur rounded-xl border border-[rgba(212,168,68,0.2)] overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#2B2118] text-[#FDF6EC]">
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">رقم الطلب</th>
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">التاريخ</th>
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">العميل</th>
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">النوع</th>
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">المبلغ</th>
                        <th className="px-4 py-3 text-right font-cairo text-sm font-bold">الحالة</th>
                        <th className="px-4 py-3 text-center font-cairo text-sm font-bold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className={cn(
                            'border-b border-[rgba(212,168,68,0.08)] hover:bg-[#D4A844]/5 transition-colors',
                            i % 2 === 0 ? 'bg-[#FDF6EC]/50' : 'bg-white/50'
                          )}
                        >
                          <td className="px-4 py-3 font-mono text-sm text-[#2B2118] font-semibold">{order.id}</td>
                          <td className="px-4 py-3 font-tajawal text-sm text-[#8C5E3C]">
                            {order.date}
                            <span className="block font-mono text-[11px]">{order.time}</span>
                          </td>
                          <td className="px-4 py-3 font-tajawal text-sm text-[#2B2118] font-semibold">{order.customer}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'px-2 py-0.5 rounded-md text-[11px] font-bold',
                              order.type === 'سفري' && 'bg-[#D4A844]/15 text-[#D4A844]',
                              order.type === 'محلي' && 'bg-[#6B7F59]/15 text-[#6B7F59]',
                              order.type === 'كيتا' && 'bg-[#5B8FA8]/15 text-[#5B8FA8]',
                              order.type === 'هنجر ستيشن' && 'bg-[#D4652A]/15 text-[#D4652A]',
                            )}>
                              {order.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm font-bold text-[#D4A844]">{order.amount} ر.س</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-[#D4A844]/10 text-[#D4A844] text-xs font-bold hover:bg-[#D4A844]/20 transition-all"
                              >
                                تفاصيل
                              </button>
                              {/* Status Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id)
                                  }
                                  className="px-2 py-1.5 rounded-lg border border-[#8C5E3C]/20 text-[#8C5E3C] text-xs font-bold hover:bg-[#8C5E3C]/5 transition-all"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                                <AnimatePresence>
                                  {showStatusDropdown === order.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute left-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-[rgba(212,168,68,0.2)] z-20 overflow-hidden"
                                    >
                                      {(['جديد', 'قيد التحضير', 'جاهز', 'تم التوصيل', 'ملغي'] as OrderStatus[]).map((s) => (
                                        <button
                                          key={s}
                                          onClick={() => handleStatusChange(order.id, s)}
                                          className="w-full px-3 py-2 text-right font-tajawal text-xs font-semibold hover:bg-[#F5E6D0] transition-colors text-[#2B2118]"
                                        >
                                          {s}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-[#8C5E3C]/50 font-tajawal">
                    لا توجد طلبات مطابقة للفلاتر
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

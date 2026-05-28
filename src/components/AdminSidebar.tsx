import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  LineChart,
  ClipboardList,
  Users,
  FileUp,
  Image,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    items: [
      { label: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'التحليلات',
    items: [
      { label: 'المبيعات', href: '/dashboard', icon: TrendingUp },
      { label: 'الإعلانات', href: '/dashboard', icon: Megaphone },
      { label: 'التنبؤات', href: '/dashboard', icon: LineChart },
    ],
  },
  {
    label: 'العمليات',
    items: [
      { label: 'الطلبات', href: '/operations', icon: ClipboardList },
      { label: 'إدارة العملاء', href: '/dashboard', icon: Users },
      { label: 'رفع الفواتير', href: '/data-processor', icon: FileUp },
      { label: 'إدارة الصور', href: '/image-manager', icon: Image },
    ],
  },
];

interface AdminSidebarProps {
  activeItem?: string;
}

export default function AdminSidebar({ activeItem }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className="fixed top-0 right-0 h-full w-[280px] bg-[#2B2118] flex flex-col z-40 overflow-y-auto"
      style={{ direction: 'rtl' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-6 px-4 border-b border-[rgba(212,168,68,0.15)]">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="/logo-white.png"
            alt="فطير شرقي"
            className="w-12 h-12 rounded-full border-2 border-[#D4A844] object-cover"
          />
          <div>
            <h1 className="font-cairo font-bold text-lg text-[#D4A844]">فطير شرقي</h1>
            <p className="font-tajawal text-[11px] text-[#FDF6EC]/50">نظام الإدارة</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-[#FDF6EC]/30 uppercase">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  activeItem === item.label ||
                  location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg font-tajawal text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-[#D4A844]/15 text-[#D4A844] border-r-2 border-[#D4A844]'
                        : 'text-[#FDF6EC]/70 hover:bg-[#FDF6EC]/5 hover:text-[#FDF6EC]'
                    )}
                  >
                    <Icon className="w-[22px] h-[22px] shrink-0" />
                    <span>{item.label}</span>
                    {item.label === 'الطلبات' && (
                      <span className="mr-auto w-5 h-5 rounded-full bg-[#C0392B] text-white text-[10px] font-bold flex items-center justify-center">
                        3
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[rgba(212,168,68,0.15)]">
        <div className="space-y-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-tajawal text-sm font-semibold text-[#FDF6EC]/70 hover:bg-[#FDF6EC]/5 hover:text-[#FDF6EC] transition-all w-full text-right">
            <Settings className="w-[22px] h-[22px] shrink-0" />
            <span>الإعدادات</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-tajawal text-sm font-semibold text-[#FDF6EC]/70 hover:bg-[#C0392B]/15 hover:text-[#C0392B] transition-all w-full text-right">
            <LogOut className="w-[22px] h-[22px] shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-[#D4A844]/20 border border-[#D4A844]/40 flex items-center justify-center">
            <span className="font-cairo font-bold text-sm text-[#D4A844]">م</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-tajawal font-semibold text-sm text-[#FDF6EC] truncate">
              محمد الإداري
            </p>
            <p className="font-tajawal text-[11px] text-[#FDF6EC]/50">
              مدير المطعم
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

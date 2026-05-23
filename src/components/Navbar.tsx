import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'الرئيسية', href: '/', labelEn: 'Home' },
  { label: 'المنيو', href: '/menu', labelEn: 'Menu' },
  { label: 'العروض', href: '/offers', labelEn: 'Offers' },
  { label: 'آراء العملاء', href: '/reviews', labelEn: 'Reviews' },
  { label: 'تسجيل الدخول', href: '/login', labelEn: 'Login' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useBasket();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300',
          scrolled
            ? 'bg-[rgba(253,246,236,0.92)] backdrop-blur-[16px] border-b border-[rgba(212,168,68,0.15)] shadow-[0_2px_20px_rgba(43,33,24,0.06)]'
            : 'bg-transparent'
        )}
      >
        <div className="container-custom w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="Fetir Sharqi"
              className={cn(
                'w-10 h-10 rounded-full border-2 border-ghee-gold object-cover transition-transform',
                scrolled ? 'scale-90' : 'scale-100'
              )}
            />
            <span
              className={cn(
                'font-cairo font-bold text-lg transition-colors',
                scrolled ? 'text-crust-dark' : 'text-dough-cream'
              )}
            >
              {t('فطير شرقي', 'Fetir Sharqi')}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-inter font-semibold text-sm transition-colors duration-200 relative pb-1',
                    isActive
                      ? 'text-ghee-gold border-b-2 border-ghee-gold'
                      : scrolled
                        ? 'text-crust-dark hover:text-ghee-gold'
                        : 'text-dough-cream hover:text-ghee-gold'
                  )}
                >
                  {t(link.label, link.labelEn)}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={cn(
                'hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all border',
                scrolled
                  ? 'border-ghee-gold text-crust-dark hover:bg-ghee-gold/10'
                  : 'border-ghee-gold/50 text-dough-cream hover:border-ghee-gold'
              )}
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Basket */}
            <Link
              to="/menu"
              className={cn(
                'relative p-2 rounded-full transition-colors',
                scrolled
                  ? 'text-crust-dark hover:text-ghee-gold'
                  : 'text-dough-cream hover:text-ghee-gold'
              )}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ember-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                scrolled
                  ? 'text-crust-dark'
                  : 'text-dough-cream'
              )}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              'absolute top-0 right-0 h-full w-[320px] max-w-[85vw] bg-dough-cream shadow-2xl p-6 flex flex-col gap-6',
              'transform transition-transform duration-300 ease-out'
            )}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Fetir Sharqi"
                  className="w-10 h-10 rounded-full border-2 border-ghee-gold object-cover"
                />
                <span className="font-cairo font-bold text-crust-dark">
                  {t('فطير شرقي', 'Fetir Sharqi')}
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-crust-dark hover:text-ember-orange"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'px-4 py-3 rounded-xl font-cairo font-semibold text-base transition-colors',
                      isActive
                        ? 'bg-ghee-gold text-crust-dark'
                        : 'text-crust-dark hover:bg-surface-cream'
                    )}
                  >
                    {t(link.label, link.labelEn)}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileOpen(false);
                }}
                className="w-full py-3 rounded-xl border-2 border-ghee-gold text-crust-dark font-semibold hover:bg-ghee-gold/10 transition-colors"
              >
                {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

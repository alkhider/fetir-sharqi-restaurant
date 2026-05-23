import { Link } from 'react-router';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-crust-dark text-dough-cream relative overflow-hidden">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-white.png"
                alt="Fetir Sharqi"
                className="w-12 h-12 rounded-full border-2 border-ghee-gold object-cover"
              />
              <div>
                <h3 className="font-cairo font-bold text-xl text-ghee-gold">
                  {t('فطير شرقي', 'Fetir Sharqi')}
                </h3>
                <p className="text-caption text-dough-cream/60 mt-0.5">
                  {t('فطير يهتم بصحتك', 'Pie that cares for your health')}
                </p>
              </div>
            </Link>
            <p className="text-body text-dough-cream/70 leading-relaxed mt-2">
              {t(
                'مطعم فطائر شرقية أصيلة في المدينة المنورة. نستخدم سمن بقري 100% ولحوم طازجة لنقدم لك ألذ الفطاير.',
                'Authentic Eastern pies restaurant in Madinah. We use 100% real ghee and fresh meat to serve you the tastiest pies.'
              )}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2">
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cairo font-bold text-lg text-ghee-gold mb-5">
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'الرئيسية', labelEn: 'Home', href: '/' },
                { label: 'المنيو', labelEn: 'Menu', href: '/menu' },
                { label: 'العروض', labelEn: 'Offers', href: '/offers' },
                { label: 'آراء العملاء', labelEn: 'Reviews', href: '/reviews' },
                { label: 'تسجيل الدخول', labelEn: 'Login', href: '/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-dough-cream/70 hover:text-ghee-gold transition-colors text-body font-tajawal"
                  >
                    {t(link.label, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-cairo font-bold text-lg text-ghee-gold mb-5">
              {t('تواصل معنا', 'Contact Us')}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ghee-gold shrink-0 mt-0.5" />
                <span className="text-dough-cream/70 text-body">
                  {t(
                    'شارع الأمير محمد بن عبدالعزيز، حي الإسكان، المدينة المنورة',
                    'Prince Mohammed Bin Abdulaziz St, Al Iskan, Madinah'
                  )}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ghee-gold shrink-0" />
                <a
                  href="tel:+966557478343"
                  className="text-ghee-gold font-semibold text-body hover:underline"
                >
                  +966 55 747 8343
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-ghee-gold shrink-0 mt-0.5" />
                <div className="text-dough-cream/70 text-body">
                  <p>
                    {t('السبت – الخميس:', 'Sat – Thu:')} 4:00 PM – 1:00 AM
                  </p>
                  <p>
                    {t('الجمعة:', 'Fri:')} 2:00 PM – 1:00 AM
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-cairo font-bold text-lg text-ghee-gold mb-5">
              {t('ساعات العمل', 'Opening Hours')}
            </h4>
            <div className="glass-card-dark p-5 rounded-xl">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-dough-cream/80 text-sm font-tajawal">
                    {t('السبت – الخميس', 'Saturday – Thursday')}
                  </span>
                  <span className="text-ghee-gold font-semibold text-sm font-mono">
                    4:00 PM – 1:00 AM
                  </span>
                </div>
                <div className="border-t border-ghee-gold/10 pt-3 flex justify-between items-center">
                  <span className="text-dough-cream/80 text-sm font-tajawal">
                    {t('الجمعة', 'Friday')}
                  </span>
                  <span className="text-ghee-gold font-semibold text-sm font-mono">
                    2:00 PM – 1:00 AM
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 p-4 rounded-xl border border-ghee-gold/20 bg-ghee-gold/5">
              <p className="text-dough-cream/80 text-sm font-tajawal text-center">
                {t('التوصيل متاح خلال ساعات العمل', 'Delivery available during hours')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-ghee-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dough-cream/50 text-caption text-center sm:text-start">
            &copy; {new Date().getFullYear()}{' '}
            {t('فطير شرقي. جميع الحقوق محفوظة.', 'Fetir Sharqi. All rights reserved.')}
          </p>
          <p className="text-dough-cream/40 text-caption">
            {t('صنع ب', 'Made with')}{' '}
            <span className="text-ghee-gold">♥</span>{' '}
            {t('في المدينة المنورة', 'in Madinah')}
          </p>
        </div>
      </div>
    </footer>
  );
}

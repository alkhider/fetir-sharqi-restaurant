import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASSWORD = 'Fetir2021!';
const AUTH_KEY = 'fetir-admin-auth';

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1';
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
}

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, '1');
      setAuthenticated(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] bg-crust-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="فطير شرقي"
            className="w-24 h-24 mx-auto mb-4 rounded-full border-3 border-ghee-gold"
          />
          <h1 className="font-cairo font-bold text-2xl text-dough-cream">
            فطير شرقي
          </h1>
          <p className="text-ghee-gold/70 font-tajawal text-sm mt-1">
            صفحة الإدارة محمية بكلمة مرور
          </p>
        </div>

        {/* Lock Card */}
        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-dough-cream rounded-2xl p-6 shadow-xl border border-ghee-gold/20"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-crust-dark flex items-center justify-center">
              <Lock className="w-8 h-8 text-ghee-gold" />
            </div>
          </div>

          <h2 className="font-cairo font-bold text-xl text-crust-dark text-center mb-1">
            تسجيل الدخول
          </h2>
          <p className="text-warm-brown text-sm text-center mb-6 font-tajawal">
            أدخل كلمة المرور للوصول إلى لوحة الإدارة
          </p>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="كلمة المرور"
                className="w-full h-12 pr-12 pl-12 rounded-xl bg-surface-cream text-crust-dark font-tajawal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-ghee-gold/50 transition-shadow border border-ghee-gold/20"
                autoFocus
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-brown/40" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-brown/40 hover:text-warm-brown transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-error-red text-sm font-tajawal text-center mb-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full h-12 bg-ghee-gold hover:bg-[#E5B84B] text-crust-dark font-cairo font-bold rounded-xl transition-colors"
            >
              دخول
            </button>
          </form>
        </motion.div>

        <p className="text-center text-dough-cream/40 text-xs font-tajawal mt-6">
          فطير شرقي © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </p>
      </motion.div>
    </div>
  );
}

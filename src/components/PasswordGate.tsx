import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const ADMIN_PASSWORD = 'Fetir2021!';
const STORAGE_KEY = 'fetir-admin-auth';

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  } catch { /* ignore */ }
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
    const check = () => setAuthenticated(isAdminAuthenticated());
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
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
    <div className="min-h-[100dvh] bg-[#F5EFE6] flex items-center justify-center" style={{ direction: 'rtl' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D4A844]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#D4A844]" />
          </div>
          <h1 className="font-tajawal font-bold text-2xl text-[#2B2118]">
            فطير شرقي
          </h1>
          <p className="text-[#8C7A66] mt-2 text-sm">
            لوحة التحكم - أدخل كلمة المرور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2B2118] mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full h-12 pr-4 pl-12 rounded-xl bg-[#F5EFE6] border-2 text-[#2B2118] font-mono text-lg tracking-wider placeholder:text-[#8C7A66]/30 focus:outline-none focus:border-[#D4A844] transition-all ${
                  shake ? 'border-red-400 animate-shake' : error ? 'border-red-400' : 'border-transparent'
                }`}
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#8C7A66] hover:text-[#2B2118] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 font-bold"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#D4A844] text-white font-bold rounded-xl hover:bg-[#C49A3A] active:scale-[0.98] transition-all"
          >
            دخول
          </button>
        </form>
      </motion.div>
    </div>
  );
}

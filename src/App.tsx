import { Routes, Route, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import { BasketProvider } from '@/context/BasketContext'
import Layout from '@/components/Layout'
import PasswordGate from '@/components/PasswordGate'

const Home = lazy(() => import('./pages/Home'))
const Menu = lazy(() => import('./pages/Menu'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Offers = lazy(() => import('./pages/Offers'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Operations = lazy(() => import('./pages/Operations'))
const DataProcessor = lazy(() => import('./pages/DataProcessor'))
const MenuManagement = lazy(() => import('./pages/MenuManagement'))

function PageLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-dough-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-ghee-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-tajawal text-warm-brown text-body">جاري التحميل...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BasketProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/reviews" element={<Reviews />} />
            </Route>
            {/* Admin Routes - Protected by Password Gate */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<PasswordGate><Dashboard /></PasswordGate>} />
            <Route path="/admin/operations" element={<PasswordGate><Operations /></PasswordGate>} />
            <Route path="/admin/data-processor" element={<PasswordGate><DataProcessor /></PasswordGate>} />
            <Route path="/admin/menu-management" element={<PasswordGate><MenuManagement /></PasswordGate>} />

            {/* Legacy redirects */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/operations" element={<Navigate to="/admin/operations" replace />} />
            <Route path="/data-processor" element={<Navigate to="/admin/data-processor" replace />} />
          </Routes>
        </Suspense>
      </BasketProvider>
    </LanguageProvider>
  )
}

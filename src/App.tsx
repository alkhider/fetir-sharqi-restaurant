import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import { BasketProvider } from '@/context/BasketContext'
import { MenuDataProvider } from '@/context/MenuDataContext'
import { OffersProvider } from '@/context/OffersContext'
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
const DigitalMenuBoard = lazy(() => import('./pages/DigitalMenuBoard'))
const MenuManagement = lazy(() => import('./pages/MenuManagement'))
const OffersManagement = lazy(() => import('./pages/OffersManagement'))

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

/* ─── Admin routes wrapped with PasswordGate ─── */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return <PasswordGate>{children}</PasswordGate>
}

export default function App() {
  return (
    <LanguageProvider>
      <BasketProvider>
        <MenuDataProvider>
          <OffersProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              {/* Customer pages */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/reviews" element={<Reviews />} />
              </Route>

              {/* Admin pages — password protected */}
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/operations" element={<AdminRoute><Operations /></AdminRoute>} />
              <Route path="/data-processor" element={<AdminRoute><DataProcessor /></AdminRoute>} />
              <Route path="/display" element={<AdminRoute><DigitalMenuBoard /></AdminRoute>} />
              <Route path="/menu-management" element={<AdminRoute><MenuManagement /></AdminRoute>} />
              <Route path="/offers-management" element={<AdminRoute><OffersManagement /></AdminRoute>} />
              </Routes>
            </Suspense>
          </OffersProvider>
        </MenuDataProvider>
      </BasketProvider>
    </LanguageProvider>
  )
}

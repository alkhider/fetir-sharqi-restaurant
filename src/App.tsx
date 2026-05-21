import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import { BasketProvider } from '@/context/BasketContext'
import Layout from '@/components/Layout'

/* Customer pages — lazy loaded */
const Home = lazy(() => import('./pages/Home'))
const Menu = lazy(() => import('./pages/Menu'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Offers = lazy(() => import('./pages/Offers'))
const Reviews = lazy(() => import('./pages/Reviews'))

/* Admin pages — direct import to avoid lazy-loading issues */
import Dashboard from './pages/Dashboard'
import Operations from './pages/Operations'
import DataProcessor from './pages/DataProcessor'

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/data-processor" element={<DataProcessor />} />
          </Routes>
        </Suspense>
      </BasketProvider>
    </LanguageProvider>
  )
}

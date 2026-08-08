import { Suspense, lazy, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import About from './components/About';
import Categories from './components/Categories';
import CartToast from './components/CartToast';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import News from './components/News';
import Reviews from './components/Reviews';
import ScrollToTop from './components/ScrollToTop';
import ViewedItems from './components/ViewedItems';

const Catalog = lazy(() => import('./pages/Catalog'));
const CatalogCategory = lazy(() => import('./pages/CatalogCategory'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Aktsii = lazy(() => import('./pages/Aktsii'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const KakZakazat = lazy(() => import('./pages/KakZakazat'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Klientam = lazy(() => import('./pages/Klientam'));
const OKompanii = lazy(() => import('./pages/OKompanii'));
const Otzyvy = lazy(() => import('./pages/Otzyvy'));
const Kontakty = lazy(() => import('./pages/Kontakty'));
const Login = lazy(() => import('./pages/Login'));
const Zvonok = lazy(() => import('./pages/Zvonok'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminFilterGroups = lazy(() => import('./pages/admin/AdminFilterGroups'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminFooter = lazy(() => import('./pages/admin/AdminFooter'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <CartToast />
      <ViewedItems />
      <ScrollToTop />
      <Footer />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-gray-500">
      Загрузка...
    </div>
  );
}

function withSuspense(children: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <News />
      <About />
      <Features />
      <Reviews />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalog" element={<Layout>{withSuspense(<Catalog />)}</Layout>} />
          <Route path="/catalog/:categoryId" element={<Layout>{withSuspense(<CatalogCategory />)}</Layout>} />
          <Route path="/product/:slug" element={<Layout>{withSuspense(<ProductPage />)}</Layout>} />
          <Route path="/aktsii" element={<Layout>{withSuspense(<Aktsii />)}</Layout>} />
          <Route path="/search" element={<Layout>{withSuspense(<SearchPage />)}</Layout>} />
          <Route path="/kak-zakazat" element={<Layout>{withSuspense(<KakZakazat />)}</Layout>} />
          <Route path="/klientam" element={<Layout>{withSuspense(<Klientam />)}</Layout>} />
          <Route path="/o-kompanii" element={<Layout>{withSuspense(<OKompanii />)}</Layout>} />
          <Route path="/otzyvy" element={<Layout>{withSuspense(<Otzyvy />)}</Layout>} />
          <Route path="/kontakty" element={<Layout>{withSuspense(<Kontakty />)}</Layout>} />
          <Route path="/login" element={<Layout>{withSuspense(<Login />)}</Layout>} />
          <Route path="/register" element={<Layout>{withSuspense(<Register />)}</Layout>} />
          <Route path="/profile" element={<Layout>{withSuspense(<Profile />)}</Layout>} />
          <Route path="/zvonok" element={<Layout>{withSuspense(<Zvonok />)}</Layout>} />
          <Route path="/cart" element={<Layout>{withSuspense(<CartPage />)}</Layout>} />
          <Route path="/admin/login" element={withSuspense(<AdminLogin />)} />
          <Route path="/admin" element={withSuspense(<AdminLayout />)}>
            <Route index element={withSuspense(<AdminDashboard />)} />
            <Route path="banners" element={withSuspense(<AdminBanners />)} />
            <Route path="filters" element={withSuspense(<AdminFilterGroups />)} />
            <Route path="news" element={withSuspense(<AdminNews />)} />
            <Route path="products" element={withSuspense(<AdminProducts />)} />
            <Route path="categories" element={withSuspense(<AdminCategories />)} />
            <Route path="promotions" element={withSuspense(<AdminPromotions />)} />
            <Route path="orders" element={withSuspense(<AdminOrders />)} />
            <Route path="footer" element={withSuspense(<AdminFooter />)} />
            <Route path="settings" element={withSuspense(<AdminSettings />)} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

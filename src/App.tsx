import React from 'react';
import {Routes, Route} from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import News from './components/News';
import About from './components/About';
import Features from './components/Features';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import ViewedItems from './components/ViewedItems';
import CartToast from './components/CartToast';
import ScrollToTop from './components/ScrollToTop';
import Catalog from './pages/Catalog';
import CatalogCategory from './pages/CatalogCategory';
import ProductPage from './pages/ProductPage';
import Aktsii from './pages/Aktsii';
import CartPage from './pages/CartPage';
import Register from './pages/Register';
import Profile from './pages/Profile';
import KakZakazat from './pages/KakZakazat';
import Klientam from './pages/Klientam';
import OKompanii from './pages/OKompanii';
import Kontakty from './pages/Kontakty';
import Login from './pages/Login';
import Zvonok from './pages/Zvonok';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminBanners from './pages/admin/AdminBanners';
import AdminOrders from './pages/admin/AdminOrders';

function Layout({children}: {children: React.ReactNode}) {
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
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
        <Route path="/catalog/:categoryId" element={<Layout><CatalogCategory /></Layout>} />
        <Route path="/product/:slug" element={<Layout><ProductPage /></Layout>} />
        <Route path="/aktsii" element={<Layout><Aktsii /></Layout>} />
        <Route path="/kak-zakazat" element={<Layout><KakZakazat /></Layout>} />
        <Route path="/klientam" element={<Layout><Klientam /></Layout>} />
        <Route path="/o-kompanii" element={<Layout><OKompanii /></Layout>} />
        <Route path="/kontakty" element={<Layout><Kontakty /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/zvonok" element={<Layout><Zvonok /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </CartProvider>
    </AuthProvider>
  );
}

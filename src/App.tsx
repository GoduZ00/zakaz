import {Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import News from './components/News';
import About from './components/About';
import Features from './components/Features';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import ViewedItems from './components/ViewedItems';
import ScrollToTop from './components/ScrollToTop';
import Catalog from './pages/Catalog';
import CatalogCategory from './pages/CatalogCategory';
import Aktsii from './pages/Aktsii';
import KakZakazat from './pages/KakZakazat';
import Klientam from './pages/Klientam';
import OKompanii from './pages/OKompanii';
import Kontakty from './pages/Kontakty';
import Login from './pages/Login';
import Zvonok from './pages/Zvonok';

function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
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
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
      <Route path="/catalog/:categoryId" element={<Layout><CatalogCategory /></Layout>} />
      <Route path="/aktsii" element={<Layout><Aktsii /></Layout>} />
      <Route path="/kak-zakazat" element={<Layout><KakZakazat /></Layout>} />
      <Route path="/klientam" element={<Layout><Klientam /></Layout>} />
      <Route path="/o-kompanii" element={<Layout><OKompanii /></Layout>} />
      <Route path="/kontakty" element={<Layout><Kontakty /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/zvonok" element={<Layout><Zvonok /></Layout>} />
    </Routes>
  );
}

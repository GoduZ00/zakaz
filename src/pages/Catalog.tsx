import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

const imageMap: Record<string, string> = {
  'torgovye-avtomaty': '/images/categories/8.png',
  'zhevatelnaya-rezinka': '/images/categories/1.jfif',
  'konfety': '/images/categories/2.jfif',
  'myachi-pryguny': '/images/categories/3.jfif',
  'igrushki': '/images/categories/4.jfif',
  'bakhily-v-kapsulakh': '/images/categories/5.png',
  'kapsuly-pustye': '/images/categories/6.png',
  'stoyki-kronshteyny-shvellery': '/images/categories/stoyki-kronshteyny-shvellery.png',
  'monetopriemniki': '/images/categories/torgovye-avtomaty.png',
  'detali-i-chasti': '/images/categories/torgovye-avtomaty.png',
  'raspredeliteli': '/images/categories/detali-i-chasti.png',
  'nakleyki': '/images/categories/raspredeliteli.png',
};

export default function Catalog() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, slug, image')
        .order('sort_order');
      if (data) setSubcategories(data);
      setLoading(false);
      if (error) console.error('Load subcategories:', error.message);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet><title>Каталог — Vending Trade</title><meta name="description" content="Каталог Vending Trade: торговые автоматы, наполнители, капсулы, игрушки и аксессуары." /></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Каталог</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">КАТАЛОГ</h1>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <Link
            to="/catalog/all"
            className="flex flex-col items-center group bg-white border border-gray-100 p-6 rounded hover:shadow-lg transition-shadow"
          >
            <div className="w-36 h-36 rounded-full bg-[#fdf4e7] flex items-center justify-center mb-6 overflow-hidden border border-[#fae5cc]">
              <svg className="w-14 h-14 text-[#ef7d00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-[13px] font-medium text-center text-gray-700 leading-relaxed group-hover:text-[#ef7d00] transition-colors">
              Все товары
            </h3>
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/catalog/${sub.slug}`}
              className="flex flex-col items-center group bg-white border border-gray-100 p-6 rounded hover:shadow-lg transition-shadow"
            >
              <div className="w-36 h-36 rounded-full bg-[#fdf4e7] flex items-center justify-center mb-6 overflow-hidden border border-[#fae5cc]">
                <img
                  src={sub.image || imageMap[sub.slug] || '/images/categories/8.png'}
                  alt={sub.name}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[13px] font-medium text-center text-gray-700 leading-relaxed group-hover:text-[#ef7d00] transition-colors">
                {sub.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
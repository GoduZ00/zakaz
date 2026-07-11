import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

const subIcons: Record<string, string> = {
  'torgovye-avtomaty': '/images/categories/nakleyki.png',
  'monetopriemniki': '/images/categories/monetopriemniki.png',
  'raspredeliteli': '/images/categories/detali-i-chasti.png',
  'detali-i-chasti': '/images/categories/torgovye-avtomaty.png',
  'stoyki-kronshteyny-shvellery': '/images/categories/stoyki-kronshteyny-shvellery.png',
  'nakleyki': '/images/categories/raspredeliteli.png',
  'zhevatelnaya-rezinka': '/images/categories/1.jfif',
  'konfety': '/images/categories/2.jfif',
  'myachi-pryguny': '/images/categories/3.jfif',
  'igrushki': '/images/categories/4.jfif',
  'bakhily-v-kapsulakh': '/images/categories/5.png',
  'kapsuly-pustye': '/images/categories/6.png',
};

export default function Catalog() {
  const { addItem } = useCart();

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('price_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list-sm' | 'list-lg'>('grid');
  const [loading, setLoading] = useState(true);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(Infinity);
  const [globalMin, setGlobalMin] = useState(0);
  const [globalMax, setGlobalMax] = useState(0);

  useEffect(() => {
    (async () => {
      const [{ data: subData }, { data: prodData }] = await Promise.all([
        supabase.from('subcategories').select('id, name, slug').order('sort_order'),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      ]);
      if (subData) setSubcategories(subData);
      if (prodData) {
        setProducts(prodData);
        const prices = prodData.map((p) => p.price);
        if (prices.length) {
          setGlobalMin(Math.min(...prices));
          setGlobalMax(Math.max(...prices));
        }
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (products.length) { setPriceMin(globalMin); setPriceMax(globalMax); }
  }, [globalMin, globalMax, products.length]);

  const filteredBySub = useMemo(() => {
    if (!activeSub) return products;
    return products.filter((p) => p.subcategory_id === activeSub);
  }, [products, activeSub]);

  const filteredByPrice = useMemo(() => {
    return filteredBySub.filter((p) => p.price >= priceMin && p.price <= priceMax);
  }, [filteredBySub, priceMin, priceMax]);

  const sortedProducts = useMemo(() => {
    return [...filteredByPrice].sort((a, b) => sortBy === 'price_desc' ? b.price - a.price : a.price - b.price);
  }, [filteredByPrice, sortBy]);

  function handleSubClick(id: number) {
    setActiveSub(activeSub === id ? null : id);
  }

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .price-range { pointer-events: none; }
        .price-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #ef7d00; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.25); cursor: pointer; pointer-events: auto; position: relative !important; z-index: 10 !important; }
        .price-range::-moz-range-thumb { width: 16px; height: 16px; background: #ef7d00; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.25); cursor: pointer; border: none; pointer-events: auto; position: relative !important; z-index: 10 !important; }
        .price-range::-webkit-slider-runnable-track { background: transparent; border: none; height: 4px; }
        .price-range::-moz-range-track { background: transparent; border: none; height: 4px; }
        .price-range-min { z-index: 11 !important; }
        .price-range-max { z-index: 10 !important; }
        .price-track-active { position: relative !important; z-index: 1 !important; }
      `}</style>
      <Helmet>
          <title>Каталог — Vending Trade</title>
          <meta name="description" content="Каталог товаров для вендинга: торговые автоматы, наполнители, игрушки в капсулах, сладости. Всё для вендинг-бизнеса в Казахстане." />
          <meta property="og:title" content="Каталог — Vending Trade" />
          <meta property="og:description" content="Товары для вендинга: автоматы, наполнители, капсулы, игрушки." />
        </Helmet>
        <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
            <span className="mx-2">—</span>
            <span className="text-gray-900">Каталог</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-7">Весь ассортимент</h1>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="border-b border-gray-200 last:border-b-0">
                  <div className="block px-4 py-3 text-sm font-medium bg-[#ef7d00] text-white">Подкатегории</div>
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => setActiveSub(null)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${!activeSub ? 'text-[#ef7d00] font-medium' : 'text-gray-600 hover:text-[#ef7d00]'}`}
                      >
                        Все товары
                      </button>
                    </li>
                    {subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSubClick(sub.id)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors break-words ${
                            activeSub === sub.id
                              ? 'text-[#ef7d00] font-medium'
                              : 'text-gray-600 hover:text-[#ef7d00]'
                          }`}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price filter */}
              <div className="bg-white border border-gray-200 rounded-sm mt-4 p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Цена</div>
                <div className="relative h-8">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
                  <div className="absolute top-1/2 h-1 bg-[#ef7d00] rounded-full pointer-events-none -translate-y-1/2 price-track-active"
                    style={{
                      left: `${((priceMin - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                      right: `${100 - ((priceMax - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                    }} />
                  <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                    className="price-range price-range-min absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer m-0 p-0"
                    style={{ top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                    value={priceMax === Infinity ? globalMax : priceMax}
                    onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                    className="price-range price-range-max absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer m-0 p-0"
                    style={{ top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <div className="flex items-center justify-between w-full mt-2">
                  <span className="text-xs text-gray-500">{priceMin.toLocaleString('ru-RU')} ₸</span>
                  <span className="text-xs text-gray-500">{priceMax === Infinity ? globalMax.toLocaleString('ru-RU') : priceMax.toLocaleString('ru-RU')} ₸</span>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Compact subcategory grid */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubClick(sub.id)}
                      className={`flex items-center gap-3 p-3 bg-white border rounded-sm shadow-sm hover:shadow-md transition-shadow text-left ${
                        activeSub === sub.id ? 'border-[#ef7d00]' : 'border-gray-200'
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                        <img src={subIcons[sub.slug] || ''} alt={sub.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-medium text-gray-800 leading-tight break-words hyphens-auto min-w-0">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile subcategory chips */}
              <div className="flex lg:hidden gap-2 mb-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveSub(null)}
                  className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors shrink-0 ${!activeSub ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                >
                  Все
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubClick(sub.id)}
                    className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                      activeSub === sub.id
                        ? 'bg-[#ef7d00] text-white border-[#ef7d00]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>

              {/* Filter bar */}
              <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Сортировать:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]">
                    <option value="price_asc">По цене (возрастание)</option>
                    <option value="price_desc">По цене (убывание)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Товаров: {sortedProducts.length}</span>
                  <div className="flex border border-gray-300 rounded-sm overflow-hidden">
                    <button onClick={() => setViewMode('grid')}
                      className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`} title="Сетка">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="10" y="1" width="5" height="5" rx="1"/><rect x="1" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/></svg>
                    </button>
                    <button onClick={() => setViewMode('list-sm')}
                      className={`p-1.5 ${viewMode === 'list-sm' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`} title="Маленький список">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="3" rx="1"/><rect x="1" y="6.5" width="14" height="3" rx="1"/><rect x="1" y="12" width="14" height="3" rx="1"/></svg>
                    </button>
                    <button onClick={() => setViewMode('list-lg')}
                      className={`p-1.5 ${viewMode === 'list-lg' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`} title="Большой список">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1.5" width="14" height="5" rx="1"/><rect x="1" y="9.5" width="14" height="5" rx="1"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product grid */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">Нет товаров</div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addItem} className={viewMode === 'list-lg' ? 'flex-row' : ''} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [subsByCategory, setSubsByCategory] = useState<Record<number, number[]>>({});
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('price_asc');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const [{ data: catData }, { data: prodData }, { data: subData }] = await Promise.all([
        supabase.from('categories').select('id, name, slug').order('sort_order'),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('subcategories').select('id, category_id'),
      ]);
      if (catData) setCategories(catData);
      if (prodData) setProducts(prodData);
      if (subData) {
        const map: Record<number, number[]> = {};
        for (const s of subData) {
          if (!map[s.category_id]) map[s.category_id] = [];
          map[s.category_id].push(s.id);
        }
        setSubsByCategory(map);
      }
      setLoading(false);
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!activeCat) return products;
    const ids = subsByCategory[activeCat] || [];
    if (!ids.length) return products;
    return products.filter((p) => p.subcategory_id && ids.includes(p.subcategory_id));
  }, [products, activeCat, subsByCategory]);

  const sorted = useMemo(() => {
    return [...filteredProducts].sort((a, b) => sortBy === 'price_desc' ? b.price - a.price : a.price - b.price);
  }, [filteredProducts, sortBy]);

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <Helmet>
        <title>Каталог — Vending Trade</title>
        <meta name="description" content="Каталог товаров для вендинга: торговые автоматы, наполнители, игрушки в капсулах, сладости. Всё для вендинг-бизнеса в Казахстане." />
        <meta property="og:title" content="Каталог — Vending Trade" />
        <meta property="og:description" content="Товары для вендинга: автоматы, наполнители, капсулы, игрушки." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">Каталог</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Весь ассортимент</h1>

        <div className="flex gap-8">
          {/* Category sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="block px-4 py-3 text-sm font-medium bg-[#ef7d00] text-white">Категории</div>
              <ul className="py-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors break-words ${
                        activeCat === cat.id
                          ? 'text-[#ef7d00] font-medium'
                          : 'text-gray-600 hover:text-[#ef7d00]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Сортировать:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]"
                >
                  <option value="price_asc">По цене (возрастание)</option>
                  <option value="price_desc">По цене (убывание)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Товаров: {sorted.length}</span>
              </div>
            </div>

            {/* Mobile category chips */}
            <div className="flex lg:hidden gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                  className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeCat === cat.id
                      ? 'bg-[#ef7d00] text-white border-[#ef7d00]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">Нет товаров</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addItem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

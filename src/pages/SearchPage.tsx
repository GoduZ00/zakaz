import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!q.trim()) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    supabase.from('products').select('*').ilike('name', `%${q}%`).eq('is_active', true).order('id', { ascending: false }).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Поиск</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Поиск</h1>
      {q && (
        <p className="text-gray-500 mb-8">
          {loading ? 'Поиск...' : `Найдено ${products.length} товаров по запросу «${q}»`}
        </p>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Загрузка...</div>
      ) : !q ? (
        <div className="text-gray-400 text-sm">Введите запрос для поиска</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400 text-sm">Ничего не найдено</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <div key={p.id} className="group border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-white">
              <Link to={`/product/${p.slug}`}>
                <div className="aspect-square bg-gray-50 rounded mb-3 flex items-center justify-center overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-200 text-4xl font-bold">?</span>
                  )}
                </div>
              </Link>
              <Link to={`/product/${p.slug}`}>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight min-h-[2.5rem] hover:text-[#ef7d00] transition-colors">{p.name}</h3>
              </Link>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-gray-900">{p.price} ₸</span>
                <button onClick={() => addItem(p, 1)} className="w-8 h-8 bg-[#ef7d00] text-white rounded-full flex items-center justify-center hover:bg-[#d66f00] transition-colors text-lg leading-none">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

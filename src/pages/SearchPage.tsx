import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .order('id', { ascending: false })
      .then(({ data }) => {
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
            <ProductCard key={p.id} product={p} onAddToCart={addItem} />
          ))}
        </div>
      )}
    </div>
  );
}

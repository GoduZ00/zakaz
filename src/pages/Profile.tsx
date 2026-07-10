import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';
import { Helmet } from 'react-helmet-async';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    (async () => {
      const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id);
      if (data?.length) {
        const ids = data.map((r: any) => r.product_id);
        const { data: products } = await supabase.from('products').select('*').in('id', ids);
        setWishlist(products || []);
      }
      setLoading(false);
    })();
  }, [user, navigate]);

  const removeWish = async (productId: number) => {
    await supabase.from('wishlists').delete().eq('user_id', user!.id).eq('product_id', productId);
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <Helmet><title>Профиль — Vending Trade</title><meta name="description" content="Личный кабинет Vending Trade." /></Helmet>
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
        <span className="mx-2">—</span>
        <span className="text-gray-900">Личный кабинет</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <div className="text-sm font-semibold text-gray-900 mb-1">{user.email}</div>
            <div className="text-xs text-gray-400 mb-4">Пользователь</div>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-sm px-3 py-2 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Избранное</h1>

          {loading ? (
            <div className="text-sm text-gray-400 text-center py-10">Загрузка...</div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm mb-4">У вас пока нет избранных товаров</p>
              <Link to="/catalog" className="inline-block bg-[#ef7d00] text-white px-6 py-2 text-sm rounded hover:bg-[#d66f00] transition-colors">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} />
                  <button
                    onClick={() => removeWish(p.id)}
                    className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Удалить из избранного
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Heart(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

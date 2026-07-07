import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { trackViewed } from '../components/ViewedItems';
import type { Product } from '../types';

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single().then(({ data }) => {
      setProduct(data);
      if (data) {
        trackViewed({
          id: String(data.id),
          name: data.name,
          price: `${data.price} ₽`,
          img: data.images?.[0] || '/placeholder.png',
          url: `/product/${data.slug}`,
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-gray-500 mb-7">
            <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
            <span className="mx-2">—</span>
            <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
            <span className="mx-2">—</span>
            <span className="text-gray-900">Товар не найден</span>
          </nav>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Товар не найден</p>
            <Link to="/catalog" className="text-[#ef7d00] hover:underline mt-4 inline-block">Вернуться в каталог</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/placeholder.png'];
  const sku = product.sku_variants?.length ? product.sku_variants : null;
  const currentSku = sku ? sku.find((s) => s.article === selectedSku) || sku[0] : undefined;
  const displayPrice = currentSku?.price ?? product.price;

  const handleAdd = () => {
    addItem(product, qty, currentSku);
  };

  const stockLabel = product.stock_status === 'in_stock' ? 'Есть в наличии' : product.stock_status === 'out_of_stock' ? 'Нет в наличии' : 'Под заказ';
  const stockColor = product.stock_status === 'in_stock' ? 'text-green-600' : 'text-red-500';

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2 p-6 pb-0 lg:pb-6">
              <div className="product-detail-gallery-sticky">
                <div className="bg-gray-50 rounded-lg flex items-center justify-center h-80 mb-3">
                  <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-full object-contain p-4" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-16 border-2 rounded flex items-center justify-center p-1 transition-colors ${activeImg === i ? 'border-[#ef7d00]' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 border border-gray-200 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span>Отложить</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 border border-gray-200 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span>Сравнить</span>
                  </button>
                </div>
                {product.article && (
                  <div className="text-xs text-gray-400">
                    Артикул: <span className="text-gray-600">{product.article}</span>
                  </div>
                )}
              </div>

              <h1 className="text-lg font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* SKU Variants */}
              {sku && (
                <div className="mb-5">
                  <div className="text-sm text-gray-500 mb-3">Выберите вариант:</div>
                  <div className="flex flex-wrap gap-2">
                    {sku.map((v) => {
                      const isActive = (selectedSku || sku[0].article) === v.article;
                      return (
                        <button
                          key={v.article}
                          onClick={() => { setSelectedSku(v.article); setQty(1); }}
                          className={`px-4 py-2 text-sm border rounded transition-colors ${
                            isActive
                              ? 'border-[#ef7d00] bg-orange-50 text-[#ef7d00] font-medium shadow-sm'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {v.label}
                          {v.price != null && <span className="ml-1 text-xs opacity-75">({v.price} ₽)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${product.stock_status === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${stockColor}`}>
                  {stockLabel}
                </span>
                {product.stock_status === 'in_stock' && (
                  <span className="text-xs text-gray-400">, {product.stock_status === 'in_stock' ? 'в наличии' : ''}</span>
                )}
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-lg p-4 mb-5">
                <div className="text-2xl font-bold text-[#ef7d00]">{displayPrice} ₽</div>
                <div className="flex gap-4 mt-2 text-xs">
                  {product.price_wholesale && (
                    <div className="text-gray-500">
                      <span className="text-gray-400">Оптом:</span> {product.price_wholesale} ₽
                    </div>
                  )}
                  {product.price_opt && (
                    <div className="text-gray-500">
                      <span className="text-gray-400">Крупный опт:</span> {product.price_opt} ₽
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">−</button>
                  <span className="px-4 py-2 text-sm font-medium border-x border-gray-300 min-w-[3rem] text-center select-none">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                </div>
                <button onClick={handleAdd} className="flex-1 bg-[#ef7d00] text-white px-6 py-2.5 text-sm rounded-sm hover:bg-[#d66f00] transition-colors font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  В корзину
                </button>
              </div>

              {/* One-click buy */}
              <button className="w-full border border-[#ef7d00] text-[#ef7d00] px-6 py-2.5 text-sm rounded-sm hover:bg-orange-50 transition-colors font-medium">
                Купить в 1 клик
              </button>

              {/* Description */}
              {product.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Описание</h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

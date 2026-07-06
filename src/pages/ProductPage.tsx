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

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Images */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-50 rounded-lg flex items-center justify-center h-80 mb-3">
                <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-full object-contain p-4" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 border-2 rounded flex items-center justify-center p-1 ${activeImg === i ? 'border-[#ef7d00]' : 'border-gray-200'}`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.article && <div className="text-sm text-gray-400 mb-4">Артикул: {product.article}</div>}

              {/* SKU variants */}
              {sku && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Выберите вариант:</div>
                  <div className="flex flex-wrap gap-2">
                    {sku.map((v) => (
                      <button
                        key={v.article}
                        onClick={() => { setSelectedSku(v.article); setQty(1); }}
                        className={`px-4 py-2 text-sm border rounded transition-colors ${
                          (selectedSku || sku[0].article) === v.article
                            ? 'border-[#ef7d00] bg-orange-50 text-[#ef7d00] font-medium'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {v.label}
                        {v.price != null && <span className="ml-1">({v.price} ₽)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="text-2xl font-bold text-[#ef7d00] mb-4">{displayPrice} ₽</div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500">Количество:</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">−</button>
                  <span className="px-4 py-1.5 text-sm font-medium border-x border-gray-300 min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">+</button>
                </div>
              </div>

              {/* Add to cart */}
              <button onClick={handleAdd} className="w-full sm:w-auto bg-[#ef7d00] text-white px-10 py-3 text-sm rounded hover:bg-[#d66f00] transition-colors font-medium">
                Добавить в корзину
              </button>

              {/* Stock status */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.stock_status === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {product.stock_status === 'in_stock' ? 'В наличии' : product.stock_status === 'out_of_stock' ? 'Нет в наличии' : 'Под заказ'}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-6 pt-6 border-t border-gray-100">
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

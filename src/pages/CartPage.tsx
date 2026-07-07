import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, count, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
            <span className="mx-2">—</span>
            <span className="text-gray-900">Корзина</span>
          </nav>
          <div className="bg-white border border-gray-200 rounded-sm p-16 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 6.3c-.3.9.3 1.7 1.2 1.7H17c.9 0 1.5-.8 1.2-1.7L15 13M7 13h8m0 0l1 4m-9-4l-1 4" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">Ваша корзина пуста</p>
            <Link to="/catalog" className="inline-block bg-[#ef7d00] text-white px-8 py-2.5 text-sm rounded hover:bg-[#d66f00] transition-colors">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">Корзина</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Корзина</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items list */}
          <div className="flex-1 space-y-3">
            {items.map((item) => {
              const key = item.sku ? `${item.product.id}_${item.sku.article}` : `${item.product.id}`;
              const itemPrice = item.sku?.price ?? item.product.price;
              return (
                <div key={key} className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-4">
                  <Link to={`/product/${item.product.slug}`} className="w-20 h-20 shrink-0 flex items-center justify-center bg-gray-50 rounded">
                    <img src={item.product.images?.[0] || '/placeholder.png'} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug}`} className="text-sm font-medium text-gray-900 hover:text-[#ef7d00] transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    {item.sku && <div className="text-xs text-gray-400 mt-0.5">{item.sku.label}</div>}
                    {item.product.article && <div className="text-xs text-gray-400 mt-0.5">Арт. {item.product.article}</div>}
                    <div className="text-sm font-semibold text-[#ef7d00] mt-1">{itemPrice} ₸</div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-sm shrink-0">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.sku?.article)}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">−</button>
                    <span className="w-12 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300 select-none">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.sku?.article)}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">+</button>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 w-24 text-right shrink-0">{itemPrice * item.quantity} ₸</div>
                  <button onClick={() => removeItem(item.product.id, item.sku?.article)}
                    className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm p-5 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Ваш заказ</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Товаров ({count})</span>
                  <span>{total} ₸</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                  <span>Итого</span>
                  <span className="text-[#ef7d00]">{total} ₸</span>
                </div>
              </div>
              <button className="w-full bg-[#ef7d00] text-white py-2.5 text-sm rounded hover:bg-[#d66f00] transition-colors font-medium mb-2">
                Оформить заказ
              </button>
              <button onClick={clearCart}
                className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1">
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

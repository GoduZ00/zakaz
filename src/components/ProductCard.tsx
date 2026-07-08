import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function getStockText(product: Product) {
  if (product.stock_status === 'in_stock') {
    if (product.quantity > 30) return 'В наличии более: 30';
    if (product.quantity > 0) return `В наличии: ${product.quantity} шт`;
    return 'В наличии';
  }
  if (product.stock_status === 'out_of_stock') return 'Нет в наличии';
  return 'Под заказ';
}

export function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  const image = product.images?.[0] || '/placeholder.png';
  const stockText = getStockText(product);
  const hasWholesale = typeof product.price_wholesale === 'number';
  const hasOpt = typeof product.price_opt === 'number';

  return (
    <div className={`group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden ${className}`}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white p-3 sm:p-4 border-b border-orange-100">
          <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <Link
          to={`/product/${product.slug}`}
          className="text-[15px] sm:text-base leading-snug text-gray-800 hover:text-[#ef7d00] transition-colors line-clamp-2 min-h-[2.6rem] mb-3"
        >
          {product.name}
        </Link>

        <div className="flex items-start gap-2 text-sm mb-2">
          <span className={`mt-2 w-2 h-2 rounded-full shrink-0 ${product.stock_status === 'in_stock' ? 'bg-lime-500' : 'bg-red-500'}`} />
          <div className="min-w-0">
            <div className={`${product.stock_status === 'in_stock' ? 'text-lime-600' : 'text-red-500'} leading-snug`}>
              {stockText}
            </div>
            {product.article && (
              <div className="text-gray-400 text-sm mt-1">
                Арт.: <span className="text-gray-500">{product.article}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {hasWholesale && (
            <div>
              <div className="text-gray-400 text-sm mb-0.5">Мелкооптовая</div>
              <div className="text-[22px] leading-none font-bold text-gray-900">
                {formatPrice(product.price_wholesale!)} <span className="text-base font-semibold">₸</span>
              </div>
            </div>
          )}

          {hasOpt && (
            <div>
              <div className="text-gray-400 text-sm mb-0.5">Оптом</div>
              <div className="text-[22px] leading-none font-bold text-gray-900">
                {formatPrice(product.price_opt!)} <span className="text-base font-semibold">₸</span>
              </div>
            </div>
          )}

          {!hasWholesale && !hasOpt && (
            <div>
              <div className="text-gray-400 text-sm mb-0.5">Цена</div>
              <div className="text-[22px] leading-none font-bold text-gray-900">
                {formatPrice(product.price)} <span className="text-base font-semibold">₸</span>
              </div>
            </div>
          )}
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-4 w-full h-10 rounded-sm bg-[#ef7d00] text-white text-sm font-medium hover:bg-[#d66f00] transition-colors"
          >
            В корзину
          </button>
        )}
      </div>
    </div>
  );
}

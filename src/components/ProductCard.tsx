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
    <div
      className={`group bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-shadow duration-200 flex flex-col overflow-hidden ${className}`}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white p-4 pb-3 sm:p-5 sm:pb-4 border-b border-orange-100">
          <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-4 py-4 sm:px-5 sm:py-5">
        <Link
          to={`/product/${product.slug}`}
          className="text-[20px] sm:text-[22px] leading-[1.15] text-gray-900 hover:text-[#ef7d00] transition-colors line-clamp-2 min-h-[2.7em] mb-4"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2 text-[15px] mb-1">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${product.stock_status === 'in_stock' ? 'bg-lime-500' : 'bg-red-500'}`} />
          <div className={`${product.stock_status === 'in_stock' ? 'text-lime-600' : 'text-red-500'} border-b border-dotted border-lime-300 pb-0.5 leading-tight`}>
            {stockText}
          </div>
        </div>

        {product.article && (
          <div className="text-gray-400 text-[15px] mb-5">
            Арт.: <span className="text-gray-500">{product.article}</span>
          </div>
        )}

        <div className="space-y-4">
          {hasWholesale && (
            <div>
              <div className="text-gray-400 text-[18px] leading-none mb-1">Мелкооптовая</div>
              <div className="text-[28px] leading-none font-extrabold text-gray-900">
                {formatPrice(product.price_wholesale!)} <span className="text-[20px] font-extrabold">₸</span>
              </div>
            </div>
          )}

          {hasOpt && (
            <div>
              <div className="text-gray-400 text-[18px] leading-none mb-1">Оптом</div>
              <div className="text-[28px] leading-none font-extrabold text-gray-900">
                {formatPrice(product.price_opt!)} <span className="text-[20px] font-extrabold">₸</span>
              </div>
            </div>
          )}

          {!hasWholesale && !hasOpt && (
            <div>
              <div className="text-gray-400 text-[18px] leading-none mb-1">Цена</div>
              <div className="text-[28px] leading-none font-extrabold text-gray-900">
                {formatPrice(product.price)} <span className="text-[20px] font-extrabold">₸</span>
              </div>
            </div>
          )}
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-5 w-full h-12 rounded-[4px] bg-[#ef7d00] text-white text-[15px] font-semibold hover:bg-[#d66f00] transition-colors"
          >
            В корзину
          </button>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
  optTooltip?: string;
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

export function ProductCard({ product, onAddToCart, className = '', optTooltip }: ProductCardProps) {
  const image = product.images?.[0] || '/placeholder.png';
  const stockText = getStockText(product);
  const hasWholesale = typeof product.price_wholesale === 'number';
  const hasOpt = typeof product.price_opt === 'number';
  const boxQty = product.box_quantity || 1000;
  const boxLabel = product.box_label || '';

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
              <div className="text-gray-400 text-sm mb-0.5">Розничная цена</div>
              <div className="text-[22px] leading-none font-bold text-gray-900">
                {formatPrice(product.price_wholesale!)} <span className="text-base font-semibold">₸/шт</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {boxLabel ? `${formatPrice(product.price_wholesale! * boxQty)} ₸/${boxLabel} (${boxQty} шт.)` : `${formatPrice(product.price_wholesale! * boxQty)} ₸ (${boxQty} шт.)`}
              </div>
            </div>
          )}

          {hasOpt && (
            <div>
              <div className="text-gray-400 text-sm mb-0.5 flex items-center gap-1">
                <span>Крупнооптовая цена</span>
                <div className="relative inline-flex items-center">
                  <span className="peer inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] font-bold border border-gray-300 rounded-full text-gray-400 cursor-help leading-none">?</span>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden peer-hover:block z-20">
                    <div className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">{optTooltip || 'Крупнооптовая цена'}</div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <div className="text-[22px] leading-none font-bold text-gray-900">
                {formatPrice(product.price_opt!)} <span className="text-base font-semibold">₸/шт</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {boxLabel ? `${formatPrice(product.price_opt! * boxQty)} ₸/${boxLabel} (${boxQty} шт.)` : `${formatPrice(product.price_opt! * boxQty)} ₸ (${boxQty} шт.)`}
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

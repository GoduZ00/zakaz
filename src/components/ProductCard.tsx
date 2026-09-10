import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { imgUrl } from '../utils/images';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, qty?: number) => void;
  className?: string;
  optTooltip?: string;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value.toFixed(2)));
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

function isPack(product: Product) {
  return (product.box_quantity ?? 0) > 1;
}

function renderBlock(pricePerPiece: number, label: string, tooltip: string | undefined, boxQty: number, boxLabel: string) {
  const pack = boxQty > 1;
  return (
    <div>
      <div className="text-gray-400 text-sm mb-0.5 flex items-center gap-1">
        <span>{label}</span>
        {tooltip && (
          <div className="relative inline-flex items-center">
            <span className="peer inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] font-bold border border-gray-300 rounded-full text-gray-400 cursor-help leading-none">?</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden peer-hover:block z-20">
              <div className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">{tooltip}</div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
      {pack ? (
        <>
          <div className="text-[22px] leading-none font-bold text-gray-900">
            {formatPrice(pricePerPiece * boxQty)} ₸<span className="text-base font-semibold"> / {boxLabel}</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {boxLabel === 'кг' ? `${formatPrice(pricePerPiece)} ₸ /кг` : `${formatPrice(pricePerPiece)} ₸ /шт · ${boxQty} шт. в ${boxLabel}`}
          </div>
        </>
      ) : (
        <div className="text-[22px] leading-none font-bold text-gray-900">
          {formatPrice(pricePerPiece)} ₸<span className="text-base font-semibold"> /{boxLabel === 'кг' ? 'кг' : 'шт'}</span>
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, onAddToCart, className = '', optTooltip }: ProductCardProps) {
  const image = product.images?.[0] || '/placeholder.png';
  const stockText = getStockText(product);
  const hasWholesale = typeof product.price_wholesale === 'number';
  const hasOpt = typeof product.price_opt === 'number';
  const hasLargeWholesale = typeof product.price_large_wholesale === 'number';
  const boxQty = product.box_quantity || 1;
  const boxLabel = product.box_label || 'упак';
  const perPiece = product.price_wholesale ?? product.price;
  const isPack = boxQty > 1;
  const step = isPack ? boxQty : 1;
  const minQty = isPack ? boxQty : 1;
  const [qty, setQty] = useState(minQty);
  const displayQty = Math.floor(qty / step);

  return (
    <div className={`group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden ${className}`}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white p-3 sm:p-4 border-b border-orange-100">
          <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
            <img
              src={imgUrl(image, 400)}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 sm:p-5">
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
          {hasWholesale && renderBlock(product.price_wholesale!, 'Розничная цена', undefined, boxQty, boxLabel)}
          {hasOpt && renderBlock(product.price_opt!, 'Оптовая цена', optTooltip || 'Оптовая цена', boxQty, boxLabel)}
          {hasLargeWholesale && renderBlock(product.price_large_wholesale!, 'Крупнооптовая цена', undefined, boxQty, boxLabel)}
          {!hasWholesale && !hasOpt && !hasLargeWholesale && renderBlock(product.price, 'Цена', undefined, boxQty, boxLabel)}
        </div>

        {onAddToCart && (
          <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2">
            <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden h-9 sm:h-10 shrink-0">
              <button
                onClick={() => setQty((q) => Math.max(minQty, q - step))}
                className="w-7 sm:w-9 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
              >
                −
              </button>
              <span className="w-9 sm:w-12 h-full flex items-center justify-center text-sm font-medium border-x border-gray-300 select-none">
                {displayQty}
                {isPack && <span className="text-[10px] text-gray-400 ml-0.5 hidden sm:inline">{boxLabel}</span>}
              </span>
              <button
                onClick={() => setQty((q) => q + step)}
                className="w-7 sm:w-9 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, qty)}
              className="flex-1 min-w-0 h-9 sm:h-10 rounded-sm bg-[#ef7d00] text-white text-sm font-medium hover:bg-[#d66f00] transition-colors flex items-center justify-center gap-1.5 px-1 sm:px-2 whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

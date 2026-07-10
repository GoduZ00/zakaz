import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '77073099969';

function r(v: number) { return Number(v.toFixed(2)); }

function getItemBasePrice(item: any): number {
  return item.sku?.price ?? item.product.price_wholesale ?? item.product.price;
}

function getItemTierPrice(item: any, tier: string): number {
  if (item.sku?.price) return item.sku.price;
  if (tier === 'large_wholesale') return item.product.price_large_wholesale ?? item.product.price_opt ?? item.product.price_wholesale ?? item.product.price;
  if (tier === 'opt') return item.product.price_opt ?? item.product.price_wholesale ?? item.product.price;
  return item.product.price_wholesale ?? item.product.price;
}

function sendWhatsAppOrder(items: any[], getPrice: (item: any) => number) {
  const lines = ['НОВЫЙ ЗАКАЗ', ''];
  let total = 0;

  items.forEach((item, i) => {
    const name = item.product.name;
    const optLabel = item.options ? ` (${Object.entries(item.options).map(([l, v]) => `${l}: ${v}`).join(', ')})` : item.sku ? ` (${item.sku.label})` : '';
    const price = getPrice(item);
    const subtotal = price * item.quantity;
    total += subtotal;
    const bq = item.product.box_quantity || 1;
    const pack = bq > 1;
    const displayQty = pack ? Math.floor(item.quantity / bq) : item.quantity;
    const unit = pack ? (item.product.box_label || 'упак') : 'шт';
    const unitPrice = pack ? r(price * bq) : r(price);
    lines.push(`${i + 1}. ${name}${optLabel}`);
    lines.push(`   ${displayQty} ${unit} × ${unitPrice} ₸ = ${r(subtotal)} ₸`);
  });

  lines.push('');
  lines.push(`Итого: ${r(total)} ₸`);

  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
}

export default function CartPage() {
  const { items, count, updateQuantity, removeItem, clearCart } = useCart();
  const [thresholds, setThresholds] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.from('price_thresholds').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, number> = {};
        for (const t of data) map[t.tier] = t.threshold;
        setThresholds(map);
      }
    });
  }, []);

  const baseTotal = items.reduce((s, i) => s + getItemBasePrice(i) * i.quantity, 0);

  let tier = 'retail';
  if (thresholds.large_wholesale && baseTotal >= thresholds.large_wholesale) {
    tier = 'large_wholesale';
  } else if (thresholds.opt && baseTotal >= thresholds.opt) {
    tier = 'opt';
  }

  const getPrice = (item: any) => getItemTierPrice(item, tier);

  const tierTotal = items.reduce((s, i) => s + getPrice(i) * i.quantity, 0);

  const tierLabel = (t: string) => {
    if (t === 'large_wholesale') return 'Крупнооптовая цена';
    if (t === 'opt') return 'Оптовая цена';
    return '';
  };

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

        {tier !== 'retail' && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-sm mb-4">
            На сумму от {thresholds[tier]?.toLocaleString('ru-RU')} ₸ применяется <strong>{tierLabel(tier)}</strong>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-3">
            {items.map((item) => {
              const key = item.sku ? `${item.product.id}_${item.sku.article}` : `${item.product.id}`;
              const itemPrice = getPrice(item);
              return (
                <div key={key} className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-4">
                  <Link to={`/product/${item.product.slug}`} className="w-20 h-20 shrink-0 flex items-center justify-center bg-gray-50 rounded">
                    <img src={item.product.images?.[0] || '/placeholder.png'} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug}`} className="text-sm font-medium text-gray-900 hover:text-[#ef7d00] transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    {item.options ? <div className="text-xs text-gray-400 mt-0.5">{Object.entries(item.options).map(([l, v]) => `${l}: ${v}`).join(', ')}</div> : item.sku && <div className="text-xs text-gray-400 mt-0.5">{item.sku.label}</div>}
                    {item.product.article && <div className="text-xs text-gray-400 mt-0.5">Арт. {item.product.article}</div>}
                    {(() => {
                      const bq = item.product.box_quantity || 1;
                      const pack = bq > 1;
                      return (
                        <>
                          <div className="text-sm font-semibold text-[#ef7d00] mt-1">
                            {pack ? `${r(itemPrice * bq)} ₸` : `${r(itemPrice)} ₸`}
                          </div>
                          {tier !== 'retail' && getItemBasePrice(item) !== itemPrice && (
                            <div className="text-xs text-gray-400 line-through">{pack ? `${r(getItemBasePrice(item) * bq)} ₸` : `${r(getItemBasePrice(item))} ₸`}</div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {(() => {
                    const bq = item.product.box_quantity || 1;
                    const isPack = bq > 1;
                    const displayQty = isPack ? Math.floor(item.quantity / bq) : item.quantity;
                    const step = isPack ? bq : 1;
                    const minQty = isPack ? bq : 1;
                    return (
                      <div className="flex items-center border border-gray-300 rounded-sm shrink-0">
                        <button onClick={() => {
                          const next = item.quantity - step;
                          if (next < minQty) { removeItem(item.product.id, item.sku?.article); return; }
                          updateQuantity(item.product.id, next, item.sku?.article);
                        }}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">−</button>
                        <span className="w-14 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300 select-none">
                          {displayQty}
                          {isPack && <span className="text-[10px] text-gray-400 ml-0.5">{item.product.box_label || 'упак'}</span>}
                        </span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + step, item.sku?.article)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">+</button>
                      </div>
                    );
                  })()}
                  <div className="text-sm font-semibold text-gray-900 w-24 text-right shrink-0">{r(itemPrice * item.quantity)} ₸</div>
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

          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm p-5 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Ваш заказ</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Товаров ({count})</span>
                  <span>{r(tierTotal)} ₸</span>
                </div>
                {tier !== 'retail' && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Базовая сумма</span>
                    <span className="line-through">{r(baseTotal)} ₸</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                  <span>Итого</span>
                  <span className="text-[#ef7d00]">{r(tierTotal)} ₸</span>
                </div>
              </div>
              <button onClick={() => sendWhatsAppOrder(items, getPrice)}
                className="w-full bg-[#ef7d00] text-white py-2.5 text-sm rounded hover:bg-[#d66f00] transition-colors font-medium mb-2">
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

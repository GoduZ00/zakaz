import { useState, useEffect } from 'react';

const r = (v: number) => Number(v.toFixed(2));
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { trackViewed } from '../components/ViewedItems';
import type { Product, SkuVariant } from '../types';

const WHATSAPP_NUMBER = '77013099969';

function OneClickModal({ price, onClose }: { price: number; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = async () => {
    if (phone.length < 10) return;
    await supabase.from('orders').insert({ customer_name: '', customer_phone: phone, total: price, items: [{ one_click: true }] });
    const text = encodeURIComponent(`НОВЫЙ ЗАКАЗ (1 клик)\n\nТелефон: ${phone}\nСумма: ${price} ₸`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSent(true);
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="text-center py-4">
            <div className="text-lg font-bold text-green-600 mb-2">Заявка отправлена</div>
            <p className="text-sm text-gray-500">Мы перезвоним вам в ближайшее время</p>
            <button onClick={onClose} className="mt-4 bg-gray-100 px-5 py-2 text-sm rounded hover:bg-gray-200">Закрыть</button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-2">Купить в 1 клик</h3>
            <p className="text-sm text-gray-500 mb-4">На сумму {price} ₸</p>
            <input type="tel" placeholder="+7 (___) ___ __-__" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#ef7d00] mb-3" />
            <button onClick={handleSubmit} disabled={phone.length < 10}
              className="w-full bg-[#ef7d00] text-white py-2.5 text-sm rounded hover:bg-[#d66f00] disabled:opacity-50 transition-colors">Отправить</button>
            <button onClick={onClose} className="w-full text-center text-xs text-gray-400 mt-2 hover:underline">Отмена</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem, showToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [filterGroups, setFilterGroups] = useState<{ name: string; characteristicLabel: string; options: string[] }[]>([]);
  const [subSlug, setSubSlug] = useState('');
  const [selChars, setSelChars] = useState<Record<string, string>>({});
  const [subId, setSubId] = useState<number | null>(null);
  const [subProducts, setSubProducts] = useState<{ slug: string; characteristics: any[] }[]>([]);

  useEffect(() => {
    if (product && (product.box_quantity ?? 0) > 1 && qty === 1) {
      setQty(product.box_quantity!);
    }
  }, [product]);


  const [showOneClick, setShowOneClick] = useState(false);
  const [tab, setTab] = useState<'desc' | 'chars'>('desc');
  const [inWish, setInWish] = useState(false);

  const [wishLoading, setWishLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single().then(async ({ data }) => {
      setProduct(data);
      if (data) {
        setSelectedSku(data.sku_variants?.[0]?.article || '');
        setTab(data.description ? 'desc' : data.characteristics?.length ? 'chars' : 'desc');
        trackViewed({
          id: String(data.id),
          name: data.name,
          price: `${data.price} ₸`,
          img: data.images?.[0] || '/placeholder.png',
          url: `/product/${data.slug}`,
        });
        // Load filter groups for characteristic options
        let hasGroups = false;
        if (data.subcategory_id) {
          const [{ data: fgData }, { data: subData }] = await Promise.all([
            supabase.from('category_filter_groups').select('name, characteristic_label, options').eq('subcategory_id', data.subcategory_id).order('sort_order'),
            supabase.from('subcategories').select('slug').eq('id', data.subcategory_id).single(),
          ]);
          if (fgData?.length) { setFilterGroups(fgData.map((g: any) => ({ name: g.name, characteristicLabel: g.characteristic_label, options: Array.isArray(g.options) ? g.options : [] }))); hasGroups = true; }
          if (subData) setSubSlug(subData.slug);
          setSubId(data.subcategory_id);
        }
        // Load all products in same subcategory for characteristic switching
        if (data.subcategory_id) {
          const { data: all } = await supabase.from('products').select('slug, characteristics').eq('subcategory_id', data.subcategory_id).eq('is_active', true);
          if (all) setSubProducts(all as any);
        }
        // Fallback: if no filter groups in DB, build from product characteristics
        if (!hasGroups) {
          const keys = ['Номинал', 'Распределитель', 'Товар'];
          const groups: { name: string; characteristicLabel: string; options: string[] }[] = [];
          for (const key of keys) {
            const vals = [...new Set((data.characteristics || []).filter((c: any) => c.label === key).map((c: any) => c.value))];
            if (vals.length) groups.push({ name: key, characteristicLabel: key, options: vals });
          }
          if (groups.length) setFilterGroups(groups);
        }
        // Init characteristic selection from first SKU variant or product characteristics
        const init: Record<string, string> = {};
        const firstSku = data.sku_variants?.[0];
        if (firstSku && firstSku.label.includes(':')) {
          firstSku.label.split(', ').forEach((part: string) => {
            const [l, v] = part.split(':');
            if (l && v) init[l.trim()] = v.trim();
          });
        } else {
          for (const c of data.characteristics || []) { init[c.label] = c.value; }
        }
        setSelChars(init);
      }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!user || !product) { setInWish(false); return; }
    supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', product.id).maybeSingle().then(({ data }) => {
      setInWish(!!data);
    });
  }, [user, product]);

  const toggleWish = async () => {
    if (!user) { navigate('/login'); return; }
    if (!product) return;
    setWishLoading(true);
    if (inWish) {
      await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', product.id);
      setInWish(false);
      showToast('«' + product.name + '» удалён из избранного');
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, product_id: product.id });
      setInWish(true);
      showToast('«' + product.name + '» добавлен в избранное', product.images?.[0]);
    }
    setWishLoading(false);
  };

  const prevImg = () => setActiveImg((p) => (p > 0 ? p - 1 : (images?.length || 1) - 1));
  const nextImg = () => setActiveImg((p) => (p < (images?.length || 1) - 1 ? p + 1 : 0));

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
  const imagesLen = images.length;
  const sku = product.sku_variants?.length ? product.sku_variants : null;
  const currentSku = sku ? sku.find((s) => s.article === selectedSku) || sku[0] : undefined;
  const isActiveByArticle = (article: string) => (selectedSku || sku?.[0]?.article || '') === article;
  const displayPrice = currentSku?.price ?? product.price;

  const handleAdd = () => addItem(product, qty, currentSku, Object.keys(selChars).length ? selChars : undefined);

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      {product && (
        <Helmet>
          <title>{product.name} — купить в Казахстане по цене {displayPrice} ₸ | VENDINGTRADE</title>
          <meta name="description" content={`${product.name} — цена ${displayPrice} ₸. ${product.description?.slice(0, 140) || 'Купить с доставкой по Казахстану.'}`} />
          <meta property="og:title" content={`${product.name} — цена ${displayPrice} ₸ | VENDINGTRADE`} />
          <meta property="og:description" content={`${product.name} — цена ${displayPrice} ₸, доставка по Казахстану.`} />
          <link rel="canonical" href={`https://www.vendingtrade.kz/product/${product.slug}`} />
          {product.images?.[0] && <meta property="og:image" content={product.images[0]} />}
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            description: product.description?.slice(0, 300) || product.name,
            image: product.images?.[0] || undefined,
            sku: product.article || undefined,
            offers: {
              '@type': 'Offer',
              price: displayPrice,
              priceCurrency: 'KZT',
              availability: product.stock_status === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `https://www.vendingtrade.kz/product/${product.slug}`,
            },
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.vendingtrade.kz/' },
              { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://www.vendingtrade.kz/catalog' },
              { '@type': 'ListItem', position: 3, name: product.name, item: `https://www.vendingtrade.kz/product/${product.slug}` },
            ],
          })}</script>
        </Helmet>
      )}
      {showOneClick && <OneClickModal price={displayPrice * qty} onClose={() => setShowOneClick(false)} />}
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
            {/* Gallery */}
            <div className="w-full lg:w-1/2 p-6 pb-0 lg:pb-6">
              <div className="relative bg-gray-50 rounded-lg flex items-center justify-center h-80 mb-3 group">
                <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-full object-contain p-4" />
                {imagesLen > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all opacity-0 group-hover:opacity-100">
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all opacity-0 group-hover:opacity-100">
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setActiveImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-[#ef7d00] w-4' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {imagesLen > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 border-2 rounded flex items-center justify-center p-1 transition-colors ${i === activeImg ? 'border-[#ef7d00]' : 'border-gray-200 hover:border-gray-400'}`}>
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button onClick={toggleWish} disabled={wishLoading}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-sm transition-colors ${
                      inWish
                        ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
                        : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
                    <svg width="16" height="13" viewBox="0 0 16 13" fill={inWish ? 'currentColor' : 'none'}><path d="M8 12.4L2.1 6.5C0.6 5 0.5 2.8 2 1.3C3.5 -0.2 5.7 -0.1 7.2 1.3L8 2.1L8.8 1.3C10.3 -0.2 12.5 -0.3 14 1.2C15.5 2.7 15.4 4.9 13.9 6.4L8 12.4Z" stroke={inWish ? 'none' : 'currentColor'} strokeWidth="1.5" fill={inWish ? 'currentColor' : 'none'}/></svg>
                    Отложить
                  </button>

                </div>
                {product.article && (
                  <div className="text-xs text-gray-400">Артикул: <span className="text-gray-600 font-medium">{product.article}</span></div>
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-5">{product.name}</h1>

              {/* SKU with images */}
              {sku && (
                <div className="mb-5 space-y-3">
                  {(() => {
                    const groups = groupSkuByLabel(sku);
                    return groups.map((group, gi) => (
                      <div key={gi}>
                        <div className="text-sm text-gray-500 mb-2">
                          {group.label}
                          <span className="text-gray-400 mx-1">—</span>
                          <span className="text-gray-700 font-medium">{group.activeLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((v) => {
                            const active = isActiveByArticle(v.article);
                            return (
                              <button key={v.article} onClick={() => setSelectedSku(v.article)}
                                className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-sm transition-all ${
                                  active
                                    ? 'border-[#ef7d00] bg-orange-50 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-400'
                                }`}>
                                {v.image ? (
                                  <img src={v.image} className="w-8 h-8 object-contain rounded" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">{v.label[0]}</div>
                                )}
                                <span className={active ? 'text-[#ef7d00] font-medium' : 'text-gray-600'}>{v.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <span className={`w-2 h-2 rounded-full ${product.stock_status === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock_status === 'in_stock' ? 'text-green-700' : 'text-red-500'}`}>
                  {product.stock_status === 'in_stock' ? 'Есть в наличии' : product.stock_status === 'out_of_stock' ? 'Нет в наличии' : 'Под заказ'}
                </span>
                {product.stock_status === 'in_stock' && product.quantity > 0 && (
                  <span className="text-xs text-gray-400">: {product.quantity} шт</span>
                )}
              </div>

              {/* Characteristic selectors */}
              {filterGroups.length > 0 && (
                <div className="space-y-3 mb-4">
                  {filterGroups.map((fg) => {
                    const currentVal = selChars[fg.characteristicLabel] || '';
                    const options = fg.options.length ? fg.options : [...new Set(product.characteristics?.filter((c) => c.label === fg.characteristicLabel).map((c) => c.value))];
                    if (!options.length) return null;
                    return (
                      <div key={fg.characteristicLabel}>
                        <div className="text-xs text-gray-500 mb-1.5">{fg.name}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {options.map((opt) => {
                            const active = opt === currentVal;
                            return (
                              <button key={opt}
                                onClick={() => setSelChars({ ...selChars, [fg.characteristicLabel]: opt })}
                                className={`text-xs px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                                  active
                                    ? 'border-[#ef7d00] bg-orange-50 text-[#ef7d00] font-medium cursor-default'
                                    : 'border-gray-200 text-gray-500 bg-white hover:border-gray-400 hover:text-gray-700'
                                }`}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Price */}
              <div className="mb-5">
                {(() => {
                  const bq = product.box_quantity || 1;
                  const bl = product.box_label || 'упак';
                  const pack = bq > 1;
                  return (
                    <>
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-2xl font-bold text-[#ef7d00]">{r(displayPrice)} ₸</span>
                        <span className="text-xs text-gray-400">{pack ? `/ ${bl}` : bl === 'кг' ? '/ кг' : '/ шт'}</span>
                      </div>
                      <div className="space-y-1">
                        {product.price_wholesale && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 text-xs">Розничная:</span>
                            <span className="text-gray-700 font-medium">{r(product.price_wholesale)} ₸</span>
                            {pack && <span className="text-xs text-gray-400">{bl === 'кг' ? `/кг · ${bq} кг` : `/шт · ${bq} шт. в ${bl}`}</span>}
                          </div>
                        )}
                        {product.price_opt && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 text-xs">Оптовая:</span>
                            <span className="text-gray-700 font-medium">{r(product.price_opt)} ₸</span>
                            {pack && <span className="text-xs text-gray-400">{bl === 'кг' ? `/кг · ${bq} кг` : `/шт · ${bq} шт. в ${bl}`}</span>}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Cart controls */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button onClick={() => setQty(Math.max(product.box_quantity || 1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg width="11" height="1" viewBox="0 0 11 1" fill="currentColor"><rect width="11" height="1" rx="0.5"/></svg>
                  </button>
                  <span className="w-14 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-300 select-none">{qty}</span>
                  <button onClick={() => setQty(Math.min(qty + 1, product.quantity || 999))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M11 5H6V0H5v5H0v1h5v5h1V6h5z"/></svg>
                  </button>
                </div>
                <button onClick={handleAdd} className="flex-1 h-10 bg-[#ef7d00] text-white px-5 text-sm rounded-sm hover:bg-[#d66f00] transition-colors font-medium flex items-center justify-center gap-2">
                  <svg width="19" height="16" viewBox="0 0 19 16" fill="none"><path d="M1 1h2l2 10h10l2-8H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="15" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  В корзину
                </button>
              </div>
              <button onClick={() => setShowOneClick(true)} className="w-full h-10 border border-[#ef7d00] text-[#ef7d00] text-sm rounded-sm hover:bg-orange-50 transition-colors font-medium">
                Купить в 1 клик
              </button>

              {/* Tabs: Description / Characteristics */}
              {(product.description || product.characteristics?.length) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-1 mb-4 border-b border-gray-200">
                    {product.description && (
                      <button onClick={() => setTab('desc')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === 'desc' ? 'border-[#ef7d00] text-[#ef7d00]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Описание
                      </button>
                    )}
                    {product.characteristics?.length > 0 && (
                      <button onClick={() => setTab('chars')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === 'chars' ? 'border-[#ef7d00] text-[#ef7d00]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Характеристики
                      </button>
                    )}
                  </div>
                  {tab === 'desc' && product.description && (
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</div>
                  )}
                  {tab === 'chars' && product.characteristics?.length > 0 && (
                    <div className="char_block bordered rounded3 js-scrolled border border-gray-200 rounded-sm overflow-hidden">
                      <table className="props_list nbg w-full text-sm">
                        <tbody className="js-offers-prop">
                          {product.characteristics.filter((c) => !['Номинал', 'Распределитель', 'Товар'].includes(c.label)).map((c, i) => (
                            <tr key={i} className={`js-prop-replace ${i % 2 === 0 ? '' : 'bg-gray-50'}`} itemScope itemType="http://schema.org/PropertyValue">
                              <td className="char_name px-4 py-2.5 w-1/2 text-gray-500 align-top">
                                <div className="props_item">
                                  <span itemProp="name" className="js-prop-title">{c.label}</span>
                                </div>
                              </td>
                              <td className="char_value px-4 py-2.5 w-1/2 text-gray-800 align-top">
                                <span className="js-prop-value" itemProp="value" dangerouslySetInnerHTML={{ __html: c.value }} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <table className="props_list nbg w-full text-sm" id="bx_117848907_5977_sku_prop"></table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupSkuByLabel(sku: SkuVariant[]): { label: string; activeLabel: string; items: SkuVariant[] }[] {
  const groups = new Map<string, typeof sku>();
  for (const v of sku) {
    const parts = v.label.split(',');
    const key = parts.length > 1 ? parts[0].trim() : 'Вариант';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    activeLabel: items[0]?.label.replace(/^[^,]+,\s*/, '') || items[0]?.label || '',
    items,
  }));
}

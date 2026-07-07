import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
}

const subIcons: Record<string, string> = {
  'torgovye-avtomaty': '/images/categories/nakleyki.png',
  'monetopriemniki': '/images/categories/monetopriemniki.png',
  'raspredeliteli': '/images/categories/detali-i-chasti.png',
  'detali-i-chasti': '/images/categories/torgovye-avtomaty.png',
  'stoyki-kronshteyny-shvellery': '/images/categories/stoyki-kronshteyny-shvellery.png',
  'nakleyki': '/images/categories/raspredeliteli.png',
  'zhevatelnaya-rezinka': '/images/categories/1.jfif',
  'konfety': '/images/categories/2.jfif',
  'myachi-pryguny': '/images/categories/3.jfif',
  'igrushki': '/images/categories/4.jfif',
  'bakhily-v-kapsulakh': '/images/categories/5.png',
  'kapsuly-pustye': '/images/categories/6.png',
};

const faqItems = [
  {
    q: 'Какие механические торговые автоматы самые надежные?',
    a: 'Наиболее надежными считаются автоматы с металлическим корпусом и проверенными механизмами выдачи. Мы предлагаем оборудование, которое прошло многолетнюю проверку на российском рынке.',
  },
  {
    q: 'Сколько стоит обслуживание торгового автомата?',
    a: 'Стоимость обслуживания зависит от типа автомата и его загрузки. В среднем расходы на запчасти и ремонт составляют 5-10% от выручки.',
  },
  {
    q: 'Как выбрать монетоприемник для автомата?',
    a: 'Выбор монетоприемника зависит от типа автомата и монет, которые вы планируете принимать. Универсальные модели поддерживают большинство российских монет.',
  },
  {
    q: 'Есть ли гарантия на оборудование?',
    a: 'Да, на все оборудование предоставляется гарантия от 12 месяцев. На запчасти — от 6 месяцев.',
  },
];

export default function CatalogCategory() {
  const { categoryId } = useParams();
  const { addItem } = useCart();

  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('price_asc');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(Infinity);
  const [viewMode, setViewMode] = useState<'grid' | 'list-sm' | 'list-lg'>('grid');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterInStock, setFilterInStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    (async () => {
      let cat: CategoryInfo | null = null;
      let subs: SubCategory[] = [];
      let activeSubId: number | null = null;

      const { data: catData } = await supabase.from('categories').select('id, name, slug').eq('slug', categoryId).single();
      if (catData) {
        cat = catData;
        const { data: subData } = await supabase.from('subcategories').select('id, name, slug').eq('category_id', cat.id).order('sort_order');
        subs = subData || [];
      } else {
        const { data: subData } = await supabase.from('subcategories').select('id, name, slug, category_id').eq('slug', categoryId).single();
        if (subData) {
          const { data: catData2 } = await supabase.from('categories').select('id, name, slug').eq('id', subData.category_id).single();
          cat = catData2 || null;
          const { data: allSubs } = await supabase.from('subcategories').select('id, name, slug').eq('category_id', subData.category_id).order('sort_order');
          subs = allSubs || [];
          activeSubId = subData.id;
        }
      }

      setCategory(cat);
      setSubcategories(subs);
      setActiveSub(activeSubId);

      if (cat) {
        const subIds = subs.map((s) => s.id);
        let query = supabase.from('products').select('*').in('subcategory_id', subIds).eq('is_active', true);
        if (activeSubId) {
          query = supabase.from('products').select('*').eq('subcategory_id', activeSubId).eq('is_active', true);
        }
        const { data: prodData } = await query.order('id', { ascending: false });
        setProducts(prodData || []);
      }

      setLoading(false);
    })();
  }, [categoryId]);

  const allPrices = useMemo(() => products.map((p) => p.price), [products]);
  const globalMin = useMemo(() => (allPrices.length ? Math.min(...allPrices) : 0), [allPrices]);
  const globalMax = useMemo(() => (allPrices.length ? Math.max(...allPrices) : 0), [allPrices]);

  useEffect(() => {
    if (products.length) {
      setPriceMin(globalMin);
      setPriceMax(globalMax);
    }
  }, [globalMin, globalMax, products.length]);

  const filteredProducts = (activeSub
    ? products.filter((p) => p.subcategory_id === activeSub)
    : products
  ).filter((p) => p.price >= priceMin && p.price <= priceMax)
   .filter((p) => !filterInStock || p.stock_status === 'in_stock');

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    return b.price - a.price;
  });

  const handleSubClick = (subId: number) => {
    setActiveSub((prev) => (prev === subId ? null : subId));
  };

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-gray-500 mb-7">
            <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
            <span className="mx-2">—</span>
            <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
            <span className="mx-2">—</span>
            <span className="text-gray-900">Страница не найдена</span>
          </nav>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Категория не найдена</p>
            <Link to="/catalog" className="text-[#ef7d00] hover:underline mt-4 inline-block">Вернуться в каталог</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-7">{category.name}</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-sm">
              {subcategories.length > 0 && (
                <div className="border-b border-gray-200 last:border-b-0">
                  <div className="block px-4 py-3 text-sm font-medium bg-[#ef7d00] text-white">{category.name}</div>
                  <ul className="py-1">
                    {subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSubClick(sub.id)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            activeSub === sub.id
                              ? 'text-[#ef7d00] font-medium'
                              : 'text-gray-600 hover:text-[#ef7d00]'
                          }`}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Compact subcategory grid */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/catalog/${sub.slug}`}
                    className={`flex items-center gap-3 p-3 bg-white border rounded-sm shadow-sm hover:shadow-md transition-shadow ${
                      activeSub === sub.id ? 'border-[#ef7d00]' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                      <img
                        src={subIcons[sub.slug] || ''}
                        alt={sub.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-800 leading-tight">{sub.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Сортировать:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]"
                >
                  <option value="price_asc">По цене (возрастание)</option>
                  <option value="price_desc">По цене (убывание)</option>
                </select>
                <div className="relative">
                  <button onClick={() => setShowFilter(!showFilter)}
                    className={`p-1.5 border rounded-sm transition-colors ${showFilter ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'bg-white text-gray-400 hover:text-gray-600 border-gray-300'}`}
                    title="Фильтр">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                    </svg>
                  </button>
                  {showFilter && (
                    <div className="absolute left-0 top-full mt-1 z-20 w-64 bg-white border border-gray-200 rounded-sm shadow-lg p-4 space-y-4">
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-2">Цена</div>
                        <div className="flex items-center gap-2 mb-3">
                          <input type="number" placeholder={String(globalMin)} value={priceMin === globalMin ? '' : priceMin}
                            onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : globalMin)}
                            className="w-full text-[11px] border border-gray-300 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                          <span className="text-gray-400 text-[11px]">—</span>
                          <input type="number" placeholder={String(globalMax)} value={priceMax === globalMax ? '' : priceMax}
                            onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : globalMax)}
                            className="w-full text-[11px] border border-gray-300 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                        </div>
                        {globalMax > globalMin && (
                          <div className="relative h-5">
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#ef7d00] rounded-full"
                              style={{
                                left: `${((priceMin - globalMin) / (globalMax - globalMin)) * 100}%`,
                                right: `${((globalMax - priceMax) / (globalMax - globalMin)) * 100}%`,
                              }}></div>
                            <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#ef7d00] rounded-full border border-white shadow cursor-pointer"
                              style={{ left: `calc(${((priceMin - globalMin) / (globalMax - globalMin)) * 100}% - 5px)` }}></div>
                            <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#ef7d00] rounded-full border border-white shadow cursor-pointer"
                              style={{ left: `calc(${((priceMax - globalMin) / (globalMax - globalMin)) * 100}% - 5px)` }}></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-2">Наличие</div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={filterInStock} onChange={(e) => setFilterInStock(e.target.checked)}
                            className="w-3 h-3 accent-[#ef7d00]" />
                          <span className="text-xs text-gray-600 group-hover:text-gray-800">В наличии</span>
                        </label>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); setFilterInStock(false); }}
                          className="text-[11px] text-gray-500 hover:text-[#ef7d00] transition-colors flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0a5 5 0 1 0 5 5h-1A4 4 0 1 1 5 1V0zm0 1V0l3 2.5L5 5V3.5a3.5 3.5 0 1 1-3.5 3.5h1A2.5 2.5 0 1 0 5 4.5V1z"/></svg>
                          Очистить
                        </button>
                        <button onClick={() => setShowFilter(false)}
                          className="text-[11px] bg-[#ef7d00] text-white px-3 py-1 rounded hover:bg-[#d66f00] transition-colors">Показать</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Товаров: {sortedProducts.length}</span>
                <div className="flex border border-gray-300 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                    title="Сетка"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <rect x="1" y="1" width="5" height="5" rx="1" />
                      <rect x="10" y="1" width="5" height="5" rx="1" />
                      <rect x="1" y="10" width="5" height="5" rx="1" />
                      <rect x="10" y="10" width="5" height="5" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list-sm')}
                    className={`p-1.5 ${viewMode === 'list-sm' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                    title="Маленький список"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <rect x="1" y="1" width="14" height="3" rx="1" />
                      <rect x="1" y="6.5" width="14" height="3" rx="1" />
                      <rect x="1" y="12" width="14" height="3" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list-lg')}
                    className={`p-1.5 ${viewMode === 'list-lg' ? 'bg-[#ef7d00] text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                    title="Большой список"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <rect x="1" y="1.5" width="14" height="5" rx="1" />
                      <rect x="1" y="9.5" width="14" height="5" rx="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center mb-6">
                <div className="max-w-sm mx-auto">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-400 text-sm">В этой категории пока нет товаров.</p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {sortedProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    <Link to={`/product/${p.slug}`} className="p-4 flex items-center justify-center h-44">
                      <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </Link>
                    <div className="px-4 pb-4 flex flex-col flex-1">
                      <Link to={`/product/${p.slug}`} className="text-sm text-gray-800 leading-tight mb-2 line-clamp-2 hover:text-[#ef7d00] transition-colors">{p.name}</Link>
                      <div className="mt-auto">
                        <div className="text-lg font-bold text-[#ef7d00]">{p.price} ₸</div>
                        <button onClick={() => addItem(p)} className="mt-2 w-full text-sm bg-[#ef7d00] text-white py-2 rounded hover:bg-[#d66f00] transition-colors">В корзину</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'list-sm' ? (
              <div className="space-y-2 mb-6">
                {sortedProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 p-3">
                    <Link to={`/product/${p.slug}`} className="w-16 h-16 shrink-0 flex items-center justify-center">
                      <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${p.slug}`} className="text-sm text-gray-800 leading-tight line-clamp-1 hover:text-[#ef7d00] transition-colors">{p.name}</Link>
                      {p.article && <div className="text-xs text-gray-400 mt-0.5">Арт. {p.article}</div>}
                    </div>
                    <div className="text-base font-bold text-[#ef7d00] shrink-0">{p.price} ₸</div>
                    <button onClick={() => addItem(p)} className="shrink-0 text-sm bg-[#ef7d00] text-white px-4 py-1.5 rounded hover:bg-[#d66f00] transition-colors">В корзину</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {sortedProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow flex gap-5 p-5">
                    <Link to={`/product/${p.slug}`} className="w-48 h-48 shrink-0 flex items-center justify-center bg-gray-50 rounded">
                      <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </Link>
                    <div className="flex flex-col flex-1 py-1">
                      <Link to={`/product/${p.slug}`} className="text-base font-medium text-gray-900 hover:text-[#ef7d00] transition-colors">{p.name}</Link>
                      {p.article && <div className="text-sm text-gray-400 mt-1">Артикул: {p.article}</div>}
                      <div className="text-sm text-gray-500 mt-2 line-clamp-3">{p.description}</div>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-[#ef7d00]">{p.price} ₸</div>
                          {p.price_wholesale && <div className="text-xs text-gray-400">Опт: {p.price_wholesale} ₸</div>}
                        </div>
                        <button onClick={() => addItem(p)} className="text-sm bg-[#ef7d00] text-white px-6 py-2.5 rounded hover:bg-[#d66f00] transition-colors">В корзину</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination placeholder */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-gray-300 rounded-sm text-gray-400 cursor-not-allowed" disabled>‹</button>
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-[#ef7d00] rounded-sm bg-[#ef7d00] text-white">1</button>
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-gray-300 rounded-sm text-gray-400 cursor-not-allowed" disabled>›</button>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Часто задаваемые вопросы</h2>
              <div className="space-y-2">
                {faqItems.map((item, i) => (
                  <div key={i} className="border border-gray-200 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span>{item.q}</span>
                      <svg className={`w-4 h-4 shrink-0 ml-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{item.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Описание категории</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                <p>{category.name} — это надежное оборудование для вендингового бизнеса. В нашем каталоге представлены механические торговые автоматы, монетоприемники, диспенсеры, купюроприемники, а также запасные части, замки, стикеры и стенды для напольных автоматов.</p>
                <p>Механические торговые автоматы не требуют подключения к электросети, что позволяет устанавливать их в любых местах с высокой проходимостью. Простая конструкция обеспечивает надежность и долгий срок службы.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

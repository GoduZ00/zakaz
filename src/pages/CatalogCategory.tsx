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
  const [showFilter, setShowFilter] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ sort: true, price: true });
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
  ).filter((p) => p.price >= priceMin && p.price <= priceMax);

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

            {/* Compact filter panel under sort bar */}
            <div className="bg-white border border-gray-200 rounded-sm mb-6 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none border-b border-gray-200" onClick={() => setShowFilter(!showFilter)}>
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-gray-800">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M10.6 0H1.4C0.7 0 0.2 0.7 0.5 1.3L4 5.4V8.5C4 8.8 4.2 9 4.5 9.2L6.5 10C7 10.2 7.5 9.8 7.5 9.3V5.4L11.5 1.3C11.8 0.7 11.3 0 10.6 0Z" fill="currentColor"/>
                  </svg>
                  <span>Фильтр</span>
                </div>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${showFilter ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 5 3" fill="currentColor">
                  <path d="M0 0h5L2.5 3Z"/>
                </svg>
              </div>
              {showFilter && (
                <div className="px-4 py-3 space-y-4">
                  {/* Price range */}
                  <div>
                    <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => setOpenSections({ ...openSections, price: !openSections.price })}>
                      <span className="text-sm font-medium text-gray-800">Цена</span>
                      <svg className={`w-3 h-3 text-gray-400 transition-transform ${openSections.price ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 5 3" fill="currentColor">
                        <path d="M0 0h5L2.5 3Z"/>
                      </svg>
                    </div>
                    {openSections.price && (
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder={String(globalMin)} value={priceMin === globalMin ? '' : priceMin}
                          onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : globalMin)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                        <span className="text-gray-400 text-xs">—</span>
                        <input type="number" placeholder={String(globalMax)} value={priceMax === globalMax ? '' : priceMax}
                          onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : globalMax)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                      </div>
                    )}
                  </div>
                  {/* Reset */}
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); }}
                      className="text-xs text-gray-500 hover:text-[#ef7d00] transition-colors flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0a5 5 0 1 0 5 5h-1A4 4 0 1 1 5 1V0zm0 1V0l3 2.5L5 5V3.5a3.5 3.5 0 1 1-3.5 3.5h1A2.5 2.5 0 1 0 5 4.5V1z"/></svg>
                      Очистить фильтр
                    </button>
                    <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); setSortBy('price_asc'); setActiveSub(null); }}
                      className="text-xs bg-[#ef7d00] text-white px-4 py-1.5 rounded hover:bg-[#d66f00] transition-colors">
                      Показать
                    </button>
                  </div>
                </div>
              )}
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

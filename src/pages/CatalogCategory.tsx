import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

interface FilterGroupConfig {
  name: string;
  characteristicLabel: string;
  options?: string[];
}

function getCharOptions(products: Product[], cfg: FilterGroupConfig): string[] {
  if (cfg.options) return cfg.options;
  const values = new Set<string>();
  for (const p of products) {
    for (const c of (p.characteristics || [])) {
      if (c.label === cfg.characteristicLabel && c.value) values.add(c.value);
    }
  }
  return Array.from(values).sort();
}

const filterConfigByCategory: Record<string, FilterGroupConfig[]> = {
  'napolniteli-dlya-torgovykh-avtomatov': [
    { name: 'Диаметр капсулы', characteristicLabel: 'Диаметр капсулы', options: ['28 мм', '32 мм', '34 мм', '45 мм', '53 мм', '58 мм', '100 мм', '48 мм', '65 мм', '75 мм'] },
    { name: 'Готовность к продаже через автомат', characteristicLabel: 'Готовность к продаже через автомат', options: ['Игрушка в капсуле', 'Требуется упаковка в капсулу', 'Не требуется упаковка в капсулу'] },
    { name: 'Виды игрушек', characteristicLabel: 'Виды игрушек', options: ['Значки', 'Животные', 'Ластики', 'Лизуны/ Слаймы / Тянучки', 'Украшения', 'Страшилки', 'Техника', 'Прочие', 'Антистресс', 'Наклейки', 'Сквиши', 'Фигурки', 'Фигурки людей'] },
    { name: 'Размер (кондит. изд.)', characteristicLabel: 'Размер (кондит. изд.)', options: ['22 мм', '23 мм', '24 мм', '25 мм', '27 мм', '14 мм', 'Порционные'] },
    { name: 'Форма (кондит. изд.)', characteristicLabel: 'Форма (кондит. изд.)', options: ['Круглые', 'Фигурные', 'Овальные'] },
    { name: 'Цвет (кондит. изд.)', characteristicLabel: 'Цвет (кондит. изд.)', options: ['Разноцветные', 'Разноцветные с рисунком', 'Одноцветные', 'Одноцветные с рисунком'] },
    { name: 'Состав (кондит. изд.)', characteristicLabel: 'Состав (кондит. изд.)', options: ['Без начинки', 'С начинкой', 'Желейные', 'С жевательным центром'] },
    { name: 'Размеры (мячей-прыгунов)', characteristicLabel: 'Размеры (мячей-прыгунов)', options: ['25 мм', '27 мм', '32 мм', '45 мм'] },
    { name: 'Форма (мячей-прыгунов)', characteristicLabel: 'Форма (мячей-прыгунов)', options: ['Круглые', 'Фигурные'] },
  ],
};

const filterConfigBySubcategory: Record<string, FilterGroupConfig[]> = {
  'torgovye-avtomaty': [
    { name: 'Номинал', characteristicLabel: 'Номинал', options: ['50', '100', '100+100'] },
    { name: 'Распределитель', characteristicLabel: 'Распределитель', options: ['22мм', '25мм', '32мм', 'порционный'] },
    { name: 'Товар', characteristicLabel: 'Товар', options: ['ЖР', 'Конфеты', 'Мяч', 'Игрушки'] },
  ],
};

interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
  opt_tooltip?: string;
}

const subIcons: Record<string, string> = {
  'torgovye-avtomaty': '/images/categories/8.png',
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
  const [searchParams] = useSearchParams();
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
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterStickers, setFilterStickers] = useState<string[]>([]);
  const [filterCoating, setFilterCoating] = useState<string[]>([]);
  const [charFilters, setCharFilters] = useState<Record<string, string[]>>({});
  const [filterGroups, setFilterGroups] = useState<FilterGroupConfig[] | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const charOptions = useMemo(() => {
    if (!filterGroups) return {} as Record<string, string[]>;
    const opts: Record<string, string[]> = {};
    for (const g of filterGroups) {
      opts[g.characteristicLabel] = getCharOptions(products, g);
    }
    return opts;
  }, [filterGroups, products]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    (async () => {
      let cat: CategoryInfo | null = null;
      let subs: SubCategory[] = [];
      let activeSubId: number | null = null;

      const { data: catData } = await supabase.from('categories').select('id, name, slug, opt_tooltip').eq('slug', categoryId).single();
      if (catData) {
        cat = catData;
        const { data: subData } = await supabase.from('subcategories').select('id, name, slug').eq('category_id', cat.id).order('sort_order');
        subs = subData || [];
      } else {
        const { data: subData } = await supabase.from('subcategories').select('id, name, slug, category_id').eq('slug', categoryId).single();
        if (subData) {
          const { data: catData2 } = await supabase.from('categories').select('id, name, slug, opt_tooltip').eq('id', subData.category_id).single();
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
        let filterData;
        if (activeSubId) {
          const { data } = await supabase.from('category_filter_groups').select('name, characteristic_label, options').eq('subcategory_id', activeSubId).order('sort_order');
          filterData = data;
        }
        if (!filterData || !filterData.length) {
          const { data } = await supabase.from('category_filter_groups').select('name, characteristic_label, options').eq('category_id', cat.id).order('sort_order');
          filterData = data;
        }
        // Fall back to hardcoded config if DB has no entries for this category
        if (!filterData || !filterData.length) {
          const subHardcoded = activeSubId ? filterConfigBySubcategory[subs.find((s) => s.id === activeSubId)?.slug || ''] : undefined;
          filterData = subHardcoded || filterConfigByCategory[cat.slug];
        }
        setFilterGroups(filterData?.length ? filterData : null);

        // Apply filters from URL query params
        const initialFilters: Record<string, string[]> = {};
        let hasFilter = false;
        if (filterData?.length) {
          for (const fg of filterData as FilterGroupConfig[]) {
            const vals = searchParams.getAll(fg.characteristicLabel);
            if (vals.length) { initialFilters[fg.characteristicLabel] = vals; hasFilter = true; }
          }
        }
        if (hasFilter) setCharFilters(initialFilters);

        const subIds = subs.map((s) => s.id);
        let query = supabase.from('products').select('*').in('subcategory_id', subIds).eq('is_active', true);
        if (activeSubId) {
          query = supabase.from('products').select('*').eq('subcategory_id', activeSubId).eq('is_active', true);
        }
        const { data: prodData } = await query.order('id', { ascending: false });
        setProducts(prodData || []);
      } else {
        setFilterGroups(null);
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
   .filter((p) => !filterInStock || p.stock_status === 'in_stock')
   .filter((p) => {
     if (!filterStickers.length && !filterCoating.length) return true;
     const chars = p.characteristics || [];
     const stickerMatch = !filterStickers.length || filterStickers.some((s) => chars.some((c) => c.label === 'Вид наклейки' && c.value === s));
     const coatingMatch = !filterCoating.length || filterCoating.some((c) => chars.some((ch) => ch.label === 'Покрытие' && ch.value === c));
     return stickerMatch && coatingMatch;
   })
    .filter((p) => {
      return (Object.entries(charFilters) as [string, string[]][]).every(([label, selected]) => {
       if (!selected.length) return true;
       const chars = p.characteristics || [];
       return selected.some((v) => chars.some((c) => c.label === label && c.value === v));
     });
   });

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
    <>
      <Helmet>
        <title>{category?.name ? `${category.name} — Vending Trade` : 'Каталог — Vending Trade'}</title>
        <meta name="description" content={`${category?.name || 'Каталог'} — товары для вендинга. Купить в Казахстане с доставкой.`} />
        <meta property="og:title" content={`${category?.name || 'Каталог'} — Vending Trade`} />
        <meta property="og:description" content={`${category?.name || 'Каталог'} — все для вендинг-бизнеса.`} />
        <link rel="canonical" href={`https://www.vendingtrade.kz/catalog/${categoryId}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.vendingtrade.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://www.vendingtrade.kz/catalog' },
            { '@type': 'ListItem', position: 3, name: category?.name || 'Каталог' },
          ],
        })}</script>
      </Helmet>
      <style>{`
        .price-range { pointer-events: none; }
        .price-range::-webkit-slider-thumb { pointer-events: auto; -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: #ef7d00; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer; }
        .price-range::-moz-range-thumb { pointer-events: auto; width: 14px; height: 14px; background: #ef7d00; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer; }
        .price-range-min { z-index: 11; }
        .price-range-max { z-index: 10; }
      `}</style>
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
                          className={`w-full text-left px-4 py-2 text-sm transition-colors break-words ${
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
                    <span className="text-xs font-medium text-gray-800 leading-tight break-words hyphens-auto min-w-0">{sub.name}</span>
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

              <div className="bg-white border border-gray-200 rounded-sm px-3 py-2 mb-6 hidden lg:block">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Price filter group */}
                  <div className="relative">
                    <button onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
                      className={`text-[11px] font-medium px-2 py-1.5 border rounded-sm transition-all duration-200 whitespace-nowrap ${openFilter === 'price' ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                      Цена
                    </button>
                    <div className={`absolute left-0 top-full mt-1 z-20 w-64 bg-white border border-gray-200 rounded-sm shadow-lg p-4 space-y-3 transition-all duration-200 ease-out ${openFilter === 'price' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}>
                      <div className="flex items-center justify-between text-xs text-gray-700">
                        <span>{priceMin} ₸</span>
                        <span>{priceMax} ₸</span>
                      </div>
                      <div className="relative h-6">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#ef7d00] rounded-full pointer-events-none"
                          style={{
                            left: `${((priceMin - globalMin) / (globalMax - globalMin)) * 100}%`,
                            right: `${((globalMax - priceMax) / (globalMax - globalMin)) * 100}%`,
                          }}></div>
                        <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                          value={priceMin}
                          onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                          className="price-range price-range-min absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10" />
                        <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                          value={priceMax}
                          onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                          className="price-range price-range-max absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={priceMin} onChange={(e) => setPriceMin(Math.min(Number(e.target.value) || globalMin, priceMax - 1))}
                          className="w-full text-[11px] border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                        <span className="text-gray-400 text-[11px]">—</span>
                        <input type="number" value={priceMax} onChange={(e) => setPriceMax(Math.max(Number(e.target.value) || globalMax, priceMin + 1))}
                          className="w-full text-[11px] border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-[#ef7d00]" />
                      </div>
                    </div>
                  </div>

                  {/* Category-specific filter groups */}
                  {filterGroups ? filterGroups.map((fg) => (
                    <div key={fg.characteristicLabel} className="relative">
                      <button onClick={() => setOpenFilter(openFilter === fg.characteristicLabel ? null : fg.characteristicLabel)}
                        className={`text-[11px] font-medium px-2 py-1.5 border rounded-sm transition-all duration-200 whitespace-nowrap ${openFilter === fg.characteristicLabel ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                        {fg.name}
                      </button>
                      <div className={`absolute left-0 top-full mt-1 z-20 w-52 bg-white border border-gray-200 rounded-sm shadow-lg p-3 space-y-1.5 transition-all duration-200 ease-out ${openFilter === fg.characteristicLabel ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}>
                        {(charOptions[fg.characteristicLabel] || []).map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={(charFilters[fg.characteristicLabel] || []).includes(opt)}
                              onChange={(e) => setCharFilters((prev) => {
                                const current = prev[fg.characteristicLabel] || [];
                                const next = e.target.checked ? [...current, opt] : current.filter((x) => x !== opt);
                                return { ...prev, [fg.characteristicLabel]: next };
                              })}
                              className="w-3 h-3 accent-[#ef7d00]" />
                            <span className="text-[11px] text-gray-600 group-hover:text-gray-800">{opt}</span>
                          </label>
                        ))}
                        {(!charOptions[fg.characteristicLabel] || charOptions[fg.characteristicLabel].length === 0) && (
                          <span className="text-[11px] text-gray-400">Нет вариантов</span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <>
                      {/* Sticker types filter group (legacy) */}
                      <div className="relative">
                        <button onClick={() => setOpenFilter(openFilter === 'stickers' ? null : 'stickers')}
                          className={`text-[11px] font-medium px-2 py-1.5 border rounded-sm transition-all duration-200 whitespace-nowrap ${openFilter === 'stickers' ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                          Виды наклеек
                        </button>
                        <div className={`absolute left-0 top-full mt-1 z-20 w-52 bg-white border border-gray-200 rounded-sm shadow-lg p-3 space-y-1.5 transition-all duration-200 ease-out ${openFilter === 'stickers' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}>
                          {['Универсальная', 'Индивидуальная', 'Инструкция'].map((s) => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" checked={filterStickers.includes(s)}
                                onChange={(e) => setFilterStickers(e.target.checked ? [...filterStickers, s] : filterStickers.filter((x) => x !== s))}
                                className="w-3 h-3 accent-[#ef7d00]" />
                              <span className="text-[11px] text-gray-600 group-hover:text-gray-800">{s}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Coating filter group (legacy) */}
                      <div className="relative">
                        <button onClick={() => setOpenFilter(openFilter === 'coating' ? null : 'coating')}
                          className={`text-[11px] font-medium px-2 py-1.5 border rounded-sm transition-all duration-200 whitespace-nowrap ${openFilter === 'coating' ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                          Покрытие
                        </button>
                        <div className={`absolute left-0 top-full mt-1 z-20 w-48 bg-white border border-gray-200 rounded-sm shadow-lg p-3 space-y-1.5 transition-all duration-200 ease-out ${openFilter === 'coating' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}>
                          {['Хромированные', 'Окрашенные'].map((c) => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" checked={filterCoating.includes(c)}
                                onChange={(e) => setFilterCoating(e.target.checked ? [...filterCoating, c] : filterCoating.filter((x) => x !== c))}
                                className="w-3 h-3 accent-[#ef7d00]" />
                              <span className="text-[11px] text-gray-600 group-hover:text-gray-800">{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* In stock checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="checkbox" checked={filterInStock} onChange={(e) => setFilterInStock(e.target.checked)}
                      className="w-3 h-3 accent-[#ef7d00]" />
                    <span className="text-[11px] text-gray-500 group-hover:text-gray-700 whitespace-nowrap">В наличии</span>
                  </label>

                  {/* Reset */}
                  <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); setFilterInStock(false); setFilterStickers([]); setFilterCoating([]); setCharFilters({}); setOpenFilter(null); }}
                    className="text-[11px] text-gray-400 hover:text-[#ef7d00] transition-colors shrink-0 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0a5 5 0 1 0 5 5h-1A4 4 0 1 1 5 1V0zm0 1V0l3 2.5L5 5V3.5a3.5 3.5 0 1 1-3.5 3.5h1A2.5 2.5 0 1 0 5 4.5V1z"/></svg>
                    Очистить
                  </button>
                </div>
              </div>

              {/* Mobile filter toggle */}
              <div className="lg:hidden mb-3 flex items-center gap-2">
                <button onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 text-xs font-medium px-3 py-2 border border-gray-300 rounded-sm text-gray-700 hover:border-gray-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Фильтры
                  {(filterStickers.length > 0 || filterCoating.length > 0 || (Object.values(charFilters) as string[][]).some((v) => v.length > 0) || filterInStock) && (
                    <span className="w-2 h-2 rounded-full bg-[#ef7d00]" />
                  )}
                </button>
                {(filterStickers.length > 0 || filterCoating.length > 0 || (Object.values(charFilters) as string[][]).some((v) => v.length > 0) || filterInStock) && (
                  <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); setFilterInStock(false); setFilterStickers([]); setFilterCoating([]); setCharFilters({}); setOpenFilter(null); }}
                    className="text-[11px] text-gray-400 hover:text-[#ef7d00] transition-colors shrink-0 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0a5 5 0 1 0 5 5h-1A4 4 0 1 1 5 1V0zm0 1V0l3 2.5L5 5V3.5a3.5 3.5 0 1 1-3.5 3.5h1A2.5 2.5 0 1 0 5 4.5V1z"/></svg>
                    Очистить
                  </button>
                )}
              </div>

              {/* Mobile filter drawer */}
              {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
                  <div className="relative w-[90vw] max-w-md max-h-[90vh] bg-white shadow-xl rounded-lg overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h2 className="text-sm font-bold text-gray-900">Фильтры</h2>
                      <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Price */}
                      <div>
                        <button onClick={() => setOpenFilter(openFilter === 'm-price' ? null : 'm-price')}
                          className={`w-full flex items-center justify-between text-sm font-medium py-2 ${openFilter === 'm-price' ? 'text-[#ef7d00]' : 'text-gray-700'}`}>
                          Цена
                          <svg className={`w-4 h-4 transition-transform ${openFilter === 'm-price' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFilter === 'm-price' && (
                          <div className="pt-2 pb-3 space-y-3">
                            <div className="flex items-center justify-between text-xs text-gray-700">
                              <span>{priceMin} ₸</span>
                              <span>{priceMax} ₸</span>
                            </div>
                            <div className="relative h-6">
                              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                              <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#ef7d00] rounded-full pointer-events-none"
                                style={{ left: `${((priceMin - globalMin) / (globalMax - globalMin)) * 100}%`, right: `${((globalMax - priceMax) / (globalMax - globalMin)) * 100}%` }} />
                              <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                                value={priceMin} onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                                className="price-range price-range-min absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10" />
                              <input type="range" min={globalMin} max={globalMax} step={Math.max(1, Math.round((globalMax - globalMin) / 100))}
                                value={priceMax} onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                                className="price-range price-range-max absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10" />
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="number" value={priceMin} onChange={(e) => setPriceMin(Math.min(Number(e.target.value) || globalMin, priceMax - 1))}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#ef7d00]" />
                              <span className="text-gray-400 text-xs">—</span>
                              <input type="number" value={priceMax} onChange={(e) => setPriceMax(Math.max(Number(e.target.value) || globalMax, priceMin + 1))}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#ef7d00]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Category-specific filter groups */}
                      {filterGroups ? filterGroups.map((fg) => (
                        <div key={fg.characteristicLabel}>
                          <button onClick={() => setOpenFilter(openFilter === `m-${fg.characteristicLabel}` ? null : `m-${fg.characteristicLabel}`)}
                            className={`w-full flex items-center justify-between text-sm font-medium py-2 ${openFilter === `m-${fg.characteristicLabel}` ? 'text-[#ef7d00]' : 'text-gray-700'}`}>
                            {fg.name}
                            <svg className={`w-4 h-4 transition-transform ${openFilter === `m-${fg.characteristicLabel}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openFilter === `m-${fg.characteristicLabel}` && (
                            <div className="pt-1 pb-2 space-y-1.5">
                              {(charOptions[fg.characteristicLabel] || []).map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group py-1">
                                  <input type="checkbox" checked={(charFilters[fg.characteristicLabel] || []).includes(opt)}
                                    onChange={(e) => setCharFilters((prev) => {
                                      const current = prev[fg.characteristicLabel] || [];
                                      const next = e.target.checked ? [...current, opt] : current.filter((x) => x !== opt);
                                      return { ...prev, [fg.characteristicLabel]: next };
                                    })}
                                    className="w-3.5 h-3.5 accent-[#ef7d00]" />
                                  <span className="text-sm text-gray-600">{opt}</span>
                                </label>
                              ))}
                              {(!charOptions[fg.characteristicLabel] || charOptions[fg.characteristicLabel].length === 0) && (
                                <span className="text-xs text-gray-400">Нет вариантов</span>
                              )}
                            </div>
                          )}
                        </div>
                      )) : (
                        <>
                          {/* Legacy sticker filter */}
                          <div>
                            <button onClick={() => setOpenFilter(openFilter === 'm-stickers' ? null : 'm-stickers')}
                              className={`w-full flex items-center justify-between text-sm font-medium py-2 ${openFilter === 'm-stickers' ? 'text-[#ef7d00]' : 'text-gray-700'}`}>
                              Виды наклеек
                              <svg className={`w-4 h-4 transition-transform ${openFilter === 'm-stickers' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {openFilter === 'm-stickers' && (
                              <div className="pt-1 pb-2 space-y-1.5">
                                {['Универсальная', 'Индивидуальная', 'Инструкция'].map((s) => (
                                  <label key={s} className="flex items-center gap-2 cursor-pointer group py-1">
                                    <input type="checkbox" checked={filterStickers.includes(s)}
                                      onChange={(e) => setFilterStickers(e.target.checked ? [...filterStickers, s] : filterStickers.filter((x) => x !== s))}
                                      className="w-3.5 h-3.5 accent-[#ef7d00]" />
                                    <span className="text-sm text-gray-600">{s}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Legacy coating filter */}
                          <div>
                            <button onClick={() => setOpenFilter(openFilter === 'm-coating' ? null : 'm-coating')}
                              className={`w-full flex items-center justify-between text-sm font-medium py-2 ${openFilter === 'm-coating' ? 'text-[#ef7d00]' : 'text-gray-700'}`}>
                              Покрытие
                              <svg className={`w-4 h-4 transition-transform ${openFilter === 'm-coating' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {openFilter === 'm-coating' && (
                              <div className="pt-1 pb-2 space-y-1.5">
                                {['Хромированные', 'Окрашенные'].map((c) => (
                                  <label key={c} className="flex items-center gap-2 cursor-pointer group py-1">
                                    <input type="checkbox" checked={filterCoating.includes(c)}
                                      onChange={(e) => setFilterCoating(e.target.checked ? [...filterCoating, c] : filterCoating.filter((x) => x !== c))}
                                      className="w-3.5 h-3.5 accent-[#ef7d00]" />
                                    <span className="text-sm text-gray-600">{c}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* In stock */}
                      <div className="pt-2 border-t border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer py-1">
                          <input type="checkbox" checked={filterInStock} onChange={(e) => setFilterInStock(e.target.checked)}
                            className="w-3.5 h-3.5 accent-[#ef7d00]" />
                          <span className="text-sm text-gray-700">В наличии</span>
                        </label>
                      </div>

                      {/* Reset */}
                      <button onClick={() => { setPriceMin(globalMin); setPriceMax(globalMax); setFilterInStock(false); setFilterStickers([]); setFilterCoating([]); setCharFilters({}); setOpenFilter(null); }}
                        className="w-full text-sm text-gray-500 border border-gray-300 rounded-sm px-3 py-2 hover:bg-gray-50 transition-colors">
                        Сбросить фильтры
                      </button>

                      <button onClick={() => setShowMobileFilters(false)}
                        className="w-full text-sm bg-[#ef7d00] text-white rounded-sm px-3 py-2 hover:bg-[#d66f00] transition-colors">
                        Применить
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  <ProductCard key={p.id} product={p} onAddToCart={addItem} optTooltip={category?.opt_tooltip} />
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
    </>
  );
}

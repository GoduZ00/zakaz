import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

interface FilterGroup {
  label: string;
  values: string[];
}

function extractFilterGroups(products: Product[]): FilterGroup[] {
  const map = new Map<string, Set<string>>();
  for (const p of products) {
    for (const c of p.characteristics || []) {
      if (!c.label || !c.value) continue;
      if (!map.has(c.label)) map.set(c.label, new Set());
      map.get(c.label)!.add(c.value);
    }
  }
  return Array.from(map.entries())
    .map(([label, vals]) => ({ label, values: Array.from(vals).sort() }))
    .filter((g) => g.values.length > 1)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function AllProducts() {
  const { addItem } = useCart();

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('price_asc');
  const [charFilters, setCharFilters] = useState<Record<string, string[]>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: subData }, { data: prodData }] = await Promise.all([
        supabase.from('subcategories').select('id, name, slug').order('sort_order'),
        supabase.from('products').select('*').eq('is_active', true),
      ]);
      if (subData) setSubcategories(subData);
      if (prodData) setProducts(prodData);
      setLoading(false);
    })();
  }, []);

  const filterGroups = useMemo(() => extractFilterGroups(products), [products]);

  const toggleChar = (label: string, value: string) => {
    setCharFilters((prev) => {
      const current = prev[label] || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      const updated = { ...prev };
      if (next.length === 0) delete updated[label];
      else updated[label] = next;
      return updated;
    });
  };

  const clearCharFilters = () => setCharFilters({});

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeSub) result = result.filter((p) => p.subcategory_id === activeSub);
    const activeLabels = Object.keys(charFilters);
    if (activeLabels.length === 0) return result;
    return result.filter((p) =>
      activeLabels.every((label) => {
        const selected = charFilters[label];
        const prodVals = (p.characteristics || []).filter((c) => c.label === label).map((c) => c.value);
        return selected.some((sv) => prodVals.includes(sv));
      })
    );
  }, [products, activeSub, charFilters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => sortBy === 'price_desc' ? b.price - a.price : a.price - b.price);
  }, [filteredProducts, sortBy]);

  const hasCharFilters = Object.keys(charFilters).length > 0;

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Наполнители для вендинговых аппаратов — весь каталог | VENDINGTRADE</title>
        <meta name="description" content="Весь каталог наполнения для вендинговых аппаратов: жевательная резинка, конфеты, игрушки в капсулах, капсулы, бахилы, монетоприёмники. Купить с доставкой по Казахстану." />
      </Helmet>
      <div className="bg-[#f8f8f8] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
            <span className="mx-2">—</span>
            <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
            <span className="mx-2">—</span>
            <span className="text-gray-900">Все товары</span>
          </nav>

          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Весь ассортимент</h1>
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
          </div>

          <div className="flex gap-8">
            <aside className="w-64 shrink-0 hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="border-b border-gray-200">
                  <div className="block px-4 py-3 text-sm font-medium bg-[#ef7d00] text-white">Подкатегории</div>
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => setActiveSub(null)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors break-words ${!activeSub ? 'text-[#ef7d00] font-medium' : 'text-gray-600 hover:text-[#ef7d00]'}`}
                      >
                        Все товары
                      </button>
                    </li>
                    {subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => setActiveSub(activeSub === sub.id ? null : sub.id)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors break-words ${activeSub === sub.id ? 'text-[#ef7d00] font-medium' : 'text-gray-600 hover:text-[#ef7d00]'}`}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {filterGroups.length > 0 && (
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-3 text-sm font-medium text-gray-700">Фильтры</div>
                    {filterGroups.map((fg) => (
                      <div key={fg.label} className="border-t border-gray-100">
                        <button
                          onClick={() => setOpenGroups((p) => ({ ...p, [fg.label]: !p[fg.label] }))}
                          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <span className="truncate">{fg.label}</span>
                          {openGroups[fg.label] ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                        </button>
                        {openGroups[fg.label] && (
                          <div className="px-4 pb-3 space-y-1">
                            {fg.values.map((val) => (
                              <label key={val} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#ef7d00]">
                                <input
                                  type="checkbox"
                                  checked={(charFilters[fg.label] || []).includes(val)}
                                  onChange={() => toggleChar(fg.label, val)}
                                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#ef7d00] focus:ring-[#ef7d00]"
                                />
                                <span className="truncate">{val}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
                <span className="text-sm text-gray-500">Товаров: {sortedProducts.length}</span>
                <div className="flex gap-2 flex-wrap items-center">
                  <button
                    onClick={() => setActiveSub(null)}
                    className={`text-xs font-medium px-3 py-1.5 border rounded-sm transition-colors whitespace-nowrap ${!activeSub ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}
                  >
                    Все товары
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSub(activeSub === sub.id ? null : sub.id)}
                      className={`text-xs font-medium px-3 py-1.5 border rounded-sm transition-colors whitespace-nowrap ${activeSub === sub.id ? 'bg-[#ef7d00] text-white border-[#ef7d00]' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                  {hasCharFilters && (
                    <button
                      onClick={clearCharFilters}
                      className="text-xs font-medium px-3 py-1.5 border border-red-300 text-red-500 rounded-sm hover:bg-red-50 transition-colors whitespace-nowrap"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-sm p-12 text-center mb-6">
                  <p className="text-gray-400 text-sm">Товары не найдены.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {sortedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onAddToCart={addItem} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

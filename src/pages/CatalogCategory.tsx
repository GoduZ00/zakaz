import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface SubCategory {
  name: string;
  slug: string;
}

interface CategoryData {
  name: string;
  subcategories: SubCategory[];
}

const categoryData: Record<string, CategoryData> = {
  'mekhanicheskie_torgovye_avtomaty_catalog': {
    name: 'Механические торговые автоматы',
    subcategories: [
      { name: 'Торговые автоматы', slug: 'torgovye-avtomaty' },
      { name: 'Монетоприемники и пластины к ним', slug: 'monetopriemniki' },
      { name: 'Распределители', slug: 'raspredeliteli' },
      { name: 'Детали и части', slug: 'detali-i-chasti' },
      { name: 'Стойки, кронштейны, швеллеры', slug: 'stoyki-kronshteyny-shvellery' },
      { name: 'Наклейки', slug: 'nakleyki' },
    ],
  },
  'napolniteli-dlya-torgovykh-avtomatov': {
    name: 'Наполнители для торговых автоматов',
    subcategories: [
      { name: 'Жевательная резинка', slug: 'zhevatelnaya-rezinka' },
      { name: 'Конфеты', slug: 'konfety' },
      { name: 'Мячи-прыгуны', slug: 'myachi-pryguny' },
      { name: 'Игрушки', slug: 'igrushki' },
      { name: 'Бахилы в капсулах', slug: 'bakhily-v-kapsulakh' },
      { name: 'Капсулы пустые', slug: 'kapsuly-pustye' },
    ],
  },
};

const sidebarMenu = [
  {
    name: 'Механические торговые автоматы',
    slug: 'mekhanicheskie_torgovye_avtomaty_catalog',
    children: [
      'Торговые автоматы',
      'Монетоприемники и пластины к ним',
      'Распределители',
      'Детали и части',
      'Стойки, кронштейны, швеллеры',
      'Наклейки',
    ],
  },
  {
    name: 'Наполнители для торговых автоматов',
    slug: 'napolniteli-dlya-torgovykh-avtomatov',
    children: [
      'Жевательная резинка',
      'Конфеты',
      'Мячи-прыгуны',
      'Игрушки',
      'Бахилы в капсулах',
      'Капсулы пустые',
    ],
  },
];

const subIcons: Record<string, string> = {
  'torgovye-avtomaty': '/images/categories/nakleyki.png',
  'monetopriemniki': '/images/categories/monetopriemniki.png',
  'raspredeliteli': '/images/categories/detali-i-chasti.png',
  'detali-i-chasti': '/images/categories/torgovye-avtomaty.png',
  'stoyki-kronshteyny-shvellery': '/images/categories/stoyki-kronshteyny-shvellery.png',
  'nakleyki': '/images/categories/raspredeliteli.png',
  'zhevatelnaya-rezinka': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Жвачка',
  'konfety': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Конфеты',
  'myachi-pryguny': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Мячи',
  'igrushki': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Игрушки',
  'bakhily-v-kapsulakh': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Бахилы',
  'kapsuly-pustye': 'https://placehold.co/120x120/e2e8f0/94a3b8?text=Капсулы',
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
  const data = categoryData[categoryId || ''];
  const [activeSub, setActiveSub] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list-sm' | 'list-lg'>('grid');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!data) {
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
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <Link to="/catalog" className="hover:text-[#ef7d00] transition-colors">Каталог</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">{data.name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-7">
          {data.name}
        </h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-sm">
              {sidebarMenu.map((section) => (
                <div key={section.slug} className="border-b border-gray-200 last:border-b-0">
                  <Link
                    to={`/catalog/${section.slug}`}
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      section.slug === categoryId
                        ? 'bg-[#ef7d00] text-white'
                        : 'text-gray-800 hover:text-[#ef7d00]'
                    }`}
                  >
                    {section.name}
                  </Link>
                  {section.slug === categoryId && (
                    <ul className="py-1">
                      {section.children.map((child) => (
                        <li key={child}>
                          <button
                            onClick={() => setActiveSub(child === activeSub ? '' : child)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              activeSub === child
                                ? 'text-[#ef7d00] font-medium'
                                : 'text-gray-600 hover:text-[#ef7d00]'
                            }`}
                          >
                            {child}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Compact subcategory list */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/catalog/${sub.slug}`}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                      <img
                        src={subIcons[sub.slug] || ''}
                        alt={sub.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-800 leading-tight">
                      {sub.name}
                    </span>
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
                <span className="text-sm text-gray-500">Товаров: 0</span>
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

            {/* Products area */}
            <div className="bg-white border border-gray-200 rounded-sm p-12 text-center mb-6">
              <div className="max-w-sm mx-auto">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-400 text-sm">
                  В этой категории пока нет товаров.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Товары будут добавлены после настройки админ-панели.
                </p>
              </div>
            </div>

            {/* Pagination placeholder */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-gray-300 rounded-sm text-gray-400 cursor-not-allowed" disabled>
                ‹
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-[#ef7d00] rounded-sm bg-[#ef7d00] text-white">
                1
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-sm border border-gray-300 rounded-sm text-gray-400 cursor-not-allowed" disabled>
                ›
              </button>
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
                      <svg
                        className={`w-4 h-4 shrink-0 ml-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Описание категории</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                <p>
                  {data.name} — это надежное оборудование для вендингового бизнеса. В нашем каталоге представлены
                  механические торговые автоматы, монетоприемники, диспенсеры, купюроприемники, а также
                  запасные части, замки, стикеры и стенды для напольных автоматов.
                </p>
                <p>
                  Механические торговые автоматы не требуют подключения к электросети, что позволяет
                  устанавливать их в любых местах с высокой проходимостью. Простая конструкция обеспечивает
                  надежность и долгий срок службы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

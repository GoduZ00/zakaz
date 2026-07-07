import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Search, Heart, ShoppingCart, Menu, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const catalogItems = [
  {
    id: 'mekhanicheskie_torgovye_avtomaty_catalog',
    name: 'Механические торговые автоматы',
    img: '/images/categories/8.png',
    items: ['Торговые автоматы', 'Монетоприемники и пластины к ним', 'Распределители', 'Детали и части', 'Стойки, кронштейны, швеллеры', 'Наклейки'],
  },
  {
    id: 'napolniteli-dlya-torgovykh-avtomatov',
    name: 'Наполнители для торговых автоматов',
    img: '/images/categories/7.png',
    items: ['Жевательная резинка', 'Конфеты', 'Мячи-прыгуны', 'Игрушки', 'Бахилы в капсулах', 'Капсулы пустые'],
  },
];

const howToOrderItems = [
  { title: 'Оформление заказа', desc: 'Добавьте товары в корзину и оформите заказ' },
  { title: 'Способы оплаты', desc: 'Наличные, банковская карта, безналичный расчет' },
  { title: 'Доставка', desc: 'Бесплатная доставка по России от 10 000 ₸' },
  { title: 'Самовывоз', desc: 'Забрать заказ можно в нашем офисе' },
];

const clientsItems = [
  { title: 'Бонусная программа', desc: 'Копите бонусы и получайте скидки до 10%' },
  { title: 'Оптовым клиентам', desc: 'Специальные условия для корпоративных клиентов' },
  { title: 'Дилерам', desc: 'Станьте дилером и получайте лучшие цены' },
  { title: 'Акции', desc: 'Действующие акции и специальные предложения' },
  { title: 'Возврат товара', desc: 'Условия возврата и обмена товара' },
];

const aboutItems = [
  { title: 'О нас', desc: 'Ведущий поставщик оборудования для вендинга' },
  { title: 'Новости', desc: 'Последние новости компании и отрасли' },
  { title: 'Вакансии', desc: 'Присоединяйтесь к нашей команде' },
  { title: 'Реквизиты', desc: 'Юридическая информация и документы' },
  { title: 'Отзывы', desc: 'Что говорят о нас клиенты' },
];

function UserLink() {
  const { user } = useAuth();
  return (
    <Link to={user ? '/profile' : '/login'} className="flex items-center gap-1.5 hover:text-orange-500">
      <User className="w-4 h-4 text-gray-400" />
      <span>{user ? user.email?.split('@')[0] : 'ВОЙТИ'}</span>
    </Link>
  );
}

function DropdownItem({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {label}
      <div
        className={`absolute top-full left-0 z-50 pt-0 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sticky, setSticky] = useState(false);


  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className={`bg-[#f8f8f8] border-b border-gray-200 py-1.5 text-[11px] sm:text-[13px] text-gray-600 ${sticky ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://go.2gis.com/O6tAe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-orange-500">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
              <span className="hidden xs:inline">Алматы</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                <span className="font-semibold text-gray-900 text-[11px] sm:text-[13px]">8-701-309-9969</span>
              </div>
              <Link to="/zvonok" className="text-[#ef7d00] border-b border-dashed border-[#ef7d00] hover:border-solid text-[11px] sm:text-[13px]">ЗАКАЗАТЬ ЗВОНОК</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://go.2gis.com/O6tAe" target="_blank" rel="noopener noreferrer" className="items-center gap-1 hover:text-orange-500 hidden sm:flex">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Алматы қ. Асыл-Арман 20</span>
            </a>
            <div className="hidden sm:block"><UserLink /></div>
          </div>
        </div>
      </div>

      <div className={`${sticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''} bg-white transition-all duration-300`}>
        {/* Middle Bar */}
        <div className={`bg-white transition-all duration-300 ${sticky ? 'py-1 sm:py-2' : 'py-3 sm:py-5'}`}>
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center transition-all duration-300 ${sticky ? 'gap-2 sm:gap-4' : 'gap-3 sm:gap-8'}`}>
            {/* Logo */}
            <div className="flex flex-col items-start shrink-0">
              <Link to="/" className={`font-extrabold tracking-tight whitespace-nowrap transition-all duration-300 ${sticky ? 'text-base sm:text-xl' : 'text-xl sm:text-3xl'}`}>
                <span className="text-[#1a3673]">ИП Байғожинов</span><span className="text-[#ef7d00]">.KZ</span>
              </Link>
              <span className={`text-gray-500 tracking-wider transition-all duration-300 ${sticky ? 'text-[0px] opacity-0 h-0 overflow-hidden' : 'text-[10px] mt-0.5'}`}>ЛУЧШИЕ РЕШЕНИЯ ДЛЯ ВАШЕГО БИЗНЕСА</span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:block flex-1 min-w-0 max-w-2xl">
              <div className={`flex border border-gray-100 sm:border-2 rounded-sm overflow-hidden bg-white focus-within:border-gray-300 transition-all duration-300 shadow-sm ${sticky ? 'h-7 sm:h-8' : 'h-9 sm:h-11'}`}>
                <input 
                  type="text" 
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 px-3 py-1 bg-transparent outline-none placeholder-gray-400 transition-all duration-300 ${sticky ? 'text-xs' : 'text-sm'}`}
                />
                <div className="flex items-center bg-white">
                  <div className="h-4 w-px bg-gray-200 mx-1"></div>
                  <select className={`bg-transparent border-none outline-none cursor-pointer appearance-none transition-all duration-300 ${sticky ? 'text-xs pl-1 pr-0' : 'text-sm pl-3 pr-1'}`}>
                    <option>Каталог</option>
                  </select>
                  <div className="px-1 text-gray-400 pointer-events-none">
                     <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <button type="submit" className={`h-full flex items-center text-gray-400 hover:text-orange-500 transition-colors ml-1 ${sticky ? 'px-2' : 'px-4'}`}>
                    <Search className={`transition-all duration-300 ${sticky ? 'w-3.5 h-3.5' : 'w-5 h-5'}`} />
                  </button>
                </div>
              </div>
            </form>

            {/* Icons */}
            <div className={`flex items-center shrink-0 transition-all duration-300 ${sticky ? 'gap-2 sm:gap-3' : 'gap-2 sm:gap-6'}`}>
              <Link to="/search" className="lg:hidden text-gray-400 hover:text-[#ef7d00] transition-colors" aria-label="Поиск">
                <Search className="w-5 h-5" />
              </Link>
              <div className={`flex items-center transition-all duration-300 ${sticky ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-5'}`}>
                <Link to="/profile" className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                  <Heart className={`transition-all duration-300 ${sticky ? 'w-4 sm:w-5 h-4 sm:h-5' : 'w-5 sm:w-6 h-5 sm:h-6'}`} />
                </Link>
              </div>
              <div className={`bg-gray-200 transition-all duration-300 ${sticky ? 'h-5 sm:h-6 w-px' : 'h-6 sm:h-8 w-px'}`}></div>
              <Link to="/cart" className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <ShoppingCart className={`transition-all duration-300 ${sticky ? 'w-5 sm:w-6 h-5 sm:h-6' : 'w-6 sm:w-7 h-6 sm:h-7'}`} />
                {count > 0 && <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold min-w-[1rem] h-4 flex items-center justify-center rounded-full px-1">{count}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#ef7d00] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className={`flex flex-nowrap items-center font-bold uppercase tracking-wider overflow-visible whitespace-nowrap scrollbar-none gap-0.5 ${sticky ? 'text-[10px]' : 'text-[10px] sm:text-[13px]'}`}>
              {/* Каталог */}
              <li className="flex-none">
                <DropdownItem
                  label={
                    <Link to="/catalog" className={`flex items-center justify-center bg-[#d66f00] hover:bg-[#c26400] transition-colors duration-300 ${sticky ? 'gap-1 py-2 px-1.5 sm:px-3' : 'gap-1 py-2 px-1.5 sm:py-4 sm:px-6'}`}>
                      <Menu className={`shrink-0 transition-all duration-300 ${sticky ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      <span>КАТАЛОГ</span>
                    </Link>
                  }
                >
                  <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[600px] p-5">
                    <div className="space-y-6">
                      {catalogItems.map((section) => (
                        <div key={section.name} className="flex gap-4">
                          <img
                            alt={section.name}
                            className="w-20 h-20 object-contain mix-blend-multiply shrink-0 rounded-full"
                            src={section.img}
                          />
                          <div>
                            <Link to={`/catalog/${section.id}`} className="font-bold text-sm text-gray-900 mb-3 block hover:text-[#ef7d00] transition-colors uppercase">{section.name}</Link>
                            <ul className="space-y-1">
                              {section.items.map((item) => (
                                <li key={item}>
                                  <Link to={`/catalog/${item.replace(/ /g, '_')}`} className="block text-xs py-0.5 text-gray-600 hover:text-[#ef7d00] transition-colors">{item}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DropdownItem>
              </li>

              {/* Акции */}
              <li className="flex-none">
                <Link to="/aktsii" className={`flex items-center justify-center hover:bg-[#d66f00] transition-colors duration-300 ${sticky ? 'gap-1 py-2 px-1.5 sm:px-3' : 'gap-1 py-2 px-1.5 sm:py-4 sm:px-6'}`}>
                  <Zap className={`fill-white shrink-0 transition-all duration-300 ${sticky ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  <span>АКЦИИ</span>
                </Link>
              </li>

              {/* Как заказать */}
              <li className="flex-none">
                <DropdownItem
                  label={
                    <Link to="/kak-zakazat" className={`hover:bg-[#d66f00] transition-colors duration-300 text-center block ${sticky ? 'py-2 px-1.5 sm:px-3' : 'py-2 px-1.5 sm:py-4 sm:px-6'}`}>КАК ЗАКАЗАТЬ</Link>
                  }
                >
                  <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                    <ul className="space-y-3">
                      {howToOrderItems.map((item) => (
                        <li key={item.title}>
                          <Link to={`/kak-zakazat/${item.title.replace(/ /g, '-')}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DropdownItem>
              </li>

              {/* Клиентам */}
              <li className="flex-none">
                <DropdownItem
                  label={
                    <Link to="/klientam" className={`hover:bg-[#d66f00] transition-colors duration-300 text-center block ${sticky ? 'py-2 px-1.5 sm:px-3' : 'py-2 px-1.5 sm:py-4 sm:px-6'}`}>КЛИЕНТАМ</Link>
                  }
                >
                  <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                    <ul className="space-y-3">
                      {clientsItems.map((item) => (
                        <li key={item.title}>
                          <Link to={`/klientam/${item.title.replace(/ /g, '-')}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DropdownItem>
              </li>

              {/* О компании */}
              <li className="flex-none">
                <DropdownItem
                  label={
                    <Link to="/o-kompanii" className={`hover:bg-[#d66f00] transition-colors duration-300 text-center block ${sticky ? 'py-2 px-1.5 sm:px-3' : 'py-2 px-1.5 sm:py-4 sm:px-6'}`}>О КОМПАНИИ</Link>
                  }
                >
                  <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                    <ul className="space-y-3">
                      {aboutItems.map((item) => (
                        <li key={item.title}>
                          <Link to={`/o-kompanii/${item.title.replace(/ /g, '-')}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DropdownItem>
              </li>

              {/* Контакты */}
              <li className="flex-none">
                <Link to="/kontakty" className={`hover:bg-[#d66f00] transition-colors duration-300 text-center block ${sticky ? 'py-2 px-1.5 sm:px-3' : 'py-2 px-1.5 sm:py-4 sm:px-6'}`}>КОНТАКТЫ</Link>
              </li>
            </ul>

          </div>
        </div>
    </div>
    {sticky && <div className="h-[88px] sm:h-[100px]" />}
    </header>
  );
}




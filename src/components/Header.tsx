import React, { useState } from 'react';
import { MapPin, Phone, User, Search, BarChart2, Heart, ShoppingCart, Menu, Zap } from 'lucide-react';

const catalogItems = [
  {
    name: 'Механические торговые автоматы',
    img: 'https://images.unsplash.com/photo-1625650484478-113df4bfc370?auto=format&fit=crop&q=80&w=250',
    items: ['Торговые автоматы', 'Монетоприемники и пластины к ним', 'Распределители', 'Детали и части', 'Стойки, кронштейны, швеллеры', 'Наклейки'],
  },
  {
    name: 'Наполнители для торговых автоматов',
    img: 'https://images.unsplash.com/photo-1616406432452-07c0b3c1c4e1?auto=format&fit=crop&q=80&w=250',
    items: ['Жевательная резинка', 'Конфеты', 'Мячи-прыгуны', 'Игрушки', 'Бахилы в капсулах', 'Капсулы пустые'],
  },
];

const howToOrderItems = [
  { title: 'Оформление заказа', desc: 'Добавьте товары в корзину и оформите заказ' },
  { title: 'Способы оплаты', desc: 'Наличные, банковская карта, безналичный расчет' },
  { title: 'Доставка', desc: 'Бесплатная доставка по России от 10 000 ₽' },
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
  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className="bg-[#f8f8f8] border-b border-gray-200 py-1.5 text-[13px] text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-orange-500">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Алматы</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">8 (800) 200-31-91</span>
              </div>
              <a href="#" className="text-[#ef7d00] border-b border-dashed border-[#ef7d00] hover:border-solid">ЗАКАЗАТЬ ЗВОНОК</a>
            </div>
          </div>
          <div className="flex items-center gap-6 hidden sm:flex">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>г. Москва, ул. Свободы, д. 35, стр. 5</span>
            </div>
            <a href="#" className="flex items-center gap-1.5 hover:text-orange-500">
              <User className="w-4 h-4 text-gray-400" />
              <span>ВОЙТИ</span>
            </a>
          </div>
        </div>
      </div>

      {/* Middle Bar */}
      <div className="bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start shrink-0">
            <div className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#1a3673]">TORGAVTOMAT</span><span className="text-[#ef7d00]">.RU</span>
            </div>
            <span className="text-[10px] text-gray-500 tracking-wider mt-0.5">ЛУЧШИЕ РЕШЕНИЯ ДЛЯ ВАШЕГО БИЗНЕСА</span>
          </div>

          {/* Search */}
          <div className="w-full md:flex-1 max-w-2xl">
            <div className="flex border-2 border-gray-100 rounded-sm overflow-hidden bg-white focus-within:border-gray-300 transition-colors h-11 shadow-sm">
              <input 
                type="text" 
                placeholder="Поиск" 
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder-gray-400"
              />
              <div className="flex items-center bg-white">
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <select className="bg-transparent border-none outline-none text-sm text-gray-600 pl-3 pr-1 cursor-pointer appearance-none">
                  <option>Каталог</option>
                </select>
                <div className="px-1 text-gray-400 pointer-events-none">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <button className="px-4 h-full flex items-center text-gray-400 hover:text-orange-500 transition-colors ml-2">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-5">
              <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <BarChart2 className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
              <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <button className="relative text-gray-400 hover:text-[#ef7d00] transition-colors">
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-1.5 -right-2 bg-[#ef7d00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#ef7d00] text-white relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center text-[13px] font-bold uppercase tracking-wider overflow-visible">
            {/* Каталог */}
            <li className="flex-1 flex justify-center">
              <DropdownItem
                label={
                  <a href="#" className="flex items-center justify-center gap-2 py-4 px-6 bg-[#d66f00] hover:bg-[#c26400] transition-colors w-full">
                    <Menu className="w-5 h-5 shrink-0" />
                    <span>КАТАЛОГ</span>
                  </a>
                }
              >
                <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[600px] p-5">
                  <div className="space-y-6">
                    {catalogItems.map((section) => (
                      <div key={section.name}>
                        <a href="#" className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2 hover:text-[#ef7d00] transition-colors">
                          <img
                            alt={section.name}
                            className="w-24 h-24 object-contain mix-blend-multiply shrink-0"
                            src={section.img}
                          />
                          <span className="uppercase">{section.name}</span>
                        </a>
                        <ul className="space-y-1 ml-3.5">
                          {section.items.map((item) => (
                            <li key={item}>
                              <a href="#" className="block text-xs py-0.5 text-gray-600 hover:text-[#ef7d00] transition-colors">{item}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownItem>
            </li>

            {/* Акции */}
            <li className="flex-1 flex justify-center">
              <a href="#" className="flex items-center justify-center gap-1.5 py-4 px-6 hover:bg-[#d66f00] transition-colors w-full">
                <Zap className="w-4 h-4 fill-white shrink-0" />
                <span>АКЦИИ</span>
              </a>
            </li>

            {/* Как заказать */}
            <li className="flex-1 flex justify-center">
              <DropdownItem
                label={
                  <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center block">КАК ЗАКАЗАТЬ</a>
                }
              >
                <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                  <ul className="space-y-3">
                    {howToOrderItems.map((item) => (
                      <li key={item.title}>
                        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </DropdownItem>
            </li>

            {/* Клиентам */}
            <li className="flex-1 flex justify-center">
              <DropdownItem
                label={
                  <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center block">КЛИЕНТАМ</a>
                }
              >
                <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                  <ul className="space-y-3">
                    {clientsItems.map((item) => (
                      <li key={item.title}>
                        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </DropdownItem>
            </li>

            {/* О компании */}
            <li className="flex-1 flex justify-center">
              <DropdownItem
                label={
                  <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center block">О КОМПАНИИ</a>
                }
              >
                <div className="bg-white text-gray-700 shadow-xl border border-gray-100 rounded-b-lg min-w-[400px] p-5 -ml-20">
                  <ul className="space-y-3">
                    {aboutItems.map((item) => (
                      <li key={item.title}>
                        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </DropdownItem>
            </li>

            {/* Контакты */}
            <li className="flex-1 flex justify-center">
              <a href="#" className="py-4 px-6 hover:bg-[#d66f00] transition-colors w-full text-center">КОНТАКТЫ</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

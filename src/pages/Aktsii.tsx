import { useState } from 'react';
import { Link } from 'react-router-dom';

const promotions = [
  {
    id: 1,
    title: 'Распродажа!',
    date: '8 апреля 2025',
    discount: '20%',
    img: 'https://placehold.co/600x400/ef7d00/ffffff?text=Распродажа',
    active: true,
  },
  {
    id: 2,
    title: 'Скидка на монетоприемники',
    date: '15 марта 2025',
    discount: '15%',
    img: 'https://placehold.co/600x400/1a3673/ffffff?text=Скидка',
    active: true,
  },
  {
    id: 3,
    title: 'Бесплатная доставка',
    date: '1 февраля 2025',
    discount: '0%',
    img: 'https://placehold.co/600x400/22c55e/ffffff?text=Доставка',
    active: true,
  },
  {
    id: 4,
    title: 'Подарок при заказе',
    date: '10 января 2025',
    discount: 'Подарок',
    img: 'https://placehold.co/600x400/a855f7/ffffff?text=Подарок',
    active: false,
  },
];

export default function Aktsii() {
  const [filter, setFilter] = useState<'current' | 'old'>('current');

  const items = filter === 'current'
    ? promotions.filter(p => p.active)
    : promotions.filter(p => !p.active);

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#ef7d00] transition-colors">Главная</Link>
          <span className="mx-2">—</span>
          <span className="text-gray-900">Акции</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">АКЦИИ</h1>

        <div className="mb-6">
          <div className="flex items-center gap-4 border-b border-gray-300 pb-3">
            <button
              onClick={() => setFilter('current')}
              className={`text-sm font-medium uppercase tracking-wider pb-3 -mb-3 transition-colors ${
                filter === 'current'
                  ? 'text-[#ef7d00] border-b-2 border-[#ef7d00]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              Текущие акции
            </button>
            <button
              onClick={() => setFilter('old')}
              className={`text-sm font-medium uppercase tracking-wider pb-3 -mb-3 transition-colors ${
                filter === 'old'
                  ? 'text-[#ef7d00] border-b-2 border-[#ef7d00]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              Завершенные акции
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {filter === 'current' ? 'Нет текущих акций' : 'Нет завершенных акций'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative rounded-sm overflow-hidden shadow-sm group cursor-pointer"
              >
                <div
                  className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="inline-block bg-[#ef7d00] text-white text-xs font-bold px-3 py-1 rounded-sm">
                    {item.discount}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white/80 text-xs mb-1">
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 9 12">
                      <path d="M710,75l-7,7h3l-1,5,7-7h-3Z" transform="translate(-703 -75)" />
                    </svg>
                    {item.date}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

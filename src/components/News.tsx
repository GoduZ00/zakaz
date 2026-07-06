import React from 'react';

const newsItems = [
  {
    title: 'График работы на День России',
    date: '08 июня 2026',
    image: 'https://images.unsplash.com/photo-1530103862676-de3c9de59a9e?auto=format&fit=crop&q=80&w=400',
    badge: 'График работы'
  },
  {
    title: 'Акция "Покупай лучшее детям"',
    date: '28 мая 2026',
    image: 'https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?auto=format&fit=crop&q=80&w=400',
    badge: 'Покупай лучшее детям!'
  },
  {
    title: 'Вау-эффект для покупателей: обновили дисплеи!',
    date: '19 мая 2026',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
    badge: 'АХ, АРБУЗ!'
  },
  {
    title: 'Май — отдыхай и покупай!',
    date: '28 апреля 2026',
    image: 'https://images.unsplash.com/photo-1559441549-3382743a4115?auto=format&fit=crop&q=80&w=400',
    badge: 'Скидка 10%'
  }
];

export default function News() {
  return (
    <div className="bg-[#f9f9f9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-light text-gray-900">Новости</h2>
          <a href="#" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-[#ef7d00] transition-colors mb-1">
            ВСЕ НОВОСТИ
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                {item.badge && (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="bg-white/95 text-gray-900 font-bold px-4 py-2 rounded shadow-sm text-sm text-center transform -rotate-2 border border-gray-100">
                       {item.badge}
                     </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow border-t border-gray-50">
                <div className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider">{item.date}</div>
                <h3 className="text-[13px] font-medium text-gray-800 leading-relaxed group-hover:text-[#ef7d00] transition-colors line-clamp-3">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="text-[12px] font-bold text-[#ef7d00] uppercase tracking-wider border border-[#ef7d00] rounded-sm px-10 py-3.5 hover:bg-[#ef7d00] hover:text-white transition-colors">
            ЗАГРУЗИТЬ ЕЩЕ
          </button>
        </div>
      </div>
    </div>
  );
}

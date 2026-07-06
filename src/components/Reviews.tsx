import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Reviews() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-gray-200 pb-4 gap-4">
        <h2 className="text-3xl font-light text-gray-900">О нас пишут</h2>
        <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <a href="#" className="flex items-center gap-2 hover:text-[#ef7d00] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            ОСТАВИТЬ ОТЗЫВ
          </a>
          <a href="#" className="hover:text-[#ef7d00] transition-colors">ВСЕ ОТЗЫВЫ</a>
        </div>
      </div>

      <div className="relative px-4 sm:px-16">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-800 transition-colors hidden sm:block">
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="bg-white">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start max-w-4xl mx-auto">
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0 min-w-[200px]">
              <img 
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" 
                alt="Борис" 
                className="w-20 h-20 rounded-full object-cover border border-gray-100"
              />
              <div className="text-center md:text-left">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">24 МАРТА 2025</div>
                <div className="text-lg font-medium text-gray-900">Борис</div>
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              <div className="flex mb-6 gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#e5c05c] fill-[#e5c05c]" />
                ))}
              </div>
              <div className="relative">
                <span className="absolute -left-10 -top-4 text-7xl text-gray-200 font-serif leading-none select-none">"</span>
                <p className="text-gray-600 leading-relaxed relative z-10 text-[15px] max-w-2xl">
                  Хорошая компания! Профессиональный подход к Клиентам, широкий ассортимент товаров.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 hover:text-[#ef7d00] transition-colors hidden sm:block">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
